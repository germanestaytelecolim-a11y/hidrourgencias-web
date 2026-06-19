import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { SeoServiceAreaLanding } from "@/components/SeoServiceAreaLanding";
import { buildSeoMetadata, getSeoRouteBySlug, getSeoStaticParams } from "@/lib/seo-territorial";

type Props = {
  params: Promise<{ seoSlug: string }>;
};

export const dynamicParams = false;

export function generateStaticParams() {
  return getSeoStaticParams();
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { seoSlug } = await params;
  const route = getSeoRouteBySlug(seoSlug);

  if (!route) {
    return {
      title: "Pagina no encontrada",
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  return buildSeoMetadata(route);
}

export default async function SeoProgrammaticPage({ params }: Props) {
  const { seoSlug } = await params;
  const route = getSeoRouteBySlug(seoSlug);

  if (!route) {
    notFound();
  }

  return <SeoServiceAreaLanding route={route} />;
}
