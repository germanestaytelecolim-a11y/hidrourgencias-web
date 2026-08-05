import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

import sharp from "sharp";

type ExistingSource = {
  slug: string;
  sourceType: "project-archive";
  source: string;
  position?: "center" | "north" | "south";
};

type GeneratedSource = {
  slug: string;
  sourceType: "imagegen";
  sourceEnv: string;
  promptSummary: string;
};

type ServiceSource = ExistingSource | GeneratedSource;

const serviceSources: ServiceSource[] = [
  {
    slug: "reparacion-tuberias-hdpe",
    sourceType: "imagegen",
    sourceEnv: "VISUAL_HDPE_SOURCE",
    promptSummary: "Electrofusión de tubería HDPE genérica en entorno técnico controlado, sin marcas.",
  },
  {
    slug: "motobombas-extraccion-aguas",
    sourceType: "project-archive",
    source: "public/galeria/destape-alcantarillado-vina-del-mar-6.jpg",
    position: "center",
  },
  {
    slug: "destape-alcantarillado",
    sourceType: "project-archive",
    source: "public/galeria/destape-alcantarillado-vina-del-mar-9.jpg",
  },
  {
    slug: "destape-artefactos-sanitarios",
    sourceType: "project-archive",
    source: "public/galeria/destape-alcantarillado-vina-del-mar-8.jpg",
    position: "center",
  },
  {
    slug: "destape-camaras-inspeccion",
    sourceType: "project-archive",
    source: "public/galeria/destape-alcantarillado-vina-del-mar-21.jpg",
  },
  {
    slug: "hidrojet",
    sourceType: "project-archive",
    source: "public/galeria/destape-alcantarillado-vina-del-mar-3.jpg",
  },
  {
    slug: "destape-verticales",
    sourceType: "project-archive",
    source: "public/galeria/destape-alcantarillado-vina-del-mar-20.jpg",
  },
  {
    slug: "destape-horizontales",
    sourceType: "project-archive",
    source: "public/galeria/destape-alcantarillado-vina-del-mar-16.jpg",
    position: "north",
  },
  {
    slug: "destape-edificios",
    sourceType: "project-archive",
    source: "public/galeria/destape-alcantarillado-vina-del-mar-1.jpg",
  },
  {
    slug: "mantencion-preventiva-redes",
    sourceType: "project-archive",
    source: "public/galeria/destape-alcantarillado-vina-del-mar-5.jpg",
    position: "center",
  },
  {
    slug: "limpieza-higienizacion-sanitizacion",
    sourceType: "imagegen",
    sourceEnv: "VISUAL_SANITIZATION_SOURCE",
    promptSummary: "Técnico con EPP sanitizando un recinto utilitario genérico, sin marcas ni ubicación real.",
  },
  {
    slug: "limpieza-domicilios-recuperacion-espacios",
    sourceType: "imagegen",
    sourceEnv: "VISUAL_RECOVERY_SOURCE",
    promptSummary: "Recinto utilitario recuperado tras extracción de agua, con revisión final de humedad.",
  },
  {
    slug: "limpieza-fachadas-hidrolavado-superficies",
    sourceType: "imagegen",
    sourceEnv: "VISUAL_FACADE_SOURCE",
    promptSummary: "Hidrolavado profesional de fachada genérica con control de escurrimiento y sin marcas.",
  },
  {
    slug: "extraccion-aguas-estanques-piscinas",
    sourceType: "project-archive",
    source: "public/galeria/destape-alcantarillado-vina-del-mar-17.jpg",
  },
  {
    slug: "asesoria-mantenimiento-integral-redes-sanitarias",
    sourceType: "imagegen",
    sourceEnv: "VISUAL_ADVISORY_SOURCE",
    promptSummary: "Profesional revisando planos sanitarios y un informe digital genérico, sin cliente real.",
  },
  {
    slug: "analisis-tecnico-propiedad-redes-sanitarias",
    sourceType: "imagegen",
    sourceEnv: "VISUAL_DIAGNOSTIC_SOURCE",
    promptSummary: "Videoinspección CCTV genérica de una red sanitaria con monitor y cámara sin marcas.",
  },
];

const outputDirectory = join(process.cwd(), "public", "images", "servicios", "heroes");
const manifestPath = join(outputDirectory, "attribution.json");

async function main() {
  mkdirSync(outputDirectory, { recursive: true });
  const existingManifest = existsSync(manifestPath)
    ? (JSON.parse(readFileSync(manifestPath, "utf8")) as Array<Record<string, unknown>>)
    : [];
  const manifest = [];

  for (const source of serviceSources) {
    const outputPath = join(outputDirectory, `${source.slug}.webp`);
    const inputPath = source.sourceType === "project-archive" ? join(process.cwd(), source.source) : process.env[source.sourceEnv];

    if (!inputPath || !existsSync(inputPath)) {
      if (source.sourceType === "imagegen" && existsSync(outputPath)) {
        const previousEntry = existingManifest.find((entry) => entry.slug === source.slug);
        if (previousEntry) {
          manifest.push(previousEntry);
          continue;
        }
      }
      const missingSource = source.sourceType === "imagegen" ? source.sourceEnv : source.source;
      throw new Error(`No existe la fuente para ${source.slug}: ${inputPath ?? missingSource}`);
    }

    await sharp(inputPath)
      .rotate()
      .resize(1800, 1200, {
        fit: "cover",
        position: source.sourceType === "project-archive" && source.position ? source.position : sharp.strategy.attention,
      })
      .webp({ quality: 76, effort: 6 })
      .toFile(outputPath);

    manifest.push(
      source.sourceType === "project-archive"
        ? {
            slug: source.slug,
            file: `/images/servicios/heroes/${source.slug}.webp`,
            sourceType: source.sourceType,
            rightsStatus: "corporate-owned",
            owner: "Hidrourgencias SpA",
            source: "archivo fotográfico operativo corporativo",
            commercialUseAuthorized: true,
            confirmedBy: "Germán Estay León",
            confirmationDate: "2026-08-05",
            usageScope: "sitio web oficial y piezas digitales corporativas",
            originalFilename: source.source.split("/").at(-1),
            derivativeFilename: `${source.slug}.webp`,
            license: "Uso comercial autorizado por Hidrourgencias SpA para su sitio web oficial y piezas digitales corporativas.",
            modifications:
              "Recorte 3:2 con ajuste de encuadre, redimensionado, optimización y conversión WebP para uso web.",
            notes: "Fotografía operativa real; no corresponde a recurso generado.",
            privacyReview: {
              reviewedAt: "2026-08-05",
              result: "approved",
              findings:
                "Sin rostros identificables de terceros, patentes legibles, direcciones particulares, documentos, datos personales, clientes, pantallas privadas ni incumplimientos evidentes de EPP.",
            },
          }
        : {
            slug: source.slug,
            file: `/images/servicios/heroes/${source.slug}.webp`,
            sourceType: source.sourceType,
            status: "generated",
            generator: "OpenAI ImageGen",
            generatedFor: "Hidrourgencias",
            generatedAt: "2026-08-05",
            promptSummary: source.promptSummary,
            integrityStatement:
              "Recurso original sin marcas ni logotipos visibles; las personas y los escenarios son sintéticos y no representan personal, clientes ni ubicaciones reales.",
            license: "Recurso original generado para este proyecto; sujeto a los términos de uso de OpenAI.",
            modifications: "Redimensionado y optimización WebP para uso web.",
          },
    );
    console.log(`Generada ${source.slug}`);
  }

  writeFileSync(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
