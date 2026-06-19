import { ComunaLandingPage } from "@/components/comuna-landing-page";
import { buildComunaMetadata, getAllComunaLandings, requireComunaLanding } from "@/lib/comuna-landings";

const slug = "mantencion-desagues-quilpue";
const landing = requireComunaLanding(slug);

export const metadata = buildComunaMetadata(landing);

export default function LandingPage() {
  return <ComunaLandingPage landing={landing} allLandings={getAllComunaLandings()} />;
}
