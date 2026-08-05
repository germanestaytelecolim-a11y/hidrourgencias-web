import type { Metadata } from "next";
import Link from "next/link";

import zoneAttributions from "@/public/images/zonas/attribution.json";
import { buildCanonicalUrl } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Créditos de imágenes",
  description: "Atribuciones y licencias de las fotografías territoriales utilizadas por Hidrourgencias SpA.",
  alternates: {
    canonical: buildCanonicalUrl("/creditos-imagenes"),
  },
  robots: {
    index: false,
    follow: true,
    googleBot: {
      index: false,
      follow: true,
    },
  },
};

export default function ImageCreditsPage() {
  return (
    <main className="bg-white text-slate-900">
      <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        <header className="max-w-3xl border-b border-slate-200 pb-8">
          <p className="text-sm font-bold uppercase text-sky-700">Procedencia y licencias</p>
          <h1 className="mt-3 text-4xl font-extrabold text-slate-950">Créditos de imágenes</h1>
          <p className="mt-4 text-base leading-7 text-slate-700">
            Esta página reúne la atribución de las fotografías territoriales publicadas en las landings de zona. Cada
            registro identifica la obra, su autoría, la fuente original, la licencia aplicable y las modificaciones
            realizadas para su uso web.
          </p>
        </header>

        <ol className="divide-y divide-slate-200">
          {zoneAttributions.map((credit) => (
            <li key={credit.slug} className="py-8">
              <article aria-labelledby={`credito-${credit.slug}`}>
                <h2 id={`credito-${credit.slug}`} className="text-xl font-extrabold text-slate-950">
                  {credit.commonsTitle}
                </h2>
                <dl className="mt-5 grid gap-x-8 gap-y-4 text-sm sm:grid-cols-[11rem_1fr]">
                  <dt className="font-bold text-slate-950">Archivo publicado</dt>
                  <dd className="break-all text-slate-700">{credit.filename}</dd>

                  <dt className="font-bold text-slate-950">Autor o atribución</dt>
                  <dd className="text-slate-700">{credit.author}</dd>

                  <dt className="font-bold text-slate-950">Fuente original</dt>
                  <dd>
                    <a
                      href={credit.sourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-semibold text-sky-800 underline underline-offset-4"
                    >
                      Ver ficha original en Wikimedia Commons
                    </a>
                  </dd>

                  <dt className="font-bold text-slate-950">Licencia</dt>
                  <dd>
                    <a
                      href={credit.licenseUrl}
                      target="_blank"
                      rel="license noopener noreferrer"
                      className="font-semibold text-sky-800 underline underline-offset-4"
                    >
                      {credit.license}
                    </a>
                  </dd>

                  <dt className="font-bold text-slate-950">Modificaciones</dt>
                  <dd className="text-slate-700">{credit.modifications}</dd>

                  <dt className="font-bold text-slate-950">Landing donde se utiliza</dt>
                  <dd>
                    <Link href={credit.landing} className="font-semibold text-sky-800 underline underline-offset-4">
                      {credit.landing}
                    </Link>
                  </dd>
                </dl>
              </article>
            </li>
          ))}
        </ol>
      </div>
    </main>
  );
}
