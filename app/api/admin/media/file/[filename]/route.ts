import { NextRequest, NextResponse } from "next/server";

import { readLocalAdminMedia } from "@/lib/admin/media-storage";

export const runtime = "nodejs";

export async function GET(_request: NextRequest, context: { params: Promise<{ filename: string }> }) {
  const { filename } = await context.params;
  const media = await readLocalAdminMedia(filename);

  if (!media) {
    return new NextResponse("No encontrado", { status: 404 });
  }

  return new NextResponse(media.data, {
    status: 200,
    headers: {
      "Content-Type": media.contentType,
      "Cache-Control": "private, max-age=3600",
      "X-Robots-Tag": "noindex, nofollow",
    },
  });
}
