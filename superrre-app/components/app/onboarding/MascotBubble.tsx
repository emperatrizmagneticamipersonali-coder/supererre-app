export function MascotBubble({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-2">
      <span
        className="text-5xl shrink-0 animate-float-slow relative z-10"
        aria-hidden="true"
      >
        🦁
      </span>
      <div className="relative flex-1 animate-bubble-pop [transform-origin:0_50%]">
        <span
          aria-hidden="true"
          className="absolute left-0 top-5 h-3 w-3 rounded-full bg-surface-secondary -translate-x-4"
        />
        <span
          aria-hidden="true"
          className="absolute left-0 top-3 h-2 w-2 rounded-full bg-surface-secondary -translate-x-6"
        />
        <div className="rounded-3xl rounded-tl-md bg-surface-secondary px-5 py-4">
          <h1 className="font-display font-extrabold text-2xl text-txt-primary leading-tight text-balance">
            {children}
          </h1>
        </div>
      </div>
    </div>
  );
}
