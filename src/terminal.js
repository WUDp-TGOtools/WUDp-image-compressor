// PixelPress terminal: a command line that drives the same controls as the UI.
// The terminal never touches the DOM of the app directly; it only calls the `api` it is given.

const FORMAT_ALIASES = {
  webp: "image/webp",
  jpeg: "image/jpeg",
  jpg: "image/jpeg",
  avif: "image/avif",
  png: "image/png",
};
const FORMAT_LABEL = { "image/webp": "webp", "image/jpeg": "jpeg", "image/avif": "avif", "image/png": "png" };

const COMMANDS = {
  help: {
    usage: "help",
    desc: "list commands",
    run: (_, t) => {
      t.print("Commands:", "ok");
      for (const [name, c] of Object.entries(COMMANDS)) t.print(`  ${name.padEnd(10)} ${c.desc}`);
      t.print("");
      t.print("Examples:", "ok");
      t.print("  add");
      t.print("  compress --target 200kb --format webp");
      t.print("  compress --format jpeg --quality 75");
      t.print("  info 2");
      t.print("  zip");
      t.print("Press Tab to complete a command. Use ↑ ↓ to browse history.", "dim");
    },
  },
  ls: {
    desc: "list queued files",
    run: (_, t) => {
      const rows = t.api.list();
      if (!rows.length) return t.print("No files. Use 'add' to pick images.", "dim");
      t.print("  #  name                          size        result      status", "dim");
      for (const r of rows) {
        const name = r.name.length > 28 ? `${r.name.slice(0, 25)}...` : r.name;
        const sel = r.selected ? "*" : " ";
        t.print(`${sel}${String(r.index).padStart(2)}  ${name.padEnd(28)}  ${r.sizeText.padEnd(10)}  ${r.resultText.padEnd(10)}  ${r.status}`);
      }
    },
  },
  add: {
    desc: "open the file picker",
    run: (_, t) => {
      t.api.pickFiles();
      t.print("Opening file picker...", "dim");
    },
  },
  rm: {
    usage: "rm <n|all>",
    desc: "remove a file by number, or all",
    run: (a, t) => {
      const target = a._[0];
      if (!target) throw new Error("usage: rm <n|all>");
      if (target === "all") return t.print(t.api.clear());
      t.print(t.api.remove(Number(target)));
    },
  },
  select: {
    usage: "select <n>",
    desc: "select a file for preview and save",
    run: (a, t) => t.print(t.api.select(Number(a._[0]))),
  },
  info: {
    usage: "info [n]",
    desc: "show properties of a file (default: selected)",
    run: async (a, t) => {
      const lines = await t.api.describe(a._[0] ? Number(a._[0]) : undefined);
      for (const line of lines) t.print(line);
    },
  },
  format: {
    usage: "format <webp|jpeg|avif|png>",
    desc: "set output format",
    run: (a, t) => {
      if (!a._[0]) return t.print(`format: ${t.api.settings().format}`);
      const type = FORMAT_ALIASES[a._[0].toLowerCase()];
      if (!type) throw new Error(`unknown format '${a._[0]}'. Use webp, jpeg, avif or png.`);
      t.print(t.api.setFormat(type));
    },
  },
  target: {
    usage: "target <size|off>",
    desc: "set target size, e.g. 200kb or 1mb",
    run: (a, t) => {
      const arg = a._[0];
      if (!arg) return t.print(`target: ${t.api.settings().targetText}`);
      if (arg === "off") return t.print(t.api.targetOff());
      t.print(t.api.setTarget(parseSize(arg)));
    },
  },
  quality: {
    usage: "quality <10-100>",
    desc: "set quality (used when target is off)",
    run: (a, t) => {
      const n = Number(a._[0]);
      if (!Number.isInteger(n) || n < 10 || n > 100) throw new Error("quality must be a whole number from 10 to 100");
      t.print(t.api.setQuality(n));
    },
  },
  bg: {
    usage: "bg <#rrggbb>",
    desc: "background color for JPEG output",
    run: (a, t) => {
      const hex = a._[0];
      if (!/^#?[0-9a-fA-F]{6}$/.test(hex || "")) throw new Error("usage: bg #rrggbb");
      t.print(t.api.setBackground(hex.startsWith("#") ? hex : `#${hex}`));
    },
  },
  mode: {
    usage: "mode <simple|advanced>",
    desc: "switch interface mode",
    run: (a, t) => {
      if (!["simple", "advanced"].includes(a._[0])) throw new Error("usage: mode <simple|advanced>");
      t.print(t.api.setMode(a._[0]));
    },
  },
  theme: {
    usage: "theme <light|dark>",
    desc: "switch color theme",
    run: (a, t) => {
      if (!["light", "dark"].includes(a._[0])) throw new Error("usage: theme <light|dark>");
      t.print(t.api.setTheme(a._[0]));
    },
  },
  metadata: {
    usage: "metadata <keep|strip>",
    desc: "keep or remove metadata (JPEG output keeps EXIF when kept)",
    run: (a, t) => {
      if (!["keep", "strip"].includes(a._[0])) throw new Error("usage: metadata <keep|strip>");
      t.print(t.api.setMetadata(a._[0] === "strip"));
    },
  },
  compress: {
    usage: "compress [--target 200kb] [--format webp] [--quality 80] [--bg #ffffff] [--keep-metadata]",
    desc: "compress all pending files with these options",
    run: async (a, t) => {
      const f = a.flags;
      if (f.format !== undefined) {
        const type = FORMAT_ALIASES[String(f.format).toLowerCase()];
        if (!type) throw new Error(`unknown format '${f.format}'`);
        t.print(t.api.setFormat(type));
      }
      if (f["keep-metadata"] !== undefined) t.print(t.api.setMetadata(false));
      if (f["strip-metadata"] !== undefined) t.print(t.api.setMetadata(true));
      if (f.bg !== undefined) t.print(t.api.setBackground(String(f.bg).startsWith("#") ? f.bg : `#${f.bg}`));
      if (f.quality !== undefined) {
        const n = Number(f.quality);
        if (!Number.isInteger(n) || n < 10 || n > 100) throw new Error("--quality must be 10 to 100");
        // Quality only applies when the target is off, so turn it off first unless a target is given.
        if (f.target === undefined) t.print(t.api.targetOff());
        t.print(t.api.setQuality(n));
      }
      if (f.target !== undefined && f.target !== true) t.print(t.api.setTarget(parseSize(String(f.target))));

      const total = t.api.list().length;
      if (!total) return t.print("Nothing to compress. Use 'add' first.", "err");
      t.print(`Compressing ${total} file(s)...`, "dim");
      const summary = await t.api.compress((line, kind) => t.print(line, kind));
      if (summary.error) return t.print(summary.error, "err");
      t.print(`Done: ${summary.ok} ok${summary.failed ? `, ${summary.failed} failed` : ""}.`, summary.failed ? "err" : "ok");
    },
  },
  zip: {
    desc: "download all results as a ZIP",
    run: async (_, t) => t.print(await t.api.zip()),
  },
  save: {
    usage: "save [n]",
    desc: "download one result (default: selected)",
    run: (a, t) => t.print(t.api.saveSelected(a._[0] ? Number(a._[0]) : undefined)),
  },
  stats: {
    desc: "show totals for this session",
    run: (_, t) => {
      const s = t.api.stats();
      t.print(`files: ${s.files}   optimized: ${s.done}`);
      t.print(`original: ${s.original}   output: ${s.optimized}   saved: ${s.savedText}`);
    },
  },
  status: {
    desc: "show current settings",
    run: (_, t) => {
      const s = t.api.settings();
      t.print(`mode: ${s.mode}   format: ${FORMAT_LABEL[s.format]}   theme: ${s.theme}`);
      t.print(`target: ${s.targetText}   quality: ${s.qualityText}   jpeg bg: ${s.background}`);
    },
  },
  clear: {
    desc: "clear the terminal screen",
    run: (_, t) => t.clearScreen(),
  },
  version: {
    desc: "show version",
    run: (_, t) => t.print("WUDp Image Compressor v1.0.0 · WUDp :) · by TGO.tools"),
  },
  exit: {
    desc: "close the terminal",
    run: (_, t) => t.close(),
  },
};

function parseSize(text) {
  const m = /^(\d+(?:\.\d+)?)\s*(kb|mb|k|m)?$/i.exec(text);
  if (!m) throw new Error(`invalid size '${text}'. Examples: 200kb, 1mb`);
  const unit = (m[2] || "kb").toLowerCase().startsWith("m") ? "MB" : "KB";
  const value = Number(m[1]);
  if (value <= 0) throw new Error("size must be greater than 0");
  return { value, unit };
}

function tokenize(line) {
  const out = [];
  const re = /"([^"]*)"|'([^']*)'|(\S+)/g;
  let m;
  while ((m = re.exec(line))) out.push(m[1] ?? m[2] ?? m[3]);
  return out;
}

function parseArgs(tokens) {
  const args = { _: [], flags: {} };
  for (let i = 0; i < tokens.length; i++) {
    const tok = tokens[i];
    if (tok.startsWith("--")) {
      const eq = tok.indexOf("=");
      if (eq > 2) {
        args.flags[tok.slice(2, eq)] = tok.slice(eq + 1);
      } else {
        const name = tok.slice(2);
        const next = tokens[i + 1];
        if (next !== undefined && !next.startsWith("--")) {
          args.flags[name] = next;
          i++;
        } else {
          args.flags[name] = true;
        }
      }
    } else {
      args._.push(tok);
    }
  }
  return args;
}

export function createTerminal({ dialog, log, form, input, api, openButton, closeButtons }) {
  const history = [];
  let historyIndex = 0;

  const ctx = {
    api,
    print(text, kind = "") {
      const line = document.createElement("div");
      line.className = `ln ${kind}`.trim();
      line.textContent = text ?? "";
      log.appendChild(line);
      log.scrollTop = log.scrollHeight;
    },
    clearScreen() {
      log.textContent = "";
    },
    close() {
      dialog.close();
    },
  };

  async function run(raw) {
    const line = raw.trim();
    if (!line) return;
    ctx.print(`wudp> ${line}`, "cmd");
    history.push(line);
    historyIndex = history.length;

    const [name, ...rest] = tokenize(line);
    const command = COMMANDS[name.toLowerCase()];
    if (!command) {
      ctx.print(`'${name}' is not a command. Type 'help' for the list.`, "err");
      return;
    }
    try {
      const args = parseArgs(rest);
      await command.run(args, ctx);
    } catch (err) {
      ctx.print(err.message || String(err), "err");
    }
  }

  function complete() {
    const value = input.value;
    if (value.includes(" ")) return;
    const matches = Object.keys(COMMANDS).filter((c) => c.startsWith(value.toLowerCase()));
    if (matches.length === 1) {
      input.value = `${matches[0]} `;
    } else if (matches.length > 1) {
      ctx.print(matches.join("   "), "dim");
    }
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const line = input.value;
    input.value = "";
    run(line);
  });

  input.addEventListener("keydown", (e) => {
    if (e.key === "ArrowUp") {
      if (historyIndex > 0) historyIndex--;
      input.value = history[historyIndex] ?? "";
      e.preventDefault();
    } else if (e.key === "ArrowDown") {
      historyIndex = Math.min(history.length, historyIndex + 1);
      input.value = history[historyIndex] ?? "";
      e.preventDefault();
    } else if (e.key === "Tab") {
      e.preventDefault();
      complete();
    }
  });

  openButton.addEventListener("click", () => open());
  closeButtons.forEach((b) => b.addEventListener("click", () => dialog.close()));

  function open() {
    if (!dialog.open) {
      dialog.showModal();
      if (!log.childElementCount) {
        ctx.print("WUDp terminal · type 'help' to see commands.", "ok");
        ctx.print("Tip: 'add', then 'compress --target 200kb', then 'zip'.", "dim");
      }
    }
    setTimeout(() => input.focus(), 0);
  }

  return { open, run };
}
