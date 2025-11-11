//------------------------------------------------------
// PANEL LOGIC
//------------------------------------------------------
document.querySelectorAll(".category").forEach(cat => {
    cat.addEventListener("click", () => {
        const id = cat.getAttribute("data-panel");
        document.querySelectorAll(".panel-section").forEach(sec => sec.classList.add("hidden"));
        const panel = document.getElementById(id);
        if (panel) panel.classList.remove("hidden");
    });
});

//------------------------------------------------------
// BACKGROUND OPTIONS
//------------------------------------------------------
document.querySelectorAll(".bg-option").forEach(opt => {
    opt.style.backgroundImage = `url(${opt.getAttribute("data-bg")})`;
    opt.addEventListener("click", () => {
        document.getElementById("stage").style.backgroundImage =
            `url(${opt.getAttribute("data-bg")})`;
    });
});

//------------------------------------------------------
// SELECTION MANAGEMENT
//------------------------------------------------------
function deselectAll() {
    document.querySelectorAll(".sticker-wrapper.selected")
        .forEach(w => w.classList.remove("selected"));
}

document.addEventListener("pointerdown", e => {
    if (!e.target.closest(".sticker-wrapper")) deselectAll();
});

//------------------------------------------------------
// STICKER CREATION
//------------------------------------------------------
function createStickerAt(srcUrl, x, y) {
    const stage = document.getElementById("stage");

    const wrapper = document.createElement("div");
    wrapper.classList.add("sticker-wrapper");
    wrapper.scale = 1;
    wrapper.angle = 0;

    wrapper.setAttribute("data-x", x);
    wrapper.setAttribute("data-y", y);

    const img = document.createElement("img");
    img.src = srcUrl;
    img.style.width = "150px";

    const scaleHandle = document.createElement("div");
    scaleHandle.classList.add("scale-handle");

    const rotHandle = document.createElement("div");
    rotHandle.classList.add("rot-handle");

    wrapper.appendChild(img);
    wrapper.appendChild(scaleHandle);
    wrapper.appendChild(rotHandle);

    stage.appendChild(wrapper);

    applyTransform(wrapper);
    makeInteractive(wrapper);

    deselectAll();
    wrapper.classList.add("selected");

    return wrapper;
}

function applyTransform(el) {
    const x = parseFloat(el.getAttribute("data-x")) || 0;
    const y = parseFloat(el.getAttribute("data-y")) || 0;
    el.style.transform = `translate(${x}px, ${y}px) scale(${el.scale}) rotate(${el.angle}deg)`;
}

//------------------------------------------------------
// DRAG FROM BAR → SPAWN UNDER POINTER
//------------------------------------------------------
let spawningWrapper = null;

interact('.sticker-src').draggable({
    listeners: {
        start(event) {
            const stage = document.getElementById("stage");
            const rect = stage.getBoundingClientRect();
            const startX = event.clientX - rect.left - 75;
            const startY = event.clientY - rect.top  - 75;
            spawningWrapper = createStickerAt(event.target.src, startX, startY);
        },
        move(event) {
            if (!spawningWrapper) return;
            const stage = document.getElementById("stage");
            const rect = stage.getBoundingClientRect();

            const x = event.clientX - rect.left - 75;
            const y = event.clientY - rect.top  - 75;

            spawningWrapper.setAttribute("data-x", x);
            spawningWrapper.setAttribute("data-y", y);
            applyTransform(spawningWrapper);
        },
        end() {
            spawningWrapper = null;
        }
    }
});

//------------------------------------------------------
// INTERACTIVE STICKERS
//------------------------------------------------------
function makeInteractive(el) {

    el.addEventListener("pointerdown", () => {
        deselectAll();
        el.classList.add("selected");
    });

    // Drag to move
    interact(el).draggable({
        allowFrom: "img",
        listeners: {
            move(event) {
                const x = (parseFloat(el.getAttribute("data-x")) || 0) + event.dx;
                const y = (parseFloat(el.getAttribute("data-y")) || 0) + event.dy;
                el.setAttribute("data-x", x);
                el.setAttribute("data-y", y);
                applyTransform(el);
            }
        }
    });

    // Mobile pinch + rotate
    interact(el).gesturable({
        listeners: {
            move(event) {
                el.scale = Math.max(0.2, el.scale * (1 + event.ds));
                el.angle += event.da;
                applyTransform(el);
            }
        }
    });

    // Desktop scale
    interact(el.querySelector(".scale-handle")).draggable({
        listeners: {
            move(event) {
                el.scale = Math.max(0.2, el.scale + event.dx * 0.01);
                applyTransform(el);
            }
        }
    });

    // Desktop rotate
    interact(el.querySelector(".rot-handle")).draggable({
        listeners: {
            move(event) {
                el.angle += event.dx * 0.5;
                applyTransform(el);
            }
        }
    });

    // Delete on double click
    el.addEventListener("dblclick", () => el.remove());
}
//------------------------------------------------------
// EXPORT UI wiring
//------------------------------------------------------
const fpsInput = document.getElementById("gif-fps");
const fpsVal   = document.getElementById("gif-fps-val");
const durInput = document.getElementById("gif-duration");
const btnPNG   = document.getElementById("export-png");
const btnGIF   = document.getElementById("export-gif");
const btnCancel= document.getElementById("export-cancel");
const progEl   = document.getElementById("export-progress");

fpsInput?.addEventListener("input", () => { fpsVal.textContent = fpsInput.value; });

// shared cancel flag
let EXPORT_CANCELLED = false;
btnCancel?.addEventListener("click", () => { EXPORT_CANCELLED = true; });

//------------------------------------------------------
// PNG EXPORT (unchanged logic; uses html2canvas)
//------------------------------------------------------
btnPNG?.addEventListener("click", async () => {
  const stage = document.getElementById("stage");
  const rect  = stage.getBoundingClientRect();
  const canvas = await html2canvas(stage, {
    width: Math.floor(rect.width),
    height: Math.floor(rect.height),
    scale: 1,
    useCORS: true,
    backgroundColor: null
  });
  const link = document.createElement("a");
  link.download = "banner.png";
  link.href = canvas.toDataURL("image/png");
  link.click();
});

//------------------------------------------------------
// GIF EXPORT — animated GIF stickers, proper compositing
// Requires (loaded before app.js):
//   - window.__gif_parseGIF / window.__gif_decompressFrames (gifuct-js via ESM shim)
//   - GIFEncoder (jsgif: LZWEncoder.js + NeuQuant.js + GIFEncoder.js)
//------------------------------------------------------
document.getElementById("export-gif").addEventListener("click", async () => {
  if (typeof window.__gif_parseGIF !== "function" || typeof window.__gif_decompressFrames !== "function") {
    console.error("gifuct-js not loaded"); return;
  }
  if (typeof GIFEncoder !== "function") {
    console.error("jsgif not loaded"); return;
  }

  // UI elements
  const fpsInput = document.getElementById("gif-fps");
  const durInput = document.getElementById("gif-duration");
  const btnPNG   = document.getElementById("export-png");
  const btnGIF   = document.getElementById("export-gif");
  const btnCancel= document.getElementById("export-cancel");
  const progEl   = document.getElementById("export-progress");

  // options
  const FPS = Math.max(1, Math.min(15, parseInt(fpsInput?.value || "5", 10)));
  const DURATION_S = Math.max(1, Math.min(20, parseInt(durInput?.value || "5", 10)));
  const TOTAL = FPS * DURATION_S;
  const FRAME_MS = Math.round(1000 / FPS);

  // lock UI
  let CANCELLED = false;
  if (btnPNG) btnPNG.disabled = true;
  if (btnGIF) btnGIF.disabled = true;
  if (btnCancel) {
    btnCancel.style.display = "inline-block";
    btnCancel.onclick = () => { CANCELLED = true; };
  }
  updateProgress(0, TOTAL, "Preloading…");

  // stage + buffer
  const stage = document.getElementById("stage");
  const rect  = stage.getBoundingClientRect();
  const W = Math.max(1, Math.floor(rect.width));
  const H = Math.max(1, Math.floor(rect.height));

  const buf  = document.createElement("canvas");
  buf.width  = W; buf.height = H;
  const ctx  = buf.getContext("2d", { willReadFrequently: true });

  // background
  const bgMatch = (stage.style.backgroundImage || "").match(/url\(["']?(.*?)["']?\)/);
  const bgURL   = bgMatch ? bgMatch[1] : null;
  const bgImg   = bgURL ? await loadImage(bgURL) : null;

  // collect stickers
  const wrappers = Array.from(stage.querySelectorAll(".sticker-wrapper"));

  // preload static bitmaps and decode animated GIFs
  const stickers = await Promise.all(wrappers.map(async (w) => {
    const domImg = w.querySelector("img");
    const src    = domImg.getAttribute("src");
    const x      = parseFloat(w.getAttribute("data-x")) || 0;
    const y      = parseFloat(w.getAttribute("data-y")) || 0;
    const scale  = w.scale || 1;
    const angle  = w.angle || 0;

    // draw size (based on DOM image)
    const drawW = domImg.naturalWidth  || domImg.width  || 150;
    const drawH = domImg.naturalHeight || domImg.height || 150;

    if (/\.gif(?:[?#].*)?$/i.test(src)) {
      // decode frames
      const ab   = await fetch(src, { cache: "force-cache", mode: "cors" }).then(r => r.arrayBuffer());
      const gif  = window.__gif_parseGIF(ab);
      const frs  = window.__gif_decompressFrames(gif, true); // [{patch, dims, delay(ms), disposalType}, ...]

      // compute logical size from frames (max right/bottom)
      let gifW = 1, gifH = 1;
      for (const f of frs) {
        gifW = Math.max(gifW, (f.dims.left || 0) + f.dims.width);
        gifH = Math.max(gifH, (f.dims.top  || 0) + f.dims.height);
      }

      // per-sticker compositor canvas
      const sc = document.createElement("canvas");
      sc.width = gifW; sc.height = gifH;
      const sctx = sc.getContext("2d", { willReadFrequently: true });

      // delays and total loop duration
      const delays = frs.map(f => (f.delay && f.delay > 0 ? f.delay : 100));
      const totalDur = delays.reduce((a,b)=>a+b, 0) || 1;

      // optional: tiny cache of composed results per frame index to speed up
      const composedCache = new Map();

      return { kind: "anim", frames: frs, delays, totalDur, canvas: sc, sctx, gifW, gifH, drawW, drawH, x, y, scale, angle, cache: composedCache };
    } else {
      const bmp = await loadImage(src);
      return { kind: "static", img: bmp, drawW, drawH, x, y, scale, angle };
    }
  }));

  // encoder
  const enc = new GIFEncoder();
  enc.setRepeat(0);
  enc.setDelay(FRAME_MS);
  enc.setQuality(10);
  enc.start();

  // render frames
  for (let i = 0; i < TOTAL; i++) {
    if (CANCELLED) break;

    ctx.clearRect(0, 0, W, H);
    if (bgImg) ctx.drawImage(bgImg, 0, 0, W, H);

    for (const s of stickers) {
      ctx.save();
      ctx.translate(s.x, s.y);
      ctx.rotate((s.angle || 0) * Math.PI / 180);
      ctx.scale(s.scale || 1, s.scale || 1);

      if (s.kind === "static") {
        ctx.drawImage(s.img, 0, 0, s.drawW, s.drawH);
      } else {
        // determine frame index by elapsed export time
        const elapsed = i * FRAME_MS;
        const mod     = elapsed % s.totalDur;
        let acc = 0, idx = 0;
        for (; idx < s.delays.length; idx++) { acc += s.delays[idx]; if (mod < acc) break; }
        idx = idx % s.frames.length;

        // composite full sticker image at this index using disposal rules (1 & 2)
        const composed = composeAnimatedSticker(s, idx);
        // draw sticker canvas scaled to DOM size
        ctx.drawImage(composed, 0, 0, s.gifW, s.gifH, 0, 0, s.drawW, s.drawH);
      }
      ctx.restore();
    }

    enc.addFrame(ctx);
    updateProgress(i + 1, TOTAL, `Encoding ${i + 1}/${TOTAL}`);
    await sleep(FRAME_MS);
  }

  // finish or cancel
  if (!CANCELLED) {
    enc.finish();
    const binary = enc.stream().getData();
    const url = "data:image/gif;base64," + btoa(binary);
    const a = document.createElement("a");
    a.href = url; a.download = "banner.gif"; a.click();
    updateProgress(TOTAL, TOTAL, "Done.");
  } else {
    updateProgress(0, TOTAL, "Cancelled.");
  }

  // unlock UI
  if (btnPNG) btnPNG.disabled = false;
  if (btnGIF) btnGIF.disabled = false;
  if (btnCancel) btnCancel.style.display = "none";

  // --- helpers ---
  function sleep(ms){ return new Promise(r => setTimeout(r, ms)); }
  function loadImage(url) {
    return new Promise((res, rej) => {
      if (!url) return res(null);
      const im = new Image();
      im.crossOrigin = "anonymous";
      im.onload = () => res(im);
      im.onerror = rej;
      im.src = url;
    });
  }
  function updateProgress(done, total, label) {
    if (progEl) progEl.textContent = `${label || ""}${label ? " — " : ""}${done}/${total}`;
  }

  // Compose full sticker image up to target frame index, respecting disposal 1 and 2.
  // Caches per-index composites for speed.
  function composeAnimatedSticker(s, targetIdx) {
    // cache hit
    if (s.cache.has(targetIdx)) return s.cache.get(targetIdx);

    const { frames, sctx, canvas } = s;
    // clear
    sctx.clearRect(0, 0, s.gifW, s.gifH);

    // We replay from 0..targetIdx applying disposal on each step (no "restore previous" support).
    for (let k = 0; k <= targetIdx; k++) {
      const f = frames[k];

      // draw this frame's patch
      const patch = new ImageData(new Uint8ClampedArray(f.patch), f.dims.width, f.dims.height);
      // draw via temp canvas to preserve alpha correctly
      const tmp = document.createElement("canvas");
      tmp.width = f.dims.width; tmp.height = f.dims.height;
      tmp.getContext("2d").putImageData(patch, 0, 0);
      sctx.drawImage(tmp, f.dims.left, f.dims.top);

      // apply disposal *after* drawing, except for the final target frame
      if (k !== targetIdx && f.disposalType === 2) {
        sctx.clearRect(f.dims.left, f.dims.top, f.dims.width, f.dims.height);
      }
      // disposalType 3 (restore previous) is ignored; most stickers use 1 or 2.
    }

    s.cache.set(targetIdx, canvas);
    return canvas;
  }
});



