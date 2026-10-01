import type { Metadata } from "next";
import { Painel } from "@/components/painel/Painel";
import { chamados, statusSistema, usuarios } from "@/lib/dados";

export const metadata: Metadata = { title: "Painel" };

export default function PainelPage() {
  return (
    <main className="mx-auto w-full max-w-6xl px-2 pt-4 md:px-3 md:pt-8">
      <Painel usuarios={usuarios} chamados={chamados} status={statusSistema} />
    </main>
  );
}
