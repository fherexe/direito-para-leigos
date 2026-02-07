/* ===========================
   Menu mobile (abre / fecha)
   =========================== */

   
(function () {
  const btn = document.querySelector("[data-nav-btn]");
  const menu = document.querySelector("[data-nav-menu]");

  if (!btn || !menu) return;

  btn.addEventListener("click", () => {
    const isOpen = menu.getAttribute("data-open") === "true";

    menu.setAttribute("data-open", String(!isOpen));
    btn.setAttribute("aria-expanded", String(!isOpen));
  });
})();


/* ===========================
   Header: some ao descer, volta ao subir
   (mobile + desktop)
   =========================== */
(function () {
  const header = document.querySelector(".header");
  if (!header) return;

  const menu = document.querySelector("[data-nav-menu]");
  const btn = document.querySelector("[data-nav-btn]");
  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)");

  let lastScrollY = window.scrollY;
  let ticking = false;

  const MIN_DELTA = 6; // ignora micro-scroll
  const TOP_SAFE = 8;  // perto do topo, sempre mostra

  function showHeader() {
    header.classList.remove("header--hide");
  }

  function hideHeader() {
    // não esconde se o menu estiver aberto
    if (menu && menu.getAttribute("data-open") === "true") return;
    header.classList.add("header--hide");
  }

  function closeMenuIfOpen() {
    if (!menu || !btn) return;
    if (menu.getAttribute("data-open") === "true") {
      menu.setAttribute("data-open", "false");
      btn.setAttribute("aria-expanded", "false");
    }
  }

  function onScroll() {
    const currentY = window.scrollY;

    // sempre visível perto do topo
    if (currentY <= TOP_SAFE) {
      showHeader();
      lastScrollY = currentY;
      return;
    }

    const delta = currentY - lastScrollY;

    // ignora scroll mínimo
    if (Math.abs(delta) < MIN_DELTA) return;

    if (delta > 0) {
      // descendo
      hideHeader();
      closeMenuIfOpen();
    } else {
      // subindo
      showHeader();
    }

    lastScrollY = currentY;
  }

  window.addEventListener(
    "scroll",
    () => {
      if (prefersReduced.matches) return;

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

  // ao redimensionar, garante header visível
  window.addEventListener("resize", () => {
    showHeader();
    lastScrollY = window.scrollY;
  });
})();


/* ===========================
   Ano automático no footer
   =========================== */
(function () {
  const yearEl = document.querySelector("[data-year]");
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }
})();
