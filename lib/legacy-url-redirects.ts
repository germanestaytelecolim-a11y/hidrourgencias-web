export const legacyPageIdRedirect = {
  pathname: "/",
  queryKey: "page_id",
  queryValue: "12",
  destination: "https://hidrourgencias.cl/",
  statusCode: 301,
} as const;

export function getLegacyPageIdRedirect(pathname: string, searchParams: URLSearchParams) {
  if (
    pathname === legacyPageIdRedirect.pathname &&
    searchParams.get(legacyPageIdRedirect.queryKey) === legacyPageIdRedirect.queryValue
  ) {
    const destination = new URL(legacyPageIdRedirect.destination);

    for (const [key, value] of searchParams) {
      if (key !== legacyPageIdRedirect.queryKey) {
        destination.searchParams.append(key, value);
      }
    }

    return {
      ...legacyPageIdRedirect,
      destination: destination.toString(),
    };
  }

  return null;
}
