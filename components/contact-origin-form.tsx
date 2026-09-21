"use client";

import { useEffect } from "react";

import { WhatsAppLeadForm } from "@/components/whatsapp-lead-form";

const contactOriginStorageKey = "hidrourgencias_contact_origin";

function getContactOrigin() {
  if (typeof window === "undefined") return "";

  const queryOrigin = new URLSearchParams(window.location.search).get("origen");
  const fragmentOrigin = new URLSearchParams(window.location.hash.slice(1)).get("origen");
  const origin = queryOrigin ?? fragmentOrigin;

  if (origin) return origin.slice(0, 2000);

  try {
    return (window.sessionStorage.getItem(contactOriginStorageKey) ?? "").slice(0, 2000);
  } catch {
    return "";
  }
}

export function ContactOriginForm() {
  const origin = getContactOrigin();

  useEffect(() => {
    if (!origin) return;

    try {
      window.sessionStorage.setItem(contactOriginStorageKey, origin);
    } catch {
      // Storage can be unavailable in private or constrained browser contexts.
    }

    const query = new URLSearchParams(window.location.search);
    query.delete("origen");
    const remainingQuery = query.toString();
    const cleanUrl = `/contacto${remainingQuery ? `?${remainingQuery}` : ""}#whatsapp-solicitud`;
    window.history.replaceState(window.history.state, "", cleanUrl);
  }, [origin]);

  return <WhatsAppLeadForm initialDescription={origin} />;
}
