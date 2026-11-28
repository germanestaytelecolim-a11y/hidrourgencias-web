"use client";

import { usePathname } from "next/navigation";

import { CommercialEntry } from "@/components/commercial-entry";

function normalizePath(pathname: string | null) {
  return (pathname || "/").replace(/\/+$/, "") || "/";
}

export function EmergencyAlertModalGate() {
  const pathname = normalizePath(usePathname());
  return <CommercialEntry pathname={pathname} />;
}
