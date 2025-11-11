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

    // destructure gifenc API (UMD build exposes "gifenc")
    const { Gif, GifFrame, quantize, applyPalette } = gifenc;

    const stage = document.getElementById("stage");
    const rect = stage.getBoundingClientRect();

    const w = Math.floor(rect.width);
    const h = Math.floor(rect.height);

    const frames = [];
    const totalFrames = 25;      // 5 seconds * 5 FPS
    const delay = 200;           // 200ms per frame

    for (let i = 0; i < totalFrames; i++) {

        const snap = await html2canvas(stage, {
            width: w,
            height: h,
            scale: 1,
            useCORS: true,
            backgroundColor: null
        });

        const ctx = snap.getContext("2d");
        const img = ctx.getImageData(0, 0, w, h);

        // palette
        const palette = quantize(img.data, 256);
        const indexData = applyPalette(img.data, palette);

        // create and push a frame
        const frame = new GifFrame(indexData, {
            palette: palette,
            width: w,
            height: h,
            delay: delay
        });

        frames.push(frame);

        // a slight wait ensures html2canvas settles on each loop
        await new Promise(r => setTimeout(r, delay));
    }

    // build final GIF
    const gif = new Gif(frames);
    const bytes = gif.encode(); // Uint8Array

    // export
    const blob = new Blob([bytes], { type: "image/gif" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "banner.gif";
    a.click();

    URL.revokeObjectURL(url);
});



