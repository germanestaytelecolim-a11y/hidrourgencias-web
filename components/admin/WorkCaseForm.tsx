"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/router";

import { adminCommunes, adminServices, propertyTypes } from "@/lib/admin/options";
import { adminFetch } from "@/lib/admin/client";
import type { MediaAsset, WorkCase, WorkStatus } from "@/lib/admin/types";

type SaveState = "idle" | "saving" | "saved" | "error";

export function WorkCaseForm({ initialWorkCase }: { initialWorkCase?: WorkCase | null }) {
  const router = useRouter();
  const [media, setMedia] = useState<MediaAsset[]>(initialWorkCase?.media ?? []);
  const [status, setStatus] = useState<SaveState>("idle");
  const [message, setMessage] = useState("");
  const [previewOpen, setPreviewOpen] = useState(false);
  const [uploading, setUploading] = useState(false);

  const endpoint = initialWorkCase ? `/api/admin/work-cases/${initialWorkCase.id}` : "/api/admin/work-cases";
  const method = initialWorkCase ? "PATCH" : "POST";
  const cover = useMemo(() => media.find((asset) => asset.isCover) ?? media[0], [media]);

  async function uploadFiles(files: FileList | null) {
    if (!files?.length) return;
    setUploading(true);
    setMessage(`Subiendo ${files.length} fotografía${files.length === 1 ? "" : "s"}...`);
    const formData = new FormData();
    Array.from(files).slice(0, 10).forEach((file) => formData.append("files", file));
    const response = await adminFetch("/api/admin/media", { method: "POST", body: formData });
    const payload = await response.json();
    setUploading(false);

    if (!response.ok) {
      setMessage(payload.message || "No pudimos subir las fotografías.");
      setStatus("error");
      return;
    }

    setMedia((current) => normalizeMediaOrder([...current, ...payload.assets]));
    setMessage("Fotografías subidas.");
    setStatus("saved");
  }

  async function save(form: HTMLFormElement, nextStatus: WorkStatus) {
    const formData = new FormData(form);
    formData.set("status", nextStatus);
    formData.set("media", JSON.stringify(media));
    setStatus("saving");
    setMessage(nextStatus === "published" ? "Publicando..." : "Guardando borrador...");

    const response = await adminFetch(endpoint, { method, body: formData });
    const payload = await response.json();

    if (!response.ok) {
      setStatus("error");
      setMessage(payload.errors?.join(" ") || payload.message || "No pudimos guardar este trabajo. Tus datos permanecen en pantalla.");
      return;
    }

    setStatus("saved");
    setMessage(nextStatus === "published" ? "Publicado." : "Borrador guardado.");
    router.replace(`/admin/trabajos/${payload.workCase.id}`);
  }

  function updateMedia(id: string, patch: Partial<MediaAsset>) {
    setMedia((current) => normalizeMediaOrder(current.map((asset) => (asset.id === id ? { ...asset, ...patch } : asset))));
  }

  function makeCover(id: string) {
    setMedia((current) => normalizeMediaOrder(current.map((asset) => ({ ...asset, isCover: asset.id === id }))));
  }

  function moveMedia(id: string, direction: -1 | 1) {
    setMedia((current) => {
      const index = current.findIndex((asset) => asset.id === id);
      const target = index + direction;
      if (index < 0 || target < 0 || target >= current.length) return current;
      const next = [...current];
      [next[index], next[target]] = [next[target], next[index]];
      return normalizeMediaOrder(next);
    });
  }

  function removeMedia(id: string) {
    setMedia((current) => {
      const next = current.filter((item) => item.id !== id);
      if (current.some((item) => item.id === id && item.isCover) && next[0]) {
        next[0] = { ...next[0], isCover: true };
      }
      return normalizeMediaOrder(next);
    });
  }

  return (
    <form
      className="grid gap-4"
      onSubmit={(event) => {
        event.preventDefault();
        save(event.currentTarget, "draft");
      }}
    >
      <AdminCard title="1. Ubicación">
        <div className="grid gap-3 sm:grid-cols-2">
          <SelectField name="commune" label="Comuna *" defaultValue={initialWorkCase?.commune} options={adminCommunes} />
          <TextField name="sector" label="Sector" defaultValue={initialWorkCase?.sector} placeholder="Ej: Reñaca, Centro, Belloto" />
          <TextField
            name="privateAddress"
            label="Dirección interna/opcional"
            defaultValue={initialWorkCase?.privateAddress}
            placeholder="No se publica automáticamente"
          />
        </div>
      </AdminCard>

      <AdminCard title="2. Propiedad y servicios">
        <SelectField name="propertyType" label="Tipo de propiedad *" defaultValue={initialWorkCase?.propertyType} options={propertyTypes} />
        <fieldset className="mt-4 grid gap-2">
          <legend className="text-sm font-black text-slate-900">Servicios *</legend>
          <div className="grid gap-2 sm:grid-cols-2">
            {adminServices.map((service) => (
              <label key={service} className="flex min-h-11 items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 text-sm font-bold text-slate-800">
                <input type="checkbox" name="services" value={service} defaultChecked={initialWorkCase?.services.includes(service)} />
                {service}
              </label>
            ))}
          </div>
        </fieldset>
      </AdminCard>

      <AdminCard title="3. Información técnica">
        <TextField name="title" label="Título del trabajo *" defaultValue={initialWorkCase?.title} placeholder="Ej: Hidrojet en edificio" />
        <TextField name="date" label="Fecha del trabajo" defaultValue={initialWorkCase?.date} placeholder="AAAA-MM-DD" />
        <TextArea name="problem" label="Situación encontrada *" defaultValue={initialWorkCase?.problem} />
        <TextArea name="diagnosis" label="Diagnóstico técnico" defaultValue={initialWorkCase?.diagnosis} />
        <TextArea name="intervention" label="Intervención realizada *" defaultValue={initialWorkCase?.intervention} />
        <TextField name="equipment" label="Equipos utilizados" defaultValue={initialWorkCase?.equipment} placeholder="Ej: Hidrojet, RIDGID, cámara" />
        <TextArea name="result" label="Resultado observado *" defaultValue={initialWorkCase?.result} />
        <TextArea name="recommendation" label="Recomendación preventiva" defaultValue={initialWorkCase?.recommendation} />
      </AdminCard>

      <AdminCard title="4. Fotografías">
        <p className="rounded-2xl bg-sky-50 p-3 text-sm font-bold text-sky-950">
          Máximo 10 fotografías por carga, 12 MB por imagen y 60 MB totales. JPG, PNG y WEBP funcionan. HEIC todavía requiere conversión antes de subir.
        </p>
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="grid min-h-14 cursor-pointer place-items-center rounded-2xl border-2 border-dashed border-sky-300 bg-sky-50 px-4 py-4 text-center text-sm font-black text-sky-950">
            Tomar foto
            <input className="sr-only" type="file" accept="image/*" capture="environment" multiple onChange={(event) => uploadFiles(event.currentTarget.files)} />
          </label>
          <label className="grid min-h-14 cursor-pointer place-items-center rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 px-4 py-4 text-center text-sm font-black text-slate-950">
            Elegir de galería
            <input className="sr-only" type="file" accept="image/*" multiple onChange={(event) => uploadFiles(event.currentTarget.files)} />
          </label>
        </div>
        {uploading ? <p className="mt-3 text-sm font-bold text-sky-900">Subiendo fotografías...</p> : null}
        <div className="mt-4 grid gap-3">
          {media.map((asset, index) => (
            <div key={asset.id} className="grid gap-3 rounded-2xl border border-slate-200 bg-white p-3 sm:grid-cols-[7rem_1fr]">
              <Image src={asset.thumbnailUrl || asset.url} alt={asset.altText} width={320} height={220} className="h-28 w-full rounded-xl object-cover sm:h-full" />
              <div className="grid gap-2">
                <TextField
                  name={`caption-display-${asset.id}`}
                  label="¿Qué muestra esta fotografía?"
                  value={asset.caption}
                  onChange={(value) => updateMedia(asset.id, { caption: value, altText: value || asset.altText })}
                />
                <div className="flex flex-wrap gap-2">
                  <button type="button" onClick={() => moveMedia(asset.id, -1)} disabled={index === 0} className="min-h-11 rounded-xl bg-slate-100 px-3 py-2 text-sm font-black text-slate-900 disabled:opacity-45">
                    ↑
                  </button>
                  <button type="button" onClick={() => moveMedia(asset.id, 1)} disabled={index === media.length - 1} className="min-h-11 rounded-xl bg-slate-100 px-3 py-2 text-sm font-black text-slate-900 disabled:opacity-45">
                    ↓
                  </button>
                  <button type="button" onClick={() => makeCover(asset.id)} className="min-h-11 rounded-xl bg-slate-900 px-3 py-2 text-sm font-black text-white">
                    {asset.isCover || (!cover && index === 0) ? "Portada" : "Usar como portada"}
                  </button>
                  <label className="flex min-h-11 items-center gap-2 rounded-xl bg-slate-100 px-3 py-2 text-sm font-bold text-slate-900">
                    <input type="checkbox" checked={asset.isPublic} onChange={(event) => updateMedia(asset.id, { isPublic: event.currentTarget.checked })} />
                    Puede publicarse
                  </label>
                  <button type="button" onClick={() => removeMedia(asset.id)} className="min-h-11 rounded-xl bg-red-50 px-3 py-2 text-sm font-black text-red-800">
                    Eliminar
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </AdminCard>

      <AdminCard title="5. Video y publicación">
        <SelectField name="videoMode" label="Video del trabajo" defaultValue={initialWorkCase?.videoMode || "none"} options={["none", "upload", "external"]} />
        <TextField name="videoUrl" label="Enlace publicado" defaultValue={initialWorkCase?.videoUrl} placeholder="YouTube, Instagram, TikTok u otra URL válida" />
        <div className="grid gap-2">
          {initialWorkCase?.origin === "legacy" ? (
            <p className="rounded-2xl bg-amber-50 p-3 text-sm font-black text-amber-950">Caso histórico importado</p>
          ) : null}
          <label className="flex min-h-11 items-center gap-2 rounded-xl bg-slate-50 px-3 font-bold text-slate-900">
            <input type="checkbox" name="showInCases" defaultChecked={initialWorkCase?.showInCases ?? true} /> Casos reales
          </label>
          <label className="flex min-h-11 items-center gap-2 rounded-xl bg-slate-50 px-3 font-bold text-slate-900">
            <input type="checkbox" name="showInCommune" defaultChecked={initialWorkCase?.showInCommune ?? true} /> Landing de comuna
          </label>
          <label className="flex min-h-11 items-center gap-2 rounded-xl bg-slate-50 px-3 font-bold text-slate-900">
            <input type="checkbox" name="showInServices" defaultChecked={initialWorkCase?.showInServices ?? true} /> Servicios relacionados
          </label>
          <label className="flex min-h-11 items-center gap-2 rounded-xl bg-slate-50 px-3 font-bold text-slate-900">
            <input type="checkbox" name="showOnHome" defaultChecked={initialWorkCase?.showOnHome ?? false} /> Página principal
          </label>
          <label className="flex min-h-11 items-center gap-2 rounded-xl bg-slate-50 px-3 font-bold text-slate-900">
            <input type="checkbox" name="featured" defaultChecked={initialWorkCase?.featured ?? false} /> Destacado
          </label>
        </div>
      </AdminCard>

      {message ? (
        <p className={`rounded-2xl px-4 py-3 text-sm font-black ${status === "error" ? "bg-red-100 text-red-900" : "bg-emerald-100 text-emerald-900"}`} role="status">
          {message}
        </p>
      ) : null}

      <div className="sticky bottom-0 z-10 grid gap-2 border-t border-white/10 bg-slate-950/95 py-3 sm:grid-cols-3">
        <button type="submit" className="min-h-12 rounded-xl bg-white px-4 py-3 font-black text-slate-950">
          Guardar borrador
        </button>
        <button type="button" onClick={() => setPreviewOpen(true)} className="min-h-12 rounded-xl bg-sky-100 px-4 py-3 font-black text-sky-950">
          Vista previa
        </button>
        <button type="button" onClick={(event) => event.currentTarget.form && save(event.currentTarget.form, "published")} className="min-h-12 rounded-xl bg-emerald-400 px-4 py-3 font-black text-emerald-950">
          Publicar
        </button>
        {initialWorkCase ? (
          <button type="button" onClick={(event) => event.currentTarget.form && save(event.currentTarget.form, "archived")} className="min-h-12 rounded-xl bg-red-100 px-4 py-3 font-black text-red-900 sm:col-span-3">
            Archivar
          </button>
        ) : null}
      </div>

      {previewOpen ? (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 p-4">
          <article className="mx-auto max-w-xl rounded-3xl bg-white p-5 text-slate-950 shadow-2xl">
            <button type="button" onClick={() => setPreviewOpen(false)} className="float-right min-h-11 rounded-xl bg-slate-100 px-3 font-black">
              Cerrar
            </button>
            <h2 className="mt-10 text-2xl font-black">{(document.querySelector("[name='title']") as HTMLInputElement | null)?.value || "Vista previa"}</h2>
            {cover ? <Image src={cover.url} alt={cover.altText} width={640} height={360} className="mt-4 aspect-video w-full rounded-2xl object-cover" /> : null}
            <p className="mt-3 text-sm font-bold text-sky-800">
              {(document.querySelector("[name='sector']") as HTMLInputElement | null)?.value || ""}
              {(document.querySelector("[name='commune']") as HTMLSelectElement | null)?.value ? ` · ${(document.querySelector("[name='commune']") as HTMLSelectElement).value}` : ""}
            </p>
            <p className="mt-4 whitespace-pre-line text-slate-700">{(document.querySelector("[name='intervention']") as HTMLTextAreaElement | null)?.value}</p>
            <p className="mt-4 rounded-2xl bg-emerald-50 p-4 font-bold text-emerald-950">{(document.querySelector("[name='result']") as HTMLTextAreaElement | null)?.value}</p>
          </article>
        </div>
      ) : null}
    </form>
  );
}

function normalizeMediaOrder(items: MediaAsset[]) {
  const hasCover = items.some((asset) => asset.isCover);
  return items.map((asset, index) => ({
    ...asset,
    sortOrder: index,
    isCover: hasCover ? asset.isCover : index === 0,
  }));
}

function AdminCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-3xl bg-white p-4 text-slate-950 shadow-xl">
      <h2 className="mb-4 text-lg font-black">{title}</h2>
      <div className="grid gap-3">{children}</div>
    </section>
  );
}

function TextField({
  name,
  label,
  defaultValue,
  placeholder,
  value,
  onChange,
}: {
  name: string;
  label: string;
  defaultValue?: string;
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
}) {
  return (
    <label className="grid gap-1 text-sm font-black text-slate-900">
      {label}
      <input
        name={name}
        value={value}
        defaultValue={value === undefined ? defaultValue : undefined}
        onChange={onChange ? (event) => onChange(event.currentTarget.value) : undefined}
        placeholder={placeholder}
        className="min-h-11 w-full min-w-0 rounded-xl border border-slate-300 px-3 text-base font-medium focus-visible:outline focus-visible:outline-4 focus-visible:outline-sky-300"
      />
    </label>
  );
}

function TextArea({ name, label, defaultValue }: { name: string; label: string; defaultValue?: string }) {
  return (
    <label className="grid gap-1 text-sm font-black text-slate-900">
      {label}
      <textarea
        name={name}
        defaultValue={defaultValue}
        rows={4}
        className="min-h-28 w-full min-w-0 rounded-xl border border-slate-300 px-3 py-3 text-base font-medium focus-visible:outline focus-visible:outline-4 focus-visible:outline-sky-300"
      />
    </label>
  );
}

function SelectField({ name, label, defaultValue, options }: { name: string; label: string; defaultValue?: string; options: readonly string[] }) {
  return (
    <label className="grid gap-1 text-sm font-black text-slate-900">
      {label}
      <select
        name={name}
        defaultValue={defaultValue || ""}
        className="min-h-11 w-full min-w-0 rounded-xl border border-slate-300 px-3 text-base font-medium focus-visible:outline focus-visible:outline-4 focus-visible:outline-sky-300"
      >
        <option value="">Seleccionar</option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option === "none" ? "No tengo video" : option === "upload" ? "Subir video corto" : option === "external" ? "Enlace publicado" : option}
          </option>
        ))}
      </select>
    </label>
  );
}
