import type { Metadata } from "next";
import Link from "next/link";

import { ArrowRight, PhoneCall, Wrench } from "@/components/icons";
import { ServiceTermsNotice } from "@/components/service-terms";
import { SocialProofLinksSection } from "@/components/SocialProofLinksSection";
import { buildCanonicalUrl, createWhatsAppUrl, serviceCatalog, siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Servicios sanitarios Hidrourgencias | Destape, hidrojet y mantencion",
  description:
    "Servicios sanitarios especializados de Hidrourgencias SpA: destape de alcantarillado, hidrojet, videoinspeccion, mantencion preventiva y urgencias 24/7 en la Region de Valparaiso.",
  alternates: {
    canonical: buildCanonicalUrl("/servicios"),
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function ServiciosPage() {
  return (
    <main className="mx-auto min-h-screen max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
      <div className="mb-6">
        <Link href="/" className="inline-flex items-center text-sm font-semibold text-sky-700 hover:text-sky-800">
          {"\u2190"} Volver al inicio
        </Link>
      </div>

      <section className="relative overflow-hidden rounded-[2rem] bg-[linear-gradient(135deg,#061827,#08385f_58%,#0e5f86)] p-7 text-white shadow-[0_28px_70px_-34px_rgba(8,56,95,0.9)] sm:p-10">
        <p className="inline-flex rounded-full border border-white/25 bg-white/10 px-4 py-1 text-xs font-black uppercase tracking-[0.2em] text-sky-100">
          Servicios Hidrourgencias
        </p>
        <h1 className="mt-4 max-w-4xl text-4xl font-black tracking-tight sm:text-5xl">
          Destape, hidrojet, diagnostico y mantencion sanitaria con respaldo tecnico
        </h1>
        <p className="mt-5 max-w-4xl text-base font-semibold leading-8 text-sky-50 sm:text-lg">
          Selecciona el servicio que corresponde a tu problema sanitario. Atendemos urgencias, mantenciones,
          videoinspeccion y continuidad operativa en la Region de Valparaiso.
        </p>
        <ServiceTermsNotice tone="dark" className="mt-7 max-w-4xl" />
        <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          <a
            href={createWhatsAppUrl("Hola Hidrourgencias. Necesito orientacion para elegir un servicio sanitario.")}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-emerald-500 px-6 py-3 text-sm font-black text-white transition hover:-translate-y-0.5 hover:bg-emerald-600"
          >
            <PhoneCall className="h-4 w-4" />
            WhatsApp 24/7
          </a>
          <a
            href={siteConfig.phoneHref}
            className="inline-flex min-h-12 items-center justify-center rounded-xl border border-white/30 px-6 py-3 text-sm font-black text-white transition hover:bg-white/10"
          >
            Llamar {siteConfig.phoneDisplay}
          </a>
        </div>
      </section>

      <section className="mt-9 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {serviceCatalog
          .filter((service) => service.href && service.href !== "/#servicios")
          .map((service) => (
            <article key={service.title} className="rounded-3xl border border-sky-200 bg-white p-5 shadow-md transition hover:-translate-y-1 hover:shadow-xl">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-50 text-sky-800 ring-1 ring-sky-100">
                <Wrench className="h-6 w-6" />
              </div>
              <h2 className="mt-4 text-xl font-black leading-7 text-slate-950">{service.title}</h2>
              <p className="mt-3 text-sm font-semibold leading-7 text-slate-700">{service.description}</p>
              <div className="mt-5 flex flex-col gap-2">
                <Link href={service.href ?? "/#servicios"} className="brand-blue-cta inline-flex min-h-11 items-center justify-center gap-2 rounded-xl px-4 py-2 text-sm font-black transition hover:-translate-y-0.5">
                  Ver servicio
                  <ArrowRight className="h-4 w-4" />
                </Link>
                {service.ctaHref ? (
                  <a
                    href={service.ctaHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex min-h-11 items-center justify-center rounded-xl bg-emerald-500 px-4 py-2 text-sm font-black text-white transition hover:-translate-y-0.5 hover:bg-emerald-600"
                  >
                    {service.ctaLabel ?? "Solicitar por WhatsApp"}
                  </a>
                ) : null}
              </div>
            </article>
          ))}
      </section>

      <SocialProofLinksSection className="mt-9" context="servicios" />
    </main>
  );
}
