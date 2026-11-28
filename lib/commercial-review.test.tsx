import assert from "node:assert/strict";
import test from "node:test";
import { renderToStaticMarkup } from "react-dom/server";
import { HeroUrgencias } from "@/components/HeroUrgencias";
import { getCmsHomeSettings } from "@/lib/cms-content";
import { trackCommercialFormEvent } from "@/lib/conversion";
import { commercialWhatsAppUrl, emptyCommercialFields, urgencyTypes } from "@/lib/commercial-entry";
import { createWhatsAppConversionSubmitter, type WhatsAppConversionEnvironment } from "@/lib/google-ads";

const approved = "/images/commercial/servicio-aprobado-768.webp";
test("CMS puede sustituir imagen y alt sin ser sobrescrito por srcSet aprobado", () => {
  const settings = getCmsHomeSettings();
  assert.equal(settings.heroImage, approved);
  const html = renderToStaticMarkup(<HeroUrgencias settings={{ ...settings, heroImage: "/cms-prueba.webp", heroImageAlt: "Foto configurada en CMS" }} />);
  assert.match(html, /src="\/cms-prueba.webp"/);
  assert.match(html, /alt="Foto configurada en CMS"/);
  assert.doesNotMatch(html, /srcSet=|srcset=|tel:|Imagen comercial ilustrativa/);
  const fallback = renderToStaticMarkup(<HeroUrgencias settings={{ ...settings, heroImage: " ", heroImageAlt: " " }} />);
  assert.ok(fallback.includes(approved));
  assert.match(fallback, /servicio-aprobado-480.webp 480w/);
  assert.match(fallback, /SOLICITAR ATENCIÓN URGENTE|SOLICITAR COTIZACIÓN/);
});

test("medición de apertura y clic usa un solo transporte y ningún campo personal o campaña", () => {
  const original = Object.getOwnPropertyDescriptor(globalThis, "window");
  const queued: unknown[] = [];
  const calls: unknown[][] = [];
  const fake = { dataLayer: queued, gtag: (...args: unknown[]) => calls.push(args),
    get sessionStorage() { throw Error("No leer campañas/PII"); },
    get location() { throw Error("No leer URL/PII"); } };
  Object.defineProperty(globalThis, "window", { configurable: true, value: fake });
  try {
    trackCommercialFormEvent("commercial_form_open", "urgent");
    trackCommercialFormEvent("commercial_whatsapp_click", "quote");
    assert.deepEqual(calls, [
      ["event", "commercial_form_open", { form_type: "urgent", contact_stage: "form_open" }],
      ["event", "commercial_whatsapp_click", { form_type: "quote", contact_stage: "whatsapp_click" }],
    ]);
    assert.deepEqual(queued, []);
    Object.assign(fake, { gtag: undefined });
    trackCommercialFormEvent("commercial_form_open", "quote");
    assert.deepEqual(queued, [{ event: "commercial_form_open", form_type: "quote", contact_stage: "form_open" }]);
    Object.assign(fake, { gtag: () => { throw Error("Analytics bloqueado"); } });
    assert.doesNotThrow(() => trackCommercialFormEvent("commercial_whatsapp_click", "urgent"));
  } finally {
    if (original) Object.defineProperty(globalThis, "window", original);
    else Reflect.deleteProperty(globalThis, "window");
  }
});

test("envío válido reutiliza una sola conversión de clic; callbacks no duplican apertura", () => {
  const calls: unknown[][] = [];
  const destinations: string[] = [];
  const timers: Array<() => void> = [];
  const environment: WhatsAppConversionEnvironment = {
    gtag: (...args) => { calls.push(args); },
    open: () => ({ location: { replace: url => { destinations.push(url); } } }),
    setTimeout: callback => { timers.push(callback); return timers.length; },
    clearTimeout: () => undefined,
    location: { assign: url => { destinations.push(url); } },
  };
  const fields = { ...emptyCommercialFields, name: "Persona sintética", commune: "Comuna sintética", address: "Dirección sintética", description: "Sin envío real", category: urgencyTypes[0], terms: true };
  assert.equal(commercialWhatsAppUrl("urgent", { ...fields, terms: false }), null);
  assert.equal(calls.length, 0);
  const url = commercialWhatsAppUrl("urgent", fields)!;
  const submit = createWhatsAppConversionSubmitter();
  assert.equal(submit(url, environment), true);
  assert.equal(submit(url, environment), false);
  assert.equal(calls.length, 1);
  assert.deepEqual(Object.keys(calls[0][2] as object).sort(), ["event_callback", "send_to"]);
  const callback = (calls[0][2] as { event_callback: () => void }).event_callback;
  callback(); callback(); timers.forEach(timer => timer());
  assert.deepEqual(destinations, [url]);
  assert.doesNotMatch(JSON.stringify(calls), /Persona sintética|Comuna sintética|Dirección sintética|Sin envío real|confirmed/);
});
