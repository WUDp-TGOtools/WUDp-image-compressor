// Image properties: dimensions, transparency, file info and (for JPEG) a small Exif reader.
// Everything runs locally. Only the first 512 KB of a JPEG is read for metadata.

const gcd = (a, b) => (b ? gcd(b, a % b) : a);

export async function readProperties(file) {
  const props = {
    name: file.name,
    type: file.type || "unknown",
    size: file.size,
    modified: file.lastModified ? new Date(file.lastModified) : null,
    width: 0,
    height: 0,
    alpha: null,
    exif: null,
    error: null,
  };

  try {
    const bitmap = await createImageBitmap(file);
    props.width = bitmap.width;
    props.height = bitmap.height;
    props.alpha = await hasTransparency(bitmap);
    bitmap.close();
  } catch {
    props.error = "This file could not be decoded.";
  }

  if (file.type === "image/jpeg") {
    try {
      props.exif = parseExif(await file.slice(0, 512 * 1024).arrayBuffer());
    } catch {
      props.exif = null;
    }
  }
  return props;
}

export function aspectRatio(w, h) {
  if (!w || !h) return "—";
  const d = gcd(w, h);
  const a = w / d, b = h / d;
  return a > 100 || b > 100 ? `${(w / h).toFixed(2)} : 1` : `${a} : ${b}`;
}

async function hasTransparency(bitmap) {
  const scale = Math.min(1, 128 / Math.max(bitmap.width, bitmap.height));
  const w = Math.max(1, Math.round(bitmap.width * scale));
  const h = Math.max(1, Math.round(bitmap.height * scale));
  const canvas = new OffscreenCanvas(w, h);
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  ctx.drawImage(bitmap, 0, 0, w, h);
  const data = ctx.getImageData(0, 0, w, h).data;
  for (let i = 3; i < data.length; i += 4) if (data[i] < 255) return true;
  return false;
}

// ---------- Exif (JPEG APP1) ----------

export function parseExif(buffer) {
  const v = new DataView(buffer);
  if (v.byteLength < 4 || v.getUint16(0) !== 0xffd8) return null;
  let off = 2;
  while (off + 4 <= v.byteLength) {
    if (v.getUint8(off) !== 0xff) break;
    const marker = v.getUint8(off + 1);
    if (marker === 0xda || marker === 0xd9) break; // start of scan / end of image
    const len = v.getUint16(off + 2);
    const isExif = off + 10 <= v.byteLength && v.getUint32(off + 4) === 0x45786966 && v.getUint16(off + 8) === 0;
    if (marker === 0xe1 && isExif) return parseTiff(v, off + 10);
    off += 2 + len;
  }
  return null;
}

function parseTiff(v, base) {
  const le = v.getUint16(base) === 0x4949;
  const u16 = (o) => v.getUint16(o, le);
  const u32 = (o) => v.getUint32(o, le);
  const sizes = { 1: 1, 2: 1, 3: 2, 4: 4, 5: 8, 7: 1, 9: 4, 10: 8 };

  const valueOf = (entry, type, count) => {
    const total = (sizes[type] || 1) * count;
    const pos = total <= 4 ? entry + 8 : base + u32(entry + 8);
    switch (type) {
      case 2: {
        let s = "";
        for (let i = 0; i < count; i++) {
          const c = v.getUint8(pos + i);
          if (!c) break;
          s += String.fromCharCode(c);
        }
        return s.trim();
      }
      case 3: return u16(pos);
      case 4: return u32(pos);
      case 5: { const n = u32(pos), d = u32(pos + 4); return d ? n / d : 0; }
      case 10: { const n = v.getInt32(pos, le), d = v.getInt32(pos + 4, le); return d ? n / d : 0; }
      default: return null;
    }
  };

  const readIfd = (ifdOffset) => {
    const tags = {};
    const pos = base + ifdOffset;
    const n = u16(pos);
    for (let i = 0; i < n; i++) {
      const e = pos + 2 + i * 12;
      tags[u16(e)] = valueOf(e, u16(e + 2), u32(e + 4));
    }
    return tags;
  };

  const ifd0 = readIfd(u32(base + 4));
  const exif = ifd0[0x8769] ? readIfd(ifd0[0x8769]) : {};

  return {
    make: ifd0[0x010f] ?? null,
    model: ifd0[0x0110] ?? null,
    orientation: ifd0[0x0112] ?? null,
    dateTime: ifd0[0x0132] ?? null,
    dateOriginal: exif[0x9003] ?? null,
    exposure: exif[0x829a] ?? null,
    fNumber: exif[0x829d] ?? null,
    iso: exif[0x8827] ?? null,
    focal: exif[0x920a] ?? null,
    gps: !!ifd0[0x8825],
  };
}

export function formatExposure(x) {
  if (!x) return null;
  return x >= 1 ? `${x.toFixed(1)} s` : `1/${Math.round(1 / x)} s`;
}

// ---------- metadata helpers used when metadata is kept ----------

// Returns the raw APP1 Exif segment (marker included) of a JPEG, or null.
export function extractExifSegment(buffer) {
  const v = new DataView(buffer);
  if (v.byteLength < 4 || v.getUint16(0) !== 0xffd8) return null;
  let off = 2;
  while (off + 4 <= v.byteLength) {
    if (v.getUint8(off) !== 0xff) break;
    const marker = v.getUint8(off + 1);
    if (marker === 0xda || marker === 0xd9) break;
    const len = v.getUint16(off + 2);
    const isExif = off + 10 <= v.byteLength && v.getUint32(off + 4) === 0x45786966 && v.getUint16(off + 8) === 0;
    if (marker === 0xe1 && isExif) {
      return new Uint8Array(buffer.slice(off, off + 2 + len));
    }
    off += 2 + len;
  }
  return null;
}

// Sets the Orientation tag to 1 ("normal"). Pixels are already rotated when decoded,
// so keeping the original orientation would rotate the image twice.
export function neutralizeOrientation(segment) {
  const copy = new Uint8Array(segment);
  const v = new DataView(copy.buffer);
  const base = 10; // after marker (2), length (2), "Exif\0\0" (6)
  const le = v.getUint16(base) === 0x4949;
  const u16 = (o) => v.getUint16(o, le);
  const u32 = (o) => v.getUint32(o, le);
  const ifd = base + u32(base + 4);
  const n = u16(ifd);
  for (let i = 0; i < n; i++) {
    const e = ifd + 2 + i * 12;
    if (u16(e) === 0x0112) {
      v.setUint16(e + 8, 1, le);
      break;
    }
  }
  return copy;
}

// Inserts an APP1 segment into a JPEG blob after SOI (and after APP0/JFIF if present).
export async function injectJpegSegment(blob, segment) {
  const bytes = new Uint8Array(await blob.arrayBuffer());
  if (bytes[0] !== 0xff || bytes[1] !== 0xd8) return blob;
  let at = 2;
  if (bytes[2] === 0xff && bytes[3] === 0xe0) at = 4 + ((bytes[4] << 8) | bytes[5]);
  const out = new Uint8Array(bytes.length + segment.length);
  out.set(bytes.subarray(0, at), 0);
  out.set(segment, at);
  out.set(bytes.subarray(at), at + segment.length);
  return new Blob([out], { type: blob.type });
}
