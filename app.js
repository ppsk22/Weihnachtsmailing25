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
  head.innerHTML = `<span>${title}</span><button id="popup-close" class="export-btn">×</button>`;

  const body = document.createElement('div');
  body.className = 'popup-body';

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

// Build Hero grid - similar to BG grid but spawns hero on stage
function buildHeroGrid(container){
  const source = document.querySelectorAll('#bg-data .bg-option'); // Use BG images for now
  const wrap = document.createElement('div');
  wrap.className = 'bg-grid';

  source.forEach(opt => {
    const url = opt.getAttribute('data-bg');
    const card = document.createElement('div');
    card.className = 'bg-card';

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
  
  // Image is 150px wide (set in createStickerAt)
  // To center the image: top-left = stage_center - (image_size / 2)
  const imageSize = 150;
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
  
  // Instructions
  const instructions = document.createElement('div');
  instructions.className = 'headline-instructions';
  instructions.textContent = 'Choose 4 words';
  container.appendChild(instructions);
  
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
        showHeadlineGenerator(container, selectedWords);
      }
    });
    
    wordGrid.appendChild(wordBox);
  });
  
  container.appendChild(wordGrid);
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
    preview.textContent = text;
    
    // Apply random styles
    const colors = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff', '#ffffff'];
    const shadows = [
      '2px 2px 4px rgba(0,0,0,0.5)',
      '0 0 10px rgba(255,255,255,0.8)',
      '3px 3px 0 #000',
      '0 0 20px rgba(255,0,0,0.5)'
    ];
    
    preview.style.color = colors[Math.floor(Math.random() * colors.length)];
    preview.style.textShadow = shadows[Math.floor(Math.random() * shadows.length)];
    preview.style.fontWeight = Math.random() > 0.5 ? 'bold' : 'normal';
    preview.style.fontStyle = Math.random() > 0.7 ? 'italic' : 'normal';
    preview.style.textDecoration = Math.random() > 0.8 ? 'underline' : 'none';
    
    // Store the text for spawning
    preview.dataset.headlineText = text;
    preview.dataset.headlineColor = preview.style.color;
    preview.dataset.headlineShadow = preview.style.textShadow;
    preview.dataset.headlineWeight = preview.style.fontWeight;
    preview.dataset.headlineStyle = preview.style.fontStyle;
    preview.dataset.headlineDecoration = preview.style.textDecoration;
  }
  
  regenBtn.addEventListener('click', generateHeadline);
  
  confirmBtn.addEventListener('click', () => {
    spawnHeadline(
      preview.dataset.headlineText,
      preview.dataset.headlineColor,
      preview.dataset.headlineShadow,
      preview.dataset.headlineWeight,
      preview.dataset.headlineStyle,
      preview.dataset.headlineDecoration
    );
    closePopup();
  });
  
  genContainer.appendChild(preview);
  genContainer.appendChild(regenBtn);
  genContainer.appendChild(confirmBtn);
  container.appendChild(genContainer);
  
  // Generate initial headline
  generateHeadline();
}

function spawnHeadline(text, color, shadow, weight, style, decoration) {
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
  stickerBar.classList.add('unlocked');
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
    const colors = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff', '#ffffff', '#ff8800', '#8800ff'];
    const shadows = [
      '2px 2px 4px rgba(0,0,0,0.5)',
      '0 0 10px rgba(255,255,255,0.8)',
      '3px 3px 0 #000',
      '0 0 20px rgba(0,255,255,0.5)',
      '4px 4px 8px rgba(0,0,0,0.7)'
    ];
    
    preview.style.color = colors[Math.floor(Math.random() * colors.length)];
    preview.style.textShadow = shadows[Math.floor(Math.random() * shadows.length)];
    preview.style.fontWeight = Math.random() > 0.5 ? 'bold' : 'normal';
    preview.style.fontStyle = Math.random() > 0.7 ? 'italic' : 'normal';
    preview.style.textTransform = Math.random() > 0.5 ? 'uppercase' : 'none';
    preview.style.letterSpacing = Math.random() > 0.5 ? '2px' : 'normal';
    
    preview.dataset.companyColor = preview.style.color;
    preview.dataset.companyShadow = preview.style.textShadow;
    preview.dataset.companyWeight = preview.style.fontWeight;
    preview.dataset.companyStyle = preview.style.fontStyle;
    preview.dataset.companyTransform = preview.style.textTransform;
    preview.dataset.companySpacing = preview.style.letterSpacing;
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
      preview.dataset.companySpacing
    );
    closePopup();
  });
  
  const buttonRow = document.createElement('div');
  buttonRow.className = 'button-row';
  buttonRow.appendChild(regenNameBtn);
  buttonRow.appendChild(regenStyleBtn);
  
  genContainer.appendChild(preview);
  genContainer.appendChild(regenBtn);
  genContainer.appendChild(buttonRow);
  genContainer.appendChild(confirmBtn);
  container.appendChild(genContainer);
  
  // Generate initial name and style
  regenerateAll();
}

function spawnCompanyName(text, color, shadow, weight, style, transform, spacing) {
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
    const colors = ['#ffffff', '#000000', '#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff'];
    const shadows = [
      '2px 2px 4px rgba(0,0,0,0.8)',
      '0 0 5px rgba(255,255,255,0.8)',
      '1px 1px 2px rgba(0,0,0,0.5)',
      'none'
    ];
    
    preview.style.color = colors[Math.floor(Math.random() * colors.length)];
    preview.style.textShadow = shadows[Math.floor(Math.random() * shadows.length)];
    preview.style.fontWeight = Math.random() > 0.5 ? 'bold' : 'normal';
    preview.style.textTransform = Math.random() > 0.5 ? 'uppercase' : 'none';
    
    preview.dataset.ctaTextColor = preview.style.color;
    preview.dataset.ctaTextShadow = preview.style.textShadow;
    preview.dataset.ctaTextWeight = preview.style.fontWeight;
    preview.dataset.ctaTextTransform = preview.style.textTransform;
  }
  
  function generateButtonStyle() {
    const bgColors = ['#ff0000', '#00ff00', '#0000ff', '#ff8800', '#8800ff', '#00ffff', '#ff00ff'];
    const gradients = [
      `linear-gradient(135deg, ${bgColors[0]}, ${bgColors[1]})`,
      `linear-gradient(90deg, ${bgColors[2]}, ${bgColors[3]})`,
      `radial-gradient(circle, ${bgColors[4]}, ${bgColors[5]})`,
      bgColors[Math.floor(Math.random() * bgColors.length)]
    ];
    
    const borderRadii = ['0px', '8px', '20px', '50px', '50%'];
    const borders = [
      '2px solid #fff',
      '3px solid #000',
      '4px solid rgba(255,255,255,0.5)',
      'none'
    ];
    const boxShadows = [
      '0 4px 8px rgba(0,0,0,0.3)',
      '0 8px 16px rgba(0,0,0,0.5)',
      '0 0 20px rgba(255,255,255,0.5)',
      'inset 0 2px 4px rgba(255,255,255,0.3)',
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
    
    preview.dataset.ctaBg = bg;
    preview.dataset.ctaBorderRadius = borderRadius;
    preview.dataset.ctaBorder = border;
    preview.dataset.ctaBoxShadow = boxShadow;
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
      preview.dataset.ctaTextTransform,
      preview.dataset.ctaBg,
      preview.dataset.ctaBorderRadius,
      preview.dataset.ctaBorder,
      preview.dataset.ctaBoxShadow
    );
    closePopup();
  });
  
  const buttonRow1 = document.createElement('div');
  buttonRow1.className = 'button-row';
  buttonRow1.appendChild(regenTextBtn);
  buttonRow1.appendChild(regenTextStyleBtn);
  
  const buttonRow2 = document.createElement('div');
  buttonRow2.className = 'button-row';
  buttonRow2.appendChild(regenButtonStyleBtn);
  
  genContainer.appendChild(preview);
  genContainer.appendChild(regenBtn);
  genContainer.appendChild(buttonRow1);
  genContainer.appendChild(buttonRow2);
  genContainer.appendChild(confirmBtn);
  container.appendChild(genContainer);
  
  // Generate initial CTA
  regenerateAll();
}

function spawnCTAButton(text, textColor, textShadow, textWeight, textTransform, bg, borderRadius, border, boxShadow) {
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
  buttonEl.style.textTransform = textTransform;
  buttonEl.style.background = bg;
  buttonEl.style.borderRadius = borderRadius;
  buttonEl.style.border = border;
  buttonEl.style.boxShadow = boxShadow;
  
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
            end(){ el.classList.remove("dragging"); }
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