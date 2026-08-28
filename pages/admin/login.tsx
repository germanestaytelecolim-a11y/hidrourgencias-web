import Head from "next/head";
import { useRouter } from "next/router";
import { useState } from "react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setMessage("");
    const form = event.currentTarget;
    const response = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: new FormData(form).get("username"),
        password: new FormData(form).get("password"),
      }),
    });
    const payload = await response.json();
    setLoading(false);

    if (!response.ok) {
      setMessage(payload.message || "No pudimos iniciar sesión.");
      return;
    }

    router.replace("/admin");
  }

  return (
    <>
      <Head>
        <title>Panel de Administración | Hidrourgencias</title>
        <meta name="robots" content="noindex,nofollow" />
      </Head>
      <main className="grid min-h-screen place-items-center bg-slate-950 px-4 py-8 text-white">
        <form
          onSubmit={submit}
          className="rounded-3xl bg-white p-5 text-slate-950 shadow-2xl"
          style={{ boxSizing: "border-box", width: "min(100%, calc(100vw - 32px))", maxWidth: "24rem" }}
        >
          <p className="text-center text-2xl font-black tracking-tight">HIDROURGENCIAS</p>
          <h1 className="mt-2 text-center text-xl font-black">Panel de Administración</h1>
          <label className="mt-6 grid gap-2 text-sm font-black">
            Usuario
            <input name="username" autoComplete="username" className="min-h-12 w-full min-w-0 rounded-xl border border-slate-300 px-3 text-base" />
          </label>
          <label className="mt-4 grid gap-2 text-sm font-black">
            Contraseña
            <input name="password" type="password" autoComplete="current-password" className="min-h-12 w-full min-w-0 rounded-xl border border-slate-300 px-3 text-base" />
          </label>
          {message ? <p className="mt-4 rounded-xl bg-red-50 p-3 text-sm font-bold text-red-800">{message}</p> : null}
          <button type="submit" disabled={loading} className="mt-5 min-h-12 w-full rounded-xl bg-sky-600 px-4 py-3 font-black text-white disabled:opacity-70">
            {loading ? "Ingresando..." : "INICIAR SESIÓN"}
          </button>
          <p className="mt-4 text-center text-sm font-bold text-slate-600">¿Olvidaste tu contraseña?</p>
          <p className="mt-2 break-words text-center text-xs font-semibold leading-snug text-slate-500">Recuperación pendiente de proveedor de email.</p>
        </form>
      </main>
    </>
  );
}
