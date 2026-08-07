import Link from "next/link";
import { IconChevronLeft } from "../icons";

export function FunnelHeader({
  progress,
  onBack,
}: {
  progress?: number;
  onBack?: () => void;
}) {
  return (
    <div className="flex items-center gap-4 px-4 pt-4">
      {onBack ? (
        <button
          onClick={onBack}
          aria-label="Atrás"
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-txt-secondary hover:bg-surface-secondary transition-colors -ml-2"
        >
          <IconChevronLeft className="h-6 w-6" />
        </button>
      ) : (
        <Link
          href="/"
          className="flex h-11 w-11 shrink-0 items-center justify-center text-2xl -ml-2"
          aria-label="Ir al inicio"
        >
          🦁
        </Link>
      )}
      {typeof progress === "number" ? (
        <div className="flex-1 h-2 rounded-full bg-surface-tertiary overflow-hidden">
          <div
            className="h-full rounded-full bg-brand-primary transition-[width] duration-300 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      ) : (
        <span className="font-display font-bold text-sm text-txt-primary">
          SuperErre
        </span>
      )}
    </div>
  );
}
