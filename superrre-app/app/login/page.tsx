import Link from "next/link";

export default function LoginPage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center text-center px-6 bg-surface-base">
      <span className="text-6xl mb-5">🦁</span>
      <h1 className="font-display font-extrabold text-2xl text-txt-primary">
        El inicio de sesión llega pronto
      </h1>
      <p className="mt-3 text-txt-secondary max-w-sm">
        Estamos construyendo el login de los papás. Mientras tanto, prueba
        el Espejo del León gratis.
      </p>
      <Link
        href="/onboarding"
        className="mt-6 inline-flex rounded-full bg-brand-primary text-txt-on-brand font-display font-bold px-6 py-3"
      >
        Probar gratis
      </Link>
    </main>
  );
}
