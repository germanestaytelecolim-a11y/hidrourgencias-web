import { AdminShell } from "@/components/admin/AdminShell";
import { BlogPostForm } from "@/components/admin/BlogPostForm";
import { requireAdminPage, type AdminPageProps } from "@/lib/admin/auth";

export const getServerSideProps = requireAdminPage;

export default function AdminNewBlogPage({ user, csrfToken }: AdminPageProps) {
  return (
    <AdminShell user={user} csrfToken={csrfToken} title="Nuevo artículo">
      <BlogPostForm />
    </AdminShell>
  );
}
