import Script from "next/script";

import { emergencyAlertModalConfig } from "@/lib/emergency-alert-config";

const hostId = "hu-emergency-alert-host";

const emergencyAlertModalScript = `
(function () {
  var host = document.getElementById("${hostId}");
  if (!host || window.__huEmergencyAlertModalLoaded) {
    return;
  }

  window.__huEmergencyAlertModalLoaded = true;

  var config;
  try {
    config = JSON.parse(host.getAttribute("data-alert-config") || "{}");
  } catch (error) {
    return;
  }

  if (!config.enabled || !config.sessionStorageKey) {
    return;
  }

  var overlayId = "hu-emergency-alert-overlay";
  var modalId = "hu-emergency-alert-modal";
  var titleId = "hu-emergency-alert-title";
  var descriptionId = "hu-emergency-alert-description";
  var styleId = "hu-emergency-alert-style";
  var previousActiveElement = null;
  var previousBodyOverflow = "";
  var previousBodyPaddingRight = "";
  var modalIsOpen = false;
  var lastPath = window.location.pathname;

  function getPathname() {
    return (window.location.pathname || "/").replace(/\\/+$/, "") || "/";
  }

  function isExcludedPath(pathname) {
    var path = pathname.toLowerCase();
    var exactPaths = config.excludedExactPaths || [];
    var prefixes = config.excludedPathPrefixes || [];

    for (var exactIndex = 0; exactIndex < exactPaths.length; exactIndex += 1) {
      if (path === String(exactPaths[exactIndex]).toLowerCase()) {
        return true;
      }
    }

    for (var prefixIndex = 0; prefixIndex < prefixes.length; prefixIndex += 1) {
      var prefix = String(prefixes[prefixIndex]).toLowerCase().replace(/\\/+$/, "");
      if (prefix && (path === prefix || path.indexOf(prefix + "/") === 0)) {
        return true;
      }
    }

    return false;
  }

  function hasBeenDismissed() {
    try {
      return window.sessionStorage.getItem(config.sessionStorageKey) === "dismissed";
    } catch (error) {
      return false;
    }
  }

  function markDismissed() {
    try {
      window.sessionStorage.setItem(config.sessionStorageKey, "dismissed");
    } catch (error) {
      // sessionStorage can be unavailable in private or restricted browser contexts.
    }
  }

  function createElement(tagName, className, textContent) {
    var element = document.createElement(tagName);
    if (className) {
      element.className = className;
    }
    if (typeof textContent === "string") {
      element.textContent = textContent;
    }
    return element;
  }

  function ensureStyles() {
    if (document.getElementById(styleId)) {
      return;
    }

    var colors = config.colors || {};
    var style = document.createElement("style");
    style.id = styleId;
    style.textContent = [
      ".hu-emergency-alert-overlay{position:fixed;inset:0;z-index:2147483000;display:flex;align-items:center;justify-content:center;box-sizing:border-box;padding:24px;background:" + colors.overlay + ";opacity:0;visibility:hidden;transition:opacity 240ms ease,visibility 240ms ease;}",
      ".hu-emergency-alert-overlay[hidden]{display:none;}",
      ".hu-emergency-alert-overlay[data-open='true']{opacity:1;visibility:visible;}",
      ".hu-emergency-alert-panel{position:relative;box-sizing:border-box;width:min(92vw,600px);max-height:min(86vh,760px);overflow:hidden;border:1px solid " + colors.modalBorder + ";border-top:6px solid " + colors.emergencyRed + ";border-radius:18px;background:" + colors.modalBackground + ";color:" + colors.white + ";box-shadow:0 30px 80px -34px rgba(0,0,0,.88),0 0 0 1px rgba(255,255,255,.06);opacity:0;transform:translateY(12px) scale(.98);transition:opacity 260ms ease,transform 260ms ease;}",
      ".hu-emergency-alert-overlay[data-open='true'] .hu-emergency-alert-panel{opacity:1;transform:translateY(0) scale(1);}",
      ".hu-emergency-alert-scroll{box-sizing:border-box;max-height:calc(min(86vh,760px) - 6px);overflow-y:auto;padding:30px 26px 24px;scrollbar-color:" + colors.corporateBlue + " rgba(255,255,255,.12);}",
      ".hu-emergency-alert-close{position:absolute;right:14px;top:14px;z-index:2;display:inline-flex;width:40px;height:40px;align-items:center;justify-content:center;border:1px solid rgba(248,251,255,.3);border-radius:8px;background:rgba(255,255,255,.08);color:" + colors.white + ";font:800 18px/1 Arial,sans-serif;cursor:pointer;transition:background 160ms ease,border-color 160ms ease,color 160ms ease;}",
      ".hu-emergency-alert-close:hover{background:rgba(255,255,255,.14);border-color:" + colors.lightBlue + ";}",
      ".hu-emergency-alert-title{margin:12px 46px 18px 0;color:" + colors.emergencyRed + ";font-family:var(--font-rajdhani),var(--font-manrope),'Segoe UI',sans-serif;font-size:1.7rem;line-height:1.05;font-weight:900;letter-spacing:0;text-wrap:balance;overflow-wrap:anywhere;}",
      ".hu-emergency-alert-copy{display:grid;gap:14px;color:" + colors.mutedText + ";font:600 1rem/1.65 var(--font-manrope),'Segoe UI',sans-serif;}",
      ".hu-emergency-alert-copy p{margin:0;}",
      ".hu-emergency-alert-warning{border:1px solid rgba(255,255,255,.18);border-left:5px solid " + colors.emergencyRed + ";border-radius:8px;background:" + colors.emergencyRedDark + ";padding:13px 14px;color:" + colors.white + ";font-weight:900;}",
      ".hu-emergency-alert-company{margin-top:4px;color:" + colors.white + ";font-size:1.08rem;font-weight:900;}",
      ".hu-emergency-alert-closing{display:block;margin-top:2px;border-radius:8px;background:" + colors.corporateBlue + ";padding:10px 14px;color:" + colors.white + ";font-weight:900;text-align:center;}",
      ".hu-emergency-alert-actions{display:flex;justify-content:flex-end;margin-top:22px;}",
      ".hu-emergency-alert-confirm{min-height:46px;border:0;border-radius:8px;background:" + colors.corporateBlue + ";padding:12px 22px;color:" + colors.white + ";font:900 .95rem/1 var(--font-manrope),'Segoe UI',sans-serif;cursor:pointer;box-shadow:0 16px 36px -24px rgba(0,174,239,.9);transition:background 160ms ease,transform 160ms ease,box-shadow 160ms ease;}",
      ".hu-emergency-alert-confirm:hover{background:" + colors.corporateBlueHover + ";transform:translateY(-1px);box-shadow:0 20px 40px -24px rgba(0,174,239,1);}",
      ".hu-emergency-alert-close:focus-visible,.hu-emergency-alert-confirm:focus-visible,.hu-emergency-alert-panel:focus-visible{outline:3px solid " + colors.lightBlue + ";outline-offset:3px;}",
      "@media (min-width:640px){.hu-emergency-alert-overlay{padding:32px;}.hu-emergency-alert-scroll{padding:34px 34px 28px;}.hu-emergency-alert-title{font-size:2.25rem;}.hu-emergency-alert-copy{font-size:1.04rem;}}",
      "@media (max-width:420px){.hu-emergency-alert-overlay{align-items:flex-start;padding:14px;padding-top:24px;}.hu-emergency-alert-panel{width:100%;max-height:calc(100vh - 48px);border-radius:14px;}.hu-emergency-alert-scroll{max-height:calc(100vh - 54px);padding:24px 18px 20px;}.hu-emergency-alert-title{margin-right:42px;font-size:1.45rem;}.hu-emergency-alert-actions{justify-content:stretch;}.hu-emergency-alert-confirm{width:100%;}}",
      "@media (prefers-reduced-motion:reduce){.hu-emergency-alert-overlay,.hu-emergency-alert-panel,.hu-emergency-alert-close,.hu-emergency-alert-confirm{transition:none;}.hu-emergency-alert-panel{transform:none;}.hu-emergency-alert-confirm:hover{transform:none;}}"
    ].join("");

    document.head.appendChild(style);
  }

  function getFocusableElements(panel) {
    var selectors = [
      "a[href]",
      "button:not([disabled])",
      "textarea:not([disabled])",
      "input:not([disabled])",
      "select:not([disabled])",
      "[tabindex]:not([tabindex='-1'])"
    ].join(",");

    return Array.prototype.slice.call(panel.querySelectorAll(selectors)).filter(function (element) {
      return element.offsetParent !== null;
    });
  }

  function setBackgroundScroll(isLocked) {
    if (isLocked) {
      var scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
      previousBodyOverflow = document.body.style.overflow;
      previousBodyPaddingRight = document.body.style.paddingRight;
      document.body.style.overflow = "hidden";
      if (scrollbarWidth > 0) {
        document.body.style.paddingRight = scrollbarWidth + "px";
      }
      return;
    }

    document.body.style.overflow = previousBodyOverflow;
    document.body.style.paddingRight = previousBodyPaddingRight;
  }

  function closeModal(options) {
    var shouldPersist = !options || options.persist !== false;
    var shouldRestoreFocus = !options || options.restoreFocus !== false;
    var overlay = document.getElementById(overlayId);

    if (shouldPersist) {
      markDismissed();
    }

    if (!overlay || !modalIsOpen) {
      return;
    }

    modalIsOpen = false;
    overlay.setAttribute("data-open", "false");
    document.removeEventListener("keydown", handleDocumentKeydown);
    setBackgroundScroll(false);

    window.setTimeout(function () {
      if (overlay.parentNode) {
        overlay.parentNode.removeChild(overlay);
      }
    }, window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 0 : 260);

    if (shouldRestoreFocus && previousActiveElement && typeof previousActiveElement.focus === "function") {
      previousActiveElement.focus({ preventScroll: true });
    }
  }

  function handleDocumentKeydown(event) {
    var panel = document.getElementById(modalId);

    if (event.key === "Escape") {
      event.preventDefault();
      closeModal({ persist: true });
      return;
    }

    if (event.key !== "Tab" || !panel) {
      return;
    }

    var focusableElements = getFocusableElements(panel);
    if (!focusableElements.length) {
      event.preventDefault();
      panel.focus();
      return;
    }

    var firstElement = focusableElements[0];
    var lastElement = focusableElements[focusableElements.length - 1];

    if (!panel.contains(document.activeElement)) {
      event.preventDefault();
      (event.shiftKey ? lastElement : firstElement).focus();
    } else if (event.shiftKey && document.activeElement === firstElement) {
      event.preventDefault();
      lastElement.focus();
    } else if (!event.shiftKey && document.activeElement === lastElement) {
      event.preventDefault();
      firstElement.focus();
    }
  }

  function buildModal() {
    var content = config.content || {};
    var overlay = createElement("div", "hu-emergency-alert-overlay");
    var panel = createElement("section", "hu-emergency-alert-panel");
    var scrollArea = createElement("div", "hu-emergency-alert-scroll");
    var closeButton = createElement("button", "hu-emergency-alert-close", "X");
    var title = createElement("h2", "hu-emergency-alert-title", content.title || "");
    var description = createElement("div", "hu-emergency-alert-copy");
    var warning = createElement("p", "hu-emergency-alert-warning", content.warningText || "");
    var company = createElement("p", "hu-emergency-alert-company", content.companyName || "");
    var closing = createElement("span", "hu-emergency-alert-closing", content.closingText || "");
    var actions = createElement("div", "hu-emergency-alert-actions");
    var confirmButton = createElement("button", "hu-emergency-alert-confirm", content.confirmLabel || "Entendido");
    var paragraphs = content.paragraphs || [];

    overlay.id = overlayId;
    overlay.hidden = true;
    overlay.setAttribute("data-open", "false");

    panel.id = modalId;
    panel.setAttribute("role", "dialog");
    panel.setAttribute("aria-modal", "true");
    panel.setAttribute("aria-labelledby", titleId);
    panel.setAttribute("aria-describedby", descriptionId);
    panel.tabIndex = -1;

    closeButton.type = "button";
    closeButton.setAttribute("aria-label", content.closeLabel || "Cerrar comunicado");
    closeButton.addEventListener("click", function () {
      closeModal({ persist: true });
    });

    title.id = titleId;
    description.id = descriptionId;

    if (paragraphs[0]) {
      description.appendChild(createElement("p", "", paragraphs[0]));
    }
    if (content.warningText) {
      description.appendChild(warning);
    }
    for (var index = 1; index < paragraphs.length; index += 1) {
      description.appendChild(createElement("p", "", paragraphs[index]));
    }
    if (content.companyName) {
      description.appendChild(company);
    }
    if (content.closingText) {
      description.appendChild(closing);
    }

    confirmButton.type = "button";
    confirmButton.addEventListener("click", function () {
      closeModal({ persist: true });
    });

    actions.appendChild(confirmButton);
    scrollArea.appendChild(title);
    scrollArea.appendChild(description);
    scrollArea.appendChild(actions);
    panel.appendChild(closeButton);
    panel.appendChild(scrollArea);
    overlay.appendChild(panel);
    overlay.addEventListener("click", function (event) {
      if (event.target === overlay) {
        closeModal({ persist: true });
      }
    });

    return overlay;
  }

  function shouldShowModal() {
    return !hasBeenDismissed() && !isExcludedPath(getPathname());
  }

  function openModal() {
    if (!shouldShowModal() || modalIsOpen) {
      return;
    }

    ensureStyles();

    var overlay = document.getElementById(overlayId) || buildModal();

    if (!overlay.parentNode) {
      document.body.appendChild(overlay);
    }

    function focusInitialElement() {
      var currentPanel = document.getElementById(modalId);
      var currentCloseButton = document.querySelector(".hu-emergency-alert-close");
      var focusTarget = currentCloseButton || currentPanel;

      if (!modalIsOpen || !focusTarget || typeof focusTarget.focus !== "function") {
        return;
      }

      focusTarget.focus({ preventScroll: true });
    }

    previousActiveElement = document.activeElement;
    setBackgroundScroll(true);
    modalIsOpen = true;
    overlay.hidden = false;
    document.addEventListener("keydown", handleDocumentKeydown);

    window.requestAnimationFrame(function () {
      overlay.setAttribute("data-open", "true");
      focusInitialElement();
    });

    window.setTimeout(focusInitialElement, 80);
    window.setTimeout(focusInitialElement, 180);
  }

  function handlePathChange() {
    var currentPath = window.location.pathname;
    if (currentPath === lastPath) {
      return;
    }
    lastPath = currentPath;

    if (isExcludedPath(getPathname())) {
      closeModal({ persist: false, restoreFocus: false });
      return;
    }

    openModal();
  }

  function patchHistoryMethod(methodName) {
    var originalMethod = window.history[methodName];
    if (typeof originalMethod !== "function") {
      return;
    }

    window.history[methodName] = function () {
      var result = originalMethod.apply(this, arguments);
      window.setTimeout(handlePathChange, 0);
      return result;
    };
  }

  patchHistoryMethod("pushState");
  patchHistoryMethod("replaceState");
  window.addEventListener("popstate", handlePathChange);

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", openModal, { once: true });
  } else {
    openModal();
  }
})();
`;

export function EmergencyAlertModal() {
  if (!emergencyAlertModalConfig.enabled) {
    return null;
  }

  const serializedConfig = JSON.stringify(emergencyAlertModalConfig).replace(/</g, "\\u003c");

  return (
    <>
      <div id={hostId} data-alert-config={serializedConfig} hidden />
      <Script
        id="hu-emergency-alert-script"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{ __html: emergencyAlertModalScript }}
      />
    </>
  );
}
