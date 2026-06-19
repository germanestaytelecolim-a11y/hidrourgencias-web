import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ExternalLink, PhoneCall } from "lucide-react";
import { notFound } from "next/navigation";

import { ServiceTermsNotice } from "@/components/service-terms";
import { getAllBlogPosts } from "@/lib/blog-data";
import { getAllComunaLandings } from "@/lib/comuna-landings";
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

  const relatedServices =
    servicio.slug === "limpieza-higienizacion-sanitizacion"
      ? getAllServicios().filter((item) =>
          ["destape-alcantarillado", "hidrojet", "mantencion-preventiva-redes", "destape-camaras-inspeccion"].includes(
            item.slug,
          ),
        )
      : getAllServicios().filter((item) => item.slug !== servicio.slug).slice(0, 4);
  const relatedComunas = getAllComunaLandings().slice(0, 8);
  const relatedPosts = getAllBlogPosts().slice(0, 4);
  const relatedZones = getZonaSlugs()
    .slice(0, 7)
    .map((zoneSlug) => getZonaBySlug(zoneSlug))
    .filter((zone): zone is NonNullable<ReturnType<typeof getZonaBySlug>> => zone !== undefined);
  const serviceMessage = createWhatsAppUrl(`Necesito ${servicio.navLabel.toLowerCase()} en la Region de Valparaiso.`);
  const callHref = siteConfig.phoneHref;

  return (
    <main className="mx-auto min-h-screen max-w-6xl px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
      <div className="mb-6">
        <Link href="/" className="inline-flex items-center text-sm font-semibold text-sky-700 hover:text-sky-800">
          {"\u2190"} Volver al inicio
        </Link>
      </div>

      <section className="overflow-hidden rounded-[2rem] border border-sky-200/30 bg-[linear-gradient(130deg,#082f4f_0%,#08385f_52%,#0e5f86_100%)] text-white shadow-[0_28px_65px_-30px_rgba(2,6,23,0.8)]">
        <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr] lg:items-stretch">
          <div className="p-7 sm:p-10">
            <p className="inline-flex rounded-full border border-white/30 bg-white/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-sky-100">
              Servicio especializado
            </p>
            <h1 className="mt-4 max-w-4xl text-4xl font-extrabold tracking-tight sm:text-5xl">{servicio.h1}</h1>
            <p className="mt-5 max-w-4xl text-base leading-8 text-slate-100 sm:text-lg">{servicio.summary}</p>
            <ServiceTermsNotice tone="dark" className="mt-7 max-w-4xl" />
            <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
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
            </div>
          </div>
          <div className="relative min-h-[260px] lg:min-h-full">
            <Image
              src={servicio.image}
              alt={servicio.h1}
              fill
              sizes="(min-width: 1024px) 46vw, 100vw"
              className="object-cover"
              preload
              fetchPriority="high"
              loading="eager"
              decoding="async"
            />
            <div className="absolute inset-0 bg-slate-950/20" />
          </div>
        </div>
      </section>

      <section className="mt-9 grid gap-6 lg:grid-cols-2">
        <article className="brand-card rounded-3xl p-6 sm:p-8">
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-950 sm:text-4xl">Metodologia de trabajo</h2>
          <div className="mt-5 space-y-3">
            {servicio.methodology.map((step) => (
              <p key={step} className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm leading-7 text-slate-700">
                {step}
              </p>
            ))}
          </div>
        </article>

        <article className="brand-card rounded-3xl p-6 sm:p-8">
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-950 sm:text-4xl">Equipos utilizados</h2>
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
        <h2 className="text-3xl font-extrabold tracking-tight text-slate-950 sm:text-4xl">Tipos de obstruccion y fallas atendidas</h2>
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
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-950 sm:text-4xl">Beneficios del servicio</h2>
          <div className="mt-5 space-y-3">
            {servicio.benefits.map((benefit) => (
              <p key={benefit} className="rounded-xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm font-semibold leading-7 text-slate-800">
                {benefit}
              </p>
            ))}
          </div>
        </article>

        <article className="brand-card rounded-3xl p-6 sm:p-8">
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-950 sm:text-4xl">Cuando solicitarlo</h2>
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
