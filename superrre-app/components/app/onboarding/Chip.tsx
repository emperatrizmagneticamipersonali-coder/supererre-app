"use client";

import type { CSSProperties } from "react";
import { IconCheck } from "../icons";

export function Chip({
  label,
  selected,
  onClick,
  style,
}: {
  label: string;
  selected: boolean;
  onClick: () => void;
  style?: CSSProperties;
}) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center justify-between rounded-2xl px-5 py-4 text-left text-base font-semibold transition-colors active:scale-[0.98] animate-fade-up ${
        selected
          ? "border-2 border-brand-primary bg-brand-primary-soft text-txt-on-primary-soft"
          : "border border-border-default bg-surface-primary text-txt-primary"
      }`}
      style={style}
    >
      {label}
      {selected && (
        <IconCheck className="h-5 w-5 text-brand-primary shrink-0 animate-pop-in" />
      )}
    </button>
  );
}
