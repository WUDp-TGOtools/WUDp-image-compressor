import { createZip } from "./zip.js";
import { createViewer } from "./viewer.js";
import { readProperties, aspectRatio, formatExposure } from "./props.js";
import { createTerminal } from "./terminal.js";
import { t, setLang, detectLang, currentLang, LANGS } from "./i18n.js";
import { createTour } from "./tour.js";
import { initHelp } from "./help.js";

const VERSION = "1.0.0";
const $ = (id) => document.getElementById(id);
const $$ = (sel) => [...document.querySelectorAll(sel)];

const FORMATS = {
  "image/webp": { ext: "webp", label: "WebP", lossy: true },
  "image/jpeg": { ext: "jpg", label: "JPEG", lossy: true },
  "image/avif": { ext: "avif", label: "AVIF", lossy: true },
  "image/png": { ext: "png", label: "PNG", lossy: false },
};
const SIMPLE_FORMATS = ["image/webp", "image/jpeg", "image/avif"];
const MAX_FILE_BYTES = 50 * 1024 * 1024;
const MIN_TARGET_BYTES = 1024;
const MAX_TARGET_BYTES = 50 * 1024 * 1024;
const THEME_KEY = "pixelpress-theme";

const state = {
  mode: "simple",
  format: "image/webp",
  quality: 80,
  useTarget: true,
  targetValue: "200",
  targetUnit: "KB",
  jpegBackground: "#ffffff",
  stripMeta: true,
  theme: "light",
  showProps: false,
  supported: { "image/webp": true, "image/jpeg": true, "image/png": true, "image/avif": false },
  files: [],
  selectedId: null,
  busy: false,
  progress: { done: 0, total: 0 },
};

// ---------- helpers ----------

const clamp = (n, lo, hi) => Math.min(hi, Math.max(lo, n));
const uid = () => globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(36).slice(2)}`;
const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);

function fmtBytes(bytes) {
  if (!Number.isFinite(bytes)) return "—";
  if (bytes < 1024) return `${bytes} B`;
  const units = ["KB", "MB", "GB"];
  let n = bytes / 1024, i = 0;
  while (n >= 1024 && i < units.length - 1) { n /= 1024; i++; }
  return `${n.toFixed(n >= 100 ? 0 : n >= 10 ? 1 : 2)} ${units[i]}`;
}

function savingsText(original, output) {
  if (!original) return "";
  const pct = Math.round((1 - output / original) * 100);
  return pct >= 0 ? `${pct}% ↓` : `${-pct}% ↑`;
}

function baseName(name) {
  return name.replace(/\.[^.]+$/, "").replace(/[\\/:*?"<>|\u0000-\u001f]/g, "_") || "image";
}

function outputName(item) {
  return `${baseName(item.file.name)}-optimized.${item.result.ext}`;
}

function rawTargetBytes() {
  const v = Number(state.targetValue);
  if (!Number.isFinite(v) || v <= 0) return NaN;
  return v * (state.targetUnit === "MB" ? 1024 * 1024 : 1024);
}

function targetBytes() {
  const raw = rawTargetBytes();
  return Number.isFinite(raw) ? clamp(Math.round(raw), MIN_TARGET_BYTES, MAX_TARGET_BYTES) : NaN;
}

function targetActive() {
  return FORMATS[state.format].lossy && (state.mode === "simple" || state.useTarget);
}

function buildOptions() {
  const useTarget = targetActive();
  const lossy = FORMATS[state.format].lossy;
  return {
    type: state.format,
    useTarget,
    targetBytes: useTarget ? targetBytes() : 0,
    quality: lossy && !useTarget ? clamp(state.quality, 10, 100) : null,
    background: state.format === "image/jpeg" ? state.jpegBackground : null,
    stripMeta: state.stripMeta,
  };
}

const currentKey = () => JSON.stringify(buildOptions());
const selectedItem = () => state.files.find((f) => f.id === state.selectedId);
const itemByIndex = (n) => state.files[n - 1];

function statusOf(item, key) {
  if (item.status === "processing") return "working";
  if (item.status === "error") return "failed";
  if (!item.result) return "pending";
  return item.result.key !== key ? "outdated" : "done";
}

// ---------- toast & status ----------

let toastTimer;
function toast(message) {
  if (!message) return;
  const el = $("toast");
  el.textContent = message;
  el.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove("show"), 3600);
}

function setStatus(message) {
  $("statusText").textContent = message;
}

function setIdleStatus() {
  const n = state.files.length;
  if (!n) return setStatus(t("status.ready"));
  const total = state.files.reduce((s, f) => s + f.file.size, 0);
  setStatus(t("status.summary", { n, size: fmtBytes(total) }));
}

// ---------- theme ----------

const MOON = '<path d="M13.5 9.5A5.5 5.5 0 0 1 6.5 2.5a5.5 5.5 0 1 0 7 7z"/>';
const SUN = '<circle cx="8" cy="8" r="3"/><path d="M8 1.5v1.8M8 12.7v1.8M1.5 8h1.8M12.7 8h1.8M3.4 3.4l1.3 1.3M11.3 11.3l1.3 1.3M3.4 12.6l1.3-1.3M11.3 4.7l1.3-1.3"/>';

function applyTheme(theme) {
  state.theme = theme === "dark" ? "dark" : "light";
  document.documentElement.dataset.theme = state.theme;
  try { localStorage.setItem(THEME_KEY, state.theme); } catch { /* storage may be blocked */ }
  $("themeBtn").setAttribute("aria-pressed", String(state.theme === "dark"));
  $("themeIcon").innerHTML = state.theme === "dark" ? SUN : MOON;
  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.content = state.theme === "dark" ? "#1b2030" : "#245edb";
}

function initTheme() {
  let saved = null;
  try { saved = localStorage.getItem(THEME_KEY); } catch { /* ignore */ }
  const system = matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  applyTheme(saved || system);
}

// ---------- format support ----------

async function probeFormat(type) {
  try {
    const canvas = document.createElement("canvas");
    canvas.width = canvas.height = 2;
    const blob = await new Promise((resolve) => canvas.toBlob(resolve, type, 0.8));
    return !!blob && blob.type === type;
  } catch {
    return false;
  }
}

async function detectFormats() {
  await Promise.all(Object.keys(FORMATS).map(async (type) => {
    state.supported[type] = await probeFormat(type);
  }));
  ensureFormat();
}

function ensureFormat() {
  const allowed = state.mode === "simple" ? SIMPLE_FORMATS : Object.keys(FORMATS);
  if (!allowed.includes(state.format) || !state.supported[state.format]) {
    state.format = allowed.find((t2) => state.supported[t2]) ?? "image/png";
  }
}

// ---------- worker ----------

let worker = null;
const pending = new Map();

function getWorker() {
  if (worker) return worker;
  worker = new Worker(new URL("./worker.js", import.meta.url), { type: "module" });
  worker.addEventListener("message", ({ data }) => {
    const job = pending.get(data.id);
    if (!job) return;
    pending.delete(data.id);
    if (data.ok) job.resolve(data);
    else job.reject(new Error(data.error || "Compression failed."));
  });
  worker.addEventListener("error", () => {
    for (const job of pending.values()) job.reject(new Error("The compression worker stopped unexpectedly."));
    pending.clear();
    worker.terminate();
    worker = null;
  });
  return worker;
}

function compressFile(item, opts) {
  return new Promise((resolve, reject) => {
    pending.set(item.id, { resolve, reject });
    getWorker().postMessage({ id: item.id, file: item.file, ...opts });
  });
}

// ---------- state changes ----------

function releaseItem(item) {
  URL.revokeObjectURL(item.preview);
  if (item.result) URL.revokeObjectURL(item.result.url);
}

function setResult(item, data, opts, key) {
  if (item.result) URL.revokeObjectURL(item.result.url);
  item.result = {
    blob: data.blob,
    url: URL.createObjectURL(data.blob),
    ext: FORMATS[opts.type].ext,
    type: opts.type,
    quality: data.quality,
    reached: data.reached,
    lossless: opts.type === "image/png",
    useTarget: opts.useTarget,
    targetBytes: opts.targetBytes,
    metaKept: !!data.metaKept,
    width: data.width,
    height: data.height,
    key,
  };
  item.width = data.width;
  item.height = data.height;
  item.status = "done";
  item.error = null;
}

function describeResult(r) {
  if (r.lossless) return "PNG · lossless";
  if (r.useTarget) {
    return r.reached
      ? `≤ ${fmtBytes(r.targetBytes)} · q${r.quality}`
      : `q${r.quality} (min)`;
  }
  return `q${r.quality}`;
}

function addFiles(list) {
  let added = 0;
  for (const file of list) {
    if (!file.type.startsWith("image/")) {
      toast(t("toast.notImage", { name: file.name }));
      continue;
    }
    if (file.size > MAX_FILE_BYTES) {
      toast(t("toast.tooBig", { name: file.name }));
      continue;
    }
    const item = {
      id: uid(), file, preview: URL.createObjectURL(file),
      width: 0, height: 0, status: "pending", error: null, result: null,
      propsPromise: null, props: null,
    };
    state.files.push(item);
    if (!state.selectedId) state.selectedId = item.id;
    probeDimensions(item);
    added++;
  }
  if (added) toast(t("toast.added", { n: added }));
  $("fileInput").value = "";
  renderAll();
  if (!state.busy) setIdleStatus();
  return added;
}

function probeDimensions(item) {
  const img = new Image();
  img.onload = () => {
    item.width = img.naturalWidth;
    item.height = img.naturalHeight;
    if (state.files.includes(item)) renderAll();
  };
  img.src = item.preview;
}

function removeItem(id) {
  const item = state.files.find((f) => f.id === id);
  if (!item) return "";
  if (item.status === "processing") return t("toast.removeBusy");
  const name = item.file.name;
  releaseItem(item);
  state.files = state.files.filter((f) => f !== item);
  if (state.selectedId === id) state.selectedId = state.files[0]?.id ?? null;
  renderAll();
  if (!state.busy) setIdleStatus();
  return t("toast.removed", { name });
}

function clearAll() {
  if (state.busy) return t("toast.busy");
  const n = state.files.length;
  state.files.forEach(releaseItem);
  state.files = [];
  state.selectedId = null;
  renderAll();
  setIdleStatus();
  return t("toast.cleared", { n });
}

// ---------- processing ----------

async function processAll(onEach) {
  if (state.busy) return { error: t("toast.alreadyBusy") };
  if (!state.files.length) return { error: t("toast.noFiles") };
  const opts = buildOptions();
  const label = FORMATS[opts.type].label;

  if (!state.supported[opts.type]) return { error: t("toast.unsupported", { format: label }) };
  if (opts.useTarget && !Number.isFinite(opts.targetBytes)) return { error: t("toast.enterTarget") };

  const key = JSON.stringify(opts);
  const todo = state.files.filter((f) => f.status === "error" || !f.result || f.result.key !== key);
  if (!todo.length) return { error: t("toast.optimized") };

  state.busy = true;
  state.progress = { done: 0, total: todo.length };
  $("progress").hidden = false;
  setStatus(t("status.compressing", { done: 0, total: todo.length }));
  renderAll();

  let failed = 0, unreachable = 0;
  for (const item of todo) {
    item.status = "processing";
    item.error = null;
    renderAll();
    try {
      const data = await compressFile(item, opts);
      setResult(item, data, opts, key);
      const r = item.result;
      if (!r.reached) unreachable++;
      onEach?.(
        `  ${r.reached ? "✓" : "!"} ${item.file.name}  ${fmtBytes(item.file.size)} → ${fmtBytes(r.blob.size)} (${savingsText(item.file.size, r.blob.size)})  ${describeResult(r)}${r.metaKept ? "  [EXIF kept]" : ""}`,
        r.reached ? "ok" : "warn",
      );
    } catch (err) {
      failed++;
      const msg = /decoded/.test(err.message) ? t("props.decodeError") : err.message;
      item.status = "error";
      item.error = msg;
      onEach?.(`  ✗ ${item.file.name}: ${msg}`, "err");
      toast(`${item.file.name}: ${msg}`);
    }
    state.progress.done++;
    const { done, total } = state.progress;
    $("progressFill").style.width = `${Math.round((done / total) * 100)}%`;
    setStatus(t("status.compressing", { done, total }));
    renderAll();
  }

  state.busy = false;
  $("progress").hidden = true;
  $("progressFill").style.width = "0%";
  const ok = todo.length - failed;
  setStatus(t("status.finished", {
    ok, total: todo.length,
    failed: failed ? t("status.failed", { n: failed }) : "",
    unreach: unreachable ? t("status.aboveTarget", { n: unreachable }) : "",
  }));
  renderAll();
  return { ok, failed, unreachable, total: todo.length };
}

// ---------- downloads ----------

function downloadBlob(blob, name) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1500);
}

function downloadSelected() {
  const item = selectedItem();
  if (!item?.result) return t("toast.noResultSel");
  downloadBlob(item.result.blob, outputName(item));
  return t("toast.saved", { name: outputName(item) });
}

async function downloadZip() {
  const done = state.files.filter((f) => f.result);
  if (!done.length) return t("toast.noResults");

  const used = new Set();
  const entries = done.map((item) => {
    const name = outputName(item);
    let candidate = name, n = 2;
    while (used.has(candidate.toLowerCase())) candidate = name.replace(/(\.[^.]+)$/, `-${n++}$1`);
    used.add(candidate.toLowerCase());
    return { name: candidate, blob: item.result.blob };
  });

  setStatus(t("status.building"));
  try {
    const zip = await createZip(entries);
    const stamp = new Date().toISOString().slice(0, 16).replace(/[:T]/g, "-");
    downloadBlob(zip, `wudp-image-compressor-${stamp}.zip`);
    setIdleStatus();
    return t("toast.zipDone", { n: entries.length });
  } catch (err) {
    setIdleStatus();
    return t("toast.zipFail", { msg: err.message });
  }
}

// ---------- properties ----------

const yesNo = (v) => (v ? t("props.yes") : t("props.no"));
const dateText = (d) => (d ? d.toLocaleString(currentLang()) : "—");

function ensureProps(item) {
  if (!item.propsPromise) {
    item.propsPromise = readProperties(item.file).then((p) => (item.props = p));
  }
  return item.propsPromise;
}

function propRows(p, r, stripMeta) {
  const origDims = p.width ? `${p.width} × ${p.height}` : "—";
  const outDims = r ? `${r.width} × ${r.height}` : "—";
  const outAlpha = r ? (r.type === "image/jpeg" ? t("props.flattened") : yesNo(p.alpha)) : "—";
  const ex = p.exif;
  const kept = r ? (r.metaKept ? t("props.kept") : t("props.removed")) : "—";
  const camera = ex
    ? ([ex.make, ex.model].filter(Boolean).join(" ") || "—")
    : (p.type === "image/jpeg" ? "—" : t("props.notForFormat"));
  const exposure = ex
    ? ([formatExposure(ex.exposure), ex.fNumber ? `f/${ex.fNumber.toFixed(1)}` : null, ex.iso ? `ISO ${ex.iso}` : null, ex.focal ? `${Math.round(ex.focal)} mm` : null].filter(Boolean).join(" · ") || "—")
    : "—";
  void stripMeta;
  return [
    [t("props.format"), p.type.replace("image/", "").toUpperCase(), r ? FORMATS[r.type].label.toUpperCase() : "—"],
    [t("props.dims"), origDims, outDims],
    [t("props.mp"), p.width ? ((p.width * p.height) / 1e6).toFixed(2) + " MP" : "—", r ? ((r.width * r.height) / 1e6).toFixed(2) + " MP" : "—"],
    [t("props.aspect"), aspectRatio(p.width, p.height), r ? aspectRatio(r.width, r.height) : "—"],
    [t("props.size"), fmtBytes(p.size), r ? fmtBytes(r.blob.size) : "—"],
    [t("props.alpha"), yesNo(p.alpha), outAlpha],
    [t("props.modified"), dateText(p.modified), "—"],
    [t("props.camera"), camera, ex ? kept : "—"],
    [t("props.taken"), ex ? (ex.dateOriginal || ex.dateTime || "—") : "—", ex ? kept : "—"],
    [t("props.exposure"), exposure, ex ? kept : "—"],
    [t("props.orientation"), ex?.orientation ? String(ex.orientation) : "—", t("props.applied")],
    [t("props.gps"), ex ? yesNo(ex.gps) : "—", ex ? kept : "—"],
  ];
}

async function renderProps(item) {
  const body = $("propsBody");
  if (!item) {
    body.innerHTML = `<p class="muted">${esc(t("props.selectHint"))}</p>`;
    return;
  }
  if (!item.props) body.innerHTML = `<p class="muted">${esc(t("props.reading"))}</p>`;
  const p = await ensureProps(item);
  if (!state.showProps || state.selectedId !== item.id) return;

  const rows = propRows(p, item.result, state.stripMeta);
  const trs = rows.map(([k, a, b]) => `<tr><th>${esc(k)}</th><td>${esc(a)}</td><td>${esc(b)}</td></tr>`).join("");
  const gpsNote = p.exif?.gps
    ? `<p class="privacy-note"><b>${esc(t("props.gpsFound"))}</b> ${esc(item.result?.metaKept ? t("props.gpsKeep") : t("props.gpsStrip"))}</p>`
    : "";
  const err = p.error ? `<p class="privacy-note">${esc(t("props.decodeError"))}</p>` : "";
  body.innerHTML = `
    <table class="props-table">
      <thead><tr><th></th><th>${esc(t("props.original"))}</th><th>${esc(t("props.optimized"))}</th></tr></thead>
      <tbody>${trs}</tbody>
    </table>
    ${gpsNote}${err}
    <p class="hint">${esc(t("props.footnote"))}</p>`;
}

// ---------- rendering ----------

function rowHtml(item, key) {
  const selected = item.id === state.selectedId;
  const status = statusOf(item, key);
  const dims = item.width ? `${item.width} × ${item.height} · ` : "";
  let right;
  if (status === "done") {
    right = `<b>${fmtBytes(item.result.blob.size)}</b><small class="${item.result.blob.size <= item.file.size ? "good" : "bad"}">${savingsText(item.file.size, item.result.blob.size)}</small>`;
  } else {
    const map = {
      working: ["tag-working", t("row.working")],
      failed: ["tag-error", t("row.failed")],
      outdated: ["tag-stale", t("row.outdated")],
      pending: ["tag-pending", t("row.pending")],
    };
    const [cls, text] = map[status];
    right = `<span class="tag ${cls}">${text}</span>`;
  }
  const name = esc(item.file.name);
  return `
    <div class="row${selected ? " is-selected" : ""}" data-row="${item.id}">
      <div class="row-main" data-select="${item.id}" role="button" tabindex="0" aria-pressed="${selected}" title="${name}">
        <img class="thumb" src="${item.preview}" alt="">
        <div class="row-meta"><b>${name}</b><small>${dims}${fmtBytes(item.file.size)}</small></div>
      </div>
      <div class="row-status">${right}</div>
      <button class="row-remove" type="button" data-remove="${item.id}" aria-label="${esc(t("row.remove"))} ${name}">×</button>
    </div>`;
}

function renderQueue() {
  const key = currentKey();
  $("queueCount").textContent = state.files.length;
  $("fileList").innerHTML = state.files.length
    ? state.files.map((item) => rowHtml(item, key)).join("")
    : `<div class="empty"><span aria-hidden="true">▧</span><p>${esc(t("files.empty"))}</p><small>${esc(t("files.emptyHint"))}</small></div>`;
}

function updateStats() {
  const done = state.files.filter((f) => f.result);
  const before = done.reduce((s, f) => s + f.file.size, 0);
  const after = done.reduce((s, f) => s + f.result.blob.size, 0);
  const pct = before ? Math.round((1 - after / before) * 100) : null;
  $("savedPercent").innerHTML = pct === null ? "—" : `${pct}<small>%</small>`;
  $("savedText").textContent = done.length
    ? t(after <= before ? "results.saved" : "results.added", { size: fmtBytes(Math.abs(before - after)), n: done.length })
    : t("results.none");
  $("totalOriginal").textContent = done.length ? fmtBytes(before) : "—";
  $("totalOptimized").textContent = done.length ? fmtBytes(after) : "—";
}

let viewer = null;

function updatePreview() {
  const item = selectedItem();
  const key = currentKey();
  $("stageEmpty").hidden = !!item;

  if (!item) {
    viewer?.clear();
    $("previewState").textContent = t("preview.none");
    $("zoomLabel").textContent = "—";
    $("facts").innerHTML = "";
    renderProps(null);
    return;
  }

  const r = item.result;
  const outdated = !!r && r.key !== key;
  const hasAfter = !!r;

  viewer.showImages({
    key: item.id,
    width: item.width,
    height: item.height,
    url: item.preview,
    optimizedUrl: hasAfter ? r.url : null,
  });

  $("tagAfter").hidden = !hasAfter;
  $("stageNote").hidden = hasAfter && !outdated;
  $("stageNote").textContent = item.status === "processing"
    ? t("preview.compressing")
    : outdated
      ? t("preview.outdatedNote")
      : t("preview.compressNote");

  let chip = t("preview.original");
  if (item.status === "processing") chip = t("preview.processing");
  else if (outdated) chip = t("preview.outdated");
  else if (hasAfter) chip = t("preview.compare");
  $("previewState").textContent = chip;

  const rows = [
    [t("props.dims"), item.width ? `${item.width} × ${item.height}` : "—"],
    [t("results.original"), fmtBytes(item.file.size)],
    [t("results.optimized"), hasAfter ? `${fmtBytes(r.blob.size)} (${savingsText(item.file.size, r.blob.size)})` : "—"],
    [t("facts.encoding"), hasAfter ? describeResult(r) : "—"],
  ];
  $("facts").innerHTML = rows.map(([k, v]) => `<div><dt>${esc(k)}</dt><dd>${esc(v)}</dd></div>`).join("");

  if (state.showProps) renderProps(item);
}

function syncControls() {
  const simple = state.mode === "simple";
  const lossy = FORMATS[state.format].lossy;
  const active = targetActive();

  $("settingsPanel").dataset.mode = state.mode;
  $$("[data-mode-btn]").forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.modeBtn === state.mode)));

  $$('input[name="format"]').forEach((input) => {
    input.checked = input.value === state.format;
    input.disabled = !state.supported[input.value];
  });
  $$(".fmt").forEach((label) => {
    const input = label.querySelector("input");
    label.classList.toggle("is-unsupported", !state.supported[input.value]);
  });

  $("targetToggle").checked = simple ? true : state.useTarget;
  $("targetToggle").disabled = !lossy;
  $("targetValue").disabled = !active;
  $("targetUnit").disabled = !active;
  if ($("targetValue").value !== String(state.targetValue)) $("targetValue").value = state.targetValue;
  $("targetValue").classList.toggle("invalid", active && !Number.isFinite(rawTargetBytes()));
  $("targetUnit").value = state.targetUnit;

  const raw = rawTargetBytes();
  $$("[data-value]").forEach((btn) => {
    const bytes = Number(btn.dataset.value) * (btn.dataset.unit === "MB" ? 1048576 : 1024);
    btn.classList.toggle("is-on", bytes === raw && active);
    btn.disabled = !lossy;
  });

  $("targetHint").textContent = !lossy
    ? t("hint.targetPng")
    : active ? t("hint.targetBest") : t("hint.targetOff");

  const slider = $("qualitySlider");
  slider.value = state.quality;
  slider.disabled = !lossy || active;
  slider.style.setProperty("--fill", `${((state.quality - 10) / 90) * 100}%`);
  $("qualityValue").textContent = active ? "auto" : lossy ? `${state.quality}%` : "—";
  $("qualityHint").textContent = !lossy
    ? t("hint.qualityPng")
    : active ? t("hint.qualityAuto") : t("hint.qualityManual");

  $("bgField").hidden = state.format !== "image/jpeg";
  $("jpegBg").value = state.jpegBackground;

  $("metaToggle").checked = state.stripMeta;
  $("metaHint").hidden = state.stripMeta;

  const hints = {
    "image/webp": t("fmt.webp"),
    "image/jpeg": t("fmt.jpeg"),
    "image/avif": state.supported["image/avif"] ? t("fmt.avif") : t("fmt.avifNo"),
    "image/png": t("fmt.png"),
  };
  $("formatHint").textContent = hints[state.format];

  $("propsBtn").setAttribute("aria-pressed", String(state.showProps));
  $("propsCard").hidden = !state.showProps;
}

function syncButtons() {
  const hasFiles = state.files.length > 0;
  const hasResults = state.files.some((f) => f.result);
  const sel = selectedItem();
  const targetBad = targetActive() && !Number.isFinite(targetBytes());
  const canCompress = hasFiles && !state.busy && !targetBad;

  const label = state.busy
    ? t("preview.compressing")
    : targetActive() ? t("btn.compressTarget") : t("btn.compressImages");
  $("processBtn").disabled = !canCompress;
  $("processBtn").querySelector("span").textContent = label;
  $("toolCompress").disabled = !canCompress;
  $("toolClear").disabled = !hasFiles || state.busy;
  $("toolZip").disabled = !hasResults || state.busy;
  $("downloadZipBtn").disabled = !hasResults || state.busy;
  $("downloadSelectedBtn").disabled = !sel?.result || state.busy;
  $("settingsPanel").inert = state.busy;
}

function renderAll() {
  renderQueue();
  updateStats();
  updatePreview();
  syncControls();
  syncButtons();
}

// ---------- settings handlers ----------

function setMode(mode) {
  if (state.mode === mode) return;
  state.mode = mode;
  ensureFormat();
  renderAll();
}

// ---------- terminal API: the same operations as the UI, as plain functions ----------

const api = {
  version: VERSION,

  list() {
    const key = currentKey();
    return state.files.map((f, i) => ({
      index: i + 1,
      name: f.file.name,
      sizeText: fmtBytes(f.file.size),
      resultText: f.result ? fmtBytes(f.result.blob.size) : "—",
      status: statusOf(f, key),
      selected: f.id === state.selectedId,
    }));
  },

  pickFiles() {
    $("fileInput").click();
  },

  remove(n) {
    const item = itemByIndex(n);
    return item ? removeItem(item.id) : `No file ${n}. Use 'ls' to see the list.`;
  },

  clear() {
    return clearAll();
  },

  select(n) {
    const item = itemByIndex(n);
    if (!item) return `No file ${n}. Use 'ls' to see the list.`;
    state.selectedId = item.id;
    renderAll();
    return `selected ${n}: ${item.file.name}`;
  },

  async describe(n) {
    const item = n ? itemByIndex(n) : selectedItem();
    if (!item) return ["No file selected. Use 'select <n>' first."];
    const p = await ensureProps(item);
    const lines = [`${p.name}`];
    for (const [k, a, b] of propRows(p, item.result, state.stripMeta)) {
      lines.push(`  ${k.padEnd(14)} ${a}${item.result ? `   →  ${b}` : ""}`);
    }
    if (p.exif?.gps) lines.push("  ! location data present");
    return lines;
  },

  setFormat(type) {
    if (!state.supported[type]) return `${FORMATS[type].label} is not supported by this browser.`;
    let note = "";
    if (state.mode === "simple" && !SIMPLE_FORMATS.includes(type)) {
      state.mode = "advanced";
      note = " (switched to advanced mode for PNG)";
    }
    state.format = type;
    renderAll();
    return `format: ${FORMATS[type].label}${note}`;
  },

  setTarget({ value, unit }) {
    state.targetValue = String(value);
    state.targetUnit = unit;
    state.useTarget = true;
    renderAll();
    const note = FORMATS[state.format].lossy ? "" : " (applies to WebP, JPEG and AVIF)";
    return `target: ${value} ${unit}${note}`;
  },

  targetOff() {
    if (state.mode === "simple") state.mode = "advanced";
    state.useTarget = false;
    renderAll();
    return "target off: quality slider controls the size (advanced mode)";
  },

  setQuality(n) {
    state.quality = n;
    renderAll();
    return `quality: ${n}%` + (targetActive() ? " (ignored while a target size is on)" : "");
  },

  setBackground(hex) {
    state.jpegBackground = hex;
    renderAll();
    return `jpeg background: ${hex}`;
  },

  setMetadata(strip) {
    state.stripMeta = !!strip;
    renderAll();
    return strip
      ? "metadata: removed (default)"
      : "metadata: kept in JPEG output (camera, date, location)";
  },

  setMode(mode) {
    if (mode === "simple" && state.format === "image/png") state.format = "image/webp";
    state.mode = mode;
    ensureFormat();
    renderAll();
    return `mode: ${mode}`;
  },

  setTheme(theme) {
    applyTheme(theme);
    return `theme: ${theme}`;
  },

  settings() {
    const lossy = FORMATS[state.format].lossy;
    const on = targetActive();
    return {
      mode: state.mode,
      format: state.format,
      theme: state.theme,
      targetText: on ? `${state.targetValue} ${state.targetUnit}` : "off",
      qualityText: lossy && !on ? `${state.quality}%` : "auto",
      background: state.jpegBackground,
      metadata: state.stripMeta ? "removed" : "kept",
    };
  },

  compress(onEach) {
    return processAll(onEach);
  },

  zip() {
    return downloadZip();
  },

  saveSelected(n) {
    if (n) {
      const item = itemByIndex(n);
      if (!item?.result) return `No result for file ${n}. Compress first.`;
      state.selectedId = item.id;
      renderAll();
    }
    return downloadSelected();
  },

  stats() {
    const done = state.files.filter((f) => f.result);
    const before = done.reduce((s, f) => s + f.file.size, 0);
    const after = done.reduce((s, f) => s + f.result.blob.size, 0);
    const pct = before ? Math.round((1 - after / before) * 100) : 0;
    return {
      files: state.files.length,
      done: done.length,
      original: fmtBytes(before),
      optimized: fmtBytes(after),
      savedText: before ? `${pct}%` : "—",
    };
  },
};

// ---------- wiring ----------

let help = null;
let tour = null;

function setLanguage(code) {
  setLang(code);
  $("langSelect").value = code;
  renderAll();
  setIdleStatus();
  help?.refresh();
  tour?.refresh();
}

function bindEvents() {
  $$("[data-mode-btn]").forEach((b) => b.addEventListener("click", () => setMode(b.dataset.modeBtn)));
  $$('input[name="format"]').forEach((input) => input.addEventListener("change", () => {
    state.format = input.value;
    renderAll();
  }));

  $("targetValue").addEventListener("input", (e) => {
    state.targetValue = e.target.value;
    renderAll();
  });
  $("targetUnit").addEventListener("change", (e) => {
    state.targetUnit = e.target.value;
    renderAll();
  });
  $("targetToggle").addEventListener("change", (e) => {
    state.useTarget = e.target.checked;
    renderAll();
  });
  $$("[data-value]").forEach((btn) => btn.addEventListener("click", () => {
    api.setTarget({ value: Number(btn.dataset.value), unit: btn.dataset.unit });
  }));

  $("qualitySlider").addEventListener("input", (e) => {
    state.quality = Number(e.target.value);
    renderAll();
  });
  $("jpegBg").addEventListener("input", (e) => {
    state.jpegBackground = e.target.value;
    renderAll();
  });
  $("metaToggle").addEventListener("change", (e) => {
    state.stripMeta = e.target.checked;
    renderAll();
  });

  $("addBtn").addEventListener("click", () => $("fileInput").click());
  $("fileInput").addEventListener("change", (e) => addFiles(e.target.files));
  $("toolCompress").addEventListener("click", () => report(processAll()));
  $("processBtn").addEventListener("click", () => report(processAll()));
  $("toolZip").addEventListener("click", () => report(downloadZip()));
  $("downloadZipBtn").addEventListener("click", () => report(downloadZip()));
  $("toolClear").addEventListener("click", () => toast(clearAll()));
  $("downloadSelectedBtn").addEventListener("click", () => toast(downloadSelected()));

  // Drop zone with a drag counter so the highlight does not flicker over child elements.
  const zone = $("dropZone");
  let depth = 0;
  zone.addEventListener("click", () => $("fileInput").click());
  zone.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      $("fileInput").click();
    }
  });
  zone.addEventListener("dragenter", (e) => { e.preventDefault(); depth++; zone.classList.add("dragover"); });
  zone.addEventListener("dragover", (e) => e.preventDefault());
  zone.addEventListener("dragleave", () => {
    depth = Math.max(0, depth - 1);
    if (!depth) zone.classList.remove("dragover");
  });
  zone.addEventListener("drop", (e) => {
    e.preventDefault();
    depth = 0;
    zone.classList.remove("dragover");
    addFiles(e.dataTransfer.files);
  });
  window.addEventListener("dragover", (e) => e.preventDefault());
  window.addEventListener("drop", (e) => e.preventDefault());
  window.addEventListener("paste", (e) => {
    const files = [...(e.clipboardData?.files || [])];
    if (files.length) addFiles(files);
  });

  $("fileList").addEventListener("click", (e) => {
    const remove = e.target.closest("[data-remove]");
    if (remove) return toast(removeItem(remove.dataset.remove));
    const select = e.target.closest("[data-select]");
    if (select) {
      state.selectedId = select.dataset.select;
      renderAll();
    }
  });
  $("fileList").addEventListener("keydown", (e) => {
    const select = e.target.closest?.("[data-select]");
    if (select && (e.key === "Enter" || e.key === " ")) {
      e.preventDefault();
      state.selectedId = select.dataset.select;
      renderAll();
    }
  });

  $("zoomInBtn").addEventListener("click", () => viewer.zoomIn());
  $("zoomOutBtn").addEventListener("click", () => viewer.zoomOut());
  $("fitBtn").addEventListener("click", () => viewer.fit());
  $("actualBtn").addEventListener("click", () => viewer.actual());

  $("propsBtn").addEventListener("click", () => {
    state.showProps = !state.showProps;
    renderAll();
  });
  $("propsClose").addEventListener("click", () => {
    state.showProps = false;
    renderAll();
  });

  $("themeBtn").addEventListener("click", () => applyTheme(state.theme === "dark" ? "light" : "dark"));
  $("langSelect").addEventListener("change", (e) => setLanguage(e.target.value));
  $("aboutBtn").addEventListener("click", () => {
    showAboutTab("overview");
    $("aboutDlg").showModal();
  });
  $$(".tab[data-tab]").forEach((tab) => tab.addEventListener("click", () => showAboutTab(tab.dataset.tab)));
  $$(".tab[data-tab]").forEach((tab) => tab.addEventListener("keydown", (e) => {
    if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
    const next = e.key === "ArrowRight" ? "arch" : "overview";
    showAboutTab(next);
    $(next === "arch" ? "tabBtnArch" : "tabBtnOverview").focus();
  }));
  $$("dialog [data-close]").forEach((b) => b.addEventListener("click", () => b.closest("dialog").close()));
  $$("dialog").forEach((d) => d.addEventListener("click", (e) => {
    if (e.target === d) d.close();
  }));

  document.addEventListener("keydown", (e) => {
    if (e.ctrlKey && e.key === "`") {
      e.preventDefault();
      terminal.open();
    }
  });

  window.addEventListener("beforeunload", (e) => {
    if (state.busy) e.preventDefault();
  });
}

function showAboutTab(name) {
  const arch = name === "arch";
  $("tabOverview").hidden = arch;
  $("tabArch").hidden = !arch;
  $("tabBtnOverview").setAttribute("aria-selected", String(!arch));
  $("tabBtnArch").setAttribute("aria-selected", String(arch));
  $("tabBtnOverview").tabIndex = arch ? -1 : 0;
  $("tabBtnArch").tabIndex = arch ? 0 : -1;
  if (arch) $("tabArch").scrollTop = 0;
  else $("tabOverview").scrollTop = 0;
}

// Show a short message from an async action as a toast.
function report(promise) {
  return Promise.resolve(promise).then((res) => {
    if (res?.error) toast(res.error);
    else if (typeof res === "string") toast(res);
  });
}

function registerOffline() {
  // Service worker enables offline use on GitHub Pages (HTTPS) and on localhost.
  const secure = location.protocol === "https:" || ["localhost", "127.0.0.1"].includes(location.hostname);
  if ("serviceWorker" in navigator && secure) {
    navigator.serviceWorker.register("sw.js").catch(() => {});
  }
}

function fillLanguageOptions() {
  const sel = $("langSelect");
  sel.innerHTML = LANGS.map((l) => `<option value="${l.code}">${l.name}</option>`).join("");
}

let terminal = null;

async function init() {
  initTheme();
  const lang = detectLang();
  fillLanguageOptions();
  setLang(lang);
  $("langSelect").value = lang;

  viewer = createViewer({
    stage: $("stage"),
    world: $("world"),
    original: $("originalImg"),
    optimized: $("optimizedImg"),
    afterLayer: $("afterLayer"),
    splitLine: $("splitLine"),
    handle: $("splitHandle"),
    onScale: (s) => { $("zoomLabel").textContent = `${Math.round(s * 100)}%`; },
  });
  terminal = createTerminal({
    dialog: $("termDlg"),
    log: $("termLog"),
    form: $("termForm"),
    input: $("termInput"),
    api,
    openButton: $("termBtn"),
    closeButtons: [],
  });
  tour = createTour($("tourBtn"));
  help = initHelp();
  bindEvents();
  registerOffline();
  renderAll();
  setIdleStatus();
  await detectFormats();
  renderAll();
}

init();
