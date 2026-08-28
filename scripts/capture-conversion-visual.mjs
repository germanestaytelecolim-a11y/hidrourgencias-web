import { createRequire } from "node:module";
import { mkdir, readFile, readdir, writeFile } from "node:fs/promises";
import path from "node:path";

const require = createRequire(import.meta.url);
const { chromium } = require("playwright");
const sharp = require("sharp");

const baseUrl = process.env.BASE_URL ?? "http://localhost:3110";
const stage = process.env.STAGE ?? "current";
const outputRoot = process.env.OUTPUT_DIR ?? path.join(process.cwd(), "reports", "conversion-visual");
const outputDir = path.join(outputRoot, stage);
const outputFile =
  process.env.OUTPUT_FILE ?? path.join(process.cwd(), "reports", `conversion-browser-${stage}.json`);
const detailsOnly = process.env.DETAILS_ONLY === "1";
const screenshotsOnly = process.env.SCREENSHOTS_ONLY === "1";

const routes = [
  "/",
  "/servicios/destape-alcantarillado",
  "/servicios/hidrojet",
  "/destape-alcantarillado-vina-del-mar",
  "/destape-alcantarillado-valparaiso",
  "/hidrojet-concon",
  "/destape-alcantarillado-quilpue",
  "/destape-alcantarillado-villa-alemana",
  "/destape-alcantarillado-casablanca",
  "/destape-alcantarillado-maitencillo-puchuncavi",
];

const viewports = [
  { name: "390", width: 390, height: 844 },
  { name: "768", width: 768, height: 1024 },
  { name: "1440", width: 1440, height: 1000 },
];

function routeName(route) {
  return route === "/" ? "home" : route.slice(1).replaceAll("/", "__");
}

async function closeAlert(page) {
  const closeButton = page.getByRole("button", { name: /Cerrar comunicado|Entendido/i }).first();
  if (await closeButton.count()) {
    await closeButton.click({ timeout: 1_500 }).catch(() => undefined);
  }
}

async function captureFullPage(page, screenshotPath) {
  let lastError;
  for (let attempt = 1; attempt <= 3; attempt += 1) {
    try {
      await page.screenshot({
        path: screenshotPath,
        fullPage: true,
        type: "jpeg",
        quality: 58,
        animations: "disabled",
        caret: "hide",
      });
      return;
    } catch (error) {
      lastError = error;
      await page.waitForTimeout(500 * attempt);
    }
  }
  throw lastError;
}

async function readElementState(page, selector) {
  const locator = page.locator(selector).first();
  const count = await locator.count();
  if (!count) {
    return {
      selector,
      exists: false,
      visible: false,
      actionable: false,
      width: 0,
      height: 0,
      display: null,
      visibility: null,
      opacity: null,
      text: "",
    };
  }

  await locator.scrollIntoViewIfNeeded().catch(() => undefined);
  const visible = await locator.isVisible();
  const state = await locator.evaluate((element) => {
    const style = window.getComputedStyle(element);
    const rect = element.getBoundingClientRect();
    const x = Math.min(window.innerWidth - 1, Math.max(0, rect.left + Math.min(rect.width / 2, 20)));
    const y = Math.min(window.innerHeight - 1, Math.max(0, rect.top + Math.min(rect.height / 2, 20)));
    const topElement = document.elementFromPoint(x, y);
    const actionable =
      style.display !== "none" &&
      style.visibility !== "hidden" &&
      Number(style.opacity) > 0 &&
      rect.width > 0 &&
      rect.height > 0 &&
      Boolean(topElement && (element.contains(topElement) || topElement.contains(element)));

    return {
      width: Number(rect.width.toFixed(1)),
      height: Number(rect.height.toFixed(1)),
      display: style.display,
      visibility: style.visibility,
      opacity: style.opacity,
      actionable,
      text: (element.textContent ?? "").replace(/\s+/g, " ").trim().slice(0, 300),
    };
  });

  return { selector, exists: true, visible, ...state };
}

async function testInteractions(page, route, viewport) {
  const emergencyOption = page.locator('[data-conversion-option="emergency"]');
  const maintenanceOption = page.locator('[data-conversion-option="maintenance"]');
  const diagnosticOption = page.locator('[data-conversion-option="diagnostic"]');
  const initialCall = page.locator('[data-conversion-actions] a[href^="tel:"]');
  const initialCallHref = (await initialCall.count()) ? await initialCall.first().getAttribute("href") : null;

  await maintenanceOption.focus();
  await page.keyboard.press("Enter");
  const maintenanceSelected = (await maintenanceOption.getAttribute("aria-pressed")) === "true";
  const maintenanceActionVisible = await page
    .getByRole("heading", { name: "Organicemos una evaluación preventiva" })
    .isVisible();
  const contextualLink = page.locator('[data-conversion-actions] a[data-conversion-event="click_whatsapp"]');
  const contextualHref = await contextualLink.getAttribute("href");
  const contextualMessage = contextualHref ? new URL(contextualHref).searchParams.get("text") ?? "" : "";
  const messageLines = contextualMessage.split("\n").map((line) => line.trim()).filter(Boolean);
  const allowedPrefixes = ["Tipo de solicitud:", "Servicio:", "Comuna:", "Sector:", "URL:"];
  const messageUsesAllowedContext = messageLines.slice(1).every((line) =>
    allowedPrefixes.some((prefix) => line.startsWith(prefix)),
  );
  const messageHasProtectedUnknowns = /Dirección:|Precio:|Disponibilidad:|Tiempo de llegada:/.test(contextualMessage);

  await contextualLink.evaluate((element) => element.scrollIntoView({ block: "center", inline: "nearest" }));
  await page.waitForTimeout(150);
  const popupPromise = page.waitForEvent("popup", { timeout: 3_000 }).catch(() => null);
  await contextualLink.click();
  const popup = await popupPromise;
  if (popup) await popup.close().catch(() => undefined);

  const dataLayerEvents = await page.evaluate(() =>
    (window.dataLayer ?? []).map((entry) => String(entry.event ?? "")).filter(Boolean),
  );

  await diagnosticOption.focus();
  await page.keyboard.press("Space");
  const diagnosticSelected = (await diagnosticOption.getAttribute("aria-pressed")) === "true";
  const diagnosticActionVisible = await page
    .getByRole("heading", { name: "Revisemos la causa antes de intervenir" })
    .isVisible();

  const initialEvidenceCount = await page.locator("[data-evidence-item]").count();
  const evidenceToggle = page.locator("[data-evidence-toggle]");
  const evidenceToggleCount = await evidenceToggle.count();
  let expandedEvidenceCount = initialEvidenceCount;
  let galleryExpanded = null;
  let galleryCollapsed = null;
  if (evidenceToggleCount) {
    await evidenceToggle.click();
    expandedEvidenceCount = await page.locator("[data-evidence-item]").count();
    galleryExpanded = (await evidenceToggle.getAttribute("aria-expanded")) === "true";
    await evidenceToggle.click();
    galleryCollapsed = (await evidenceToggle.getAttribute("aria-expanded")) === "false";
  }

  await emergencyOption.click();

  return {
    keyboard: {
      maintenanceSelected,
      maintenanceActionVisible,
      diagnosticSelected,
      diagnosticActionVisible,
    },
    contextualAction: {
      clicked: dataLayerEvents.includes("click_whatsapp"),
      href: contextualHref,
      message: contextualMessage,
      messageUsesAllowedContext,
      messageHasProtectedUnknowns,
      urlPreserved: contextualMessage.includes(`URL: https://hidrourgencias.cl${route}`),
    },
    call: {
      presentForEmergency: initialCallHref === "tel:+56940918672",
    },
    events: {
      selectMaintenance: dataLayerEvents.includes("select_maintenance"),
      clickWhatsapp: dataLayerEvents.includes("click_whatsapp"),
    },
    gallery: {
      applicable: evidenceToggleCount > 0 || initialEvidenceCount > 0,
      initialEvidenceCount,
      evidenceToggleCount,
      expandedEvidenceCount,
      galleryExpanded,
      galleryCollapsed,
      initialMaximumSix: initialEvidenceCount <= 6,
      toggleOnlyWhenNeeded: expandedEvidenceCount > 6 ? evidenceToggleCount === 1 : evidenceToggleCount === 0,
    },
    mobileBarExpected: viewport.width < 1024,
  };
}

async function readPage(page, route, viewport, status, consoleErrors, failedRequests) {
  const title = await page.title();
  const description = await page.locator('meta[name="description"]').getAttribute("content");
  const canonical = await page.locator('link[rel="canonical"]').getAttribute("href");
  const robots = await page.locator('meta[name="robots"]').getAttribute("content");
  const h1 = await page.locator("h1").first().innerText();
  const classifier = page.getByRole("heading", { name: "Te orientamos hacia el recurso correcto" });
  const classifierCount = await classifier.count();
  const classifierBox = classifierCount ? await classifier.first().boundingBox() : null;
  const bodyMetrics = await page.locator("body").evaluate((body) => ({
    scrollHeight: body.scrollHeight,
    overflowX: Math.max(0, document.documentElement.scrollWidth - document.documentElement.clientWidth),
  }));
  const elementSelectors = {
    classifier: "[data-conversion-classifier]",
    selectedOption: '[data-conversion-option="emergency"][aria-pressed="true"]',
    contextualAction: "[data-conversion-actions]",
    contextualWhatsapp: '[data-conversion-actions] a[data-conversion-event="click_whatsapp"]',
    contextualCall: '[data-conversion-actions] a[href^="tel:"]',
    trustBand: "[data-conversion-trust]",
    mobileBar: "[data-conversion-mobile-bar]",
    evidenceGallery: "[data-evidence-gallery]",
    evidenceToggle: "[data-evidence-toggle]",
  };
  const elements = {};
  for (const [name, selector] of Object.entries(elementSelectors)) {
    elements[name] = await readElementState(page, selector);
  }
  const interactions = classifierCount ? await testInteractions(page, route, viewport) : null;
  const brokenImages = await page.locator("img").evaluateAll((images) =>
    images
      .filter((image) => image.complete && image.naturalWidth === 0)
      .map((image) => image.currentSrc || image.src),
  );
  const siteFailedRequests = failedRequests.filter((request) =>
    request.includes(baseUrl) || request.includes("/_next/") || request.includes("/images/") || request.includes("/galeria/"),
  );

  return {
    route,
    viewport: viewport.name,
    status,
    finalUrl: page.url(),
    title,
    description,
    canonical,
    robots,
    h1,
    schemaCount: await page.locator('script[type="application/ld+json"]').count(),
    classifierCount,
    classifierTop: classifierBox?.y ?? null,
    documentHeight: bodyMetrics.scrollHeight,
    classifierPageProgress:
      classifierBox && bodyMetrics.scrollHeight ? Number((classifierBox.y / bodyMetrics.scrollHeight).toFixed(3)) : null,
    selectedOptionCount: await page.locator('[aria-pressed="true"][data-conversion-option]').count(),
    trustBandCount: await page.getByRole("region", { name: "Prueba de confianza" }).count(),
    mobileBarCount: await page.getByRole("navigation", { name: "Contacto rápido" }).count(),
    evidenceCount: await page.locator("[data-evidence-item]").count(),
    evidenceToggleCount: await page.getByRole("button", { name: /Ver más trabajos|Mostrar menos trabajos/i }).count(),
    overflowX: bodyMetrics.overflowX,
    elements,
    interactions,
    brokenImages,
    consoleErrors,
    failedRequests,
    siteFailedRequests,
  };
}

async function captureDetailEvidence(browser) {
  const crops = [];
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 1,
    reducedMotion: "reduce",
  });
  await context.addInitScript(() => {
    window.sessionStorage.setItem("hidrourgencias_alerta_roja_2026", "dismissed");
  });
  const page = await context.newPage();

  async function captureViewportAround(selector, filename) {
    const locator = page.locator(selector).first();
    const pageY = await locator.evaluate((element) => element.getBoundingClientRect().top + window.scrollY);
    await page.evaluate((targetY) => window.scrollTo(0, Math.max(0, targetY - 110)), pageY);
    await page.waitForTimeout(150);
    await page.screenshot({
      path: path.join(outputDir, filename),
      fullPage: false,
      type: "jpeg",
      quality: 70,
      animations: "disabled",
    });
  }

  async function getPageBox(locator) {
    return locator.evaluate((element) => {
      const rect = element.getBoundingClientRect();
      return {
        x: rect.left + window.scrollX,
        y: rect.top + window.scrollY,
        width: rect.width,
        height: rect.height,
      };
    });
  }

  await page.goto(`${baseUrl}/?evidence=conversion`, { waitUntil: "networkidle", timeout: 60_000 });
  await closeAlert(page);

  await captureViewportAround("[data-conversion-classifier]", "classifier-visible.jpg");
  crops.push("classifier-visible.jpg");
  await page.locator("[data-conversion-trust]").first().screenshot({
    path: path.join(outputDir, "trust-band.jpg"),
    type: "jpeg",
    quality: 70,
  });
  crops.push("trust-band.jpg");
  await page.locator("[data-conversion-mobile-bar]").first().screenshot({
    path: path.join(outputDir, "mobile-commercial-bar.jpg"),
    type: "jpeg",
    quality: 70,
  });
  crops.push("mobile-commercial-bar.jpg");

  await page.locator('[data-conversion-option="maintenance"]').click();
  await page.locator('[data-conversion-option="maintenance"]').first().screenshot({
    path: path.join(outputDir, "selected-maintenance.jpg"),
    type: "jpeg",
    quality: 70,
  });
  crops.push("selected-maintenance.jpg");
  await captureViewportAround("[data-conversion-actions]", "contextual-whatsapp.jpg");
  crops.push("contextual-whatsapp.jpg");

  await page.evaluate(() => window.scrollTo(0, 0));
  await page.locator("[data-mobile-menu-toggle]").click();
  const drawerOverlay = await page.evaluate(() => {
    const topElement = document.elementFromPoint(window.innerWidth / 2, window.innerHeight - 20);
    return Boolean(topElement?.closest("[data-mobile-navigation]"));
  });
  const drawerFilename = "mobile-drawer-no-overlap.jpg";
  await page.screenshot({
    path: path.join(outputDir, drawerFilename),
    fullPage: false,
    type: "jpeg",
    quality: 70,
  });
  crops.push(drawerFilename);

  await page.goto(`${baseUrl}/destape-alcantarillado-vina-del-mar`, {
    waitUntil: "networkidle",
    timeout: 60_000,
  });
  await closeAlert(page);
  const gallery = page.locator("[data-evidence-gallery]");
  const closedCount = await page.locator("[data-evidence-item]").count();
  const closedFilename = "evidence-gallery-closed.jpg";
  await gallery.scrollIntoViewIfNeeded();
  await page.waitForTimeout(800);
  const closedBox = await getPageBox(gallery);
  await page.setViewportSize({ width: 390, height: 3_400 });
  await page.evaluate((targetY) => window.scrollTo(0, Math.max(0, targetY - 80)), closedBox.y);
  await page.screenshot({
    path: path.join(outputDir, closedFilename),
    fullPage: false,
    type: "jpeg",
    quality: 58,
  });
  crops.push(closedFilename);

  const galleryToggle = page.locator("[data-evidence-toggle]");
  await galleryToggle.click();
  const expandedCount = await page.locator("[data-evidence-item]").count();
  await gallery.scrollIntoViewIfNeeded();
  await page.waitForTimeout(800);
  const expandedBox = await getPageBox(gallery);
  const expandedFilename = "evidence-gallery-expanded.jpg";
  if (expandedBox) {
    await page.evaluate((targetY) => window.scrollTo(0, Math.max(0, targetY - 80)), expandedBox.y);
    await page.screenshot({
      path: path.join(outputDir, expandedFilename),
      fullPage: false,
      type: "jpeg",
      quality: 58,
    });
    crops.push(expandedFilename);
  }

  await context.close();
  return { crops, drawerOverlay, closedCount, expandedCount };
}

function escapeXml(value) {
  return value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");
}

async function createContactSheet() {
  const files = (await readdir(outputDir)).filter((file) => file.endsWith(".jpg")).sort();
  const tileWidth = 230;
  const tileHeight = 300;
  const labelHeight = 34;
  const gap = 12;
  const columns = 5;
  const rows = Math.ceil(files.length / columns);
  const width = columns * (tileWidth + gap) + gap;
  const height = rows * (tileHeight + labelHeight + gap) + gap;
  const composites = [];

  for (let index = 0; index < files.length; index += 1) {
    const file = files[index];
    const left = gap + (index % columns) * (tileWidth + gap);
    const top = gap + Math.floor(index / columns) * (tileHeight + labelHeight + gap);
    const tile = await sharp(path.join(outputDir, file), { limitInputPixels: false })
      .resize(tileWidth, tileHeight, { fit: "contain", background: "#ffffff" })
      .flatten({ background: "#ffffff" })
      .jpeg({ quality: 68 })
      .toBuffer();
    const label = escapeXml(file.length > 34 ? `${file.slice(0, 31)}...` : file);
    const labelSvg = Buffer.from(
      `<svg width="${tileWidth}" height="${labelHeight}" xmlns="http://www.w3.org/2000/svg"><rect width="100%" height="100%" fill="#08385f"/><text x="8" y="22" font-family="Arial" font-size="11" fill="#ffffff">${label}</text></svg>`,
    );
    composites.push({ input: tile, left, top });
    composites.push({ input: labelSvg, left, top: top + tileHeight });
  }

  const contactSheet = path.join(process.cwd(), "reports", "conversion-final-contact-sheet.jpg");
  await sharp({ create: { width, height, channels: 3, background: "#e8f3fb" } })
    .composite(composites)
    .jpeg({ quality: 82 })
    .toFile(contactSheet);
  return { contactSheet, images: files.length, width, height };
}

await mkdir(outputDir, { recursive: true });
const browser = await chromium.launch({
  headless: true,
  executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe",
  args: ["--disable-dev-shm-usage"],
});

const results = [];
let detailEvidence = null;
let captureCount = 0;

try {
  if (!detailsOnly) for (const viewport of viewports) {
    const context = await browser.newContext({
      viewport: { width: viewport.width, height: viewport.height },
      deviceScaleFactor: 1,
      reducedMotion: "reduce",
    });
    await context.addInitScript(() => {
      window.sessionStorage.setItem("hidrourgencias_alerta_roja_2026", "dismissed");
    });
    const page = await context.newPage();

    for (const route of routes) {
      const consoleErrors = [];
      const failedRequests = [];
      const onConsole = (message) => {
        if (message.type() === "error") consoleErrors.push(message.text());
      };
      const onRequestFailed = (request) => {
        failedRequests.push(`${request.method()} ${request.url()} ${request.failure()?.errorText ?? "failed"}`);
      };
      page.on("console", onConsole);
      page.on("requestfailed", onRequestFailed);

      const response = await page.goto(`${baseUrl}${route}`, { waitUntil: "networkidle", timeout: 60_000 });
      await closeAlert(page);
      await captureFullPage(page, path.join(outputDir, `${routeName(route)}-${viewport.name}.jpg`));
      captureCount += 1;
      if (!screenshotsOnly) {
        results.push(
          await readPage(page, route, viewport, response?.status() ?? 0, consoleErrors, failedRequests),
        );
      }

      page.off("console", onConsole);
      page.off("requestfailed", onRequestFailed);
    }

    await context.close();
  }
  if (stage === "after") {
    detailEvidence = await captureDetailEvidence(browser);
  }
} finally {
  await browser.close();
}

const browserReport = { generatedAt: new Date().toISOString(), baseUrl, stage, routes, viewports, results, detailEvidence };
if (!detailsOnly && !screenshotsOnly) {
  await writeFile(
    outputFile,
    `${JSON.stringify(browserReport, null, 2)}\n`,
  );
}

let requiredReports = null;
if (stage === "after" && !detailsOnly && !screenshotsOnly) {
  const baselinePath = path.join(process.cwd(), "reports", "conversion-browser-baseline.json");
  const beforeRepairPath = path.join(process.cwd(), "reports", "conversion-browser-before-repair.json");
  const baseline = JSON.parse(await readFile(baselinePath, "utf8"));
  const beforeRepair = JSON.parse(await readFile(beforeRepairPath, "utf8"));
  const rows = [];

  for (const result of results) {
    const screenshot = `reports/conversion-visual/after/${routeName(result.route)}-${result.viewport}.jpg`;
    const baselineResult = baseline.results.find(
      (entry) => entry.route === result.route && entry.viewport === result.viewport,
    );
    const beforeResult = beforeRepair.results.find(
      (entry) => entry.route === result.route && entry.viewport === result.viewport,
    );
    const elementRows = [
      {
        name: "Clasificador de necesidad",
        state: result.elements.classifier,
        interaction: result.interactions?.keyboard.maintenanceSelected && result.interactions?.keyboard.diagnosticSelected,
        difference:
          result.route === "/"
            ? `No existía en baseline y antes de reparar estaba al ${Math.round((beforeResult?.classifierPageProgress ?? 0) * 100)}% del documento; ahora está al ${Math.round(result.classifierPageProgress * 100)}%.`
            : "No existía en baseline; ahora ofrece selección persistente por mouse y teclado.",
      },
      {
        name: "Opción seleccionada",
        state: result.elements.selectedOption,
        interaction: result.interactions?.keyboard.maintenanceSelected && result.interactions?.keyboard.diagnosticSelected,
        difference: "Antes eran tres enlaces independientes sin aria-pressed; ahora existe estado seleccionado visible.",
      },
      {
        name: "Acción contextual",
        state: result.elements.contextualAction,
        interaction:
          result.interactions?.contextualAction.clicked &&
          result.interactions?.contextualAction.messageUsesAllowedContext &&
          !result.interactions?.contextualAction.messageHasProtectedUnknowns &&
          result.interactions?.contextualAction.urlPreserved,
        difference: "Antes cada tarjeta abría un mensaje fijo; ahora una acción compartida cambia según la necesidad.",
      },
      {
        name: "WhatsApp contextual",
        state: result.elements.contextualWhatsapp,
        interaction: result.interactions?.events.clickWhatsapp && result.interactions?.contextualAction.urlPreserved,
        difference: "El mensaje ahora usa solo tipo, servicio, comuna, sector disponible y URL.",
      },
      {
        name: "Llamada de urgencia",
        state: result.elements.contextualCall,
        interaction: result.interactions?.call.presentForEmergency,
        difference: "La llamada queda asociada visualmente a la alternativa de emergencia.",
      },
      {
        name: "Banda de confianza",
        state: result.elements.trustBand,
        interaction: true,
        difference: "Mantiene señales técnicas existentes y añade acceso verificable a opiniones de Google sin cifras nuevas.",
      },
      {
        name: "Barra comercial móvil",
        state: result.elements.mobileBar,
        expectedVisible: Number(result.viewport) < 1024,
        interaction: Number(result.viewport) < 1024 ? result.elements.mobileBar.actionable : !result.elements.mobileBar.visible,
        difference: "Reserva espacio inferior real y permanece debajo del drawer por orden de capas.",
      },
      {
        name: "Galería de evidencias",
        state: result.elements.evidenceGallery,
        applicable: result.interactions?.gallery.applicable,
        interaction: result.interactions?.gallery.applicable
          ? result.interactions.gallery.initialMaximumSix &&
            result.interactions.gallery.galleryExpanded &&
            result.interactions.gallery.galleryCollapsed &&
            result.interactions.gallery.toggleOnlyWhenNeeded
          : true,
        difference: result.interactions?.gallery.applicable
          ? "Conserva seis evidencias iniciales, amplía a todas y ya no repite CTA por imagen."
          : "La ruta no contiene una galería extensa; no se añadió evidencia duplicada.",
      },
    ];

    for (const element of elementRows) {
      const applicable = element.applicable ?? true;
      const expectedVisible = element.expectedVisible ?? applicable;
      const visiblePass = expectedVisible ? element.state.visible && element.state.width > 0 && element.state.height > 0 : !element.state.visible;
      rows.push({
        route: result.route,
        viewport: Number(result.viewport),
        element: element.name,
        selector: element.state.selector,
        applicable,
        expectedVisible,
        visible: element.state.visible,
        interactionApproved: Boolean(element.interaction),
        computed: {
          width: element.state.width,
          height: element.state.height,
          display: element.state.display,
          visibility: element.state.visibility,
          opacity: element.state.opacity,
          actionable: element.state.actionable,
          contentPresent: Boolean(element.state.text),
        },
        screenshot,
        differenceFromBaseline: element.difference,
        pass: visiblePass && Boolean(element.interaction),
        baselineSelectorCount: baselineResult?.classifierCount ?? 0,
      });
    }
  }

  const visualMatrix = {
    generatedAt: new Date().toISOString(),
    baselineCommit: "b5cd48b4e10212b27c9845875d6609cc17b25ec1",
    implementationCommitAudited: "ba261c4fe17ddbe9043f3840dbbf7e6241dc4e0e",
    reportsCommitAudited: "5b58d2e47b72a6042c0246ea8e4c22fbd870e1de",
    captures: results.length,
    rows,
    pass: rows.every((row) => row.pass),
  };
  const visibleElements = {
    generatedAt: new Date().toISOString(),
    routes,
    viewports,
    fullPageCaptures: results.length,
    detailEvidence,
    assertions: {
      http200: results.every((result) => result.status === 200),
      classifierVisible: results.every((result) => result.elements.classifier.visible),
      selectedStateVisible: results.every((result) => result.elements.selectedOption.visible),
      contextualActionWorks: results.every(
        (result) => result.interactions?.contextualAction.clicked && result.interactions?.contextualAction.urlPreserved,
      ),
      allowedWhatsappContextOnly: results.every(
        (result) =>
          result.interactions?.contextualAction.messageUsesAllowedContext &&
          !result.interactions?.contextualAction.messageHasProtectedUnknowns,
      ),
      trustBandVisible: results.every((result) => result.elements.trustBand.visible),
      mobileBarResponsive: results.every((result) =>
        Number(result.viewport) < 1024 ? result.elements.mobileBar.visible : !result.elements.mobileBar.visible,
      ),
      galleryControlsWork: results.every(
        (result) =>
          !result.interactions?.gallery.applicable ||
          (result.interactions.gallery.initialMaximumSix &&
            result.interactions.gallery.galleryExpanded &&
            result.interactions.gallery.galleryCollapsed),
      ),
      zeroOverflow: results.every((result) => result.overflowX === 0),
      zeroConsoleErrors: results.every((result) => result.consoleErrors.length === 0),
      zeroBrokenImages: results.every((result) => result.brokenImages.length === 0),
      zeroSiteRequestFailures: results.every((result) => result.siteFailedRequests.length === 0),
      drawerCoversCommercialBar: detailEvidence?.drawerOverlay === true,
    },
    results,
  };

  await writeFile(
    path.join(process.cwd(), "reports", "conversion-visual-route-matrix.json"),
    `${JSON.stringify(visualMatrix, null, 2)}\n`,
  );
  await writeFile(
    path.join(process.cwd(), "reports", "conversion-visible-elements.json"),
    `${JSON.stringify(visibleElements, null, 2)}\n`,
  );
  const contactSheet = await createContactSheet();
  requiredReports = { visualMatrix: visualMatrix.pass, visibleElements: visibleElements.assertions, contactSheet };
}
if (detailsOnly || screenshotsOnly) {
  requiredReports = { detailEvidence, contactSheet: await createContactSheet() };
}

console.log(
  JSON.stringify({
    stage,
    captures: screenshotsOnly ? captureCount : results.length,
    statuses: [...new Set(results.map((result) => result.status))],
    consoleErrors: results.reduce((total, result) => total + result.consoleErrors.length, 0),
    failedRequests: results.reduce((total, result) => total + result.failedRequests.length, 0),
    requiredReports,
  }),
);
