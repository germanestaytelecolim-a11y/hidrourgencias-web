"use client";

import { useState } from "react";
import Image from "next/image";

import { trackCommercialEvent } from "@/lib/conversion";

type EvidenceGalleryProps = {
  images: string[];
  commune: string;
};

export function EvidenceGallery({ images, commune }: EvidenceGalleryProps) {
  const [expanded, setExpanded] = useState(false);
  const visibleImages = expanded ? images : images.slice(0, 6);

  const renderImage = (imageName: string, index: number) => (
    <article
      key={imageName}
      className="group relative overflow-hidden rounded-xl border border-slate-800 bg-slate-900"
      data-evidence-item
    >
      <div className="relative aspect-[4/3]">
        <Image
          src={`/galeria/${encodeURIComponent(imageName)}`}
          alt={`destape de alcantarillado con hidrojet en ${commune} - evidencia ${index + 1}`}
          fill
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          loading={index < 3 ? "eager" : "lazy"}
          className="object-cover transition duration-500 group-hover:scale-105"
        />
      </div>
      <div className="border-t border-slate-800 px-4 py-3">
        <p className="text-xs font-bold uppercase text-sky-100">
          Evidencia técnica {String(index + 1).padStart(2, "0")}
        </p>
      </div>
    </article>
  );

  return (
    <>
      <div className="mt-7 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3" data-evidence-gallery>
        {visibleImages.map(renderImage)}
      </div>
      {images.length > 6 ? (
        <button
          type="button"
          aria-expanded={expanded}
          data-evidence-toggle
          onClick={() => {
            setExpanded((value) => !value);
            trackCommercialEvent("expand_evidence", { commune, cta_location: "evidence_gallery" });
          }}
          className="mt-6 inline-flex min-h-11 items-center justify-center rounded-lg border border-sky-300 bg-white px-5 py-3 text-sm font-black text-sky-950 transition hover:bg-sky-50 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-sky-300"
        >
          {expanded ? "Mostrar menos trabajos" : "Ver más trabajos"}
        </button>
      ) : null}
    </>
  );
}
