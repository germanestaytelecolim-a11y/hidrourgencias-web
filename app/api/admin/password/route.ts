import { NextRequest, NextResponse } from "next/server";

import { requireAdminApi, validateAdminMutation } from "@/lib/admin/auth";
import { getUserById, updateUserPassword, writeAudit } from "@/lib/admin/db";
import { hashPassword, validatePasswordStrength, verifyPassword } from "@/lib/admin/password";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  const admin = await requireAdminApi(request);
  if (!admin) return NextResponse.json({ message: "No autorizado." }, { status: 401 });
  const mutationError = validateAdminMutation(request, admin.session);
  if (mutationError) return NextResponse.json({ message: mutationError }, { status: 403 });

  const body = await request.json().catch(() => ({}));
  const currentPassword = String(body.currentPassword ?? "");
  const newPassword = String(body.newPassword ?? "");
  const confirmPassword = String(body.confirmPassword ?? "");

  if (newPassword !== confirmPassword) {
    return NextResponse.json({ message: "La confirmación no coincide." }, { status: 400 });
  }

  const strengthMessage = validatePasswordStrength(newPassword);
  if (strengthMessage) return NextResponse.json({ message: strengthMessage }, { status: 400 });

  const user = await getUserById(admin.user.id);
  if (!user || !(await verifyPassword(currentPassword, user.passwordHash))) {
    return NextResponse.json({ message: "La contraseña actual no es correcta." }, { status: 400 });
  }

  await updateUserPassword(user.id, await hashPassword(newPassword));
  await writeAudit("password_changed", user.id);
  return NextResponse.json({ ok: true });
}
