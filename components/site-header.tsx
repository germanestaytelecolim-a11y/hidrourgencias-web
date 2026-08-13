import Link from "next/link";
import { ChevronDown, ChevronRight, Menu, PhoneCall, X } from "lucide-react";

import { StaticPicture } from "@/components/static-picture";
import { ThemeToggle } from "@/components/theme-toggle";
import { createWhatsAppUrl } from "@/lib/site-config";
import { navigationCoverage, navigationPriorityServices, navigationResources, navigationServiceGroups } from "@/lib/navigation";

const adminAccessHref = "/acceso-administradores-empresas";
const whatsappHref = createWhatsAppUrl("Hola, necesito urgencia sanitaria 24/7 en Region de Valparaiso.");
const firstCoveragePath = navigationCoverage[0]?.landingPath ?? "";

function linkClassName(extra = "") {
  return `brand-focus-ring rounded-lg px-3 py-2 text-sm font-bold text-slate-700 transition hover:bg-sky-50 hover:text-sky-900 ${extra}`;
}

function serviceHref(slug: string) {
  return `/servicios/${slug}`;
}

export function SiteHeader() {
  return (
    <header data-site-header className="site-header sticky top-0 z-50 border-b border-sky-100/90 bg-white/95 shadow-[0_18px_44px_-34px_rgba(8,56,95,0.82)] backdrop-blur-xl">
      <div className="mx-auto flex w-full max-w-7xl items-center gap-3 px-4 py-2.5 sm:px-6">
        <Link href="/" className="flex min-w-0 flex-1 items-center gap-3 lg:min-w-[18rem]">
          <div className="relative h-14 w-14 flex-none overflow-hidden rounded-2xl border border-sky-100 bg-white p-1 shadow-lg shadow-sky-950/15 ring-4 ring-sky-100/60 sm:h-16 sm:w-16 lg:h-[4.5rem] lg:w-[4.5rem]">
            <StaticPicture src="/images/logo-hidrourgencias.jpg" alt="Logo Hidrourgencias SpA" width={80} height={80} fetchPriority="high" loading="eager" decoding="async" className="h-full w-full object-cover" />
          </div>
          <div className="min-w-0">
            <p className="text-xl font-black tracking-tight text-slate-950 sm:text-2xl lg:whitespace-nowrap lg:text-[1.7rem] xl:text-3xl">Hidrourgencias SpA</p>
            <p className="hidden text-[11px] font-semibold uppercase tracking-[0.16em] text-sky-700 sm:block sm:text-xs">Urgencias sanitarias 24/7 | Region de Valparaiso</p>
          </div>
        </Link>

        <nav aria-label="Navegacion principal" className="ml-auto hidden items-center gap-1 lg:flex">
          <Link href="/" className={linkClassName()}>Inicio</Link>
          <NavPanelButton label="Servicios" panel="services" />
          <NavPanelButton label="Cobertura" panel="coverage" />
          <NavPanelButton label="Recursos" panel="resources" />
          <a href="#contacto" className={linkClassName()}>Contacto</a>
        </nav>

        <div className="site-header__desktop-auxiliary ml-auto hidden items-center gap-2 lg:flex">
          <a href={adminAccessHref} className="site-header__admin-link brand-focus-ring rounded-full border border-sky-200 bg-sky-50 px-3 py-2 text-center text-xs font-black leading-tight text-sky-950 transition hover:bg-white">Acceso Administradores / Empresas</a>
          <ThemeToggle compact className="site-header__theme-toggle h-10 w-10 px-0" />
          <WhatsAppLink href={whatsappHref} />
        </div>

        <button type="button" data-mobile-menu-toggle aria-label="Abrir menu principal" aria-expanded="false" aria-controls="mobile-navigation-panel" className="brand-focus-ring ml-auto inline-flex h-11 w-11 items-center justify-center rounded-xl border border-sky-200 bg-sky-50 text-sky-950 lg:hidden">
          <Menu data-mobile-menu-open-icon className="h-5 w-5" aria-hidden="true" />
          <X data-mobile-menu-close-icon className="hidden h-5 w-5" aria-hidden="true" />
        </button>
      </div>

      <DesktopServicesPanel />
      <DesktopCoveragePanel />
      <DesktopResourcesPanel />
      <MobileNavigation />
      <script dangerouslySetInnerHTML={{ __html: navigationScript }} />
    </header>
  );
}

function NavPanelButton({ label, panel }: { label: string; panel: string }) {
  return <button type="button" data-nav-toggle={panel} aria-expanded="false" aria-controls={`desktop-${panel}-panel`} className={linkClassName("inline-flex items-center gap-1")}>{label}<ChevronDown className="h-4 w-4" aria-hidden="true" /></button>;
}

function DesktopServicesPanel() {
  return <div id="desktop-services-panel" data-nav-panel="services" hidden className="site-header__desktop-panel"><div className="mx-auto grid max-w-7xl grid-cols-3 gap-6 px-6 py-5">{navigationServiceGroups.map((group) => <section key={group.label} aria-labelledby={`service-group-${group.label}`}><h2 id={`service-group-${group.label}`} className="text-xs font-black uppercase tracking-[0.16em] text-sky-700">{group.label}</h2><div className="mt-3 grid gap-1.5">{group.services.map((service) => <a key={service.slug} href={serviceHref(service.slug)} className={linkClassName(`block ${service.priority ? "bg-sky-50 text-sky-950" : "text-slate-700"}`)}>{service.navLabel}</a>)}</div></section>)}</div></div>;
}

function DesktopCoveragePanel() {
  return <div id="desktop-coverage-panel" data-nav-panel="coverage" hidden className="site-header__desktop-panel"><div className="mx-auto grid max-w-7xl grid-cols-[minmax(13rem,0.7fr)_minmax(0,1.3fr)] gap-6 px-6 py-5"><section aria-labelledby="coverage-comunas-title"><h2 id="coverage-comunas-title" className="text-xs font-black uppercase tracking-[0.16em] text-sky-700">Comunas de cobertura</h2><div className="mt-3 grid gap-1">{navigationCoverage.map((item) => <button key={item.landingPath} type="button" data-coverage-select={item.landingPath} aria-pressed={item.landingPath === firstCoveragePath} className={linkClassName(`w-full text-left ${item.landingPath === firstCoveragePath ? "bg-sky-100 text-sky-950" : ""}`)}>{item.comuna}<ChevronRight className="float-right mt-0.5 h-4 w-4" aria-hidden="true" /></button>)}</div></section><section aria-labelledby="coverage-sectors-title"><h2 id="coverage-sectors-title" className="text-xs font-black uppercase tracking-[0.16em] text-sky-700">Sectores tecnicos</h2>{navigationCoverage.map((item) => <div key={item.landingPath} data-coverage-pane={item.landingPath} hidden={item.landingPath !== firstCoveragePath}><div className="flex items-start justify-between gap-4"><p className="mt-1 text-sm font-semibold text-slate-600">{item.comuna}</p><a href={item.landingPath} className="brand-focus-ring rounded-full border border-sky-200 px-3 py-2 text-xs font-black text-sky-900 hover:bg-sky-50">Ver cobertura</a></div><div className="mt-4 grid max-h-64 grid-cols-2 gap-1.5 overflow-y-auto pr-1">{item.sectors.length ? item.sectors.map((sector) => <a key={sector.href} href={sector.href} className={linkClassName("text-sm")}>{sector.label}</a>) : <p className="rounded-lg bg-slate-50 px-3 py-3 text-sm font-semibold text-slate-600">Sectores publicados en el registro comunal.</p>}</div></div>)}</section></div></div>;
}

function DesktopResourcesPanel() {
  return <div id="desktop-resources-panel" data-nav-panel="resources" hidden className="site-header__desktop-panel"><div className="mx-auto flex max-w-7xl gap-2 px-6 py-4">{navigationResources.map((resource) => <a key={resource.href} href={resource.href} className={linkClassName("min-w-48")}>{resource.label}</a>)}</div></div>;
}

function WhatsAppLink({ href }: { href: string }) {
  return <a href={href} target="_blank" rel="noopener noreferrer" aria-label="Abrir WhatsApp de urgencias sanitarias" className="brand-focus-ring inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-[#06c286] px-3.5 py-2 text-xs font-black text-white shadow-lg shadow-emerald-500/30 transition hover:-translate-y-0.5 hover:bg-emerald-600"><PhoneCall className="h-4 w-4" aria-hidden="true" />WhatsApp 24/7</a>;
}

function MobileNavigation() {
  return <div id="mobile-navigation-panel" data-mobile-navigation hidden className="site-header__mobile-layer lg:hidden"><div className="site-header__mobile-panel"><div className="flex items-center justify-between border-b border-sky-100 px-4 py-3"><p className="text-xs font-black uppercase tracking-[0.16em] text-sky-700">Navegacion principal</p><button type="button" data-mobile-menu-close aria-label="Cerrar menu principal" className="brand-focus-ring inline-flex h-11 w-11 items-center justify-center rounded-xl border border-sky-200 bg-sky-50 text-sky-950"><X className="h-5 w-5" aria-hidden="true" /></button></div><nav aria-label="Navegacion movil" className="overflow-y-auto px-4 py-4"><Link href="/" className={linkClassName("block min-h-11")}>Inicio</Link><MobileSectionButton label="Servicios" section="services" /><div id="mobile-services-panel" data-mobile-section="services" hidden className="space-y-4 border-l-2 border-sky-100 pl-3 pt-2"><div className="grid gap-1.5">{navigationPriorityServices.map((service) => <a key={service.slug} href={serviceHref(service.slug)} className={linkClassName("block min-h-11 bg-sky-50 text-sky-950")}>{service.navLabel}</a>)}</div>{navigationServiceGroups.map((group) => <details key={group.label} className="group rounded-xl border border-slate-200 bg-slate-50"><summary className="flex min-h-11 cursor-pointer list-none items-center justify-between px-3 py-2 text-sm font-black text-slate-900 [&::-webkit-details-marker]:hidden">{group.label}<ChevronDown className="h-4 w-4 transition-transform group-open:rotate-180" aria-hidden="true" /></summary><div className="grid gap-1 px-2 pb-2">{group.services.map((service) => <a key={service.slug} href={serviceHref(service.slug)} className={linkClassName("block min-h-11 text-sm")}>{service.navLabel}</a>)}</div></details>)}</div><MobileSectionButton label="Cobertura" section="coverage" /><div id="mobile-coverage-panel" data-mobile-section="coverage" hidden className="space-y-2 border-l-2 border-sky-100 pl-3 pt-2">{navigationCoverage.map((item) => <details key={item.landingPath} className="group rounded-xl border border-slate-200 bg-slate-50"><summary className="flex min-h-11 cursor-pointer list-none items-center justify-between px-3 py-2 text-sm font-black text-slate-900 [&::-webkit-details-marker]:hidden">{item.comuna}<ChevronDown className="h-4 w-4 transition-transform group-open:rotate-180" aria-hidden="true" /></summary><div className="grid gap-1 px-2 pb-2"><a href={item.landingPath} className={linkClassName("block min-h-11 bg-white")}>Ver cobertura en {item.comuna}</a>{item.sectors.length ? item.sectors.map((sector) => <a key={sector.href} href={sector.href} className={linkClassName("block min-h-11 pl-5 text-sm font-semibold")}>{sector.label}</a>) : <p className="px-3 py-2 text-xs font-semibold text-slate-600">Sin sectores con landing propia publicados.</p>}</div></details>)}</div><MobileSectionButton label="Recursos" section="resources" /><div id="mobile-resources-panel" data-mobile-section="resources" hidden className="grid gap-1 border-l-2 border-sky-100 pl-3 pt-2">{navigationResources.map((resource) => <a key={resource.href} href={resource.href} className={linkClassName("block min-h-11")}>{resource.label}</a>)}</div><a href="#contacto" className={linkClassName("block min-h-11")}>Contacto</a><a href={adminAccessHref} className={linkClassName("mt-2 block min-h-11 border border-sky-200 bg-sky-50 text-center text-sky-950")}>Acceso Administradores / Empresas</a><div className="mt-3 grid gap-2 border-t border-slate-200 pt-3"><ThemeToggle className="min-h-11 rounded-lg" /><WhatsAppLink href={whatsappHref} /></div></nav></div></div>;
}

function MobileSectionButton({ label, section }: { label: string; section: string }) {
  return <button type="button" data-mobile-section-toggle={section} aria-expanded="false" aria-controls={`mobile-${section}-panel`} className="brand-focus-ring flex min-h-12 w-full items-center justify-between rounded-lg border-b border-slate-200 px-3 py-1 text-base font-black text-slate-950">{label}<ChevronDown className="h-5 w-5" aria-hidden="true" /></button>;
}

const navigationScript = `
(function () {
  var header = document.querySelector('[data-site-header]');
  if (!header || header.getAttribute('data-navigation-ready') === 'true') return;
  header.setAttribute('data-navigation-ready', 'true');
  var desktopPanels = Array.prototype.slice.call(header.querySelectorAll('[data-nav-panel]'));
  var desktopToggles = Array.prototype.slice.call(header.querySelectorAll('[data-nav-toggle]'));
  var mobilePanel = header.querySelector('[data-mobile-navigation]');
  var mobileToggle = header.querySelector('[data-mobile-menu-toggle]');
  var mobileClose = header.querySelector('[data-mobile-menu-close]');
  function setHidden(element, hidden) { if (element) element.hidden = hidden; }
  function closeDesktop() { desktopPanels.forEach(function (panel) { setHidden(panel, true); }); desktopToggles.forEach(function (button) { button.setAttribute('aria-expanded', 'false'); }); }
  function closeMobile() { setHidden(mobilePanel, true); if (mobileToggle) { mobileToggle.setAttribute('aria-expanded', 'false'); mobileToggle.setAttribute('aria-label', 'Abrir menu principal'); } document.body.style.removeProperty('overflow'); header.querySelectorAll('[data-mobile-section]').forEach(function (section) { setHidden(section, true); }); header.querySelectorAll('[data-mobile-section-toggle]').forEach(function (button) { button.setAttribute('aria-expanded', 'false'); }); var openIcon = header.querySelector('[data-mobile-menu-open-icon]'); var closeIcon = header.querySelector('[data-mobile-menu-close-icon]'); if (openIcon) openIcon.classList.remove('hidden'); if (closeIcon) closeIcon.classList.add('hidden'); }
  function closeAll() { closeDesktop(); closeMobile(); }
  desktopToggles.forEach(function (button) { button.addEventListener('click', function () { var name = button.getAttribute('data-nav-toggle'); var panel = header.querySelector('[data-nav-panel="' + name + '"]'); var wasOpen = panel && !panel.hidden; closeDesktop(); closeMobile(); if (panel && !wasOpen) { setHidden(panel, false); button.setAttribute('aria-expanded', 'true'); } }); });
  if (mobileToggle) mobileToggle.addEventListener('click', function () { var open = mobilePanel && !mobilePanel.hidden; closeDesktop(); if (open) closeMobile(); else { setHidden(mobilePanel, false); mobileToggle.setAttribute('aria-expanded', 'true'); mobileToggle.setAttribute('aria-label', 'Cerrar menu principal'); document.body.style.overflow = 'hidden'; var openIcon = header.querySelector('[data-mobile-menu-open-icon]'); var closeIcon = header.querySelector('[data-mobile-menu-close-icon]'); if (openIcon) openIcon.classList.add('hidden'); if (closeIcon) closeIcon.classList.remove('hidden'); } });
  if (mobileClose) mobileClose.addEventListener('click', closeMobile);
  header.querySelectorAll('[data-mobile-section-toggle]').forEach(function (button) { button.addEventListener('click', function () { var name = button.getAttribute('data-mobile-section-toggle'); var section = header.querySelector('[data-mobile-section="' + name + '"]'); var wasOpen = section && !section.hidden; header.querySelectorAll('[data-mobile-section]').forEach(function (item) { setHidden(item, true); }); header.querySelectorAll('[data-mobile-section-toggle]').forEach(function (item) { item.setAttribute('aria-expanded', 'false'); }); if (section && !wasOpen) { setHidden(section, false); button.setAttribute('aria-expanded', 'true'); } }); });
  header.querySelectorAll('#mobile-coverage-panel details').forEach(function (detail) { detail.addEventListener('toggle', function () { if (detail.open) header.querySelectorAll('#mobile-coverage-panel details').forEach(function (other) { if (other !== detail) other.open = false; }); }); });
  header.querySelectorAll('a').forEach(function (link) { link.addEventListener('click', closeAll); });
  document.addEventListener('mousedown', function (event) { if (!header.contains(event.target)) closeAll(); });
  document.addEventListener('keydown', function (event) { if (event.key !== 'Escape') return; if (mobilePanel && !mobilePanel.hidden) closeMobile(); else closeDesktop(); });
  window.addEventListener('resize', function () { if (window.innerWidth >= 1024) closeMobile(); else closeDesktop(); });
})();`;
