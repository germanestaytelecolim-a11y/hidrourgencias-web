import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ExternalLink, PhoneCall } from "lucide-react";
import { notFound } from "next/navigation";

import { CaseStudyTrustLogos } from "@/components/CaseStudyTrustLogos";
import { ClientLogoCaseStudy } from "@/components/ClientLogoCaseStudy";
import { ServiceTermsNotice } from "@/components/service-terms";
import {
  buildCaseStudyMetadata,
  buildCaseStudySchemas,
  caseStudyBlogLinks,
  caseStudyServiceLinks,
  getCaseStudyBySlug,
  getCaseStudySlugs,
  getCaseStudyWhatsAppUrl,
  getRelatedCaseStudies,
} from "@/lib/case-studies";
import { GOOGLE_REVIEWS_URL, createWhatsAppUrl, siteConfig } from "@/lib/site-config";

type Props = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return getCaseStudySlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const caseStudy = getCaseStudyBySlug(slug);

  if (!caseStudy) {
    return {
      title: "Caso de éxito no encontrado",
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  return buildCaseStudyMetadata(caseStudy);
}

export default async function CaseStudyPage({ params }: Props) {
  const { slug } = await params;
  const caseStudy = getCaseStudyBySlug(slug);

  if (!caseStudy) {
    notFound();
  }

  const schemas = buildCaseStudySchemas(caseStudy);
  const relatedCases = getRelatedCaseStudies(caseStudy, 3);
  const similarServiceUrl = getCaseStudyWhatsAppUrl(caseStudy.ctaMessage);
  const technicalEvaluationUrl = createWhatsAppUrl(
    `Hola, necesito solicitar evaluación técnica por un caso similar a ${caseStudy.title} de Hidrourgencias SpA.`,
  );
  const urgentWhatsAppUrl = createWhatsAppUrl("Hola, necesito WhatsApp 24/7 por una urgencia sanitaria.");
  const maintenanceQuoteUrl = createWhatsAppUrl("Hola, necesito cotizar mantención preventiva sanitaria con Hidrourgencias SpA.");

  return (
    <main className="mx-auto min-h-screen max-w-6xl px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: schemas }} />

      <nav className="mb-6 flex flex-wrap gap-2 text-sm font-semibold text-slate-600">
        <Link href="/" className="text-sky-700 hover:text-sky-800">
          Inicio
        </Link>
        <span>/</span>
        <Link href="/casos-de-exito" className="text-sky-700 hover:text-sky-800">
          Casos de éxito
        </Link>
        <span>/</span>
        <span>{caseStudy.client.name}</span>
      </nav>

      <article className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm">
        <section className="relative overflow-hidden bg-[linear-gradient(130deg,#082f4f_0%,#08385f_52%,#0e5f86_100%)] text-white">
          <Image
            src={caseStudy.featuredImage}
            alt={caseStudy.h1}
            fill
            preload
            fetchPriority="high"
            loading="eager"
            decoding="async"
            sizes="(min-width: 1024px) 980px, 100vw"
            className="object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-slate-950/45" />
          <div className="relative grid gap-7 p-7 sm:p-10 lg:grid-cols-[1fr_18rem] lg:p-12">
            <div>
              <p className="inline-flex rounded-full border border-white/30 bg-white/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-sky-100">
                Caso de éxito SEO
              </p>
              <h1 className="mt-4 max-w-4xl text-4xl font-extrabold tracking-tight sm:text-5xl">{caseStudy.h1}</h1>
              <p className="mt-5 max-w-4xl text-base leading-8 text-slate-100 sm:text-lg">{caseStudy.summary}</p>
              <div className="mt-6 flex flex-wrap gap-2 text-xs font-bold text-slate-100">
                <span className="rounded-full border border-white/25 bg-white/10 px-3 py-1.5">{caseStudy.city}</span>
                <span className="rounded-full border border-white/25 bg-white/10 px-3 py-1.5">{caseStudy.serviceType}</span>
                <span className="rounded-full border border-white/25 bg-white/10 px-3 py-1.5">{caseStudy.serviceDateLabel}</span>
              </div>
              <ServiceTermsNotice tone="dark" className="mt-7 max-w-4xl" />
            </div>
            <div className="self-start">
              <ClientLogoCaseStudy logo={caseStudy.client.logo} />
            </div>
          </div>
        </section>

        <div className="p-6 sm:p-8 lg:p-10">
          <section className="grid gap-5 md:grid-cols-3">
            {[
              { label: "Cliente", value: caseStudy.client.name },
              { label: "Ciudad", value: caseStudy.city },
              { label: "Tipo de servicio", value: caseStudy.serviceType },
            ].map((item) => (
              <div key={item.label} className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-sky-700">{item.label}</p>
                <p className="mt-2 text-lg font-extrabold text-slate-950">{item.value}</p>
              </div>
            ))}
          </section>

          <section className="mt-9 space-y-5">
            <h2 className="text-3xl font-extrabold tracking-tight text-slate-950">1. Resumen Ejecutivo</h2>
            <p className="text-base leading-8 text-slate-700">{caseStudy.summary}</p>
          </section>

          <section className="mt-9 space-y-5">
            <h2 className="text-3xl font-extrabold tracking-tight text-slate-950">2. Antecedentes del Servicio</h2>
            <p className="text-base leading-8 text-slate-700">{caseStudy.background}</p>
          </section>

          <section className="mt-9 space-y-5">
            <h2 className="text-3xl font-extrabold tracking-tight text-slate-950">3. Problema Reportado</h2>
            <p className="text-base leading-8 text-slate-700">{caseStudy.problem}</p>
          </section>

          <section className="mt-9 space-y-5">
            <h2 className="text-3xl font-extrabold tracking-tight text-slate-950">4. Diagnóstico Técnico</h2>
            <p className="text-base leading-8 text-slate-700">{caseStudy.diagnosis}</p>
          </section>

          <section className="mt-9">
            <h2 className="text-3xl font-extrabold tracking-tight text-slate-950">5. Equipamiento Utilizado</h2>
            <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {caseStudy.equipment.map((item) => (
                <p key={item} className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-bold text-slate-800">
                  {item}
                </p>
              ))}
            </div>
          </section>

          <section className="mt-9">
            <h2 className="text-3xl font-extrabold tracking-tight text-slate-950">6. Metodología Aplicada</h2>
            <div className="mt-5 grid gap-3">
              {caseStudy.methodology.map((item) => (
                <p key={item} className="rounded-xl border border-sky-100 bg-sky-50 px-4 py-3 text-sm font-semibold leading-7 text-slate-800">
                  {item}
                </p>
              ))}
            </div>
          </section>

          <section className="mt-9">
            <h2 className="text-3xl font-extrabold tracking-tight text-slate-950">7. Desarrollo de la Intervención</h2>
            <div className="mt-5 grid gap-3">
              {caseStudy.intervention.map((item) => (
                <p key={item} className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold leading-7 text-slate-700">
                  {item}
                </p>
              ))}
            </div>
          </section>

          <section className="mt-9 space-y-5">
            <h2 className="text-3xl font-extrabold tracking-tight text-slate-950">8. Resultado Final</h2>
            <p className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5 text-base font-bold leading-8 text-emerald-950">
              {caseStudy.result}
            </p>
          </section>

          <section className="mt-9">
            <h2 className="text-3xl font-extrabold tracking-tight text-slate-950">9. Recomendaciones Técnicas</h2>
            <ul className="mt-5 grid gap-3 sm:grid-cols-2">
              {caseStudy.recommendations.map((item) => (
                <li key={item} className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold leading-7 text-slate-700">
                  {item}
                </li>
              ))}
            </ul>
          </section>

          <section className="mt-9 space-y-5">
            <h2 className="text-3xl font-extrabold tracking-tight text-slate-950">10. Conclusiones</h2>
            <p className="text-base leading-8 text-slate-700">{caseStudy.conclusions}</p>
          </section>

          <section className="mt-9">
            <h2 className="text-3xl font-extrabold tracking-tight text-slate-950">11. Galería Fotográfica</h2>
            <p className="mt-3 text-sm leading-7 text-slate-600">
              Registros operativos disponibles de Hidrourgencias SpA asociados al tipo de intervención sanitaria.
            </p>
            <div className="mt-5 grid gap-4 md:grid-cols-3">
              {caseStudy.gallery.map((image) => (
                <div key={image.src} className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-slate-200 bg-slate-100">
                  <Image src={image.src} alt={image.alt} fill sizes="(min-width: 768px) 30vw, 100vw" className="object-cover" loading="lazy" />
                </div>
              ))}
            </div>
          </section>

          <section className="mt-9">
            <h2 className="text-3xl font-extrabold tracking-tight text-slate-950">12. Preguntas Frecuentes</h2>
            <div className="mt-5 space-y-4">
              {caseStudy.faq.map((item) => (
                <details key={item.question} className="group rounded-2xl border border-slate-200 bg-slate-50 px-5 py-4">
                  <summary className="cursor-pointer list-none text-base font-bold text-slate-950 group-open:text-sky-700">
                    {item.question}
                  </summary>
                  <p className="mt-3 text-sm leading-7 text-slate-700">{item.answer}</p>
                </details>
              ))}
            </div>
          </section>

          <section className="mt-9 rounded-3xl border border-slate-200 bg-slate-950 p-6 text-white sm:p-8">
            <h2 className="text-3xl font-extrabold tracking-tight">13. CTA Comercial</h2>
            <p className="mt-4 max-w-3xl text-sm leading-8 text-slate-200 sm:text-base">
              Solicita una intervención similar, evaluación técnica o mantención preventiva con respuesta directa por
              WhatsApp y llamada telefónica.
            </p>
            <ServiceTermsNotice tone="dark" className="mt-5 max-w-4xl" />
            <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              <a
                href={similarServiceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center rounded-full bg-emerald-500 px-5 py-3 text-sm font-bold text-white transition hover:bg-emerald-600"
              >
                Solicitar servicio similar
              </a>
              <a
                href={technicalEvaluationUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center rounded-full bg-sky-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-sky-700"
              >
                Solicitar evaluación técnica
              </a>
              <a
                href={urgentWhatsAppUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center rounded-full bg-emerald-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-emerald-700"
              >
                WhatsApp 24/7
              </a>
              <a
                href={siteConfig.phoneHref}
                className="inline-flex items-center justify-center gap-2 rounded-full border border-white/30 px-5 py-3 text-sm font-bold text-white transition hover:bg-white/10"
              >
                <PhoneCall className="h-4 w-4" />
                Llamar ahora
              </a>
              <a
                href={maintenanceQuoteUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center rounded-full bg-white px-5 py-3 text-sm font-bold text-[#08385f] transition hover:bg-sky-50"
              >
                Cotizar mantención preventiva
              </a>
              <a
                href={GOOGLE_REVIEWS_URL}
                target="_blank"
                rel="noopener noreferrer nofollow"
                className="brand-review-link rounded-full px-5 py-3 text-sm font-bold"
              >
                <ExternalLink className="h-4 w-4 text-sky-600" />
                Opiniones de clientes
              </a>
            </div>
          </section>
        </div>
      </article>

      <section className="mt-9 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <h2 className="text-2xl font-extrabold tracking-tight text-slate-950 sm:text-3xl">Enlaces técnicos relacionados</h2>
        <div className="mt-5 grid gap-6 lg:grid-cols-3">
          <article>
            <h3 className="text-base font-extrabold text-slate-950">Servicios</h3>
            <div className="mt-3 grid gap-3">
              {caseStudyServiceLinks.map((link) => (
                <Link key={link.href} href={link.href} className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-bold text-slate-800 hover:border-sky-300">
                  {link.label}
                </Link>
              ))}
            </div>
          </article>
          <article>
            <h3 className="text-base font-extrabold text-slate-950">Artículos</h3>
            <div className="mt-3 grid gap-3">
              {caseStudyBlogLinks.map((link) => (
                <Link key={link.href} href={link.href} className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-bold text-slate-800 hover:border-sky-300">
                  {link.label}
                </Link>
              ))}
            </div>
          </article>
          <article>
            <h3 className="text-base font-extrabold text-slate-950">Casos relacionados</h3>
            <div className="mt-3 grid gap-3">
              {relatedCases.map((item) => (
                <Link
                  key={item.slug}
                  href={`/casos-de-exito/${item.slug}`}
                  className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-bold text-slate-800 hover:border-sky-300"
                >
                  {item.title}
                </Link>
              ))}
            </div>
          </article>
        </div>
      </section>

      <section className="mt-9">
        <CaseStudyTrustLogos />
      </section>
    </main>
  );
}
