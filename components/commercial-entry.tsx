"use client";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { COMMERCIAL_EVENT, COMMERCIAL_SESSION, TERMS_URL, TERMS_VERSION, commercialWhatsAppUrl, emptyCommercialFields, isLanding, openCommercialEntry, quoteServices, urgencyTypes, type CommercialFields, type CommercialMode } from "@/lib/commercial-entry";
import { serviceTerms, serviceTermsNoticeSummary } from "@/components/service-terms";
export function CommercialChoices() {
    return <div className="commercial-choices">
    <article className="commercial-choice commercial-choice--urgent"><span>URGENCIA SANITARIA 24/7</span><p>¿Alcantarillado rebalsado, cámara colapsada o desagüe obstruido? Solicita evaluación técnica prioritaria.</p><button type="button" onClick={() => openCommercialEntry("urgent")}>SOLICITAR ATENCIÓN URGENTE</button></article>
    <article className="commercial-choice"><span>CONSULTAS Y COTIZACIONES</span><p>Cotiza destapes, hidrojet, videoinspección y mantenimiento preventivo para viviendas, edificios y empresas.</p><button type="button" onClick={() => openCommercialEntry("quote")}>SOLICITAR COTIZACIÓN</button></article>
  </div>;
}
function CommercialForm({ mode }: {
    mode: CommercialMode;
}) {
    const [fields, setFields] = useState<CommercialFields>({ ...emptyCommercialFields });
    const [opened, setOpened] = useState(false);
    function input(key: keyof CommercialFields, label: string, required = false, type = "text") {
        return <label>{label}{required ? " *" : " (opcional)"}<input name={key} type={type} required={required} maxLength={key === "address" ? 240 : 120} autoComplete={key === "name" ? "name" : key === "email" ? "email" : key === "phone" ? "tel" : "off"} value={String(fields[key])} onChange={e => { setOpened(false); setFields({ ...fields, [key]: e.target.value }); }}/></label>;
    }
    function submit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        const url = commercialWhatsAppUrl(mode, fields);
        if (!url)
            return;
        window.open(url, "_blank", "noopener,noreferrer");
        setOpened(true);
    }
    return <form className="commercial-form" onSubmit={submit}>
    <p>Región de Valparaíso · Los campos con * son obligatorios.</p>
    <div className="commercial-fields">{input("name", "Nombre", true)}{input("commune", "Comuna", true)}{mode === "urgent" && input("address", "Dirección del servicio", true)}
      <label>{mode === "urgent" ? "Tipo de urgencia" : "Servicio requerido"} *<select name="category" required value={fields.category} onChange={e => setFields({ ...fields, category: e.target.value })}><option value="">Seleccionar</option>{(mode === "urgent" ? urgencyTypes : quoteServices).map(x => <option key={x}>{x}</option>)}</select></label>
      <label>Tipo de propiedad{mode === "quote" ? " *" : " (opcional)"}<select name="property" required={mode === "quote"} value={fields.property} onChange={e => setFields({ ...fields, property: e.target.value })}><option value="">Seleccionar</option>{["Vivienda", "Edificio o comunidad", "Empresa o local comercial", "Otra propiedad"].map(x => <option key={x}>{x}</option>)}</select></label>
      {mode === "urgent" && input("sector", "Sector o referencia")}{input("phone", "WhatsApp de contacto", false, "tel")}{mode === "quote" && input("email", "Correo electrónico", false, "email")}
    </div>
    <label>Descripción breve de la situación o solicitud *<textarea name="description" required maxLength={1200} rows={3} value={fields.description} onChange={e => setFields({ ...fields, description: e.target.value })}/></label>
    {<><p className="commercial-notice">{serviceTermsNoticeSummary} La movilización, diagnóstico y recursos ejecutados en terreno están sujetos a cobro según los términos. La atención depende de disponibilidad y confirmación del equipo.</p><details><summary>Leer términos y condiciones vigentes</summary><p>Referencia del texto: {TERMS_VERSION}</p>{serviceTerms.map(term => <p key={term}>{term}</p>)}<a href={TERMS_URL} target="_blank" rel="noopener noreferrer">Ver documento en el sitio (otra pestaña)</a></details><label className="commercial-consent"><input name="terms" type="checkbox" required checked={fields.terms} onChange={e => setFields({ ...fields, terms: e.target.checked })}/>Declaro haber leído y aceptado los términos y condiciones aplicables a la evaluación y prestación de servicios de Hidrourgencias SpA.</label></>}
    <p>Se abrirá WhatsApp con un mensaje preparado. Debes enviarlo manualmente. Abrir WhatsApp no confirma la recepción ni la aceptación del servicio por la empresa.</p>
    <button className="commercial-submit" type="submit">{mode === "urgent" ? "ENVIAR SOLICITUD URGENTE POR WHATSAPP" : "SOLICITAR COTIZACIÓN POR WHATSAPP"}</button>
    {opened && <p role="status">Mensaje preparado. Completa el envío en WhatsApp; si no se abrió, permite la ventana emergente y vuelve a pulsar el botón.</p>}
  </form>;
}
export function CommercialEntry({ pathname }: {
    pathname: string;
}) {
    const dialog = useRef<HTMLDialogElement>(null);
    const previousFocus = useRef<HTMLElement | null>(null);
    const [mode, setMode] = useState<CommercialMode | "welcome">("welcome");
    const excluded = /^\/(?:admin|api|cms|acceso-administradores-empresas)(?:\/|$)/.test(pathname);
    useEffect(() => {
        if (excluded)
            return;
        const element = dialog.current;
        function remember() { try {
            sessionStorage.setItem(COMMERCIAL_SESSION, "seen");
        }
        catch { /* Session storage can be unavailable. */ } }
        function show(next: CommercialMode | "welcome") {
            remember();
            previousFocus.current = document.activeElement as HTMLElement;
            setMode(next);
            dialog.current?.showModal();
        }
        function open(event: Event) { const next = (event as CustomEvent).detail; if (next === "urgent" || next === "quote")
            show(next); }
        window.addEventListener(COMMERCIAL_EVENT, open);
        try {
            if (pathname === "/")
                remember();
            else if (isLanding(pathname) && !sessionStorage.getItem(COMMERCIAL_SESSION))
                show("welcome");
        }
        catch { /* Keep navigation available when storage is blocked. */ }
        return () => { window.removeEventListener(COMMERCIAL_EVENT, open); element?.close(); };
    }, [pathname, excluded]);
    useEffect(() => {
        const element = dialog.current;
        if (element?.open)
            element.querySelector<HTMLElement>("input, button")?.focus();
    }, [mode]);
    if (excluded)
        return null;
    return <>
    <nav className={`commercial-reopen${pathname === "/" ? " commercial-reopen--home" : ""}`} aria-label="Solicitar atención"><button onClick={() => openCommercialEntry("urgent")}>Urgencia 24/7</button><button onClick={() => openCommercialEntry("quote")}>Cotizar</button></nav>
    <dialog className="commercial-dialog" ref={dialog} aria-labelledby="commercial-title" onClose={() => previousFocus.current?.focus()} onClick={e => { if (e.target === e.currentTarget)
        dialog.current?.close(); }}>
      <header><h2 id="commercial-title">{mode === "welcome" ? "¿Cómo podemos ayudarte?" : mode === "urgent" ? "Tengo una urgencia sanitaria" : "Consultar o solicitar cotización"}</h2><button autoFocus type="button" onClick={() => dialog.current?.close()} aria-label="Cerrar acceso comercial">Cerrar ×</button></header>
      {mode === "welcome" ? <CommercialChoices /> : <CommercialForm key={mode} mode={mode}/>}
    </dialog>
  </>;
}
