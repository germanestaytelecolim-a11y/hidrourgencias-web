import Link from "next/link";
import Image from "next/image";

import { AdminShell } from "@/components/admin/AdminShell";
import { requireAdminPage, type AdminPageProps } from "@/lib/admin/auth";
import { listWorkCases } from "@/lib/admin/db";
import type { WorkCase } from "@/lib/admin/types";

export const getServerSideProps = async (context: Parameters<typeof requireAdminPage>[0]) => {
  const auth = await requireAdminPage(context);
  if ("redirect" in auth) return auth;
  return { props: { user: auth.props.user, csrfToken: auth.props.csrfToken, workCases: await listWorkCases() } };
};

export default function AdminEvidencePage({ user, csrfToken, workCases }: AdminPageProps & { workCases: WorkCase[] }) {
  const media = workCases.flatMap((workCase) => workCase.media.map((asset) => ({ ...asset, workTitle: workCase.title, workId: workCase.id })));

  return (
    <AdminShell user={user} csrfToken={csrfToken} title="Evidencias">
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {media.map((asset) => (
          <Link key={asset.id} href={`/admin/trabajos/${asset.workId}`} className="rounded-3xl bg-white p-3 text-slate-950 shadow-xl">
            <Image src={asset.thumbnailUrl || asset.url} alt={asset.altText} width={360} height={210} className="aspect-video w-full rounded-2xl object-cover" />
            <p className="mt-3 font-black">{asset.caption || "Evidencia sin descripción"}</p>
            <p className="text-sm font-bold text-slate-600">{asset.workTitle}</p>
          </Link>
        ))}
        {!media.length ? <p className="rounded-3xl bg-white p-4 font-bold text-slate-700">Aún no hay evidencias cargadas.</p> : null}
      </div>
    </AdminShell>
  );
}
