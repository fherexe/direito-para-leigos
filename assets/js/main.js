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
