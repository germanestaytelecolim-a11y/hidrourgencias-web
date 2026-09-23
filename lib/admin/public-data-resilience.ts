/**
 * Public pages must remain available when the optional CMS database is over
 * quota. This is deliberately narrow: admin mutations and unknown database
 * errors still surface normally instead of being hidden by a generic catch.
 */
export function isDatabaseQuotaExceeded(error: unknown): boolean {
  return typeof error === "object" && error !== null && "code" in error && error.code === "53000";
}

export function canUseStaticPublicFallback(error: unknown): boolean {
  return process.env.NODE_ENV === "production" &&
    ((!process.env.POSTGRES_URL && !process.env.DATABASE_URL) || isDatabaseQuotaExceeded(error));
}

export function reportStaticPublicFallback(resource: string, error: unknown) {
  if (!isDatabaseQuotaExceeded(error)) return;
  console.warn(`Public ${resource} fallback activated: PostgreSQL quota exceeded (53000).`);
}
