import { readdir } from "node:fs/promises";
import { extname, join } from "node:path";

import Image from "next/image";

const GALERIA_DIR = join(process.cwd(), "public", "galeria");
const GALLERY_WHATSAPP_URL =
  "https://wa.me/56940918672?text=Necesito%20destape%20urgente%20de%20alcantarillado%2024/7%20en%20Vi%C3%B1a%20del%20Mar";

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

      <div className="mt-7 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {images.map((imageName, index) => (
          <article key={imageName} className="group relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-900">
            <div className="relative aspect-[4/3]">
              <Image
                src={`/galeria/${encodeURIComponent(imageName)}`}
                alt={`destape de alcantarillado con hidrojet en ${comuna} - evidencia ${index + 1}`}
                fill
                sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                className="object-cover transition duration-500 group-hover:scale-110"
              />
            </div>

            <div className="absolute inset-0 flex items-end bg-[linear-gradient(180deg,rgba(2,6,23,0.08)_0%,rgba(2,6,23,0.85)_100%)] p-4 opacity-100 transition md:opacity-0 md:group-hover:opacity-100">
              <a
                href={GALLERY_WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full rounded-xl bg-emerald-500 px-4 py-2.5 text-center text-sm font-bold text-white transition hover:bg-emerald-600"
              >
                Solicitar atencion por WhatsApp
              </a>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
