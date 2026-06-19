import type { AppProps } from "next/app";
import { Manrope, Rajdhani } from "next/font/google";

import "@/app/globals.css";

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
  return (
    <div className={`${manrope.variable} ${rajdhani.variable} bg-white text-slate-900 antialiased`}>
      <Component {...pageProps} />
    </div>
  );
}
