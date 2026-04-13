import { Rocket } from "lucide-react";


export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-background/95 py-12">
      <div className="container mx-auto px-4 flex flex-col items-center justify-center gap-4 text-center">
        <Rocket className="w-8 h-8 text-muted-foreground/50 mb-2" />
        <p className="text-muted-foreground text-sm max-w-md">
          Desenvolvido com Next.js e energizado pelas APIs abertas da NASA. 
          Uma jornada de código através do cosmos.
        </p>
        <p className="text-xs text-muted-foreground/60 mt-4">
          © {new Date().getFullYear()} Projeto Universo.
        </p>
      </div>
    </footer>
  );
}
