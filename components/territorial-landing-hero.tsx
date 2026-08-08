import Image from "next/image";
import { ExternalLink, Mail } from "lucide-react";
import type { CSSProperties } from "react";

import { ServiceTermsNotice } from "@/components/service-terms";
import type { ComunaLandingData } from "@/lib/comuna-landings";
import { GOOGLE_REVIEWS_URL, createMailToUrl, createWhatsAppUrl } from "@/lib/site-config";

type Props = {
  landing: ComunaLandingData;
};

type TerritorialHeroStyle = CSSProperties & {
  "--territorial-accent": string;
  "--territorial-position": string;
};

export function TerritorialLandingHero({ landing }: Props) {
  const visual = landing.visual;

  if (!visual) return null;

  const style: TerritorialHeroStyle = {
    "--territorial-accent": visual.accent,
    "--territorial-position": visual.imagePosition,
  };

  return (
    <section className={`territorial-hero territorial-hero--${visual.treatment}`} style={style}>
      <Image
        src={visual.image}
        alt={visual.alt}
        fill
        preload
        sizes="(max-width: 768px) 100vw, 1152px"
        className="territorial-hero__image"
      />
      <div className="territorial-hero__veil" aria-hidden="true" />

      <div className="territorial-hero__content">
        <p className="territorial-hero__eyebrow">{landing.presentation.schemaServiceType}</p>
        <h1>{landing.h1}</h1>
        <div className="territorial-hero__copy">
          {landing.heroParagraphs.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
          <p>
            Sumamos 15 anos de experiencia en el rubro sanitario, tecnicos con certificacion SEC gas clase 3 y
            maquinaria profesional RIDGID para dar respuestas de alto estandar en {landing.comuna}.
          </p>
        </div>

        <ServiceTermsNotice tone="dark" className="mt-7 max-w-4xl" />

        <div className="territorial-hero__actions">
          <a
            href={createWhatsAppUrl(landing.ctaPrimaryMessage)}
            target="_blank"
            rel="noopener noreferrer"
            className="territorial-hero__primary"
          >
            {landing.presentation.primaryCtaLabel}
          </a>
          <a
            href={createWhatsAppUrl(landing.ctaMidMessage)}
            target="_blank"
            rel="noopener noreferrer"
            className="territorial-hero__secondary"
          >
            {landing.presentation.secondaryCtaLabel}
          </a>
          <a href={createMailToUrl()} className="territorial-hero__light-action">
            <Mail className="h-4 w-4" aria-hidden="true" />
            Enviar solicitud por correo
          </a>
          <a
            href={GOOGLE_REVIEWS_URL}
            target="_blank"
            rel="noopener noreferrer nofollow"
            className="territorial-hero__light-action"
          >
            <ExternalLink className="h-4 w-4" aria-hidden="true" />
            Resenas Google
          </a>
        </div>
      </div>

      <div className="territorial-hero__local" aria-label={`Sectores de cobertura en ${landing.comuna}`}>
        <strong>{landing.comuna}</strong>
        {landing.nearbyZones.slice(0, 4).map((zone) => (
          <span key={zone}>{zone}</span>
        ))}
      </div>
    </section>
  );
}
