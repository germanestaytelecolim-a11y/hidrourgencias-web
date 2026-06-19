import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { notFound } from "next/navigation";

import { ServiceTermsNotice } from "@/components/service-terms";
import { buildBlogPostMetadata, getAllBlogPosts, getBlogPostBySlug, getBlogPostFaq, getBlogSlugs } from "@/lib/blog-data";
import { getAllComunaLandings } from "@/lib/comuna-landings";
import { GOOGLE_REVIEWS_URL, createWhatsAppUrl } from "@/lib/site-config";
import { getZonaBySlug, getZonaSlugs } from "@/lib/zonas-detalle";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  return getBlogSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);

  if (!post) {
    return {
      title: "Articulo no encontrado",
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  return buildBlogPostMetadata(post);
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const relatedPosts = getAllBlogPosts().filter((item) => item.slug !== post.slug).slice(0, 3);
  const fallbackComunaLinks = getAllComunaLandings().slice(0, 4).map((item) => ({
    href: `/${item.slug}`,
    label: `destape de alcantarillado en ${item.comuna}`,
  }));
  const fallbackZonaLinks = getZonaSlugs()
    .slice(0, 6)
    .map((zoneSlug) => {
      const zone = getZonaBySlug(zoneSlug);
      if (!zone) {
        return null;
      }

      return {
        href: `/zona/${zone.slug}`,
        label: `destape en ${zone.nombre}, ${zone.comuna}`,
      };
    })
    .filter((item): item is { href: string; label: string } => item !== null);
  const comunaLinks = post.relatedComunaLinks?.length ? post.relatedComunaLinks : fallbackComunaLinks;
  const zonaLinks = post.relatedZonaLinks?.length ? post.relatedZonaLinks : fallbackZonaLinks;
  const faq = getBlogPostFaq(post);
  const articleSchema = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.description,
    author: {
      "@type": "Organization",
      name: "Hidrourgencias SpA",
    },
    publisher: {
      "@type": "Organization",
      name: "Hidrourgencias SpA",
    },
    articleSection: post.keywords,
    mainEntityOfPage: `https://hidrourgencias.cl/blog/${post.slug}`,
  }).replace(/</g, "\\u003c");
  const faqSchema = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faq.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  }).replace(/</g, "\\u003c");

  return (
    <main className="mx-auto min-h-screen max-w-5xl px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: articleSchema }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: faqSchema }} />

      <div className="mb-6">
        <Link href="/" className="inline-flex items-center text-sm font-semibold text-sky-700 hover:text-sky-800">
          {"\u2190"} Volver al inicio
        </Link>
      </div>

      <article className="relative overflow-hidden rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm sm:p-10">
        <div className="pointer-events-none absolute -right-10 top-10 h-44 w-44 opacity-5 sm:h-56 sm:w-56">
          <Image src="/images/logo-hidrourgencias.jpg" alt="" fill sizes="220px" className="object-contain" />
        </div>
        <p className="inline-flex rounded-full border border-sky-200 bg-sky-50 px-4 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-sky-700">
          Guia tecnica
        </p>
        <h1 className="mt-4 text-4xl font-extrabold tracking-tight text-slate-950 sm:text-5xl">{post.h1}</h1>
        <p className="mt-5 text-base leading-8 text-slate-700 sm:text-lg">
          {post.heroSummary} Este contenido se basa en experiencia operativa real con enfoque tecnico y respuesta sanitaria 24/7.
        </p>

        <div className="mt-6 flex flex-wrap gap-2">
          {post.keywords.map((keyword) => (
            <span key={keyword} className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-700">
              {keyword}
            </span>
          ))}
        </div>

        <ServiceTermsNotice className="mt-7" />

        <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          <a
            href={createWhatsAppUrl(post.ctaMessage)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center rounded-full bg-emerald-500 px-6 py-3 text-sm font-bold text-white transition hover:-translate-y-1 hover:bg-emerald-600"
          >
            Solicitar evaluacion por WhatsApp
          </a>
          <a
            href={GOOGLE_REVIEWS_URL}
            target="_blank"
            rel="noopener noreferrer nofollow"
            className="brand-review-link rounded-full px-6 py-3 text-sm font-bold"
          >
            <ExternalLink className="h-4 w-4 text-sky-600" />
            Ver resenas en Google
          </a>
        </div>

        <div className="mt-9 space-y-10">
          {post.sections.map((section, index) => (
            <section key={section.heading} className="space-y-4">
              <h2 className="text-3xl font-extrabold tracking-tight text-slate-950">{section.heading}</h2>
              {section.paragraphs.map((paragraph) => (
                <p key={paragraph} className="text-base leading-8 text-slate-700 sm:text-lg">
                  {paragraph}
                </p>
              ))}
              {section.bullets && (
                <ul className="grid gap-3 sm:grid-cols-2">
                  {section.bullets.map((bullet) => (
                    <li
                      key={bullet}
                      className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold leading-7 text-slate-700"
                    >
                      {bullet}
                    </li>
                  ))}
                </ul>
              )}
              {index === 2 && (
                <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-4">
                  <p className="text-sm font-semibold leading-7 text-emerald-900">
                    Si quieres pasar de la teoria a la accion, activa ahora una evaluacion tecnica por WhatsApp y recibe
                    orientacion para definir si corresponde destape, hidrojet, videoinspeccion o mantencion preventiva.
                  </p>
                  <ServiceTermsNotice className="mt-4" />
                  <a
                    href={createWhatsAppUrl(post.ctaMessage)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 inline-flex items-center rounded-full bg-emerald-500 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-emerald-600"
                  >
                    Hablar con un especialista
                  </a>
                </div>
              )}
            </section>
          ))}
        </div>

        <section className="mt-10 rounded-2xl border border-slate-200 bg-slate-50 p-5 sm:p-6">
          <h3 className="text-2xl font-extrabold tracking-tight text-slate-950">Enlaces tecnicos recomendados</h3>
          <p className="mt-3 text-sm leading-7 text-slate-700">
            Complementa esta guia con cobertura por servicio, comuna y zona para resolver urgencias reales.
          </p>
          <div className="mt-5 grid gap-6 lg:grid-cols-3">
            <article>
              <h4 className="text-base font-extrabold text-slate-950">Servicios relacionados</h4>
              <div className="mt-3 grid gap-3">
                {post.relatedServiceLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-900 transition hover:border-sky-300"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </article>
            <article>
              <h4 className="text-base font-extrabold text-slate-950">Comunas de cobertura</h4>
              <div className="mt-3 grid gap-3">
                {comunaLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-900 transition hover:border-sky-300"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </article>
            <article>
              <h4 className="text-base font-extrabold text-slate-950">Cobertura por zona</h4>
              <div className="mt-3 grid gap-3">
                {zonaLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-900 transition hover:border-sky-300"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </article>
          </div>
        </section>

        <section className="mt-10 rounded-2xl border border-slate-200 bg-slate-950 p-6 text-white sm:p-8">
          <h3 className="text-2xl font-extrabold tracking-tight">Cierra con accion inmediata</h3>
          <p className="mt-3 text-sm leading-8 text-slate-200 sm:text-base">
            Si detectas sintomas de obstruccion, rebalse o drenaje inestable, no esperes a que el impacto escale.
            Solicita soporte tecnico y recibe una ruta clara para resolver con criterio sanitario y comercial.
          </p>
          <ServiceTermsNotice tone="dark" className="mt-5" />
          <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <a
              href={createWhatsAppUrl(post.ctaMessage)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-full bg-emerald-500 px-6 py-3 text-sm font-bold text-white transition hover:bg-emerald-600"
            >
              WhatsApp respuesta inmediata
            </a>
            <Link
              href="/"
              className="inline-flex items-center justify-center rounded-full border border-white/35 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
            >
              {"\u2190"} Volver al inicio
            </Link>
          </div>
        </section>

        <section className="mt-10 rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
          <h3 className="text-2xl font-extrabold tracking-tight text-slate-950">Preguntas frecuentes</h3>
          <div className="mt-5 space-y-4">
            {faq.map((item) => (
              <details key={item.question} className="group rounded-2xl border border-slate-200 bg-slate-50 px-5 py-4">
                <summary className="cursor-pointer list-none text-base font-bold text-slate-950 group-open:text-sky-700">
                  {item.question}
                </summary>
                <p className="mt-3 text-sm leading-7 text-slate-700">{item.answer}</p>
              </details>
            ))}
          </div>
        </section>
      </article>

      <section className="brand-card mt-9 rounded-3xl p-6 sm:p-8">
        <h3 className="text-2xl font-extrabold tracking-tight text-slate-950">Mas guias tecnicas relacionadas</h3>
        <div className="mt-5 grid gap-4 md:grid-cols-3">
          {relatedPosts.map((item) => (
            <article key={item.slug} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <h4 className="text-lg font-bold leading-7 text-slate-950">{item.h1}</h4>
              <p className="mt-2 text-sm leading-7 text-slate-700">{item.description}</p>
              <Link href={`/blog/${item.slug}`} className="mt-4 inline-flex text-sm font-semibold text-sky-700">
                Leer articulo
              </Link>
            </article>
          ))}
        </div>
      </section>

      <div className="mt-8">
        <Link href="/" className="inline-flex items-center text-sm font-semibold text-sky-700 hover:text-sky-800">
          {"\u2190"} Volver al inicio
        </Link>
      </div>
    </main>
  );
}
