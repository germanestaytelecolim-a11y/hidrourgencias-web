export function getAdminCsrfToken() {
  return document.querySelector<HTMLMetaElement>('meta[name="admin-csrf-token"]')?.content ?? "";
}

export function adminFetch(input: RequestInfo | URL, init: RequestInit = {}) {
  const headers = new Headers(init.headers);
  headers.set("X-CSRF-Token", getAdminCsrfToken());

  return fetch(input, {
    ...init,
    headers,
  });
}
