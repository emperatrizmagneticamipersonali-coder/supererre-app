type IconProps = { className?: string };

const base = "stroke-current fill-none";

export function IconMic({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <rect x="9" y="2" width="6" height="12" rx="3" className={base} />
      <path d="M5 11a7 7 0 0 0 14 0" className={base} />
      <path d="M12 18v4M8 22h8" className={base} />
    </svg>
  );
}

export function IconHeartCrack({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 21s-7.5-4.7-10-9.6C.4 7.7 2.3 4 6 4c2 0 3.4 1 4.5 2.4L12 8l1.5-1.6C14.6 5 16 4 18 4c3.7 0 5.6 3.7 4 7.4C19.5 16.3 12 21 12 21Z" className={base} />
    </svg>
  );
}

export function IconMirror({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="11" r="7" className={base} />
      <path d="M9 8c.5-1 1.7-1.5 3-1.5" className={base} />
      <path d="M9 21h6M12 18v3" className={base} />
    </svg>
  );
}

export function IconAlarmClock({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="13" r="7" className={base} />
      <path d="M12 9v4l2.5 1.5M5 4 3 6M19 4l2 2" className={base} />
    </svg>
  );
}

export function IconCoin({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="8" className={base} />
      <path d="M9.5 15.5c.5.7 1.4 1 2.5 1 1.7 0 3-.8 3-2s-1.3-1.7-3-2-3-.8-3-2 1.3-2 3-2c1.1 0 2 .3 2.5 1" className={base} />
      <path d="M12 6v1.5M12 16.5V18" className={base} />
    </svg>
  );
}

export function IconGraduation({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 9 12 4l10 5-10 5-10-5Z" className={base} />
      <path d="M6 11.5V17c0 1.2 2.7 3 6 3s6-1.8 6-3v-5.5" className={base} />
    </svg>
  );
}

export function IconShieldCheck({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3 4 6v6c0 5 3.4 7.7 8 9 4.6-1.3 8-4 8-9V6l-8-3Z" className={base} />
      <path d="m9 12 2 2 4-4" className={base} />
    </svg>
  );
}

export function IconCheck({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} strokeWidth={3} strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 12.5 9 17l11-11" className={base} />
    </svg>
  );
}

export function IconLock({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <rect x="5" y="11" width="14" height="9" rx="2" className={base} />
      <path d="M8 11V7a4 4 0 0 1 8 0v4" className={base} />
    </svg>
  );
}

export function IconChevronDown({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
      <path d="m6 9 6 6 6-6" className={base} />
    </svg>
  );
}

export function IconPlay({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="9" className={base} />
      <path d="M10 8.5 16 12l-6 3.5v-7Z" className="fill-current" />
    </svg>
  );
}

export function IconCompass({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="9" className={base} />
      <path d="m14.5 9.5-2 5-3 1.5 2-5 3-1.5Z" className={base} />
    </svg>
  );
}

export function IconSparkles({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2 2M16 16l2 2M18 6l-2 2M8 16l-2 2" className={base} />
    </svg>
  );
}

export function IconEye({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6-10-6-10-6Z" className={base} />
      <circle cx="12" cy="12" r="2.5" className={base} />
    </svg>
  );
}
