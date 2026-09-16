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
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[90] flex items-start justify-center bg-slate-950/72 p-2 backdrop-blur-sm sm:items-center sm:p-8"
      role="dialog"
      aria-modal="true"
      aria-label="Formulario previo para WhatsApp"
    >
      <div className="relative w-full max-w-6xl">
        <WhatsAppLeadForm variant="modal" onClose={() => setOpen(false)} />
      </div>
    </div>
  );
}
