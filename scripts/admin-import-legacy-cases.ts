import fs from "node:fs";
import path from "node:path";

import { getAllCaseStudies } from "@/lib/case-studies";
import { listWorkCases, saveWorkCase } from "@/lib/admin/db";
import type { MediaAsset, WorkCase } from "@/lib/admin/types";

function loadEnvFile(filePath: string) {
  if (!fs.existsSync(filePath)) return;
  for (const line of fs.readFileSync(filePath, "utf8").split(/\r?\n/)) {
    const match = line.match(/^([A-Za-z0-9_]+)=(.*)$/);
    if (!match) continue;
    const [, key, rawValue] = match;
    if (process.env[key]) continue;
    const value = rawValue.replace(/^"|"$/g, "");
    if (value && value !== "[SENSITIVE]") process.env[key] = value;
  }
}

function mapService(service: string) {
  const normalized = service
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();

  if (normalized.includes("hidrojet")) return "Hidrojet";
  if (normalized.includes("vertical")) return "Destape de vertical";
  if (normalized.includes("horizontal")) return "Destape de horizontal";
  if (normalized.includes("video")) return "Videoinspección";
  if (normalized.includes("mantencion")) return "Mantención preventiva";
  if (normalized.includes("motobomba") || normalized.includes("extraccion")) return "Extracción de aguas";

  return "Destape de alcantarillado";
}

function mapProperty(categories: readonly string[]) {
  if (categories.includes("Restaurantes")) return "Restaurante";
  if (categories.includes("Edificios")) return "Edificio";
  if (categories.includes("Condominios")) return "Condominio";
  if (categories.includes("Instituciones Públicas") || categories.includes("Universidades")) return "Institución";
  if (categories.includes("Empresas") || categories.includes("Hoteles")) return "Empresa";
  if (categories.includes("Viviendas")) return "Casa";
  return "Otro";
}

function mediaFromCase(caseStudy: ReturnType<typeof getAllCaseStudies>[number]): MediaAsset[] {
  const uniqueImages = Array.from(new Map([{ src: caseStudy.featuredImage, alt: caseStudy.h1 }, ...caseStudy.gallery].map((image) => [image.src, image])).values());
  return uniqueImages.map((image, index) => ({
    id: `legacy-media-${caseStudy.slug}-${index}`,
    type: "image",
    url: image.src,
    caption: image.alt,
    altText: image.alt,
    isCover: index === 0,
    isPublic: true,
    sortOrder: index,
    createdAt: "2020-01-01T00:00:00.000Z",
  }));
}

function toWorkCase(caseStudy: ReturnType<typeof getAllCaseStudies>[number], index: number): WorkCase {
  const date = new Date(Date.UTC(2020, 0, 1 + index)).toISOString().slice(0, 10);
  return {
    id: `legacy-${caseStudy.slug}`,
    legacyId: caseStudy.slug,
    title: caseStudy.title,
    slug: caseStudy.slug,
    status: "published",
    date,
    commune: caseStudy.city === "Región de Valparaíso" ? "Otra" : caseStudy.city,
    sector: caseStudy.client.name,
    privateAddress: "",
    publicLocation: caseStudy.city,
    propertyType: mapProperty(caseStudy.client.categories),
    services: [mapService(caseStudy.serviceType)],
    problem: caseStudy.problem,
    diagnosis: caseStudy.diagnosis,
    intervention: caseStudy.intervention.join("\n"),
    equipment: caseStudy.equipment.join(", "),
    result: caseStudy.result,
    recommendation: caseStudy.recommendations.join("\n"),
    featured: false,
    showInCases: true,
    showInCommune: true,
    showInServices: true,
    showOnHome: false,
    videoMode: "none",
    videoUrl: "",
    origin: "legacy",
    clientName: caseStudy.client.name,
    createdBy: "legacy-import",
    updatedBy: "legacy-import",
    createdAt: `${date}T00:00:00.000Z`,
    updatedAt: `${date}T00:00:00.000Z`,
    publishedAt: `${date}T00:00:00.000Z`,
    media: mediaFromCase(caseStudy),
  };
}

async function main() {
  loadEnvFile(path.join(process.cwd(), ".env.production.local"));
  loadEnvFile(path.join(process.cwd(), ".env.local"));
  (process.env as Record<string, string | undefined>).NODE_ENV = process.env.NODE_ENV || "production";
  process.env.ADMIN_STORAGE_DRIVER = process.env.ADMIN_STORAGE_DRIVER || "postgres";

  const legacyCases = getAllCaseStudies();
  const existing = await listWorkCases();
  const existingIds = new Set(existing.map((workCase) => workCase.id));
  const existingSlugs = new Set(existing.map((workCase) => workCase.slug));
  const report = {
    legacyCases: legacyCases.length,
    imported: 0,
    skippedExisting: 0,
    duplicateSlugs: 0,
    errors: [] as Array<{ slug: string; message: string }>,
  };

  for (const [index, caseStudy] of legacyCases.entries()) {
    const workCase = toWorkCase(caseStudy, index);
    if (existingIds.has(workCase.id)) {
      report.skippedExisting += 1;
      continue;
    }
    if (existingSlugs.has(workCase.slug)) {
      report.duplicateSlugs += 1;
      continue;
    }

    try {
      await saveWorkCase(workCase);
      existingIds.add(workCase.id);
      existingSlugs.add(workCase.slug);
      report.imported += 1;
    } catch (error) {
      report.errors.push({ slug: caseStudy.slug, message: error instanceof Error ? error.message : "Error desconocido" });
    }
  }

  fs.mkdirSync(path.join(process.cwd(), "reports"), { recursive: true });
  fs.writeFileSync(path.join(process.cwd(), "reports", "admin-import-legacy-cases.json"), JSON.stringify(report, null, 2));
  console.log(JSON.stringify(report, null, 2));
  if (report.errors.length) process.exit(1);
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
