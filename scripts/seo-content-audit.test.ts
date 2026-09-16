import assert from "node:assert/strict";
import test from "node:test";
import { auditPageBodies, CONTENT_SIMILARITY_THRESHOLD } from "./lib/seo-content-audit";

const shared = "La intervención requiere confirmar accesos y comprobar el flujo de agua al finalizar.";
const horizontal = [
  "Un colector horizontal enlaza cámaras de inspección y recibe las descargas de distintos recintos del inmueble.",
  "El diagnóstico compara los niveles entre cámaras para localizar el tramo obstruido y elegir la dirección del trabajo mecánico.",
  "La administración debe identificar los accesos disponibles antes de preparar las herramientas adecuadas para el diámetro del conducto.",
  shared,
];
const preventive = [
  "La mantención preventiva planifica limpiezas periódicas según ocupación del edificio, carga sanitaria e historial de intervenciones.",
  "El calendario de visitas se acuerda con la comunidad para distribuir tareas y reducir interrupciones del funcionamiento habitual.",
  "Cada control registra materiales extraídos y observaciones que permiten ajustar la frecuencia de las siguientes visitas programadas.",
  shared,
];

test("a shared technical paragraph does not turn distinct services into duplicate pages", () => {
  assert.equal(auditPageBodies([{ path: "/horizontal", paragraphs: horizontal }, { path: "/preventiva", paragraphs: preventive }]).blocking, false);
});

test("copied bodies block even when the URL and metadata are different", () => {
  const result = auditPageBodies([{ path: "/original", paragraphs: horizontal }, { path: "/changed-title", paragraphs: [...horizontal] }]);
  assert.equal(result.blocking, true);
  assert.equal(result.exactBodies.length, 1);
});

test("reordering copied paragraphs does not evade the audit", () => {
  assert.equal(auditPageBodies([{ path: "/a", paragraphs: horizontal }, { path: "/b", paragraphs: [...horizontal].reverse() }]).blocking, true);
});

test("near copies still block at the original similarity threshold", () => {
  const result = auditPageBodies([{ path: "/a", paragraphs: horizontal }, { path: "/b", paragraphs: [...horizontal, "Consulta disponibilidad."] }]);
  assert.equal(CONTENT_SIMILARITY_THRESHOLD, 0.9);
  assert.equal(result.exactBodies.length, 0);
  assert.equal(result.similarBodies.length, 1);
  assert.equal(result.blocking, true);
});

test("case and accents do not disguise copied content", () => {
  assert.equal(auditPageBodies([{ path: "/a", paragraphs: horizontal }, { path: "/b", paragraphs: horizontal.map((p) => p.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toUpperCase()) }]).blocking, true);
});
