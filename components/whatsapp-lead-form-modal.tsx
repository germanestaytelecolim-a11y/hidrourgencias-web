"use client";

import { useEffect, useState } from "react";

import { WhatsAppLeadForm } from "@/components/whatsapp-lead-form";

export const WHATSAPP_LEAD_FORM_EVENT = "hu:open-whatsapp-lead-form";

export function openWhatsAppLeadForm() {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event(WHATSAPP_LEAD_FORM_EVENT));
}

export function WhatsAppLeadFormModal() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    function handleOpen() {
      setOpen(true);
    }

    window.addEventListener(WHATSAPP_LEAD_FORM_EVENT, handleOpen);
    return () => window.removeEventListener(WHATSAPP_LEAD_FORM_EVENT, handleOpen);
  }, []);

  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function handleKeydown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }

    window.addEventListener("keydown", handleKeydown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeydown);
    };
  }, [open]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[90] overflow-y-auto bg-slate-950/72 px-3 py-4 backdrop-blur-sm sm:px-5 sm:py-8"
      role="dialog"
      aria-modal="true"
      aria-label="Formulario previo para WhatsApp"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) setOpen(false);
      }}
    >
      <div className="mx-auto w-full max-w-5xl">
        <WhatsAppLeadForm variant="modal" onClose={() => setOpen(false)} />
      </div>
    </div>
  );
}
