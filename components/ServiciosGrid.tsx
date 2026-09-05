import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { CmsFeaturedService } from "@/lib/cms-content";
import { homeServices } from "@/lib/home-services";

export function ServiciosGrid({
  services = [],
}: {
  services?: CmsFeaturedService[];
}) {
  // CMS services remain reachable; the main selection uses consistent technical labels.
  const additional = services.filter(
    (service) => !homeServices.some((item) => item.href === service.url),
  );
  function card(service: (typeof homeServices)[number]) {
    return (
      <article key={service.id} className="home-service-card">
        <h3>{service.title}</h3>
        <p>{service.problem}</p>
        <p className="home-service-method">{service.method}</p>
        <a href={service.href} className="home-text-link">
          Ver servicio <ArrowUpRight size={17} aria-hidden="true" />
        </a>
      </article>
    );
  }
  return (
    <section
      id="servicios"
      className="home-section"
      aria-labelledby="home-services-title"
    >
      <div className="home-section-heading">
        <p className="home-eyebrow">Servicios técnicos principales</p>
        <h2 id="home-services-title">Del punto obstruido a la red completa</h2>
        <p>
          Un desagüe evacua un artefacto o recinto. La red de alcantarillado
          reúne ramales y colectores; sus cámaras de alcantarillado permiten
          inspección y acceso.
        </p>
      </div>
      <div className="home-services-grid">
        {homeServices.slice(0, 6).map(card)}
      </div>
      <details className="home-more-services">
        <summary>
          Evaluación de propiedades, verticales, horizontales y otros servicios
        </summary>
        <div className="home-services-grid">
          {homeServices.slice(6).map(card)}
          {additional.map((service) => (
            <article key={service.url} className="home-service-card">
              <h3>{service.title}</h3>
              <p>{service.description}</p>
              <a href={service.url} className="home-text-link">
                Ver alcance técnico →
              </a>
            </article>
          ))}
        </div>
      </details>
      <Link href="/servicios" className="home-text-link">
        Todos los servicios técnicos →
      </Link>
    </section>
  );
}
