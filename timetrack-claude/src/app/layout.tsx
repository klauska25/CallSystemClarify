import type { Metadata } from "next";
import { IBM_Plex_Mono, Manrope, Outfit } from "next/font/google";
import { Background } from "@/components/Background";
import { CursorDot } from "@/components/CursorDot";
import { Header } from "@/components/Header";
import { THEME_INIT_SCRIPT } from "@/design-system/react/theme";
import "./globals.css";

const manrope = Manrope({ variable: "--font-manrope", subsets: ["latin"] });
const outfit = Outfit({ variable: "--font-outfit", subsets: ["latin"] });
const plexMono = IBM_Plex_Mono({
  variable: "--font-plex-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: { default: "TimeTrack", template: "%s · TimeTrack" },
  description: "Ponto eletrônico para empresas. O funcionário bate o ponto e o RH acompanha as horas.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="pt-BR"
      data-theme="dark"
      suppressHydrationWarning
      className={`${manrope.variable} ${outfit.variable} ${plexMono.variable} h-full antialiased`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
      </head>
      <body className="isolate flex min-h-full flex-col font-sans">
        <Background />
        <Header />
        <div className="flex flex-1 flex-col">{children}</div>
        <footer className="mx-auto w-full max-w-6xl px-4 pb-6 pt-10 font-mono text-xs text-muted md:px-8">
          TimeTrack · Sistema fictício para fins de estudo.
        </footer>
        <CursorDot />
      </body>
    </html>
  );
}
