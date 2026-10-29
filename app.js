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
    "tab_heal": "Συχνότητες",
    "tone_copy_note": "Οι περιγραφές μιλούν για παραδόσεις και συμβολισμούς· οι τόνοι είναι για ακρόαση και χαλάρωση, όχι ιατρική θεραπεία.",
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
    "music_offline": "Χωρίς σύνδεση: αυτό το κομμάτι δεν έχει κατέβει για offline.",
    "music_failed": "Το κομμάτι δεν φόρτωσε. Δοκίμασε ξανά.",
    "need_phones": "🎧 Η μουσική θέλει ακουστικά — ο παλμός γεννιέται από τη διαφορά ανάμεσα στα δύο αυτιά (binaural)",
    "subaudible_note": "Ο καθαρός τόνος των 7,83 Hz είναι κάτω από το όριο της ανθρώπινης ακοής: συνήθως δεν ακούγεται, και πολλά ηχεία δεν μπορούν καν να τον παίξουν.",
    "credit": "από τον Δημήτρη Κατσαβό",
    "tab_chl": "Σχήματα ήχου",
    "chl_note": "Προσομοίωση πλάκας Chladni: η «άμμος» μαζεύεται εκεί όπου η πλάκα δεν δονείται. Καθαρό, συμμετρικό σχήμα βγαίνει όταν η συχνότητα πετυχαίνει συντονισμό της πλάκας. Δοκίμασε 432 και 440 — και μετά άλλαξε λίγο το «μέγεθος πλάκας»: κάθε συχνότητα έχει την πλάκα που τη βγάζει πανέμορφη.",
    "chl_freq": "Συχνότητα (Hz)",
    "chl_mic_start": "🎙 Ζωντανός ήχος", "chl_mic_stop": "■ Κλείσιμο μικροφώνου",
    "chl_mic_request": "Ζητείται άδεια μικροφώνου…", "chl_mic_listening": "Ακούω · προσομοίωση · φόρτος επεξεργασίας {pct}%",
    "chl_mic_stopped": "Το μικρόφωνο είναι κλειστό.", "chl_mic_error": "Δεν ήταν δυνατή η έναρξη μικροφώνου.",
    "chl_simulation": "Προσομοίωση από ήχο μικροφώνου· δεν μετρά πραγματική πλάκα.",
    "history_title": "432 Hz: ιστορία και στοιχεία",
    "history_intro": "Το λα στα 432 Hz (A = 432 Hz) είναι μια εναλλακτική συχνότητα αναφοράς για το κούρδισμα. Αν το ίδιο σύστημα κουρδίσματος μεταφερθεί ομοιόμορφα από A = 440 Hz σε A = 432 Hz, όλοι οι φθόγγοι πέφτουν κατά περίπου 31,77 cents· τα μουσικά διαστήματα παραμένουν αμετάβλητα.",
    "history_section_verdi": "Από το γαλλικό «diapason normal» στον Βέρντι",
    "history_verdi": "Η Γαλλία όρισε το 1859 ενιαίο πρότυπο κουρδίσματος, το λεγόμενο «diapason normal», με A = 435 Hz· οι 15 °C αφορούσαν το πρότυπο διαπασών. Ο Βέρντι τάχθηκε υπέρ χαμηλότερου και ενιαίου τονικού ύψους και το 1881 υποστήριξε πρόταση για A = 432 Hz. Η σημερινή ονομασία «κούρδισμα Βέρντι» απλοποιεί αυτή την ιστορία και δεν αποδεικνύει ότι όλα τα έργα του συντέθηκαν με A = 432 Hz.",
    "history_section_1939": "Η διεθνής σύσταση του 1939",
    "history_1939": "Η διάσκεψη του Λονδίνου τον Μάιο του 1939 συνέστησε το A = 440 Hz (440 κύκλους ανά δευτερόλεπτο) ως διεθνές τονικό ύψος αναφοράς, δεκαετίες πριν από το ISO 16. Η επίσημη διαδικασία έτρεχε στην επιτροπή 43/3b της ISA· δημοσίευμα της εποχής αποδίδει την οργάνωση στο British Standards Institution, υπό την αιγίδα της ISA, ενώ οι ανάγκες των ραδιοφωνικών φορέων της International Broadcasting Union ήταν σημαντικό παράλληλο κίνητρο.",
    "history_rrg": "Γερμανοί ειδικοί συμμετείχαν στην προετοιμασία: γερμανικό δημοσίευμα της εποχής καταγράφει πρόταση της Γερμανικής Ακουστικής Επιτροπής και αναφέρει ότι τη σχετική επιτροπή της ISA την προέδρευε η Γερμανία· μεταγενέστερη αρχειακή μελέτη αναφέρει συμμετοχή εκπροσώπου της Reichs-Rundfunk-Gesellschaft. Οι πηγές που εξετάστηκαν δεν τεκμηριώνουν ότι η RRG από μόνη της προκάλεσε τη σύγκληση της διάσκεψης.",
    "history_section_iso": "ISO/R 16 (1955) και ISO 16 (1975)",
    "history_iso": "Το ISO/R 16:1955 ήταν Σύσταση ISO: το Συμβούλιο του ISO την ενέκρινε στη συνεδρίασή του στη Στοκχόλμη τον Ιούνιο του 1955 και η πρώτη έκδοση κυκλοφόρησε τον Νοέμβριο του ίδιου έτους. Το ISO 16:1975 την αντικατέστησε με τεχνικά ταυτόσημο κείμενο. Η σύσταση του 1939 και το πρότυπο του 1975 είναι λοιπόν διαφορετικά στάδια της τυποποίησης.",
    "history_claims": "Τα 432 Hz δεν αντιστοιχούν στους συντονισμούς Schumann: αυτοί είναι ηλεκτρομαγνητικό φαινόμενο της Γης, με θεμελιώδη συχνότητα περίπου 7,8 Hz. Μια απλή αριθμητική σύνδεση δεν αποδεικνύει από μόνη της επίδραση στη μουσική ή στην υγεία. Μικρές μελέτες έχουν αναφέρει βραχυπρόθεσμες διαφορές, αλλά λείπουν ισχυρά, ανεξάρτητα αναπαραγόμενα στοιχεία για ειδικά θεραπευτικά οφέλη που να οφείλονται στο A = 432 Hz.",
    "history_sources": "Πηγές",
    "history_source_france": "Γαλλικό διοικητικό δελτίο: οδηγία του 1860 για το diapason, με αναφορά στην υπουργική απόφαση του 1859",
    "history_source_verdi": "Ellen Lockhart, αρχειακή μελέτη για τον Βέρντι και το A=432 (2025)",
    "history_source_nature": "G. W. C. Kaye, δημοσίευμα της εποχής για τη διάσκεψη (Nature, 1939)",
    "history_source_funkschau": "Funkschau, γερμανικό δημοσίευμα της εποχής (1939)",
    "history_source_gribenski": "Fanny Gribenski, αρχειακή ιστορία του διεθνούς κουρδίσματος (2023)",
    "history_source_nasa": "NASA Goddard: εξήγηση του συντονισμού Schumann",
    "history_source_r16": "ISO/R 16:1955, σύσταση (ψηφιακό αντίγραφο από iTeh)",
    "history_source_iso16_pdf": "ISO 16:1975, ψηφιακό κείμενο (SIST)",
    "history_source_iso16": "ISO 16:1975, επίσημη καταχώριση ISO",
    "chl_plate": "Μέγεθος πλάκας",
    "chl_on": "✨ Συντονισμός στα {f}Hz — καθαρό, συμμετρικό σχήμα!",
    "chl_off": "Εκτός συντονισμού — θολό σχήμα. Κοντινότερος συντονισμός: {f}Hz",
    "chl_shape_plate": "Πλάκα",
    "chl_shape_drop": "Σταγόνα νερού",
    "chl_note_drop": "Ακουστική αιώρηση: υπέρηχοι κρατούν μια σταγόνα νερού στον αέρα και την πλαταίνουν σε δισκάκι. Όταν η ένταση πάλλεται, το χείλος σχηματίζει n λοβούς που αναποδογυρίζουν στη μισή συχνότητα της διέγερσης. Το «2ος, 3ος…» σε τέτοια βίντεο είναι ο αριθμός των λοβών, όχι αρμονική του ήχου. Σε πραγματικό νερό αυτό συμβαίνει σε μερικές δεκάδες Hz (π.χ. ~25 Hz για 2 λοβούς, ~50 Hz για 3–4)· εδώ ο τόνος αντιστοιχίζεται σε μια μικρή σταγόνα και η κίνηση δείχνεται σε αργή κίνηση.",
    "chl_drop_size": "Μέγεθος σταγόνας",
    "chl_drop_rotate": "σύρε πάνω στη σταγόνα για να τη γυρίσεις · διπλό κλικ για επαναφορά",
    "chl_drop_speed": "Ταχύτητα κίνησης",
    "chl_drop_speed_val": "Αργή κίνηση ×{x}",
    "chl_drop_speed_lab": "≈ ταχύτητα εργαστηρίου",
    "chl_drop_volume": "Ένταση τόνου",
    "chl_drop_play": "▶ Παίξε τον τόνο",
    "chl_drop_stop": "■ Σταμάτα τον τόνο",
    "chl_drop_on": "✨ Συντονισμός στα {f} — καθαρό σχήμα με {n} λοβούς!",
    "chl_drop_off": "Εκτός συντονισμού — ασταθές σχήμα. Κοντινότερος συντονισμός: {f} ({n} λοβοί)",
    "chl_drop_mixed": "δύο τρόποι μαζί: {n} και {n2} λοβοί",
    "chl_drop_sources": "Πηγές",
    "chl_drop_source_shen": "Shen, Xie & Wei (2010), Phys. Rev. E 81, 046305",
    "chl_drop_source_ran": "Ran, Fredericks & Saylor (2013), πείραμα Clemson",
    "chl_drop_source_shen_cpl": "Shen, Xie & Wei (2010), Chin. Phys. Lett. 27, 076801",
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
    "sleep_left": "Σταματά σε {n}",
    "tools_title": "Πρόσφατα & ρυθμίσεις",
    "recent_title": "Πρόσφατες ρυθμίσεις",
    "recent_empty": "Δεν υπάρχουν ακόμα πρόσφατες ρυθμίσεις.",
    "recent_clear": "Καθαρισμός λίστας",
    "recent_label": "Επαναφορά: {x}",
    "settings_export": "Εξαγωγή ρυθμίσεων",
    "settings_import": "Εισαγωγή ρυθμίσεων",
    "settings_hint": "Αγαπημένα, πρόσφατα, γλώσσα και δικά σου όργανα — σε αρχείο JSON, μόνο σε αυτή τη συσκευή.",
    "settings_import_prompt": "Να αντικατασταθούν οι αντίστοιχες ρυθμίσεις με αυτές του αρχείου;",
    "settings_exported": "Οι ρυθμίσεις αποθηκεύτηκαν σε αρχείο ✓",
    "settings_imported": "Οι ρυθμίσεις εισήχθησαν ✓",
    "settings_export_error": "Η εξαγωγή δεν ήταν δυνατή.",
    "settings_import_error": "Το αρχείο δεν είναι έγκυρο αρχείο ρυθμίσεων (ή είναι μεγαλύτερο από 100 KB). Δεν άλλαξε τίποτα."
  },
  "de": {
    "tab_tone": "Tongenerator",
    "tab_heal": "Frequenzen",
    "tone_copy_note": "Die Beschreibungen erzählen von Traditionen und Symbolik; die Töne sind zum Zuhören und Entspannen da, nicht als medizinische Behandlung.",
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
    "music_offline": "Offline: Dieser Titel ist nicht heruntergeladen.",
    "music_failed": "Der Titel konnte nicht geladen werden. Bitte erneut versuchen.",
    "need_phones": "🎧 Für die Musik Kopfhörer nötig — der Puls entsteht erst aus dem Unterschied zwischen beiden Ohren (binaural)",
    "subaudible_note": "Der reine 7,83-Hz-Ton liegt unterhalb des menschlichen Hörbereichs: Meist hört man ihn nicht, und viele Lautsprecher können ihn gar nicht wiedergeben.",
    "credit": "von Dimitri Katsavos",
    "tab_chl": "Klangmuster",
    "chl_note": "Chladni-Platten-Simulation: Der „Sand\" sammelt sich dort, wo die Platte nicht schwingt. Ein klares, symmetrisches Muster entsteht, wenn die Frequenz eine Resonanz der Platte trifft. Probiere 432 und 440 — und ändere dann leicht die Plattengröße: Jede Frequenz hat eine Platte, auf der sie wunderschön aussieht.",
    "chl_freq": "Frequenz (Hz)",
    "chl_mic_start": "🎙 Live-Audio", "chl_mic_stop": "■ Mikrofon ausschalten",
    "chl_mic_request": "Mikrofonfreigabe wird angefragt…", "chl_mic_listening": "Hört zu · Simulation · Verarbeitungsaufwand {pct}%",
    "chl_mic_stopped": "Das Mikrofon ist ausgeschaltet.", "chl_mic_error": "Das Mikrofon konnte nicht gestartet werden.",
    "chl_simulation": "Simulation mit Mikrofonton; misst keine echte Platte.",
    "history_title": "432 Hz: Geschichte und Fakten",
    "history_intro": "A = 432 Hz ist eine alternative Referenztonhöhe. Wird dieselbe Stimmung einheitlich von A = 440 Hz auf A = 432 Hz abgesenkt, liegen alle Töne um etwa 31,77 Cent tiefer; die Intervalle bleiben unverändert.",
    "history_section_verdi": "Vom französischen „diapason normal“ zu Verdi",
    "history_verdi": "Frankreich legte 1859 einen einheitlichen Normalstimmton fest, den „diapason normal“, mit A = 435 Hz; die Angabe 15 °C bezog sich auf die Referenzstimmgabel. Verdi setzte sich für eine tiefere, einheitliche Stimmtonhöhe ein und unterstützte 1881 einen Vorschlag für A = 432 Hz. Die heutige Bezeichnung „Verdi-Stimmung“ vereinfacht die Geschichte und beweist nicht, dass alle seine Werke mit A = 432 Hz komponiert wurden.",
    "history_section_1939": "Die internationale Empfehlung von 1939",
    "history_1939": "Die Londoner Konferenz empfahl im Mai 1939 A = 440 Hz (440 Schwingungen pro Sekunde) als internationale Referenztonhöhe – Jahrzehnte vor ISO 16. Das formale Verfahren lief im ISA-Komitee 43/3b; ein zeitgenössischer Bericht nennt die British Standards Institution als Organisatorin unter der Ägide der ISA, und die Anforderungen des Rundfunks und der International Broadcasting Union waren ein wichtiger paralleler Antrieb.",
    "history_rrg": "Deutsche Fachleute wirkten an den Vorbereitungen mit: Ein zeitgenössischer deutscher Bericht dokumentiert einen Vorschlag des Deutschen Akustischen Ausschusses und nennt Deutschland als Vorsitz des zuständigen ISA-Komitees; eine spätere Archivstudie nennt die Beteiligung eines Vertreters der Reichs-Rundfunk-Gesellschaft. Die geprüften Quellen belegen nicht, dass die RRG die Konferenz allein initiiert hat.",
    "history_section_iso": "ISO/R 16 (1955) und ISO 16 (1975)",
    "history_iso": "ISO/R 16:1955 war eine ISO-Empfehlung. Der ISO-Rat nahm sie im Juni 1955 bei seiner Sitzung in Stockholm an; die erste Ausgabe erschien im November 1955. ISO 16:1975 ersetzte die Empfehlung und war mit ihr technisch identisch. Die Empfehlung von 1939 und der Standard von 1975 sind daher zwei getrennte Etappen der Normung.",
    "history_claims": "Die grundlegende Schumann-Resonanz liegt bei etwa 7,8 Hz, nicht bei 432 Hz; dabei handelt es sich um ein elektromagnetisches Phänomen im Erde-Ionosphäre-System. Eine bloße numerische Beziehung belegt keine Wirkung auf Musik oder Gesundheit. Kleine Studien berichten über kurzfristige Unterschiede; belastbare, unabhängig replizierte Belege für spezifische therapeutische Vorteile, die gerade auf A = 432 Hz zurückzuführen sind, fehlen jedoch.",
    "history_sources": "Quellen",
    "history_source_france": "Französisches Verwaltungsblatt: Anweisung von 1860 zum diapason, mit Verweis auf den Erlass von 1859",
    "history_source_verdi": "Ellen Lockhart, Archivstudie zu Verdi und A=432 (2025)",
    "history_source_nature": "G. W. C. Kaye, zeitgenössischer Bericht der Konferenz (Nature, 1939)",
    "history_source_funkschau": "Funkschau, zeitgenössischer deutscher Bericht (1939)",
    "history_source_gribenski": "Fanny Gribenski, Archivgeschichte der internationalen Stimmung (2023)",
    "history_source_nasa": "NASA Goddard: Erklärung der Schumann-Resonanz",
    "history_source_r16": "ISO/R 16:1955, Empfehlung (Digitalisat von iTeh)",
    "history_source_iso16_pdf": "ISO 16:1975, digitaler Text (SIST)",
    "history_source_iso16": "ISO 16:1975, offizieller ISO-Eintrag",
    "chl_plate": "Plattengröße",
    "chl_on": "✨ Resonanz bei {f}Hz — klares, symmetrisches Muster!",
    "chl_off": "Außerhalb der Resonanz — verschwommenes Muster. Nächste Resonanz: {f}Hz",
    "chl_shape_plate": "Platte",
    "chl_shape_drop": "Wassertropfen",
    "chl_note_drop": "Akustische Levitation: Ultraschall hält einen Wassertropfen in der Luft und drückt ihn zu einer flachen Scheibe. Schwankt die Schallintensität, bildet der Rand n Zacken, die mit der halben Anregungsfrequenz umklappen. „2., 3. …“ in solchen Videos ist die Zahl der Zacken, keine Harmonische des Tons. Bei echtem Wasser geschieht das bei einigen zehn Hertz (etwa 25 Hz bei 2 Zacken, 50 Hz bei 3–4); hier wird der Ton einem kleinen Tropfen zugeordnet und die Bewegung in Zeitlupe gezeigt.",
    "chl_drop_size": "Tropfengröße",
    "chl_drop_rotate": "zieh am Tropfen, um ihn zu drehen · Doppelklick setzt zurück",
    "chl_drop_speed": "Bewegungstempo",
    "chl_drop_speed_val": "Zeitlupe ×{x}",
    "chl_drop_speed_lab": "≈ Labortempo",
    "chl_drop_volume": "Lautstärke",
    "chl_drop_play": "▶ Ton abspielen",
    "chl_drop_stop": "■ Ton stoppen",
    "chl_drop_on": "✨ Resonanz bei {f} — klare Form mit {n} Zacken!",
    "chl_drop_off": "Außerhalb der Resonanz — instabile Form. Nächste Resonanz: {f} ({n} Zacken)",
    "chl_drop_mixed": "zwei Schwingungsformen zugleich: {n} und {n2} Zacken",
    "chl_drop_sources": "Quellen",
    "chl_drop_source_shen": "Shen, Xie & Wei (2010), Phys. Rev. E 81, 046305",
    "chl_drop_source_ran": "Ran, Fredericks & Saylor (2013), Clemson-Experiment",
    "chl_drop_source_shen_cpl": "Shen, Xie & Wei (2010), Chin. Phys. Lett. 27, 076801",
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
    "sleep_left": "Stoppt in {n}",
    "tools_title": "Zuletzt & Einstellungen",
    "recent_title": "Zuletzt verwendet",
    "recent_empty": "Noch keine zuletzt verwendeten Einstellungen.",
    "recent_clear": "Liste leeren",
    "recent_label": "Wiederherstellen: {x}",
    "settings_export": "Einstellungen exportieren",
    "settings_import": "Einstellungen importieren",
    "settings_hint": "Favoriten, zuletzt verwendet, Sprache und eigene Instrumente — als JSON-Datei, nur auf diesem Gerät.",
    "settings_import_prompt": "Die entsprechenden Einstellungen durch die aus der Datei ersetzen?",
    "settings_exported": "Einstellungen als Datei gespeichert ✓",
    "settings_imported": "Einstellungen importiert ✓",
    "settings_export_error": "Export nicht möglich.",
    "settings_import_error": "Keine gültige Einstellungsdatei (oder größer als 100 KB). Es wurde nichts geändert."
  },
  "en": {
    "tab_tone": "Tone generator",
    "tab_heal": "Frequencies",
    "tone_copy_note": "The descriptions share traditions and symbolism; the tones are for listening and relaxing, not medical treatment.",
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
    "music_offline": "Offline: this track has not been downloaded.",
    "music_failed": "The track could not be loaded. Please try again.",
    "need_phones": "🎧 Headphones required for the music — the pulse arises from the difference between the two ears (binaural)",
    "subaudible_note": "The pure 7.83 Hz tone lies below the range of human hearing: you usually won't hear it, and many speakers can't play it at all.",
    "credit": "by Dimitri Katsavos",
    "tab_chl": "Sound patterns",
    "chl_note": "Chladni plate simulation: the \"sand\" gathers where the plate does not vibrate. A clear, symmetric pattern appears when the frequency hits a resonance of the plate. Try 432 and 440 — then slightly change the plate size: every frequency has a plate that makes it beautiful.",
    "chl_freq": "Frequency (Hz)",
    "chl_mic_start": "🎙 Live audio", "chl_mic_stop": "■ Turn microphone off",
    "chl_mic_request": "Requesting microphone permission…", "chl_mic_listening": "Listening · simulation · processing load {pct}%",
    "chl_mic_stopped": "The microphone is off.", "chl_mic_error": "The microphone could not be started.",
    "chl_simulation": "Microphone driven simulation; does not measure a real plate.",
    "history_title": "432 Hz: history and facts",
    "history_intro": "A = 432 Hz is an alternative reference pitch. If the same tuning system is uniformly rescaled from A = 440 Hz to A = 432 Hz, all pitches move about 31.77 cents lower and the intervals stay unchanged.",
    "history_section_verdi": "From the French “diapason normal” to Verdi",
    "history_verdi": "In 1859 France set a uniform standard pitch, the “diapason normal”, at A = 435 Hz; the 15 °C condition referred to the reference tuning fork. Verdi argued for a lower, uniform pitch and in 1881 supported a proposal for A = 432 Hz. The modern label “Verdi tuning” simplifies that history and does not prove that he composed all his music at A = 432 Hz.",
    "history_section_1939": "The 1939 international recommendation",
    "history_1939": "The London conference in May 1939 recommended A = 440 Hz (440 cycles per second) as the international reference pitch, decades before ISO 16. The formal process ran in ISA committee 43/3b; a contemporary report names the British Standards Institution as organizer under ISA auspices, and broadcasting needs voiced by the International Broadcasting Union were an important parallel driver.",
    "history_rrg": "German specialists took part in the preparations: a contemporary German report records a proposal by the German Acoustical Committee and states that Germany chaired the ISA committee concerned, while later archival scholarship reports that a Reichs-Rundfunk-Gesellschaft representative joined preparatory discussions. The sources reviewed do not establish that the RRG alone initiated the conference.",
    "history_section_iso": "ISO/R 16 (1955) and ISO 16 (1975)",
    "history_iso": "ISO/R 16:1955 was an ISO Recommendation, accepted by the ISO Council at its Stockholm meeting in June 1955 and first issued in November 1955. ISO 16:1975 replaced it and is technically identical to it. The 1939 recommendation and the 1975 standard are therefore distinct stages of standardization.",
    "history_claims": "432 Hz is not a Schumann resonance: those are electromagnetic resonances of the Earth–ionosphere system, with a fundamental near 7.8 Hz. A numerical relationship does not by itself establish any effect on music or health. Small studies have reported short-term differences, but robust, independently replicated evidence of specific therapeutic benefits attributable to A = 432 Hz is lacking.",
    "history_sources": "Sources",
    "history_source_france": "French administrative bulletin: 1860 instruction on the diapason, citing the 1859 ministerial order",
    "history_source_verdi": "Ellen Lockhart, archival study of Verdi and A=432 (2025)",
    "history_source_nature": "G. W. C. Kaye, contemporary report of the conference (Nature, 1939)",
    "history_source_funkschau": "Funkschau, contemporary German report (1939)",
    "history_source_gribenski": "Fanny Gribenski, archival history of international tuning (2023)",
    "history_source_nasa": "NASA Goddard: Schumann resonance explainer",
    "history_source_r16": "ISO/R 16:1955, Recommendation (iTeh digital copy)",
    "history_source_iso16_pdf": "ISO 16:1975, digitized text (SIST)",
    "history_source_iso16": "ISO 16:1975, official ISO entry",
    "chl_plate": "Plate size",
    "chl_on": "✨ Resonance at {f}Hz — clear symmetric pattern!",
    "chl_off": "Off resonance — blurred pattern. Nearest resonance: {f}Hz",
    "chl_shape_plate": "Plate",
    "chl_shape_drop": "Water drop",
    "chl_note_drop": "Acoustic levitation: ultrasound holds a water drop in the air and flattens it into a disc. When the sound intensity pulses, the rim forms n lobes that flip at half the excitation frequency. “2nd, 3rd…” in such videos is the number of lobes, not a harmonic of the sound. In real water this happens at a few tens of hertz (about 25 Hz for 2 lobes, 50 Hz for 3–4); here the tone is mapped to a small drop and the motion is shown in slow motion.",
    "chl_drop_size": "Drop size",
    "chl_drop_rotate": "drag the drop to turn it · double-click to reset",
    "chl_drop_speed": "Motion speed",
    "chl_drop_speed_val": "Slow motion ×{x}",
    "chl_drop_speed_lab": "≈ lab speed",
    "chl_drop_volume": "Tone volume",
    "chl_drop_play": "▶ Play tone",
    "chl_drop_stop": "■ Stop tone",
    "chl_drop_on": "✨ Resonance at {f} — clear shape with {n} lobes!",
    "chl_drop_off": "Off resonance — unstable shape. Nearest resonance: {f} ({n} lobes)",
    "chl_drop_mixed": "two modes at once: {n} and {n2} lobes",
    "chl_drop_sources": "Sources",
    "chl_drop_source_shen": "Shen, Xie & Wei (2010), Phys. Rev. E 81, 046305",
    "chl_drop_source_ran": "Ran, Fredericks & Saylor (2013), Clemson experiment",
    "chl_drop_source_shen_cpl": "Shen, Xie & Wei (2010), Chin. Phys. Lett. 27, 076801",
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
    "sleep_left": "Stops in {n}",
    "tools_title": "Recent & settings",
    "recent_title": "Recent settings",
    "recent_empty": "No recent settings yet.",
    "recent_clear": "Clear list",
    "recent_label": "Restore: {x}",
    "settings_export": "Export settings",
    "settings_import": "Import settings",
    "settings_hint": "Favourites, recent settings, language and your own instruments — as a JSON file, on this device only.",
    "settings_import_prompt": "Replace the matching settings with the ones in this file?",
    "settings_exported": "Settings saved to a file ✓",
    "settings_imported": "Settings imported ✓",
    "settings_export_error": "Export was not possible.",
    "settings_import_error": "This is not a valid settings file (or it is larger than 100 KB). Nothing was changed."
  }
};
let I18N = SHARED_I18N;

function preferredLanguage() {
  try { return localStorage.getItem('lang432') || 'el'; }
  catch (e) { return 'el'; } // ιδιωτική περιήγηση ή αποκλεισμένος χώρος αποθήκευσης
}
let LANG = preferredLanguage();
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
let ctx = null, osc = null, gain = null, dropTone = null;

function dropToneTarget() {
  return Math.min(CHL_FREQ_RANGE[1], Math.max(CHL_FREQ_RANGE[0], +chlFreq.value || 432));
}
window.dropToneTarget = dropToneTarget;
function syncDropToneButton() {
  const button = document.getElementById('chlDropPlay');
  if (!button) return;
  button.textContent = T(dropTone ? 'chl_drop_stop' : 'chl_drop_play');
  button.setAttribute('aria-pressed', String(!!dropTone));
}
function rampDropToneParam(param, target) {
  const now = ctx.currentTime;
  param.cancelScheduledValues(now);
  param.setValueAtTime(param.value, now);
  param.linearRampToValueAtTime(target, now + 0.05);
}
function stopDropTone() {
  if (!dropTone) return;
  const tone = dropTone;
  dropTone = null;
  rampDropToneParam(tone.gain.gain, 0);
  setTimeout(() => { tone.osc.stop(); tone.osc.disconnect(); tone.gain.disconnect(); }, 200);
  syncDropToneButton();
}
function playDropTone() {
  if (chlMicUiState === 'listening' || chlMicUiState === 'requesting' || dropTone) return;
  stopRefTone();
  stopTone();
  stopMusic();
  APP.stopSongPlayer();
  stopMic();
  ctx = ctx || new (window.AudioContext || window.webkitAudioContext)();
  ctx.resume();
  const toneOsc = ctx.createOscillator(), toneGain = ctx.createGain();
  toneOsc.type = 'sine';
  toneOsc.frequency.setValueAtTime(dropToneTarget(), ctx.currentTime);
  toneGain.gain.setValueAtTime(0, ctx.currentTime);
  toneGain.gain.linearRampToValueAtTime(dropToneGain(+chlDropVol.value), ctx.currentTime + 0.05);
  toneOsc.connect(toneGain).connect(ctx.destination);
  toneOsc.start();
  dropTone = { osc: toneOsc, gain: toneGain };
  syncDropToneButton();
}

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
  stopDropTone();
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
  stopDropTone();
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
  { f: 7.83, cover: 'tracks/covers/7.83.webp',
    name: { el: 'Συντονισμός Schumann — ο παλμός της Γης', de: 'Schumann-Resonanz — der Puls der Erde', en: 'Schumann resonance — the pulse of the Earth' },
    desc: {
      el: 'Ανάμεσα στο έδαφος και την ιονόσφαιρα, οι κεραυνοί όλου του πλανήτη κρατούν ζωντανό έναν αδιάκοπο ηλεκτρομαγνητικό κυματισμό· ο βασικός του τόνος είναι περίπου στα 7,83 Hz. Γι\' αυτό πολλοί τον λένε «παλμό της Γης» και τον επιλέγουν για αργή, βαθιά χαλάρωση.',
      de: 'Zwischen Erdboden und Ionosphäre halten die Blitze des ganzen Planeten eine stetige elektromagnetische Schwingung in Gang; ihr Grundton liegt bei etwa 7,83 Hz. Deshalb nennen viele sie den »Puls der Erde« und wählen sie für langsames, tiefes Entspannen.',
      en: 'Between the ground and the ionosphere, lightning all over the planet keeps a constant electromagnetic ripple going; its fundamental sits at about 7.83 Hz. That is why many call it "the pulse of the Earth" and choose it for slow, deep relaxation.' },
    yt: '7.83 Hz Schumann resonance healing sleep music' },
  { f: 40, cover: 'tracks/covers/40.webp',
    name: { el: 'Κύματα γάμμα — ο ρυθμός των 40 Hz', de: 'Gamma-Wellen — der 40-Hz-Rhythmus', en: 'Gamma waves — the 40 Hz rhythm' },
    desc: {
      el: 'Ο εγκέφαλος έχει τον δικό του ρυθμό γάμμα, γύρω στα 40 Hz. Ένας ήχος που πάλλεται 40 φορές το δευτερόλεπτο μπορεί να τον «παρασύρει»: στο ηλεκτροεγκεφαλογράφημα φαίνεται τότε μια απόκριση ακριβώς στα 40 Hz (auditory steady-state response). Τι σημαίνει αυτό για τη συγκέντρωση και τη μνήμη το ερευνούν ακόμη οι επιστήμονες.',
      de: 'Das Gehirn hat einen eigenen Gamma-Rhythmus um 40 Hz. Ein Klang, der 40-mal pro Sekunde pulsiert, kann ihn mitziehen: Im EEG zeigt sich dann eine Antwort genau bei 40 Hz (auditory steady-state response). Was das für Konzentration und Gedächtnis bedeutet, wird noch erforscht.',
      en: 'The brain has its own gamma rhythm around 40 Hz. A sound that pulses 40 times a second can pull it along: an EEG then shows a response at exactly 40 Hz (the auditory steady-state response). What this means for focus and memory is still being researched.' },
    yt: '40 Hz gamma waves focus study concentration music' },
  { f: 111, cover: 'tracks/covers/111.webp',
    name: { el: 'Η ιερή συχνότητα των αρχαίων ναών', de: 'Die heilige Frequenz der alten Tempel', en: 'The sacred frequency of ancient temples' },
    desc: {
      el: 'Ακουστικές μετρήσεις στο Υπόγειο Ιερό της Μάλτας (περ. 3600 π.Χ.) και σε νεολιθικούς θολωτούς τάφους της Ιρλανδίας βρήκαν έντονο αντήχημα γύρω στα 110–112 Hz — περίπου εκεί που φτάνει μια βαθιά αντρική φωνή. Από εκεί και το όνομα «συχνότητα των ναών». Ένας χαμηλός, ζεστός τόνος για αργό διαλογισμό.',
      de: 'Akustische Messungen im Hypogäum von Malta (um 3600 v. Chr.) und in jungsteinzeitlichen Ganggräbern Irlands fanden eine kräftige Resonanz um 110–112 Hz — ungefähr dort, wo eine tiefe Männerstimme liegt. Daher der Name »Tempelfrequenz«. Ein tiefer, warmer Ton für ruhige Meditation.',
      en: 'Acoustic measurements in Malta\'s Hypogeum (c. 3600 BC) and in Neolithic passage tombs in Ireland found a strong resonance around 110–112 Hz — roughly where a deep male voice sits. Hence the name "temple frequency". A low, warm tone for slow meditation.' },
    yt: '111 Hz healing frequency deep meditation music' },
  { f: 136.1, cover: 'tracks/covers/136.1.webp',
    name: { el: 'ΟΜ — ο τόνος της Γης', de: 'OM — der Ton der Erde', en: 'OM — the tone of the Earth' },
    desc: {
      el: 'Το 1978 ο Hans Cousto «μετέφρασε» σε ήχο την περιφορά της Γης γύρω από τον Ήλιο: ανέβασε τον ρυθμό ενός έτους 32 οκτάβες, ώσπου έγινε ακουστός. Έτσι προέκυψαν τα 136,1 Hz, ο τόνος «ΟΜ» σε πολλά τιβετιανά μπολ και διαπασών για γιόγκα. Παραδοσιακά συνδέεται με το τσάκρα της καρδιάς.',
      de: '1978 hat Hans Cousto den Umlauf der Erde um die Sonne in Klang »übersetzt«: Er hat den Jahresrhythmus um 32 Oktaven nach oben verschoben, bis er hörbar wurde. So entstanden die 136,1 Hz, auf die heute viele Klangschalen und Yoga-Stimmgabeln als »OM«-Ton gestimmt sind. Traditionell wird er mit dem Herzchakra verbunden.',
      en: 'In 1978 Hans Cousto "translated" the Earth\'s orbit around the Sun into sound: he raised the yearly rhythm by 32 octaves until it became audible. The result was 136.1 Hz, the "OM" tone of many singing bowls and yoga tuning forks. Traditionally it is linked to the heart chakra.' },
    yt: '136.1 Hz OM chant meditation music' },
  { f: 174, cover: 'tracks/covers/174.webp',
    name: { el: 'Γαλήνη & αίσθηση ασφάλειας', de: 'Ruhe & Geborgenheit', en: 'Calm & a sense of safety' },
    desc: {
      el: 'Ο χαμηλότερος τόνος της σύγχρονης λίστας Solfeggio, που τον συνδέει με την αίσθηση ασφάλειας και το «άφημα». Βαθύς και απαλός· ταιριάζει στο τέλος μιας κουραστικής μέρας ή λίγο πριν τον ύπνο.',
      de: 'Der tiefste Ton der modernen Solfeggio-Liste, die ihn mit Geborgenheit und Loslassen verbindet. Tief und weich — passend zum Ende eines anstrengenden Tages oder kurz vor dem Schlafengehen.',
      en: 'The lowest tone of the modern Solfeggio list, which links it to a sense of safety and letting go. Deep and soft — a good fit for the end of a long day or just before sleep.' },
    yt: '174 Hz pain relief healing music' },
  { f: 285, cover: 'tracks/covers/285.webp',
    name: { el: 'Ανανέωση & ενέργεια', de: 'Erneuerung & Energie', en: 'Renewal & energy' },
    desc: {
      el: 'Στη λίστα Solfeggio είναι ο τόνος της ανανέωσης, ένα νέο ξεκίνημα για σώμα και μυαλό. Καθαρός και ήσυχος — για ένα σύντομο διάλειμμα, όταν θέλεις να πάρεις ανάσα και να ξαναβρείς δυνάμεις.',
      de: 'In der Solfeggio-Liste ist er der Ton der Erneuerung, ein Neustart für Körper und Kopf. Klar und ruhig — für eine kurze Pause, wenn du durchatmen und neue Kraft sammeln willst.',
      en: 'In the Solfeggio list it is the tone of renewal, a fresh start for body and mind. Clear and quiet — for a short break when you want to catch your breath and recharge.' },
    yt: '285 Hz tissue healing regeneration music' },
  { f: 396, cover: 'tracks/covers/396.webp',
    name: { el: 'Θάρρος & σταθερότητα — Ut', de: 'Mut & Stabilität — Ut', en: 'Courage & stability — Ut' },
    desc: {
      el: 'Ο πρώτος τόνος της κλίμακας Solfeggio. Η παράδοση τον συνδέει με το τσάκρα της ρίζας και με το να αφήνεις πίσω σου φόβο και ενοχές. Σταθερός, γειωμένος ήχος — καλό σημείο για να ξεκινήσεις.',
      de: 'Der erste Ton der Solfeggio-Skala. Die Überlieferung verbindet ihn mit dem Wurzelchakra und damit, Angst und Schuld hinter sich zu lassen. Ein stabiler, geerdeter Klang — ein guter Einstieg.',
      en: 'The first tone of the Solfeggio scale. Tradition links it to the root chakra and to leaving fear and guilt behind. A steady, grounded sound — a good place to start.' },
    yt: '396 Hz release fear guilt healing music' },
  { f: 417, cover: 'tracks/covers/417.webp',
    name: { el: 'Αλλαγή & νέα ξεκινήματα — Re', de: 'Wandel & Neuanfänge — Re', en: 'Change & new beginnings — Re' },
    desc: {
      el: 'Το Re είναι ο τόνος της αλλαγής: στην παράδοση σημαίνει να ξεκαθαρίσεις τα παλιά και να κάνεις χώρο για κάτι καινούργιο. Συνδέεται με το ιερό τσάκρα και τη δημιουργικότητα.',
      de: 'Re ist der Ton des Wandels: In der Überlieferung steht er dafür, Altes aufzuräumen und Platz für Neues zu schaffen. Er wird mit dem Sakralchakra und mit Kreativität verbunden.',
      en: 'Re is the tone of change: in the tradition it stands for clearing out the old and making room for something new. It is associated with the sacral chakra and with creativity.' },
    yt: '417 Hz cleanse negativity facilitate change music' },
  { f: 432, cover: 'tracks/covers/432.webp',
    name: { el: 'Λα = 432 Hz — το κούρδισμα του Βέρντι', de: 'A = 432 Hz — die Verdi-Stimmung', en: 'A = 432 Hz — Verdi tuning' },
    desc: {
      el: 'Μια εναλλακτική στο καθιερωμένο Λα = 440 Hz, που συχνά τη λένε «κούρδισμα του Βέρντι», επειδή ο συνθέτης υποστήριζε ένα χαμηλότερο Λα. Όλες οι νότες ακούγονται περίπου 32 cents πιο χαμηλά· πολλοί τη βρίσκουν πιο ζεστή και απαλή — θέμα γούστου.{app432}',
      de: 'Eine Alternative zum üblichen A = 440 Hz, oft »Verdi-Stimmung« genannt, weil sich der Komponist für ein tieferes A eingesetzt hat. Alle Töne klingen etwa 32 Cent tiefer; viele empfinden das als wärmer und weicher — Geschmackssache.{app432}',
      en: 'An alternative to the standard A = 440 Hz, often called "Verdi tuning" because the composer argued for a lower A. Every note sounds about 32 cents lower; many people find it warmer and softer — a matter of taste.{app432}' },
    yt: '432 Hz healing melodies relaxing music' },
  { f: 528, cover: 'tracks/covers/528.webp',
    name: { el: 'Αγάπη & αρμονία — Mi', de: 'Liebe & Harmonie — Mi', en: 'Love & harmony — Mi' },
    desc: {
      el: 'Η πιο γνωστή συχνότητα της λίστας Solfeggio· οι θαυμαστές της την αποκαλούν «τόνο των θαυμάτων» και τη συνδέουν με την αγάπη και την αρμονία. Φωτεινός, γλυκός ήχος, που η παράδοση τον αντιστοιχεί στο τσάκρα του ηλιακού πλέγματος.',
      de: 'Die bekannteste Frequenz der Solfeggio-Liste; ihre Fans nennen sie den »Ton der Wunder« und verbinden sie mit Liebe und Harmonie. Ein heller, süßer Klang, den die Überlieferung dem Solarplexuschakra zuordnet.',
      en: 'The best-known frequency of the Solfeggio list; its fans call it the "miracle tone" and link it to love and harmony. A bright, sweet sound that tradition assigns to the solar plexus chakra.' },
    yt: '528 Hz love DNA repair miracle healing music' },
  { f: 639, cover: 'tracks/covers/639.webp',
    name: { el: 'Σχέσεις & επικοινωνία — Fa', de: 'Beziehungen & Kommunikation — Fa', en: 'Relationships & communication — Fa' },
    desc: {
      el: 'Ο τόνος της καρδιάς: στην παράδοση εκφράζει την αρμονία στις σχέσεις, την κατανόηση και τη συγχώρεση. Ωραία συντροφιά όταν θέλεις να ξανασυνδεθείς με κάποιον — ή με τον εαυτό σου.',
      de: 'Der Ton des Herzens: In der Überlieferung steht er für Harmonie in Beziehungen, für Verständnis und Vergebung. Ein schöner Begleiter, wenn du dich wieder mit jemandem verbinden willst — oder mit dir selbst.',
      en: 'The tone of the heart: in the tradition it stands for harmony in relationships, understanding and forgiveness. Good company when you want to reconnect with someone — or with yourself.' },
    yt: '639 Hz relationships love connection healing music' },
  { f: 741, cover: 'tracks/covers/741.webp',
    name: { el: 'Καθαρότητα & έκφραση — Sol', de: 'Klarheit & Ausdruck — Sol', en: 'Clarity & expression — Sol' },
    desc: {
      el: 'Κατά την παράδοση, ο τόνος της καθαρότητας και της αυθεντικής έκφρασης, δεμένος με το τσάκρα του λαιμού — τη φωνή σου. Ζωηρός, ξύπνιος ήχος για ώρες δημιουργικής δουλειάς.',
      de: 'Der Überlieferung nach der Ton von Klarheit und echtem Ausdruck, verbunden mit dem Halschakra — deiner Stimme. Ein lebhafter, wacher Klang für kreative Stunden.',
      en: 'In the tradition, the tone of clarity and authentic expression, tied to the throat chakra — your voice. A lively, wakeful sound for creative hours.' },
    yt: '741 Hz detox cleanse aura healing music' },
  { f: 852, cover: 'tracks/covers/852.webp',
    name: { el: 'Διαίσθηση & εσωτερική φωνή — La', de: 'Intuition & innere Stimme — La', en: 'Intuition & the inner voice — La' },
    desc: {
      el: 'Συνδέεται με το τσάκρα του τρίτου ματιού και με την «εσωτερική φωνή». Ψηλός και αέρινος· πολλοί τον διαλέγουν για ήσυχο διαλογισμό και στιγμές αυτογνωσίας.',
      de: 'Er wird mit dem Chakra des dritten Auges und der »inneren Stimme« verbunden. Hoch und luftig — viele wählen ihn für stille Meditation und Momente der Selbstbesinnung.',
      en: 'It is associated with the third-eye chakra and the "inner voice". High and airy — many choose it for quiet meditation and moments of reflection.' },
    yt: '852 Hz awaken intuition third eye music' },
  { f: 963, cover: 'tracks/covers/963.webp',
    name: { el: 'Η «συχνότητα των θεών» — Si', de: 'Die »Frequenz der Götter« — Si', en: 'The "frequency of the gods" — Si' },
    desc: {
      el: 'Ο ψηλότερος τόνος της κλίμακας, με το παρατσούκλι «συχνότητα των θεών». Οι πνευματικές παραδόσεις τον συνδέουν με το τσάκρα της κορώνας και την αίσθηση ενότητας με το σύμπαν. Φωτεινός και ευρύχωρος — για τα τελευταία λεπτά ενός διαλογισμού.',
      de: 'Der höchste Ton der Skala, mit dem Spitznamen »Frequenz der Götter«. Spirituelle Traditionen verbinden ihn mit dem Kronenchakra und dem Gefühl, eins mit dem Universum zu sein. Hell und weit — für die letzten Minuten einer Meditation.',
      en: 'The highest tone of the scale, nicknamed "the frequency of the gods". Spiritual traditions link it to the crown chakra and a feeling of oneness with the universe. Bright and spacious — for the last minutes of a meditation.' },
    yt: '963 Hz pineal gland activation crown chakra music' },
];
const list = document.getElementById('tonelist');

function renderTones() {
  list.innerHTML = `<p class="tone-copy-note" role="note">${T('tone_copy_note')}</p>`;
  TONES.forEach(t => {
    const el = document.createElement('div');
    el.className = 'tonecard';
    if (pendingHeal === t.f) el.classList.add('pending');
    const ytUrl = 'https://www.youtube.com/results?search_query=' + encodeURIComponent(t.yt);
    const musOn = musicF === t.f;
    // Music tracks below 60 Hz are binaural (generate_melody_tracks.py): headphones required.
    // Below 20 Hz the pure oscillator tone is additionally below the hearing range.
    const phones = (t.f < 60 ? `<span class="phones">${T('need_phones')}</span>` : '')
      + (t.f < 20 ? `<span class="phones subaudible">${T('subaudible_note')}</span>` : '');
    // Covers are decorative (empty alt), small and dimmed: the text stays the calm focus.
    // Fixed width/height avoid layout shift; lazy loading keeps the first paint light.
    el.innerHTML = `<div class="side"><img class="cover" src="${t.cover}" alt="" width="86" height="86" loading="lazy" decoding="async"><div class="freq">${t.f}<small>Hz</small></div></div>
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
    const cover = el.querySelector('.cover');
    cover.onerror = () => cover.classList.add('missing');   // e.g. offline and never viewed
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
  updateMediaSession();
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
  music.addEventListener('play', updateMediaSession);
  music.addEventListener('pause', updateMediaSession);
  music.addEventListener('ended', updateMediaSession);
  const m = music;
  m.addEventListener('error', () => {
    if (music !== m) return;   // stopMusic() empties src, which also fires 'error'
    stopMusic();
    toast(T(navigator.onLine === false ? 'music_offline' : 'music_failed'), 5000);
  });
  music.play().catch(() => {});   // load failures are reported by the 'error' listener
  musicF = f;
  btn.classList.add('on'); btn.textContent = T('music_stop').replace('{f}', f);
  updateMediaSession();
}

function updateMediaSession() {
  const session = navigator.mediaSession;
  if (!session) return;
  if (!music || musicF === null) {
    session.metadata = null;
    session.playbackState = 'none';
    return;
  }
  const tone = TONES.find(item => item.f === musicF);
  if (tone && typeof MediaMetadata === 'function') {
    session.metadata = new MediaMetadata({
      title: `${tone.name[LANG]} (${tone.f} Hz)`,
      artist: '432Hz Studio',
      album: T('tab_heal'),
      artwork: [
        { src: new URL(tone.cover, document.baseURI).href, sizes: '512x512', type: 'image/webp' },
      ],
    });
  }
  session.playbackState = music.paused ? 'paused' : 'playing';
}

function stepMediaTrack(direction) {
  if (!music || musicF === null) return;
  const index = TONES.findIndex(item => item.f === musicF);
  const next = TONES[(index + direction + TONES.length) % TONES.length];
  const button = document.querySelector(`.tonecard .mus[data-f="${next.f}"]`);
  if (button) toggleMusic(next.f, button);
}

function installMediaSession() {
  const session = navigator.mediaSession;
  if (!session || typeof session.setActionHandler !== 'function') return;
  const actions = {
    play: () => { if (music) music.play().catch(() => {}); },
    pause: () => { if (music) music.pause(); },
    previoustrack: () => stepMediaTrack(-1),
    nexttrack: () => stepMediaTrack(1),
  };
  for (const [action, handler] of Object.entries(actions)) {
    try { session.setActionHandler(action, handler); } catch (e) { /* action unsupported */ }
  }
  document.addEventListener('visibilitychange', updateMediaSession);
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

// retune-export:begin
window.RetuneExport = (() => {
  const MOBILE_BUDGET = 64 * 1024 * 1024;
  const CHUNK_FRAMES = 16384;
  const BYTES_PER_WAV_SAMPLE = 2;

  function outputFrameCount(inputFrames, sampleRate, targetHz) {
    return Math.round(inputFrames * 440 / targetHz);
  }
  function estimatePeakBytes(fileBytes, durationSeconds, sampleRate = 48000, channels = 2, targetHz = 432) {
    const inputFrames = Math.ceil(durationSeconds * sampleRate);
    const outputFrames = outputFrameCount(inputFrames, sampleRate, targetHz);
    const decoded = inputFrames * channels * 4;
    const wav = outputFrames * channels * BYTES_PER_WAV_SAMPLE;
    return fileBytes + decoded + wav * 2 + 8 * 1024 * 1024;
  }
  function memoryBudgetBytes(deviceMemoryGb) {
    if (!Number.isFinite(deviceMemoryGb) || deviceMemoryGb <= 0) return MOBILE_BUDGET;
    return Math.max(MOBILE_BUDGET, Math.min(256 * 1024 * 1024, deviceMemoryGb * 64 * 1024 * 1024));
  }
  function abortError() {
    const error = new Error('The operation was aborted.');
    error.name = 'AbortError';
    return error;
  }
  function throwIfAborted(signal) { if (signal && signal.aborted) throw abortError(); }
  function wavHeader(frameCount, channelCount, sampleRate) {
    const dataBytes = frameCount * channelCount * BYTES_PER_WAV_SAMPLE;
    if (dataBytes > 0xffffffff - 36) throw new RangeError('WAV exceeds the classic RIFF 4 GiB limit.');
    const header = new ArrayBuffer(44), view = new DataView(header);
    const str = (at, value) => { for (let i = 0; i < value.length; i++) view.setUint8(at + i, value.charCodeAt(i)); };
    str(0, 'RIFF'); view.setUint32(4, dataBytes + 36, true); str(8, 'WAVE');
    str(12, 'fmt '); view.setUint32(16, 16, true); view.setUint16(20, 1, true);
    view.setUint16(22, channelCount, true); view.setUint32(24, sampleRate, true);
    view.setUint32(28, sampleRate * channelCount * BYTES_PER_WAV_SAMPLE, true);
    view.setUint16(32, channelCount * BYTES_PER_WAV_SAMPLE, true); view.setUint16(34, 16, true);
    str(36, 'data'); view.setUint32(40, dataBytes, true);
    return header;
  }
  async function resampleToWav(audioBuffer, targetHz, { signal, onProgress = () => {}, chunkFrames = CHUNK_FRAMES } = {}) {
    if (!Number.isFinite(targetHz) || targetHz < 300 || targetHz > 500) throw new RangeError('Target pitch must be between 300 and 500 Hz.');
    const inputFrames = audioBuffer.length, sampleRate = audioBuffer.sampleRate;
    const channelCount = audioBuffer.numberOfChannels;
    const outputFrames = outputFrameCount(inputFrames, sampleRate, targetHz);
    const dataBytes = outputFrames * channelCount * BYTES_PER_WAV_SAMPLE;
    if (dataBytes > 0xffffffff - 36) throw new RangeError('WAV exceeds the classic RIFF 4 GiB limit.');
    const channels = Array.from({ length: channelCount }, (_, i) => audioBuffer.getChannelData(i));
    const parts = [wavHeader(outputFrames, channelCount, sampleRate)];
    const step = targetHz / 440;
    for (let outStart = 0; outStart < outputFrames; outStart += chunkFrames) {
      throwIfAborted(signal);
      const count = Math.min(chunkFrames, outputFrames - outStart);
      const bytes = new Uint8Array(count * channelCount * BYTES_PER_WAV_SAMPLE);
      const view = new DataView(bytes.buffer);
      for (let frame = 0; frame < count; frame++) {
        const src = Math.min(inputFrames - 1, (outStart + frame) * step);
        const lo = Math.floor(src), hi = Math.min(inputFrames - 1, lo + 1), mix = src - lo;
        for (let ch = 0; ch < channelCount; ch++) {
          const sample = channels[ch][lo] * (1 - mix) + channels[ch][hi] * mix;
          const pcm = Math.max(-32768, Math.min(32767, Math.round(sample * 32767)));
          view.setInt16((frame * channelCount + ch) * 2, pcm, true);
        }
      }
      parts.push(bytes);
      onProgress(0.1 + 0.9 * (outStart + count) / outputFrames);
      await new Promise(resolve => setTimeout(resolve, 0));
    }
    throwIfAborted(signal);
    return new Blob(parts, { type: 'audio/wav' });
  }
  async function fileDuration(file, signal) {
    const url = URL.createObjectURL(file), probe = document.createElement('audio');
    try {
      return await new Promise((resolve, reject) => {
        const clean = () => { probe.removeAttribute('src'); probe.load(); URL.revokeObjectURL(url); };
        const abort = () => { clean(); reject(abortError()); };
        probe.onloadedmetadata = () => {
          const duration = probe.duration;
          clean();
          if (signal) signal.removeEventListener('abort', abort);
          resolve(duration);
        };
        probe.onerror = () => { clean(); reject(new Error('metadata-unavailable')); };
        if (signal) signal.addEventListener('abort', abort, { once: true });
        probe.src = url;
      });
    } catch (error) { URL.revokeObjectURL(url); throw error; }
  }
  async function decodeFileToWav(file, targetHz, { signal, onProgress = () => {}, deviceMemoryGb = navigator.deviceMemory } = {}) {
    throwIfAborted(signal);
    onProgress(0.02);
    const duration = await fileDuration(file, signal);
    if (!Number.isFinite(duration) || duration <= 0) throw new Error('duration-unavailable');
    const budget = memoryBudgetBytes(deviceMemoryGb);
    const estimated = estimatePeakBytes(file.size, duration, 48000, 2, targetHz);
    if (estimated > budget) {
      const error = new RangeError('estimated-memory-limit');
      error.estimatedBytes = estimated;
      throw error;
    }
    throwIfAborted(signal);
    onProgress(0.08);
    const AudioContextType = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextType) throw new Error('audio-context-unavailable');
    const audioContext = new AudioContextType();
    try {
      const data = await file.arrayBuffer();
      const decoded = await audioContext.decodeAudioData(data);
      throwIfAborted(signal);
      const actualEstimate = estimatePeakBytes(file.size, decoded.length / decoded.sampleRate,
        decoded.sampleRate, decoded.numberOfChannels, targetHz);
      if (actualEstimate > budget) {
        const error = new RangeError('estimated-memory-limit');
        error.estimatedBytes = actualEstimate;
        throw error;
      }
      return await resampleToWav(decoded, targetHz, { signal, onProgress });
    } finally { await audioContext.close(); }
  }
  return { outputFrameCount, estimatePeakBytes, memoryBudgetBytes, resampleToWav, decodeFileToWav };
})();
// retune-export:end

// ---------- Chladni patterns ----------
const chlCanvas = document.getElementById('chl');
const chlDropCanvas = document.getElementById('chlDrop');
const chlReflectionCanvas = document.getElementById('chlReflection');
const chlDrop2dCanvas = document.getElementById('chlDrop2d');
const chlFreq = document.getElementById('chlFreq');
const chlSlider = document.getElementById('chlSlider');
const chlPlate = document.getElementById('chlPlate');
const chlStatus = document.getElementById('chlStatus');
const chlDropControls = document.getElementById('chlDropControls');
const chlDropSources = document.getElementById('chlDropSources');
const chlDropSpeed = document.getElementById('chlDropSpeed');
const chlDropSpeedVal = document.getElementById('chlDropSpeedVal');
const chlDropVol = document.getElementById('chlDropVol');
let chlLive = null, chlMicUiState = 'stopped', chlMicUiLoad = 0;
function renderChlMicState() {
  const status = document.getElementById('chlMicState');
  if (!status) return;
  status.textContent = chlMicUiState === 'requesting' ? T('chl_mic_request')
    : chlMicUiState === 'listening' ? T('chl_mic_listening').replace('{pct}', Math.min(100, Math.round(chlMicUiLoad * 100)))
    : chlMicUiState === 'error' ? T('chl_mic_error') : T('chl_mic_stopped');
  document.getElementById('chlMicStart').classList.toggle('hidden', chlMicUiState === 'listening' || chlMicUiState === 'requesting');
  document.getElementById('chlMicStop').classList.toggle('hidden', chlMicUiState !== 'listening' && chlMicUiState !== 'requesting');
  const dropPlay = document.getElementById('chlDropPlay');
  if (dropPlay) dropPlay.disabled = chlMicUiState === 'listening' || chlMicUiState === 'requesting';
  syncDropToneButton();
}
window.stopChladniLive = () => { if (chlLive) chlLive.stop(); };
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
  if (!canvas) { canvas = chlCanvas; fitCanvasToScreen(canvas); }
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
  if (dropTone) rampDropToneParam(dropTone.osc.frequency, dropToneTarget());
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

// drop-physics:begin
const DROP_B2 = 0;
const DROP_A_MAX = 0.30;
const DROP_OBL_BASE = 0.90, DROP_OBL_VOL = 0.05, DROP_OBL_MAX = 0.95;
const DROP_TOP_EPS = 0.12;
const DROP_LAMB_R = 5e-3, DROP_LAMB_NU = 1.0e-6, DROP_LAB_HZ = 15;
const DROP_TAU_RANGE = [0.25, 1.0];
const DROP_SPEED_RANGE = [0.5, 15];
const DROP_SPEED_DEFAULT = 1.75, DROP_VOLUME_DEFAULT = 0.25;
const DROP_MIX_RATIO = 0.83;
const DROP_Q = { LOW: 0, MED: 1, HIGH: 2, ULTRA: 3 };

function dropFlip(cycles) {
  return Math.cos(2 * Math.PI * cycles);
}

function dropAmp(crisp) {
  return Math.min(DROP_A_MAX, 0.06 + 0.22 * crisp);
}

// Apply the shared amplitude budget before evaluating either harmonic.
function dropModeScale(modes) {
  let total = 0;
  for (const mode of modes) total += Math.abs(mode.a);
  return total > DROP_A_MAX ? DROP_A_MAX / total : 1;
}

function dropScaleModes(modes) {
  const scale = dropModeScale(modes);
  return modes.map(mode => ({ ...mode, a: mode.a * scale }));
}

function dropStar(theta, modes, b2) {
  const scale = dropModeScale(modes);
  let r = 1;
  for (const mode of modes) {
    const q = mode.a * scale * mode.c;
    r += q * Math.cos(mode.n * theta) + b2 * q * q * Math.cos(2 * mode.n * theta);
  }
  return r;
}

function dropOblate(volume, playing) {
  const value = Number(volume);
  const v = playing && Number.isFinite(value) ? Math.max(0, Math.min(1, value)) : 0;
  return Math.min(DROP_OBL_MAX, DROP_OBL_BASE + DROP_OBL_VOL * v);
}

function dropTopDisp(rho, theta, mode) {
  return DROP_TOP_EPS * mode.a * mode.c * Math.pow(rho, mode.n) * Math.cos(mode.n * theta);
}

function dropLambTau(n, fDisp) {
  const tauLab = DROP_LAMB_R * DROP_LAMB_R / ((n - 1) * (2 * n + 1) * DROP_LAMB_NU);
  return Math.max(DROP_TAU_RANGE[0], Math.min(DROP_TAU_RANGE[1], tauLab * DROP_LAB_HZ / dropSpeedClamp(fDisp)));
}

function dropTrackedAmplitude(mode, tSec, rising) {
  if (rising && mode.t0 === -Infinity) return mode.a;
  const decay = Math.exp(-Math.max(0, tSec - mode.t0) / mode.tau);
  return mode.a * (rising ? 1 - decay : decay);
}

function dropModeTrack(state, n, a, tSec, fDisp) {
  const target = Math.max(0, Math.min(DROP_A_MAX, a));
  let cur = state ? { ...state.cur } : { n, a: target, t0: -Infinity, tau: dropLambTau(n, fDisp) };
  let old = state && state.old ? { ...state.old } : null;
  if (cur.n !== n) {
    let previous = { n: cur.n, a: dropTrackedAmplitude(cur, tSec, true) };
    if (old) {
      const oldAmplitude = dropTrackedAmplitude(old, tSec, false);
      if (oldAmplitude > previous.a) previous = { n: old.n, a: oldAmplitude };
    }
    // Both time constants stay fixed until the next mode change.
    old = { n: previous.n, a: previous.a, t0: tSec, tau: dropLambTau(previous.n, fDisp) };
    cur = { n, a: target, t0: tSec, tau: dropLambTau(n, fDisp) };
  } else {
    cur.a = target;
  }
  const modes = [];
  if (old) {
    const oldAmplitude = dropTrackedAmplitude(old, tSec, false);
    if (oldAmplitude < 0.002) old = null;
    else modes.push({ n: old.n, a: oldAmplitude });
  }
  modes.push({ n: cur.n, a: dropTrackedAmplitude(cur, tSec, true) });
  return { state: { cur, old }, modes };
}

function dropMixWeight(crisp, a) {
  return crisp < 0.5 ? 0.5 * (1 - 2 * crisp) * a : 0;
}

function dropSecondMode(f, modes, n) {
  let second = null, distance = Infinity;
  for (const mode of modes) {
    const delta = Math.abs(f - mode.freq);
    if (mode.mode !== n && delta < distance) {
      second = mode.mode;
      distance = delta;
    }
  }
  return second;
}

function dropSpeedClamp(v) {
  const value = v == null || v === '' ? NaN : Number(v);
  return Number.isFinite(value) ? Math.max(DROP_SPEED_RANGE[0], Math.min(DROP_SPEED_RANGE[1], value)) : DROP_SPEED_DEFAULT;
}

function dropVolumeClamp(v) {
  const value = v == null || v === '' ? NaN : Number(v);
  return Number.isFinite(value) ? Math.max(0, Math.min(1, value)) : DROP_VOLUME_DEFAULT;
}

function dropToneGain(v) {
  const volume = dropVolumeClamp(v);
  return volume * volume * 0.5;
}

function dropSpeedFromSlider(pos) {
  const value = Number(pos);
  if (!Number.isFinite(value)) return DROP_SPEED_DEFAULT;
  return 0.5 * Math.pow(30, Math.max(0, Math.min(1000, value)) / 1000);
}

function dropSliderFromSpeed(hz) {
  return Math.round(1000 * Math.log(dropSpeedClamp(hz) / 0.5) / Math.log(30));
}

function dropSlowmo(fr, fDisp) {
  const speed = dropSpeedClamp(fDisp);
  return { x: Math.round(fr / speed), lab: speed >= DROP_LAB_HZ - 1e-9 };
}

function dropAdvance(cycles, fDisp, dtSec) {
  const dt = Math.min(Math.max(dtSec, 0), 0.1);
  const phase = (cycles + fDisp * dt) % 1;
  return phase < 0 ? phase + 1 : phase;
}

function dropQualityFromQuery(search) {
  const match = (typeof search === 'string' ? search : '').match(/(?:^|[?&])dq=([^&#]*)/);
  if (!match) return null;
  const tiers = { low: DROP_Q.LOW, medium: DROP_Q.MED, high: DROP_Q.HIGH, ultra: DROP_Q.ULTRA };
  return Object.prototype.hasOwnProperty.call(tiers, match[1]) ? tiers[match[1]] : null;
}

function dropShaderSourceForQuality(source, tier) {
  const fixed = tier == null ? -1 : tier;
  if (!Number.isInteger(fixed) || fixed < -1 || fixed > DROP_Q.ULTRA) {
    throw new RangeError('invalid drop shader quality');
  }
  if (!source.startsWith('#version 300 es')) throw new Error('drop shader version header missing');
  if (fixed !== DROP_Q.LOW) {
    source = source.replace(
      /^[ \t]*#if DROP_QUALITY == 0\r?\n[ \t]*\/\/ BE_LOW_SKIP_REFLECTION_TRACE: Low keeps the projected silhouette fallback\r?\n#else\r?\n([\s\S]*?)\r?\n[ \t]*#endif/m,
      '$1'
    );
  }
  return source.replace('#version 300 es', `#version 300 es\n#define DROP_QUALITY ${fixed}`);
}

function dropCanvasPx(tier, dpr) {
  const ratio = Math.max(1, dpr || 1);
  if (tier === DROP_Q.ULTRA) return Math.min(2048, Math.round(300 * ratio * 1.5));
  const base = 300 * Math.min(2, ratio);
  return Math.round(tier === DROP_Q.LOW ? base * 0.75 : base);
}

function dropQualityInit(nowMs, forcedTier) {
  const forced = forcedTier != null && Number.isInteger(forcedTier) && forcedTier >= DROP_Q.LOW && forcedTier <= DROP_Q.ULTRA;
  return {
    tier: forced ? forcedTier : DROP_Q.HIGH,
    activeTier: DROP_Q.LOW,
    forced,
    autoCompileBlocked: false,
    windows: [],
    currentWindow: null,
    recentFrames: [],
    refreshMs: null,
    targetFrameMs: 1000 / 60,
    nextRenderAt: null,
    goodSince: null,
    lastChange: nowMs,
    cooldownUntil: nowMs,
    ignoreUntil: nowMs,
    hidden: false,
    capProbed: false,
    capHold: false,
    capHoldUntil: nowMs,
    upgradePending: false,
    trial: null,
    failedUpgrades: [],
    holdUntil: nowMs,
    thermalPauseUntil: nowMs,
  };
}

function dropQualityClearWindow(state) {
  state.windows = [];
  state.currentWindow = null;
  state.recentFrames = [];
  state.nextRenderAt = null;
  state.goodSince = null;
}

function dropQualitySwitched(state, tier, nowMs) {
  const oldTier = state.activeTier;
  state.activeTier = tier;
  state.ignoreUntil = nowMs + 1000;
  state.lastChange = nowMs;
  dropQualityClearWindow(state);
  if (state.upgradePending && tier > oldTier) {
    state.trial = { tier, started: nowMs };
    state.upgradePending = false;
  } else if (tier < oldTier) {
    state.trial = null;
    state.cooldownUntil = nowMs + 5000;
  }
}

function dropQualityVisibility(state, visible, nowMs) {
  state.hidden = !visible;
  if (visible) {
    state.capHold = false;
    state.capHoldUntil = nowMs;
  }
  dropQualityClearWindow(state);
  state.ignoreUntil = nowMs + 1000;
  state.goodSince = null;
  state.nextRenderAt = null;
  if (visible && state.trial) state.trial.started = nowMs;
}

function dropQualityFrameDue(state, nowMs) {
  if (state.nextRenderAt == null) {
    state.nextRenderAt = nowMs + state.targetFrameMs;
    return true;
  }
  if (nowMs + 0.25 < state.nextRenderAt) return false;
  state.nextRenderAt = nowMs + state.targetFrameMs;
  return true;
}

function dropQualityMedian(values) {
  if (!values.length) return 0;
  const sorted = values.slice().sort((a, b) => a - b);
  const middle = Math.floor(sorted.length / 2);
  return sorted.length % 2 ? sorted[middle] : (sorted[middle - 1] + sorted[middle]) / 2;
}

function dropQualityStep(state, nowMs, frameMs) {
  if (state.forced || state.autoCompileBlocked || state.hidden) return state.tier;
  if (!Number.isFinite(frameMs) || frameMs <= 0 || frameMs > 250) {
    dropQualityClearWindow(state);
    return state.tier;
  }
  if (nowMs < state.ignoreUntil) return state.tier;

  state.recentFrames.push({ end: nowMs, ms: frameMs });
  while (state.recentFrames.length && state.recentFrames[0].end < nowMs - 30000) state.recentFrames.shift();
  if (state.recentFrames.length >= 8) {
    const first = state.recentFrames.slice(0, 8).map(frame => frame.ms);
    state.refreshMs = dropQualityMedian(first);
  }

  const refreshHz = state.refreshMs ? 1000 / state.refreshMs : 60;
  const targetMs = refreshHz >= 110 ? 1000 / 60 : (refreshHz >= 80 ? 1000 / 45 : 1000 / 60);
  state.targetFrameMs = targetMs;
  const windowIndex = Math.floor(nowMs / 250);
  if (!state.currentWindow) state.currentWindow = { index: windowIndex, start: nowMs, slots: 0, missed: 0 };
  if (windowIndex !== state.currentWindow.index) {
    const previous = state.currentWindow;
    if (previous.slots && nowMs - previous.start >= 200) {
      previous.end = nowMs;
      previous.bad = previous.missed / previous.slots > 0.15;
      state.windows.push(previous);
      if (state.windows.length > 80) state.windows.shift();
      if (previous.bad) state.goodSince = null;
      else if (state.goodSince == null) state.goodSince = nowMs;
    }
    state.currentWindow = { index: windowIndex, start: nowMs, slots: 0, missed: 0 };
  }

  const slots = Math.max(1, Math.round(frameMs / targetMs));
  state.currentWindow.slots += slots;
  state.currentWindow.missed += Math.max(0, slots - 1);
  const recent = state.recentFrames.slice(-16).map(frame => frame.ms);
  if (!state.capProbed && recent.length >= 8) {
    const median = dropQualityMedian(recent);
    const jitter = dropQualityMedian(recent.map(value => Math.abs(value - median)));
    if (median >= 31 && median <= 35 && jitter <= 1.5 && state.tier > DROP_Q.LOW) {
      state.capProbed = true;
      state.capHold = true;
      state.capHoldUntil = nowMs + 10000;
      state.tier--;
      state.lastChange = nowMs;
      dropQualityClearWindow(state);
      return state.tier;
    }
  }

  const completed = state.windows.slice(-8);
  const badCount = completed.filter(window => window.bad).length;
  if (state.trial && nowMs - state.trial.started >= 4000) {
    const trialWindows = state.windows.filter(window => window.start >= state.trial.started + 1000);
    if (trialWindows.filter(window => window.bad).length >= 2) {
      state.failedUpgrades = state.failedUpgrades.filter(time => time >= nowMs - 60000);
      state.failedUpgrades.push(nowMs);
      state.tier = Math.max(DROP_Q.LOW, state.tier - 1);
      state.trial = null;
      state.cooldownUntil = nowMs + 5000;
      if (state.failedUpgrades.length >= 3) state.holdUntil = nowMs + 60000;
      return state.tier;
    }
    state.trial = null;
    state.cooldownUntil = nowMs + 10000;
  }
  if (state.capHold && nowMs < state.capHoldUntil) return state.tier;
  if (state.capHold) state.capHold = false;
  if (badCount >= 6 && state.tier > DROP_Q.LOW && nowMs >= state.cooldownUntil && !state.trial) {
    state.tier--;
    state.lastChange = nowMs;
    state.cooldownUntil = nowMs + 5000;
    state.trial = null;
    return state.tier;
  }
  const longWindows = state.windows.filter(window => window.end >= nowMs - 20000);
  if (longWindows.length >= 64) {
    const early = longWindows.filter(window => window.end < nowMs - 10000);
    const late = longWindows.filter(window => window.end >= nowMs - 5000);
    const rate = list => list.length ? list.reduce((sum, window) => sum + window.missed / Math.max(1, window.slots), 0) / list.length : 0;
    if (early.length >= 16 && late.length >= 16 && rate(late) - rate(early) > 0.20) state.thermalPauseUntil = nowMs + 30000;
  }
  if (badCount === 0 && state.goodSince != null && nowMs >= state.cooldownUntil && nowMs >= state.holdUntil
      && nowMs >= state.thermalPauseUntil && !state.trial && !state.upgradePending
      && state.tier < DROP_Q.ULTRA && nowMs - state.goodSince >= 8000) {
    state.tier++;
    state.upgradePending = true;
    state.lastChange = nowMs;
  }
  return state.tier;
}

function dropMeshModes(modes, rings, segs, obl, b2) {
  const verts = [], scale = dropModeScale(modes);
  for (let i = 0; i <= rings; i++) {
    const phi = (i / rings) * Math.PI;
    const sp = Math.sin(phi), cp = Math.cos(phi);
    const flat = 1 - obl * cp * cp;
    const lobes = modes.map(mode => Math.pow(sp, mode.n));
    for (let j = 0; j <= segs; j++) {
      const th = (j / segs) * Math.PI * 2;
      let radius = 1;
      for (let k = 0; k < modes.length; k++) {
        const mode = modes[k], q = mode.a * scale * mode.c;
        const angle = mode.n * th - (mode.rot || 0), lobe = lobes[k];
        const term = q * lobe * Math.cos(angle);
        radius += term + b2 * q * q * lobe * lobe * Math.cos(2 * angle);
        if (cp > 0) radius += DROP_TOP_EPS * term * cp;
      }
      const r = radius * flat;
      verts.push({ x: r * sp * Math.cos(th), y: r * cp, z: r * sp * Math.sin(th), r });
    }
  }
  return { verts, rings, segs };
}

window.DropPhysics = {
  DROP_B2, DROP_A_MAX, DROP_OBL_BASE, DROP_OBL_VOL, DROP_OBL_MAX, DROP_TOP_EPS,
  DROP_LAMB_R, DROP_LAMB_NU, DROP_LAB_HZ, DROP_TAU_RANGE, DROP_SPEED_RANGE,
  DROP_SPEED_DEFAULT, DROP_VOLUME_DEFAULT, DROP_MIX_RATIO, DROP_Q,
  dropFlip, dropAmp, dropModeScale, dropScaleModes, dropStar, dropOblate, dropTopDisp,
  dropLambTau, dropModeTrack, dropMixWeight, dropSecondMode, dropSpeedClamp,
  dropVolumeClamp, dropToneGain, dropSpeedFromSlider, dropSliderFromSpeed, dropSlowmo, dropAdvance,
  dropMeshModes, dropQualityFromQuery, dropCanvasPx, dropShaderSourceForQuality,
  dropQualityInit, dropQualityStep, dropQualitySwitched, dropQualityVisibility, dropQualityFrameDue
};
// drop-physics:end

const DROP_Q_FORCED = dropQualityFromQuery(location.search);
const DROP_Q_STARTUP_POLICY = Object.freeze({
  forced: DROP_Q_FORCED != null,
  tier: DROP_Q_FORCED == null ? DROP_Q.HIGH : DROP_Q_FORCED,
});
let dropQ = dropQualityInit(performance.now(), DROP_Q_FORCED);
function dropQualityForce(tier) {
  const activeTier = dropRenderer.activeTier == null ? DROP_Q.LOW : dropRenderer.activeTier;
  const capProbed = dropQ.capProbed;
  dropQ = dropQualityInit(performance.now(), tier);
  dropQ.capProbed = capProbed;
  dropQ.activeTier = activeTier;
  dropQ.autoCompileBlocked = dropRenderer.hasParallelCompile === false && !dropQ.forced;
  dropSizeCanvas();
  requestDropTier(dropQ.tier, { forced: dropQ.forced });
  return dropQ.tier;
}

let dropSpeedHz = DROP_SPEED_DEFAULT;
let dropCycles = 0, dropCycles2 = 0, dropTimeSec = 0, dropTrack = null;

// ---------- 3D γεωμετρία σταγόνας (sectoral σφαιρική αρμονική Y_n^n) ----------
// Το πλήθος δακτυλίων ΠΡΕΠΕΙ να είναι ζυγό: το τεστ του ισημερινού διαβάζει τον
// δακτύλιο rings/2 και θέλει να πέφτει ακριβώς πάνω στο φ=π/2.
const DROP_RINGS = 28, DROP_SEGS = 64;
const DROP_FALLBACK_RINGS = 22, DROP_FALLBACK_SEGS = 52;

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
  return dropMeshModes([{ n, a: amp, c: 1, rot }], rings || DROP_RINGS, segs || DROP_SEGS, obl || 0, 0);
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

// Το λίκνισμα μέσα στην παγίδα. Δύο ασύμμετρες περίοδοι, ώστε να μη φαίνεται μηχανικό.
// ΜΗΔΕΝ ΑΚΡΙΒΩΣ στη φάση 0: οι υπογραφές καμβά του golden ζωγραφίζονται στη φάση 0 και
// πρέπει να είναι επαναλήψιμες στο pixel.
function dropBob(phase) {
  return { x: Math.sin(phase * 0.63) * 0.014, y: Math.sin(phase * 0.91) * 0.022 };
}

// The contour sweep selected 32°; yaw zero keeps the reference orientation. Drag orbits the full rig.
const DROP_YAW0 = 0, DROP_PITCH0 = 32 * Math.PI / 180;
const DROP_PITCH_MIN = 0, DROP_PITCH_MAX = 45 * Math.PI / 180;
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
#ifndef DROP_QUALITY
#define DROP_QUALITY -1
#endif
precision highp float;
out vec4 fragColor;
uniform vec2  uRes;
uniform float uTime, uYaw, uPitch, uObl, uTop, uFence;
uniform int   uN[3];
uniform float uK1[3], uK2[3];
uniform int   uModes, uKMax, uQuality, uScene, uVariant, uDebug, uAaSamples, uDisableShadow;
uniform vec2  uBob;

const float PI = 3.14159265;
const float DROP_SCALE = 0.40;
const vec2 SCENE_FRAME = vec2(0.0, 0.20);
const vec3 EMITTER_CENTER = vec3(0.0, 8.0, 0.0);
// A shallow depth leaves a clean gap above the drop at the 45° orbit limit.
const vec3 EMITTER_RADII = vec3(3.0, 6.0, 2.0);
const vec3 REFLECTOR_CENTER = vec3(0.0, 11.7, 0.0);
const float REFLECTOR_CURVE = 14.0;
const float REFLECTOR_RADIUS = 3.2;

// Geometry probes retain their original framing and omit the apparatus.
bool sceneEnabled(){ return uScene != 0 && uDebug != 1 && uDebug != 3; }
float dropScale(){ return sceneEnabled() ? DROP_SCALE : 0.60; }
vec3 dropCenter(){ return vec3(uBob / dropScale(), 0.0); }

vec2 complexMultiply(vec2 a, vec2 b){
  return vec2(a.x * b.x - a.y * b.y, a.x * b.y + a.y * b.x);
}
vec2 complexPower(vec2 value, int exponent){
  vec2 result = vec2(1.0, 0.0);
  for (int bit = 0; bit < 4; bit++){
    if ((exponent & 1) != 0){
      result = complexMultiply(result, value);
    }
    exponent >>= 1;
    if (exponent == 0) break;
    value = complexMultiply(value, value);
  }
  return result;
}

// Evaluate only active modes and derive each second harmonic from its first.
float rad(vec3 p){
  float L    = max(length(p), 1e-6);
  float cphi = clamp(p.y / L, -1.0, 1.0);
  float rho  = max(length(p.xz), 1e-9);
  float u    = p.x / rho, v = p.z / rho;
  float star = 1.0;
  for (int i = 0; i < 3; i++){
    if (i >= uModes) break;
    int n = uN[i];
    vec2 harmonic = complexPower(vec2(u, v), n);
    float powerN = 1.0;
    for (int j = 0; j < n; j++){
      powerN *= rho / L;
    }
    float term = uK1[i] * powerN * harmonic.x;
    star += term;
    // Approximate the vertical top-surface displacement radially, on top only.
    if (cphi > 0.0) star += uTop * term * cphi;
    float power2N = powerN * powerN;
    star += uK2[i] * power2N * complexMultiply(harmonic, harmonic).x;
  }
  return star * (1.0 - uObl * cphi * cphi);
}
float F(vec3 p){ return length(p) - rad(p); }   // <0 μέσα, >0 έξω

vec3 grad(vec3 p){
  float e = 0.0016;
  vec3 derivative = vec3(0.0);
  float positive = 0.0;
  for (int sampleIndex = 0; sampleIndex < 6; sampleIndex++){
    vec3 axis = sampleIndex < 2 ? vec3(e,0,0)
              : sampleIndex < 4 ? vec3(0,e,0)
                                : vec3(0,0,e);
    bool plus = (sampleIndex % 2) == 0;
    vec3 samplePoint = plus ? p + axis : p - axis;
    float value = F(samplePoint);
    if (plus) positive = value;
    else {
      float difference = positive - value;
      if (sampleIndex == 1) derivative.x = difference;
      else if (sampleIndex == 3) derivative.y = difference;
      else derivative.z = difference;
    }
  }
  return normalize(derivative);
}

// F is not a signed-distance function; refine only an evaluated inside/outside bracket.
bool refineDropExit(vec3 origin, vec3 direction, float insideT, float outsideT, out float hitT){
  float lo = insideT, hi = outsideT;
  float fLo = 0.0, fHi = 0.0, bestAbs = 0.0;
  hitT = lo;
  for (int visit = -2; visit < 12; visit++){
    float sampleT = visit == -2 ? lo
                  : visit == -1 ? hi
                                : 0.5 * (lo + hi);
    float value = F(origin + direction * sampleT);
    if (visit == -2){
      fLo = value;
      bestAbs = abs(fLo);
      continue;
    }
    if (visit == -1){
      fHi = value;
      if (abs(fHi) < bestAbs){ hitT = hi; bestAbs = abs(fHi); }
      if (fLo > 0.0 || fHi <= 0.0) return false;
      continue;
    }
    float absMid = abs(value);
    if (absMid < bestAbs){ hitT = sampleT; bestAbs = absMid; }
    if (absMid <= 0.0005) break;
    if (value > 0.0){ hi = sampleT; fHi = value; }
    else { lo = sampleT; fLo = value; }
  }
  return bestAbs <= 0.002;
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

// The application's dark purple background, converted from sRGB below.
vec3 bg(vec2 uv){
  float d = length(uv);
  vec3 c = mix(vec3(0.114,0.078,0.251), vec3(0.071,0.043,0.157), clamp(d/1.45, 0.0, 1.0));
  if (sceneEnabled()){
    vec2 lightUv = (uv - SCENE_FRAME) / vec2(0.76, 0.90);
    float backlight = exp(-2.2 * dot(lightUv, lightUv));
    // Specify the backlight in sRGB, so its final maximum stays below 35%.
    c = mix(c, vec3(0.30, 0.32, 0.34), backlight);
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
const vec3 LIGHT_TOP = normalize(vec3(-0.2, 1.0, -0.35));
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

// All rays use world coordinates. Only the drop moves; the rig stays fixed.
bool dropFence(vec3 ro, vec3 rd, out float nearT, out float farT){
  vec3 oc = ro - dropCenter();
  float b = dot(oc, rd);
  float h = b*b - dot(oc, oc) + uFence*uFence;
  nearT = 0.0; farT = 0.0;
  if (h < 0.0) return false;
  float root = sqrt(max(h, 0.0));
  nearT = max(0.0, -b - root);
  farT = -b + root;
  return farT >= nearT;
}

bool traceDrop(vec3 ro, vec3 rd, out float t){
  float tNear, tMax;
  t = 0.0;
  if (!dropFence(ro, rd, tNear, tMax)) return false;
  vec3 localRo = ro - dropCenter();
  t = tNear;
  bool hit = false, starved = true;
  // F is radial displacement, not an exact SDF. Preserve the conservative
  // primary step and the grazing-ray scan that prevents detached lobes.
  for (int i = 0; i < 28; i++){
    float d = F(localRo + rd*t);
    if (d < 0.0009){ hit = true; starved = false; break; }
    t += max(d * 0.40, 0.004);
    if (t > tMax){ starved = false; break; }
  }
  if (!hit && starved){
    const int NS = 20;
    float t0s = max(tNear, t - 0.10);
    float dt = (tMax - t0s) / float(NS), tPrev = t0s;
    for (int i = 1; i <= NS; i++){
      float ti = t0s + float(i) * dt;
      if (F(localRo + rd*ti) < 0.0){
        float lo = tPrev, hi = ti;
        for (int k = 0; k < 7; k++){
          float m = 0.5 * (lo + hi);
          if (F(localRo + rd*m) < 0.0) hi = m; else lo = m;
        }
        t = hi; hit = true; break;
      }
      tPrev = ti;
    }
  }
  return hit;
}

bool sphereRoots(vec3 ro, vec3 rd, vec3 center, float radius, out vec2 roots){
  vec3 oc = ro - center;
  float b = dot(oc, rd), h = b*b - dot(oc, oc) + radius*radius;
  roots = vec2(0.0);
  if (h < 0.0) return false;
  roots = -b + vec2(-1.0, 1.0) * sqrt(h);
  return roots.y > 0.001;
}

bool traceEmitter(vec3 ro, vec3 rd, out float t){
  t = 1e5;
  vec3 invR = 1.0 / EMITTER_RADII;
  vec3 oc = (ro - EMITTER_CENTER) * invR, dir = rd * invR;
  float a = dot(dir, dir), b = dot(oc, dir), h = b*b - a*(dot(oc,oc)-1.0);
  if (h < 0.0) return false;
  vec2 roots = (-b + vec2(-1.0, 1.0) * sqrt(h)) / a;
  t = roots.x > 0.001 ? roots.x : roots.y;
  return roots.y > 0.001;
}

bool traceReflector(vec3 ro, vec3 rd, out float t){
  vec2 roots;
  t = 1e5;
  if (!sphereRoots(ro, rd, REFLECTOR_CENTER, REFLECTOR_CURVE, roots)) return false;
  for (int i = 0; i < 2; i++){
    float candidate = i == 0 ? roots.x : roots.y;
    vec3 p = ro + rd*candidate;
    if (candidate > 0.001 && p.y < REFLECTOR_CENTER.y &&
        dot(p.xz, p.xz) <= REFLECTOR_RADIUS*REFLECTOR_RADIUS){
      t = candidate;
      return true;
    }
  }
  return false;
}

float softShadow(vec3 p, vec3 L){
  float tNear, tFar;
  // Most reflector rays miss the drop. Reject them before evaluating F.
  if (!dropFence(p, L, tNear, tFar)) return 1.0;
  vec3 localP = p - dropCenter();
  float t = max(tNear, 0.006), res = 1.0;
  for (int i = 0; i < 24; i++){
    float d = F(localP + L*t);
    if (d < 0.0009) return 0.0;
    res = min(res, 8.0 * 0.5 * d / max(t, 0.006));
    // This is the same conservative non-SDF step as traceDrop.
    t += max(d * 0.40, 0.004);
    if (t > tFar) break;
  }
  return clamp(res, 0.0, 1.0);
}

float dropCaustic(vec3 p, vec3 lightRay){
  // Approximate the mode-dependent drop with the local sphere radius. The exact
  // sphere chord keeps this reflector pass bounded without nesting traceDrop here.
  vec3 center = dropCenter();
  vec3 L = normalize(lightRay);
  float along = dot(center - p, L);
  if (along <= 0.0) return 0.0;
  vec3 closest = p + L*along;
  float impact2 = dot(closest-center, closest-center);
  float R = rad(closest-center);
  if (impact2 >= R*R) return 0.0;
  float halfChord = sqrt(max(R*R-impact2, 0.0));
  vec3 entry = closest + L*halfChord;
  vec3 nEntry = normalize(entry-center);
  vec3 inside = refract(-L, nEntry, 1.0/1.333);
  if (dot(inside, inside) < 0.001) return 0.0;
  inside = normalize(inside);
  float exitT = -2.0 * dot(entry-center, inside);
  if (exitT <= 0.0) return 0.0;
  vec3 exitPoint = entry + inside*exitT;
  vec3 nExit = normalize(exitPoint-center);
  vec3 outRay = refract(inside, -nExit, 1.333);
  if (dot(outRay, outRay) < 0.001) outRay = reflect(inside, nExit);
  // The refracted ray travels down to the reflector, opposite the upward light vector.
  return pow(max(dot(outRay, -L), 0.0), 24.0) * 0.6;
}

vec3 dropCheap(vec3 p, vec3 rd){
  mat3 M = camM();
  vec3 N = grad(p - dropCenter());
  float ct = max(dot(N, -rd), 0.0);
  float fres = 0.02 + 0.98 * pow(1.0 - ct, 5.0);
  vec3 reflected = env(M * reflect(rd, N), vec3(1.0, 0.97, 0.93));
  vec2 uv = (M*p).xy * DROP_SCALE + SCENE_FRAME;
  // Keep the reflected drop dark against the lit background behind it.
  vec3 transmitted = bg(uv) * 0.12 + vec3(0.006, 0.008, 0.010);
  transmitted = mix(transmitted, vec3(0.02), smoothstep(0.35, 0.95, 1.0-ct));
  return mix(transmitted, reflected, fres) + vec3(0.035) * pow(1.0-ct, 3.2);
}

vec3 shadeEmitter(vec3 p, vec3 rd){
  mat3 M = camM();
  vec3 N = normalize((p - EMITTER_CENTER) / (EMITTER_RADII * EMITTER_RADII));
  float diffuse = max(dot(M*N, KEYDIR), 0.0);
  float rim = pow(1.0 - max(dot(N, -rd), 0.0), 7.0);
  return vec3(0.03) * (0.025 + 0.12*diffuse) + vec3(0.004, 0.005, 0.007)*rim;
}

vec3 shadeReflector(vec3 p, vec3 rd, vec2 screenUv){
  mat3 M = camM();
  vec3 N = normalize(REFLECTOR_CENTER - p);
  vec3 L = transpose(M) * KEYDIR;
  float shadow = uDisableShadow != 0 ? 1.0 : softShadow(p + N*0.006, L);
  float diffuse = max(dot(N, L), 0.0);
  vec3 col = vec3(0.018, 0.021, 0.028) * (0.35 + 0.65*diffuse) * (0.45 + 0.55*shadow);
#if DROP_QUALITY < 0
  if (uQuality >= 2){
#elif DROP_QUALITY >= 2
  {
#endif
#if DROP_QUALITY < 0 || DROP_QUALITY >= 2
    vec3 lightRay = transpose(M) * LIGHT_TOP;
    float caustic = dropCaustic(p + N*0.006, lightRay);
#if DROP_QUALITY < 0
    if (uQuality == 3){
#elif DROP_QUALITY == 3
    {
#endif
#if DROP_QUALITY < 0 || DROP_QUALITY == 3
      vec3 tangentLight = normalize(cross(abs(lightRay.y) < 0.95 ? vec3(0,1,0) : vec3(1,0,0), lightRay));
      vec3 secondLightRay = normalize(lightRay*cos(0.03) + tangentLight*sin(0.03));
      caustic = 0.5*(caustic + dropCaustic(p + N*0.006,
        secondLightRay));
    }
#endif
    col += vec3(1.0, 0.88, 0.70) * caustic;
  }
#endif
  vec3 reflected = reflect(rd, N);
  vec3 tangent = normalize(cross(abs(reflected.y) < 0.95 ? vec3(0,1,0) : vec3(1,0,0), reflected));
  vec3 bitangent = cross(reflected, tangent);
#if DROP_QUALITY < 0
  int count = uQuality <= 0 ? 1 : (uQuality == 1 ? 2 : (uQuality == 2 ? 4 : 8));
#elif DROP_QUALITY == 0
  const int count = 1;
#elif DROP_QUALITY == 1
  const int count = 2;
#elif DROP_QUALITY == 2
  const int count = 4;
#else
  const int count = 8;
#endif
  vec3 reflection = vec3(0.0);
  for (int i = 0; i < 8; i++){
    if (i >= count) break;
    float angle = float(i)*2.39996323;
    float radius = count == 1 ? 0.0 : 0.06*sqrt((float(i)+0.5)/float(count));
    vec3 ray = normalize(reflected + radius*(cos(angle)*tangent + sin(angle)*bitangent));
    vec3 origin = p + N*0.006;
    float tNear, tFar, tDrop;
    float projectedT = max(0.0, dot(dropCenter() - origin, ray));
    vec2 backgroundUv = (M * (origin + ray * projectedT)).xy * DROP_SCALE + SCENE_FRAME;
    // Rays that miss the drop still see the backlight at their projected point.
    // Project its soft dark silhouette over that light so the reflection remains visible
    // even when the reflected ray narrowly misses the analytical surface.
    vec2 dropUv = (M * dropCenter()).xy * DROP_SCALE + SCENE_FRAME;
    vec3 projectedQ = transpose(M) * vec3((backgroundUv - dropUv) / DROP_SCALE, 0.0);
    float profile = length(projectedQ) - rad(projectedQ);
    float silhouette = 1.0 - smoothstep(-0.045, 0.075, profile);
    vec3 sampleCol = mix(bg(backgroundUv), vec3(0.006, 0.008, 0.012), silhouette);
#if DROP_QUALITY == 0
    // BE_LOW_SKIP_REFLECTION_TRACE: Low keeps the projected silhouette fallback
#else
    // Test the translated analytical fence before running the expensive trace.
    if (dropFence(origin, ray, tNear, tFar) && traceDrop(origin, ray, tDrop)){
      sampleCol = dropCheap(origin + ray*tDrop, ray);
    }
#endif
    reflection += sampleCol;
  }
  // Keep the reflected drop in the visible reflector area. A shallow bowl can send
  // most camera rays past the small drop, so project the same backlight through its
  // analytical silhouette as the stable fallback for those misses.
  vec2 surfaceUv = screenUv;
  vec2 dropUv = (M * dropCenter()).xy * DROP_SCALE + SCENE_FRAME;
  vec2 imageCenter = dropUv - vec2(0.0, 0.70 * cos(uPitch));
  vec2 imageUv = dropUv + (surfaceUv - imageCenter);
  vec3 imageQ = transpose(M) * vec3((imageUv - dropUv) / DROP_SCALE, 0.0);
  float imageProfile = length(imageQ) - rad(imageQ);
  float imageMask = 1.0 - smoothstep(-0.055, 0.085, imageProfile);
  vec3 projectedImage = mix(bg(imageUv), vec3(0.006, 0.008, 0.012), imageMask);
  return col + 0.15 * reflection / float(count) + 0.95 * projectedImage;
}

// Χρωματίζει ΕΝΑ δείγμα και επιστρέφει ΓΡΑΜΜΙΚΟ χρώμα. Η γάμμα μπαίνει μία φορά, στη
// main(), αφού μέσοι όροι χρωμάτων έχουν νόημα μόνο σε γραμμικό χώρο.
vec3 shade(vec2 uv){
  bool scene = sceneEnabled();
  vec3 base = bg(uv);
  if (!scene) base += vec3(1.0,0.60,0.25) * 0.035 * smoothstep(0.95, 0.0, length(uv));
  mat3 M = camM(), Mi = transpose(M);
  vec2 framing = scene ? SCENE_FRAME : vec2(0.0);
  // Orbit one world-space ray around the entire apparatus, not just the drop.
  vec3 ro = Mi * vec3((uv - framing) / dropScale(), 10.0);
  vec3 rd = Mi * vec3(0.0, 0.0, -1.0);
  float nearest = 1e5, candidate, tNear, tFar, t = 0.0;
  int material = 0;
  if (scene){
    if (traceEmitter(ro, rd, candidate)){ nearest = candidate; material = 1; }
    if (traceReflector(ro, rd, candidate) && candidate < nearest){ nearest = candidate; material = 2; }
  }
  bool inFence = dropFence(ro, rd, tNear, tFar);
  bool hit = false;
  if (inFence && tNear < nearest) hit = traceDrop(ro, rd, t);
  if (hit && t < nearest){ nearest = t; material = 3; }
  if (uDebug == 2){
    if (material == 1) return vec3(1.0, 0.0, 0.0);
    if (material == 2) return vec3(0.0, 1.0, 0.0);
    if (material == 3) return vec3(1.0, 1.0, 0.0);
    return vec3(0.0, 0.0, 1.0);
  }
  if (uDebug == 1 || uDebug == 3){
    if (!inFence) return vec3(0.0, 0.0, 4.0);
    if (!hit) return vec3(4.0, 0.0, 0.0);
    // First-surface silhouette probes intentionally do not inspect the exit.
    if (uDebug == 3) return vec3(1.0);
  }
  if (material == 0) return base;
  vec3 pWorld = ro + rd*nearest;
  if (material == 1) return shadeEmitter(pWorld, rd);
  if (material == 2) return shadeReflector(pWorld, rd, uv);
  vec3 pObj = pWorld - dropCenter();
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
#if DROP_QUALITY < 0
  if (uQuality == 3){
#elif DROP_QUALITY == 3
  {
#endif
#if DROP_QUALITY < 0 || DROP_QUALITY == 3
    vec3 mirrorRay = Mi * reflect(-V, N);
    float emitterT;
    if (traceEmitter(pWorld + mirrorRay*0.006, mirrorRay, emitterT))
      reflCol = shadeEmitter(pWorld + mirrorRay*emitterT, mirrorRay);
  }
#endif

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
  bool exited = false, starved2 = true, haveInside = false;
  bool haveExitBracket = false, exitBracket = false, exitUnbracketed = false;
  bool exitRefinementFailed = false;
  float lastInsideT = t2, exitOutsideT = t2;
  for (int i = 0; i < 30; i++){
    float d = F(pObj + rInObj*t2);
    if (d > 0.0){
      if (haveInside){ exitOutsideT = t2; haveExitBracket = true; }
      else exitUnbracketed = true;
      starved2 = false; break;
    }
    if (d > -0.0009){ exited = true; starved2 = false; break; }
    lastInsideT = t2; haveInside = true;
    t2 += max(-d * 0.75, 0.008);
    if (t2 > 3.0){ starved2 = false; break; }
  }
  if (!exited && starved2){
    const int NS2 = 24;
    float dt2 = (2.0 * uFence) / float(NS2); // Bound the exit scan by the enclosing diameter.
    for (int i = 1; i <= NS2; i++){
      float ti = t2 + float(i) * dt2;
      float di = F(pObj + rInObj*ti);
      if (di > 0.0){
        if (haveInside){ exitOutsideT = ti; haveExitBracket = true; }
        else exitUnbracketed = true;
        starved2 = false; break;
      }
      if (di > -0.0009){ t2 = ti; exited = true; starved2 = false; break; }
      lastInsideT = ti; haveInside = true;
    }
  }
  // Keep the refinement call outside both scans to avoid multiplying shader code inlining.
  if (!exited && haveExitBracket){
    float refinedT;
    if (refineDropExit(pObj, rInObj, lastInsideT, exitOutsideT, refinedT)){
      t2 = refinedT; exited = true; exitBracket = true;
    } else exitRefinementFailed = true;
  }
  if (!exited && uDebug == 1) return vec3(0.0, 4.0, 0.0);
  thick = t2;
  vec3 pExitObj = pObj + rInObj*t2;
  if (uDebug == 4){
    // Residual categories preserve the normal scene frame and bypass antialias blending.
    float exitResidual = abs(F(pExitObj));
    if (!exited){
      if (exitUnbracketed) return vec3(0.0, 0.0, 4.0);
      if (exitRefinementFailed) return vec3(4.0, 0.0, 4.0);
      return vec3(4.0, 4.0, 0.0);
    }
    if (isnan(exitResidual) || isinf(exitResidual)) return vec3(4.0, 0.0, 4.0);
    if (!exitBracket && exitResidual > 0.0009) return vec3(0.0, 0.0, 4.0);
    return exitResidual <= 0.002 ? vec3(0.0, 4.0, 0.0) : vec3(4.0, 0.0, 0.0);
  }
  vec3 nExit = normalize(M * grad(pExitObj));
  vec3 pExitCam = M * (pExitObj + dropCenter());

  // The old abrupt dark TIR boundary looked like cracks. The scene now blends
  // into a dark rim by incidence angle, continuously across the silhouette.
  bool tir = false;
  vec3 rOut = refract(rIn, -nExit, 1.333);
  if (dot(rOut, rOut) < 0.001 || !exited){ rOut = reflect(rIn, nExit); tir = true; }

  // Ο φακός: όσο πιο δυνατό το στράβωμα, τόσο πιο ΞΕΚΑΘΑΡΑ διαβάζεται ως νερό, γιατί
  // βλέπεις το φόντο να κουνιέται μέσα του. Με 0.85 τα αστέρια μόλις μετακινούνταν.
  // The exit point includes the world-space bob; the backlight stays stationary.
  vec2 uvOut = pExitCam.xy * dropScale() + framing + rOut.xy * 1.70;
  vec3 refrCol = tir && !scene ? env(rOut, keyCol) * 0.55 : bg(uvOut);
  if (scene) refrCol = mix(refrCol, vec3(0.02), smoothstep(0.35, 0.95, 1.0-ct));

  // Beer–Lambert. Η σταγόνα είναι ΕΝΑ ΧΙΛΙΟΣΤΟ νερό — δεν έχει πού να απορροφήσει.
  // Με 0.55/0.20/0.10 έβγαινε σκούρο μελιτζανί· το νερό σε αυτό το πάχος είναι άχρωμο
  // με ένα ελάχιστο κυανό (τρώει πρώτα το κόκκινο).
  refrCol *= exp(-thick * vec3(0.22, 0.075, 0.035));
  refrCol += keyCol * pow(max(dot(rOut, KEYDIR), 0.0), 22.0) * 0.85;
#if DROP_QUALITY < 0
  if (uQuality == 3){
#elif DROP_QUALITY == 3
  {
#endif
#if DROP_QUALITY < 0 || DROP_QUALITY == 3
    vec3 rInR = refract(-V, N, 1.0/1.331), rInG = refract(-V, N, 1.0/1.333), rInB = refract(-V, N, 1.0/1.337);
    vec3 rOutR = refract(rInR, -nExit, 1.331), rOutG = refract(rInG, -nExit, 1.333), rOutB = refract(rInB, -nExit, 1.337);
    vec3 dR = bg(pExitCam.xy*dropScale()+framing+rOutR.xy*1.70);
    vec3 dG = bg(pExitCam.xy*dropScale()+framing+rOutG.xy*1.70);
    vec3 dB = bg(pExitCam.xy*dropScale()+framing+rOutB.xy*1.70);
    vec3 dispersed = vec3(dR.r,dG.g,dB.b) * exp(-thick*vec3(0.22,0.075,0.035));
    refrCol = mix(refrCol, dispersed, 0.14);
  }
#endif
  // και το φως που «στέκεται» μέσα στο σώμα: χωρίς αυτό η κοιλιά είναι νεκρή τρύπα
  // Ήταν 0.10 και γέμιζε την κοιλιά με ομοιόμορφο γάλα. Κρατάμε ίχνος, μόνο για να
  // μη γίνει νεκρή μαύρη τρύπα εκεί που το πάχος είναι μεγάλο.
  refrCol += vec3(0.62,0.78,1.0) * 0.040 * (1.0 - exp(-thick * 0.7));

  vec3 col = mix(refrCol, reflCol, fres);
  col += keyCol * pow(1.0 - ct, 3.2) * 0.20;                 // το φωτισμένο χείλος
  if (scene) col = mix(col, vec3(0.02), smoothstep(0.62, 0.98, 1.0-ct));
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
  // Debug uses one centered sample; regular one-sample AA keeps its rotated-grid offset.
  bool debug = uDebug != 0;
  int sampleLimit = debug ? 1 : uAaSamples;
  float e = 1.0 / sc;
  // ΠΡΟΣΑΡΜΟΣΤΙΚΗ ΑΝΤΙΕΞΟΜΑΛΥΝΣΗ. Η σωστή ιχνηλάτηση (βλ. starved) κοστίζει, και 4 δείγματα
  // σε ΚΑΘΕ pixel έριχναν τα fps στα ~42. Τα 2 σκέτα έβγαζαν σκαλοπάτι στην ακμή. Εδώ:
  // 2 διαγώνια δείγματα παντού, και τα άλλα 2 ΜΟΝΟ όπου διαφωνούν — δηλαδή στην ακμή
  // της σταγόνας και στις λάμψεις, εκεί όπου φαίνεται το σκαλοπάτι. Το εσωτερικό και το
  // φόντο είναι ομαλά και τα 2 δείγματα συμφωνούν ήδη.
  vec3 acc = vec3(0.0), first = vec3(0.0);
  int samples = 0;
  for (int i = 0; i < sampleLimit; i++){
    vec2 offset = i == 0 ? vec2(-0.125,-0.375)
               : i == 1 ? vec2( 0.125, 0.375)
               : i == 2 ? vec2( 0.375,-0.125)
                        : vec2(-0.375, 0.125);
    vec2 sampleUv = debug ? uv0 : uv0 + e*offset;
    vec3 sampleCol = shade(sampleUv);
    if (i == 0) first = sampleCol;
    acc += sampleCol;
    samples++;
    if (i == 1){
      vec3 dd = abs(first - sampleCol);
      if (max(dd.r, max(dd.g, dd.b)) <= 0.04) break;
    }
  }
  acc /= float(samples);
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
async function dropGLCreate(canvas, fixedQuality = null) {
  let gl = null;
  try {
    gl = canvas.getContext('webgl2', {
      antialias: true, alpha: false, depth: false,
      preserveDrawingBuffer: true, powerPreference: 'high-performance',
    });
  } catch (_) { return null; }
  if (!gl) return null;

  const renderer = String(gl.getParameter(gl.RENDERER) || '');
  const timerExt = /swiftshader|software/i.test(renderer)
    ? null : gl.getExtension('EXT_disjoint_timer_query_webgl2');
  let pendingTimer = null;

  const sh = (ty, src) => {
    const s = gl.createShader(ty);
    gl.shaderSource(s, src); gl.compileShader(s);
    return s;
  };
  const fragmentSource = dropShaderSourceForQuality(DROP_FS, fixedQuality);
  const vs = sh(gl.VERTEX_SHADER, DROP_VS), fs = sh(gl.FRAGMENT_SHADER, fragmentSource);
  if (!vs || !fs) return null;
  const prog = gl.createProgram();
  gl.attachShader(prog, vs); gl.attachShader(prog, fs); gl.linkProgram(prog);
  const parallel = gl.getExtension('KHR_parallel_shader_compile');
  if (parallel) {
    while (!gl.isContextLost() && !gl.getProgramParameter(prog, parallel.COMPLETION_STATUS_KHR)) {
      await new Promise(requestAnimationFrame);
    }
  }
  if (gl.isContextLost()) return null;
  if (!gl.getShaderParameter(vs, gl.COMPILE_STATUS) || !gl.getShaderParameter(fs, gl.COMPILE_STATUS)) {
    console.warn('σταγόνα: ο shader δεν μεταγλωττίστηκε:', gl.getShaderInfoLog(!gl.getShaderParameter(vs, gl.COMPILE_STATUS) ? vs : fs));
    gl.deleteShader(vs); gl.deleteShader(fs); gl.deleteProgram(prog);
    return null;
  }
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
    console.warn('σταγόνα: ο shader δεν συνδέθηκε:', gl.getProgramInfoLog(prog));
    gl.deleteShader(vs); gl.deleteShader(fs); gl.deleteProgram(prog);
    return null;
  }
  gl.deleteShader(vs); gl.deleteShader(fs);

  const U = {};
  for (const k of ['uRes', 'uTime', 'uYaw', 'uPitch', 'uObl', 'uTop', 'uFence',
                   'uModes', 'uKMax', 'uQuality', 'uScene', 'uVariant', 'uDebug', 'uAaSamples', 'uDisableShadow', 'uBob']) {
    U[k] = gl.getUniformLocation(prog, k);
  }
  for (const k of ['uN', 'uK1', 'uK2']) U[k] = gl.getUniformLocation(prog, k + '[0]');
  const ns = new Int32Array(3), k1 = new Float32Array(3), k2 = new Float32Array(3);

  const gpuMs = () => {
    if (!timerExt || !pendingTimer) return null;
    if (gl.getParameter(timerExt.GPU_DISJOINT_EXT)) {
      gl.deleteQuery(pendingTimer);
      pendingTimer = null;
      return null;
    }
    if (!gl.getQueryParameter(pendingTimer, gl.QUERY_RESULT_AVAILABLE)) return null;
    const result = gl.getQueryParameter(pendingTimer, gl.QUERY_RESULT) / 1e6;
    gl.deleteQuery(pendingTimer);
    pendingTimer = null;
    return result;
  };

  const draw = p => {
    // Cap the amplitude sum before computing either harmonic or its bounding sphere.
    const modes = dropScaleModes(p.modes.slice(0, 3));
    ns.fill(0); k1.fill(0); k2.fill(0);
    let kMax = 0, fence = 1;
    for (let i = 0; i < modes.length; i++) {
      const mode = modes[i], q = mode.a * mode.c;
      ns[i] = mode.n;
      k1[i] = q;
      k2[i] = p.b2 * q * q;
      kMax = Math.max(kMax, 2 * mode.n);
      fence += Math.abs(k1[i]) * (1 + DROP_TOP_EPS) + Math.abs(k2[i]);
    }
    const targetWidth = p.targetSize || canvas.width, targetHeight = p.targetSize || canvas.height;
    gl.viewport(0, 0, targetWidth, targetHeight);
    gl.useProgram(prog);
    gl.uniform2f(U.uRes, targetWidth, targetHeight);
    gl.uniform1iv(U.uN, ns);
    gl.uniform1fv(U.uK1, k1);
    gl.uniform1fv(U.uK2, k2);
    gl.uniform1i(U.uModes, modes.length);
    gl.uniform1i(U.uKMax, kMax);
    gl.uniform1f(U.uTop, DROP_TOP_EPS);
    gl.uniform1f(U.uFence, fence);
    gl.uniform1f(U.uObl, p.obl);
    gl.uniform1f(U.uTime, p.time);
    gl.uniform1f(U.uYaw, p.yaw);
    gl.uniform1f(U.uPitch, p.pitch);
    if (U.uQuality) gl.uniform1i(U.uQuality, p.quality == null ? DROP_Q.HIGH : p.quality);
    gl.uniform1i(U.uScene, p.scene === false ? 0 : 1);
    gl.uniform1i(U.uVariant, p.variant || 0); // 0 = νερό με λευκό φως
    // ΜΟΝΟ για τα τεστ: βάφει κόκκινο όπου η ακτίνα δεν βρήκε επιφάνεια και πράσινο
    // όπου δεν βγήκε ποτέ από το νερό. Και τα δύο είναι σφάλματα ιχνηλάτησης που
    // αλλιώς διαβάζονται ως «σχήμα», και κανένα golden hash δεν τα ξεχωρίζει.
    gl.uniform1i(U.uDebug, p.debug === 4 ? 4 : (p.debug === 3 ? 3 : (p.debug === 2 ? 2 : (p.debug ? 1 : 0))));
    gl.uniform1i(U.uAaSamples, p.debug ? 1 : (p.aaSamples || 4));
    gl.uniform1i(U.uDisableShadow, p.disableShadow ? 1 : 0);
    gl.uniform2f(U.uBob, p.bob.x, p.bob.y);
    if (timerExt && !p.skipGpuTimer && !pendingTimer) {
      const query = gl.createQuery();
      if (query) {
        gl.beginQuery(timerExt.TIME_ELAPSED_EXT, query);
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 3);
        gl.endQuery(timerExt.TIME_ELAPSED_EXT);
        pendingTimer = query;
      } else gl.drawArrays(gl.TRIANGLE_STRIP, 0, 3);
    } else gl.drawArrays(gl.TRIANGLE_STRIP, 0, 3);
  };

  return { gl: gl, prog: prog, U: U, draw: draw, gpuMs: gpuMs, hasGpuTimer: !!timerExt,
    hasParallelCompile: !!parallel,
    fixedQuality: fixedQuality };
}

// Keep the Canvas2D fallback during page load and until the first requested compile is ready.
const dropRenderer = { impl: null, promise: null, generation: 0, attempted: false,
  compileStartedAt: null, compileReadyAt: null, tierTimings: new Map(), records: new Map(), activeTier: null,
  desiredTier: null, compilePromise: null, waiters: new Map(), lowFrameDrawn: false,
  hasParallelCompile: null, compileHistory: [] };
let dropPaintReady = null;
function waitForDropPaint() {
  if (dropPaintReady) return dropPaintReady;
  dropPaintReady = new Promise(resolve => {
    const afterLoad = () => setTimeout(() =>
      requestAnimationFrame(() => requestAnimationFrame(resolve)), 0);
    if (document.readyState === 'complete') afterLoad();
    else window.addEventListener('load', afterLoad, { once: true });
  });
  return dropPaintReady;
}
function dropResolveWaiters(tier, value) {
  const waiters = dropRenderer.waiters.get(tier) || [];
  dropRenderer.waiters.delete(tier);
  for (const resolve of waiters) resolve(value);
}

async function dropWarmupRecord(record) {
  const gl = record.impl.gl;
  const oldFramebuffer = gl.getParameter(gl.FRAMEBUFFER_BINDING);
  const oldViewport = gl.getParameter(gl.VIEWPORT);
  const tex = gl.createTexture(), fbo = gl.createFramebuffer();
  if (!tex || !fbo) throw new Error('drop warm-up framebuffer allocation failed');
  let fence = null;
  try {
    gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA8, 32, 32, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
    gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, tex, 0);
    if (gl.checkFramebufferStatus(gl.FRAMEBUFFER) !== gl.FRAMEBUFFER_COMPLETE) {
      throw new Error('drop warm-up framebuffer incomplete');
    }
    record.impl.draw({ modes: [{ n: 5, a: 0.24, c: 1 }], b2: DROP_B2, obl: DROP_OBL_BASE,
      yaw: DROP_YAW0, pitch: 22 * Math.PI / 180, bob: { x: 0, y: 0 }, time: 0,
      scene: true, quality: record.tier, aaSamples: 1, targetSize: 32, skipGpuTimer: true });
    fence = gl.fenceSync(gl.SYNC_GPU_COMMANDS_COMPLETE, 0);
    if (!fence) throw new Error('drop warm-up fence allocation failed');
    gl.flush();
    while (!gl.isContextLost()) {
      const status = gl.clientWaitSync(fence, 0, 0);
      if (status === gl.ALREADY_SIGNALED || status === gl.CONDITION_SATISFIED) return;
      if (status === gl.WAIT_FAILED) throw new Error('drop warm-up fence failed');
      await new Promise(requestAnimationFrame);
    }
    throw new Error('WebGL context lost during drop warm-up');
  } finally {
    if (fence && !gl.isContextLost()) gl.deleteSync(fence);
    if (!gl.isContextLost()) {
      gl.bindFramebuffer(gl.FRAMEBUFFER, oldFramebuffer);
      gl.viewport(oldViewport[0], oldViewport[1], oldViewport[2], oldViewport[3]);
      gl.bindTexture(gl.TEXTURE_2D, null);
      gl.deleteFramebuffer(fbo); gl.deleteTexture(tex);
    }
  }
}

function dropActivateTier(tier, generation) {
  return new Promise(resolve => requestAnimationFrame(() => {
    if (generation !== dropRenderer.generation) return resolve(null);
    const record = dropRenderer.records.get(tier);
    if (!record || record.status !== 'ready' || record.impl.gl.isContextLost()) return resolve(null);
    if (dropRenderer.desiredTier !== tier) return resolve(null);
    dropRenderer.impl = record.impl;
    dropRenderer.activeTier = tier;
    if (dropRenderer.compileReadyAt == null) dropRenderer.compileReadyAt = performance.now();
    record.activatedAt = performance.now();
    dropSizeCanvas();
    if (typeof dropQualitySwitched === 'function') dropQualitySwitched(dropQ, tier, performance.now());
    if (chlShape === 'drop') drawDropFrame(dropCycles, dropTimeSec, { quality: tier });
    if (chlShape === 'drop' && activeTab === 'chladni') setChlShape('drop');
    dropResolveWaiters(tier, record.impl);
    resolve(record.impl);
  }));
}

function dropCompileDesired(generation) {
  if (dropRenderer.compilePromise || generation !== dropRenderer.generation) return dropRenderer.compilePromise;
  const tier = dropRenderer.desiredTier;
  if (tier == null) return Promise.resolve(null);
  const cached = dropRenderer.records.get(tier);
  if (cached && cached.status === 'ready') return dropActivateTier(tier, generation);
  if (cached && cached.status === 'failed') {
    dropResolveWaiters(tier, null);
    return Promise.resolve(null);
  }
  dropRenderer.records.set(tier, { tier, status: 'compiling', impl: null });
  const pending = waitForDropPaint().then(() => {
    if (generation !== dropRenderer.generation) return null;
    const record = dropRenderer.records.get(tier);
    record.startedAt = performance.now();
    dropRenderer.tierTimings.set(tier, record);
    if (dropRenderer.compileStartedAt == null) dropRenderer.compileStartedAt = record.startedAt;
    dropRenderer.compileHistory.push(tier);
    return dropGLCreate(chlDropCanvas, tier);
  }).then(async impl => {
    if (generation !== dropRenderer.generation) return null;
    if (!impl || impl.gl.isContextLost()) {
      const record = dropRenderer.records.get(tier);
      if (record) record.status = 'failed';
      dropResolveWaiters(tier, null);
      return null;
    }
    dropRenderer.hasParallelCompile = impl.hasParallelCompile;
    const record = dropRenderer.records.get(tier);
    record.impl = impl;
    record.shaderReadyAt = performance.now();
    record.status = 'warming';
    await dropWarmupRecord(record);
    if (generation !== dropRenderer.generation) return null;
    if (impl.gl.isContextLost()) {
      record.status = 'failed';
      dropResolveWaiters(tier, null);
      return null;
    }
    record.status = 'ready';
    record.readyAt = performance.now();
    if (dropRenderer.desiredTier === tier) return await dropActivateTier(tier, generation);
    dropResolveWaiters(tier, null);
    return impl;
  }).catch(error => {
    if (generation !== dropRenderer.generation) return null;
    console.warn('σταγόνα: tier compile/warm-up failed:', error);
    const record = dropRenderer.records.get(tier);
    if (record) record.status = 'failed';
    dropResolveWaiters(tier, null);
    return null;
  }).finally(() => {
    if (generation !== dropRenderer.generation) return;
    dropRenderer.compilePromise = null;
    if (dropRenderer.desiredTier != null && dropRenderer.activeTier !== dropRenderer.desiredTier) {
      dropCompileDesired(generation);
    }
  });
  dropRenderer.compilePromise = pending;
  dropRenderer.promise = pending;
  return pending;
}

function requestDropTier(tier, options = {}) {
  if (!Number.isInteger(tier) || tier < DROP_Q.LOW || tier > DROP_Q.ULTRA) return Promise.resolve(null);
  const generation = dropRenderer.generation || ++dropRenderer.generation;
  if (dropRenderer.activeTier === tier) return Promise.resolve(dropRenderer.impl);
  if (tier > DROP_Q.LOW && dropRenderer.hasParallelCompile === false && !options.forced) {
    return Promise.resolve(dropRenderer.impl);
  }
  dropRenderer.desiredTier = tier;
  const waiting = new Promise(resolve => {
    const list = dropRenderer.waiters.get(tier) || [];
    list.push(resolve);
    dropRenderer.waiters.set(tier, list);
  });
  dropCompileDesired(generation);
  return waiting;
}

function ensureDropRenderer() {
  if (dropRenderer.impl) return Promise.resolve(dropRenderer.impl);
  if (dropRenderer.attempted) return dropRenderer.promise || Promise.resolve(null);
  dropRenderer.attempted = true;
  return requestDropTier(DROP_Q.LOW, { forced: true });
}

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
  dropRenderer.generation++;
  dropRenderer.promise = null;
    dropRenderer.compilePromise = null;
  dropRenderer.attempted = false;
  dropRenderer.impl = null;                        // από δω και πέρα, εφεδρικό
    dropRenderer.records.clear();
    dropRenderer.activeTier = null;
    dropRenderer.desiredTier = null;
    dropRenderer.lowFrameDrawn = false;
    dropQualityClearWindow(dropQ);
    dropQ.capHold = false;
    dropQ.capHoldUntil = performance.now();
    dropQ.activeTier = DROP_Q.LOW;
    dropQ.nextRenderAt = null;
    for (const tier of dropRenderer.waiters.keys()) dropResolveWaiters(tier, null);
  if (chlShape === 'drop') setChlShape('drop');    // ξαναδιαλέγει καμβά, ξαναρχίζει βρόχο
});
chlDropCanvas.addEventListener('webglcontextrestored', () => {
  dropRenderer.generation++;
  dropRenderer.records.clear();
  dropRenderer.compilePromise = null;
  dropRenderer.promise = null;
  dropRenderer.impl = null;
  dropRenderer.activeTier = null;
  dropRenderer.desiredTier = null;
  dropRenderer.attempted = false;
  if (chlShape === 'drop') ensureDropRenderer();
});
document.addEventListener('visibilitychange', () => {
  dropQualityVisibility(dropQ, !document.hidden, performance.now());
});

// Ο ΑΠΟΘΗΚΕΥΤΙΚΟΣ ΧΩΡΟΣ ΑΚΟΛΟΥΘΕΙ ΤΗΝ ΟΘΟΝΗ. Χωρίς αυτό ο καμβάς είναι 300px και
// τεντώνεται στα 340 CSS px, δηλαδή σε κινητό με DPR 3 ο browser μεγαλώνει 300 pixel
// σε 1020 — θολούρα. Το spike μέτρησε τα 600px μέσα στο vsync, άρα ο χώρος υπάρχει.
// Πλαφόν στο 2: στα 3 ο καμβάς γίνεται 900² = 810k pixel και σε φτηνό κινητό δεν αξίζει.
// ΙΔΙΟ για όλους τους ορατούς καμβάδες (πλάκα, σταγόνα, κρύσταλλος): οι ζωγράφοι δουλεύουν
// σε λογικά 300px και παίρνουν κλίμακα canvas.width / 300, άρα αρκεί να μεγαλώσει ο χώρος.
function fitCanvasToScreen(canvas) {
  const dpr = Math.min(2, Math.max(1, window.devicePixelRatio || 1));
  const px = Math.round(300 * dpr);
  if (canvas.width !== px) { canvas.width = canvas.height = px; }
}
function dropSizeCanvas() {
  const tier = dropRenderer.activeTier == null ? DROP_Q.LOW : dropRenderer.activeTier;
  const px = dropCanvasPx(tier, window.devicePixelRatio || 1);
  if (chlDropCanvas.width !== px || chlDropCanvas.height !== px) chlDropCanvas.width = chlDropCanvas.height = px;
}

// ΕΝΑ σημείο για τα κείμενα κατάστασης, γιατί τα ΔΥΟ μονοπάτια απόδοσης πρέπει να λένε
// ΤΟ ΙΔΙΟ ΠΡΑΓΜΑ: ο χρήστης δεν πρέπει να καταλαβαίνει ποιο τρέχει. Διπλασιασμένο, μια
// αλλαγή μετάφρασης θα γινόταν στο ένα και θα ξεχνιόταν στο άλλο.
function renderDropSpeed(fr) {
  if (fr == null) {
    const f = Math.min(CHL_FREQ_RANGE[1], Math.max(CHL_FREQ_RANGE[0], +chlFreq.value || 432));
    fr = findDropResonance(f, +chlPlate.value).fr;
  }
  const slowmo = dropSlowmo(fr, dropSpeedHz);
  chlDropSpeedVal.textContent = T('chl_drop_speed_val').replace('{x}', slowmo.x)
    + (slowmo.lab ? ' · ' + T('chl_drop_speed_lab') : '');
}

function dropFrameParams(cycles, timeSec, opts = {}) {
  const f = Math.min(CHL_FREQ_RANGE[1], Math.max(CHL_FREQ_RANGE[0], +chlFreq.value || 432));
  const plate = +chlPlate.value;
  const { n, fr, crisp } = findDropResonance(f, plate);
  const amplitude = dropAmp(crisp);
  const modes = [];
  let n2 = null;
  if (opts.steady) {
    modes.push({ n, a: amplitude, c: dropFlip(cycles) });
  } else {
    const tracked = dropModeTrack(dropTrack, n, amplitude, timeSec, dropSpeedHz);
    dropTrack = tracked.state;
    const c = dropFlip(cycles);
    for (const mode of tracked.modes) modes.push({ ...mode, c });
  }

  const radius = DROP_R0 * (plate / 100);
  const resonances = [];
  for (let mode = DROP_N_MIN; mode <= DROP_N_MAX; mode++)
    resonances.push({ mode, freq: dropFn(mode, radius) });
  n2 = dropSecondMode(f, resonances, n);
  const mixed = crisp < 0.5 && n2 != null;
  if (mixed) {
    modes.push({
      n: n2,
      a: dropMixWeight(crisp, amplitude),
      c: opts.steady ? dropFlip(DROP_MIX_RATIO * cycles) : dropFlip(dropCycles2),
    });
  }
  return {
    n, fr, crisp, n2: mixed ? n2 : null, mixed,
    modes: dropScaleModes(modes),
    obl: dropOblate(dropVolumeClamp(+chlDropVol.value), !!dropTone),
    bob: dropBob(timeSec),
  };
}

function dropFrequencyText(frequency) {
  const fixed = Number(frequency).toFixed(1);
  const decimal = LANG === 'de' || LANG === 'el' ? fixed.replace('.', ',') : fixed;
  return `${decimal} Hz`;
}

function dropStatusText(frame) {
  const { n, fr, crisp, mixed, n2 } = frame;
  document.getElementById('chlPlateVal').textContent =
    (DROP_R0 * (+chlPlate.value / 100) * 1000).toFixed(2) + 'mm';
  const status = (crisp > 0.6 ? T('chl_drop_on') : T('chl_drop_off'))
    .replace('{f}', dropFrequencyText(fr)).replace('{n}', n);
  chlStatus.textContent = status + (mixed
    ? ' · ' + T('chl_drop_mixed').replace('{n}', n).replace('{n2}', n2)
    : '');
  chlStatus.style.color = crisp > 0.6 ? 'var(--accent)' : 'var(--muted)';
  renderDropSpeed(fr);
}

let dropReflectionSprite = null;
function hideDropFallbackLayers() {
  chlReflectionCanvas.classList.add('hidden');
  chlDrop2dCanvas.classList.add('hidden');
  chlReflectionCanvas.style.filter = 'none';
}

function drawDrop(frame, canvas, scale) {
  if (!canvas) { canvas = chlCanvas; fitCanvasToScreen(canvas); }
  scale = scale || canvas.width / 300;
  const { n, fr, crisp, modes, obl, bob } = frame;
  const g = canvas.getContext('2d');
  g.setTransform(scale, 0, 0, scale, 0, 0);   // όλα τα υπόλοιπα δουλεύουν σε λογικά 300px
  const W = canvas.width / scale, H = canvas.height / scale, cx = W / 2, cy = H / 2;
  const bg = g.createRadialGradient(cx, cy, 10, cx, cy, W * .7);
  bg.addColorStop(0, '#1d1440'); bg.addColorStop(1, '#120b28');
  g.fillStyle = bg; g.fillRect(0, 0, W, H);
  const baseR = W * 0.30;

  // Άλως: ΕΝΑ γέμισμα πριν το πλέγμα. Δεν βάζουμε shadowBlur στις ~900 όψεις —
  // ο καμβάς υπολογίζει τη σκιά ξεχωριστά για καθεμιά και γονατίζει το καρέ.
  const halo = g.createRadialGradient(cx, cy, 4, cx, cy, baseR * 1.45);
  halo.addColorStop(0, 'rgba(255,199,107,.22)'); halo.addColorStop(1, 'rgba(255,199,107,0)');
  g.fillStyle = halo; g.fillRect(0, 0, W, H);
  const canvasVariant = window.__dropCanvasVariant || 'css-layer';
  const cssLayers = canvas === chlCanvas && canvasVariant === 'css-layer';
  if (cssLayers) {
    for (const layer of [chlReflectionCanvas, chlDrop2dCanvas]) {
      if (layer.width !== canvas.width || layer.height !== canvas.height) {
        layer.width = canvas.width; layer.height = canvas.height;
      }
      layer.classList.remove('hidden');
    }
    chlReflectionCanvas.style.filter = 'blur(4px)';
  } else if (canvas === chlCanvas) hideDropFallbackLayers();

  const fallbackCanvas = canvas === chlCanvas;
  const mesh = dropMeshModes(
    modes,
    fallbackCanvas ? DROP_FALLBACK_RINGS : DROP_RINGS,
    fallbackCanvas ? DROP_FALLBACK_SEGS : DROP_SEGS,
    obl, DROP_B2
  );
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

  const paintFaces = (target = g) => {
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
      target.beginPath();
      target.moveTo(mx + (x0 - mx) * E, my + (y0 - my) * E);
      target.lineTo(mx + (x1 - mx) * E, my + (y1 - my) * E);
      target.lineTo(mx + (x2 - mx) * E, my + (y2 - my) * E);
      target.lineTo(mx + (x3 - mx) * E, my + (y3 - my) * E);
      target.closePath();
      target.fillStyle = col;
      target.fill();
    }
  };

  // The fallback mirrors the same lit faces used by the primary drop renderer.
  if (cssLayers) {
    const reflection = chlReflectionCanvas.getContext('2d');
    const object = chlDrop2dCanvas.getContext('2d');
    for (const target of [reflection, object]) {
      target.setTransform(scale, 0, 0, scale, 0, 0);
      target.clearRect(0, 0, W, H);
    }
    reflection.save();
    reflection.translate(cx, cy + baseR * 0.9);
    reflection.scale(1, -0.55);
    reflection.globalAlpha = 0.35;
    paintFaces(reflection);
    reflection.restore();
    object.save(); object.translate(cx + bob.x * W / 2, cy - bob.y * W / 2);
    paintFaces(object); object.restore();
    reflection.setTransform(1, 0, 0, 1, 0, 0);
    object.setTransform(1, 0, 0, 1, 0, 0);
  } else if (canvasVariant === 'preblurred' && canvas === chlCanvas) {
    if (!dropReflectionSprite) dropReflectionSprite = document.createElement('canvas');
    if (dropReflectionSprite.width !== canvas.width || dropReflectionSprite.height !== canvas.height) {
      dropReflectionSprite.width = canvas.width; dropReflectionSprite.height = canvas.height;
    }
    const sprite = dropReflectionSprite.getContext('2d');
    sprite.setTransform(scale, 0, 0, scale, 0, 0);
    sprite.clearRect(0, 0, W, H);
    sprite.save(); sprite.translate(cx, cy + baseR * 0.9); sprite.scale(1, -0.55);
    sprite.globalAlpha = 0.35; paintFaces(sprite); sprite.restore();
    sprite.setTransform(1, 0, 0, 1, 0, 0);
    g.save();
    if ('filter' in g) g.filter = 'blur(4px)';
    g.drawImage(dropReflectionSprite, 0, 0, W, H);
    g.restore();
    if ('filter' in g) g.filter = 'none';
  } else {
    g.save();
    g.translate(cx, cy + baseR * 0.9);
    g.scale(1, -0.55);
    g.globalAlpha = 0.35;
    if (canvasVariant !== 'none' && 'filter' in g) g.filter = 'blur(4px)';
    paintFaces();
    g.restore();
    g.globalAlpha = 1;
    if ('filter' in g) g.filter = 'none';
  }

  // ΜΟΝΑΔΕΣ: το dropBob δίνει μετατόπιση σε μονάδες οθόνης όπου το μισό πλάτος είναι 1
  // (έτσι τη διαβάζει ο shader). Εδώ το μισό πλάτος είναι W/2 pixel, άρα πολλαπλασιάζουμε
  // με W/2. Το −bob.y είναι γιατί ο καμβάς 2D μετράει προς τα κάτω, η φυσική προς τα πάνω.
  if (!cssLayers) {
    g.save(); g.translate(cx + bob.x * W / 2, cy - bob.y * W / 2);
    paintFaces();
    g.restore();
  }

  g.setTransform(1, 0, 0, 1, 0, 0);
  if (canvas !== chlCanvas) return;
  dropStatusText(frame);
}

// Ζωγραφίζει ΕΝΑ καρέ στο μονοπάτι που υπάρχει, και ενημερώνει τα κείμενα κατάστασης.
// Τα κείμενα είναι ίδια και στα δύο μονοπάτια επίτηδες: ο χρήστης δεν πρέπει να
// καταλαβαίνει ποιο τρέχει, και τα τρίγλωσσα golden τεστ δεν αλλάζουν.
function drawDropFrame(cycles, timeSec = 0, opts = {}) {
  const frame = dropFrameParams(cycles, timeSec, opts);
  if (!dropRenderer.impl) { drawDrop(frame); return; }
  dropSizeCanvas();
  dropRenderer.impl.draw({
    ...frame,
    b2: DROP_B2,
    quality: opts.quality == null ? dropRenderer.activeTier : opts.quality,
    yaw: dropYaw, pitch: dropPitch,
    time: timeSec,
  });
  if (dropRenderer.activeTier === DROP_Q.LOW && !dropRenderer.lowFrameDrawn) {
    dropRenderer.lowFrameDrawn = true;
    const initialTier = dropQ.tier;
    if (initialTier > DROP_Q.LOW) {
      if (dropRenderer.hasParallelCompile === false && !dropQ.forced) {
        dropQ.tier = DROP_Q.LOW;
        dropQ.autoCompileBlocked = true;
      } else {
        if (!dropQ.forced) dropQ.upgradePending = true;
        requestDropTier(initialTier, { forced: dropQ.forced });
      }
    }
  }
  dropStatusText(frame);
}

function animateDrop() {
  let lastNow = null;
  const step = now => {
    if (document.hidden) {
      lastNow = null;
      chlRaf = requestAnimationFrame(step);
      return;
    }
    if (lastNow == null) lastNow = now;
    const dt = Math.max(0, (now - lastNow) / 1000);
    lastNow = now;
    dropCycles = dropAdvance(dropCycles, dropSpeedHz, dt);
    dropCycles2 = dropAdvance(dropCycles2, DROP_MIX_RATIO * dropSpeedHz, dt);
    // Keep real elapsed time for transitions and bob; dropAdvance clamps phase dt separately.
    dropTimeSec += dt;
    const activeTier = dropRenderer.activeTier;
    const tier = activeTier === dropQ.tier
      ? dropQualityStep(dropQ, now, dt * 1000)
      : dropQ.tier;
    if (tier !== activeTier && tier !== dropRenderer.desiredTier) {
      requestDropTier(tier, { forced: dropQ.forced });
    }
    if (!dropQualityFrameDue(dropQ, now)) {
      chlRaf = requestAnimationFrame(step);
      return;
    }
    dropSizeCanvas();
    drawDropFrame(dropCycles, dropTimeSec, { quality: activeTier });
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
      dropPitch = Math.max(DROP_PITCH_MIN, Math.min(DROP_PITCH_MAX, dropPitch + (e.clientY - ly) * DRAG));
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
  if (shape === 'plate') stopDropTone();
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
  if (shape !== 'drop' || useGL) hideDropFallbackLayers();
  chlCanvas.classList.toggle('hidden', useGL);
  chlDropCanvas.classList.toggle('hidden', !useGL);
  chlDropCanvas.classList.toggle('rotatable', useGL);
  chlCanvas.classList.toggle('rotatable', shape === 'drop' && !useGL);
  document.getElementById('chlRotateHint').textContent = shape === 'drop' ? T('chl_drop_rotate') : '';
  chlDropControls.classList.toggle('hidden', shape !== 'drop');
  chlDropSources.classList.toggle('hidden', shape !== 'drop');
  if (chlRaf) { cancelAnimationFrame(chlRaf); chlRaf = null; }
  if (shape === 'drop') animateDrop(); else drawChladni();
  if (shape === 'drop' && activeTab === 'chladni') ensureDropRenderer();
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
  if (!canvas) { canvas = cryCanvas; fitCanvasToScreen(canvas); }
  scale = scale || canvas.width / 300;
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
  // The NSDF starts at lag 1, not at minLag: the initial positive zone has to be measured
  // from lag 0 (McLeod). Starting at minLag mistook the first period's own peak lobe for
  // the initial zone whenever minLag fell inside it (notes above ~837 Hz), which skipped
  // the real peak and read the note one octave low. Peaks above PITCH_MAX_HZ are dropped below.
  const nsdf = new Float32Array(maxLag + 2);
  for (let lag = 1; lag <= maxLag; lag++) {
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
  let i = 1;
  while (i <= maxLag && nsdf[i] > 0) i++;

  // Μία κορυφή ανά θετική ζώνη, δηλαδή μία ανά περίοδο.
  const peaks = [];
  while (i <= maxLag) {
    if (nsdf[i] > 0) {
      let top = i;
      while (i <= maxLag && nsdf[i] > 0) { if (nsdf[i] > nsdf[top]) top = i; i++; }
      if (top >= minLag) peaks.push(top);
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
  // nsdf[minLag - 1] is computed now (the NSDF starts at lag 1), so only lag 1 lacks a neighbour.
  if (lag > 1 && lag < maxLag) {
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
  stopDropTone();
  stopRefTone();
  // Το micStarting μπαίνει ΣΥΓΧΡΟΝΑ, πριν το await: αλλιώς ένα δεύτερο πάτημα όσο
  // περιμένουμε την άδεια ξεκινά δεύτερη ροή, η πρώτη μένει ορφανή με τον χρονιστή
  // της, και το μικρόφωνο συνεχίζει να ηχογραφεί ενώ ο χρήστης νομίζει ότι το έκλεισε.
  if (micStream || micStarting) return;
  window.stopChladniLive?.();
  window.TuningLab?.stopCapture?.();
  micStarting = true;
  try {
  const box = document.getElementById('micError');
  box.classList.add('hidden');
  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia || !window.AudioCapture?.manager) { micFail('mic_insecure'); return; }
  try {
    // Χωρίς επεξεργασία φωνής: τα φίλτρα ηχούς και θορύβου πειράζουν το ύψος του τόνου.
    micStream = await window.AudioCapture.manager.acquire('tuner', {
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
  if (window.AudioCapture?.manager) window.AudioCapture.manager.release('tuner');
  else if (micStream) micStream.getTracks().forEach(t => t.stop());
  micStream = null;
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
        s.ds = Math.round(dropSpeedHz * 100) / 100;
        s.dv = Math.round(+chlDropVol.value * 100) / 100;
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
      if (s.ds != null) {
        dropSpeedHz = dropSpeedClamp(s.ds);
        chlDropSpeed.value = dropSliderFromSpeed(dropSpeedHz);
      }
      if (s.dv != null) chlDropVol.value = dropVolumeClamp(s.dv);
      // Το τύλιγμα δέχεται και χειρόγραφα URL με 400 ή -400 και τα φέρνει στον κύκλο·
      // η clampNum μένει μόνο για να πιάσει το μη αριθμητικό και να δώσει την προεπιλογή.
      if (s.yw != null) dropYaw = wrapDeg(clampNum(s.yw, -1e6, 1e6, DROP_YAW0 * 180 / Math.PI)) * Math.PI / 180;
      const PT_MIN = Math.round(DROP_PITCH_MIN * 180 / Math.PI);
      const PT_MAX = Math.round(DROP_PITCH_MAX * 180 / Math.PI);
      if (s.pt != null) dropPitch = clampNum(s.pt, PT_MIN, PT_MAX, DROP_PITCH0 * 180 / Math.PI) * Math.PI / 180;
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
  if (name !== 'chladni') stopDropTone();
  activeTab = name;
  if (name !== 'chladni') window.stopChladniLive?.();
  document.querySelectorAll('.tab').forEach(x => x.classList.toggle('active', x.dataset.tab === name));
  TAB_NAMES.forEach(p => document.getElementById('panel-' + p).classList.toggle('hidden', p !== name));
  if (name === 'chladni') {
    if (chlShape === 'drop') {
      if (!chlRaf) animateDrop();
      ensureDropRenderer();
    }
  }
  else if (chlRaf) { cancelAnimationFrame(chlRaf); chlRaf = null; }
  if (name !== 'tuner') stopRefTone();
  if (name !== 'tuner') stopMic();   // το μικρόφωνο δεν μένει ανοιχτό στο παρασκήνιο
  if (window.TuningLab) window.TuningLab.setActive(name === 'tuning');
  document.querySelectorAll('.tab').forEach(x => x.setAttribute('aria-pressed', String(x.dataset.tab === name)));
  markRecentBaseline();
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
  scheduleRecent();
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
// The card shows the deterministic maximum-amplitude frame, with zero bob.
async function dropArtCanvas(size, snapshot = null) {
  const art = document.createElement('canvas');
  art.width = art.height = size;
  const state = snapshot || {
    frame: dropFrameParams(0, 0, { steady: true }), yaw: dropYaw, pitch: dropPitch,
  };
  const renderer = await requestDropTier(DROP_Q.HIGH, { forced: true });
  if (!renderer) { drawDrop(state.frame, art, size / 300); return art; }
  // ΞΕΧΩΡΙΣΤΟΣ καμβάς για το ίδιο το WebGL context: ΔΕΝ ζωγραφίζουμε στο art που
  // επιστρέφουμε. Το loseContext() παρακάτω σβήνει ΑΜΕΣΩΣ το ζωγραφισμένο περιεχόμενο
  // του καμβά που κρατάει το context — το preserveDrawingBuffer κρατάει το buffer
  // ανάμεσα σε καρέ, όχι μετά την απώλεια context. Αν επιστρέφαμε αυτόν τον καμβά, ο
  // καλών θα έβρισκε άδεια εικόνα μόλις προσπαθούσε να τη σχεδιάσει.
  const glCanvas = document.createElement('canvas');
  glCanvas.width = glCanvas.height = size;
  const R = await dropGLCreate(glCanvas, DROP_Q.HIGH);
  if (!R) { drawDrop(state.frame, art, size / 300); return art; }
  R.draw({
    ...state.frame, b2: DROP_B2, quality: DROP_Q.HIGH,
    yaw: state.yaw, pitch: state.pitch, bob: { x: 0, y: 0 }, time: 0,
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

async function exportCard() {
  const tab = activeTab;
  if (tab !== 'chladni' && tab !== 'crystal') return;
  const s = TAB_STATE[tab].read();
  const dropSnapshot = chlShape === 'drop' && tab === 'chladni' ? {
    frame: dropFrameParams(0, 0, { steady: true }), yaw: dropYaw, pitch: dropPitch,
  } : null;
  let art;
  if (chlShape === 'drop' && tab === 'chladni') {
    art = await dropArtCanvas(CARD_ART, dropSnapshot);
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
function toast(msg, ms = 2000) {
  const el = document.getElementById('toast');
  el.textContent = msg;
  el.classList.remove('hidden');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.add('hidden'), ms);
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

// ---------- πρόσφατες ρυθμίσεις ----------
// Μια ρύθμιση μπαίνει στα «πρόσφατα» μόνο αν ο χρήστης την ΑΛΛΑΞΕ και μετά τη
// σταμάτησε για RECENT_SETTLE_MS: το απλό άνοιγμα καρτέλας ή κάθε βήμα ενός slider
// δεν γεμίζει τη λίστα. Αποθήκευση και επικύρωση: static/settings_transfer.js.
const RECENT_SETTLE_MS = 2000;
let recentTimer = null, recentTab = null, recentBaseline = {};
function settingsStore() { try { return window.localStorage; } catch (e) { return null; } }
// Καλείται όταν ανοίγει καρτέλα: μια αλλαγή που περίμενε ακόμα το «κάθισμα» δεν χάνεται.
function markRecentBaseline() {
  if (recentTimer) flushRecent();
  try { recentBaseline[activeTab] = JSON.stringify(TAB_STATE[activeTab].read()); } catch (e) { /* tab without state */ }
}
function flushRecent() {
  clearTimeout(recentTimer); recentTimer = null;
  const store = settingsStore(), tab = recentTab;
  if (!window.SettingsTransfer || !store || !TAB_STATE[tab]) return;
  const state = TAB_STATE[tab].read(), key = JSON.stringify(state);
  if (key === recentBaseline[tab]) return;
  recentBaseline[tab] = key;
  if (SettingsTransfer.rememberRecent(store, tab, state)) renderRecents();
}
function scheduleRecent() {
  if (recentTimer && recentTab !== activeTab) flushRecent();
  clearTimeout(recentTimer);
  recentTab = activeTab;
  recentTimer = setTimeout(flushRecent, RECENT_SETTLE_MS);
}
function recentLabel(item) {
  const tabKey = { tone: 'tab_tone', heal: 'tab_heal', chladni: 'tab_chl', crystal: 'tab_cry', tuner: 'tab_tuner' }[item.tab];
  const s = item.state;
  const detail = item.tab === 'tuner' ? T('inst_' + s.inst) + ' · A ' + s.a + ' Hz'
    : item.tab === 'heal' ? s.f + ' Hz' : favLabel(item.tab, s);
  return T(tabKey) + ' · ' + detail;
}
function renderRecents() {
  const list = document.getElementById('recentList');
  if (!list) return;
  const store = settingsStore();
  const items = window.SettingsTransfer && store ? SettingsTransfer.readRecents(store) : [];
  list.replaceChildren();
  items.forEach(item => {
    const b = document.createElement('button');
    b.type = 'button'; b.className = 'chip recent-item';
    b.textContent = recentLabel(item);   // textContent: οι τιμές έρχονται από αποθήκευση
    b.setAttribute('aria-label', T('recent_label').replace('{x}', b.textContent));
    b.onclick = () => { TAB_STATE[item.tab].write(item.state); showTab(item.tab); };
    list.appendChild(b);
  });
  document.getElementById('recentEmpty').classList.toggle('hidden', items.length > 0);
  document.getElementById('clearRecents').classList.toggle('hidden', items.length === 0);
}
function settingsStatus(key) {
  const el = document.getElementById('settingsStatus');
  if (el) el.textContent = key ? T(key) : '';
}
function exportSettingsFile() {
  try {
    const blob = new Blob([SettingsTransfer.exportSettings(settingsStore())], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = '432hz-studio-settings.json';
    a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 5000);
    settingsStatus('settings_exported');
  } catch (e) { settingsStatus('settings_export_error'); }
}
async function importSettingsFile(file) {
  if (!file) return;
  try {
    if (file.size > SettingsTransfer.MAX_BYTES) throw new RangeError('too large');
    const text = await file.text();
    SettingsTransfer.parseSettings(text);           // πρώτα έλεγχος, μετά ερώτηση
    if (!window.confirm(T('settings_import_prompt'))) { settingsStatus(''); return; }
    const changed = SettingsTransfer.importSettings(settingsStore(), text);
    if (changed.includes('hz-tuning-profiles') && window.TuningLab && window.TuningLab.mounted) {
      window.TuningLab.custom = window.TuningLab.readCustom();
      window.TuningLab.renderInstruments();
    }
    applyLang(changed.includes('lang432') ? preferredLanguage() : LANG);   // ξαναζωγραφίζει αγαπημένα + πρόσφατα
    settingsStatus('settings_imported');
  } catch (e) { settingsStatus('settings_import_error'); }
}

// ---------- language switch ----------
function applyLang(l) {
  LANG = I18N[l] ? l : 'el';
  try { localStorage.setItem('lang432', LANG); } catch (e) { /* ιδιωτική περιήγηση */ }
  document.documentElement.lang = LANG;
  document.querySelectorAll('[data-i18n]').forEach(el => { el.textContent = T(el.dataset.i18n); });
  document.querySelectorAll('.langs .chip').forEach(c => {
    c.classList.toggle('sel', c.dataset.l === LANG);
    c.setAttribute('aria-pressed', String(c.dataset.l === LANG));
  });
  if (chlShape === 'drop') {
    document.getElementById('chlNote').textContent = T('chl_note_drop');
    document.getElementById('chlPlateLabel').textContent = T('chl_drop_size');
    document.getElementById('chlRotateHint').textContent = T('chl_drop_rotate');
    renderDropSpeed();
  }
  renderTones();
  if (chlShape !== 'drop') drawChladni();
  drawCrystal(1);
  renderFavs();
  renderRecents();
  renderSleep();
  renderTuner();
  renderChlMicState();
  syncDropToneButton();
  document.dispatchEvent(new CustomEvent('432-language-change', { detail: { language: LANG } }));
  updateMediaSession();
  if (window.TuningLab) window.TuningLab.setLanguage(LANG);
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
  chlDropSpeed.oninput = () => {
    dropSpeedHz = dropSpeedFromSlider(+chlDropSpeed.value);
    renderDropSpeed();
    pushUrl();
  };
  chlDropVol.oninput = () => {
    if (dropTone) rampDropToneParam(dropTone.gain.gain, dropToneGain(+chlDropVol.value));
    pushUrl();
  };
  document.querySelectorAll('#panel-chladni .freq-row .chip[data-f]').forEach(c => c.onclick = () => {
    chlFreq.value = c.dataset.f; chlSlider.value = c.dataset.f;
    selectChip('#panel-chladni .freq-row .chip[data-f]', c);
    refreshChl();
  });
  document.getElementById('chlShapePlate').onclick = () => setChlShape('plate');
  document.getElementById('chlShapeDrop').onclick = () => setChlShape('drop');
  document.getElementById('chlDropPlay').onclick = () => {
    if (dropTone) stopDropTone(); else playDropTone();
  };
  document.getElementById('chlMicStart').onclick = async () => {
    stopDropTone();
    if (!window.ChladniLiveModule || chlLive) return;
    let lastLiveDraw = 0;
    chlLive = new window.ChladniLiveModule.ChladniLive(frequency => {
      chlFreq.value = clampNum(frequency, CHL_FREQ_RANGE[0], CHL_FREQ_RANGE[1], +chlFreq.value).toFixed(1);
      chlSlider.value = chlFreq.value;
      const now = performance.now();
      if (now - lastLiveDraw >= 900) { refreshChl(); lastLiveDraw = now; }
    }, (state, load) => {
      chlMicUiState = state;
      if (state === 'listening') chlMicUiLoad = load || 0;
      renderChlMicState();
      if (state === 'stopped' || state === 'error') chlLive = null;
    });
    try { await chlLive.start(); } catch (error) { /* state callback displays localized status */ }
  };
  document.getElementById('chlMicStop').onclick = () => { if (chlLive) chlLive.stop(); };
  renderChlMicState();
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
  const clearBtn = document.getElementById('clearRecents');
  if (clearBtn && window.SettingsTransfer) {
    clearBtn.onclick = () => { SettingsTransfer.clearRecents(settingsStore()); renderRecents(); };
    const importInp = document.getElementById('settingsImportFile');
    document.getElementById('exportSettings').onclick = exportSettingsFile;
    document.getElementById('importSettings').onclick = () => importInp.click();
    importInp.onchange = () => { const f = importInp.files[0]; importInp.value = ''; importSettingsFile(f); };
  }

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
  installMediaSession();
  if (window.TuningLab) {
    if (!TAB_STATE.tuning) {
      TAB_NAMES.push('tuning');
      TAB_STATE.tuning = { read: () => window.TuningLab.readState(), write: s => window.TuningLab.writeState(s) };
    }
    window.TuningLab.mount({
      detectPitch, instruments: INSTRUMENTS, tunings: TUNINGS, noteFreq, noteName,
      instrumentName: key => T('inst_' + key),
      language: LANG, showTab,
      stopOthers: () => { window.stopChladniLive?.(); stopRefTone(); stopMic(); stopTone(); stopMusic(); APP.stopSongPlayer(); },
    });
  }
  wire();
  applyUrlState();
  applyLang(LANG);
  document.querySelectorAll('.tab').forEach(x => x.setAttribute('aria-pressed', String(x.dataset.tab === activeTab)));
}
