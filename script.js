document.addEventListener("DOMContentLoaded", () => {

  /* =========================
     FORMULARIO DE CONTACTO (contacto.html)
     Sin backend propio: arma un mailto: con los datos del
     formulario y abre el programa de correo del usuario.
     Si JavaScript no carga, el <form> igual funciona con su
     action="mailto:" (versión más básica, pero no se pierde).
     ========================= */

  const contactForm = document.getElementById("contact-form");

  if (contactForm) {

    const formStatus = document.getElementById("form-status");

    contactForm.addEventListener("submit", (event) => {

      event.preventDefault();

      // Trampa anti-spam: un bot rellena todos los campos, una persona no ve este.
      if (contactForm.sitio && contactForm.sitio.value) return;

      if (!contactForm.checkValidity()) {
        contactForm.reportValidity();
        return;
      }

      const nombre = contactForm.nombre.value.trim();
      const correo = contactForm.correo.value.trim();
      const negocio = contactForm.negocio.value.trim();
      const mensaje = contactForm.mensaje.value.trim();

      const cuerpo =
        `Nombre: ${nombre}\n` +
        `Correo: ${correo}\n` +
        (negocio ? `Negocio: ${negocio}\n` : "") +
        `\nMensaje:\n${mensaje}`;

      const asunto = `Contacto desde el sitio web — ${nombre}`;

      window.location.href =
        `mailto:delarrecife@gmail.com?subject=${encodeURIComponent(asunto)}&body=${encodeURIComponent(cuerpo)}`;

      // El navegador no avisa si el mailto: falló (ej. sin programa de correo
      // configurado), así que siempre dejamos la alternativa a la vista.
      // Texto fijo (no viene del usuario), por eso innerHTML es seguro acá.
      if (formStatus) {
        formStatus.innerHTML =
          "Se abrió tu programa de correo con el mensaje listo para enviar. " +
          "Si no se abrió, escríbeme directo a " +
          '<a href="mailto:delarrecife@gmail.com">delarrecife@gmail.com</a>.';
      }

    });

  }


  /* =========================
     VIDEO DE FONDO DEL HERO
     - Si el sistema pide "reducir movimiento", el video parte pausado.
     - El botón pausar/reproducir solo aparece si el video cargó
       (si el archivo no existe, queda el degradado azul y no hay botón).
     ========================= */

  const heroVideo = document.querySelector(".hero-video-media");
  const heroToggle = document.querySelector(".hero-video-toggle");

  if (heroVideo && heroToggle) {

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

    function setPaused(paused) {
      paused ? heroVideo.pause() : heroVideo.play().catch(() => {});
      heroToggle.textContent = paused ? "Reproducir video" : "Pausar video";
    }

    function onVideoReady() {
      heroToggle.hidden = false;
      setPaused(reduceMotion.matches);
    }

    // Puede que el video ya esté cargado (caché) cuando corre este script.
    if (heroVideo.readyState >= 2) onVideoReady();
    else heroVideo.addEventListener("loadeddata", onVideoReady, { once: true });

    heroToggle.addEventListener("click", () => setPaused(!heroVideo.paused));

  }


  /* =========================
     PALETA DE COMANDOS (Ctrl+K / Cmd+K)
     Accesible: atrapa el foco mientras está abierta, se navega
     con flechas, Enter abre el primer resultado y al cerrar el
     foco vuelve a donde estaba.
     ========================= */

  const cmdkOverlay = document.getElementById("cmdk-overlay");
  const cmdkInput = document.getElementById("cmdk-input");

  if (cmdkOverlay && cmdkInput) {

    let lastFocused = null;

    const visibleItems = () =>
      Array.from(cmdkOverlay.querySelectorAll("a.cmdk-item"))
        .filter((item) => item.style.display !== "none");

    const isOpen = () => cmdkOverlay.classList.contains("open");

    function openCmdk() {
      lastFocused = document.activeElement;
      cmdkOverlay.classList.add("open");
      cmdkInput.value = "";
      filterCmdk();
      cmdkInput.focus();
    }

    function closeCmdk() {
      cmdkOverlay.classList.remove("open");
      if (lastFocused && typeof lastFocused.focus === "function") lastFocused.focus();
    }

    // "quien" encuentra "Quiénes": se comparan sin tildes ni mayúsculas.
    const normalize = (text) =>
      text.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

    function filterCmdk() {
      const query = normalize(cmdkInput.value.trim());
      cmdkOverlay.querySelectorAll(".cmdk-item").forEach((item) => {
        const text = normalize(item.textContent);
        item.style.display = text.includes(query) ? "flex" : "none";
      });
    }

    document.addEventListener("keydown", (event) => {

      const isShortcut = (event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k";

      if (isShortcut) {
        event.preventDefault();
        isOpen() ? closeCmdk() : openCmdk();
        return;
      }

      if (!isOpen()) return;

      if (event.key === "Escape") {
        closeCmdk();
        return;
      }

      const focusables = [cmdkInput, ...visibleItems()];
      const current = focusables.indexOf(document.activeElement);

      if (event.key === "ArrowDown" || event.key === "ArrowUp" || event.key === "Tab") {
        // Flechas para moverse; Tab no se escapa del diálogo (trampa de foco).
        event.preventDefault();
        const back = event.key === "ArrowUp" || (event.key === "Tab" && event.shiftKey);
        const next = (current + (back ? -1 : 1) + focusables.length) % focusables.length;
        focusables[next].focus();
      }

      if (event.key === "Enter" && document.activeElement === cmdkInput) {
        const first = visibleItems()[0];
        if (first) first.click();
      }

    });

    cmdkOverlay.addEventListener("click", (event) => {
      if (event.target === cmdkOverlay) closeCmdk();
    });

    cmdkInput.addEventListener("input", filterCmdk);

    cmdkOverlay.querySelectorAll("a.cmdk-item").forEach((item) => {
      item.addEventListener("click", () => cmdkOverlay.classList.remove("open"));
    });

  }


  /* =========================
     MENÚ MÓVIL (hamburguesa)
     El punto de quiebre es el mismo media query del CSS
     (max-width:1000px), así JS y CSS no se contradicen.
     ========================= */

  const navToggle = document.querySelector(".nav-toggle");
  const navLinksPanel = document.querySelector(".nav-links");
  const mobileNav = window.matchMedia("(max-width: 1000px)");

  function closeMobileNav() {
    if (!navToggle || !navLinksPanel) return;
    navLinksPanel.classList.remove("open");
    navToggle.classList.remove("is-active");
    navToggle.setAttribute("aria-expanded", "false");
    navToggle.setAttribute("aria-label", "Abrir menú");
  }

  if (navToggle && navLinksPanel) {

    navToggle.addEventListener("click", () => {
      const isOpen = navLinksPanel.classList.toggle("open");
      navToggle.classList.toggle("is-active", isOpen);
      navToggle.setAttribute("aria-expanded", String(isOpen));
      navToggle.setAttribute("aria-label", isOpen ? "Cerrar menú" : "Abrir menú");
    });

    navLinksPanel.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", closeMobileNav);
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && navLinksPanel.classList.contains("open")) {
        closeMobileNav();
        navToggle.focus();
      }
    });

    mobileNav.addEventListener("change", (event) => {
      if (!event.matches) closeMobileNav();
    });

  }


  /* =========================
     APARICIÓN DE TARJETAS AL HACER SCROLL
     Las tarjetas parten ocultas solo si hay JS (clase .js en <html>).
     Si el navegador no tiene IntersectionObserver, se muestran todas.
     ========================= */

  const cardEntries =
    document.querySelectorAll(".service-card, .methodology-card, .value-card, .project-card-wide");

  if (!("IntersectionObserver" in window)) {

    cardEntries.forEach((entry) => entry.classList.add("is-visible"));

  } else {

    const cardObserver =
      new IntersectionObserver(
        (observedEntries) => {

          observedEntries.forEach((entry) => {

            if (!entry.isIntersecting) return;

            entry.target.classList.add("is-visible");

            cardObserver.unobserve(entry.target);

          });

        },
        {
          threshold: 0.15,
          rootMargin: "0px 0px -60px 0px"
        }
      );

    cardEntries.forEach((entry, index) => {
      entry.style.transitionDelay = `${(index % 3) * 90}ms`;
      cardObserver.observe(entry);
    });

  }


});
