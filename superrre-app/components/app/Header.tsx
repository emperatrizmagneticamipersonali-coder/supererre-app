import Link from "next/link";

export function Header() {
  return (
    <header className="sticky top-0 z-40 bg-surface-base/90 backdrop-blur-sm border-b border-border-default">
      <div className="mx-auto max-w-6xl px-5 sm:px-8 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-2xl">🦁</span>
          <span className="font-display font-extrabold text-lg text-txt-primary">
            SuperErre
          </span>
        </Link>
        <Link
          href="/login"
          className="text-sm font-semibold text-txt-secondary hover:text-txt-primary transition-colors"
        >
          Entrar
        </Link>
      </div>
    </header>
  );
}
