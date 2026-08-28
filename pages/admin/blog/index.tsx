import Link from "next/link";
import Image from "next/image";

import { AdminShell } from "@/components/admin/AdminShell";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { requireAdminPage, type AdminPageProps } from "@/lib/admin/auth";
import { listBlogPosts } from "@/lib/admin/db";
import type { AdminBlogPost } from "@/lib/admin/types";

export const getServerSideProps = async (context: Parameters<typeof requireAdminPage>[0]) => {
  const auth = await requireAdminPage(context);
  if ("redirect" in auth) return auth;
  const status = String(context.query.status ?? "all");
  const search = String(context.query.q ?? "").trim().toLowerCase();
  const blogPosts = (await listBlogPosts()).filter((post) => {
    const statusMatch =
      status === "all" ||
      (status === "featured" && post.featured) ||
      post.status === status;
    const searchMatch = !search || `${post.title} ${post.summary} ${post.tags.join(" ")}`.toLowerCase().includes(search);
    return statusMatch && searchMatch;
  });
  return { props: { user: auth.props.user, csrfToken: auth.props.csrfToken, blogPosts, status, search } };
};

const filters = [
  { href: "/admin/blog", label: "Todos" },
  { href: "/admin/blog?status=draft", label: "Borradores" },
  { href: "/admin/blog?status=published", label: "Publicados" },
  { href: "/admin/blog?status=featured", label: "Destacados" },
  { href: "/admin/blog?status=archived", label: "Archivados" },
];

export default function AdminBlogPage({ user, csrfToken, blogPosts, status, search }: AdminPageProps & { blogPosts: AdminBlogPost[]; status: string; search: string }) {
  return (
    <AdminShell user={user} csrfToken={csrfToken} title="Blog y guías técnicas">
      <div className="mb-4 flex flex-wrap gap-2">
        <Link href="/admin/blog/nuevo" className="min-h-11 rounded-xl bg-sky-300 px-4 py-3 font-black text-slate-950">
          + Nuevo artículo
        </Link>
        <Link href="/blog" className="min-h-11 rounded-xl bg-white/10 px-4 py-3 font-black text-white">
          Ver blog público
        </Link>
      </div>
      <div className="mb-4 flex flex-wrap gap-2">
        {filters.map((filter) => (
          <Link
            key={filter.href}
            href={filter.href}
            className={`min-h-11 rounded-xl px-4 py-3 text-sm font-black ${filter.href.includes(`status=${status}`) || (status === "all" && filter.href === "/admin/blog") ? "bg-white text-slate-950" : "bg-white/10 text-white"}`}
          >
            {filter.label}
          </Link>
        ))}
      </div>
      <form className="mb-4" action="/admin/blog">
        <input type="hidden" name="status" value={status === "all" ? "" : status} />
        <label className="grid gap-2 text-sm font-black text-white">
          Buscar
          <input name="q" defaultValue={search} placeholder="precompra, hidrojet, vicios ocultos..." className="min-h-12 rounded-xl border border-white/20 px-4 text-base font-semibold text-slate-950" />
        </label>
      </form>
      <div className="grid gap-3">
        {blogPosts.map((post) => (
          <Link key={post.id} href={`/admin/blog/${post.id}`} className="grid gap-3 rounded-3xl bg-white p-4 text-slate-950 shadow-xl sm:grid-cols-[7rem_1fr]">
            {post.coverImage ? (
              <Image src={post.coverImage} alt={post.coverAlt || post.title} width={240} height={180} className="h-28 w-full rounded-2xl object-cover" />
            ) : (
              <div className="h-28 rounded-2xl bg-slate-100" />
            )}
            <div>
              <p className="text-lg font-black">{post.title || "Artículo sin título"}</p>
              <p className="font-bold text-slate-600">{post.category} · /blog/{post.slug}</p>
              {post.featured ? <p className="mt-1 inline-flex rounded-full bg-sky-100 px-3 py-1 text-xs font-black text-sky-950">Destacado</p> : null}
              <div className="mt-2">
                <StatusBadge status={post.status} />
              </div>
            </div>
          </Link>
        ))}
        {!blogPosts.length ? <p className="rounded-3xl bg-white p-4 font-bold text-slate-700">No hay artículos todavía.</p> : null}
      </div>
    </AdminShell>
  );
}
