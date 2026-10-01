"use client";

import { useEffect, useRef } from "react";

// Bolinha que segue o ponteiro com um leve atraso, inspirada em itsoffbrand.com.
// Branca a 60% com mix-blend-mode difference: fica clara no tema escuro e escura no claro.
// Só existe com mouse (hover + ponteiro fino); no toque não aparece.

const FOLLOW_SECONDS = 0.1; // constante de tempo da suavização (~0,3 s para alcançar o ponteiro)
const HOVER_SCALE = 0.55;   // encolhe sobre o que é clicável
const MAX_DELTA = 0.1;
const INTERACTIVE = "a, button, [role='tab'], input, select, textarea, label, summary";

export function CursorDot() {
  const dotRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const dot = dotRef.current;
    if (!dot || !window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

    const target = { x: 0, y: 0, scale: 1 };
    const current = { x: 0, y: 0, scale: 1 };
    let frame = 0;
    let lastTimestamp: number | null = null;
    let visible = false;

    const render = () => {
      dot.style.transform = `translate3d(${current.x}px, ${current.y}px, 0) translate(-50%, -50%) scale(${current.scale})`;
    };

    // Suavização exponencial pelo tempo real do quadro: igual em 60 Hz ou 120 Hz.
    const tick = (timestamp: number) => {
      const dt = lastTimestamp === null ? 1 / 60 : Math.min((timestamp - lastTimestamp) / 1000, MAX_DELTA);
      lastTimestamp = timestamp;
      const k = reducedMotion.matches ? 1 : 1 - Math.exp(-dt / FOLLOW_SECONDS);
      current.x += (target.x - current.x) * k;
      current.y += (target.y - current.y) * k;
      current.scale += (target.scale - current.scale) * k;

      const settled =
        Math.abs(target.x - current.x) < 0.1 &&
        Math.abs(target.y - current.y) < 0.1 &&
        Math.abs(target.scale - current.scale) < 0.001;
      if (settled) {
        Object.assign(current, target);
        render();
        frame = 0;
        lastTimestamp = null;
        return; // parado, o laço dorme até o próximo movimento
      }
      render();
      frame = requestAnimationFrame(tick);
    };

    const wake = () => {
      if (!frame) frame = requestAnimationFrame(tick);
    };

    const show = (value: boolean) => {
      visible = value;
      dot.dataset.visible = String(value);
    };

    const onPointerMove = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return;
      target.x = event.clientX;
      target.y = event.clientY;
      if (!visible) {
        // Ao entrar na página, nasce sob o ponteiro em vez de voar do canto.
        current.x = target.x;
        current.y = target.y;
        render();
        show(true);
      }
      wake();
    };

    const onPointerOver = (event: PointerEvent) => {
      const element = event.target instanceof Element ? event.target : null;
      target.scale = element?.closest(INTERACTIVE) ? HOVER_SCALE : 1;
      wake();
    };

    const hide = () => show(false);

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    document.addEventListener("pointerover", onPointerOver, { passive: true });
    document.documentElement.addEventListener("mouseleave", hide);
    window.addEventListener("blur", hide);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("pointermove", onPointerMove);
      document.removeEventListener("pointerover", onPointerOver);
      document.documentElement.removeEventListener("mouseleave", hide);
      window.removeEventListener("blur", hide);
    };
  }, []);

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[2000] hidden mix-blend-difference [@media(hover:hover)_and_(pointer:fine)]:block"
    >
      <div
        ref={dotRef}
        data-cursor-dot
        data-visible="false"
        className="absolute left-0 top-0 size-8 rounded-full bg-cursor opacity-0 transition-opacity duration-200 will-change-transform data-[visible=true]:opacity-100"
      />
    </div>
  );
}
