"use client";

import { useSyncExternalStore } from "react";
import { MoonIcon, SunIcon } from "@/design-system/react/icons";
import { THEME_STORAGE_KEY, type Theme } from "@/design-system/react/theme";

// O tema vive no data-theme do <html>; observamos o atributo para reagir a mudanças.
function subscribe(onChange: () => void) {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
  return () => observer.disconnect();
}

const getTheme = () => (document.documentElement.dataset.theme === "light" ? "light" : "dark") as Theme;

export function ThemeToggle() {
  // No servidor o tema é desconhecido: o ícone só aparece no navegador.
  const theme = useSyncExternalStore(subscribe, getTheme, () => null);
  const label = theme === "light" ? "Ativar tema escuro" : "Ativar tema claro";

  function toggle() {
    const next: Theme = getTheme() === "light" ? "dark" : "light";
    document.documentElement.dataset.theme = next;
    try {
      localStorage.setItem(THEME_STORAGE_KEY, next);
    } catch {}
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={label}
      title={label}
      className="neu-raised grid size-9 shrink-0 place-items-center rounded-full bg-neu text-muted transition hover:-translate-y-px hover:text-fg focus-visible:outline-2 focus-visible:outline-accent-line active:translate-y-0 active:neu-inset"
    >
      {theme === "light" && <MoonIcon className="size-[18px]" />}
      {theme === "dark" && <SunIcon className="size-[18px]" />}
    </button>
  );
}
