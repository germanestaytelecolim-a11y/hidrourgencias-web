import type { Metadata } from "next";
import { Manrope, Rajdhani } from "next/font/google";

import { GoogleAdsConversionTracking } from "@/components/google-ads-conversion-tracking";
import { ServiceTermsSection } from "@/components/service-terms";
import { SiteHeader } from "@/components/site-header";
import { createWhatsAppUrl } from "@/lib/site-config";
import { themeInitScript, themeToggleScript } from "@/lib/theme-scripts";

import "./globals.css";

const siteUrl = "https://hidrourgencias.cl";
const ogImage = "/images/hero-urgencia.jpg";

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  display: "swap",
});

const rajdhani = Rajdhani({
  subsets: ["latin"],
  weight: ["700"],
  variable: "--font-rajdhani",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Hidrourgencias SpA | Urgencias sanitarias 24/7 en Región de Valparaíso",
    template: "%s | Hidrourgencias SpA",
  },
  description:
    "Empresa técnica especializada en destape de alcantarillado y desagües, hidrojet 4000 PSI, videoinspección sanitaria, sanitización, higienización y mantención preventiva en la Región de Valparaíso.",
  keywords: [
    "destape de alcantarillado",
    "destape de desagües",
    "hidrojet",
    "urgencias sanitarias",
    "mantención de alcantarillado",
    "sanitización",
    "motobombas para inundaciones",
    "videoinspección sanitaria",
    "higienización técnica",
    "Viña del Mar",
    "Valparaíso",
    "Concón",
    "Quilpué",
    "Villa Alemana",
    "Región de Valparaíso",
  ],
  openGraph: {
    title: "Hidrourgencias SpA | Soluciones técnicas reales para urgencias sanitarias",
    description:
      "15 años de experiencia con respuesta rápida 24/7 para alcantarillado y desagües en edificios, comunidades, empresas y locales comerciales.",
    url: siteUrl,
    siteName: "Hidrourgencias SpA",
    locale: "es_CL",
    type: "website",
    images: [{ url: ogImage, width: 1200, height: 630, alt: "Hidrourgencias en operación técnica" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Hidrourgencias SpA | Urgencias sanitarias 24/7",
    description: "Destape técnico, hidrojet, videoinspección sanitaria y mantención preventiva en Región de Valparaíso.",
    images: [ogImage],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
};

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
    "Puchuncavi",
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

const siteStructuredData = {
  "@context": "https://schema.org",
  "@graph": [localBusinessSchema, organizationSchema, websiteSchema],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const businessSchemaJson = JSON.stringify(siteStructuredData).replace(/</g, "\\u003c");
  const floatingMessage = createWhatsAppUrl(
    "Hola, necesito atención inmediata por urgencia sanitaria en la Región de Valparaíso.",
  );

  return (
    <html lang="es-CL" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link rel="preconnect" href="https://www.googletagmanager.com" />
        <link rel="preconnect" href="https://www.google-analytics.com" />
      </head>
      <body className={`${manrope.variable} ${rajdhani.variable} bg-white text-slate-900 antialiased`}>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: businessSchemaJson }} />
        <SiteHeader />
        {children}
        <ServiceTermsSection />
        <div className="fixed bottom-4 right-4 z-50 w-[17rem] max-w-[calc(100vw-2rem)]">
          <a
            href={floatingMessage}
            target="_blank"
            rel="noopener noreferrer"
            className="hu-cta-primary inline-flex h-12 items-center gap-2 rounded-full px-5 py-3 text-sm font-bold text-white transition hover:-translate-y-0.5"
            aria-label="Abrir WhatsApp de urgencias sanitarias"
          >
            <span className="h-2.5 w-2.5 rounded-full bg-white" aria-hidden="true" />
            WhatsApp 24/7
          </a>
        </div>
        <GoogleAdsConversionTracking />
        <script dangerouslySetInnerHTML={{ __html: themeToggleScript }} />
      </body>
    </html>
  );
}
