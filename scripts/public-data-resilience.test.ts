import assert from "node:assert/strict";
import test from "node:test";

import { canUseStaticPublicFallback, isDatabaseQuotaExceeded } from "../lib/admin/public-data-resilience";

test("only the known PostgreSQL quota error activates the public fallback", () => {
  const mutableEnvironment = process.env as Record<string, string | undefined>;
  const previousNodeEnv = process.env.NODE_ENV;
  const previousPostgresUrl = process.env.POSTGRES_URL;
  const previousDatabaseUrl = process.env.DATABASE_URL;
  mutableEnvironment.NODE_ENV = "production";
  mutableEnvironment.POSTGRES_URL = "configured";
  mutableEnvironment.DATABASE_URL = "configured";
  try {
    assert.equal(isDatabaseQuotaExceeded({ code: "53000" }), true);
    assert.equal(canUseStaticPublicFallback({ code: "53000" }), true);
    assert.equal(canUseStaticPublicFallback({ code: "42P01" }), false);
    assert.equal(canUseStaticPublicFallback(new Error("network failed")), false);
  } finally {
    mutableEnvironment.NODE_ENV = previousNodeEnv;
    mutableEnvironment.POSTGRES_URL = previousPostgresUrl;
    mutableEnvironment.DATABASE_URL = previousDatabaseUrl;
  }
});
