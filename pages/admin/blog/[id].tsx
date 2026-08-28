import { AdminShell } from "@/components/admin/AdminShell";
import { BlogPostForm } from "@/components/admin/BlogPostForm";
import { requireAdminPage, type AdminPageProps } from "@/lib/admin/auth";
import { getBlogPost } from "@/lib/admin/db";
import type { AdminBlogPost } from "@/lib/admin/types";

export const getServerSideProps = async (context: Parameters<typeof requireAdminPage>[0]) => {
  const auth = await requireAdminPage(context);
  if ("redirect" in auth) return auth;
  const id = String(context.params?.id ?? "");
  const blogPost = await getBlogPost(id);
  if (!blogPost) return { notFound: true };
  return { props: { user: auth.props.user, csrfToken: auth.props.csrfToken, blogPost } };
};

export default function AdminEditBlogPage({ user, csrfToken, blogPost }: AdminPageProps & { blogPost: AdminBlogPost }) {
  return (
    <AdminShell user={user} csrfToken={csrfToken} title="Editar artículo">
      <BlogPostForm initialPost={blogPost} />
    </AdminShell>
  );
}
