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
  
  // Remove active state from all buttons
  document.querySelectorAll('#sidebar .category').forEach(btn => {
    btn.classList.remove('active');
  });
  
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
  
  // Reset scroll position to top
  overlay.scrollTop = 0;
  
  // Set active state on the button that opened this popup
  document.querySelectorAll('#sidebar .category').forEach(btn => {
    if (btn.getAttribute('data-panel') === kind) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });
  
  // Disable interact.js
  document.querySelectorAll('.sticker-wrapper').forEach(el => {
    if (el.interactable) el.interactable().draggable(false);
    const sh = el.querySelector('.scale-handle');
    const rh = el.querySelector('.rot-handle');
    if (sh && sh.interactable) sh.interactable().draggable(false);
    if (rh && rh.interactable) rh.interactable().draggable(false);
  });

  // Determine title based on kind
  let title = kind.toUpperCase();
  if (kind === 'bg') title = 'PICK YOUR THEME';
  if (kind === '2') title = 'PICK YOUR HERO';
  if (kind === '3') title = 'CHOOSE YOUR HEADLINE';
  if (kind === '5') title = 'CHOOSE YOUR COMPANY NAME';
  if (kind === '6') title = 'CHOOSE YOUR CALL TO ACTION';

  const head = document.createElement('div');
  head.className = 'popup-head';
  head.innerHTML = `<span>${title}</span><button id="popup-close">×</button>`;

  const body = document.createElement('div');
  body.className = 'popup-body';
  
  // Prevent clicks anywhere in popup body from closing overlay
  body.addEventListener('click', (e) => {
    e.stopPropagation();
  });

  popup.appendChild(head);
  popup.appendChild(body);

  document.getElementById('popup-close').addEventListener('click', closePopup);

  if (kind === 'bg'){
    buildBGGrid(body);
  } else if (kind === '2'){
    buildHeroGrid(body);
  } else if (kind === '3'){
    buildHeadlineUI(body);
  } else if (kind === '4'){
    // Button 4: Unlock stickers (no overlay needed)
    unlockStickers();
    closePopup();
    return; // Exit early, no overlay content
  } else if (kind === '5'){
    buildCompanyNameUI(body);
  } else if (kind === '6'){
    buildCTAButtonUI(body);
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

// Build Hero grid - uses #hero-data from HTML in random order, no captions
function buildHeroGrid(container){
  const source = Array.from(document.querySelectorAll('#hero-data .hero-option'));
  
  // Randomize the order
  const shuffled = source.sort(() => Math.random() - 0.5);
  
  const wrap = document.createElement('div');
  wrap.className = 'bg-grid';

  shuffled.forEach(opt => {
    const url = opt.getAttribute('data-hero');
    const card = document.createElement('div');
    card.className = 'bg-card';

    const thumb = document.createElement('div');
    thumb.className = 'bg-thumb';
    const img = document.createElement('img');
    img.src = url;
    img.alt = basename(url);
    thumb.appendChild(img);

    card.appendChild(thumb);
    // No caption added - just the image
    wrap.appendChild(card);

    card.addEventListener('click', () => {
      spawnHero(url);
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

// Prevent clicks inside popup from closing overlay
popup.addEventListener('click', (e) => {
  e.stopPropagation();
});

// Stage starts black
document.getElementById('stage').style.backgroundColor = '#000';

//------------------------------------------------------
// HERO MANAGEMENT
//------------------------------------------------------
let currentHero = null; // Track the current hero

function spawnHero(imageUrl) {
  const stage = document.getElementById('stage');
  
  // Remove existing hero if any
  if (currentHero) {
    currentHero.remove();
  }
  
  // Image is set to STICKER_BASE_W in createStickerAt (250px)
  // To center the image: top-left = stage_center - (image_size / 2)
  const imageSize = 300;  // Bigger hero spawn!
  const centerX = (STAGE_W / 2) - (imageSize / 2);
  const centerY = (STAGE_H / 2) - (imageSize / 2);
  
  currentHero = createStickerAt(imageUrl, centerX, centerY, true); // true = isHero
  
  // Select the hero immediately
  deselectAll();
  currentHero.classList.add('selected');
}

//------------------------------------------------------
// HEADLINE MANAGEMENT
//------------------------------------------------------
let currentHeadline = null; // Track the current headline
const adjectives = [
  'MAGICAL', 'FESTIVE', 'JOYFUL', 'MERRY',
  'BRIGHT', 'CHEERFUL', 'SPARKLING', 'COZY',
  'WONDER', 'JOLLY', 'SNOWY', 'GLOWING',
  'HAPPY', 'WARM', 'SHINY', 'BLESSED'
];

function buildHeadlineUI(container) {
  const selectedWords = [];
  
  // Create a wrapper that fills the space
  const wrapper = document.createElement('div');
  wrapper.style.height = '100%';  // MUST be height, not minHeight!
  wrapper.style.width = '100%';
  wrapper.style.position = 'relative';  // For absolute positioning of buttons!
  wrapper.addEventListener('click', (e) => {
    // Only stop propagation, don't close
    e.stopPropagation();
  });
  
  // Instructions
  const instructions = document.createElement('div');
  instructions.className = 'headline-instructions';
  instructions.textContent = 'Choose 4 words';
  wrapper.appendChild(instructions);
  
  // Word grid
  const wordGrid = document.createElement('div');
  wordGrid.className = 'word-grid';
  
  adjectives.forEach(word => {
    const wordBox = document.createElement('div');
    wordBox.className = 'word-box';
    wordBox.textContent = word;
    
    wordBox.addEventListener('click', () => {
      if (wordBox.classList.contains('selected')) {
        // Deselect
        wordBox.classList.remove('selected');
        const idx = selectedWords.indexOf(word);
        if (idx > -1) selectedWords.splice(idx, 1);
      } else if (selectedWords.length < 4) {
        // Select
        wordBox.classList.add('selected');
        selectedWords.push(word);
      }
      
      // If 4 words selected, show generator
      if (selectedWords.length === 4) {
        wordGrid.style.display = 'none';
        instructions.textContent = selectedWords.join(' • ');
        showHeadlineGenerator(wrapper, selectedWords);
      }
    });
    
    wordGrid.appendChild(wordBox);
  });
  
  wrapper.appendChild(wordGrid);
  container.appendChild(wrapper);
}

function showHeadlineGenerator(container, words) {
  const genContainer = document.createElement('div');
  genContainer.className = 'headline-generator';
  
  const preview = document.createElement('div');
  preview.className = 'headline-preview';
  
  const regenBtn = document.createElement('button');
  regenBtn.className = 'export-btn';
  regenBtn.textContent = 'Regenerate';
  
  const confirmBtn = document.createElement('button');
  confirmBtn.className = 'export-btn';
  confirmBtn.textContent = 'Confirm';
  
  function generateHeadline() {
    const shuffled = [...words].sort(() => Math.random() - 0.5);
    const text = shuffled.join(' ');
    
    // CLEAR all previous styles for true randomness!
    preview.style.cssText = '';
    preview.className = 'headline-preview';
    preview.textContent = text;
    
    // Apply TRASHY random styles! 🎉
    const colors = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff', '#ffffff', '#ff1493', '#00ff7f', '#ffa500', '#ff69b4'];
    const shadows = [
      '2px 2px 4px rgba(0,0,0,0.5)',
      '0 0 10px rgba(255,255,255,0.8)',
      '3px 3px 0 #000',
      '0 0 20px rgba(255,0,0,0.5)',
      '5px 5px 10px rgba(0,0,0,0.8)',
      '0 0 30px rgba(255,0,255,0.8)',
      '-2px -2px 0 #fff, 2px 2px 0 #000',
      '0 0 5px #fff, 0 0 10px #fff, 0 0 15px #ff00ff, 0 0 20px #ff00ff',
      '1px 1px 0 #000, 2px 2px 0 #fff, 3px 3px 0 #000',
      'inset 0 0 10px rgba(255,255,255,0.5)'
    ];
    
    const transforms = [
      'none',
      'uppercase',
      'lowercase',
      'capitalize'
    ];
    
    const fontFamilies = [
      'Arial, sans-serif',
      'Impact, fantasy',
      'Comic Sans MS, cursive',
      'Courier New, monospace',
      'Georgia, serif',
      'Brush Script MT, cursive',
      'Jumps Winter, cursive',
      'Spicy Sale, display',
      'Start Story, cursive',
      'Super Chiby, display',
      'Super Crawler, display'
    ];
    
    preview.style.color = colors[Math.floor(Math.random() * colors.length)];
    preview.style.textShadow = shadows[Math.floor(Math.random() * shadows.length)];
    preview.style.fontWeight = Math.random() > 0.3 ? 'bold' : 'normal';
    preview.style.fontStyle = Math.random() > 0.7 ? 'italic' : 'normal';
    preview.style.textDecoration = Math.random() > 0.8 ? 'underline' : 'none'; // Only underline, no line-through
    preview.style.textTransform = transforms[Math.floor(Math.random() * transforms.length)];
    preview.style.letterSpacing = Math.random() > 0.5 ? (Math.floor(Math.random() * 8) - 2 + 'px') : 'normal';
    preview.style.fontFamily = fontFamilies[Math.floor(Math.random() * fontFamilies.length)];
    
    // Extra trashy effects!
    if (Math.random() > 0.8) preview.style.transform = `skewX(${Math.floor(Math.random() * 20 - 10)}deg)`;
    if (Math.random() > 0.9) {  // 10% chance for background (more rare!)
      preview.style.background = `linear-gradient(90deg, ${colors[Math.floor(Math.random() * colors.length)]}, ${colors[Math.floor(Math.random() * colors.length)]})`;
      preview.style.padding = '8px 16px';
      if (Math.random() > 0.5) preview.style.borderRadius = `${Math.floor(Math.random() * 20)}px`; // Random rounded corners!
    }
    if (Math.random() > 0.85) preview.style.webkitTextStroke = `${Math.floor(Math.random() * 3)}px ${colors[Math.floor(Math.random() * colors.length)]}`;
    
    // Store the text for spawning
    preview.dataset.headlineText = text;
    preview.dataset.headlineColor = preview.style.color;
    preview.dataset.headlineShadow = preview.style.textShadow;
    preview.dataset.headlineWeight = preview.style.fontWeight;
    preview.dataset.headlineStyle = preview.style.fontStyle;
    preview.dataset.headlineDecoration = preview.style.textDecoration;
    preview.dataset.headlineTransform = preview.style.textTransform;
    preview.dataset.headlineLetterSpacing = preview.style.letterSpacing;
    preview.dataset.headlineFontFamily = preview.style.fontFamily;
    preview.dataset.headlineExtraTransform = preview.style.transform || 'none';
    preview.dataset.headlineBackground = preview.style.background || 'none';
    preview.dataset.headlineStroke = preview.style.webkitTextStroke || 'none';
    preview.dataset.headlinePadding = preview.style.padding || 'none';
    preview.dataset.headlineBorderRadius = preview.style.borderRadius || 'none';
  }
  
  regenBtn.addEventListener('click', generateHeadline);
  
  confirmBtn.addEventListener('click', () => {
    spawnHeadline(
      preview.dataset.headlineText,
      preview.dataset.headlineColor,
      preview.dataset.headlineShadow,
      preview.dataset.headlineWeight,
      preview.dataset.headlineStyle,
      preview.dataset.headlineDecoration,
      preview.dataset.headlineTransform,
      preview.dataset.headlineLetterSpacing,
      preview.dataset.headlineFontFamily,
      preview.dataset.headlineExtraTransform,
      preview.dataset.headlineBackground,
      preview.dataset.headlineStroke,
      preview.dataset.headlinePadding,
      preview.dataset.headlineBorderRadius
    );
    closePopup();
  });
  
  const buttonContainer = document.createElement('div');
  buttonContainer.className = 'button-container';
  buttonContainer.appendChild(regenBtn);
  buttonContainer.appendChild(confirmBtn);
  
  genContainer.appendChild(preview);
  genContainer.appendChild(buttonContainer);
  container.appendChild(genContainer);
  
  // Generate initial headline
  generateHeadline();
}

function spawnHeadline(text, color, shadow, weight, style, decoration, transform, letterSpacing, fontFamily, extraTransform, background, stroke, padding, borderRadius) {
  const stage = document.getElementById('stage');
  
  // Remove existing headline if any
  if (currentHeadline) {
    currentHeadline.remove();
  }
  
  // Create headline element
  const wrapper = document.createElement('div');
  wrapper.classList.add('sticker-wrapper', 'headline-layer');
  wrapper.setAttribute('data-is-headline', 'true');
  wrapper.scale = 1;
  wrapper.angle = 0;
  
  const textEl = document.createElement('div');
  textEl.className = 'headline-text';
  textEl.textContent = text;
  textEl.style.color = color;
  textEl.style.textShadow = shadow;
  textEl.style.fontWeight = weight;
  textEl.style.fontStyle = style;
  textEl.style.textDecoration = decoration;
  textEl.style.textTransform = transform;
  textEl.style.letterSpacing = letterSpacing;
  textEl.style.fontFamily = fontFamily;
  if (extraTransform !== 'none') textEl.style.transform = extraTransform;
  if (background !== 'none') textEl.style.background = background;
  if (stroke !== 'none') textEl.style.webkitTextStroke = stroke;
  if (padding !== 'none') textEl.style.padding = padding;
  if (borderRadius !== 'none') textEl.style.borderRadius = borderRadius;
  
  const scaleHandle = document.createElement('div');
  scaleHandle.classList.add('scale-handle');
  
  const rotHandle = document.createElement('div');
  rotHandle.classList.add('rot-handle');
  
  wrapper.appendChild(textEl);
  wrapper.appendChild(scaleHandle);
  wrapper.appendChild(rotHandle);
  
  stage.appendChild(wrapper);
  wrapper.style.zIndex = 5000; // Headline on top of everything
  
  // Position at center AFTER appending so we can measure dimensions
  // Use offsetWidth/Height to get actual unscaled dimensions
  const width = wrapper.offsetWidth;
  const height = wrapper.offsetHeight;
  const centerX = (STAGE_W / 2) - (width / 2);
  const centerY = (STAGE_H / 2) - (height / 2);
  wrapper.setAttribute('data-x', centerX);
  wrapper.setAttribute('data-y', centerY);
  
  applyTransform(wrapper);
  makeInteractiveText(wrapper, 'headline-text');
  
  deselectAll();
  wrapper.classList.add('selected');
  
  currentHeadline = wrapper;
}

//------------------------------------------------------
// STICKER BAR UNLOCK
//------------------------------------------------------
let stickersUnlocked = false;

function unlockStickers() {
  if (stickersUnlocked) return; // Already unlocked
  
  const stickerBar = document.getElementById('sticker-bar');
  const titleArea = document.getElementById('sticker-bar-title-area');
  
  stickerBar.classList.add('unlocked');
  titleArea.style.display = 'flex'; // Show title
  stickersUnlocked = true;
}

//------------------------------------------------------
// COMPANY NAME MANAGEMENT
//------------------------------------------------------
let currentCompanyName = null; // Track the current company name

const companyPrefixes = ['Next', 'Bright', 'Peak', 'Prime', 'Future', 'Smart', 'Pro', 'Meta', 'Quantum', 'Spark'];
const companyRoots = ['Vision', 'Wave', 'Flow', 'Pulse', 'Shift', 'Core', 'Force', 'Edge', 'Rise', 'Link'];
const companySuffixes = ['Labs', 'Tech', 'Systems', 'Group', 'Dynamics', 'Solutions', 'Works', 'Ventures', 'Studios', 'Co'];

function buildCompanyNameUI(container) {
  const genContainer = document.createElement('div');
  genContainer.className = 'company-generator';
  
  const preview = document.createElement('div');
  preview.className = 'company-preview';
  
  const regenBtn = document.createElement('button');
  regenBtn.className = 'export-btn';
  regenBtn.textContent = 'Regenerate';
  
  const regenNameBtn = document.createElement('button');
  regenNameBtn.className = 'export-btn';
  regenNameBtn.textContent = 'Regenerate Name';
  
  const regenStyleBtn = document.createElement('button');
  regenStyleBtn.className = 'export-btn';
  regenStyleBtn.textContent = 'Regenerate Style';
  
  const confirmBtn = document.createElement('button');
  confirmBtn.className = 'export-btn';
  confirmBtn.textContent = 'Confirm';
  
  function generateName() {
    const prefix = companyPrefixes[Math.floor(Math.random() * companyPrefixes.length)];
    const root = companyRoots[Math.floor(Math.random() * companyRoots.length)];
    const suffix = companySuffixes[Math.floor(Math.random() * companySuffixes.length)];
    
    // Randomly choose format: "Prefix+Root", "Root+Suffix", or "Prefix+Root+Suffix"
    const format = Math.floor(Math.random() * 3);
    let name;
    if (format === 0) name = prefix + root;
    else if (format === 1) name = root + suffix;
    else name = prefix + root + ' ' + suffix;
    
    preview.textContent = name;
    preview.dataset.companyName = name;
  }
  
  function generateStyle() {
    // CLEAR all previous styles for true randomness!
    preview.style.cssText = '';
    preview.className = 'company-preview';
    preview.textContent = preview.dataset.companyName; // Restore text
    
    const colors = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff', '#ffffff', '#ff8800', '#8800ff', '#ff1493', '#00ff7f', '#ffa500'];
    const shadows = [
      '2px 2px 4px rgba(0,0,0,0.5)',
      '0 0 10px rgba(255,255,255,0.8)',
      '3px 3px 0 #000',
      '0 0 20px rgba(0,255,255,0.5)',
      '4px 4px 8px rgba(0,0,0,0.7)',
      '0 0 30px rgba(255,255,0,0.8)',
      '-3px -3px 0 #fff, 3px 3px 0 #000',
      '0 0 5px #fff, 0 0 15px #ff00ff',
      '2px 2px 0 #000, 4px 4px 0 #fff'
    ];
    
    const fontFamilies = [
      'Arial, sans-serif',
      'Impact, fantasy',
      'Comic Sans MS, cursive',
      'Courier New, monospace',
      'Georgia, serif',
      'Brush Script MT, cursive',
      'Times New Roman, serif',
      'Jumps Winter, cursive',
      'Spicy Sale, display',
      'Start Story, cursive',
      'Super Chiby, display',
      'Super Crawler, display'
    ];
    
    preview.style.color = colors[Math.floor(Math.random() * colors.length)];
    preview.style.textShadow = shadows[Math.floor(Math.random() * shadows.length)];
    preview.style.fontWeight = Math.random() > 0.3 ? 'bold' : 'normal';
    preview.style.fontStyle = Math.random() > 0.7 ? 'italic' : 'normal';
    preview.style.textTransform = Math.random() > 0.5 ? 'uppercase' : (Math.random() > 0.7 ? 'lowercase' : 'none');
    preview.style.letterSpacing = Math.random() > 0.5 ? (Math.floor(Math.random() * 10) - 2 + 'px') : 'normal';
    preview.style.fontFamily = fontFamilies[Math.floor(Math.random() * fontFamilies.length)];
    
    // Extra trashy effects!
    if (Math.random() > 0.8) preview.style.transform = `skewX(${Math.floor(Math.random() * 20 - 10)}deg)`;
    if (Math.random() > 0.9) {  // 10% chance for background (more rare!)
      preview.style.background = `linear-gradient(90deg, ${colors[Math.floor(Math.random() * colors.length)]}, ${colors[Math.floor(Math.random() * colors.length)]})`;
      preview.style.padding = '8px 16px';
      if (Math.random() > 0.5) preview.style.borderRadius = `${Math.floor(Math.random() * 20)}px`; // Random rounded corners!
    }
    if (Math.random() > 0.85) preview.style.webkitTextStroke = `${Math.floor(Math.random() * 3)}px ${colors[Math.floor(Math.random() * colors.length)]}`;
    if (Math.random() > 0.9) preview.style.textDecoration = 'underline'; // Only underline, no line-through
    
    preview.dataset.companyColor = preview.style.color;
    preview.dataset.companyShadow = preview.style.textShadow;
    preview.dataset.companyWeight = preview.style.fontWeight;
    preview.dataset.companyStyle = preview.style.fontStyle;
    preview.dataset.companyTransform = preview.style.textTransform;
    preview.dataset.companySpacing = preview.style.letterSpacing;
    preview.dataset.companyFontFamily = preview.style.fontFamily;
    preview.dataset.companyExtraTransform = preview.style.transform || 'none';
    preview.dataset.companyStroke = preview.style.webkitTextStroke || 'none';
    preview.dataset.companyDecoration = preview.style.textDecoration || 'none';
    preview.dataset.companyBackground = preview.style.background || 'none';
    preview.dataset.companyPadding = preview.style.padding || 'none';
    preview.dataset.companyBorderRadius = preview.style.borderRadius || 'none';
  }
  
  function regenerateAll() {
    generateName();
    generateStyle();
  }
  
  regenBtn.addEventListener('click', regenerateAll);
  regenNameBtn.addEventListener('click', generateName);
  regenStyleBtn.addEventListener('click', generateStyle);
  
  confirmBtn.addEventListener('click', () => {
    spawnCompanyName(
      preview.dataset.companyName,
      preview.dataset.companyColor,
      preview.dataset.companyShadow,
      preview.dataset.companyWeight,
      preview.dataset.companyStyle,
      preview.dataset.companyTransform,
      preview.dataset.companySpacing,
      preview.dataset.companyFontFamily,
      preview.dataset.companyExtraTransform,
      preview.dataset.companyStroke,
      preview.dataset.companyDecoration,
      preview.dataset.companyBackground,
      preview.dataset.companyPadding,
      preview.dataset.companyBorderRadius
    );
    closePopup();
  });
  
  const buttonRow = document.createElement('div');
  buttonRow.className = 'button-row';
  buttonRow.appendChild(regenNameBtn);
  buttonRow.appendChild(regenStyleBtn);
  
  const buttonContainer = document.createElement('div');
  buttonContainer.className = 'button-container';
  buttonContainer.appendChild(regenBtn);
  buttonContainer.appendChild(confirmBtn);
  
  genContainer.appendChild(preview);
  genContainer.appendChild(buttonRow);
  genContainer.appendChild(buttonContainer);
  container.appendChild(genContainer);
  
  // Generate initial name and style
  regenerateAll();
}

function spawnCompanyName(text, color, shadow, weight, style, transform, spacing, fontFamily, extraTransform, stroke, decoration, background, padding, borderRadius) {
  const stage = document.getElementById('stage');
  
  // Remove existing company name if any
  if (currentCompanyName) {
    currentCompanyName.remove();
  }
  
  // Create company name element
  const wrapper = document.createElement('div');
  wrapper.classList.add('sticker-wrapper', 'company-layer');
  wrapper.setAttribute('data-is-company', 'true');
  wrapper.scale = 1;
  wrapper.angle = 0;
  
  const textEl = document.createElement('div');
  textEl.className = 'company-text';
  textEl.textContent = text;
  textEl.style.color = color;
  textEl.style.textShadow = shadow;
  textEl.style.fontWeight = weight;
  textEl.style.fontStyle = style;
  textEl.style.textTransform = transform;
  textEl.style.letterSpacing = spacing;
  textEl.style.fontFamily = fontFamily;
  if (extraTransform !== 'none') textEl.style.transform = extraTransform;
  if (stroke !== 'none') textEl.style.webkitTextStroke = stroke;
  if (decoration !== 'none') textEl.style.textDecoration = decoration;
  if (background !== 'none') textEl.style.background = background;
  if (padding !== 'none') textEl.style.padding = padding;
  if (borderRadius !== 'none') textEl.style.borderRadius = borderRadius;
  
  const scaleHandle = document.createElement('div');
  scaleHandle.classList.add('scale-handle');
  
  const rotHandle = document.createElement('div');
  rotHandle.classList.add('rot-handle');
  
  wrapper.appendChild(textEl);
  wrapper.appendChild(scaleHandle);
  wrapper.appendChild(rotHandle);
  
  stage.appendChild(wrapper);
  
  // Z-INDEX HIERARCHY:
  // Headline: 5000
  // Company: 4000
  // CTA: 3000
  // Hero: 2000
  // Stickers: 100-999
  // BG: stage background
  wrapper.style.zIndex = 4000;
  
  // Position at center AFTER appending so we can measure dimensions
  // Use offsetWidth/Height to get actual unscaled dimensions
  const width = wrapper.offsetWidth;
  const height = wrapper.offsetHeight;
  const centerX = (STAGE_W / 2) - (width / 2);
  const centerY = (STAGE_H / 2) - (height / 2);
  wrapper.setAttribute('data-x', centerX);
  wrapper.setAttribute('data-y', centerY);
  
  applyTransform(wrapper);
  makeInteractiveText(wrapper, 'company-text');
  
  deselectAll();
  wrapper.classList.add('selected');
  
  currentCompanyName = wrapper;
}

//------------------------------------------------------
// CTA BUTTON MANAGEMENT
//------------------------------------------------------
let currentCTAButton = null; // Track the current CTA button

const ctaVerbs = ['Get', 'Learn', 'Start', 'Discover', 'Join', 'Try', 'Unlock', 'Explore', 'Claim', 'Grab'];
const ctaActions = ['Started', 'More', 'Now', 'Today', 'Free', 'Yours', 'Here', 'It', 'This', 'Access'];

function buildCTAButtonUI(container) {
  const genContainer = document.createElement('div');
  genContainer.className = 'cta-generator';
  
  const preview = document.createElement('div');
  preview.className = 'cta-preview';
  
  const regenBtn = document.createElement('button');
  regenBtn.className = 'export-btn';
  regenBtn.textContent = 'Regenerate';
  
  const regenTextBtn = document.createElement('button');
  regenTextBtn.className = 'export-btn';
  regenTextBtn.textContent = 'Regenerate Text';
  
  const regenTextStyleBtn = document.createElement('button');
  regenTextStyleBtn.className = 'export-btn';
  regenTextStyleBtn.textContent = 'Regenerate Text Style';
  
  const regenButtonStyleBtn = document.createElement('button');
  regenButtonStyleBtn.className = 'export-btn';
  regenButtonStyleBtn.textContent = 'Regenerate Button Style';
  
  const confirmBtn = document.createElement('button');
  confirmBtn.className = 'export-btn';
  confirmBtn.textContent = 'Confirm';
  
  function generateText() {
    const verb = ctaVerbs[Math.floor(Math.random() * ctaVerbs.length)];
    const action = ctaActions[Math.floor(Math.random() * ctaActions.length)];
    const text = verb + ' ' + action;
    
    preview.textContent = text;
    preview.dataset.ctaText = text;
  }
  
  function generateTextStyle() {
    // Clear text styles only (keep button styles)
    const currentBg = preview.style.background;
    const currentBorderRadius = preview.style.borderRadius;
    const currentBorder = preview.style.border;
    const currentBoxShadow = preview.style.boxShadow;
    const currentButtonTransform = preview.style.transform;
    const currentText = preview.textContent;
    
    preview.style.cssText = '';
    preview.className = 'cta-preview';
    preview.textContent = currentText;
    
    // Restore button styles
    preview.style.background = currentBg;
    preview.style.borderRadius = currentBorderRadius;
    preview.style.border = currentBorder;
    preview.style.boxShadow = currentBoxShadow;
    preview.style.transform = currentButtonTransform;
    
    const colors = ['#ffffff', '#000000', '#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff', '#ff1493', '#00ff7f', '#ffa500'];
    const shadows = [
      '2px 2px 4px rgba(0,0,0,0.8)',
      '0 0 5px rgba(255,255,255,0.8)',
      '1px 1px 2px rgba(0,0,0,0.5)',
      '0 0 10px rgba(255,0,255,0.8)',
      '3px 3px 0 #000',
      '-2px -2px 0 #fff, 2px 2px 0 #000',
      '0 0 15px rgba(255,255,0,0.8)',
      'none'
    ];
    
    const fontFamilies = [
      'Arial, sans-serif',
      'Impact, fantasy',
      'Comic Sans MS, cursive',
      'Courier New, monospace',
      'Georgia, serif',
      'Brush Script MT, cursive',
      'Verdana, sans-serif',
      'Jumps Winter, cursive',
      'Spicy Sale, display',
      'Start Story, cursive',
      'Super Chiby, display',
      'Super Crawler, display'
    ];
    
    preview.style.color = colors[Math.floor(Math.random() * colors.length)];
    preview.style.textShadow = shadows[Math.floor(Math.random() * shadows.length)];
    preview.style.fontWeight = Math.random() > 0.3 ? 'bold' : 'normal';
    preview.style.fontStyle = Math.random() > 0.7 ? 'italic' : 'normal';
    preview.style.textTransform = Math.random() > 0.5 ? 'uppercase' : (Math.random() > 0.7 ? 'lowercase' : 'none');
    preview.style.fontFamily = fontFamilies[Math.floor(Math.random() * fontFamilies.length)];
    preview.style.letterSpacing = Math.random() > 0.5 ? (Math.floor(Math.random() * 6) - 1 + 'px') : 'normal';
    
    // Extra trashy text effects!
    if (Math.random() > 0.85) preview.style.webkitTextStroke = `${Math.floor(Math.random() * 2) + 1}px ${colors[Math.floor(Math.random() * colors.length)]}`;
    if (Math.random() > 0.9) preview.style.textDecoration = 'underline';
    
    preview.dataset.ctaTextColor = preview.style.color;
    preview.dataset.ctaTextShadow = preview.style.textShadow;
    preview.dataset.ctaTextWeight = preview.style.fontWeight;
    preview.dataset.ctaTextStyle = preview.style.fontStyle;
    preview.dataset.ctaTextTransform = preview.style.textTransform;
    preview.dataset.ctaTextFontFamily = preview.style.fontFamily;
    preview.dataset.ctaTextLetterSpacing = preview.style.letterSpacing;
    preview.dataset.ctaTextStroke = preview.style.webkitTextStroke || 'none';
    preview.dataset.ctaTextDecoration = preview.style.textDecoration || 'none';
  }
  
  function generateButtonStyle() {
    // Clear button styles only (keep text styles)
    const currentColor = preview.style.color;
    const currentTextShadow = preview.style.textShadow;
    const currentFontWeight = preview.style.fontWeight;
    const currentFontStyle = preview.style.fontStyle;
    const currentTextTransform = preview.style.textTransform;
    const currentFontFamily = preview.style.fontFamily;
    const currentLetterSpacing = preview.style.letterSpacing;
    const currentTextStroke = preview.style.webkitTextStroke;
    const currentTextDecoration = preview.style.textDecoration;
    const currentText = preview.textContent;
    
    preview.style.cssText = '';
    preview.className = 'cta-preview';
    preview.textContent = currentText;
    
    // Restore text styles
    preview.style.color = currentColor;
    preview.style.textShadow = currentTextShadow;
    preview.style.fontWeight = currentFontWeight;
    preview.style.fontStyle = currentFontStyle;
    preview.style.textTransform = currentTextTransform;
    preview.style.fontFamily = currentFontFamily;
    preview.style.letterSpacing = currentLetterSpacing;
    preview.style.webkitTextStroke = currentTextStroke;
    preview.style.textDecoration = currentTextDecoration;
    
    const bgColors = ['#ff0000', '#00ff00', '#0000ff', '#ff8800', '#8800ff', '#00ffff', '#ff00ff', '#ff1493', '#ffa500', '#00ff7f', '#ffff00'];
    const gradients = [
      `linear-gradient(135deg, ${bgColors[Math.floor(Math.random() * bgColors.length)]}, ${bgColors[Math.floor(Math.random() * bgColors.length)]})`,
      `linear-gradient(90deg, ${bgColors[Math.floor(Math.random() * bgColors.length)]}, ${bgColors[Math.floor(Math.random() * bgColors.length)]})`,
      `linear-gradient(45deg, ${bgColors[Math.floor(Math.random() * bgColors.length)]}, ${bgColors[Math.floor(Math.random() * bgColors.length)]})`,
      `radial-gradient(circle, ${bgColors[Math.floor(Math.random() * bgColors.length)]}, ${bgColors[Math.floor(Math.random() * bgColors.length)]})`,
      `linear-gradient(180deg, ${bgColors[Math.floor(Math.random() * bgColors.length)]}, ${bgColors[Math.floor(Math.random() * bgColors.length)]})`,
      bgColors[Math.floor(Math.random() * bgColors.length)]
    ];
    
    const borderRadii = ['0px', '4px', '8px', '12px', '20px', '30px', '50px', '50%'];
    const borders = [
      '2px solid #fff',
      '3px solid #000',
      '4px solid rgba(255,255,255,0.5)',
      `3px solid ${bgColors[Math.floor(Math.random() * bgColors.length)]}`,
      '2px dashed #fff',
      '3px dotted #000',
      `4px double ${bgColors[Math.floor(Math.random() * bgColors.length)]}`,
      'none'
    ];
    const boxShadows = [
      '0 4px 8px rgba(0,0,0,0.3)',
      '0 8px 16px rgba(0,0,0,0.5)',
      '0 0 20px rgba(255,255,255,0.5)',
      '0 0 30px rgba(255,0,255,0.6)',
      'inset 0 2px 4px rgba(255,255,255,0.3)',
      '5px 5px 0 #000',
      '0 0 15px rgba(0,255,255,0.8)',
      '-3px -3px 0 #fff, 3px 3px 0 #000',
      '0 10px 20px rgba(0,0,0,0.4)',
      'none'
    ];
    
    const bg = gradients[Math.floor(Math.random() * gradients.length)];
    const borderRadius = borderRadii[Math.floor(Math.random() * borderRadii.length)];
    const border = borders[Math.floor(Math.random() * borders.length)];
    const boxShadow = boxShadows[Math.floor(Math.random() * boxShadows.length)];
    
    preview.style.background = bg;
    preview.style.borderRadius = borderRadius;
    preview.style.border = border;
    preview.style.boxShadow = boxShadow;
    
    // Extra trashy button effects!
    let transform = 'none';
    if (Math.random() > 0.85) transform = `rotate(${Math.floor(Math.random() * 10 - 5)}deg)`;
    if (Math.random() > 0.9) transform = `skew(${Math.floor(Math.random() * 10 - 5)}deg, ${Math.floor(Math.random() * 10 - 5)}deg)`;
    preview.style.transform = transform;
    
    preview.dataset.ctaBg = bg;
    preview.dataset.ctaBorderRadius = borderRadius;
    preview.dataset.ctaBorder = border;
    preview.dataset.ctaBoxShadow = boxShadow;
    preview.dataset.ctaTransform = transform;
  }
  
  function regenerateAll() {
    generateText();
    generateTextStyle();
    generateButtonStyle();
  }
  
  regenBtn.addEventListener('click', regenerateAll);
  regenTextBtn.addEventListener('click', generateText);
  regenTextStyleBtn.addEventListener('click', generateTextStyle);
  regenButtonStyleBtn.addEventListener('click', generateButtonStyle);
  
  confirmBtn.addEventListener('click', () => {
    spawnCTAButton(
      preview.dataset.ctaText,
      preview.dataset.ctaTextColor,
      preview.dataset.ctaTextShadow,
      preview.dataset.ctaTextWeight,
      preview.dataset.ctaTextStyle,
      preview.dataset.ctaTextTransform,
      preview.dataset.ctaTextFontFamily,
      preview.dataset.ctaTextLetterSpacing,
      preview.dataset.ctaTextStroke,
      preview.dataset.ctaTextDecoration,
      preview.dataset.ctaBg,
      preview.dataset.ctaBorderRadius,
      preview.dataset.ctaBorder,
      preview.dataset.ctaBoxShadow,
      preview.dataset.ctaTransform
    );
    closePopup();
  });
  
  const buttonRow = document.createElement('div');
  buttonRow.className = 'button-row';
  buttonRow.appendChild(regenTextBtn);
  buttonRow.appendChild(regenTextStyleBtn);
  buttonRow.appendChild(regenButtonStyleBtn);
  
  const buttonContainer = document.createElement('div');
  buttonContainer.className = 'button-container';
  buttonContainer.appendChild(regenBtn);
  buttonContainer.appendChild(confirmBtn);
  
  genContainer.appendChild(preview);
  genContainer.appendChild(buttonRow);
  genContainer.appendChild(buttonContainer);
  container.appendChild(genContainer);
  
  // Generate initial CTA
  regenerateAll();
}

function spawnCTAButton(text, textColor, textShadow, textWeight, textStyle, textTransform, textFontFamily, textLetterSpacing, textStroke, textDecoration, bg, borderRadius, border, boxShadow, buttonTransform) {
  const stage = document.getElementById('stage');
  
  // Remove existing CTA button if any
  if (currentCTAButton) {
    currentCTAButton.remove();
  }
  
  // Create CTA button element
  const wrapper = document.createElement('div');
  wrapper.classList.add('sticker-wrapper', 'cta-layer');
  wrapper.setAttribute('data-is-cta', 'true');
  wrapper.scale = 1;
  wrapper.angle = 0;
  
  const buttonEl = document.createElement('div');
  buttonEl.className = 'cta-button';
  buttonEl.textContent = text;
  buttonEl.style.color = textColor;
  buttonEl.style.textShadow = textShadow;
  buttonEl.style.fontWeight = textWeight;
  buttonEl.style.fontStyle = textStyle;
  buttonEl.style.textTransform = textTransform;
  buttonEl.style.fontFamily = textFontFamily;
  buttonEl.style.letterSpacing = textLetterSpacing;
  if (textStroke !== 'none') buttonEl.style.webkitTextStroke = textStroke;
  if (textDecoration !== 'none') buttonEl.style.textDecoration = textDecoration;
  buttonEl.style.background = bg;
  buttonEl.style.borderRadius = borderRadius;
  buttonEl.style.border = border;
  buttonEl.style.boxShadow = boxShadow;
  if (buttonTransform !== 'none') buttonEl.style.transform = buttonTransform;
  
  const scaleHandle = document.createElement('div');
  scaleHandle.classList.add('scale-handle');
  
  const rotHandle = document.createElement('div');
  rotHandle.classList.add('rot-handle');
  
  wrapper.appendChild(buttonEl);
  wrapper.appendChild(scaleHandle);
  wrapper.appendChild(rotHandle);
  
  stage.appendChild(wrapper);
  
  // Z-INDEX HIERARCHY:
  // Headline: 5000
  // Company: 4000
  // CTA: 3000
  // Hero: 2000
  // Stickers: 100-999
  // BG: stage background
  wrapper.style.zIndex = 3000;
  
  // Position at lower center (lower third)
  const width = wrapper.offsetWidth;
  const height = wrapper.offsetHeight;
  const centerX = (STAGE_W / 2) - (width / 2);
  const lowerThirdY = (STAGE_H * 0.7) - (height / 2); // 70% down from top
  wrapper.setAttribute('data-x', centerX);
  wrapper.setAttribute('data-y', lowerThirdY);
  
  applyTransform(wrapper);
  makeInteractiveText(wrapper, 'cta-button');
  
  deselectAll();
  wrapper.classList.add('selected');
  
  currentCTAButton = wrapper;
}

//------------------------------------------------------
// LANDSCAPE ORIENTATION FOR MOBILE
//------------------------------------------------------
function checkOrientation() {
  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  const isPortrait = window.innerHeight > window.innerWidth;
  
  if (isMobile && isPortrait) {
    // Show rotation message
    let rotateMsg = document.getElementById('rotate-message');
    if (!rotateMsg) {
      rotateMsg = document.createElement('div');
      rotateMsg.id = 'rotate-message';
      rotateMsg.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: #000;
        color: #fff;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
        z-index: 99999;
        font-family: sans-serif;
      `;
      rotateMsg.innerHTML = `
        <div style="font-size: 48px; margin-bottom: 20px;">↻</div>
        <div style="font-size: 18px;">Please rotate your device</div>
        <div style="font-size: 14px; opacity: 0.7; margin-top: 10px;">This app works best in landscape mode</div>
      `;
      document.body.appendChild(rotateMsg);
    }
    rotateMsg.style.display = 'flex';
  } else {
    const rotateMsg = document.getElementById('rotate-message');
    if (rotateMsg) {
      rotateMsg.style.display = 'none';
    }
  }
}

// Check on load and on orientation change
checkOrientation();
window.addEventListener('orientationchange', checkOrientation);
window.addEventListener('resize', checkOrientation);


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
function createStickerAt(srcUrl, x, y, isHero = false) {
    const stage = document.getElementById("stage");

    const wrapper = document.createElement("div");
    wrapper.classList.add("sticker-wrapper");
    if (isHero) {
        wrapper.classList.add("hero-layer");
        wrapper.setAttribute("data-is-hero", "true");
    }
    wrapper.scale = 1;
    wrapper.angle = 0;

    wrapper.setAttribute("data-x", x);
    wrapper.setAttribute("data-y", y);

    const img = document.createElement("img");
    img.src = srcUrl;
    img.style.width = isHero ? "300px" : "150px";  // Heroes spawn bigger!

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
	
	// Heroes get higher z-index (above stickers) and don't participate in z-order shuffling
	if (isHero) {
	    wrapper.style.zIndex = 2000;  // hero layer above stickers (100-999)
	} else {
	    wrapper.style.zIndex = STICKER_Z_MIN;
	    bringStickerToFront(wrapper);
	}

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
    makeInteractive(wrapper, isHero);

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

// Sticker limit constants and functions
const MAX_STICKERS = 10;

function getStickerCount() {
  const stage = document.getElementById('stage');
  // Count only regular stickers, not heroes or headlines or other layers
  return stage.querySelectorAll('.sticker-wrapper:not([data-is-hero]):not([data-is-headline]):not(.headline-layer):not(.company-layer):not(.cta-layer)').length;
}

function showStickerLimitMessage() {
  const stage = document.getElementById('stage');
  
  // Remove existing message if any
  const existingMsg = document.getElementById('sticker-limit-message');
  if (existingMsg) existingMsg.remove();
  
  // Create message
  const message = document.createElement('div');
  message.id = 'sticker-limit-message';
  message.textContent = 'Maximum number of stickers reached (10)';
  message.style.position = 'absolute';
  message.style.bottom = '20px';
  message.style.left = '50%';
  message.style.transform = 'translateX(-50%)';
  message.style.background = 'rgba(255, 0, 0, 0.9)';
  message.style.color = '#fff';
  message.style.padding = '12px 24px';
  message.style.borderRadius = '8px';
  message.style.fontSize = '16px';
  message.style.fontWeight = 'bold';
  message.style.zIndex = '9999';
  message.style.pointerEvents = 'none';
  message.style.boxShadow = '0 4px 12px rgba(0,0,0,0.5)';
  
  stage.appendChild(message);
  
  // Remove after 7 seconds
  setTimeout(() => {
    message.style.transition = 'opacity 0.5s';
    message.style.opacity = '0';
    setTimeout(() => message.remove(), 500);
  }, 7000);
}

function uiScale() {
  const v = getComputedStyle(document.documentElement).getPropertyValue('--ui-scale').trim();
  return v ? parseFloat(v) : 1;
}

interact('.sticker-src').draggable({
  listeners: {
    start (event) {
      // Check sticker limit before spawning
      if (getStickerCount() >= MAX_STICKERS) {
        showStickerLimitMessage();
        return;
      }
      
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
// CLICK-TO-SPAWN STICKERS
//------------------------------------------------------
// Add click handler to sticker sources
document.querySelectorAll('.sticker-src').forEach(stickerSrc => {
  let isDragging = false;
  let dragTimeout = null;
  
  stickerSrc.addEventListener('mousedown', () => {
    isDragging = false;
    dragTimeout = setTimeout(() => {
      isDragging = true;
    }, 100); // If held for 100ms, consider it a drag
  });
  
  stickerSrc.addEventListener('mousemove', () => {
    isDragging = true;
  });
  
  stickerSrc.addEventListener('mouseup', () => {
    clearTimeout(dragTimeout);
  });
  
  stickerSrc.addEventListener('click', (event) => {
    // If it was a drag, don't spawn on click
    if (isDragging) {
      isDragging = false;
      return;
    }
    
    // Check sticker limit
    if (getStickerCount() >= MAX_STICKERS) {
      showStickerLimitMessage();
      return;
    }
    
    // Spawn sticker at center of stage
    const stage = document.getElementById('stage');
    const stageWidth = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--stage-w'));
    const stageHeight = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--stage-h'));
    
    // Center position (accounting for 150px sticker width)
    const centerX = (stageWidth / 2) - 75;
    const centerY = (stageHeight / 2) - 75;
    
    createStickerAt(stickerSrc.src, centerX, centerY);
  });
  
  // Touch support for mobile
  stickerSrc.addEventListener('touchstart', () => {
    isDragging = false;
    dragTimeout = setTimeout(() => {
      isDragging = true;
    }, 100);
  });
  
  stickerSrc.addEventListener('touchmove', () => {
    isDragging = true;
  });
  
  stickerSrc.addEventListener('touchend', (event) => {
    clearTimeout(dragTimeout);
    
    // If it was a drag, don't spawn
    if (isDragging) {
      isDragging = false;
      return;
    }
    
    // Check sticker limit
    if (getStickerCount() >= MAX_STICKERS) {
      showStickerLimitMessage();
      return;
    }
    
    // Spawn at center
    const stage = document.getElementById('stage');
    const stageWidth = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--stage-w'));
    const stageHeight = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--stage-h'));
    
    const centerX = (stageWidth / 2) - 75;
    const centerY = (stageHeight / 2) - 75;
    
    createStickerAt(stickerSrc.src, centerX, centerY);
  });
});



//------------------------------------------------------
// INTERACTIVE STICKERS
//------------------------------------------------------
function makeInteractive(el, isHero = false) {

    el.addEventListener("pointerdown", () => {
	deselectAll();
	el.classList.add("selected");
	if (!isHero) {
	    bringStickerToFront(el);  // only manage z-index for stickers, not heroes
	}
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

    // Delete on double click (only for stickers, not heroes)
    if (!isHero) {
        el.addEventListener("dblclick", () => el.remove());
    }
}

function makeInteractiveText(el, textClassName) {
    el.addEventListener("pointerdown", () => {
        deselectAll();
        el.classList.add("selected");
    });

    // Drag to move
    interact(el).draggable({
        allowFrom: `.${textClassName}`,
        listeners: {
            start(){ el.classList.add("dragging"); },
            move(event) {
                const s = uiScale ? uiScale() : 1;
                const x = (parseFloat(el.getAttribute("data-x")) || 0) + event.dx / s;
                const y = (parseFloat(el.getAttribute("data-y")) || 0) + event.dy / s;
                el.setAttribute("data-x", x);
                el.setAttribute("data-y", y);
                applyTransform(el);
            },
            end(){ 
                el.classList.remove("dragging");
                clampTextPosition(el);  // Clamp position when drag ends
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
                document.body.classList.add("scaling");
            },
            move(event) {
                const s = uiScale ? uiScale() : 1;
                el.scale = Math.max(0.1, el.scale + (event.dx / s) * 0.01);
                applyTransform(el);
            },
            end() {
                scaleHandle.classList.remove("dragging");
                document.body.classList.remove("scaling");
            }
        }
    });

    // Desktop rotate
    const rotHandle = el.querySelector(".rot-handle");
    interact(rotHandle).draggable({
        listeners: {
            start() {
                rotHandle.classList.add("dragging");
                document.body.classList.add("rotating");
            },
            move(event) {
                el.angle += event.dx * 0.5;
                applyTransform(el);
            },
            end() {
                rotHandle.classList.remove("dragging");
                document.body.classList.remove("rotating");
            }
        }
    });
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
      // Scroll to top before entering fullscreen to prevent offset issues on mobile
      window.scrollTo(0, 0);
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
const STICKER_MIN_PX   = 120;             // increased from 100 for mobile
const STICKER_MAX_FRAC = 0.9;             // 90% of min(stageW, stageH)
const STICKER_BASE_W   = 250;             // increased from 200 for better visibility

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

function clampTextPosition(el){
  // current translate (top-left in unscaled wrapper space)
  let x = parseFloat(el.getAttribute('data-x')) || 0;
  let y = parseFloat(el.getAttribute('data-y')) || 0;

  // For text elements, use offsetWidth/offsetHeight (unscaled dimensions)
  const baseW = el.offsetWidth;
  const baseH = el.offsetHeight;

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
const SIDEBAR_W = 240;           // increased to 240 for 2:1 editor ratio
const PANEL_W = 200;
const STICKERBAR_H = 120;        // comfortable height for mobile

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
  const BORDER_WIDTH = 8;  // 8px border on each side = 16px total width/height
  const SCROLLBAR_BUFFER = 20;  // buffer for potential scrollbars
  
  const frameW = SIDEBAR_W + STAGE_W + (BORDER_WIDTH * 2);  // include borders
  const frameH = STAGE_H + STICKERBAR_H + (BORDER_WIDTH * 2);  // include borders
  
  const availableW = window.innerWidth - SCROLLBAR_BUFFER;
  const availableH = window.innerHeight - SCROLLBAR_BUFFER;
  
  const scaleW = availableW / frameW;
  const scaleH = availableH / frameH;
  const fit    = Math.min(scaleW, scaleH);
  const s      = fit;  // allow scaling > 100% in all modes
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
    // Only manage z-index for actual stickers, not heroes/text layers
    const stickers = Array.from(document.querySelectorAll('#stage .sticker-wrapper'))
      .filter(s => !s.hasAttribute('data-is-hero') && 
                   !s.hasAttribute('data-is-headline') && 
                   !s.hasAttribute('data-is-company') &&
                   !s.hasAttribute('data-is-cta'))
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
      
      // Draw background with "cover" behavior (like CSS background-size: cover)
      if (bgImg) {
        const imgRatio = bgImg.width / bgImg.height;
        const canvasRatio = W / H;
        
        let drawW, drawH, drawX, drawY;
        
        if (imgRatio > canvasRatio) {
          // Image is wider - fit to height
          drawH = H;
          drawW = H * imgRatio;
          drawX = (W - drawW) / 2;
          drawY = 0;
        } else {
          // Image is taller - fit to width
          drawW = W;
          drawH = W / imgRatio;
          drawX = 0;
          drawY = (H - drawH) / 2;
        }
        
        ctx.drawImage(bgImg, drawX, drawY, drawW, drawH);
      }

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
          // Animated GIF: need to scale frames from natural size to base size
          const elapsed = i * FRAME_MS;
          const mod     = elapsed % s.totalDur;
          let acc = 0, idx = 0;
          for (; idx < s.delays.length; idx++) { acc += s.delays[idx]; if (mod < acc) break; }
          const f = s.frames[idx % s.frames.length];

          // Create a temporary canvas for the full GIF frame at natural size
          const fullGif = document.createElement("canvas");
          fullGif.width = s.domW;
          fullGif.height = s.domH;
          const fullCtx = fullGif.getContext("2d");

          if (f.disposalType === 2) {
            fullCtx.clearRect(f.dims.left, f.dims.top, f.dims.width, f.dims.height);
          }

          // Draw the patch at natural size
          const patch = new ImageData(new Uint8ClampedArray(f.patch), f.dims.width, f.dims.height);
          const pc = document.createElement("canvas");
          pc.width = f.dims.width; 
          pc.height = f.dims.height;
          pc.getContext("2d").putImageData(patch, 0, 0);
          fullCtx.drawImage(pc, f.dims.left, f.dims.top);

          // Now draw the full frame scaled to base dimensions
          ctx.drawImage(fullGif, offsetX, offsetY, s.baseW, s.baseH);
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

// ==== RANDOMIZE STICKER ORDER =============================================
// Shuffle stickers on page load
(function shuffleStickers() {
  const stickerBar = document.getElementById('sticker-bar');
  const stickers = Array.from(stickerBar.querySelectorAll('.sticker-src'));
  
  // Fisher-Yates shuffle
  for (let i = stickers.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [stickers[i], stickers[j]] = [stickers[j], stickers[i]];
  }
  
  // Re-append in shuffled order
  stickers.forEach(sticker => stickerBar.appendChild(sticker));
})();