import Link from "next/link";
import { HomeCoverageBoard, HomeEvidence } from "@/components/home-visual-evidence";
import { VideosTecnicos } from "@/components/VideosTecnicos";
import { trackCommercialEvent } from "@/lib/conversion";
import type { Metadata } from "next";
import {
  ClipboardCheck,
  FileText,
  Wrench,
  ShieldCheck,
  ArrowUpRight,
} from "lucide-react";
import { HeroUrgencias } from "@/components/HeroUrgencias";
import { ServiciosGrid } from "@/components/ServiciosGrid";
import { ProcesoOperativo } from "@/components/ProcesoOperativo";
import { CasosReales } from "@/components/CasosReales";
import {
  HomeLeadPaths,
  HomeMobileBar,
  HomeWhatsAppLink,
} from "@/components/home-contact";
import {
  HomeServiceFinder,
  type HomeCoverage,
} from "@/components/home-service-finder";
import type { BlogPost } from "@/lib/blog-data";
import type {
  CmsClientItem,
  CmsCommercialBlock,
  CmsEquipmentItem,
  CmsFeaturedService,
  CmsGalleryEntry,
  CmsHomeSettings,
  CmsVideoEntry,
} from "@/lib/cms-content";
import type { CaseStudy } from "@/lib/case-studies";
import type { PublicWorkCaseDto } from "@/lib/admin/public-work-cases";
import {
  GOOGLE_REVIEWS_URL,
  buildCanonicalUrl,
  serviceCatalog,
  siteConfig,
} from "@/lib/site-config";

const siteUrl = siteConfig.siteUrl;

export type HomePageCmsContent = {
  homeSettings: CmsHomeSettings;
  featuredServices: CmsFeaturedService[];
  equipmentItems: CmsEquipmentItem[];
  clients: CmsClientItem[];
  commercialBlocks: CmsCommercialBlock[];
  galleryItems: CmsGalleryEntry[];
  videos: CmsVideoEntry[];
  cases: CaseStudy[];
  adminCases: PublicWorkCaseDto[];
  blogPosts: BlogPost[];
  coverage: HomeCoverage;
};

type HomePageContentProps = {
  cmsContent?: HomePageCmsContent;
};

export const metadata: Metadata = {
  title:
    "Destape de alcantarillado, hidrojet y urgencias sanitarias 24/7 en Región de Valparaíso",
  description:
    "Destape de desagües y redes de alcantarillado, hidrojet, videoinspección y mantención preventiva para edificios y empresas. Urgencias 24/7 en la Región de Valparaíso.",
  keywords: [
    "destape de alcantarillado",
    "destape de desagües",
    "hidrojet 4000 PSI",
    "urgencias sanitarias 24/7",
    "mantención de alcantarillado",
    "videoinspección sanitaria",
    "sanitización e higienización",
    "Viña del Mar",
    "Valparaíso",
    "Concón",
    "Quilpué",
    "Villa Alemana",
    "Puchuncaví",
    "Limache",
    "Quillota",
    "Placilla de Curauma",
  ],
  alternates: {
    canonical: buildCanonicalUrl("/"),
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: "Hidrourgencias SpA | Urgencias sanitarias y destape técnico 24/7",
    description:
      "Diagnóstico, máquina eléctrica, hidrojet y videoinspección para edificios, comunidades y empresas de la Región de Valparaíso.",
    url: siteUrl,
    type: "website",
    locale: "es_CL",
    images: [
      {
        url: "/images/hero-urgencia.jpg",
        width: 1200,
        height: 630,
        alt: "Hidrourgencias SpA en operación técnica sanitaria",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Hidrourgencias SpA | Urgencias sanitarias 24/7",
    description:
      "Destape de alcantarillado y desagües con hidrojet, RIDGID y diagnóstico técnico profesional.",
    images: ["/images/hero-urgencia.jpg"],
  },
};

const differentiators = [
  {
    icon: ClipboardCheck,
    title: "Diagnóstico antes de intervenir",
    text: "Distinguimos un desagüe puntual de un ramal, una red o una cámara de alcantarillado para definir el alcance.",
  },
  {
    icon: Wrench,
    title: "Maquinaria según la obstrucción",
    text: "Seleccionamos máquina eléctrica, hidrojet o videoinspección según diámetro, acceso, material y factibilidad.",
  },
  {
    icon: FileText,
    title: "Evidencia para decidir",
    text: "Fotografías, registros audiovisuales e informe técnico cuando corresponda al servicio acordado.",
  },
  {
    icon: ShieldCheck,
    title: "Continuidad operativa",
    text: "Recomendaciones preventivas y seguimiento cuando aplica para administraciones, restaurantes, empresas e instituciones.",
  },
];

export default function HomePage({ cmsContent }: HomePageContentProps) {
  const schema = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Hidrourgencias SpA",
    url: siteUrl,
    description: metadata.description,
    about: serviceCatalog.map((service) => service.title),
  }).replace(/</g, "\\u003c");
  return (
    <main id="contenido" className="home-page">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: schema }}
      />
      <HeroUrgencias settings={cmsContent?.homeSettings} />
      <HomeServiceFinder
        areas={cmsContent?.coverage.areas ?? []}
        routes={cmsContent?.coverage.routes ?? []}
      />
      <HomeLeadPaths />
      <ServiciosGrid services={cmsContent?.featuredServices} />
      <HomeCoverageBoard areas={cmsContent?.coverage.areas ?? []} />
      <HomeEvidence />
      <VideosTecnicos videos={cmsContent?.videos} />
      <section
        id="especialidad-sanitaria"
        className="home-section home-difference"
        aria-labelledby="home-difference-title"
      >
        <div className="home-section-heading">
          <p className="home-eyebrow">Criterio técnico y respaldo</p>
          <h2 id="home-difference-title">
            Por qué Hidrourgencias no es un destape convencional
          </h2>
          <p>
            Intervención técnica orientada a restablecer la operación sanitaria
            y entregar respaldo claro para la toma de decisiones.
          </p>
        </div>
        <div className="home-difference-grid">
          {differentiators.map((item) => (
            <article key={item.title}>
              <item.icon size={24} aria-hidden="true" />
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </article>
          ))}
        </div>
      </section>
      <ProcesoOperativo />
      <section
        id="opiniones"
        className="home-section home-trust"
        aria-labelledby="home-trust-title"
      >
        <div className="home-section-heading">
          <p className="home-eyebrow">Respaldo verificable</p>
          <h2 id="home-trust-title">Revisa la evidencia, conoce el trabajo</h2>
          <p>
            Consulta opiniones publicadas, antecedentes de intervenciones y el
            alcance del respaldo técnico disponible.
          </p>
        </div>
        <div className="home-trust-links">
          <a
            onClick={() =>
              trackCommercialEvent("view_reviews", {
                cta_location: "trust_band",
              })
            }
            href={GOOGLE_REVIEWS_URL}
            target="_blank"
            rel="noopener noreferrer nofollow"
          >
            <span>Opiniones en Google</span>
            <ArrowUpRight size={20} aria-hidden="true" />
          </a>
          <a href="#casos">
            <span>Intervenciones en terreno</span>
            <ArrowUpRight size={20} aria-hidden="true" />
          </a>
          <Link href="/servicios/asesoria-mantenimiento-integral-redes-sanitarias">
            <span>Evaluación e informes técnicos</span>
            <ArrowUpRight size={20} aria-hidden="true" />
          </Link>
        </div>
        <details id="blog" className="home-resource-links">
          <summary>Guías técnicas para administradores y propietarios</summary>
          <div>
            {(cmsContent?.blogPosts ?? [])
              .filter(
                (post, index) =>
                  index < 3 ||
                  [
                    "que-revisar-alcantarillado-antes-comprar-propiedad",
                    "vicios-ocultos-sanitarios-alcantarillado-desagues",
                    "videoinspeccion-sanitaria-antes-invertir-propiedad",
                  ].includes(post.slug),
              )
              .map((post) => (
                <Link
                  key={post.slug}
                  href={`/blog/${post.slug}`}
                  className="home-text-link"
                >
                  {post.title}
                </Link>
              ))}
          </div>
        </details>
      </section>
      <CasosReales
        cases={cmsContent?.cases}
        adminCases={cmsContent?.adminCases}
      />
      <section id="contacto" className="home-final">
        <div className="home-section">
          <p className="home-eyebrow">Urgencias 24/7 · Servicios programados</p>
          <h2>Cuéntanos qué ocurre en tu instalación</h2>
          <p>
            Envía ubicación, síntomas y fotos o videos. Revisamos los
            antecedentes para coordinar el alcance técnico y la disponibilidad.
          </p>
          <div className="home-actions">
            <HomeWhatsAppLink location="home_final">
              Solicitar atención por WhatsApp
            </HomeWhatsAppLink>
            <HomeWhatsAppLink
              type="diagnostic"
              location="home_final"
              className="home-button home-button--light"
            >
              Solicitar evaluación
            </HomeWhatsAppLink>
          </div>
        </div>
      </section>
      <HomeMobileBar />
    </main>
  );
}
