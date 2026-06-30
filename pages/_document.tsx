import { Head, Html, Main, NextScript } from "next/document";

import { themeInitScript, themeToggleScript } from "@/lib/theme-scripts";

export default function Document() {
  return (
    <Html lang="es-CL" suppressHydrationWarning>
      <Head>
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
