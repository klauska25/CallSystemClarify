# AccountFooter

Bloco em relevo no pé da barra lateral com o avatar, o nome de quem usa o chat e o acesso às configurações.

**Origem:** `src/components/chat/AccountFooter.tsx`, `src/lib/current-user.ts`.

## O que você fornece
- Nada por props: lê `CURRENT_USER`. As iniciais vêm de `getInitials(nome)`.

## Regras
- `neu` + `neu-raised`, `radius-2xl`, padding `space-3` × `space-3.5`, margem `space-3` dentro da barra.
- Avatar `size-avatar` (40px), círculo com `brand` a 15% e borda `accent-line` a 40%; iniciais em `initials` (Outfit 14px, 600), `brand-dark` no claro e `brand` no escuro. No claro o par fica em 4.3:1.
- Nome em `body-sm-bold`; "Minha conta" em `timestamp` (mono 12px, `muted`).
- Botão de ícone `settings` de `size-icon-button`, rotulado "Configurações da conta". A tela de configurações ainda não existe.
