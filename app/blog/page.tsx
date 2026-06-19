import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ExternalLink } from "lucide-react";

import { ServiceTermsNotice } from "@/components/service-terms";
import { getAllBlogPosts } from "@/lib/blog-data";
import { getBlogGuideImage } from "@/lib/blog-guide-images";
import { GOOGLE_REVIEWS_URL, buildCanonicalUrl, createWhatsAppUrl } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Blog tecnico de destape de alcantarillado, hidrojet y urgencias sanitarias",
  description:
    "Blog de Hidrourgencias SpA con guias tecnicas y comerciales sobre destape de alcantarillado, hidrojet, mantencion preventiva y urgencias sanitarias en Region de Valparaiso.",
  alternates: {
    canonical: buildCanonicalUrl("/blog"),
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function BlogPage() {
  const posts = getAllBlogPosts();

  return (
    <main className="mx-auto min-h-screen max-w-6xl px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
      <div className="mb-6">
        <Link href="/" className="inline-flex items-center text-sm font-semibold text-sky-700 hover:text-sky-800">
          {"\u2190"} Volver al inicio
        </Link>
      </div>

      <section className="relative overflow-hidden rounded-[2rem] border border-sky-200/30 bg-[linear-gradient(130deg,#082f4f_0%,#08385f_52%,#0e5f86_100%)] p-7 text-white shadow-[0_28px_65px_-30px_rgba(2,6,23,0.8)] sm:p-10">
        <div className="pointer-events-none absolute -right-10 top-8 h-56 w-56 opacity-10">
          <Image src="/images/logo-hidrourgencias.jpg" alt="" fill sizes="220px" className="object-contain" />
        </div>
        <p className="inline-flex rounded-full border border-white/30 bg-white/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-sky-100">
          Blog tecnico
        </p>
        <h1 className="mt-4 max-w-4xl text-4xl font-extrabold tracking-tight sm:text-5xl">
          Guias tecnicas y contenido util para prevenir urgencias sanitarias y tomar mejores decisiones
        </h1>
        <p className="mt-5 max-w-4xl text-base leading-8 text-slate-100 sm:text-lg">
          Publicamos guias pensadas para administradores, comunidades, empresas y clientes que necesitan decisiones
          rapidas con criterio tecnico, experiencia de 15 anos y enfoque operativo real.
        </p>
        <ServiceTermsNotice tone="dark" className="mt-7 max-w-4xl" />
        <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          <a
            href={createWhatsAppUrl("Hola, necesito orientacion tecnica para resolver una contingencia sanitaria.")}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center rounded-full bg-emerald-500 px-6 py-3 text-sm font-bold text-white transition hover:-translate-y-1 hover:bg-emerald-600"
          >
            Hablar con un tecnico ahora
          </a>
          <a
            href={GOOGLE_REVIEWS_URL}
            target="_blank"
            rel="noopener noreferrer nofollow"
            className="brand-review-link rounded-full px-6 py-3 text-sm font-bold"
          >
            <ExternalLink className="h-4 w-4 text-sky-600" />
            Opiniones de clientes
          </a>
        </div>
      </section>

      <section className="mt-9 grid gap-5 md:grid-cols-2">
        {posts.map((post, index) => (
          <article
            key={post.slug}
            className="group overflow-hidden rounded-3xl border border-sky-200 bg-white shadow-md transition duration-300 hover:-translate-y-1 hover:border-sky-300 hover:shadow-xl"
          >
            <div className="relative aspect-[16/9] w-full overflow-hidden bg-sky-50">
              <Image
                src={post.image ?? getBlogGuideImage(index)}
                alt={post.imageAlt ?? `guia tecnica sobre ${post.h1} - Hidrourgencias SpA`}
                fill
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="object-cover transition duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-slate-950/50 to-transparent" />
            </div>
            <div className="p-6">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-sky-700">Guia tecnica</p>
              <h2 className="mt-3 text-2xl font-extrabold tracking-tight text-slate-950">{post.h1}</h2>
              <p className="mt-4 text-sm leading-7 text-slate-700">{post.description}</p>
              <div className="mt-5 flex flex-wrap gap-2">
                {post.keywords.map((keyword) => (
                  <span key={keyword} className="rounded-full border border-sky-200 bg-sky-50 px-3 py-1 text-xs font-bold text-slate-700">
                    {keyword}
                  </span>
                ))}
              </div>
              <Link
                href={`/blog/${post.slug}`}
                className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#08385f] px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-sky-950/15 transition hover:-translate-y-1 hover:bg-[#0e5f86]"
              >
                Leer guia completa
                <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
              </Link>
            </div>
          </article>
        ))}
      </section>

      <div className="mt-8">
        <Link href="/" className="inline-flex items-center text-sm font-semibold text-sky-700 hover:text-sky-800">
          {"\u2190"} Volver al inicio
        </Link>
      </div>
    </main>
  );
}
