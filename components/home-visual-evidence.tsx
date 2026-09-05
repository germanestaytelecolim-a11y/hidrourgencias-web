"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  MapPin,
  Check,
  MessageCircle,
  Play,
} from "lucide-react";
import type { NavigationCoverage } from "@/lib/navigation";
import { HomeWhatsAppLink } from "@/components/home-contact";
import { StaticPicture } from "@/components/static-picture";
import { siteConfig } from "@/lib/site-config";

const photographs = [
  {
    id: 16,
    title: "Acceso a la red",
    text: "Equipo eléctrico conectado a una cámara de alcantarillado.",
  },
  {
    id: 5,
    title: "Equipamiento en terreno",
    text: "Equipo de agua a presión para intervenciones sanitarias.",
  },
  {
    id: 9,
    title: "Trabajo en cámaras",
    text: "Operario con protección durante una intervención en cámara.",
  },
  {
    id: 6,
    title: "Extracción de aguas",
    text: "Motobomba y mangueras utilizadas en terreno.",
  },
  {
    id: 14,
    title: "Obstrucciones visibles",
    text: "Material retirado junto a un acceso de alcantarillado.",
  },
];

export function HomeEvidence() {
  const track = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState(0);
  function move(direction: number) {
    const element = track.current;
    if (!element) return;
    const step = (element.firstElementChild as HTMLElement)?.offsetWidth + 16;
    element.scrollBy({
      left: direction * step,
      behavior: matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "instant"
        : "smooth",
    });
  }
  const channel = siteConfig.social.find((item) => item.label === "YouTube");
  return (
    <section
      id="evidencia-visual"
      className="home-section"
      aria-labelledby="home-evidence-title"
    >
      <div className="home-evidence-heading">
        <div className="home-section-heading">
          <p className="home-eyebrow">Registro de terreno</p>
          <h2 id="home-evidence-title">El trabajo, visto de cerca</h2>
          <p>Fotografías de intervenciones y equipamiento de Hidrourgencias.</p>
        </div>
        <div className="home-carousel-controls">
          <button
            type="button"
            aria-label="Fotografía anterior"
            aria-controls="home-photo-track"
            disabled={position === 0}
            onClick={() => move(-1)}
          >
            <ArrowLeft size={20} aria-hidden="true" />
          </button>
          <button
            type="button"
            aria-label="Fotografía siguiente"
            aria-controls="home-photo-track"
            disabled={position === 100}
            onClick={() => move(1)}
          >
            <ArrowRight size={20} aria-hidden="true" />
          </button>
        </div>
      </div>
      <div
        id="home-photo-track"
        ref={track}
        className="home-photo-track"
        role="region"
        aria-roledescription="carrusel"
        aria-label="Fotografías de trabajos: usa las flechas o desliza"
        tabIndex={0}
        onKeyDown={(event) => {
          if (event.key === "ArrowRight" || event.key === "ArrowLeft") {
            event.preventDefault();
            move(event.key === "ArrowRight" ? 1 : -1);
          }
        }}
        onScroll={() => {
          const el = track.current;
          if (el)
            setPosition(
              Math.round(
                (el.scrollLeft / Math.max(1, el.scrollWidth - el.clientWidth)) *
                  100,
              ),
            );
        }}
      >
        {photographs.map((photo, index) => (
          <figure
            key={photo.id}
            className="home-photo-card"
            role="group"
            aria-label={`${index + 1} de ${photographs.length}`}
          >
            <div className="home-photo-image">
              <StaticPicture
                src={`/images/home-evidence/terreno-${photo.id}.webp`}
                alt={photo.text}
                width={800}
                height={600}
                loading="lazy"
              />
            </div>
            <figcaption>
              <span className="home-photo-number" aria-hidden="true">
                0{index + 1}
              </span>
              <div>
                <h3>{photo.title}</h3>
                <p>{photo.text}</p>
              </div>
            </figcaption>
          </figure>
        ))}
      </div>
      <div className="home-evidence-footer">
        <Link href="/casos-de-exito" className="home-text-link">
          Ver casos y antecedentes <ArrowUpRight size={18} aria-hidden="true" />
        </Link>
        {channel && (
          <a
            className="home-text-link"
            href={channel.href}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Play size={17} aria-hidden="true" /> Nuestro canal en YouTube{" "}
            <ArrowUpRight size={17} aria-hidden="true" />
          </a>
        )}
      </div>
    </section>
  );
}

export function HomeCoverageBoard({ areas }: { areas: NavigationCoverage[] }) {
  const [selectedId, setSelectedId] = useState(areas[0]?.id);
  const selected = areas.find((area) => area.id === selectedId) ?? areas[0];
  if (!selected) return null;
  return (
    <section
      id="cobertura-visual"
      className="home-section"
      aria-labelledby="home-coverage-title"
    >
      <div className="home-section-heading">
        <p className="home-eyebrow">Región de Valparaíso</p>
        <h2 id="home-coverage-title">
          Ubica tu comuna, coordinemos el servicio
        </h2>
        <p>
          Selecciona una zona para revisar su cobertura. Coordinamos
          disponibilidad, acceso y alcance según tu ubicación.
        </p>
      </div>
      <div className="home-coverage-board">
        <div className="home-zone-panel">
          <p className="home-zone-label">
            <MapPin size={18} aria-hidden="true" /> Tablero de cobertura por
            comunas
          </p>
          <div className="home-zone-buttons">
            {areas.map((area) => (
              <button
                key={area.id}
                type="button"
                aria-pressed={area.id === selected.id}
                aria-controls="home-zone-detail"
                onClick={() => setSelectedId(area.id)}
              >
                <span>{area.comuna}</span>
                {area.id === selected.id ? (
                  <Check size={17} aria-hidden="true" />
                ) : (
                  <MapPin size={16} aria-hidden="true" />
                )}
              </button>
            ))}
          </div>
          <p className="home-zone-note">
            Esquema de zonas de atención; no representa distancias.
          </p>
        </div>
        <div id="home-zone-detail" className="home-zone-detail">
          <MapPin size={30} aria-hidden="true" />
          <div aria-live="polite" aria-atomic="true">
            <p className="home-eyebrow">Zona seleccionada</p>
            <h3>{selected.comuna}</h3>
          </div>
          <p>
            Destapes, hidrojet y evaluación de redes sanitarias. Consulta el
            alcance técnico y los sectores de atención.
          </p>
          <a className="home-text-link" href={selected.landingPath}>
            Ver cobertura de {selected.comuna}{" "}
            <ArrowUpRight size={18} aria-hidden="true" />
          </a>
          <HomeWhatsAppLink
            location="home_coverage_board"
            commune={selected.comuna}
          >
            <MessageCircle size={19} aria-hidden="true" /> Consultar por
            WhatsApp
          </HomeWhatsAppLink>
        </div>
      </div>
      <noscript>
        <p>Consulta directamente la cobertura de tu comuna:</p>
        <ul>
          {areas.map((area) => (
            <li key={area.id}>
              <a href={area.landingPath}>{area.comuna}</a>
            </li>
          ))}
        </ul>
      </noscript>
    </section>
  );
}
