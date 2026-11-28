import {
  ArrowRight,
  Clock3,
  MapPin,
  Wrench,
  FileText,
} from "lucide-react";
import { CommercialChoices } from "@/components/commercial-entry";
import type { CmsHomeSettings } from "@/lib/cms-content";
import { siteConfig } from "@/lib/site-config";

export function HeroUrgencias({ settings }: { settings?: CmsHomeSettings }) {
  return (
    <section className="home-hero" aria-labelledby="home-title">
      <div className="home-hero-inner">
        <div className="home-hero-copy">
          <p className="home-eyebrow">
            Respuesta sanitaria especializada · 24/7
          </p>
          <h1 id="home-title">
            {settings?.heroTitle ||
              "Destape de alcantarillado, hidrojet y mantenimiento técnico de redes sanitarias"}
          </h1>
          <div className="home-actions">
            <CommercialChoices />
            <a
              href="#servicio-cobertura"
              className="home-button home-button--light"
            >
              Ver servicios y cobertura{" "}
              <ArrowRight size={18} aria-hidden="true" />
            </a>
          </div>
          <p className="home-hero-description">
            Intervenimos desagües, redes de alcantarillado y cámaras de
            alcantarillado con maquinaria especializada, hidrojet y
            videoinspección para resolver obstrucciones, rebalses y fallas
            recurrentes.
          </p>
          <p className="home-slogan">
            {settings?.heroSubtitle || "No intentamos, solucionamos."}
          </p>
          <a href={siteConfig.phoneHref} className="home-hero-call">
            Llamar
          </a>
          <ul className="home-hero-facts">
            <li>
              <Clock3 aria-hidden="true" />
              Urgencias sanitarias 24/7
            </li>
            <li>
              <Wrench aria-hidden="true" />
              Máquina eléctrica e hidrojet
            </li>
            <li>
              <FileText aria-hidden="true" />
              Videoinspección e informe técnico
            </li>
            <li>
              <MapPin aria-hidden="true" />
              Región de Valparaíso
            </li>
          </ul>
        </div>
        <figure className="home-hero-photo">
          <picture className="home-approved-picture">
            <img
              src="/images/commercial/servicio-aprobado-768.webp"
              srcSet="/images/commercial/servicio-aprobado-480.webp 480w, /images/commercial/servicio-aprobado-768.webp 768w, /images/commercial/servicio-aprobado-1254.webp 1254w"
              sizes="(min-width: 1024px) 40vw, (min-width: 640px) 80vw, calc(100vw - 32px)"
              alt="Imagen comercial ilustrativa de atención sanitaria Hidrourgencias con equipo de destape"
              width={1254}
              height={1254}
              className="home-hero-image"
              loading="eager"
              fetchPriority="high"
              decoding="async"
            />
          </picture>
          <figcaption>Hidrourgencias SpA · Imagen comercial ilustrativa</figcaption>
        </figure>
      </div>
    </section>
  );
}
