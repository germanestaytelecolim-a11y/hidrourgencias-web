"use client";

import { ArrowRight, Camera, ExternalLink, PhoneCall, ShieldCheck } from "@/components/icons";
import { createWhatsAppUrl, siteConfig } from "@/lib/site-config";

const socialCopy: Record<string, { shortLabel: string; description: string; accent: string; surface: string }> = {
  Instagram: {
    shortLabel: "IG",
    description: "Fotos y registros de trabajos reales en terreno.",
    accent: "from-pink-500 to-orange-400",
    surface: "bg-pink-50 text-pink-950 border-pink-200",
  },
  TikTok: {
    shortLabel: "TT",
    description: "Videos breves de intervenciones, equipos y resultados.",
    accent: "from-slate-950 to-cyan-500",
    surface: "bg-slate-950 text-white border-slate-800",
  },
  YouTube: {
    shortLabel: "YT",
    description: "Contenido tecnico y evidencia extendida de servicios.",
    accent: "from-red-600 to-red-500",
    surface: "bg-red-50 text-red-950 border-red-200",
  },
  Facebook: {
    shortLabel: "FB",
    description: "Actualizaciones, publicaciones y presencia de marca.",
    accent: "from-blue-700 to-sky-500",
    surface: "bg-blue-50 text-blue-950 border-blue-200",
  },
};

type SocialProofLinksSectionProps = {
  className?: string;
  context?: string;
};

export function SocialProofLinksSection({ className = "", context = "sitio" }: SocialProofLinksSectionProps) {
  const whatsappHref = createWhatsAppUrl(
    `Hola Hidrourgencias. Quiero revisar evidencia de trabajos y solicitar orientacion para un servicio similar.

Origen: ${context}
Comuna:
Tipo de propiedad:
Problema:`,
  );

  return (
    <section
      className={`relative overflow-hidden rounded-[2rem] border border-sky-200/80 bg-[linear-gradient(135deg,#061827_0%,#08385f_48%,#0e5f86_100%)] p-5 text-white shadow-[0_30px_75px_-42px_rgba(8,56,95,0.95)] sm:p-7 lg:p-8 ${className}`}
      aria-labelledby="social-proof-heading"
    >
      <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full border border-white/10 bg-white/10" />
      <div className="pointer-events-none absolute bottom-0 left-0 h-28 w-full bg-[linear-gradient(90deg,rgba(6,194,134,0.22),transparent_55%)]" />

      <div className="relative grid gap-7 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
        <div>
          <p className="inline-flex items-center gap-2 rounded-full border border-cyan-200/30 bg-white/10 px-3 py-1.5 text-xs font-black uppercase tracking-[0.18em] text-cyan-50">
            <Camera className="h-4 w-4" />
            Evidencia en terreno
          </p>
          <h2 id="social-proof-heading" className="mt-4 text-3xl font-black tracking-tight text-white sm:text-4xl">
            Mira nuestros trabajos en terreno
          </h2>
          <p className="mt-4 max-w-2xl text-sm font-semibold leading-7 text-sky-50 sm:text-base">
            Revisa evidencia real de destapes, hidrojet, mantenciones preventivas y trabajos ejecutados por
            Hidrourgencias en terreno.
          </p>
          <div className="mt-5 grid gap-3 text-sm font-bold text-sky-50 sm:grid-cols-2">
            <p className="flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-emerald-300" />
              Evidencia visual antes de decidir
            </p>
            <p className="flex items-center gap-2">
              <PhoneCall className="h-5 w-5 text-emerald-300" />
              Contacto directo para casos similares
            </p>
          </div>
          <a
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackSocialProofEvent("social_whatsapp_click", context)}
            className="mt-6 inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-emerald-400 px-5 py-3 text-sm font-black text-emerald-950 shadow-lg shadow-emerald-950/20 transition hover:-translate-y-0.5 hover:bg-emerald-300 focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-emerald-200"
          >
            Solicitar atencion por WhatsApp
            <ArrowRight className="h-4 w-4" />
          </a>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          {siteConfig.social.map((social) => {
            const item = socialCopy[social.label] ?? {
              shortLabel: social.label.slice(0, 2).toUpperCase(),
              description: "Publicaciones y evidencia operativa de Hidrourgencias.",
              accent: "from-sky-600 to-cyan-500",
              surface: "bg-sky-50 text-sky-950 border-sky-200",
            };
            const eventName = `social_${social.label.toLowerCase()}_click`;

            return (
              <a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackSocialProofEvent(eventName, context)}
                className={`group relative min-h-36 overflow-hidden rounded-2xl border p-4 shadow-xl shadow-slate-950/15 transition hover:-translate-y-1 hover:shadow-2xl focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-cyan-200 ${item.surface}`}
              >
                <div className={`absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r ${item.accent}`} />
                <div className="flex items-start justify-between gap-3">
                  <span className={`grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br ${item.accent} text-sm font-black text-white shadow-lg`}>
                    {item.shortLabel}
                  </span>
                  <ExternalLink className="h-5 w-5 opacity-70 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:opacity-100" />
                </div>
                <h3 className="mt-4 text-lg font-black">{social.label}</h3>
                <p className="mt-2 text-sm font-bold leading-6 opacity-85">{item.description}</p>
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function trackSocialProofEvent(event: string, context: string) {
  if (typeof window === "undefined") return;
  const payload = { event, page_path: window.location.pathname, cta_location: context };
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
