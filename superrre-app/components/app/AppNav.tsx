"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const ITEMS = [
  { href: "/app", label: "Mapa", emoji: "🗺️" },
  { href: "/app/racha", label: "Racha", emoji: "🔥" },
  { href: "/app/escalera", label: "Escalera", emoji: "🪜" },
  { href: "/app/premios", label: "Premios", emoji: "🎈" },
  { href: "/app/mama", label: "Mamá", emoji: "👤" },
] as const;

export function AppNav() {
  const pathname = usePathname();
  return (
    <nav className="sticky bottom-0 flex justify-around items-center bg-surface-primary border-t border-border-default px-2 py-2 pb-[max(8px,env(safe-area-inset-bottom))]">
      {ITEMS.map((item) => {
        const active =
          item.href === "/app"
            ? pathname === "/app"
            : pathname.startsWith(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex flex-col items-center gap-1 rounded-xl px-4 py-1 text-xs font-bold transition-colors ${
              active ? "text-brand-accent" : "text-txt-tertiary"
            }`}
          >
            <span className="text-xl" aria-hidden="true">
              {item.emoji}
            </span>
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
