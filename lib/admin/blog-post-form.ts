import { revalidatePath, revalidateTag } from "next/cache";

import { createAdminId, saveBlogPost } from "@/lib/admin/db";
import { slugifyAdmin } from "@/lib/admin/slug";
import type { AdminSessionUser } from "@/lib/admin/auth";
import type { AdminBlogPost, BlogStatus, MediaAsset } from "@/lib/admin/types";

function getString(formData: FormData, name: string) {
  return String(formData.get(name) ?? "").trim();
}

function getBoolean(formData: FormData, name: string) {
  return formData.get(name) === "on" || formData.get(name) === "true";
}

function getTags(formData: FormData) {
  return getString(formData, "tags")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean)
    .slice(0, 12);
}

export function validateBlogPostForm(formData: FormData) {
  const errors: string[] = [];
  if (!getString(formData, "title")) errors.push("Ingresa un título.");
  if (!getString(formData, "summary")) errors.push("Ingresa un resumen.");
  if (!getString(formData, "content")) errors.push("Ingresa contenido.");
  return errors;
}

export async function buildBlogPostFromForm({
  formData,
  user,
  existing,
  status,
  gallery,
}: {
  formData: FormData;
  user: AdminSessionUser;
  existing?: AdminBlogPost | null;
  status: BlogStatus;
  gallery?: MediaAsset[];
}) {
  const now = new Date().toISOString();
  const title = getString(formData, "title");
  const slug = slugifyAdmin(getString(formData, "slug") || existing?.slug || title);
  const coverImage = getString(formData, "coverImage") || existing?.coverImage || "/images/hero-mantencion.jpg";
  const coverAlt = getString(formData, "coverAlt") || title;
  const blogPost: AdminBlogPost = {
    id: existing?.id ?? createAdminId(),
    slug,
    title,
    h1: getString(formData, "h1") || title,
    summary: getString(formData, "summary"),
    content: getString(formData, "content"),
    coverImage,
    coverAlt,
    gallery: gallery ?? existing?.gallery ?? [],
    category: getString(formData, "category") || "Guía técnica",
    tags: getTags(formData),
    date: getString(formData, "date") || now.slice(0, 10),
    featured: getBoolean(formData, "featured"),
    relatedService: getString(formData, "relatedService"),
    relatedCommune: getString(formData, "relatedCommune"),
    relatedCta: getString(formData, "relatedCta") || "Solicitar evaluación técnica",
    status,
    seoTitle: getString(formData, "seoTitle") || title,
    seoDescription: getString(formData, "seoDescription") || getString(formData, "summary"),
    ctaMessage: getString(formData, "ctaMessage") || `Hola, necesito orientación técnica sobre ${title} con Hidrourgencias SpA.`,
    origin: existing?.origin ?? "admin",
    legacySlug: existing?.legacySlug,
    createdBy: existing?.createdBy ?? user.id,
    updatedBy: user.id,
    createdAt: existing?.createdAt ?? now,
    updatedAt: now,
    publishedAt: status === "published" ? existing?.publishedAt ?? now : existing?.publishedAt,
  };

  await saveBlogPost(blogPost);
  revalidateTag("admin-blog-posts", "max");
  revalidatePath("/blog");
  revalidatePath(`/blog/${blogPost.slug}`);
  return blogPost;
}
