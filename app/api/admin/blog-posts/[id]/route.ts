import { NextRequest, NextResponse } from "next/server";

import { requireAdminApi, validateAdminMutation } from "@/lib/admin/auth";
import { getBlogPost, writeAudit } from "@/lib/admin/db";
import { buildBlogPostFromForm, validateBlogPostForm } from "@/lib/admin/blog-post-form";
import type { BlogStatus, MediaAsset } from "@/lib/admin/types";

export const runtime = "nodejs";

export async function GET(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  const user = await requireAdminApi(request);
  if (!user) return NextResponse.json({ message: "No autorizado." }, { status: 401 });

  const { id } = await context.params;
  const blogPost = await getBlogPost(id);
  if (!blogPost) return NextResponse.json({ message: "Artículo no encontrado." }, { status: 404 });
  return NextResponse.json({ blogPost }, { headers: { "Cache-Control": "no-store, max-age=0" } });
}

export async function PATCH(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  const admin = await requireAdminApi(request);
  if (!admin) return NextResponse.json({ message: "No autorizado." }, { status: 401 });
  const mutationError = validateAdminMutation(request, admin.session);
  if (mutationError) return NextResponse.json({ message: mutationError }, { status: 403 });

  const { id } = await context.params;
  const existing = await getBlogPost(id);
  if (!existing) return NextResponse.json({ message: "Artículo no encontrado." }, { status: 404 });
  const formData = await request.formData();
  const status = (String(formData.get("status") ?? existing.status) as BlogStatus) || existing.status;
  if ((status === "published" || status === "archived") && admin.user.role === "collaborator") {
    return NextResponse.json({ message: "Tu rol permite guardar borradores, pero no publicar ni archivar." }, { status: 403 });
  }
  const errors = status === "published" ? validateBlogPostForm(formData) : [];
  if (errors.length) return NextResponse.json({ message: "Faltan datos obligatorios.", errors }, { status: 400 });

  const blogPost = await buildBlogPostFromForm({ formData, user: admin.user, existing, status, gallery: parseGallery(formData) });
  await writeAudit(status === "archived" ? "blog_archived" : status === "published" ? "blog_published" : "blog_updated", admin.user.id, { blogPostId: blogPost.id });
  return NextResponse.json({ blogPost });
}

function parseGallery(formData: FormData): MediaAsset[] {
  const raw = String(formData.get("gallery") ?? "");
  if (!raw) return [];
  try {
    return JSON.parse(raw) as MediaAsset[];
  } catch {
    return [];
  }
}
