import { NextRequest, NextResponse } from "next/server";

import { requireAdminApi, validateAdminMutation } from "@/lib/admin/auth";
import { revalidateWorkCaseDistribution } from "@/lib/admin/distribution";
import { getWorkCase, writeAudit } from "@/lib/admin/db";
import { buildWorkCaseFromForm, validateWorkCaseForm } from "@/lib/admin/work-case-form";
import type { MediaAsset, WorkStatus } from "@/lib/admin/types";

export const runtime = "nodejs";

export async function GET(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  const user = await requireAdminApi(request);
  if (!user) return NextResponse.json({ message: "No autorizado." }, { status: 401 });

  const { id } = await context.params;
  const workCase = await getWorkCase(id);
  if (!workCase) return NextResponse.json({ message: "Trabajo no encontrado." }, { status: 404 });

  return NextResponse.json({ workCase }, { headers: { "Cache-Control": "no-store, max-age=0" } });
}

export async function PATCH(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  const admin = await requireAdminApi(request);
  if (!admin) return NextResponse.json({ message: "No autorizado." }, { status: 401 });
  const mutationError = validateAdminMutation(request, admin.session);
  if (mutationError) return NextResponse.json({ message: mutationError }, { status: 403 });

  const { id } = await context.params;
  const existing = await getWorkCase(id);
  if (!existing) return NextResponse.json({ message: "Trabajo no encontrado." }, { status: 404 });

  const formData = await request.formData();
  const status = (String(formData.get("status") ?? existing.status) as WorkStatus) || existing.status;
  if ((status === "published" || status === "archived") && admin.user.role === "collaborator") {
    return NextResponse.json({ message: "Tu rol permite guardar borradores, pero no publicar ni archivar." }, { status: 403 });
  }
  const errors = status === "published" ? validateWorkCaseForm(formData) : [];
  if (errors.length) return NextResponse.json({ message: "Faltan datos obligatorios.", errors }, { status: 400 });

  const workCase = await buildWorkCaseFromForm({ formData, user: admin.user, existing, status, media: parseMedia(formData) });
  await writeAudit(status === "archived" ? "work_archived" : status === "published" ? "work_published" : "work_updated", admin.user.id, {
    workCaseId: workCase.id,
  });
  revalidateWorkCaseDistribution(workCase);
  return NextResponse.json({ workCase });
}

function parseMedia(formData: FormData): MediaAsset[] {
  const raw = String(formData.get("media") ?? "");
  if (!raw) return [];

  try {
    return JSON.parse(raw) as MediaAsset[];
  } catch {
    return [];
  }
}
