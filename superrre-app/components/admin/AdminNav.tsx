"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

const ITEMS = [
  { href: "/admin", label: "Resumen" },
  { href: "/admin/usuarios", label: "Usuarios" },
  { href: "/admin/uso", label: "Uso" },
  { href: "/admin/errores", label: "Errores" },
  { href: "/admin/ventas", label: "Ventas" },
  { href: "/admin/negocio", label: "Negocio" },
] as const;

export function AdminNav({ email }: { email: string }) {
  const pathname = usePathname();
  const router = useRouter();

  async function salir() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <nav className="border-b border-border-default bg-surface-primary">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="flex items-center justify-between py-3">
          <span className="font-display font-extrabold text-lg text-txt-primary">
            SuperErre · Admin
          </span>
          <div className="hidden sm:flex items-center gap-3">
            <span className="text-xs text-txt-tertiary">{email}</span>
            <button
              onClick={salir}
              className="text-xs font-semibold text-txt-secondary underline underline-offset-2"
            >
              Salir
            </button>
          </div>
        </div>
        <div className="flex gap-1 overflow-x-auto pb-2 -mx-1 px-1">
          {ITEMS.map((item) => {
            const activo =
              item.href === "/admin"
                ? pathname === "/admin"
                : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`shrink-0 rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
                  activo
                    ? "bg-brand-primary-soft text-txt-on-primary-soft"
                    : "text-txt-secondary hover:bg-surface-secondary"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
