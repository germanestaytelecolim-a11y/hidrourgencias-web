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
  var termsDialogId = "hu-emergency-alert-terms";
  var previousActiveElement = null;
  var previousTermsTrigger = null;
  var previousBodyOverflow = "";
  var previousBodyPaddingRight = "";
  var previousHtmlOverscroll = "";
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

  function trackEmergencyEvent(eventName, extraPayload) {
    var payload = { event: eventName, page_path: window.location.pathname };
    if (extraPayload) {
      Object.keys(extraPayload).forEach(function (key) {
        payload[key] = extraPayload[key];
      });
    }
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push(payload);
    if (typeof window.gtag === "function") {
      window.gtag("event", eventName, Object.assign({ page_path: window.location.pathname }, extraPayload || {}));
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

  function createFieldError(fieldId) {
    var error = createElement("p", "hu-emergency-alert-error");
    error.id = fieldId + "-error";
    error.setAttribute("aria-live", "polite");
    error.setAttribute("role", "alert");
    return error;
  }

  function appendRequiredMarker(label) {
    var marker = createElement("span", "hu-emergency-alert-required", " *");
    marker.setAttribute("aria-hidden", "true");
    label.appendChild(marker);
  }

  function createTextField(options) {
    var wrapper = createElement("div", "hu-emergency-alert-field");
    var label = createElement("label", "", options.label);
    var input = document.createElement(options.multiline ? "textarea" : "input");
    var error = createFieldError(options.id);

    label.setAttribute("for", options.id);
    appendRequiredMarker(label);
    input.id = options.id;
    input.name = options.name;
    input.required = true;
    input.setAttribute("aria-describedby", error.id);
    input.setAttribute("autocomplete", options.autocomplete || "off");
    input.setAttribute("placeholder", options.placeholder || "");
    input.setAttribute("data-emergency-field", options.name);
    if (!options.multiline) {
      input.type = "text";
    } else {
      input.rows = 3;
    }

    wrapper.appendChild(label);
    wrapper.appendChild(input);
    wrapper.appendChild(error);
    return wrapper;
  }

  function createSelectField(options) {
    var wrapper = createElement("div", "hu-emergency-alert-field");
    var label = createElement("label", "", options.label);
    var select = document.createElement("select");
    var placeholder = createElement("option", "", options.placeholder || "Selecciona una alternativa");
    var error = createFieldError(options.id);

    label.setAttribute("for", options.id);
    appendRequiredMarker(label);
    select.id = options.id;
    select.name = options.name;
    select.required = true;
    select.setAttribute("aria-describedby", error.id);
    select.setAttribute("data-emergency-field", options.name);
    placeholder.value = "";
    placeholder.disabled = true;
    placeholder.selected = true;
    select.appendChild(placeholder);
    (options.items || []).forEach(function (item) {
      var option = createElement("option", "", item);
      option.value = item;
      select.appendChild(option);
    });

    wrapper.appendChild(label);
    wrapper.appendChild(select);
    wrapper.appendChild(error);
    return wrapper;
  }

  function createEvidenceField() {
    var wrapper = createElement("fieldset", "hu-emergency-alert-field hu-emergency-alert-evidence");
    var legend = createElement("legend", "", "Fotografías o videos");
    var help = createElement(
      "p",
      "hu-emergency-alert-help",
      "Al abrir WhatsApp podrás adjuntar fotografías o videos del problema para facilitar la evaluación técnica."
    );
    var yesLabel = createElement("label", "hu-emergency-alert-radio");
    var yesInput = document.createElement("input");
    var noLabel = createElement("label", "hu-emergency-alert-radio");
    var noInput = document.createElement("input");
    var error = createFieldError("hu-emergency-evidence");

    appendRequiredMarker(legend);
    yesInput.type = "radio";
    yesInput.name = "evidence";
    yesInput.value = "Sí, adjuntaré fotografías o videos en este chat.";
    yesInput.required = true;
    yesInput.setAttribute("aria-describedby", error.id);
    yesInput.setAttribute("data-emergency-field", "evidence");
    noInput.type = "radio";
    noInput.name = "evidence";
    noInput.value = "No dispongo de fotografías o videos por ahora.";
    noInput.required = true;
    noInput.setAttribute("aria-describedby", error.id);
    noInput.setAttribute("data-emergency-field", "evidence");

    yesLabel.appendChild(yesInput);
    yesLabel.appendChild(document.createTextNode("Sí, tengo fotografías o videos para adjuntar"));
    noLabel.appendChild(noInput);
    noLabel.appendChild(document.createTextNode("No dispongo de evidencia por ahora"));
    wrapper.appendChild(legend);
    wrapper.appendChild(help);
    wrapper.appendChild(yesLabel);
    wrapper.appendChild(noLabel);
    wrapper.appendChild(error);
    return wrapper;
  }

  function createTermsField() {
    var wrapper = createElement("div", "hu-emergency-alert-field hu-emergency-alert-terms-field");
    var label = createElement("label", "hu-emergency-alert-checkbox");
    var input = document.createElement("input");
    var text = createElement("span", "");
    var termsButton = createElement("button", "hu-emergency-alert-terms-link", "Términos y condiciones");
    var error = createFieldError("hu-emergency-terms");

    input.type = "checkbox";
    input.id = "hu-emergency-terms";
    input.name = "terms";
    input.required = true;
    input.setAttribute("aria-describedby", error.id);
    input.setAttribute("data-emergency-field", "terms");
    termsButton.type = "button";
    termsButton.addEventListener("click", function () {
      openTermsDialog(termsButton);
    });
    text.appendChild(document.createTextNode("Acepto los "));
    text.appendChild(termsButton);
    text.appendChild(document.createTextNode(" del servicio."));
    appendRequiredMarker(text);
    label.appendChild(input);
    label.appendChild(text);
    wrapper.appendChild(label);
    wrapper.appendChild(error);
    return wrapper;
  }

  function getFormValue(form, fieldName) {
    var field = form.elements[fieldName];
    if (!field) {
      return "";
    }
    if (field instanceof RadioNodeList) {
      return String(field.value || "").trim();
    }
    return String(field.value || "").trim();
  }

  function setFieldError(form, fieldName, message) {
    var field = form.elements[fieldName];
    var element = field instanceof RadioNodeList ? field[0] : field;
    var error = document.getElementById("hu-emergency-" + fieldName + "-error");
    if (!element || !error) {
      return;
    }
    element.setAttribute("aria-invalid", message ? "true" : "false");
    error.textContent = message || "";
  }

  function setRadioGroupError(form, fieldName, message) {
    var field = form.elements[fieldName];
    var error = document.getElementById("hu-emergency-" + fieldName + "-error");
    if (!field || !error) {
      return;
    }
    Array.prototype.slice.call(field).forEach(function (input) {
      input.setAttribute("aria-invalid", message ? "true" : "false");
    });
    error.textContent = message || "";
  }

  function buildEmergencyMessage(values) {
    return [
      "Hola Hidrourgencias, necesito solicitar atención por una urgencia sanitaria.",
      "",
      "Nombre: " + values.name,
      "Dirección: " + values.address,
      "Comuna: " + values.commune,
      "Tipo de propiedad: " + values.propertyType,
      "Tipo de urgencia: " + values.emergencyType,
      "",
      "Descripción del problema:",
      values.description,
      "",
      "Evidencia:",
      values.evidence,
      "",
      values.termsAccepted ? "He aceptado los términos y condiciones del servicio." : "",
      values.termsAccepted ? "" : "",
      "Solicito evaluación de disponibilidad para asistencia técnica."
    ].filter(function (line, index, lines) {
      return line !== "" || lines[index - 1] !== "";
    }).join("\\n");
  }

  function createWhatsAppHref(message) {
    var base = (config.contact && config.contact.whatsappHrefBase) || "";
    if (base.indexOf("?text=") >= 0) {
      return base.replace(/text=.*/, "text=" + encodeURIComponent(message));
    }
    return (config.contact && config.contact.whatsappHref) || "#";
  }

  function validateEmergencyForm(form) {
    var values = {
      name: getFormValue(form, "name"),
      address: getFormValue(form, "address"),
      commune: getFormValue(form, "commune"),
      propertyType: getFormValue(form, "propertyType"),
      emergencyType: getFormValue(form, "emergencyType"),
      description: getFormValue(form, "description"),
      evidence: getFormValue(form, "evidence"),
      termsAccepted: !!(form.elements.terms && form.elements.terms.checked)
    };
    var errors = {
      name: values.name ? "" : "Ingresa tu nombre y apellido.",
      address: values.address ? "" : "Ingresa la dirección de la emergencia.",
      commune: values.commune ? "" : "Selecciona una comuna.",
      propertyType: values.propertyType ? "" : "Selecciona el tipo de propiedad.",
      emergencyType: values.emergencyType ? "" : "Selecciona el tipo de urgencia.",
      description: values.description ? "" : "Describe brevemente el problema.",
      evidence: values.evidence ? "" : "Indica si dispones de fotografías o videos.",
      terms: values.termsAccepted ? "" : "Debes aceptar los términos y condiciones."
    };
    var firstInvalid = null;

    Object.keys(errors).forEach(function (fieldName) {
      if (fieldName === "evidence") {
        setRadioGroupError(form, fieldName, errors[fieldName]);
      } else {
        setFieldError(form, fieldName, errors[fieldName]);
      }
      if (errors[fieldName] && !firstInvalid) {
        firstInvalid = fieldName === "evidence" ? form.elements[fieldName][0] : form.elements[fieldName];
      }
    });

    if (firstInvalid && typeof firstInvalid.focus === "function") {
      firstInvalid.focus({ preventScroll: false });
      firstInvalid.scrollIntoView({ block: "center", behavior: "smooth" });
      return null;
    }

    return values;
  }

  function closeTermsDialog() {
    var termsDialog = document.getElementById(termsDialogId);
    if (!termsDialog || termsDialog.hidden) {
      return false;
    }

    termsDialog.hidden = true;
    termsDialog.setAttribute("data-open", "false");
    if (previousTermsTrigger && typeof previousTermsTrigger.focus === "function") {
      previousTermsTrigger.focus({ preventScroll: true });
    }
    previousTermsTrigger = null;
    return true;
  }

  function openTermsDialog(trigger) {
    var termsDialog = document.getElementById(termsDialogId);
    if (!termsDialog) {
      return;
    }
    previousTermsTrigger = trigger || document.activeElement;
    termsDialog.hidden = false;
    termsDialog.setAttribute("data-open", "true");
    trackEmergencyEvent("emergency_terms_open");
    var closeButton = termsDialog.querySelector(".hu-emergency-alert-terms-close");
    if (closeButton && typeof closeButton.focus === "function") {
      closeButton.focus({ preventScroll: true });
    }
  }

  function createTermsDialog() {
    var legal = config.legal || {};
    var terms = legal.terms || [];
    var dialog = createElement("section", "hu-emergency-alert-terms-dialog");
    var panel = createElement("div", "hu-emergency-alert-terms-panel");
    var title = createElement("h3", "hu-emergency-alert-terms-title", "Términos y condiciones del servicio");
    var summary = createElement("p", "hu-emergency-alert-terms-summary", legal.summary || "");
    var content = createElement("div", "hu-emergency-alert-terms-content");
    var closeButton = createElement("button", "hu-emergency-alert-terms-close", "Volver al formulario");

    dialog.id = termsDialogId;
    dialog.hidden = true;
    dialog.setAttribute("data-open", "false");
    dialog.setAttribute("role", "dialog");
    dialog.setAttribute("aria-modal", "true");
    dialog.setAttribute("aria-labelledby", "hu-emergency-terms-title");
    title.id = "hu-emergency-terms-title";
    closeButton.type = "button";
    closeButton.addEventListener("click", closeTermsDialog);
    terms.forEach(function (term) {
      content.appendChild(createElement("p", "", term));
    });
    panel.appendChild(title);
    panel.appendChild(summary);
    panel.appendChild(content);
    panel.appendChild(closeButton);
    dialog.appendChild(panel);
    return dialog;
  }

  function ensureStyles() {
    if (document.getElementById(styleId)) {
      return;
    }

    var colors = config.colors || {};
    var style = document.createElement("style");
    style.id = styleId;
    style.textContent = [
      ".hu-emergency-alert-overlay{position:fixed;inset:0;z-index:2147483000;box-sizing:border-box;display:flex;align-items:center;justify-content:center;width:100vw;min-height:100vh;min-height:100dvh;padding:calc(16px + env(safe-area-inset-top)) 16px calc(16px + env(safe-area-inset-bottom));overflow:hidden;background:" + colors.overlay + ";opacity:0;visibility:hidden;transition:opacity 180ms ease,visibility 180ms ease;}",
      ".hu-emergency-alert-overlay[hidden]{display:none;}",
      ".hu-emergency-alert-overlay[data-open='true']{opacity:1;visibility:visible;}",
      ".hu-emergency-alert-panel{position:relative;box-sizing:border-box;width:min(100%,900px);max-height:calc(100vh - 32px - env(safe-area-inset-top) - env(safe-area-inset-bottom));max-height:calc(100dvh - 32px - env(safe-area-inset-top) - env(safe-area-inset-bottom));overflow:hidden;border:1px solid " + colors.modalBorder + ";border-radius:22px;background:radial-gradient(circle at 16% 0%,rgba(14,116,165,.42),transparent 34%),linear-gradient(145deg,#04111f 0%," + colors.modalBackground + " 56%,#020617 100%);color:" + colors.white + ";box-shadow:0 34px 90px -42px rgba(0,0,0,.92),0 0 0 1px rgba(255,255,255,.05);opacity:0;transform:translateY(10px);transition:opacity 200ms ease,transform 200ms ease;}",
      ".hu-emergency-alert-overlay[data-open='true'] .hu-emergency-alert-panel{opacity:1;transform:translateY(0);}",
      ".hu-emergency-alert-scroll{box-sizing:border-box;max-height:inherit;overflow-y:auto;padding:18px 16px 16px;scrollbar-color:" + colors.corporateBlue + " rgba(255,255,255,.12);}",
      ".hu-emergency-alert-close{position:absolute;right:12px;top:12px;z-index:3;display:inline-flex;width:48px;height:48px;align-items:center;justify-content:center;border:1px solid rgba(248,251,255,.5);border-radius:999px;background:rgba(255,255,255,.14);color:" + colors.white + ";font:900 21px/1 Arial,sans-serif;cursor:pointer;box-shadow:0 14px 34px -24px rgba(0,0,0,.85);transition:background 160ms ease,border-color 160ms ease,color 160ms ease,transform 160ms ease;}",
      ".hu-emergency-alert-close:hover{background:rgba(255,255,255,.22);border-color:" + colors.lightBlue + ";transform:translateY(-1px);}",
      ".hu-emergency-alert-logoWrap{display:flex;justify-content:center;padding-right:38px;}",
      ".hu-emergency-alert-logo{display:block;width:min(150px,44vw);height:auto;max-height:70px;object-fit:contain;border-radius:14px;background:rgba(255,255,255,.96);padding:7px;box-shadow:0 18px 40px -28px rgba(0,0,0,.78);}",
      ".hu-emergency-alert-eyebrow{margin:14px auto 7px;width:max-content;max-width:100%;border:1px solid rgba(240,68,68,.45);border-radius:999px;background:" + colors.emergencyRedDark + ";padding:6px 11px;color:#fecaca;font:900 10px/1 var(--font-manrope),'Segoe UI',sans-serif;letter-spacing:.13em;text-transform:uppercase;}",
      ".hu-emergency-alert-title{margin:0 auto;color:" + colors.white + ";font-family:var(--font-rajdhani),var(--font-manrope),'Segoe UI',sans-serif;font-size:clamp(1.65rem,5.6vw,3rem);line-height:.96;font-weight:900;letter-spacing:0;text-align:center;text-wrap:balance;overflow-wrap:anywhere;}",
      ".hu-emergency-alert-intro{margin:10px auto 0;max-width:760px;color:" + colors.mutedText + ";font:800 clamp(.9rem,2.8vw,1.08rem)/1.42 var(--font-manrope),'Segoe UI',sans-serif;text-align:center;text-wrap:balance;}",
      ".hu-emergency-alert-nonurgent{box-sizing:border-box;margin:14px auto 0;max-width:800px;border:1px solid rgba(125,211,252,.28);border-radius:16px;background:rgba(255,255,255,.08);padding:12px;color:" + colors.white + ";}",
      ".hu-emergency-alert-nonurgent h3{margin:0;color:" + colors.white + ";font:900 .98rem/1.2 var(--font-manrope),'Segoe UI',sans-serif;}",
      ".hu-emergency-alert-nonurgent p{margin:5px 0 0;color:" + colors.mutedText + ";font:750 .82rem/1.4 var(--font-manrope),'Segoe UI',sans-serif;}",
      ".hu-emergency-alert-nonurgent button{margin-top:9px;display:inline-flex;min-height:42px;align-items:center;justify-content:center;border:1px solid rgba(125,211,252,.36);border-radius:12px;background:rgba(255,255,255,.95);padding:10px 14px;color:#06344f;font:900 .86rem/1.1 var(--font-manrope),'Segoe UI',sans-serif;cursor:pointer;transition:background 160ms ease,border-color 160ms ease,transform 160ms ease;}",
      ".hu-emergency-alert-nonurgent button:hover{border-color:" + colors.lightBlue + ";background:#fff;transform:translateY(-1px);}",
      ".hu-emergency-alert-form{box-sizing:border-box;margin:16px auto 0;max-width:800px;border:1px solid rgba(125,211,252,.22);border-left:5px solid " + colors.emergencyRed + ";border-radius:18px;background:" + colors.cardBackground + ";padding:14px;color:" + colors.white + ";}",
      ".hu-emergency-alert-required-note{margin:0 0 8px;color:" + colors.white + ";font:900 .8rem/1.2 var(--font-manrope),'Segoe UI',sans-serif;}",
      ".hu-emergency-alert-required{color:#fecaca;font-weight:900;}",
      ".hu-emergency-alert-form-note{margin:0 0 12px;color:" + colors.mutedText + ";font:750 .88rem/1.45 var(--font-manrope),'Segoe UI',sans-serif;}",
      ".hu-emergency-alert-form-grid{display:grid;gap:10px;}",
      ".hu-emergency-alert-field{display:grid;gap:5px;}",
      ".hu-emergency-alert-field label,.hu-emergency-alert-field legend{color:" + colors.white + ";font:900 .82rem/1.2 var(--font-manrope),'Segoe UI',sans-serif;}",
      ".hu-emergency-alert-field input[type='text'],.hu-emergency-alert-field select,.hu-emergency-alert-field textarea{box-sizing:border-box;width:100%;min-height:46px;border:1px solid rgba(180,220,245,.35);border-radius:12px;background:rgba(255,255,255,.96);padding:10px 12px;color:#071525;font:800 16px/1.25 var(--font-manrope),'Segoe UI',sans-serif;outline:none;}",
      ".hu-emergency-alert-field textarea{min-height:78px;resize:vertical;line-height:1.4;}",
      ".hu-emergency-alert-field input:focus,.hu-emergency-alert-field select:focus,.hu-emergency-alert-field textarea:focus{border-color:" + colors.lightBlue + ";box-shadow:0 0 0 3px rgba(125,211,252,.24);}",
      ".hu-emergency-alert-field [aria-invalid='true']{border-color:#fb7185;box-shadow:0 0 0 3px rgba(251,113,133,.22);}",
      ".hu-emergency-alert-error{min-height:1rem;margin:0;color:#fecaca;font:800 .76rem/1.25 var(--font-manrope),'Segoe UI',sans-serif;}",
      ".hu-emergency-alert-help{margin:0;color:" + colors.mutedText + ";font:700 .78rem/1.35 var(--font-manrope),'Segoe UI',sans-serif;}",
      ".hu-emergency-alert-radio{display:flex;min-height:38px;align-items:center;gap:8px;border:1px solid rgba(125,211,252,.18);border-radius:12px;background:rgba(255,255,255,.06);padding:8px 10px;color:" + colors.white + ";font:800 .8rem/1.25 var(--font-manrope),'Segoe UI',sans-serif;}",
      ".hu-emergency-alert-radio input{width:18px;height:18px;accent-color:" + colors.whatsappGreen + ";}",
      ".hu-emergency-alert-checkbox{display:flex;align-items:flex-start;gap:10px;border:1px solid rgba(125,211,252,.2);border-radius:12px;background:rgba(255,255,255,.07);padding:10px;color:" + colors.white + ";font:800 .82rem/1.35 var(--font-manrope),'Segoe UI',sans-serif;}",
      ".hu-emergency-alert-checkbox input{margin-top:2px;width:19px;height:19px;flex:none;accent-color:" + colors.whatsappGreen + ";}",
      ".hu-emergency-alert-terms-link{display:inline;border:0;background:transparent;padding:0;color:" + colors.lightBlue + ";font:inherit;font-weight:900;text-decoration:underline;text-underline-offset:3px;cursor:pointer;}",
      ".hu-emergency-alert-terms-dialog{position:absolute;inset:10px;z-index:5;display:flex;align-items:center;justify-content:center;border-radius:18px;background:rgba(2,6,23,.82);padding:10px;}",
      ".hu-emergency-alert-terms-dialog[hidden]{display:none;}",
      ".hu-emergency-alert-terms-panel{box-sizing:border-box;width:min(100%,720px);max-height:100%;overflow:auto;border:1px solid rgba(125,211,252,.28);border-radius:18px;background:#f8fbff;padding:18px;color:#0f172a;box-shadow:0 24px 70px -34px rgba(0,0,0,.8);}",
      ".hu-emergency-alert-terms-title{margin:0;color:#061827;font:900 1.2rem/1.2 var(--font-manrope),'Segoe UI',sans-serif;}",
      ".hu-emergency-alert-terms-summary{margin:8px 0 0;color:#334155;font:800 .9rem/1.5 var(--font-manrope),'Segoe UI',sans-serif;}",
      ".hu-emergency-alert-terms-content{margin-top:12px;display:grid;gap:10px;color:#334155;font:650 .82rem/1.48 var(--font-manrope),'Segoe UI',sans-serif;}",
      ".hu-emergency-alert-terms-close{margin-top:14px;min-height:44px;border:1px solid rgba(14,116,165,.35);border-radius:12px;background:#0b74a5;padding:10px 14px;color:#fff;font:900 .88rem/1 var(--font-manrope),'Segoe UI',sans-serif;cursor:pointer;}",
      ".hu-emergency-alert-actions{display:grid;gap:10px;margin:14px auto 0;max-width:800px;}",
      ".hu-emergency-alert-primary,.hu-emergency-alert-secondary,.hu-emergency-alert-continue{box-sizing:border-box;display:inline-flex;min-height:48px;align-items:center;justify-content:center;border-radius:14px;padding:14px 18px;font:900 1rem/1.1 var(--font-manrope),'Segoe UI',sans-serif;text-align:center;text-decoration:none;cursor:pointer;transition:background 160ms ease,border-color 160ms ease,transform 160ms ease,box-shadow 160ms ease;}",
      ".hu-emergency-alert-primary{border:1px solid rgba(255,255,255,.14);background:" + colors.whatsappGreen + ";color:#fff;box-shadow:0 18px 42px -28px rgba(6,194,134,.9);}",
      ".hu-emergency-alert-primary:hover{background:" + colors.whatsappGreenHover + ";transform:translateY(-1px);}",
      ".hu-emergency-alert-secondary{border:1px solid rgba(125,211,252,.35);background:" + colors.corporateBlue + ";color:#fff;box-shadow:0 18px 42px -30px rgba(14,116,165,.95);}",
      ".hu-emergency-alert-secondary:hover{background:" + colors.corporateBlueHover + ";transform:translateY(-1px);}",
      ".hu-emergency-alert-continue{min-height:44px;border:0;background:transparent;color:" + colors.lightBlue + ";text-decoration:underline;text-underline-offset:4px;}",
      ".hu-emergency-alert-continue:hover{color:#fff;background:rgba(255,255,255,.06);}",
      ".hu-emergency-alert-footer{margin:10px auto 0;max-width:760px;color:" + colors.subduedText + ";font:800 .72rem/1.35 var(--font-manrope),'Segoe UI',sans-serif;text-align:center;}",
      ".hu-emergency-alert-close:focus-visible,.hu-emergency-alert-primary:focus-visible,.hu-emergency-alert-secondary:focus-visible,.hu-emergency-alert-continue:focus-visible,.hu-emergency-alert-panel:focus-visible,.hu-emergency-alert-nonurgent button:focus-visible,.hu-emergency-alert-terms-link:focus-visible,.hu-emergency-alert-checkbox input:focus-visible,.hu-emergency-alert-radio input:focus-visible,.hu-emergency-alert-terms-close:focus-visible{outline:3px solid " + colors.lightBlue + ";outline-offset:3px;}",
      "@media (min-width:700px){.hu-emergency-alert-overlay{padding:calc(24px + env(safe-area-inset-top)) 24px calc(24px + env(safe-area-inset-bottom));}.hu-emergency-alert-scroll{padding:24px 42px 26px;}.hu-emergency-alert-form-grid{grid-template-columns:1fr 1fr;}.hu-emergency-alert-field--wide,.hu-emergency-alert-evidence{grid-column:1/-1;}.hu-emergency-alert-actions{grid-template-columns:1.1fr .8fr;}.hu-emergency-alert-continue{grid-column:1/-1;justify-self:center;padding-left:24px;padding-right:24px;}.hu-emergency-alert-logoWrap{padding-right:0;}}",
      "@media (max-width:430px){.hu-emergency-alert-overlay{align-items:flex-start;padding:calc(8px + env(safe-area-inset-top)) 10px calc(8px + env(safe-area-inset-bottom));}.hu-emergency-alert-panel{max-height:calc(100vh - 16px - env(safe-area-inset-top) - env(safe-area-inset-bottom));max-height:calc(100dvh - 16px - env(safe-area-inset-top) - env(safe-area-inset-bottom));border-radius:18px;}.hu-emergency-alert-scroll{padding:12px 10px 12px;}.hu-emergency-alert-close{right:8px;top:8px;width:48px;height:48px;}.hu-emergency-alert-logoWrap{justify-content:flex-start;padding-right:52px;}.hu-emergency-alert-logo{width:100px;max-height:46px;padding:5px;border-radius:10px;}.hu-emergency-alert-eyebrow{margin-top:8px;margin-bottom:5px;padding:5px 9px;font-size:8.5px;}.hu-emergency-alert-title{text-align:left;font-size:1.45rem;line-height:.94;}.hu-emergency-alert-intro{text-align:left;margin-top:7px;font-size:.72rem;line-height:1.25;}.hu-emergency-alert-nonurgent{margin-top:9px;padding:9px;border-radius:12px;}.hu-emergency-alert-nonurgent h3{font-size:.82rem;}.hu-emergency-alert-nonurgent p{font-size:.68rem;line-height:1.25;}.hu-emergency-alert-nonurgent button{min-height:38px;width:100%;font-size:.76rem;padding:8px 9px;}.hu-emergency-alert-form{margin-top:9px;padding:9px;border-radius:13px;}.hu-emergency-alert-required-note{margin-bottom:6px;font-size:.7rem;}.hu-emergency-alert-form-note{margin-bottom:8px;font-size:.68rem;line-height:1.25;}.hu-emergency-alert-form-grid{gap:5px;}.hu-emergency-alert-field{gap:2px;}.hu-emergency-alert-field label,.hu-emergency-alert-field legend{font-size:.68rem;}.hu-emergency-alert-field input[type='text'],.hu-emergency-alert-field select,.hu-emergency-alert-field textarea{min-height:36px;border-radius:9px;padding:6px 8px;font-size:16px;}.hu-emergency-alert-field textarea{min-height:52px;}.hu-emergency-alert-error{min-height:.74rem;font-size:.61rem;}.hu-emergency-alert-help{font-size:.62rem;}.hu-emergency-alert-radio{min-height:29px;border-radius:9px;padding:5px 7px;font-size:.62rem;}.hu-emergency-alert-radio input{width:16px;height:16px;}.hu-emergency-alert-checkbox{padding:7px;font-size:.64rem;}.hu-emergency-alert-actions{margin-top:9px;gap:6px;}.hu-emergency-alert-primary,.hu-emergency-alert-secondary{min-height:38px;border-radius:10px;padding:8px 10px;font-size:.8rem;}.hu-emergency-alert-continue{min-height:30px;padding:5px 7px;font-size:.72rem;}.hu-emergency-alert-terms-dialog{inset:6px;padding:6px;}.hu-emergency-alert-terms-panel{border-radius:14px;padding:12px;}.hu-emergency-alert-terms-content{font-size:.72rem;line-height:1.42;}.hu-emergency-alert-footer{display:none;}}",
      "@media (prefers-reduced-motion:reduce){.hu-emergency-alert-overlay,.hu-emergency-alert-panel,.hu-emergency-alert-close,.hu-emergency-alert-primary,.hu-emergency-alert-secondary,.hu-emergency-alert-continue{transition:none;}.hu-emergency-alert-panel{transform:none;}.hu-emergency-alert-primary:hover,.hu-emergency-alert-secondary:hover{transform:none;}}"
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
      previousHtmlOverscroll = document.documentElement.style.overscrollBehavior;
      document.body.style.overflow = "hidden";
      document.documentElement.style.overscrollBehavior = "contain";
      if (scrollbarWidth > 0) {
        document.body.style.paddingRight = scrollbarWidth + "px";
      }
      return;
    }

    document.body.style.overflow = previousBodyOverflow;
    document.body.style.paddingRight = previousBodyPaddingRight;
    document.documentElement.style.overscrollBehavior = previousHtmlOverscroll;
  }

  function closeModal(options) {
    var shouldPersist = !options || options.persist !== false;
    var shouldRestoreFocus = !options || options.restoreFocus !== false;
    var eventName = options && options.eventName;
    var overlay = document.getElementById(overlayId);

    if (shouldPersist) {
      markDismissed();
    }

    if (eventName) {
      trackEmergencyEvent(eventName);
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
    }, window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 0 : 200);

    if (shouldRestoreFocus && previousActiveElement && typeof previousActiveElement.focus === "function") {
      previousActiveElement.focus({ preventScroll: true });
    }
  }

  function handleDocumentKeydown(event) {
    var panel = document.getElementById(modalId);
    var termsDialog = document.getElementById(termsDialogId);
    var activePanel = termsDialog && !termsDialog.hidden ? termsDialog : panel;

    if (event.key === "Escape") {
      event.preventDefault();
      if (closeTermsDialog()) {
        return;
      }
      closeModal({ persist: true, eventName: "emergency_modal_close" });
      return;
    }

    if (event.key !== "Tab" || !activePanel) {
      return;
    }

    var focusableElements = getFocusableElements(activePanel);
    if (!focusableElements.length) {
      event.preventDefault();
      activePanel.focus();
      return;
    }

    var firstElement = focusableElements[0];
    var lastElement = focusableElements[focusableElements.length - 1];

    if (!activePanel.contains(document.activeElement)) {
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
    var contact = config.contact || {};
    var overlay = createElement("div", "hu-emergency-alert-overlay");
    var panel = createElement("section", "hu-emergency-alert-panel");
    var scrollArea = createElement("div", "hu-emergency-alert-scroll");
    var closeButton = createElement("button", "hu-emergency-alert-close", "X");
    var logoWrap = createElement("div", "hu-emergency-alert-logoWrap");
    var logo = document.createElement("img");
    var eyebrow = createElement("p", "hu-emergency-alert-eyebrow", content.eyebrow || "");
    var title = createElement("h2", "hu-emergency-alert-title", content.title || "");
    var intro = createElement("p", "hu-emergency-alert-intro", content.intro || "");
    var nonUrgent = createElement("section", "hu-emergency-alert-nonurgent");
    var nonUrgentTitle = createElement("h3", "", "¿No es una urgencia?");
    var nonUrgentText = createElement("p", "", "Cotiza servicios, mantenciones o solicita información directamente en el sitio.");
    var nonUrgentButton = createElement("button", "", "Cotizar o solicitar información");
    var form = createElement("form", "hu-emergency-alert-form");
    var requiredNote = createElement("p", "hu-emergency-alert-required-note", "* Campos obligatorios");
    var formNote = createElement("p", "hu-emergency-alert-form-note", content.guidanceText || "");
    var formGrid = createElement("div", "hu-emergency-alert-form-grid");
    var actions = createElement("div", "hu-emergency-alert-actions");
    var whatsappLink = createElement("a", "hu-emergency-alert-primary", content.whatsappLabel || "Enviar urgencia por WhatsApp");
    var callLink = createElement("a", "hu-emergency-alert-secondary", content.callLabel || "Llamar ahora");
    var continueButton = createElement("button", "hu-emergency-alert-continue", "Ir al sitio");
    var footer = createElement("p", "hu-emergency-alert-footer", content.footerText || "");
    var termsDialog = createTermsDialog();

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
    closeButton.setAttribute("aria-label", content.closeLabel || "Cerrar atención prioritaria");
    closeButton.addEventListener("click", function () {
      closeModal({ persist: true, eventName: "emergency_modal_close" });
    });

    logo.src = content.logoSrc || "/images/logo-hidrourgencias.webp";
    logo.alt = content.logoAlt || "Hidrourgencias SpA";
    logo.className = "hu-emergency-alert-logo";
    logo.width = 240;
    logo.height = 120;
    logo.decoding = "async";
    logo.loading = "eager";
    logoWrap.appendChild(logo);

    title.id = titleId;
    intro.id = descriptionId;
    nonUrgentButton.type = "button";
    nonUrgentButton.addEventListener("click", function () {
      closeModal({ persist: true, eventName: "emergency_continue_site" });
    });
    nonUrgent.appendChild(nonUrgentTitle);
    nonUrgent.appendChild(nonUrgentText);
    nonUrgent.appendChild(nonUrgentButton);

    form.noValidate = true;
    form.addEventListener("submit", function (event) {
      event.preventDefault();
      whatsappLink.click();
    });
    form.appendChild(requiredNote);
    form.appendChild(formNote);
    formGrid.appendChild(createTextField({
      id: "hu-emergency-name",
      name: "name",
      label: "Nombre y apellido",
      placeholder: "Ej: Nombre y apellido",
      autocomplete: "name"
    }));
    formGrid.appendChild(createTextField({
      id: "hu-emergency-address",
      name: "address",
      label: "Dirección",
      placeholder: "Ej: 1 Norte 1234",
      autocomplete: "street-address"
    }));
    formGrid.appendChild(createSelectField({
      id: "hu-emergency-commune",
      name: "commune",
      label: "Comuna",
      placeholder: "Selecciona comuna",
      items: ["Viña del Mar", "Valparaíso", "Concón", "Quilpué", "Villa Alemana", "Limache", "Quillota", "Casablanca", "Puchuncaví", "Quintero", "Placilla", "Curauma", "Maitencillo", "Otra"]
    }));
    formGrid.appendChild(createSelectField({
      id: "hu-emergency-propertyType",
      name: "propertyType",
      label: "Tipo de propiedad",
      placeholder: "Selecciona tipo de propiedad",
      items: ["Casa", "Departamento", "Edificio / Condominio", "Local comercial / Restaurante", "Empresa / Institución", "Otro"]
    }));
    formGrid.appendChild(createSelectField({
      id: "hu-emergency-emergencyType",
      name: "emergencyType",
      label: "¿Qué tipo de urgencia presenta?",
      placeholder: "Selecciona una alternativa",
      items: ["Rebalse de alcantarillado", "Retorno de aguas servidas", "Cámara de alcantarillado colapsada o sin escurrimiento", "WC o artefacto sanitario rebalsando", "Desagüe completamente obstruido", "Inundación asociada a alcantarillado o desagüe", "Vertical sanitaria de edificio obstruida", "Otra obstrucción sanitaria crítica"]
    })).classList.add("hu-emergency-alert-field--wide");
    formGrid.appendChild(createTextField({
      id: "hu-emergency-description",
      name: "description",
      label: "Descripción del problema",
      placeholder: "Cuéntanos brevemente qué está ocurriendo y desde cuándo.",
      multiline: true
    })).classList.add("hu-emergency-alert-field--wide");
    formGrid.appendChild(createEvidenceField());
    formGrid.appendChild(createTermsField());
    form.appendChild(formGrid);

    whatsappLink.href = contact.whatsappHref || "#";
    whatsappLink.textContent = content.whatsappLabel || "Enviar urgencia por WhatsApp";
    whatsappLink.target = "_blank";
    whatsappLink.rel = "noopener noreferrer";
    whatsappLink.setAttribute("aria-label", content.whatsappLabel || "Enviar urgencia por WhatsApp");
    whatsappLink.setAttribute("data-emergency-action", "whatsapp");
    whatsappLink.addEventListener("click", function (event) {
      var values = validateEmergencyForm(form);
      if (!values) {
        event.preventDefault();
        return;
      }
      event.preventDefault();
      var whatsappHref = createWhatsAppHref(buildEmergencyMessage(values));
      trackEmergencyEvent("emergency_whatsapp_click", {
        commune: values.commune,
        property_type: values.propertyType,
        emergency_type: values.emergencyType
      });
      markDismissed();
      window.open(whatsappHref, "_blank", "noopener,noreferrer");
    });

    callLink.href = contact.phoneHref || "tel:";
    callLink.textContent = content.callLabel || "Llamar ahora";
    callLink.setAttribute("aria-label", content.callLabel || "Llamar ahora");
    callLink.setAttribute("data-emergency-action", "call");
    callLink.addEventListener("click", function () {
      trackEmergencyEvent("emergency_call_click");
      markDismissed();
    });

    continueButton.type = "button";
    continueButton.addEventListener("click", function () {
      closeModal({ persist: true, eventName: "emergency_continue_site" });
    });

    actions.appendChild(whatsappLink);
    actions.appendChild(callLink);
    actions.appendChild(continueButton);
    scrollArea.appendChild(logoWrap);
    scrollArea.appendChild(eyebrow);
    scrollArea.appendChild(title);
    scrollArea.appendChild(intro);
    scrollArea.appendChild(nonUrgent);
    scrollArea.appendChild(form);
    scrollArea.appendChild(actions);
    scrollArea.appendChild(footer);
    panel.appendChild(closeButton);
    panel.appendChild(scrollArea);
    panel.appendChild(termsDialog);
    overlay.appendChild(panel);

    return overlay;
  }

  function shouldShowModal() {
    return !hasBeenDismissed() && !isExcludedPath(getPathname());
  }

  function openModal(manual) {
    var requested = manual === true;
    if (isExcludedPath(getPathname()) || modalIsOpen || (!requested && (getPathname() === "/" || !shouldShowModal()))) {
      return;
    }

    ensureStyles();

    var overlay = document.getElementById(overlayId) || buildModal();

    if (!overlay.parentNode) {
      document.body.appendChild(overlay);
    }

    function focusInitialElement() {
      var firstAction = document.querySelector("[data-emergency-field='name']");
      var currentPanel = document.getElementById(modalId);
      var focusTarget = firstAction || currentPanel;

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
  }

  function handlePathChange() {
    var currentPath = window.location.pathname;
    if (currentPath === lastPath) {
      return;
    }
    lastPath = currentPath;

    if (getPathname() === "/" || isExcludedPath(getPathname())) {
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
  window.addEventListener("hu:open-emergency-form", function () { openModal(true); });

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
