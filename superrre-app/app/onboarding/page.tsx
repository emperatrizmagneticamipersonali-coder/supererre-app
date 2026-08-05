import Link from "next/link";

export default function OnboardingPage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center text-center px-6 bg-surface-base">
      <span className="text-6xl mb-5">🦁</span>
      <h1 className="font-display font-extrabold text-2xl text-txt-primary">
        Estamos construyendo esta parte
      </h1>
      <p className="mt-3 text-txt-secondary max-w-sm">
        El onboarding de SuperErre llega en la próxima sesión de
        construcción. Por ahora, vuelve a la página principal.
      </p>
      <Link
        href="/"
        className="mt-6 inline-flex rounded-full bg-brand-primary text-txt-on-brand font-display font-bold px-6 py-3"
      >
        Volver al inicio
      </Link>
    </main>
  );
}
