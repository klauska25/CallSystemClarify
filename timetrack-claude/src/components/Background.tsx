import { LiveTopography } from "./LiveTopography";

// Fundo do design system: surface, dois brilhos nos cantos e linhas de relevo ao vivo.
export function Background() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div className="absolute -left-40 -top-40 size-[560px] rounded-full bg-glow blur-[130px]" />
      <div className="absolute -bottom-48 -right-48 size-[620px] rounded-full bg-glow blur-[150px]" />
      <LiveTopography />
    </div>
  );
}
