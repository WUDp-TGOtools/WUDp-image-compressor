// Hover and focus help: a small box explains any element marked with data-help.
import { t } from "./i18n.js";

export function initHelp() {
  const box = document.createElement("div");
  box.className = "help-box";
  box.setAttribute("role", "tooltip");
  box.hidden = true;
  document.body.appendChild(box);

  let timer = null;
  let current = null;

  function position(el) {
    const r = el.getBoundingClientRect();
    box.style.left = "0px";
    box.style.top = "0px";
    const bw = box.offsetWidth, bh = box.offsetHeight;
    let x = r.left + r.width / 2 - bw / 2;
    x = Math.max(8, Math.min(innerWidth - bw - 8, x));
    let y = r.bottom + 8;
    if (y + bh > innerHeight - 40) y = r.top - bh - 8;
    box.style.left = `${x}px`;
    box.style.top = `${Math.max(8, y)}px`;
  }

  function show(el) {
    box.textContent = t(el.dataset.help);
    box.hidden = false;
    position(el);
  }

  function hide() {
    clearTimeout(timer);
    box.hidden = true;
    current = null;
  }

  const closestHelp = (node) => (node instanceof Element ? node.closest("[data-help]") : null);

  document.addEventListener("pointerover", (e) => {
    const el = closestHelp(e.target);
    if (!el || el === current) return;
    current = el;
    clearTimeout(timer);
    timer = setTimeout(() => show(el), 350);
  });
  document.addEventListener("pointerout", (e) => {
    const el = closestHelp(e.target);
    if (el && !el.contains(e.relatedTarget)) hide();
  });
  document.addEventListener("focusin", (e) => {
    const el = closestHelp(e.target);
    if (el && e.target.matches(":focus-visible")) {
      current = el;
      show(el);
    }
  });
  document.addEventListener("focusout", hide);
  document.addEventListener("pointerdown", hide);
  window.addEventListener("scroll", hide, true);

  return {
    refresh() {
      if (current && !box.hidden) box.textContent = t(current.dataset.help);
    },
  };
}
