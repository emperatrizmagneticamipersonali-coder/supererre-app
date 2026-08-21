"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { IconMap, IconFlame, IconStairs, IconGiftBox, IconUser } from "./icons";

const ITEMS = [
  { href: "/app", label: "Mapa", Icon: IconMap },
  { href: "/app/racha", label: "Racha", Icon: IconFlame },
  { href: "/app/escalera", label: "Escalera", Icon: IconStairs },
  { href: "/app/premios", label: "Premios", Icon: IconGiftBox },
  { href: "/app/mama", label: "Mamá", Icon: IconUser },
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
            className="flex flex-col items-center gap-1 rounded-xl px-3 py-1 text-xs font-bold transition-colors"
          >
            <span
              className={`flex h-8 w-8 items-center justify-center rounded-full transition-colors ${
                active
                  ? "bg-brand-accent-soft text-brand-accent"
                  : "text-txt-tertiary"
              }`}
            >
              <item.Icon className="h-5 w-5" />
            </span>
            <span className={active ? "text-brand-accent" : "text-txt-tertiary"}>
              {item.label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
