import Link from "next/link";
import Image from "next/image";

import { AdminShell } from "@/components/admin/AdminShell";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { requireAdminPage, type AdminPageProps } from "@/lib/admin/auth";
import { listWorkCases } from "@/lib/admin/db";
import type { WorkCase } from "@/lib/admin/types";

export const getServerSideProps = async (context: Parameters<typeof requireAdminPage>[0]) => {
  const auth = await requireAdminPage(context);
  if ("redirect" in auth) return auth;
  const status = String(context.query.status ?? "all");
  const search = String(context.query.q ?? "").trim().toLowerCase();
  const workCases = (await listWorkCases()).filter((workCase) => {
    const statusMatch =
      status === "all" ||
      (status === "recent" && workCase.origin !== "legacy") ||
      (status === "legacy" && workCase.origin === "legacy") ||
      workCase.status === status;
    const searchMatch = !search || `${workCase.title} ${workCase.publicLocation} ${workCase.clientName ?? ""}`.toLowerCase().includes(search);
    return statusMatch && searchMatch;
  });
  return { props: { user: auth.props.user, csrfToken: auth.props.csrfToken, workCases, status, search } };
};

const filters = [
  { href: "/admin/trabajos", label: "Todos" },
  { href: "/admin/trabajos?status=recent", label: "Recientes" },
  { href: "/admin/trabajos?status=draft", label: "Borradores" },
  { href: "/admin/trabajos?status=published", label: "Publicados" },
  { href: "/admin/trabajos?status=archived", label: "Archivados" },
  { href: "/admin/trabajos?status=legacy", label: "Históricos importados" },
];

export default function AdminWorksPage({ user, csrfToken, workCases, status, search }: AdminPageProps & { workCases: WorkCase[]; status: string; search: string }) {
  return (
    <AdminShell user={user} csrfToken={csrfToken} title="Casos de éxito">
      <div className="mb-4 flex flex-wrap gap-2">
        <Link href="/admin/trabajos/nuevo" className="min-h-11 rounded-xl bg-sky-300 px-4 py-3 font-black text-slate-950">
          + Nuevo trabajo
        </Link>
      </div>
      <div className="mb-4 flex flex-wrap gap-2">
        {filters.map((filter) => (
          <Link
            key={filter.href}
            href={filter.href}
            className={`min-h-11 rounded-xl px-4 py-3 text-sm font-black ${filter.href.includes(`status=${status}`) || (status === "all" && filter.href === "/admin/trabajos") ? "bg-white text-slate-950" : "bg-white/10 text-white"}`}
          >
            {filter.label}
          </Link>
        ))}
      </div>
      <form className="mb-4" action="/admin/trabajos">
        <input type="hidden" name="status" value={status === "all" ? "" : status} />
        <label className="grid gap-2 text-sm font-black text-white">
          Buscar
          <input name="q" defaultValue={search} placeholder="Carabineros, Mantención preventiva, comuna..." className="min-h-12 rounded-xl border border-white/20 px-4 text-base font-semibold text-slate-950" />
        </label>
      </form>
      <div className="grid gap-3">
        {workCases.map((workCase) => (
          <Link key={workCase.id} href={`/admin/trabajos/${workCase.id}`} className="grid gap-3 rounded-3xl bg-white p-4 text-slate-950 shadow-xl sm:grid-cols-[7rem_1fr]">
            {workCase.media[0] ? (
              <Image src={workCase.media[0].thumbnailUrl || workCase.media[0].url} alt={workCase.media[0].altText} width={240} height={180} className="h-28 w-full rounded-2xl object-cover" />
            ) : (
              <div className="h-28 rounded-2xl bg-slate-100" />
            )}
            <div>
              <p className="text-lg font-black">{workCase.title || "Trabajo sin título"}</p>
              <p className="font-bold text-slate-600">{workCase.publicLocation || workCase.commune}</p>
              {workCase.origin === "legacy" ? <p className="mt-1 inline-flex rounded-full bg-amber-100 px-3 py-1 text-xs font-black text-amber-950">Caso histórico</p> : null}
              <div className="mt-2">
                <StatusBadge status={workCase.status} />
              </div>
            </div>
          </Link>
        ))}
        {!workCases.length ? <p className="rounded-3xl bg-white p-4 font-bold text-slate-700">No hay trabajos todavía.</p> : null}
      </div>
    </AdminShell>
  );
}
