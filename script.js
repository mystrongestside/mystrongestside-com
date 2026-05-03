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
