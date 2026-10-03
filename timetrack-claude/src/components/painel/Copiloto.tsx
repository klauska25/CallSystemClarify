"use client";

import { useId, useRef, useState } from "react";
import { Etiqueta } from "@/components/Etiqueta";
import { ACOES, type Sugestao } from "@/lib/copiloto";
import type { Chamado } from "@/lib/dados";

// Copiloto do atendente: pede à IA um diagnóstico, a próxima ação e uma resposta pronta para o chamado.

type Estado =
  | { fase: "fechado" }
  | { fase: "carregando" }
  | { fase: "erro" }
  | { fase: "pronto"; sugestao: Sugestao; resposta: string };

const botaoLeve =
  "rounded-full px-3 py-1.5 text-xs font-semibold text-muted transition hover:bg-hover hover:text-fg focus-visible:outline-2 focus-visible:outline-accent-line disabled:cursor-not-allowed disabled:opacity-50";

export function Copiloto({ chamado }: { chamado: Chamado }) {
  const [estado, setEstado] = useState<Estado>({ fase: "fechado" });
  const [aviso, setAviso] = useState("");
  const campo = useRef<HTMLTextAreaElement>(null);
  const idResposta = useId();

  async function pedir() {
    setEstado({ fase: "carregando" });
    setAviso("");
    try {
      const resposta = await fetch("/api/copiloto", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(chamado),
      });
      if (!resposta.ok) throw new Error(String(resposta.status));
      const sugestao = (await resposta.json()) as Sugestao;
      setEstado({ fase: "pronto", sugestao, resposta: sugestao.resposta });
    } catch {
      setEstado({ fase: "erro" });
    }
  }

  async function copiar(texto: string) {
    try {
      await navigator.clipboard.writeText(texto);
    } catch {
      // Sem permissão da área de transferência: seleciona o texto e usa o atalho antigo.
      campo.current?.select();
      document.execCommand("copy");
    }
    setAviso("Resposta copiada.");
  }

  if (estado.fase === "fechado") {
    return (
      <button
        type="button"
        onClick={pedir}
        className="neu-raised mt-4 inline-flex h-9 items-center gap-2 rounded-full bg-neu px-4 text-sm font-bold text-fg transition hover:-translate-y-px focus-visible:outline-2 focus-visible:outline-accent-line active:translate-y-0 active:neu-inset"
      >
        <IconeFaisca />
        Pedir ajuda à IA
      </button>
    );
  }

  return (
    <div className="neu-inset mt-4 rounded-2xl bg-neu p-4 md:p-5" aria-busy={estado.fase === "carregando"}>
      <div className="flex items-center justify-between gap-3">
        <p className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.2em] text-muted">
          <IconeFaisca />
          Copiloto
        </p>
        <button type="button" onClick={() => setEstado({ fase: "fechado" })} className={botaoLeve}>
          Fechar
        </button>
      </div>

      {estado.fase === "carregando" && (
        <p role="status" className="mt-4 flex items-center gap-3 text-sm text-muted">
          <span className="flex gap-1" aria-hidden="true">
            {[0, 150, 300].map((atraso) => (
              <span
                key={atraso}
                className="size-1.5 animate-bounce rounded-full bg-typing-dot motion-reduce:animate-none"
                style={{ animationDelay: `${atraso}ms` }}
              />
            ))}
          </span>
          Lendo o chamado, a conta do cliente e o status do sistema…
        </p>
      )}

      {estado.fase === "erro" && (
        <div role="alert" className="mt-4 flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-fg">Não consegui falar com o copiloto agora.</p>
          <button type="button" onClick={pedir} className={botaoLeve}>
            Tentar de novo
          </button>
        </div>
      )}

      {estado.fase === "pronto" && (
        <div className="mt-4 space-y-5">
          <section>
            <h4 className="text-sm font-bold text-fg">Diagnóstico</h4>
            <p className="mt-1 text-sm leading-relaxed text-fg">{estado.sugestao.diagnostico}</p>
          </section>

          <section>
            <h4 className="text-sm font-bold text-fg">Próxima ação</h4>
            <div className="mt-2 flex flex-col items-start gap-2 sm:flex-row sm:items-center">
              <Etiqueta {...ACOES[estado.sugestao.acao]} />
              <p className="text-sm text-muted">{estado.sugestao.motivoAcao}</p>
            </div>
          </section>

          <section>
            <label htmlFor={idResposta} className="text-sm font-bold text-fg">
              Resposta para o cliente
            </label>
            <p className="text-xs text-muted">Revise e edite antes de enviar.</p>
            <textarea
              id={idResposta}
              ref={campo}
              value={estado.resposta}
              onChange={(e) => setEstado({ ...estado, resposta: e.target.value })}
              rows={7}
              className="glass-soft mt-2 w-full resize-y rounded-2xl px-4 py-3 text-[15px] leading-relaxed text-fg outline-none focus:border-accent-line/60"
            />
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => copiar(estado.resposta)}
                className="glow-brand h-10 rounded-full bg-brand px-5 text-sm font-bold text-ink transition hover:bg-brand-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-line active:scale-[0.98]"
              >
                Copiar resposta
              </button>
              <button type="button" onClick={pedir} className={botaoLeve}>
                Gerar de novo
              </button>
              <p role="status" className="text-sm font-semibold text-fg">
                {aviso}
              </p>
            </div>
          </section>

          <p className="font-mono text-xs text-muted">
            {estado.sugestao.origem === "gemini"
              ? `Gerado pelo Gemini (${estado.sugestao.modelo}).`
              : "Gerado por regras: o Gemini não respondeu agora."}
          </p>
        </div>
      )}
    </div>
  );
}

// Faísca no traço do design system: grade de 24px, linha de 2px, pontas redondas.
function IconeFaisca() {
  return (
    <svg className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 3v4M12 17v4M3 12h4M17 12h4M6.5 6.5l2 2M15.5 15.5l2 2M6.5 17.5l2-2M15.5 8.5l2-2" />
    </svg>
  );
}
