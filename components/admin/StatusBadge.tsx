import type { WorkStatus } from "@/lib/admin/types";

export function StatusBadge({ status }: { status: WorkStatus }) {
  const label = status === "published" ? "Publicado" : status === "archived" ? "Archivado" : "Borrador";
  const className =
    status === "published"
      ? "bg-emerald-100 text-emerald-900"
      : status === "archived"
        ? "bg-slate-200 text-slate-800"
        : "bg-amber-100 text-amber-950";

  return <span className={`rounded-full px-3 py-1 text-xs font-black uppercase ${className}`}>{label}</span>;
}
