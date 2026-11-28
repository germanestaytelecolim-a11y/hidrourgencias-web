import assert from "node:assert/strict";
import test from "node:test";
import { commercialWhatsAppUrl, emptyCommercialFields, isLanding, quoteServices, TERMS_URL, TERMS_VERSION, urgencyTypes, validCommercialFields } from "./commercial-entry";
const fields = { ...emptyCommercialFields, name: "Prueba sintética", commune: "Quillota", address: "Dirección sintética", category: urgencyTypes[0], description: "Prueba sin envío", terms: true };
test("urgencia requiere cada antecedente y aceptación expresa", () => {
    assert.equal(validCommercialFields("urgent", fields), true);
    for (const key of ["name", "commune", "address", "category", "description"] as const)
        assert.equal(validCommercialFields("urgent", { ...fields, [key]: " " }), false);
    assert.equal(commercialWhatsAppUrl("urgent", { ...fields, terms: false }), null);
    const url = new URL(commercialWhatsAppUrl("urgent", fields)!);
    assert.equal(url.origin + url.pathname, "https://wa.me/56940918672");
    assert.match(url.searchParams.get("text")!, /Dirección del servicio: Dirección sintética/);
    assert.ok(url.searchParams.get("text")!.includes(TERMS_VERSION));
    assert.ok(url.searchParams.get("text")!.includes(TERMS_URL));
});
test("cotización tiene mensaje independiente y campos opcionales vacíos", () => {
    const quote = { ...fields, category: quoteServices[0], property: "Vivienda", address: "", terms: false };
    assert.ok(validCommercialFields("quote", quote));
    assert.equal(validCommercialFields("quote", { ...quote, property: "" }), false);
    const message = new URL(commercialWhatsAppUrl("quote", quote)!).searchParams.get("text")!;
    assert.match(message, /CONSULTA \/ SOLICITUD DE COTIZACIÓN/);
    assert.doesNotMatch(message, /Dirección del servicio|Declaro haber|Correo:/);
});
test("bienvenida limitada a landings; nunca administración ni portada", () => {
    for (const route of ["/destape-alcantarillado-quillota", "/servicios/hidrojet", "/hidrojet-concon"])
        assert.ok(isLanding(route));
    for (const route of ["/", "/admin", "/admin/trabajos", "/api/admin/media", "/blog"])
        assert.equal(isLanding(route), false);
});
