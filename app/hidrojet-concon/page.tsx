import { ComunaLandingPage } from "@/components/comuna-landing-page";
import { buildComunaMetadata, getAllComunaLandings, requireComunaLanding } from "@/lib/comuna-landings";
import ZonasSection from "@/components/ZonasSection";
import { CTAUrgente } from "@/components/CTAUrgente";
import { zonas } from "@/lib/zonas";

const slug = "hidrojet-concon";
const landing = requireComunaLanding(slug);

export const metadata = buildComunaMetadata(landing);

export default function LandingPage() {
  return (
    <>
      <ComunaLandingPage landing={landing} allLandings={getAllComunaLandings()} />
      {/* CTA antes de ZonasSection para conversión + SEO */}
      <CTAUrgente comuna="Concón" />
      {/* SEO CRÍTICO: ZonasSection visible e indexable */}
      <ZonasSection
        comuna="Concón"
        zonas={zonas.concon}
      />
    </>
  );
}
