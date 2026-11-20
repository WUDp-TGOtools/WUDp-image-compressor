// Guided tour: a spotlight over one interface element at a time, with a short explanation.
import { t } from "./i18n.js";

const STEPS = [
  { sel: "#addBtn" },
  { sel: "#fileList" },
  { sel: "#stage" },
  { sel: ".viewer-bar" },
  { sel: "#propsBtn" },
  { sel: ".seg" },
  { sel: ".formats" },
  { sel: "#metaToggle" },
  { sel: "#processBtn" },
  { sel: "#resultsPanel" },
  { sel: "#termBtn" },
  { sel: "#langSelect" },
];

export function createTour(openButton) {
  const layer = document.createElement("div");
  layer.className = "tour-layer";
  layer.hidden = true;
  layer.innerHTML = `
    <div class="tour-spot" aria-hidden="true"></div>
    <div class="tour-card" role="dialog" aria-modal="true" aria-live="polite">
      <div class="tour-step"></div>
      <p class="tour-text"></p>
      <div class="tour-actions">
        <button type="button" class="btn btn-sm btn-ghost tour-skip"></button>
        <span class="toolbar-spacer"></span>
        <button type="button" class="btn btn-sm tour-back"></button>
        <button type="button" class="btn btn-sm btn-primary tour-next"></button>
      </div>
    </div>`;
  document.body.appendChild(layer);

  const spot = layer.querySelector(".tour-spot");
  const card = layer.querySelector(".tour-card");
  let index = 0;

  function target(i) {
    return document.querySelector(STEPS[i].sel);
  }

  function visibleStep(from, dir) {
    let i = from;
    while (i >= 0 && i < STEPS.length) {
      const el = target(i);
      if (el && el.offsetParent !== null) return i;
      i += dir;
    }
    return -1;
  }

  function place() {
    const el = target(index);
    if (!el) return;
    const r = el.getBoundingClientRect();
    const pad = 6;
    Object.assign(spot.style, {
      left: `${r.left - pad}px`, top: `${r.top - pad}px`,
      width: `${r.width + pad * 2}px`, height: `${r.height + pad * 2}px`,
    });
    const cw = card.offsetWidth, ch = card.offsetHeight;
    let x = r.left + r.width / 2 - cw / 2;
    x = Math.max(12, Math.min(innerWidth - cw - 12, x));
    let y = r.bottom + pad + 12;
    if (y + ch > innerHeight - 12) y = r.top - pad - 12 - ch;
    if (y < 12) y = Math.max(12, (innerHeight - ch) / 2);
    card.style.left = `${x}px`;
    card.style.top = `${y}px`;
  }

  function render() {
    const step = STEPS[index];
    layer.querySelector(".tour-step").textContent = t("tour.step", { i: index + 1, n: STEPS.length });
    layer.querySelector(".tour-text").textContent = t(`tour.${index + 1}`);
    layer.querySelector(".tour-skip").textContent = t("tour.skip");
    layer.querySelector(".tour-back").textContent = t("tour.back");
    const last = index === STEPS.length - 1;
    layer.querySelector(".tour-next").textContent = last ? t("tour.done") : t("tour.next");
    layer.querySelector(".tour-back").disabled = visibleStep(index - 1, -1) < 0;
    void step;
    const el = target(index);
    el?.scrollIntoView?.({ block: "nearest", inline: "nearest" });
    place();
    layer.querySelector(".tour-next").focus();
  }

  function go(dir) {
    const next = visibleStep(index + dir, dir);
    if (next < 0) return close();
    index = next;
    render();
  }

  function open() {
    const first = visibleStep(0, 1);
    if (first < 0) return;
    index = first;
    layer.hidden = false;
    render();
  }

  function close() {
    layer.hidden = true;
  }

  layer.querySelector(".tour-next").addEventListener("click", () => (index === STEPS.length - 1 ? close() : go(1)));
  layer.querySelector(".tour-back").addEventListener("click", () => go(-1));
  layer.querySelector(".tour-skip").addEventListener("click", close);
  openButton?.addEventListener("click", open);
  document.addEventListener("keydown", (e) => {
    if (layer.hidden) return;
    if (e.key === "Escape") close();
    else if (e.key === "ArrowRight") go(1);
    else if (e.key === "ArrowLeft") go(-1);
  });
  window.addEventListener("resize", () => { if (!layer.hidden) place(); });

  return { open, close, refresh() { if (!layer.hidden) render(); } };
}
