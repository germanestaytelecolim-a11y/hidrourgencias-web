"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/router";

import { adminCommunes, adminServices } from "@/lib/admin/options";
import { adminFetch } from "@/lib/admin/client";
import type { AdminBlogPost, BlogStatus, MediaAsset } from "@/lib/admin/types";

type SaveState = "idle" | "saving" | "saved" | "error";

export function BlogPostForm({ initialPost }: { initialPost?: AdminBlogPost | null }) {
  const router = useRouter();
  const [gallery, setGallery] = useState<MediaAsset[]>(initialPost?.gallery ?? []);
  const [coverImage, setCoverImage] = useState(initialPost?.coverImage ?? "");
  const [coverAlt, setCoverAlt] = useState(initialPost?.coverAlt ?? "");
  const [status, setStatus] = useState<SaveState>("idle");
  const [message, setMessage] = useState("");
  const [previewOpen, setPreviewOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const endpoint = initialPost ? `/api/admin/blog-posts/${initialPost.id}` : "/api/admin/blog-posts";
  const method = initialPost ? "PATCH" : "POST";
  const cover = useMemo(() => gallery.find((asset) => asset.isCover) ?? gallery[0], [gallery]);

  async function uploadFiles(files: FileList | null, mode: "cover" | "gallery") {
    if (!files?.length) return;
    setUploading(true);
    setMessage(`Subiendo ${files.length} imagen${files.length === 1 ? "" : "es"}...`);
    const formData = new FormData();
    Array.from(files).slice(0, 10).forEach((file) => formData.append("files", file));
    const response = await adminFetch("/api/admin/media", { method: "POST", body: formData });
    const payload = await response.json();
    setUploading(false);

    if (!response.ok) {
      setStatus("error");
      setMessage(payload.message || "No pudimos subir las imágenes.");
      return;
    }

    const assets = normalizeMediaOrder(payload.assets as MediaAsset[]);
    if (mode === "cover" && assets[0]) {
      setCoverImage(assets[0].url);
      setCoverAlt(assets[0].altText);
      setGallery((current) => normalizeMediaOrder([{ ...assets[0], isCover: true }, ...current.map((asset) => ({ ...asset, isCover: false }))]));
    } else {
      setGallery((current) => normalizeMediaOrder([...current, ...assets]));
    }
    setStatus("saved");
    setMessage("Imágenes subidas.");
  }

  async function save(form: HTMLFormElement, nextStatus: BlogStatus) {
    const formData = new FormData(form);
    formData.set("status", nextStatus);
    formData.set("coverImage", coverImage || cover?.url || "");
    formData.set("coverAlt", coverAlt || cover?.altText || "");
    formData.set("gallery", JSON.stringify(gallery));
    setStatus("saving");
    setMessage(nextStatus === "published" ? "Publicando artículo..." : nextStatus === "archived" ? "Archivando..." : "Guardando borrador...");

    const response = await adminFetch(endpoint, { method, body: formData });
    const payload = await response.json();

    if (!response.ok) {
      setStatus("error");
      setMessage(payload.errors?.join(" ") || payload.message || "No pudimos guardar este artículo.");
      return;
    }

    setStatus("saved");
    setMessage(nextStatus === "published" ? "Publicado." : nextStatus === "archived" ? "Archivado." : "Borrador guardado.");
    router.replace(`/admin/blog/${payload.blogPost.id}`);
  }

  function updateMedia(id: string, patch: Partial<MediaAsset>) {
    setGallery((current) => normalizeMediaOrder(current.map((asset) => (asset.id === id ? { ...asset, ...patch } : asset))));
  }

  function makeCover(id: string) {
    setGallery((current) => {
      const next = normalizeMediaOrder(current.map((asset) => ({ ...asset, isCover: asset.id === id })));
      const selected = next.find((asset) => asset.id === id);
      if (selected) {
        setCoverImage(selected.url);
        setCoverAlt(selected.altText);
      }
      return next;
    });
  }

  function moveMedia(id: string, direction: -1 | 1) {
    setGallery((current) => {
      const index = current.findIndex((asset) => asset.id === id);
      const target = index + direction;
      if (index < 0 || target < 0 || target >= current.length) return current;
      const next = [...current];
      [next[index], next[target]] = [next[target], next[index]];
      return normalizeMediaOrder(next);
    });
  }

  function removeMedia(id: string) {
    setGallery((current) => normalizeMediaOrder(current.filter((asset) => asset.id !== id)));
  }

  return (
    <form
      className="grid gap-4"
      onSubmit={(event) => {
        event.preventDefault();
        save(event.currentTarget, "draft");
      }}
    >
      <AdminCard title="1. Artículo">
        <TextField name="title" label="Título *" defaultValue={initialPost?.title} />
        <TextField name="h1" label="H1 visible" defaultValue={initialPost?.h1} placeholder="Si queda vacío, usa el título" />
        <TextArea name="summary" label="Resumen *" defaultValue={initialPost?.summary} rows={3} />
        <TextArea
          name="content"
          label="Contenido *"
          defaultValue={initialPost?.content}
          rows={12}
          helper="Usa subtítulos con ##, listas con -, negritas con **texto** y enlaces como [texto](https://...). No pegues HTML."
        />
      </AdminCard>

      <AdminCard title="2. Portada e imágenes">
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="grid min-h-14 cursor-pointer place-items-center rounded-2xl border-2 border-dashed border-sky-300 bg-sky-50 px-4 py-4 text-center text-sm font-black text-sky-950">
            Tomar foto
            <input className="sr-only" type="file" accept="image/*" capture="environment" onChange={(event) => uploadFiles(event.currentTarget.files, "cover")} />
          </label>
          <label className="grid min-h-14 cursor-pointer place-items-center rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 px-4 py-4 text-center text-sm font-black text-slate-950">
            Elegir de galería
            <input className="sr-only" type="file" accept="image/*" multiple onChange={(event) => uploadFiles(event.currentTarget.files, "gallery")} />
          </label>
        </div>
        {uploading ? <p className="text-sm font-bold text-sky-900">Subiendo imágenes...</p> : null}
        <TextField name="coverImageDisplay" label="Imagen de portada" value={coverImage} onChange={setCoverImage} placeholder="/images/..." />
        <TextField name="coverAltDisplay" label="Descripción de portada" value={coverAlt} onChange={setCoverAlt} />
        {coverImage ? <Image src={coverImage} alt={coverAlt || "Portada del artículo"} width={720} height={405} className="aspect-video w-full rounded-2xl object-cover" /> : null}
        <div className="grid gap-3">
          {gallery.map((asset, index) => (
            <div key={asset.id} className="grid gap-3 rounded-2xl border border-slate-200 bg-white p-3 sm:grid-cols-[7rem_1fr]">
              <Image src={asset.thumbnailUrl || asset.url} alt={asset.altText} width={320} height={220} className="h-28 w-full rounded-xl object-cover sm:h-full" />
              <div className="grid gap-2">
                <TextField
                  name={`caption-display-${asset.id}`}
                  label="Descripción"
                  value={asset.caption}
                  onChange={(value) => updateMedia(asset.id, { caption: value, altText: value || asset.altText })}
                />
                <div className="flex flex-wrap gap-2">
                  <button type="button" onClick={() => moveMedia(asset.id, -1)} disabled={index === 0} className="min-h-11 rounded-xl bg-slate-100 px-3 py-2 text-sm font-black text-slate-900 disabled:opacity-45">↑</button>
                  <button type="button" onClick={() => moveMedia(asset.id, 1)} disabled={index === gallery.length - 1} className="min-h-11 rounded-xl bg-slate-100 px-3 py-2 text-sm font-black text-slate-900 disabled:opacity-45">↓</button>
                  <button type="button" onClick={() => makeCover(asset.id)} className="min-h-11 rounded-xl bg-slate-900 px-3 py-2 text-sm font-black text-white">{asset.isCover ? "Portada" : "Usar como portada"}</button>
                  <button type="button" onClick={() => removeMedia(asset.id)} className="min-h-11 rounded-xl bg-red-50 px-3 py-2 text-sm font-black text-red-800">Eliminar</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </AdminCard>

      <AdminCard title="3. Clasificación">
        <div className="grid gap-3 sm:grid-cols-2">
          <TextField name="category" label="Categoría" defaultValue={initialPost?.category ?? "Guía técnica"} />
          <TextField name="tags" label="Etiquetas separadas por coma" defaultValue={initialPost?.tags.join(", ")} />
          <TextField name="date" label="Fecha" defaultValue={initialPost?.date} placeholder="AAAA-MM-DD" />
          <SelectField name="relatedService" label="Servicio relacionado" defaultValue={initialPost?.relatedService} options={adminServices.map((item) => `/servicios/${item.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, "-")}`)} />
          <SelectField name="relatedCommune" label="Comuna relacionada" defaultValue={initialPost?.relatedCommune} options={adminCommunes.map((item) => item)} />
          <TextField name="relatedCta" label="CTA relacionado" defaultValue={initialPost?.relatedCta} placeholder="Solicitar evaluación técnica" />
        </div>
        <label className="flex min-h-11 items-center gap-2 rounded-xl bg-slate-50 px-3 font-bold text-slate-900">
          <input type="checkbox" name="featured" defaultChecked={initialPost?.featured ?? false} /> Artículo destacado
        </label>
      </AdminCard>

      <AdminCard title="4. SEO">
        <TextField name="slug" label="Slug" defaultValue={initialPost?.slug} />
        <TextField name="seoTitle" label="Title SEO" defaultValue={initialPost?.seoTitle} />
        <TextArea name="seoDescription" label="Meta description" defaultValue={initialPost?.seoDescription} rows={3} />
        <TextArea name="ctaMessage" label="Mensaje WhatsApp del artículo" defaultValue={initialPost?.ctaMessage} rows={4} />
      </AdminCard>

      {message ? (
        <p className={`rounded-2xl px-4 py-3 text-sm font-black ${status === "error" ? "bg-red-100 text-red-900" : "bg-emerald-100 text-emerald-900"}`} role="status">
          {message}
        </p>
      ) : null}

      <div className="sticky bottom-0 z-10 grid gap-2 border-t border-white/10 bg-slate-950/95 py-3 sm:grid-cols-3">
        <button type="submit" className="min-h-12 rounded-xl bg-white px-4 py-3 font-black text-slate-950">Guardar borrador</button>
        <button type="button" onClick={() => setPreviewOpen(true)} className="min-h-12 rounded-xl bg-sky-100 px-4 py-3 font-black text-sky-950">Vista previa</button>
        <button type="button" onClick={(event) => event.currentTarget.form && save(event.currentTarget.form, "published")} className="min-h-12 rounded-xl bg-emerald-400 px-4 py-3 font-black text-emerald-950">Publicar</button>
        {initialPost ? (
          <button type="button" onClick={(event) => event.currentTarget.form && save(event.currentTarget.form, "archived")} className="min-h-12 rounded-xl bg-red-100 px-4 py-3 font-black text-red-900 sm:col-span-3">Archivar</button>
        ) : null}
      </div>

      {previewOpen ? (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 p-4">
          <article className="mx-auto max-w-2xl rounded-3xl bg-white p-5 text-slate-950 shadow-2xl">
            <button type="button" onClick={() => setPreviewOpen(false)} className="float-right min-h-11 rounded-xl bg-slate-100 px-3 font-black">Cerrar</button>
            <p className="mt-10 text-xs font-black uppercase tracking-[0.18em] text-sky-700">Vista previa</p>
            <h2 className="mt-3 text-2xl font-black">{(document.querySelector("[name='title']") as HTMLInputElement | null)?.value || "Artículo"}</h2>
            {coverImage ? <Image src={coverImage} alt={coverAlt || "Portada"} width={720} height={405} className="mt-4 aspect-video w-full rounded-2xl object-cover" /> : null}
            <p className="mt-4 text-slate-700">{(document.querySelector("[name='summary']") as HTMLTextAreaElement | null)?.value}</p>
            <p className="mt-4 whitespace-pre-line text-sm leading-7 text-slate-700">{(document.querySelector("[name='content']") as HTMLTextAreaElement | null)?.value}</p>
          </article>
        </div>
      ) : null}
    </form>
  );
}

function normalizeMediaOrder(items: MediaAsset[]) {
  const hasCover = items.some((asset) => asset.isCover);
  return items.map((asset, index) => ({ ...asset, sortOrder: index, isCover: hasCover ? asset.isCover : index === 0 }));
}

function AdminCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-3xl bg-white p-4 text-slate-950 shadow-xl">
      <h2 className="mb-4 text-lg font-black">{title}</h2>
      <div className="grid gap-3">{children}</div>
    </section>
  );
}

function TextField({ name, label, defaultValue, placeholder, value, onChange }: { name: string; label: string; defaultValue?: string; placeholder?: string; value?: string; onChange?: (value: string) => void }) {
  return (
    <label className="grid gap-1 text-sm font-black text-slate-900">
      {label}
      <input name={name} value={value} defaultValue={value === undefined ? defaultValue : undefined} onChange={onChange ? (event) => onChange(event.currentTarget.value) : undefined} placeholder={placeholder} className="min-h-11 w-full min-w-0 rounded-xl border border-slate-300 px-3 text-base font-medium focus-visible:outline focus-visible:outline-4 focus-visible:outline-sky-300" />
    </label>
  );
}

function TextArea({ name, label, defaultValue, rows = 4, helper }: { name: string; label: string; defaultValue?: string; rows?: number; helper?: string }) {
  return (
    <label className="grid gap-1 text-sm font-black text-slate-900">
      {label}
      {helper ? <span className="text-xs font-semibold leading-5 text-slate-600">{helper}</span> : null}
      <textarea name={name} defaultValue={defaultValue} rows={rows} className="min-h-28 w-full min-w-0 rounded-xl border border-slate-300 px-3 py-3 text-base font-medium focus-visible:outline focus-visible:outline-4 focus-visible:outline-sky-300" />
    </label>
  );
}

function SelectField({ name, label, defaultValue, options }: { name: string; label: string; defaultValue?: string; options: readonly string[] }) {
  return (
    <label className="grid gap-1 text-sm font-black text-slate-900">
      {label}
      <select name={name} defaultValue={defaultValue || ""} className="min-h-11 w-full min-w-0 rounded-xl border border-slate-300 px-3 text-base font-medium focus-visible:outline focus-visible:outline-4 focus-visible:outline-sky-300">
        <option value="">Seleccionar</option>
        {options.map((option) => <option key={option} value={option}>{option}</option>)}
      </select>
    </label>
  );
}
