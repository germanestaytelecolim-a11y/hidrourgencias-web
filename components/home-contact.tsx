"use client";

import Link from "next/link";

import { useEffect, useState, type ReactNode } from "react";
import { Music2, MessageCircle, ArrowUpRight } from "lucide-react";
import {
  captureCampaignParams,
  trackCommercialEvent,
  type LeadType,
} from "@/lib/conversion";
import { homeLeadMessage } from "@/lib/home-services";
import { createWhatsAppUrl, siteConfig } from "@/lib/site-config";

export function HomeWhatsAppLink({
  children,
  type = "emergency",
  location,
  className = "home-button home-button--whatsapp",
  service,
  commune,
  sector,
}: {
  children: ReactNode;
  type?: LeadType;
  location: string;
  className?: string;
  service?: string;
  commune?: string;
  sector?: string;
}) {
  return (
    <a
      href={createWhatsAppUrl(homeLeadMessage(type, service, commune, sector))}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
      data-conversion-event={
        type === "emergency" ? "click_whatsapp" : "generate_lead"
      }
      data-lead-type={type}
      onClick={() => {
        trackCommercialEvent(`select_${type}`, {
          lead_type: type,
          cta_location: location,
        });
        trackCommercialEvent(
          type === "emergency" ? "click_whatsapp" : "generate_lead",
          { lead_type: type, cta_location: location, service, commune, sector },
        );
      }}
    >
      {children}
    </a>
  );
}

export function HomeLeadPaths() {
  return (
    <section
      id="atencion"
      className="home-section home-paths"
      aria-labelledby="home-paths-title"
    >
      <div className="home-section-heading">
        <p className="home-eyebrow">Urgencia o planificación</p>
        <h2 id="home-paths-title">
          Una coordinación distinta para cada necesidad
        </h2>
      </div>
      <div className="home-two-columns">
        <article id="urgencias" className="home-path">
          <p className="home-eyebrow">Atención sanitaria · 24/7</p>
          <h3>Resolver una urgencia</h3>
          <p>
            Rebalse, retorno de aguas servidas, cámara de alcantarillado
            colapsada o desagüe sin evacuación.
          </p>
          <p className="home-request">
            Envía comuna, dirección, síntoma, punto afectado y fotos o videos.
            En empresas o comunidades, indica tu nombre y cargo.
          </p>
          <HomeWhatsAppLink location="home_emergency">
            <MessageCircle size={18} aria-hidden="true" /> Solicitar atención
          </HomeWhatsAppLink>
          <button
            type="button"
            className="home-text-link"
            onClick={() => {
              trackCommercialEvent("select_emergency", {
                cta_location: "home_form",
              });
              window.dispatchEvent(new Event("hu:open-emergency-form"));
            }}
          >
            Completar formulario de urgencia
          </button>
        </article>
        <article id="mantencion-b2b" className="home-path">
          <p className="home-eyebrow">Administraciones y empresas</p>
          <h3>Programar mantención o evaluación</h3>
          <p>
            Hidrojet, limpieza de cámaras de alcantarillado, videoinspección y
            evaluación de propiedades para cuidar la continuidad operativa.
          </p>
          <p className="home-request">
            Indica tipo de instalación, comuna, cantidad de cámaras de
            alcantarillado o redes, fecha estimada, contacto y necesidad de
            informe.
          </p>
          <HomeWhatsAppLink
            type="maintenance"
            location="home_b2b"
            className="home-button home-button--blue"
          >
            Cotizar mantenimiento <ArrowUpRight size={18} aria-hidden="true" />
          </HomeWhatsAppLink>
          <Link
            className="home-text-link"
            href="/servicios/analisis-tecnico-propiedad-redes-sanitarias"
          >
            Evaluación sanitaria de propiedades
          </Link>
        </article>
      </div>
    </section>
  );
}

export function HomeMobileBar() {
  const [editing, setEditing] = useState(false);
  useEffect(() => {
    captureCampaignParams();
    function update() {
      const fieldFocused =
        document.activeElement?.matches(
          "input, textarea, select, [contenteditable=true]",
        ) ?? false;
      const keyboardOpen = window.visualViewport
        ? window.innerHeight - window.visualViewport.height > 150
        : false;
      setEditing(fieldFocused || keyboardOpen);
    }
    document.addEventListener("focusin", update);
    document.addEventListener("focusout", update);
    window.visualViewport?.addEventListener("resize", update);
    return () => {
      document.removeEventListener("focusin", update);
      document.removeEventListener("focusout", update);
      window.visualViewport?.removeEventListener("resize", update);
    };
  }, []);
  return (
    <nav
      className="home-mobile-bar"
      hidden={editing}
      aria-label="Contacto rápido"
      data-conversion-mobile-bar
    >
      <HomeWhatsAppLink location="mobile_bar">
        <MessageCircle size={18} aria-hidden="true" /> WhatsApp
      </HomeWhatsAppLink>
      <HomeWhatsAppLink
        type="diagnostic"
        location="mobile_bar"
        className="home-button home-button--outline"
      >
        Evaluación
      </HomeWhatsAppLink>
    </nav>
  );
}

const socialPaths: Record<string, string> = {
  Facebook:
    "M14 8h3V5h-3c-2.76 0-5 2.24-5 5v2H7v3h2v4h3v-4h3l1-3h-4v-2c0-1.1.9-2 2-2Z",
  Instagram:
    "M7 3h10a4 4 0 0 1 4 4v10a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V7a4 4 0 0 1 4-4Zm0 2a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2H7Zm5 3.25A3.75 3.75 0 1 1 8.25 12 3.75 3.75 0 0 1 12 8.25Zm0 2A1.75 1.75 0 1 0 13.75 12 1.75 1.75 0 0 0 12 10.25ZM16.75 7a1 1 0 1 1-1 1 1 1 0 0 1 1-1Z",
  YouTube:
    "M21.8 8.08a2.9 2.9 0 0 0-2.04-2.06C18.04 5.5 12 5.5 12 5.5s-6.04 0-7.76.52A2.9 2.9 0 0 0 2.2 8.08 30.2 30.2 0 0 0 1.75 12c0 1.31.15 2.62.45 3.92a2.9 2.9 0 0 0 2.04 2.06c1.72.52 7.76.52 7.76.52s6.04 0 7.76-.52a2.9 2.9 0 0 0 2.04-2.06c.3-1.3.45-2.61.45-3.92s-.15-2.62-.45-3.92ZM10 15.25V8.75L15.5 12 10 15.25Z",
};
export function HomeSocialLinks() {
  return (
    <div className="home-social" aria-label="Redes sociales">
      {siteConfig.social.map((social) => {
        const iconPath = socialPaths[social.label];
        return (
          <a
            key={social.label}
            href={social.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={social.label}
            onClick={() =>
              trackCommercialEvent(
                `social_${social.label.toLowerCase()}_click`,
                { cta_location: "inicio" },
              )
            }
          >
            {iconPath ? (
              <svg
                width="19"
                height="19"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path fill="currentColor" d={iconPath} />
              </svg>
            ) : (
              <Music2 size={19} aria-hidden="true" />
            )}
            <span>{social.label}</span>
          </a>
        );
      })}
    </div>
  );
}
