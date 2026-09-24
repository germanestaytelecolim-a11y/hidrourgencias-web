import assert from "node:assert/strict";
import test from "node:test";

import {
  GOOGLE_ADS_WHATSAPP_CONVERSION,
  createWhatsAppConversionSubmitter,
  reportWhatsAppConversion,
  type GoogleAdsGtag,
  type WhatsAppConversionEnvironment,
} from "@/lib/google-ads";
import { isWhatsAppLeadFormValid, type WhatsAppLeadFormState } from "@/components/whatsapp-lead-form";

const whatsappUrl = "https://wa.me/56940918672?text=Solicitud";

const validForm: WhatsAppLeadFormState = {
  name: "Ana",
  propertyType: "Particular",
  requestType: "Urgencia sanitaria",
  commune: "Viña del Mar",
  sector: "Centro",
  address: "",
  service: "Destape de baño / WC",
  description: "El baño rebalsa.",
  evidence: "No tengo evidencia disponible",
  terms: true,
};

function createEnvironment(gtag?: GoogleAdsGtag) {
  const gtagCalls: unknown[][] = [];
  const navigations: string[] = [];
  const timers: Array<() => void> = [];
  const popup = {
    closed: false,
    opener: undefined as unknown,
    location: {
      replace: (url: string) => navigations.push(url),
    },
  };
  const environment: WhatsAppConversionEnvironment = {
    gtag: gtag
      ? ((...args: Parameters<GoogleAdsGtag>) => {
          gtagCalls.push(args);
          gtag(...args);
        })
      : undefined,
    open: () => popup,
    setTimeout: (callback) => {
      timers.push(callback);
      return timers.length - 1;
    },
    clearTimeout: () => undefined,
    location: { assign: (url) => navigations.push(url) },
  };

  return { environment, gtagCalls, navigations, timers };
}

test("formularios inválidos o sin términos no son elegibles para la conversión", () => {
  assert.equal(isWhatsAppLeadFormValid({ ...validForm, description: "" }), false);
  assert.equal(isWhatsAppLeadFormValid({ ...validForm, terms: false }), false);
});

test("la conversión usa el evento y send_to oficiales una única vez", () => {
  const { environment, gtagCalls } = createEnvironment(() => undefined);
  const submit = createWhatsAppConversionSubmitter();

  assert.equal(submit(whatsappUrl, environment), true);
  assert.equal(submit(whatsappUrl, environment), false);
  assert.equal(gtagCalls.length, 1);
  assert.equal(gtagCalls[0][0], "event");
  assert.equal(gtagCalls[0][1], "conversion");
  assert.equal((gtagCalls[0][2] as { send_to: string }).send_to, GOOGLE_ADS_WHATSAPP_CONVERSION);
});

test("el callback abre WhatsApp exactamente una vez", () => {
  let callback: (() => void) | undefined;
  const { environment, navigations, timers } = createEnvironment((_command, _event, parameters) => {
    callback = parameters.event_callback;
  });

  reportWhatsAppConversion(whatsappUrl, environment);
  callback?.();
  timers.forEach((timer) => timer());
  assert.deepEqual(navigations, [whatsappUrl]);
});

test("el fallback abre WhatsApp si Google Ads no responde", () => {
  const { environment, navigations, timers } = createEnvironment(() => undefined);

  reportWhatsAppConversion(whatsappUrl, environment);
  timers.forEach((timer) => timer());
  assert.deepEqual(navigations, [whatsappUrl]);
});

test("sin gtag WhatsApp se abre de todas formas", () => {
  const { environment, gtagCalls, navigations } = createEnvironment();

  reportWhatsAppConversion(whatsappUrl, environment);
  assert.equal(gtagCalls.length, 0);
  assert.deepEqual(navigations, [whatsappUrl]);
});
