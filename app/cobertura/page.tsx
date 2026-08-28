import type { Metadata } from "next";
import Link from "next/link";

import { ArrowRight, MapPin, PhoneCall } from "@/components/icons";
import { SocialProofLinksSection } from "@/components/SocialProofLinksSection";
import { getAllComunaLandings } from "@/lib/comuna-landings";
import { buildCanonicalUrl, createWhatsAppUrl } from "@/lib/site-config";
import { getZonaSlugs, getZonaBySlug } from "@/lib/zonas-detalle";

export const metadata: Metadata = {
  title: "Cobertura Hidrourgencias | Comunas y sectores en Valparaiso",
  description:
    "Cobertura territorial de Hidrourgencias SpA para destape de alcantarillado, hidrojet y urgencias sanitarias en comunas y sectores de la Region de Valparaiso.",
  alternates: {
    canonical: buildCanonicalUrl("/cobertura"),
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function CoberturaPage() {
  const comunas = getAllComunaLandings();
  const zonas = getZonaSlugs()
    .map((slug) => getZonaBySlug(slug))
    .filter((zona): zona is NonNullable<ReturnType<typeof getZonaBySlug>> => Boolean(zona));

  return (
    <main className="mx-auto min-h-screen max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
      <div className="mb-6">
        <Link href="/" className="inline-flex items-center text-sm font-semibold text-sky-700 hover:text-sky-800">
          {"\u2190"} Volver al inicio
        </Link>
      </div>

      <section className="rounded-[2rem] border border-sky-200 bg-white p-7 shadow-md sm:p-10">
        <p className="text-xs font-black uppercase tracking-[0.2em] text-sky-700">Cobertura territorial</p>
        <h1 className="mt-3 max-w-4xl text-4xl font-black tracking-tight text-slate-950 sm:text-5xl">
          Comunas y sectores donde Hidrourgencias atiende urgencias sanitarias
        </h1>
        <p className="mt-5 max-w-4xl text-base font-semibold leading-8 text-slate-700 sm:text-lg">
          Revisa cobertura por comuna, sector y zona publicada. Si tu ubicacion no aparece, consulta factibilidad por
          WhatsApp con antecedentes del inmueble.
        </p>
        <a
          href={createWhatsAppUrl("Hola Hidrourgencias. Necesito consultar cobertura sanitaria para mi direccion.")}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-6 inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-emerald-500 px-6 py-3 text-sm font-black text-white transition hover:-translate-y-0.5 hover:bg-emerald-600"
        >
          <PhoneCall className="h-4 w-4" />
          Consultar cobertura por WhatsApp
        </a>
      </section>

      <section className="mt-9 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {comunas.map((landing) => (
          <Link
            key={landing.slug}
            href={`/${landing.slug}`}
            className="group rounded-3xl border border-sky-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
          >
            <MapPin className="h-6 w-6 text-sky-700" />
            <h2 className="mt-3 text-xl font-black text-slate-950">{landing.comuna}</h2>
            <p className="mt-2 text-sm font-semibold leading-7 text-slate-700">{landing.h1}</p>
            <span className="brand-blue-soft-cta mt-4 inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-black transition">
              Ver cobertura
              <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
            </span>
          </Link>
        ))}
      </section>

      <section className="mt-9 rounded-3xl border border-slate-200 bg-slate-50 p-6 sm:p-8">
        <h2 className="text-2xl font-black text-slate-950">Sectores con cobertura publicada</h2>
        <div className="mt-5 flex flex-wrap gap-2">
          {zonas.map((zona) => (
            <Link key={zona.slug} href={`/zona/${zona.slug}`} className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-800 transition hover:border-sky-300 hover:text-sky-900">
              {zona.nombre}, {zona.comuna}
            </Link>
          ))}
        </div>
      </section>

      <SocialProofLinksSection className="mt-9" context="cobertura" />
    </main>
  );
}
