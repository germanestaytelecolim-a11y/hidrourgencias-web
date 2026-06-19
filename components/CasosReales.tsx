/* eslint-disable @next/next/no-html-link-for-pages */
import { ArrowRight, CheckCircle, MapPin, PhoneCall } from "@/components/icons";

import { StaticPicture } from "@/components/static-picture";
import type { CaseStudy } from "@/lib/case-studies";
import { createWhatsAppUrl } from "@/lib/site-config";

type CasosRealesProps = {
  cases?: CaseStudy[];
};

export function CasosReales({ cases = [] }: CasosRealesProps) {
  const casos = cases.slice(0, 6);

  if (!casos.length) {
    return null;
  }

  return (
    <section className="brand-section py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-[2rem] border border-sky-200/60 bg-white px-6 py-10 shadow-[0_24px_70px_-42px_rgba(8,56,95,0.55)] sm:px-10 sm:py-12">
          <div className="relative flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <span className="inline-flex rounded-full border border-sky-200 bg-sky-50 px-4 py-1 text-xs font-bold uppercase tracking-[0.22em] text-sky-800">
                Casos técnicos referenciales
              </span>
              <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-slate-950 sm:text-4xl">
                Casos técnicos referenciales
              </h2>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-700 sm:text-base">
                Trabajos reales de destape de alcantarillado en la Region de Valparaiso, con contexto técnico,
                metodología, equipamiento y recomendaciones para casos similares.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <a
                href="/casos-de-exito"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-[#08385f] px-5 py-3 text-sm font-bold text-white shadow-lg shadow-sky-950/20 transition hover:-translate-y-1 hover:bg-[#0e5f86]"
              >
                Ver biblioteca de casos
                <ArrowRight className="h-4 w-4" />
              </a>
              <a
                href={createWhatsAppUrl("Necesito asesoría por una urgencia sanitaria o un caso técnico similar.")}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-[#06c286] px-5 py-3 text-sm font-bold text-white shadow-lg shadow-emerald-500/25 transition hover:-translate-y-1 hover:bg-emerald-600"
              >
                <PhoneCall className="h-4 w-4" />
                WhatsApp atención 24 horas
              </a>
            </div>
          </div>

          <div className="relative mt-9 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {casos.map((caso) => (
              <article
                key={caso.slug}
                className="group overflow-hidden rounded-3xl border border-sky-200 bg-white shadow-md transition duration-300 hover:-translate-y-1 hover:border-sky-300 hover:shadow-xl"
              >
                <div className="relative aspect-[16/10] overflow-hidden bg-sky-50">
                  <StaticPicture
                    src={caso.featuredImage}
                    alt={`${caso.title} en ${caso.client.name} - ${caso.serviceType}`}
                    width={640}
                    height={400}
                    loading="lazy"
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-slate-950/55 to-transparent" />
                </div>

                <div className="p-6">
                  <div className="flex flex-wrap gap-2 text-xs font-bold uppercase tracking-[0.16em] text-sky-700">
                    <span className="inline-flex items-center gap-1 rounded-full bg-sky-50 px-3 py-1">
                      <MapPin className="h-3.5 w-3.5" />
                      {caso.city}
                    </span>
                    <span className="rounded-full bg-emerald-50 px-3 py-1 text-emerald-800">{caso.serviceFilter}</span>
                  </div>

                  <h3 className="mt-4 text-lg font-extrabold leading-7 text-slate-950">
                    {caso.title} en {caso.client.name}
                  </h3>
                  <p className="mt-3 text-sm leading-7 text-slate-600">{caso.summary}</p>

                  <div className="mt-5 flex items-start gap-2 border-t border-sky-100 pt-4">
                    <CheckCircle className="mt-0.5 h-5 w-5 flex-none text-[#06c286]" />
                    <span className="text-sm font-bold text-[#08385f]">{caso.result}</span>
                  </div>

                  <a
                    href={`/casos-de-exito/${caso.slug}`}
                    className="mt-6 inline-flex items-center gap-2 rounded-full bg-sky-50 px-4 py-2 text-sm font-bold text-sky-800 transition hover:bg-sky-100"
                  >
                    Ver caso técnico
                    <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                  </a>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
