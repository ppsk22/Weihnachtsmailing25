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

  // integer, fixed-size frames
  const W = Math.max(1, Math.floor(rect.width));
  const H = Math.max(1, Math.floor(rect.height));
  const FPS = 5, DURATION = 5, FRAMES = FPS * DURATION, DELAY = Math.round(1000 / FPS);

  // local worker path must already be set once in HTML:
  // window.GIF = window.GIF || {}; window.GIF.workerScript = "js/gif.worker.js";
  const gif = new GIF({ workers: 2, quality: 10, width: W, height: H });

  // create a fixed buffer canvas; always add its 2D context
  const buf = document.createElement("canvas");
  buf.width = W; buf.height = H;
  const bctx = buf.getContext("2d", { willReadFrequently: true });

  // download when finished
  gif.on("finished", (blob) => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "banner.gif"; a.click();
    URL.revokeObjectURL(url);
  });

  // capture frames sequentially
  for (let i = 0; i < FRAMES; i++) {
    // take a snapshot of the stage at fixed size
    const snap = await html2canvas(stage, {
      width: W, height: H, scale: 1, useCORS: true, backgroundColor: null
    });

    // draw snapshot onto the fixed buffer (prevents size/taint races)
    bctx.clearRect(0, 0, W, H);
    bctx.drawImage(snap, 0, 0, W, H);

    // add the *context*, not the canvas; force copy now
    gif.addFrame(bctx, { delay: DELAY, copy: true });

    // pace at FPS
    await new Promise(r => setTimeout(r, DELAY));
  }

  gif.render();
});


