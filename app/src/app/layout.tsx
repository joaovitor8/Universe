import type { Metadata } from "next";
import { Inter, Cinzel } from "next/font/google";
import "./globals.css";

import { Header } from "@/src/components/Header"
import { Footer } from "@/src/components/Footer"
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


export const metadata: Metadata = {
  title: "Universo | Explorando as APIs da NASA",
  description: "Uma jornada interativa pelos dados espaciais da NASA.",
};


export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR" className="dark">
      <body className={`${inter.variable} ${cinzel.variable} font-sans antialiased min-h-screen flex flex-col bg-background text-foreground`}>
        <Providers>
          <Stars className="fixed inset-0 -z-10" quantity={100} />
          <Header />
          <main className="grow pt-16">
            {children}
          </main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
