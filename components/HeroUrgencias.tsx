import {
  MessageCircle,
  ArrowRight,
  Clock3,
  MapPin,
  Wrench,
  FileText,
} from "lucide-react";
import { StaticPicture } from "@/components/static-picture";
import { HomeWhatsAppLink } from "@/components/home-contact";
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
          <p className="home-hero-description">
            Intervenimos desagües, redes de alcantarillado y cámaras de
            alcantarillado con maquinaria especializada, hidrojet y
            videoinspección para resolver obstrucciones, rebalses y fallas
            recurrentes.
          </p>
          <p className="home-slogan">
            {settings?.heroSubtitle || "No intentamos, solucionamos."}
          </p>
          <div className="home-actions">
            <HomeWhatsAppLink location="home_hero">
              <MessageCircle size={19} aria-hidden="true" />
              Solicitar atención por WhatsApp
            </HomeWhatsAppLink>
            <a
              href="#servicio-cobertura"
              className="home-button home-button--light"
            >
              Ver servicios y cobertura{" "}
              <ArrowRight size={18} aria-hidden="true" />
            </a>
          </div>
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
          <StaticPicture
            src={
              settings?.heroImage ||
              "/images/PRINCIPAL/WhatsApp Image 2026-05-24 at 3.54.35 AM.webp"
            }
            alt={
              settings?.heroImageAlt ||
              "Intervención con máquina eléctrica en una cámara de alcantarillado"
            }
            width={899}
            height={1599}
            className="home-hero-image"
            loading="eager"
            fetchPriority="high"
          />
          <figcaption>Maquinaria especializada · Trabajo en terreno</figcaption>
        </figure>
      </div>
    </section>
  );
}
