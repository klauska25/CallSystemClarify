"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { TopographyRenderer } from "@/lib/topography-renderer";

// Linhas de relevo que ondulam devagar. Cada tela tem o seu desenho (o id é a rota).
// Sem WebGL 2, mostra a máscara estática do design system.
export function LiveTopography() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<TopographyRenderer | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper) return;

    // O canvas nasce aqui: um contexto WebGL perdido não pode ser reaproveitado.
    const canvas = document.createElement("canvas");
    canvas.className = "absolute inset-0 size-full text-pattern-line";
    wrapper.append(canvas);

    const renderer = TopographyRenderer.create(canvas);
    if (!renderer) {
      canvas.remove();
      wrapper.dataset.fallback = "true";
      return;
    }
    rendererRef.current = renderer;

    return () => {
      renderer.destroy();
      rendererRef.current = null;
      canvas.remove();
    };
  }, []);

  useEffect(() => {
    rendererRef.current?.setScene(pathname, true);
  }, [pathname]);

  return (
    <div ref={wrapperRef} data-topography className="group absolute inset-0">
      <div
        className="absolute inset-0 bg-pattern-line opacity-0 group-data-[fallback=true]:opacity-100"
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
