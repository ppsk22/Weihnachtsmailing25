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

const STAGE_W = 1200;
const STAGE_H = 600;

// enforce the same size on the DOM element too
const __stage = document.getElementById("stage");
if (__stage) {
  __stage.style.width = STAGE_W + "px";
  __stage.style.height = STAGE_H + "px";
}

// reflect JS constants into CSS vars (so layout reserves space correctly)
document.documentElement.style.setProperty('--stage-w', STAGE_W + 'px');
document.documentElement.style.setProperty('--stage-h', STAGE_H + 'px');

    
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
  const canvas = await html2canvas(stage, {
    width: STAGE_W,
    height: STAGE_H,
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
// GIF EXPORT — working logic + FPS/DUR + progress/cancel
// deps loaded before app.js:
//   - __gif_parseGIF / __gif_decompressFrames (gifuct-js via ESM shim)
//   - GIFEncoder (jsgif: LZWEncoder.js + NeuQuant.js + GIFEncoder.js)
//------------------------------------------------------
document.getElementById("export-gif").addEventListener("click", async () => {
  if (typeof window.__gif_parseGIF !== "function" ||
      typeof window.__gif_decompressFrames !== "function") {
    console.error("gifuct-js not loaded"); return;
  }
  if (typeof GIFEncoder !== "function") {
    console.error("jsgif not loaded"); return;
  }

  // UI bits (must exist in your Export panel)
  const fpsInput = document.getElementById("gif-fps");
  const durInput = document.getElementById("gif-duration");
  const progEl   = document.getElementById("export-progress");
  const btnPNG   = document.getElementById("export-png");
  const btnGIF   = document.getElementById("export-gif");
  const btnCancel= document.getElementById("export-cancel");

  // options
  const FPS = Math.max(1, Math.min(15, parseInt(fpsInput?.value || "5", 10)));
  const DURATION_S = Math.max(1, Math.min(20, parseInt(durInput?.value || "5", 10)));
  const TOTAL = FPS * DURATION_S;
  const FRAME_MS = Math.round(1000 / FPS);

  // lock UI
  let CANCELLED = false;
  if (btnPNG) btnPNG.disabled = true;
  if (btnGIF) btnGIF.disabled = true;
  if (btnCancel) { btnCancel.style.display = "inline-block"; btnCancel.onclick = () => { CANCELLED = true; }; }
  if (progEl) progEl.textContent = `Preloading… 0/${TOTAL}`;

  // stage + buffer
  const stage = document.getElementById("stage");
  const W = STAGE_W;
  const H = STAGE_H;

  const buf  = document.createElement("canvas");
  buf.width  = W; buf.height = H;
  const ctx  = buf.getContext("2d", { willReadFrequently: true });

  // background (inline url("..."))
  const bgMatch = (stage.style.backgroundImage || "").match(/url\(["']?(.*?)["']?\)/);
  const bgURL   = bgMatch ? bgMatch[1] : null;
  const bgImg   = bgURL ? await loadImage(bgURL) : null;

  // collect stickers now
  const wrappers = Array.from(stage.querySelectorAll(".sticker-wrapper"));

  // preload (unchanged logic you had)
  const stickers = await Promise.all(wrappers.map(async (w) => {
    const domImg = w.querySelector("img");
    const src    = domImg.getAttribute("src");
    const x      = parseFloat(w.getAttribute("data-x")) || 0;
    const y      = parseFloat(w.getAttribute("data-y")) || 0;
    const scale  = w.scale || 1;
    const angle  = w.angle || 0;
    const domW   = domImg.naturalWidth  || domImg.width  || 150;
    const domH   = domImg.naturalHeight || domImg.height || 150;

    if (/\.gif(?:[?#].*)?$/i.test(src)) {
      const ab   = await fetch(src, { cache: "force-cache", mode: "cors" }).then(r => r.arrayBuffer());
      const gif  = window.__gif_parseGIF(ab);
      const frs  = window.__gif_decompressFrames(gif, true); // [{patch, dims, delay, disposalType}, ...]
      const delays = frs.map(f => (f.delay && f.delay > 0 ? f.delay : 10));
      const totalDur = delays.reduce((a,b)=>a+b, 0) || 1;
      return { kind: "anim", frames: frs, delays, totalDur, x, y, scale, angle, domW, domH };
    } else {
      const bmp = await loadImage(src);
      return { kind: "static", img: bmp, x, y, scale, angle, domW, domH };
    }
  }));

  // encoder (unchanged)
  const enc = new GIFEncoder();
  enc.setRepeat(0);
  enc.setDelay(FRAME_MS);
  enc.setQuality(10);
  enc.start();

  // render loop (unchanged drawing logic)
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
        ctx.drawImage(s.img, 0, 0, s.domW, s.domH);
      } else {
        const elapsed = i * FRAME_MS;
        const mod     = elapsed % s.totalDur;
        let acc = 0, idx = 0;
        for (; idx < s.delays.length; idx++) { acc += s.delays[idx]; if (mod < acc) break; }
        const f = s.frames[idx % s.frames.length];

        if (f.disposalType === 2) {
          ctx.clearRect(f.dims.left, f.dims.top, f.dims.width, f.dims.height);
        }

        const patch = new ImageData(new Uint8ClampedArray(f.patch), f.dims.width, f.dims.height);
        const pc = document.createElement("canvas");
        pc.width = f.dims.width; pc.height = f.dims.height;
        pc.getContext("2d").putImageData(patch, 0, 0);
        ctx.drawImage(pc, f.dims.left, f.dims.top);
      }
      ctx.restore();
    }

    enc.addFrame(ctx);
    if (progEl) progEl.textContent = `Encoding ${i + 1}/${TOTAL}`;
    await sleep(FRAME_MS);
  }

  // finish / cancel
  if (!CANCELLED) {
    enc.finish();
    const binary = enc.stream().getData(); // binary string
    const url = "data:image/gif;base64," + btoa(binary);
    const a = document.createElement("a");
    a.href = url; a.download = "banner.gif"; a.click();
    if (progEl) progEl.textContent = `Done. ${TOTAL}/${TOTAL}`;
  } else {
    if (progEl) progEl.textContent = "Cancelled.";
  }

  // unlock UI
  if (btnPNG) btnPNG.disabled = false;
  if (btnGIF) btnGIF.disabled = false;
  if (btnCancel) btnCancel.style.display = "none";

  // helpers
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
});








