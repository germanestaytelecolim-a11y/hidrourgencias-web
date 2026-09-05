import type { AppProps } from "next/app";
import { Manrope, Rajdhani } from "next/font/google";
import { useRouter } from "next/router";

import { EmergencyAlertModal } from "@/components/EmergencyAlertModal";
import "@/app/globals.css";
import "@/styles/home.css";

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  display: "swap",
});

const rajdhani = Rajdhani({
  subsets: ["latin"],
  weight: ["700"],
  variable: "--font-rajdhani",
  display: "swap",
});

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const isAdminRoute = router.pathname === "/admin" || router.pathname.startsWith("/admin/");

  return (
    <div className={`${manrope.variable} ${rajdhani.variable} bg-white text-slate-900 antialiased`}>
      <Component {...pageProps} />
      {isAdminRoute ? null : <EmergencyAlertModal />}
    </div>
  );
}
