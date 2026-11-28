import { Head, Html, Main, NextScript } from "next/document";

import { themeInitScript, themeToggleScript } from "@/lib/theme-scripts";

export default function Document() {
  return (
    <Html lang="es-CL" suppressHydrationWarning>
      <Head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </Head>
      <body>
        <Main />
        <script dangerouslySetInnerHTML={{ __html: themeToggleScript }} />
        <NextScript />
      </body>
    </Html>
  );
}
