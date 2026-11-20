// Compression worker. Decoding, drawing and encoding run here, off the UI thread.
import { searchQuality } from "./search.js";
import { extractExifSegment, neutralizeOrientation, injectJpegSegment } from "./props.js";

const LABELS = { "image/webp": "WebP", "image/jpeg": "JPEG", "image/avif": "AVIF", "image/png": "PNG" };
const clamp = (n, min, max) => Math.min(max, Math.max(min, n));

async function compress({ file, type, useTarget, targetBytes, quality, background, stripMeta }) {
  let bitmap;
  try {
    bitmap = await createImageBitmap(file);
  } catch {
    throw new Error("This file could not be decoded.");
  }

  try {
    const { width, height } = bitmap;
    const canvas = new OffscreenCanvas(width, height);
    // Only JPEG lacks an alpha channel. WebP, AVIF and PNG keep transparency.
    const ctx = canvas.getContext("2d", { alpha: type !== "image/jpeg" });
    if (!ctx) throw new Error("Could not create a drawing context.");
    if (type === "image/jpeg") {
      ctx.fillStyle = background || "#ffffff";
      ctx.fillRect(0, 0, width, height);
    }
    ctx.drawImage(bitmap, 0, 0);

    const encodeAt = async (q) => {
      const options = { type };
      if (q !== undefined) options.quality = q;
      const blob = await canvas.convertToBlob(options);
      // Browsers silently fall back to PNG when they cannot encode the requested type.
      if (blob.type !== type) throw new Error(`${LABELS[type]} encoding is not supported by this browser.`);
      return blob;
    };

    let blob, qualityOut = null, reached = true;
    if (type === "image/png") {
      blob = await encodeAt();
    } else if (useTarget) {
      const found = await searchQuality({ encode: encodeAt, targetBytes });
      blob = found.blob;
      qualityOut = Math.round(found.quality * 100);
      reached = found.reached;
    } else {
      const q = clamp(quality ?? 80, 10, 100) / 100;
      blob = await encodeAt(q);
      qualityOut = Math.round(q * 100);
    }

    // Metadata: canvas output has none. When the user keeps metadata, copy the JPEG Exif block.
    let metaKept = false;
    if (!stripMeta && type === "image/jpeg" && file.type === "image/jpeg") {
      const seg = extractExifSegment(await file.slice(0, 512 * 1024).arrayBuffer());
      if (seg) {
        blob = await injectJpegSegment(blob, neutralizeOrientation(seg));
        metaKept = true;
      }
    }

    return { blob, width, height, quality: qualityOut, reached, metaKept };
  } finally {
    bitmap.close?.();
  }
}

self.onmessage = async ({ data }) => {
  const { id } = data;
  try {
    const result = await compress(data);
    self.postMessage({ id, ok: true, ...result });
  } catch (error) {
    self.postMessage({ id, ok: false, error: error?.message || "Compression failed." });
  }
};
