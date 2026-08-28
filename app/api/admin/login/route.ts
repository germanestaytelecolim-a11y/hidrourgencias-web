import { NextRequest, NextResponse } from "next/server";

import { buildSessionCookie, validateAdminOrigin } from "@/lib/admin/auth";
import {
  createSession,
  getRecentFailedLoginAttempts,
  getUserByUsername,
  recordLoginAttempt,
  updateUserLogin,
  writeAudit,
} from "@/lib/admin/db";
import { verifyPassword } from "@/lib/admin/password";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  if (!validateAdminOrigin(request)) {
    return NextResponse.json({ message: "Origen no autorizado." }, { status: 403 });
  }

  const body = await request.json().catch(() => ({}));
  const username = String(body.username ?? "").trim().toLowerCase();
  const password = String(body.password ?? "");
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "local";

  if (!username || !password) {
    return NextResponse.json({ message: "Ingresa usuario y contraseña." }, { status: 400 });
  }

  if ((await getRecentFailedLoginAttempts(username, ip)) >= 5) {
    return NextResponse.json({ message: "Demasiados intentos. Espera unos minutos e intenta nuevamente." }, { status: 429 });
  }

  const user = await getUserByUsername(username);
  const valid = Boolean(user?.isActive && (await verifyPassword(password, user.passwordHash)));

  await recordLoginAttempt(username, ip, valid);

  if (!user || !valid) {
    await writeAudit("login_failed", undefined, { username });
    return NextResponse.json({ message: "Usuario o contraseña inválidos." }, { status: 401 });
  }

  const session = await createSession(user);
  await updateUserLogin(user.id);
  await writeAudit("login", user.id);

  return NextResponse.json(
    { ok: true },
    {
      headers: {
        "Set-Cookie": buildSessionCookie(session.id, session.expiresAt),
        "Cache-Control": "no-store, max-age=0",
      },
    },
  );
}
