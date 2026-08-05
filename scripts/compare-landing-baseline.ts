import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

type LandingRecord = {
  url: string;
  status: number;
  title: string;
  description: string | null;
  canonical: string | null;
  robots: string | null;
  h1: string | null;
  h1Count: number;
  schemaCount: number;
  schemaHash: string;
  internalLinksHash: string;
  internalLinkCount: number;
};

type LandingReport = {
  capturedAt: string;
  routes: LandingRecord[];
};

const protectedFields: Array<keyof LandingRecord> = [
  "status",
  "title",
  "description",
  "canonical",
  "robots",
  "h1",
  "h1Count",
  "schemaCount",
  "schemaHash",
  "internalLinksHash",
  "internalLinkCount",
];

function loadReport(path: string) {
  return JSON.parse(readFileSync(path, "utf8")) as LandingReport;
}

function main() {
  const reportsDirectory = join(process.cwd(), "reports");
  const baselinePath = join(reportsDirectory, "landing-visual-baseline.json");
  const afterPath = join(reportsDirectory, "landing-visual-after.json");
  const outputPath = join(reportsDirectory, "landing-seo-comparison.json");
  const baseline = loadReport(baselinePath);
  const after = loadReport(afterPath);
  const afterByUrl = new Map(after.routes.map((route) => [route.url, route]));
  const failures: Array<{ url: string; field: keyof LandingRecord; before: unknown; after: unknown }> = [];

  for (const beforeRoute of baseline.routes) {
    const afterRoute = afterByUrl.get(beforeRoute.url);
    if (!afterRoute) {
      failures.push({ url: beforeRoute.url, field: "url", before: beforeRoute.url, after: null });
      continue;
    }

    for (const field of protectedFields) {
      if (beforeRoute[field] !== afterRoute[field]) {
        failures.push({ url: beforeRoute.url, field, before: beforeRoute[field], after: afterRoute[field] });
      }
    }
  }

  const baselineUrls = new Set(baseline.routes.map((route) => route.url));
  for (const afterRoute of after.routes) {
    if (!baselineUrls.has(afterRoute.url)) {
      failures.push({ url: afterRoute.url, field: "url", before: null, after: afterRoute.url });
    }
  }

  const result = {
    comparedAt: new Date().toISOString(),
    baselineCapturedAt: baseline.capturedAt,
    afterCapturedAt: after.capturedAt,
    routeCountBefore: baseline.routes.length,
    routeCountAfter: after.routes.length,
    protectedFields,
    comparisonCount: baseline.routes.length * protectedFields.length,
    failureCount: failures.length,
    failures,
  };

  writeFileSync(outputPath, `${JSON.stringify(result, null, 2)}\n`);
  console.log(`Comparaciones SEO: ${result.comparisonCount}`);
  console.log(`Diferencias no permitidas: ${result.failureCount}`);
  console.log(`Informe: ${outputPath}`);
  if (failures.length > 0) process.exitCode = 1;
}

main();
