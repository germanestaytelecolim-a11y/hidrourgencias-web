import Link from "next/link";
import { HomeSocialLinks } from "@/components/home-contact";
import { createMailToUrl, siteConfig } from "@/lib/site-config";

export function SiteFooter({ home = false }: { home?: boolean }) {
  if (home)
    return (
      <footer className="home-footer">
        <div className="home-section">
          <div className="home-footer-grid">
            <div>
              <p className="home-footer-brand">Hidrourgencias SpA</p>
              <p>
                Respuesta sanitaria especializada.
                <br />
                Región de Valparaíso · Urgencias 24/7.
              </p>
              <HomeSocialLinks />
            </div>
            <div>
              <h2>Contacto y coordinación</h2>
              <a href={createMailToUrl()}>hidrourgencias@gmail.com</a>
              <a href={siteConfig.phoneHref}>Llamar: +56 9 4091 8672</a>
              <Link href="/contacto">Formulario de contacto</Link>
              <Link href="/acceso-administradores-empresas">
                Acceso Administradores / Empresas
              </Link>
            </div>
            <div>
              <h2>Servicios y recursos</h2>
              <Link href="/servicios">Servicios técnicos</Link>
              <Link href="/cobertura">Comunas y sectores de cobertura</Link>
              <Link href="/servicios/analisis-tecnico-propiedad-redes-sanitarias">
                Evaluación sanitaria de propiedades
              </Link>
              <Link href="/casos-de-exito">Casos técnicos</Link>
              <Link href="/blog">Guías técnicas</Link>
            </div>
          </div>
          <div className="home-footer-bottom">
            <a href="#terminos-servicio">Términos del servicio</a>
            <Link href="/creditos-imagenes">Créditos de imágenes</Link>
            <span>Hidrourgencias SpA</span>
          </div>
        </div>
      </footer>
    );
  return (
    <footer className="border-t border-slate-200 bg-slate-950 text-slate-300">
      <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-5 text-xs sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
        <p>
          Hidrourgencias SpA · Servicios sanitarios técnicos en la Región de
          Valparaíso.
        </p>
        <Link
          href="/creditos-imagenes"
          className="font-semibold text-slate-200 underline-offset-4 hover:underline"
        >
          Créditos de imágenes
        </Link>
      </div>
    </footer>
  );
}
