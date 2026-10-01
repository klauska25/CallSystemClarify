# ChatHeader

Barra de vidro no topo do chat com o título da conversa, a categoria e o botão de tema.

**Origem:** `src/components/chat/ChatHeader.tsx`.

## O que você fornece
- `title`, `category` (opcional), `isMenuOpen` e `onOpenMenu`.

## Regras
- `glass`; altura `size-header` (56px) e `radius-2xl` no celular, 64px e `radius-3xl` a partir de 768px.
- Padding horizontal `space-4` no celular e `space-6` no desktop; intervalo `space-3`.
- Título em `heading-chat` (Outfit 18px, 500), uma linha com reticências. Conversa nova se chama "Nova conversa" até a primeira mensagem, que vira o título (até 48 caracteres).
- No celular, à esquerda, um botão de ícone `menu` abre a gaveta (`aria-controls` aponta para a barra lateral, `aria-expanded` acompanha o estado).
- ThemeToggle fica sempre na ponta direita.
