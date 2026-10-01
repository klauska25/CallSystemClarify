# TimeTrack Suporte: design system

Tokens, estilos, ícones e diretrizes extraídos do ChatbotClarify (klauska25/ChatbotClarify).
Versão online, com prévias: https://claude.ai/artifact/XuakFhyMNB7xaQwyGL1PQ6

## O que tem aqui

| Pasta | Para que serve |
| --- | --- |
| `tailwind/timetrack.css` | Tema pronto para projetos com **Tailwind CSS 4** (classes `bg-brand`, `text-muted`, `glass`, `neu-raised`...). |
| `css/tokens.css` | As mesmas variáveis em CSS puro, para projetos **sem Tailwind**. |
| `css/components.css` | Estilos dos componentes em CSS puro (classes `tt-`), usando `tokens.css`. |
| `tokens.json` | Todos os valores em JSON, para scripts ou outras ferramentas. |
| `icons/` | Os 8 ícones em SVG (`currentColor`: herdam a cor do texto). |
| `react/icons.tsx` | Os mesmos ícones como componentes React. |
| `react/theme.ts` | Script que aplica o tema salvo antes da página aparecer. |
| `topography/` | As 8 máscaras de relevo do fundo. |
| `guidelines/` | O guia da marca e as regras de cada componente. |

## Projeto com Next.js + Tailwind 4

1. Copie a pasta `timetrack-design-system/` para dentro do projeto (por exemplo, em `src/design-system/`).
2. No CSS global (`src/app/globals.css`):

   ```css
   @import "tailwindcss";
   @import "../design-system/tailwind/timetrack.css";
   ```

3. Carregue as fontes em `src/app/layout.tsx`. O tema espera os nomes `Manrope`, `Outfit` e `IBM Plex Mono`:

   ```tsx
   import { IBM_Plex_Mono, Manrope, Outfit } from "next/font/google";

   const manrope = Manrope({ subsets: ["latin"] });
   const outfit = Outfit({ subsets: ["latin"] });
   const plexMono = IBM_Plex_Mono({ subsets: ["latin"], weight: ["400", "500"] });
   ```

   O jeito mais simples de garantir os nomes é usar o `<link>` do Google Fonts (passo seguinte) em vez de `next/font`.
   Se preferir `next/font`, troque em `timetrack.css` os nomes das famílias pelas variáveis que ele cria
   (como faz o ChatbotClarify: `var(--font-manrope)`).

4. Tema claro e escuro: coloque `data-theme="dark"` ou `"light"` no `<html>`. Para lembrar a escolha e não piscar,
   copie `react/theme.ts` e rode `THEME_INIT_SCRIPT` no `<head>`, como no `layout.tsx` do ChatbotClarify.

5. Use as classes:

   ```tsx
   <button className="glow-brand rounded-full bg-brand px-6 h-11 text-sm font-bold text-ink hover:bg-brand-hover">
     Enviar
   </button>
   <div className="glass rounded-3xl p-3">...</div>
   <span className="rounded-full bg-category-dados-bg px-3 py-0.5 text-xs font-medium text-category-dados-fg">Dados</span>
   ```

## Projeto sem Tailwind (HTML, Vite, qualquer outro)

```html
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700&family=Outfit:wght@500;600;700&family=IBM+Plex+Mono:wght@400;500&display=swap">
<link rel="stylesheet" href="timetrack-design-system/css/tokens.css">
<link rel="stylesheet" href="timetrack-design-system/css/components.css">

<html data-theme="dark">
  <button class="tt-send">Enviar</button>
  <span class="tt-badge tt-badge--acesso">Acesso</span>
  <div class="glass" style="border-radius: var(--radius-3xl)">...</div>
</html>
```

Nas variáveis, o ponto do nome precisa de barra: `var(--space-1\.5)`.

## Usando com o Claude em outro projeto

Coloque a pasta no repositório e adicione ao `CLAUDE.md` do projeto:

```md
## Design
Siga o design system em `src/design-system/`: leia `guidelines/brand-book.md` antes de mexer na interface
e use só os tokens de `tailwind/timetrack.css`. Regras de cada componente em `guidelines/components/`.
```

## Regras que não podem faltar

- Textos da interface em português do Brasil, sem emojis e sem travessões.
- Verde `brand` só no que é da pessoa (balão dela) e na ação principal; texto sobre ele sempre `ink`.
- Vidro (`glass`, `glass-soft`) para painéis; relevo (`neu-raised`, `neu-inset`) para controles dentro deles.
- Detalhes completos em `guidelines/brand-book.md`.
