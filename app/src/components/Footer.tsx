
function IconRocket({ className }: { className?: string }) {
  return <svg className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"/><path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"/><path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"/><path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"/></svg>;
}
function IconGithub({ className }: { className?: string }) {
  return <svg className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.24c3-.34 6-1.53 6-6.36s-1.4-3.4-1.4-3.4a4.4 4.4 0 0 0-.09-3.41S17 2 12 5.5a11 11 0 0 0-4 0C3.5 2 2.5 2 2.5 2a4.4 4.4 0 0 0-.09 3.41S1 7.2 1 12c0 4.83 3 6 6 6.36a4.8 4.8 0 0 0-1 3.24v4"/><path d="M9 18c-4.51 2-5-2-7-2"/></svg>;
}
function IconLinkedin({ className }: { className?: string }) {
  return <svg className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/></svg>;
}


export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-background/95 py-12">
      <div className="container mx-auto px-4 flex flex-col items-center justify-center gap-4 text-center">
        
        <IconRocket className="w-8 h-8 text-muted-foreground/50 mb-2" />
        
        <p className="text-muted-foreground text-sm max-w-md">
          Desenvolvido com Next.js e energizado pelas APIs abertas da NASA. 
          Uma jornada de código através do cosmos.
        </p>

        {/* Links Sociais */}
        <div className="flex items-center gap-4 mt-4">
          <a 
            href="https://github.com/joaovitor8" 
            target="_blank" 
            rel="noreferrer"
            className="p-2 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-full transition-all hover:scale-110"
            aria-label="GitHub"
          >
            <IconGithub className="w-5 h-5" />
          </a>
          <a 
            href="https://linkedin.com/in/joaovitorezequiel" 
            target="_blank" 
            rel="noreferrer"
            className="p-2 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-full transition-all hover:scale-110"
            aria-label="LinkedIn"
          >
            <IconLinkedin className="w-5 h-5" />
          </a>
        </div>

        <p className="text-xs text-muted-foreground/60 mt-4">
          © {new Date().getFullYear()} Projeto Universo.
        </p>
        
      </div>
    </footer>
  );
}
