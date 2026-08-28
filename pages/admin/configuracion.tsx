import { useState } from "react";

import { AdminShell } from "@/components/admin/AdminShell";
import { requireAdminPage, type AdminPageProps } from "@/lib/admin/auth";
import { adminFetch } from "@/lib/admin/client";

export const getServerSideProps = requireAdminPage;

export default function AdminSettingsPage({ user, csrfToken }: AdminPageProps) {
  const [message, setMessage] = useState("");

  async function changePassword(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const response = await adminFetch("/api/admin/password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        currentPassword: formData.get("currentPassword"),
        newPassword: formData.get("newPassword"),
        confirmPassword: formData.get("confirmPassword"),
      }),
    });
    const payload = await response.json();
    setMessage(response.ok ? "Contraseña actualizada. Las otras sesiones fueron invalidadas." : payload.message || "No pudimos actualizar la contraseña.");
  }

  return (
    <AdminShell user={user} csrfToken={csrfToken} title="Configuración">
      <section className="rounded-3xl bg-white p-4 text-slate-950 shadow-xl">
        <h2 className="text-lg font-black">Mi cuenta</h2>
        <dl className="mt-4 grid gap-2 text-sm">
          <div><dt className="font-black">Nombre</dt><dd>{user.name}</dd></div>
          <div><dt className="font-black">Usuario</dt><dd>{user.username}</dd></div>
          <div><dt className="font-black">Email</dt><dd>{user.email}</dd></div>
          <div><dt className="font-black">Último acceso</dt><dd>{user.lastLoginAt || "Sin registro previo"}</dd></div>
        </dl>
      </section>
      <form onSubmit={changePassword} className="mt-4 grid gap-3 rounded-3xl bg-white p-4 text-slate-950 shadow-xl">
        <h2 className="text-lg font-black">Cambiar contraseña</h2>
        <PasswordField name="currentPassword" label="Contraseña actual *" />
        <PasswordField name="newPassword" label="Nueva contraseña *" />
        <PasswordField name="confirmPassword" label="Confirmar nueva contraseña *" />
        {message ? <p className="rounded-xl bg-sky-50 p-3 text-sm font-bold text-sky-900">{message}</p> : null}
        <button className="min-h-12 rounded-xl bg-sky-600 px-4 py-3 font-black text-white">Actualizar contraseña</button>
      </form>
    </AdminShell>
  );
}

function PasswordField({ name, label }: { name: string; label: string }) {
  return (
    <label className="grid gap-1 text-sm font-black">
      {label}
      <input name={name} type="password" className="min-h-12 w-full min-w-0 rounded-xl border border-slate-300 px-3 text-base" />
    </label>
  );
}
