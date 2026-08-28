import type { Metadata } from "next";
import Link from "next/link";

import { ExternalLink, Mail, PhoneCall } from "@/components/icons";
import { ServiceTermsNotice } from "@/components/service-terms";
import { SocialProofLinksSection } from "@/components/SocialProofLinksSection";
import { GOOGLE_REVIEWS_URL, buildCanonicalUrl, createMailToUrl, createWhatsAppUrl, siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Contacto Hidrourgencias | WhatsApp, telefono y solicitudes sanitarias",
  description:
    "Contacto directo con Hidrourgencias SpA para urgencias sanitarias, destape de alcantarillado, hidrojet, mantencion preventiva y diagnostico tecnico.",
  alternates: {
    canonical: buildCanonicalUrl("/contacto"),
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function ContactoPage() {
  return (
    <main className="mx-auto min-h-screen max-w-6xl px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
      <div className="mb-6">
        <Link href="/" className="inline-flex items-center text-sm font-semibold text-sky-700 hover:text-sky-800">
          {"\u2190"} Volver al inicio
        </Link>
      </div>

      <section className="rounded-[2rem] bg-[linear-gradient(135deg,#061827,#08385f_58%,#0e5f86)] p-7 text-white shadow-[0_28px_70px_-34px_rgba(8,56,95,0.9)] sm:p-10">
        <p className="text-xs font-black uppercase tracking-[0.2em] text-sky-100">Contacto directo</p>
        <h1 className="mt-3 max-w-4xl text-4xl font-black tracking-tight sm:text-5xl">
          Solicita atencion sanitaria con informacion clara desde el primer contacto
        </h1>
        <p className="mt-5 max-w-4xl text-base font-semibold leading-8 text-sky-50 sm:text-lg">
          Indica comuna, tipo de inmueble y sintomas. Con esos antecedentes podemos orientar urgencia, mantencion o
          diagnostico tecnico sin prometer tiempos o precios automaticos.
        </p>
        <ServiceTermsNotice tone="dark" className="mt-7 max-w-4xl" />
      </section>

      <section className="mt-9 grid gap-4 md:grid-cols-2">
        <a
          href={createWhatsAppUrl("Hola Hidrourgencias. Necesito solicitar atencion sanitaria. Comuna: Tipo de inmueble: Sintoma:")}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-3xl border border-emerald-200 bg-emerald-50 p-6 text-emerald-950 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
        >
          <PhoneCall className="h-7 w-7" />
          <h2 className="mt-4 text-2xl font-black">WhatsApp 24/7</h2>
          <p className="mt-2 text-sm font-bold leading-7">Contacto prioritario para urgencias, destapes, hidrojet y consultas tecnicas.</p>
        </a>
        <a
          href={siteConfig.phoneHref}
          className="rounded-3xl border border-sky-200 bg-white p-6 text-slate-950 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
        >
          <PhoneCall className="h-7 w-7 text-sky-700" />
          <h2 className="mt-4 text-2xl font-black">Llamar ahora</h2>
          <p className="mt-2 text-sm font-bold leading-7">{siteConfig.phoneDisplay}</p>
        </a>
        <a
          href={createMailToUrl()}
          className="rounded-3xl border border-slate-200 bg-white p-6 text-slate-950 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
        >
          <Mail className="h-7 w-7 text-sky-700" />
          <h2 className="mt-4 text-2xl font-black">Correo</h2>
          <p className="mt-2 text-sm font-bold leading-7">{siteConfig.email}</p>
        </a>
        <a
          href={GOOGLE_REVIEWS_URL}
          target="_blank"
          rel="noopener noreferrer nofollow"
          className="rounded-3xl border border-slate-200 bg-white p-6 text-slate-950 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
        >
          <ExternalLink className="h-7 w-7 text-sky-700" />
          <h2 className="mt-4 text-2xl font-black">Opiniones</h2>
          <p className="mt-2 text-sm font-bold leading-7">Revisa experiencias y senales de confianza antes de contactarnos.</p>
        </a>
      </section>

      <SocialProofLinksSection className="mt-9" context="contacto" />
    </main>
  );
}
