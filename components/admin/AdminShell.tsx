import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import type { ReactNode } from "react";

import type { AdminSessionUser } from "@/lib/admin/auth";
import { adminFetch } from "@/lib/admin/client";

export function AdminShell({ user, csrfToken, title, children }: { user: AdminSessionUser; csrfToken: string; title: string; children: ReactNode }) {
  const router = useRouter();

  async function logout() {
    await adminFetch("/api/admin/logout", { method: "POST" });
    router.replace("/admin/login");
  }

  return (
    <>
      <Head>
        <title>{title} | Panel Hidrourgencias</title>
        <meta name="robots" content="noindex,nofollow" />
        <meta name="admin-csrf-token" content={csrfToken} />
      </Head>
      <main className="min-h-screen bg-slate-950 text-white">
        <div className="mx-auto flex min-h-screen w-full max-w-6xl flex-col lg:grid lg:grid-cols-[17rem_1fr]">
          <aside className="border-b border-white/10 bg-slate-900/95 px-4 py-4 lg:border-b-0 lg:border-r lg:py-6">
            <div className="rounded-2xl bg-white p-4 text-slate-950 shadow-xl">
              <p className="text-lg font-black tracking-tight">HIDROURGENCIAS</p>
              <p className="text-sm font-bold text-sky-700">Panel de Administración</p>
            </div>
            <nav className="mt-4 grid grid-cols-2 gap-2 text-sm font-bold lg:grid-cols-1" aria-label="Navegación admin">
              <AdminLink href="/admin" label="Inicio" />
              <AdminLink href="/admin/trabajos/nuevo" label="+ Nuevo trabajo" />
              <AdminLink href="/admin/trabajos" label="Casos de éxito" />
              <AdminLink href="/admin/blog" label="Blog y guías" />
              <AdminLink href="/admin/evidencias" label="Evidencias" />
              <AdminLink href="/admin/configuracion" label="Configuración" />
              <button
                type="button"
                onClick={logout}
                className="min-h-11 rounded-xl border border-red-200/30 bg-red-500/10 px-3 py-2 text-left text-red-100 transition hover:bg-red-500/20 focus-visible:outline focus-visible:outline-4 focus-visible:outline-sky-300"
              >
                Cerrar sesión
              </button>
            </nav>
          </aside>
          <section className="flex-1 px-4 py-5 sm:px-6 lg:px-8 lg:py-8">
            <header className="mb-5 rounded-2xl border border-white/10 bg-white/10 p-4">
              <p className="text-sm font-bold text-sky-100">Hola, {user.name}</p>
              <h1 className="mt-1 text-2xl font-black tracking-tight sm:text-3xl">{title}</h1>
            </header>
            {children}
          </section>
        </div>
      </main>
    </>
  );
}

function AdminLink({ href, label }: { href: string; label: string }) {
  const router = useRouter();
  const active = router.pathname === href;

  return (
    <Link
      href={href}
      className={`min-h-11 rounded-xl px-3 py-3 transition focus-visible:outline focus-visible:outline-4 focus-visible:outline-sky-300 ${
        active ? "bg-sky-300 text-slate-950" : "bg-white/10 text-white hover:bg-white/15"
      }`}
    >
      {label}
    </Link>
  );
}
