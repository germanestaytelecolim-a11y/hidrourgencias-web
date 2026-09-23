import assert from "node:assert/strict";
import test from "node:test";

import {
  canUseStaticPublicFallback,
  isDatabaseQuotaExceeded,
  reportStaticPublicFallback,
} from "../lib/admin/public-data-resilience";

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

test("the expected public fallback remains visible without being reported as a request error", () => {
  const originalWarn = console.warn;
  const originalError = console.error;
  const warnings: string[] = [];
  const errors: string[] = [];
  console.warn = (message: string) => warnings.push(message);
  console.error = (message: string) => errors.push(message);

  try {
    reportStaticPublicFallback("work cases", { code: "53000" });
    reportStaticPublicFallback("work cases", { code: "42P01" });
  } finally {
    console.warn = originalWarn;
    console.error = originalError;
  }

  assert.deepEqual(warnings, ["Public work cases fallback activated: PostgreSQL quota exceeded (53000)."]);
  assert.deepEqual(errors, []);
});
