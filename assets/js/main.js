/* ===========================
   Include de HTML (header/footer)
   =========================== */
async function loadIncludes() {
  const includes = document.querySelectorAll("[data-include]");
  if (!includes.length) return;

  await Promise.all(
    Array.from(includes).map(async (el) => {
      const file = el.getAttribute("data-include");
      try {
        const res = await fetch(file, { cache: "no-store" });
        if (!res.ok) throw new Error(`HTTP ${res.status} ao buscar ${file}`);
        const html = await res.text();
        el.outerHTML = html;
      } catch (err) {
        console.error("Include falhou:", err);
      }
    })
  );
}

/* ===========================
   Menu mobile (abre / fecha)
   (precisa rodar após include)
   =========================== */
function initMobileMenu() {
  const btn = document.querySelector("[data-nav-btn]");
  const menu = document.querySelector("[data-nav-menu]");
  if (!btn || !menu) return;

  btn.addEventListener("click", () => {
    const isOpen = menu.getAttribute("data-open") === "true";
    menu.setAttribute("data-open", String(!isOpen));
    btn.setAttribute("aria-expanded", String(!isOpen));
  });

  // Fecha ao clicar em um link
  menu.querySelectorAll("a").forEach((a) => {
    a.addEventListener("click", () => {
      menu.setAttribute("data-open", "false");
      btn.setAttribute("aria-expanded", "false");
    });
  });
}

/* ===========================
   Header: some ao descer, volta ao subir
   =========================== */
function initScrollHeader() {
  const header = document.querySelector(".header");
  if (!header) return;

  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)");
  let lastScrollY = window.scrollY;
  let ticking = false;

  const MIN_DELTA = 6;
  const TOP_SAFE = 8;

  function showHeader() {
    header.classList.remove("header--hide");
  }

  function hideHeader() {
    const menu = document.querySelector("[data-nav-menu]");
    if (menu && menu.getAttribute("data-open") === "true") return;
    header.classList.add("header--hide");
  }

  function closeMenuIfOpen() {
    const menu = document.querySelector("[data-nav-menu]");
    const btn = document.querySelector("[data-nav-btn]");
    if (!menu || !btn) return;

    if (menu.getAttribute("data-open") === "true") {
      menu.setAttribute("data-open", "false");
      btn.setAttribute("aria-expanded", "false");
    }
  }

  function onScroll() {
    const currentY = window.scrollY;

    if (currentY <= TOP_SAFE) {
      showHeader();
      lastScrollY = currentY;
      return;
    }

    const delta = currentY - lastScrollY;
    if (Math.abs(delta) < MIN_DELTA) return;

    if (delta > 0) {
      hideHeader();
      closeMenuIfOpen();
    } else {
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

  window.addEventListener("resize", () => {
    showHeader();
    lastScrollY = window.scrollY;
  });
}

/* ===========================
   Ano automático no footer
   =========================== */
function initYear() {
  const yearEl = document.querySelector("[data-year]");
  if (yearEl) yearEl.textContent = new Date().getFullYear();
}

/* ===========================
   Lazy loading de anúncios
   =========================== */
function initAdsLazy() {
  const ads = document.querySelectorAll("[data-ad]");
  if (!("IntersectionObserver" in window) || !ads.length) return;

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        const ad = entry.target;
        ad.classList.add("ad--loaded");

        // Placeholder (trocar pelo AdSense depois)
        ad.innerHTML = `
          <span class="ad__label">Publicidade</span>
          <div style="font-size:13px;color:#9ca3af;">
            Anúncio carregado
          </div>
        `;

        obs.unobserve(ad);
      });
    },
    { rootMargin: "200px", threshold: 0.1 }
  );

  ads.forEach((ad) => observer.observe(ad));
}

/* ===========================
   Boot
   =========================== */
(async function boot() {
  await loadIncludes();     // 1) injeta o header
  initMobileMenu();         // 2) agora os botões existem
  initScrollHeader();       // 3) header hide/show
  initYear();               // 4) ano
  initAdsLazy();            // 5) ads lazy
})();
