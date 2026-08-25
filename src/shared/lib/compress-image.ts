export interface CompressImageOptions {
  maxDimension?: number;
  quality?: number;
}

/**
 * Compresses a photo before upload (cf. cahier des charges §4.3, §7.4 —
 * sobriety on mobile data). Resizes to at most `maxDimension` on the longer
 * side and re-encodes as JPEG at `quality`. Runs entirely client-side via
 * Canvas — no dependency needed.
 */
export async function compressImage(
  file: File,
  { maxDimension = 1280, quality = 0.7 }: CompressImageOptions = {},
): Promise<Blob> {
  const bitmap = await createImageBitmap(file);
  const scale = Math.min(
    1,
    maxDimension / Math.max(bitmap.width, bitmap.height),
  );
  const width = Math.round(bitmap.width * scale);
  const height = Math.round(bitmap.height * scale);

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext("2d");
  if (!ctx) {
    throw new Error("Canvas 2D context unavailable — cannot compress image");
  }
  ctx.drawImage(bitmap, 0, 0, width, height);
  bitmap.close();

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) =>
        blob ? resolve(blob) : reject(new Error("Image compression failed")),
      "image/jpeg",
      quality,
    );
  });
}
