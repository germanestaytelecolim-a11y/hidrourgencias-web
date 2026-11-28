import type { AppProps } from "next/app";
import { Manrope, Rajdhani } from "next/font/google";
import { useRouter } from "next/router";

import { CommercialEntry } from "@/components/commercial-entry";
import "@/app/globals.css";
import "@/styles/home.css";
import "@/styles/home-visual.css";
import "@/styles/commercial-entry.css";

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
  const currentPath = (router.asPath.split("?")[0] || "/").replace(/\/+$/, "") || "/";

  return (
    <div className={`${manrope.variable} ${rajdhani.variable} bg-white text-slate-900 antialiased`}>
      <Component {...pageProps} />
      <CommercialEntry pathname={currentPath} />
    </div>
  );
}
