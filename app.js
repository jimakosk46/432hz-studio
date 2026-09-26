// 432Hz Studio — κοινός κώδικας των δύο εφαρμογών (desktop Flask + mobile PWA).
//
// ΔΙΕΠΑΦΗ (ό,τι χρειάζεται να ξέρει η σελίδα που το φορτώνει):
//   1. Φόρτωσε αυτό το αρχείο στο ΤΕΛΟΣ του <body>, αφού υπάρχουν τα κοινά panels.
//   2. Κάλεσε μία φορά:  startApp({ i18n, trackUrl, stopSongPlayer })
//        i18n           – κλειδιά ειδικά της εφαρμογής ανά γλώσσα· πατάνε πάνω στα κοινά
//        trackUrl(f)    – πού βρίσκεται το mp3 της συχνότητας f
//        stopSongPlayer – σταματά τον δικό της player, όταν ξεκινά τόνος/κομμάτι
//   Η σελίδα μπορεί μετά να χρησιμοποιεί: T(), LANG, applyLang(), stopTone(), stopMusic().
'use strict';

let APP = { i18n: {}, trackUrl: f => f + '.mp3', stopSongPlayer: () => {} };

// ---------- i18n (κοινά κλειδιά· τα ειδικά της κάθε εφαρμογής έρχονται από το startApp) ----------
const SHARED_I18N = {
  "el": {
    "tab_tone": "Γεννήτρια τόνων",
    "tab_heal": "Θεραπευτικοί τόνοι",
    "target_label": "Συχνότητα-στόχος (αναφορά Λα = 440Hz)",
    "waveform": "Κυματομορφή",
    "wave_sine": "Ημίτονο (απαλό)",
    "wave_triangle": "Τρίγωνο",
    "wave_square": "Τετράγωνο",
    "wave_saw": "Πριόνι",
    "volume": "Ένταση",
    "play": "▶ Αναπαραγωγή",
    "stop": "■ Στοπ",
    "wav_label": "Λήψη ως αρχείο WAV — διάρκεια (δευτερόλεπτα)",
    "wav_btn": "💾 Λήψη WAV",
    "pure_tone": "▶ Καθαρός τόνος",
    "stop_short": "■ Στοπ",
    "music_btn": "🎵 Μουσική {f}Hz",
    "music_stop": "■ Στοπ {f}Hz",
    "need_phones": "🎧 Απαραίτητα ακουστικά — ο παλμός δημιουργείται από τη διαφορά των δύο αυτιών",
    "credit": "από τον Δημήτρη Κατσαβό",
    "tab_chl": "Σχήματα ήχου",
    "chl_note": "Προσομοίωση πλάκας Chladni: η «άμμος» μαζεύεται εκεί όπου η πλάκα δεν δονείται. Καθαρό, συμμετρικό σχήμα βγαίνει όταν η συχνότητα πετυχαίνει συντονισμό της πλάκας. Δοκίμασε 432 και 440 — και μετά άλλαξε λίγο το «μέγεθος πλάκας»: κάθε συχνότητα έχει την πλάκα που τη βγάζει πανέμορφη.",
    "chl_freq": "Συχνότητα (Hz)",
    "chl_plate": "Μέγεθος πλάκας",
    "chl_on": "✨ Συντονισμός στα {f}Hz — καθαρό, συμμετρικό σχήμα!",
    "chl_off": "Εκτός συντονισμού — θολό σχήμα. Κοντινότερος συντονισμός: {f}Hz",
    "chl_shape_plate": "Πλάκα",
    "chl_shape_drop": "Σταγόνα νερού",
    "chl_note_drop": "Φυσική ταλάντωση σταγόνας νερού: το περίγραμμά της παίρνει σχήμα αστεριού με n αιχμές όταν η συχνότητα πετυχαίνει έναν φυσικό τρόπο ταλάντωσης της επιφάνειάς της (τύπος Rayleigh). Δοκίμασε 432 και 440 — και άλλαξε λίγο το «μέγεθος σταγόνας»: κάθε συχνότητα έχει το μέγεθος σταγόνας που τη βγάζει πιο όμορφο αστέρι.",
    "chl_drop_size": "Μέγεθος σταγόνας",
    "chl_drop_rotate": "σύρε πάνω στη σταγόνα για να τη γυρίσεις · διπλό κλικ για επαναφορά",
    "chl_drop_on": "✨ Συντονισμός στα {f}Hz — καθαρό αστέρι {n} ακτίνων!",
    "chl_drop_off": "Εκτός συντονισμού — ασταθές σχήμα. Κοντινότερος συντονισμός: {f}Hz ({n} ακτίνες)",
    "tab_cry": "Κρύσταλλοι",
    "tab_tuner": "Κουρδιστήρι",
    "tuner_note": "Διάλεξε όργανο και συχνότητα αναφοράς, πάτα μια νότα για να την ακούσεις, και κούρδισε με το αυτί. Στα 432 Hz κατεβαίνουν όλες οι χορδές το ίδιο — οι σχέσεις μεταξύ τους δεν αλλάζουν.",
    "tuner_instrument": "Όργανο",
    "tuner_ref": "Συχνότητα αναφοράς (Λα)",
    "inst_trichordo": "Μπουζούκι τρίχορδο",
    "inst_tetrachordo": "Μπουζούκι τετράχορδο",
    "inst_baglamas": "Μπαγλαμάς",
    "inst_tzouras": "Τζουράς",
    "inst_guitar": "Κιθάρα",
    "inst_violin": "Βιολί",
    "inst_ukulele": "Γιουκαλίλι",
    "note_baglamas": "Ο μπαγλαμάς κουρδιζόταν ιστορικά σε σχέση με το μπουζούκι της παρέας, όχι με διαπασών. Ο στόχος εδώ είναι ακριβώς μία οκτάβα πάνω από το τρίχορδο.",
    "note_ukulele": "Προσοχή: στο γιουκαλίλι η χορδή σολ ηχεί ΠΑΝΩ από το ντο, δεν είναι η χαμηλότερη.",
    "note_octave": "Η χαμηλή σειρά είναι ζεύγος σε οκτάβα — δύο χορδές, μία οκτάβα απόσταση.",
    "tuner_octave_pair": "οκτάβα",
    "tuner_tap": "Πάτα μια νότα για να την ακούσεις και κούρδισε με το αυτί.",
    "mic_start": "🎤 Ενεργοποίηση μικροφώνου",
    "mic_denied": "Δεν δόθηκε άδεια για το μικρόφωνο. Ο browser θυμάται την άρνηση — θα χρειαστεί να την αλλάξεις από τις ρυθμίσεις της σελίδας (το εικονίδιο αριστερά από τη διεύθυνση).",
    "mic_none": "Δεν βρέθηκε μικρόφωνο σε αυτή τη συσκευή.",
    "mic_insecure": "Το μικρόφωνο δουλεύει μόνο σε ασφαλή σύνδεση (https ή localhost).",
    "mic_listening": "Ακούω…",
    "tuner_flat": "χαμηλά",
    "tuner_sharp": "ψηλά",
    "tuner_tighten": "σφίξε λίγο",
    "tuner_loosen": "χαλάρωσε λίγο",
    "tuner_intune": "✓ κουρδισμένη",
    "cry_note": "Κάθε συχνότητα γεννά τον δικό της μοναδικό κρύσταλλο πάγου: εξαγωνική συμμετρία όπως οι αληθινές χιονονιφάδες, με τα κλαδιά να υπολογίζονται μαθηματικά από τον αριθμό της συχνότητας. Η ίδια συχνότητα δίνει πάντα τον ίδιο κρύσταλλο — το κρυστάλλινο πορτρέτο της.",
    "cry_title": "❄ Ο κρύσταλλος των {f}Hz",
    "cry_again": "❄ Μεγάλωσε ξανά τον κρύσταλλο",
    "act_fav": "☆ Αποθήκευση",
    "act_share": "🔗 Αντιγραφή συνδέσμου",
    "act_png": "🖼 Εικόνα",
    "copied": "Ο σύνδεσμος αντιγράφηκε ✓",
    "saved_fav": "Αποθηκεύτηκε ✓",
    "png_done": "Η εικόνα κατέβηκε ✓",
    "sleep_label": "Χρονοδιακόπτης ύπνου",
    "sleep_off": "✕ Κλειστό",
    "sleep_left": "Σταματά σε {n}"
  },
  "de": {
    "tab_tone": "Tongenerator",
    "tab_heal": "Heilfrequenzen",
    "target_label": "Zielfrequenz (Referenz A = 440Hz)",
    "waveform": "Wellenform",
    "wave_sine": "Sinus (sanft)",
    "wave_triangle": "Dreieck",
    "wave_square": "Rechteck",
    "wave_saw": "Sägezahn",
    "volume": "Lautstärke",
    "play": "▶ Wiedergabe",
    "stop": "■ Stopp",
    "wav_label": "Als WAV-Datei speichern — Dauer (Sekunden)",
    "wav_btn": "💾 WAV speichern",
    "pure_tone": "▶ Reiner Ton",
    "stop_short": "■ Stopp",
    "music_btn": "🎵 Musik {f}Hz",
    "music_stop": "■ Stopp {f}Hz",
    "need_phones": "🎧 Kopfhörer erforderlich — der Puls entsteht aus der Differenz der beiden Ohren",
    "credit": "von Dimitri Katsavos",
    "tab_chl": "Klangmuster",
    "chl_note": "Chladni-Platten-Simulation: Der „Sand\" sammelt sich dort, wo die Platte nicht schwingt. Ein klares, symmetrisches Muster entsteht, wenn die Frequenz eine Resonanz der Platte trifft. Probiere 432 und 440 — und ändere dann leicht die Plattengröße: Jede Frequenz hat eine Platte, auf der sie wunderschön aussieht.",
    "chl_freq": "Frequenz (Hz)",
    "chl_plate": "Plattengröße",
    "chl_on": "✨ Resonanz bei {f}Hz — klares, symmetrisches Muster!",
    "chl_off": "Außerhalb der Resonanz — verschwommenes Muster. Nächste Resonanz: {f}Hz",
    "chl_shape_plate": "Platte",
    "chl_shape_drop": "Wassertropfen",
    "chl_note_drop": "Physikalische Schwingung eines Wassertropfens: Sein Rand nimmt die Form eines Sterns mit n Spitzen an, wenn die Frequenz eine natürliche Schwingungsart der Oberfläche trifft (Rayleigh-Formel). Probiere 432 und 440 — und ändere dann leicht die Tropfengröße: Jede Frequenz hat eine Tropfengröße, bei der sie den schönsten Stern ergibt.",
    "chl_drop_size": "Tropfengröße",
    "chl_drop_rotate": "zieh am Tropfen, um ihn zu drehen · Doppelklick setzt zurück",
    "chl_drop_on": "✨ Resonanz bei {f}Hz — klarer Stern mit {n} Spitzen!",
    "chl_drop_off": "Außerhalb der Resonanz — instabile Form. Nächste Resonanz: {f}Hz ({n} Spitzen)",
    "tab_cry": "Kristalle",
    "tab_tuner": "Stimmgerät",
    "tuner_note": "Wähle Instrument und Referenzfrequenz, tippe eine Note an, um sie zu hören, und stimme nach Gehör. Bei 432 Hz sinken alle Saiten gleich weit — ihre Verhältnisse zueinander bleiben unverändert.",
    "tuner_instrument": "Instrument",
    "tuner_ref": "Referenzfrequenz (A)",
    "inst_trichordo": "Bouzouki, dreichörig",
    "inst_tetrachordo": "Bouzouki, vierchörig",
    "inst_baglamas": "Baglamas",
    "inst_tzouras": "Tzouras",
    "inst_guitar": "Gitarre",
    "inst_violin": "Geige",
    "inst_ukulele": "Ukulele",
    "note_baglamas": "Der Baglamas wurde historisch relativ zur Bouzouki der Runde gestimmt, nicht nach Kammerton. Das Ziel hier ist genau eine Oktave über der dreichörigen Bouzouki.",
    "note_ukulele": "Achtung: Bei der Ukulele klingt die G-Saite HÖHER als die C-Saite, sie ist nicht die tiefste.",
    "note_octave": "Der tiefste Chor ist ein Oktavpaar — zwei Saiten im Abstand einer Oktave.",
    "tuner_octave_pair": "Oktave",
    "tuner_tap": "Tippe eine Note an, um sie zu hören, und stimme nach Gehör.",
    "mic_start": "🎤 Mikrofon aktivieren",
    "mic_denied": "Kein Zugriff auf das Mikrofon. Der Browser merkt sich die Ablehnung — du musst sie in den Seiteneinstellungen ändern (das Symbol links neben der Adresse).",
    "mic_none": "Auf diesem Gerät wurde kein Mikrofon gefunden.",
    "mic_insecure": "Das Mikrofon funktioniert nur über eine sichere Verbindung (https oder localhost).",
    "mic_listening": "Ich höre zu…",
    "tuner_flat": "zu tief",
    "tuner_sharp": "zu hoch",
    "tuner_tighten": "etwas straffer",
    "tuner_loosen": "etwas lockerer",
    "tuner_intune": "✓ gestimmt",
    "cry_note": "Jede Frequenz erzeugt ihren eigenen, einzigartigen Eiskristall: sechseckige Symmetrie wie echte Schneeflocken, die Äste werden mathematisch aus der Frequenzzahl berechnet. Dieselbe Frequenz ergibt immer denselben Kristall — ihr kristallines Porträt.",
    "cry_title": "❄ Der Kristall von {f}Hz",
    "cry_again": "❄ Kristall erneut wachsen lassen",
    "act_fav": "☆ Speichern",
    "act_share": "🔗 Link kopieren",
    "act_png": "🖼 Bild",
    "copied": "Link kopiert ✓",
    "saved_fav": "Gespeichert ✓",
    "png_done": "Bild heruntergeladen ✓",
    "sleep_label": "Einschlaf-Timer",
    "sleep_off": "✕ Aus",
    "sleep_left": "Stoppt in {n}"
  },
  "en": {
    "tab_tone": "Tone generator",
    "tab_heal": "Healing tones",
    "target_label": "Target frequency (reference A = 440Hz)",
    "waveform": "Waveform",
    "wave_sine": "Sine (soft)",
    "wave_triangle": "Triangle",
    "wave_square": "Square",
    "wave_saw": "Sawtooth",
    "volume": "Volume",
    "play": "▶ Play",
    "stop": "■ Stop",
    "wav_label": "Download as WAV file — duration (seconds)",
    "wav_btn": "💾 Download WAV",
    "pure_tone": "▶ Pure tone",
    "stop_short": "■ Stop",
    "music_btn": "🎵 Music {f}Hz",
    "music_stop": "■ Stop {f}Hz",
    "need_phones": "🎧 Headphones required — the pulse is created by the difference between the two ears",
    "credit": "by Dimitri Katsavos",
    "tab_chl": "Sound patterns",
    "chl_note": "Chladni plate simulation: the \"sand\" gathers where the plate does not vibrate. A clear, symmetric pattern appears when the frequency hits a resonance of the plate. Try 432 and 440 — then slightly change the plate size: every frequency has a plate that makes it beautiful.",
    "chl_freq": "Frequency (Hz)",
    "chl_plate": "Plate size",
    "chl_on": "✨ Resonance at {f}Hz — clear symmetric pattern!",
    "chl_off": "Off resonance — blurred pattern. Nearest resonance: {f}Hz",
    "chl_shape_plate": "Plate",
    "chl_shape_drop": "Water drop",
    "chl_note_drop": "The physical oscillation of a water drop: its rim takes the shape of a star with n points when the frequency hits a natural surface oscillation mode (Rayleigh formula). Try 432 and 440 — then slightly change the drop size: every frequency has a drop size that makes it the most beautiful star.",
    "chl_drop_size": "Drop size",
    "chl_drop_rotate": "drag the drop to turn it · double-click to reset",
    "chl_drop_on": "✨ Resonance at {f}Hz — clear {n}-point star!",
    "chl_drop_off": "Off resonance — unstable shape. Nearest resonance: {f}Hz ({n} points)",
    "tab_cry": "Crystals",
    "tab_tuner": "Tuner",
    "tuner_note": "Choose an instrument and a reference pitch, tap a note to hear it, and tune by ear. At 432 Hz every string drops by the same amount — the relationships between them do not change.",
    "tuner_instrument": "Instrument",
    "tuner_ref": "Reference pitch (A)",
    "inst_trichordo": "Bouzouki, three-course",
    "inst_tetrachordo": "Bouzouki, four-course",
    "inst_baglamas": "Baglamas",
    "inst_tzouras": "Tzouras",
    "inst_guitar": "Guitar",
    "inst_violin": "Violin",
    "inst_ukulele": "Ukulele",
    "note_baglamas": "The baglamas was historically tuned relative to whichever bouzouki was in the room, not to a fixed reference. The target here is exactly one octave above the three-course bouzouki.",
    "note_ukulele": "Note: on the ukulele the G string sounds HIGHER than the C, it is not the lowest.",
    "note_octave": "The lowest course is an octave pair — two strings an octave apart.",
    "tuner_octave_pair": "octave",
    "tuner_tap": "Tap a note to hear it and tune by ear.",
    "mic_start": "🎤 Enable microphone",
    "mic_denied": "Microphone access was refused. The browser remembers this — you will need to change it in the site settings (the icon to the left of the address).",
    "mic_none": "No microphone was found on this device.",
    "mic_insecure": "The microphone only works over a secure connection (https or localhost).",
    "mic_listening": "Listening…",
    "tuner_flat": "flat",
    "tuner_sharp": "sharp",
    "tuner_tighten": "tighten a little",
    "tuner_loosen": "loosen a little",
    "tuner_intune": "✓ in tune",
    "cry_note": "Every frequency grows its own unique ice crystal: hexagonal symmetry like real snowflakes, with branches computed mathematically from the frequency number. The same frequency always gives the same crystal — its crystalline portrait.",
    "cry_title": "❄ The crystal of {f}Hz",
    "cry_again": "❄ Grow the crystal again",
    "act_fav": "☆ Save",
    "act_share": "🔗 Copy link",
    "act_png": "🖼 Image",
    "copied": "Link copied ✓",
    "saved_fav": "Saved ✓",
    "png_done": "Image downloaded ✓",
    "sleep_label": "Sleep timer",
    "sleep_off": "✕ Off",
    "sleep_left": "Stops in {n}"
  }
};
let I18N = SHARED_I18N;

let LANG = localStorage.getItem('lang432') || 'el';
if (!I18N[LANG]) LANG = 'el';
// προσοχή στο κενό string: είναι έγκυρη μετάφραση (π.χ. πρόταση που ισχύει μόνο
// στη μία εφαρμογή), οπότε ο έλεγχος γίνεται με undefined, όχι με ||
const T = k => {
  for (const l of [LANG, 'el']) {
    const v = I18N[l] && I18N[l][k];
    if (v !== undefined) return v;
  }
  return k;
};

// Όταν η κατάσταση δεν έρχεται από κλικ αλλά από σύνδεσμο ή αγαπημένο, πρέπει να
// φωτιστεί μόνο του το chip που ταιριάζει — αλλιώς το πεδίο λέει 963 και το χρυσό
// chip λέει 432. Αν καμία προεπιλογή δεν ταιριάζει, δεν φωτίζεται καμία.
function syncChips(groupSelector, value) {
  document.querySelectorAll(groupSelector).forEach(c =>
    c.classList.toggle('sel', Math.abs(+c.dataset.f - value) < 0.01));
}

// Ένα chip «σελ»: το πατημένο παίρνει την κλάση, τα υπόλοιπα της ίδιας ομάδας τη χάνουν.
function selectChip(groupSelector, clicked) {
  document.querySelectorAll(groupSelector).forEach(x => x.classList.toggle('sel', x === clicked));
}

const tfreq = document.getElementById('tfreq'), tslider = document.getElementById('tslider');
const volInp = document.getElementById('vol'), waveSel = document.getElementById('wave');
let ctx = null, osc = null, gain = null;

// slider λογαριθμικά 20Hz–2000Hz
const smin = Math.log(20), smax = Math.log(2000);
function sliderToFreq(v) { return Math.exp(smin + (smax - smin) * v / 1000); }
function freqToSlider(f) { return Math.round((Math.log(f) - smin) / (smax - smin) * 1000); }

function vol() { return Math.pow(+volInp.value / 100, 2) * 0.5; }
function applyFreq() {
  if (osc) osc.frequency.setTargetAtTime(+tfreq.value || 432, ctx.currentTime, .02);
  pushUrl();
}

function startTone() {
  if (osc) return;
  stopSongPlayer();
  stopRefTone();
  ctx = ctx || new (window.AudioContext || window.webkitAudioContext)();
  ctx.resume();
  osc = ctx.createOscillator(); gain = ctx.createGain();
  osc.type = waveSel.value;
  osc.frequency.value = +tfreq.value || 432;
  gain.gain.setValueAtTime(0, ctx.currentTime);
  gain.gain.linearRampToValueAtTime(vol(), ctx.currentTime + .05); // χωρίς "κλικ"
  osc.connect(gain).connect(ctx.destination);
  osc.start();
  syncUI();
}
function stopTone() {
  if (!osc) return;
  const o = osc, g = gain; osc = null; gain = null;
  g.gain.setTargetAtTime(0, ctx.currentTime, .03);
  setTimeout(() => { o.stop(); o.disconnect(); g.disconnect(); }, 200);
  syncUI();
}
function syncUI() {
  const playing = !!osc;
  document.getElementById('play').classList.toggle('hidden', playing);
  document.getElementById('stop').classList.toggle('hidden', !playing);
  document.querySelectorAll('.tonecard .pl').forEach(b => {
    const on = playing && Math.abs(+b.dataset.f - +tfreq.value) < 0.01;
    b.classList.toggle('on', on);
    b.textContent = on ? T('stop_short') : T('pure_tone');
  });
}

// ---------- healing tones ----------
const TONES = [
  { f: 7.83,
    name: { el: 'Συντονισμός Schumann — ο παλμός της Γης', de: 'Schumann-Resonanz — der Puls der Erde', en: 'Schumann resonance — the pulse of the Earth' },
    desc: {
      el: 'Η θεμελιώδης συχνότητα του ηλεκτρομαγνητικού πεδίου του πλανήτη — ο φυσικός «χτύπος» της Γης, μέσα στον οποίο εξελίχθηκε κάθε ζωντανός οργανισμός. Συντονίζει το σώμα με τους βιορυθμούς της φύσης: βαθιά γείωση, ηρεμία του νευρικού συστήματος, καλύτερος ύπνος. Είναι υπόηχος — άκουσέ τον με ακουστικά· περισσότερο τον νιώθεις παρά τον ακούς.',
      de: 'Die Grundfrequenz des elektromagnetischen Feldes unseres Planeten — der natürliche »Herzschlag« der Erde, in dem sich alles Leben entwickelt hat. Bringt den Körper in Einklang mit den Biorhythmen der Natur: tiefe Erdung, Beruhigung des Nervensystems, besserer Schlaf. Sie ist Infraschall — mit Kopfhörern hören; man fühlt sie mehr, als man sie hört.',
      en: 'The fundamental frequency of the planet\'s electromagnetic field — Earth\'s natural "heartbeat", in which all life evolved. Attunes the body to nature\'s biorhythms: deep grounding, a calmer nervous system, better sleep. It is infrasound — listen with headphones; you feel it more than you hear it.' },
    yt: '7.83 Hz Schumann resonance healing sleep music' },
  { f: 40,
    name: { el: 'Κύματα Γάμμα — διαύγεια & μνήμη', de: 'Gamma-Wellen — Klarheit & Gedächtnis', en: 'Gamma waves — clarity & memory' },
    desc: {
      el: 'Η συχνότητα της πνευματικής διαύγειας: αντιστοιχεί στα εγκεφαλικά κύματα γάμμα που εμφανίζονται στις στιγμές έντονης συγκέντρωσης, μάθησης και «φώτισης». Ενισχύει μνήμη, προσοχή και καθαρή σκέψη — ιδανική για ώρες δουλειάς ή διαβάσματος.',
      de: 'Die Frequenz geistiger Klarheit: Sie entspricht den Gamma-Gehirnwellen, die in Momenten intensiver Konzentration, beim Lernen und in »Aha-Momenten« auftreten. Stärkt Gedächtnis, Aufmerksamkeit und klares Denken — ideal für Arbeit und Studium.',
      en: 'The frequency of mental clarity: it matches the gamma brainwaves that appear in moments of deep focus, learning and insight. Boosts memory, attention and clear thinking — ideal for work or study.' },
    yt: '40 Hz gamma waves focus study concentration music' },
  { f: 111,
    name: { el: 'Η ιερή συχνότητα των αρχαίων ναών', de: 'Die heilige Frequenz der alten Tempel', en: 'The sacred frequency of ancient temples' },
    desc: {
      el: 'Το Υπόγειο Ιερό της Μάλτας (3600 π.Χ.), οι προϊστορικοί θολωτοί τάφοι της Ιρλανδίας και άλλα αρχαία ιερά αντηχούν όλα —ανεξάρτητα από μέγεθος και υλικό— ακριβώς στα 111Hz. Στη συχνότητα αυτή ο εγκέφαλος περνά σε κατάσταση βαθύ διαλογισμού: «σιωπά» η λογική και ξυπνά η δημιουργική πλευρά. Απελευθερώνει ενδορφίνες (το φυσικό παυσίπονο του σώματος), μειώνει το στρες και στηρίζει την κυτταρική επούλωση. Από τις πιο δυνατές θεραπευτικές συχνότητες.',
      de: 'Das Hypogäum von Malta (3600 v. Chr.), die prähistorischen Ganggräber Irlands und andere alte Heiligtümer resonieren alle — unabhängig von Größe und Material — exakt bei 111Hz. Bei dieser Frequenz geht das Gehirn in tiefe Meditation über: die Logik wird still und die kreative Seite erwacht. Setzt Endorphine frei (das natürliche Schmerzmittel des Körpers), baut Stress ab und unterstützt die Zellheilung. Eine der stärksten Heilfrequenzen.',
      en: 'Malta\'s Hypogeum (3600 BC), Ireland\'s prehistoric passage tombs and other ancient sanctuaries all resonate — regardless of size or material — at exactly 111Hz. At this frequency the brain shifts into deep meditation: the logical mind goes quiet and the creative side awakens. It releases endorphins (the body\'s natural painkiller), reduces stress and supports cellular healing. One of the most powerful healing frequencies.' },
    yt: '111 Hz healing frequency deep meditation music' },
  { f: 136.1,
    name: { el: 'ΟΜ — ο τόνος της Γης', de: 'OM — der Ton der Erde', en: 'OM — the tone of the Earth' },
    desc: {
      el: 'Ο ιερός τόνος «ΟΜ» της ινδικής παράδοσης: η περιφορά της Γης γύρω από τον Ήλιο «μεταφρασμένη» σε ήχο. Πάνω σε αυτόν κουρδίζονται τα όργανα για διαλογισμό και γιόγκα εδώ και αιώνες. Συντονίζεται με το τσάκρα της καρδιάς: βαθιά γαλήνη, αποδοχή, αίσθηση ενότητας με το όλον.',
      de: 'Der heilige »OM«-Ton der indischen Tradition: der Umlauf der Erde um die Sonne, in Klang »übersetzt«. Auf ihn werden seit Jahrhunderten Instrumente für Meditation und Yoga gestimmt. Er schwingt mit dem Herzchakra: tiefer Frieden, Annahme, das Gefühl von Einheit mit dem Ganzen.',
      en: 'The sacred "OM" tone of the Indian tradition: the Earth\'s orbit around the Sun "translated" into sound. Instruments for meditation and yoga have been tuned to it for centuries. It resonates with the heart chakra: deep peace, acceptance, a sense of oneness with the whole.' },
    yt: '136.1 Hz OM chant meditation music' },
  { f: 174,
    name: { el: 'Ανακούφιση πόνου — το φυσικό αναισθητικό', de: 'Schmerzlinderung — das natürliche Anästhetikum', en: 'Pain relief — the natural anaesthetic' },
    desc: {
      el: 'Η χαμηλότερη συχνότητα Solfeggio, το «φυσικό αναισθητικό» του ήχου: απαλύνει τον σωματικό πόνο, λύνει την ένταση στους μυς και δίνει στο σώμα και στα όργανα την αίσθηση ασφάλειας που χρειάζονται για να επουλωθούν. Ιδανική στο τέλος μιας κουραστικής μέρας ή πριν τον ύπνο.',
      de: 'Die tiefste Solfeggio-Frequenz, das »natürliche Anästhetikum« des Klangs: lindert körperlichen Schmerz, löst Verspannungen in den Muskeln und gibt Körper und Organen das Gefühl von Sicherheit, das sie zum Heilen brauchen. Ideal am Ende eines anstrengenden Tages oder vor dem Schlafen.',
      en: 'The lowest Solfeggio frequency, sound\'s "natural anaesthetic": it eases physical pain, releases muscle tension and gives the body and organs the sense of safety they need to heal. Perfect at the end of a tiring day or before sleep.' },
    yt: '174 Hz pain relief healing music' },
  { f: 285,
    name: { el: 'Αναγέννηση ιστών & ενέργεια', de: 'Geweberegeneration & Energie', en: 'Tissue regeneration & energy' },
    desc: {
      el: 'Η συχνότητα της κυτταρικής μνήμης: λέγεται ότι «θυμίζει» στα κύτταρα την αρχική, υγιή δομή τους και τους στέλνει σήμα ανασυγκρότησης. Χρησιμοποιείται για επούλωση τραυματισμών και πληγών, ενδυνάμωση του ανοσοποιητικού και συνολική ενεργειακή ανανέωση του οργανισμού.',
      de: 'Die Frequenz des Zellgedächtnisses: Sie soll die Zellen an ihre ursprüngliche, gesunde Struktur »erinnern« und ihnen ein Signal zum Wiederaufbau senden. Wird für die Heilung von Verletzungen und Wunden, die Stärkung des Immunsystems und die energetische Erneuerung des ganzen Organismus genutzt.',
      en: 'The frequency of cellular memory: it is said to "remind" cells of their original healthy structure and signal them to rebuild. Used for healing injuries and wounds, strengthening the immune system and renewing the body\'s overall energy.' },
    yt: '285 Hz tissue healing regeneration music' },
  { f: 396,
    name: { el: 'Απελευθέρωση από φόβο & ενοχές — Ut', de: 'Befreiung von Angst & Schuld — Ut', en: 'Release from fear & guilt — Ut' },
    desc: {
      el: 'Ο πρώτος τόνος της κλίμακας Solfeggio, συνδεδεμένος με το τσάκρα της ρίζας. Απελευθερώνει τα δύο συναισθήματα που μας κρατούν περισσότερο πίσω — τον φόβο και τις ενοχές — και μετατρέπει τη θλίψη σε χαρά. Χτίζει εσωτερική δύναμη, σταθερότητα και γείωση, βοηθώντας σε ό,τι στόχο βάλεις.',
      de: 'Der erste Ton der Solfeggio-Skala, verbunden mit dem Wurzelchakra. Er löst die zwei Gefühle, die uns am meisten zurückhalten — Angst und Schuld — und verwandelt Trauer in Freude. Baut innere Stärke, Stabilität und Erdung auf und hilft bei jedem Ziel, das du dir setzt.',
      en: 'The first tone of the Solfeggio scale, linked to the root chakra. It releases the two emotions that hold us back the most — fear and guilt — and turns grief into joy. Builds inner strength, stability and grounding, supporting whatever goal you set.' },
    yt: '396 Hz release fear guilt healing music' },
  { f: 417,
    name: { el: 'Αλλαγή & νέα ξεκινήματα — Re', de: 'Wandel & Neuanfänge — Re', en: 'Change & new beginnings — Re' },
    desc: {
      el: 'Η συχνότητα της αλλαγής: «σβήνει» τη συσσωρευμένη αρνητική ενέργεια και τα αποτυπώματα παλιών τραυματικών εμπειριών, καθαρίζοντας τον δρόμο για νέα ξεκινήματα. Ενισχύει τη δημιουργικότητα και τη διάθεση για δράση. Συνδέεται με το ιερό τσάκρα.',
      de: 'Die Frequenz der Veränderung: Sie »löscht« angesammelte negative Energie und die Spuren alter belastender Erfahrungen und macht den Weg frei für Neuanfänge. Stärkt Kreativität und Tatendrang. Verbunden mit dem Sakralchakra.',
      en: 'The frequency of change: it "clears" accumulated negative energy and the imprints of old painful experiences, opening the way for new beginnings. Boosts creativity and the drive to act. Linked to the sacral chakra.' },
    yt: '417 Hz cleanse negativity facilitate change music' },
  { f: 432,
    name: { el: 'Φυσικός συντονισμός — το κούρδισμα της φύσης', de: 'Natürliche Resonanz — die Stimmung der Natur', en: 'Natural resonance — nature\'s tuning' },
    desc: {
      el: 'Το φυσικό κούρδισμα: μαθηματικά εναρμονισμένο με τις αναλογίες που συναντάμε παντού στη φύση. Ηρεμεί την καρδιά και το νευρικό σύστημα, μειώνει το άγχος και κάνει τη μουσική να ακούγεται πιο ζεστή, απαλή και «γεμάτη».{app432}',
      de: 'Die natürliche Stimmung: mathematisch im Einklang mit den Proportionen, die wir überall in der Natur finden. Beruhigt Herz und Nervensystem, senkt Stress und lässt Musik wärmer, weicher und »voller« klingen.{app432}',
      en: 'The natural tuning: mathematically aligned with the proportions found everywhere in nature. It calms the heart and nervous system, reduces anxiety and makes music sound warmer, softer and "fuller".{app432}' },
    yt: '432 Hz healing melodies relaxing music' },
  { f: 528,
    name: { el: 'Η συχνότητα των θαυμάτων & της αγάπης — Mi', de: 'Die Frequenz der Wunder & der Liebe — Mi', en: 'The miracle & love frequency — Mi' },
    desc: {
      el: 'Η πιο διάσημη θεραπευτική συχνότητα, γνωστή ως «τόνος των θαυμάτων»: κατά την παράδοση επιδιορθώνει το DNA και επαναφέρει το σώμα στην αρχική του αρμονία. Αυξάνει την ενέργεια και τη διαύγεια, φέρνει αγάπη, ειρήνη και αισιοδοξία. Συνδέεται με το τσάκρα του ηλιακού πλέγματος — το κέντρο της αυτοπεποίθησης.',
      de: 'Die berühmteste Heilfrequenz, bekannt als »Ton der Wunder«: Der Überlieferung nach repariert sie die DNA und bringt den Körper in seine ursprüngliche Harmonie zurück. Steigert Energie und Klarheit, bringt Liebe, Frieden und Optimismus. Verbunden mit dem Solarplexuschakra — dem Zentrum des Selbstvertrauens.',
      en: 'The most famous healing frequency, known as the "miracle tone": tradition holds that it repairs DNA and restores the body to its original harmony. Raises energy and clarity, bringing love, peace and optimism. Linked to the solar plexus chakra — the centre of confidence.' },
    yt: '528 Hz love DNA repair miracle healing music' },
  { f: 639,
    name: { el: 'Σχέσεις & επικοινωνία — Fa', de: 'Beziehungen & Kommunikation — Fa', en: 'Relationships & communication — Fa' },
    desc: {
      el: 'Ο τόνος της καρδιάς: φέρνει αρμονία στις σχέσεις με τα αγαπημένα πρόσωπα και την κοινότητα γύρω σου. Καλλιεργεί κατανόηση, ανεκτικότητα και συγχώρεση, και ενισχύει την ειλικρινή επικοινωνία. Ιδανικός όταν θέλεις να επανασυνδεθείς με κάποιον — ή με τον εαυτό σου.',
      de: 'Der Ton des Herzens: Er bringt Harmonie in die Beziehungen zu deinen Liebsten und deinem Umfeld. Fördert Verständnis, Toleranz und Vergebung und stärkt die ehrliche Kommunikation. Ideal, wenn du dich mit jemandem wieder verbinden willst — oder mit dir selbst.',
      en: 'The tone of the heart: it brings harmony to your relationships with loved ones and the community around you. Cultivates understanding, tolerance and forgiveness, and strengthens honest communication. Ideal when you want to reconnect with someone — or with yourself.' },
    yt: '639 Hz relationships love connection healing music' },
  { f: 741,
    name: { el: 'Καθαρισμός & αυθεντική έκφραση — Sol', de: 'Reinigung & authentischer Ausdruck — Sol', en: 'Cleansing & authentic expression — Sol' },
    desc: {
      el: 'Η συχνότητα του καθαρισμού: λέγεται ότι βοηθά τον οργανισμό να αποβάλει τοξίνες και το μυαλό να διώξει την αρνητικότητα. Ξεκλειδώνει την αυθεντική αυτοέκφραση και τη δημιουργική λύση προβλημάτων. Συνδέεται με το τσάκρα του λαιμού — τη φωνή σου.',
      de: 'Die Frequenz der Reinigung: Sie soll dem Körper helfen, Giftstoffe auszuleiten, und dem Geist, Negativität loszulassen. Öffnet den authentischen Selbstausdruck und kreative Problemlösung. Verbunden mit dem Halschakra — deiner Stimme.',
      en: 'The frequency of cleansing: it is said to help the body flush out toxins and the mind let go of negativity. Unlocks authentic self-expression and creative problem-solving. Linked to the throat chakra — your voice.' },
    yt: '741 Hz detox cleanse aura healing music' },
  { f: 852,
    name: { el: 'Αφύπνιση διαίσθησης — La', de: 'Erwachen der Intuition — La', en: 'Awakening intuition — La' },
    desc: {
      el: 'Η συχνότητα της εσωτερικής φωνής: αφυπνίζει τη διαίσθηση, διαλύει τα σκόρπια αρνητικά μοτίβα σκέψης και επαναφέρει την πνευματική τάξη. Συνδέεται με το τσάκρα του τρίτου ματιού — για διαλογισμό, ενόραση και αυτογνωσία.',
      de: 'Die Frequenz der inneren Stimme: Sie weckt die Intuition, löst zerstreute negative Gedankenmuster auf und stellt die geistige Ordnung wieder her. Verbunden mit dem Chakra des dritten Auges — für Meditation, Einsicht und Selbsterkenntnis.',
      en: 'The frequency of the inner voice: it awakens intuition, dissolves scattered negative thought patterns and restores mental order. Linked to the third-eye chakra — for meditation, insight and self-knowledge.' },
    yt: '852 Hz awaken intuition third eye music' },
  { f: 963,
    name: { el: 'Θεϊκή συνείδηση — Si', de: 'Göttliches Bewusstsein — Si', en: 'Divine consciousness — Si' },
    desc: {
      el: 'Η «συχνότητα των θεών», ο υψηλότερος τόνος της κλίμακας: σύνδεση με την ανώτερη συνείδηση και την πηγή. Κατά την παράδοση ενεργοποιεί την επίφυση και το τσάκρα της κορώνας, χαρίζοντας καθαρό φως, φώτιση και αίσθηση ενότητας με το σύμπαν.',
      de: 'Die »Frequenz der Götter«, der höchste Ton der Skala: Verbindung mit dem höheren Bewusstsein und der Quelle. Der Überlieferung nach aktiviert sie die Zirbeldrüse und das Kronenchakra und schenkt klares Licht, Erleuchtung und das Gefühl der Einheit mit dem Universum.',
      en: 'The "frequency of the gods", the highest tone of the scale: connection with higher consciousness and the source. Tradition says it activates the pineal gland and the crown chakra, bringing pure light, illumination and a sense of unity with the universe.' },
    yt: '963 Hz pineal gland activation crown chakra music' },
];
const list = document.getElementById('tonelist');

function renderTones() {
  list.innerHTML = '';
  TONES.forEach(t => {
    const el = document.createElement('div');
    el.className = 'tonecard';
    if (pendingHeal === t.f) el.classList.add('pending');
    const ytUrl = 'https://www.youtube.com/results?search_query=' + encodeURIComponent(t.yt);
    const musOn = musicF === t.f;
    const phones = t.f < 60 ? `<span class="phones">${T('need_phones')}</span>` : '';
    el.innerHTML = `<div class="freq">${t.f}<small>Hz</small></div>
      <div class="info"><b>${t.name[LANG]}</b>${phones}<small>${t.desc[LANG].replace('{app432}', T('app432'))}</small></div>
      <div class="acts">
        <button class="mus${musOn ? ' on' : ''}" data-f="${t.f}">${T(musOn ? 'music_stop' : 'music_btn').replace('{f}', t.f)}</button>
        <button class="pl" data-f="${t.f}">${T('pure_tone')}</button>
        <a class="yt" href="${ytUrl}" target="_blank" rel="noopener">🔎 YouTube</a>
      </div>`;
    el.querySelector('.pl').onclick = () => {
      clearPendingHeal();
      const playingThis = osc && Math.abs(+tfreq.value - t.f) < 0.01;
      if (playingThis) { stopTone(); return; }
      stopMusic();
      tfreq.value = t.f;
      if (t.f >= 20 && t.f <= 2000) tslider.value = freqToSlider(t.f);
      applyFreq();
      if (!osc) startTone(); else syncUI();
    };
    el.querySelector('.mus').onclick = () => toggleMusic(t.f, el.querySelector('.mus'));
    list.appendChild(el);
  });
  syncUI();
  if (pendingHeal !== null && !healScrolled) {
    const card = list.querySelector('.tonecard.pending');
    // Δεν ξεκινάμε ήχο: ο browser το μπλοκάρει χωρίς χειρονομία. Δείχνουμε πού να πατήσει.
    // ΜΙΑ φορά μόνο: το renderTones ξανατρέχει σε κάθε αλλαγή γλώσσας, και δεν επιτρέπεται
    // να τραβήξει ξανά τη σελίδα αν ο επισκέπτης έχει κυλήσει αλλού στο μεταξύ.
    if (card) { card.scrollIntoView({ block: 'center', behavior: 'smooth' }); healScrolled = true; }
  }
}

let music = null, musicF = null;
function stopMusic() {
  if (music) { music.pause(); music.src = ''; music = null; musicF = null; }
  document.querySelectorAll('.tonecard .mus').forEach(b => {
    b.classList.remove('on'); b.textContent = T('music_btn').replace('{f}', b.dataset.f);
  });
}
function toggleMusic(f, btn) {
  clearPendingHeal();
  if (musicF === f) { stopMusic(); return; }
  stopMusic();
  stopTone();               // μη μπλέκονται τόνος + μουσική
  stopRefTone();
  stopSongPlayer();
  music = new Audio(APP.trackUrl(f));
  music.loop = true;
  music.play().catch(() => {});
  musicF = f;
  btn.classList.add('on'); btn.textContent = T('music_stop').replace('{f}', f);
}

// ---------- συντονισμός: κοινός για την πλάκα και τη σταγόνα ----------
// «Καθαρό» θεωρείται το σχήμα όταν η συχνότητα πέφτει μέσα σε ±1.2% από έναν
// φυσικό τρόπο ταλάντωσης· όσο απομακρύνεται, το crisp πέφτει ομαλά προς το 0.
const RESONANCE_TOLERANCE = 0.012;

/**
 * Ποιον τρόπο ταλάντωσης πετυχαίνει η συχνότητα f και πόσο καθαρά.
 * @param modes λίστα { mode, freq } — το `mode` είναι ό,τι θέλει ο καλών (n, ή [m,n])
 * @returns { mode, fr, crisp }  crisp: 1 = τέλειος συντονισμός, 0 = εκτός
 */
function nearestMode(modes, f) {
  let best = modes[0], bd = Infinity;
  for (const cand of modes) {
    const d = Math.abs(f - cand.freq);
    if (d < bd) { bd = d; best = cand; }
  }
  return { mode: best.mode, fr: best.freq, crisp: Math.exp(-Math.pow(bd / (f * RESONANCE_TOLERANCE), 2)) };
}

// ---------- εξαγωγή WAV ----------
// Καθαρή συνάρτηση: δεν αγγίζει DOM, ώστε να μπορεί να τρέξει και μέσα σε Web Worker.
function wavPcm(type, f, sr, n) {
  const data = new Int16Array(n), amp = 0.6, fade = sr * 0.05; // 50ms fade in/out
  for (let i = 0; i < n; i++) {
    const ph = (i * f / sr) % 1;
    let s;
    if (type === 'sine') s = Math.sin(2 * Math.PI * ph);
    else if (type === 'square') s = ph < 0.5 ? 1 : -1;
    else if (type === 'sawtooth') s = 2 * ph - 1;
    else s = ph < 0.5 ? 4 * ph - 1 : 3 - 4 * ph; // triangle
    let env = 1;
    if (i < fade) env = i / fade;
    else if (i > n - fade) env = (n - i) / fade;
    data[i] = Math.round(s * amp * env * 32767);
  }
  return data;
}

function wavFile(pcm, sr) {
  const n = pcm.length;
  const buf = new ArrayBuffer(44 + n * 2), v = new DataView(buf);
  const wstr = (o, s) => { for (let i = 0; i < s.length; i++) v.setUint8(o + i, s.charCodeAt(i)); };
  wstr(0, 'RIFF'); v.setUint32(4, 36 + n * 2, true); wstr(8, 'WAVE');
  wstr(12, 'fmt '); v.setUint32(16, 16, true); v.setUint16(20, 1, true); v.setUint16(22, 1, true);
  v.setUint32(24, sr, true); v.setUint32(28, sr * 2, true); v.setUint16(32, 2, true); v.setUint16(34, 16, true);
  wstr(36, 'data'); v.setUint32(40, n * 2, true);
  new Int16Array(buf, 44).set(pcm);
  return buf;
}

// 600 δευτερόλεπτα = ~26 εκατομμύρια δείγματα· στον κύριο thread πάγωνε η σελίδα.
// Ο κώδικας του worker φτιάχνεται από την ΙΔΙΑ wavPcm, ώστε να μην υπάρχουν δύο
// εκδοχές των μαθηματικών. Αν δεν υπάρχουν Workers, γίνεται κανονικά στη σελίδα.
function wavPcmAsync(type, f, sr, n) {
  if (typeof Worker === 'undefined') return Promise.resolve(wavPcm(type, f, sr, n));
  const src = `${wavPcm}
self.onmessage = e => { const d = wavPcm(...e.data); self.postMessage(d, [d.buffer]); };`;
  const url = URL.createObjectURL(new Blob([src], { type: 'text/javascript' }));
  return new Promise(resolve => {
    const done = pcm => { URL.revokeObjectURL(url); resolve(pcm); };
    let w;
    try { w = new Worker(url); } catch (e) { return done(wavPcm(type, f, sr, n)); }
    w.onmessage = e => { w.terminate(); done(e.data); };
    w.onerror = () => { w.terminate(); done(wavPcm(type, f, sr, n)); };
    w.postMessage([type, f, sr, n]);
  });
}

// ---------- Chladni patterns ----------
const chlCanvas = document.getElementById('chl');
const chlDropCanvas = document.getElementById('chlDrop');
const chlFreq = document.getElementById('chlFreq');
const chlSlider = document.getElementById('chlSlider');
const chlPlate = document.getElementById('chlPlate');
const chlStatus = document.getElementById('chlStatus');
// Τρόποι ταλάντωσης τετράγωνης πλάκας (m,n) με το άθροισμα m²+n² που ορίζει τη συχνότητα.
// Όρια των πεδίων συχνότητας — ίδια με τα min/max στο HTML.
const CHL_FREQ_RANGE = [200, 1000], CRY_FREQ_RANGE = [20, 2000];
const CHL_MODES = [];
for (let m = 1; m <= 9; m++) for (let n = m + 1; n <= 10; n++) CHL_MODES.push([m, n, m * m + n * n]);
// Στο 100% η πλάκα είναι κουρδισμένη ώστε τα 432Hz να πέφτουν ακριβώς στον τρόπο
// (3,5) — γι' αυτό ο διαιρέτης είναι 34 = 3² + 5².
const PLATE_REF_FREQ = 432, PLATE_REF_MODE_SUM = 3 * 3 + 5 * 5;

function findPlateResonance(f, pct) {
  const k = (PLATE_REF_FREQ / PLATE_REF_MODE_SUM) * (pct / 100);
  return nearestMode(CHL_MODES.map(([m, n, s]) => ({ mode: [m, n], freq: k * s })), f);
}

function drawChladni(canvas) {
  canvas = canvas || chlCanvas;
  const f = Math.min(CHL_FREQ_RANGE[1], Math.max(CHL_FREQ_RANGE[0], +chlFreq.value || 432));
  const { mode: [bm, bn], fr: bf, crisp } = findPlateResonance(f, +chlPlate.value);
  const W = canvas.width, H = canvas.height;
  const g = canvas.getContext('2d');
  const img = g.createImageData(W, H);
  const sigma = 0.06 + (1 - crisp) * 0.5; // εκτός συντονισμού → θολές γραμμές
  for (let y = 0; y < H; y++) {
    const v = y / (H - 1);
    const cmv = Math.cos(bm * Math.PI * v), cnv = Math.cos(bn * Math.PI * v);
    for (let x = 0; x < W; x++) {
      const u = x / (W - 1);
      const a = Math.cos(bn * Math.PI * u) * cmv - Math.cos(bm * Math.PI * u) * cnv;
      let s = Math.exp(-(a * a) / (sigma * sigma)) * (0.25 + 0.75 * crisp);
      if (crisp < 0.85) s = s * crisp + (1 - crisp) * Math.random() * 0.25; // σκόρπια άμμος
      const i = (y * W + x) * 4;
      img.data[i] = 24 + 231 * s; img.data[i + 1] = 16 + 183 * s; img.data[i + 2] = 48 + 59 * s;
      img.data[i + 3] = 255;
    }
  }
  g.putImageData(img, 0, 0);
  if (canvas !== chlCanvas) return;    // εξαγωγή εικόνας: μην πειράζεις την ορατή διεπαφή
  document.getElementById('chlPlateVal').textContent = (+chlPlate.value).toFixed(1).replace('.0', '') + '%';
  chlStatus.textContent = (crisp > 0.6 ? T('chl_on') : T('chl_off')).replace('{f}', bf.toFixed(1));
  chlStatus.style.color = crisp > 0.6 ? 'var(--accent)' : 'var(--muted)';
}
function refreshChl() {   // η λίστα drop ανανεώνεται μόνη της κάθε frame
  if (chlShape !== 'drop') drawChladni();
  pushUrl();
}

// ---------- water-drop star mode (Rayleigh drop-oscillation formula) ----------
const DROP_SIGMA = 0.072, DROP_RHO = 1000; // επιφανειακή τάση (N/m) & πυκνότητα (kg/m³) νερού
// ακτίνα σταγόνας (m) στο 100%: λυμένη από τον τύπο Rayleigh ώστε n=5 -> ακριβώς 432.0Hz
const DROP_R0 = 0.00111014;
const DROP_N_MIN = 2, DROP_N_MAX = 10;
// Πόσο μπορεί να αλλάξει το μέγεθος. Η σταγόνα θέλει φαρδύτερο εύρος από την πλάκα:
// f ∝ R^(−3/2) και οι τρόποι ταλάντωσής της απέχουν πολύ χαμηλά, οπότε με 90–110%
// υπήρχαν συχνότητες (≈237–266Hz και ≈366–371Hz) που ΔΕΝ έβγαζαν ποτέ καθαρό αστέρι.
// Με 85–120% κάθε συχνότητα 200–1000Hz έχει το μέγεθος που τη βγάζει καθαρή.
const PLATE_SIZE_RANGE = [90, 110], DROP_SIZE_RANGE = [85, 120];

function dropFn(n, R) {
  return (1 / (2 * Math.PI)) * Math.sqrt(n * (n - 1) * (n + 2) * DROP_SIGMA / (DROP_RHO * Math.pow(R, 3)));
}

function findDropResonance(f, pct) {
  const R = DROP_R0 * (pct / 100);
  const modes = [];
  for (let n = DROP_N_MIN; n <= DROP_N_MAX; n++) modes.push({ mode: n, freq: dropFn(n, R) });
  const { mode: n, fr, crisp } = nearestMode(modes, f);
  return { n, fr, crisp };     // n = πόσες αιχμές έχει το αστέρι
}

// ---------- 3D γεωμετρία σταγόνας (sectoral σφαιρική αρμονική Y_n^n) ----------
// Το πλήθος δακτυλίων ΠΡΕΠΕΙ να είναι ζυγό: το τεστ του ισημερινού διαβάζει τον
// δακτύλιο rings/2 και θέλει να πέφτει ακριβώς πάνω στο φ=π/2.
const DROP_RINGS = 28, DROP_SEGS = 64;

// ΚΑΘΑΡΗ ΣΥΝΑΡΤΗΣΗ: οι κορυφές της παραμορφωμένης σφαίρας σε μοναδιαίο χώρο.
//   r(θ,φ) = [1 + amp · sinⁿ(φ) · cos(nθ − rot)] · (1 − obl · cos²φ)
// Ο όρος sinⁿ(φ) κάνει το σχήμα sectoral: η παραμόρφωση κορυφώνεται στον ισημερινό και
// σβήνει στους πόλους — δηλαδή αυλακωτή σφαίρα με n λοβούς, το «αστέρι με n αιχμές».
// ΣΤΟΝ ΙΣΗΜΕΡΙΝΟ ο τύπος πέφτει πάνω στον παλιό δισδιάστατο — αυτό το φρουρεί το probe.
// Ο όρος (1 − obl·cos²φ) είναι το πεπλάτυσμα της ακουστικής παγίδας. Είναι ΑΚΡΙΒΩΣ 1
// στον ισημερινό (cos φ = 0), οπότε η ταυτότητα από πάνω ΔΕΝ πειράζεται καθόλου.
// Η προεπιλογή obl = 0 είναι δέσμευση, όχι ευκολία: κρατάει το εφεδρικό μονοπάτι και
// τους έλεγχους 1–6 του probe αυτολεξεί ίδιους.
function dropMesh(n, amp, rot, rings, segs, obl) {
  rings = rings || DROP_RINGS;
  segs = segs || DROP_SEGS;
  obl = obl || 0;
  const verts = [];
  for (let i = 0; i <= rings; i++) {
    const phi = (i / rings) * Math.PI;
    const sp = Math.sin(phi), cp = Math.cos(phi);
    const lobe = Math.pow(sp, n);          // sinⁿ(φ): 0 στους πόλους, 1 στον ισημερινό
    const flat = 1 - obl * cp * cp;        // πεπλάτυσμα: 1 στον ισημερινό, 1−obl στους πόλους
    for (let j = 0; j <= segs; j++) {
      const th = (j / segs) * Math.PI * 2;
      const r = (1 + amp * lobe * Math.cos(n * th - rot)) * flat;
      verts.push({ x: r * sp * Math.cos(th), y: r * cp, z: r * sp * Math.sin(th), r: r });
    }
  }
  return { verts: verts, rings: rings, segs: segs };
}

// ΚΑΘΑΡΗ ΣΥΝΑΡΤΗΣΗ: yaw γύρω από τον κατακόρυφο άξονα y, μετά pitch γύρω από τον x.
// Ορθή προβολή — κρατάμε το z ως βάθος, και για την ταξινόμηση και για το κόψιμο
// των πίσω επιφανειών. Άξονες θέασης: x δεξιά, y πάνω, z προς τον θεατή.
function projectMesh(verts, yaw, pitch) {
  const cy = Math.cos(yaw), sy = Math.sin(yaw);
  const cx = Math.cos(pitch), sx = Math.sin(pitch);
  const out = new Array(verts.length);
  for (let i = 0; i < verts.length; i++) {
    const v = verts[i];
    const x1 = v.x * cy + v.z * sy;
    const z1 = -v.x * sy + v.z * cy;
    out[i] = { x: x1, y: v.y * cx - z1 * sx, z: v.y * sx + z1 * cx };
  }
  return out;
}

// ---------- η φυσική της ακουστικής παγίδας, καθαρές συναρτήσεις ----------
// Πόσο πλατένει η ακουστική πίεση τη σταγόνα. Μια αληθινή αιωρούμενη σταγόνα ΔΕΝ είναι
// σφαίρα: η πίεση του ήχου τη σπρώχνει από πάνω και από κάτω και τη κάνει δισκάκι.
const DROP_OBLATE = 0.28;
// Ο ρυθμός που αναπνέουν οι λοβοί, σε rad/s της φάσης κίνησης (ΟΧΙ της συχνότητας ήχου).
const DROP_PULSE_W = 1.9;

// ΣΤΑΣΙΜΟ κύμα, όχι τρεχούμενη φάση. Στην πραγματικότητα οι λοβοί μεγαλώνουν, χάνονται
// περνώντας από τη σφαίρα, και ξαναβγαίνουν — η σταγόνα δεν στριφογυρίζει σαν στερεό.
// Το κάτω φράγμα 0.35 κρατά το αστέρι αναγνωρίσιμο στο πέρασμα, αλλιώς η καρτέλα δείχνει
// μια στιγμή σκέτη μπάλα και ο χρήστης νομίζει ότι χάλασε.
function dropPulse(phase) {
  return 0.675 + 0.325 * Math.sin(phase * DROP_PULSE_W);
}

// Το λίκνισμα μέσα στην παγίδα. Δύο ασύμμετρες περίοδοι, ώστε να μη φαίνεται μηχανικό.
// ΜΗΔΕΝ ΑΚΡΙΒΩΣ στη φάση 0: οι υπογραφές καμβά του golden ζωγραφίζονται στη φάση 0 και
// πρέπει να είναι επαναλήψιμες στο pixel.
function dropBob(phase) {
  return { x: Math.sin(phase * 0.63) * 0.014, y: Math.sin(phase * 0.91) * 0.022 };
}

// Η ΚΑΜΕΡΑ — και είναι ΑΛΛΟ ΠΡΑΓΜΑ από το rot της φυσικής. Το rot είναι η φάση του
// κύματος και τρέχει μόνο του· αυτά εδώ είναι η ματιά του χρήστη και αλλάζουν μόνο
// όταν σύρει. Η σταγόνα πάλλεται ακόμα κι όταν κανείς δεν την αγγίζει.
// Η ΠΡΟΕΠΙΛΕΓΜΕΝΗ ΓΩΝΙΑ ΕΙΝΑΙ ΜΕΡΟΣ ΤΟΥ ΑΠΟΤΕΛΕΣΜΑΤΟΣ, ΟΧΙ ΔΙΑΚΟΣΜΗΣΗ.
// Στις 20 μοίρες κοιτάς τη σταγόνα από ψηλά και οι λοβοί του ισημερινού προβάλλονται
// σαν δύο «αυτιά» στα πλάγια — μοιάζει με πλάσμα, όχι με σταγόνα. Στις 8 μοίρες
// βλέπεις ό,τι δείχνουν οι αληθινές φωτογραφίες ακουστικής αιώρησης: πεπλατυσμένο
// δισκάκι με κυματιστό χείλος. Ο χρήστης μπορεί να γυρίσει όπου θέλει· αυτή είναι
// απλώς η πρώτη ματιά, και η πρώτη ματιά ήταν ακριβώς το παράπονο.
const DROP_YAW0 = 22 * Math.PI / 180, DROP_PITCH0 = 8 * Math.PI / 180;
const DROP_PITCH_MAX = 85 * Math.PI / 180;   // πιο πέρα αναποδογυρίζει και χάνεσαι
let dropYaw = DROP_YAW0, dropPitch = DROP_PITCH0;

let chlShape = 'plate'; // 'plate' | 'drop'
let chlRaf = null;

// Η ράμπα φωτισμού της σταγόνας, σε ΔΥΟ τμήματα. Με μία ίσια ράμπα οι τρεις χρωματικές
// συνιστώσες ανεβαίνουν σχεδόν παράλληλα, η κορεσμός πέφτει και το χρυσό ξεθωριάζει σε
// μπεζ. Έτσι οι μεσαίοι τόνοι προσγειώνονται στο #ffc76b — το κεχριμπαρένιο της
// εφαρμογής — και μόνο η αιχμή του φωτός φτάνει στο ανοιχτό #ffe6bd.
const AMBER_K = 0.72;
function dropShade(t) {
  if (t <= AMBER_K) {
    const u = t / AMBER_K;
    return 'rgb(' + Math.round(25 + 230 * u) + ',' + Math.round(10 + 189 * u) + ',' +
      Math.round(3 + 104 * u) + ')';
  }
  const u = (t - AMBER_K) / (1 - AMBER_K);
  return 'rgb(255,' + Math.round(199 + 31 * u) + ',' + Math.round(107 + 82 * u) + ')';
}

// ---------- WebGL2: η σταγόνα ως αληθινό νερό ----------
// Ιχνηλατούμε ακτίνες στην ΑΝΑΛΥΤΙΚΗ επιφάνεια — μηδέν κορυφές, μηδέν φατσέτες. Ο λόγος
// που φύγαμε από το πλέγμα δεν ήταν οι φατσέτες: το spike ζωγράφισε τον χρυσό υλικό
// per-pixel, τελείως λείο, κι έμεινε μπεζ ζυμαρικό. Φταίει το ΥΛΙΚΟ — το νερό δεν έχει
// δικό του χρώμα, είναι ανάκλαση, διάθλαση και Fresnel.
//
// ΠΡΟΣΟΧΗ: ο shader ζει σε template literal. Ένα ανάστροφο εισαγωγικό οπουδήποτε μέσα
// του — ΑΚΟΜΑ ΚΑΙ ΣΕ ΣΧΟΛΙΟ — κόβει το literal και η σελίδα δεν φορτώνει καθόλου.
// Τα σχόλια εδώ μέσα χρησιμοποιούν «γωνιακά». Συνέβη στο spike.
const DROP_FS = `#version 300 es
precision highp float;
out vec4 fragColor;
uniform vec2  uRes;
uniform float uAmp, uTime, uYaw, uPitch, uStars, uObl, uPulse;
uniform vec2  uRotCS;   // (cos rot, sin rot) — έτοιμο, ίδιο για όλο το καρέ
uniform int   uN, uVariant, uDebug;
uniform vec2  uBob;

const float PI = 3.14159265;

// ---- το σχήμα: sectoral σφαιρική αρμονική Y_n^n, όπως έχει η εφαρμογή
//      r(θ,φ) = 1 + amp · pulse · sinⁿ(φ) · cos(nθ − rot)   (θ = atan2(z,x), φ από τον +y)
// ΝΕΟ 1: το «pulse» είναι ΣΤΑΣΙΜΟ κύμα, από −1 ώς +1. Στην αληθινή αιωρούμενη σταγόνα
//        οι λοβοί ΑΝΑΠΝΕΟΥΝ μέσα-έξω και περνούν από τη σφαίρα· δεν στριφογυρίζει
//        σαν στερεό. Η περιστροφή μένει, αλλά αργή, από πάνω.
// ΝΕΟ 2: το «uObl» πλατένει τη σταγόνα, όπως κάνει η ακουστική πίεση στην παγίδα.
//        Ο όρος (1 − e·cos²φ) είναι ΑΚΡΙΒΩΣ 1 στον ισημερινό (cos φ = 0), άρα η
//        ταυτότητα με τον δισδιάστατο τύπο — το τεστ του golden.py — ΔΕΝ πειράζεται.
// ΧΩΡΙΣ ΚΑΜΙΑ ΥΠΕΡΒΑΤΙΚΗ ΣΥΝΑΡΤΗΣΗ. Η rad() καλείται ~250 φορές ΑΝΑ PIXEL (ιχνηλάτηση
// εισόδου + εξόδου + κλίση, επί 4 δείγματα), και η παλιά της μορφή έκανε κάθε φορά
// acos + atan + sin + cos + pow με ΔΕΚΑΔΙΚΟ εκθέτη (= exp(n·log x)). Σε Intel HD 3000
// αυτό είναι ό,τι ακριβότερο υπάρχει, και ΑΥΤΟ ήταν που δεν άφηνε περιθώριο να γίνει
// σωστά η ιχνηλάτηση. Και τα τρία φεύγουν με άλγεβρα, ΧΩΡΙΣ αλλαγή στο σχήμα:
//   sin φ = ρ/L  όπου ρ = |(x,z)|      -> ούτε acos ούτε sin
//   sinⁿφ        -> n πολλαπλασιασμοί στον ίδιο βρόχο
//   cos(nθ − rot) = cos nθ · cos rot + sin nθ · sin rot, και τα cos nθ, sin nθ βγαίνουν
//   από την αναδρομή του Chebyshev πάνω στο (cos θ, sin θ) = (x/ρ, z/ρ) -> ούτε atan
//   ούτε cos. Το (cos rot, sin rot) έρχεται έτοιμο ως uniform: είναι ίδιο για όλο το καρέ.
float rad(vec3 p){
  float L    = max(length(p), 1e-6);
  float cphi = clamp(p.y / L, -1.0, 1.0);
  float rho  = max(length(p.xz), 1e-9);
  float u    = p.x / rho, v = p.z / rho;   // cos θ, sin θ
  float sphi = rho / L;                    // sin φ, πάντα ≥ 0 — ταυτόσημο με το παλιό
  float c = 1.0, s = 0.0, lobe = 1.0;
  for (int i = 0; i < uN; i++){            // uniform όριο: ίδιο για ΟΛΑ τα pixel
    float c2 = c * u - s * v;              // (cos kθ, sin kθ) -> (cos (k+1)θ, sin (k+1)θ)
    s = s * u + c * v; c = c2;
    lobe *= sphi;
  }
  float star = 1.0 + uAmp * uPulse * lobe * (c * uRotCS.x + s * uRotCS.y);
  return star * (1.0 - uObl * cphi * cphi);
}
float F(vec3 p){ return length(p) - rad(p); }   // <0 μέσα, >0 έξω

vec3 grad(vec3 p){
  float e = 0.0016;
  return normalize(vec3(
    F(p + vec3(e,0,0)) - F(p - vec3(e,0,0)),
    F(p + vec3(0,e,0)) - F(p - vec3(0,e,0)),
    F(p + vec3(0,0,e)) - F(p - vec3(0,0,e))));
}

// αντικείμενο -> κάμερα (ΙΔΙΑ σειρά με το projectMesh: yaw γύρω από y, μετά pitch γύρω από x)
mat3 camM(){
  float cy = cos(uYaw),   sy = sin(uYaw);
  float cx = cos(uPitch), sx = sin(uPitch);
  // x1 = x·cy + z·sy ;  z1 = −x·sy + z·cy ;  y2 = y·cx − z1·sx ;  z2 = y·sx + z1·cx
  // Αναλυμένο σε γραμμές:  [ cy, 0, sy ; sx·sy, cx, −sx·cy ; −cx·sy, sx, cx·cy ]
  // Η mat3 της GLSL παίρνει ΣΤΗΛΕΣ, όχι γραμμές — εδώ είχα βάλει λάθος πρόσημο στη
  // τρίτη στήλη και ο πίνακας έπαυε να είναι στροφή (οι γραμμές δεν ήταν κάθετες).
  return mat3(
    vec3( cy,     sx * sy,  -cx * sy ),   // στήλη 0 = εικόνα του e_x
    vec3( 0.0,    cx,        sx      ),   // στήλη 1 = εικόνα του e_y
    vec3( sy,    -sx * cy,   cx * cy )    // στήλη 2 = εικόνα του e_z
  );
}

float hash(vec2 p){ return fract(sin(dot(p, vec2(41.3, 289.7))) * 43758.5453); }

// το φόντο της εφαρμογής (#1d1440 -> #120b28), προαιρετικά με αστέρια
vec3 bg(vec2 uv){
  float d = length(uv);
  vec3 c = mix(vec3(0.114,0.078,0.251), vec3(0.071,0.043,0.157), clamp(d/1.45, 0.0, 1.0));
  if (uStars > 0.5){
    vec2 g = uv * 7.0, id = floor(g), fr = fract(g) - 0.5;
    float h = hash(id);
    if (h > 0.82){
      vec2 off = (vec2(hash(id + 7.3), hash(id + 13.1)) - 0.5) * 0.7;
      float s = smoothstep(0.30, 0.0, length(fr - off));
      float tw = 0.55 + 0.45 * sin(uTime * 1.6 + h * 37.0);
      c += vec3(0.88,0.86,1.0) * s * 0.85 * tw;
    }
  }
  // ΤΟ ΒΑΣΙΚΟ ΛΑΘΟΣ ΤΗΣ ΠΡΩΤΗΣ ΔΟΚΙΜΗΣ: αυτά τα χρώματα είναι sRGB (κλεμμένα από το
  // CSS της εφαρμογής), και στο τέλος περνούσαν ΞΑΝΑ από γάμμα — δηλαδή δύο φορές.
  // Το φόντο ξεπλενόταν σε λιλά, τα σκοτάδια εξαφανίζονταν, και η σταγόνα έβγαινε
  // θαμπή κεραμική. Ο φωτισμός θέλει ΓΡΑΜΜΙΚΟ χώρο· η κωδικοποίηση γίνεται μια φορά.
  return pow(c, vec3(2.2));
}

// «στούντιο» περιβάλλον. ΑΥΤΟ είναι το κλειδί: το νερό δεν έχει δικό του χρώμα — ό,τι
// βλέπεις πάνω του είναι ΑΝΑΚΛΑΣΗ. Σε σκοτεινό περιβάλλον μια σταγόνα βγαίνει σκούρο
// γυάλινο χαλίκι (αυτό ήταν η πρώτη μου δοκιμή). Χρειάζεται κάτι ΦΩΤΕΙΝΟ να ανακλά:
// ένα μεγάλο απαλό «παράθυρο» πάνω αριστερά, μια κοφτή κηλίδα μέσα του, κι ένα ψυχρό
// γέμισμα από κάτω δεξιά που ξεχωρίζει το κάτω χείλος από το φόντο.
const vec3 KEYDIR = normalize(vec3(-0.42, 0.62, 0.66));
vec3 env(vec3 d, vec3 keyCol){
  vec3 L2 = normalize(vec3( 0.58,-0.36, 0.42));
  float kd = max(dot(d, KEYDIR), 0.0);
  // ΓΙΑΤΙ ΑΛΛΑΞΑΝ: με εκθέτη 1400 η κηλίδα ήταν τόσο μικρή που έπεφτε ΑΝΑΜΕΣΑ στα
  // pixel και δεν φαινόταν ποτέ ολόκληρη — δηλαδή ο shader είχε λάμψη που η οθόνη δεν
  // έβλεπε. Πιο φαρδιά και λιγότερο εκρηκτική φαίνεται ΠΕΡΙΣΣΟΤΕΡΟ.
  float spec   = pow(kd, 420.0) * 150.0;    // η κοφτή κηλίδα — τώρα πιάνεται από το pixel
  // Το «παράθυρο» και το «γύρισμα» ανέβαζαν ΟΛΗ την επιφάνεια, και η σταγόνα έβγαινε
  // γαλακτερή σαν αμμοβολισμένο γυαλί. Το νερό θέλει ΑΝΤΙΘΕΣΗ: σκοτάδι δίπλα σε λάμψη.
  float window = pow(kd,   30.0) * 0.70;
  float wide   = pow(kd,    3.0) * 0.10;
  float kd2    = max(dot(d, L2), 0.0);
  float fill   = pow(kd2, 11.0) * 0.26;
  float spec2  = pow(kd2, 300.0) * 45.0;    // η ΔΕΥΤΕΡΗ, μικρότερη κηλίδα
  // σκοτεινός ουρανός ΕΠΙΤΗΔΕΣ: αν όλο το περιβάλλον είναι φωτεινό, το νερό βγαίνει
  // γάλα. Η αντίθεση είναι αυτή που το κάνει νερό — βαθύ σκοτάδι, κοφτή λάμψη.
  vec3 sky = mix(vec3(0.010,0.013,0.028), vec3(0.11,0.14,0.24), clamp(d.y*0.5+0.5, 0.0, 1.0));
  return sky + keyCol * (spec + window + wide)
             + vec3(0.42,0.62,1.0) * fill + vec3(0.62,0.78,1.0) * spec2;
}

// Χρωματίζει ΕΝΑ δείγμα και επιστρέφει ΓΡΑΜΜΙΚΟ χρώμα. Η γάμμα μπαίνει μία φορά, στη
// main(), αφού μέσοι όροι χρωμάτων έχουν νόημα μόνο σε γραμμικό χώρο.
vec3 shade(vec2 uv){
  // Το gl_FragCoord.y μετράει ΠΡΟΣ ΤΑ ΠΑΝΩ (0 = κάτω άκρη), σε αντίθεση με τον καμβά 2D.
  // Άρα το uv είναι ήδη y-πάνω και ταιριάζει με τον χώρο κάμερας. Αν το αναστρέψουμε
  // «για να μοιάσει με τον 2D», η σταγόνα γυρίζει ανάποδα και το φως έρχεται από κάτω.
  vec3 base = bg(uv);

  // απαλή άλως, όπως η σημερινή (σε γραμμικό χώρο -> πολύ μικρότερος συντελεστής)
  base += vec3(1.0,0.60,0.25) * 0.035 * smoothstep(0.95, 0.0, length(uv));

  // ΑΙΩΡΕΙΤΑΙ: λικνίζεται ελαφρά μέσα στην ακουστική παγίδα. Μετακινούμε ΜΟΝΟ τη
  // σταγόνα, όχι το φόντο — έτσι τη βλέπεις να πλανιέται πάνω από τα αστέρια.

  float R  = 1.0 + uAmp;                         // σφαίρα-φράχτης, κολλητά στην επιφάνεια
  vec2  q  = (uv - uBob) / 0.60;                 // ακτίνα σταγόνας 1 == 0.60 του μισού πλάτους
  // ΜΠΛΕ στο debug: σημαδεύει το «σίγουρα έξω». Χωρίς αυτό το τεστ δεν μπορεί να πει
  // ποιο κόκκινο είναι νόμιμο φόντο ΓΥΡΩ από τη σταγόνα και ποιο είναι τρύπα ΜΕΣΑ της,
  // γιατί το κόκκινο δεν αγγίζει ποτέ την άκρη του καμβά για να ξεκινήσει η πλημμύρα.
  if (dot(q,q) > R*R) return (uDebug == 1) ? vec3(0.0, 0.0, 4.0) : base;

  mat3 M  = camM();
  mat3 Mi = transpose(M);                        // στροφή -> ανάστροφη = αντίστροφη

  float zEnter = sqrt(max(R*R - dot(q,q), 1e-6));
  vec3 roCam = vec3(q, zEnter);                  // ορθή προβολή, ίδια με την εφαρμογή
  vec3 rdCam = vec3(0.0, 0.0, -1.0);
  vec3 ro = Mi * roCam, rd = Mi * rdCam;

  // --- πρώτη επιφάνεια. Ξεκινάμε ΠΑΝΩ στον φράχτη, άρα είμαστε ήδη σχεδόν στο δέρμα.
  float t = 0.0, tMax = 2.0 * zEnter;
  bool hit = false;
  // ΤΟ ΣΦΑΛΜΑ ΠΟΥ ΕΚΟΒΕ ΤΟΥΣ ΛΟΒΟΥΣ, ΚΑΙ ΓΙΑΤΙ ΤΟ ΜΟΝΟΠΑΤΙ ΕΙΝΑΙ ΔΙΠΛΟ.
  // Το F δεν είναι αληθινή απόσταση — είναι length(p) − rad(p) — και υποτιμά χοντρά την
  // απόσταση όταν η ακτίνα περνάει ΞΥΣΤΑ. Εκεί ο ιχνηλάτης σέρνεται με βήματα 0.004 και
  // τα 28 βήματα τελειώνουν ΠΡΙΝ αγγίξει: το pixel γυρίζει φόντο, και με n=5 (432Hz),
  // όπου η επιφάνεια έχει βαθιά φαράγγια, ο λοβός φαινόταν ΑΠΟΚΟΜΜΕΝΟΣ — «αυτιά».
  // Με n=2 (240Hz) η επιφάνεια είναι σχεδόν σφαίρα και δεν φαινόταν τίποτα· γι' αυτό
  // επέζησε. Επαληθεύτηκε βάφοντας κόκκινο την αστοχία (uDebug) — δες dropTraceSig.
  //
  // Η ΘΕΡΑΠΕΙΑ ΕΙΝΑΙ ΔΥΟ ΜΟΝΟΠΑΤΙΑ, ΓΙΑΤΙ ΤΟ ΕΝΑ ΔΕΝ ΦΤΑΝΕΙ:
  //  - σκέτη αύξηση βημάτων (28->96): καθάρισε την εικόνα, ΕΡΙΞΕ τα fps στα 38.
  //  - σκέτη σάρωση παντού: σταθερό κόστος, αλλά το πληρώνουν ΟΛΑ τα pixel.
  // Τα ξυστά pixel είναι μειοψηφία: κρατάμε το γρήγορο sphere tracing για όλους και
  // πληρώνουμε τη σάρωση ΜΟΝΟ όπου αυτό ξέμεινε από βήματα — που είναι, ακριβώς, το
  // σημάδι ότι σερνόταν. Αν βγήκε από τον φράχτη, η αστοχία είναι ΓΝΗΣΙΑ: δεν ψάχνουμε.
  bool starved = true;
  for (int i = 0; i < 28; i++){
    float d = F(ro + rd*t);
    if (d < 0.0009){ hit = true; starved = false; break; }
    t += max(d * 0.40, 0.004);
    if (t > tMax){ starved = false; break; }
  }
  if (!hit && starved){
    // ΟΜΟΙΟΜΟΡΦΗ ΣΑΡΩΣΗ: δεν σέρνεται ποτέ, γιατί το βήμα δεν εξαρτάται από το F.
    // Ψάχνει αλλαγή προσήμου και μετά διχοτομεί — 7 διχοτομήσεις = dt/128 ≈ 0.0006,
    // δηλαδή η ίδια ακρίβεια με το κατώφλι του γρήγορου μονοπατιού.
    // ΔΕΝ ΣΑΡΩΝΟΥΜΕ ΑΠΟ ΤΗΝ ΑΡΧΗ. Το γρήγορο μονοπάτι έφτασε ήδη ώς το t με βήματα
    // 0.40·F, και για το εύρος που δέχεται η εφαρμογή (n·amp ≤ ~2) αυτό είναι μέσα στο
    // όριο Lipschitz της rad, άρα δεν προσπέρασε επιφάνεια. Κρατάμε μικρό περιθώριο
    // πίσω για τα ακραία n. Έτσι το ίδιο πλήθος δειγμάτων πέφτει σε ΜΙΚΡΟΤΕΡΟ διάστημα:
    // και φθηνότερο, και πιο ακριβές.
    const int NS = 20;
    float t0s = max(0.0, t - 0.10);
    float dt = (tMax - t0s) / float(NS), tPrev = t0s;
    for (int i = 1; i <= NS; i++){
      float ti = t0s + float(i) * dt;
      if (F(ro + rd*ti) < 0.0){
        float lo = tPrev, hi = ti;
        for (int k = 0; k < 7; k++){
          float m = 0.5 * (lo + hi);
          if (F(ro + rd*m) < 0.0) hi = m; else lo = m;
        }
        t = hi; hit = true; break;
      }
      tPrev = ti;
    }
  }
  if (!hit) return (uDebug == 1) ? vec3(4.0, 0.0, 0.0) : base;

  vec3 pObj = ro + rd*t;
  vec3 nObj = grad(pObj);
  vec3 N = normalize(M * nObj);
  vec3 V = vec3(0.0, 0.0, 1.0);                  // ορθή προβολή -> ο θεατής είναι πάντα +z

  vec3 keyCol = (uVariant == 1) ? vec3(1.0,0.80,0.48) : vec3(1.0,0.97,0.93);

  // ---------- ΠΑΡΑΛΛΑΓΗ 2: ό,τι έχει ΤΩΡΑ η εφαρμογή (χρυσό Lambert, συμπαγές)
  if (uVariant == 2){
    float lit = max(dot(N, normalize(vec3(-0.40,0.60,0.69))), 0.0);
    vec3 col = (lit <= 0.72)
      ? mix(vec3(0.098,0.039,0.012), vec3(1.0,0.780,0.420), lit/0.72)
      : mix(vec3(1.0,0.780,0.420), vec3(1.0,0.902,0.741), (lit-0.72)/0.28);
    // ΧΩΡΙΣ γάμμα: αυτά τα χρώματα αντιγράφηκαν αυτολεξεί από το dropShade της
    // εφαρμογής, που τα γράφει κατευθείαν ως sRGB. Έτσι η σύγκριση είναι δίκαιη.
    // pow 2.2: γυρνάμε σε ΓΡΑΜΜΙΚΟ, γιατί η γάμμα μπαίνει πια μία φορά στη main().
    return pow(col, vec3(2.2));
  }

  // ---------- νερό: Fresnel ανάμεσα σε ΑΝΑΚΛΑΣΗ και ΔΙΑΘΛΑΣΗ
  float ct = max(dot(N, V), 0.0);
  float fres = 0.02 + 0.98 * pow(1.0 - ct, 5.0);

  vec3 reflCol = env(reflect(-V, N), keyCol);

  // --- δεύτερη επιφάνεια: η σταγόνα δουλεύει ως ΦΑΚΟΣ, το πίσω μέρος γυρίζει ανάποδα
  vec3 rIn = refract(-V, N, 1.0/1.333);
  vec3 rInObj = normalize(Mi * rIn);
  float t2 = 0.006, thick = 0.0;
  // ΤΑ 20 ΒΗΜΑΤΑ ΔΕΝ ΕΦΤΑΝΑΝ, ΚΑΙ ΤΟ ΠΛΗΡΩΣΑΜΕ ΜΕ ΕΙΚΟΝΑ: στο κέντρο, όπου το πάχος
  // είναι μεγαλύτερο, η δέσμη δεν έβγαινε ποτέ και το σημείο εξόδου έμενε ΜΕΣΑ στο σώμα.
  // Αποτέλεσμα: μια σκούρα οδοντωτή κηλίδα στη μέση, σαν σκισμένο χαρτί.
  // Η σωστή οικονομία ΔΕΝ είναι λιγότερα βήματα — είναι ΜΕΓΑΛΥΤΕΡΟ βήμα. Το εσωτερικό
  // είναι ομαλό (καμία κοντινή επιφάνεια να προσπεράσουμε), οπότε 0.75 αντί 0.40
  // συγκλίνει στα ίδια βήματα χωρίς να χάνει την επιφάνεια εξόδου.
  // Η ΕΞΟΔΟΣ ΕΙΧΕ ΤΟ ΙΔΙΟ ΣΦΑΛΜΑ, ΔΕΥΤΕΡΗ ΦΟΡΑ. Το παλιό σχόλιο έλεγε ότι «μεγαλύτερο
  // βήμα» έλυσε την εξάντληση· δεν τη έλυσε, τη ΜΕΤΑΚΙΝΗΣΕ σε άλλες γωνίες, όπου η
  // δέσμη δεν έβγαινε ΠΟΤΕ από το νερό και το pixel έβγαινε σκοτεινή ραφή στο σώμα.
  bool exited = false, starved2 = true;
  for (int i = 0; i < 30; i++){
    float d = F(pObj + rInObj*t2);
    if (d > -0.0009){ exited = true; starved2 = false; break; }
    t2 += max(-d * 0.75, 0.008);
    if (t2 > 3.0){ starved2 = false; break; }
  }
  if (!exited && starved2){
    const int NS2 = 24;
    float dt2 = 2.60 / float(NS2);       // η διάμετρος δεν ξεπερνά το 2(1+amp) ≈ 2.56
    for (int i = 1; i <= NS2; i++){
      float ti = t2 + float(i) * dt2;
      if (F(pObj + rInObj*ti) > 0.0){
        float lo = ti - dt2, hi = ti;
        for (int k = 0; k < 6; k++){
          float m = 0.5 * (lo + hi);
          if (F(pObj + rInObj*m) > 0.0) hi = m; else lo = m;
        }
        t2 = hi; exited = true; break;
      }
    }
  }
  if (!exited && uDebug == 1) return vec3(0.0, 4.0, 0.0);
  thick = t2;
  vec3 pExitObj = pObj + rInObj*t2;
  vec3 nExit = normalize(M * grad(pExitObj));
  vec3 pExitCam = M * pExitObj;

  // ΟΛΙΚΗ ΕΣΩΤΕΡΙΚΗ ΑΝΑΚΛΑΣΗ. Εκεί που η δέσμη δεν μπορεί να βγει, πριν δειγματοληπτούσαμε
  // ΠΑΛΙ το φόντο — που είναι σχεδόν μαύρο — και η σταγόνα έβγαζε δύο σκούρες χαρακιές
  // στα πλάγια που διαβάζονταν ως ΡΩΓΜΕΣ. Στο αληθινό νερό αυτές οι περιοχές είναι ΦΩΤΕΙΝΕΣ:
  // η δέσμη καθρεφτίζεται μέσα και ξαναβγάζει το περιβάλλον. Το σημειώνουμε και το τιμάμε.
  bool tir = false;
  vec3 rOut = refract(rIn, -nExit, 1.333);
  if (dot(rOut, rOut) < 0.001 || !exited){ rOut = reflect(rIn, nExit); tir = true; }

  // Ο φακός: όσο πιο δυνατό το στράβωμα, τόσο πιο ΞΕΚΑΘΑΡΑ διαβάζεται ως νερό, γιατί
  // βλέπεις το φόντο να κουνιέται μέσα του. Με 0.85 τα αστέρια μόλις μετακινούνταν.
  // +bob: το σημείο εξόδου είναι στον χώρο της σταγόνας, το φόντο ΔΕΝ λικνίζεται
  vec2 uvOut = pExitCam.xy * 0.60 + uBob + rOut.xy * 1.70;
  vec3 refrCol = tir ? env(rOut, keyCol) * 0.55 : bg(uvOut);

  // Beer–Lambert. Η σταγόνα είναι ΕΝΑ ΧΙΛΙΟΣΤΟ νερό — δεν έχει πού να απορροφήσει.
  // Με 0.55/0.20/0.10 έβγαινε σκούρο μελιτζανί· το νερό σε αυτό το πάχος είναι άχρωμο
  // με ένα ελάχιστο κυανό (τρώει πρώτα το κόκκινο).
  refrCol *= exp(-thick * vec3(0.22, 0.075, 0.035));
  // καυστική κηλίδα: εκεί που η δέσμη που βγαίνει κοιτάζει προς το φως
  refrCol += keyCol * pow(max(dot(rOut, KEYDIR), 0.0), 22.0) * 0.85;
  // και το φως που «στέκεται» μέσα στο σώμα: χωρίς αυτό η κοιλιά είναι νεκρή τρύπα
  // Ήταν 0.10 και γέμιζε την κοιλιά με ομοιόμορφο γάλα. Κρατάμε ίχνος, μόνο για να
  // μη γίνει νεκρή μαύρη τρύπα εκεί που το πάχος είναι μεγάλο.
  refrCol += vec3(0.62,0.78,1.0) * 0.040 * (1.0 - exp(-thick * 0.7));

  vec3 col = mix(refrCol, reflCol, fres);
  col += keyCol * pow(1.0 - ct, 3.2) * 0.20;                 // το φωτισμένο χείλος
  return max(col, 0.0);
}

void main(){
  // ΑΝΤΙΕΞΟΜΑΛΥΝΣΗ ΤΗΣ ΣΙΛΟΥΕΤΑΣ. Τη σιλουέτα την αποφασίζει ο shader ανά pixel — πέτυχε
  // ή αστόχησε η ακτίνα — οπότε το antialias του ΚΑΜΒΑ δεν τη βλέπει καν: ο καμβάς
  // εξομαλύνει ακμές γεωμετρίας, κι εδώ η γεωμετρία είναι ένα τετράγωνο που γεμίζει την
  // οθόνη. Γι' αυτό το περίγραμμα έβγαινε σκαλοπάτι. Τέσσερις ακτίνες σε ΠΕΡΙΣΤΡΑΜΜΕΝΟ
  // πλέγμα το λειαίνουν· περιστραμμένο και όχι ίσιο, γιατί το ίσιο αφήνει τις σχεδόν
  // οριζόντιες και σχεδόν κατακόρυφες ακμές —- ακριβώς αυτές που έχει η σταγόνα — ακόμα
  // σκαλοπάτι. Κόστος x4 σε ακτίνες· το spike μέτρησε 600x600 μέσα στο vsync, δηλαδή
  // τετραπλάσια pixel από τα 300x300, άρα ο χώρος υπάρχει ΗΔΗ μετρημένος.
  float sc = 0.5 * min(uRes.x, uRes.y);
  vec2 uv0 = (gl_FragCoord.xy - 0.5*uRes) / sc;
  // ΣΤΟ DEBUG ΕΝΑ ΔΕΙΓΜΑ, ΟΧΙ ΤΕΣΣΕΡΑ. Ο μέσος όρος 4 δειγμάτων ανακατεύει κόκκινο με
  // νερό και γεννά ενδιάμεσα pixel που το τεστ μετράει λανθασμένα ως «τρύπες» στην
  // ακμή. Το debug δεν κοιτάζεται με το μάτι — θέλει ΚΑΘΑΡΗ κατηγορία ανά pixel.
  if (uDebug == 1){ fragColor = vec4(pow(max(shade(uv0), 0.0), vec3(0.4545)), 1.0); return; }
  float e = 1.0 / sc;
  // ΠΡΟΣΑΡΜΟΣΤΙΚΗ ΑΝΤΙΕΞΟΜΑΛΥΝΣΗ. Η σωστή ιχνηλάτηση (βλ. starved) κοστίζει, και 4 δείγματα
  // σε ΚΑΘΕ pixel έριχναν τα fps στα ~42. Τα 2 σκέτα έβγαζαν σκαλοπάτι στην ακμή. Εδώ:
  // 2 διαγώνια δείγματα παντού, και τα άλλα 2 ΜΟΝΟ όπου διαφωνούν — δηλαδή στην ακμή
  // της σταγόνας και στις λάμψεις, εκεί όπου φαίνεται το σκαλοπάτι. Το εσωτερικό και το
  // φόντο είναι ομαλά και τα 2 δείγματα συμφωνούν ήδη.
  vec3 s0 = shade(uv0 + e*vec2(-0.125,-0.375));
  vec3 s1 = shade(uv0 + e*vec2( 0.125, 0.375));
  vec3 acc;
  vec3 dd = abs(s0 - s1);
  if (max(dd.r, max(dd.g, dd.b)) > 0.04){
    acc = (s0 + s1 + shade(uv0 + e*vec2( 0.375,-0.125))
                   + shade(uv0 + e*vec2(-0.375, 0.125))) * 0.25;
  } else {
    acc = (s0 + s1) * 0.5;
  }
  fragColor = vec4(pow(max(acc, 0.0), vec3(0.4545)), 1.0);   // γάμμα, ΜΙΑ φορά
}`;
const DROP_VS = `#version 300 es
void main(){
  vec2 p = vec2((gl_VertexID<<1)&2, gl_VertexID&2);
  gl_Position = vec4(p*2.0-1.0, 0.0, 1.0);
}`;

// Επιστρέφει null — ΔΕΝ πετάει — όταν λείπει WebGL2 ή δεν μεταγλωττίζεται ο shader.
// Ο καλών αποφασίζει τι κάνει με το null· εδώ δεν ξέρουμε αν υπάρχει εφεδρικό.
// preserveDrawingBuffer: το readPixels των τεστ και το drawImage των καρτών PNG τρέχουν
// ΜΕΤΑ τη σύνθεση του καρέ, και χωρίς αυτό βρίσκουν άδειο buffer.
function dropGLCreate(canvas) {
  let gl = null;
  try {
    gl = canvas.getContext('webgl2', {
      antialias: true, alpha: false, depth: false,
      preserveDrawingBuffer: true, powerPreference: 'high-performance',
    });
  } catch (_) { return null; }
  if (!gl) return null;

  const sh = (ty, src) => {
    const s = gl.createShader(ty);
    gl.shaderSource(s, src); gl.compileShader(s);
    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
      console.warn('σταγόνα: ο shader δεν μεταγλωττίστηκε:', gl.getShaderInfoLog(s));
      return null;
    }
    return s;
  };
  const vs = sh(gl.VERTEX_SHADER, DROP_VS), fs = sh(gl.FRAGMENT_SHADER, DROP_FS);
  if (!vs || !fs) return null;
  const prog = gl.createProgram();
  gl.attachShader(prog, vs); gl.attachShader(prog, fs); gl.linkProgram(prog);
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
    console.warn('σταγόνα: ο shader δεν συνδέθηκε:', gl.getProgramInfoLog(prog));
    return null;
  }

  const U = {};
  for (const k of ['uRes', 'uAmp', 'uRot', 'uTime', 'uYaw', 'uPitch', 'uStars',
                   'uObl', 'uPulse', 'uN', 'uVariant', 'uDebug', 'uBob', 'uRotCS']) {
    U[k] = gl.getUniformLocation(prog, k);
  }

  const draw = p => {
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.useProgram(prog);
    gl.uniform2f(U.uRes, canvas.width, canvas.height);
    gl.uniform1f(U.uAmp, p.amp);
    gl.uniform1f(U.uObl, p.obl);
    gl.uniform1f(U.uPulse, p.pulse);
    gl.uniform2f(U.uRotCS, Math.cos(p.rot), Math.sin(p.rot));
    gl.uniform1f(U.uTime, p.time);
    gl.uniform1f(U.uYaw, p.yaw);
    gl.uniform1f(U.uPitch, p.pitch);
    gl.uniform1f(U.uStars, 1);
    gl.uniform1i(U.uN, p.n);
    gl.uniform1i(U.uVariant, 0);       // 0 = νερό με λευκό φως
    // ΜΟΝΟ για τα τεστ: βάφει κόκκινο όπου η ακτίνα δεν βρήκε επιφάνεια και πράσινο
    // όπου δεν βγήκε ποτέ από το νερό. Και τα δύο είναι σφάλματα ιχνηλάτησης που
    // αλλιώς διαβάζονται ως «σχήμα», και κανένα golden hash δεν τα ξεχωρίζει.
    gl.uniform1i(U.uDebug, p.debug ? 1 : 0);
    gl.uniform2f(U.uBob, p.bob.x, p.bob.y);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 3);
  };

  return { gl: gl, prog: prog, U: U, draw: draw };
}

// Η ΕΠΙΛΟΓΗ ΜΟΝΟΠΑΤΙΟΥ ΓΙΝΕΤΑΙ ΜΙΑ ΦΟΡΑ. Αν ρωτούσαμε ανά καρέ, ένα αποτυχημένο
// getContext θα ξανασχεδιαζόταν 60 φορές το δευτερόλεπτο και θα γέμιζε την κονσόλα.
// null = δεν υπάρχει WebGL2 εδώ -> πέφτουμε στον παλιό Canvas2D drawDrop.
// ΠΡΕΠΕΙ να μείνει ΜΕΤΑ τη dropGLCreate (και τις DROP_FS/DROP_VS): αν εκτελούνταν
// νωρίτερα στο script, η dropGLCreate θα διάβαζε τις πηγές του shader πριν αρχικοποιηθούν
// (TDZ) και θα έσκαγε το ReferenceError, κόβοντας ολόκληρο το app.js στη μέση.
const dropRenderer = { impl: dropGLCreate(chlDropCanvas) };

// ΑΠΩΛΕΙΑ CONTEXT — ΣΥΜΒΑΙΝΕΙ ΚΑΝΟΝΙΚΑ ΣΕ ΚΙΝΗΤΟ. Ο browser ανακτά τη μνήμη της GPU
// όταν η καρτέλα πάει στο παρασκήνιο, ο οδηγός κάνει reset, τελειώνει η μνήμη. Χωρίς
// αυτούς τους δύο χειριστές το `impl` έμενε «αληθινό» ΓΙΑ ΠΑΝΤΑ: ο νεκρός καμβάς WebGL
// έμενε ορατός, δεν γινόταν ποτέ επιστροφή στο δουλεμένο εφεδρικό, και ο βρόχος rAF
// συνέχιζε να στέλνει άδειες εντολές gl εξήντα φορές το δευτερόλεπτο. Αποτέλεσμα: άδεια
// οθόνη, καμένη μπαταρία, και ΚΑΝΕΝΑ σφάλμα πουθενά να δείξει γιατί.
//
// Το preventDefault() ΔΕΝ είναι διακοσμητικό: χωρίς αυτό το πρότυπο δεν επιτρέπει καν
// στον browser να αποκαταστήσει το context, και η καρτέλα μένει νεκρή μέχρι ο χρήστης
// να ξαναφορτώσει τη σελίδα με το χέρι.
chlDropCanvas.addEventListener('webglcontextlost', e => {
  e.preventDefault();
  dropRenderer.impl = null;                        // από δω και πέρα, εφεδρικό
  if (chlShape === 'drop') setChlShape('drop');    // ξαναδιαλέγει καμβά, ξαναρχίζει βρόχο
});
chlDropCanvas.addEventListener('webglcontextrestored', () => {
  dropRenderer.impl = dropGLCreate(chlDropCanvas); // ξαναχτίζουμε shader και uniforms
  if (chlShape === 'drop') setChlShape('drop');
});

// Ο ΑΠΟΘΗΚΕΥΤΙΚΟΣ ΧΩΡΟΣ ΑΚΟΛΟΥΘΕΙ ΤΗΝ ΟΘΟΝΗ. Χωρίς αυτό ο καμβάς είναι 300px και
// τεντώνεται στα 340 CSS px, δηλαδή σε κινητό με DPR 3 ο browser μεγαλώνει 300 pixel
// σε 1020 — θολούρα. Το spike μέτρησε τα 600px μέσα στο vsync, άρα ο χώρος υπάρχει.
// Πλαφόν στο 2: στα 3 ο καμβάς γίνεται 900² = 810k pixel και σε φτηνό κινητό δεν αξίζει.
function dropSizeCanvas() {
  const dpr = Math.min(2, Math.max(1, window.devicePixelRatio || 1));
  const px = Math.round(300 * dpr);
  if (chlDropCanvas.width !== px) { chlDropCanvas.width = chlDropCanvas.height = px; }
}

// ΕΝΑ σημείο για τα κείμενα κατάστασης, γιατί τα ΔΥΟ μονοπάτια απόδοσης πρέπει να λένε
// ΤΟ ΙΔΙΟ ΠΡΑΓΜΑ: ο χρήστης δεν πρέπει να καταλαβαίνει ποιο τρέχει. Διπλασιασμένο, μια
// αλλαγή μετάφρασης θα γινόταν στο ένα και θα ξεχνιόταν στο άλλο.
function dropStatusText(n, fr, crisp) {
  document.getElementById('chlPlateVal').textContent =
    (DROP_R0 * (+chlPlate.value / 100) * 1000).toFixed(2) + 'mm';
  chlStatus.textContent = (crisp > 0.6 ? T('chl_drop_on') : T('chl_drop_off'))
    .replace('{f}', fr.toFixed(1)).replace('{n}', n);
  chlStatus.style.color = crisp > 0.6 ? 'var(--accent)' : 'var(--muted)';
}

function drawDrop(pulsePhase, canvas, scale) {
  canvas = canvas || chlCanvas;
  scale = scale || 1;
  const f = Math.min(CHL_FREQ_RANGE[1], Math.max(CHL_FREQ_RANGE[0], +chlFreq.value || 432));
  const { n, fr, crisp } = findDropResonance(f, +chlPlate.value);
  const g = canvas.getContext('2d');
  g.setTransform(scale, 0, 0, scale, 0, 0);   // όλα τα υπόλοιπα δουλεύουν σε λογικά 300px
  const W = canvas.width / scale, H = canvas.height / scale, cx = W / 2, cy = H / 2;
  const bg = g.createRadialGradient(cx, cy, 10, cx, cy, W * .7);
  bg.addColorStop(0, '#1d1440'); bg.addColorStop(1, '#120b28');
  g.fillStyle = bg; g.fillRect(0, 0, W, H);
  const baseR = W * 0.30;
  // ΙΔΙΑ ΦΥΣΙΚΗ ΜΕ ΤΟ ΜΟΝΟΠΑΤΙ WebGL. Το amp πολλαπλασιασμένο με το dropPulse δίνει
  // ΑΚΡΙΒΩΣ ό,τι κάνει ο shader: εκείνος γράφει 1 + amp·pulse·lobe·cos(...), εδώ το
  // dropMesh γράφει 1 + amp·lobe·cos(...) με το pulse ήδη μέσα στο amp. Ταυτόσημο.
  // Το παλιό (1 + 0.06·sin) ήταν ένα ±6% ανάσασμα — αντικαθίσταται από το στάσιμο κύμα.
  const amp = (0.06 + 0.22 * crisp) * dropPulse(pulsePhase);
  const rot = pulsePhase * 0.05;
  const bob = dropBob(pulsePhase);

  // Άλως: ΕΝΑ γέμισμα πριν το πλέγμα. Δεν βάζουμε shadowBlur στις ~900 όψεις —
  // ο καμβάς υπολογίζει τη σκιά ξεχωριστά για καθεμιά και γονατίζει το καρέ.
  const halo = g.createRadialGradient(cx, cy, 4, cx, cy, baseR * 1.45);
  halo.addColorStop(0, 'rgba(255,199,107,.22)'); halo.addColorStop(1, 'rgba(255,199,107,0)');
  g.fillStyle = halo; g.fillRect(0, 0, W, H);

  const mesh = dropMesh(n, amp, rot, DROP_RINGS, DROP_SEGS, DROP_OBLATE);
  const P = projectMesh(mesh.verts, dropYaw, dropPitch);
  const stride = mesh.segs + 1;
  // Σταθερό φως στον χώρο της κάμερας: πάνω αριστερά και λίγο μπροστά.
  const LX = -0.40, LY = 0.60, LZ = 0.69;
  const faces = [];
  for (let i = 0; i < mesh.rings; i++) {
    for (let j = 0; j < mesh.segs; j++) {
      const a = P[i * stride + j], b = P[i * stride + j + 1];
      const c = P[(i + 1) * stride + j + 1], d = P[(i + 1) * stride + j];
      // ΔΙΑΓΩΝΙΟΙ, όχι ακμές: στους πόλους όλο το πρώτο/τελευταίο δαχτυλίδι πέφτει
      // στο ΙΔΙΟ σημείο, οπότε η ακμή b−a μηδενίζεται και μαζί της το κάθετο διάνυσμα
      // — η όψη κοβόταν και έμενε μαύρη τρύπα στην κορυφή. Οι διαγώνιοι δεν εκφυλίζονται.
      const ux = c.x - a.x, uy = c.y - a.y, uz = c.z - a.z;
      const vx = d.x - b.x, vy = d.y - b.y, vz = d.z - b.z;
      const nx = uy * vz - uz * vy, ny = uz * vx - ux * vz, nz = ux * vy - uy * vx;
      // Με +z προς τον θεατή, οι όψεις που ΜΑΣ κοιτάνε έχουν nz > 0. Κόβουμε τις άλλες:
      // αλλιώς ζωγραφίζαμε το εσωτερικό της πίσω πλευράς και το φως ερχόταν από κάτω.
      if (nz <= 0) continue;
      const len = Math.hypot(nx, ny, nz) || 1;
      faces.push({
        a: a, b: b, c: c, d: d,
        lit: Math.max(0, (nx * LX + ny * LY + nz * LZ) / len),
        depth: a.z + b.z + c.z + d.z,
      });
    }
  }
  faces.sort((p, q) => p.depth - q.depth);   // από πίσω προς τα μπρος

  // ΜΟΝΑΔΕΣ: το dropBob δίνει μετατόπιση σε μονάδες οθόνης όπου το μισό πλάτος είναι 1
  // (έτσι τη διαβάζει ο shader). Εδώ το μισό πλάτος είναι W/2 pixel, άρα πολλαπλασιάζουμε
  // με W/2. Το −bob.y είναι γιατί ο καμβάς 2D μετράει προς τα κάτω, η φυσική προς τα πάνω.
  g.save(); g.translate(cx + bob.x * W / 2, cy - bob.y * W / 2);
  for (let k = 0; k < faces.length; k++) {
    const fc = faces[k], t = fc.lit;
    const col = dropShade(t);
    // −y: ο καμβάς μετράει προς τα κάτω, ο χώρος θέασης προς τα πάνω
    const x0 = fc.a.x * baseR, y0 = -fc.a.y * baseR, x1 = fc.b.x * baseR, y1 = -fc.b.y * baseR;
    const x2 = fc.c.x * baseR, y2 = -fc.c.y * baseR, x3 = fc.d.x * baseR, y3 = -fc.d.y * baseR;
    // Μεγαλώνουμε ΕΛΑΧΙΣΤΑ κάθε όψη γύρω από το κέντρο της, ώστε να ακουμπάει τις
    // γειτονικές. Χωρίς αυτό το antialiasing αφήνει σκούρες τριχοειδείς χαραμάδες και η
    // σταγόνα μοιάζει με συρματόπλεγμα. Το έκανε πριν ένα stroke στο ίδιο χρώμα — σωστό
    // αποτέλεσμα, αλλά κόστιζε τα δύο τρίτα του καρέ (18 fps -> 52 fps χωρίς αυτό στον i3).
    const mx = (x0 + x1 + x2 + x3) * .25, my = (y0 + y1 + y2 + y3) * .25, E = 1.06;
    g.beginPath();
    g.moveTo(mx + (x0 - mx) * E, my + (y0 - my) * E);
    g.lineTo(mx + (x1 - mx) * E, my + (y1 - my) * E);
    g.lineTo(mx + (x2 - mx) * E, my + (y2 - my) * E);
    g.lineTo(mx + (x3 - mx) * E, my + (y3 - my) * E);
    g.closePath();
    g.fillStyle = col;
    g.fill();
  }
  g.restore();

  g.setTransform(1, 0, 0, 1, 0, 0);
  if (canvas !== chlCanvas) return;
  dropStatusText(n, fr, crisp);
}

// Ζωγραφίζει ΕΝΑ καρέ στο μονοπάτι που υπάρχει, και ενημερώνει τα κείμενα κατάστασης.
// Τα κείμενα είναι ίδια και στα δύο μονοπάτια επίτηδες: ο χρήστης δεν πρέπει να
// καταλαβαίνει ποιο τρέχει, και τα τρίγλωσσα golden τεστ δεν αλλάζουν.
function drawDropFrame(phase) {
  if (!dropRenderer.impl) { drawDrop(phase); return; }
  dropSizeCanvas();
  const f = Math.min(CHL_FREQ_RANGE[1], Math.max(CHL_FREQ_RANGE[0], +chlFreq.value || 432));
  const { n, fr, crisp } = findDropResonance(f, +chlPlate.value);
  dropRenderer.impl.draw({
    n: n,
    amp: 0.06 + 0.22 * crisp,        // πόσο βαθιά τα αυλάκια — ίδιο με το Canvas2D
    obl: DROP_OBLATE,
    pulse: dropPulse(phase),
    rot: phase * 0.05,
    yaw: dropYaw, pitch: dropPitch,
    bob: dropBob(phase),
    time: phase,
  });
  dropStatusText(n, fr, crisp);
}

function animateDrop() {
  const t0 = performance.now();
  const step = now => {
    drawDropFrame((now - t0) / 1000);
    chlRaf = requestAnimationFrame(step);
  };
  chlRaf = requestAnimationFrame(step);
}

function wireDropCamera() {
  let dragging = false, lx = 0, ly = 0;
  const DRAG = 0.01;   // rad ανά pixel — μια οθόνη πλάτους κάνει λίγο πάνω από μια στροφή
  // Οι χειριστές δένονται ΚΑΙ ΣΤΟΥΣ ΔΥΟ καμβάδες: ο κρυμμένος δεν παίρνει γεγονότα
  // δείκτη, οπότε δεν υπάρχει σύγκρουση, και το σύρσιμο δουλεύει και στα δύο μονοπάτια
  // (Canvas2D εφεδρικό στον #chl, WebGL2 στον #chlDrop).
  for (const cv of [chlCanvas, chlDropCanvas]) {
    cv.addEventListener('pointerdown', e => {
      if (chlShape !== 'drop') return;
      dragging = true; lx = e.clientX; ly = e.clientY;
      // Πιάνουμε τον δείκτη: αν το χέρι φύγει γρήγορα εκτός καμβά, η σταγόνα δεν
      // «κολλάει» στη μέση της κίνησης. Στο e.currentTarget, ώστε να πιάνει τον
      // καμβά που όντως δέχτηκε το γεγονός.
      try { e.currentTarget.setPointerCapture(e.pointerId); } catch (_) { }
    });
    cv.addEventListener('pointermove', e => {
      if (!dragging) return;
      // ΑΥΤΟΘΕΡΑΠΕΙΑ. Αν το setPointerCapture παραπάνω απέτυχε, η απελευθέρωση μπορεί να
      // πέσει σε άλλο στοιχείο και το `dragging` να μείνει κολλημένο — τότε η σταγόνα θα
      // γύριζε με σκέτο πέρασμα του ποντικιού, χωρίς πατημένο κουμπί. Το buttons είναι 0
      // σε hover και 1 όσο κρατάς (ποντίκι ή δάχτυλο), οπότε ξεκολλάει μόνο του.
      // Ελέγχουμε ΚΑΙ το σχήμα: αν κάτι αλλάξει σε πλάκα στη μέση του σύρσιμου, δεν θέλουμε
      // να συνεχίσει να κουνάει μια κάμερα που δεν φαίνεται πουθενά.
      if (!e.buttons || chlShape !== 'drop') { dragging = false; return; }
      dropYaw += (e.clientX - lx) * DRAG;
      dropPitch = Math.max(-DROP_PITCH_MAX, Math.min(DROP_PITCH_MAX, dropPitch + (e.clientY - ly) * DRAG));
      lx = e.clientX; ly = e.clientY;
      pushUrl();   // ήδη debounced 300ms, οπότε το σύρσιμο δεν πλημμυρίζει το history
    });
    const end = e => {
      if (!dragging) return;
      dragging = false;
      try { e.currentTarget.releasePointerCapture(e.pointerId); } catch (_) { }
    };
    cv.addEventListener('pointerup', end);
    cv.addEventListener('pointercancel', end);
    cv.addEventListener('dblclick', () => {
      if (chlShape !== 'drop') return;
      dropYaw = DROP_YAW0; dropPitch = DROP_PITCH0;
      pushUrl();
    });
  }
}

function setChlShape(shape) {
  chlShape = shape;
  document.getElementById('chlShapePlate').classList.toggle('sel', shape === 'plate');
  document.getElementById('chlShapeDrop').classList.toggle('sel', shape === 'drop');
  document.getElementById('chlNote').textContent = T(shape === 'drop' ? 'chl_note_drop' : 'chl_note');
  document.getElementById('chlPlateLabel').textContent = T(shape === 'drop' ? 'chl_drop_size' : 'chl_plate');
  const [lo, hi] = shape === 'drop' ? DROP_SIZE_RANGE : PLATE_SIZE_RANGE;
  chlPlate.min = lo;
  chlPlate.max = hi;
  chlPlate.value = Math.min(hi, Math.max(lo, +chlPlate.value));   // αν γυρίσουμε σε στενότερο εύρος
  // ΠΟΙΟΣ ΚΑΜΒΑΣ ΦΑΙΝΕΤΑΙ ΕΞΑΡΤΑΤΑΙ ΑΠΟ ΤΟ ΜΟΝΟΠΑΤΙ, ΟΧΙ ΜΟΝΟ ΑΠΟ ΤΟ ΣΧΗΜΑ.
  // Στο εφεδρικό μονοπάτι ο drawDrop ζωγραφίζει πάνω στον #chl (είναι ο καμβάς 2d),
  // οπότε αν κρύβαμε τον #chl «επειδή είμαστε σε σταγόνα» θα ζωγραφίζαμε σε κρυμμένο
  // καμβά και η καρτέλα θα έμενε άδεια σε κάθε μηχάνημα χωρίς WebGL2.
  const useGL = shape === 'drop' && !!dropRenderer.impl;
  chlCanvas.classList.toggle('hidden', useGL);
  chlDropCanvas.classList.toggle('hidden', !useGL);
  chlDropCanvas.classList.toggle('rotatable', useGL);
  chlCanvas.classList.toggle('rotatable', shape === 'drop' && !useGL);
  document.getElementById('chlRotateHint').textContent = shape === 'drop' ? T('chl_drop_rotate') : '';
  if (chlRaf) { cancelAnimationFrame(chlRaf); chlRaf = null; }
  if (shape === 'drop') animateDrop(); else drawChladni();
  pushUrl();
}

// ---------- frequency crystals ----------
const cryCanvas = document.getElementById('cry');
const cryFreq = document.getElementById('cryFreq');
const cryTitle = document.getElementById('cryTitle');
let cryRaf = null;

function cryRand(seed) { // ντετερμινιστικό: ίδια συχνότητα → ίδιος κρύσταλλος
  let a = seed | 0;
  return function () {
    a = a + 0x6D2B79F5 | 0;
    let t = Math.imul(a ^ a >>> 15, 1 | a);
    t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
}

function cryParams(f) {
  const rnd = cryRand(Math.round(f * 100));
  const type = Math.floor(rnd() * 3); // 0 δεντρίτης, 1 πλάκα με ακτίνες, 2 αστέρι με πλακίδια
  const P = { type, L: 100 + rnd() * 30, w: 2 + rnd() * 1.6, hex: 8 + rnd() * 12, side: [] };
  const n = type === 1 ? 2 + Math.floor(rnd() * 2) : 3 + Math.floor(rnd() * 4);
  for (let i = 0; i < n; i++) P.side.push({
    pos: 0.18 + (i + 0.2 + rnd() * 0.6) * (0.74 / n),
    len: Math.max(.1, (type === 1 ? .3 : .58) - i * .07 + (rnd() - .5) * .34),
    ang: (36 + rnd() * 38) * Math.PI / 180,
    sub: rnd() < .7,
    plate: rnd() < .35,
  });
  P.tipHex = type === 2 ? 7 + rnd() * 9 : (rnd() < .35 ? 4 + rnd() * 6 : 0);
  P.ring = rnd() < .55 ? .3 + rnd() * .35 : 0;
  P.bigHex = type === 1 ? .42 + rnd() * .22 : 0;
  return P;
}

function cryHex(g, x, y, r, rot, fill) {
  g.beginPath();
  for (let k = 0; k <= 6; k++) { const a = k * Math.PI / 3 + rot; g[k ? 'lineTo' : 'moveTo'](x + Math.cos(a) * r, y + Math.sin(a) * r); }
  if (fill) { g.fillStyle = fill; g.fill(); }
  g.stroke();
}

function crySeg(g, x1, y1, x2, y2, k) {
  if (k <= 0) return;
  g.beginPath(); g.moveTo(x1, y1);
  g.lineTo(x1 + (x2 - x1) * Math.min(1, k), y1 + (y2 - y1) * Math.min(1, k));
  g.stroke();
}

function drawCrystal(t, canvas, scale) {
  canvas = canvas || cryCanvas;
  scale = scale || 1;
  const f = Math.min(CRY_FREQ_RANGE[1], Math.max(CRY_FREQ_RANGE[0], +cryFreq.value || 432));
  const P = cryParams(f);
  const g = canvas.getContext('2d');
  g.setTransform(scale, 0, 0, scale, 0, 0);
  const W = canvas.width / scale, H = canvas.height / scale, cx = W / 2, cy = H / 2;
  const bg = g.createRadialGradient(cx, cy, 10, cx, cy, W * .7);
  bg.addColorStop(0, '#1d1440'); bg.addColorStop(1, '#120b28');
  g.fillStyle = bg; g.fillRect(0, 0, W, H);
  const ease = 1 - Math.pow(1 - t, 3);
  g.save(); g.translate(cx, cy);
  g.lineCap = 'round'; g.shadowColor = '#7fe7ff';
  if (P.bigHex) { // κεντρική εξαγωνική πλάκα (sectored plate)
    g.shadowBlur = 8 * scale; g.strokeStyle = '#bfe6f7'; g.lineWidth = P.w * .7;
    cryHex(g, 0, 0, P.L * P.bigHex * ease, 0, 'rgba(140,200,255,.08)');
  }
  if (P.ring && ease > .3) { // εσωτερικό εξαγωνικό δαχτυλίδι
    g.shadowBlur = 5 * scale; g.strokeStyle = 'rgba(185,225,250,.55)'; g.lineWidth = P.w * .45;
    cryHex(g, 0, 0, P.L * P.ring * Math.min(1, (ease - .3) / .5), 0);
  }
  for (let k = 0; k < 6; k++) {
    g.save(); g.rotate(k * Math.PI / 3);
    const gl = P.L * ease;
    g.shadowBlur = 10 * scale; g.strokeStyle = '#dff4ff'; g.lineWidth = P.w;
    crySeg(g, 0, 0, P.L, 0, ease);
    g.lineWidth = P.w * .65; g.strokeStyle = '#a9e2f5'; g.shadowBlur = 6 * scale;
    for (const s of P.side) {
      const bx = P.L * s.pos;
      if (gl <= bx) continue;
      const sk = Math.min(1, (gl - bx) / (P.L * .28));
      const sl = P.L * s.len;
      for (const dir of [-1, 1]) {
        const ex = bx + Math.cos(s.ang) * sl, ey = Math.sin(s.ang) * sl * dir;
        crySeg(g, bx, 0, ex, ey, sk);
        if (s.sub && sk > .55) {
          const mx = bx + (ex - bx) * .55, my = ey * .55;
          const ssl = sl * .38, sa = s.ang * dir * .5;
          g.lineWidth = P.w * .45;
          crySeg(g, mx, my, mx + Math.cos(sa) * ssl, my + Math.sin(sa) * ssl, (sk - .55) / .45);
          g.lineWidth = P.w * .65;
        }
        if (s.plate && sk >= 1) { // πλακίδιο στην άκρη του κλαδιού
          g.lineWidth = P.w * .4;
          cryHex(g, ex, ey, 4.5, 0, 'rgba(160,215,255,.12)');
          g.lineWidth = P.w * .65;
        }
      }
    }
    if (P.tipHex && ease > .85) { // εξαγωνικό πλακίδιο στην κορυφή
      g.lineWidth = P.w * .55; g.strokeStyle = '#cfeeff';
      cryHex(g, P.L, 0, P.tipHex * Math.min(1, (ease - .85) / .13), Math.PI / 6, 'rgba(160,215,255,.12)');
      g.strokeStyle = '#a9e2f5';
    }
    if (ease > .96) { // χρυσή σπίθα στην άκρη
      g.shadowBlur = 12 * scale; g.shadowColor = '#ffd479'; g.fillStyle = '#ffd479';
      g.beginPath(); g.arc(P.L, 0, 2.2, 0, 7); g.fill();
      g.shadowColor = '#7fe7ff';
    }
    g.restore();
  }
  const hr = P.hex * Math.min(1, t * 2.5); // εξάγωνο στον πυρήνα
  g.shadowBlur = 8 * scale; g.strokeStyle = '#cfeeff'; g.lineWidth = P.w * .8;
  cryHex(g, 0, 0, hr, Math.PI / 6);
  g.restore();
  g.setTransform(1, 0, 0, 1, 0, 0);
  if (canvas !== cryCanvas) return;
  cryTitle.textContent = T('cry_title').replace('{f}', f);
}

function growCrystal() {
  pushUrl();
  if (cryRaf) cancelAnimationFrame(cryRaf);
  const t0 = performance.now();
  const step = now => {
    const t = Math.min(1, (now - t0) / 3200);
    drawCrystal(t);
    if (t < 1) cryRaf = requestAnimationFrame(step);
  };
  cryRaf = requestAnimationFrame(step);
}

// ---------- ανίχνευση τονικού ύψους ----------
// ΚΑΘΑΡΗ ΣΥΝΑΡΤΗΣΗ: δεν ξέρει από μικρόφωνα, DOM ή όργανα. Γι' αυτό μπορεί να ελεγχθεί
// με συνθετικά κύματα — ο headless browser των τεστ δεν έχει μικρόφωνο, οπότε αν ο
// αλγόριθμος ήταν μπλεγμένος με το getUserMedia δεν θα ελεγχόταν ποτέ.
//
// Κανονικοποιημένη αυτοσυσχέτιση (NSDF, κατά McLeod) και όχι FFT: το χαμηλό μι της
// κιθάρας είναι 82Hz, όπου ένα FFT με αυτό το παράθυρο έχει διακριτική ικανότητα
// χειρότερη από ημιτόνιο. Η αυτοσυσχέτιση δουλεύει στον χρόνο, και η παραβολική
// παρεμβολή στην κορυφή δίνει ακρίβεια καλύτερη από 1 cent.
const PITCH_MIN_HZ = 70, PITCH_MAX_HZ = 1100;
const PITCH_WINDOW = 2048;        // 46ms στα 44.1kHz — ~4 περίοδοι του χαμηλού μι
const PITCH_RMS_GATE = 0.01;      // κάτω από αυτό είναι σιωπή
const PITCH_CLARITY_GATE = 0.9;   // κάτω από αυτό το σήμα δεν είναι τονικό
const PITCH_PEAK_K = 0.9;         // πόσο κοντά στην ψηλότερη αρκεί να είναι μια κορυφή

function detectPitch(buf, sampleRate) {
  const n = buf.length;
  let sum = 0;
  for (let i = 0; i < n; i++) sum += buf[i] * buf[i];
  if (Math.sqrt(sum / n) < PITCH_RMS_GATE) return { hz: 0, clarity: 0 };

  const minLag = Math.max(2, Math.floor(sampleRate / PITCH_MAX_HZ));
  const maxLag = Math.min(Math.floor(sampleRate / PITCH_MIN_HZ), n - 2);
  if (maxLag <= minLag) return { hz: 0, clarity: 0 };

  // NSDF: n(τ) = 2·Σ x[i]x[i+τ] / Σ (x[i]² + x[i+τ]²) — κανονικοποιημένο στο [-1,1],
  // ώστε το κατώφλι σαφήνειας να μη γίνεται αυστηρότερο όσο σβήνει η νότα.
  const nsdf = new Float32Array(maxLag + 2);
  for (let lag = minLag; lag <= maxLag; lag++) {
    let ac = 0, energy = 0;
    for (let i = 0; i < n - lag; i++) {
      const a = buf[i], b = buf[i + lag];
      ac += a * b;
      energy += a * a + b * b;
    }
    nsdf[lag] = energy > 0 ? 2 * ac / energy : 0;
  }

  // Προσπέρασε την αρχική θετική ζώνη: η αυτοσυσχέτιση είναι πάντα ψηλή σε πολύ μικρές
  // υστερήσεις και θα έδινε ψεύτικη κορυφή.
  let i = minLag;
  while (i <= maxLag && nsdf[i] > 0) i++;

  // Μία κορυφή ανά θετική ζώνη, δηλαδή μία ανά περίοδο.
  const peaks = [];
  while (i <= maxLag) {
    if (nsdf[i] > 0) {
      let top = i;
      while (i <= maxLag && nsdf[i] > 0) { if (nsdf[i] > nsdf[top]) top = i; i++; }
      peaks.push(top);
    } else i++;
  }
  if (!peaks.length) return { hz: 0, clarity: 0 };

  // ΠΡΩΤΗ κορυφή που φτάνει κοντά στην ψηλότερη — όχι η ψηλότερη απόλυτα. Σε περιοδικό
  // σήμα κάθε πολλαπλάσιο της περιόδου δίνει κορυφή ~1, και το ποια βγαίνει ψηλότερη
  // κρίνεται από στρογγυλοποίηση· παίρνοντας την ψηλότερη κλειδώνεις σε υπο-αρμονική
  // και διαβάζεις τα 659Hz ως 73Hz. Αυτός είναι ο κανόνας του McLeod.
  let highest = 0;
  for (const q of peaks) if (nsdf[q] > highest) highest = nsdf[q];
  if (highest < PITCH_CLARITY_GATE) return { hz: 0, clarity: highest };
  const thresh = PITCH_PEAK_K * highest;
  let lag = peaks[0];
  for (const q of peaks) if (nsdf[q] >= thresh) { lag = q; break; }
  const best = nsdf[lag];

  // Παραβολική παρεμβολή γύρω από την κορυφή. Στα δύο άκρα του εύρους λείπει γείτονας,
  // οπότε δεν παρεμβάλλουμε καθόλου αντί να διαβάσουμε κενό κελί ως τιμή.
  let shift = 0;
  if (lag > minLag && lag < maxLag) {
    const y0 = nsdf[lag - 1], y1 = nsdf[lag], y2 = nsdf[lag + 1];
    const d = y0 - 2 * y1 + y2;
    if (d !== 0) shift = 0.5 * (y0 - y2) / d;
  }
  return { hz: sampleRate / (lag + shift), clarity: best };
}

// ---------- κουρδίσματα οργάνων ----------
// Αποθηκεύονται ΑΡΙΘΜΟΙ ΝΟΤΑΣ MIDI, όχι Hz: η συχνότητα βγαίνει από την αναφορά, οπότε
// τα 432 δεν χρειάζονται δεύτερο πίνακα που θα ξέφευγε από τον πρώτο.
// Κάθε «σειρά» (course) είναι πίνακας: ένα στοιχείο = μονή ή ταυτόφωνη σειρά,
// δύο στοιχεία = ΖΕΥΓΟΣ ΟΚΤΑΒΑΣ, όπως η χαμηλή σειρά του μπουζουκιού.
const INSTRUMENTS = ['trichordo', 'tetrachordo', 'baglamas', 'tzouras', 'guitar', 'violin', 'ukulele'];
const TUNINGS = {
  trichordo:   { courses: [[50, 62], [57], [62]] },              // ρε3+ρε4 · λα3 · ρε4
  tetrachordo: { courses: [[48, 60], [53, 65], [57], [62]] },    // ντο3+ντο4 · φα3+φα4 · λα3 · ρε4
  baglamas:    { courses: [[62, 74], [69], [74]] },              // οκτάβα πάνω από το τρίχορδο — ονομαστικά
  tzouras:     { courses: [[50, 62], [57], [62]] },              // ίδιο απόλυτο ύψος με το τρίχορδο
  guitar:      { courses: [[40], [45], [50], [55], [59], [64]] },
  violin:      { courses: [[55], [62], [69], [76]] },
  ukulele:     { courses: [[67], [60], [64], [69]] },            // αναδρομικό: το σολ ηχεί ΠΑΝΩ από το ντο
};

function noteFreq(midi, a4) { return a4 * Math.pow(2, (midi - 69) / 12); }
function centsBetween(hz, target) { return 1200 * Math.log(hz / target) / Math.LN2; }

// Τρεις ανεξάρτητοι πίνακες, όχι ένας με μεταφράσεις: στα γερμανικά το σι είναι H,
// ενώ το B σημαίνει σι ύφεση — «B» θα ήταν λάθος, όχι απλώς αδόκιμο.
const NOTE_NAMES = {
  el: ['Ντο', 'Ντο♯', 'Ρε', 'Ρε♯', 'Μι', 'Φα', 'Φα♯', 'Σολ', 'Σολ♯', 'Λα', 'Λα♯', 'Σι'],
  de: ['C', 'Cis', 'D', 'Dis', 'E', 'F', 'Fis', 'G', 'Gis', 'A', 'Ais', 'H'],
  en: ['C', 'C♯', 'D', 'D♯', 'E', 'F', 'F♯', 'G', 'G♯', 'A', 'A♯', 'B'],
};
function noteName(midi, lang) {
  const names = NOTE_NAMES[lang] || NOTE_NAMES.el;
  return names[((midi % 12) + 12) % 12] + (Math.floor(midi / 12) - 1);
}

// Δέχεται ΚΑΙ ΤΑ ΔΥΟ μέλη ενός ζεύγους οκτάβας ως έγκυρους στόχους: όταν χτυπάς τη
// χαμηλή σειρά ηχούν και οι δύο χορδές, και δεν επιτρέπεται να λέμε στον παίκτη ότι
// έπεσε μια οκτάβα έξω ενώ είναι σωστός.
function matchString(hz, instrument, a4) {
  const t = TUNINGS[instrument];
  if (!t || !hz) return null;
  let best = null;
  t.courses.forEach((course, ci) => {
    course.forEach(midi => {
      const target = noteFreq(midi, a4);
      const cents = centsBetween(hz, target);
      if (!best || Math.abs(cents) < Math.abs(best.cents)) best = { course: ci, midi, cents, target };
    });
  });
  return best;
}

// Ζωγραφίζει τη σειρά των χορδών. Οι σειρές με δύο νότες είναι ζεύγη οκτάβας και
// σημειώνονται ρητά — αλλιώς ο παίκτης δεν καταλαβαίνει γιατί βλέπει δύο νότες.
function renderTuner() {
  const box = document.getElementById('tunerCourses');
  if (!box) return;
  const courses = TUNINGS[tunerInst].courses;
  box.innerHTML = '';
  courses.forEach((course, ci) => {
    const el = document.createElement('div');
    el.className = 'course' + (course.length > 1 ? ' oct' : '');
    el.dataset.course = ci;
    if (course.length > 1) {
      const tag = document.createElement('small');
      tag.textContent = T('tuner_octave_pair');
      el.appendChild(tag);
    }
    // Ένα κουμπί ανά ΝΟΤΑ, όχι ανά σειρά: στα ζεύγη οκτάβας ο παίκτης κουρδίζει τις δύο
    // χορδές χωριστά, οπότε χρειάζεται να ακούσει την καθεμιά.
    course.forEach(midi => {
      const b = document.createElement('button');
      b.className = 'strbtn';
      b.dataset.midi = midi;
      b.dataset.key = ci + ':' + midi;
      b.innerHTML = '<span></span><small></small>';
      b.firstChild.textContent = noteName(midi, LANG);
      b.querySelector('small').textContent = noteFreq(midi, tunerA4).toFixed(1) + ' Hz';
      b.onclick = () => playRefTone(midi, ci + ':' + midi);
      el.appendChild(b);
    });
    box.appendChild(el);
  });
  document.querySelectorAll('#tunerInstruments .chip').forEach(c =>
    c.classList.toggle('sel', c.dataset.inst === tunerInst));
  // Όχι syncChips() εδώ: εκείνη διαβάζει data-f, ενώ τα chips αναφοράς έχουν data-a.
  document.querySelectorAll('#panel-tuner .freq-row .chip[data-a]').forEach(c =>
    c.classList.toggle('sel', Math.abs(+c.dataset.a - tunerA4) < 0.01));
  const hint = document.getElementById('tunerHint');
  const key = tunerInst === 'baglamas' ? 'note_baglamas'
            : tunerInst === 'ukulele' ? 'note_ukulele'
            : courses.some(c => c.length > 1) ? 'note_octave' : '';
  hint.textContent = key ? T(key) : '';
  hint.classList.toggle('hidden', !key);
  syncRefButtons();
}

// ---------- τόνος αναφοράς ----------
// Μπαίνει στην ίδια πειθαρχία «ένας ήχος τη φορά» με τη γεννήτρια και τα κομμάτια:
// ξεκινώντας εδώ σταματούν εκείνα, και αντίστροφα. Αλλιώς δύο πηγές θα έπαιζαν μαζί.
let refOsc = null, refGain = null, refMidi = null, refKey = null;

function stopRefTone() {
  if (!refOsc) return;
  const o = refOsc, g = refGain;
  refOsc = null; refGain = null; refMidi = null; refKey = null;
  g.gain.setTargetAtTime(0, ctx.currentTime, .03);
  setTimeout(() => { o.stop(); o.disconnect(); g.disconnect(); }, 200);
  syncRefButtons();
}

function playRefTone(midi, key) {
  if (refKey === key) { stopRefTone(); return; }   // δεύτερο πάτημα = σβήσιμο
  stopRefTone();
  stopTone(); stopMusic(); APP.stopSongPlayer();
  stopMic();   // ο τόνος αναφοράς και το μικρόφωνο δεν παίζουν ποτέ μαζί — το κουρδιστήρι θα κυνηγούσε τον δικό του ήχο
  ctx = ctx || new (window.AudioContext || window.webkitAudioContext)();
  ctx.resume();
  refOsc = ctx.createOscillator(); refGain = ctx.createGain();
  // τρίγωνο και όχι ημίτονο: έχει αρμονικές, οπότε ακούγεται πιο κοντά σε χορδή και
  // το αυτί πιάνει ευκολότερα το «δέσιμο» των δύο τόνων
  refOsc.type = 'triangle';
  refOsc.frequency.value = noteFreq(midi, tunerA4);
  refGain.gain.setValueAtTime(0, ctx.currentTime);
  refGain.gain.linearRampToValueAtTime(0.25, ctx.currentTime + .05);
  refOsc.connect(refGain).connect(ctx.destination);
  refOsc.start();
  refMidi = midi; refKey = key;
  syncRefButtons();
}

// Ταιριάζουμε με το ΚΟΥΜΠΙ, όχι με τη νότα: στο τρίχορδο το ρε4 υπάρχει και ως
// σύντροφος οκτάβας της πρώτης σειράς και ως τρίτη σειρά, οπότε το ταίριασμα κατά
// νότα θα άναβε δύο κουμπιά ενώ ηχεί ένας τόνος.
function syncRefButtons() {
  document.querySelectorAll('#tunerCourses .strbtn').forEach(b =>
    b.classList.toggle('on', refKey !== null && b.dataset.key === refKey));
}

// ---------- μικρόφωνο ----------
// Ο ρυθμός ανίχνευσης είναι ~12 φορές το δευτερόλεπτο, ΟΧΙ σε κάθε καρέ: η αυτοσυσχέτιση
// κοστίζει maxLag×παράθυρο πράξεις, και στα 60fps θα έτρωγε ολόκληρο πυρήνα σε παλιό
// διπύρηνο μηχάνημα. Δώδεκα φορές το δευτερόλεπτο φαίνεται ακαριαίο στο μάτι.
const TUNER_INTERVAL_MS = 80;
const PITCH_SMOOTH = 5;           // διάμεσος των τελευταίων μετρήσεων
let micStream = null, micCtx = null, micAnalyser = null, micTimer = null;
let micBuf = null, pitchHistory = [];
let micStarting = false;   // κλειδί: το πάτημα κλειδώνει ΠΡΙΝ ρωτηθεί ο χρήστης
let micFloatSupported = true, micByteBuf = null, micSettings = null;

function micFail(key) {
  const box = document.getElementById('micError');
  box.textContent = T(key);
  box.classList.remove('hidden');
  document.getElementById('micStart').classList.remove('micbtn-hidden');
}

async function startMic() {
  stopRefTone();
  // Το micStarting μπαίνει ΣΥΓΧΡΟΝΑ, πριν το await: αλλιώς ένα δεύτερο πάτημα όσο
  // περιμένουμε την άδεια ξεκινά δεύτερη ροή, η πρώτη μένει ορφανή με τον χρονιστή
  // της, και το μικρόφωνο συνεχίζει να ηχογραφεί ενώ ο χρήστης νομίζει ότι το έκλεισε.
  if (micStream || micStarting) return;
  micStarting = true;
  try {
  const box = document.getElementById('micError');
  box.classList.add('hidden');
  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) { micFail('mic_insecure'); return; }
  try {
    // Χωρίς επεξεργασία φωνής: τα φίλτρα ηχούς και θορύβου πειράζουν το ύψος του τόνου.
    micStream = await navigator.mediaDevices.getUserMedia({
      audio: { echoCancellation: false, noiseSuppression: false, autoGainControl: false },
    });
  } catch (e) {
    micFail(e && e.name === 'NotFoundError' ? 'mic_none' : 'mic_denied');
    return;
  }
  // Το ζητούμενο δεν είναι πάντα το πραγματικό: το autoGainControl:false δεν υλοποιείται
  // στη Safari και αγνοείται σιωπηλά, και το Chrome μπορεί να αγνοήσει το echoCancellation
  // σε επίπεδο συστήματος. Διαβάζουμε τι πήραμε στην πραγματικότητα, όχι τι ζητήσαμε.
  const track = micStream.getAudioTracks()[0];
  micSettings = track && track.getSettings ? track.getSettings() : null;
  // Αν ο browser εκθέτει τον περιορισμό αλλά επέστρεψε true ενώ ζητήσαμε false, δεν τον
  // τήρησε — μόνο τότε αξίζει προειδοποίηση, όχι μια απλή καταγραφή ολόκληρου του αντικειμένου.
  if (micSettings) {
    ['echoCancellation', 'autoGainControl', 'noiseSuppression'].forEach(k => {
      if (micSettings[k] === true) console.warn('κουρδιστήρι: ζητήθηκε ' + k + '=false, ο browser έδωσε true');
    });
  }
  try {
  micCtx = new (window.AudioContext || window.webkitAudioContext)();
  // το context γεννιέται ΜΕΤΑ το getUserMedia (μετά το παράθυρο άδειας), οπότε μπορεί
  // να βρεθεί εκτός του user-gesture και να ξεκινήσει suspended — resume() όπως παντού αλλού
  micCtx.resume();
  micAnalyser = micCtx.createAnalyser();
  micAnalyser.fftSize = PITCH_WINDOW * 2;   // getFloatTimeDomainData δίνει fftSize δείγματα
  // Το getFloatTimeDomainData έχει ιστορικό αναξιοπιστίας στη Safari iOS με ζωντανό ρεύμα·
  // ανιχνεύουμε την υποστήριξή του και πέφτουμε πίσω σε getByteTimeDomainData, που δίνει
  // ακέραιους 0-255 γύρω από το 128 και τους κλιμακώνουμε ξανά σε [-1, 1].
  micFloatSupported = typeof micAnalyser.getFloatTimeDomainData === 'function';
  micBuf = new Float32Array(micAnalyser.fftSize);
  micByteBuf = micFloatSupported ? null : new Uint8Array(micAnalyser.fftSize);
  micCtx.createMediaStreamSource(micStream).connect(micAnalyser);
  } catch (e) {
    // πήραμε ροή αλλά το Web Audio δεν στήθηκε — μην την αφήσεις ανοιχτή
    stopMic();
    micFail('mic_denied');
    return;
  }
  document.getElementById('micStart').classList.add('micbtn-hidden');
  pitchHistory = [];
  document.getElementById('tunerReadout').textContent = T('mic_listening');
  micTimer = setInterval(tunerFrame, TUNER_INTERVAL_MS);
  } finally { micStarting = false; }
}

function stopMic() {
  clearInterval(micTimer); micTimer = null;
  if (micStream) { micStream.getTracks().forEach(t => t.stop()); micStream = null; }
  if (micCtx) { micCtx.close().catch(() => {}); micCtx = null; }
  micAnalyser = null; micBuf = null; micByteBuf = null; micSettings = null; pitchHistory = [];
  const btn = document.getElementById('micStart');
  if (btn) btn.classList.remove('micbtn-hidden');
  const out = document.getElementById('tunerReadout');
  if (out) out.textContent = '';
  clearCentsBar();
}

// Διάμεσος και όχι μέσος όρος: μία αστοχία οκτάβας ανάμεσα σε σωστές μετρήσεις θα
// τραβούσε τον μέσο όρο, ενώ τη διάμεσο δεν την κουνάει.
function medianOf(a) {
  const s = a.slice().sort((x, y) => x - y);
  return s[Math.floor(s.length / 2)];
}

// ±50 cents γεμίζουν τη λωρίδα. Πιο έξω ο δείκτης κολλάει στην άκρη αντί να βγαίνει από
// τη λωρίδα — ο παίκτης χρειάζεται μόνο να ξέρει προς τα πού να γυρίσει το κλειδί.
const CENTS_SPAN = 50, CENTS_OK = 5;

// ΚΑΘΑΡΗ ΣΥΝΑΡΤΗΣΗ: η μόνη διακλαδική αριθμητική της λωρίδας cents, βγαλμένη από το
// DOM ακριβώς όπως το detectPitch — ώστε να ελέγχεται με απλά νούμερα, χωρίς μικρόφωνο
// ή σελίδα. Η updateCentsBar μένει λεπτό περιτύλιγμα που μόνο διαβάζει/γράφει το DOM.
function centsBarState(cents) {
  const pct = Math.max(-1, Math.min(1, cents / CENTS_SPAN));
  const good = Math.abs(cents) <= CENTS_OK;
  // ΠΡΟΣΟΧΗ ΣΤΗ ΦΟΡΑ: αρνητικά cents = χαμηλά = η χορδή θέλει ΣΦΙΞΙΜΟ.
  const adviceKey = good ? 'tuner_intune' : (cents < 0 ? 'tuner_tighten' : 'tuner_loosen');
  return { left: 50 + pct * 50, good: good, adviceKey: adviceKey };
}

function updateCentsBar(m) {
  const mark = document.getElementById('centsMark');
  const advice = document.getElementById('tunerAdvice');
  if (!mark) return;
  const s = centsBarState(m.cents);
  mark.style.left = s.left + '%';
  mark.classList.toggle('good', s.good);
  if (advice) advice.textContent = T(s.adviceKey);
}

function clearCentsBar() {
  const mark = document.getElementById('centsMark');
  if (!mark) return;
  mark.style.left = '50%';
  mark.classList.remove('good');
  const advice = document.getElementById('tunerAdvice');
  if (advice) advice.textContent = '';
}

function tunerFrame() {
  if (!micAnalyser) return;
  if (micFloatSupported) {
    micAnalyser.getFloatTimeDomainData(micBuf);
  } else {
    micAnalyser.getByteTimeDomainData(micByteBuf);
    for (let i = 0; i < micByteBuf.length; i++) micBuf[i] = (micByteBuf[i] - 128) / 128;
  }
  // Ο ρυθμός δειγματοληψίας διαβάζεται από το ζωντανό context σε κάθε καρέ, ποτέ ως
  // σταθερά: εξαρτάται από τη συσκευή, και μια σύγχυση 44100/48000 είναι σφάλμα ύψους
  // 8.9% — εκατοντάδες cents, χωρίς κανένα άλλο σύμπτωμα εκτός από το να είναι λάθος.
  const r = detectPitch(micBuf.subarray(0, PITCH_WINDOW), micCtx.sampleRate);
  const out = document.getElementById('tunerReadout');
  if (!r.hz) {
    pitchHistory = [];
    out.textContent = T('mic_listening');
    document.querySelectorAll('.course.on').forEach(c => c.classList.remove('on'));
    clearCentsBar();
    return;
  }
  pitchHistory.push(r.hz);
  if (pitchHistory.length > PITCH_SMOOTH) pitchHistory.shift();
  const hz = medianOf(pitchHistory);
  const m = matchString(hz, tunerInst, tunerA4);
  out.textContent = noteName(m.midi, LANG) + '  ·  ' + hz.toFixed(1) + ' Hz';
  document.querySelectorAll('#tunerCourses .course').forEach(c =>
    c.classList.toggle('on', +c.dataset.course === m.course));
  updateCentsBar(m);
}

// ---------- κατάσταση καρτέλας: κοινή βάση για URL, αγαπημένα και λεζάντα εικόνας ----------
// Η εφαρμογή δεν έχει αντικείμενο κατάστασης — η κατάσταση ΕΙΝΑΙ το DOM. Εδώ μπαίνει
// ένας προσαρμογέας ανά καρτέλα που μεταφράζει DOM <-> απλό αντικείμενο. Το write()
// δεν κάνει δική του επικύρωση: περνάει από τα ίδια όρια που ήδη προστατεύουν τα πεδία,
// ώστε να υπάρχει ένα μόνο μονοπάτι ελέγχου.
const TAB_NAMES = ['conv', 'tone', 'heal', 'chladni', 'crystal', 'tuner'];
let tunerInst = 'trichordo', tunerA4 = 432;
let activeTab = 'conv';
let pendingHeal = null;   // συχνότητα από κοινόχρηστο σύνδεσμο· περιμένει χειρονομία χρήστη
let healScrolled = false;   // το scroll του κοινόχρηστου συνδέσμου γίνεται μία φορά

function clearPendingHeal() {
  pendingHeal = null;
  healScrolled = false;
  document.querySelectorAll('.tonecard.pending').forEach(c => c.classList.remove('pending'));
}

function clampNum(v, lo, hi, dflt) {
  const n = +v;
  return Number.isFinite(n) ? Math.min(hi, Math.max(lo, n)) : dflt;
}

// Η οριζόντια στροφή είναι ΠΕΡΙΟΔΙΚΗ: οι 400° δείχνουν ακριβώς ό,τι και οι 40°. Το
// σύρσιμο δεν την περιορίζει πουθενά, οπότε μετά από λίγο παιχνίδι ξεπερνάει εύκολα
// τον κύκλο. Αν απλώς την κόβαμε στις 360, ένας σύνδεσμος θα άνοιγε σε ΑΛΛΗ γωνία από
// αυτήν που είδε ο χρήστης — δηλαδή θα αθετούσε ακριβώς αυτό που υπόσχεται. Τυλίγουμε.
function wrapDeg(d) { return ((d % 360) + 360) % 360; }

const TAB_STATE = {
  conv: { read: () => ({}), write: () => {} },

  tone: {
    read: () => ({ f: +tfreq.value, w: waveSel.value }),
    write: s => {
      if (s.f != null) {
        tfreq.value = clampNum(s.f, 1, 20000, 432);
        if (+tfreq.value >= 20 && +tfreq.value <= 2000) tslider.value = freqToSlider(+tfreq.value);
        syncChips('#panel-tone .presets .chip', +tfreq.value);
        applyFreq();
      }
      if (s.w && Array.prototype.some.call(waveSel.options, o => o.value === s.w)) waveSel.value = s.w;
    },
  },

  heal: {
    read: () => ({ f: musicF }),
    // Δεν ξεκινάμε ήχο μόνοι μας: ο browser μπλοκάρει autoplay χωρίς χειρονομία.
    // Κρατάμε τη συχνότητα και ο renderTones() θα τονίσει την αντίστοιχη κάρτα.
    write: s => { const f = +s.f; pendingHeal = TONES.some(t => t.f === f) ? f : null; },
  },

  chladni: {
    read: () => {
      const s = { f: +chlFreq.value, p: +chlPlate.value, sh: chlShape };
      // Η γωνία θέας αφορά μόνο τη σταγόνα — οι σύνδεσμοι της πλάκας μένουν σύντομοι.
      if (chlShape === 'drop') {
        s.yw = Math.round(wrapDeg(dropYaw * 180 / Math.PI));
        s.pt = Math.round(dropPitch * 180 / Math.PI);
      }
      return s;
    },
    write: s => {
      // ΣΕΙΡΑ: πρώτα το σχήμα. Το setChlShape ξαναγράφει τα min/max του chlPlate
      // (πλάκα 90–110%, σταγόνα 85–120%) και θα «έκοβε» ένα έγκυρο μέγεθος σταγόνας.
      if (s.sh === 'drop' || s.sh === 'plate') setChlShape(s.sh);
      if (s.f != null) {
        chlFreq.value = clampNum(s.f, CHL_FREQ_RANGE[0], CHL_FREQ_RANGE[1], 432);
        chlSlider.value = chlFreq.value;
      }
      if (s.p != null) chlPlate.value = clampNum(s.p, +chlPlate.min, +chlPlate.max, 100);
      // Το τύλιγμα δέχεται και χειρόγραφα URL με 400 ή -400 και τα φέρνει στον κύκλο·
      // η clampNum μένει μόνο για να πιάσει το μη αριθμητικό και να δώσει την προεπιλογή.
      if (s.yw != null) dropYaw = wrapDeg(clampNum(s.yw, -1e6, 1e6, DROP_YAW0 * 180 / Math.PI)) * Math.PI / 180;
      // Το όριο κλίσης ΒΓΑΙΝΕΙ από τη σταθερά της κάμερας, να μη μένει ξεκρέμαστο 85αρι
      // που θα ξεσυγχρονιζόταν σιωπηλά αν αλλάξει το DROP_PITCH_MAX.
      const PT_MAX = Math.round(DROP_PITCH_MAX * 180 / Math.PI);
      if (s.pt != null) dropPitch = clampNum(s.pt, -PT_MAX, PT_MAX, DROP_PITCH0 * 180 / Math.PI) * Math.PI / 180;
      syncChips('#panel-chladni .freq-row .chip[data-f]', +chlFreq.value);
      refreshChl();
    },
  },

  crystal: {
    read: () => ({ f: +cryFreq.value }),
    write: s => {
      if (s.f != null) cryFreq.value = clampNum(s.f, CRY_FREQ_RANGE[0], CRY_FREQ_RANGE[1], 432);
      syncChips('#panel-crystal .freq-row .chip[data-f]', +cryFreq.value);
      growCrystal();
    },
  },
  tuner: {
    read: () => ({ inst: tunerInst, a: tunerA4 }),
    write: s => {
      if (s.inst && TUNINGS[s.inst]) tunerInst = s.inst;
      if (s.a != null) {
        tunerA4 = clampNum(s.a, 390, 460, 432);
        const el = document.getElementById('tunerA4');
        if (el) el.value = tunerA4;
      }
      renderTuner();
    },
  },
};

function stateToQuery(tab, s) {
  const q = new URLSearchParams({ t: tab });
  for (const k of Object.keys(s)) {
    const v = s[k];
    if (v !== null && v !== undefined && v !== '') q.set(k, String(v));
  }
  return '?' + q.toString();
}

function queryToState(search) {
  const q = new URLSearchParams(search);
  const t = q.get('t');
  if (!TAB_STATE[t]) return null;
  const s = {};
  q.forEach((v, k) => { if (k !== 't') s[k] = v; });
  return { tab: t, state: s };
}

function showTab(name) {
  if (!TAB_STATE[name]) name = 'conv';
  activeTab = name;
  document.querySelectorAll('.tab').forEach(x => x.classList.toggle('active', x.dataset.tab === name));
  TAB_NAMES.forEach(p => document.getElementById('panel-' + p).classList.toggle('hidden', p !== name));
  if (name === 'chladni') { if (chlShape === 'drop' && !chlRaf) animateDrop(); }
  else if (chlRaf) { cancelAnimationFrame(chlRaf); chlRaf = null; }
  if (name !== 'tuner') stopRefTone();
  if (name !== 'tuner') stopMic();   // το μικρόφωνο δεν μένει ανοιχτό στο παρασκήνιο
  pushUrl();
  renderFavs();
}

let urlTimer = null;
function pushUrl() {
  // replaceState και όχι pushState: αλλιώς κάθε κίνηση του slider γεμίζει το «πίσω».
  clearTimeout(urlTimer);
  urlTimer = setTimeout(() => {
    try {
      history.replaceState(null, '', stateToQuery(activeTab, TAB_STATE[activeTab].read()));
    } catch (e) { /* file:// ή sandbox — ο σύνδεσμος απλώς δεν ενημερώνεται */ }
  }, 300);
}

function shareUrl() {
  return location.origin + location.pathname + stateToQuery(activeTab, TAB_STATE[activeTab].read());
}

function applyUrlState() {
  const p = queryToState(location.search);
  if (!p) return;
  TAB_STATE[p.tab].write(p.state);
  showTab(p.tab);
}

// ---------- εξαγωγή εικόνας ----------
// Η κάρτα ζωγραφίζεται στη ΔΙΚΗ της ανάλυση, όχι με μεγέθυνση του καμβά των 300px:
// μεγεθυμένο bitmap θα ήταν θολό, δηλαδή ακριβώς το αντίθετο από «κάτι που στέλνεις».
const CARD_W = 1080, CARD_H = 1350, CARD_ART = 1080;

function cardBackground(g) {
  g.fillStyle = '#0a0618';
  g.fillRect(0, 0, CARD_W, CARD_H);
  const blobs = [
    [0.10, -0.05, 0.62, 'rgba(61,229,199,.20)'],
    [0.96, 0.04, 0.60, 'rgba(255,94,196,.17)'],
    [0.88, 0.96, 0.62, 'rgba(160,107,255,.18)'],
    [0.50, 1.06, 0.55, 'rgba(255,150,60,.20)'],
  ];
  for (const [x, y, r, col] of blobs) {
    const gr = g.createRadialGradient(x * CARD_W, y * CARD_H, 0, x * CARD_W, y * CARD_H, r * CARD_W);
    gr.addColorStop(0, col); gr.addColorStop(1, 'rgba(0,0,0,0)');
    g.fillStyle = gr; g.fillRect(0, 0, CARD_W, CARD_H);
  }
}

// Η εικόνα της σταγόνας για την κάρτα PNG, σε δικό της καμβά. ΔΕΝ ξαναχρησιμοποιούμε
// τον καμβά της οθόνης: είναι 300px και τον ζωγραφίζει ο βρόχος rAF ασταμάτητα.
// Ένα καρέ στα 1080 δεν έχει κόστος — το spike μέτρησε τα 600 μέσα στο vsync.
// Η ΦΑΣΗ ΤΗΣ ΚΑΡΤΑΣ ΔΕΝ ΕΙΝΑΙ ΜΗΔΕΝ, ΚΑΙ ΕΧΕΙ ΛΟΓΟ. Στη φάση 0 το στάσιμο κύμα δίνει
// dropPulse(0) = 0.675, δηλαδή το αστέρι βγαίνει 32.5% πιο ΡΗΧΟ. Η κάρτα είναι αυτό που
// μοιράζεται ο χρήστης — πρέπει να δείχνει το αστέρι στην πιο εκφραστική του στιγμή, όχι
// σε μια τυχαία. Εδώ το ημίτονο γίνεται 1, άρα dropPulse = 1 ΑΚΡΙΒΩΣ. Σταθερά, άρα
// ντετερμινιστικό: η ίδια ρύθμιση βγάζει πάντα την ίδια κάρτα.
const DROP_CARD_PHASE = Math.PI / (2 * DROP_PULSE_W);

function dropArtCanvas(size, phase) {
  const art = document.createElement('canvas');
  art.width = art.height = size;
  if (!dropRenderer.impl) { drawDrop(phase, art, size / 300); return art; }
  // ΞΕΧΩΡΙΣΤΟΣ καμβάς για το ίδιο το WebGL context: ΔΕΝ ζωγραφίζουμε στο art που
  // επιστρέφουμε. Το loseContext() παρακάτω σβήνει ΑΜΕΣΩΣ το ζωγραφισμένο περιεχόμενο
  // του καμβά που κρατάει το context — το preserveDrawingBuffer κρατάει το buffer
  // ανάμεσα σε καρέ, όχι μετά την απώλεια context. Αν επιστρέφαμε αυτόν τον καμβά, ο
  // καλών θα έβρισκε άδεια εικόνα μόλις προσπαθούσε να τη σχεδιάσει.
  const glCanvas = document.createElement('canvas');
  glCanvas.width = glCanvas.height = size;
  const R = dropGLCreate(glCanvas);
  if (!R) { drawDrop(phase, art, size / 300); return art; }
  const f = Math.min(CHL_FREQ_RANGE[1], Math.max(CHL_FREQ_RANGE[0], +chlFreq.value || 432));
  const { n, crisp } = findDropResonance(f, +chlPlate.value);
  R.draw({
    n: n, amp: 0.06 + 0.22 * crisp, obl: DROP_OBLATE,
    pulse: dropPulse(phase), rot: phase * 0.05,
    yaw: dropYaw, pitch: dropPitch, bob: dropBob(phase), time: phase,
  });
  // Αντιγραφή ΠΡΙΝ την απελευθέρωση: αυτό είναι το «readPixels/drawImage έχει ήδη
  // γίνει πιο πάνω» που κάνει την εικόνα ασφαλή στον καμβά art πριν χάσουμε το context.
  art.getContext('2d').drawImage(glCanvas, 0, 0);
  // ΑΠΕΛΕΥΘΕΡΩΣΗ, ΚΑΙ ΔΕΝ ΕΙΝΑΙ ΠΡΟΑΙΡΕΤΙΚΗ. Κάθε dropGLCreate ανοίγει ΝΕΟ context
  // WebGL, και ο browser κρατάει περιορισμένο αριθμό — τυπικά 16. Στο δεκαέβδομο ρίχνει
  // το παλαιότερο ΣΙΩΠΗΛΑ, χωρίς σφάλμα. Ο χρήστης μπορεί να κατεβάσει όσες κάρτες
  // θέλει, οπότε χωρίς αυτό μετά από ~16 εξαγωγές οι κάρτες αρχίζουν να βγαίνουν ΑΔΕΙΕΣ
  // και τίποτα δεν δείχνει εδώ.
  const lose = R.gl.getExtension('WEBGL_lose_context');
  if (lose) lose.loseContext();
  return art;
}

function exportCard() {
  const tab = activeTab;
  if (tab !== 'chladni' && tab !== 'crystal') return;
  let art;
  if (chlShape === 'drop' && tab === 'chladni') {
    art = dropArtCanvas(CARD_ART, DROP_CARD_PHASE);   // δικός της καμβάς, μπορεί WebGL
  } else {
    art = document.createElement('canvas');
    art.width = art.height = CARD_ART;
    if (tab === 'crystal') drawCrystal(1, art, CARD_ART / 300);
    else drawChladni(art);
  }

  const card = document.createElement('canvas');
  card.width = CARD_W; card.height = CARD_H;
  const g = card.getContext('2d');
  cardBackground(g);
  g.save();
  g.beginPath();
  g.roundRect ? g.roundRect(0, 120, CARD_W, CARD_ART, 28) : g.rect(0, 120, CARD_W, CARD_ART);
  g.clip();
  g.drawImage(art, 0, 120);
  g.restore();

  const s = TAB_STATE[tab].read();
  g.textAlign = 'center';
  g.fillStyle = '#ffc76b';
  g.font = '600 76px "Segoe UI", system-ui, sans-serif';
  g.fillText(s.f + ' Hz', CARD_W / 2, 1290);
  g.fillStyle = '#a89fc7';
  g.font = '400 34px "Segoe UI", system-ui, sans-serif';
  g.fillText('432Hz Studio', CARD_W / 2, 78);

  card.toBlob(blob => {
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = tab + '_' + s.f + 'Hz.png';
    a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 5000);
    toast(T('png_done'));
  }, 'image/png');
}

// ---------- χρονοδιακόπτης ύπνου ----------
// Παίζει πάντα ΕΝΑ μόνο πράγμα (ο τόνος και η μουσική αλληλοαποκλείονται), οπότε όταν
// ΑΡΧΙΖΕΙ το σβήσιμο δεν χρειάζεται να ξέρει ποιο: σβήνει ό,τι βρει. Το τέλος όμως
// έρχεται 20 δευτερόλεπτα αργότερα, και ως τότε μπορεί να παίζει κάτι άλλο — γι' αυτό
// το σταμάτημα ελέγχει ταυτότητα (βλ. fadeOutAndStop).
const SLEEP_FADE_MS = 20000;
let sleepAt = null, sleepTick = null;

// Ο χρονιστής που σβήνει πρέπει να θυμάται ΠΟΙΟΝ ήχο έπιασε. Αν ο χρήστης ξυπνήσει
// μέσα στα 20 δευτερόλεπτα και ξαναρχίσει κάτι, ο παλιός χρονιστής δεν επιτρέπεται
// να σκοτώσει τον καινούριο ήχο — γι' αυτό ελέγχεται η ταυτότητα πριν το σταμάτημα.
function fadeOutAndStop() {
  if (osc && gain && ctx) {
    const o = osc;
    gain.gain.setTargetAtTime(0, ctx.currentTime, SLEEP_FADE_MS / 4000);
    setTimeout(() => { if (osc === o) stopTone(); }, SLEEP_FADE_MS);
  } else if (music) {
    const m = music, v0 = m.volume, t0 = performance.now();
    const id = setInterval(() => {
      if (music !== m) { clearInterval(id); return; }   // άλλαξε κομμάτι ή σταμάτησε
      const k = Math.min(1, (performance.now() - t0) / SLEEP_FADE_MS);
      m.volume = v0 * (1 - k);
      if (k >= 1) { clearInterval(id); stopMusic(); }
    }, 200);
  }
}

function renderSleep() {
  const left = sleepAt ? Math.max(0, sleepAt - Date.now()) : 0;
  const txt = left
    ? T('sleep_left').replace('{n}', Math.floor(left / 60000) + ':' + String(Math.floor(left / 1000) % 60).padStart(2, '0'))
    : '';
  document.querySelectorAll('.sleeprow .sleepleft').forEach(el => el.textContent = txt);
  // Η επιλογή του chip ανήκει στο setSleep. Αν την πείραζε κι εδώ, το πρώτο
  // δευτερόλεπτο του χρονοδιακόπτη θα ξεδιάλεγε το chip που μόλις πάτησε ο χρήστης.
}

function setSleep(minutes) {
  clearInterval(sleepTick); sleepTick = null;
  sleepAt = minutes > 0 ? Date.now() + minutes * 60000 : null;
  if (sleepAt) {
    sleepTick = setInterval(() => {
      if (Date.now() >= sleepAt) {
        clearInterval(sleepTick); sleepTick = null; sleepAt = null;
        fadeOutAndStop();
        document.querySelectorAll('.sleeprow .chip').forEach(c => c.classList.toggle('sel', c.dataset.sleep === '0'));
      }
      renderSleep();
    }, 1000);
  }
  document.querySelectorAll('.sleeprow .chip').forEach(c =>
    c.classList.toggle('sel', +c.dataset.sleep === minutes));
  renderSleep();
}

// ---------- ειδοποίηση & κοινή χρήση ----------
let toastTimer = null;
function toast(msg) {
  const el = document.getElementById('toast');
  el.textContent = msg;
  el.classList.remove('hidden');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.add('hidden'), 2000);
}

async function doShare() {
  const url = shareUrl();
  if (navigator.share) {
    try { await navigator.share({ title: '432Hz Studio', url }); return; }
    catch (e) { if (e && e.name === 'AbortError') return; }  // ο χρήστης το ακύρωσε
  }
  try {
    await navigator.clipboard.writeText(url);
    toast(T('copied'));
  } catch (e) {
    window.prompt(T('act_share'), url);   // μη ασφαλής προέλευση: δώσ' τον για χειροκίνητη αντιγραφή
  }
}

// ---------- αγαπημένα ----------
// Ένα αγαπημένο ΕΙΝΑΙ στιγμιότυπο καρτέλας, γι' αυτό εμφανίζεται μόνο μέσα στη δική
// του καρτέλα. Η ετικέτα παράγεται από τις παραμέτρους και δεν αποθηκεύεται, ώστε
// καμία αποθηκευμένη εγγραφή να μη χρειάζεται μετάφραση.
const FAV_KEY = 'fav432', FAV_MAX = 12;

function loadFavs() {
  try { return JSON.parse(localStorage.getItem(FAV_KEY)) || {}; } catch (e) { return {}; }
}
function saveFavs(store) {
  try { localStorage.setItem(FAV_KEY, JSON.stringify(store)); } catch (e) { /* γεμάτο ή ιδιωτική περιήγηση */ }
}
function favLabel(tab, s) {
  if (tab === 'chladni') return s.f + ' Hz · ' + (+s.p).toFixed(0) + '% · ' + T(s.sh === 'drop' ? 'chl_shape_drop' : 'chl_shape_plate');
  if (tab === 'tone') return s.f + ' Hz · ' + T('wave_' + (s.w === 'sawtooth' ? 'saw' : s.w));
  return s.f + ' Hz';
}
function addFav(tab) {
  const store = loadFavs();
  const list = store[tab] || (store[tab] = []);
  const s = TAB_STATE[tab].read();
  const key = JSON.stringify(s);
  if (list.some(x => JSON.stringify(x) === key)) return;   // ήδη αποθηκευμένο
  list.push(s);
  while (list.length > FAV_MAX) list.shift();              // παλαιότερο φεύγει πρώτο
  saveFavs(store);
  renderFavs();
}
function removeFav(tab, i) {
  const store = loadFavs();
  if (!store[tab]) return;
  store[tab].splice(i, 1);
  saveFavs(store);
  renderFavs();
}
function renderFavs() {
  const store = loadFavs();
  document.querySelectorAll('.favs').forEach(box => {
    const tab = box.dataset.favs;
    box.innerHTML = '';
    (store[tab] || []).forEach((s, i) => {
      const b = document.createElement('button');
      b.className = 'chip fav';
      b.innerHTML = '<span></span><span class="x">×</span>';
      b.firstChild.textContent = favLabel(tab, s);
      b.onclick = e => {
        if (e.target.classList.contains('x')) { removeFav(tab, i); return; }
        TAB_STATE[tab].write(s);
      };
      box.appendChild(b);
    });
  });
}

// ---------- language switch ----------
function applyLang(l) {
  LANG = I18N[l] ? l : 'el';
  try { localStorage.setItem('lang432', LANG); } catch (e) { /* ιδιωτική περιήγηση */ }
  document.documentElement.lang = LANG;
  document.querySelectorAll('[data-i18n]').forEach(el => { el.textContent = T(el.dataset.i18n); });
  document.querySelectorAll('.langs .chip').forEach(c => c.classList.toggle('sel', c.dataset.l === LANG));
  if (chlShape === 'drop') {
    document.getElementById('chlNote').textContent = T('chl_note_drop');
    document.getElementById('chlPlateLabel').textContent = T('chl_drop_size');
    document.getElementById('chlRotateHint').textContent = T('chl_drop_rotate');
  }
  renderTones();
  if (chlShape !== 'drop') drawChladni();
  drawCrystal(1);
  renderFavs();
  renderSleep();
  renderTuner();
}

// ---------- σύνδεση χειριστών ----------
function wire() {
  document.querySelectorAll('.tab').forEach(t => t.onclick = () => showTab(t.dataset.tab));
  tslider.oninput = () => { tfreq.value = sliderToFreq(+tslider.value).toFixed(1); applyFreq(); };
  tfreq.oninput = () => { const f = +tfreq.value; if (f >= 20 && f <= 2000) tslider.value = freqToSlider(f); applyFreq(); };
  document.querySelectorAll('#panel-tone .presets .chip').forEach(c => c.onclick = () => {
    tfreq.value = c.dataset.f; tslider.value = freqToSlider(+c.dataset.f);
    selectChip('#panel-tone .presets .chip', c);
    applyFreq();
  });
  volInp.oninput = () => { if (gain) gain.gain.setTargetAtTime(vol(), ctx.currentTime, .02); };
  waveSel.onchange = () => { if (osc) osc.type = waveSel.value; };
  document.getElementById('play').onclick = startTone;
  document.getElementById('stop').onclick = stopTone;
  const wavBtn = document.getElementById('wavdl');
  wavBtn.onclick = async () => {
    const f = +tfreq.value || 432;
    const dur = Math.min(600, Math.max(1, +document.getElementById('wavdur').value || 60));
    const sr = 44100, type = waveSel.value;
    wavBtn.disabled = true;
    try {
      const pcm = await wavPcmAsync(type, f, sr, Math.floor(sr * dur));
      const a = document.createElement('a');
      a.href = URL.createObjectURL(new Blob([wavFile(pcm, sr)], { type: 'audio/wav' }));
      a.download = `tone_${f}Hz_${type}_${dur}s.wav`;
      a.click();
      setTimeout(() => URL.revokeObjectURL(a.href), 5000);
    } finally {
      wavBtn.disabled = false;
    }
  };
  chlSlider.oninput = () => { chlFreq.value = chlSlider.value; refreshChl(); };
  chlFreq.oninput = () => { chlSlider.value = chlFreq.value; refreshChl(); };
  // μόλις τελειώσει η πληκτρολόγηση, φέρε την τιμή μέσα στα όρια — αλλιώς το πεδίο,
  // ο slider και τα μαθηματικά δείχνουν τρία διαφορετικά πράγματα
  chlFreq.onchange = () => {
    chlFreq.value = Math.min(CHL_FREQ_RANGE[1], Math.max(CHL_FREQ_RANGE[0], +chlFreq.value || 432));
    chlSlider.value = chlFreq.value;
    refreshChl();
  };
  chlPlate.oninput = refreshChl;
  document.querySelectorAll('#panel-chladni .freq-row .chip[data-f]').forEach(c => c.onclick = () => {
    chlFreq.value = c.dataset.f; chlSlider.value = c.dataset.f;
    selectChip('#panel-chladni .freq-row .chip[data-f]', c);
    refreshChl();
  });
  document.getElementById('chlShapePlate').onclick = () => setChlShape('plate');
  document.getElementById('chlShapeDrop').onclick = () => setChlShape('drop');
  wireDropCamera();
  cryFreq.oninput = growCrystal;
  cryFreq.onchange = () => {
    cryFreq.value = Math.min(CRY_FREQ_RANGE[1], Math.max(CRY_FREQ_RANGE[0], +cryFreq.value || 432));
    growCrystal();
  };
  document.getElementById('cryAgain').onclick = growCrystal;
  document.querySelectorAll('#panel-crystal .freq-row .chip[data-f]').forEach(c => c.onclick = () => {
    cryFreq.value = c.dataset.f;
    selectChip('#panel-crystal .freq-row .chip[data-f]', c);
    growCrystal();
  });
  document.querySelectorAll('.langs .chip').forEach(c => c.onclick = () => applyLang(c.dataset.l));

  document.querySelectorAll('.actbar [data-act]').forEach(b => b.onclick = () => {
    if (b.dataset.act === 'fav') { addFav(b.dataset.tab); toast(T('saved_fav')); }
    else if (b.dataset.act === 'share') doShare();
    else if (b.dataset.act === 'png') exportCard();
  });
  document.querySelectorAll('.sleeprow .chip').forEach(c => c.onclick = () => setSleep(+c.dataset.sleep));
  // τα chips οργάνων φτιάχνονται εδώ, ώστε να μη διπλογράφονται στα δύο index.html
  const instBox = document.getElementById('tunerInstruments');
  if (instBox) {
    INSTRUMENTS.forEach(key => {
      const b = document.createElement('button');
      b.className = 'chip';
      b.dataset.inst = key;
      b.dataset.i18n = 'inst_' + key;
      b.onclick = () => {
        // αλλαγή οργάνου ξαναχτίζει τα κουμπιά του tunerCourses με άλλα κλειδιά,
        // οπότε ο τόνος αναφοράς που ηχεί δεν θα ταίριαζε πια με κανένα αναμμένο κουμπί
        stopRefTone();
        tunerInst = key; renderTuner(); pushUrl();
      };
      instBox.appendChild(b);
    });
  }
  document.querySelectorAll('#panel-tuner .freq-row .chip[data-a]').forEach(c => c.onclick = () => {
    // αλλαγή A4 δεν ξαναρυθμίζει τον ήχο που ήδη παίζει — σταματάμε τον, αλλιώς η
    // οθόνη θα έδειχνε άλλη συχνότητα από αυτήν που ακούγεται
    stopRefTone();
    tunerA4 = +c.dataset.a;
    document.getElementById('tunerA4').value = tunerA4;
    renderTuner();
    pushUrl();
  });
  const a4inp = document.getElementById('tunerA4');
  if (a4inp) a4inp.onchange = () => {
    // ίδιος λόγος με τα chips 432/440 παραπάνω: το A4 άλλαξε, ο ήχος που παίζει όχι
    stopRefTone();
    tunerA4 = clampNum(a4inp.value, 390, 460, 432);
    a4inp.value = tunerA4;
    renderTuner();
    pushUrl();
  };
  const micBtn = document.getElementById('micStart');
  if (micBtn) micBtn.onclick = startMic;
  // παρασκήνιο/κλείδωμα οθόνης: το ρεύμα του μικροφώνου πρέπει να σταματά αμέσως,
  // αλλιώς η κάμερα/το μικρόφωνο μένει ανοιχτό και η ένδειξη παγώνει σαν να είναι ζωντανή
  document.addEventListener('visibilitychange', () => { if (document.hidden) stopMic(); });
}

// ---------- εκκίνηση ----------
function startApp(cfg) {
  APP = Object.assign(APP, cfg);
  I18N = {};
  for (const l of ['el', 'de', 'en']) I18N[l] = Object.assign({}, SHARED_I18N[l], (cfg.i18n || {})[l]);
  if (!I18N[LANG]) LANG = 'el';
  wire();
  applyUrlState();
  applyLang(LANG);
}
