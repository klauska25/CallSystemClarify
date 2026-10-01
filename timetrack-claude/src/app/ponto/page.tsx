import type { Metadata } from "next";
import { BaterPonto } from "@/components/ponto/BaterPonto";
import { usuarios } from "@/lib/dados";

export const metadata: Metadata = { title: "Ponto" };

// Funcionário de exemplo: João, da Empresa Modelo.
const funcionario = usuarios.find((u) => u.email === "joao@empresa.com")!;

export default function PontoPage() {
  return (
    <main className="mx-auto w-full max-w-6xl px-2 pt-4 md:px-3 md:pt-8">
      <BaterPonto funcionario={funcionario} />
    </main>
  );
}
