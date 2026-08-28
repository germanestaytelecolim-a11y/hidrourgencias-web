"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Camera, MessageCircle } from "lucide-react";

import type { PublicWorkCaseDto } from "@/lib/admin/public-work-cases";
import { createWhatsAppUrl } from "@/lib/site-config";

export function PublicAdminCases({
  cases,
  title = "Casos de éxito recientes",
  description = "Trabajos reales ejecutados recientemente por Hidrourgencias, con evidencia fotográfica, antecedentes técnicos y resultados observados en terreno.",
}: {
  cases: PublicWorkCaseDto[];
  title?: string;
  description?: string;
}) {
  if (!cases.length) return null;

  return (
    <section className="mt-9 rounded-3xl border border-sky-100 bg-sky-50 p-4 sm:p-6" aria-labelledby="admin-cases-heading">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.18em] text-sky-700">Evidencia reciente</p>
          <h2 id="admin-cases-heading" className="mt-1 text-2xl font-black tracking-tight text-slate-950">
            {title}
          </h2>
          <p className="mt-2 max-w-3xl text-sm font-semibold leading-6 text-slate-700">{description}</p>
        </div>
      </div>
      <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cases.map((workCase) => {
          const cover = workCase.media.find((asset) => asset.isCover) ?? workCase.media[0];
          const href = `/casos-de-exito/${workCase.slug}`;
          const whatsappHref = createWhatsAppUrl(`Hola Hidrourgencias. Vi el caso "${workCase.title}" en su sitio web y necesito orientación para un problema similar.

Comuna:
Tipo de propiedad:
Descripción:`);
          return (
            <article key={workCase.id} className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-200">
              {cover ? (
                <div className="relative aspect-[4/3] bg-slate-100 sm:aspect-video">
                  <Image
                    src={cover.thumbnailUrl || cover.url}
                    alt={cover.altText || `Evidencia fotografica de ${workCase.title}`}
                    fill
                    sizes="(min-width: 1024px) 31vw, (min-width: 640px) 50vw, 100vw"
                    loading="lazy"
                    className="object-cover"
                  />
                </div>
              ) : (
                <div className="grid aspect-[4/3] place-items-center bg-slate-100 p-5 text-center text-sm font-black text-slate-600 sm:aspect-video">
                  <Camera className="mb-2 h-8 w-8 text-slate-400" />
                  Evidencia fotográfica no publicada
                </div>
              )}
              <div className="p-4">
                <p className="text-sm font-black text-sky-800">{workCase.services.join(" · ")}</p>
                <h3 className="mt-1 text-lg font-black text-slate-950">{workCase.title}</h3>
                <p className="mt-1 text-sm font-bold text-slate-600">
                  {workCase.publicLocation}
                  {workCase.date ? ` · ${formatVisibleDate(workCase.date)}` : ""}
                </p>
                <p className="mt-3 text-sm leading-6 text-slate-700">{workCase.result}</p>
                <div className="mt-4 grid gap-2">
                  <Link
                    href={href}
                    onClick={() => trackCaseEvent("case_view", workCase)}
                    className="brand-blue-cta inline-flex min-h-11 items-center justify-center gap-2 rounded-xl px-4 py-2 text-sm font-black transition hover:-translate-y-0.5"
                  >
                    Ver caso
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                  <a
                    href={whatsappHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => trackCaseEvent("case_whatsapp_click", workCase)}
                    className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-emerald-500 px-4 py-2 text-sm font-black text-white"
                  >
                    <MessageCircle className="h-4 w-4" />
                    Solicitar servicio similar
                  </a>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}

function formatVisibleDate(value: string) {
  const [datePart] = value.split("T");
  const [year, month, day] = datePart.split("-").map((part) => Number.parseInt(part, 10));
  const monthName = [
    "enero",
    "febrero",
    "marzo",
    "abril",
    "mayo",
    "junio",
    "julio",
    "agosto",
    "septiembre",
    "octubre",
    "noviembre",
    "diciembre",
  ][month - 1];

  if (!year || !monthName || !day) return "";
  return `${day} de ${monthName} de ${year}`;
}

function trackCaseEvent(event: string, workCase: PublicWorkCaseDto) {
  if (typeof window === "undefined") return;
  const payload = {
    event,
    service: workCase.services[0] ?? "",
    commune: workCase.commune,
    sector: workCase.sector,
    page_path: window.location.pathname,
    case_slug: workCase.slug,
  };
  window.dataLayer = window.dataLayer ?? [];
  window.dataLayer.push(payload);
  if (typeof window.gtag === "function") window.gtag("event", event, payload);
}

declare global {
  interface Window {
    dataLayer?: Array<Record<string, unknown>>;
    gtag?: (...args: unknown[]) => void;
  }
}
