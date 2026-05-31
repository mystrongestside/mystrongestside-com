document.addEventListener("DOMContentLoaded", () => {
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));



  const TOKEN_TTL_MS = 30 * 1000;
  const TOKEN_STORAGE_KEY = "taepp_og_tren_beinpress_token";
  const TOKEN_EXPIRES_KEY = "taepp_og_tren_beinpress_token_expires";
  const NFC_PLATE_ID = "beinpress";
  const tokenLockOverlay = $("[data-token-lock]");
  let tokenExpiryTimer = null;

  function createClientToken() {
    if (window.crypto?.getRandomValues) {
      const values = new Uint32Array(4);
      window.crypto.getRandomValues(values);
      return Array.from(values, (value) => value.toString(16).padStart(8, "0")).join("");
    }

    return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
  }

  function hasFreshToken() {
    const token = sessionStorage.getItem(TOKEN_STORAGE_KEY);
    const expiresAt = Number(sessionStorage.getItem(TOKEN_EXPIRES_KEY));
    return Boolean(token && expiresAt && Date.now() < expiresAt);
  }

  function storeFreshToken() {
    const expiresAt = Date.now() + TOKEN_TTL_MS;
    sessionStorage.setItem(TOKEN_STORAGE_KEY, createClientToken());
    sessionStorage.setItem(TOKEN_EXPIRES_KEY, String(expiresAt));
    scheduleTokenExpiry(expiresAt);
  }

  function resetSessionSteps() {
    if (bodyweightStep) {
      bodyweightStep.hidden = true;
      bodyweightStep.classList.remove("is-visible");
    }

    if (workRowsContainer) {
      workRowsContainer.innerHTML = "";
      workRowsContainer.hidden = true;
      workRowsContainer.classList.remove("is-visible");
    }

    endSteps.forEach((step) => {
      step.hidden = true;
      step.classList.remove("is-visible");
    });

    if (copyActions) {
      copyActions.hidden = true;
      copyActions.classList.remove("fade-in-step");
    }

    if (nextExercise) {
      nextExercise.hidden = true;
      nextExercise.classList.remove("fade-in-next");
    }

    if (completionConfirmation) {
      completionConfirmation.hidden = true;
      completionConfirmation.classList.remove("fade-in-complete");
    }

    if (workFeedback) {
      workFeedback.hidden = true;
      workFeedback.classList.remove("reduce", "keep", "increase");
    }
  }

  function clearSessionInputs() {
    $$("input, textarea").forEach((field) => {
      if (field.type === "checkbox" || field.type === "radio") {
        field.checked = false;
        return;
      }

      if (field.readOnly && field.name === "sett[]") {
        field.value = "1";
        return;
      }

      if (!field.readOnly) {
        field.value = "";
      }
    });

    if (startWeightEl) {
      startWeightEl.textContent = "Anbefalt startvekt: ca. 0 kg";
    }

    resetSessionSteps();

    if (typeof stopRestTimer === "function") {
      stopRestTimer();
    }
  }

  function lockExpiredSession() {
    sessionStorage.removeItem(TOKEN_STORAGE_KEY);
    sessionStorage.removeItem(TOKEN_EXPIRES_KEY);
    window.clearTimeout(tokenExpiryTimer);

    clearSessionInputs();

    document.body.classList.add("token-locked");
    if (tokenLockOverlay) {
      tokenLockOverlay.hidden = false;
    }

    history.replaceState({ tokenLocked: true }, "", window.location.pathname);
  }

  function unlockSession() {
    document.body.classList.remove("token-locked");
    if (tokenLockOverlay) {
      tokenLockOverlay.hidden = true;
    }
  }

  function scheduleTokenExpiry(expiresAt) {
    window.clearTimeout(tokenExpiryTimer);
    const timeLeft = Math.max(0, expiresAt - Date.now());

    tokenExpiryTimer = window.setTimeout(() => {
      lockExpiredSession();
    }, timeLeft);
  }

  function normalizeNfcUrl() {
    const cleanUrl = `${window.location.pathname}${window.location.hash || ""}`;
    history.replaceState({ nfcSession: true }, "", cleanUrl);
  }

  function initNfcTokenGate() {
    const params = new URLSearchParams(window.location.search);
    const scannedPlate = params.get("nfc") || params.get("plate") || params.get("apparat");
    const tokenRequest = params.get("token");

    const isValidScan =
      scannedPlate === NFC_PLATE_ID ||
      tokenRequest === NFC_PLATE_ID ||
      tokenRequest === "1";

    if (isValidScan) {
      storeFreshToken();
      unlockSession();
      normalizeNfcUrl();
      return;
    }

    if (hasFreshToken()) {
      const expiresAt = Number(sessionStorage.getItem(TOKEN_EXPIRES_KEY));
      scheduleTokenExpiry(expiresAt);
      unlockSession();
      return;
    }

    lockExpiredSession();
  }

  window.addEventListener("popstate", () => {
    if (!hasFreshToken()) {
      lockExpiredSession();
    }
  });


  const logoSplash = $("[data-logo-splash]");

  if (logoSplash) {
    document.body.classList.add("premium-intro-active");

    window.setTimeout(() => {
      logoSplash.classList.add("is-hidden");
      document.body.classList.remove("premium-intro-active");
    }, 3200);

    window.setTimeout(() => {
      logoSplash.remove();
    }, 3700);
  }


  const solutions = {
    "fot-vrir-seg": {
      video: "assets/videos/challenges/fot-vrir-seg.mp4",
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
      video: "assets/videos/challenges/hael-lofter-seg.mp4",
      caption: "assets/videos/challenges/hael-lofter-seg.vtt",
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
      video: "assets/videos/challenges/kne-faller-inn.mp4",
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
      video: "assets/videos/challenges/utrygg.mp4",
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
    "inn-og-ut-apparat": {
      video: "assets/videos/challenges/inn-og-ut-apparat.mp4",
      title: "Vanskelig å komme inn og ut av apparatet",
      intro: "Overgangen inn og ut av apparatet kan oppleves utrygg dersom setet står lavt, avstanden er stor eller det er vanskelig å bruke håndtakene som støtte.",
      actions: [
        "Hev setet før du setter deg inn i apparatet.",
        "Bruk håndtakene rolig som støtte på begge sider.",
        "Sett deg godt tilbake før du justerer setet ned til arbeidshøyde.",
        "Bruk god tid ut av apparatet og stopp dersom du mister kontroll."
      ],
      stop: "Stopp hvis du kjenner at overgangen blir utrygg, hvis du mister balansen eller hvis du ikke får brukt støttepunktene godt nok."
    },
    "grepstyrke-sensibilitet": {
      video: "assets/videos/challenges/grepstyrke-sensibilitet.mp4",
      title: "Utfordringer med å gripe rundt håndtaket",
      intro: "Nedsatt grepstyrke og eller sensibilitet kan gjøre det vanskelig å holde rundt håndtaket.",
      actions: [
        "Start med lav belastning slik at grepet ikke blir avgjørende for tryggheten.",
        "Test om tykkere grep, stropp eller polstring gir bedre kontakt.",
        "Bruk håndtaket mest som støtte hvis apparatet tillater det.",
        "Be om veiledning hvis hånden glipper eller du ikke kjenner håndtaket godt."
      ],
      stop: "Stopp hvis du mister kontroll på håndtaket eller hånden glipper gjentatte ganger."
    },
    "rekker-ikke-handtak": {
      video: "assets/videos/challenges/rekker-ikke-handtak.mp4",
      title: "Rekker ikke ned til håndtaket",
      intro: "Nedsatt aktiv bevegelighet i skulder og albue kan gjøre det vanskelig å nå håndtaket.",
      actions: [
        "Juster setet slik at håndtaket kommer nærmere kroppen.",
        "Vurder om øvelsen kan gjennomføres trygt uten å holde fast i håndtaket.",
        "Bruk kortere bevegelsesutslag i starten.",
        "Be om hjelp til å finne en posisjon der skulder og albue ikke presses."
      ],
      stop: "Stopp hvis du må vri kroppen, løfte skulderen kraftig eller får smerte for å nå håndtaket."
    },
    "grep-kontrakturer": {
      video: "assets/videos/challenges/grep-kontrakturer.mp4",
      title: "Utfordringer med grep på grunn av kontrakturer",
      intro: "Kontrakturer kan gjøre det vanskelig å åpne hånden eller holde rundt håndtaket.",
      actions: [
        "Ikke press hånden inn i en stilling som gir smerte.",
        "Prøv et alternativt håndtak, polstring eller støtte dersom det finnes.",
        "La hånden hvile i en mest mulig naturlig stilling.",
        "Vurder annen øvelse eller annen plassering hvis grepet blir for krevende."
      ],
      stop: "Stopp hvis spenning, smerte eller ubehag i hånd og fingre øker."
    },
    "syn-orientering": {
      video: "assets/videos/challenges/syn-orientering.mp4",
      title: "Nedsatt syn",
      intro: "Nedsatt syn kan gjøre det vanskelig å finne riktig posisjon, håndtak, fotplassering eller forstå bevegelsen.",
      actions: [
        "Bruk faste holdepunkter på apparatet før du starter.",
        "Kjenn etter hvor sete, fotplate og håndtak er plassert.",
        "Be om muntlig veiledning og tydelige korte beskjeder.",
        "Bruk kontrastmerking hvis det er tilgjengelig."
      ],
      stop: "Stopp hvis du ikke er trygg på hvor kroppen, føttene eller håndtaket er plassert."
    },
    "hofte-ubehag": {
      video: "assets/videos/challenges/hofte-ubehag.mp4",
      title: "Ubehag i hofte",
      intro: "Smerte eller begrenset bevegelighet i hofte kan påvirke sittestilling, fotplassering eller bevegelsesutslag.",
      actions: [
        "Juster setet og test en mer komfortabel hoftevinkel.",
        "Reduser bevegelsesutslaget.",
        "Flytt føttene litt for å se om hofteposisjonen blir bedre.",
        "Senk belastningen og start med rolig tempo."
      ],
      stop: "Stopp ved økende smerte, låsning eller tydelig ubehag i hofte."
    },
    "kognitiv-struktur": {
      video: "assets/videos/challenges/kognitiv-struktur.mp4",
      title: "Vanskelig å forstå øvelsen",
      intro: "Det kan være krevende å huske rekkefølge, følge flere instrukser samtidig eller forstå hva som skal gjøres.",
      actions: [
        "Følg ett steg av gangen.",
        "Bruk korte instruksjoner og visuell støtte.",
        "Start med få repetisjoner.",
        "Gjenta samme rutine flere ganger før du legger til nye elementer."
      ],
      stop: "Stopp hvis du blir usikker på hva du skal gjøre videre."
    }
  };



  const receptionAids = {
    "fot-vrir-seg": [
      { id: "res-fot-01", number: "01", title: "Kile under hæl eller fot", description: "Bruk som støtte for å få bedre kontakt med fotplaten.", instruction: "Hentes i resepsjonen hvis tilgjengelig. Bruk lett belastning første gang.", video: "assets/videos/aids/resepsjon-hjelpemiddel.mp4" },
      { id: "res-fot-02", number: "02", title: "Antiskli under fot", description: "Kan bidra til at foten ligger roligere mot fotplaten.", instruction: "Hentes i resepsjonen hvis tilgjengelig. Sjekk at foten fortsatt står stabilt.", video: "assets/videos/aids/resepsjon-hjelpemiddel.mp4" },
      { id: "res-fot-03", number: "03", title: "Enkel fotmarkering", description: "Gjør det lettere å plassere foten likt fra sett til sett.", instruction: "Hentes i resepsjonen hvis tilgjengelig. Bruk markeringen som støtte, ikke som tvang.", video: "assets/videos/aids/resepsjon-hjelpemiddel.mp4" }
    ],
    "hael-lofter-seg": [
      { id: "res-hel-01", number: "01", title: "Hælkile", description: "Kan gi bedre kontakt mellom hæl og fotplate.", instruction: "Hentes i resepsjonen hvis tilgjengelig. Start med kort bevegelsesutslag.", video: "assets/videos/aids/resepsjon-hjelpemiddel.mp4" },
      { id: "res-hel-02", number: "02", title: "Antiskli under hæl", description: "Kan redusere glidning når du presser.", instruction: "Hentes i resepsjonen hvis tilgjengelig. Test med lav belastning.", video: "assets/videos/aids/resepsjon-hjelpemiddel.mp4" },
      { id: "res-hel-03", number: "03", title: "Fotstøtte for jevn kontakt", description: "Kan hjelpe deg å kjenne hele foten mot platen.", instruction: "Hentes i resepsjonen hvis tilgjengelig. Stopp hvis det gir ubehag.", video: "assets/videos/aids/resepsjon-hjelpemiddel.mp4" }
    ],
    "kne-faller-inn": [
      { id: "res-kne-01", number: "01", title: "Fotmarkering", description: "Kan gjøre det enklere å plassere føttene slik at knærne følger tærne.", instruction: "Hentes i resepsjonen hvis tilgjengelig. Bruk som visuell støtte.", video: "assets/videos/aids/resepsjon-hjelpemiddel.mp4" },
      { id: "res-kne-02", number: "02", title: "Lett minibånd", description: "Kan gi enkel taktil støtte til kneposisjon.", instruction: "Hentes i resepsjonen hvis tilgjengelig. Bruk bare med lett belastning.", video: "assets/videos/aids/resepsjon-hjelpemiddel.mp4" },
      { id: "res-kne-03", number: "03", title: "Speil eller visuell kontroll", description: "Kan gjøre det lettere å se kneets retning.", instruction: "Brukes hvis apparatet og rommet gjør det mulig.", video: "assets/videos/aids/resepsjon-hjelpemiddel.mp4" }
    ],
    "utrygg": [
      { id: "res-trygg-01", number: "01", title: "Startkort", description: "Kort med enkel rekkefølge for trygg oppstart.", instruction: "Hentes i resepsjonen hvis tilgjengelig. Følg ett punkt om gangen.", video: "assets/videos/aids/resepsjon-hjelpemiddel.mp4" },
      { id: "res-trygg-02", number: "02", title: "Stoppregel-kort", description: "Viser når du bør stoppe øvelsen.", instruction: "Hentes i resepsjonen hvis tilgjengelig. Bruk ved usikkerhet.", video: "assets/videos/aids/resepsjon-hjelpemiddel.mp4" },
      { id: "res-trygg-03", number: "03", title: "Veileder ved første sett", description: "En person kan stå i nærheten ved oppstart.", instruction: "Avtal med resepsjon eller veileder hvis mulig.", video: "assets/videos/aids/resepsjon-hjelpemiddel.mp4" }
    ],
    "inn-og-ut-apparat": [
      { id: "res-innut-01", number: "01", title: "Enkel støttepute", description: "Kan gjøre sittestillingen mer stabil når du setter deg inn.", instruction: "Hentes i resepsjonen hvis tilgjengelig. Test først uten belastning.", video: "assets/videos/aids/resepsjon-hjelpemiddel.mp4" },
      { id: "res-innut-02", number: "02", title: "Antiskli eller posisjoneringsstøtte", description: "Kan bidra til at fot eller sete holder seg mer stabilt ved overgang.", instruction: "Hentes i resepsjonen hvis tilgjengelig. Bruk rolig tempo og kontroller posisjonen.", video: "assets/videos/aids/resepsjon-hjelpemiddel.mp4" },
      { id: "res-innut-03", number: "03", title: "Veileder ved første forsøk", description: "En veileder kan stå i nærheten og hjelpe med trygg rekkefølge.", instruction: "Avtal med resepsjon eller veileder hvis mulig. Målet er trygg overgang før øvelsen starter.", video: "assets/videos/aids/resepsjon-hjelpemiddel.mp4" }
    ],
    "grepstyrke-sensibilitet": [
      { id: "res-grep-01", number: "01", title: "Grepsforstørrer", description: "Gjør håndtaket tykkere og ofte lettere å kjenne.", instruction: "Hentes i resepsjonen hvis tilgjengelig. Bruk lett belastning først.", video: "assets/videos/aids/resepsjon-hjelpemiddel.mp4" },
      { id: "res-grep-02", number: "02", title: "Enkel håndstropp", description: "Kan støtte hånden hvis grepet glipper.", instruction: "Hentes i resepsjonen hvis tilgjengelig. Skal ikke brukes hvis det gjør deg utrygg.", video: "assets/videos/aids/resepsjon-hjelpemiddel.mp4" },
      { id: "res-grep-03", number: "03", title: "Myk polstring", description: "Kan gi bedre komfort rundt håndtaket.", instruction: "Hentes i resepsjonen hvis tilgjengelig. Test kort før du trener videre.", video: "assets/videos/aids/resepsjon-hjelpemiddel.mp4" }
    ],
    "rekker-ikke-handtak": [
      { id: "res-rekke-01", number: "01", title: "Grepforlenger", description: "Kan gjøre håndtaket lettere å nå.", instruction: "Hentes i resepsjonen hvis tilgjengelig. Bruk kun hvis posisjonen blir tryggere.", video: "assets/videos/aids/resepsjon-hjelpemiddel.mp4" },
      { id: "res-rekke-02", number: "02", title: "Alternativ stropp", description: "Kan gi en enklere armstilling.", instruction: "Hentes i resepsjonen hvis tilgjengelig. Ikke press skulder eller albue.", video: "assets/videos/aids/resepsjon-hjelpemiddel.mp4" },
      { id: "res-rekke-03", number: "03", title: "Setepute", description: "Kan endre avstand til håndtaket.", instruction: "Hentes i resepsjonen hvis tilgjengelig. Sjekk at sittestillingen fortsatt er stabil.", video: "assets/videos/aids/resepsjon-hjelpemiddel.mp4" }
    ],
    "grep-kontrakturer": [
      { id: "res-kon-01", number: "01", title: "Myk håndpolstring", description: "Kan redusere trykk mot hånd og fingre.", instruction: "Hentes i resepsjonen hvis tilgjengelig. Ikke press hånden i smerte.", video: "assets/videos/aids/resepsjon-hjelpemiddel.mp4" },
      { id: "res-kon-02", number: "02", title: "Alternativt grep", description: "Kan gi mindre krav til å lukke hånden rundt håndtaket.", instruction: "Hentes i resepsjonen hvis tilgjengelig. Test med svært lett belastning.", video: "assets/videos/aids/resepsjon-hjelpemiddel.mp4" },
      { id: "res-kon-03", number: "03", title: "Støttepute ved hånd", description: "Kan gi en roligere håndstilling.", instruction: "Hentes i resepsjonen hvis tilgjengelig. Stopp ved ubehag.", video: "assets/videos/aids/resepsjon-hjelpemiddel.mp4" }
    ],
    "syn-orientering": [
      { id: "res-syn-01", number: "01", title: "Kontrastmarkering", description: "Kan gjøre håndtak og fotplassering mer synlig.", instruction: "Hentes i resepsjonen hvis tilgjengelig. Bruk faste punkter hver gang.", video: "assets/videos/aids/resepsjon-hjelpemiddel.mp4" },
      { id: "res-syn-02", number: "02", title: "Taktil markering", description: "Kan hjelpe deg å kjenne hvor hånd eller fot skal plasseres.", instruction: "Hentes i resepsjonen hvis tilgjengelig. Test rolig først.", video: "assets/videos/aids/resepsjon-hjelpemiddel.mp4" },
      { id: "res-syn-03", number: "03", title: "Kort instruksjon", description: "En enkel huskelapp for rekkefølge.", instruction: "Hentes i resepsjonen hvis tilgjengelig. Bruk sammen med muntlig veiledning ved behov.", video: "assets/videos/aids/resepsjon-hjelpemiddel.mp4" }
    ],
    "hofte-ubehag": [
      { id: "res-hofte-01", number: "01", title: "Setepute", description: "Kan gi en mer komfortabel sittestilling.", instruction: "Hentes i resepsjonen hvis tilgjengelig. Test om hoftevinkelen blir bedre.", video: "assets/videos/aids/resepsjon-hjelpemiddel.mp4" },
      { id: "res-hofte-02", number: "02", title: "Sittekile", description: "Kan endre hoftevinkel og redusere ubehag.", instruction: "Hentes i resepsjonen hvis tilgjengelig. Bruk lett belastning først.", video: "assets/videos/aids/resepsjon-hjelpemiddel.mp4" },
      { id: "res-hofte-03", number: "03", title: "Ryggstøtte", description: "Kan gi bedre stabilitet i sittestilling.", instruction: "Hentes i resepsjonen hvis tilgjengelig. Sjekk at du fortsatt sitter trygt.", video: "assets/videos/aids/resepsjon-hjelpemiddel.mp4" }
    ],
    "kognitiv-struktur": [
      { id: "res-kog-01", number: "01", title: "Trinnkort", description: "Viser øvelsen i få og tydelige steg.", instruction: "Hentes i resepsjonen hvis tilgjengelig. Følg ett trinn om gangen.", video: "assets/videos/aids/resepsjon-hjelpemiddel.mp4" },
      { id: "res-kog-02", number: "02", title: "Repetisjonskort", description: "Kan gjøre det lettere å huske sett og repetisjoner.", instruction: "Hentes i resepsjonen hvis tilgjengelig. Kryss av etter hvert sett.", video: "assets/videos/aids/resepsjon-hjelpemiddel.mp4" },
      { id: "res-kog-03", number: "03", title: "Start og stopp-kort", description: "Gir en tydelig og forutsigbar ramme.", instruction: "Hentes i resepsjonen hvis tilgjengelig. Bruk samme rutine hver gang.", video: "assets/videos/aids/resepsjon-hjelpemiddel.mp4" }
    ]
  };


  const individualAids = {
    "fot-vrir-seg": [
      {
        id: "fot-01",
        number: "01",
        title: "Kile under fot eller hæl",
        description: "Kan støtte fotstilling og gi bedre kontakt mot fotplaten.",
        instruction: "Vurderes individuelt dersom foten vrir seg eller mister stabil kontakt.",
        video: "assets/videos/aids/behovsprovd-hjelpemiddel.mp4"
      },
      {
        id: "fot-02",
        number: "02",
        title: "Stabiliserende fotstøtte",
        description: "Kan bidra til at foten holder samme retning gjennom bevegelsen.",
        instruction: "Aktuelt når foten glir, vrir seg eller trenger tydeligere støtte.",
        video: "assets/videos/aids/behovsprovd-hjelpemiddel.mp4"
      },
      {
        id: "fot-03",
        number: "03",
        title: "Trykkfordelende støtte",
        description: "Kan gi jevnere belastning under foten.",
        instruction: "Aktuelt ved ujevn kontakt eller ubehag under foten.",
        video: "assets/videos/aids/behovsprovd-hjelpemiddel.mp4"
      }
    ],
    "hael-lofter-seg": [
      {
        id: "hael-01",
        number: "01",
        title: "Hælkile",
        description: "Kan hjelpe hælen å få bedre kontakt med underlaget.",
        instruction: "Aktuelt dersom hælen løfter seg under press.",
        video: "assets/videos/aids/behovsprovd-hjelpemiddel.mp4"
      },
      {
        id: "hael-02",
        number: "02",
        title: "Fotplate med bedre kontaktflate",
        description: "Kan gi mer stabil støtte for hele foten.",
        instruction: "Aktuelt dersom foten mister kontakt eller sklir.",
        video: "assets/videos/aids/behovsprovd-hjelpemiddel.mp4"
      },
      {
        id: "hael-03",
        number: "03",
        title: "Ankelstøtte",
        description: "Kan gi ekstra støtte dersom ankelen blir ustabil.",
        instruction: "Vurderes ved behov for mer stabilitet rundt ankel og fot.",
        video: "assets/videos/aids/behovsprovd-hjelpemiddel.mp4"
      }
    ],
    "kne-faller-inn": [
      {
        id: "kne-01",
        number: "01",
        title: "Posisjoneringsstøtte ved kne",
        description: "Kan gi en tydeligere retning for kneet.",
        instruction: "Aktuelt dersom kneet faller innover og personen ikke klarer å korrigere selv.",
        video: "assets/videos/aids/behovsprovd-hjelpemiddel.mp4"
      },
      {
        id: "kne-02",
        number: "02",
        title: "Markering for fotplassering",
        description: "Kan gjøre det enklere å plassere føttene likt hver gang.",
        instruction: "Aktuelt når fotplassering påvirker kneets retning.",
        video: "assets/videos/aids/behovsprovd-hjelpemiddel.mp4"
      },
      {
        id: "kne-03",
        number: "03",
        title: "Lett stabiliseringsbånd",
        description: "Kan gi taktil støtte og økt oppmerksomhet mot kneposisjon.",
        instruction: "Må vurderes individuelt og brukes med lav belastning.",
        video: "assets/videos/aids/behovsprovd-hjelpemiddel.mp4"
      }
    ],
    "utrygg": [
      {
        id: "trygg-01",
        number: "01",
        title: "Stoppregel-kort",
        description: "En enkel visuell regel for når øvelsen skal stoppes.",
        instruction: "Aktuelt dersom personen trenger tydelig ramme og forutsigbarhet.",
        video: "assets/videos/aids/behovsprovd-hjelpemiddel.mp4"
      },
      {
        id: "trygg-02",
        number: "02",
        title: "Ekstra støttepunkt",
        description: "Kan gi økt trygghet ved innstilling og oppstart.",
        instruction: "Aktuelt dersom personen føler seg utrygg i apparatet.",
        video: "assets/videos/aids/behovsprovd-hjelpemiddel.mp4"
      },
      {
        id: "trygg-03",
        number: "03",
        title: "Veiledet oppstart",
        description: "Kort oppstart med veileder før personen trener mer selvstendig.",
        instruction: "Aktuelt første gang eller ved tydelig usikkerhet.",
        video: "assets/videos/aids/behovsprovd-hjelpemiddel.mp4"
      }
    ],
    "inn-og-ut-apparat": [
      {
        id: "innut-01",
        number: "01",
        title: "Spesialtilpasset sete eller støtte",
        description: "Kan være aktuelt dersom standard sete og støttepunkter ikke gir trygg nok overgang.",
        instruction: "Vurderes individuelt av relevant helsepersonell og eventuelt ortopediteknisk verksted.",
        video: "assets/videos/aids/behovsprovd-hjelpemiddel.mp4"
      },
      {
        id: "innut-02",
        number: "02",
        title: "Individuell vurdering av forflytning",
        description: "Kan avklare hvordan personen tryggest kommer inn og ut av apparatet.",
        instruction: "Aktuelt dersom overgangen er krevende, utrygg eller krever mye kompensering.",
        video: "assets/videos/aids/behovsprovd-hjelpemiddel.mp4"
      },
      {
        id: "innut-03",
        number: "03",
        title: "Behovsprøvd hjelpemiddel ved vedvarende utfordringer",
        description: "Kan være aktuelt dersom enkle tiltak ikke gir tilstrekkelig trygghet.",
        instruction: "Vurderes vanligvis i samarbeid med relevant helsepersonell, eventuelt som del av en tverrfaglig vurdering.",
        video: "assets/videos/aids/behovsprovd-hjelpemiddel.mp4"
      }
    ],
    "grepstyrke-sensibilitet": [
      {
        id: "grep-01",
        number: "01",
        title: "Grepsforstørrer",
        description: "Kan gjøre håndtaket lettere å holde rundt.",
        instruction: "Aktuelt ved nedsatt grepstyrke, sensibilitet eller redusert håndkontroll.",
        video: "assets/videos/aids/behovsprovd-hjelpemiddel.mp4"
      },
      {
        id: "grep-02",
        number: "02",
        title: "Håndstropp",
        description: "Kan støtte grepet når hånden glipper.",
        instruction: "Vurderes individuelt dersom grepet ikke holder gjennom settet.",
        video: "assets/videos/aids/behovsprovd-hjelpemiddel.mp4"
      },
      {
        id: "grep-03",
        number: "03",
        title: "Polstring på håndtak",
        description: "Kan gjøre håndtaket mer komfortabelt og lettere å kjenne.",
        instruction: "Aktuelt ved ubehag, redusert sensibilitet eller trykk mot hånden.",
        video: "assets/videos/aids/behovsprovd-hjelpemiddel.mp4"
      }
    ],
    "rekker-ikke-handtak": [
      {
        id: "rekke-01",
        number: "01",
        title: "Grepforlenger",
        description: "Kan gjøre håndtaket lettere å nå.",
        instruction: "Aktuelt ved nedsatt aktiv bevegelighet i skulder eller albue.",
        video: "assets/videos/aids/behovsprovd-hjelpemiddel.mp4"
      },
      {
        id: "rekke-02",
        number: "02",
        title: "Alternativt støttehåndtak",
        description: "Kan gi bedre rekkevidde og tryggere armstilling.",
        instruction: "Vurderes dersom personen må kompensere mye for å nå håndtaket.",
        video: "assets/videos/aids/behovsprovd-hjelpemiddel.mp4"
      },
      {
        id: "rekke-03",
        number: "03",
        title: "Setejustering med støtte",
        description: "Kan bidra til bedre avstand mellom kropp og håndtak.",
        instruction: "Aktuelt når sittestilling påvirker rekkevidde.",
        video: "assets/videos/aids/behovsprovd-hjelpemiddel.mp4"
      }
    ],
    "grep-kontrakturer": [
      {
        id: "kontraktur-01",
        number: "01",
        title: "Tilpasset håndstøtte",
        description: "Kan støtte hånden uten å presse fingrene i smertefull stilling.",
        instruction: "Aktuelt ved kontrakturer eller begrenset åpning av hånden.",
        video: "assets/videos/aids/behovsprovd-hjelpemiddel.mp4"
      },
      {
        id: "kontraktur-02",
        number: "02",
        title: "Myk polstring",
        description: "Kan redusere trykk mot hånd og fingre.",
        instruction: "Aktuelt dersom håndtaket gir ubehag eller trykk.",
        video: "assets/videos/aids/behovsprovd-hjelpemiddel.mp4"
      },
      {
        id: "kontraktur-03",
        number: "03",
        title: "Alternativ armplassering",
        description: "Kan gjøre øvelsen mulig uten krevende grep.",
        instruction: "Vurderes dersom håndtaket ikke kan brukes trygt.",
        video: "assets/videos/aids/behovsprovd-hjelpemiddel.mp4"
      }
    ],
    "syn-orientering": [
      {
        id: "syn-01",
        number: "01",
        title: "Kontrastmerking",
        description: "Kan gjøre håndtak, fotplate og innstillinger lettere å finne.",
        instruction: "Aktuelt ved nedsatt syn eller behov for tydeligere visuelle holdepunkter.",
        video: "assets/videos/aids/behovsprovd-hjelpemiddel.mp4"
      },
      {
        id: "syn-02",
        number: "02",
        title: "Taktil markering",
        description: "Kan gi følbar informasjon om hvor hånden eller foten skal plasseres.",
        instruction: "Aktuelt dersom visuell informasjon ikke er nok.",
        video: "assets/videos/aids/behovsprovd-hjelpemiddel.mp4"
      },
      {
        id: "syn-03",
        number: "03",
        title: "Muntlig veiledning",
        description: "Korte og konkrete beskjeder kan gjøre øvelsen mer forutsigbar.",
        instruction: "Aktuelt ved behov for støtte til orientering.",
        video: "assets/videos/aids/behovsprovd-hjelpemiddel.mp4"
      }
    ],
    "hofte-ubehag": [
      {
        id: "hofte-01",
        number: "01",
        title: "Sittekile",
        description: "Kan endre hoftevinkel og gjøre sittestillingen mer komfortabel.",
        instruction: "Aktuelt ved ubehag, stivhet eller begrenset hoftebevegelse.",
        video: "assets/videos/aids/behovsprovd-hjelpemiddel.mp4"
      },
      {
        id: "hofte-02",
        number: "02",
        title: "Bekkenstøtte",
        description: "Kan gi mer stabil sittestilling.",
        instruction: "Aktuelt dersom bekkenet glir eller personen mister posisjon.",
        video: "assets/videos/aids/behovsprovd-hjelpemiddel.mp4"
      },
      {
        id: "hofte-03",
        number: "03",
        title: "Redusert bevegelsesutslag",
        description: "Kan gjøre øvelsen tryggere og mer komfortabel i starten.",
        instruction: "Aktuelt ved smerte eller begrenset bevegelighet.",
        video: "assets/videos/aids/behovsprovd-hjelpemiddel.mp4"
      }
    ],
    "kognitiv-struktur": [
      {
        id: "kognitiv-01",
        number: "01",
        title: "Trinn-for-trinn kort",
        description: "Viser øvelsen i få og tydelige steg.",
        instruction: "Aktuelt dersom personen trenger hjelp til rekkefølge og struktur.",
        video: "assets/videos/aids/behovsprovd-hjelpemiddel.mp4"
      },
      {
        id: "kognitiv-02",
        number: "02",
        title: "Enkel repetisjonsstøtte",
        description: "Kan gjøre det lettere å huske antall sett og repetisjoner.",
        instruction: "Aktuelt ved behov for oversikt under økten.",
        video: "assets/videos/aids/behovsprovd-hjelpemiddel.mp4"
      },
      {
        id: "kognitiv-03",
        number: "03",
        title: "Fast start- og stopprutine",
        description: "Kan gjøre øvelsen mer forutsigbar.",
        instruction: "Aktuelt ved behov for trygg ramme og enkel instruksjon.",
        video: "assets/videos/aids/behovsprovd-hjelpemiddel.mp4"
      }
    ]
  };

  const selectedAids = [];
  let currentSolutionKey = null;


  const modal = $("[data-modal]");
  const modalTitle = $("[data-modal-title]");
  const modalIntro = $("[data-modal-intro]");
  const modalActions = $("[data-modal-actions]");
  const modalStop = $("[data-modal-stop]");
  const modalVideo = $("[data-modal-video]");
  const modalVideoTitle = $("[data-modal-video-title]");
  const modalCaptionButton = $("[data-toggle-modal-captions]");
  const modalCaptionOverlay = $("[data-modal-caption-overlay]");
  const modalCaptionTrack = $("[data-modal-caption-track]");
  const modalCaptionFrame = $("[data-modal-caption-frame]");
  const guideVideo = $("[data-guide-video]");
  const guideCaptionButton = $("[data-toggle-guide-captions]");
  const guideCaptionOverlay = $("[data-guide-caption-overlay]");
  const guideCaptionFrame = $("[data-guide-caption-frame]");
  const entryVideo = $("[data-entry-video]");
  const entryCaptionButton = $("[data-toggle-entry-captions]");
  const entryCaptionOverlay = $("[data-caption-overlay]");
  const entryCaptionFrame = $("[data-caption-frame]");
  const receptionAidPanel = $("[data-reception-aid-panel]");
  const receptionAidList = $("[data-reception-aid-list]");
  const showReceptionAidsButton = $("[data-show-reception-aids]");
  const individualAidPanel = $("[data-individual-aid-panel]");
  const individualAidList = $("[data-individual-aid-list]");
  const showIndividualAidsButton = $("[data-show-individual-aids]");
  const selectedAidsSection = $("[data-selected-aids-section]");
  const selectedAidsList = $("[data-selected-aids-list]");
  const restTimer = $("[data-rest-timer]");
  const restTimerTime = restTimer?.querySelector("h3");
  const restTimerStatus = $("[data-rest-timer-status]");
  const resetRestTimerButton = $("[data-reset-rest-timer]");
  const stopRestTimerButton = $("[data-stop-rest-timer]");
  const restAlarmOverlay = $("[data-rest-alarm]");
  const startNextSetButton = $("[data-start-next-set]");

  const workFeedback = $("[data-work-feedback]");
  const workFeedbackTitle = $("[data-work-feedback-title]");
  const workFeedbackText = $("[data-work-feedback-text]");
  const completeSessionInput = $("[data-complete-session]");
  const nextExercise = $("[data-next-exercise]");
  const completionConfirmation = $("[data-completion-confirmation]");
  const MAX_TOTAL_SETS = 4;
  const MAX_WORK_SETS = 3;


  let restTimerInterval = null;
  let restTimerRemaining = 180;
  let audioContext = null;


  function openModal(solutionKey) {
    const data = solutions[solutionKey];
    if (!data || !modal) return;

    currentSolutionKey = solutionKey;
    renderAidLists(solutionKey);
    resetAidPanels();

    modalTitle.textContent = data.title;
    modalIntro.textContent = data.intro;
    modalStop.textContent = data.stop;
    modalActions.innerHTML = "";

    if (modalVideoTitle) {
      modalVideoTitle.textContent = `Video: ${data.title}`;
    }

    if (modalVideo) {
      modalVideo.pause();
      modalVideo.src = data.video || "";
      modalVideo.currentTime = 0;
      modalVideo.muted = true;
      prepareModalCaptions(solutionKey, data.caption || "");
      modalVideo.load();
    }

    data.actions.forEach((item) => {
      const li = document.createElement("li");
      li.textContent = item;
      modalActions.appendChild(li);
    });

    if (typeof modal.showModal === "function") {
      modal.showModal();
    } else {
      modal.setAttribute("open", "");
      modal.classList.add("fallback-open");
    }
  }

  function closeModal() {
    if (!modal) return;

    if (modalVideo) {
      modalVideo.pause();
      modalVideo.removeAttribute("src");
      if (modalCaptionTrack) modalCaptionTrack.removeAttribute("src");
      activeModalCaptionCues = [];
      updateModalCaptionOverlay();
      updateModalCaptionButton(false);
      modalVideo.load();
    }

    if (typeof modal.close === "function" && modal.open) {
      modal.close();
    } else {
      modal.removeAttribute("open");
      modal.classList.remove("fallback-open");
    }
  }

  function resetAidPanels() {
    if (receptionAidPanel) receptionAidPanel.hidden = true;
    if (individualAidPanel) individualAidPanel.hidden = true;

    if (showReceptionAidsButton) {
      showReceptionAidsButton.setAttribute("aria-expanded", "false");
      showReceptionAidsButton.innerHTML = '2. Hjelpemidler du kan låne i resepsjonen <span aria-hidden="true">→</span>';
    }

    if (showIndividualAidsButton) {
      showIndividualAidsButton.setAttribute("aria-expanded", "false");
      showIndividualAidsButton.innerHTML = '3. Individuelle tilpasninger <span aria-hidden="true">→</span>';
    }
  }

  function isAidSelected(aidId, challengeKey, aidType) {
    return selectedAids.some((item) => (
      item.id === aidId &&
      item.challengeKey === challengeKey &&
      item.aidType === aidType
    ));
  }

  function createAidCard(aid, solutionKey, aidType) {
    const selected = isAidSelected(aid.id, solutionKey, aidType);
    const card = document.createElement("article");
    card.className = `aid-card ${aidType}`;
    card.innerHTML = `
      <div class="aid-number">${aid.number}</div>
      <div class="aid-card-body">
        <h4>${aid.title}</h4>
        <p>${aid.description}</p>
        <small>${aid.instruction}</small>

        <video
          class="aid-video"
          controls
          loop
          muted
          playsinline
          preload="metadata"
          controlsList="nodownload noremoteplayback"
          disablePictureInPicture
          oncontextmenu="return false">
          <source src="${aid.video}" type="video/mp4">
          Nettleseren din støtter ikke videoavspilling.
        </video>

        <button type="button" class="aid-use-btn" data-use-aid="${aid.id}" data-aid-type="${aidType}">
          ${selected ? "Lagt til i min økt" : "Bruk dette i min økt"}
        </button>
      </div>
    `;
    return card;
  }

  function renderAidLists(solutionKey) {
    if (receptionAidList) {
      receptionAidList.innerHTML = "";
      (receptionAids[solutionKey] || []).forEach((aid) => {
        receptionAidList.appendChild(createAidCard(aid, solutionKey, "resepsjon"));
      });
    }

    if (individualAidList) {
      individualAidList.innerHTML = "";
      (individualAids[solutionKey] || []).forEach((aid) => {
        individualAidList.appendChild(createAidCard(aid, solutionKey, "individuell"));
      });
    }
  }

  function updateSelectedAidsView() {
    if (!selectedAidsSection || !selectedAidsList) return;

    selectedAidsSection.hidden = selectedAids.length === 0;
    selectedAidsList.innerHTML = "";

    selectedAids.forEach((aid, index) => {
      const typeLabel = aid.aidType === "resepsjon"
        ? "Kan lånes i resepsjonen"
        : "Individuell tilpasning / behovsprøvd hjelpemiddel";

      const card = document.createElement("article");
      card.className = "selected-aid-card";
      card.innerHTML = `
        <div class="selected-aid-number">${String(index + 1).padStart(2, "0")}</div>
        <div>
          <h4>${aid.title}</h4>
          <p>${aid.description}</p>
          <small>${typeLabel}</small>
          <small>Fra utfordring: ${aid.challengeTitle}</small>
        </div>
        <button type="button" class="selected-aid-remove" data-remove-selected-aid="${aid.id}" data-remove-challenge="${aid.challengeKey}" data-remove-type="${aid.aidType}" aria-label="Fjern ${aid.title}">×</button>
      `;
      selectedAidsList.appendChild(card);
    });
  }

  function findAidByType(solutionKey, aidId, aidType) {
    const list = aidType === "resepsjon"
      ? receptionAids[solutionKey] || []
      : individualAids[solutionKey] || [];

    return list.find((item) => item.id === aidId);
  }

  function addAidToSession(aidId, aidType) {
    const solutionKey = currentSolutionKey;
    const data = solutions[solutionKey];
    const aid = findAidByType(solutionKey, aidId, aidType);

    if (!aid || !data) return;

    if (!isAidSelected(aid.id, solutionKey, aidType)) {
      selectedAids.push({
        ...aid,
        aidType,
        challengeKey: solutionKey,
        challengeTitle: data.title
      });
    }

    renderAidLists(solutionKey);
    updateSelectedAidsView();

    $("#logg")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function togglePanel(panel, button, openText, closeText) {
    if (!panel || !button) return;

    const willOpen = panel.hidden;
    panel.hidden = !willOpen;
    button.setAttribute("aria-expanded", String(willOpen));
    button.innerHTML = willOpen ? closeText : openText;
  }

  showReceptionAidsButton?.addEventListener("click", () => {
    togglePanel(
      receptionAidPanel,
      showReceptionAidsButton,
      '2. Hjelpemidler du kan låne i resepsjonen <span aria-hidden="true">→</span>',
      'Skjul hjelpemidler i resepsjonen <span aria-hidden="true">↑</span>'
    );
  });

  showIndividualAidsButton?.addEventListener("click", () => {
    togglePanel(
      individualAidPanel,
      showIndividualAidsButton,
      '3. Individuelle tilpasninger <span aria-hidden="true">→</span>',
      'Skjul individuelle tilpasninger <span aria-hidden="true">↑</span>'
    );
  });

  receptionAidList?.addEventListener("click", (event) => {
    const button = event.target.closest("[data-use-aid]");
    if (!button) return;
    addAidToSession(button.dataset.useAid, button.dataset.aidType);
  });

  individualAidList?.addEventListener("click", (event) => {
    const button = event.target.closest("[data-use-aid]");
    if (!button) return;
    addAidToSession(button.dataset.useAid, button.dataset.aidType);
  });

  selectedAidsList?.addEventListener("click", (event) => {
    const button = event.target.closest("[data-remove-selected-aid]");
    if (!button) return;

    const aidId = button.dataset.removeSelectedAid;
    const challengeKey = button.dataset.removeChallenge;
    const aidType = button.dataset.removeType;
    const index = selectedAids.findIndex((item) => (
      item.id === aidId &&
      item.challengeKey === challengeKey &&
      item.aidType === aidType
    ));

    if (index >= 0) {
      selectedAids.splice(index, 1);
      updateSelectedAidsView();
      if (currentSolutionKey === challengeKey) renderAidLists(challengeKey);
    }
  });

  $$('[data-open]').forEach((button) => {
    button.addEventListener("click", () => openModal(button.dataset.open));
  });

  $("[data-close]")?.addEventListener("click", closeModal);

  modal?.addEventListener("click", (event) => {
    const rect = modal.getBoundingClientRect();
    const outside =
      event.clientX < rect.left ||
      event.clientX > rect.right ||
      event.clientY < rect.top ||
      event.clientY > rect.bottom;

    if (outside) closeModal();
  });





  const modalCaptionCueMap = {
    "hael-lofter-seg": [
      {
        start: 0.480,
        end: 4.600,
        text: 'For best visning, trykk først på fullskjerm.'
      },
      {
        start: 4.600,
        end: 12.640,
        text: 'Snu deretter mobilen horisontalt.'
      },
      {
        start: 12.640,
        end: 18.040,
        text: 'Hvis hælen løfter seg,\nkan fotstillingen justeres'
      },
      {
        start: 18.040,
        end: 22.320,
        text: 'Prøv en litt bredere fotstilling'
      },
      {
        start: 22.320,
        end: 27.640,
        text: 'Plasser føttene litt høyere\npå pressplaten'
      },
      {
        start: 27.640,
        end: 33.800,
        text: 'Sørg for at hælen har kontakt\nmed platen gjennom bevegelsen'
      },
      {
        start: 34.400,
        end: 40.040,
        text: 'Hvis hælen fortsatt løfter seg, ta en kort pause fra beinpress.'
      },
      {
        start: 40.040,
        end: 45.400,
        text: 'Varm opp i cirka 10 minutter på mølle eller sykkel.'
      },
      {
        start: 45.400,
        end: 49.680,
        text: 'Prøv deretter enkel ankelmobilitet.'
      },
      {
        start: 49.680,
        end: 55.040,
        text: 'Test beinpress på nytt med bredere fotstilling.'
      },
      {
        start: 55.040,
        end: 61.200,
        text: 'Hvis hælen fortsatt løfter seg, gå til neste steg for hjelpemiddel.'
      }
    ]
  };

  let modalCaptionsVisible = true;
  let activeModalCaptionCues = [];

  function updateModalCaptionButton(hasCaptions) {
    if (!modalCaptionButton) return;
    modalCaptionButton.hidden = !hasCaptions;
    modalCaptionButton.textContent = modalCaptionsVisible ? "Skjul teksting" : "Vis teksting";
    modalCaptionButton.setAttribute("aria-pressed", String(modalCaptionsVisible));
  }

  function syncModalNativeCaptionTrack() {
    const track = getCaptionTrack(modalVideo);
    if (!track) return;
    track.mode = modalCaptionsVisible ? "showing" : "disabled";
  }

  function updateModalCaptionOverlay() {
    if (!modalVideo || !modalCaptionOverlay) return;
    if (!modalCaptionsVisible || activeModalCaptionCues.length === 0) {
      modalCaptionOverlay.textContent = "";
      modalCaptionOverlay.hidden = true;
      modalCaptionOverlay.classList.remove("is-visible");
      return;
    }
    const time = modalVideo.currentTime || 0;
    const activeCue = activeModalCaptionCues.find((cue) => time >= cue.start && time <= cue.end);
    if (activeCue) {
      modalCaptionOverlay.textContent = activeCue.text;
      modalCaptionOverlay.hidden = false;
      modalCaptionOverlay.classList.add("is-visible");
    } else {
      modalCaptionOverlay.textContent = "";
      modalCaptionOverlay.hidden = true;
      modalCaptionOverlay.classList.remove("is-visible");
    }
  }

  function setModalCaptionsVisible(visible) {
    modalCaptionsVisible = visible;
    syncModalNativeCaptionTrack();
    updateModalCaptionButton(activeModalCaptionCues.length > 0);
    updateModalCaptionOverlay();
  }

  function prepareModalCaptions(solutionKey, captionSrc) {
    activeModalCaptionCues = modalCaptionCueMap[solutionKey] || [];
    modalCaptionsVisible = true;
    if (modalCaptionTrack) {
      if (captionSrc) modalCaptionTrack.src = captionSrc;
      else modalCaptionTrack.removeAttribute("src");
    }
    updateModalCaptionButton(activeModalCaptionCues.length > 0);
    updateModalCaptionOverlay();
  }

  modalVideo?.addEventListener("loadedmetadata", () => {
    setModalCaptionsVisible(activeModalCaptionCues.length > 0);
  });
  modalVideo?.addEventListener("timeupdate", updateModalCaptionOverlay);
  modalVideo?.addEventListener("seeked", updateModalCaptionOverlay);
  modalVideo?.addEventListener("play", updateModalCaptionOverlay);
  modalVideo?.addEventListener("pause", updateModalCaptionOverlay);

  modalCaptionButton?.addEventListener("click", () => {
    setModalCaptionsVisible(!modalCaptionsVisible);
  });


  const entryCaptionCues = [
    {
      start: 3.080,
      end: 6.800,
      text: "Start med å heve setet.\nHold inne spaken under håndtaket."
    },
    {
      start: 6.800,
      end: 9.720,
      text: "Press samtidig seteryggen oppover."
    },
    {
      start: 9.720,
      end: 18.320,
      text: "Da får du bedre plass\ntil å sette deg inn i apparatet."
    },
    {
      start: 18.320,
      end: 28.480,
      text: "Bruk håndtakene og beina\ntil å justere setet ned til riktig arbeidshøyde."
    },
    {
      start: 29.920,
      end: 35.080,
      text: "Håndtakene brukes som støtte\nog gir bedre stabilitet når du presser."
    }
  ];

  let entryCaptionsVisible = true;

  function getCaptionTrack(video) {
    if (!video || !video.textTracks || video.textTracks.length === 0) {
      return null;
    }

    for (const track of video.textTracks) {
      if (track.kind === "captions" || track.kind === "subtitles") {
        return track;
      }
    }

    return video.textTracks[0] || null;
  }

  function syncNativeCaptionTrack() {
    const track = getCaptionTrack(entryVideo);
    if (!track) return;

    track.mode = entryCaptionsVisible ? "showing" : "disabled";
  }

  function updateCaptionButton() {
    if (!entryCaptionButton) return;

    entryCaptionButton.textContent = entryCaptionsVisible ? "Skjul teksting" : "Vis teksting";
    entryCaptionButton.setAttribute("aria-pressed", String(entryCaptionsVisible));
  }

  function updateCaptionOverlay() {
    if (!entryVideo || !entryCaptionOverlay) return;

    if (!entryCaptionsVisible) {
      entryCaptionOverlay.textContent = "";
      entryCaptionOverlay.hidden = true;
      entryCaptionOverlay.classList.remove("is-visible");
      return;
    }

    const time = entryVideo.currentTime || 0;
    const activeCue = entryCaptionCues.find((cue) => time >= cue.start && time <= cue.end);

    if (activeCue) {
      entryCaptionOverlay.textContent = activeCue.text;
      entryCaptionOverlay.hidden = false;
      entryCaptionOverlay.classList.add("is-visible");
    } else {
      entryCaptionOverlay.textContent = "";
      entryCaptionOverlay.classList.remove("is-visible");
      entryCaptionOverlay.hidden = true;
    }
  }

  function setEntryCaptionsVisible(visible) {
    entryCaptionsVisible = visible;
    syncNativeCaptionTrack();
    updateCaptionButton();
    updateCaptionOverlay();
  }

  entryVideo?.addEventListener("loadedmetadata", () => {
    setEntryCaptionsVisible(true);
  });

  entryVideo?.addEventListener("timeupdate", updateCaptionOverlay);
  entryVideo?.addEventListener("seeked", updateCaptionOverlay);
  entryVideo?.addEventListener("play", updateCaptionOverlay);
  entryVideo?.addEventListener("pause", updateCaptionOverlay);

  entryCaptionButton?.addEventListener("click", () => {
    setEntryCaptionsVisible(!entryCaptionsVisible);
  });

  window.setTimeout(() => setEntryCaptionsVisible(true), 250);



  const guideCaptionCues = [
    {
      start: 9.880,
      end: 15.800,
      text: 'Juster setet til du sitter stabilt,\nmed ca. 90 grader i knærne'
    },
    {
      start: 15.800,
      end: 20.000,
      text: 'Plasser føttene\ni skulderbredde'
    },
    {
      start: 20.000,
      end: 22.800,
      text: 'La tær og knær\npeke samme vei'
    },
    {
      start: 22.800,
      end: 29.360,
      text: 'Ta tak i sidehåndtakene\nfor bedre stabilitet'
    },
    {
      start: 29.360,
      end: 37.120,
      text: ''
    },
    {
      start: 37.120,
      end: 41.240,
      text: 'Press med en jevn\nog kontrollert bevegelse'
    },
    {
      start: 41.240,
      end: 46.200,
      text: 'Senk rolig tilbake\ntil startposisjon'
    }
  ];

  let guideCaptionsVisible = true;

  function updateGuideCaptionButton() {
    if (!guideCaptionButton) return;
    guideCaptionButton.textContent = guideCaptionsVisible ? "Skjul teksting" : "Vis teksting";
    guideCaptionButton.setAttribute("aria-pressed", String(guideCaptionsVisible));
  }

  function syncGuideNativeCaptionTrack() {
    const track = getCaptionTrack(guideVideo);
    if (!track) return;
    track.mode = guideCaptionsVisible ? "showing" : "disabled";
  }

  function updateGuideCaptionOverlay() {
    if (!guideVideo || !guideCaptionOverlay) return;

    if (!guideCaptionsVisible) {
      guideCaptionOverlay.textContent = "";
      guideCaptionOverlay.hidden = true;
      guideCaptionOverlay.classList.remove("is-visible");
      return;
    }

    const time = guideVideo.currentTime || 0;
    const activeCue = guideCaptionCues.find((cue) => time >= cue.start && time <= cue.end);

    if (activeCue) {
      guideCaptionOverlay.textContent = activeCue.text;
      guideCaptionOverlay.hidden = false;
      guideCaptionOverlay.classList.add("is-visible");
    } else {
      guideCaptionOverlay.textContent = "";
      guideCaptionOverlay.classList.remove("is-visible");
      guideCaptionOverlay.hidden = true;
    }
  }

  function setGuideCaptionsVisible(visible) {
    guideCaptionsVisible = visible;
    syncGuideNativeCaptionTrack();
    updateGuideCaptionButton();
    updateGuideCaptionOverlay();
  }

  guideVideo?.addEventListener("loadedmetadata", () => setGuideCaptionsVisible(true));
  guideVideo?.addEventListener("timeupdate", updateGuideCaptionOverlay);
  guideVideo?.addEventListener("seeked", updateGuideCaptionOverlay);
  guideVideo?.addEventListener("play", updateGuideCaptionOverlay);
  guideVideo?.addEventListener("pause", updateGuideCaptionOverlay);

  guideCaptionButton?.addEventListener("click", () => {
    setGuideCaptionsVisible(!guideCaptionsVisible);
  });

  window.setTimeout(() => setGuideCaptionsVisible(true), 250);


  function requestFullscreenFor(element) {
    if (!element) return;

    if (element.requestFullscreen) {
      element.requestFullscreen();
    } else if (element.webkitEnterFullscreen) {
      element.webkitEnterFullscreen();
    } else if (element.webkitRequestFullscreen) {
      element.webkitRequestFullscreen();
    }
  }

  $("[data-fullscreen-entry]")?.addEventListener("click", () => {
    // Use the wrapper when possible so the custom caption overlay stays visible in fullscreen.
    // On iOS Safari, fallback may still use native video fullscreen and WebVTT track.
    requestFullscreenFor(entryCaptionFrame || entryVideo);
  });

  $("[data-fullscreen-guide]")?.addEventListener("click", () => {
    requestFullscreenFor(guideCaptionFrame || guideVideo);
  });

  $("[data-fullscreen-video]")?.addEventListener("click", () => {
    requestFullscreenFor(modalCaptionFrame || modalVideo);
  });

  $("[data-start-guide]")?.addEventListener("click", () => {
    $("#logg")?.scrollIntoView({ behavior: "smooth" });
  });

  $("[data-open-guide]")?.addEventListener("click", () => {
    $("#guide")?.scrollIntoView({ behavior: "smooth" });
  });

  $("[data-scroll-challenges]")?.addEventListener("click", () => {
    $("#challenges")?.scrollIntoView({ behavior: "smooth" });
  });

  const filterToggle = $("[data-filter-toggle]");
  const filterPanel = $("[data-filter-panel]");

  function applyChallengeFilter(filter = "fot") {
    $$('[data-filter]').forEach((item) => {
      item.classList.toggle("active", item.dataset.filter === filter);
    });

    $$(".challenge-group").forEach((group) => {
      const show = filter === "all" || group.dataset.group === filter;
      group.toggleAttribute("hidden", !show);
    });
  }

  filterToggle?.addEventListener("click", () => {
    if (!filterPanel) return;
    const willOpen = filterPanel.hasAttribute("hidden");
    filterPanel.toggleAttribute("hidden");
    filterToggle.setAttribute("aria-expanded", String(willOpen));
  });

  $$('[data-filter]').forEach((chip) => {
    chip.addEventListener("click", () => {
      applyChallengeFilter(chip.dataset.filter || "fot");
    });
  });

  applyChallengeFilter("fot");

  $$(".bottom-nav a").forEach((link) => {
    link.addEventListener("click", () => {
      $$(".bottom-nav a").forEach((item) => item.classList.remove("active"));
      link.classList.add("active");
    });
  });

  const trainingForm = $("#training-form");
  const rowsContainer = $("[data-training-rows]");
  const workRowsContainer = $("[data-work-rows]");
  const statusEl = $("[data-form-status]");
  const bodyweightInput = $("#bodyweight");
  const bodyweightStep = $("[data-bodyweight-step]");
  const endSteps = $$("[data-end-step]");
  const copyActions = $("[data-copy-actions]");
  const startWeightEl = $("[data-start-weight]");

  function parseNorwegianNumber(value) {
    if (typeof value !== "string") return Number(value) || 0;
    return Number(value.replace(",", ".")) || 0;
  }

  function formatKg(value) {
    if (!Number.isFinite(value)) return "0";
    const rounded = Math.round(value * 10) / 10;
    return Number.isInteger(rounded) ? String(rounded) : String(rounded).replace(".", ",");
  }

  function setFirstRowStartWeight(startWeight) {
    const firstWorkRow = $('[data-row][data-set-type="work"]');
    const weightInput = firstWorkRow ? $('input[name="vekt[]"]', firstWorkRow) : null;
    if (!weightInput) return;

    const shouldUpdate =
      weightInput.dataset.autoStartWeight === "true" ||
      weightInput.value.trim() === "";

    if (startWeight > 0 && shouldUpdate) {
      weightInput.value = String(startWeight);
      weightInput.dataset.autoStartWeight = "true";
    }

    if (startWeight <= 0 && weightInput.dataset.autoStartWeight === "true") {
      weightInput.value = "";
    }
  }

  function calculateStartWeight() {
    const bodyweight = parseNorwegianNumber(bodyweightInput?.value || "0");
    if (!bodyweight || bodyweight <= 0) {
      if (startWeightEl) startWeightEl.textContent = "Anbefalt startvekt: ca. 0 kg";
      setFirstRowStartWeight(0);
      return 0;
    }

    const startWeight = Math.round(bodyweight * 0.4);
    if (startWeightEl) startWeightEl.textContent = `Anbefalt startvekt: ca. ${formatKg(startWeight)} kg`;
    setFirstRowStartWeight(startWeight);
    return startWeight;
  }

  bodyweightInput?.addEventListener("input", calculateStartWeight);

  function getTrainingRows() {
    return $$('[data-row]');
  }

  function getWorkRows() {
    return getTrainingRows().filter((row) => row.dataset.setType === "work");
  }

  function roundToNearestHalf(value) {
    return Math.round(value * 2) / 2;
  }

  function formatWeight(value) {
    if (!Number.isFinite(value)) return "";
    return Number.isInteger(value) ? String(value) : String(value).replace(".", ",");
  }

  function getLastWorkRow() {
    const workRows = getWorkRows();
    return workRows[workRows.length - 1] || null;
  }

  function getSuggestedNextWeight() {
    const lastWorkRow = getLastWorkRow();
    if (!lastWorkRow) return null;

    const weightInput = $('input[name="vekt[]"]', lastWorkRow);
    const repsInput = $('input[name="repetisjoner[]"]', lastWorkRow);
    const weight = parseNorwegianNumber(weightInput?.value || "0");
    const reps = parseNorwegianNumber(repsInput?.value || "0");

    if (!weight || weight <= 0 || !reps || reps <= 0) return null;

    if (reps < 8) {
      const newWeight = roundToNearestHalf(weight * 0.85);
      return {
        type: "reduce",
        title: "Reduser vekten",
        weight: newWeight,
        text: `Forslag: ca. ${formatWeight(newWeight)} kg neste gang.`
      };
    }

    if (reps <= 12) {
      return {
        type: "keep",
        title: "Behold vekten",
        weight,
        text: "Fortsett med samme vekt neste arbeidssett."
      };
    }

    const newWeight = roundToNearestHalf(weight * 1.15);
    return {
      type: "increase",
      title: "Øk vekten",
      weight: newWeight,
      text: `Forslag: ca. ${formatWeight(newWeight)} kg hvis øvelsen var trygg og uten smerte.`
    };
  }

  function updateWorkFeedback() {
    if (!workFeedback || !workFeedbackTitle || !workFeedbackText) return;

    const suggestion = getSuggestedNextWeight();
    if (!suggestion) {
      workFeedback.hidden = true;
      return;
    }

    workFeedback.hidden = false;
    workFeedback.classList.remove("reduce", "keep", "increase");
    workFeedback.classList.add(suggestion.type);
    workFeedbackTitle.textContent = suggestion.title;
    workFeedbackText.textContent = suggestion.text;
  }


  function revealStep(element) {
    if (!element) return;
    element.hidden = false;
    element.classList.add("is-visible");
  }

  function revealBodyweightStep() {
    revealStep(bodyweightStep);
    bodyweightStep?.scrollIntoView({ behavior: "smooth", block: "center" });
  }

  function hasBodyweight() {
    return parseNorwegianNumber(bodyweightInput?.value || "") > 0;
  }

  function hasWorkSetWithReps() {
    return getWorkRows().some((row) => {
      const reps = parseNorwegianNumber(row.querySelector('input[name="repetisjoner[]"]')?.value || "");
      return reps > 0;
    });
  }

  function revealWorkRows() {
    if (!workRowsContainer) return;

    revealStep(workRowsContainer);

    if (getWorkRows().length === 0) {
      const newRow = createWorkRowFromPrevious();
      if (newRow) {
        workRowsContainer.appendChild(newRow);
        updateRowNumbers();
        calculateStartWeight();
      }
    }

    workRowsContainer.scrollIntoView({ behavior: "smooth", block: "center" });
  }

  function revealEndSteps() {
    endSteps.forEach(revealStep);
  }

  function updateStepVisibility() {
    if (hasBodyweight()) {
      revealWorkRows();
    }

    if (hasWorkSetWithReps()) {
      revealEndSteps();
    }
  }


  function createWorkRowFromPrevious() {
    const firstRow = $('[data-row]');
    if (!firstRow) return null;

    const row = firstRow.cloneNode(true);
    row.dataset.setType = "work";
    row.classList.remove("warmup-row");
    row.classList.add("work-row");

    const inputs = $$('input', row);
    inputs.forEach((input) => {
      input.readOnly = false;
      input.dataset.autoStartWeight = "false";
    });

    const previousWork = getLastWorkRow();
    const suggestion = getSuggestedNextWeight();
    const weightInput = $('input[name="vekt[]"]', row);
    const setInput = $('input[name="sett[]"]', row);
    const repsInput = $('input[name="repetisjoner[]"]', row);

    if (weightInput) {
      const previousWeight = previousWork ? $('input[name="vekt[]"]', previousWork)?.value || "" : "";
      const startWeight = calculateStartWeight ? calculateStartWeight() : 0;
      weightInput.value = suggestion?.weight ? String(suggestion.weight) : previousWeight || (startWeight > 0 ? String(startWeight) : "");
      weightInput.placeholder = "kg";
      weightInput.setAttribute("aria-label", "Vekt i kilo for arbeidssett");
      if (!weightInput.value) weightInput.dataset.autoStartWeight = "true";
    }

    if (setInput) {
      setInput.value = "1";
      setInput.readOnly = true;
      setInput.setAttribute("aria-label", "Arbeidssett");
    }

    if (repsInput) {
      repsInput.value = "";
      repsInput.placeholder = "8 til 12";
      repsInput.setAttribute("aria-label", "Repetisjoner i arbeidssett");
    }

    const workAddButton = row.querySelector(".add-row");
    if (workAddButton) {
      workAddButton.textContent = "+";
      workAddButton.setAttribute("aria-label", "Legg til arbeidssett");
      workAddButton.classList.remove("next-step-btn");
    }

    let title = row.querySelector(".set-card-title");
    if (!title) {
      title = document.createElement("div");
      title.className = "set-card-title";
      row.prepend(title);
    }

    return row;
  }

  function updateRowNumbers() {
    const rows = getTrainingRows ? getTrainingRows() : $$('[data-row]');

    rows.forEach((row, index) => {
      const number = row.querySelector(".row-number");
      const title = row.querySelector(".set-card-title");
      const isWarmup = row.dataset.setType !== "work";
      const workIndex = rows.slice(0, index + 1).filter((item) => item.dataset.setType === "work").length;
      const label = isWarmup ? "Oppvarmingssett" : `Arbeidssett ${workIndex}`;

      if (title) title.textContent = label;

      if (number) {
        number.innerHTML = isWarmup
          ? `1<small>Oppvarming</small>`
          : `${index + 1}<small>Arbeid ${workIndex}</small>`;
      }
    });

    if (typeof updateWorkFeedback === "function") updateWorkFeedback();
  }

  function createRowFromFirstSet() {
    const firstRow = $('[data-row]');
    if (!firstRow) return null;

    const row = firstRow.cloneNode(true);

    // Når brukeren trykker pluss, skal ny rad starte med samme tall
    // som sett 1. Dette gjør logging raskere på mobil.
    const sourceInputs = $$('input', firstRow);
    const newInputs = $$('input', row);

    newInputs.forEach((input, index) => {
      input.value = sourceInputs[index]?.value || "";
      input.dataset.autoStartWeight = "false";
    });

    return row;
  }

  trainingForm?.addEventListener("input", (event) => {
    if (event.target === bodyweightInput) {
      calculateStartWeight();
      updateStepVisibility();
    }

    const weightInput = event.target.closest('input[name="vekt[]"]');
    if (weightInput) {
      const firstWorkRow = $('[data-row][data-set-type="work"]');
      if (firstWorkRow && firstWorkRow.contains(weightInput)) {
        weightInput.dataset.autoStartWeight = "false";
      }
    }

    if (
      event.target.matches('input[name="vekt[]"]') ||
      event.target.matches('input[name="repetisjoner[]"]')
    ) {
      updateWorkFeedback();
      updateStepVisibility();
    }
  });


  function formatRestTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const restSeconds = seconds % 60;
    return `${minutes}:${String(restSeconds).padStart(2, "0")}`;
  }

  function updateRestTimerDisplay() {
    if (!restTimerTime || !restTimerStatus) return;

    restTimerTime.textContent = formatRestTime(restTimerRemaining);

    if (restTimerRemaining > 0) {
      restTimerStatus.textContent = "Pauseklokken teller ned til neste sett.";
    }
  }

  function initAudioContext() {
    try {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (!AudioContextClass) return;

      if (!audioContext) {
        audioContext = new AudioContextClass();
      }

      if (audioContext.state === "suspended") {
        audioContext.resume();
      }
    } catch {
      audioContext = null;
    }
  }

  function playAlarmSound() {
    try {
      initAudioContext();
      if (!audioContext) return;

      const now = audioContext.currentTime;
      const frequencies = [880, 660, 880];

      frequencies.forEach((frequency, index) => {
        const oscillator = audioContext.createOscillator();
        const gain = audioContext.createGain();

        oscillator.type = "sine";
        oscillator.frequency.setValueAtTime(frequency, now + index * 0.22);

        gain.gain.setValueAtTime(0.0001, now + index * 0.22);
        gain.gain.exponentialRampToValueAtTime(0.24, now + index * 0.22 + 0.03);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + index * 0.22 + 0.18);

        oscillator.connect(gain);
        gain.connect(audioContext.destination);

        oscillator.start(now + index * 0.22);
        oscillator.stop(now + index * 0.22 + 0.2);
      });
    } catch {
      // Alarmlyd kan være blokkert i enkelte nettlesere.
    }
  }

  function vibratePhone() {
    if ("vibrate" in navigator) {
      navigator.vibrate([350, 150, 350, 150, 650]);
    }
  }


  function showRestAlarmOverlay() {
    if (!restAlarmOverlay) return;

    restAlarmOverlay.hidden = false;
    document.body.classList.add("rest-alarm-active");

    window.setTimeout(() => {
      startNextSetButton?.focus();
    }, 50);
  }

  function hideRestAlarmOverlay() {
    if (!restAlarmOverlay) return;

    restAlarmOverlay.hidden = true;
    document.body.classList.remove("rest-alarm-active");
  }


  function finishRestTimer() {
    if (!restTimer || !restTimerTime || !restTimerStatus) return;

    clearInterval(restTimerInterval);
    restTimerInterval = null;
    restTimerRemaining = 0;
    restTimerTime.textContent = "0:00";
    restTimerStatus.textContent = "Pausen er ferdig. Du kan starte neste sett når du er klar.";
    restTimer.classList.add("is-done");

    vibratePhone();
    playAlarmSound();
    showRestAlarmOverlay();
  }

  function startRestTimer(seconds = 180) {
    hideRestAlarmOverlay();
    if (!restTimer) return;

    initAudioContext();

    clearInterval(restTimerInterval);
    restTimerRemaining = seconds;
    restTimer.hidden = false;
    restTimer.classList.remove("is-done");
    updateRestTimerDisplay();

    restTimerInterval = window.setInterval(() => {
      restTimerRemaining -= 1;
      updateRestTimerDisplay();

      if (restTimerRemaining <= 0) {
        finishRestTimer();
      }
    }, 1000);
  }

  function stopRestTimer() {
    hideRestAlarmOverlay();
    clearInterval(restTimerInterval);
    restTimerInterval = null;

    if (restTimer) {
      restTimer.hidden = true;
      restTimer.classList.remove("is-done");
    }
  }

  resetRestTimerButton?.addEventListener("click", () => {
    startRestTimer(180);
  });

  stopRestTimerButton?.addEventListener("click", stopRestTimer);

  startNextSetButton?.addEventListener("click", () => {
    hideRestAlarmOverlay();
    stopRestTimer();
    const lastWorkRow = getLastWorkRow?.();
    lastWorkRow?.scrollIntoView({ behavior: "smooth", block: "center" });
  });




  trainingForm?.addEventListener("input", (event) => {
    if (event.target === bodyweightInput && hasBodyweight()) {
      revealWorkRows();
    }

    if (
      event.target.matches('input[name="vekt[]"]') ||
      event.target.matches('input[name="repetisjoner[]"]')
    ) {
      updateWorkFeedback();
      updateStepVisibility();
    }
  });

  trainingForm?.addEventListener("click", (event) => {
    const addButton = event.target.closest(".add-row");
    const removeButton = event.target.closest(".remove-row");

    if (addButton) {
      const currentRow = addButton.closest("[data-row]");

      if (currentRow?.dataset.setType !== "work") {
        revealBodyweightStep();
        stopRestTimer();
        return;
      }

      const rows = getTrainingRows();
      const workRows = getWorkRows();

      if (rows.length >= MAX_TOTAL_SETS || workRows.length >= MAX_WORK_SETS) {
        if (workFeedback && workFeedbackTitle && workFeedbackText) {
          workFeedback.hidden = false;
          workFeedback.classList.remove("reduce", "keep", "increase");
          workFeedbackTitle.textContent = "Maks 3 arbeidssett";
          workFeedbackText.textContent = "Du kan registrere opptil 3 arbeidssett.";
        }
        return;
      }

      const newRow = createWorkRowFromPrevious();

      if (newRow) {
        currentRow.after(newRow);
      }

      updateRowNumbers();
      calculateStartWeight();

      if (workRows.length >= 1) {
        startRestTimer(180);
      }

      return;
    }

    if (removeButton) {
      const currentRow = removeButton.closest("[data-row]");
      if (!currentRow) return;

      if (currentRow.dataset.setType !== "work") {
        $$('input', currentRow).forEach((input) => {
          if (!input.readOnly) input.value = "";
        });
      } else {
        currentRow.remove();
      }

      updateRowNumbers();
    }
  });

  function collectSelectedAids() {
    if (!selectedAids.length) return "Ingen hjelpemidler valgt.";

    return selectedAids.map((aid, index) => {
      const typeLabel = aid.aidType === "resepsjon"
        ? "Kan lånes i resepsjonen"
        : "Individuell tilpasning / behovsprøvd hjelpemiddel";

      return `${String(index + 1).padStart(2, "0")}. ${aid.title}\n   Type: ${typeLabel}\n   Fra utfordring: ${aid.challengeTitle}\n   Beskrivelse: ${aid.description}\n   Bruk: ${aid.instruction}`;
    }).join("\n\n");
  }

  function collectRows() {
    const rows = getTrainingRows ? getTrainingRows() : $$('[data-row]');

    return rows.map((row, index) => {
      const weight = row.querySelector('input[name="vekt[]"]')?.value || "ikke fylt ut";
      const sets = row.querySelector('input[name="sett[]"]')?.value || "ikke fylt ut";
      const reps = row.querySelector('input[name="repetisjoner[]"]')?.value || "ikke fylt ut";
      const isWarmup = row.dataset.setType !== "work";
      const workIndex = rows.slice(0, index + 1).filter((item) => item.dataset.setType === "work").length;
      const label = isWarmup ? "Oppvarmingssett" : `Arbeidssett ${workIndex}`;

      return `${index + 1}. ${label}\n   Vekt: ${weight} kg\n   Sett: ${sets}\n   Repetisjoner: ${reps}`;
    });
  }

  function buildSummary() {
    const formData = new FormData(trainingForm);
    const bodyweight = formData.get("kroppsvekt") || "ikke fylt ut";
    const calculatedStartWeight = calculateStartWeight();
    const experience = formData.get("opplevelse") || "ikke valgt";
    const comment = formData.get("kommentar") || "ingen kommentar";
    const rows = collectRows().join("\n\n");
    const aids = collectSelectedAids();

    return `TÆPP OG TREN™\nBeinpress\nUtviklet av MY STRONGEST SIDE®\n\nANBEFALT START FOR NYBEGYNNER\nStart med 1 til 2 sett og 8 til 10 repetisjoner.\n\nStartnivå:\n1 oppvarmingssett med lett belastning.\n8 til 10 repetisjoner.\n\nDeretter:\n1 til 2 arbeidssett.\n8 til 10 repetisjoner per sett.\nPause: 1 til 2 minutter mellom settene.\n\nBelastningen bør være så lett at øvelsen er mulig å gjennomføre med kontroll, men samtidig litt krevende. En fin regel er at du skal ha cirka 2 til 4 repetisjoner igjen i reserve når settet er ferdig.\n\nDersom du klarer 2 sett med 10 repetisjoner med god kontroll, kan du øke vekten litt neste gang.\n\nKROPPSVEKT\n${bodyweight} kg\n\nANBEFALT STARTVEKT\nCa. ${formatKg(calculatedStartWeight)} kg\n\nVEILEDNING\nVelg alltid en belastning du kan kontrollere med rolig og trygg bevegelse.\n\nMIN ØKT\n${rows}\n\nVALGTE HJELPEMIDLER OG TILPASNINGER\n${aids}\n\nOPPLEVELSE\n${experience}\n\nKOMMENTAR\n${comment}\n\nANBEFALT NESTE ØVELSE\nSittende roing. Etter beinpress kan sittende roing være en god neste øvelse. Da får beina hvile, samtidig som du trener rygg, skuldre og grep. Sittende roing kan også være en trygg øvelse fordi du sitter stabilt og kan justere motstanden enkelt.\n\nVelg lett motstand i starten. Trekk rolig mot kroppen, hold overkroppen stabil og slipp vekten kontrollert tilbake.\n\nPERSONVERN\nVi lagrer ikke opplysninger om deg fra denne siden.`;
  }

  async function copyText(text) {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    }

    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.setAttribute("readonly", "");
    textarea.style.position = "fixed";
    textarea.style.left = "-9999px";
    document.body.appendChild(textarea);
    textarea.select();
    const success = document.execCommand("copy");
    document.body.removeChild(textarea);
    return success;
  }

  completeSessionInput?.addEventListener("change", () => {
    if (completionConfirmation) {
      completionConfirmation.hidden = !completeSessionInput.checked;
      completionConfirmation.classList.toggle("fade-in-complete", completeSessionInput.checked);
    }

    if (copyActions) {
      copyActions.hidden = !completeSessionInput.checked;
      copyActions.classList.toggle("fade-in-step", completeSessionInput.checked);
    }

    if (!nextExercise) return;

    if (completeSessionInput.checked) {
      nextExercise.hidden = false;
      nextExercise.classList.add("fade-in-next");
      nextExercise.scrollIntoView({ behavior: "smooth", block: "nearest" });
    } else {
      nextExercise.hidden = true;
      nextExercise.classList.remove("fade-in-next");
    }
  });

  $("[data-copy-summary]")?.addEventListener("click", async () => {
    if (!trainingForm) return;

    const summary = buildSummary();

    try {
      const copied = await copyText(summary);
      if (statusEl) {
        statusEl.textContent = copied
          ? "Oppsummeringen er kopiert. Lim den inn i egne notater på mobilen."
          : "Kunne ikke kopiere automatisk. Marker teksten manuelt og kopier.";
      }
    } catch (error) {
      if (statusEl) statusEl.textContent = "Kunne ikke kopiere automatisk. Marker teksten manuelt og kopier.";
    }
  });

  updateRowNumbers();
  calculateStartWeight();
  updateRowNumbers();
  initNfcTokenGate();

}); 
