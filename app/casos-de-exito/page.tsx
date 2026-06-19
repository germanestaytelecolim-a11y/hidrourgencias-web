import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, PhoneCall } from "lucide-react";

import { CaseStudyHub } from "@/components/CaseStudyHub";
import { CaseStudyTrustLogos } from "@/components/CaseStudyTrustLogos";
import { ServiceTermsNotice } from "@/components/service-terms";
import { caseStudyCategoryFilters, caseStudyServiceFilters, getAllCaseStudies } from "@/lib/case-studies";
import { buildCanonicalUrl, createWhatsAppUrl, siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Casos de éxito de destape, hidrojet y mantención sanitaria",
  description:
    "Biblioteca SEO de casos de éxito de Hidrourgencias SpA: destape de alcantarillado, hidrojet, verticales, horizontales, mantención preventiva, videoinspección y emergencias sanitarias.",
  alternates: {
    canonical: buildCanonicalUrl("/casos-de-exito"),
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function CasosDeExitoPage() {
  const cases = getAllCaseStudies();
  const collectionSchema = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Casos de éxito de Hidrourgencias SpA",
    description: metadata.description,
    url: buildCanonicalUrl("/casos-de-exito"),
    publisher: {
      "@type": "LocalBusiness",
      name: siteConfig.name,
      telephone: siteConfig.phoneDisplay,
      url: siteConfig.siteUrl,
    },
    mainEntity: cases.slice(0, 35).map((caseStudy) => ({
      "@type": "Article",
      headline: caseStudy.h1,
      url: buildCanonicalUrl(`/casos-de-exito/${caseStudy.slug}`),
      about: caseStudy.serviceType,
    })),
  }).replace(/</g, "\\u003c");

  return (
    <main className="mx-auto min-h-screen max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: collectionSchema }} />

      <div className="mb-6">
        <Link href="/" className="inline-flex items-center text-sm font-semibold text-sky-700 hover:text-sky-800">
          {"\u2190"} Volver al inicio
        </Link>
      </div>

      <section className="relative overflow-hidden rounded-[2rem] border border-sky-200/30 bg-[linear-gradient(130deg,#082f4f_0%,#08385f_52%,#0e5f86_100%)] text-white shadow-[0_28px_65px_-30px_rgba(2,6,23,0.8)]">
        <Image
          src="/images/hero-urgencia.jpg"
          alt="Casos de éxito de Hidrourgencias SpA en servicios sanitarios"
          fill
          preload
          fetchPriority="high"
          loading="eager"
          decoding="async"
          sizes="(min-width: 1280px) 1200px, 100vw"
          className="object-cover opacity-20"
        />
        <div className="absolute inset-0 bg-slate-950/45" />
        <div className="relative p-7 sm:p-10 lg:p-12">
          <p className="inline-flex rounded-full border border-white/30 bg-white/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-sky-100">
            Biblioteca SEO de trabajos ejecutados
          </p>
          <h1 className="mt-4 max-w-5xl text-4xl font-extrabold tracking-tight sm:text-5xl">
            Casos de éxito en destape de alcantarillado, hidrojet y mantención sanitaria
          </h1>
          <p className="mt-5 max-w-4xl text-base leading-8 text-slate-100 sm:text-lg">
            Hub técnico con servicios ejecutados para edificios, hoteles, restaurantes, instituciones, universidades,
            condominios, empresas y viviendas en Viña del Mar, Valparaíso, Concón, Quilpué, Villa Alemana y la Región de Valparaíso.
          </p>
          <ServiceTermsNotice tone="dark" className="mt-7 max-w-4xl" />
          <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <a
              href={createWhatsAppUrl("Hola, necesito solicitar un servicio similar a un caso de éxito de Hidrourgencias SpA.")}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-emerald-500 px-6 py-3 text-sm font-bold text-white transition hover:-translate-y-1 hover:bg-emerald-600"
            >
              <PhoneCall className="h-4 w-4" />
              Solicitar servicio similar
            </a>
            <a
              href={siteConfig.phoneHref}
              className="inline-flex items-center justify-center gap-2 rounded-full border border-white/35 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
            >
              <PhoneCall className="h-4 w-4" />
              Llamar ahora
            </a>
          </div>
        </div>
      </section>

      <section className="mt-9">
        <CaseStudyHub cases={cases} categories={caseStudyCategoryFilters} services={caseStudyServiceFilters} />
      </section>

      <section className="mt-9">
        <CaseStudyTrustLogos />
      </section>

      <section className="mt-9 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <h2 className="text-2xl font-extrabold tracking-tight text-slate-950 sm:text-3xl">
          Convierte un problema sanitario en una decisión técnica documentada
        </h2>
        <p className="mt-4 max-w-4xl text-sm leading-8 text-slate-700 sm:text-base">
          Cada caso permite entender síntomas, metodología, equipamiento y recomendaciones. Este enfoque fortalece la
          trazabilidad técnica y facilita solicitar evaluación, mantención preventiva o respuesta 24/7.
        </p>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          <Link
            href="/#servicios"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-[#08385f] px-6 py-3 text-sm font-bold text-white transition hover:bg-[#0e5f86]"
          >
            Ver servicios
            <ArrowRight className="h-4 w-4" />
          </Link>
          <a
            href={createWhatsAppUrl("Hola, necesito cotizar mantención preventiva sanitaria con Hidrourgencias SpA.")}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center rounded-full bg-emerald-500 px-6 py-3 text-sm font-bold text-white transition hover:bg-emerald-600"
          >
            Cotizar mantención preventiva
          </a>
        </div>
      </section>
    </main>
  );
}
