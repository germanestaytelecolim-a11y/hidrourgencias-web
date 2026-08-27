import type { Metadata } from "next";
import Link from "next/link";
import { ExternalLink, PhoneCall } from "lucide-react";
import { notFound } from "next/navigation";

import { LandingVisualHero } from "@/components/landing-visual-hero";
import { ConversionExperience } from "@/components/conversion-experience";
import { ServiceTermsNotice } from "@/components/service-terms";
import { getAllBlogPosts } from "@/lib/blog-data";
import { getAllComunaLandings } from "@/lib/comuna-landings";
import { getServiceVisualProfile } from "@/lib/landing-visuals";
import { GOOGLE_REVIEWS_URL, createWhatsAppUrl, siteConfig } from "@/lib/site-config";
import { buildServicioMetadata, getAllServicios, getServicioBySlug, getServicioSlugs } from "@/lib/servicios";
import { getZonaBySlug, getZonaSlugs } from "@/lib/zonas-detalle";

type Props = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return getServicioSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const servicio = getServicioBySlug(slug);

  if (!servicio) {
    return {
      title: "Servicio no encontrado",
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  return buildServicioMetadata(servicio);
}

export default async function ServicioPage({ params }: Props) {
  const { slug } = await params;
  const servicio = getServicioBySlug(slug);

  if (!servicio) {
    notFound();
  }

  const isPrepurchaseService = servicio.slug === "analisis-tecnico-propiedad-redes-sanitarias";
  const prepurchaseRelatedServiceSlugs = [
    "destape-camaras-inspeccion",
    "destape-alcantarillado",
    "hidrojet",
    "mantencion-preventiva-redes",
  ];
  const prepurchaseRelatedPostSlugs = [
    "que-revisar-alcantarillado-antes-comprar-propiedad",
    "vicios-ocultos-sanitarios-alcantarillado-desagues",
    "videoinspeccion-sanitaria-antes-invertir-propiedad",
  ];
  const relatedServices = isPrepurchaseService
    ? prepurchaseRelatedServiceSlugs
        .map((serviceSlug) => getServicioBySlug(serviceSlug))
        .filter((item): item is NonNullable<ReturnType<typeof getServicioBySlug>> => item !== undefined)
    : servicio.slug === "limpieza-higienizacion-sanitizacion"
      ? getAllServicios().filter((item) =>
          ["destape-alcantarillado", "hidrojet", "mantencion-preventiva-redes", "destape-camaras-inspeccion"].includes(
            item.slug,
          ),
        )
      : getAllServicios().filter((item) => item.slug !== servicio.slug).slice(0, 4);
  const relatedComunas = getAllComunaLandings().slice(0, 8);
  const relatedPosts = isPrepurchaseService
    ? prepurchaseRelatedPostSlugs
        .map((postSlug) => getAllBlogPosts().find((post) => post.slug === postSlug))
        .filter((post): post is NonNullable<ReturnType<typeof getAllBlogPosts>[number]> => post !== undefined)
    : getAllBlogPosts().slice(0, 4);
  const relatedZones = getZonaSlugs()
    .slice(0, 7)
    .map((zoneSlug) => getZonaBySlug(zoneSlug))
    .filter((zone): zone is NonNullable<ReturnType<typeof getZonaBySlug>> => zone !== undefined);
  const serviceMessage = createWhatsAppUrl(`Necesito ${servicio.navLabel.toLowerCase()} en la Region de Valparaiso.`);
  const callHref = siteConfig.phoneHref;
  const visualProfile = getServiceVisualProfile(servicio.slug);
  const isPilotService = ["destape-alcantarillado", "hidrojet"].includes(servicio.slug);
  const serviceSchema = isPrepurchaseService
    ? JSON.stringify({
        "@context": "https://schema.org",
        "@type": "Service",
        name: "Revisión sanitaria precompra, preventa y arriendo",
        serviceType: "Videoinspección sanitaria y análisis técnico de redes de alcantarillado y desagües",
        description:
          "Servicio de revisión sanitaria para evaluar redes de alcantarillado, cámaras, desagües y condiciones críticas antes de comprar, vender o arrendar una propiedad.",
        provider: {
          "@type": "LocalBusiness",
          name: "Hidrourgencias SpA",
          url: "https://hidrourgencias.cl",
        },
        areaServed: [
          "Viña del Mar",
          "Valparaíso",
          "Concón",
          "Quilpué",
          "Villa Alemana",
          "Limache",
          "Quillota",
          "Región de Valparaíso",
        ],
        url: "https://hidrourgencias.cl/servicios/analisis-tecnico-propiedad-redes-sanitarias",
      }).replace(/</g, "\\u003c")
    : "";

  if (!visualProfile) {
    throw new Error(`Falta perfil visual para el servicio ${servicio.slug}.`);
  }

  return (
    <main className="mx-auto min-h-screen max-w-6xl px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
      {serviceSchema ? <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serviceSchema }} /> : null}
      <div className="mb-6">
        <Link href="/" className="inline-flex items-center text-sm font-semibold text-sky-700 hover:text-sky-800">
          {"\u2190"} Volver al inicio
        </Link>
      </div>

      <LandingVisualHero
        profile={visualProfile}
        eyebrow="Servicio especializado"
        title={servicio.h1}
        actions={
          <>
              <a
                href={serviceMessage}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center rounded-full bg-emerald-500 px-6 py-3 text-sm font-bold text-white transition hover:bg-emerald-600"
              >
                WhatsApp servicio inmediato
              </a>
              <a
                href={callHref}
                className="inline-flex items-center justify-center gap-2 rounded-full border border-white/35 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                <PhoneCall className="h-4 w-4" />
                Llamar {siteConfig.phoneDisplay}
              </a>
              <Link
                href="/blog"
                className="inline-flex items-center justify-center rounded-full border border-white/35 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                Ver guias tecnicas del blog
              </Link>
              <a
                href={GOOGLE_REVIEWS_URL}
                target="_blank"
                rel="noopener noreferrer nofollow"
                className="brand-review-link rounded-full px-6 py-3 text-sm font-bold"
              >
                <ExternalLink className="h-4 w-4 text-sky-600" />
                Opiniones Google
              </a>
          </>
        }
      >
        <p>{servicio.summary}</p>
        <ServiceTermsNotice tone="dark" className="mt-7 max-w-4xl" />
      </LandingVisualHero>

      {isPilotService ? (
        <ConversionExperience context={{ service: servicio.navLabel, sourcePath: `/servicios/${servicio.slug}` }} />
      ) : null}

      <section className="mt-9 grid gap-6 lg:grid-cols-2">
        <article className="brand-card rounded-3xl p-6 sm:p-8">
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-950 sm:text-4xl">
            {isPrepurchaseService ? "Qué entrega Hidrourgencias" : "Metodologia de trabajo"}
          </h2>
          <div className="mt-5 space-y-3">
            {servicio.methodology.map((step) => (
              <p key={step} className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm leading-7 text-slate-700">
                {step}
              </p>
            ))}
          </div>
        </article>

        <article className="brand-card rounded-3xl p-6 sm:p-8">
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-950 sm:text-4xl">
            {isPrepurchaseService ? "Herramientas de revisión sanitaria" : "Equipos utilizados"}
          </h2>
          <div className="mt-5 space-y-3">
            {servicio.equipment.map((equipment) => (
              <p key={equipment} className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm leading-7 text-slate-700">
                {equipment}
              </p>
            ))}
          </div>
        </article>
      </section>

      <section className="brand-card mt-9 rounded-3xl p-6 sm:p-8">
        <h2 className="text-3xl font-extrabold tracking-tight text-slate-950 sm:text-4xl">
          {isPrepurchaseService ? "Qué evaluamos en la revisión sanitaria" : "Tipos de obstruccion y fallas atendidas"}
        </h2>
        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          {servicio.obstructionTypes.map((issue) => (
            <p key={issue} className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold leading-7 text-slate-700">
              {issue}
            </p>
          ))}
        </div>
      </section>

      <section className="mt-9 grid gap-6 lg:grid-cols-2">
        <article className="brand-card rounded-3xl p-6 sm:p-8">
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-950 sm:text-4xl">
            {isPrepurchaseService ? "Para quién sirve esta evaluación" : "Beneficios del servicio"}
          </h2>
          <div className="mt-5 space-y-3">
            {servicio.benefits.map((benefit) => (
              <p key={benefit} className="rounded-xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm font-semibold leading-7 text-slate-800">
                {benefit}
              </p>
            ))}
          </div>
        </article>

        <article className="brand-card rounded-3xl p-6 sm:p-8">
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-950 sm:text-4xl">
            {isPrepurchaseService ? "Cuándo conviene solicitar este servicio" : "Cuando solicitarlo"}
          </h2>
          <div className="mt-5 space-y-3">
            {servicio.whenToRequest.map((item) => (
              <p key={item} className="rounded-xl border border-sky-100 bg-sky-50 px-4 py-3 text-sm font-semibold leading-7 text-slate-800">
                {item}
              </p>
            ))}
          </div>
        </article>
      </section>

      <section className="brand-card mt-9 rounded-3xl p-6 sm:p-8">
        <h2 className="text-3xl font-extrabold tracking-tight text-slate-950 sm:text-4xl">Otros servicios relacionados</h2>
        <div className="mt-5 flex flex-wrap gap-2">
          {relatedServices.map((item) => (
            <Link
              key={item.slug}
              href={`/servicios/${item.slug}`}
              className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-semibold text-slate-800 transition hover:border-sky-300 hover:bg-white hover:text-sky-800"
            >
              {item.navLabel}
            </Link>
          ))}
        </div>
      </section>

      <section className="brand-card mt-9 rounded-3xl p-6 sm:p-8">
        <h2 className="text-3xl font-extrabold tracking-tight text-slate-950 sm:text-4xl">Cobertura por comuna</h2>
        <div className="mt-5 flex flex-wrap gap-2">
          {relatedComunas.map((item) => (
            <Link
              key={item.slug}
              href={`/${item.slug}`}
              className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-semibold text-slate-800 transition hover:border-sky-300 hover:bg-white hover:text-sky-800"
            >
              {item.comuna}
            </Link>
          ))}
        </div>
      </section>

      <section className="mt-9 grid gap-6 lg:grid-cols-2">
        <article className="brand-card rounded-3xl p-6 sm:p-8">
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-950 sm:text-4xl">Zonas premium relacionadas</h2>
          <p className="mt-4 text-sm leading-7 text-slate-700 sm:text-base">
            Accede a paginas por zona con contexto territorial, CTA directo y cobertura cercana para este tipo de servicio.
          </p>
          <div className="mt-5 grid gap-2">
            {relatedZones.map((zone) => (
              <Link
                key={zone.slug}
                href={`/zona/${zone.slug}`}
                className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-800 transition hover:border-sky-300 hover:bg-white hover:text-sky-800"
              >
                {`Destape en ${zone.nombre}, ${zone.comuna}`}
              </Link>
            ))}
          </div>
        </article>

        <article className="brand-card rounded-3xl p-6 sm:p-8">
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-950 sm:text-4xl">Blogs por problema sanitario</h2>
          <p className="mt-4 text-sm leading-7 text-slate-700 sm:text-base">
            Guias tecnicas para reconocer sintomas, decidir cuando solicitar ayuda y prevenir reincidencias en redes sanitarias.
          </p>
          <div className="mt-5 grid gap-2">
            {relatedPosts.map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-800 transition hover:border-sky-300 hover:bg-white hover:text-sky-800"
              >
                {post.h1}
              </Link>
            ))}
          </div>
        </article>
      </section>

      <section className="mt-9 rounded-3xl border border-slate-200 bg-slate-950 p-7 text-white shadow-md sm:p-10">
        <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">Solicita atencion tecnica inmediata</h2>
        <p className="mt-4 max-w-4xl text-sm leading-8 text-slate-200 sm:text-base">
          Coordinamos respuesta 24/7 con enfoque tecnico para clientes residenciales y corporativos en la Region de Valparaiso.
        </p>
        <ServiceTermsNotice tone="dark" className="mt-5 max-w-4xl" />
        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          <a
            href={createWhatsAppUrl(servicio.ctaMessage)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center rounded-full bg-emerald-500 px-6 py-3 text-sm font-bold text-white transition hover:bg-emerald-600"
          >
            WhatsApp para {servicio.navLabel.toLowerCase()}
          </a>
          <a
            href={callHref}
            className="inline-flex items-center justify-center gap-2 rounded-full border border-white/35 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
          >
            <PhoneCall className="h-4 w-4" />
            Llamar ahora
          </a>
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-full border border-white/35 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
          >
            {"\u2190"} Volver al inicio
          </Link>
        </div>
      </section>
    </main>
  );
}
