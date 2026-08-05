import { readFileSync, statSync, writeFileSync } from "node:fs";
import { join } from "node:path";

import { getAllLandingVisualProfiles } from "../lib/landing-visuals";

type AuditResult = {
  routePath: string;
  viewport: { width: number };
  status: number;
  finalUrl: string;
  redirectCount: number;
  horizontalOverflow: boolean;
  consoleErrors: string[];
  pageErrors: string[];
  failedRequests: string[];
};

function escapeCell(value: string) {
  return value.replaceAll("|", "\\|").replaceAll("\n", " ");
}

function main() {
  const projectRoot = process.cwd();
  const audit = JSON.parse(
    readFileSync(join(projectRoot, "reports", "landing-visual-full.json"), "utf8"),
  ) as { auditedAt: string; results: AuditResult[] };
  const resultsByPath = new Map<string, AuditResult[]>();

  for (const result of audit.results) {
    const routeResults = resultsByPath.get(result.routePath) ?? [];
    routeResults.push(result);
    resultsByPath.set(result.routePath, routeResults);
  }

  const rows = getAllLandingVisualProfiles()
    .sort((a, b) => a.family.localeCompare(b.family) || a.slug.localeCompare(b.slug))
    .map((profile) => {
      const routePath = `/${profile.family === "zona" ? "zona" : "servicios"}/${profile.slug}`;
      const routeResults = resultsByPath.get(routePath) ?? [];
      const passed =
        routeResults.length === 3 &&
        routeResults.every(
          (result) =>
            result.status === 200 &&
            result.redirectCount === 0 &&
            !result.horizontalOverflow &&
            result.consoleErrors.length === 0 &&
            result.pageErrors.length === 0 &&
            result.failedRequests.length === 0,
        );
      const imagePath = join(projectRoot, "public", profile.image.replace(/^\//, ""));
      const imageKilobytes = Math.round(statSync(imagePath).size / 1024);

      return [
        routePath,
        profile.variant,
        profile.image,
        profile.alt,
        `${imageKilobytes} KB`,
        profile.source.label,
        profile.source.license,
        routeResults.map((result) => result.status).join("/"),
        routeResults.map((result) => result.redirectCount).join("/"),
        passed ? "PASS" : "FAIL",
      ];
    });

  const lines = [
    "# Matriz de landings visuales",
    "",
    `Generada: ${new Date().toISOString()}`,
    `Auditoria de navegador: ${audit.auditedAt}`,
    "",
    "Viewports, en orden: 390 px / 768 px / 1440 px.",
    "",
    "| Ruta | Variante | Imagen | Alt | Peso | Fuente | Licencia | HTTP | Redirecciones | Estado |",
    "| --- | --- | --- | --- | ---: | --- | --- | --- | --- | --- |",
    ...rows.map((row) => `| ${row.map(escapeCell).join(" | ")} |`),
    "",
  ];

  const outputPath = join(projectRoot, "reports", "landing-visual-matrix.md");
  writeFileSync(outputPath, lines.join("\n"));
  console.log(`Matriz: ${rows.length} landings.`);
  console.log(`Informe: ${outputPath}`);
}

main();
