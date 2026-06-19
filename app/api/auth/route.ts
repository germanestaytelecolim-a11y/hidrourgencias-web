import { NextRequest, NextResponse } from "next/server";

import { createSignedState, getGitHubClientId, getGitHubClientSecret } from "@/lib/decap-oauth";

export const runtime = "nodejs";

export function GET(request: NextRequest) {
  const clientId = getGitHubClientId();
  const clientSecret = getGitHubClientSecret();

  if (!clientId || !clientSecret) {
    return oauthErrorResponse("GitHub OAuth no esta configurado. Falta GITHUB_CLIENT_ID o GITHUB_CLIENT_SECRET.");
  }

  const provider = request.nextUrl.searchParams.get("provider") ?? "github";

  if (provider !== "github") {
    return oauthErrorResponse("Proveedor OAuth no soportado.");
  }

  const redirectUri = new URL("/api/auth/callback", request.nextUrl.origin);
  const scope = request.nextUrl.searchParams.get("scope") || "repo";
  const state = createSignedState(request.nextUrl.origin);
  const authorizeUrl = new URL("https://github.com/login/oauth/authorize");

  authorizeUrl.searchParams.set("client_id", clientId);
  authorizeUrl.searchParams.set("redirect_uri", redirectUri.toString());
  authorizeUrl.searchParams.set("scope", scope);
  authorizeUrl.searchParams.set("state", state);
  authorizeUrl.searchParams.set("allow_signup", "false");

  return NextResponse.redirect(authorizeUrl, {
    headers: {
      "Cache-Control": "no-store, max-age=0",
    },
  });
}

function oauthErrorResponse(message: string) {
  return new NextResponse(message, {
    status: 500,
    headers: {
      "Cache-Control": "no-store, max-age=0",
      "Content-Type": "text/plain; charset=utf-8",
    },
  });
}

