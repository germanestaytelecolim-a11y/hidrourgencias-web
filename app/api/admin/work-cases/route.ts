import { NextRequest, NextResponse } from "next/server";

import { requireAdminApi, validateAdminMutation } from "@/lib/admin/auth";
import { revalidateWorkCaseDistribution } from "@/lib/admin/distribution";
import { listWorkCases, writeAudit } from "@/lib/admin/db";
import { buildWorkCaseFromForm, validateWorkCaseForm } from "@/lib/admin/work-case-form";
import type { MediaAsset, WorkStatus } from "@/lib/admin/types";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  const user = await requireAdminApi(request);
  if (!user) return NextResponse.json({ message: "No autorizado." }, { status: 401 });

  return NextResponse.json({ workCases: await listWorkCases() }, { headers: { "Cache-Control": "no-store, max-age=0" } });
}

export async function POST(request: NextRequest) {
  const admin = await requireAdminApi(request);
  if (!admin) return NextResponse.json({ message: "No autorizado." }, { status: 401 });
  const mutationError = validateAdminMutation(request, admin.session);
  if (mutationError) return NextResponse.json({ message: mutationError }, { status: 403 });

  const formData = await request.formData();
  const status = (String(formData.get("status") ?? "draft") as WorkStatus) || "draft";
  if (status === "published" && admin.user.role === "collaborator") {
    return NextResponse.json({ message: "Tu rol permite guardar borradores, pero no publicar." }, { status: 403 });
  }
  const errors = status === "published" ? validateWorkCaseForm(formData) : [];

  if (errors.length) {
    return NextResponse.json({ message: "Faltan datos obligatorios.", errors }, { status: 400 });
  }

  const media = parseMedia(formData);
  const workCase = await buildWorkCaseFromForm({ formData, user: admin.user, status, media });
  await writeAudit(status === "published" ? "work_published" : "work_created", admin.user.id, { workCaseId: workCase.id });
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
