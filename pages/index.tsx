import Head from "next/head";
import type { GetStaticProps } from "next";

import HomePageContent, { type HomePageCmsContent } from "@/components/HomePageContent";
import { GoogleAdsConversionTracking } from "@/components/google-ads-conversion-tracking";
import { ServiceTermsSection } from "@/components/service-terms";
import { SiteHeader } from "@/components/site-header";
import { getAllBlogPosts } from "@/lib/blog-data";
import { getAllCaseStudies } from "@/lib/case-studies";
import {
  getCmsClients,
  getCmsCommercialBlocks,
  getCmsEquipmentItems,
  getCmsFeaturedServices,
  getCmsGalleryEntries,
  getCmsHighlightedClients,
  getCmsHomeSettings,
  getCmsVideoEntries,
} from "@/lib/cms-content";
import { createWhatsAppUrl } from "@/lib/site-config";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const config: any = {
  unstable_runtimeJS: false,
};

const siteUrl = "https://hidrourgencias.cl";
const ogImage = "/images/hero-urgencia.jpg";

const localBusinessSchema = {
  "@context": "https://schema.org",
  "@type": ["LocalBusiness", "Plumber"],
  name: "Hidrourgencias SpA",
  slogan: "Urgencias sanitarias 24/7 con criterio técnico profesional",
  description:
    "Servicio de destape de alcantarillado cerca de ti en la Región de Valparaíso, con atención inmediata 24/7 para urgencias sanitarias.",
  url: siteUrl,
  image: `${siteUrl}${ogImage}`,
  telephone: "+56 9 4091 8672",
  priceRange: "$$",
  areaServed: [
    "Viña del Mar",
    "Valparaíso",
    "Concón",
    "Quilpué",
    "Villa Alemana",
    "Puchuncaví",
    "Quintero",
    "Limache",
    "Quillota",
    "Placilla de Curauma",
  ],
  address: {
    "@type": "PostalAddress",
    addressRegion: "Región de Valparaíso",
    addressCountry: "CL",
  },
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
      opens: "00:00",
      closes: "23:59",
    },
  ],
  sameAs: [
    "https://www.facebook.com/HIDROURGENCIAsspa/",
    "https://www.instagram.com/hidrourgenciasspa/",
    "https://www.youtube.com/@DestapeHidrourgenciasspa",
    "https://www.tiktok.com/@destapeshidrourgencias",
  ],
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "Servicios sanitarios técnicos",
    itemListElement: [
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "Destape de alcantarillado y desagües" } },
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "Destape con hidrojet" } },
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "Mantención preventiva de alcantarillado" } },
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "Videoinspección sanitaria" } },
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "Motobombas para inundaciones" } },
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "Limpieza, higienización y sanitización" } },
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "Limpieza de domicilios y recuperación de espacios" } },
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "Limpieza de fachadas e hidrolavado de superficies" } },
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "Extracción de aguas en estanques y piscinas" } },
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "Asesoría en mantenimiento integral de redes sanitarias" } },
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "Análisis técnico de propiedad y redes sanitarias" } },
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "Urgencias sanitarias 24/7" } },
    ],
  },
};

type HomePageProps = {
  cmsContent: HomePageCmsContent;
};

export const getStaticProps: GetStaticProps<HomePageProps> = async () => {
  const clients = Array.from(
    new Map([...getCmsClients(), ...getCmsHighlightedClients()].map((client) => [client.name, client] as const)).values(),
  );

  return {
    props: {
      cmsContent: {
        homeSettings: getCmsHomeSettings(),
        featuredServices: getCmsFeaturedServices(),
        equipmentItems: getCmsEquipmentItems(),
        clients,
        commercialBlocks: getCmsCommercialBlocks(),
        galleryItems: getCmsGalleryEntries(),
        videos: getCmsVideoEntries(),
        cases: getAllCaseStudies(),
        blogPosts: getAllBlogPosts(),
      },
    },
  };
};

export default function HomePage({ cmsContent }: HomePageProps) {
  const businessSchemaJson = JSON.stringify(localBusinessSchema).replace(/</g, "\\u003c");
  const floatingMessage = createWhatsAppUrl(
    "Hola, necesito atención inmediata por urgencia sanitaria en la Región de Valparaíso.",
  );

  return (
    <>
      <Head>
        <title>Destape de alcantarillado, hidrojet y urgencias sanitarias 24/7 en Región de Valparaíso</title>
        <meta
          name="description"
          content="Hidrourgencias SpA: destape de alcantarillado y desagües, hidrojet 4000 PSI, videoinspección sanitaria, mantención preventiva, sanitización e higienización con atención 24/7 en la Región de Valparaíso."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="robots" content="index,follow" />
        <link rel="canonical" href={siteUrl} />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link rel="preconnect" href="https://www.googletagmanager.com" />
        <link rel="preconnect" href="https://www.google-analytics.com" />
        <link rel="preload" as="image" href="/images/logo-hidrourgencias.avif" type="image/avif" />
        <meta property="og:title" content="Hidrourgencias SpA | Urgencias sanitarias y destape técnico 24/7" />
        <meta
          property="og:description"
          content="15 años resolviendo contingencias sanitarias con hidrojet 4000 PSI, equipos RIDGID y atención profesional en la Región de Valparaíso."
        />
        <meta property="og:url" content={siteUrl} />
        <meta property="og:type" content="website" />
        <meta property="og:locale" content="es_CL" />
        <meta property="og:image" content={`${siteUrl}${ogImage}`} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Hidrourgencias SpA | Urgencias sanitarias 24/7" />
        <meta
          name="twitter:description"
          content="Destape de alcantarillado y desagües con hidrojet, RIDGID y diagnóstico técnico profesional."
        />
        <meta name="twitter:image" content={`${siteUrl}${ogImage}`} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: businessSchemaJson }} />
      </Head>
      <SiteHeader />
      <HomePageContent cmsContent={cmsContent} />
      <ServiceTermsSection />
      <div className="fixed bottom-4 right-4 z-50 w-auto max-w-[calc(100vw-2rem)] sm:w-[17rem]">
        <p className="mb-2 hidden h-10 items-center rounded-2xl border border-amber-200 bg-white px-3 py-2 text-[11px] font-bold leading-4 text-amber-950 shadow-lg sm:flex">
          Al contactar aceptas los términos del servicio.
        </p>
        <a
          href={floatingMessage}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex h-12 items-center gap-2 rounded-full bg-emerald-500 px-5 py-3 text-sm font-bold text-white shadow-2xl shadow-emerald-600/40 transition hover:bg-emerald-600"
          aria-label="Abrir WhatsApp de urgencias sanitarias"
        >
          <span className="h-2.5 w-2.5 rounded-full bg-white" aria-hidden="true" />
          WhatsApp 24/7
        </a>
      </div>
      <GoogleAdsConversionTracking />
    </>
  );
}
