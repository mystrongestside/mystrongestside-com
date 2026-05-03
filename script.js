const solutions = {
  "fot-vrir-seg": {
    title: "Foten vrir seg",
    intro: "Dette kan skje når foten ikke får nok støtte, eller når belastningen blir for høy før du har kontroll.",
    actions: [
      "Senk belastningen og prøv en roligere bevegelse.",
      "Flytt foten litt bredere eller mer stabilt på platen.",
      "Bruk eventuelt ankelstøtte eller en enkel hælkile hvis det gir bedre kontroll.",
      "Be om hjelp hvis foten stadig vrir seg under press."
    ],
    stop: "Stopp hvis smerte, utrygghet eller vridning øker under øvelsen."
  },
  "hael-lofter-seg": {
    title: "Hælen løfter seg",
    intro: "Når hælen løfter seg, kan du miste kraft og stabilitet i bevegelsen.",
    actions: [
      "Flytt føttene litt høyere på platen.",
      "Reduser bevegelsesutslaget og press kortere i starten.",
      "Tenk at hele foten skal ha kontakt gjennom bevegelsen.",
      "Senk vekten hvis hælen fortsetter å løfte seg."
    ],
    stop: "Stopp hvis du mister kontroll, får smerte eller må kompensere mye."
  },
  "kne-faller-inn": {
    title: "Kneet faller innover",
    intro: "Dette handler ofte om kontroll, fotplassering eller at belastningen er litt for krevende akkurat nå.",
    actions: [
      "Senk belastningen.",
      "Plasser føttene litt bredere.",
      "Følg med på at kneet peker samme vei som tærne.",
      "Gjør færre repetisjoner med bedre kontroll."
    ],
    stop: "Stopp hvis kneet faller tydelig innover og du ikke klarer å korrigere."
  },
  "utrygg": {
    title: "Jeg føler meg utrygg",
    intro: "Utrygghet er et godt signal om å gjøre øvelsen enklere før du går videre.",
    actions: [
      "Start uten eller med svært lav belastning.",
      "Bruk kortere bevegelse.",
      "Gjør 3 til 5 rolige repetisjoner før du vurderer mer.",
      "Be en veileder stå i nærheten første gang."
    ],
    stop: "Stopp hvis du føler at du ikke har kontroll eller blir mer utrygg."
  },
  "grep-rundt-handtak": {
    title: "Utfordringer med grep rundt håndtak",
    intro: "Nedsatt grepstyrke og/eller sensibilitet kan gjøre det vanskelig å holde jevnt gjennom hele repetisjonen.",
    actions: [
      "Velg lavere belastning og roligere tempo for bedre kontroll.",
      "Prøv et håndtak eller grep som krever mindre kraft i fingrene.",
      "Bruk eventuelt friksjonshjelp, stropp eller hanske dersom det gir tryggere grep.",
      "Be om hjelp til oppstart dersom grepet glipper tidlig i bevegelsen."
    ],
    stop: "Stopp hvis grepet glipper gjentatte ganger eller du føler utrygghet i belastet posisjon."
  },
  "rekker-ikke-handtak": {
    title: "Rekker ikke ned til håndtaket",
    intro: "Nedsatt aktiv bevegelighet i skulder og albue kan gjøre det vanskelig å nå håndtaket i startposisjon.",
    actions: [
      "Juster seteposisjon slik at håndtaket kommer nærmere.",
      "Prøv alternativ armstilling eller hjelp fra veileder ved oppstart.",
      "Start med kortere bevegelsesutslag til du finner en trygg posisjon.",
      "Vurder hjelpemiddel for å forlenge rekkevidde ved behov."
    ],
    stop: "Stopp hvis du får smerte i skulder/albue eller mister kontroll i oppstarten."
  },
  "kontrakturer-grep": {
    title: "Utfordringer med grep på grunn av kontrakturer",
    intro: "Kontrakturer kan begrense håndstilling og gjøre det vanskelig å få et funksjonelt, stabilt grep.",
    actions: [
      "Velg håndposisjon som krever minst mulig ytterstilling i fingre og håndledd.",
      "Reduser belastning og prioriter jevn, kontrollert bevegelse.",
      "Bruk tilpasning som stropp, polstring eller alternativt kontaktpunkt ved behov.",
      "Ta pauser mellom serier for å unngå økt spenning i hånden."
    ],
    stop: "Stopp hvis du får økende smerte, krampe eller tydelig mer spenning i hånden."
  },
  "nedsatt-syn": {
    title: "Nedsatt syn",
    intro: "Nedsatt syn kan gjøre det vanskeligere å orientere seg, finne håndtak, fotplassering og forstå bevegelsen.",
    actions: [
      "Bruk tydelige verbale instrukser steg for steg.",
      "Marker fotplassering og håndtak med kontrast eller taktil referanse.",
      "La brukeren kjenne start- og sluttposisjon før første repetisjon.",
      "Hold samme oppsett gjennom hele økten for bedre forutsigbarhet."
    ],
    stop: "Stopp hvis orientering blir utrygg eller det oppstår usikkerhet i bevegelsesretning."
  },
  "hofteubehag": {
    title: "Ubehag eller begrensning i hofte",
    intro: "Ubehag, smerte eller redusert bevegelighet i hofte kan påvirke sittestilling, fotplassering og utslag.",
    actions: [
      "Juster setedybde og ryggvinkel for mer komfortabel hofteposisjon.",
      "Tilpass fotplassering (høyde/bredde) for å redusere belastning i hofte.",
      "Bruk kortere bevegelsesutslag i smertefri del av banen.",
      "Start med lav belastning og øk gradvis kun ved god kontroll."
    ],
    stop: "Stopp hvis hoftesmerte øker, stråler eller vedvarer etter belastningen."
  },
  "kognitiv-utfordring": {
    title: "Kognitive utfordringer",
    intro: "Det kan være vanskelig å forstå øvelsen, huske rekkefølge eller følge flere beskjeder samtidig.",
    actions: [
      "Gi én kort instruks av gangen med tydelig språk.",
      "Bruk fast rutine: startposisjon, press, tilbakeføring, stopp.",
      "Demonstrer bevegelsen visuelt og la brukeren etterligne.",
      "Bruk få repetisjoner per runde med hyppige pauser og bekreftelse."
    ],
    stop: "Stopp hvis instrukser ikke forstås, eller hvis usikkerheten øker under bevegelsen."
  }
};

const modal = document.querySelector("[data-modal]");
const modalTitle = document.querySelector("[data-modal-title]");
const modalIntro = document.querySelector("[data-modal-intro]");
const modalActions = document.querySelector("[data-modal-actions]");
const modalStop = document.querySelector("[data-modal-stop]");

document.querySelectorAll("[data-open]").forEach((button) => {
  button.addEventListener("click", () => {
    const data = solutions[button.dataset.open];
    if (!data) return;

    modalTitle.textContent = data.title;
    modalIntro.textContent = data.intro;
    modalStop.textContent = data.stop;
    modalActions.innerHTML = data.actions.map((item) => `<li>${item}</li>`).join("");

    modal.showModal();
  });
});

document.querySelector("[data-close]").addEventListener("click", () => {
  modal.close();
});

modal.addEventListener("click", (event) => {
  const rect = modal.getBoundingClientRect();
  const outside =
    event.clientX < rect.left ||
    event.clientX > rect.right ||
    event.clientY < rect.top ||
    event.clientY > rect.bottom;

  if (outside) modal.close();
});

document.querySelector("[data-start-guide]").addEventListener("click", () => {
  document.querySelector("#guide").scrollIntoView({ behavior: "smooth" });
});

document.querySelector("[data-scroll-challenges]").addEventListener("click", () => {
  document.querySelector("#challenges").scrollIntoView({ behavior: "smooth" });
});

const filterToggle = document.querySelector("[data-filter-toggle]");
const filterPanel = document.querySelector("[data-filter-panel]");

filterToggle.addEventListener("click", () => {
  const isHidden = filterPanel.hasAttribute("hidden");
  filterPanel.toggleAttribute("hidden");
  filterToggle.setAttribute("aria-expanded", String(isHidden));
});

document.querySelectorAll("[data-filter]").forEach((chip) => {
  chip.addEventListener("click", () => {
    document.querySelectorAll("[data-filter]").forEach((item) => item.classList.remove("active"));
    chip.classList.add("active");

    const filter = chip.dataset.filter;

    document.querySelectorAll(".challenge-card").forEach((card) => {
      const show = filter === "all" || card.dataset.category === filter;
      card.toggleAttribute("hidden", !show);
    });
  });
});

document.querySelector("[data-complete]").addEventListener("click", () => {
  const button = document.querySelector("[data-complete]");
  button.textContent = "Gjennomført";
  button.disabled = true;
  button.style.opacity = "0.75";
});

document.querySelectorAll(".bottom-nav a").forEach((link) => {
  link.addEventListener("click", () => {
    document.querySelectorAll(".bottom-nav a").forEach((item) => item.classList.remove("active"));
    link.classList.add("active");
  });
});
