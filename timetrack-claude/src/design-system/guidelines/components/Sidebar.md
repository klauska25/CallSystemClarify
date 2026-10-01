# Sidebar

Painel de vidro com a marca, o botão Nova conversa, a busca, a lista de conversas e a conta. No celular vira gaveta.

**Origem:** `src/components/chat/Sidebar.tsx`.

## O que você fornece
- `conversations` (já ordenadas pela última atividade), `activeConversationId`, `now`, `isOpen`, `onSelect`, `onNewConversation`, `onClose`.

## Estrutura, de cima para baixo
1. Marca: "TimeTrack" em `wordmark` e "SUPORTE" em `eyebrow` `muted`, alinhados pela linha de base, intervalo `space-2.5`. Não há logotipo: a marca é só tipografia.
2. Botão **Nova conversa**: pílula `neu-raised`, `body-sm-bold`, com círculo `brand` + `glow-brand` e ícone `plus`. Se já existe uma conversa vazia, ela é reaproveitada.
3. SearchField, a `space-3.5` do botão.
4. Rótulo "CONVERSAS" em `section-label` (mono 11px, 0.2em, maiúsculas).
5. Lista de ConversationListItem com rolagem própria.
6. AccountFooter.

## Regras
- Desktop (768px+): `glass`, 300px (`size-sidebar`), `radius-3xl`, ao lado do chat com intervalo `space-3`.
- Celular: gaveta fixa de 320px (até 85vw), `glass-strong` para legibilidade, `radius-3xl` só à direita, entrando da esquerda em 300ms `ease-out`. Atrás dela, `overlay`; tocar no fundo ou apertar Esc fecha.
- Gaveta fechada fica `invisible` para sair da ordem do teclado.
