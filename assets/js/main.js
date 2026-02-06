// Menu mobile + pequenos utilitários
(function () {
  const btn = document.querySelector("[data-nav-btn]");
  const menu = document.querySelector("[data-nav-menu]");

  if (btn && menu) {
    btn.addEventListener("click", () => {
      const open = menu.getAttribute("data-open") === "true";
      menu.setAttribute("data-open", String(!open));
      btn.setAttribute("aria-expanded", String(!open));
    });

    // Fecha o menu ao clicar em um link
    menu.addEventListener("click", (e) => {
      const a = e.target.closest("a");
      if (!a) return;
      menu.setAttribute("data-open", "false");
      btn.setAttribute("aria-expanded", "false");
    });
  }

  // Ano no rodapé
  const year = document.querySelector("[data-year]");
  if (year) year.textContent = new Date().getFullYear();
})();

// Fecha menu mobile ao rolar (mantém foco na leitura)
(function () {
  const btn = document.querySelector("[data-nav-btn]");
  const menu = document.querySelector("[data-nav-menu]");
  if (!btn || !menu) return;

  window.addEventListener(
    "scroll",
    () => {
      if (menu.getAttribute("data-open") === "true") {
        menu.setAttribute("data-open", "false");
        btn.setAttribute("aria-expanded", "false");
      }
    },
    { passive: true }
  );
})();

/* ===========================
   Header: some ao descer no MOBILE, volta ao subir
   =========================== */
(function () {
  const header = document.querySelector(".header");
  if (!header) return;

  const menu = document.querySelector("[data-nav-menu]");
  const btn = document.querySelector("[data-nav-btn]");

  const mqMobile = window.matchMedia("(max-width: 779px)");
  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)");

  let lastY = window.scrollY;
  let ticking = false;

  const MIN_DELTA = 6;      // ignora micro-scroll
  const TOP_SAFE = 8;       // perto do topo, sempre mostra

  function closeMenuIfOpen() {
    if (!menu || !btn) return;
    if (menu.getAttribute("data-open") === "true") {
      menu.setAttribute("data-open", "false");
      btn.setAttribute("aria-expanded", "false");
    }
  }

  function showHeader() {
    header.classList.remove("header--hide");
  }

  function hideHeader() {
    // não esconda se o menu estiver aberto (evita UX estranha)
    if (menu && menu.getAttribute("data-open") === "true") return;
    header.classList.add("header--hide");
  }

  function onScroll() {
    if (!mqMobile.matches) {
      // no desktop não usamos o efeito (e garantimos visível)
      showHeader();
      lastY = window.scrollY;
      return;
    }

    const y = window.scrollY;

    // topo: sempre visível
    if (y <= TOP_SAFE) {
      showHeader();
      lastY = y;
      return;
    }

    const delta = y - lastY;
    if (Math.abs(delta) < MIN_DELTA) return;

    if (delta > 0) {
      // descendo
      hideHeader();
      closeMenuIfOpen();
    } else {
      // subindo
      showHeader();
    }

    lastY = y;
  }

  window.addEventListener(
    "scroll",
    () => {
      if (prefersReduced.matches) return; // respeita acessibilidade
      if (!ticking) {
        window.requestAnimationFrame(() => {
          onScroll();
          ticking = false;
        });
        ticking = true;
      }
    },
    { passive: true }
  );

  // se girar tela / redimensionar, corrige estado
  window.addEventListener("resize", () => {
    showHeader();
    lastY = window.scrollY;
  });
})();
