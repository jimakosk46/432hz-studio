'use strict';

(function (root) {
  const COPY = {
    el: {
      tab: 'Εργαστήριο κουρδίσματος', lab: 'Ανάλυση ήχου', practice: 'Εξάσκηση',
      intro: 'Ανάλυσε ένα τοπικό δείγμα και άκου τη διαφορά με ίδια αφετηρία.', audioSource: 'Τοπικό δείγμα', analysis: 'Αποτέλεσμα ανάλυσης',
      pick: 'Επιλογή αρχείου ήχου', record: 'Ηχογράφηση 3 δευτ.', stop: 'Διακοπή μικροφώνου',
      profile: 'Προφίλ αναφοράς Λα', target: 'Νέα αναφορά Λα', source: 'Αναφορά αρχικού ήχου',
      accept: 'Αποδοχή προφίλ', accepted: 'Το προφίλ εφαρμόστηκε', analyze: 'Ανάλυση αρχείου',
      detected: 'Ανιχνευμένη νότα', confidence: 'Βεβαιότητα', stability: 'Σταθερότητα',
      noPitch: 'Δεν βρέθηκε καθαρή νότα. Δοκίμασε δυνατότερο ή πιο καθαρό δείγμα.',
      listening: 'Ακούω δείγμα…', ready: 'Το δείγμα αναλύθηκε τοπικά.',
      ab: 'Σύγκριση ακρόασης', original: 'A · Αρχικό', shifted: 'B · Μετατοπισμένο',
      pause: 'Παύση', fileError: 'Δεν ήταν δυνατή η ανάγνωση αυτού του αρχείου ήχου.',
      micError: 'Δεν ήταν δυνατή η πρόσβαση στο μικρόφωνο.',
      practiceIntro: 'Κούρδισε κάθε χορδή. Η ανίχνευση λειτουργεί μόνο όσο η εξάσκηση είναι ενεργή.',
      instrument: 'Όργανο', start: 'Έναρξη εξάσκησης', finish: 'Τέλος συνεδρίας',
      next: 'Επόμενη χορδή', auto: 'Αυτόματη μετάβαση όταν σταθεροποιηθεί',
      goal: 'Στόχος', waiting: 'Πάτησε έναρξη για να ενεργοποιήσεις το μικρόφωνο.',
      stable: 'Σταθερή νότα', tuning: 'Κούρδισε τη χορδή', summary: 'Σύνοψη συνεδρίας',
      elapsed: 'Διάρκεια', completed: 'Σταθεροποιημένες χορδές', addInstrument: 'Δημιουργία οργάνου',
      customName: 'Όνομα οργάνου', strings: 'Συχνότητες χορδών (Hz, χωρισμένες με κόμμα)',
      saveInstrument: 'Αποθήκευση οργάνου', customSaved: 'Το προφίλ οργάνου αποθηκεύτηκε.',
      remove: 'Διαγραφή επιλεγμένου προφίλ', permission: 'Το μικρόφωνο ζητείται μόνο αφού πατήσεις το κουμπί.',
      cents: 'σεντ', close: 'Κοντά', uncertain: 'Ασταθές', stableShort: 'Σταθερό',
    },
    de: {
      tab: 'Stimm-Labor', lab: 'Audioanalyse', practice: 'Übung',
      intro: 'Analysiere eine lokale Aufnahme und vergleiche beide Versionen ab derselben Position.', audioSource: 'Lokale Aufnahme', analysis: 'Analyseergebnis',
      pick: 'Audiodatei auswählen', record: '3 Sekunden aufnehmen', stop: 'Mikrofon stoppen',
      profile: 'Referenzprofil A', target: 'Neue Referenz A', source: 'Referenz der Aufnahme',
      accept: 'Profil übernehmen', accepted: 'Profil übernommen', analyze: 'Datei analysieren',
      detected: 'Erkannter Ton', confidence: 'Konfidenz', stability: 'Stabilität',
      noPitch: 'Kein klarer Ton erkannt. Versuche eine lautere oder sauberere Aufnahme.',
      listening: 'Aufnahme läuft…', ready: 'Aufnahme lokal analysiert.',
      ab: 'Hörvergleich', original: 'A · Original', shifted: 'B · Transponiert',
      pause: 'Pause', fileError: 'Diese Audiodatei konnte nicht gelesen werden.',
      micError: 'Kein Zugriff auf das Mikrofon möglich.',
      practiceIntro: 'Stimme jede Saite. Die Erkennung läuft nur während einer aktiven Übung.',
      instrument: 'Instrument', start: 'Übung starten', finish: 'Sitzung beenden',
      next: 'Nächste Saite', auto: 'Bei stabilem Ton automatisch wechseln',
      goal: 'Ziel', waiting: 'Zum Aktivieren des Mikrofons auf Start tippen.',
      stable: 'Ton stabil', tuning: 'Saite stimmen', summary: 'Sitzungsübersicht',
      elapsed: 'Dauer', completed: 'Stabile Saiten', addInstrument: 'Instrument erstellen',
      customName: 'Instrumentname', strings: 'Saitenfrequenzen (Hz, durch Kommas getrennt)',
      saveInstrument: 'Instrument speichern', customSaved: 'Instrumentprofil gespeichert.',
      remove: 'Ausgewähltes Profil löschen', permission: 'Das Mikrofon wird erst nach einem Tastendruck angefragt.',
      cents: 'Cent', close: 'Nah', uncertain: 'Instabil', stableShort: 'Stabil',
    },
    en: {
      tab: 'Tuning Lab', lab: 'Audio analysis', practice: 'Practice',
      intro: 'Analyze a local sample and compare both versions from the same starting point.', audioSource: 'Local sample', analysis: 'Analysis result',
      pick: 'Choose audio file', record: 'Record 3 seconds', stop: 'Stop microphone',
      profile: 'A reference profile', target: 'New A reference', source: 'Source reference',
      accept: 'Accept profile', accepted: 'Profile applied', analyze: 'Analyze file',
      detected: 'Detected note', confidence: 'Confidence', stability: 'Stability',
      noPitch: 'No clear note found. Try a louder or cleaner sample.',
      listening: 'Recording sample…', ready: 'Sample analyzed locally.',
      ab: 'Listening comparison', original: 'A · Original', shifted: 'B · Transposed',
      pause: 'Pause', fileError: 'This audio file could not be read.',
      micError: 'Microphone access failed.',
      practiceIntro: 'Tune each string. Detection runs only while practice is active.',
      instrument: 'Instrument', start: 'Start practice', finish: 'End session',
      next: 'Next string', auto: 'Advance automatically when stable',
      goal: 'Target', waiting: 'Press start to enable the microphone.',
      stable: 'Stable note', tuning: 'Tune the string', summary: 'Session summary',
      elapsed: 'Duration', completed: 'Stable strings', addInstrument: 'Create instrument',
      customName: 'Instrument name', strings: 'String frequencies (Hz, comma separated)',
      saveInstrument: 'Save instrument', customSaved: 'Instrument profile saved.',
      remove: 'Delete selected profile', permission: 'Microphone permission is requested only after a tap.',
      cents: 'cents', close: 'Close', uncertain: 'Unstable', stableShort: 'Stable',
    },
  };

  function createPitchEstimator(detector) {
    if (typeof detector !== 'function') throw new TypeError('A pitch detector is required');
    return (samples, sampleRate) => {
      // The tuner detector is quadratic in the sample window. Pair averaging and
      // halving the rate preserve the window duration while cutting work to ~25%.
      let input = samples, rate = sampleRate;
      if (samples.length >= 4 && samples.length % 2 === 0 && sampleRate >= 32000) {
        input = new Float32Array(samples.length / 2);
        for (let i = 0; i < input.length; i++) input[i] = (samples[2 * i] + samples[2 * i + 1]) * 0.5;
        rate = sampleRate / 2;
      }
      const result = detector(input, rate);
      const hz = Number(result && result.hz) || 0;
      const clarity = Math.max(0, Math.min(1, Number(result && result.clarity) || 0));
      return { hz, confidence: hz > 0 ? clarity : 0 };
    };
  }

  function getAnalysisWindow(samples, size = 2048) {
    return samples.length > size ? samples.subarray(samples.length - size) : samples;
  }

  function summarizePitch(results) {
    const valid = results.filter(result => result.hz > 0 && result.confidence > 0);
    if (!valid.length) return { hz: 0, confidence: 0, stability: Infinity };
    const median = values => {
      const sorted = values.slice().sort((a, b) => a - b);
      return sorted[Math.floor(sorted.length / 2)];
    };
    const hz = median(valid.map(result => result.hz));
    const spread = valid.map(result => Math.abs(1200 * Math.log2(result.hz / hz)));
    return { hz, confidence: median(valid.map(result => result.confidence)), stability: spread.length > 1 ? median(spread) : Infinity };
  }

  // Windows spread evenly over the WHOLE file: reading only the start reported
  // "no clear note" for any file with a lead-in silence. Silent windows return hz 0
  // and are ignored by summarizePitch.
  function analyzeSamples(channel, sampleRate, estimate, size = 4096, maxWindows = 48) {
    const width = Math.min(size, channel.length);
    if (!width) return summarizePitch([]);
    const span = channel.length - width;
    const count = Math.max(1, Math.min(maxWindows, Math.floor(span / (width / 2)) + 1));
    const results = [];
    for (let k = 0; k < count; k++) {
      const offset = count === 1 ? 0 : Math.round(k * span / (count - 1));
      results.push(estimate(channel.subarray(offset, offset + width), sampleRate));
    }
    return summarizePitch(results);
  }

  // One practice target per COURSE. An octave-pair course (e.g. trichordo D3+D4) sounds
  // both strings at once, so either member is accepted, exactly like the tuner's matchString.
  function courseTargets(tuning, a4, noteFreq) {
    return tuning.courses.map(course => course.map(midi => noteFreq(midi, a4)));
  }

  function nearestInCourse(hz, course) {
    let best = null;
    for (const target of course) {
      const cents = 1200 * Math.log2(hz / target);
      if (!best || Math.abs(cents) < Math.abs(best.cents)) best = { target, cents };
    }
    return best;
  }

  function sanitizeProfiles(list) {
    if (!Array.isArray(list)) return [];
    return list.filter(profile => profile && typeof profile.key === 'string' && profile.key.startsWith('custom-')
      && typeof profile.name === 'string' && profile.name.trim() && Array.isArray(profile.strings) && profile.strings.length
      && profile.strings.every(hz => typeof hz === 'number' && Number.isFinite(hz) && hz >= 20 && hz <= 2000))
      .map(profile => ({ key: profile.key, name: profile.name.slice(0, 32), strings: profile.strings.slice() }));
  }

  const api = {
    createPitchEstimator,
    getAnalysisWindow,
    summarizePitch,
    analyzeSamples,
    courseTargets,
    nearestInCourse,
    sanitizeProfiles,
    mount(config) {
      if (this.mounted) return;
      this.mounted = true;
      this.config = config;
      this.estimate = createPitchEstimator(config.detectPitch);
      this.lang = config.language || 'el';
      this.targetA = 432;
      this.draftA = 432;
      this.sourceA = 440;
      this.draftSourceA = 440;
      this.buffer = null;
      this.analysis = null;
      this.context = null;
      this.source = null;
      this.sourceStarted = 0;
      this.sourceOffset = 0;
      this.playing = false;
      this.stream = null;
      this.recordingSample = false;
      this.raf = 0;
      this.lastFrame = 0;
      this.history = [];
      this.practice = null;
      this.custom = this.readCustom();
      this.mountMarkup();
      this.bind();
      this.renderInstruments();
      this.renderLab();
      document.addEventListener('visibilitychange', () => {
        if (!document.hidden) return;
        if (this.practice && this.practice.running) this.finishPractice();
        else this.stopRecording();
        this.stopAB();
      });
    },
    text(key) { return (COPY[this.lang] || COPY.el)[key] || key; },
    cents(hz, target) { return 1200 * Math.log(hz / target) / Math.LN2; },
    readCustom() {
      try { return sanitizeProfiles(JSON.parse(localStorage.getItem('hz-tuning-profiles') || '[]')); }
      catch (e) { return []; }
    },
    saveCustom() {
      try { localStorage.setItem('hz-tuning-profiles', JSON.stringify(this.custom)); return true; }
      catch (e) { return false; }   // private mode / storage blocked: the profile lives for this session only
    },
    mountMarkup() {
      const tab = document.createElement('button');
      tab.className = 'tab'; tab.dataset.tab = 'tuning';
      const tabs = document.querySelector('.tabs');
      tabs.appendChild(tab); this.tab = tab;
      const panel = document.createElement('section');
      panel.className = 'card hidden tuning-lab'; panel.id = 'panel-tuning';
      panel.innerHTML = `
        <div class="tl-head"><div><p class="tl-kicker">432Hz STUDIO / 02</p><h2 class="tl-title"></h2><p class="tl-intro"></p></div>
          <span class="tl-local">● <span data-copy="permission"></span></span></div>
        <div class="tl-switch" role="tablist"><button type="button" class="tl-switch-btn is-active" data-view="lab" role="tab"></button><button type="button" class="tl-switch-btn" data-view="practice" role="tab"></button></div>
        <div data-screen="lab">
          <div class="tl-grid">
            <article class="tl-card tl-source"><div class="tl-card-head"><span class="tl-step">01</span><h3 data-copy="audioSource"></h3></div>
              <label class="tl-file"><input type="file" accept="audio/*" data-el="file"><span class="tl-file-icon">↥</span><span data-copy="pick"></span></label>
              <button type="button" class="tl-btn tl-secondary" data-action="record"></button><p class="tl-status" data-el="labStatus" aria-live="polite"></p>
            </article>
            <article class="tl-card tl-profile"><div class="tl-card-head"><span class="tl-step">02</span><h3 data-copy="profile"></h3></div>
              <div class="tl-profile-row"><button type="button" class="tl-preset is-selected" data-a="432">A = 432</button><button type="button" class="tl-preset" data-a="440">A = 440</button><label><span data-copy="target"></span><input data-el="targetA" type="number" min="390" max="460" step="0.1" value="432"></label></div>
              <label class="tl-field"><span data-copy="source"></span><input data-el="sourceA" type="number" min="390" max="460" step="0.1" value="440"></label>
              <button type="button" class="tl-btn" data-action="accept"></button><p class="tl-status" data-el="profileStatus" aria-live="polite"></p>
            </article>
          </div>
          <article class="tl-card tl-result"><div class="tl-card-head"><span class="tl-step">03</span><h3 data-copy="analysis"></h3></div>
            <div class="tl-result-grid"><div class="tl-note"><span data-copy="detected"></span><strong data-el="note">—</strong><small data-el="frequency">—</small></div>
              <div class="tl-metric"><span data-copy="confidence"></span><strong data-el="confidence">—</strong></div><div class="tl-metric"><span data-copy="stability"></span><strong data-el="stability">—</strong></div></div>
            <div class="tl-ab"><div class="tl-ab-title"><span class="tl-step">A/B</span><h3 data-copy="ab"></h3></div><div class="tl-ab-controls"><button class="tl-btn tl-secondary" type="button" data-action="playA" disabled></button><button class="tl-btn" type="button" data-action="playB" disabled></button><button class="tl-btn tl-stop" type="button" data-action="stop" disabled></button></div><div class="tl-progress"><i data-el="progress"></i></div></div>
          </article>
        </div>
        <div data-screen="practice" hidden>
          <p class="tl-intro" data-copy="practiceIntro"></p>
          <div class="tl-practice-grid">
            <article class="tl-card"><div class="tl-card-head"><span class="tl-step">01</span><h3 data-copy="instrument"></h3></div><select data-el="instrument" class="tl-select"></select>
              <div class="tl-string-list" data-el="strings"></div><label class="tl-auto"><input type="checkbox" data-el="auto"><span data-copy="auto"></span></label>
              <button class="tl-btn" type="button" data-action="practiceStart"></button>
              <p class="tl-status" data-el="practiceStatus" aria-live="polite"></p></article>
            <article class="tl-card tl-live"><div class="tl-live-orb" data-el="orb"><i></i></div><span data-copy="goal"></span><strong data-el="goal">—</strong><div class="tl-live-note" data-el="liveNote">—</div><div class="tl-live-cents" data-el="liveCents">—</div><div class="tl-stability-track"><i data-el="stableMark"></i></div><div class="tl-live-state" data-el="liveState"></div><button class="tl-btn tl-secondary" type="button" data-action="next"></button></article>
          </div>
          <article class="tl-card tl-custom"><div class="tl-card-head"><span class="tl-step">+</span><h3 data-copy="addInstrument"></h3></div><div class="tl-custom-form"><label><span data-copy="customName"></span><input class="tl-field-input" data-el="customName" maxlength="32"></label><label><span data-copy="strings"></span><input class="tl-field-input" data-el="customStrings" placeholder="82.4, 110, 147, 196, 247, 330"></label></div><button class="tl-btn tl-secondary" type="button" data-action="saveInstrument"></button><button class="tl-remove" type="button" data-action="removeInstrument"></button></article>
          <article class="tl-card tl-summary" data-el="summary" hidden><div class="tl-card-head"><span class="tl-step">✓</span><h3 data-copy="summary"></h3></div><div class="tl-summary-items"><div><span data-copy="elapsed"></span><strong data-el="elapsed">—</strong></div><div><span data-copy="completed"></span><strong data-el="completed">—</strong></div></div></article>
        </div>`;
      (document.querySelector('#main-content') || document.querySelector('.wrap')).appendChild(panel); this.panel = panel;
      this.panel.querySelector('[data-el="file"]').setAttribute('aria-label', this.text('pick'));
    },
    el(name) { return this.panel.querySelector(`[data-el="${name}"]`); },
    // Status lines keep their COPY key, so a language switch re-translates them instead of
    // leaving a Greek sentence in the German UI.
    status(name, key) { const node = this.el(name); node.dataset.key = key || ''; node.textContent = key ? this.text(key) : ''; },
    setLanguage(lang) {
      this.lang = COPY[lang] ? lang : 'el';
      if (!this.panel) return;
      this.tab.textContent = this.text('tab');
      this.panel.querySelector('.tl-title').textContent = this.text('tab');
      this.panel.querySelector('.tl-intro').textContent = this.text('intro');
      this.panel.querySelectorAll('[data-copy]').forEach(node => { node.textContent = this.text(node.dataset.copy); });
      this.panel.querySelectorAll('[data-view]').forEach(node => { node.textContent = this.text(node.dataset.view); });
      this.panel.querySelectorAll('[data-el][data-key]').forEach(node => { node.textContent = node.dataset.key ? this.text(node.dataset.key) : ''; });
      for (const [action, label] of Object.entries({ record: this.text(this.recordingSample ? 'stop' : 'record'), accept: this.text('accept'), playA: this.text('original'), playB: this.text('shifted'), stop: this.text('pause'), practiceStart: this.text(this.practice && this.practice.running ? 'finish' : 'start'), next: this.text('next'), saveInstrument: this.text('saveInstrument'), removeInstrument: this.text('remove') })) {
        this.panel.querySelectorAll(`[data-action="${action}"]`).forEach(button => { button.textContent = label; });
      }
      this.renderInstruments(); this.renderStrings(); this.renderAnalysis();
    },
    bind() {
      this.panel.querySelectorAll('[data-view]').forEach(button => button.onclick = () => this.setView(button.dataset.view));
      this.tab.onclick = () => { if (typeof this.config.showTab === 'function') this.config.showTab('tuning'); };
      this.el('file').onchange = event => { if (event.target.files[0]) this.loadFile(event.target.files[0]); };
      this.panel.querySelectorAll('[data-a]').forEach(button => button.onclick = () => { this.el('targetA').value = button.dataset.a; this.draftA = +button.dataset.a; this.updateProfileControls(); });
      this.el('targetA').onchange = () => { this.draftA = this.clamp(this.el('targetA').value, 390, 460, 432); this.el('targetA').value = this.draftA; this.updateProfileControls(); };
      this.el('sourceA').onchange = () => { this.draftSourceA = this.clamp(this.el('sourceA').value, 390, 460, 440); this.el('sourceA').value = this.draftSourceA; };
      this.panel.querySelectorAll('[data-action]').forEach(button => button.onclick = () => this.action(button.dataset.action));
      this.el('instrument').onchange = () => { this.practice.instrument = this.el('instrument').value; this.practice.index = 0; this.renderStrings(); this.renderGoal(); };
    },
    setView(view) {
      this.currentView = view;
      this.panel.querySelectorAll('[data-screen]').forEach(screen => { screen.hidden = screen.dataset.screen !== view; });
      this.panel.querySelectorAll('[data-view]').forEach(button => { const selected = button.dataset.view === view; button.classList.toggle('is-active', selected); button.setAttribute('aria-selected', String(selected)); });
      if (view === 'practice') this.stopRecording();
      else { this.stopRecording(); this.stopPractice(); }
    },
    setActive(active) {
      this.active = active;
      if (!active) { this.stopRecording(); this.stopPractice(); this.stopAB(); }
    },
    readState() { return { view: this.currentView || 'lab' }; },
    writeState(state) { this.setView(state && state.view === 'practice' ? 'practice' : 'lab'); },
    action(name) {
      if (this.starting && (name === 'record' || name === 'practiceStart')) return;   // a second tap while the mic permission is pending
      if (name === 'record') return this.stream ? this.stopRecording() : this.recordSample();
      if (name === 'accept') { this.targetA = this.draftA = this.clamp(this.el('targetA').value, 390, 460, 432); this.sourceA = this.draftSourceA = this.clamp(this.el('sourceA').value, 390, 460, 440); this.status('profileStatus', 'accepted'); this.updateProfileControls(); }
      if (name === 'playA') this.playAB(1);
      if (name === 'playB') this.playAB(this.targetA / this.sourceA);
      if (name === 'stop') this.stopAB();
      if (name === 'practiceStart') this.practice && this.practice.running ? this.finishPractice() : this.startPractice();
      if (name === 'practiceFinish') this.finishPractice();
      if (name === 'next') this.nextString();
      if (name === 'saveInstrument') this.saveInstrument();
      if (name === 'removeInstrument') this.removeInstrument();
    },
    clamp(value, min, max, fallback) { const number = Number(value); return Number.isFinite(number) ? Math.min(max, Math.max(min, number)) : fallback; },
    updateProfileControls() {
      this.panel.querySelectorAll('[data-a]').forEach(button => button.classList.toggle('is-selected', Math.abs(+button.dataset.a - this.draftA) < .01));
      this.renderAnalysis(); this.updateAB(); this.renderStrings();
    },
    async loadFile(file) {
      try {
        const Context = root.AudioContext || root.webkitAudioContext;
        this.context = this.context || new Context();
        const data = await file.arrayBuffer();
        const buffer = await this.context.decodeAudioData(data.slice(0));
        this.buffer = buffer;
        this.analyzeBuffer(buffer);
        this.status('labStatus', this.analysis.hz ? 'ready' : 'noPitch');
      } catch (error) { this.status('labStatus', 'fileError'); }
    },
    analyzeBuffer(buffer) {
      this.analysis = analyzeSamples(buffer.getChannelData(0), buffer.sampleRate, this.estimate);
      this.renderAnalysis(); this.updateAB();
    },
    async recordSample() {
      if (this.starting) return;
      this.starting = true;
      try {
        this.config.stopOthers();
        if (!root.AudioCapture?.manager) throw new Error('microphone-coordinator-unavailable');
        const stream = await root.AudioCapture.manager.acquire('tuning-lab-record', { audio: { echoCancellation: false, noiseSuppression: false, autoGainControl: false } });
        if (!this.active) { if (root.AudioCapture?.manager) root.AudioCapture.manager.release('tuning-lab-record'); else stream.getTracks().forEach(track => track.stop()); return; }
        this.stream = stream; this.recordingSample = true;
        this.analysisHistory = [];
        const Context = root.AudioContext || root.webkitAudioContext;
        this.context = this.context || new Context();
        await this.context.resume();
        if (!this.active || this.panel.querySelector('[data-screen="lab"]').hidden || this.stream !== stream) { this.stopRecording(); return; }
        this.connectAudioCallback(stream, samples => this.recordFrame(samples));
        if (root.MediaRecorder) {
          this.recordChunks = [];
          this.recordRecorder = new MediaRecorder(stream);
          this.recordRecorder.ondataavailable = event => { if (event.data.size) this.recordChunks.push(event.data); };
          this.recordRecorder.onstop = async () => {
            try {
              const blob = new Blob(this.recordChunks, { type: this.recordRecorder.mimeType || 'audio/webm' });
              const audio = await blob.arrayBuffer();
              const buffer = await this.context.decodeAudioData(audio.slice(0));
              this.buffer = buffer; this.analyzeBuffer(buffer);
              this.status('labStatus', this.analysis.hz ? 'ready' : 'noPitch');
            } catch (error) {
              this.status('labStatus', this.analysis && this.analysis.hz ? 'ready' : 'noPitch');
            }
            this.recordChunks = []; this.recordRecorder = null;
          };
          this.recordRecorder.start();
        }
        this.recordUntil = performance.now() + 3000; this.status('labStatus', 'listening');
        this.setLanguage(this.lang);
      } catch (error) { this.stopRecording(); this.status('labStatus', 'micError'); }
      finally { this.starting = false; }
    },
    stopRecording() {
      if (root.AudioCapture?.manager) root.AudioCapture.manager.release('tuning-lab-record');
      if (!this.stream) { this.recordingSample = false; return; }
      if (this.recordRecorder && this.recordRecorder.state !== 'inactive') this.recordRecorder.stop();
      if (!root.AudioCapture?.manager) this.stream.getTracks().forEach(track => track.stop()); this.stream = null;
      this.recordingSample = false;
      this.disconnectAudioCallback();
      this.setLanguage(this.lang);
    },
    recordFrame(samples) {
      const result = this.estimate(samples, this.context.sampleRate);
      this.analysisHistory.push(result);
      if (this.analysisHistory.length > 5) this.analysisHistory.shift();
      this.analysis = summarizePitch(this.analysisHistory);
      this.renderAnalysis(); this.updateAB();
      if (performance.now() >= this.recordUntil) { this.stopRecording(); this.status('labStatus', this.analysis.hz ? 'ready' : 'noPitch'); }
    },
    connectAudioCallback(stream, onFrame) {
      const input = this.context.createMediaStreamSource(stream);
      const processor = this.context.createScriptProcessor(4096, 1, 1);
      processor.onaudioprocess = event => {
        event.outputBuffer.getChannelData(0).fill(0);
        onFrame(getAnalysisWindow(event.inputBuffer.getChannelData(0)));
      };
      input.connect(processor); processor.connect(this.context.destination);
      this.input = input; this.processor = processor;
    },
    disconnectAudioCallback() {
      if (this.processor) { this.processor.onaudioprocess = null; this.processor.disconnect(); }
      if (this.input) this.input.disconnect();
      this.processor = null; this.input = null;
    },
    renderAnalysis() {
      if (!this.panel) return;
      const result = this.analysis;
      if (!result || !result.hz) {
        this.el('note').textContent = '—'; this.el('frequency').textContent = '—'; this.el('confidence').textContent = '—'; this.el('stability').textContent = this.text('uncertain'); return;
      }
      const midi = Math.round(69 + 12 * Math.log2(result.hz / this.targetA));
      const target = this.targetA * Math.pow(2, (midi - 69) / 12);
      const cents = this.cents(result.hz, target);
      this.el('note').textContent = `${this.config.noteName(midi, this.lang)} ${cents >= 0 ? '+' : ''}${cents.toFixed(1)} ${this.text('cents')}`;
      this.el('frequency').textContent = `${result.hz.toFixed(2)} Hz`;
      this.el('confidence').textContent = `${Math.round(result.confidence * 100)}%`;
      this.el('stability').textContent = result.stability <= 5 ? this.text('stableShort') : result.stability <= 15 ? this.text('close') : this.text('uncertain');
    },
    updateAB() {
      const ready = !!(this.buffer && this.analysis && this.analysis.hz);
      this.panel.querySelectorAll('[data-action="playA"], [data-action="playB"]').forEach(button => { button.disabled = !ready; });
      this.panel.querySelector('[data-action="stop"]').disabled = !this.playing;
      if (ready) this.panel.querySelector('[data-action="playB"]').title = `${this.text('target')} ${this.targetA} Hz`;
    },
    position() { return this.source ? Math.min(this.buffer.duration, this.sourceOffset + (this.context.currentTime - this.sourceStarted) * this.source.playbackRate.value) : this.sourceOffset; },
    playAB(rate) {
      if (!this.buffer) return;
      if (!this.playing) this.config.stopOthers();   // the lab's audio never plays over a tone or song
      const offset = this.playing ? this.position() : this.sourceOffset;
      this.stopAB(true);
      this.sourceOffset = offset >= this.buffer.duration ? 0 : offset;
      const source = this.context.createBufferSource(), gain = this.context.createGain();
      source.buffer = this.buffer; source.playbackRate.value = rate;
      const channel = this.buffer.getChannelData(0); let peak = 0;
      for (let i = 0; i < channel.length; i += 16) peak = Math.max(peak, Math.abs(channel[i]));
      gain.gain.value = peak ? Math.min(1, .72 / peak) : 1;
      source.connect(gain).connect(this.context.destination); source.start(0, this.sourceOffset);
      source.onended = () => { if (this.source === source) { this.source = null; this.playing = false; this.sourceOffset = 0; this.updateAB(); } };
      this.source = source; this.sourceStarted = this.context.currentTime; this.playing = true; this.updateAB(); this.updateProgress();
    },
    stopAB(preserve = false) {
      if (this.source) {
        if (preserve) this.sourceOffset = this.position();
        const source = this.source; this.source = null; this.playing = false;
        try { source.stop(); } catch (error) { /* already ended */ }
      }
      this.el('progress').style.width = this.buffer && preserve ? `${100 * this.sourceOffset / this.buffer.duration}%` : '0%';
      this.updateAB();
    },
    updateProgress() {
      if (!this.playing || !this.active) return;
      this.el('progress').style.width = `${100 * this.position() / this.buffer.duration}%`;
      this.progressRaf = requestAnimationFrame(() => this.updateProgress());
    },
    builtins() {
      return this.config.instruments.map(key => ({ key, name: this.config.instrumentName(key), targets: courseTargets(this.config.tunings[key], this.targetA, this.config.noteFreq) }));
    },
    profiles() { return this.builtins().concat(this.custom.map(profile => ({ key: profile.key, name: profile.name, targets: profile.strings.map(hz => [hz]) }))); },
    courseLabel(course) { return `${course.map(hz => hz.toFixed(1)).join(' + ')} Hz`; },
    renderInstruments() {
      if (!this.panel) return;
      const select = this.el('instrument'), current = (this.practice && this.practice.instrument) || select.value || 'guitar';
      select.replaceChildren();
      for (const profile of this.profiles()) { const option = document.createElement('option'); option.value = profile.key; option.textContent = profile.name; select.appendChild(option); }
      select.value = this.profiles().some(profile => profile.key === current) ? current : 'guitar';
      if (this.practice) this.practice.instrument = select.value;
      this.renderStrings(); this.renderGoal();
    },
    currentProfile() { return this.profiles().find(profile => profile.key === (this.practice && this.practice.instrument || this.el('instrument').value)) || this.builtins().find(profile => profile.key === 'guitar'); },
    renderStrings() {
      if (!this.practice) this.practice = { instrument: this.el('instrument').value || 'guitar', index: 0, running: false, completed: new Set(), frames: 0, started: 0 };
      const box = this.el('strings'), profile = this.currentProfile();
      box.replaceChildren();
      profile.targets.forEach((course, index) => {
        const button = document.createElement('button'); button.type = 'button'; button.className = 'tl-string' + (index === this.practice.index ? ' is-current' : '') + (this.practice.completed.has(index) ? ' is-done' : '');
        button.innerHTML = '<small></small><strong></strong>';
        button.firstElementChild.textContent = `${this.text('goal')} ${index + 1}`;
        button.lastElementChild.textContent = this.courseLabel(course);
        button.onclick = () => { this.practice.index = index; this.renderStrings(); this.renderGoal(); };
        box.appendChild(button);
      });
      this.renderGoal();
    },
    renderGoal() {
      if (!this.practice || !this.panel) return;
      const profile = this.currentProfile();
      this.el('goal').textContent = profile ? `${profile.name} · ${this.practice.index + 1} / ${profile.targets.length} · ${this.courseLabel(profile.targets[this.practice.index])}` : '—';
      this.el('instrument').value = this.practice.instrument;
      this.panel.querySelector('[data-action="removeInstrument"]').disabled = !this.practice.instrument.startsWith('custom-');
    },
    async startPractice() {
      if (this.starting) return;
      this.starting = true;
      try {
        this.config.stopOthers();
        if (!root.AudioCapture?.manager) throw new Error('microphone-coordinator-unavailable');
        const stream = await root.AudioCapture.manager.acquire('tuning-lab-practice', { audio: { echoCancellation: false, noiseSuppression: false, autoGainControl: false } });
        if (!this.active || this.panel.querySelector('[data-screen="practice"]').hidden) { if (root.AudioCapture?.manager) root.AudioCapture.manager.release('tuning-lab-practice'); else stream.getTracks().forEach(track => track.stop()); return; }
        this.stream = stream;
        const Context = root.AudioContext || root.webkitAudioContext;
        this.context = this.context || new Context(); await this.context.resume();
        if (!this.active || this.panel.querySelector('[data-screen="practice"]').hidden || this.stream !== stream) { this.stopPractice(); return; }
        this.practice.instrument = this.el('instrument').value; this.practice.index = 0; this.practice.completed = new Set(); this.practice.frames = 0; this.practice.started = performance.now(); this.practice.running = true;
        this.el('summary').hidden = true; this.status('practiceStatus', null);
        this.setLanguage(this.lang); this.renderStrings(); this.connectAudioCallback(stream, samples => this.practiceFrame(samples));
      } catch (error) { this.stopPractice(); this.status('practiceStatus', 'micError'); }
      finally { this.starting = false; }
    },
    finishPractice() {
      if (!this.practice || !this.practice.running) return;
      const elapsed = Math.max(0, performance.now() - this.practice.started);
      this.practice.running = false; this.stopPractice();
      this.el('elapsed').textContent = `${Math.floor(elapsed / 60000)}:${String(Math.floor(elapsed / 1000) % 60).padStart(2, '0')}`;
      this.el('completed').textContent = String(this.practice.completed.size);
      this.el('summary').hidden = false;
      this.status('practiceStatus', null);
      this.setLanguage(this.lang);
    },
    nextString() {
      if (!this.practice) return;
      const length = this.currentProfile().targets.length;
      this.practice.index = (this.practice.index + 1) % length;
      this.practice.frames = 0; this.renderStrings(); this.renderGoal();
    },
    saveInstrument() {
      const name = this.el('customName').value.trim();
      const strings = this.el('customStrings').value.split(',').map(value => Number(value.trim()));
      if (!name || strings.length < 1 || strings.some(hz => !Number.isFinite(hz) || hz < 20 || hz > 2000)) { this.status('practiceStatus', 'strings'); return; }
      const profile = { key: `custom-${Date.now()}`, name, strings };
      this.custom.push(profile); this.saveCustom();
      this.practice.instrument = profile.key; this.practice.index = 0; this.status('practiceStatus', 'customSaved'); this.renderInstruments();
    },
    removeInstrument() {
      if (!this.practice || !this.practice.instrument.startsWith('custom-')) return;
      this.custom = this.custom.filter(profile => profile.key !== this.practice.instrument);
      this.saveCustom(); this.practice.instrument = 'guitar'; this.renderInstruments();
    },
    practiceFrame(samples) {
      const result = this.estimate(samples, this.context.sampleRate);
      if (!result.hz || result.confidence < .55) { this.practice.frames = 0; this.status('liveState', 'uncertain'); return; }
      const { cents } = nearestInCourse(result.hz, this.currentProfile().targets[this.practice.index]);
      this.el('liveNote').textContent = `${this.config.noteName(Math.round(69 + 12 * Math.log2(result.hz / this.targetA)), this.lang)} · ${result.hz.toFixed(1)} Hz`;
      this.el('liveCents').textContent = `${cents >= 0 ? '+' : ''}${cents.toFixed(1)} ${this.text('cents')}`;
      const ratio = Math.max(0, Math.min(1, .5 + cents / 100)); this.el('stableMark').style.left = `${ratio * 100}%`;
      const stable = Math.abs(cents) <= 5 && result.confidence >= .82;
      this.practice.frames = stable ? this.practice.frames + 1 : 0;
      this.status('liveState', stable ? 'stable' : 'tuning');
      this.el('orb').classList.toggle('is-stable', this.practice.frames >= 3);
      if (this.practice.frames >= 3 && !this.practice.completed.has(this.practice.index)) {
        this.practice.completed.add(this.practice.index); this.renderStrings();
        // completed.has() already makes this fire once per string; the old autoAt guard started
        // at 0 and so never advanced from the first string.
        if (this.el('auto').checked) this.nextString();
      }
    },
    stopPractice() {
      if (this.practice && this.practice.running) this.practice.running = false;
      if (root.AudioCapture?.manager) root.AudioCapture.manager.release('tuning-lab-practice');
      else if (this.stream) this.stream.getTracks().forEach(track => track.stop());
      this.stream = null; this.disconnectAudioCallback();
    },
    stopCapture() { this.stopRecording(); this.stopPractice(); },
    renderStringsAndView() { this.renderStrings(); this.renderGoal(); },
    renderLab() { this.setLanguage(this.lang); this.updateProfileControls(); },
  };

  root.TuningLab = api;
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
})(typeof window !== 'undefined' ? window : globalThis);
