import type { Metadata } from "next";
import { ArrowRight, Building2, ClipboardCheck, FileText, PhoneCall, ShieldCheck, Wrench } from "lucide-react";

import { AdminAccessDemoForm } from "@/components/admin-access-demo-form";
import { ServiceTermsNotice } from "@/components/service-terms";
import { buildCanonicalUrl, createWhatsAppUrl } from "@/lib/site-config";

export const metadata: Metadata = {
  title: {
    absolute: "Acceso Administradores y Empresas | Hidrourgencias SpA",
  },
  description:
    "Acceso demostrativo para administradores, comunidades y empresas atendidas por Hidrourgencias SpA. Coordinación técnica, informes, mantención preventiva y urgencias sanitarias.",
  alternates: {
    canonical: buildCanonicalUrl("/acceso-administradores-empresas"),
  },
  robots: {
    index: true,
    follow: true,
  },
};

const commercialCards = [
  {
    title: "Informes técnicos",
    text: "Respaldo formal de diagnósticos, metodología aplicada, observaciones y recomendaciones sanitarias.",
    icon: FileText,
  },
  {
    title: "Mantenciones preventivas",
    text: "Coordinación para limpieza programada de redes, cámaras, colectores, verticales, horizontales y sistemas de evacuación.",
    icon: ClipboardCheck,
  },
  {
    title: "Urgencias sanitarias",
    text: "Atención técnica para obstrucciones, rebalses, cámaras colapsadas, retornos de aguas servidas y fallas de evacuación.",
    icon: ShieldCheck,
  },
  {
    title: "Revisión técnica de redes",
    text: "Evaluación sanitaria de redes ocultas, continuidad de evacuación, cámaras, desagües y puntos críticos.",
    icon: Wrench,
  },
];

const accessRequestHref = createWhatsAppUrl(
  "Hola, solicito acceso administrativo o respaldo de servicios para cliente corporativo de Hidrourgencias SpA.",
);
const companyCoordinationHref = createWhatsAppUrl(
  "Hola, necesito coordinar atención para empresa, comunidad, restaurante o administración con requerimiento sanitario.",
);

export default function AccesoAdministradoresEmpresasPage() {
  return (
    <main className="min-h-screen">
      <section className="relative overflow-hidden bg-[linear-gradient(135deg,#082f4f_0%,#08385f_48%,#0e5f86_100%)] text-white">
        <div className="absolute inset-0 opacity-15">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: "radial-gradient(circle at 2px 2px, white 1px, transparent 0)",
              backgroundSize: "34px 34px",
            }}
          />
        </div>

        <div className="relative mx-auto grid max-w-7xl gap-8 px-4 py-16 sm:px-6 lg:grid-cols-[1fr_0.72fr] lg:items-center lg:px-8 lg:py-20">
          <div>
            <p className="inline-flex rounded-full border border-white/25 bg-white/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.22em] text-sky-100">
              Clientes corporativos
            </p>
            <h1 className="mt-5 max-w-4xl text-4xl font-black tracking-tight sm:text-5xl">
              Acceso Administradores / Empresas
            </h1>
            <p className="mt-5 max-w-4xl text-lg font-semibold leading-8 text-sky-50">
              Portal demostrativo para clientes corporativos, administradores de edificios, comunidades, restaurantes y
              empresas con requerimientos sanitarios programados o de urgencia.
            </p>
            <p className="mt-5 max-w-4xl text-base leading-8 text-slate-200">
              Hidrourgencias SpA trabaja con enfoque técnico, trazabilidad operativa, respaldo mediante informes y
              atención especializada para redes de alcantarillado, desagüe, mantención preventiva, hidrojet y urgencias
              sanitarias.
            </p>
            <ServiceTermsNotice tone="dark" className="mt-7 max-w-4xl" />
          </div>

          <div className="rounded-[2rem] border border-white/15 bg-white/10 p-5 shadow-[0_30px_80px_-44px_rgba(0,0,0,0.9)] backdrop-blur">
            <div className="rounded-[1.5rem] border border-sky-100/20 bg-slate-950/20 p-5">
              <Building2 className="h-10 w-10 text-sky-100" aria-hidden="true" />
              <p className="mt-5 text-sm font-bold uppercase tracking-[0.22em] text-sky-100">Continuidad operativa</p>
              <p className="mt-3 text-2xl font-black tracking-tight text-white">
                Coordinación para redes sanitarias críticas.
              </p>
              <p className="mt-3 text-sm leading-7 text-slate-200">
                Soporte orientado a administradores, comunidades, empresas y restaurantes que requieren diagnóstico,
                metodología técnica y respaldo formal de trabajos ejecutados.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-sky-700">Coordinación técnica</p>
            <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
              Coordinación técnica para clientes corporativos
            </h2>
            <p className="mt-5 text-base leading-8 text-slate-700">
              Este acceso está orientado a clientes con servicios programados, mantenciones preventivas, informes
              técnicos, respaldo de trabajos ejecutados y coordinación operativa con administraciones, comunidades y
              empresas.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {commercialCards.map((card) => {
              const Icon = card.icon;

              return (
                <article key={card.title} className="brand-card rounded-2xl p-5">
                  <div className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-sky-50 text-sky-800">
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </div>
                  <h3 className="mt-4 text-xl font-black tracking-tight text-slate-950">{card.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-slate-700">{card.text}</p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="brand-section px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="relative z-10 mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.95fr_0.8fr] lg:items-start">
          <div className="rounded-[2rem] border border-sky-100 bg-white p-6 shadow-[0_24px_70px_-45px_rgba(8,56,95,0.7)] sm:p-8">
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-sky-700">Habilitación progresiva</p>
            <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-950">
              Portal en etapa de habilitación para clientes corporativos
            </h2>
            <p id="admin-access-note" className="mt-4 text-base leading-8 text-slate-700">
              Portal en etapa de habilitación para clientes corporativos. Para solicitar acceso administrativo o respaldo
              de servicios, comuníquese directamente con Hidrourgencias SpA.
            </p>

            <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <a
                href={accessRequestHref}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-emerald-500 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-emerald-600/25 transition hover:-translate-y-0.5 hover:bg-emerald-600"
              >
                <PhoneCall className="h-4 w-4" aria-hidden="true" />
                Solicitar acceso por WhatsApp
              </a>
              <a
                href={companyCoordinationHref}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-sky-200 bg-white px-6 py-3 text-sm font-bold text-sky-950 shadow-sm transition hover:-translate-y-0.5 hover:border-sky-300 hover:bg-sky-50"
              >
                Coordinar atención empresa
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </a>
            </div>
          </div>

          <AdminAccessDemoForm />
        </div>
      </section>
    </main>
  );
}
