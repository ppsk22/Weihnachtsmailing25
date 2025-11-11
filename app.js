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
  const rect = stage.getBoundingClientRect();

  // force integer dims and neutralize DPR scaling
  const w = Math.max(1, Math.floor(rect.width));
  const h = Math.max(1, Math.floor(rect.height));

  const fps = 5;
  const durationSec = 5;
  const frames = fps * durationSec;
  const delay = Math.round(1000 / fps); // ms

  // workerScript already set globally in <head> to "js/gif.worker.js"
  const gif = new GIF({
    workers: 2,
    quality: 10,
    width: w,
    height: h
  });

  // attach finished handler BEFORE rendering
  gif.on("finished", (blob) => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "banner.gif";
    a.click();
    URL.revokeObjectURL(url);
  });

  // sequential capture to avoid overlap/races
  for (let i = 0; i < frames; i++) {
    // ensure consistent canvas from html2canvas
    // scale:1 avoids DPR-inflated backing store sizes
    // useCORS true helps if you later point assets to a CDN with CORS
    // backgroundColor null preserves transparency if any
    // willReadFrequently hint improves getImageData loops (perf only)
    // (html2canvas ignores willReadFrequently; browsers use context attr)
    // To really apply the hint, set it on a 2D context you own. Not needed here.
    // The key flag here is scale: 1.
    // NOTE: html2canvas can still return a canvas whose internal size != CSS size if not forced; width/height forces it.
    /* eslint-disable no-await-in-loop */
    const snap = await html2canvas(stage, {
      width: w,
      height: h,
      scale: 1,
      useCORS: true,
      backgroundColor: null
    });
    // copy:true makes gif.js read pixels now; avoids later taint/timing issues
    gif.addFrame(snap, { delay, copy: true });

    // paced capture (5 fps). Use rAF to keep UI responsive.
    await new Promise((r) => setTimeout(r, delay));
    /* eslint-enable no-await-in-loop */
  }

  // safety timeout so it can’t hang silently forever
  const failSafe = setTimeout(() => {
    console.error("GIF render timeout");
  }, 60000); // 60s cap for slow devices

  gif.on("finished", () => clearTimeout(failSafe));
  gif.render();
});


