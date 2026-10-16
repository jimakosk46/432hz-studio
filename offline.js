'use strict';

(function exposeOfflineStore(root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  if (root) root.PwaOffline = api;
})(typeof globalThis === 'undefined' ? this : globalThis, function createOfflineApi() {
  const TRACK_CACHE_NAME = 'hz432-tracks-v1';

  function createTrackStore({
    cacheStorage = globalThis.caches,
    fetchImpl = globalThis.fetch.bind(globalThis),
    storageManager = globalThis.navigator?.storage,
    urlFor = frequency => `./tracks/${encodeURIComponent(frequency)}.mp3`,
  } = {}) {
    if (!cacheStorage || typeof cacheStorage.open !== 'function') {
      throw new Error('Cache storage is not available in this browser.');
    }

    async function has(frequency) {
      const cache = await cacheStorage.open(TRACK_CACHE_NAME);
      return Boolean(await cache.match(urlFor(frequency)));
    }

    async function download(frequency, { signal, onProgress = () => {} } = {}) {
      const url = urlFor(frequency);
      const response = await fetchImpl(url, { signal, cache: 'no-store' });
      if (!response.ok || response.type === 'opaque') {
        throw new Error(`Track download failed (${response.status || 'unavailable'}).`);
      }

      const cache = await cacheStorage.open(TRACK_CACHE_NAME);
      const totalHeader = Number(response.headers.get('Content-Length'));
      const total = Number.isFinite(totalHeader) && totalHeader > 0 ? totalHeader : null;
      let loaded = 0;
      if (!response.body) {
        await cache.put(url, response.clone());
        onProgress({ loaded: total || 0, total });
        return;
      }

      const reader = response.body.getReader();
      const progressBody = new ReadableStream({
        async pull(controller) {
          try {
            const { done, value } = await reader.read();
            if (done) {
              controller.close();
              return;
            }
            loaded += value.byteLength;
            onProgress({ loaded, total });
            controller.enqueue(value);
          } catch (error) {
            controller.error(error);
          }
        },
        cancel(reason) {
          return reader.cancel(reason);
        },
      });
      await cache.put(url, new Response(progressBody, {
        status: response.status,
        statusText: response.statusText,
        headers: response.headers,
      }));
    }

    async function remove(frequency) {
      const cache = await cacheStorage.open(TRACK_CACHE_NAME);
      return cache.delete(urlFor(frequency));
    }

    async function estimate() {
      if (!storageManager || typeof storageManager.estimate !== 'function') return null;
      const { usage, quota } = await storageManager.estimate();
      return {
        usage: Number.isFinite(usage) ? usage : null,
        quota: Number.isFinite(quota) ? quota : null,
      };
    }

    async function requestPersistence() {
      if (!storageManager || typeof storageManager.persist !== 'function') return null;
      return storageManager.persist();
    }

    async function isPersistent() {
      if (!storageManager || typeof storageManager.persisted !== 'function') return null;
      return storageManager.persisted();
    }

    return { has, download, remove, estimate, requestPersistence, isPersistent };
  }

  function mountOfflineControls({ root = globalThis.document, tones, translate, getLanguage = () => 'de' }) {
    const toneList = root.getElementById('tonelist');
    if (!toneList || !Array.isArray(tones)) return null;

    const panel = root.createElement('details');
    panel.className = 'offline-panel';
    panel.id = 'offlinePanel';
    const summary = root.createElement('summary');
    const summaryCopy = root.createElement('span');
    summaryCopy.className = 'offline-summary-copy';
    const title = root.createElement('b');
    title.textContent = translate('offline_title');
    const description = root.createElement('small');
    description.textContent = translate('offline_summary');
    const chevron = root.createElement('span');
    chevron.className = 'offline-chevron';
    chevron.setAttribute('aria-hidden', 'true');
    chevron.textContent = '⌄';
    summaryCopy.append(title, description);
    summary.append(summaryCopy, chevron);
    panel.appendChild(summary);
    const content = root.createElement('div');
    content.className = 'offline-content';
    const list = root.createElement('div');
    list.className = 'offline-tracks';
    list.id = 'offlineTracks';
    const storage = root.createElement('p');
    storage.id = 'offlineStorage';
    storage.className = 'offline-storage';
    storage.setAttribute('role', 'status');
    const persistButton = root.createElement('button');
    persistButton.id = 'offlinePersist';
    persistButton.className = 'chip';
    persistButton.type = 'button';
    persistButton.textContent = translate('offline_persist');
    const supportNote = root.createElement('p');
    supportNote.id = 'offlineSupportNote';
    supportNote.className = 'offline-support-note';
    content.append(list, storage, persistButton, supportNote);
    panel.appendChild(content);
    toneList.after(panel);

    let store;
    try {
      store = createTrackStore();
    } catch {
      panel.hidden = true;
      return null;
    }

    const activeDownloads = new Map();
    // Result of the last explicit persistence request (null = not asked yet). It is kept so
    // that a later storage refresh does not overwrite the answer the user just got.
    let persistResult = null;
    const storageText = storage;
    const formatter = new Intl.NumberFormat(root.documentElement.lang || 'de', { maximumFractionDigits: 1 });
    const formatBytes = value => {
      if (!Number.isFinite(value)) return '—';
      const units = ['B', 'KB', 'MB', 'GB', 'TB'];
      let size = value, unit = 0;
      while (size >= 1024 && unit < units.length - 1) { size /= 1024; unit += 1; }
      return `${formatter.format(size)} ${units[unit]}`;
    };

    function makeRow(tone) {
      const row = root.createElement('div');
      row.className = 'offline-track';
      row.id = `offline-track-${tone.f}`;
      row.dataset.frequency = tone.f;
      const name = root.createElement('span');
      name.className = 'offline-track-name';
      const state = root.createElement('span');
      state.className = 'offline-track-state';
      state.dataset.offlineState = '';
      state.setAttribute('role', 'status');
      const progress = root.createElement('progress');
      progress.className = 'offline-progress';
      progress.max = 100;
      progress.hidden = true;
      const button = root.createElement('button');
      button.className = 'chip offline-track-action';
      button.type = 'button';
      button.onclick = async () => {
        const running = activeDownloads.get(tone.f);
        if (running) {
          running.abort();
          return;
        }
        if (await store.has(tone.f)) {
          await store.remove(tone.f);
          await refreshRow(row, tone);
          await refreshStorage();
          return;
        }
        const controller = new AbortController();
        activeDownloads.set(tone.f, controller);
        button.textContent = translate('offline_cancel');
        button.setAttribute('aria-label', `${translate('offline_cancel')} ${tone.f} Hz`);
        state.textContent = translate('offline_downloading');
        progress.hidden = false;
        progress.removeAttribute('value');
        let outcomeText = '';
        try {
          await store.download(tone.f, {
            signal: controller.signal,
            onProgress({ loaded, total }) {
              if (total) progress.value = Math.min(100, (loaded / total) * 100);
              state.textContent = total
                ? `${translate('offline_downloading')} · ${Math.floor(loaded / total * 100)}%`
                : `${translate('offline_downloading')} · ${formatBytes(loaded)}`;
            },
          });
        } catch {
          // The abort can surface as a different error (e.g. from cache.put in Edge),
          // so the signal, not the error name, decides whether the user cancelled.
          outcomeText = translate(controller.signal.aborted ? 'offline_cancelled' : 'offline_failed');
        } finally {
          activeDownloads.delete(tone.f);
          await refreshRow(row, tone);
          if (outcomeText) state.textContent = outcomeText;
          await refreshStorage();
        }
      };
      row.append(name, state, progress, button);
      row._offlineName = name;
      row._offlineState = state;
      row._offlineButton = button;
      row._offlineProgress = progress;
      list.appendChild(row);
      return row;
    }

    const rows = new Map(tones.map(tone => [tone.f, makeRow(tone)]));

    async function refreshRow(row, tone) {
      const available = await store.has(tone.f);
      row._offlineName.textContent = `${tone.f} Hz · ${tone.name[getLanguage()] || tone.name.de}`;
      row._offlineState.dataset.offlineState = available ? 'available' : 'missing';
      row._offlineState.textContent = available ? translate('offline_available') : '';
      row._offlineButton.textContent = translate(available ? 'offline_remove' : 'offline_download');
      row._offlineButton.setAttribute('aria-label', `${translate(available ? 'offline_remove' : 'offline_download')} ${tone.f} Hz`);
      row._offlineProgress.hidden = true;
    }

    async function refreshStorage() {
      const estimate = await store.estimate().catch(() => null);
      const persistent = await store.isPersistent().catch(() => null);
      if (!estimate || estimate.usage === null || estimate.quota === null) {
        storageText.textContent = translate('offline_storage_unknown');
      } else {
        storageText.textContent = translate('offline_storage_estimate')
          .replace('{used}', formatBytes(estimate.usage))
          .replace('{quota}', formatBytes(estimate.quota));
      }
      if (persistent === true) {
        persistButton.hidden = true;
        supportNote.textContent = translate(persistResult === true ? 'offline_storage_granted' : 'offline_storage_protected');
      } else if (persistResult === false) {
        persistButton.hidden = typeof globalThis.navigator?.storage?.persist !== 'function';
        supportNote.textContent = `${translate('offline_storage_denied')} ${translate('offline_storage_note')}`;
      } else {
        persistButton.hidden = typeof globalThis.navigator?.storage?.persist !== 'function';
        supportNote.textContent = translate('offline_storage_note');
      }
    }

    async function refresh() {
      await Promise.all(tones.map(tone => refreshRow(rows.get(tone.f), tone)));
      await refreshStorage();
    }

    persistButton.onclick = async () => {
      persistResult = (await store.requestPersistence().catch(() => false)) === true;
      await refreshStorage();
    };
    root.addEventListener('432-language-change', () => {
      title.textContent = translate('offline_title');
      description.textContent = translate('offline_summary');
      persistButton.textContent = translate('offline_persist');
      for (const tone of tones) refreshRow(rows.get(tone.f), tone);
      refreshStorage();
    });
    refresh();
    return { store, refresh };
  }

  return { TRACK_CACHE_NAME, createTrackStore, mountOfflineControls };
});
