'use strict';
// Recent settings + JSON export/import of the user's local settings.
//
// Everything that comes from a file (or from localStorage, which another tab or an old
// version may have written) passes through ONE strict validator: unknown keys are
// rejected, every number must be finite and inside the same range the UI enforces,
// every string must come from a fixed list. JSON.parse only — never eval.
//
// The ranges below mirror static/app.js (CHL_FREQ_RANGE, CRY_FREQ_RANGE, PLATE/DROP_SIZE_RANGE,
// DROP_PITCH_MAX, INSTRUMENTS, the tuner A4 input) and static/tuning_lab.js (custom profiles).
// tests/test_settings_transfer.js fails if they drift apart.
(function (root) {
  const FORMAT = '432hz-studio-settings';
  const VERSION = 1;
  const MAX_BYTES = 100 * 1024;
  const FAV_MAX = 12, RECENT_MAX = 8, PROFILE_MAX = 50, PROFILE_STRINGS_MAX = 24;
  const LANGS = ['el', 'de', 'en'];
  const WAVES = ['sine', 'triangle', 'square', 'sawtooth'];
  const INSTRUMENTS = ['trichordo', 'tetrachordo', 'baglamas', 'tzouras', 'guitar', 'violin', 'ukulele'];
  const KEYS = { lang: 'lang432', favs: 'fav432', recents: 'recent432', profiles: 'hz-tuning-profiles' };

  // Per-tab schema: [kind, ...limits]. A key that is not listed is an error.
  const NUM = (lo, hi) => ['num', lo, hi];
  const CLAMP = (lo, hi) => ['clamp', lo, hi];
  const ONE_OF = list => ['enum', list];
  const TAB_SCHEMA = {
    tone: { f: NUM(1, 20000), w: ONE_OF(WAVES) },
    heal: { f: NUM(1, 2000) },
    chladni: { f: NUM(200, 1000), p: NUM(85, 120), sh: ONE_OF(['plate', 'drop']), yw: NUM(0, 360), pt: CLAMP(0, 45), ds: NUM(0.5, 15), dv: NUM(0, 1) },
    crystal: { f: NUM(20, 2000) },
    tuner: { inst: ONE_OF(INSTRUMENTS), a: NUM(390, 460) },
  };
  const REQUIRED = { tone: ['f'], heal: ['f'], chladni: ['f', 'p', 'sh'], crystal: ['f'], tuner: ['inst', 'a'] };
  const FAV_TABS = ['tone', 'chladni', 'crystal'];

  function fail(message) { throw new TypeError(message); }
  function isRecord(value) { return value !== null && typeof value === 'object' && !Array.isArray(value); }
  function onlyKeys(object, allowed, where) {
    for (const key of Object.keys(object)) if (!allowed.includes(key)) fail(`${where}: unknown key "${key}"`);
  }

  function cleanTabState(tab, state) {
    const schema = TAB_SCHEMA[tab];
    if (!schema) fail(`unknown tab "${tab}"`);
    if (!isRecord(state)) fail(`${tab}: state must be an object`);
    onlyKeys(state, Object.keys(schema), tab);
    const out = {};
    for (const [key, rule] of Object.entries(schema)) {
      if (!(key in state)) continue;
      const value = state[key];
      if (rule[0] === 'num' || rule[0] === 'clamp') {
        if (typeof value !== 'number' || !Number.isFinite(value)) fail(`${tab}.${key}: out of range`);
        if (rule[0] === 'num' && (value < rule[1] || value > rule[2])) fail(`${tab}.${key}: out of range`);
        out[key] = rule[0] === 'clamp' ? Math.max(rule[1], Math.min(rule[2], value)) : value;
      } else if (!rule[1].includes(value)) fail(`${tab}.${key}: not allowed`);
      else out[key] = value;
    }
    for (const key of REQUIRED[tab]) if (!(key in out)) fail(`${tab}: missing "${key}"`);
    return out;
  }

  function cleanFavs(value) {
    if (!isRecord(value)) fail('favourites must be an object');
    onlyKeys(value, FAV_TABS, 'favourites');
    const out = {};
    for (const [tab, list] of Object.entries(value)) {
      if (!Array.isArray(list) || list.length > FAV_MAX) fail(`favourites.${tab}: too many or not a list`);
      out[tab] = list.map(state => cleanTabState(tab, state));
    }
    return out;
  }

  function cleanRecent(entry) {
    if (!isRecord(entry)) fail('recent entry must be an object');
    onlyKeys(entry, ['tab', 'state'], 'recent entry');
    return { tab: entry.tab, state: cleanTabState(entry.tab, entry.state) };
  }

  function cleanRecents(value) {
    if (!Array.isArray(value) || value.length > RECENT_MAX) fail('recent settings: too many or not a list');
    return value.map(cleanRecent);
  }

  function cleanProfiles(value) {
    if (!Array.isArray(value) || value.length > PROFILE_MAX) fail('tuning profiles: too many or not a list');
    const seen = new Set();
    return value.map(profile => {
      if (!isRecord(profile)) fail('tuning profile must be an object');
      onlyKeys(profile, ['key', 'name', 'strings'], 'tuning profile');
      const { key, name, strings } = profile;
      if (typeof key !== 'string' || !/^custom-[A-Za-z0-9-]{1,40}$/.test(key) || seen.has(key)) fail('tuning profile: bad key');
      seen.add(key);
      if (typeof name !== 'string' || !name.trim() || name.length > 32) fail('tuning profile: bad name');
      if (!Array.isArray(strings) || strings.length < 1 || strings.length > PROFILE_STRINGS_MAX
          || !strings.every(hz => typeof hz === 'number' && Number.isFinite(hz) && hz >= 20 && hz <= 2000)) {
        fail('tuning profile: bad strings');
      }
      return { key, name: name.trim(), strings: strings.slice() };
    });
  }

  const CLEANERS = {
    [KEYS.lang]: value => (LANGS.includes(value) ? value : fail('language: not allowed')),
    [KEYS.favs]: cleanFavs,
    [KEYS.recents]: cleanRecents,
    [KEYS.profiles]: cleanProfiles,
  };

  function cleanData(data) {
    if (!isRecord(data)) fail('data must be an object');
    onlyKeys(data, Object.keys(CLEANERS), 'data');
    const out = {};
    for (const [key, value] of Object.entries(data)) out[key] = CLEANERS[key](value);
    return out;
  }

  function byteLength(text) { return new TextEncoder().encode(text).length; }

  // A stored value that no longer validates is left out of the export rather than
  // blocking it: the user can still save everything that is sound.
  function exportSettings(storage) {
    const data = {};
    for (const key of Object.values(KEYS)) {
      let raw = null;
      try { raw = storage.getItem(key); } catch (e) { raw = null; }
      if (raw === null) continue;
      try { data[key] = CLEANERS[key](key === KEYS.lang ? raw : JSON.parse(raw)); } catch (e) { /* skipped */ }
    }
    const text = JSON.stringify({ format: FORMAT, version: VERSION, data }, null, 2);
    if (byteLength(text) > MAX_BYTES) throw new RangeError('settings export is larger than 100 KB');
    return text;
  }

  // Validates the whole file first, writes only afterwards, and restores the previous
  // values if the browser refuses a write halfway (quota, private mode).
  function parseSettings(text) {
    if (typeof text !== 'string') fail('settings file must be text');
    if (byteLength(text) > MAX_BYTES) throw new RangeError('settings file is larger than 100 KB');
    let doc;
    try { doc = JSON.parse(text); } catch (e) { fail('settings file is not JSON'); }
    if (!isRecord(doc)) fail('settings file must be an object');
    onlyKeys(doc, ['format', 'version', 'data'], 'settings file');
    if (doc.format !== FORMAT) fail('not a 432Hz Studio settings file');
    if (doc.version !== VERSION) fail('unsupported settings version');
    return cleanData(doc.data);
  }

  function importSettings(storage, text) {
    const data = parseSettings(text);
    const previous = Object.keys(data).map(key => [key, storage.getItem(key)]);
    try {
      for (const [key, value] of Object.entries(data)) {
        storage.setItem(key, key === KEYS.lang ? value : JSON.stringify(value));
      }
    } catch (error) {
      for (const [key, value] of previous) {
        try { if (value === null) storage.removeItem(key); else storage.setItem(key, value); } catch (e) { /* best effort */ }
      }
      throw error;
    }
    return Object.keys(data);
  }

  // ----- recent settings -----
  function readRecents(storage) {
    let list;
    try { list = JSON.parse(storage.getItem(KEYS.recents) || '[]'); } catch (e) { return []; }
    if (!Array.isArray(list)) return [];
    const out = [];
    for (const entry of list.slice(0, RECENT_MAX)) {
      try { out.push(cleanRecent(entry)); } catch (e) { /* drop the bad entry, keep the rest */ }
    }
    return out;
  }

  // Newest first, no duplicates, at most RECENT_MAX. Returns the new list, or null when
  // the state is not something worth remembering (unknown tab, invalid values).
  function rememberRecent(storage, tab, state) {
    let entry;
    try { entry = cleanRecent({ tab, state }); } catch (e) { return null; }
    const key = JSON.stringify(entry);
    const list = [entry].concat(readRecents(storage).filter(item => JSON.stringify(item) !== key)).slice(0, RECENT_MAX);
    try { storage.setItem(KEYS.recents, JSON.stringify(list)); } catch (e) { /* private mode: memory only */ }
    return list;
  }

  function clearRecents(storage) {
    try { storage.removeItem(KEYS.recents); } catch (e) { /* private mode */ }
  }

  const api = {
    FORMAT, VERSION, MAX_BYTES, RECENT_MAX, KEYS, TAB_SCHEMA, INSTRUMENTS, WAVES,
    exportSettings, parseSettings, importSettings, readRecents, rememberRecent, clearRecents,
  };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.SettingsTransfer = api;
})(typeof window !== 'undefined' ? window : globalThis);
