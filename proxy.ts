import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { getLegacyPageIdRedirect } from "@/lib/legacy-url-redirects";

export function proxy(request: NextRequest) {
  const redirect = getLegacyPageIdRedirect(request.nextUrl.pathname, request.nextUrl.searchParams);

  if (redirect) {
    return NextResponse.redirect(redirect.destination, redirect.statusCode);
  }

  return NextResponse.next();
}

export const config = {
  matcher: "/",
};
