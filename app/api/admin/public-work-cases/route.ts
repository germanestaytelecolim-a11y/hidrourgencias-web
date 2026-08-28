import { NextResponse } from "next/server";

import { getPublicWorkCasesForPath } from "@/lib/admin/public-work-cases";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const workCases = await getPublicWorkCasesForPath("/casos-de-exito");

  return NextResponse.json(
    { workCases },
    {
      headers: {
        "Cache-Control": "public, max-age=60, stale-while-revalidate=300",
      },
    },
  );
}
