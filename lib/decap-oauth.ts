import { createHmac, randomBytes, timingSafeEqual } from "node:crypto";

const stateMaxAgeMs = 10 * 60 * 1000;

type DecapOAuthState = {
  nonce: string;
  provider: "github";
  redirectOrigin: string;
  createdAt: number;
};

export function getGitHubClientId() {
  return process.env.GITHUB_CLIENT_ID?.trim() ?? "";
}

export function getGitHubClientSecret() {
  return process.env.GITHUB_CLIENT_SECRET?.trim() ?? "";
}

export function createSignedState(redirectOrigin: string) {
  const state: DecapOAuthState = {
    nonce: randomBytes(16).toString("hex"),
    provider: "github",
    redirectOrigin,
    createdAt: Date.now(),
  };
  const payload = Buffer.from(JSON.stringify(state)).toString("base64url");
  const signature = signPayload(payload);

  return `${payload}.${signature}`;
}

export function verifySignedState(value: string | null): DecapOAuthState | null {
  if (!value) return null;

  const [payload, signature] = value.split(".");
  if (!payload || !signature) return null;

  const expectedSignature = signPayload(payload);
  if (!safeEqual(signature, expectedSignature)) return null;

  try {
    const decoded = Buffer.from(payload, "base64url").toString("utf8");
    const state = JSON.parse(decoded) as DecapOAuthState;

    if (state.provider !== "github") return null;
    if (!state.redirectOrigin) return null;
    if (!state.createdAt || Date.now() - state.createdAt > stateMaxAgeMs) return null;

    return state;
  } catch {
    return null;
  }
}

function signPayload(payload: string) {
  const secret = getGitHubClientSecret();

  if (!secret) {
    throw new Error("GITHUB_CLIENT_SECRET is not configured");
  }

  return createHmac("sha256", secret).update(payload).digest("base64url");
}

function safeEqual(left: string, right: string) {
  const leftBuffer = Buffer.from(left);
  const rightBuffer = Buffer.from(right);

  return leftBuffer.length === rightBuffer.length && timingSafeEqual(leftBuffer, rightBuffer);
}

