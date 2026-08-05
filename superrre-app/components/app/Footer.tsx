import Link from "next/link";

export function Footer() {
  return (
    <footer className="mt-auto border-t border-border-default py-10">
      <div className="mx-auto max-w-5xl px-5 sm:px-8 flex flex-col sm:flex-row items-center justify-between gap-5">
        <div className="flex items-center gap-2">
          <span className="text-xl">🦁</span>
          <span className="font-display font-bold text-txt-primary">
            SuperErre
          </span>
        </div>
        <nav className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-txt-secondary">
          <Link href="/privacidad" className="hover:text-txt-primary transition-colors">
            Privacidad
          </Link>
          <Link href="/terminos" className="hover:text-txt-primary transition-colors">
            Términos
          </Link>
          <Link href="/reembolso" className="hover:text-txt-primary transition-colors">
            Reembolso
          </Link>
          <a
            href="mailto:hola@supererre.app"
            className="hover:text-txt-primary transition-colors"
          >
            hola@supererre.app
          </a>
        </nav>
      </div>
      <p className="text-center text-xs text-txt-tertiary mt-6">
        © {new Date().getFullYear()} SuperErre. SuperErre no reemplaza la
        evaluación de un fonoaudiólogo. El audio y video de tu hijo se
        procesan siempre en el dispositivo.
      </p>
    </footer>
  );
}
