import { Moon, Sun } from "lucide-react";

type ThemeToggleProps = {
  className?: string;
  compact?: boolean;
};

export function ThemeToggle({ className = "", compact = false }: ThemeToggleProps) {
  return (
    <button
      type="button"
      data-theme-toggle
      aria-label="Activar modo descanso visual"
      aria-pressed="false"
      title="Descanso visual"
      className={[
        "brand-focus-ring inline-flex items-center justify-center gap-2 rounded-full border border-sky-200 bg-white px-3.5 py-2 text-xs font-bold text-slate-800 shadow-sm shadow-slate-900/10 transition hover:-translate-y-0.5 hover:border-sky-300 hover:bg-sky-50",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <Moon data-theme-icon="moon" className="h-4 w-4 text-sky-700" aria-hidden="true" />
      <Sun data-theme-icon="sun" className="hidden h-4 w-4 text-amber-400" aria-hidden="true" />
      <span data-theme-toggle-label className={compact ? "sr-only" : undefined}>
        Descanso visual
      </span>
    </button>
  );
}
