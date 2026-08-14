"use client";

import { useEffect } from "react";
import { CheckCircle2, PhoneCall, ShieldCheck, Wrench, Camera, Siren } from "lucide-react";

import {
  captureCampaignParams,
  createContextualWhatsAppUrl,
  leadTypeLabels,
  trackCommercialEvent,
  type ConversionContext,
  type LeadType,
} from "@/lib/conversion";
import { siteConfig } from "@/lib/site-config";

type ConversionExperienceProps = {
  context?: ConversionContext;
};

const options: Array<{
  type: LeadType;
  description: string;
  items: string[];
  cta: string;
  event: string;
  icon: typeof Siren;
  tone: string;
}> = [
  {
    type: "emergency",
    description: "Para rebalses, cámaras saturadas, retornos por WC, inundaciones u obstrucciones activas.",
    items: ["Rebalse de aguas servidas", "Pérdida completa de evacuación", "Riesgo de inundación"],
    cta: "Solicitar atención urgente",
    event: "select_emergency",
    icon: Siren,
    tone: "border-rose-200 bg-rose-50",
  },
  {
    type: "maintenance",
    description: "Para edificios, condominios, restaurantes y empresas con eventos reiterados o redes exigidas.",
    items: ["Plan preventivo", "Cámaras y tramos", "Continuidad operativa"],
    cta: "Solicitar evaluación de mantención",
    event: "select_maintenance",
    icon: Wrench,
    tone: "border-emerald-200 bg-emerald-50",
  },
  {
    type: "diagnostic",
    description: "Para obstrucciones recurrentes, raíces, roturas, contrapendientes o fallas de origen incierto.",
    items: ["Videoinspección sanitaria", "Diagnóstico de causa", "Revisión precompra o arriendo"],
    cta: "Solicitar diagnóstico técnico",
    event: "select_diagnostic",
    icon: Camera,
    tone: "border-cyan-200 bg-cyan-50",
  },
];

function ConversionLink({
  type,
  context,
  event,
  label,
  location,
  className,
}: {
  type: LeadType;
  context: ConversionContext;
  event: string;
  label: string;
  location: string;
  className: string;
}) {
  return (
    <a
      href={createContextualWhatsAppUrl(type, context)}
      target="_blank"
      rel="noopener noreferrer"
      data-conversion-event={event}
      data-lead-type={type}
      className={className}
      onClick={() => trackCommercialEvent(event, { ...context, lead_type: type, cta_location: location })}
    >
      {label}
    </a>
  );
}

export function ConversionExperience({ context = {} }: ConversionExperienceProps) {
  useEffect(() => {
    captureCampaignParams();
    const onClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null;
      const link = target?.closest<HTMLAnchorElement>('a[href^="tel:"]');
      if (link) trackCommercialEvent("click_call", { ...context, cta_location: "conversion_experience" });
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, [context]);

  return (
    <>
      <section className="conversion-experience mx-auto mt-8 max-w-6xl rounded-2xl border border-sky-200 bg-white p-5 shadow-sm sm:p-7" aria-labelledby="conversion-heading">
        <div className="max-w-3xl">
          <p className="text-xs font-black uppercase tracking-[0.18em] text-sky-700">Elige el tipo de ayuda</p>
          <h2 id="conversion-heading" className="mt-2 text-2xl font-black tracking-tight text-slate-950 sm:text-3xl">
            Te orientamos hacia el recurso correcto
          </h2>
          <p className="mt-3 text-sm leading-7 text-slate-700">
            No intentamos, solucionamos. Selecciona la situación que más se parece a tu caso y envía antecedentes útiles desde el primer contacto.
          </p>
        </div>
        <div className="mt-6 grid gap-4 lg:grid-cols-3">
          {options.map((option) => {
            const Icon = option.icon;
            return (
              <article key={option.type} className={`flex flex-col rounded-xl border p-4 ${option.tone}`}>
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-white text-sky-800 shadow-sm" aria-hidden="true">
                    <Icon className="h-5 w-5" />
                  </span>
                  <h3 className="text-base font-black text-slate-950">{leadTypeLabels[option.type]}</h3>
                </div>
                <p className="mt-3 text-sm leading-6 text-slate-700">{option.description}</p>
                <ul className="mt-3 space-y-1 text-sm font-semibold text-slate-800">
                  {option.items.map((item) => <li key={item} className="flex gap-2"><CheckCircle2 className="mt-0.5 h-4 w-4 flex-none text-sky-700" aria-hidden="true" />{item}</li>)}
                </ul>
                <ConversionLink
                  type={option.type}
                  context={context}
                  event={option.event}
                  location="need_classifier"
                  label={option.cta}
                  className="mt-5 inline-flex min-h-11 items-center justify-center rounded-lg bg-slate-950 px-4 py-3 text-center text-sm font-black text-white transition hover:bg-slate-800 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-sky-300"
                />
              </article>
            );
          })}
        </div>
      </section>

      <section className="mx-auto mt-6 max-w-6xl rounded-2xl border border-sky-200 bg-sky-50 px-5 py-5 sm:px-7" aria-label="Prueba de confianza">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {["Atención prioritaria 24/7", "Equipamiento RIDGID", "Hidrojet de alta presión", "Diagnóstico y verificación", "Cobertura en la Región de Valparaíso"].map((item) => (
            <div key={item} className="flex items-start gap-2 text-sm font-bold text-slate-800"><ShieldCheck className="mt-0.5 h-4 w-4 flex-none text-sky-700" aria-hidden="true" />{item}</div>
          ))}
        </div>
      </section>

      <div className="conversion-mobile-bar-spacer h-20 lg:hidden" aria-hidden="true" />
      <nav className="conversion-mobile-bar fixed inset-x-0 bottom-0 z-40 border-t border-slate-200 bg-white/95 p-2 shadow-[0_-12px_30px_-22px_rgba(8,56,95,0.8)] backdrop-blur lg:hidden" style={{ paddingBottom: "max(0.5rem, env(safe-area-inset-bottom))" }} aria-label="Contacto rápido">
        <div className="mx-auto grid max-w-xl grid-cols-3 gap-2">
          <ConversionLink type="emergency" context={context} event="click_whatsapp" location="mobile_bar" label="WhatsApp" className="inline-flex min-h-11 items-center justify-center rounded-lg bg-[#06c286] px-2 py-2 text-xs font-black text-white focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-emerald-200" />
          <a href={siteConfig.phoneHref} onClick={() => trackCommercialEvent("click_call", { ...context, cta_location: "mobile_bar" })} className="inline-flex min-h-11 items-center justify-center gap-1 rounded-lg bg-sky-900 px-2 py-2 text-xs font-black text-white focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-sky-300"><PhoneCall className="h-4 w-4" aria-hidden="true" />Llamar</a>
          <ConversionLink type="diagnostic" context={context} event="generate_lead" location="mobile_bar" label="Evaluación" className="inline-flex min-h-11 items-center justify-center rounded-lg border border-sky-300 bg-white px-2 py-2 text-xs font-black text-sky-950 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-sky-300" />
        </div>
      </nav>
    </>
  );
}
