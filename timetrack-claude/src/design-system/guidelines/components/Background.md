# Background

O fundo do app: a cor `surface`, dois brilhos verdes difusos nos cantos e linhas de relevo topográfico. É o que dá sentido ao vidro fosco dos painéis.

**Origem:** `src/components/chat/AmbientGlow.tsx`, `LiveTopography.tsx`, `BackgroundTopography.tsx`, `src/lib/topography-renderer.ts`, `src/lib/topography.ts`, `scripts/generate-topography.mjs`.

## Camadas, de trás para frente
1. `surface` no contêiner (com `isolation: isolate`, para o fundo em `z-index: -1` ficar atrás dos painéis e na frente da cor da página).
2. **Brilhos:** dois círculos `glow`, 560px com blur de 130px no canto superior esquerdo e 620px com blur de 150px no inferior direito.
3. **Relevo:** linhas `pattern-line`. Desenhadas ao vivo em WebGL 2 (o canvas lê a cor de `color`); sem WebGL 2, uma das oito máscaras de `assets/Topography` pinta as linhas.
4. Painéis `glass` e `glass-soft` por cima.

## Regras
- Cada conversa tem sempre o mesmo desenho: o id passa por um hash djb2 e escolhe entre 8 variantes.
- Na conversa vazia as linhas ondulam devagar; com mensagens, ficam paradas. Ao trocar de desenho, entram com `fade-in` de 450ms `ease-out`, só sem `prefers-reduced-motion`.
- A máscara é desenhada em 1600px de largura (`max(100%, 1600px, 160dvh) auto`) para as curvas não encolherem em telas pequenas.
- O fundo é decorativo: `aria-hidden`, `pointer-events: none`.
- Esta prévia é estática: mostra a máscara 1, não o desenho ao vivo.
