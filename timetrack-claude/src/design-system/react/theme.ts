export type Theme = "light" | "dark";

export const THEME_STORAGE_KEY = "timetrack-theme";

// Roda no <head> antes da página aparecer, para não piscar o tema errado.
// Usa o tema salvo; se não houver, segue a preferência do sistema.
export const THEME_INIT_SCRIPT = `
(function () {
  try {
    var saved = localStorage.getItem("${THEME_STORAGE_KEY}");
    var theme = saved === "light" || saved === "dark"
      ? saved
      : (window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark");
    document.documentElement.dataset.theme = theme;
  } catch (e) {}
})();
`;
