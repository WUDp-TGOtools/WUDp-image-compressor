// Before/after viewer: zoom (wheel, pinch, buttons, keys), pan (drag), and a draggable split handle.
// All transforms live on one `world` element so both images always stay aligned.

const MIN_SCALE = 0.05;
const MAX_SCALE = 24;
const clamp = (n, lo, hi) => Math.min(hi, Math.max(lo, n));

export function createViewer({ stage, world, original, optimized, afterLayer, splitLine, handle, onScale }) {
  const view = { w: 0, h: 0, s: 1, tx: 0, ty: 0, split: 0.5, fitMode: true, key: null, hasAfter: false };
  const sw = () => stage.clientWidth;
  const sh = () => stage.clientHeight;

  function render() {
    const { w, h, s, tx, ty, split } = view;
    world.style.width = `${w}px`;
    world.style.height = `${h}px`;
    world.style.transform = `translate(${tx}px, ${ty}px) scale(${s})`;
    world.classList.toggle("pixelated", s >= 2.5);
    afterLayer.style.clipPath = `inset(0 0 0 ${split * 100}%)`;
    const x = tx + split * w * s;
    splitLine.style.left = `${x}px`;
    handle.style.left = `${x}px`;
    handle.setAttribute("aria-valuenow", String(Math.round(split * 100)));
    onScale?.(s);
  }

  function fit() {
    if (!view.w || !view.h) return;
    const fitScale = Math.min(sw() / view.w, sh() / view.h) * 0.94;
    view.s = clamp(fitScale, MIN_SCALE, 4);
    view.tx = (sw() - view.w * view.s) / 2;
    view.ty = (sh() - view.h * view.s) / 2;
    view.fitMode = true;
    render();
  }

  function zoomTo(scale, cx = sw() / 2, cy = sh() / 2) {
    if (!view.w) return;
    const next = clamp(scale, MIN_SCALE, MAX_SCALE);
    const k = next / view.s;
    view.tx = cx - (cx - view.tx) * k;
    view.ty = cy - (cy - view.ty) * k;
    view.s = next;
    view.fitMode = false;
    render();
  }

  function zoomBy(factor) {
    zoomTo(view.s * factor);
  }

  function setSplit(value) {
    view.split = clamp(value, 0, 1);
    render();
  }

  function showImages({ key, width, height, url, optimizedUrl }) {
    if (!width || !height) return;
    const changed = key !== view.key;
    view.key = key;
    view.w = width;
    view.h = height;
    original.src = url;
    view.hasAfter = !!optimizedUrl;
    if (optimizedUrl) optimized.src = optimizedUrl;
    else optimized.removeAttribute("src");
    afterLayer.hidden = !view.hasAfter;
    splitLine.hidden = !view.hasAfter;
    handle.hidden = !view.hasAfter;
    world.hidden = false;
    if (changed) fit();
    else render();
  }

  function clear() {
    view.key = null;
    view.w = view.h = 0;
    world.hidden = true;
    afterLayer.hidden = true;
    splitLine.hidden = true;
    handle.hidden = true;
  }

  // ----- pointer: drag the handle, pan the image, pinch to zoom -----
  const pointers = new Map();
  let drag = null;

  stage.addEventListener("pointerdown", (e) => {
    if (world.hidden || e.target.closest(".props-card")) return;
    if (e.pointerType === "mouse" && e.button !== 0) return;
    pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
    stage.setPointerCapture(e.pointerId);
    if (pointers.size === 2) {
      const [a, b] = [...pointers.values()];
      drag = { type: "pinch", dist: Math.hypot(a.x - b.x, a.y - b.y) || 1, scale: view.s };
      return;
    }
    if (e.target.closest("#splitHandle") && view.hasAfter) {
      drag = { type: "split" };
    } else {
      drag = { type: "pan", x: e.clientX, y: e.clientY, tx: view.tx, ty: view.ty };
      stage.classList.add("is-panning");
    }
  });

  stage.addEventListener("pointermove", (e) => {
    if (!pointers.has(e.pointerId)) return;
    pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (!drag) return;
    const r = stage.getBoundingClientRect();
    if (drag.type === "split") {
      const x = e.clientX - r.left;
      setSplit((x - view.tx) / (view.w * view.s));
    } else if (drag.type === "pan") {
      view.tx = drag.tx + (e.clientX - drag.x);
      view.ty = drag.ty + (e.clientY - drag.y);
      render();
    } else if (drag.type === "pinch" && pointers.size >= 2) {
      const [a, b] = [...pointers.values()];
      const dist = Math.hypot(a.x - b.x, a.y - b.y);
      const cx = (a.x + b.x) / 2 - r.left;
      const cy = (a.y + b.y) / 2 - r.top;
      zoomTo(drag.scale * (dist / drag.dist), cx, cy);
    }
  });

  const endPointer = (e) => {
    pointers.delete(e.pointerId);
    if (pointers.size < 2 && drag?.type === "pinch") drag = null;
    if (pointers.size === 0) {
      drag = null;
      stage.classList.remove("is-panning");
    }
  };
  stage.addEventListener("pointerup", endPointer);
  stage.addEventListener("pointercancel", endPointer);

  // ----- wheel / trackpad zoom around the cursor -----
  stage.addEventListener("wheel", (e) => {
    if (world.hidden) return;
    e.preventDefault();
    const r = stage.getBoundingClientRect();
    const factor = Math.exp(-e.deltaY * (e.ctrlKey ? 0.01 : 0.0015));
    zoomTo(view.s * factor, e.clientX - r.left, e.clientY - r.top);
  }, { passive: false });

  // ----- double-click: fit <-> 100% at the cursor -----
  stage.addEventListener("dblclick", (e) => {
    if (world.hidden || e.target.closest("#splitHandle, .props-card")) return;
    if (view.fitMode) {
      const r = stage.getBoundingClientRect();
      zoomTo(1, e.clientX - r.left, e.clientY - r.top);
    } else {
      fit();
    }
  });

  // ----- keyboard -----
  stage.addEventListener("keydown", (e) => {
    if (world.hidden) return;
    if (e.key === "+" || e.key === "=") zoomBy(1.25);
    else if (e.key === "-" || e.key === "_") zoomBy(1 / 1.25);
    else if (e.key === "0") fit();
    else if (e.key === "1") zoomTo(1);
    else return;
    e.preventDefault();
  });

  handle.addEventListener("keydown", (e) => {
    const step = e.shiftKey ? 0.1 : 0.02;
    if (e.key === "ArrowLeft") setSplit(view.split - step);
    else if (e.key === "ArrowRight") setSplit(view.split + step);
    else if (e.key === "Home") setSplit(0);
    else if (e.key === "End") setSplit(1);
    else return;
    e.preventDefault();
    e.stopPropagation();
  });

  new ResizeObserver(() => {
    if (world.hidden) return;
    if (view.fitMode) fit();
    else render();
  }).observe(stage);

  return {
    fit,
    actual: () => zoomTo(1),
    zoomIn: () => zoomBy(1.25),
    zoomOut: () => zoomBy(1 / 1.25),
    showImages,
    clear,
    get scale() { return view.s; },
  };
}
