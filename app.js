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
// PNG EXPORT
//------------------------------------------------------
document.getElementById("export-png").addEventListener("click", () => {
    const stage = document.getElementById("stage");

    const rect = stage.getBoundingClientRect();
    const canvas = document.createElement("canvas");
    canvas.width = rect.width;
    canvas.height = rect.height;

    const ctx = canvas.getContext("2d");

    html2canvas(stage).then(canvas => {
        const link = document.createElement("a");
        link.download = "banner.png";
        link.href = canvas.toDataURL("image/png");
        link.click();
    });
});

//------------------------------------------------------
// ANIMATED GIF EXPORT (5 seconds, 5 FPS)
//------------------------------------------------------
document.getElementById("export-gif").addEventListener("click", async () => {
  const stage = document.getElementById("stage");
  const rect  = stage.getBoundingClientRect();
  const W = Math.max(1, Math.floor(rect.width));
  const H = Math.max(1, Math.floor(rect.height));

  // timeline
  const FPS = 5, DURATION_SEC = 5;
  const TOTAL = FPS * DURATION_SEC;
  const FRAME_MS = Math.round(1000 / FPS);

  // prep canvas we’ll draw on each step
  const buf = document.createElement("canvas");
  buf.width = W; buf.height = H;
  const ctx = buf.getContext("2d", { willReadFrequently: true });

  // parse background url from stage style
  const bgUrlMatch = (stage.style.backgroundImage || "").match(/url\("?(.*?)"?\)/);
  const bgUrl = bgUrlMatch ? bgUrlMatch[1] : null;
  const bgImg = bgUrl ? await loadImage(bgUrl) : null;

  // collect stickers
  const wrappers = Array.from(stage.querySelectorAll(".sticker-wrapper"));

  // preload static sticker bitmaps and decode animated GIF stickers
  const stickerData = await Promise.all(wrappers.map(async (w) => {
    const img = w.querySelector("img");
    const src = img.getAttribute("src");
    const x = parseFloat(w.getAttribute("data-x")) || 0;
    const y = parseFloat(w.getAttribute("data-y")) || 0;
    const scale = w.scale || 1;
    const angle = w.angle || 0;

    if (src.toLowerCase().endsWith(".gif")) {
      // decode with gifuct-js
      const ab = await fetch(src, { cache: "force-cache" }).then(r => r.arrayBuffer());
      const gif = gifuct.parseGIF(ab);
      const frames = gifuct.decompressFrames(gif, true); // RGBA frames + delays
      // build timeline (cumulative ms)
      const delays = frames.map(f => f.delay); // ms
      const totalDur = delays.reduce((a, b) => a + b, 0) || 1;
      return { type: "anim", frames, delays, totalDur, x, y, scale, angle, w };
    } else {
      // static image
      const bitmap = await loadImage(src);
      return { type: "static", img: bitmap, x, y, scale, angle, w };
    }
  }));

  // encoder (jsgif)
  const enc = new GIFEncoder();
  enc.setRepeat(0);
  enc.setDelay(FRAME_MS);
  enc.setQuality(10);
  enc.start();

  // render loop
  for (let i = 0; i < TOTAL; i++) {
    // clear and draw background
    ctx.clearRect(0, 0, W, H);
    if (bgImg) ctx.drawImage(bgImg, 0, 0, W, H);

    // draw each sticker
    for (const s of stickerData) {
      ctx.save();
      // center transform around image center by drawing after translate/rotate/scale
      const { x, y, scale, angle } = s;
      ctx.translate(x, y);
      ctx.rotate(angle * Math.PI / 180);
      ctx.scale(scale, scale);

      if (s.type === "static") {
        // draw static bitmap at 0,0 using DOM <img> width for size
        const domImg = s.w.querySelector("img");
        const w = domImg.naturalWidth || s.img.width;
        const h = domImg.naturalHeight || s.img.height;
        ctx.drawImage(s.img, 0, 0, w, h);
      } else {
        // animated: pick frame by export time
        const elapsed = i * FRAME_MS; // ms
        const t = s.totalDur; // loop
        let acc = 0, idx = 0;
        const mod = elapsed % t;
        for (; idx < s.delays.length; idx++) {
          acc += s.delays[idx] || 10; // fallback
          if (mod < acc) break;
        }
        const f = s.frames[idx % s.frames.length];
        // build an ImageData for the patch
        const patch = new ImageData(new Uint8ClampedArray(f.patch), f.dims.width, f.dims.height);

        // disposal handling: 1=draw over, 2=restore to bg (clear), 3=restore to previous (not tracked here)
        if (f.disposalType === 2) {
          ctx.clearRect(f.dims.left, f.dims.top, f.dims.width, f.dims.height);
        }

        // put the frame patch at its offset
        // draw ImageData onto an offscreen then putImageData to preserve alpha
        const off = new OffscreenCanvas(f.dims.width, f.dims.height);
        off.getContext("2d").putImageData(patch, 0, 0);
        ctx.drawImage(off, f.dims.left, f.dims.top);
      }
      ctx.restore();
    }

    // add this composed frame
    enc.addFrame(ctx);

    // pace capture
    await sleep(FRAME_MS);
  }

  enc.finish();
  const binary = enc.stream().getData(); // binary string
  const url = "data:image/gif;base64," + btoa(binary);
  const a = document.createElement("a");
  a.href = url; a.download = "banner.gif"; a.click();

  // helpers
  function loadImage(url) {
    return new Promise((res, rej) => {
      const im = new Image();
      im.onload = () => res(im);
      im.onerror = rej;
      // Important: same-origin or CORS-enabled only to avoid tainting.
      // https://developer.mozilla.org/en-US/docs/Web/HTML/How_to/CORS_enabled_image
      im.crossOrigin = "anonymous";
      im.src = url;
    });
  }
  function sleep(ms){ return new Promise(r => setTimeout(r, ms)); }
});


