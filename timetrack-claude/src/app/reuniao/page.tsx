import type { Metadata } from "next";
import { Taximetro } from "@/components/reuniao/Taximetro";

export const metadata: Metadata = { title: "Taxímetro de reunião" };

export default function ReuniaoPage() {
  return (
    <main className="mx-auto w-full max-w-6xl px-2 pt-4 md:px-3 md:pt-8">
      <Taximetro />
    </main>
  );
}
