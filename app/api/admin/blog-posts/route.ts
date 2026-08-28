import { NextRequest, NextResponse } from "next/server";

import { requireAdminApi, validateAdminMutation } from "@/lib/admin/auth";
import { listBlogPosts, writeAudit } from "@/lib/admin/db";
import { buildBlogPostFromForm, validateBlogPostForm } from "@/lib/admin/blog-post-form";
import type { BlogStatus, MediaAsset } from "@/lib/admin/types";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  const user = await requireAdminApi(request);
  if (!user) return NextResponse.json({ message: "No autorizado." }, { status: 401 });

  return NextResponse.json({ blogPosts: await listBlogPosts() }, { headers: { "Cache-Control": "no-store, max-age=0" } });
}

export async function POST(request: NextRequest) {
  const admin = await requireAdminApi(request);
  if (!admin) return NextResponse.json({ message: "No autorizado." }, { status: 401 });
  const mutationError = validateAdminMutation(request, admin.session);
  if (mutationError) return NextResponse.json({ message: mutationError }, { status: 403 });

  const formData = await request.formData();
  const status = (String(formData.get("status") ?? "draft") as BlogStatus) || "draft";
  if (status === "published" && admin.user.role === "collaborator") {
    return NextResponse.json({ message: "Tu rol permite guardar borradores, pero no publicar." }, { status: 403 });
  }
  const errors = status === "published" ? validateBlogPostForm(formData) : [];
  if (errors.length) return NextResponse.json({ message: "Faltan datos obligatorios.", errors }, { status: 400 });

  const blogPost = await buildBlogPostFromForm({ formData, user: admin.user, status, gallery: parseGallery(formData) });
  await writeAudit(status === "published" ? "blog_published" : "blog_created", admin.user.id, { blogPostId: blogPost.id });
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
