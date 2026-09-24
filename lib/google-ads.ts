export const GOOGLE_ADS_WHATSAPP_CONVERSION = "AW-16486513262/XiXQCLq93-MZEO70sLU9";

const WHATSAPP_REDIRECT_FALLBACK_MS = 800;

type GoogleAdsEventCallback = () => void;

export type GoogleAdsGtag = (
  command: "event",
  eventName: "conversion",
  parameters: {
    send_to: typeof GOOGLE_ADS_WHATSAPP_CONVERSION;
    event_callback: GoogleAdsEventCallback;
  },
) => void;

export type WhatsAppPopup = {
  closed?: boolean;
  opener?: unknown;
  location: {
    replace: (url: string) => void;
  };
};

export type WhatsAppConversionEnvironment = {
  gtag?: GoogleAdsGtag;
  open: (url?: string, target?: string, features?: string) => WhatsAppPopup | null;
  setTimeout: (callback: () => void, delay?: number) => number;
  clearTimeout: (timeout: number) => void;
  location: {
    assign: (url: string) => void;
  };
};

function getBrowserEnvironment(): WhatsAppConversionEnvironment | null {
  if (typeof window === "undefined") return null;

  return {
    gtag: window.gtag as GoogleAdsGtag | undefined,
    open: window.open.bind(window),
    setTimeout: (callback, delay) => window.setTimeout(callback, delay),
    clearTimeout: (timeout) => window.clearTimeout(timeout),
    location: window.location,
  };
}

/**
 * Reports the final WhatsApp lead conversion and then navigates to WhatsApp.
 *
 * The blank window is intentionally reserved during the user gesture so that
 * callback- and timeout-based navigation keeps the existing new-tab behavior
 * without being blocked by browser popup protections.
 */
export function reportWhatsAppConversion(
  whatsappUrl: string,
  environment: WhatsAppConversionEnvironment | null = getBrowserEnvironment(),
): void {
  if (!environment) return;

  let redirected = false;
  let fallbackTimer: number | undefined;
  let reservedPopup: WhatsAppPopup | null = null;

  try {
    reservedPopup = environment.open("about:blank", "_blank");
    if (reservedPopup) reservedPopup.opener = null;
  } catch {
    // A blocked popup is handled by the same-tab fallback in redirectToWhatsApp.
  }

  const redirectToWhatsApp = () => {
    if (redirected) return;

    redirected = true;
    if (fallbackTimer !== undefined) environment.clearTimeout(fallbackTimer);

    if (reservedPopup && !reservedPopup.closed) {
      reservedPopup.location.replace(whatsappUrl);
      return;
    }

    try {
      const openedPopup = environment.open(whatsappUrl, "_blank", "noopener,noreferrer");
      if (openedPopup) return;
    } catch {
      // Fall through to a same-tab navigation, which cannot be popup-blocked.
    }

    environment.location.assign(whatsappUrl);
  };

  if (typeof environment.gtag !== "function") {
    redirectToWhatsApp();
    return;
  }

  try {
    environment.gtag("event", "conversion", {
      send_to: GOOGLE_ADS_WHATSAPP_CONVERSION,
      event_callback: redirectToWhatsApp,
    });
  } catch {
    redirectToWhatsApp();
    return;
  }

  if (!redirected) {
    fallbackTimer = environment.setTimeout(redirectToWhatsApp, WHATSAPP_REDIRECT_FALLBACK_MS);
  }
}

/** Creates a per-form, exactly-once conversion trigger. */
export function createWhatsAppConversionSubmitter() {
  let submitted = false;

  return (whatsappUrl: string, environment?: WhatsAppConversionEnvironment | null) => {
    if (submitted) return false;

    submitted = true;
    reportWhatsAppConversion(whatsappUrl, environment);
    return true;
  };
}
