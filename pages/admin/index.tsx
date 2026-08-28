import Link from "next/link";

import { AdminShell } from "@/components/admin/AdminShell";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { requireAdminPage, type AdminPageProps } from "@/lib/admin/auth";
import { listWorkCases } from "@/lib/admin/db";
import type { WorkCase } from "@/lib/admin/types";

export const getServerSideProps = async (context: Parameters<typeof requireAdminPage>[0]) => {
  const auth = await requireAdminPage(context);
  if ("redirect" in auth) return auth;
  return { props: { user: auth.props.user, csrfToken: auth.props.csrfToken, workCases: (await listWorkCases()).slice(0, 4) } };
};

export default function AdminDashboard({ user, csrfToken, workCases }: AdminPageProps & { workCases: WorkCase[] }) {
  return (
    <AdminShell user={user} csrfToken={csrfToken} title="¿Qué necesitas hacer?">
      <div className="grid gap-3 sm:grid-cols-2">
        <Link href="/admin/trabajos/nuevo" className="min-h-20 rounded-3xl bg-sky-300 p-5 text-xl font-black text-slate-950 shadow-xl">
          + Registrar nuevo trabajo
        </Link>
        <Link href="/admin/trabajos/nuevo#fotos" className="min-h-20 rounded-3xl bg-white p-5 text-xl font-black text-slate-950 shadow-xl">
          Subir evidencia
        </Link>
        <Link href="/admin/trabajos?status=draft" className="min-h-20 rounded-3xl bg-white p-5 text-xl font-black text-slate-950 shadow-xl">
          Continuar borrador
        </Link>
        <Link href="/admin/trabajos" className="min-h-20 rounded-3xl bg-white p-5 text-xl font-black text-slate-950 shadow-xl">
          Casos de éxito
        </Link>
        <Link href="/admin/blog" className="min-h-20 rounded-3xl bg-white p-5 text-xl font-black text-slate-950 shadow-xl">
          Blog y guías técnicas
        </Link>
      </div>
      <section className="mt-6 rounded-3xl bg-white p-4 text-slate-950 shadow-xl">
        <h2 className="text-lg font-black">Trabajos recientes</h2>
        <div className="mt-4 grid gap-3">
          {workCases.length ? (
            workCases.map((workCase) => (
              <Link key={workCase.id} href={`/admin/trabajos/${workCase.id}`} className="rounded-2xl border border-slate-200 p-3">
                <p className="font-black">{workCase.title || "Trabajo sin título"}</p>
                <p className="text-sm font-bold text-slate-600">{workCase.publicLocation || workCase.commune}</p>
                <StatusBadge status={workCase.status} />
              </Link>
            ))
          ) : (
            <p className="text-sm font-semibold text-slate-600">Aún no hay trabajos registrados.</p>
          )}
        </div>
      </section>
    </AdminShell>
  );
}
