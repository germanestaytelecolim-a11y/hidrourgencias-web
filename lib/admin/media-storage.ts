import fs from "node:fs/promises";
import path from "node:path";
import { randomUUID } from "node:crypto";

import { put } from "@vercel/blob";

const allowedMimeTypes = new Map([
  ["image/jpeg", "jpg"],
  ["image/png", "png"],
  ["image/webp", "webp"],
]);

const maxImageSize = 12 * 1024 * 1024;
const unsupportedHeicMessage = "Este formato no puede procesarse todavía. Convierte o selecciona otra fotografía.";

export function validateImageFile(file: File) {
  if (file.type === "image/heic" || file.type === "image/heif" || /\.hei[cf]$/i.test(file.name)) {
    return unsupportedHeicMessage;
  }

  if (!allowedMimeTypes.has(file.type)) {
    return "Formato no permitido. Usa JPG, PNG o WEBP.";
  }

  if (file.size > maxImageSize) {
    return "La fotografía supera el tamaño máximo de 12 MB.";
  }

  return "";
}

export async function storeAdminImage(file: File) {
  const validation = validateImageFile(file);
  if (validation) {
    throw new Error(validation);
  }

  const extension = allowedMimeTypes.get(file.type) ?? "jpg";
  const filename = `${new Date().toISOString().slice(0, 10)}-${randomUUID()}.${extension}`;

  if (process.env.BLOB_READ_WRITE_TOKEN && process.env.NODE_ENV === "production") {
    const blob = await put(`admin/evidencias/${filename}`, file, {
      access: "public",
      contentType: file.type,
      addRandomSuffix: false,
    });

    return {
      url: blob.url,
      thumbnailUrl: blob.url,
    };
  }

  if (process.env.NODE_ENV === "production" && process.env.ADMIN_STORAGE_DRIVER !== "local") {
    throw new Error("Falta BLOB_READ_WRITE_TOKEN para subir fotografías en producción.");
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const mediaDir = path.join(process.cwd(), ".admin-data", "media");
  await fs.mkdir(mediaDir, { recursive: true });
  await fs.writeFile(path.join(mediaDir, filename), buffer);

  return {
    url: `/api/admin/media/file/${filename}`,
    thumbnailUrl: `/api/admin/media/file/${filename}`,
  };
}

export async function readLocalAdminMedia(filename: string) {
  if (!/^[a-zA-Z0-9._-]+$/.test(filename)) {
    return null;
  }

  const mediaPath = path.join(process.cwd(), ".admin-data", "media", filename);

  try {
    const data = await fs.readFile(mediaPath);
    const extension = filename.split(".").pop()?.toLowerCase();
    const contentType =
      extension === "png" ? "image/png" : extension === "webp" ? "image/webp" : "image/jpeg";
    return { data, contentType };
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") return null;
    throw error;
  }
}
