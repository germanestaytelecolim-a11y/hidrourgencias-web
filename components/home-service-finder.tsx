"use client";

import { useState } from "react";
import type { NavigationCoverage } from "@/lib/navigation";
import { homeServices } from "@/lib/home-services";
import { trackCommercialEvent } from "@/lib/conversion";
import { HomeWhatsAppLink } from "@/components/home-contact";

export type HomeLocalRoute = {
  href: string;
  service: string;
  commune: string;
  sector: string;
};
export type HomeCoverage = {
  areas: NavigationCoverage[];
  routes: HomeLocalRoute[];
};
const normalize = (value: string) =>
  value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();

export function HomeServiceFinder({ areas, routes }: HomeCoverage) {
  const [serviceId, setServiceId] = useState("alcantarillado");
  const [areaId, setAreaId] = useState("");
  const [sector, setSector] = useState("");
  const service = homeServices.find((item) => item.id === serviceId)!;
  const area = areas.find((item) => item.id === areaId);
  const localRoute =
    area && sector
      ? routes.find(
          (route) =>
            route.service === service.seoSlug &&
            route.commune === area.id &&
            normalize(route.sector) === normalize(sector),
        )
      : undefined;
  const communeRoute =
    area &&
    !sector &&
    service.id === "alcantarillado" &&
    area.landingPath.startsWith("/destape-alcantarillado-")
      ? area.landingPath
      : area &&
          !sector &&
          service.id === "hidrojet" &&
          area.landingPath === "/hidrojet-concon"
        ? area.landingPath
        : undefined;
  const destination = localRoute?.href ?? communeRoute ?? service.href;
  return (
    <section
      id="servicio-cobertura"
      className="home-section home-finder"
      aria-labelledby="home-finder-title"
    >
      <div className="home-section-heading">
        <p className="home-eyebrow">Servicio + zona de cobertura</p>
        <h2 id="home-finder-title">Encuentra atención para tu instalación</h2>
        <p>
          Región de Valparaíso. Selecciona el problema y la ubicación para
          coordinar.
        </p>
      </div>
      <div className="home-finder-fields">
        <label htmlFor="home-service">
          1. ¿Qué necesita resolver?
          <select
            id="home-service"
            value={serviceId}
            onChange={(event) => {
              setServiceId(event.target.value);
              trackCommercialEvent("select_service", {
                service: event.target.value,
                cta_location: "home_finder",
              });
            }}
          >
            {homeServices
              .filter((item) => item.selectorLabel)
              .map((item) => (
                <option key={item.id} value={item.id}>
                  {item.selectorLabel}
                </option>
              ))}
          </select>
        </label>
        <label htmlFor="home-commune">
          2. ¿En qué comuna o sector?
          <select
            id="home-commune"
            value={areaId}
            onChange={(event) => {
              setAreaId(event.target.value);
              setSector("");
              trackCommercialEvent("select_commune", {
                commune: event.target.value,
                cta_location: "home_finder",
              });
            }}
          >
            <option value="">Selecciona una comuna o zona</option>
            {areas.map((item) => (
              <option key={item.id} value={item.id}>
                {item.comuna}
              </option>
            ))}
          </select>
        </label>
        {area && area.sectors.length > 0 && (
          <label htmlFor="home-sector">
            Sector (opcional)
            <select
              id="home-sector"
              value={sector}
              onChange={(event) => setSector(event.target.value)}
            >
              <option value="">Toda la comuna o zona</option>
              {area.sectors.map((item) => (
                <option key={item.href} value={item.label}>
                  {item.label}
                </option>
              ))}
            </select>
          </label>
        )}
      </div>
      <div className="home-finder-result" aria-live="polite">
        <div>
          <h3>
            {service.title}
            {area ? ` · ${sector || area.comuna}` : ""}
          </h3>
          <p>
            {service.problem} {service.method}
          </p>
        </div>
        <div className="home-actions">
          <HomeWhatsAppLink
            type={service.type}
            service={service.title}
            commune={area?.comuna}
            sector={sector}
            location="home_finder"
          >
            Consultar por WhatsApp
          </HomeWhatsAppLink>
          <a href={destination} className="home-text-link">
            {localRoute || communeRoute
              ? "Ver servicio en esta zona"
              : "Ver detalle del servicio"}{" "}
            →
          </a>
        </div>
        {area && (
          <a
            className="home-text-link"
            href={
              area.sectors.find((item) => item.label === sector)?.href ??
              area.landingPath
            }
          >
            Ver cobertura en {sector || area.comuna}
          </a>
        )}
      </div>
      <details id="comunas" className="home-coverage-links">
        <summary>Ver todas las comunas y sectores</summary>
        <div>
          {areas.map((item) => (
            <details key={item.id}>
              <summary>{item.comuna}</summary>
              <a href={item.landingPath}>Cobertura en {item.comuna}</a>
              {item.sectors.map((place) => (
                <a key={place.href} href={place.href}>
                  {place.label}
                </a>
              ))}
            </details>
          ))}
        </div>
      </details>
    </section>
  );
}
