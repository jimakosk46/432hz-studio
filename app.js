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
    "chl_drop_on": "✨ Συντονισμός στα {f}Hz — καθαρό αστέρι {n} ακτίνων!",
    "chl_drop_off": "Εκτός συντονισμού — ασταθές σχήμα. Κοντινότερος συντονισμός: {f}Hz ({n} ακτίνες)",
    "tab_cry": "Κρύσταλλοι",
    "cry_note": "Κάθε συχνότητα γεννά τον δικό της μοναδικό κρύσταλλο πάγου: εξαγωνική συμμετρία όπως οι αληθινές χιονονιφάδες, με τα κλαδιά να υπολογίζονται μαθηματικά από τον αριθμό της συχνότητας. Η ίδια συχνότητα δίνει πάντα τον ίδιο κρύσταλλο — το κρυστάλλινο πορτρέτο της.",
    "cry_title": "❄ Ο κρύσταλλος των {f}Hz",
    "cry_again": "❄ Μεγάλωσε ξανά τον κρύσταλλο"
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
    "chl_drop_on": "✨ Resonanz bei {f}Hz — klarer Stern mit {n} Spitzen!",
    "chl_drop_off": "Außerhalb der Resonanz — instabile Form. Nächste Resonanz: {f}Hz ({n} Spitzen)",
    "tab_cry": "Kristalle",
    "cry_note": "Jede Frequenz erzeugt ihren eigenen, einzigartigen Eiskristall: sechseckige Symmetrie wie echte Schneeflocken, die Äste werden mathematisch aus der Frequenzzahl berechnet. Dieselbe Frequenz ergibt immer denselben Kristall — ihr kristallines Porträt.",
    "cry_title": "❄ Der Kristall von {f}Hz",
    "cry_again": "❄ Kristall erneut wachsen lassen"
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
    "chl_drop_on": "✨ Resonance at {f}Hz — clear {n}-point star!",
    "chl_drop_off": "Off resonance — unstable shape. Nearest resonance: {f}Hz ({n} points)",
    "tab_cry": "Crystals",
    "cry_note": "Every frequency grows its own unique ice crystal: hexagonal symmetry like real snowflakes, with branches computed mathematically from the frequency number. The same frequency always gives the same crystal — its crystalline portrait.",
    "cry_title": "❄ The crystal of {f}Hz",
    "cry_again": "❄ Grow the crystal again"
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
function applyFreq() { if (osc) osc.frequency.setTargetAtTime(+tfreq.value || 432, ctx.currentTime, .02); }

function startTone() {
  if (osc) return;
  stopSongPlayer();
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
}

let music = null, musicF = null;
function stopMusic() {
  if (music) { music.pause(); music.src = ''; music = null; musicF = null; }
  document.querySelectorAll('.tonecard .mus').forEach(b => {
    b.classList.remove('on'); b.textContent = T('music_btn').replace('{f}', b.dataset.f);
  });
}
function toggleMusic(f, btn) {
  if (musicF === f) { stopMusic(); return; }
  stopMusic();
  stopTone();               // μη μπλέκονται τόνος + μουσική
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

function drawChladni() {
  const f = Math.min(CHL_FREQ_RANGE[1], Math.max(CHL_FREQ_RANGE[0], +chlFreq.value || 432));
  const { mode: [bm, bn], fr: bf, crisp } = findPlateResonance(f, +chlPlate.value);
  const W = chlCanvas.width, H = chlCanvas.height;
  const g = chlCanvas.getContext('2d');
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
  document.getElementById('chlPlateVal').textContent = (+chlPlate.value).toFixed(1).replace('.0', '') + '%';
  chlStatus.textContent = (crisp > 0.6 ? T('chl_on') : T('chl_off')).replace('{f}', bf.toFixed(1));
  chlStatus.style.color = crisp > 0.6 ? 'var(--accent)' : 'var(--muted)';
}
function refreshChl() { if (chlShape !== 'drop') drawChladni(); } // η λίστα drop ανανεώνεται μόνη της κάθε frame

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

let chlShape = 'plate'; // 'plate' | 'drop'
let chlRaf = null;

function drawDrop(pulsePhase) {
  const f = Math.min(CHL_FREQ_RANGE[1], Math.max(CHL_FREQ_RANGE[0], +chlFreq.value || 432));
  const { n, fr, crisp } = findDropResonance(f, +chlPlate.value);
  const W = chlCanvas.width, H = chlCanvas.height, cx = W / 2, cy = H / 2;
  const g = chlCanvas.getContext('2d');
  const bg = g.createRadialGradient(cx, cy, 10, cx, cy, W * .7);
  bg.addColorStop(0, '#1d1440'); bg.addColorStop(1, '#120b28');
  g.fillStyle = bg; g.fillRect(0, 0, W, H);
  const baseR = W * 0.30;
  const amp = (0.06 + 0.22 * crisp) * (1 + 0.06 * Math.sin(pulsePhase));
  const rot = pulsePhase * 0.05;
  g.save(); g.translate(cx, cy);
  g.beginPath();
  const steps = 240;
  for (let i = 0; i <= steps; i++) {
    const th = (i / steps) * Math.PI * 2;
    const r = baseR * (1 + amp * Math.cos(n * th - rot));
    const x = Math.cos(th) * r, y = Math.sin(th) * r;
    if (i === 0) g.moveTo(x, y); else g.lineTo(x, y);
  }
  g.closePath();
  const fill = g.createRadialGradient(0, 0, 4, 0, 0, baseR * 1.3);
  fill.addColorStop(0, 'rgba(255,199,107,.20)'); fill.addColorStop(1, 'rgba(255,199,107,0)');
  g.fillStyle = fill; g.fill();
  g.shadowBlur = 14; g.shadowColor = '#ffc76b';
  g.strokeStyle = '#ffe6bd'; g.lineWidth = 2.2;
  g.stroke();
  g.restore();
  document.getElementById('chlPlateVal').textContent = (DROP_R0 * (+chlPlate.value / 100) * 1000).toFixed(2) + 'mm';
  chlStatus.textContent = (crisp > 0.6 ? T('chl_drop_on') : T('chl_drop_off')).replace('{f}', fr.toFixed(1)).replace('{n}', n);
  chlStatus.style.color = crisp > 0.6 ? 'var(--accent)' : 'var(--muted)';
}

function animateDrop() {
  const t0 = performance.now();
  const step = now => {
    drawDrop((now - t0) / 1000);
    chlRaf = requestAnimationFrame(step);
  };
  chlRaf = requestAnimationFrame(step);
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
  if (chlRaf) { cancelAnimationFrame(chlRaf); chlRaf = null; }
  if (shape === 'drop') animateDrop(); else drawChladni();
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

function drawCrystal(t) {
  const f = Math.min(CRY_FREQ_RANGE[1], Math.max(CRY_FREQ_RANGE[0], +cryFreq.value || 432));
  const P = cryParams(f);
  const g = cryCanvas.getContext('2d');
  const W = cryCanvas.width, H = cryCanvas.height, cx = W / 2, cy = H / 2;
  const bg = g.createRadialGradient(cx, cy, 10, cx, cy, W * .7);
  bg.addColorStop(0, '#1d1440'); bg.addColorStop(1, '#120b28');
  g.fillStyle = bg; g.fillRect(0, 0, W, H);
  const ease = 1 - Math.pow(1 - t, 3);
  g.save(); g.translate(cx, cy);
  g.lineCap = 'round'; g.shadowColor = '#7fe7ff';
  if (P.bigHex) { // κεντρική εξαγωνική πλάκα (sectored plate)
    g.shadowBlur = 8; g.strokeStyle = '#bfe6f7'; g.lineWidth = P.w * .7;
    cryHex(g, 0, 0, P.L * P.bigHex * ease, 0, 'rgba(140,200,255,.08)');
  }
  if (P.ring && ease > .3) { // εσωτερικό εξαγωνικό δαχτυλίδι
    g.shadowBlur = 5; g.strokeStyle = 'rgba(185,225,250,.55)'; g.lineWidth = P.w * .45;
    cryHex(g, 0, 0, P.L * P.ring * Math.min(1, (ease - .3) / .5), 0);
  }
  for (let k = 0; k < 6; k++) {
    g.save(); g.rotate(k * Math.PI / 3);
    const gl = P.L * ease;
    g.shadowBlur = 10; g.strokeStyle = '#dff4ff'; g.lineWidth = P.w;
    crySeg(g, 0, 0, P.L, 0, ease);
    g.lineWidth = P.w * .65; g.strokeStyle = '#a9e2f5'; g.shadowBlur = 6;
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
      g.shadowBlur = 12; g.shadowColor = '#ffd479'; g.fillStyle = '#ffd479';
      g.beginPath(); g.arc(P.L, 0, 2.2, 0, 7); g.fill();
      g.shadowColor = '#7fe7ff';
    }
    g.restore();
  }
  const hr = P.hex * Math.min(1, t * 2.5); // εξάγωνο στον πυρήνα
  g.shadowBlur = 8; g.strokeStyle = '#cfeeff'; g.lineWidth = P.w * .8;
  cryHex(g, 0, 0, hr, Math.PI / 6);
  g.restore();
  cryTitle.textContent = T('cry_title').replace('{f}', f);
}

function growCrystal() {
  if (cryRaf) cancelAnimationFrame(cryRaf);
  const t0 = performance.now();
  const step = now => {
    const t = Math.min(1, (now - t0) / 3200);
    drawCrystal(t);
    if (t < 1) cryRaf = requestAnimationFrame(step);
  };
  cryRaf = requestAnimationFrame(step);
}

// ---------- language switch ----------
function applyLang(l) {
  LANG = I18N[l] ? l : 'el';
  localStorage.setItem('lang432', LANG);
  document.documentElement.lang = LANG;
  document.querySelectorAll('[data-i18n]').forEach(el => { el.textContent = T(el.dataset.i18n); });
  document.querySelectorAll('.langs .chip').forEach(c => c.classList.toggle('sel', c.dataset.l === LANG));
  if (chlShape === 'drop') {
    document.getElementById('chlNote').textContent = T('chl_note_drop');
    document.getElementById('chlPlateLabel').textContent = T('chl_drop_size');
  }
  renderTones();
  if (chlShape !== 'drop') drawChladni();
  drawCrystal(1);
}

// ---------- σύνδεση χειριστών ----------
function wire() {
  document.querySelectorAll('.tab').forEach(t => t.onclick = () => {
    document.querySelectorAll('.tab').forEach(x => x.classList.toggle('active', x === t));
    ['conv', 'tone', 'heal', 'chladni', 'crystal'].forEach(name =>
      document.getElementById('panel-' + name).classList.toggle('hidden', t.dataset.tab !== name));
    if (t.dataset.tab === 'chladni') { if (chlShape === 'drop' && !chlRaf) animateDrop(); }
    else if (chlRaf) { cancelAnimationFrame(chlRaf); chlRaf = null; }
  });
  tslider.oninput = () => { tfreq.value = sliderToFreq(+tslider.value).toFixed(1); applyFreq(); };
  tfreq.oninput = () => { const f = +tfreq.value; if (f >= 20 && f <= 2000) tslider.value = freqToSlider(f); applyFreq(); };
  document.querySelectorAll('#panel-tone .chip').forEach(c => c.onclick = () => {
    tfreq.value = c.dataset.f; tslider.value = freqToSlider(+c.dataset.f);
    selectChip('#panel-tone .chip', c);
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
  cryFreq.oninput = growCrystal;
  cryFreq.onchange = () => {
    cryFreq.value = Math.min(CRY_FREQ_RANGE[1], Math.max(CRY_FREQ_RANGE[0], +cryFreq.value || 432));
    growCrystal();
  };
  document.getElementById('cryAgain').onclick = growCrystal;
  document.querySelectorAll('#panel-crystal .chip').forEach(c => c.onclick = () => {
    cryFreq.value = c.dataset.f;
    selectChip('#panel-crystal .chip', c);
    growCrystal();
  });
  document.querySelectorAll('.langs .chip').forEach(c => c.onclick = () => applyLang(c.dataset.l));

}

// ---------- εκκίνηση ----------
function startApp(cfg) {
  APP = Object.assign(APP, cfg);
  I18N = {};
  for (const l of ['el', 'de', 'en']) I18N[l] = Object.assign({}, SHARED_I18N[l], (cfg.i18n || {})[l]);
  if (!I18N[LANG]) LANG = 'el';
  wire();
  applyLang(LANG);
}
