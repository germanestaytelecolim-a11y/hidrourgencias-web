import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight, CheckCircle2, ExternalLink, PhoneCall, ShieldCheck, Wrench } from "lucide-react";

import { ServiceTermsNotice } from "@/components/service-terms";
import { getAllBlogPosts } from "@/lib/blog-data";
import { GOOGLE_REVIEWS_URL, createWhatsAppUrl, siteConfig } from "@/lib/site-config";
import {
  buildProgrammaticWhatsAppMessage,
  buildSeoRouteContent,
  getNearbySeoRoutes,
  getServicePagePath,
  type SeoRoute,
} from "@/lib/seo-territorial";
import { stableHash } from "@/lib/seo-content-engine";

type Props = {
  route: SeoRoute;
};

const procedureSteps = [
  "Diagnostico inicial del sintoma, nivel de urgencia y puntos afectados.",
  "Evaluacion de camara, artefacto sanitario o tramo accesible de la red.",
  "Desobstruccion con RIDGID, hidrojet o metodo combinado segun servicio.",
  "Prueba hidraulica para confirmar evacuacion y ausencia de retorno.",
  "Recomendacion preventiva segun causa probable y criticidad del cliente.",
] as const;

const equipmentBenefits: Record<string, string> = {
  "Hidrojet RIDGID KJ-3100":
    "Limpieza hidrodinamica de grasa, sarro, sedimentos y residuos adheridos en tramos con perdida de capacidad.",
  "RIDGID K-1500A":
    "Equipo profesional para colectores principales, camaras, horizontales y obstrucciones severas de mayor diametro.",
  "RIDGID K-50":
    "Equipo compacto para redes interiores, lavamanos, lavaplatos, WC, urinarios y tramos de menor diametro.",
  "Videoinspeccion RIDGID":
    "Diagnostico visual de fisuras, contrapendientes, raices, deformaciones y puntos criticos antes o despues del destape.",
};

function getRelatedBlogPosts(slug: string) {
  const posts = getAllBlogPosts();
  const seed = stableHash(slug);

  return posts
    .map((post, index) => ({ post, score: (index + seed) % posts.length }))
    .sort((a, b) => a.score - b.score)
    .slice(0, 2)
    .map((item) => item.post);
}

export function SeoServiceAreaLanding({ route }: Props) {
  const content = buildSeoRouteContent(route);
  const nearbyRoutes = getNearbySeoRoutes(route, 3);
  const relatedPosts = getRelatedBlogPosts(route.slug);
  const whatsappHref = createWhatsAppUrl(buildProgrammaticWhatsAppMessage(route));
  const servicePath = getServicePagePath(route.service);
  const h1 = `${route.service.nombre} en ${route.sector}, ${route.comuna.comuna} | Atencion 24/7`;
  const problemItems = Array.from(
    new Set([
      ...route.service.problemas,
      "rebalse de aguas servidas",
      "desague lento",
      "retorno por WC",
      "camara saturada",
      "grasa, sarro y sedimentos",
      "perdida de capacidad hidraulica",
    ]),
  ).slice(0, 8);

  const faqSchema = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: content.faq.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  }).replace(/</g, "\\u003c");

  const serviceSchema = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "Service",
    name: h1,
    serviceType: route.service.nombre,
    areaServed: [route.sector, route.comuna.comuna],
    provider: {
      "@type": "LocalBusiness",
      name: siteConfig.name,
      telephone: siteConfig.phoneDisplay,
      url: siteConfig.siteUrl,
    },
    description: `${route.service.nombre} en ${route.sector}, ${route.comuna.comuna}, con equipos RIDGID, hidrojet y atencion 24/7.`,
  }).replace(/</g, "\\u003c");

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: faqSchema }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serviceSchema }} />

      <section className="bg-[linear-gradient(135deg,#082f4f_0%,#08385f_52%,#0e5f86_100%)] text-white">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
          <Link href="/" className="inline-flex items-center gap-2 text-sm font-semibold text-sky-100 hover:text-white">
            <ArrowLeft className="h-4 w-4" />
            Volver al menu principal
          </Link>

          <div className="mt-8 grid gap-8 lg:grid-cols-[1.08fr_0.92fr] lg:items-center">
            <div>
              <p className="inline-flex rounded-full border border-sky-300/35 bg-sky-400/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-sky-100">
                Cobertura hiperlocal 24/7
              </p>
              <h1 className="mt-5 max-w-5xl text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl lg:text-[3.35rem]">
                {h1}
              </h1>
              <div className="mt-6 space-y-5 text-base leading-8 text-slate-100 sm:text-lg">
                {content.introParagraphs.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
              <ServiceTermsNotice tone="dark" className="mt-7 max-w-4xl" />
              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                <a
                  href={whatsappHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-emerald-500 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-emerald-600/30 transition hover:bg-emerald-600"
                >
                  <PhoneCall className="h-4 w-4" />
                  WhatsApp inmediato
                </a>
                <a
                  href={siteConfig.phoneHref}
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-white/30 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
                >
                  <PhoneCall className="h-4 w-4" />
                  Llamar {siteConfig.phoneDisplay}
                </a>
                <Link
                  href="/#servicios"
                  className="inline-flex items-center justify-center rounded-full border border-sky-200/35 bg-sky-900/30 px-6 py-3 text-sm font-semibold text-sky-100 transition hover:bg-sky-800/40"
                >
                  Servicios completos
                </Link>
                <a
                  href={GOOGLE_REVIEWS_URL}
                  target="_blank"
                  rel="noopener noreferrer nofollow"
                  className="brand-review-link rounded-full px-6 py-3 text-sm font-bold"
                >
                  <ExternalLink className="h-4 w-4 text-sky-600" />
                  Resenas Google
                </a>
              </div>
            </div>

            <aside className="rounded-3xl border border-white/15 bg-white/10 p-6 shadow-2xl shadow-slate-950/40 backdrop-blur">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-sky-100">Respuesta inmediata</p>
              <h2 className="mt-3 text-3xl font-extrabold tracking-tight">Diagnostico y salida tecnica</h2>
              <div className="mt-6 grid gap-3">
                {[route.probableIssue, route.networkType, route.clientType, route.recommendation].map((item) => (
                  <p key={item} className="rounded-2xl border border-white/15 bg-slate-950/35 px-4 py-3 text-sm font-semibold leading-7 text-slate-100">
                    {item}
                  </p>
                ))}
              </div>
              <div className="relative mt-6 h-56 overflow-hidden rounded-2xl border border-white/15 bg-slate-900">
                <Image
                  src="/images/hero-urgencia.jpg"
                  alt={`Equipo tecnico para ${route.service.nombre} en ${route.sector}`}
                  fill
                  sizes="(min-width: 1024px) 420px, 100vw"
                  className="object-cover opacity-80"
                />
              </div>
            </aside>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
        <section className="brand-card rounded-3xl p-6 sm:p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-sky-700">Lectura territorial</p>
          <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-950">{content.localHeading}</h2>
          <div className="mt-5 space-y-5 text-base leading-8 text-slate-700">
            {content.localParagraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </section>

        <section className="mt-8 grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
          <article className="brand-card rounded-3xl p-6 sm:p-8">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-sky-700">Problemas frecuentes</p>
            <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-950">{content.problemHeading}</h2>
            <p className="mt-5 text-base leading-8 text-slate-700">{content.problemIntro}</p>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {problemItems.map((item) => (
                <p key={item} className="rounded-2xl border border-rose-100 bg-rose-50 px-4 py-3 text-sm font-semibold leading-7 text-slate-800">
                  {item}
                </p>
              ))}
            </div>
          </article>

          <article className="rounded-3xl border border-slate-200 bg-slate-950 p-6 text-white shadow-sm sm:p-8">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-sky-200">Procedimiento tecnico</p>
            <h2 className="mt-3 text-3xl font-extrabold tracking-tight">{content.procedureHeading}</h2>
            <p className="mt-5 text-base leading-8 text-slate-200">{content.procedureIntro}</p>
            <div className="mt-6 grid gap-3">
              {procedureSteps.map((step) => (
                <p key={step} className="flex gap-3 rounded-2xl border border-white/15 bg-white/5 px-4 py-3 text-sm font-semibold leading-7 text-slate-100">
                  <CheckCircle2 className="mt-1 h-4 w-4 flex-none text-sky-200" />
                  {step}
                </p>
              ))}
            </div>
          </article>
        </section>

        <section className="mt-8 grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
          <article className="brand-card rounded-3xl p-6 sm:p-8">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-sky-700">Cuando solicitar este servicio</p>
            <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-950">{content.whenToRequestHeading}</h2>
            <div className="mt-6 grid gap-3">
              {content.whenToRequestItems.map((item) => (
                <p key={item} className="rounded-2xl border border-sky-100 bg-sky-50 px-4 py-3 text-sm font-semibold leading-7 text-slate-800">
                  {item}
                </p>
              ))}
            </div>
          </article>

          <article className="brand-card rounded-3xl p-6 sm:p-8">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-sky-700">Equipo tecnico recomendado</p>
            <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-950">{route.service.equipo}</h2>
            <p className="mt-5 text-base leading-8 text-slate-700">{content.equipmentRecommendation}</p>
            <p className="mt-4 text-base leading-8 text-slate-700">
              Para {route.service.nombre.toLowerCase()} en {route.sector}, el equipo se prepara segun sintomas,
              accesibilidad y criticidad del cliente, con prueba hidraulica al cierre cuando corresponde.
            </p>
          </article>
        </section>

        <section className="brand-card mt-8 rounded-3xl p-6 sm:p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-sky-700">Equipos utilizados</p>
          <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-950">{content.equipmentHeading}</h2>
          <p className="mt-5 text-base leading-8 text-slate-700">{content.equipmentIntro}</p>
          <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {route.service.equipos.map((equipment) => (
              <article key={equipment} className="rounded-2xl border border-sky-100 bg-slate-50 p-5 transition hover:-translate-y-1 hover:border-sky-300 hover:bg-white hover:shadow-md">
                <div className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-sky-50 text-sky-700">
                  <Wrench className="h-5 w-5" />
                </div>
                <h3 className="mt-4 text-lg font-extrabold text-slate-950">{equipment}</h3>
                <p className="mt-3 text-sm leading-7 text-slate-700">{equipmentBenefits[equipment] ?? route.service.equipo}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="brand-card mt-8 rounded-3xl p-6 sm:p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-sky-700">Prevencion y continuidad</p>
          <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-950">{content.preventionHeading}</h2>
          <div className="mt-5 space-y-5 text-base leading-8 text-slate-700">
            {content.preventionParagraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </section>

        <section className="brand-card mt-8 rounded-3xl p-6 sm:p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-sky-700">Enlaces recomendados</p>
          <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-950">Cobertura, servicio y guias relacionadas</h2>
          <div className="mt-6 grid gap-6 lg:grid-cols-4">
            <article>
              <h3 className="text-base font-extrabold text-slate-950">Comuna</h3>
              <Link href={route.comuna.landingPath} className="mt-3 inline-flex w-full items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-bold text-slate-900 transition hover:border-sky-300 hover:bg-white">
                {route.comuna.comuna}
                <ArrowRight className="h-4 w-4 text-sky-700" />
              </Link>
            </article>
            <article>
              <h3 className="text-base font-extrabold text-slate-950">Servicio</h3>
              <Link href={servicePath} className="mt-3 inline-flex w-full items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-bold text-slate-900 transition hover:border-sky-300 hover:bg-white">
                {route.service.nombre}
                <ArrowRight className="h-4 w-4 text-sky-700" />
              </Link>
            </article>
            <article>
              <h3 className="text-base font-extrabold text-slate-950">{content.nearbyCoverageHeading}</h3>
              <p className="mt-3 text-sm leading-7 text-slate-700">{content.nearbyCoverageParagraph}</p>
              <div className="mt-3 grid gap-2">
                {nearbyRoutes.map((nearby) => (
                  <Link key={nearby.slug} href={`/${nearby.slug}`} className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-semibold text-slate-800 transition hover:border-sky-300 hover:bg-white">
                    {nearby.sector}
                  </Link>
                ))}
              </div>
            </article>
            <article>
              <h3 className="text-base font-extrabold text-slate-950">Blog</h3>
              <div className="mt-3 grid gap-2">
                {relatedPosts.map((post) => (
                  <Link key={post.slug} href={`/blog/${post.slug}`} className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-semibold text-slate-800 transition hover:border-sky-300 hover:bg-white">
                    {post.h1}
                  </Link>
                ))}
                <Link href="/" className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-semibold text-slate-800 transition hover:border-sky-300 hover:bg-white">
                  Home
                </Link>
              </div>
            </article>
          </div>
        </section>

        <section className="brand-card mt-8 rounded-3xl p-6 sm:p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-sky-700">Preguntas frecuentes</p>
          <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-950">FAQ sobre {route.service.nombre.toLowerCase()} en {route.sector}</h2>
          <div className="mt-6 grid gap-4 lg:grid-cols-2">
            {content.faq.map((item) => (
              <details key={item.question} className="group rounded-2xl border border-slate-200 bg-slate-50 px-5 py-4">
                <summary className="cursor-pointer list-none text-base font-bold text-slate-950 group-open:text-sky-700">
                  {item.question}
                </summary>
                <p className="mt-3 text-sm leading-7 text-slate-700">{item.answer}</p>
              </details>
            ))}
          </div>
        </section>

        <section className="mt-8 rounded-[2rem] border border-slate-200 bg-slate-950 p-7 text-white shadow-sm sm:p-10">
          <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-center">
            <div>
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-500/15 text-sky-100">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <h2 className="mt-4 text-3xl font-extrabold tracking-tight">{content.ctaHeading}</h2>
              <p className="mt-4 max-w-4xl text-sm leading-8 text-slate-200 sm:text-base">{content.ctaParagraph}</p>
            </div>
            <div className="grid gap-3 sm:min-w-72">
              <ServiceTermsNotice tone="dark" />
              <a
                href={whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-500 px-5 py-3 text-sm font-bold text-white transition hover:bg-emerald-600"
              >
                <PhoneCall className="h-4 w-4" />
                WhatsApp 24/7
              </a>
              <a
                href={siteConfig.phoneHref}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-sky-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-sky-700"
              >
                <PhoneCall className="h-4 w-4" />
                Llamar ahora
              </a>
              <Link href="/" className="inline-flex items-center justify-center rounded-xl border border-white/30 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10">
                Volver al menu principal
              </Link>
              <Link href="/#servicios" className="inline-flex items-center justify-center rounded-xl border border-sky-200/35 bg-sky-900/30 px-5 py-3 text-sm font-semibold text-sky-100 transition hover:bg-sky-800/40">
                Servicios completos
              </Link>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
