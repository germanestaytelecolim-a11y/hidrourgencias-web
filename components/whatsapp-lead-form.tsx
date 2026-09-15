"use client";

import { useMemo, useState, type ChangeEvent, type FormEvent } from "react";

import { CheckCircle, FileText, MapPin, PhoneCall } from "@/components/icons";
import { captureCampaignParams, trackCommercialEvent } from "@/lib/conversion";
import { createDirectWhatsAppUrl } from "@/lib/site-config";

type FormState = {
  name: string;
  propertyType: string;
  requestType: string;
  commune: string;
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

const services = [
  "Destape de alcantarillado",
  "Destape de desagüe",
  "Destape de WC",
  "Destape de lavaplatos",
  "Destape de lavamanos",
  "Destape de ducha",
  "Destape de cámara de alcantarillado",
  "Destape de red horizontal",
  "Destape de red vertical",
  "Hidrojet / lavado de red",
  "Mantención preventiva de alcantarillado",
  "Limpieza de cámaras",
  "Videoinspección de ductos",
  "Informe técnico sanitario",
  "Extracción de aguas servidas",
  "Limpieza e higienización sanitaria",
  "Sanitización de superficies",
  "Evaluación por malos olores",
  "Diagnóstico de filtración o rebalse",
  "Otro servicio sanitario",
];

const evidenceOptions = [
  "Sí, puedo enviar fotografías o videos por WhatsApp",
  "No tengo evidencia disponible",
];

function buildWhatsAppMessage(values: FormState) {
  return [
    "Hola Hidrourgencias, solicito apoyo para un servicio sanitario.",
    "",
    `Nombre o alias: ${values.name.trim()}`,
    `Tipo de propiedad: ${values.propertyType}`,
    `Tipo de solicitud: ${values.requestType}`,
    `Comuna o sector: ${values.commune}`,
    `Dirección o referencia: ${values.address.trim() || "No indicada"}`,
    `Servicio requerido: ${values.service}`,
    `Descripción del problema: ${values.description.trim()}`,
    `Evidencia fotográfica o video: ${values.evidence.startsWith("Sí") ? "Sí" : "No"}`,
    "Términos y condiciones del servicio: Aceptados",
    "",
    "Quedo atento para coordinación.",
  ].join("\n");
}

function SelectField({
  id,
  label,
  value,
  options,
  onChange,
}: {
  id: keyof FormState;
  label: string;
  value: string;
  options: string[];
  onChange: (event: ChangeEvent<HTMLSelectElement>) => void;
}) {
  return (
    <label className="grid gap-2 text-sm font-extrabold text-slate-900" htmlFor={id}>
      {label} <span className="sr-only">obligatorio</span>
      <select
        id={id}
        name={id}
        required
        value={value}
        onChange={onChange}
        className="min-h-12 rounded-lg border border-slate-300 bg-white px-3 py-2 text-base font-semibold text-slate-900 shadow-sm outline-none transition focus:border-sky-600 focus:ring-4 focus:ring-sky-100"
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
  variant?: "section" | "modal";
  onClose?: () => void;
};

export function WhatsAppLeadForm({ variant = "section", onClose }: WhatsAppLeadFormProps) {
  const [values, setValues] = useState<FormState>(initialFormState);

  const isValid = useMemo(
    () =>
      Boolean(
        values.name.trim() &&
          values.propertyType &&
          values.requestType &&
          values.commune &&
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

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    captureCampaignParams();

    if (!isValid) {
      return;
    }

    const message = buildWhatsAppMessage(values);
    trackCommercialEvent("whatsapp_form_submit", {
      event_category: "lead",
      event_label: "formulario_whatsapp_servicio",
      tipo_solicitud: values.requestType,
      servicio_requerido: values.service,
      comuna: values.commune,
      property_type: values.propertyType,
    });
    window.open(createDirectWhatsAppUrl(message), "_blank", "noopener,noreferrer");
  }

  return (
    <section
      id="whatsapp-solicitud"
      className={
        variant === "modal"
          ? "rounded-lg border border-sky-200 bg-white p-5 shadow-[0_24px_70px_-48px_rgba(8,56,95,0.85)] sm:p-7 lg:p-8"
          : "mt-9 scroll-mt-28 rounded-lg border border-sky-200 bg-white p-5 shadow-[0_24px_70px_-48px_rgba(8,56,95,0.85)] sm:p-7 lg:p-8"
      }
      aria-labelledby="whatsapp-solicitud-title"
    >
      {variant === "modal" ? (
        <div className="mb-4 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-black text-slate-700 transition hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-sky-100"
          >
            Cerrar
          </button>
        </div>
      ) : null}
      <div className="grid gap-6 lg:grid-cols-[0.38fr_0.62fr] lg:items-start">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.18em] text-sky-700">Formulario previo</p>
          <h2 id="whatsapp-solicitud-title" className="mt-3 text-3xl font-black tracking-tight text-slate-950">
            Ordena tu solicitud antes de abrir WhatsApp
          </h2>
          <p className="mt-4 text-sm font-semibold leading-7 text-slate-700">
            Completa los antecedentes mínimos para priorizar urgencias reales, derivar el servicio correcto y evitar
            mensajes incompletos.
          </p>
          <div className="mt-5 grid gap-3 text-sm font-bold text-slate-700">
            <span className="inline-flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-emerald-600" /> Sin precios automáticos
            </span>
            <span className="inline-flex items-center gap-2">
              <MapPin className="h-5 w-5 text-sky-700" /> Cobertura Región de Valparaíso
            </span>
            <span className="inline-flex items-center gap-2">
              <FileText className="h-5 w-5 text-sky-700" /> Mensaje técnico listo para responder
            </span>
          </div>
        </div>

        <form noValidate onSubmit={handleSubmit} className="grid gap-4" aria-describedby="whatsapp-form-status">
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="grid gap-2 text-sm font-extrabold text-slate-900" htmlFor="name">
              Nombre o alias <span className="sr-only">obligatorio</span>
              <input
                id="name"
                name="name"
                required
                value={values.name}
                onChange={updateField}
                className="min-h-12 rounded-lg border border-slate-300 px-3 py-2 text-base font-semibold text-slate-900 shadow-sm outline-none transition focus:border-sky-600 focus:ring-4 focus:ring-sky-100"
                autoComplete="name"
              />
            </label>
            <SelectField id="propertyType" label="Tipo de propiedad" value={values.propertyType} options={propertyTypes} onChange={updateField} />
            <SelectField id="requestType" label="Tipo de solicitud" value={values.requestType} options={requestTypes} onChange={updateField} />
            <SelectField id="commune" label="Comuna o sector de cobertura" value={values.commune} options={communes} onChange={updateField} />
          </div>

          <label className="grid gap-2 text-sm font-extrabold text-slate-900" htmlFor="address">
            Dirección <span className="text-xs font-bold text-slate-500">recomendado</span>
            <input
              id="address"
              name="address"
              value={values.address}
              onChange={updateField}
              placeholder="Calle, número, edificio, local o referencia"
              className="min-h-12 rounded-lg border border-slate-300 px-3 py-2 text-base font-semibold text-slate-900 shadow-sm outline-none transition focus:border-sky-600 focus:ring-4 focus:ring-sky-100"
              autoComplete="street-address"
            />
          </label>

          <SelectField id="service" label="Servicio requerido" value={values.service} options={services} onChange={updateField} />

          <label className="grid gap-2 text-sm font-extrabold text-slate-900" htmlFor="description">
            Breve descripción del problema <span className="sr-only">obligatorio</span>
            <textarea
              id="description"
              name="description"
              required
              value={values.description}
              onChange={updateField}
              rows={4}
              placeholder="Ejemplo: cámara rebalsada, baño tapado, malos olores, red lenta, inundación, grasas acumuladas, raíces, etc."
              className="min-h-32 rounded-lg border border-slate-300 px-3 py-3 text-base font-semibold text-slate-900 shadow-sm outline-none transition focus:border-sky-600 focus:ring-4 focus:ring-sky-100"
            />
          </label>

          <SelectField id="evidence" label="Envío de evidencia" value={values.evidence} options={evidenceOptions} onChange={updateField} />

          <label className="flex gap-3 rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm font-bold leading-6 text-slate-700" htmlFor="terms">
            <input
              id="terms"
              name="terms"
              type="checkbox"
              required
              checked={values.terms}
              onChange={updateField}
              className="mt-1 h-5 w-5 shrink-0 accent-emerald-600"
            />
            <span>
              Acepto los términos y condiciones del servicio, incluyendo evaluación técnica, condiciones de acceso,
              limitaciones por daños estructurales, obstrucciones severas, redes colapsadas o problemas fuera del
              alcance operativo directo.{" "}
              <a className="font-black text-sky-800 underline underline-offset-4" href="#terminos-servicio">
                Ver términos y condiciones
              </a>
              .
            </span>
          </label>

          <p id="whatsapp-form-status" className="min-h-6 text-sm font-extrabold text-rose-700" role="status">
            {!isValid ? "Complete los campos obligatorios para continuar" : ""}
          </p>

          <button
            type="submit"
            disabled={!isValid}
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg bg-emerald-600 px-5 py-3 text-base font-black text-white shadow-[0_18px_40px_-24px_rgba(5,150,105,0.9)] transition hover:bg-emerald-700 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-emerald-200 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:text-slate-600 disabled:shadow-none"
            aria-disabled={!isValid}
          >
            <PhoneCall className="h-5 w-5" />
            Enviar solicitud por WhatsApp
          </button>
        </form>
      </div>
    </section>
  );
}
