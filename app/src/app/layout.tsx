import type { Metadata } from "next";
import { Inter, Cinzel, JetBrains_Mono } from "next/font/google";
import "./globals.css";

import { Header } from "@/src/components/Header";
import { Footer } from "@/src/components/Footer";
import { SystemStatusBar } from "@/src/components/SystemStatusBar";
import Stars from "../components/Stars";
import { Providers } from "@/src/components/Providers";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const cinzel = Cinzel({
  variable: "--font-cinzel",
  subsets: ["latin"],
});

const mono = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Universo | Sistema Operacional do Cosmos",
  description:
    "Plataforma imersiva de exploração espacial. Telemetria, defesa planetária, cartografia e arquivos da NASA em uma única console.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR" className="dark">
      <body
        className={`${inter.variable} ${cinzel.variable} ${mono.variable} font-sans antialiased min-h-screen flex flex-col bg-background text-foreground bg-vignette`}
      >
        <Providers>
          {/* Camada decorativa de fundo */}
          <div aria-hidden className="fixed inset-0 -z-10 bg-grid pointer-events-none opacity-60" />
          <Stars className="fixed inset-0 -z-10" quantity={150} />

          <SystemStatusBar />
          <Header />
          <main className="grow pt-22">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
