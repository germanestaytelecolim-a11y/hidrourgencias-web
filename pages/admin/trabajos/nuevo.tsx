import { AdminShell } from "@/components/admin/AdminShell";
import { WorkCaseForm } from "@/components/admin/WorkCaseForm";
import { requireAdminPage, type AdminPageProps } from "@/lib/admin/auth";

export const getServerSideProps = requireAdminPage;

export default function AdminNewWorkPage({ user, csrfToken }: AdminPageProps) {
  return (
    <AdminShell user={user} csrfToken={csrfToken} title="Nuevo trabajo">
      <WorkCaseForm />
    </AdminShell>
  );
}
