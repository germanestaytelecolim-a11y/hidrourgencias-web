import { createDirectWhatsAppUrl } from "./site-config";
export const COMMERCIAL_EVENT = "hu:commercial-entry";
export const COMMERCIAL_SESSION = "hu_commercial_entry_seen_v1";
export const TERMS_VERSION = "texto-web-2026-11-28-aceptacion-expresa";
export const TERMS_URL = "https://hidrourgencias.cl/#terminos-servicio-detalle";
export const urgencyTypes = ["Rebalse de aguas servidas", "Cámara de alcantarillado colapsada", "Red sanitaria obstruida", "WC tapado", "Lavaplatos, lavamanos o ducha obstruidos", "Retorno de aguas servidas", "Inundación por aguas servidas", "Otra urgencia sanitaria"];
export const quoteServices = ["Destape de alcantarillado sanitario", "Destape de desagües", "Destape de cámaras", "Destape de redes verticales y horizontales", "Lavado hidrodinámico con hidrojet", "Videoinspección de tuberías", "Mantenimiento preventivo", "Extracción de aguas con motobombas", "Higienización de espacios afectados por aguas servidas", "Reparaciones sanitarias", "Otro servicio"];
export type CommercialMode = "urgent" | "quote";
export type CommercialFields = {
    name: string;
    commune: string;
    address: string;
    category: string;
    description: string;
    phone: string;
    property: string;
    sector: string;
    email: string;
    terms: boolean;
};
export const emptyCommercialFields: CommercialFields = { name: "", commune: "", address: "", category: "", description: "", phone: "", property: "", sector: "", email: "", terms: false };
export function isLanding(path: string) {
    return /^\/(?:destape-|hidrojet-|videoinspeccion-|urgencias-|mantencion-|extraccion-|motobombas-|servicios\/|cobertura\/|zona\/)/.test(path);
}
export function validCommercialFields(mode: CommercialMode, f: CommercialFields) {
    return Boolean(f.name.trim() && f.commune.trim() && f.description.trim() && f.terms && (mode === "urgent" ? f.address.trim() && urgencyTypes.includes(f.category) : f.property.trim() && quoteServices.includes(f.category)));
}
export function commercialWhatsAppUrl(mode: CommercialMode, f: CommercialFields) {
    if (!validCommercialFields(mode, f))
        return null;
    const lines = [mode === "urgent" ? "SOLICITUD DE EVALUACIÓN URGENTE" : "CONSULTA / SOLICITUD DE COTIZACIÓN", `Nombre: ${f.name.trim()}`, `Comuna: ${f.commune.trim()}`, mode === "urgent" ? `Dirección del servicio: ${f.address.trim()}` : "", `${mode === "urgent" ? "Tipo de urgencia" : "Servicio requerido"}: ${f.category}`, `Descripción: ${f.description.trim()}`, f.property ? `Propiedad: ${f.property}` : "", f.sector.trim() ? `Sector o referencia: ${f.sector.trim()}` : "", f.phone.trim() ? `WhatsApp de contacto: ${f.phone.trim()}` : "", mode === "quote" && f.email.trim() ? `Correo: ${f.email.trim()}` : "", `Declaro haber leído y aceptado los términos: ${TERMS_VERSION}\n${TERMS_URL}`, "Solicitud sujeta a evaluación y confirmación de disponibilidad por Hidrourgencias SpA."];
    return createDirectWhatsAppUrl(lines.filter(Boolean).join("\n"));
}
export function openCommercialEntry(mode: CommercialMode) {
    window.dispatchEvent(new CustomEvent(COMMERCIAL_EVENT, { detail: mode }));
}
