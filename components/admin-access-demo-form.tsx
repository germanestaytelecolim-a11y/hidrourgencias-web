"use client";

import type { FormEvent } from "react";
import { useState } from "react";

const invalidAccessMessage = "Usuario no registrado, ID o password inválido.";

export function AdminAccessDemoForm() {
  const [showError, setShowError] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setShowError(true);
  }

  return (
    <form
      onSubmit={handleSubmit}
      autoComplete="off"
      className="rounded-[2rem] border border-sky-100 bg-white p-5 shadow-[0_24px_70px_-45px_rgba(8,56,95,0.75)] sm:p-7"
      aria-describedby="admin-access-note"
    >
      <div className="mb-6">
        <p className="text-xs font-bold uppercase tracking-[0.22em] text-sky-700">Portal demostrativo</p>
        <h2 className="mt-2 text-2xl font-black tracking-tight text-slate-950">Ingreso corporativo</h2>
        <p className="mt-2 text-sm leading-7 text-slate-600">
          Acceso referencial en etapa de habilitación. No valida, almacena ni procesa credenciales reales.
        </p>
      </div>

      <div className="grid gap-4">
        <label className="grid gap-2 text-sm font-bold text-slate-800" htmlFor="admin-access-id">
          ID
          <input
            id="admin-access-id"
            type="text"
            placeholder="Ingrese ID de cliente"
            autoComplete="off"
            className="h-12 rounded-xl border border-sky-100 bg-white px-4 text-sm font-semibold text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-sky-400 focus:ring-4 focus:ring-sky-100"
          />
        </label>

        <label className="grid gap-2 text-sm font-bold text-slate-800" htmlFor="admin-access-client">
          Cliente
          <input
            id="admin-access-client"
            type="text"
            placeholder="Nombre de cliente o comunidad"
            autoComplete="off"
            className="h-12 rounded-xl border border-sky-100 bg-white px-4 text-sm font-semibold text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-sky-400 focus:ring-4 focus:ring-sky-100"
          />
        </label>

        <label className="grid gap-2 text-sm font-bold text-slate-800" htmlFor="admin-access-password">
          Password
          <input
            id="admin-access-password"
            type="password"
            placeholder="Ingrese password"
            autoComplete="off"
            className="h-12 rounded-xl border border-sky-100 bg-white px-4 text-sm font-semibold text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-sky-400 focus:ring-4 focus:ring-sky-100"
          />
        </label>
      </div>

      <button
        type="submit"
        className="mt-6 inline-flex w-full items-center justify-center rounded-xl bg-[#08385f] px-6 py-3.5 text-sm font-black text-white shadow-lg shadow-sky-950/20 transition hover:-translate-y-0.5 hover:bg-[#0e5f86] focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-sky-300"
      >
        Ingresar al portal
      </button>

      {showError ? (
        <p
          className="mt-4 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-bold text-rose-900"
          role="status"
          aria-live="polite"
        >
          {invalidAccessMessage}
        </p>
      ) : null}
    </form>
  );
}
