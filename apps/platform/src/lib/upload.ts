import { api } from "./api-client";

const MAX_DIMENSIONS: Record<string, { w: number; h: number }> = {
  avatar: { w: 256, h: 256 },
  "group-cover": { w: 1200, h: 400 },
};

async function resizeToWebp(
  file: File,
  maxW: number,
  maxH: number,
  quality = 0.85,
): Promise<Blob> {
  const bitmap = await createImageBitmap(file);
  const { width: srcW, height: srcH } = bitmap;

  // Scale down while maintaining aspect ratio
  const ratio = Math.min(maxW / srcW, maxH / srcH, 1);
  const dstW = Math.round(srcW * ratio);
  const dstH = Math.round(srcH * ratio);

  const canvas = document.createElement("canvas");
  canvas.width = dstW;
  canvas.height = dstH;

  const ctx = canvas.getContext("2d")!;
  ctx.drawImage(bitmap, 0, 0, dstW, dstH);
  bitmap.close();

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) resolve(blob);
        else reject(new Error("Canvas toBlob failed"));
      },
      "image/webp",
      quality,
    );
  });
}

export async function uploadImage(
  file: File,
  type: "avatar" | "group-cover",
): Promise<string> {
  const { w, h } = MAX_DIMENSIONS[type];
  const blob = await resizeToWebp(file, w, h);

  const { uploadUrl, publicUrl } = await api.post<{
    uploadUrl: string;
    publicUrl: string;
  }>("/api/upload/presign", {
    type,
    contentType: "image/webp",
  });

  const res = await fetch(uploadUrl, {
    method: "PUT",
    body: blob,
    headers: { "Content-Type": "image/webp" },
  });

  if (!res.ok) throw new Error("Upload ke R2 gagal");

  return publicUrl;
}
