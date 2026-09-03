"use client";

import Link from "next/link";
import { ChevronDown, ChevronRight, Menu, PhoneCall, X } from "lucide-react";
import { type KeyboardEvent as ReactKeyboardEvent, useEffect, useRef, useState } from "react";

import { StaticPicture } from "@/components/static-picture";
import { ThemeToggle } from "@/components/theme-toggle";
import { createWhatsAppUrl } from "@/lib/site-config";
import { navigationCoverage, navigationPriorityServices, navigationResources, navigationServiceGroups } from "@/lib/navigation";

const adminAccessHref = "/acceso-administradores-empresas";
const whatsappHref = createWhatsAppUrl("Hola, necesito urgencia sanitaria 24/7 en Region de Valparaiso.");
const firstCoverageId = navigationCoverage[0]?.id ?? "";
type DesktopPanelName = "services" | "coverage" | "resources";
type MobileSectionName = DesktopPanelName;

function activateOnKeyboard(event: ReactKeyboardEvent<HTMLButtonElement>, action: () => void) {
  if (event.key !== "Enter" && event.key !== " ") return;
  event.preventDefault();
  action();
}

function linkClassName(extra = "") {
  return `brand-focus-ring rounded-lg px-3 py-2 text-sm font-bold text-slate-700 transition hover:bg-sky-50 hover:text-sky-900 ${extra}`;
}

function serviceHref(slug: string) {
  return `/servicios/${slug}`;
}

export function SiteHeader() {
  const headerRef = useRef<HTMLElement>(null);
  const mobileToggleRef = useRef<HTMLButtonElement>(null);
  const mobileOpenRef = useRef(false);
  const [desktopPanel, setDesktopPanel] = useState<DesktopPanelName | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileSection, setMobileSection] = useState<MobileSectionName | null>(null);
  const [selectedCoverage, setSelectedCoverage] = useState(firstCoverageId);
  const [mobileCoverage, setMobileCoverage] = useState<string | null>(null);

  function closeMobile(restoreFocus = false) {
    setMobileOpen(false);
    setMobileSection(null);
    setMobileCoverage(null);
    if (restoreFocus) requestAnimationFrame(() => mobileToggleRef.current?.focus());
  }

  function closeAll() {
    setDesktopPanel(null);
    closeMobile();
  }

  function toggleDesktop(panel: DesktopPanelName) {
    closeMobile();
    setDesktopPanel((current) => (current === panel ? null : panel));
  }

  function toggleMobileSection(section: MobileSectionName) {
    setMobileSection((current) => (current === section ? null : section));
    if (section !== "coverage") setMobileCoverage(null);
  }

  useEffect(() => {
    mobileOpenRef.current = mobileOpen;
  }, [mobileOpen]);

  useEffect(() => {
    function handlePointerDown(event: PointerEvent) {
      if (headerRef.current && !headerRef.current.contains(event.target as Node)) {
        setDesktopPanel(null);
        setMobileOpen(false);
        setMobileSection(null);
        setMobileCoverage(null);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setDesktopPanel(null);
        closeMobile(mobileOpenRef.current);
      }
    }

    function handleResize() {
      if (window.innerWidth >= 1024) closeMobile();
      else setDesktopPanel(null);
    }

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    window.addEventListener("resize", handleResize);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    if (!mobileOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      if (previousOverflow) document.body.style.overflow = previousOverflow;
      else document.body.style.removeProperty("overflow");
    };
  }, [mobileOpen]);

  return (
    <header ref={headerRef} data-site-header className="site-header sticky top-0 z-50 border-b border-sky-100/90 bg-white/95 shadow-[0_18px_44px_-34px_rgba(8,56,95,0.82)]">
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
          <NavPanelButton label="Servicios" panel="services" open={desktopPanel === "services"} onToggle={toggleDesktop} />
          <NavPanelButton label="Cobertura" panel="coverage" open={desktopPanel === "coverage"} onToggle={toggleDesktop} />
          <NavPanelButton label="Recursos" panel="resources" open={desktopPanel === "resources"} onToggle={toggleDesktop} />
          <a href="#contacto" className={linkClassName()}>Contacto</a>
        </nav>

        <div className="site-header__desktop-auxiliary ml-auto hidden items-center gap-2 lg:flex">
          <a href={adminAccessHref} className="site-header__admin-link brand-focus-ring rounded-full border border-sky-200 bg-sky-50 px-3 py-2 text-center text-xs font-black leading-tight text-sky-950 transition hover:bg-white">Acceso Administradores / Empresas</a>
          <ThemeToggle compact className="site-header__theme-toggle h-10 w-10 px-0" />
          <WhatsAppLink href={whatsappHref} />
        </div>

        <button ref={mobileToggleRef} type="button" data-mobile-menu-toggle aria-label={mobileOpen ? "Cerrar menu principal" : "Abrir menu principal"} aria-expanded={mobileOpen} aria-controls="mobile-navigation-panel" onClick={() => { setDesktopPanel(null); setMobileOpen((current) => !current); }} onKeyDown={(event) => activateOnKeyboard(event, () => { setDesktopPanel(null); setMobileOpen((current) => !current); })} className="brand-focus-ring ml-auto inline-flex h-11 w-11 items-center justify-center rounded-xl border border-sky-200 bg-sky-50 text-sky-950 lg:hidden">
          {mobileOpen ? <X className="h-5 w-5" aria-hidden="true" /> : <Menu className="h-5 w-5" aria-hidden="true" />}
        </button>
      </div>

      <DesktopServicesPanel open={desktopPanel === "services"} onNavigate={closeAll} />
      <DesktopCoveragePanel open={desktopPanel === "coverage"} selectedCoverage={selectedCoverage} onSelectCoverage={setSelectedCoverage} onNavigate={closeAll} />
      <DesktopResourcesPanel open={desktopPanel === "resources"} onNavigate={closeAll} />
      <MobileNavigation open={mobileOpen} section={mobileSection} mobileCoverage={mobileCoverage} onClose={() => closeMobile(true)} onToggleSection={toggleMobileSection} onToggleCoverage={(id) => setMobileCoverage((current) => (current === id ? null : id))} onNavigate={closeAll} />
    </header>
  );
}

function NavPanelButton({ label, panel, open, onToggle }: { label: string; panel: DesktopPanelName; open: boolean; onToggle: (panel: DesktopPanelName) => void }) {
  return <button type="button" data-nav-toggle={panel} aria-expanded={open} aria-controls={`desktop-${panel}-panel`} onClick={() => onToggle(panel)} onKeyDown={(event) => activateOnKeyboard(event, () => onToggle(panel))} className={linkClassName("inline-flex items-center gap-1")}>{label}<ChevronDown className={`h-4 w-4 transition-transform ${open ? "rotate-180" : ""}`} aria-hidden="true" /></button>;
}

function DesktopServicesPanel({ open, onNavigate }: { open: boolean; onNavigate: () => void }) {
  return <div id="desktop-services-panel" data-nav-panel="services" hidden={!open} className="site-header__desktop-panel"><div className="mx-auto grid max-w-7xl grid-cols-3 gap-6 px-6 py-5">{navigationServiceGroups.map((group) => <section key={group.label} aria-labelledby={`service-group-${group.label}`}><h2 id={`service-group-${group.label}`} className="text-xs font-black uppercase tracking-[0.16em] text-sky-700">{group.label}</h2><div className="mt-3 grid gap-1.5">{group.services.map((service) => <a key={service.slug} href={serviceHref(service.slug)} onClick={onNavigate} className={linkClassName(`block ${service.priority ? "bg-sky-50 text-sky-950" : "text-slate-700"}`)}>{service.navLabel}</a>)}</div></section>)}</div></div>;
}

function DesktopCoveragePanel({ open, selectedCoverage, onSelectCoverage, onNavigate }: { open: boolean; selectedCoverage: string; onSelectCoverage: (id: string) => void; onNavigate: () => void }) {
  return <div id="desktop-coverage-panel" data-nav-panel="coverage" hidden={!open} className="site-header__desktop-panel"><div className="mx-auto grid max-w-7xl grid-cols-[minmax(13rem,0.7fr)_minmax(0,1.3fr)] gap-6 px-6 py-5"><section aria-labelledby="coverage-comunas-title"><h2 id="coverage-comunas-title" className="text-xs font-black uppercase tracking-[0.16em] text-sky-700">Comunas de cobertura</h2><div className="mt-3 grid gap-1">{navigationCoverage.map((item) => <button key={item.id} type="button" data-coverage-select={item.id} aria-pressed={item.id === selectedCoverage} onClick={() => onSelectCoverage(item.id)} onKeyDown={(event) => activateOnKeyboard(event, () => onSelectCoverage(item.id))} className={linkClassName(`w-full text-left ${item.id === selectedCoverage ? "bg-sky-100 text-sky-950" : ""}`)}>{item.comuna}<ChevronRight className="float-right mt-0.5 h-4 w-4" aria-hidden="true" /></button>)}</div></section><section aria-labelledby="coverage-sectors-title"><h2 id="coverage-sectors-title" className="text-xs font-black uppercase tracking-[0.16em] text-sky-700">Sectores tecnicos</h2>{navigationCoverage.map((item) => <div key={item.id} data-coverage-pane={item.id} hidden={item.id !== selectedCoverage}><div className="flex items-start justify-between gap-4"><p className="mt-1 text-sm font-semibold text-slate-600">{item.comuna}</p><a href={item.landingPath} onClick={onNavigate} className="brand-focus-ring rounded-full border border-sky-200 px-3 py-2 text-xs font-black text-sky-900 hover:bg-sky-50">Ver cobertura</a></div><div className="mt-4 grid max-h-64 grid-cols-2 gap-1.5 overflow-y-auto pr-1">{item.sectors.length ? item.sectors.map((sector) => <a key={sector.href} href={sector.href} onClick={onNavigate} className={linkClassName("text-sm")}>{sector.label}</a>) : <p className="rounded-lg bg-slate-50 px-3 py-3 text-sm font-semibold text-slate-600">Cobertura tecnica disponible a nivel comunal. Proximamente se incorporaran accesos especificos por sector.</p>}</div></div>)}</section></div></div>;
}

function DesktopResourcesPanel({ open, onNavigate }: { open: boolean; onNavigate: () => void }) {
  return <div id="desktop-resources-panel" data-nav-panel="resources" hidden={!open} className="site-header__desktop-panel"><div className="mx-auto flex max-w-7xl gap-2 px-6 py-4">{navigationResources.map((resource) => <a key={resource.href} href={resource.href} onClick={onNavigate} className={linkClassName("min-w-48")}>{resource.label}</a>)}</div></div>;
}

function WhatsAppLink({ href }: { href: string }) {
  return <a href={href} target="_blank" rel="noopener noreferrer" aria-label="Abrir WhatsApp de urgencias sanitarias" className="brand-focus-ring inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-[#06c286] px-3.5 py-2 text-xs font-black text-white shadow-lg shadow-emerald-500/30 transition hover:-translate-y-0.5 hover:bg-emerald-600"><PhoneCall className="h-4 w-4" aria-hidden="true" />WhatsApp 24/7</a>;
}

function MobileNavigation({ open, section, mobileCoverage, onClose, onToggleSection, onToggleCoverage, onNavigate }: { open: boolean; section: MobileSectionName | null; mobileCoverage: string | null; onClose: () => void; onToggleSection: (section: MobileSectionName) => void; onToggleCoverage: (id: string) => void; onNavigate: () => void }) {
  return <div id="mobile-navigation-panel" data-mobile-navigation hidden={!open} className="site-header__mobile-layer lg:hidden"><div className="site-header__mobile-panel"><div className="flex items-center justify-between border-b border-sky-100 px-4 py-3"><p className="text-xs font-black uppercase tracking-[0.16em] text-sky-700">Navegacion principal</p><button type="button" data-mobile-menu-close aria-label="Cerrar menu principal" onClick={onClose} onKeyDown={(event) => activateOnKeyboard(event, onClose)} className="brand-focus-ring inline-flex h-11 w-11 items-center justify-center rounded-xl border border-sky-200 bg-sky-50 text-sky-950"><X className="h-5 w-5" aria-hidden="true" /></button></div><nav aria-label="Navegacion movil" className="overflow-y-auto px-4 py-4"><Link href="/" onClick={onNavigate} className={linkClassName("block min-h-11")}>Inicio</Link><MobileSectionButton label="Servicios" section="services" open={section === "services"} onToggle={onToggleSection} /><div id="mobile-services-panel" data-mobile-section="services" hidden={section !== "services"} className="space-y-4 border-l-2 border-sky-100 pl-3 pt-2"><div className="grid gap-1.5">{navigationPriorityServices.map((service) => <a key={service.slug} href={serviceHref(service.slug)} onClick={onNavigate} className={linkClassName("block min-h-11 bg-sky-50 text-sky-950")}>{service.navLabel}</a>)}</div>{navigationServiceGroups.map((group) => <details key={group.label} name="mobile-service-groups" className="group rounded-xl border border-slate-200 bg-slate-50"><summary className="flex min-h-11 cursor-pointer list-none items-center justify-between px-3 py-2 text-sm font-black text-slate-900 [&::-webkit-details-marker]:hidden">{group.label}<ChevronDown className="h-4 w-4 transition-transform group-open:rotate-180" aria-hidden="true" /></summary><div className="grid gap-1 px-2 pb-2">{group.services.map((service) => <a key={service.slug} href={serviceHref(service.slug)} onClick={onNavigate} className={linkClassName("block min-h-11 text-sm")}>{service.navLabel}</a>)}</div></details>)}</div><MobileSectionButton label="Cobertura" section="coverage" open={section === "coverage"} onToggle={onToggleSection} /><div id="mobile-coverage-panel" data-mobile-section="coverage" hidden={section !== "coverage"} className="space-y-2 border-l-2 border-sky-100 pl-3 pt-2">{navigationCoverage.map((item) => <div key={item.landingPath} className="rounded-xl border border-slate-200 bg-slate-50"><button type="button" aria-expanded={mobileCoverage === item.id} aria-controls={`mobile-coverage-${item.id}`} onClick={() => onToggleCoverage(item.id)} onKeyDown={(event) => activateOnKeyboard(event, () => onToggleCoverage(item.id))} className="brand-focus-ring flex min-h-11 w-full items-center justify-between px-3 py-2 text-left text-sm font-black text-slate-900">{item.comuna}<ChevronDown className={`h-4 w-4 transition-transform ${mobileCoverage === item.id ? "rotate-180" : ""}`} aria-hidden="true" /></button><div id={`mobile-coverage-${item.id}`} hidden={mobileCoverage !== item.id} className="grid gap-1 px-2 pb-2"><a href={item.landingPath} onClick={onNavigate} className={linkClassName("block min-h-11 bg-white")}>Ver cobertura en {item.comuna}</a>{item.sectors.length ? item.sectors.map((sector) => <a key={sector.href} href={sector.href} onClick={onNavigate} className={linkClassName("block min-h-11 pl-5 text-sm font-semibold")}>{sector.label}</a>) : <p className="px-3 py-2 text-xs font-semibold text-slate-600">Cobertura tecnica disponible a nivel comunal.</p>}</div></div>)}</div><MobileSectionButton label="Recursos" section="resources" open={section === "resources"} onToggle={onToggleSection} /><div id="mobile-resources-panel" data-mobile-section="resources" hidden={section !== "resources"} className="grid gap-1 border-l-2 border-sky-100 pl-3 pt-2">{navigationResources.map((resource) => <a key={resource.href} href={resource.href} onClick={onNavigate} className={linkClassName("block min-h-11")}>{resource.label}</a>)}</div><a href="#contacto" onClick={onNavigate} className={linkClassName("block min-h-11")}>Contacto</a><a href={adminAccessHref} onClick={onNavigate} className={linkClassName("mt-2 block min-h-11 border border-sky-200 bg-sky-50 text-center text-sky-950")}>Acceso Administradores / Empresas</a><div className="mt-3 grid gap-2 border-t border-slate-200 pt-3"><ThemeToggle className="min-h-11 rounded-lg" /><WhatsAppLink href={whatsappHref} /></div></nav></div></div>;
}

function MobileSectionButton({ label, section, open, onToggle }: { label: string; section: MobileSectionName; open: boolean; onToggle: (section: MobileSectionName) => void }) {
  return <button type="button" data-mobile-section-toggle={section} aria-expanded={open} aria-controls={`mobile-${section}-panel`} onClick={() => onToggle(section)} onKeyDown={(event) => activateOnKeyboard(event, () => onToggle(section))} className="brand-focus-ring flex min-h-12 w-full items-center justify-between rounded-lg border-b border-slate-200 px-3 py-1 text-base font-black text-slate-950">{label}<ChevronDown className={`h-5 w-5 transition-transform ${open ? "rotate-180" : ""}`} aria-hidden="true" /></button>;
}
