import Image from "next/image";

type CaseStudyLogo = {
  src: string;
  alt: string;
};

const clientLogoLegalNotice =
  "El presente caso de éxito describe un servicio efectivamente ejecutado por Hidrourgencias SpA. La inclusión del logotipo tiene fines exclusivamente referenciales para identificar la entidad o instalación donde se desarrolló el trabajo y no implica patrocinio, representación ni asociación comercial permanente.";

type ClientLogoCaseStudyProps = {
  logo?: CaseStudyLogo;
  compact?: boolean;
};

export function ClientLogoCaseStudy({ logo, compact = false }: ClientLogoCaseStudyProps) {
  if (!logo) {
    return null;
  }

  return (
    <figure className={`rounded-2xl border border-slate-200 bg-white shadow-sm ${compact ? "w-40 flex-none p-2" : "p-4"}`}>
      <div className={`relative mx-auto ${compact ? "h-14 w-28" : "h-20 w-36"}`}>
        <Image src={logo.src} alt={logo.alt} fill sizes={compact ? "112px" : "144px"} className="object-contain" loading="lazy" />
      </div>
      <figcaption className={`${compact ? "mt-2 text-[7px] leading-3" : "mt-3 text-[11px] leading-5"} font-semibold text-slate-500`}>
        {clientLogoLegalNotice}
      </figcaption>
    </figure>
  );
}
