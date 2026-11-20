// Dependency-free ZIP writer (STORE method, no compression).
// Entry names are written as UTF-8 (general purpose flag bit 11), so non-Latin file names survive.

const UTF8_FLAG = 0x0800;
const LOCAL_SIG = 0x04034b50;
const CENTRAL_SIG = 0x02014b50;
const END_SIG = 0x06054b50;

const CRC_TABLE = (() => {
  const table = new Uint32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    table[n] = c >>> 0;
  }
  return table;
})();

export function crc32(bytes) {
  let c = 0xffffffff;
  for (let i = 0; i < bytes.length; i++) c = CRC_TABLE[(c ^ bytes[i]) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}

function dosDateTime(date) {
  const time = (date.getHours() << 11) | (date.getMinutes() << 5) | Math.floor(date.getSeconds() / 2);
  const day = ((date.getFullYear() - 1980) << 9) | ((date.getMonth() + 1) << 5) | date.getDate();
  return { time, day };
}

/**
 * @param {{name: string, blob: Blob}[]} entries
 * @param {Date} [now]
 * @returns {Promise<Blob>}
 */
export async function createZip(entries, now = new Date()) {
  if (!entries.length) throw new Error("Nothing to put in the ZIP.");
  if (entries.length > 0xffff) throw new Error("Too many files for one ZIP.");

  const { time, day } = dosDateTime(now);
  const encoder = new TextEncoder();
  const parts = [];
  const central = [];
  let offset = 0;

  for (const entry of entries) {
    const name = encoder.encode(entry.name);
    const data = new Uint8Array(await entry.blob.arrayBuffer());
    if (data.length > 0xffffffff) throw new Error("A file is too large for ZIP (4 GB limit).");
    const crc = crc32(data);

    // Local file header (30 bytes + name)
    const local = new Uint8Array(30 + name.length);
    const lv = new DataView(local.buffer);
    lv.setUint32(0, LOCAL_SIG, true);
    lv.setUint16(4, 20, true);          // version needed
    lv.setUint16(6, UTF8_FLAG, true);   // flags
    lv.setUint16(8, 0, true);           // method: STORE
    lv.setUint16(10, time, true);
    lv.setUint16(12, day, true);
    lv.setUint32(14, crc, true);
    lv.setUint32(18, data.length, true); // compressed size
    lv.setUint32(22, data.length, true); // uncompressed size
    lv.setUint16(26, name.length, true);
    lv.setUint16(28, 0, true);          // extra length
    local.set(name, 30);
    parts.push(local, data);

    // Central directory header (46 bytes + name)
    const cen = new Uint8Array(46 + name.length);
    const cv = new DataView(cen.buffer);
    cv.setUint32(0, CENTRAL_SIG, true);
    cv.setUint16(4, 20, true);          // version made by
    cv.setUint16(6, 20, true);          // version needed
    cv.setUint16(8, UTF8_FLAG, true);
    cv.setUint16(10, 0, true);          // method
    cv.setUint16(12, time, true);
    cv.setUint16(14, day, true);
    cv.setUint32(16, crc, true);
    cv.setUint32(20, data.length, true);
    cv.setUint32(24, data.length, true);
    cv.setUint16(28, name.length, true);
    // 30 extra length, 32 comment length, 34 disk number, 36 internal attrs, 38 external attrs: all zero
    cv.setUint32(42, offset, true);     // local header offset
    cen.set(name, 46);
    central.push(cen);

    offset += local.length + data.length;
    if (offset > 0xffffffff) throw new Error("ZIP exceeds the 4 GB limit.");
  }

  const cdSize = central.reduce((n, c) => n + c.length, 0);
  if (cdSize > 0xffffffff) throw new Error("ZIP exceeds the 4 GB limit.");

  // End of central directory record (22 bytes)
  const end = new Uint8Array(22);
  const ev = new DataView(end.buffer);
  ev.setUint32(0, END_SIG, true);
  ev.setUint16(8, entries.length, true);
  ev.setUint16(10, entries.length, true);
  ev.setUint32(12, cdSize, true);
  ev.setUint32(16, offset, true);

  return new Blob([...parts, ...central, end], { type: "application/zip" });
}
