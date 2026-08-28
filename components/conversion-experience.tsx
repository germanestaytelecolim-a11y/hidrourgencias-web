"use client";

import { useEffect, useState } from "react";
import {
  Camera,
  Check,
  CheckCircle2,
  PhoneCall,
  ShieldCheck,
  Siren,
  Wrench,
} from "lucide-react";

import {
  captureCampaignParams,
  createContextualWhatsAppUrl,
  trackCommercialEvent,
  type ConversionContext,
  type LeadType,
} from "@/lib/conversion";
import { GOOGLE_REVIEWS_URL, siteConfig } from "@/lib/site-config";

type ConversionExperienceProps = {
  context?: ConversionContext;
};

const options: Array<{
  type: LeadType;
  title: string;
  description: string;
  items: string[];
  actionHeading: string;
  actionDescription: string;
  cta: string;
  event: string;
  icon: typeof Siren;
  tone: string;
  selectedTone: string;
}> = [
  {
    type: "emergency",
    title: "Tengo una emergencia.",
    description: "Rebalse, cámara saturada, retorno por WC, inundación u obstrucción activa.",
    items: ["Rebalse de aguas servidas", "Pérdida de evacuación", "Riesgo de inundación"],
    actionHeading: "Prioricemos la contingencia sanitaria",
    actionDescription: "Envía el servicio y la ubicación disponibles para orientar la atención desde el primer contacto.",
    cta: "Solicitar atención por WhatsApp",
    event: "select_emergency",
    icon: Siren,
    tone: "border-rose-200 bg-rose-50",
    selectedTone: "border-rose-500 bg-rose-50 ring-4 ring-rose-100",
  },
  {
    type: "maintenance",
    title: "Necesito mantención preventiva.",
    description: "Edificios, condominios, restaurantes o empresas con redes exigidas o eventos reiterados.",
    items: ["Plan preventivo", "Cámaras y tramos", "Continuidad operativa"],
    actionHeading: "Organicemos una evaluación preventiva",
    actionDescription: "El mensaje identifica el servicio y territorio para iniciar una evaluación técnica, sin prometer disponibilidad.",
    cta: "Solicitar evaluación de mantención",
    event: "select_maintenance",
    icon: Wrench,
    tone: "border-emerald-200 bg-emerald-50",
    selectedTone: "border-emerald-600 bg-emerald-50 ring-4 ring-emerald-100",
  },
  {
    type: "diagnostic",
    title: "Necesito diagnóstico o videoinspección.",
    description: "Fallas recurrentes, raíces, roturas, contrapendientes o problemas de origen incierto.",
    items: ["Videoinspección sanitaria", "Diagnóstico de causa", "Revisión técnica"],
    actionHeading: "Revisemos la causa antes de intervenir",
    actionDescription: "Comparte el servicio y territorio consultados para solicitar una evaluación con respaldo técnico.",
    cta: "Solicitar evaluación técnica",
    event: "select_diagnostic",
    icon: Camera,
    tone: "border-cyan-200 bg-cyan-50",
    selectedTone: "border-cyan-600 bg-cyan-50 ring-4 ring-cyan-100",
  },
];

const trustItems = [
  "Atención prioritaria 24/7",
  "Equipamiento RIDGID",
  "Hidrojet de alta presión",
  "Diagnóstico y verificación",
  "Cobertura en la Región de Valparaíso",
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
  const [selectedType, setSelectedType] = useState<LeadType>("emergency");
  const selectedOption = options.find((option) => option.type === selectedType) ?? options[0];
  const visibleContext = [context.service, context.commune, context.sector].filter(Boolean);

  useEffect(() => {
    captureCampaignParams();
  }, []);

  function selectOption(type: LeadType, event: string) {
    setSelectedType(type);
    trackCommercialEvent(event, { ...context, lead_type: type, cta_location: "need_classifier" });
  }

  return (
    <>
      <section
        className="conversion-experience mx-auto mt-8 max-w-6xl rounded-2xl border border-sky-200 bg-white p-5 shadow-sm sm:p-7"
        aria-labelledby="conversion-heading"
        data-conversion-classifier
      >
        <div className="max-w-3xl">
          <p className="text-xs font-black uppercase text-sky-700">Elige el tipo de ayuda</p>
          <h2 id="conversion-heading" className="mt-2 text-2xl font-black tracking-tight text-slate-950 sm:text-3xl">
            Te orientamos hacia el recurso correcto
          </h2>
          <p className="mt-3 text-sm leading-7 text-slate-700">
            No intentamos, solucionamos. Selecciona la situación que más se parece a tu caso.
          </p>
        </div>

        <div className="mt-6 grid gap-4 lg:grid-cols-3" aria-label="Tipo de necesidad">
          {options.map((option) => {
            const Icon = option.icon;
            const selected = option.type === selectedType;

            return (
              <button
                key={option.type}
                type="button"
                aria-pressed={selected}
                data-conversion-option={option.type}
                onClick={() => selectOption(option.type, option.event)}
                className={`relative flex min-h-full flex-col rounded-xl border p-4 text-left transition focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-sky-300 ${
                  selected ? option.selectedTone : `${option.tone} hover:border-sky-400 hover:bg-white`
                }`}
              >
                <span className="flex w-full items-start gap-3">
                  <span className="flex h-10 w-10 flex-none items-center justify-center rounded-lg bg-white text-sky-800 shadow-sm" aria-hidden="true">
                    <Icon className="h-5 w-5" />
                  </span>
                  <span className="min-w-0 flex-1 text-base font-black leading-6 text-slate-950">{option.title}</span>
                  {selected ? (
                    <span className="flex h-7 w-7 flex-none items-center justify-center rounded-full bg-slate-950 text-white" aria-label="Opción seleccionada">
                      <Check className="h-4 w-4" aria-hidden="true" />
                    </span>
                  ) : null}
                </span>
                <span className="mt-3 block text-sm leading-6 text-slate-700">{option.description}</span>
                <span className="mt-3 space-y-1 text-sm font-semibold text-slate-800">
                  {option.items.map((item) => (
                    <span key={item} className="flex gap-2">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 flex-none text-sky-700" aria-hidden="true" />
                      {item}
                    </span>
                  ))}
                </span>
              </button>
            );
          })}
        </div>

        <div
          className="mt-6 grid gap-5 rounded-xl border border-slate-800 bg-slate-950 p-5 text-white lg:grid-cols-[1fr_auto] lg:items-center"
          aria-live="polite"
          data-conversion-actions
        >
          <div>
            <p className="text-xs font-black uppercase text-sky-200">Acción recomendada</p>
            <h3 className="mt-2 text-xl font-black text-white">{selectedOption.actionHeading}</h3>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-200">{selectedOption.actionDescription}</p>
            {visibleContext.length ? (
              <p className="mt-3 text-xs font-bold uppercase text-cyan-100">
                {visibleContext.join(" · ")}
              </p>
            ) : null}
          </div>
          <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
            <ConversionLink
              type={selectedType}
              context={context}
              event="click_whatsapp"
              location="contextual_action"
              label={selectedOption.cta}
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-emerald-500 px-5 py-3 text-center text-sm font-black text-white transition hover:bg-emerald-600 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-emerald-200"
            />
            {selectedType === "emergency" ? (
              <a
                href={siteConfig.phoneHref}
                data-conversion-event="click_call"
                onClick={() => trackCommercialEvent("click_call", { ...context, lead_type: selectedType, cta_location: "contextual_action" })}
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border border-sky-200/40 bg-white/10 px-5 py-3 text-sm font-black text-white transition hover:bg-white/15 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-sky-300"
              >
                <PhoneCall className="h-4 w-4" aria-hidden="true" />
                Llamar por una urgencia
              </a>
            ) : null}
          </div>
        </div>
      </section>

      <section
        className="mx-auto mt-6 max-w-6xl rounded-2xl border border-sky-200 bg-sky-50 px-5 py-5 sm:px-7"
        aria-label="Prueba de confianza"
        data-conversion-trust
      >
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {trustItems.map((item) => (
            <div key={item} className="flex items-start gap-2 text-sm font-bold text-slate-800">
              <ShieldCheck className="mt-0.5 h-4 w-4 flex-none text-sky-700" aria-hidden="true" />
              {item}
            </div>
          ))}
          <a
            href={GOOGLE_REVIEWS_URL}
            target="_blank"
            rel="noopener noreferrer nofollow"
            onClick={() => trackCommercialEvent("view_reviews", { ...context, cta_location: "trust_band" })}
            className="flex min-h-11 items-center gap-2 rounded-lg text-sm font-bold text-sky-900 underline decoration-sky-300 underline-offset-4 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-sky-300"
          >
            <ShieldCheck className="h-4 w-4 flex-none text-sky-700" aria-hidden="true" />
            Opiniones de clientes en Google
          </a>
        </div>
      </section>

      <nav
        className="conversion-mobile-bar fixed inset-x-0 bottom-0 z-40 border-t border-slate-200 bg-white/95 p-2 shadow-[0_-12px_30px_-22px_rgba(8,56,95,0.8)] backdrop-blur lg:hidden"
        style={{ paddingBottom: "max(0.5rem, env(safe-area-inset-bottom))" }}
        aria-label="Contacto rápido"
        data-conversion-mobile-bar
      >
        <div className="mx-auto grid max-w-xl grid-cols-3 gap-2">
          <ConversionLink
            type={selectedType}
            context={context}
            event="click_whatsapp"
            location="mobile_bar"
            label="WhatsApp"
            className="inline-flex min-h-11 items-center justify-center gap-1 rounded-lg bg-[#07825e] px-2 py-2 text-xs font-black text-white focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-emerald-200"
          />
          <a
            href={siteConfig.phoneHref}
            data-conversion-event="click_call"
            onClick={() => trackCommercialEvent("click_call", { ...context, lead_type: selectedType, cta_location: "mobile_bar" })}
            className="inline-flex min-h-11 items-center justify-center gap-1 rounded-lg bg-sky-900 px-2 py-2 text-xs font-black text-white focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-sky-300"
          >
            <PhoneCall className="h-4 w-4" aria-hidden="true" />
            Llamar
          </a>
          <ConversionLink
            type="diagnostic"
            context={context}
            event="generate_lead"
            location="mobile_bar"
            label="Evaluación"
            className="inline-flex min-h-11 items-center justify-center gap-1 rounded-lg border border-sky-300 bg-white px-2 py-2 text-xs font-black text-sky-950 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-sky-300"
          />
        </div>
      </nav>
    </>
  );
}
