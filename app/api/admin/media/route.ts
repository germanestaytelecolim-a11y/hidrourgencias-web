import { NextRequest, NextResponse } from "next/server";

import { requireAdminApi, validateAdminMutation } from "@/lib/admin/auth";
import { createAdminId, createMediaAsset, writeAudit } from "@/lib/admin/db";
import { storeAdminImage } from "@/lib/admin/media-storage";
import type { MediaAsset } from "@/lib/admin/types";

export const runtime = "nodejs";

const maxFilesPerUpload = 10;
const maxTotalUploadSize = 60 * 1024 * 1024;

export async function POST(request: NextRequest) {
  const admin = await requireAdminApi(request);
  if (!admin) return NextResponse.json({ message: "No autorizado." }, { status: 401 });
  const mutationError = validateAdminMutation(request, admin.session);
  if (mutationError) return NextResponse.json({ message: mutationError }, { status: 403 });

  const formData = await request.formData();
  const files = formData.getAll("files").filter((item): item is File => item instanceof File);
  const assets: MediaAsset[] = [];

  if (!files.length) {
    return NextResponse.json({ message: "Selecciona al menos una fotografía." }, { status: 400 });
  }

  if (files.length > maxFilesPerUpload) {
    return NextResponse.json({ message: "Puedes subir hasta 10 fotografías por carga." }, { status: 400 });
  }

  const totalSize = files.reduce((sum, file) => sum + file.size, 0);
  if (totalSize > maxTotalUploadSize) {
    return NextResponse.json({ message: "La carga completa supera el máximo de 60 MB." }, { status: 400 });
  }

  for (const [index, file] of files.entries()) {
    let stored: Awaited<ReturnType<typeof storeAdminImage>>;
    try {
      stored = await storeAdminImage(file);
    } catch (error) {
      return NextResponse.json({ message: error instanceof Error ? error.message : "No pudimos procesar esta fotografía." }, { status: 400 });
    }
    const caption = String(formData.get(`caption-${index}`) ?? "").trim();
    const asset: MediaAsset = {
      id: createAdminId(),
      type: "image",
      url: stored.url,
      thumbnailUrl: stored.thumbnailUrl,
      caption,
      altText: caption || "Evidencia técnica de trabajo sanitario Hidrourgencias",
      isCover: index === 0,
      isPublic: true,
      sortOrder: index,
      createdAt: new Date().toISOString(),
    };
    await createMediaAsset(asset);
    assets.push(asset);
  }

  await writeAudit("media_uploaded", admin.user.id, { count: assets.length });
  return NextResponse.json({ assets });
}
