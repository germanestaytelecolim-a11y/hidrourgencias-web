/* eslint-disable @typescript-eslint/no-require-imports */
const { existsSync, mkdirSync, readFileSync, writeFileSync } = require("node:fs");
const { join } = require("node:path");

const projectRoot = process.cwd();
const baseUrl = process.env.LANDING_BASE_URL || "http://127.0.0.1:3100";
const mode = process.argv.includes("--full") ? "full" : "pilot";
const playwrightModule = process.env.PLAYWRIGHT_MODULE_PATH || "playwright";
const browserExecutable = process.env.PLAYWRIGHT_EXECUTABLE_PATH;
const { chromium } = require(playwrightModule);

const viewportDefinitions = [
  { name: "mobile", width: 390, height: 844 },
  { name: "tablet", width: 768, height: 1024 },
  { name: "desktop", width: 1440, height: 1000 },
];

const pilotPaths = new Set([
  "/zona/renaca-vina-del-mar",
  "/zona/cerro-alegre-valparaiso",
  "/zona/bosques-de-montemar-concon",
  "/servicios/destape-alcantarillado",
  "/servicios/analisis-tecnico-propiedad-redes-sanitarias",
  "/servicios/limpieza-higienizacion-sanitizacion",
]);

function getRoutePaths() {
  const baselinePath = join(projectRoot, "reports", "landing-visual-baseline.json");
  if (!existsSync(baselinePath)) {
    throw new Error(`Falta la linea base: ${baselinePath}`);
  }

  const baseline = JSON.parse(readFileSync(baselinePath, "utf8"));
  const paths = baseline.routes.map((route) => new URL(route.url).pathname);
  return mode === "pilot" ? paths.filter((path) => pilotPaths.has(path)) : paths;
}

function countRedirects(request) {
  let redirects = 0;
  let current = request.redirectedFrom();
  while (current) {
    redirects += 1;
    current = current.redirectedFrom();
  }
  return redirects;
}

async function main() {
  const routePaths = getRoutePaths();
  const outputDirectory = join(projectRoot, "reports", "landing-screenshots", mode);
  mkdirSync(outputDirectory, { recursive: true });

  const browser = await chromium.launch({
    headless: true,
    ...(browserExecutable ? { executablePath: browserExecutable } : {}),
  });
  const results = [];

  try {
    for (const viewport of viewportDefinitions) {
      const context = await browser.newContext({
        viewport: { width: viewport.width, height: viewport.height },
        deviceScaleFactor: 1,
        reducedMotion: "reduce",
      });

      await context.addInitScript(() => {
        sessionStorage.setItem("hidrourgencias_alerta_roja_2026", "dismissed");
        window.__landingVitals = { cls: 0, lcp: 0 };
        new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            if (!entry.hadRecentInput) window.__landingVitals.cls += entry.value;
          }
        }).observe({ type: "layout-shift", buffered: true });
        new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const last = entries[entries.length - 1];
          if (last) window.__landingVitals.lcp = last.startTime;
        }).observe({ type: "largest-contentful-paint", buffered: true });
      });

      for (const routePath of routePaths) {
        const page = await context.newPage();
        const consoleErrors = [];
        const pageErrors = [];
        const failedRequests = [];

        page.on("console", (message) => {
          if (message.type() === "error") consoleErrors.push(message.text());
        });
        page.on("pageerror", (error) => pageErrors.push(error.message));
        page.on("requestfailed", (request) => {
          failedRequests.push(`${request.method()} ${request.url()} ${request.failure()?.errorText || ""}`.trim());
        });

        const response = await page.goto(new URL(routePath, baseUrl).toString(), {
          waitUntil: "networkidle",
          timeout: 45_000,
        });
        await page.locator(".landing-visual-hero img").waitFor({ state: "visible", timeout: 15_000 });
        await page.waitForTimeout(500);

        const pageState = await page.evaluate(() => {
          const hero = document.querySelector(".landing-visual-hero");
          const image = hero?.querySelector("img");
          const h1Values = Array.from(document.querySelectorAll("main h1"), (node) => node.textContent?.trim() || "");
          const heroLinks = Array.from(hero?.querySelectorAll("a") || [], (link) => ({
            text: link.textContent?.replace(/\s+/g, " ").trim() || "",
            href: link.getAttribute("href"),
          }));
          const nav = performance.getEntriesByType("navigation")[0];
          const heroRect = hero?.getBoundingClientRect();
          const imageRect = image?.getBoundingClientRect();

          return {
            title: document.title,
            h1Values,
            documentWidth: document.documentElement.scrollWidth,
            viewportWidth: document.documentElement.clientWidth,
            horizontalOverflow: document.documentElement.scrollWidth > document.documentElement.clientWidth + 1,
            hero: heroRect ? { top: heroRect.top, width: heroRect.width, height: heroRect.height } : null,
            image: image && imageRect
              ? {
                  src: image.getAttribute("src"),
                  alt: image.getAttribute("alt"),
                  complete: image.complete,
                  naturalWidth: image.naturalWidth,
                  naturalHeight: image.naturalHeight,
                  renderedWidth: imageRect.width,
                  renderedHeight: imageRect.height,
                }
              : null,
            heroLinks,
            vitals: {
              cls: window.__landingVitals?.cls || 0,
              lcp: window.__landingVitals?.lcp || 0,
              domContentLoaded: nav?.domContentLoadedEventEnd || 0,
              load: nav?.loadEventEnd || 0,
            },
          };
        });

        const screenshotName = `${routePath.slice(1).replaceAll("/", "--")}--${viewport.name}.jpg`;
        await page.screenshot({
          path: join(outputDirectory, screenshotName),
          type: "jpeg",
          quality: 76,
          fullPage: true,
        });

        results.push({
          routePath,
          viewport,
          status: response?.status() ?? null,
          finalUrl: page.url(),
          redirectCount: response ? countRedirects(response.request()) : null,
          ...pageState,
          consoleErrors,
          pageErrors,
          failedRequests,
          screenshot: `reports/landing-screenshots/${mode}/${screenshotName}`,
        });

        await page.close();
        process.stdout.write(".");
      }

      await context.close();
    }
  } finally {
    await browser.close();
  }

  const failures = results.filter((result) =>
    result.status !== 200 ||
    result.redirectCount !== 0 ||
    result.h1Values.length !== 1 ||
    result.horizontalOverflow ||
    !result.image?.complete ||
    !result.image?.naturalWidth ||
    !result.image?.alt ||
    result.heroLinks.length === 0 ||
    result.consoleErrors.length > 0 ||
    result.pageErrors.length > 0 ||
    result.failedRequests.length > 0,
  );

  const outputPath = join(projectRoot, "reports", `landing-visual-${mode}.json`);
  writeFileSync(
    outputPath,
    `${JSON.stringify({
      auditedAt: new Date().toISOString(),
      baseUrl,
      mode,
      routeCount: routePaths.length,
      viewportCount: viewportDefinitions.length,
      checkCount: results.length,
      failureCount: failures.length,
      failures,
      results,
    }, null, 2)}\n`,
  );

  process.stdout.write("\n");
  console.log(`Auditoria ${mode}: ${results.length} combinaciones, ${failures.length} fallos.`);
  console.log(`Informe: ${outputPath}`);
  if (failures.length > 0) process.exitCode = 1;
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
