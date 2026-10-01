# ConversationListItem

Linha clicável da lista de conversas: contato, tempo desde a última atividade, prévia e categoria.

**Origem:** `src/components/chat/ConversationListItem.tsx`.

## O que você fornece
- `conversation`, `isActive`, `now` (hora atual ou `null` no servidor) e `onSelect(id)`.

## Regras
- Item ativo: `neu` + `neu-raised`, marcado com `aria-current="true"`. Os outros são transparentes e ganham `hover` no hover.
- `radius-2xl`, padding `space-3.5`, intervalo `space-1.5` entre itens.
- Contato em `body-sm-bold` `fg`; tempo relativo em `timestamp` (mono 12px, `muted`); prévia em `body-sm` `muted`, uma linha com reticências.
- Conversa vazia mostra "Conversa sem mensagens".
- Etiqueta CategoryBadge a `space-2.5` abaixo da prévia, só quando há categoria.
- O tempo só é escrito no navegador (`now !== null`), para o HTML do servidor bater com o do cliente.
