"use client";

import { usePathname } from "next/navigation";

import { EmergencyAlertModal } from "@/components/EmergencyAlertModal";
import { URGENCY_MODAL_ALLOWED_PATHS } from "@/lib/emergency-alert-config";

function normalizePath(pathname: string | null) {
  return (pathname || "/").replace(/\/+$/, "") || "/";
}

export function EmergencyAlertModalGate() {
  const pathname = normalizePath(usePathname());
  const canShowEmergencyModal = URGENCY_MODAL_ALLOWED_PATHS.includes(
    pathname as (typeof URGENCY_MODAL_ALLOWED_PATHS)[number],
  );

  return canShowEmergencyModal ? <EmergencyAlertModal /> : null;
}
