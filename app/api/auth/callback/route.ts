import { NextRequest, NextResponse } from "next/server";

import {
  getGitHubClientId,
  getGitHubClientSecret,
  missingGitHubOAuthConfigMessage,
  verifySignedState,
} from "@/lib/decap-oauth";

export const runtime = "nodejs";

type GitHubTokenResponse = {
  access_token?: string;
  token_type?: string;
  scope?: string;
  error?: string;
  error_description?: string;
};

export async function GET(request: NextRequest) {
  if (!getGitHubClientId() || !getGitHubClientSecret()) {
    return decapCallbackResponse("error", {
      message: missingGitHubOAuthConfigMessage,
    });
  }

  const state = verifySignedState(request.nextUrl.searchParams.get("state"));
  const code = request.nextUrl.searchParams.get("code");
  const error = request.nextUrl.searchParams.get("error");
  const errorDescription = request.nextUrl.searchParams.get("error_description");

  if (!state) {
    return decapCallbackResponse("error", {
      message: "Estado OAuth invalido o expirado. Vuelve a iniciar sesion desde /admin.",
    });
  }

  if (error) {
    return decapCallbackResponse("error", {
      message: errorDescription || error,
    }, state.redirectOrigin);
  }

  if (!code) {
    return decapCallbackResponse("error", {
      message: "GitHub no devolvio authorization code.",
    }, state.redirectOrigin);
  }

  const tokenResponse = await exchangeCodeForToken(code, new URL("/api/auth/callback", request.nextUrl.origin).toString());

  if (!tokenResponse.access_token) {
    return decapCallbackResponse("error", {
      message: tokenResponse.error_description || tokenResponse.error || "GitHub no devolvio access token.",
    }, state.redirectOrigin);
  }

  return decapCallbackResponse("success", {
    token: tokenResponse.access_token,
    provider: "github",
  }, state.redirectOrigin);
}

async function exchangeCodeForToken(code: string, redirectUri: string): Promise<GitHubTokenResponse> {
  const response = await fetch("https://github.com/login/oauth/access_token", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      client_id: getGitHubClientId(),
      client_secret: getGitHubClientSecret(),
      code,
      redirect_uri: redirectUri,
    }),
    cache: "no-store",
  });

  return (await response.json()) as GitHubTokenResponse;
}

function decapCallbackResponse(status: "success" | "error", content: Record<string, string>, targetOrigin = "https://hidrourgencias.cl") {
  const payload = JSON.stringify(content).replaceAll("<", "\\u003c");
  const html = `<!doctype html>
<html lang="es">
  <head>
    <meta charset="utf-8" />
    <title>Autenticacion GitHub</title>
  </head>
  <body>
    <script>
      const payload = ${JSON.stringify(payload)};
      const targetOrigin = ${JSON.stringify(targetOrigin)};
      const receiveMessage = (message) => {
        if (message.origin !== targetOrigin || message.data !== "authorizing:github") return;
        window.opener.postMessage("authorization:github:${status}:" + payload, message.origin);
        window.removeEventListener("message", receiveMessage, false);
      };

      window.addEventListener("message", receiveMessage, false);
      window.opener.postMessage("authorizing:github", "*");
    </script>
  </body>
</html>`;

  return new NextResponse(html, {
    status: 200,
    headers: {
      "Cache-Control": "no-store, max-age=0",
      "Content-Type": "text/html; charset=utf-8",
      "X-Robots-Tag": "noindex, nofollow",
    },
  });
}
