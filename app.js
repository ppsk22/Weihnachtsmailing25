// ==== POPUP OVER STAGE (NEW) =============================================

// Elements
const overlay = document.getElementById('overlay');
const popup   = document.getElementById('popup');

// Utility
function basename(path){
  const q = path.split('?')[0].split('#')[0];
  return q.split('/').pop();
}
function closePopup(){
  overlay.classList.remove('open');
  overlay.classList.add('hidden');
  popup.innerHTML = '';
  document.body.classList.remove('modal-open');
  
  // Re-enable interact.js
  document.querySelectorAll('.sticker-wrapper').forEach(el => {
    if (el.interactable) el.interactable().draggable(true);
    const sh = el.querySelector('.scale-handle');
    const rh = el.querySelector('.rot-handle');
    if (sh && sh.interactable) sh.interactable().draggable(true);
    if (rh && rh.interactable) rh.interactable().draggable(true);
  });
}
function openPopup(kind){
  overlay.classList.remove('hidden');
  overlay.classList.add('open');
  popup.innerHTML = '';
  document.body.classList.add('modal-open');
  
  // Disable interact.js
  document.querySelectorAll('.sticker-wrapper').forEach(el => {
    if (el.interactable) el.interactable().draggable(false);
    const sh = el.querySelector('.scale-handle');
    const rh = el.querySelector('.rot-handle');
    if (sh && sh.interactable) sh.interactable().draggable(false);
    if (rh && rh.interactable) rh.interactable().draggable(false);
  });

  const head = document.createElement('div');
  head.className = 'popup-head';
  head.innerHTML = `<span>${kind.toUpperCase()}</span><button id="popup-close" class="export-btn">×</button>`;

  const body = document.createElement('div');
  body.className = 'popup-body';

  popup.appendChild(head);
  popup.appendChild(body);

  document.getElementById('popup-close').addEventListener('click', closePopup);

  if (kind === 'bg'){
    buildBGGrid(body);
  } else if (kind === 'export'){
    buildExportUI(body);
  } else {
    const p = document.createElement('p');
    p.textContent = 'Coming soon.';
    body.appendChild(p);
  }
}

// Build BG grid with filename captions
function buildBGGrid(container){
  const source = document.querySelectorAll('#bg-data .bg-option');
  const wrap = document.createElement('div');
  wrap.className = 'bg-grid';

  source.forEach(opt => {
    const url = opt.getAttribute('data-bg');
    const card = document.createElement('div');
    card.className = 'bg-card';
    card.setAttribute('data-bg', url);

    const thumb = document.createElement('div');
    thumb.className = 'bg-thumb';
    const img = document.createElement('img');
    img.src = url;
    img.alt = basename(url);
    thumb.appendChild(img);

    const cap = document.createElement('div');
    cap.className = 'bg-caption';
    cap.textContent = basename(url);

    card.appendChild(thumb);
    card.appendChild(cap);
    wrap.appendChild(card);

    card.addEventListener('click', () => {
      const stage = document.getElementById('stage');
      stage.style.backgroundImage = `url(${url})`;
      closePopup();
    });
  });

  container.appendChild(wrap);
}

function buildExportUI(container){
  // Build the same controls the old panel had, but inside the popup
  const wrap = document.createElement('div');
  wrap.innerHTML = `
    <label class="lbl">FPS</label>
    <input id="gif-fps" type="range" min="1" max="15" value="5" />
    <span id="gif-fps-val">5</span> fps

    <label class="lbl">Duration (s)</label>
    <input id="gif-duration" type="number" min="1" max="20" value="5" class="num" />

    <div class="btn-row">
      <button id="export-png"   class="export-btn">PNG</button>
      <button id="export-gif"   class="export-btn">GIF</button>
      <button id="export-cancel" class="export-btn" style="display:none;">Cancel</button>
    </div>

    <div id="export-progress" class="progress"></div>
  `;
  container.appendChild(wrap);

  // Re-bind the existing handlers to these freshly created elements
  wireExportControls();
}


// Sidebar buttons now drive the popup
document.querySelectorAll('#sidebar .category').forEach(btn => {
  btn.addEventListener('click', () => {
    const which = btn.getAttribute('data-panel'); // 'bg', 'export', etc.
    const isOpen = overlay.classList.contains('open');
    if (isOpen){
      const current = popup.querySelector('.popup-head span')?.textContent?.toLowerCase();
      if (current === which){
        closePopup();
      } else {
        openPopup(which);
      }
    } else {
      openPopup(which);
    }
  });
});

// Clicking the dim area closes the popup
overlay.addEventListener('click', (e) => {
  if (e.target === overlay) closePopup();
});

// Stage starts black
document.getElementById('stage').style.backgroundColor = '#000';


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
	
	// ensure the <img> has a CSS size immediately so img.width/height are non-zero
	img.style.width  = img.style.width  || (STICKER_BASE_W + 'px');
	img.style.height = img.style.height || 'auto';


    stage.appendChild(wrapper);
	wrapper.style.zIndex = STICKER_Z_MIN;   // ensure it’s inside the sticker range
	bringStickerToFront(wrapper);           // new sticker starts on top of stickers

	// normalize initial scale and position once image size is known
	wrapper.scale = clampStickerScale(wrapper.scale);
	const imgEl = wrapper.querySelector('img');
	if (imgEl.complete && imgEl.naturalWidth) {
	  clampStickerPosition(wrapper);
	} else {
	  imgEl.addEventListener('load', () => {
		clampStickerPosition(wrapper);
		applyTransform(wrapper);
	  }, { once: true });
	}

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

function uiScale() {
  const v = getComputedStyle(document.documentElement).getPropertyValue('--ui-scale').trim();
  return v ? parseFloat(v) : 1;
}

interact('.sticker-src').draggable({
  listeners: {
    start (event) {
      const stage = document.getElementById("stage");
      const r = stage.getBoundingClientRect();
      const s = uiScale();

      // pointer → stage coords (unscaled)
      const x0 = (event.clientX - r.left) / s - 75; // 150/2
      const y0 = (event.clientY - r.top)  / s - 75;

      spawningWrapper = createStickerAt(event.target.src, x0, y0);

      // clamp immediately so it can’t start off-stage
      clampStickerPosition(spawningWrapper);
      applyTransform(spawningWrapper);
    },

    move (event) {
      if (!spawningWrapper) return;

      const stage = document.getElementById("stage");
      const r = stage.getBoundingClientRect();
      const s = uiScale();

      const x = (event.clientX - r.left) / s - 75;
      const y = (event.clientY - r.top)  / s - 75;

      spawningWrapper.setAttribute("data-x", x);
      spawningWrapper.setAttribute("data-y", y);

      // keep center inside stage while dragging in
      clampStickerPosition(spawningWrapper);
      applyTransform(spawningWrapper);
    },

    end () {
      if (spawningWrapper) {
        // final snap-in just in case
        clampStickerPosition(spawningWrapper);
        applyTransform(spawningWrapper);
      }
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
	bringStickerToFront(el);            // <-- add this line
});

    // Drag to move
	interact(el).draggable({
  allowFrom: "img",
  listeners: {
    start(){ el.classList.add("dragging"); },
    move(event) {
      const s = uiScale ? uiScale() : 1;
      const x = (parseFloat(el.getAttribute("data-x")) || 0) + event.dx / s;
      const y = (parseFloat(el.getAttribute("data-y")) || 0) + event.dy / s;
      el.setAttribute("data-x", x);
      el.setAttribute("data-y", y);
	  clampStickerPosition(el);
      applyTransform(el);
    },
    end(){ el.classList.remove("dragging"); }
  }
});


    // Mobile pinch + rotate
    interact(el).gesturable({
	  listeners: {
		move(event) {
		  el.scale = clampStickerScale(el.scale * (1 + event.ds));
		  el.angle += event.da;
		  clampStickerPosition(el);
		  applyTransform(el);
		}
	  }
	});


    // Desktop scale
  const scaleHandle = el.querySelector(".scale-handle");
interact(scaleHandle).draggable({
  listeners: {
    start() {
      scaleHandle.classList.add("dragging");
      document.body.classList.add("scaling");     // <— NEW: force se-resize
    },
    move(event) {
	  const s = uiScale ? uiScale() : 1;
	  el.scale = clampStickerScale(el.scale + (event.dx / s) * 0.01);
	  clampStickerPosition(el);
	  applyTransform(el);
	},
    end() {
      scaleHandle.classList.remove("dragging");
      document.body.classList.remove("scaling");  // <— NEW
    }
  }
});
    // Desktop rotate
    // rotate handle feedback
const rotHandle = el.querySelector(".rot-handle");
interact(rotHandle).draggable({
  listeners: {
    start() {
      rotHandle.classList.add("dragging");
      document.body.classList.add("rotating");    // <— NEW: force grabbing
    },
    move(event) {
      el.angle += event.dx * 0.5;
      applyTransform(el);
    },
    end() {
      rotHandle.classList.remove("dragging");
      document.body.classList.remove("rotating"); // <— NEW
    }
  }
});

    // Delete on double click
    el.addEventListener("dblclick", () => el.remove());
}

const fsBtn  = document.getElementById('btn-fullscreen');
const fsHost = document.getElementById('root'); // fullscreen the scaling shell

function setFsButton(isFull){
  fsBtn.setAttribute('aria-pressed', String(isFull));
  fsBtn.textContent = isFull ? '⏏' : '⛶'; // optional icon swap
}

fsBtn.addEventListener('click', async () => {
  try {
    if (!document.fullscreenElement) {
      await fsHost.requestFullscreen({ navigationUI: 'hide' });
    } else {
      await document.exitFullscreen();
    }
  } catch (e) { console.error(e); }
});

document.addEventListener('fullscreenchange', () => {
  const isFull = !!document.fullscreenElement;
  setFsButton(isFull);
  // re-run your scaler so the frame fits fullscreen viewport
  if (typeof updateUIScale === 'function') updateUIScale();
});

// initialize
setFsButton(false);

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

// ---- STICKER SCALE LIMITS -------------------------------------------------
const STICKER_MIN_PX   = 100;
const STICKER_MAX_FRAC = 0.9;             // 90% of min(stageW, stageH)
const STICKER_BASE_W   = 150;             // your createStickerAt default

function stickerMinScale() {
  return Math.max(0.05, STICKER_MIN_PX / STICKER_BASE_W);
}
function stickerMaxScale() {
  const maxPx = Math.floor(Math.min(STAGE_W, STAGE_H) * STICKER_MAX_FRAC);
  return Math.max(stickerMinScale() + 0.01, maxPx / STICKER_BASE_W);
}
function clampStickerScale(s) {
  const lo = stickerMinScale();
  const hi = stickerMaxScale();
  return Math.min(hi, Math.max(lo, s));
}


function clampStickerPosition(el){
  // current translate (top-left in unscaled wrapper space)
  let x = parseFloat(el.getAttribute('data-x')) || 0;
  let y = parseFloat(el.getAttribute('data-y')) || 0;

  // base (UNSCALED) image size: use the CSS width you set at creation (150px),
  // derive height from natural aspect; ignore scale & rotation on purpose.
  const img = el.querySelector('img');

  const baseW = parseFloat(img?.style.width) || 150;
  const baseH = (img && img.naturalWidth && img.naturalHeight)
    ? baseW * (img.naturalHeight / img.naturalWidth)
    : baseW;

  // logical (unscaled) center
  let cx = x + baseW / 2;
  let cy = y + baseH / 2;

  // clamp the center to the stage bounds in *logical* coords
  if (cx < 0)        cx = 0;
  if (cx > STAGE_W)  cx = STAGE_W;
  if (cy < 0)        cy = 0;
  if (cy > STAGE_H)  cy = STAGE_H;

  // convert back to top-left (still unscaled)
  x = cx - baseW / 2;
  y = cy - baseH / 2;

  el.setAttribute('data-x', x);
  el.setAttribute('data-y', y);
}







// logical dimensions (match your CSS tokens)
const SIDEBAR_W = 80;
const PANEL_W = 200;
const STICKERBAR_H = 100;

// reflect layout tokens into CSS (optional but consistent)
document.documentElement.style.setProperty('--sidebar-w', SIDEBAR_W + 'px');
document.documentElement.style.setProperty('--panel-w', PANEL_W + 'px');
document.documentElement.style.setProperty('--stickerbar-h', STICKERBAR_H + 'px');



// scale the whole frame to fit viewport (no upscaling)
function isFullscreen() {
  return document.fullscreenElement === fsHost ||
         document.webkitFullscreenElement === fsHost ||
         document.mozFullScreenElement === fsHost ||
         document.msFullscreenElement === fsHost;
}

function syncFullscreenUI(){
  const on = isFullscreen();
  fsHost.classList.toggle('fs-on', on);  // <— drives CSS
  setFsButton(on);
  updateUIScale();                       // allows upscaling in FS
}

// listen for all vendor events
document.addEventListener('fullscreenchange',       syncFullscreenUI);
document.addEventListener('webkitfullscreenchange', syncFullscreenUI);
document.addEventListener('mozfullscreenchange',    syncFullscreenUI);
document.addEventListener('MSFullscreenChange',     syncFullscreenUI);

// call once on load to normalize state
syncFullscreenUI();


function updateUIScale(){
  const frameW = SIDEBAR_W + STAGE_W;  // no panel anymore, using overlay
  const frameH = STAGE_H + STICKERBAR_H;
  const scaleW = window.innerWidth  / frameW;
  const scaleH = window.innerHeight / frameH;
  const fit    = Math.min(scaleW, scaleH);
  const s      = isFullscreen() ? fit : Math.min(fit, 1);  // upscale only in FS
  document.documentElement.style.setProperty('--ui-scale', String(s));
}

window.addEventListener('resize', updateUIScale);
updateUIScale();
    

	// ---- STICKER Z-INDEX BUBBLE --------------------------------------------
// Stickers live only inside this range. Other layers (Headline/CTA/etc.)
// can use z-indexes above this range and will always sit on top.
const STICKER_Z_MIN = 100;
const STICKER_Z_MAX = 999;
let   STICKER_Z_CUR = STICKER_Z_MIN;

function bringStickerToFront(el){
  // bump this sticker to the top of the sticker layer
  STICKER_Z_CUR = Math.min(STICKER_Z_CUR + 1, STICKER_Z_MAX);
  el.style.zIndex = STICKER_Z_CUR;

  // compact if we hit the ceiling (keeps numbers small)
  if (STICKER_Z_CUR >= STICKER_Z_MAX) {
    const stickers = Array.from(document.querySelectorAll('#stage .sticker-wrapper'))
      .sort((a,b) => (parseInt(a.style.zIndex||STICKER_Z_MIN,10) - parseInt(b.style.zIndex||STICKER_Z_MIN,10)));
    STICKER_Z_CUR = STICKER_Z_MIN;
    for (const s of stickers) s.style.zIndex = ++STICKER_Z_CUR;
  }
}

	
//------------------------------------------------------
// EXPORT UI wiring
//------------------------------------------------------
function wireExportControls(){
  const fpsInput = document.getElementById("gif-fps");
  const fpsVal   = document.getElementById("gif-fps-val");
  const durInput = document.getElementById("gif-duration");
  const btnPNG   = document.getElementById("export-png");
  const btnGIF   = document.getElementById("export-gif");
  const btnCancel= document.getElementById("export-cancel");
  const progEl   = document.getElementById("export-progress");

  if (!fpsInput || !btnPNG || !btnGIF) return; // popup not present yet

  // Update the readout
  fpsInput.addEventListener("input", () => { fpsVal.textContent = fpsInput.value; });

  // PNG EXPORT
  btnPNG.addEventListener("click", async () => {
    const stage = document.getElementById("stage");
    const canvas = await html2canvas(stage, {
      x: 0,
      y: 0,
      width: STAGE_W,
      height: STAGE_H,
      windowWidth: STAGE_W,
      windowHeight: STAGE_H,
      scale: 1,
      useCORS: true,
      backgroundColor: null
    });
    const link = document.createElement("a");
    link.download = "banner.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
  });

  // GIF EXPORT
  btnGIF.addEventListener("click", async () => {
    if (typeof window.__gif_parseGIF !== "function" ||
        typeof window.__gif_decompressFrames !== "function") {
      console.error("gifuct-js not loaded"); 
      alert("GIF library not loaded. Please refresh the page.");
      return;
    }
    if (typeof GIFEncoder !== "function") {
      console.error("jsgif not loaded"); 
      alert("GIF encoder not loaded. Please refresh the page.");
      return;
    }

    const FPS = Math.max(1, Math.min(15, parseInt(fpsInput?.value || "5", 10)));
    const DURATION_S = Math.max(1, Math.min(20, parseInt(durInput?.value || "5", 10)));
    const TOTAL = FPS * DURATION_S;
    const FRAME_MS = Math.round(1000 / FPS);

    let CANCELLED = false;
    btnPNG.disabled = true;
    btnGIF.disabled = true;
    btnCancel.style.display = "inline-block";
    btnCancel.onclick = () => { CANCELLED = true; };
    progEl.textContent = `Preloading… 0/${TOTAL}`;

    const stage = document.getElementById("stage");
    const W = STAGE_W;
    const H = STAGE_H;

    const buf  = document.createElement("canvas");
    buf.width  = W; buf.height = H;
    const ctx  = buf.getContext("2d", { willReadFrequently: true });

    const bgMatch = (stage.style.backgroundImage || "").match(/url\(["']?(.*?)["']?\)/);
    const bgURL   = bgMatch ? bgMatch[1] : null;
    const bgImg   = bgURL ? await loadImage(bgURL) : null;

    const wrappers = Array.from(stage.querySelectorAll(".sticker-wrapper"));

    // preload stickers - keep top-left coordinates to match CSS transform
    const stickers = await Promise.all(wrappers.map(async (w) => {
      const domImg = w.querySelector("img");
      const src    = domImg.getAttribute("src");
      const x      = parseFloat(w.getAttribute("data-x")) || 0;  // top-left
      const y      = parseFloat(w.getAttribute("data-y")) || 0;  // top-left
      const scale  = w.scale || 1;
      const angle  = w.angle || 0;
      const domW   = domImg.naturalWidth  || domImg.width  || 150;
      const domH   = domImg.naturalHeight || domImg.height || 150;
      
      // Get base dimensions to match CSS transform-origin: center behavior
      const baseW = parseFloat(domImg.style.width) || 150;
      const baseH = domW > 0 ? (baseW * domH / domW) : baseW;

      if (/\.gif(?:[?#].*)?$/i.test(src)) {
        const ab   = await fetch(src, { cache: "force-cache", mode: "cors" }).then(r => r.arrayBuffer());
        const gif  = window.__gif_parseGIF(ab);
        const frs  = window.__gif_decompressFrames(gif, true);
        const delays = frs.map(f => (f.delay && f.delay > 0 ? f.delay : 10));
        const totalDur = delays.reduce((a,b)=>a+b, 0) || 1;
        return { kind: "anim", frames: frs, delays, totalDur, x, y, scale, angle, domW, domH, baseW, baseH };
      } else {
        const bmp = await loadImage(src);
        return { kind: "static", img: bmp, x, y, scale, angle, domW, domH, baseW, baseH };
      }
    }));

    const enc = new GIFEncoder();
    enc.setRepeat(0);
    enc.setDelay(FRAME_MS);
    enc.setQuality(10);
    enc.start();

    for (let i = 0; i < TOTAL; i++) {
      if (CANCELLED) break;

      ctx.clearRect(0, 0, W, H);
      if (bgImg) ctx.drawImage(bgImg, 0, 0, W, H);

      for (const s of stickers) {
        ctx.save();
        // Match CSS: translate(x, y) scale(s) rotate(r) with transform-origin: center
        // Step 1: translate to top-left position
        ctx.translate(s.x, s.y);
        // Step 2: move to element's center (transform-origin: center)
        ctx.translate(s.baseW / 2, s.baseH / 2);
        // Step 3: apply rotation and scale (now around center)
        ctx.rotate((s.angle || 0) * Math.PI / 180);
        ctx.scale(s.scale || 1, s.scale || 1);
        // Step 4: draw using BASE dimensions (CSS-sized), offset so center is at origin
        const offsetX = -s.baseW / 2;
        const offsetY = -s.baseH / 2;

        if (s.kind === "static") {
          ctx.drawImage(s.img, offsetX, offsetY, s.baseW, s.baseH);
        } else {
          const elapsed = i * FRAME_MS;
          const mod     = elapsed % s.totalDur;
          let acc = 0, idx = 0;
          for (; idx < s.delays.length; idx++) { acc += s.delays[idx]; if (mod < acc) break; }
          const f = s.frames[idx % s.frames.length];

          if (f.disposalType === 2) {
            ctx.clearRect(f.dims.left + offsetX, f.dims.top + offsetY, f.dims.width, f.dims.height);
          }

          const patch = new ImageData(new Uint8ClampedArray(f.patch), f.dims.width, f.dims.height);
          const pc = document.createElement("canvas");
          pc.width = f.dims.width; pc.height = f.dims.height;
          pc.getContext("2d").putImageData(patch, 0, 0);
          ctx.drawImage(pc, f.dims.left + offsetX, f.dims.top + offsetY);
        }
        ctx.restore();
      }

      enc.addFrame(ctx);
      progEl.textContent = `Encoding ${i + 1}/${TOTAL}`;
      await sleep(FRAME_MS);
    }

    if (!CANCELLED) {
      enc.finish();
      const binary = enc.stream().getData();
      const url = "data:image/gif;base64," + btoa(binary);
      const a = document.createElement("a");
      a.href = url; a.download = "banner.gif"; a.click();
      progEl.textContent = `Done. ${TOTAL}/${TOTAL}`;
    } else {
      progEl.textContent = "Cancelled.";
    }

    btnPNG.disabled = false;
    btnGIF.disabled = false;
    btnCancel.style.display = "none";

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
}