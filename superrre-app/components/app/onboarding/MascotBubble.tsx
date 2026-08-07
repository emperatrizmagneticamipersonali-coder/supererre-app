export function MascotBubble({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-3">
      <span className="text-5xl shrink-0 animate-float-slow" aria-hidden="true">
        🦁
      </span>
      <div className="relative flex-1 rounded-2xl rounded-tl-sm bg-surface-secondary px-5 py-4 mt-1">
        <h1 className="font-display font-extrabold text-2xl text-txt-primary leading-tight text-balance">
          {children}
        </h1>
      </div>
    </div>
  );
}
