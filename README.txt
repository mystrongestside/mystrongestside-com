Tæpp og tren™ komplett webmal v2

Filer:
1. index.html
2. style.css
3. script.js

Denne versjonen er bygget på nytt for å unngå at JavaScript stopper hvis ett element mangler.

Innhold som er tatt med:

1. Tæpp og tren™ profil
   Tæpp og tren™
   Utviklet av MY STRONGEST SIDE®
   Farger: #105277 og #F77C37

2. Grunnveiledning for beinpress
   Sitt stabilt
   Finn fotplassering
   Press kontrollert

3. Anbefalt start for nybegynner
   Start med 1 til 2 sett og 8 til 10 repetisjoner.
   Startnivå: 1 oppvarmingssett med lett belastning og 8 til 10 repetisjoner.
   Deretter: 1 til 2 arbeidssett, 8 til 10 repetisjoner per sett og pause 1 til 2 minutter.
   Reserve: cirka 2 til 4 repetisjoner igjen når settet er ferdig.
   Progresjon: hvis 2 sett med 10 repetisjoner går med god kontroll, kan vekten økes litt neste gang.

4. Vanlige utfordringer
   Fot
   Kne
   Grep
   Syn
   Hofte
   Kognitivt
   Trygghet

5. Grep inneholder
   01. Vanskelig å gripe rundt håndtaket på grunn av nedsatt grepstyrke og eller sensibilitet.
   02. Rekker ikke ned til håndtaket på grunn av nedsatt aktiv bevegelighet i skulder og albue.
   03. Grep ved kontrakturer.

6. Loggkort
   Kroppsvekt
   Automatisk anbefalt startvekt som 40 prosent av kroppsvekt
   Vekt, sett og repetisjoner
   Pluss og minus i merkevarefarger
   Opplevelse med smiletegn i merkevarefarger
   Kommentar
   Kopier oppsummering
   Ingen e-postfelt

7. Neste øvelse
   Sittende roing med tekst om hvorfor det passer etter beinpress.

8. Personvern
   Vi lagrer ikke opplysninger om deg fra denne siden.

Manuell funksjonstest:

1. Åpne index.html i nettleser.
2. Trykk Start grunnveiledning.
3. Trykk Se vanlige utfordringer.
4. Åpne filter og test alle filterknapper.
5. Trykk Se løsning på flere utfordringer.
6. Skriv kroppsvekt 80 kg og sjekk at anbefalt startvekt blir ca. 32 kg.
7. Trykk pluss og minus i treningsloggen.
8. Velg smiletegn.
9. Skriv kommentar.
10. Trykk Kopier oppsummering og lim inn i Notater.


Endring i denne versjonen:
- Sett-feltet viser ikke lenger teksten «Sett» som placeholder når overskriften allerede sier Sett.
- Første rad foreslår Sett = 1.
- Repetisjoner har placeholder «8 til 10».
- Når kroppsvekt fylles inn, legges anbefalt startvekt automatisk inn i første vektfelt, men brukeren kan overskrive dette manuelt.

Oppdatert v4:
Når brukeren trykker på pluss, kopieres tallene fra sett 1 til den nye raden. Radnummeret oppdateres fortsatt automatisk til 2, 3 osv.


V5 ryddig topp:
Logo fra vedlegg 2 ligger øverst som ren avsender.
Beinpressillustrasjon fra vedlegg 1 ligger under logoen.
Stor BEINPRESS-tekst fra bildet er ikke brukt, fordi nettsiden allerede har overskriften Beinpress.
Eksisterende funksjoner fra v4 er beholdt.


V6 ryddig topp:
Logoen er renset slik at den ikke ligger i en hvit bildeboks.
Logoen er gjort mindre og sentrert øverst.
Beinpressillustrasjonen er beskåret på nytt slik at bare apparatet vises.
Den avkappede delen fra gammel logo er fjernet fra illustrasjonen.
Illustrasjonen er gjort lavere og mer kontrollert i layouten.


V7 video og individuell tilpasning:
- Grunnveiledning har video under "Kom raskt i gang".
- Videoen er satt til autoplay, loop, muted, playsinline og controls.
- Nedlastingsknapp er skjult med controlsList="nodownload noremoteplayback".
- Høyreklikk på video er deaktivert med oncontextmenu="return false".
- Alle utfordringer har egen video i modal.
- Modal har knapp for fullskjerm.
- Etter løsning vises "Neste trinn: Individuelle tilpasninger".
- Tekst om behovsprøvd hjelpemiddel er lagt inn.
- Lenke til Nav sin oversikt over ortopediske verksteder er lagt inn.
- MP4-filene i assets/videos er plassholdere og skal byttes med ferdige videoer.


V8 hjelpemiddel og Min økt:
- "Individuelle tilpasninger" er nå en egen knapp inne på hver utfordring.
- Når knappen trykkes, åpnes et eget panel med samme kortlogikk som utfordringer.
- Hjelpemidler/tilpasninger vises med 01, 02, 03.
- Brukeren kan trykke "Bruk dette i min økt".
- Valgt hjelpemiddel legges inn under "Min økt".
- Valgte hjelpemidler kommer med i teksten når brukeren kopierer oppsummeringen.
- Brukeren kan fjerne valgte hjelpemidler fra "Min økt".


V9 tre trinn:
1. Første trinn viser video for utfordringen uten hjelpemiddel, sammen med råd for hvordan brukeren kan trene eller justere først.
2. Neste trinn er hjelpemidler som kan lånes i resepsjonen. Disse har egne kort, video og knapp for å legge til i Min økt.
3. Tredje trinn er individuelle tilpasninger og behovsprøvde hjelpemidler. Disse er tydelig skilt fra resepsjonshjelpemidler, har egne kort, video og NAV-informasjon.
Valgte hjelpemidler viser nå type i Min økt og i kopiert oppsummering.


V10 inn og ut av apparat:
- Lagt inn egen seksjon før grunnveiledning: Før du starter, Inn og ut av apparatet.
- Seksjonen har egen video som går på repeat, kan dempes og har fullskjermknapp.
- Start grunnveiledning-knappen tar nå brukeren til Før du starter først.
- Lagt inn egen utfordring under Trygghet: Vanskelig å komme inn og ut av apparatet.
- Utfordringen har egen video, første trinn uten hjelpemiddel, hjelpemidler i resepsjonen og individuelle tilpasninger.
- Resepsjonshjelpemidler og individuelle tilpasninger for inn og ut av apparatet kan legges til i Min økt.


V11 WebVTT for beinpress-inn-og-ut:
- Videokoden for "Inn og ut av apparatet" er oppdatert til HTML5 video med controls og playsinline.
- Videoen bruker filen: beinpress-inn-og-ut.mp4
- Norsk teksting ligger i: beinpress-inn-og-ut.vtt
- Track er satt som captions, srclang="no", label="Norsk teksting" og default.
- Tekstingen er ikke brent inn i videoen.
- Brukeren kan slå tekstingen av og på i videospilleren.
- CSS for video::cue er lagt inn med høy kontrast.
- controlsList="nodownload noremoteplayback", disablePictureInPicture og oncontextmenu="return false" er beholdt.
- Merk: Dette skjuler nedlastingsknapp i støttede nettlesere, men kan ikke garantere teknisk kopibeskyttelse av videofilen.


V12 tekstingknapp:
- Det er lagt inn en synlig knapp ved videoen: Skjul teksting / Vis teksting.
- Knappen styrer WebVTT-sporet via HTML5 textTracks.
- Tekstingen settes til showing som standard når videoen laster.
- Brukeren kan fortsatt bruke den innebygde videospilleren, men har nå en tydelig egen knapp for teksting.


V13 sikker synlig teksting:
- WebVTT-sporet er beholdt med track, captions, srclang no, label Norsk teksting og default.
- I tillegg er det lagt inn en synlig HTML-overlay for teksting som styres av samme tidskoder.
- Dette gjør at tekstingen vises også i mobilnettlesere som ikke viser native WebVTT tydelig.
- Brukeren kan slå tekstingen av og på med knappen Skjul teksting / Vis teksting.
- Teksten er ikke brent inn i videoen. Den ligger som WebVTT + tilgjengelig DOM-overlay.
- Videofilen er fortsatt beinpress-inn-og-ut.mp4.
- Tekstfilen er fortsatt beinpress-inn-og-ut.vtt.


V14 teksting og fullskjerm fix:
- Tekst-overlay er gjort mindre og mer diskret slik at den ikke dekker store deler av videoen.
- Fullskjermknappen bruker nå video-wrapperen, ikke bare videoelementet, slik at overlay-tekstingen blir med i fullskjerm der nettleseren støtter dette.
- På iOS/Safari kan nettleseren fremdeles tvinge native videofullskjerm. Da brukes WebVTT-sporet som fallback.
- video::cue er justert til mer moderat størrelse.


V15 bilde over 02:
- Kortet "Vanskelig å komme inn og ut av apparatet" under Trygghet har nå bilde over tallet 02.
- Den oransje fargen er beholdt under bildet, slik du ønsket.
- Bildet er lagt inn som assets/images/inn-ut-apparat-kort.png.


V16 grunnveiledningsvideo:
- Ny video under Grunnveiledningsvideo er lagt opp med samme funksjoner som Trygg overgang inn og ut.
- Videofil: beinpress-grunnveiledning.mp4
- Tekstfil: beinpress-grunnveiledning.vtt
- WebVTT track er koblet med captions, srclang no, label Norsk teksting og default.
- Synlig tekstingknapp: Skjul teksting / Vis teksting.
- Egen tekst-overlay er lagt inn for mer stabil visning på mobil.
- Fullskjerm bruker videorammen slik at overlay-teksting kan følge med der nettleseren støtter dette.
- VTT er laget fra Grunnveiledning.txt med 25 fps konvertering fra Premiere-tidskode.


V17 pauseklokke:
- Når brukeren trykker pluss for nytt sett, starter en pauseklokke på 3:00.
- Klokken teller ned til 0:00.
- Når tiden er ute forsøker siden å gi vibrasjon på telefonen med navigator.vibrate.
- Når tiden er ute spilles en kort alarmlyd via Web Audio API.
- Det er lagt inn knapper for Start på nytt og Stopp.
- Merk: Vibrasjon støttes ikke på alle telefoner/nettlesere, spesielt ikke iOS Safari. Alarmlyd kan også være avhengig av brukerinteraksjon og nettleserinnstillinger.


V18 Hælen løfter seg:
- Kortet "Hælen løfter seg" har nå bilde over tallet 02, med blåfargen beholdt under bildet.
- Bildet ligger i assets/images/hael-lofter-seg-kort.png.
- Videoen for utfordringen bruker assets/videos/challenges/hael-lofter-seg.mp4.
- Tekstfilen ligger i assets/videos/challenges/hael-lofter-seg.vtt.
- VTT er laget fra Hæl.txt med 25 fps konvertering fra Premiere-tidskode.
- Modalvideoen har nå synlig knapp for Skjul teksting / Vis teksting når en utfordring har caption.
- Hælen løfter seg har både WebVTT track og synlig overlaytekst på mobil.


V19 Hælen løfter seg, fikset:
- Feilen i v18 var at modal-caption variablene ble brukt i JavaScript uten å være definert.
- Dette stoppet funksjonene når modal for utfordring ble åpnet.
- modalCaptionButton, modalCaptionOverlay, modalCaptionTrack og modalCaptionFrame er nå definert.
- Hælen løfter seg har fortsatt bilde over 02.
- Hælen løfter seg bruker fortsatt assets/videos/challenges/hael-lofter-seg.mp4.
- Hælen løfter seg bruker fortsatt assets/videos/challenges/hael-lofter-seg.vtt.
- Node --check er kjørt på script.js uten syntaksfeil.


V20 logo-bekreftelse:
- Ved sideåpning vises Tæpp og tren-logoen som en kort bekreftelse.
- Logoen ligger midt på skjermen, fades inn og forsvinner etter ca. 2 sekunder.
- Overlay fjernes fra DOM etter animasjonen, slik at det ikke ligger i veien for resten av siden.
- Logoen ligger i assets/images/taepp-logo-splash.png.


V21 premium intro:
- Logo-bekreftelsen er gjort mer premium.
- Resten av siden fades ned, blir lett mørkere og blurres mens logoen vises.
- Logoen vises i et glassaktig kort med myk glød.
- Det er lagt inn en diskret gradientlinje og teksten "Tæppet registrert".
- Introen forsvinner automatisk etter ca. 2,2 sekunder og fjernes fra DOM.


V22 rolig premium intro:
- Introen varer lenger og oppleves roligere.
- Bevegelsene er dempet, uten tydelig sprett eller brå overgang.
- Resten av siden fades ned mildere, med mindre blur og mindre mørklegging.
- Teksten er endret fra "Tæppet registrert" til "Klar til bruk".
- Kortet og gløden er mer subtilt for et roligere premium uttrykk.
