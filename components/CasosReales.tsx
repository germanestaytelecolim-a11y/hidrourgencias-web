import Link from "next/link";
import Image from "next/image";
import type { CaseStudy } from "@/lib/case-studies";
import type { PublicWorkCaseDto } from "@/lib/admin/public-work-cases";
import { trackCommercialEvent } from "@/lib/conversion";

export function CasosReales({
  cases = [],
  adminCases = [],
}: {
  cases?: CaseStudy[];
  adminCases?: PublicWorkCaseDto[];
}) {
  // Published CMS cases have priority; deduplicate the legacy catalogue by slug.
  const recent = adminCases.slice(0, 3).map((item) => {
    const cover = item.media.find((asset) => asset.isCover) ?? item.media[0];
    return {
      slug: item.slug,
      title: item.title,
      location: item.publicLocation,
      problem: item.problem,
      method: item.intervention,
      result: item.result,
      image: cover?.thumbnailUrl || cover?.url,
      alt: cover?.altText || item.title,
    };
  });
  const visible = [
    ...recent,
    ...cases
      .filter((item) => !recent.some((other) => other.slug === item.slug))
      .map((item) => ({
        slug: item.slug,
        title: item.title,
        location: `${item.city} · ${item.client.name}`,
        problem: item.problem,
        method: item.equipment.slice(0, 2).join(" · "),
        result: item.result,
        image: /\/images\/(servicios\/heroes\/|hero-)|\/default[ (]/.test(
          item.featuredImage,
        )
          ? undefined
          : item.featuredImage,
        alt: item.title,
      })),
  ].slice(0, 3);
  if (!visible.length) return null;
  return (
    <section
      id="casos"
      className="home-section"
      aria-labelledby="home-cases-title"
    >
      <div className="home-section-heading">
        <p className="home-eyebrow">Casos técnicos publicados</p>
        <h2 id="home-cases-title">Resultados comprobables en terreno</h2>
      </div>
      <div className="home-cases-grid">
        {visible.map((item) => (
          <article key={item.slug} className="home-case">
            {item.image && (
              <div className="home-case-image">
                <Image
                  src={item.image}
                  alt={item.alt}
                  fill
                  sizes="(min-width: 1024px) 360px, (min-width: 640px) 45vw, 100vw"
                  loading="lazy"
                  className="object-cover"
                />
              </div>
            )}
            <div className="home-case-body">
              <p className="home-eyebrow">{item.location}</p>
              <h3>
                <a
                  href={`/casos-de-exito/${item.slug}`}
                  onClick={() =>
                    trackCommercialEvent("case_view", {
                      case_slug: item.slug,
                      cta_location: "home_cases",
                    })
                  }
                >
                  {item.title}
                </a>
              </h3>
              <p>{item.problem}</p>
              {item.method && (
                <p>
                  <strong>Método / equipos:</strong> {item.method}
                </p>
              )}
              <p className="home-case-result">
                <strong>Resultado:</strong> {item.result}
              </p>
            </div>
          </article>
        ))}
      </div>
      <Link href="/casos-de-exito" className="home-text-link">
        Ver todos los casos técnicos →
      </Link>
    </section>
  );
}
