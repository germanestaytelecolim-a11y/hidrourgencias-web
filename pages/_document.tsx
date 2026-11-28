import { Head, Html, Main, NextScript } from "next/document";

import { themeInitScript, themeToggleScript } from "@/lib/theme-scripts";

export default function Document() {
  return (
    <Html lang="es-CL" suppressHydrationWarning>
      <Head>
        <link rel="icon" href="/favicon.ico?v=hu-final-20261128" sizes="any" />
        <link rel="icon" href="/favicon-96.png?v=hu-final-20261128" type="image/png" sizes="96x96" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png?v=hu-final-20261128" />
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
