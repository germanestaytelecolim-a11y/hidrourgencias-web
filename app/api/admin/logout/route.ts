import { NextRequest, NextResponse } from "next/server";

import { adminSessionCookieName, buildExpiredSessionCookie, getCookieValue, requireAdminApi, validateAdminMutation } from "@/lib/admin/auth";
import { deleteSession, writeAudit } from "@/lib/admin/db";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  const admin = await requireAdminApi(request);
  const sessionId = getCookieValue(request.headers.get("cookie") ?? undefined, adminSessionCookieName);
  if (admin) {
    const mutationError = validateAdminMutation(request, admin.session);
    if (mutationError) return NextResponse.json({ message: mutationError }, { status: 403 });
  }

  if (sessionId) await deleteSession(sessionId);
  if (admin) await writeAudit("logout", admin.user.id);

  return NextResponse.json(
    { ok: true },
    {
      headers: {
        "Set-Cookie": buildExpiredSessionCookie(),
        "Cache-Control": "no-store, max-age=0",
      },
    },
  );
}
