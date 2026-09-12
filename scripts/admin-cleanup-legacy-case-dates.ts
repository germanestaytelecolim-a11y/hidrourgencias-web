import { loadEnvConfig } from "@next/env";

import { listWorkCases, saveWorkCase } from "@/lib/admin/db";
import { getVerifiedWorkDate } from "@/lib/admin/public-work-cases";

async function main() {
  loadEnvConfig(process.cwd(), false);
  (process.env as Record<string, string | undefined>).NODE_ENV = "production";
  process.env.ADMIN_STORAGE_DRIVER = process.env.ADMIN_STORAGE_DRIVER || "postgres";

  const applyChanges = process.argv.includes("--apply");
  const workCases = await listWorkCases();
  const legacyCases = workCases.filter((workCase) => workCase.origin === "legacy");
  const changes = legacyCases
    .map((workCase) => {
      const verifiedDate = getVerifiedWorkDate(workCase);
      const clearsServiceDate = Boolean(workCase.date) && !verifiedDate;
      const clearsPublicationDate = Boolean(workCase.publishedAt);

      return {
        workCase,
        verifiedDate,
        clearsServiceDate,
        clearsPublicationDate,
        requiresUpdate: clearsServiceDate || clearsPublicationDate,
      };
    })
    .filter((item) => item.requiresUpdate);

  if (applyChanges) {
    const updatedAt = new Date().toISOString();
    for (const change of changes) {
      await saveWorkCase({
        ...change.workCase,
        date: change.verifiedDate,
        publishedAt: undefined,
        updatedAt,
      });
    }
  }

  console.log(
    JSON.stringify(
      {
        mode: applyChanges ? "apply" : "dry-run",
        legacyCases: legacyCases.length,
        updatedCases: changes.length,
        clearedServiceDates: changes.filter((item) => item.clearsServiceDate).length,
        clearedPublicationDates: changes.filter((item) => item.clearsPublicationDate).length,
        preservedVerifiedDates: legacyCases.filter((workCase) => Boolean(getVerifiedWorkDate(workCase))).map((workCase) => ({
          slug: workCase.slug,
          date: getVerifiedWorkDate(workCase),
        })),
      },
      null,
      2,
    ),
  );
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
