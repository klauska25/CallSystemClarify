"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CHATBOT_URL } from "@/lib/links";
import { ThemeToggle } from "./ThemeToggle";

const links = [
  { href: "/", rotulo: "Produto" },
  { href: "/ponto", rotulo: "Ponto" },
  { href: "/painel", rotulo: "Painel" },
];

export function Header() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-20 px-2 pt-2 md:px-3 md:pt-3">
      <div className="glass mx-auto flex max-w-6xl flex-wrap items-center gap-x-4 gap-y-3 rounded-2xl px-4 py-3 md:flex-nowrap md:rounded-3xl md:px-5">
        <Link
          href="/"
          className="rounded-full font-display text-2xl font-bold tracking-tight text-fg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-line"
        >
          TimeTrack
        </Link>

        <nav aria-label="Principal" className="order-last w-full md:order-none md:w-auto md:flex-1">
          <ul className="flex gap-1 md:justify-center">
            {links.map(({ href, rotulo }) => {
              const ativo = pathname === href;
              return (
                <li key={href} className="flex-1 md:flex-none">
                  <Link
                    href={href}
                    aria-current={ativo ? "page" : undefined}
                    className={`flex h-9 items-center justify-center rounded-full px-4 text-sm font-semibold transition focus-visible:outline-2 focus-visible:outline-accent-line ${
                      ativo ? "neu-raised bg-neu text-fg" : "text-muted hover:bg-hover hover:text-fg"
                    }`}
                  >
                    {rotulo}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <ThemeToggle />
          <a
            href={CHATBOT_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="neu-raised flex h-9 items-center rounded-full bg-neu px-4 text-sm font-bold text-fg transition hover:-translate-y-px focus-visible:outline-2 focus-visible:outline-accent-line active:translate-y-0 active:neu-inset"
          >
            Ajuda
            <span className="sr-only"> (abre em nova aba)</span>
          </a>
        </div>
      </div>
    </header>
  );
}
