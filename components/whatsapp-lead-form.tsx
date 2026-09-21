"use client";

import { useMemo, useState, type ChangeEvent, type FormEvent } from "react";

import { CheckCircle, FileText, MapPin, PhoneCall } from "@/components/icons";
import { StaticPicture } from "@/components/static-picture";
import { captureCampaignParams, trackCommercialEvent } from "@/lib/conversion";
import { createDirectWhatsAppUrl } from "@/lib/site-config";

type FormState = {
  name: string;
  propertyType: string;
  requestType: string;
  commune: string;
  sector: string;
  address: string;
  service: string;
  description: string;
  evidence: string;
  terms: boolean;
};

const initialFormState: FormState = {
  name: "",
  propertyType: "",
  requestType: "",
  commune: "",
  sector: "",
  address: "",
  service: "",
  description: "",
  evidence: "",
  terms: false,
};

const propertyTypes = [
  "Particular",
  "Edificio",
  "Condominio",
  "Restaurante",
  "Local comercial",
  "Empresa",
  "Institución",
  "Colegio / liceo",
  "Comunidad administrada",
  "Otro",
];

const requestTypes = [
  "Urgencia sanitaria",
  "Cotización",
  "Mantención preventiva",
  "Evaluación técnica",
  "Informe técnico",
  "Servicio programado",
];

const communes = [
  "Viña del Mar",
  "Valparaíso",
  "Concón",
  "Quilpué",
  "Villa Alemana",
  "Limache",
  "Quillota",
  "Casablanca",
  "Reñaca",
  "Curauma",
  "Placilla",
  "Puchuncaví",
  "Quintero",
  "Mantagua",
  "Maitencillo",
  "Algarrobo",
  "Otra comuna / consultar disponibilidad",
];

const sectorSuggestions: Record<string, string[]> = {
  "Viña del Mar": ["Centro", "Reñaca Alto", "Gómez Carreño", "Forestal", "Miraflores"],
  Valparaíso: ["Plan de Valparaíso", "Playa Ancha", "Cerro Alegre", "Curauma", "Placilla"],
  Concón: ["Centro", "Costa de Montemar", "Bosques de Montemar", "Lomas de Montemar"],
  Quilpué: ["Centro", "El Belloto", "Los Pinos", "Marga Marga"],
  "Villa Alemana": ["Centro", "Peñablanca", "El Rincón", "Troncos Viejos"],
  Limache: ["Centro", "Olmué", "Lliu Lliu", "San Francisco de Limache"],
  Quillota: ["Centro", "San Pedro", "La Calera", "La Cruz"],
  Casablanca: ["Centro", "Valle de Casablanca", "Las Dichas", "Quintay"],
  Reñaca: ["Reñaca Alto", "Reñaca Bajo", "Jardín del Mar", "Sector costero"],
  Curauma: ["Curauma Norte", "Curauma Sur", "Placilla", "Avenida Cardenal Samoré"],
  Placilla: ["Placilla Oriente", "Placilla Poniente", "Curauma", "La Pólvora"],
  Puchuncaví: ["Puchuncaví", "Ventanas", "La Greda", "Horcón"],
  Quintero: ["Centro", "Loncura", "Mantagua", "Sector costero"],
  Mantagua: ["Mantagua", "Santa Adela", "Valle Alegre", "Ruta F-30-E"],
  Maitencillo: ["Maitencillo", "Aguas Blancas", "La Laguna", "Sector costero"],
  Algarrobo: ["Centro", "El Canelo", "Mirasol", "San Alfonso"],
};

const services = [
  "Destape de baño / WC",
  "Destape de lavaplatos",
  "Destape de lavamanos o ducha",
  "Destape de cámara de alcantarillado",
  "Destape de red de alcantarillado",
  "Hidrojet / lavado de red",
  "Videoinspección",
  "Mantención preventiva",
  "Informe técnico",
  "Extracción de aguas servidas",
  "Higienización sanitaria",
  "No estoy seguro / necesito orientación",
];

const evidenceOptions = [
  "Sí, puedo enviar fotografías o videos por WhatsApp",
  "No tengo evidencia disponible",
];

const fieldClassName =
  "min-h-11 rounded-lg border border-slate-300 bg-white px-3 py-2 text-base font-semibold text-slate-900 shadow-sm outline-none transition focus:border-sky-600 focus:ring-4 focus:ring-sky-100";

function buildWhatsAppMessage(values: FormState) {
  return [
    "Hola Hidrourgencias, solicito apoyo para un servicio sanitario.",
    "",
    `Nombre o alias: ${values.name.trim()}`,
    `Tipo de propiedad: ${values.propertyType}`,
    `Tipo de solicitud: ${values.requestType}`,
    `Comuna: ${values.commune}`,
    `Sector: ${values.sector.trim()}`,
    `Dirección o referencia: ${values.address.trim() || "No indicada"}`,
    `Servicio requerido: ${values.service}`,
    `Descripción del problema: ${values.description.trim()}`,
    `Evidencia fotográfica o video: ${values.evidence.startsWith("Sí") ? "Sí" : "No"}`,
    "Términos y condiciones del servicio: Aceptados",
    "",
    "Quedo atento para coordinación.",
  ].join("\n");
}

function getRequestGuidance(requestType: string) {
  if (requestType === "Urgencia sanitaria") {
    return {
      label: "Atención prioritaria",
      text: "Para rebalse, retorno de aguas servidas, cámara colapsada u obstrucción crítica.",
      className: "border-rose-200 bg-rose-50 text-rose-950",
      markerClassName: "bg-rose-600",
    };
  }

  if (requestType === "Cotización") {
    return {
      label: "Solicitud comercial",
      text: "Evaluaremos alcance, disponibilidad y antecedentes del servicio.",
      className: "border-emerald-200 bg-emerald-50 text-emerald-950",
      markerClassName: "bg-emerald-600",
    };
  }

  return {
    label: "Coordinación programada",
    text: "Ideal para mantenciones preventivas, limpieza de cámaras, hidrojet o trabajos coordinados.",
    className: "border-amber-200 bg-amber-50 text-amber-950",
    markerClassName: "bg-amber-500",
  };
}

function SelectField({
  id,
  label,
  value,
  options,
  onChange,
}: {
  id: "propertyType" | "requestType" | "commune" | "service" | "evidence";
  label: string;
  value: string;
  options: string[];
  onChange: (event: ChangeEvent<HTMLSelectElement>) => void;
}) {
  return (
    <label className="grid gap-1.5 text-sm font-extrabold text-slate-900" htmlFor={id}>
      {label} <span className="text-rose-700">*</span>
      <select
        id={id}
        name={id}
        required
        value={value}
        onChange={onChange}
        className={fieldClassName}
      >
        <option value="">Selecciona una opción</option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  );
}

type WhatsAppLeadFormProps = {
  initialDescription?: string;
  variant?: "section" | "modal";
  onClose?: () => void;
};

export function WhatsAppLeadForm({ initialDescription = "", variant = "section", onClose }: WhatsAppLeadFormProps) {
  const [values, setValues] = useState<FormState>(() => ({ ...initialFormState, description: initialDescription }));
  const [showDiscardConfirm, setShowDiscardConfirm] = useState(false);
  const isModal = variant === "modal";
  const requestGuidance = getRequestGuidance(values.requestType);
  const sectorOptions = sectorSuggestions[values.commune] ?? [];
  const hasEnteredInformation = Object.values(values).some((value) => (typeof value === "string" ? value.trim() : value));

  const isValid = useMemo(
    () =>
      Boolean(
        values.name.trim() &&
          values.propertyType &&
          values.requestType &&
          values.commune &&
          values.sector.trim() &&
          values.service &&
          values.description.trim() &&
          values.evidence &&
          values.terms,
      ),
    [values],
  );

  function updateField(event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    const { name, value, type } = event.target;
    const nextValue = type === "checkbox" ? (event.target as HTMLInputElement).checked : value;
    setValues((current) => ({ ...current, [name]: nextValue }));
  }

  function requestClose() {
    if (hasEnteredInformation) {
      setShowDiscardConfirm(true);
      return;
    }
    onClose?.();
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    captureCampaignParams();

    if (!isValid) return;

    const message = buildWhatsAppMessage(values);
    trackCommercialEvent("whatsapp_form_submit", {
      event_category: "lead",
      event_label: "formulario_whatsapp_servicio",
      tipo_solicitud: values.requestType,
      comuna: values.commune,
      sector: values.sector.trim(),
      servicio_requerido: values.service,
      tipo_propiedad: values.propertyType,
      property_type: values.propertyType,
      contact_origin: initialDescription ? "contexto_precargado" : undefined,
    });
    window.open(createDirectWhatsAppUrl(message), "_blank", "noopener,noreferrer");
  }

  return (
    <section
      id="whatsapp-solicitud"
      className={
        isModal
          ? "relative flex max-h-[calc(100dvh-1rem)] flex-col overflow-hidden rounded-lg border border-sky-200 bg-white shadow-[0_24px_70px_-48px_rgba(8,56,95,0.85)] sm:max-h-[calc(100dvh-4rem)]"
          : "mt-9 scroll-mt-28 rounded-lg border border-sky-200 bg-white p-5 shadow-[0_24px_70px_-48px_rgba(8,56,95,0.85)] sm:p-7"
      }
      aria-labelledby="whatsapp-solicitud-title"
    >
      <header className={isModal ? "flex items-center justify-between gap-3 border-b border-slate-200 px-3 py-2 sm:gap-4 sm:px-5 sm:py-3" : "flex items-center gap-3 border-b border-slate-100 pb-4"}>
        <div className="flex min-w-0 items-center gap-3">
          <StaticPicture
            src="/images/logo-hidrourgencias.jpg"
            alt="Hidrourgencias SpA"
            width={48}
            height={48}
            className="h-8 w-8 rounded-lg border border-sky-100 object-cover p-0.5 sm:h-11 sm:w-11"
            pictureClassName="block h-8 w-8 shrink-0 sm:h-11 sm:w-11"
          />
          <div className="min-w-0">
            <p className="text-[11px] font-black uppercase tracking-[0.16em] text-sky-700">Solicitud sanitaria</p>
            <h2 id="whatsapp-solicitud-title" className="hidden text-lg font-black text-slate-950 sm:block sm:text-xl">
              Coordinemos tu requerimiento
            </h2>
            <p className="mt-0.5 text-xs font-semibold leading-4 text-slate-600 sm:hidden">Completa los datos para coordinar por WhatsApp.</p>
          </div>
        </div>
        {isModal ? (
          <button
            type="button"
            onClick={requestClose}
            className="shrink-0 rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-xs font-black text-slate-700 transition hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-sky-100 sm:px-3 sm:py-2 sm:text-sm"
          >
            Cerrar
          </button>
        ) : null}
      </header>

      <div className={isModal ? "flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto overscroll-contain p-3 sm:p-5 lg:grid lg:grid-cols-[minmax(14rem,0.38fr)_minmax(0,0.62fr)] lg:gap-5 lg:overflow-hidden" : "mt-5 grid gap-5 lg:grid-cols-[minmax(14rem,0.38fr)_minmax(0,0.62fr)]"}>
        <aside className={isModal ? "order-2 shrink-0 lg:order-1" : "shrink-0"}>
          <p className="text-sm font-semibold leading-6 text-slate-700 sm:hidden">
            Estos datos nos ayudan a responder más rápido y derivar correctamente tu solicitud.
          </p>
          <p className="hidden text-sm font-semibold leading-6 text-slate-700 sm:block">
            Completa estos antecedentes para que nuestro equipo pueda evaluar tu requerimiento con mayor rapidez,
            priorizar urgencias reales y derivar el servicio correcto sin hacerte repetir la misma información por
            WhatsApp.
          </p>
          <p className="mt-3 hidden text-sm font-black text-sky-800 sm:block">Mientras más claro sea el antecedente, más rápida será la coordinación.</p>
          <div className="mt-3 flex flex-wrap gap-1.5 text-[0.65rem] font-bold text-slate-600 sm:hidden">
            <span className="rounded-md border border-slate-200 bg-slate-50 px-2 py-1">Sin precios automáticos</span>
            <span className="rounded-md border border-slate-200 bg-slate-50 px-2 py-1">Cobertura V Región</span>
            <span className="rounded-md border border-slate-200 bg-slate-50 px-2 py-1">Respuesta más rápida</span>
          </div>
          <div className="mt-4 hidden gap-2 text-sm font-bold text-slate-700 sm:grid">
            <span className="inline-flex items-center gap-2"><CheckCircle className="h-4 w-4 text-emerald-600" /> Sin precios automáticos</span>
            <span className="inline-flex items-center gap-2"><MapPin className="h-4 w-4 text-sky-700" /> Cobertura Región de Valparaíso</span>
            <span className="inline-flex items-center gap-2"><FileText className="h-4 w-4 text-sky-700" /> Mensaje listo para coordinar</span>
          </div>
        </aside>

        <form noValidate onSubmit={handleSubmit} className={isModal ? "order-1 min-h-0 flex-none overflow-visible pr-0 lg:order-2 lg:flex-1 lg:overflow-y-auto lg:pr-2" : ""} aria-describedby="whatsapp-form-status">
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="grid gap-1.5 text-sm font-extrabold text-slate-900" htmlFor="name">
              Nombre o alias <span className="text-rose-700">*</span>
              <input id="name" name="name" required value={values.name} onChange={updateField} className={fieldClassName} autoComplete="name" placeholder="Ej: Ana, conserjería o administración" />
            </label>
            <SelectField id="requestType" label="Tipo de solicitud" value={values.requestType} options={requestTypes} onChange={updateField} />
            <SelectField id="propertyType" label="Tipo de propiedad" value={values.propertyType} options={propertyTypes} onChange={updateField} />
            <SelectField id="commune" label="Comuna" value={values.commune} options={communes} onChange={updateField} />
            <label className="grid gap-1.5 text-sm font-extrabold text-slate-900" htmlFor="sector">
              Sector <span className="text-rose-700">*</span>
              <input id="sector" name="sector" required value={values.sector} onChange={updateField} list="sector-options" placeholder="Ej: centro, sector costero o Reñaca Alto" className={fieldClassName} />
              <datalist id="sector-options">
                {sectorOptions.map((sector) => <option key={sector} value={sector} />)}
              </datalist>
            </label>
            <label className="grid gap-1.5 text-sm font-extrabold text-slate-900" htmlFor="address">
              Dirección <span className="text-xs font-bold text-slate-500">recomendada</span>
              <input id="address" name="address" value={values.address} onChange={updateField} placeholder="Calle, número, edificio o referencia" className={fieldClassName} autoComplete="street-address" />
            </label>
            <SelectField id="service" label="Servicio requerido" value={values.service} options={services} onChange={updateField} />
            <SelectField id="evidence" label="Evidencia fotográfica o video" value={values.evidence} options={evidenceOptions} onChange={updateField} />
          </div>

          <div className={`mt-3 flex gap-2.5 rounded-lg border p-2.5 text-xs font-bold leading-5 sm:gap-3 sm:p-3 sm:text-sm ${requestGuidance.className}`} aria-live="polite">
            <span className={`mt-1.5 h-2 w-2 shrink-0 rounded-full sm:h-2.5 sm:w-2.5 ${requestGuidance.markerClassName}`} aria-hidden="true" />
            <p><span className="font-black">{requestGuidance.label}.</span> {requestGuidance.text}</p>
          </div>

          <label className="mt-3 grid gap-1.5 text-sm font-extrabold text-slate-900" htmlFor="description">
            Cuéntanos brevemente qué ocurre <span className="text-rose-700">*</span>
            <textarea id="description" name="description" required value={values.description} onChange={updateField} rows={3} placeholder="Ej: el baño rebalsa al descargar, hay mal olor o la cámara está llena." className={`${fieldClassName} min-h-24 resize-y`} />
          </label>

          <label className="mt-3 flex gap-3 rounded-lg border border-slate-200 bg-slate-50 p-3 text-sm font-bold leading-5 text-slate-700" htmlFor="terms">
            <input id="terms" name="terms" type="checkbox" required checked={values.terms} onChange={updateField} className="mt-0.5 h-5 w-5 shrink-0 accent-emerald-600" />
            <span>
              Acepto los términos y condiciones del servicio. <a className="font-black text-sky-800 underline underline-offset-4" href="#terminos-servicio">Ver términos y condiciones</a>.
            </span>
          </label>

          <div className="sticky bottom-0 mt-3 border-t border-slate-100 bg-white/95 pt-3 backdrop-blur-sm">
            <p id="whatsapp-form-status" className="min-h-5 text-sm font-extrabold text-rose-700" role="status">
              {!isValid ? "Completa los campos obligatorios para continuar" : ""}
            </p>
            <button type="submit" disabled={!isValid} className="mt-2 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-lg bg-emerald-600 px-5 py-2.5 text-base font-black text-white shadow-[0_18px_40px_-24px_rgba(5,150,105,0.9)] transition hover:bg-emerald-700 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-emerald-200 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:text-slate-600 disabled:shadow-none" aria-disabled={!isValid}>
              <PhoneCall className="h-5 w-5" /> Enviar solicitud por WhatsApp
            </button>
          </div>
        </form>
      </div>

      {showDiscardConfirm ? (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-slate-950/55 p-4" role="alertdialog" aria-modal="true" aria-labelledby="discard-form-title">
          <div className="w-full max-w-sm rounded-lg bg-white p-5 shadow-xl">
            <h3 id="discard-form-title" className="text-lg font-black text-slate-950">¿Cerrar y perder la información?</h3>
            <p className="mt-2 text-sm font-semibold leading-6 text-slate-700">Tienes información ingresada. ¿Deseas cerrar y perder los datos?</p>
            <div className="mt-5 flex justify-end gap-3">
              <button type="button" onClick={() => setShowDiscardConfirm(false)} className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-black text-slate-700">Seguir completando</button>
              <button type="button" onClick={onClose} className="rounded-lg bg-rose-600 px-3 py-2 text-sm font-black text-white">Cerrar y perder datos</button>
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
}
