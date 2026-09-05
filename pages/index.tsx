import Head from "next/head";
import type { GetServerSideProps } from "next";

import HomePageContent, { type HomePageCmsContent } from "@/components/HomePageContent";
import { GoogleAdsConversionTracking } from "@/components/google-ads-conversion-tracking";
import { ServiceTermsSection } from "@/components/service-terms";
import { SiteHeader } from "@/components/site-header";
import { getAllCaseStudies } from "@/lib/case-studies";
import { getPublicBlogPosts } from "@/lib/admin/public-blog-posts";
import { getPublicWorkCasesForPath } from "@/lib/admin/public-work-cases";
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
import { SiteFooter } from "@/components/site-footer";
import { navigationCoverage } from "@/lib/navigation";
import { getAllSeoRoutes } from "@/lib/seo-territorial";
import { homeServices } from "@/lib/home-services";

const siteUrl = "https://hidrourgencias.cl";
const ogImage = "/images/hero-urgencia.jpg";

const localBusinessSchema = {
  "@type": ["LocalBusiness", "ProfessionalService"],
  name: "Hidrourgencias SpA",
  slogan: "Urgencias sanitarias 24/7 con criterio técnico profesional",
  description:
    "Empresa técnica especializada en evacuación sanitaria, alcantarillado, desagüe, hidrojet, videoinspección sanitaria, mantención preventiva y recuperación higiénico-sanitaria en la Región de Valparaíso.",
  url: siteUrl,
  image: `${siteUrl}${ogImage}`,
  telephone: "+56 9 4091 8672",
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

const organizationSchema = {
  "@type": "Organization",
  name: "Hidrourgencias SpA",
  url: siteUrl,
  logo: `${siteUrl}/images/logo-hidrourgencias.jpg`,
  sameAs: localBusinessSchema.sameAs,
};

const websiteSchema = {
  "@type": "WebSite",
  name: "Hidrourgencias SpA",
  url: siteUrl,
  inLanguage: "es-CL",
};

const homeStructuredData = {
  "@context": "https://schema.org",
  "@graph": [localBusinessSchema, organizationSchema, websiteSchema],
};

type HomePageProps = {
  cmsContent: HomePageCmsContent;
};

export const getServerSideProps: GetServerSideProps<HomePageProps> = async () => {
  const clients = Array.from(
    new Map([...getCmsClients(), ...getCmsHighlightedClients()].map((client) => [client.name, client] as const)).values(),
  );

  return {
    props: {
      cmsContent: {
        homeSettings: getCmsHomeSettings(),
        coverage: {
          areas: navigationCoverage,
          routes: getAllSeoRoutes().filter(route => homeServices.some(service => service.seoSlug === route.service.slug)).map(route => ({
            href: `/${route.slug}`, service: route.service.slug, commune: route.comuna.landingPath.slice(1), sector: route.sector,
          })),
        },
        featuredServices: getCmsFeaturedServices(),
        equipmentItems: getCmsEquipmentItems(),
        clients,
        commercialBlocks: getCmsCommercialBlocks(),
        galleryItems: getCmsGalleryEntries(),
        videos: getCmsVideoEntries(),
        cases: getAllCaseStudies(),
        adminCases: await getPublicWorkCasesForPath("/", 6),
        blogPosts: await getPublicBlogPosts(),
      },
    },
  };
};

export default function HomePage({ cmsContent }: HomePageProps) {
  const businessSchemaJson = JSON.stringify(homeStructuredData).replace(/</g, "\\u003c");

  return (
    <>
      <Head>
        <title>Destape de alcantarillado, hidrojet y urgencias sanitarias 24/7 en Región de Valparaíso</title>
        <meta
          name="description"
          content="Destape de desagües y redes de alcantarillado, hidrojet, videoinspección y mantención preventiva para edificios y empresas. Urgencias 24/7 en la Región de Valparaíso."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="robots" content="index,follow" />
        <link rel="canonical" href={`${siteUrl}/`} />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link rel="preconnect" href="https://www.googletagmanager.com" />
        <link rel="preconnect" href="https://www.google-analytics.com" />
        <link rel="preload" as="image" href="/images/logo-hidrourgencias.avif" type="image/avif" />
        <meta property="og:title" content="Hidrourgencias SpA | Urgencias sanitarias y destape técnico 24/7" />
        <meta
          property="og:description"
          content="Diagnóstico, máquina eléctrica, hidrojet y videoinspección para edificios, comunidades y empresas de la Región de Valparaíso."
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
      <SiteHeader home />
      <HomePageContent cmsContent={cmsContent} />
      <ServiceTermsSection />
      <SiteFooter home />
      <GoogleAdsConversionTracking />
    </>
  );
}
