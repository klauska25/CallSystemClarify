// Fundo do design system: surface, dois brilhos nos cantos e linhas de relevo.
export function Background() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div className="absolute -left-40 -top-40 size-[560px] rounded-full bg-glow blur-[130px]" />
      <div className="absolute -bottom-48 -right-48 size-[620px] rounded-full bg-glow blur-[150px]" />
      <div
        className="absolute inset-0 bg-pattern-line"
        style={{
          maskImage: "url(/topografia/1.svg)",
          maskSize: "max(100%, 1600px, 160dvh) auto",
          maskPosition: "center",
          maskRepeat: "no-repeat",
        }}
      />
    </div>
  );
}
