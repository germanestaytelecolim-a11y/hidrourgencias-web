import { AdminShell } from "@/components/admin/AdminShell";
import { WorkCaseForm } from "@/components/admin/WorkCaseForm";
import { requireAdminPage, type AdminPageProps } from "@/lib/admin/auth";
import { getWorkCase } from "@/lib/admin/db";
import type { WorkCase } from "@/lib/admin/types";

export const getServerSideProps = async (context: Parameters<typeof requireAdminPage>[0]) => {
  const auth = await requireAdminPage(context);
  if ("redirect" in auth) return auth;
  const id = String(context.params?.id ?? "");
  const workCase = await getWorkCase(id);
  if (!workCase) return { notFound: true };
  return { props: { user: auth.props.user, csrfToken: auth.props.csrfToken, workCase } };
};

export default function AdminEditWorkPage({ user, csrfToken, workCase }: AdminPageProps & { workCase: WorkCase }) {
  return (
    <AdminShell user={user} csrfToken={csrfToken} title="Editar trabajo">
      <WorkCaseForm initialWorkCase={workCase} />
    </AdminShell>
  );
}
