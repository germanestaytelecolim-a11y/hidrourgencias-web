import type { GetServerSidePropsContext, NextApiRequest } from "next";

import { deleteSession, getSession, getUserById } from "@/lib/admin/db";
import type { AdminSession, AdminUser } from "@/lib/admin/types";

export const adminSessionCookieName = "hu_admin_session";

export type AdminSessionUser = Omit<AdminUser, "passwordHash">;
export type AdminPageProps = {
  user: AdminSessionUser;
  csrfToken: string;
};
export type AdminRequestContext = {
  user: AdminSessionUser;
  session: AdminSession;
};

function stripPasswordHash(user: AdminUser): AdminSessionUser {
  const safeUser = { ...user };
  delete (safeUser as Partial<AdminUser>).passwordHash;
  return safeUser;
}

export function getCookieValue(cookieHeader: string | undefined, name: string) {
  if (!cookieHeader) return "";
  const cookies = cookieHeader.split(";").map((item) => item.trim());
  const match = cookies.find((item) => item.startsWith(`${name}=`));
  return match ? decodeURIComponent(match.slice(name.length + 1)) : "";
}

export async function getRequestAdminContext(cookieHeader: string | undefined): Promise<AdminRequestContext | null> {
  const sessionId = getCookieValue(cookieHeader, adminSessionCookieName);
  if (!sessionId) return null;

  const session = await getSession(sessionId);
  if (!session) return null;

  const user = await getUserById(session.userId);
  if (!user || !user.isActive || user.sessionVersion !== session.sessionVersion) {
    await deleteSession(sessionId);
    return null;
  }

  return { user: stripPasswordHash(user), session };
}

export async function getRequestAdminUser(cookieHeader: string | undefined) {
  return (await getRequestAdminContext(cookieHeader))?.user ?? null;
}

export async function requireAdminPage(context: GetServerSidePropsContext) {
  const admin = await getRequestAdminContext(context.req.headers.cookie);

  if (!admin) {
    return {
      redirect: {
        destination: "/admin/login",
        permanent: false,
      },
    } as const;
  }

  return { props: { user: admin.user, csrfToken: admin.session.csrfToken } };
}

export async function requireAdminApi(request: Request | NextApiRequest): Promise<AdminRequestContext | null> {
  const cookieHeader = "headers" in request && typeof request.headers.get === "function"
    ? request.headers.get("cookie") ?? undefined
    : (request as NextApiRequest).headers.cookie;
  return getRequestAdminContext(cookieHeader);
}

export function buildSessionCookie(sessionId: string, expiresAt: string) {
  const secure = process.env.NODE_ENV === "production" ? "; Secure" : "";
  return `${adminSessionCookieName}=${encodeURIComponent(sessionId)}; Path=/; HttpOnly; SameSite=Lax; Expires=${new Date(expiresAt).toUTCString()}${secure}`;
}

export function buildExpiredSessionCookie() {
  const secure = process.env.NODE_ENV === "production" ? "; Secure" : "";
  return `${adminSessionCookieName}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0${secure}`;
}

export function validateAdminOrigin(request: Request) {
  const origin = request.headers.get("origin");
  const host = request.headers.get("host");

  if (!origin) return true;
  if (!host) return false;

  const allowed = new Set([
    `http://${host}`,
    `https://${host}`,
    "https://hidrourgencias.cl",
  ]);

  const appUrl = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "";
  if (appUrl) allowed.add(appUrl);

  return allowed.has(origin);
}

export function validateCsrfToken(request: Request, session: AdminSession) {
  return request.headers.get("x-csrf-token") === session.csrfToken;
}

export function validateAdminMutation(request: Request, session: AdminSession) {
  if (!validateAdminOrigin(request)) {
    return "Origen no autorizado.";
  }

  if (!validateCsrfToken(request, session)) {
    return "Token de seguridad inválido. Recarga el panel e intenta nuevamente.";
  }

  return "";
}
