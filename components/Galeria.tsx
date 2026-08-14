import { readdir } from "node:fs/promises";
import { extname, join } from "node:path";

import { EvidenceGallery } from "@/components/evidence-gallery";

const GALERIA_DIR = join(process.cwd(), "public", "galeria");
const IMAGE_EXTENSIONS = new Set([".jpg", ".jpeg", ".png", ".webp", ".avif"]);

type GaleriaProps = {
  comuna: string;
  className?: string;
};

async function getGaleriaImages() {
  try {
    const entries = await readdir(GALERIA_DIR, { withFileTypes: true });

    return entries
      .filter((entry) => entry.isFile() && IMAGE_EXTENSIONS.has(extname(entry.name).toLowerCase()))
      .map((entry) => entry.name)
      .sort((a, b) => a.localeCompare(b, "es", { numeric: true }));
  } catch {
    return [];
  }
}

export async function Galeria({ comuna, className = "" }: GaleriaProps) {
  const images = await getGaleriaImages();

  if (images.length === 0) {
    return null;
  }

  return (
    <section className={`relative overflow-hidden rounded-[2rem] border border-slate-800 bg-slate-950 p-6 text-white shadow-md sm:p-8 ${className}`}>
      <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
        Trabajos reales de destape de alcantarillado en la Region de Valparaiso
      </h2>
      <p className="mt-4 max-w-4xl text-sm leading-8 text-slate-200 sm:text-base">
        Registro de intervenciones en terreno con hidrojet, diagnostico tecnico y respuesta operativa en contingencias
        sanitarias reales.
      </p>

      <EvidenceGallery images={images} commune={comuna} />
    </section>
  );
}
