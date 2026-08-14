import { mkdir, writeFile } from "node:fs/promises";

import { navigationCoverage } from "../lib/navigation";

const baseUrl = process.env.NAV_BASE_URL ?? "http://localhost:3110";

async function auditPath(path: string) {
  const response = await fetch(`${baseUrl}${path}`, { redirect: "manual" });
  const location = response.headers.get("location");
  const finalUrl = location ? new URL(location, `${baseUrl}${path}`).toString() : `${baseUrl}${path}`;
  const finalResponse = location ? await fetch(finalUrl) : response;
  const html = await finalResponse.text();
  return {
    path,
    httpStatus: finalResponse.status,
    redirects: location ? 1 : 0,
    canonical: html.match(/<link[^>]+rel=["']canonical["'][^>]+href=["']([^"']+)/i)?.[1] ?? null,
  };
}

async function main() {
  const owners = new Map<string, string>();
  const communes = await Promise.all(navigationCoverage.map(async (commune) => {
    const landing = await auditPath(commune.landingPath);
    const sectors = await Promise.all(commune.sectors.map(async (sector) => ({
      ...sector,
      audit: await auditPath(sector.href),
    })));
    const duplicateSectorOwner = sectors.some((sector) => {
      const previous = owners.get(sector.href);
      if (previous && previous !== commune.id) return true;
      owners.set(sector.href, commune.id);
      return false;
    });
    return {
      id: commune.id,
      comuna: commune.comuna,
      landingPath: commune.landingPath,
      sectors,
      checks: {
        landingValid: landing.httpStatus === 200 && landing.redirects === 0 && Boolean(landing.canonical),
        sectorsBelongToOneCommune: !duplicateSectorOwner,
        sectorLinksValid: sectors.every((sector) => sector.audit.httpStatus === 200 && sector.audit.redirects === 0 && Boolean(sector.audit.canonical)),
      },
    };
  }));
  const report = {
    generatedAt: new Date().toISOString(),
    baseUrl,
    communes,
    summary: {
      communeCount: communes.length,
      uniqueIds: new Set(communes.map((commune) => commune.id)).size === communes.length,
      landingCount: communes.filter((commune) => commune.checks.landingValid).length,
      sectorCount: communes.reduce((sum, commune) => sum + commune.sectors.length, 0),
      validSectorLinks: communes.every((commune) => commune.checks.sectorLinksValid),
      independentSectors: communes.every((commune) => commune.checks.sectorsBelongToOneCommune),
    },
  };
  await mkdir("reports", { recursive: true });
  await writeFile("reports/navigation-coverage-selection-validation.json", JSON.stringify(report, null, 2));
  console.log(JSON.stringify(report.summary));
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
