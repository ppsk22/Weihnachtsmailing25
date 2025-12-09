// ==== LOADING SCREEN ====
let loadingReady = false;
let videoEnded = false;
let mobileLoadingStarted = false; // Track if mobile loading has started

function checkShowGetStarted() {
  if (loadingReady && videoEnded) {
    const loadingText = document.getElementById('loading-text');
    const getStartedBtn = document.getElementById('get-started-btn');
    
    if (loadingText) {
      loadingText.classList.add('hidden');
    }
    if (getStartedBtn) {
      getStartedBtn.classList.remove('hidden');
    }
  }
}

function hideLoadingScreen() {
  const loadingScreen = document.getElementById('loading-screen');
  if (loadingScreen) {
    loadingScreen.classList.add('hidden');
  }
}

function showLoadingScreen() {
  const loadingScreen = document.getElementById('loading-screen');
  if (loadingScreen) {
    loadingScreen.classList.remove('hidden');
  }
}

// Start the loading sequence on mobile (called after entering fullscreen)
function startMobileLoading() {
  if (mobileLoadingStarted) return;
  mobileLoadingStarted = true;
  
  showLoadingScreen();
  
  const loadingVideo = document.getElementById('loading-video');
  if (loadingVideo) {
    loadingVideo.currentTime = 0;
    loadingVideo.play().catch(() => {});
  }
}

// Wait for page to load
window.addEventListener('load', () => {
  // Add a small delay to ensure smooth transition and let fonts load
  setTimeout(() => {
    loadingReady = true;
    checkShowGetStarted();
  }, 500);
});

// Wait for video to end
document.addEventListener('DOMContentLoaded', () => {
  const loadingVideo = document.getElementById('loading-video');
  const loadingScreen = document.getElementById('loading-screen');
  const getStartedBtn = document.getElementById('get-started-btn');
  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  
  if (loadingVideo) {
    // On mobile, pause the video and hide loading screen until fullscreen is entered
    if (isMobile) {
      loadingVideo.pause();
      if (loadingScreen) {
        loadingScreen.classList.add('hidden');
      }
    }
    
    loadingVideo.addEventListener('ended', () => {
      videoEnded = true;
      checkShowGetStarted();
    });
    
    // Fallback in case video fails to load or play
    loadingVideo.addEventListener('error', () => {
      videoEnded = true;
      checkShowGetStarted();
    });
  }
  
  // Get Started button click handler
  if (getStartedBtn) {
    getStartedBtn.addEventListener('click', () => {
      SoundManager.play('confirm');
      hideLoadingScreen();
    });
  }
});

// ==== EXPORT COMPLETED & RESTART ====
function showExportCompleted() {
  const exportingText = document.getElementById('exporting-text');
  const completedText = document.getElementById('export-completed-text');
  const congratsMessage = document.getElementById('export-congrats-message');
  const errorText = document.getElementById('export-error-text');
  const errorMessage = document.getElementById('export-error-message');
  const progressContainer = document.getElementById('export-progress-container');
  const restartBtn = document.getElementById('restart-btn');
  const fallbackBtn = document.getElementById('fallback-png-btn');
  const errorRestartBtn = document.getElementById('error-restart-btn');
  
  // Hide exporting text and progress bar
  if (exportingText) exportingText.classList.add('hidden');
  if (progressContainer) progressContainer.classList.add('hidden');
  if (errorText) errorText.classList.add('hidden');
  if (errorMessage) errorMessage.classList.add('hidden');
  if (fallbackBtn) fallbackBtn.classList.add('hidden');
  if (errorRestartBtn) errorRestartBtn.classList.add('hidden');
  
  // Show completed text, congrats message, and restart button
  if (completedText) completedText.classList.remove('hidden');
  if (congratsMessage) congratsMessage.classList.remove('hidden');
  if (restartBtn) restartBtn.classList.remove('hidden');
}

function showExportError(errorMsg) {
  const exportingText = document.getElementById('exporting-text');
  const completedText = document.getElementById('export-completed-text');
  const congratsMessage = document.getElementById('export-congrats-message');
  const errorText = document.getElementById('export-error-text');
  const errorMessage = document.getElementById('export-error-message');
  const progressContainer = document.getElementById('export-progress-container');
  const restartBtn = document.getElementById('restart-btn');
  const fallbackBtn = document.getElementById('fallback-png-btn');
  const errorRestartBtn = document.getElementById('error-restart-btn');
  
  // Hide exporting text and progress bar
  if (exportingText) exportingText.classList.add('hidden');
  if (progressContainer) progressContainer.classList.add('hidden');
  if (completedText) completedText.classList.add('hidden');
  if (congratsMessage) congratsMessage.classList.add('hidden');
  if (restartBtn) restartBtn.classList.add('hidden');
  
  // Show error state
  if (errorText) errorText.classList.remove('hidden');
  if (errorMessage) {
    errorMessage.textContent = errorMsg || 'Unknown error';
    errorMessage.classList.remove('hidden');
  }
  if (fallbackBtn) fallbackBtn.classList.remove('hidden');
  if (errorRestartBtn) errorRestartBtn.classList.remove('hidden');
  
  // Make sure exporting screen is visible
  const exportingScreen = document.getElementById('exporting-screen');
  if (exportingScreen) exportingScreen.classList.remove('hidden');
}

function resetExportScreen() {
  const exportingText = document.getElementById('exporting-text');
  const completedText = document.getElementById('export-completed-text');
  const congratsMessage = document.getElementById('export-congrats-message');
  const errorText = document.getElementById('export-error-text');
  const errorMessage = document.getElementById('export-error-message');
  const progressContainer = document.getElementById('export-progress-container');
  const progressBar = document.getElementById('export-progress-bar');
  const exportingScreen = document.getElementById('exporting-screen');
  const restartBtn = document.getElementById('restart-btn');
  const fallbackBtn = document.getElementById('fallback-png-btn');
  const errorRestartBtn = document.getElementById('error-restart-btn');
  
  // Reset to initial state
  if (exportingText) exportingText.classList.remove('hidden');
  if (completedText) completedText.classList.add('hidden');
  if (congratsMessage) congratsMessage.classList.add('hidden');
  if (errorText) errorText.classList.add('hidden');
  if (errorMessage) errorMessage.classList.add('hidden');
  if (restartBtn) restartBtn.classList.add('hidden');
  if (fallbackBtn) fallbackBtn.classList.add('hidden');
  if (errorRestartBtn) errorRestartBtn.classList.add('hidden');
  if (progressContainer) progressContainer.classList.add('hidden');
  if (progressBar) progressBar.style.width = '0%';
  if (exportingScreen) exportingScreen.classList.add('hidden');
}

function restartTool() {
  // Play sound first
  SoundManager.play('confirm');
  
  // Full page reload to guarantee clean state
  // This ensures no leftover state from previous exports
  setTimeout(() => {
    window.location.reload();
  }, 100); // Small delay to let the sound play
}

// Add restart button click handler
document.addEventListener('DOMContentLoaded', () => {
  const restartBtn = document.getElementById('restart-btn');
  if (restartBtn) {
    restartBtn.addEventListener('click', restartTool);
    restartBtn.addEventListener('mouseenter', () => {
      SoundManager.play('menuHover');
    });
  }
  
  // Error restart button
  const errorRestartBtn = document.getElementById('error-restart-btn');
  if (errorRestartBtn) {
    errorRestartBtn.addEventListener('click', restartTool);
    errorRestartBtn.addEventListener('mouseenter', () => {
      SoundManager.play('menuHover');
    });
  }
  
  // Fallback PNG button
  const fallbackPngBtn = document.getElementById('fallback-png-btn');
  if (fallbackPngBtn) {
    fallbackPngBtn.addEventListener('click', exportFallbackPNG);
    fallbackPngBtn.addEventListener('mouseenter', () => {
      SoundManager.play('menuHover');
    });
  }
});

// Fallback PNG export when GIF fails
async function exportFallbackPNG() {
  const fallbackBtn = document.getElementById('fallback-png-btn');
  if (fallbackBtn) fallbackBtn.disabled = true;
  
  try {
    SoundManager.play('confirm');
    
    const stage = document.getElementById("stage");
    
    // Temporarily reset UI scale for accurate capture
    const originalScale = getComputedStyle(document.documentElement).getPropertyValue('--ui-scale');
    document.documentElement.style.setProperty('--ui-scale', '1');
    stage.offsetHeight; // Force reflow
    
    const canvas = await html2canvas(stage, {
      width: STAGE_W,
      height: STAGE_H,
      scale: 1,
      useCORS: true,
      allowTaint: true,
      backgroundColor: null,
      foreignObjectRendering: false,
      ignoreElements: (element) => {
        return element.id === 'overlay' || 
               element.classList.contains('scale-handle') || 
               element.classList.contains('rot-handle');
      }
    });
    
    // Restore UI scale
    document.documentElement.style.setProperty('--ui-scale', originalScale);
    
    // Get banner name
    const bannerNameInput = document.getElementById('banner-name');
    const bannerName = sanitizeFilename(bannerNameInput ? bannerNameInput.value : '');
    
    // Generate filename
    const timestamp = Date.now();
    const randomId = Math.random().toString(36).substring(2, 8);
    const filename = bannerName 
      ? `${bannerName}_${timestamp}_${randomId}.png`
      : `banner_${timestamp}_${randomId}.png`;
    
    const pngData = canvas.toDataURL("image/png");
    
    // Try to save to server
    try {
      await saveBannerToServer(pngData, filename);
    } catch (e) {
      console.warn('Server save failed:', e);
    }
    
    // Download the PNG
    const a = document.createElement('a');
    a.href = pngData;
    a.download = filename;
    a.click();
    
    SoundManager.play('save');
    
    // Show completed state
    showExportCompleted();
    
  } catch (error) {
    console.error('PNG export error:', error);
    SoundManager.play('clickDenied');
    alert('PNG export also failed: ' + error.message);
  } finally {
    if (fallbackBtn) fallbackBtn.disabled = false;
  }
}

// ==== POPUP OVER STAGE (NEW) =============================================

// ==== GUIDED FLOW SYSTEM ====
// Tracks user progress through the 7 steps
// Step order: 'bg' (1), '2' (hero), '3' (headline), '4' (stickers), '5' (company), '6' (CTA), 'export' (7)
const STEP_ORDER = ['bg', '2', '3', '4', '5', '6', 'export'];
let currentStep = 0; // Index into STEP_ORDER (0 = bg, user starts here)
let currentOpenStep = -1; // Track which step's overlay is currently open

function getStepIndex(panel) {
  return STEP_ORDER.indexOf(panel);
}

function isStepUnlocked(panel) {
  const stepIndex = getStepIndex(panel);
  // Only the current step is unlocked (no going back!)
  return stepIndex === currentStep;
}

function completeStep(panel) {
  const stepIndex = getStepIndex(panel);
  // Advance to next step if this was the current step
  if (stepIndex === currentStep && currentStep < STEP_ORDER.length - 1) {
    currentStep = stepIndex + 1;
  }
  currentOpenStep = -1;
  updateSidebarButtonStates();
}

function updateSidebarButtonStates() {
  document.querySelectorAll('#sidebar .category').forEach(btn => {
    const panel = btn.getAttribute('data-panel');
    const stepIndex = getStepIndex(panel);
    
    // Remove all state classes first
    btn.classList.remove('locked', 'blinking', 'completed', 'current');
    
    if (stepIndex < currentStep) {
      // Previous steps - locked, greyed out, not revisitable
      btn.classList.add('locked');
    } else if (stepIndex === currentOpenStep) {
      // Currently open overlay - white, no blinking
      btn.classList.add('current');
    } else if (stepIndex === currentStep && currentOpenStep === -1) {
      // This is the next step to do AND no overlay is open - blinking
      btn.classList.add('blinking');
    } else {
      // Future steps - locked/greyed out
      btn.classList.add('locked');
    }
  });
}

// ==== SOUND SYSTEM ====
const SoundManager = {
  sounds: {},
  muted: false,
  initialized: false,
  
  init() {
    if (this.initialized) return;
    this.initialized = true;
    
    // Cache all sound elements
    this.sounds = {
      save: document.getElementById('sound_save'),
      delete: document.getElementById('sound_delete'),
      confirm: document.getElementById('sound_confirm'),
      menuClick: document.getElementById('sound_menu_click'),
      menuHover: document.getElementById('sound_menu_hover'),
      drag: document.getElementById('sound_drag'),
      drop: document.getElementById('sound_drop'),
      click: document.getElementById('sound_click'),
      clickDenied: document.getElementById('sound_click_denied'),
      close: document.getElementById('sound_close'),
      popup: document.getElementById('sound_popup')
    };
  },
  
  play(soundName) {
    if (this.muted) return;
    const sound = this.sounds[soundName];
    if (sound) {
      sound.currentTime = 0;
      sound.play().catch(() => {}); // Ignore autoplay errors
    }
  },
  
  setMuted(muted) {
    this.muted = muted;
  },
  
  toggle() {
    this.setMuted(!this.muted);
    return this.muted;
  }
};

// Initialize sounds when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  SoundManager.init();
  
  // Menu button sounds (sidebar category buttons)
  // Reference: .menu_button mousedown → sound_menu_click
  // Reference: .menu_button hover → sound_menu_hover
  // Reference: .menu_disabled mousedown → sound_click_denied
  document.querySelectorAll('#sidebar .category').forEach(btn => {
    btn.addEventListener('mouseenter', () => {
      if (!btn.classList.contains('locked')) {
        SoundManager.play('menuHover');
      }
    });
    btn.addEventListener('mousedown', () => {
      if (btn.classList.contains('locked')) {
        SoundManager.play('clickDenied');
      } else {
        SoundManager.play('menuClick');
      }
    });
  });
  
  // Global click sound - plays on body for general clicks
  // Reference: body mousedown → sound_click
  document.body.addEventListener('mousedown', (e) => {
    // Don't play click sound for elements that have their own sounds
    if (!e.target.closest('.category') && 
        !e.target.closest('.export-btn') && 
        !e.target.closest('#popup-close') &&
        !e.target.closest('.sticker-wrapper') &&
        !e.target.closest('.bg-card') &&
        !e.target.closest('.sticker-src') &&
        !e.target.closest('#sticker-bar-delete-area') &&
        !e.target.closest('.effect-tab') &&
        !e.target.closest('.bar-btn') &&
        !e.target.closest('.word-box')) {
      SoundManager.play('click');
    }
  }, true); // Use capture phase to fire first
});

// Elements
const overlay = document.getElementById('overlay');
const popup   = document.getElementById('popup');

// Utility
function basename(path){
  const q = path.split('?')[0].split('#')[0];
  return q.split('/').pop();
}

// Clean background filename for display: remove underscores and .gif extension
function cleanBgName(path) {
  // Get just the filename from the path
  var name = path.substring(path.lastIndexOf('/') + 1);
  // Remove .gif extension
  if (name.toLowerCase().endsWith('.gif')) {
    name = name.slice(0, -4);
  }
  // Replace underscores with spaces
  while (name.indexOf('_') !== -1) {
    name = name.replace('_', ' ');
  }
  return name;
}

function closePopup(){
  overlay.classList.remove('open');
  overlay.classList.add('hidden');
  popup.innerHTML = '';
  document.body.classList.remove('modal-open');
  
  // Clean up glitter preview
  if (typeof glitterPreviewAnimId !== 'undefined' && glitterPreviewAnimId) {
    cancelAnimationFrame(glitterPreviewAnimId);
    glitterPreviewAnimId = null;
  }
  if (typeof glitterPreviewCanvas !== 'undefined' && glitterPreviewCanvas && glitterPreviewCanvas.parentNode) {
    glitterPreviewCanvas.parentNode.removeChild(glitterPreviewCanvas);
    glitterPreviewCanvas = null;
  }
  if (typeof glitterPreviewPixels !== 'undefined') {
    glitterPreviewPixels = [];
  }
  if (typeof glitterPreviewData !== 'undefined') {
    glitterPreviewData = null;
  }
  
  // Remove active state from all buttons
  document.querySelectorAll('#sidebar .category').forEach(btn => {
    btn.classList.remove('active');
  });
  
  // Update guided flow state
  currentOpenStep = -1;
  updateSidebarButtonStates();
  
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
  if (kind === 'bg') title = 'Set the Theme';
  if (kind === '2') title = 'Chose your Showpiece';
  if (kind === '3') title = 'Write your Slogan';
  if (kind === '5') title = 'Unwrap the Sparkle';
  if (kind === '6') title = 'Pick a festive Click-Me';
  if (kind === 'export') title = 'Save & Celebrate';

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

  // Reference: .close mousedown → sound_close
  document.getElementById('popup-close').addEventListener('click', () => {
    SoundManager.play('close');
    closePopup();
  });

  if (kind === 'bg'){
    buildBGGrid(body);
  } else if (kind === '2'){
    buildHeroGrid(body);
  } else if (kind === '3'){
    buildHeadlineUI(body);
  } else if (kind === '4'){
    // Button 4: Unlock stickers (no overlay needed)
    unlockStickers();
    completeStep('4'); // Complete step 4
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
    
    // Clean the name inline
    let displayName = url.substring(url.lastIndexOf('/') + 1);
    if (displayName.toLowerCase().endsWith('.gif')) {
      displayName = displayName.slice(0, -4);
    }
    while (displayName.indexOf('_') !== -1) {
      displayName = displayName.replace('_', ' ');
    }
    
    img.alt = displayName;
    thumb.appendChild(img);

    const cap = document.createElement('div');
    cap.className = 'bg-caption';
    cap.textContent = displayName;

    card.appendChild(thumb);
    card.appendChild(cap);
    wrap.appendChild(card);

    // Hover sound
    card.addEventListener('mouseenter', () => {
      SoundManager.play('menuHover');
    });

    card.addEventListener('click', () => {
      SoundManager.play('confirm'); // Play confirm sound when selecting BG
      const stage = document.getElementById('stage');
      stage.style.backgroundImage = `url(${url})`;
      completeStep('bg'); // Complete step 1
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
  wrap.className = 'hero-grid';  // Use hero-specific grid class

  shuffled.forEach(opt => {
    const url = opt.getAttribute('data-hero');
    const card = document.createElement('div');
    card.className = 'bg-card';

    const thumb = document.createElement('div');
    thumb.className = 'hero-thumb';
    const img = document.createElement('img');
    img.src = url;
    img.alt = basename(url);
    thumb.appendChild(img);

    card.appendChild(thumb);
    // No caption added - just the image
    wrap.appendChild(card);

    // Hover sound
    card.addEventListener('mouseenter', () => {
      SoundManager.play('menuHover');
    });

    card.addEventListener('click', () => {
      SoundManager.play('confirm'); // Play confirm sound when selecting hero
      spawnHero(url);
      completeStep('2'); // Complete step 2
      closePopup();
    });
  });

  container.appendChild(wrap);
}

function buildExportUI(container){
  // Build the export UI with main export button
  const wrap = document.createElement('div');
  wrap.className = 'export-ui-wrapper';
  wrap.innerHTML = `
    <div class="export-section main-export-section">
      <p class="export-congrats">Your banner is ready!</p>
      <div class="input-group banner-name-group">
        <label class="lbl" for="banner-name">Name your banner (optional)</label>
        <input id="banner-name" type="text" placeholder="My awesome banner" class="export-input banner-name-input" maxlength="50" />
      </div>
      <div class="btn-row centered">
        <button id="export-main" class="export-btn confirm-btn">Export Banner</button>
      </div>
      <div id="export-main-status" class="send-status"></div>
    </div>
  `;
  container.appendChild(wrap);

  // Wire up main export button
  wireMainExport();
}

// Sanitize filename - remove invalid characters, replace spaces with underscores
function sanitizeFilename(name) {
  if (!name || name.trim().length === 0) return '';
  
  // Replace spaces with underscores
  let sanitized = name.trim().replace(/\s+/g, '_');
  
  // Remove characters not allowed in filenames
  // Keep: letters (any language), numbers, underscore, hyphen, dot
  // Remove: / \ : * ? " < > | & % $ # @ ! ^ ( ) { } [ ] = + ` ~ ; ,
  sanitized = sanitized.replace(/[\/\\:*?"<>|&%$#@!^(){}\[\]=+`~;,]/g, '');
  
  // Remove any leading/trailing underscores or dots
  sanitized = sanitized.replace(/^[_.]+|[_.]+$/g, '');
  
  // Limit length
  if (sanitized.length > 50) {
    sanitized = sanitized.substring(0, 50);
  }
  
  return sanitized;
}

// Main export button handler
function wireMainExport() {
  const exportBtn = document.getElementById('export-main');
  const exportStatus = document.getElementById('export-main-status');
  
  if (!exportBtn) return;
  
  exportBtn.addEventListener('click', async () => {
    SoundManager.play('confirm');
    exportStatus.textContent = 'Preparing your banner...';
    exportStatus.className = 'send-status pending';
    exportBtn.disabled = true;
    
    // Show exporting screen IMMEDIATELY (before any UI changes)
    const exportingScreen = document.getElementById('exporting-screen');
    const exportingVideo = document.getElementById('exporting-video');
    const progressContainer = document.getElementById('export-progress-container');
    const progressBar = document.getElementById('export-progress-bar');
    
    if (exportingScreen) exportingScreen.classList.remove('hidden');
    if (exportingVideo) {
      exportingVideo.currentTime = 0;
      exportingVideo.play().catch(() => {});
    }
    if (progressContainer) progressContainer.classList.remove('hidden');
    if (progressBar) progressBar.style.width = '0%';
    
    // Small delay to ensure export screen is visible before UI rescaling
    await new Promise(resolve => setTimeout(resolve, 100));
    
    try {
      // Generate GIF with fixed settings (10 fps, 5 seconds)
      const gifData = await generateGIF(10, 5, (progress) => {
        if (progressBar) progressBar.style.width = `${progress * 100}%`;
      });
      
      // Get and sanitize banner name
      const bannerNameInput = document.getElementById('banner-name');
      const bannerName = sanitizeFilename(bannerNameInput ? bannerNameInput.value : '');
      
      // Generate unique filename with timestamp and optional name
      const timestamp = Date.now();
      const randomId = Math.random().toString(36).substring(2, 8);
      const filename = bannerName 
        ? `${bannerName}_${timestamp}_${randomId}.gif`
        : `banner_${timestamp}_${randomId}.gif`;
      
      // Save to server
      exportStatus.textContent = 'Saving to server...';
      const saveResult = await saveBannerToServer(gifData, filename);
      
      if (!saveResult.success) {
        console.warn('Server save failed:', saveResult.error);
        // Continue anyway - still download for user
      }
      
      // Download the GIF
      const a = document.createElement('a');
      a.href = gifData;
      a.download = filename;
      a.click();
      
      SoundManager.play('save');
      
      // Show completed state
      showExportCompleted();
      
    } catch (error) {
      console.error('Export error:', error);
      SoundManager.play('clickDenied');
      
      // Show error state with fallback PNG option
      showExportError(error.message);
    } finally {
      exportBtn.disabled = false;
    }
  });
}

// Generate GIF with specified settings - returns base64 data URL
async function generateGIF(fps, durationSeconds, progressCallback) {
  if (typeof window.__gif_parseGIF !== "function" ||
      typeof window.__gif_decompressFrames !== "function") {
    throw new Error("GIF library not loaded. Please refresh the page.");
  }
  if (typeof GIFEncoder !== "function") {
    throw new Error("GIF encoder not loaded. Please refresh the page.");
  }
  
  const TOTAL = fps * durationSeconds;
  const FRAME_MS = Math.round(1000 / fps);
  
  // Set exporting flag to prevent animation pausing
  isExporting = true;
  
  // Temporarily reset UI scale
  const originalScale = getComputedStyle(document.documentElement).getPropertyValue('--ui-scale');
  document.documentElement.style.setProperty('--ui-scale', '1');
  
  try {
    const stage = document.getElementById("stage");
    stage.offsetHeight; // Force reflow
  
  const W = STAGE_W;
  const H = STAGE_H;
  
  const buf = document.createElement("canvas");
  buf.width = W; buf.height = H;
  const ctx = buf.getContext("2d", { willReadFrequently: true });
  
  // Load background
  const bgMatch = (stage.style.backgroundImage || "").match(/url\(["']?(.*?)["']?\)/);
  const bgURL = bgMatch ? bgMatch[1] : null;
  
  let bgData = null;
  if (bgURL) {
    if (/\.gif(?:[?#].*)?$/i.test(bgURL)) {
      const ab = await fetch(bgURL, { cache: "force-cache", mode: "cors" }).then(r => r.arrayBuffer());
      const gif = window.__gif_parseGIF(ab);
      const frs = window.__gif_decompressFrames(gif, true);
      const delays = frs.map(f => (f.delay && f.delay > 0 ? f.delay : 10));
      const totalDur = delays.reduce((a, b) => a + b, 0) || 1;
      bgData = { kind: "anim", frames: frs, delays, totalDur, width: gif.lsd.width, height: gif.lsd.height };
    } else {
      const img = await loadImageForExport(bgURL);
      bgData = { kind: "static", img };
    }
  }
  
  // Load all sticker wrappers (images only - not text elements)
  const wrappers = Array.from(stage.querySelectorAll(".sticker-wrapper"));
  const imageWrappers = wrappers.filter(w => w.querySelector("img") !== null);
  
  const stickers = await Promise.all(imageWrappers.map(async (w) => {
    const domImg = w.querySelector("img");
    const src = domImg.getAttribute("src");
    const x = parseFloat(w.getAttribute("data-x")) || 0;
    const y = parseFloat(w.getAttribute("data-y")) || 0;
    const scale = w.scale || 1;
    const angle = w.angle || 0;
    const domW = domImg.naturalWidth || domImg.width || 150;
    const domH = domImg.naturalHeight || domImg.height || 150;
    const baseW = parseFloat(domImg.style.width) || 150;
    const baseH = domW > 0 ? (baseW * domH / domW) : baseW;
    const zIndex = parseInt(w.style.zIndex) || 0;
    const isHero = w.hasAttribute('data-is-hero') || w.classList.contains('hero-layer');
    
    if (/\.gif(?:[?#].*)?$/i.test(src)) {
      const ab = await fetch(src, { cache: "force-cache", mode: "cors" }).then(r => r.arrayBuffer());
      const gif = window.__gif_parseGIF(ab);
      const frs = window.__gif_decompressFrames(gif, true);
      const delays = frs.map(f => (f.delay && f.delay > 0 ? f.delay : 10));
      const totalDur = delays.reduce((a, b) => a + b, 0) || 1;
      return { kind: "anim", frames: frs, delays, totalDur, x, y, scale, angle, domW, domH, baseW, baseH, zIndex, isHero };
    } else {
      const bmp = await loadImageForExport(src);
      return { kind: "static", img: bmp, x, y, scale, angle, domW, domH, baseW, baseH, zIndex, isHero };
    }
  }));
  
  // Sort stickers by z-index
  stickers.sort((a, b) => a.zIndex - b.zIndex);
  
  // Pre-render text elements (headline, company, CTA) using html2canvas
  const textWrappers = wrappers.filter(w => w.querySelector("img") === null);
  const textElements = await Promise.all(textWrappers.map(async (w) => {
    const x = parseFloat(w.getAttribute("data-x")) || 0;
    const y = parseFloat(w.getAttribute("data-y")) || 0;
    const scale = w.scale || 1;
    const angle = w.angle || 0;
    const isCTA = w.classList.contains('cta-layer');
    const zIndex = parseInt(w.style.zIndex) || 0;
    
    try {
      const clone = w.cloneNode(true);
      clone.style.position = 'fixed';
      clone.style.left = '20px';  // Add padding for shadow overflow
      clone.style.top = '20px';
      clone.style.transform = 'none';
      clone.style.zIndex = '-9999';
      clone.style.pointerEvents = 'none';
      clone.style.overflow = 'visible';
      document.body.appendChild(clone);
      
      // Remove animation from CTA and ensure styles are applied
      const innerEl = clone.querySelector('.cta-button, .headline-text, .company-text');
      if (innerEl) {
        innerEl.classList.remove('bouncing');
        innerEl.style.transform = 'none';
        innerEl.style.animation = 'none';
        innerEl.style.overflow = 'visible';
        
        // Get computed box-shadow and convert to filter if it's a simple shadow
        const computedStyle = window.getComputedStyle(w.querySelector('.cta-button, .headline-text, .company-text') || w);
        const boxShadow = computedStyle.boxShadow;
        
        // If there's a simple box-shadow (not inset, not multiple), convert to filter
        if (boxShadow && boxShadow !== 'none' && !boxShadow.includes('inset') && !boxShadow.includes(',')) {
          // Parse simple box-shadow: "rgb(r,g,b) Xpx Ypx Zpx" or "Xpx Ypx Zpx rgb(r,g,b)"
          // Convert to filter: drop-shadow(Xpx Ypx Zpx color)
          const match = boxShadow.match(/rgba?\([^)]+\)|#[0-9a-fA-F]+|\d+px/g);
          if (match && match.length >= 3) {
            const color = match.find(m => m.startsWith('rgb') || m.startsWith('#')) || 'rgba(0,0,0,0.5)';
            const values = match.filter(m => m.endsWith('px'));
            if (values.length >= 2) {
              const dropShadow = `drop-shadow(${values[0]} ${values[1]} ${values[2] || '0px'} ${color})`;
              innerEl.style.filter = (innerEl.style.filter || '') + ' ' + dropShadow;
            }
          }
        }
      }
      
      // Get the actual rendered size
      const rect = clone.getBoundingClientRect();
      
      const canvas = await html2canvas(clone, {
        scale: 2,
        backgroundColor: null,
        logging: false,
        allowTaint: true,
        useCORS: true,
        width: rect.width + 40,  // Extra space for shadows
        height: rect.height + 40,
        x: -20,  // Offset to capture shadows
        y: -20,
        ignoreElements: (element) => {
          return element.classList.contains('scale-handle') || 
                 element.classList.contains('rot-handle');
        }
      });
      
      document.body.removeChild(clone);
      
      const baseW = canvas.width / 2;
      const baseH = canvas.height / 2;
      
      // Adjust x/y to account for the padding we added
      return { canvas, x: x - 20, y: y - 20, scale, angle, baseW, baseH, isCTA, zIndex };
    } catch (e) {
      console.error('Text element capture error:', e);
      return null;
    }
  }));
  
  const validTextElements = textElements.filter(t => t !== null);
  validTextElements.sort((a, b) => a.zIndex - b.zIndex);
  
  // Encode GIF
  const enc = new GIFEncoder();
  enc.setRepeat(0);
  enc.setDelay(FRAME_MS);
  enc.setQuality(10);
  enc.start();
  
  const snowCanvasEl = document.getElementById('snow-canvas');
  const glitterCanvasEl = document.getElementById('glitter-canvas');
  
  // Bounce animation parameters
  const BOUNCE_DURATION = 2000;
  const bounceScales = [1, 1.10, 1.20, 1.10];
  const bounceStart = 500;
  
  for (let i = 0; i < TOTAL; i++) {
    const frameTime = i * FRAME_MS;
    
    // Update snow and glitter
    if (typeof updateSnowFrame === 'function') updateSnowFrame(1);
    if (typeof updateGlitterFrame === 'function') updateGlitterFrame(1);
    
    ctx.clearRect(0, 0, W, H);
    
    // Draw background
    if (bgData) {
      const drawH = H * 1.15;
      const drawY = (H - drawH) / 2;
      
      if (bgData.kind === "static") {
        ctx.drawImage(bgData.img, 0, drawY, W, drawH);
      } else {
        const elapsed = frameTime;
        const mod = elapsed % bgData.totalDur;
        let acc = 0, idx = 0;
        for (; idx < bgData.delays.length; idx++) { acc += bgData.delays[idx]; if (mod < acc) break; }
        idx = idx % bgData.frames.length;
        
        const fullGif = document.createElement("canvas");
        fullGif.width = bgData.width;
        fullGif.height = bgData.height;
        const fullCtx = fullGif.getContext("2d");
        
        for (let fi = 0; fi <= idx; fi++) {
          const f = bgData.frames[fi];
          if (fi > 0) {
            const prevF = bgData.frames[fi - 1];
            if (prevF.disposalType === 2) {
              fullCtx.clearRect(prevF.dims.left, prevF.dims.top, prevF.dims.width, prevF.dims.height);
            }
          }
          const patch = new ImageData(new Uint8ClampedArray(f.patch), f.dims.width, f.dims.height);
          const pc = document.createElement("canvas");
          pc.width = f.dims.width;
          pc.height = f.dims.height;
          pc.getContext("2d").putImageData(patch, 0, 0);
          fullCtx.drawImage(pc, f.dims.left, f.dims.top);
        }
        
        ctx.drawImage(fullGif, 0, drawY, W, drawH);
      }
    }
    
    // Draw stickers (including heroes with their GIF animations)
    for (const s of stickers) {
      ctx.save();
      ctx.translate(s.x, s.y);
      ctx.translate(s.baseW / 2, s.baseH / 2);
      ctx.rotate((s.angle || 0) * Math.PI / 180);
      ctx.scale(s.scale || 1, s.scale || 1);
      
      const offsetX = -s.baseW / 2;
      const offsetY = -s.baseH / 2;
      
      if (s.kind === "static") {
        ctx.drawImage(s.img, offsetX, offsetY, s.baseW, s.baseH);
      } else {
        // Animated GIF sticker/hero
        const elapsed = frameTime;
        const mod = elapsed % s.totalDur;
        let acc = 0, idx = 0;
        for (; idx < s.delays.length; idx++) { acc += s.delays[idx]; if (mod < acc) break; }
        idx = idx % s.frames.length;
        
        const fullGif = document.createElement("canvas");
        fullGif.width = s.domW;
        fullGif.height = s.domH;
        const fullCtx = fullGif.getContext("2d");
        
        for (let fi = 0; fi <= idx; fi++) {
          const f = s.frames[fi];
          if (fi > 0) {
            const prevF = s.frames[fi - 1];
            if (prevF.disposalType === 2) {
              fullCtx.clearRect(prevF.dims.left, prevF.dims.top, prevF.dims.width, prevF.dims.height);
            }
          }
          const patch = new ImageData(new Uint8ClampedArray(f.patch), f.dims.width, f.dims.height);
          const pc = document.createElement("canvas");
          pc.width = f.dims.width;
          pc.height = f.dims.height;
          pc.getContext("2d").putImageData(patch, 0, 0);
          fullCtx.drawImage(pc, f.dims.left, f.dims.top);
        }
        
        ctx.drawImage(fullGif, offsetX, offsetY, s.baseW, s.baseH);
      }
      ctx.restore();
    }
    
    // Calculate CTA bounce for this frame
    let ctaBounceScale = 1;
    if (frameTime >= bounceStart && frameTime < bounceStart + BOUNCE_DURATION) {
      const bounceProgress = (frameTime - bounceStart) / BOUNCE_DURATION;
      const bounceStep = Math.floor(bounceProgress * 4) % 4;
      ctaBounceScale = bounceScales[bounceStep];
    }
    
    // Draw text elements (headline, company, CTA)
    for (const t of validTextElements) {
      ctx.save();
      ctx.translate(t.x, t.y);
      ctx.translate(t.baseW / 2, t.baseH / 2);
      ctx.rotate((t.angle || 0) * Math.PI / 180);
      
      let finalScale = t.scale || 1;
      if (t.isCTA) {
        finalScale *= ctaBounceScale;
      }
      ctx.scale(finalScale, finalScale);
      
      ctx.drawImage(t.canvas, -t.baseW / 2, -t.baseH / 2, t.baseW, t.baseH);
      ctx.restore();
    }
    
    // Draw glitter
    if (glitterCanvasEl) {
      ctx.drawImage(glitterCanvasEl, 0, 0, W, H);
    }
    
    // Draw snow
    if (snowCanvasEl) {
      ctx.drawImage(snowCanvasEl, 0, 0, W, H);
    }
    
    enc.addFrame(ctx);
    
    if (progressCallback) {
      progressCallback((i + 1) / TOTAL);
      // Yield to event loop every few frames to allow UI updates
      if (i % 5 === 0) {
        await new Promise(resolve => setTimeout(resolve, 0));
      }
    }
  }
  
  enc.finish();
  const binary = enc.stream().getData();
  const b64 = btoa(binary);
  return "data:image/gif;base64," + b64;
  
  } finally {
    // Clean up export state
    isExporting = false;
    document.documentElement.style.setProperty('--ui-scale', originalScale);
  }
}

function loadImageForExport(url) {
  return new Promise((res, rej) => {
    if (!url) return res(null);
    const im = new Image();
    im.crossOrigin = "anonymous";
    im.onload = () => res(im);
    im.onerror = rej;
    im.src = url;
  });
}

// ==== API INTEGRATION ====
// Saves the banner GIF to server
async function saveBannerToServer(gifDataUrl, filename) {
  // Change this to your actual PHP endpoint path
  const API_ENDPOINT = 'save-banner.php';
  
  try {
    const response = await fetch(API_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        image: gifDataUrl,
        filename: filename,
        timestamp: new Date().toISOString(),
      })
    });
    
    const result = await response.json();
    
    if (!response.ok) {
      throw new Error(result.error || `Server error: ${response.status}`);
    }
    
    return result;
  } catch (error) {
    console.error('Server save error:', error);
    return { success: false, error: error.message };
  }
}


// Sidebar buttons now drive the popup
document.querySelectorAll('#sidebar .category').forEach(btn => {
  btn.addEventListener('click', () => {
    const which = btn.getAttribute('data-panel'); // 'bg', 'export', etc.
    const stepIndex = getStepIndex(which);
    
    // Check if this step is unlocked
    if (!isStepUnlocked(which)) {
      // Step is locked, don't do anything
      return;
    }
    
    // Special case: step 4 doesn't open an overlay, just unlocks stickers
    // openPopup handles this internally and advances the step
    if (which === '4') {
      openPopup(which);
      // Don't set currentOpenStep - openPopup already handled everything
      return;
    }
    
    const isOpen = overlay.classList.contains('open');
    if (isOpen){
      const current = popup.querySelector('.popup-head span')?.textContent?.toLowerCase();
      if (current === which){
        closePopup();
        currentOpenStep = -1;
        updateSidebarButtonStates();
      } else {
        openPopup(which);
        currentOpenStep = stepIndex;
        updateSidebarButtonStates();
      }
    } else {
      openPopup(which);
      currentOpenStep = stepIndex;
      updateSidebarButtonStates();
    }
  });
});

// Initialize guided flow on page load
setTimeout(() => {
  currentOpenStep = 0; // BG overlay is open
  updateSidebarButtonStates();
  // Auto-open the BG selection overlay
  openPopup('bg');
}, 150);

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
let currentHeroCategory = null; // Track which category the hero is from

// Extract category from hero URL path
function getHeroCategoryFromUrl(url) {
  // URL format: assets/hero/CATEGORY NAME/filename.gif
  const match = url.match(/assets\/hero\/([^\/]+)\//);
  if (match) {
    const folder = match[1].toUpperCase();
    if (folder.includes('MOTOR')) return 'motor';
    if (folder.includes('CHEMISTRY') || folder.includes('FACTORY')) return 'chemistry';
    if (folder.includes('DEFENCE') || folder.includes('SHIELD')) return 'defence';
    if (folder.includes('AGRICULTURE') || folder.includes('FARM')) return 'agriculture';
    if (folder.includes('DRINK')) return 'drinks';
  }
  return 'other';
}

function spawnHero(imageUrl) {
  const stage = document.getElementById('stage');
  
  // Track which category this hero is from
  currentHeroCategory = getHeroCategoryFromUrl(imageUrl);
  console.log('Hero category:', currentHeroCategory);
  
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
let selectedHeadlineVibes = []; // Track selected vibes for use in company names

// Adjectives grouped by vibe - user selects 4 to set the mood
const adjectives = [
  '✨ MAGICAL', '🎄 FESTIVE', '😊 JOYFUL', '🎅 MERRY',
  '⭐ BRIGHT', '🎉 CHEERFUL', '💫 SPARKLING', '🧣 COZY',
  '🌟 WONDER', '😄 JOLLY', '❄️ SNOWY', '🔆 GLOWING',
  '💖 HAPPY', '🔥 WARM', '💎 SHINY', '🙏 BLESSED'
];

// Word banks tied to adjective vibes
const headlineWordBanks = {
  // Magic/Fantasy vibes: MAGICAL, SPARKLING, GLOWING, WONDER, SHINY
  magic: {
    adjectives: ['magical', 'enchanting', 'mystical', 'dazzling', 'radiant', 'dreamy', 'wondrous'],
    nouns: ['magic', 'wonder', 'dreams', 'sparkle', 'moments', 'wishes', 'vibes'],
    verbs: ['awaits', 'begins', 'unfolds', 'shines', 'glows', 'sparkles']
  },
  // Festive/Celebratory vibes: FESTIVE, MERRY, JOLLY, CHEERFUL
  festive: {
    adjectives: ['festive', 'merry', 'jolly', 'cheerful', 'joyous', 'celebratory'],
    nouns: ['season', 'celebration', 'holidays', 'cheer', 'spirit', 'festivities', 'tidings'],
    verbs: ['celebrate', 'rejoice', 'arrives', 'begins', 'awaits']
  },
  // Warm/Cozy vibes: COZY, WARM, BLESSED, HAPPY
  cozy: {
    adjectives: ['cozy', 'warm', 'heartfelt', 'blessed', 'peaceful', 'loving', 'happy'],
    nouns: ['warmth', 'comfort', 'home', 'heart', 'love', 'joy', 'bliss', 'moments'],
    verbs: ['embrace', 'share', 'enjoy', 'cherish', 'awaits']
  },
  // Bright/Winter vibes: BRIGHT, SNOWY, JOYFUL
  bright: {
    adjectives: ['bright', 'snowy', 'frosty', 'crisp', 'fresh', 'brilliant', 'luminous'],
    nouns: ['snow', 'winter', 'light', 'frost', 'glow', 'days', 'nights'],
    verbs: ['shines', 'glows', 'arrives', 'falls', 'sparkles']
  }
};

// Word banks tied to hero categories
const heroCategoryWordBanks = {
  motor: {
    adjectives: ['fast', 'sleek', 'powerful', 'turbocharged', 'driven', 'unstoppable', 'speedy'],
    nouns: ['ride', 'drive', 'wheels', 'journey', 'road', 'adventure', 'speed', 'power'],
    verbs: ['drive', 'accelerate', 'cruise', 'race', 'roll']
  },
  chemistry: {
    adjectives: ['innovative', 'brilliant', 'precise', 'scientific', 'advanced', 'smart', 'revolutionary'],
    nouns: ['formula', 'innovation', 'discovery', 'science', 'solution', 'breakthrough', 'future'],
    verbs: ['discover', 'create', 'innovate', 'transform', 'evolve']
  },
  defence: {
    adjectives: ['strong', 'protected', 'secure', 'bold', 'fearless', 'mighty', 'legendary'],
    nouns: ['strength', 'protection', 'shield', 'power', 'victory', 'honor', 'glory'],
    verbs: ['protect', 'defend', 'conquer', 'stand', 'rise']
  },
  agriculture: {
    adjectives: ['fresh', 'natural', 'organic', 'wholesome', 'earthy', 'bountiful', 'green'],
    nouns: ['harvest', 'growth', 'nature', 'fields', 'farm', 'bounty', 'earth'],
    verbs: ['grow', 'harvest', 'cultivate', 'bloom', 'flourish']
  },
  drinks: {
    adjectives: ['refreshing', 'crisp', 'cool', 'smooth', 'bold', 'fizzy', 'thirst-quenching'],
    nouns: ['refreshment', 'taste', 'flavor', 'sip', 'chill', 'buzz', 'toast'],
    verbs: ['refresh', 'enjoy', 'sip', 'savor', 'chill']
  },
  other: {
    adjectives: ['amazing', 'awesome', 'incredible', 'epic', 'legendary'],
    nouns: ['vibes', 'moments', 'experience', 'adventure', 'journey'],
    verbs: ['awaits', 'begins', 'arrives', 'unfolds']
  }
};

// Map each selectable adjective to its vibe category
const adjectiveToVibe = {
  'MAGICAL': 'magic', 'SPARKLING': 'magic', 'GLOWING': 'magic', 'WONDER': 'magic', 'SHINY': 'magic',
  'FESTIVE': 'festive', 'MERRY': 'festive', 'JOLLY': 'festive', 'CHEERFUL': 'festive',
  'COZY': 'cozy', 'WARM': 'cozy', 'BLESSED': 'cozy', 'HAPPY': 'cozy',
  'BRIGHT': 'bright', 'SNOWY': 'bright', 'JOYFUL': 'festive'
};

// Headline patterns - will be filled with words from the selected vibes
const headlinePatterns = [
  // Simple & punchy
  '{adj} {noun}',
  '{adj} {noun} {verb}',
  'Get {adj}',
  'Stay {adj}',
  'Feel {adj}',
  'Go {adj}',
  
  // Declarative statements
  'The {adj} {noun}',
  'It\'s {adj} Time',
  '{adj} is Here',
  '{noun} {verb}',
  'The {noun} {verb}',
  
  // With "Season/Holidays"
  '{adj} Season',
  'The {adj} Season',
  '{adj} Holidays',
  'This {adj} Season',
  
  // Action-oriented
  '{verb} the {noun}',
  '{verb} {adj}',
  'Let\'s Get {adj}',
  'Time to {verb}',
  
  // Emotional/Evocative
  '{adj}. {adj2}. {noun}.',
  'Pure {noun}',
  'All the {noun}',
  '{noun} & {noun2}',
  
  // Questions & exclamations
  'Ready for {noun}?',
  '{adj} Much?',
  'Hello, {noun}!',
  
  // Percentage/Superlative
  '100% {adj}',
  'Extra {adj}',
  'So {adj}',
  'Very {adj}',
  'Maximum {noun}',
  
  // Longer phrases
  '{adj} {noun} for Everyone',
  '{adj} {noun} for You',
  'The {adj} {noun} Edit',
  '{adj} {noun} Inside',
  'Your {adj} {noun}',
  'Our {adj} {noun}',
  
  // Seasonal
  'Season of {noun}',
  '{noun} Season is Here',
  'Tis the {noun}',
  'Let it {verb}',
  
  // Two-word punchy
  '{adj} AF',
  '{noun} Mode',
  '{adj} Vibes',
  '{noun} Goals',
  '{adj} Energy',
  '{noun} Loading...',
  
  // Imperative
  'Bring the {noun}',
  'Spread the {noun}',
  'Find Your {noun}',
  'Unlock {adj} {noun}'
];

function getVibesFromSelection(selectedWords) {
  // Get unique vibes from the 4 selected adjectives
  const vibes = new Set();
  selectedWords.forEach(word => {
    // Strip emoji prefix (e.g., '✨ MAGICAL' -> 'MAGICAL')
    const cleanWord = word.replace(/^[^\w\s]+\s*/, '').trim();
    const vibe = adjectiveToVibe[cleanWord];
    if (vibe) vibes.add(vibe);
  });
  return Array.from(vibes);
}

function getMergedWordBank(vibes) {
  // Merge word banks from all selected vibes
  const merged = {
    adjectives: [],
    nouns: [],
    verbs: []
  };
  
  vibes.forEach(vibe => {
    const bank = headlineWordBanks[vibe];
    if (bank) {
      merged.adjectives.push(...bank.adjectives);
      merged.nouns.push(...bank.nouns);
      merged.verbs.push(...bank.verbs);
    }
  });
  
  // Also add hero category words if a hero has been selected
  if (currentHeroCategory && heroCategoryWordBanks[currentHeroCategory]) {
    const heroBank = heroCategoryWordBanks[currentHeroCategory];
    merged.adjectives.push(...heroBank.adjectives);
    merged.nouns.push(...heroBank.nouns);
    merged.verbs.push(...heroBank.verbs);
    // Add hero words twice to give them more weight
    merged.adjectives.push(...heroBank.adjectives);
    merged.nouns.push(...heroBank.nouns);
  }
  
  return merged;
}

function generateHeadlineText(selectedWords) {
  const vibes = getVibesFromSelection(selectedWords);
  const wordBank = getMergedWordBank(vibes);
  
  // Add the selected adjectives to the word bank (they should appear sometimes!)
  // Strip emoji prefix and convert to lowercase
  const selectedLower = selectedWords.map(w => w.replace(/^[^\w\s]+\s*/, '').trim().toLowerCase());
  wordBank.adjectives.push(...selectedLower);
  
  // Pick a random pattern
  const pattern = headlinePatterns[Math.floor(Math.random() * headlinePatterns.length)];
  
  // Helper to pick random word
  const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
  
  // Fill in the pattern
  let headline = pattern
    .replace('{adj}', pick(wordBank.adjectives))
    .replace('{adj2}', pick(wordBank.adjectives))
    .replace('{noun}', pick(wordBank.nouns))
    .replace('{noun2}', pick(wordBank.nouns))
    .replace('{verb}', pick(wordBank.verbs));
  
  // Capitalize first letter of each word for headline style
  headline = headline.split(' ').map(word => {
    if (word.length === 0) return word;
    // Don't capitalize small words unless first
    const smallWords = ['the', 'a', 'an', 'and', 'or', 'for', 'of', 'to', 'is'];
    if (smallWords.includes(word.toLowerCase())) return word.toLowerCase();
    return word.charAt(0).toUpperCase() + word.slice(1);
  }).join(' ');
  
  // Always capitalize first word
  headline = headline.charAt(0).toUpperCase() + headline.slice(1);
  
  return headline;
}

function buildHeadlineUI(container) {
  const selectedWords = [];
  
  // Create a wrapper that fills the space
  const wrapper = document.createElement('div');
  wrapper.className = 'vibes-wrapper';
  wrapper.style.height = '100%';
  wrapper.style.width = '100%';
  wrapper.style.position = 'relative';
  wrapper.addEventListener('click', (e) => {
    // Only stop propagation, don't close
    e.stopPropagation();
  });
  
  // Instructions
  const instructions = document.createElement('div');
  instructions.className = 'headline-instructions';
  
  // Simple instruction text
  instructions.textContent = 'chose 4 vibes';
  wrapper.appendChild(instructions);
  
  // Word grid
  const wordGrid = document.createElement('div');
  wordGrid.className = 'word-grid';
  
  adjectives.forEach(word => {
    const wordBox = document.createElement('div');
    wordBox.className = 'word-box';
    wordBox.textContent = word;
    
    // Hover sound
    wordBox.addEventListener('mouseenter', () => {
      SoundManager.play('menuHover');
    });
    
    wordBox.addEventListener('click', () => {
      if (wordBox.classList.contains('selected')) {
        // Deselect
        SoundManager.play('click');
        wordBox.classList.remove('selected');
        const idx = selectedWords.indexOf(word);
        if (idx > -1) selectedWords.splice(idx, 1);
      } else if (selectedWords.length < 4) {
        // Select
        wordBox.classList.add('selected');
        selectedWords.push(word);
        
        // If 4 words selected, play confirm and show generator
        if (selectedWords.length === 4) {
          SoundManager.play('confirm'); // All vibes selected!
          // Store vibes globally for company name generator to use
          selectedHeadlineVibes = [...selectedWords];
          
          wordGrid.style.display = 'none';
          instructions.style.display = 'none'; // Hide instructions
          showHeadlineGenerator(wrapper, selectedWords);
        } else {
          SoundManager.play('click');
        }
      } else {
        // Already have 4 selected
        SoundManager.play('clickDenied');
      }
    });
    
    wordGrid.appendChild(wordBox);
  });
  
  wrapper.appendChild(wordGrid);
  container.appendChild(wrapper);
}

// Glitter preview system for generator overlays - uses EXACT same logic as main glitter
let glitterPreviewAnimId = null;
let glitterPreviewCanvas = null;
let glitterPreviewCtx = null;
let glitterPreviewPixels = [];
let glitterPreviewData = null;
let glitterPreviewLastTime = 0;

function updateGlitterPreview(previewEl, hasGlitter) {
  // Clean up any existing preview
  if (glitterPreviewAnimId) {
    cancelAnimationFrame(glitterPreviewAnimId);
    glitterPreviewAnimId = null;
  }
  if (glitterPreviewCanvas && glitterPreviewCanvas.parentNode) {
    glitterPreviewCanvas.parentNode.removeChild(glitterPreviewCanvas);
  }
  glitterPreviewCanvas = null;
  glitterPreviewCtx = null;
  glitterPreviewPixels = [];
  glitterPreviewData = null;
  
  if (!hasGlitter) return;
  
  // Create canvas overlay
  const parent = previewEl.parentElement;
  if (!parent) return;
  
  glitterPreviewCanvas = document.createElement('canvas');
  glitterPreviewCanvas.style.cssText = 'position:absolute;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:100;';
  parent.appendChild(glitterPreviewCanvas);
  
  // Size canvas to parent (full overlay area)
  const parentRect = parent.getBoundingClientRect();
  glitterPreviewCanvas.width = parentRect.width;
  glitterPreviewCanvas.height = parentRect.height;
  glitterPreviewCtx = glitterPreviewCanvas.getContext('2d');
  
  // Get preview element bounds RELATIVE to parent
  const previewRect = previewEl.getBoundingClientRect();
  const offsetX = previewRect.left - parentRect.left;
  const offsetY = previewRect.top - parentRect.top;
  
  // Generate glitter data using same functions as main system
  glitterPreviewData = {
    colors: typeof getRandomGlitterColors === 'function' ? getRandomGlitterColors() : 
      ['#ff69b4', '#00ffff', '#ffd700', '#ff00ff', '#ffffff'],
    settings: typeof getRandomStickerSettings === 'function' ? getRandomStickerSettings() : {
      densityMult: 1,
      sizeMinOffset: 0,
      sizeMaxOffset: 0,
      speedMult: 1,
      jitterMult: 1,
      starChanceOffset: 0,
      blinkHardnessOffset: 0,
      colorShiftSpeed: 0.002,
      colorPhase: Math.random() * Math.PI * 2,
      fps: 3,
      lastFrameTime: 0
    }
  };
  
  // Create bounds for the PREVIEW ELEMENT only (not full parent)
  const bounds = {
    x: offsetX,
    y: offsetY,
    w: previewRect.width,
    h: previewRect.height,
    colors: glitterPreviewData.colors,
    settings: glitterPreviewData.settings
  };
  
  // Use same density calculation as main system
  const settings = typeof GLITTER_SETTINGS !== 'undefined' ? GLITTER_SETTINGS : {
    density: 0.15, sizeMin: 6, sizeMax: 15, glitterAmount: 1, glitterSpeed: 0.05,
    jitter: 2.3, crossChance: 1, starChance: 0.75, fps: 3, blinkHardness: 1, brightness: 3
  };
  
  const elementDensity = settings.density * (bounds.settings?.densityMult || 1);
  const area = bounds.w * bounds.h;
  const count = Math.max(15, Math.min(80, Math.floor(area * elementDensity / 100)));
  
  // Create particles using same logic as main system
  for (let j = 0; j < count; j++) {
    const stickerSettings = bounds.settings || {};
    
    const sizeMin = Math.max(1, settings.sizeMin + (stickerSettings.sizeMinOffset || 0));
    const sizeMax = Math.max(sizeMin + 1, settings.sizeMax + (stickerSettings.sizeMaxOffset || 0));
    const size = (sizeMin + Math.random() * (sizeMax - sizeMin)) | 0;
    
    // Local position within the preview element bounds
    const localX = Math.random() * bounds.w;
    const localY = Math.random() * bounds.h;
    
    const dx = (localX / bounds.w - 0.5) * 2;
    const dy = (localY / bounds.h - 0.5) * 2;
    const distSq = dx * dx + dy * dy;
    const fadeMult = Math.max(0, 1 - distSq * 0.5);
    
    const effectiveStarChance = Math.max(0, Math.min(1, 
      settings.starChance + (stickerSettings.starChanceOffset || 0)
    ));
    
    let shapeType = 'square';
    if (Math.random() < settings.crossChance) {
      shapeType = Math.random() < effectiveStarChance ? 'star' : 'cross';
    }
    
    const baseSpeed = settings.glitterSpeed * (stickerSettings.speedMult || 1);
    
    glitterPreviewPixels.push({
      // Store position relative to canvas (includes offset)
      x: bounds.x + localX,
      y: bounds.y + localY,
      baseSize: size,
      alphaBase: (0.4 + Math.random() * 0.6) * fadeMult,
      phase: Math.random() * 6.28,
      speed: baseSpeed * (0.5 + Math.random()),
      localAmount: 0.4 + Math.random() * 0.6,
      colors: bounds.colors,
      shapeType: shapeType,
      stickerSettings: stickerSettings
    });
  }
  
  glitterPreviewLastTime = 0;
  
  // Animation loop - same logic as main glitterLoop
  function glitterPreviewLoop(timestamp) {
    if (!glitterPreviewCanvas || !glitterPreviewCtx) return;
    
    glitterPreviewAnimId = requestAnimationFrame(glitterPreviewLoop);
    
    if (!glitterPreviewLastTime) glitterPreviewLastTime = timestamp;
    const dt = (timestamp - glitterPreviewLastTime) / (1000 / 60);
    glitterPreviewLastTime = timestamp;
    
    // Per-element FPS control
    const previewFps = glitterPreviewData.settings?.fps || 3;
    const frameInterval = 1000 / previewFps;
    const lastFrame = glitterPreviewData.settings?.lastFrameTime || 0;
    
    const shouldRender = timestamp - lastFrame >= frameInterval;
    if (shouldRender) {
      glitterPreviewData.settings.lastFrameTime = timestamp;
    }
    
    glitterPreviewCtx.clearRect(0, 0, glitterPreviewCanvas.width, glitterPreviewCanvas.height);
    
    const globalTime = timestamp * 0.001;
    const brightness = settings.brightness;
    
    for (let i = 0; i < glitterPreviewPixels.length; i++) {
      const p = glitterPreviewPixels[i];
      const stickerSettings = p.stickerSettings || {};
      
      // Always update phase
      p.phase += p.speed * dt;
      
      // Skip full recalc if not this frame's turn, use cached state
      if (!shouldRender && p.lastDrawState) {
        const s = p.lastDrawState;
        glitterPreviewCtx.globalAlpha = s.alpha;
        glitterPreviewCtx.fillStyle = s.color;
        drawGlitterPreviewShape(glitterPreviewCtx, s.x, s.y, s.size, s.shapeType);
        continue;
      }
      
      let pulse = (1 + Math.sin(p.phase)) * 0.5;
      
      const hardness = Math.max(0, Math.min(1, 
        settings.blinkHardness + (stickerSettings.blinkHardnessOffset || 0)
      ));
      pulse = Math.pow(pulse, 1 - hardness * 0.8);
      
      // Random sparkle pops
      if (Math.random() < 0.05) {
        pulse = Math.random() < 0.5 ? 1 : 0;
      }
      
      const amount = settings.glitterAmount * p.localAmount;
      const alpha = Math.min(1, p.alphaBase * (0.1 + amount * pulse) * brightness);
      const size = p.baseSize * (0.5 + 0.8 * amount * pulse);
      
      if (alpha < 0.1) continue;
      
      const jitter = settings.jitter * (stickerSettings.jitterMult || 1);
      const jx = (Math.random() - 0.5) * jitter;
      const jy = (Math.random() - 0.5) * jitter;
      
      const colorShiftSpeed = stickerSettings.colorShiftSpeed || 0.002;
      const colorPhase = stickerSettings.colorPhase || 0;
      const colorCyclePos = (globalTime * colorShiftSpeed + colorPhase + p.phase * 0.1) % 1;
      
      let currentColorIndex;
      if (Math.random() < 0.02) {
        currentColorIndex = Math.floor(Math.random() * p.colors.length);
      } else {
        currentColorIndex = Math.floor(colorCyclePos * p.colors.length) % p.colors.length;
      }
      const color = p.colors[currentColorIndex];
      
      const x = (p.x + jx) | 0;
      const y = (p.y + jy) | 0;
      
      p.lastDrawState = { x, y, size, color, alpha, shapeType: p.shapeType };
      
      glitterPreviewCtx.globalAlpha = alpha;
      glitterPreviewCtx.fillStyle = color;
      drawGlitterPreviewShape(glitterPreviewCtx, x, y, size, p.shapeType);
    }
    
    glitterPreviewCtx.globalAlpha = 1;
  }
  
  glitterPreviewAnimId = requestAnimationFrame(glitterPreviewLoop);
}

// Same shape drawing as main system but takes ctx parameter
function drawGlitterPreviewShape(ctx, x, y, size, shapeType) {
  const s = size | 0;
  if (shapeType === 'star' && s >= 3) {
    const half = s >> 1;
    const diagHalf = (s * 0.35) | 0;
    
    ctx.fillRect(x - half, y, s, 1);
    ctx.fillRect(x, y - half, 1, s);
    
    for (let d = 1; d <= diagHalf; d++) {
      ctx.fillRect(x + d, y + d, 1, 1);
      ctx.fillRect(x - d, y - d, 1, 1);
      ctx.fillRect(x + d, y - d, 1, 1);
      ctx.fillRect(x - d, y + d, 1, 1);
    }
  } else if (shapeType === 'cross' && s >= 2) {
    const half = s >> 1;
    ctx.fillRect(x - half, y, s, 1);
    ctx.fillRect(x, y - half, 1, s);
  } else {
    ctx.fillRect(x, y, s, s);
  }
}

function showHeadlineGenerator(container, selectedVibeWords) {
  const genContainer = document.createElement('div');
  genContainer.className = 'headline-generator';
  
  const preview = document.createElement('div');
  preview.className = 'headline-preview';
  
  const regenBtn = document.createElement('button');
  regenBtn.className = 'export-btn regen-btn';
  regenBtn.textContent = 'Regenerate';
  regenBtn.addEventListener('click', () => SoundManager.play('click'));
  
  const confirmBtn = document.createElement('button');
  confirmBtn.className = 'export-btn confirm-btn';
  confirmBtn.textContent = 'Confirm';
  confirmBtn.addEventListener('click', () => SoundManager.play('confirm'));
  
  function generateHeadline() {
    // Generate headline text based on selected vibes
    const text = generateHeadlineText(selectedVibeWords);
    
    // CLEAR all previous styles for true randomness!
    preview.style.cssText = '';
    preview.className = 'headline-preview';
    preview.textContent = text;
    
    // PIXEL ART STYLE TEXT - high contrast, hard shadows, blocky fonts
    const colors = [
      '#ffffff', '#000000', '#ff0000', '#00ff00', '#0000ff', 
      '#ffff00', '#ff00ff', '#00ffff', '#ff8800', '#ff1493', 
      '#00ff7f', '#ffa500', '#ff69b4', '#39ff14', '#fe019a'
    ];
    
    // PIXEL ART: Hard shadows only - no blur!
    const shadows = [
      // Simple offsets
      '2px 2px 0 #000',
      '3px 3px 0 #000',
      '4px 4px 0 #000',
      '2px 2px 0 #fff',
      '3px 3px 0 #fff',
      // Colored shadows
      `3px 3px 0 ${colors[Math.floor(Math.random() * colors.length)]}`,
      `4px 4px 0 ${colors[Math.floor(Math.random() * colors.length)]}`,
      // Outline effect (4-direction)
      '-2px 0 0 #000, 2px 0 0 #000, 0 -2px 0 #000, 0 2px 0 #000',
      '-2px 0 0 #fff, 2px 0 0 #fff, 0 -2px 0 #fff, 0 2px 0 #fff',
      // Double shadow / 3D depth
      '2px 2px 0 #fff, 4px 4px 0 #000',
      '2px 2px 0 #000, 4px 4px 0 #fff',
      '3px 3px 0 #000, 6px 6px 0 rgba(0,0,0,0.4)',
      // Thick outline + shadow
      '-1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000, 3px 3px 0 #000',
      // Neon-ish but hard
      `0 0 0 3px ${colors[Math.floor(Math.random() * colors.length)]}`,
      // No shadow
      'none'
    ];
    
    const transforms = [
      'uppercase',
      'uppercase',
      'uppercase',  // Favor uppercase for headlines
      'none',
      'capitalize'
    ];
    
    // PIXEL ART: Blocky fonts that look good pixelated
    const fontFamilies = [
      // Custom fonts
      'Jumps Winter, cursive',
      'Spicy Sale, display',
      'Start Story, cursive',
      'Super Chiby, display',
      'Super Crawler, display',
      // System blocky fonts
      'Impact, fantasy',
      'Arial Black, sans-serif',
      'Courier New, monospace',
      'Verdana, sans-serif',
      'Arial, sans-serif',
      'Comic Sans MS, cursive'
    ];
    
    preview.style.color = colors[Math.floor(Math.random() * colors.length)];
    preview.style.textShadow = shadows[Math.floor(Math.random() * shadows.length)];
    preview.style.fontWeight = 'bold'; // Always bold for headlines
    preview.style.fontStyle = 'normal'; // No italic for pixel style
    preview.style.textDecoration = 'none';
    preview.style.textTransform = transforms[Math.floor(Math.random() * transforms.length)];
    preview.style.letterSpacing = Math.random() > 0.4 ? (Math.floor(Math.random() * 5) + 1 + 'px') : '1px';
    preview.style.fontFamily = fontFamilies[Math.floor(Math.random() * fontFamilies.length)];
    
    // PIXEL ART: Hard stroke outlines (more common)
    if (Math.random() > 0.5) {
      const strokeColors = ['#000', '#fff', '#000', '#000'];
      preview.style.webkitTextStroke = `${Math.floor(Math.random() * 2) + 1}px ${strokeColors[Math.floor(Math.random() * strokeColors.length)]}`;
    }
    
    // Pixel art: Very rare rotation, keep it blocky
    if (Math.random() > 0.92) {
      preview.style.transform = `rotate(${Math.floor(Math.random() * 6 - 3)}deg)`;
    }
    
    // PIXEL ART backgrounds: solid colors or hard gradients
    if (Math.random() > 0.85) {
      const bgColor = colors[Math.floor(Math.random() * colors.length)];
      const bgType = Math.floor(Math.random() * 3);
      if (bgType === 0) {
        // Solid
        preview.style.background = bgColor;
      } else if (bgType === 1) {
        // Hard split
        preview.style.background = `linear-gradient(180deg, ${bgColor} 50%, ${colors[Math.floor(Math.random() * colors.length)]} 50%)`;
      } else {
        // Horizontal gradient
        preview.style.background = `linear-gradient(90deg, ${bgColor}, ${colors[Math.floor(Math.random() * colors.length)]})`;
      }
      preview.style.padding = '8px 16px';
      preview.style.border = Math.random() > 0.5 ? '3px solid #000' : '3px solid #fff';
      preview.style.boxShadow = '4px 4px 0 #000';
    }
    
    // RANDOMIZE EFFECTS (glitter, shadow, outline)
    const hasGlitter = Math.random() > 0.5;
    const hasEffectShadow = Math.random() > 0.5;
    const hasOutline = Math.random() > 0.5;
    
    // Apply visual preview of effects
    let filterParts = [];
    if (hasOutline) {
      filterParts.push(
        'drop-shadow(2px 0 0 #000)',
        'drop-shadow(-2px 0 0 #000)',
        'drop-shadow(0 2px 0 #000)',
        'drop-shadow(0 -2px 0 #000)'
      );
    }
    if (hasEffectShadow) {
      filterParts.push('drop-shadow(4px 4px 0 rgba(0,0,0,0.6))');
    }
    preview.style.filter = filterParts.length > 0 ? filterParts.join(' ') : '';
    
    // Handle glitter preview
    updateGlitterPreview(preview, hasGlitter);
    
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
    preview.dataset.headlineBorder = preview.style.border || 'none';
    preview.dataset.headlineBoxShadow = preview.style.boxShadow || 'none';
    // Store effects
    preview.dataset.hasGlitter = hasGlitter ? 'true' : 'false';
    preview.dataset.hasEffectShadow = hasEffectShadow ? 'true' : 'false';
    preview.dataset.hasOutline = hasOutline ? 'true' : 'false';
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
      preview.dataset.headlineBorderRadius,
      preview.dataset.headlineBorder,
      preview.dataset.headlineBoxShadow,
      preview.dataset.hasGlitter,
      preview.dataset.hasEffectShadow,
      preview.dataset.hasOutline
    );
    completeStep('3'); // Complete step 3
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

function spawnHeadline(text, color, shadow, weight, style, decoration, transform, letterSpacing, fontFamily, extraTransform, background, stroke, padding, borderRadius, border, boxShadow, hasGlitter, hasEffectShadow, hasOutline) {
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
  
  // Apply effects from generator
  wrapper.setAttribute('data-has-glitter', hasGlitter || 'false');
  wrapper.setAttribute('data-has-shadow', hasEffectShadow || 'false');
  wrapper.setAttribute('data-has-outline', hasOutline || 'false');
  
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
  if (border && border !== 'none') textEl.style.border = border;
  if (boxShadow && boxShadow !== 'none') textEl.style.boxShadow = boxShadow;
  
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
  
  // Apply visual effects
  updateElementEffects(wrapper);
  
  // Start glitter if enabled
  if (hasGlitter === 'true') {
    if (!elementGlitterData.has(wrapper)) {
      elementGlitterData.set(wrapper, {
        colors: getRandomGlitterColors(),
        settings: getRandomStickerSettings()
      });
    }
    addElementGlitterPixels(wrapper);
    if (typeof startGlitter === 'function' && !glitterAnimationId) {
      startGlitter();
    }
  }
  
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

// Base company name parts
const companyPrefixes = ['Next', 'Bright', 'Peak', 'Prime', 'Future', 'Smart', 'Pro', 'Meta', 'Quantum', 'Spark'];
const companyRoots = ['Vision', 'Wave', 'Flow', 'Pulse', 'Shift', 'Core', 'Force', 'Edge', 'Rise', 'Link'];
const companySuffixes = ['Labs', 'Tech', 'Systems', 'Group', 'Dynamics', 'Solutions', 'Works', 'Ventures', 'Studios', 'Co'];

// Hero category-specific company name parts
const categoryCompanyParts = {
  motor: {
    prefixes: ['Auto', 'Speed', 'Turbo', 'Drive', 'Motor', 'Road', 'Cruise', 'Velocity', 'Gear', 'Race'],
    roots: ['Drive', 'Wheels', 'Motion', 'Cruise', 'Torque', 'Gear', 'Track', 'Lane', 'Mile', 'Rev'],
    suffixes: ['Motors', 'Auto', 'Racing', 'Wheels', 'Drive', 'Automotive', 'Garage', 'Speed', 'Moto', 'Cars']
  },
  chemistry: {
    prefixes: ['Bio', 'Chem', 'Syn', 'Lab', 'React', 'Atom', 'Molecule', 'Formula', 'Nano', 'Helix'],
    roots: ['Chem', 'Lab', 'Synth', 'Fusion', 'Bond', 'Element', 'Catalyst', 'Compound', 'Cell', 'Gene'],
    suffixes: ['Labs', 'Pharma', 'Chem', 'Science', 'Research', 'Biotech', 'Scientific', 'Laboratory', 'Rx', 'Med']
  },
  defence: {
    prefixes: ['Shield', 'Guard', 'Fort', 'Armor', 'Secure', 'Iron', 'Steel', 'Titan', 'Valor', 'Alpha'],
    roots: ['Guard', 'Shield', 'Armor', 'Force', 'Strong', 'Fortress', 'Bastion', 'Sentinel', 'Legion', 'Vanguard'],
    suffixes: ['Defense', 'Security', 'Shield', 'Guard', 'Protection', 'Tactical', 'Arms', 'Force', 'Safe', 'Secure']
  },
  agriculture: {
    prefixes: ['Farm', 'Agri', 'Green', 'Terra', 'Harvest', 'Seed', 'Field', 'Crop', 'Meadow', 'Grove'],
    roots: ['Grow', 'Harvest', 'Field', 'Farm', 'Crop', 'Bloom', 'Root', 'Leaf', 'Grain', 'Soil'],
    suffixes: ['Farms', 'Agri', 'Harvest', 'Fields', 'Growers', 'Agricultural', 'Organic', 'Natural', 'Ranch', 'Gardens']
  },
  drinks: {
    prefixes: ['Fresh', 'Fizz', 'Brew', 'Pour', 'Chill', 'Refresh', 'Splash', 'Sip', 'Cool', 'Crisp'],
    roots: ['Fizz', 'Brew', 'Pour', 'Sip', 'Taste', 'Drink', 'Blend', 'Mix', 'Splash', 'Drop'],
    suffixes: ['Beverages', 'Drinks', 'Brewing', 'Refresh', 'Beverage', 'Sodas', 'Brews', 'Coolers', 'Spirits', 'Liquids']
  },
  other: {
    prefixes: ['Meta', 'Ultra', 'Cyber', 'Turbo', 'Star', 'Glow', 'Future', 'Dream', 'Spark', 'Luxe', 'Icon', 'Bold', 'Chic', 'Pop', 'Social', 'Viral', 'Digital', 'Universe', 'Leaf', 'Sun', 'Moon', 'Ocean', 'Sky', 'Forest', 'Earth', 'Wave', 'Bloom', 'Seed', 'Feather', 'Wing', 'Furry', 'Crunch', 'Cozy', 'Party', 'Beat', 'Dance', 'Pulse', 'Flow', 'Joy', 'Light', 'Shine', 'Heart', 'Smile', 'Lucky', 'Chill', 'Fun', 'Play', 'Happy', 'Fresh', 'Bold', 'Calm', 'Wild', 'Epic', 'Sweet'],
    roots: ['Flow', 'Wave', 'Pulse', 'Loop', 'Vibe', 'Mode', 'Trend', 'Core', 'Vision', 'Spark', 'Beat', 'Circuit', 'Style', 'Motion', 'Buzz', 'Pop', 'Nexus', 'Signal', 'Story', 'Rhythm', 'Fusion', 'Lab', 'Hack', 'Sync', 'Remix'],
    suffixes: ['Works', 'Hub', 'Studio', 'Space', 'Zone', 'Sphere', 'Collective', 'Factory', 'Machine', 'Systems', 'Network', 'Crew', 'Hive', 'Lab', 'Dynamics', 'Mode', 'Cloud', 'Joke', 'Nation', 'Inc', 'Tech', 'Solutions', 'Bääm', 'Wow']
  }
};

// Vibe-influenced company name parts
const vibeCompanyParts = {
  magic: {
    prefixes: ['Mystic', 'Wonder', 'Dream', 'Enchant', 'Stellar', 'Cosmic', 'Luna', 'Astral'],
    roots: ['Magic', 'Wonder', 'Dream', 'Star', 'Wish', 'Spark', 'Glow', 'Shine'],
    suffixes: ['Magic', 'Dreams', 'Wonder', 'Wonders', 'Enchanted', 'Mystical', 'Cosmic', 'Stellar']
  },
  festive: {
    prefixes: ['Joy', 'Cheer', 'Merry', 'Jubilee', 'Fest', 'Celebrate', 'Happy', 'Jolly'],
    roots: ['Joy', 'Cheer', 'Fest', 'Gala', 'Party', 'Jubilee', 'Merry', 'Celebrate'],
    suffixes: ['Celebrations', 'Festivities', 'Events', 'Joy', 'Party', 'Festive', 'Joyful', 'Cheer']
  },
  cozy: {
    prefixes: ['Comfort', 'Warm', 'Home', 'Heart', 'Cozy', 'Soft', 'Gentle', 'Sweet'],
    roots: ['Comfort', 'Warm', 'Home', 'Heart', 'Nest', 'Haven', 'Hearth', 'Snug'],
    suffixes: ['Home', 'Comfort', 'Living', 'Warmth', 'Cozy', 'Hearts', 'Homes', 'Nest']
  },
  bright: {
    prefixes: ['Bright', 'Shine', 'Glow', 'Radiant', 'Light', 'Brilliant', 'Solar', 'Dawn'],
    roots: ['Light', 'Shine', 'Glow', 'Bright', 'Ray', 'Beam', 'Lumen', 'Radiance'],
    suffixes: ['Light', 'Shine', 'Glow', 'Lighting', 'Bright', 'Radiant', 'Luminous', 'Solar']
  }
};

function getMergedCompanyParts() {
  // Start with base parts
  const merged = {
    prefixes: [...companyPrefixes],
    roots: [...companyRoots],
    suffixes: [...companySuffixes]
  };
  
  // Add hero category parts (with extra weight - add twice)
  if (currentHeroCategory && categoryCompanyParts[currentHeroCategory]) {
    const catParts = categoryCompanyParts[currentHeroCategory];
    merged.prefixes.push(...catParts.prefixes, ...catParts.prefixes);
    merged.roots.push(...catParts.roots, ...catParts.roots);
    merged.suffixes.push(...catParts.suffixes, ...catParts.suffixes);
  }
  
  // Add vibe parts if vibes have been selected
  if (selectedHeadlineVibes.length > 0) {
    const vibes = getVibesFromSelection(selectedHeadlineVibes);
    vibes.forEach(vibe => {
      if (vibeCompanyParts[vibe]) {
        const vibeParts = vibeCompanyParts[vibe];
        merged.prefixes.push(...vibeParts.prefixes);
        merged.roots.push(...vibeParts.roots);
        merged.suffixes.push(...vibeParts.suffixes);
      }
    });
  }
  
  return merged;
}

function buildCompanyNameUI(container) {
  // Create a wrapper that fills the space (same structure as headline generator)
  const wrapper = document.createElement('div');
  wrapper.style.height = '100%';
  wrapper.style.width = '100%';
  wrapper.style.position = 'relative';
  wrapper.addEventListener('click', (e) => {
    e.stopPropagation();
  });
  
  const genContainer = document.createElement('div');
  genContainer.className = 'company-generator';
  
  const preview = document.createElement('div');
  preview.className = 'company-preview';
  
  const regenBtn = document.createElement('button');
  regenBtn.className = 'export-btn regen-btn';
  regenBtn.textContent = 'Regenerate';
  regenBtn.addEventListener('click', () => SoundManager.play('click'));
  
  const regenNameBtn = document.createElement('button');
  regenNameBtn.className = 'export-btn regen-btn';
  regenNameBtn.textContent = 'Regenerate Name';
  regenNameBtn.addEventListener('click', () => SoundManager.play('click'));
  
  const regenStyleBtn = document.createElement('button');
  regenStyleBtn.className = 'export-btn regen-btn';
  regenStyleBtn.textContent = 'Regenerate Style';
  regenStyleBtn.addEventListener('click', () => SoundManager.play('click'));
  
  const confirmBtn = document.createElement('button');
  confirmBtn.className = 'export-btn confirm-btn';
  confirmBtn.textContent = 'Confirm';
  confirmBtn.addEventListener('click', () => SoundManager.play('confirm'));
  
  function generateName() {
    const parts = getMergedCompanyParts();
    
    const prefix = parts.prefixes[Math.floor(Math.random() * parts.prefixes.length)];
    const root = parts.roots[Math.floor(Math.random() * parts.roots.length)];
    const suffix = parts.suffixes[Math.floor(Math.random() * parts.suffixes.length)];
    
    // Randomly choose format: "Prefix+Root", "Root+Suffix", or "Prefix+Root+Suffix", or just "PrefixSuffix"
    const format = Math.floor(Math.random() * 4);
    let name;
    if (format === 0) name = prefix + root;
    else if (format === 1) name = root + suffix;
    else if (format === 2) name = prefix + root + ' ' + suffix;
    else name = prefix + ' ' + suffix;
    
    preview.textContent = name;
    preview.dataset.companyName = name;
  }
  
  function generateStyle() {
    // CLEAR all previous styles for true randomness!
    preview.style.cssText = '';
    preview.className = 'company-preview';
    preview.textContent = preview.dataset.companyName; // Restore text
    
    // PIXEL ART STYLE TEXT - high contrast, hard shadows, blocky fonts
    const colors = [
      '#ffffff', '#000000', '#ff0000', '#00ff00', '#0000ff', 
      '#ffff00', '#ff00ff', '#00ffff', '#ff8800', '#ff1493', 
      '#00ff7f', '#ffa500', '#ff69b4', '#39ff14', '#8800ff'
    ];
    
    // PIXEL ART: Hard shadows only - no blur!
    const shadows = [
      // Simple offsets
      '2px 2px 0 #000',
      '3px 3px 0 #000',
      '4px 4px 0 #000',
      '2px 2px 0 #fff',
      '3px 3px 0 #fff',
      // Colored shadows
      `3px 3px 0 ${colors[Math.floor(Math.random() * colors.length)]}`,
      `4px 4px 0 ${colors[Math.floor(Math.random() * colors.length)]}`,
      // Outline effect (4-direction)
      '-2px 0 0 #000, 2px 0 0 #000, 0 -2px 0 #000, 0 2px 0 #000',
      '-2px 0 0 #fff, 2px 0 0 #fff, 0 -2px 0 #fff, 0 2px 0 #fff',
      '-1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000',
      // Double shadow / 3D depth
      '2px 2px 0 #fff, 4px 4px 0 #000',
      '2px 2px 0 #000, 4px 4px 0 #fff',
      '3px 3px 0 #000, 6px 6px 0 rgba(0,0,0,0.4)',
      // Thick 3D
      '1px 1px 0 #000, 2px 2px 0 #000, 3px 3px 0 #000',
      // No shadow
      'none'
    ];
    
    // PIXEL ART: Blocky fonts
    const fontFamilies = [
      // Custom fonts
      'Jumps Winter, cursive',
      'Spicy Sale, display',
      'Start Story, cursive',
      'Super Chiby, display',
      'Super Crawler, display',
      // System blocky fonts
      'Impact, fantasy',
      'Arial Black, sans-serif',
      'Courier New, monospace',
      'Verdana, sans-serif',
      'Arial, sans-serif',
      'Comic Sans MS, cursive'
    ];
    
    const textTransforms = [
      'uppercase',
      'uppercase',
      'none',
      'capitalize'
    ];
    
    preview.style.color = colors[Math.floor(Math.random() * colors.length)];
    preview.style.textShadow = shadows[Math.floor(Math.random() * shadows.length)];
    preview.style.fontWeight = 'bold'; // Always bold for company names
    preview.style.fontStyle = 'normal'; // No italic for pixel style
    preview.style.textTransform = textTransforms[Math.floor(Math.random() * textTransforms.length)];
    preview.style.letterSpacing = Math.random() > 0.4 ? (Math.floor(Math.random() * 6) + 1 + 'px') : '2px';
    preview.style.fontFamily = fontFamilies[Math.floor(Math.random() * fontFamilies.length)];
    
    // PIXEL ART: Hard stroke outlines (more common)
    if (Math.random() > 0.5) {
      const strokeColors = ['#000', '#fff', '#000', '#000'];
      preview.style.webkitTextStroke = `${Math.floor(Math.random() * 2) + 1}px ${strokeColors[Math.floor(Math.random() * strokeColors.length)]}`;
    }
    
    // Pixel art: Very rare rotation
    if (Math.random() > 0.92) {
      preview.style.transform = `rotate(${Math.floor(Math.random() * 6 - 3)}deg)`;
    }
    
    // PIXEL ART backgrounds: solid colors or hard gradients (rare)
    if (Math.random() > 0.88) {
      const bgColor = colors[Math.floor(Math.random() * colors.length)];
      const bgType = Math.floor(Math.random() * 3);
      if (bgType === 0) {
        preview.style.background = bgColor;
      } else if (bgType === 1) {
        preview.style.background = `linear-gradient(180deg, ${bgColor} 50%, ${colors[Math.floor(Math.random() * colors.length)]} 50%)`;
      } else {
        preview.style.background = `linear-gradient(90deg, ${bgColor}, ${colors[Math.floor(Math.random() * colors.length)]})`;
      }
      preview.style.padding = '6px 14px';
      preview.style.border = Math.random() > 0.5 ? '3px solid #000' : '3px solid #fff';
      preview.style.boxShadow = '3px 3px 0 #000';
    }
    
    // RANDOMIZE EFFECTS (glitter, shadow, outline)
    const hasGlitter = Math.random() > 0.5;
    const hasEffectShadow = Math.random() > 0.5;
    const hasOutline = Math.random() > 0.5;
    
    // Apply visual preview of effects
    let filterParts = [];
    if (hasOutline) {
      filterParts.push(
        'drop-shadow(2px 0 0 #000)',
        'drop-shadow(-2px 0 0 #000)',
        'drop-shadow(0 2px 0 #000)',
        'drop-shadow(0 -2px 0 #000)'
      );
    }
    if (hasEffectShadow) {
      filterParts.push('drop-shadow(4px 4px 0 rgba(0,0,0,0.6))');
    }
    preview.style.filter = filterParts.length > 0 ? filterParts.join(' ') : '';
    
    // Handle glitter preview
    updateGlitterPreview(preview, hasGlitter);
    
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
    preview.dataset.companyBorder = preview.style.border || 'none';
    preview.dataset.companyBoxShadow = preview.style.boxShadow || 'none';
    // Store effects
    preview.dataset.hasGlitter = hasGlitter ? 'true' : 'false';
    preview.dataset.hasEffectShadow = hasEffectShadow ? 'true' : 'false';
    preview.dataset.hasOutline = hasOutline ? 'true' : 'false';
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
      preview.dataset.companyBorderRadius,
      preview.dataset.companyBorder,
      preview.dataset.companyBoxShadow,
      preview.dataset.hasGlitter,
      preview.dataset.hasEffectShadow,
      preview.dataset.hasOutline
    );
    completeStep('5'); // Complete step 5
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
  wrapper.appendChild(genContainer);
  container.appendChild(wrapper);
  
  // Generate initial name and style
  regenerateAll();
}

function spawnCompanyName(text, color, shadow, weight, style, transform, spacing, fontFamily, extraTransform, stroke, decoration, background, padding, borderRadius, border, boxShadow, hasGlitter, hasEffectShadow, hasOutline) {
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
  
  // Apply effects from generator
  wrapper.setAttribute('data-has-glitter', hasGlitter || 'false');
  wrapper.setAttribute('data-has-shadow', hasEffectShadow || 'false');
  wrapper.setAttribute('data-has-outline', hasOutline || 'false');
  
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
  if (border && border !== 'none') textEl.style.border = border;
  if (boxShadow && boxShadow !== 'none') textEl.style.boxShadow = boxShadow;
  
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
  
  // Apply visual effects
  updateElementEffects(wrapper);
  
  // Start glitter if enabled
  if (hasGlitter === 'true') {
    if (!elementGlitterData.has(wrapper)) {
      elementGlitterData.set(wrapper, {
        colors: getRandomGlitterColors(),
        settings: getRandomStickerSettings()
      });
    }
    addElementGlitterPixels(wrapper);
    if (typeof startGlitter === 'function' && !glitterAnimationId) {
      startGlitter();
    }
  }
  
  deselectAll();
  wrapper.classList.add('selected');
  
  currentCompanyName = wrapper;
}

//------------------------------------------------------
// CTA BUTTON MANAGEMENT
//------------------------------------------------------
let currentCTAButton = null; // Track the current CTA button

const ctaVerbs = ['Get', 'Learn', 'Start', 'Discover', 'Join', 'Try', 'Unlock', 'Explore', 'Claim', 'Grab', 'Boost', 'Create', 'Build', 'Play', 'Design', 'Activate', 'Unleash', 'Reveal', 'Craft', 'Experience', 'Dive', 'Check', 'Hit', 'Go', 'Launch'];
const ctaActions = ['Started', 'More', 'Now', 'Today', 'Free', 'Yours', 'Here', 'It', 'This', 'Access', 'Instantly', 'Your Way', 'Fast', 'Ahead', 'Online', 'Directly', 'Magic', 'Effect', 'Now!', 'Quick', 'Here & Now', 'Today Only', 'Live', 'Freebie', 'Fun'];

function buildCTAButtonUI(container) {
  const genContainer = document.createElement('div');
  genContainer.className = 'cta-generator';
  
  const preview = document.createElement('div');
  preview.className = 'cta-preview';
  
  const regenBtn = document.createElement('button');
  regenBtn.className = 'export-btn regen-btn';
  regenBtn.textContent = 'Regenerate';
  regenBtn.addEventListener('click', () => SoundManager.play('click'));
  
  const regenTextBtn = document.createElement('button');
  regenTextBtn.className = 'export-btn regen-btn';
  regenTextBtn.textContent = 'Regenerate Text';
  regenTextBtn.addEventListener('click', () => SoundManager.play('click'));
  
  const regenTextStyleBtn = document.createElement('button');
  regenTextStyleBtn.className = 'export-btn regen-btn';
  regenTextStyleBtn.textContent = 'Regenerate Text Style';
  regenTextStyleBtn.addEventListener('click', () => SoundManager.play('click'));
  
  const regenButtonStyleBtn = document.createElement('button');
  regenButtonStyleBtn.className = 'export-btn regen-btn';
  regenButtonStyleBtn.textContent = 'Regenerate Button Style';
  regenButtonStyleBtn.addEventListener('click', () => SoundManager.play('click'));
  
  const confirmBtn = document.createElement('button');
  confirmBtn.className = 'export-btn confirm-btn';
  confirmBtn.textContent = 'Confirm';
  confirmBtn.addEventListener('click', () => SoundManager.play('confirm'));
  
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
    
    // PIXEL ART: High contrast colors
    const textColors = ['#ffffff', '#000000', '#ffff00', '#00ff00', '#ff0000', '#00ffff', '#ff00ff', '#ff8800'];
    
    // PIXEL ART: Hard shadows only, no blur - offset by whole pixels!
    const shadows = [
      '2px 2px 0 #000',
      '1px 1px 0 #000',
      '2px 2px 0 #000, 4px 4px 0 rgba(0,0,0,0.3)',
      '-1px -1px 0 #000, 1px 1px 0 #000, -1px 1px 0 #000, 1px -1px 0 #000', // Outline effect
      '-2px 0 0 #000, 2px 0 0 #000, 0 -2px 0 #000, 0 2px 0 #000', // Cross outline
      '1px 1px 0 #fff',
      '2px 2px 0 #fff',
      '1px 1px 0 #000, 2px 2px 0 #fff', // Double shadow
      'none',
    ];
    
    // PIXEL ART: Blocky, bold fonts that look good at any size
    const fontFamilies = [
      'Impact, fantasy',
      'Arial Black, sans-serif',
      'Courier New, monospace',  // Monospace = pixely
      '"Press Start 2P", monospace', // Actual pixel font (if available)
      'Verdana, sans-serif',
      'Jumps Winter, cursive',
      'Spicy Sale, display',
      'Super Chiby, display',
      'Super Crawler, display',
      'Arial, sans-serif',
    ];
    
    preview.style.color = textColors[Math.floor(Math.random() * textColors.length)];
    preview.style.textShadow = shadows[Math.floor(Math.random() * shadows.length)];
    preview.style.fontWeight = 'bold'; // Always bold for CTA buttons
    preview.style.fontStyle = 'normal'; // No italic for pixel style
    preview.style.textTransform = Math.random() > 0.2 ? 'uppercase' : 'none'; // Usually uppercase (80%)
    preview.style.fontFamily = fontFamilies[Math.floor(Math.random() * fontFamilies.length)];
    preview.style.letterSpacing = Math.random() > 0.5 ? (Math.floor(Math.random() * 3) + 1 + 'px') : '1px'; // Slightly spaced
    
    // PIXEL ART: Hard stroke outlines (more common)
    if (Math.random() > 0.5) {
      const strokeColors = ['#000', '#fff', '#000', '#000']; // Favor black outlines
      preview.style.webkitTextStroke = `1px ${strokeColors[Math.floor(Math.random() * strokeColors.length)]}`;
    }
    
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
    
    // PIXEL ART STYLE BUTTONS - Y2K / Web 1.0 / Retro Game aesthetic
    const bgColors = ['#ff0000', '#00ff00', '#0000ff', '#ff8800', '#8800ff', '#00ffff', '#ff00ff', '#ff1493', '#ffa500', '#00ff7f', '#ffff00', '#ff69b4', '#39ff14', '#ff073a'];
    
    // Pick main color for this button
    const mainColor = bgColors[Math.floor(Math.random() * bgColors.length)];
    const secondColor = bgColors[Math.floor(Math.random() * bgColors.length)];
    const thirdColor = bgColors[Math.floor(Math.random() * bgColors.length)];
    
    // Button style types (for consistent pixel looks)
    const styleType = Math.floor(Math.random() * 24);
    
    let bg, borderRadius, border, boxShadow;
    
    switch(styleType) {
      case 0: // Classic Windows 95/98 3D button
        bg = '#c0c0c0';
        borderRadius = '0px';
        border = '3px outset #fff';
        boxShadow = 'inset -2px -2px 0 #808080, inset 2px 2px 0 #fff';
        break;
        
      case 1: // Flat pixel button with hard shadow
        bg = mainColor;
        borderRadius = '0px';
        border = '3px solid #000';
        boxShadow = '4px 4px 0 #000';
        break;
        
      case 2: // Neon glow pixel (Y2K style)
        bg = '#000';
        borderRadius = '0px';
        border = `3px solid ${mainColor}`;
        boxShadow = `0 0 0 2px #000, 4px 4px 0 ${mainColor}`;
        break;
        
      case 3: // Double border retro
        bg = mainColor;
        borderRadius = '0px';
        border = '4px double #fff';
        boxShadow = '3px 3px 0 #000';
        break;
        
      case 4: // Beveled 3D colored
        bg = `linear-gradient(180deg, ${mainColor} 0%, ${mainColor} 45%, rgba(0,0,0,0.3) 100%)`;
        borderRadius = '0px';
        border = '2px solid #000';
        boxShadow = 'inset -2px -2px 0 rgba(0,0,0,0.5), inset 2px 2px 0 rgba(255,255,255,0.5), 3px 3px 0 #000';
        break;
        
      case 5: // Chunky white border (arcade style)
        bg = mainColor;
        borderRadius = '0px';
        border = '5px solid #fff';
        boxShadow = '0 0 0 3px #000, 5px 5px 0 #000';
        break;
        
      case 6: // Two-tone split (old web button)
        bg = `linear-gradient(180deg, ${mainColor} 50%, ${secondColor} 50%)`;
        borderRadius = '0px';
        border = '3px solid #000';
        boxShadow = '4px 4px 0 rgba(0,0,0,0.6)';
        break;
        
      case 7: // Inset pixel button (pressed look)
        bg = mainColor;
        borderRadius = '0px';
        border = '3px inset #000';
        boxShadow = 'inset 3px 3px 0 rgba(0,0,0,0.4)';
        break;
        
      case 8: // Pixel pill/oval - stepped radius
        bg = mainColor;
        borderRadius = '20px'; // Pill shape
        border = '3px solid #000';
        boxShadow = '4px 4px 0 #000';
        break;
        
      case 9: // Pixel capsule with white border
        bg = mainColor;
        borderRadius = '25px';
        border = '4px solid #fff';
        boxShadow = '0 0 0 2px #000, 4px 4px 0 #000';
        break;
        
      case 10: // Neon pill (Y2K capsule)
        bg = '#000';
        borderRadius = '30px';
        border = `3px solid ${mainColor}`;
        boxShadow = `4px 4px 0 ${mainColor}`;
        break;
        
      case 11: // Rainbow gradient bar
        bg = `linear-gradient(90deg, ${mainColor}, ${secondColor}, ${thirdColor})`;
        borderRadius = '0px';
        border = '3px solid #000';
        boxShadow = '4px 4px 0 #000';
        break;
        
      case 12: // Dotted border retro
        bg = mainColor;
        borderRadius = '0px';
        border = '4px dotted #000';
        boxShadow = '3px 3px 0 rgba(0,0,0,0.5)';
        break;
        
      case 13: // Dashed border web 1.0
        bg = mainColor;
        borderRadius = '0px';
        border = '3px dashed #fff';
        boxShadow = '0 0 0 2px #000, 4px 4px 0 #000';
        break;
        
      case 14: // Stacked shadows (3D depth)
        bg = mainColor;
        borderRadius = '0px';
        border = '2px solid #000';
        boxShadow = '2px 2px 0 #fff, 4px 4px 0 #000, 6px 6px 0 rgba(0,0,0,0.3)';
        break;
        
      case 15: // Oval with inset bevel
        bg = `linear-gradient(180deg, rgba(255,255,255,0.3) 0%, transparent 50%, rgba(0,0,0,0.3) 100%), ${mainColor}`;
        borderRadius = '50px';
        border = '3px solid #000';
        boxShadow = 'inset -2px -2px 0 rgba(0,0,0,0.4), inset 2px 2px 0 rgba(255,255,255,0.4), 4px 4px 0 #000';
        break;
        
      case 16: // Thick cartoon shadow
        bg = mainColor;
        borderRadius = '0px';
        border = '4px solid #000';
        boxShadow = '6px 6px 0 #000';
        break;
        
      case 17: // DOS terminal style
        bg = '#000';
        borderRadius = '0px';
        border = '2px solid #0f0';
        boxShadow = 'inset 0 0 0 1px #0f0, 3px 3px 0 #0f0';
        break;
        
      case 18: // Pill with colored shadow
        bg = mainColor;
        borderRadius = '50px';
        border = '3px solid #000';
        boxShadow = `5px 5px 0 ${secondColor}`;
        break;
        
      case 19: // Double pill border
        bg = mainColor;
        borderRadius = '50px';
        border = '4px double #fff';
        boxShadow = '0 0 0 3px #000, 4px 4px 0 #000';
        break;
        
      case 20: // Stamped/embossed
        bg = mainColor;
        borderRadius = '4px';
        border = '3px solid #000';
        boxShadow = 'inset -3px -3px 0 rgba(0,0,0,0.3), inset 3px 3px 0 rgba(255,255,255,0.3), 4px 4px 0 #000';
        break;
        
      case 21: // Chunky rounded Mac style
        bg = `linear-gradient(180deg, rgba(255,255,255,0.4) 0%, transparent 50%, rgba(0,0,0,0.2) 100%), ${mainColor}`;
        borderRadius = '12px';
        border = '3px solid #000';
        boxShadow = '3px 3px 0 #000, inset 0 2px 0 rgba(255,255,255,0.5)';
        break;
        
      case 22: // Glossy gel button (2000s web)
        bg = `linear-gradient(180deg, rgba(255,255,255,0.6) 0%, rgba(255,255,255,0.1) 50%, transparent 51%, rgba(0,0,0,0.1) 100%), ${mainColor}`;
        borderRadius = '8px';
        border = '2px solid rgba(0,0,0,0.5)';
        boxShadow = '3px 3px 0 rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.8)';
        break;
        
      case 23: // Oval neon double glow
        bg = '#111';
        borderRadius = '40px';
        border = `4px solid ${mainColor}`;
        boxShadow = `0 0 0 2px ${secondColor}, 5px 5px 0 ${mainColor}`;
        break;
        
      default: // Fallback: simple flat pixel
        bg = mainColor;
        borderRadius = '0px';
        border = '2px solid #000';
        boxShadow = '3px 3px 0 #000';
    }
    
    preview.style.background = bg;
    preview.style.borderRadius = borderRadius;
    preview.style.border = border;
    preview.style.boxShadow = boxShadow;
    
    // Pixel art: Almost no rotation - keep it blocky!
    let transform = 'none';
    if (Math.random() > 0.95) transform = `rotate(${Math.floor(Math.random() * 4 - 2)}deg)`; // Very rare, very subtle
    preview.style.transform = transform;
    
    // NO effects for CTA buttons by default (no glitter, shadow, outline)
    const hasGlitter = false;
    const hasEffectShadow = false;
    const hasOutline = false;
    
    // Clear any filters
    preview.style.filter = '';
    
    // Clear glitter preview
    updateGlitterPreview(preview, false);
    
    preview.dataset.ctaBg = bg;
    preview.dataset.ctaBorderRadius = borderRadius;
    preview.dataset.ctaBorder = border;
    preview.dataset.ctaBoxShadow = boxShadow;
    preview.dataset.ctaTransform = transform;
    // Store effects (all false for CTA)
    preview.dataset.hasGlitter = 'false';
    preview.dataset.hasEffectShadow = 'false';
    preview.dataset.hasOutline = 'false';
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
      preview.dataset.ctaTransform,
      preview.dataset.hasGlitter,
      preview.dataset.hasEffectShadow,
      preview.dataset.hasOutline
    );
    completeStep('6'); // Complete step 6
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

function spawnCTAButton(text, textColor, textShadow, textWeight, textStyle, textTransform, textFontFamily, textLetterSpacing, textStroke, textDecoration, bg, borderRadius, border, boxShadow, buttonTransform, hasGlitter, hasEffectShadow, hasOutline) {
  const stage = document.getElementById('stage');
  
  // Remove existing CTA button if any
  if (currentCTAButton) {
    currentCTAButton.remove();
    // Clear bounce timers
    if (window.ctaBounceInterval) clearInterval(window.ctaBounceInterval);
    if (window.ctaBounceTimeout) clearTimeout(window.ctaBounceTimeout);
  }
  
  // Create CTA button element
  const wrapper = document.createElement('div');
  wrapper.classList.add('sticker-wrapper', 'cta-layer');
  wrapper.setAttribute('data-is-cta', 'true');
  wrapper.scale = 1;
  wrapper.angle = 0;
  
  // Apply effects from generator
  wrapper.setAttribute('data-has-glitter', hasGlitter || 'false');
  wrapper.setAttribute('data-has-shadow', hasEffectShadow || 'false');
  wrapper.setAttribute('data-has-outline', hasOutline || 'false');
  
  // Bounce wrapper - only handles the bounce animation
  const bounceWrapper = document.createElement('div');
  bounceWrapper.className = 'cta-bounce';
  
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
  
  bounceWrapper.appendChild(buttonEl);
  wrapper.appendChild(bounceWrapper);
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
  
  // Apply visual effects
  updateElementEffects(wrapper);
  
  // Start glitter if enabled
  if (hasGlitter === 'true') {
    if (!elementGlitterData.has(wrapper)) {
      elementGlitterData.set(wrapper, {
        colors: getRandomGlitterColors(),
        settings: getRandomStickerSettings()
      });
    }
    addElementGlitterPixels(wrapper);
    if (typeof startGlitter === 'function' && !glitterAnimationId) {
      startGlitter();
    }
  }
  
  deselectAll();
  wrapper.classList.add('selected');
  
  currentCTAButton = wrapper;
  
  // BOUNCE ANIMATION - stepped/choppy pixel style
  // Clear any existing bounce interval
  if (window.ctaBounceInterval) {
    clearInterval(window.ctaBounceInterval);
  }
  if (window.ctaBounceTimeout) {
    clearTimeout(window.ctaBounceTimeout);
  }
  
  function doBounce() {
    if (!buttonEl || !buttonEl.isConnected) {
      // CTA was removed, stop bouncing
      if (window.ctaBounceInterval) clearInterval(window.ctaBounceInterval);
      return;
    }
    buttonEl.classList.remove('bouncing');
    // Force reflow to restart animation
    void buttonEl.offsetWidth;
    buttonEl.classList.add('bouncing');
    // Remove class after animation completes
    setTimeout(() => buttonEl.classList.remove('bouncing'), 2050);
  }
  
  // First bounce after 1 second
  window.ctaBounceTimeout = setTimeout(() => {
    doBounce();
    // Then bounce every 10 seconds
    window.ctaBounceInterval = setInterval(doBounce, 10000);
  }, 1000);
}

//------------------------------------------------------
// MOBILE FULLSCREEN PROMPT (YouTube-style)
//------------------------------------------------------
let mobileFullscreenActive = false;

function showMobileFullscreenPrompt() {
  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  
  // Only show on mobile and when not already in fullscreen
  if (!isMobile || document.fullscreenElement || mobileFullscreenActive) {
    hideMobileFullscreenPrompt();
    return;
  }
  
  // Don't show if export screen is visible
  const exportingScreen = document.getElementById('exporting-screen');
  if (exportingScreen && !exportingScreen.classList.contains('hidden')) {
    return;
  }
  
  let prompt = document.getElementById('mobile-fullscreen-prompt');
  if (!prompt) {
    prompt = document.createElement('div');
    prompt.id = 'mobile-fullscreen-prompt';
    prompt.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.95);
      color: #fff;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;
      z-index: 9999999;
      font-family: 'home_videoregular', sans-serif;
      cursor: pointer;
      image-rendering: pixelated;
      padding: 20px;
      box-sizing: border-box;
    `;
    prompt.innerHTML = `
      <div style="
        border: 3px solid #3013a9;
        background: #1a1a2e;
        padding: 24px 28px;
        text-align: center;
        max-width: 85%;
        width: 280px;
      ">
        <div style="font-size: 40px; margin-bottom: 12px; animation: pulse 1.5s ease-in-out infinite;">⛶</div>
        <div style="font-size: 14px; color: #fff; margin-bottom: 6px;">TAP TO ENTER</div>
        <div style="font-size: 18px; color: #5a3fd9; margin-bottom: 12px;">FULLSCREEN</div>
        <div style="font-size: 10px; color: #888;">Best experience in landscape mode</div>
      </div>
      <style>
        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.1); opacity: 0.8; }
        }
      </style>
    `;
    
    prompt.addEventListener('click', async () => {
      try {
        // Enter fullscreen
        const fsHost = document.getElementById('root');
        await fsHost.requestFullscreen({ navigationUI: 'hide' });
        
        // Try to lock orientation to landscape
        if (screen.orientation && screen.orientation.lock) {
          try {
            await screen.orientation.lock('landscape');
          } catch (e) {
            // Orientation lock not supported or denied, that's okay
            console.log('Orientation lock not available:', e.message);
          }
        }
        
        mobileFullscreenActive = true;
        hideMobileFullscreenPrompt();
        SoundManager.play('confirm');
        
        // Start loading screen and video after entering fullscreen
        if (typeof startMobileLoading === 'function') {
          startMobileLoading();
        }
      } catch (e) {
        console.error('Fullscreen error:', e);
      }
    });
    
    // Append to #root so it's visible in fullscreen mode
    const root = document.getElementById('root');
    if (root) {
      root.appendChild(prompt);
    } else {
      document.body.appendChild(prompt);
    }
  }
  
  prompt.style.display = 'flex';
}

function hideMobileFullscreenPrompt() {
  const prompt = document.getElementById('mobile-fullscreen-prompt');
  if (prompt) {
    prompt.style.display = 'none';
  }
}

// Show prompt on load for mobile
showMobileFullscreenPrompt();


//------------------------------------------------------
// SELECTION MANAGEMENT
//------------------------------------------------------
function deselectAll() {
    document.querySelectorAll(".sticker-wrapper.selected")
        .forEach(w => w.classList.remove("selected"));
}

document.addEventListener("pointerdown", e => {
    // Don't deselect if clicking on delete button, element bar, or sticker bar sources
    if (!e.target.closest(".sticker-wrapper") && 
        !e.target.closest("#sticker-bar-delete-area") &&
        !e.target.closest("#element-bar-title-area") &&
        !e.target.closest(".sticker-src") &&
        !e.target.closest("#sticker-bar")) {
        deselectAll();
    }
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
        // Heroes have no effects
        wrapper.setAttribute('data-has-glitter', 'false');
        wrapper.setAttribute('data-has-shadow', 'false');
        wrapper.setAttribute('data-has-outline', 'false');
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
    
    // Stickers always have glitter (not heroes)
    if (!isHero) {
      // Add glitter data for the new sticker
      const stickerIndex = document.querySelectorAll('.sticker-wrapper:not([data-is-hero]):not([data-is-headline]):not(.headline-layer):not(.company-layer):not(.cta-layer)').length - 1;
      if (typeof stickerGlitterData !== 'undefined') {
        stickerGlitterData.set(stickerIndex, {
          colors: getRandomGlitterColors(),
          settings: getRandomStickerSettings()
        });
      }
      if (typeof regenerateGlitterPixels === 'function') {
        regenerateGlitterPixels();
      }
      // Make sure animation loop is running
      if (typeof startGlitter === 'function' && !glitterAnimationId) {
        startGlitter();
      }
    }

    return wrapper;
}

function applyTransform(el) {
    const x = parseFloat(el.getAttribute("data-x")) || 0;
    const y = parseFloat(el.getAttribute("data-y")) || 0;
    el.style.transform = `translate(${x}px, ${y}px) scale(${el.scale}) rotate(${el.angle}deg)`;
}

// Sticker limit constants and functions
const MAX_STICKERS = 10;

function getStickerCount() {
  const stage = document.getElementById('stage');
  // Count only regular stickers, not heroes or headlines or other layers
  return stage.querySelectorAll('.sticker-wrapper:not([data-is-hero]):not([data-is-headline]):not(.headline-layer):not(.company-layer):not(.cta-layer)').length;
}

function showStickerLimitMessage() {
  SoundManager.play('clickDenied'); // Play denied sound
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


//------------------------------------------------------
// CLICK-TO-SPAWN STICKERS
//------------------------------------------------------
// Simple click to spawn - no drag detection needed
// Track touch for scroll detection
let stickerTouchStartX = 0;
let stickerTouchStartY = 0;
let stickerIsScrolling = false;
const SCROLL_THRESHOLD = 10; // pixels of movement to count as scroll

document.querySelectorAll('.sticker-src').forEach(stickerSrc => {
  // Click to spawn
  stickerSrc.addEventListener('click', () => {
    // Check sticker limit
    if (getStickerCount() >= MAX_STICKERS) {
      showStickerLimitMessage();
      return;
    }
    
    // Spawn sticker at random position on stage
    const stageWidth = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--stage-w'));
    const stageHeight = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--stage-h'));
    
    const stickerSize = 150;
    const randomX = Math.random() * (stageWidth - stickerSize);
    const randomY = Math.random() * (stageHeight - stickerSize);
    
    SoundManager.play('drop');
    createStickerAt(stickerSrc.src, randomX, randomY);
  });
  
  // Touch support for mobile - with scroll detection
  stickerSrc.addEventListener('touchstart', (event) => {
    const touch = event.touches[0];
    stickerTouchStartX = touch.clientX;
    stickerTouchStartY = touch.clientY;
    stickerIsScrolling = false;
  }, { passive: true });
  
  stickerSrc.addEventListener('touchmove', (event) => {
    if (stickerIsScrolling) return;
    
    const touch = event.touches[0];
    const deltaX = Math.abs(touch.clientX - stickerTouchStartX);
    const deltaY = Math.abs(touch.clientY - stickerTouchStartY);
    
    // If moved more than threshold, it's a scroll
    if (deltaX > SCROLL_THRESHOLD || deltaY > SCROLL_THRESHOLD) {
      stickerIsScrolling = true;
    }
  }, { passive: true });
  
  stickerSrc.addEventListener('touchend', (event) => {
    // If user was scrolling, don't spawn sticker
    if (stickerIsScrolling) {
      stickerIsScrolling = false;
      return;
    }
    
    event.preventDefault(); // Prevent click from also firing
    
    // Check sticker limit
    if (getStickerCount() >= MAX_STICKERS) {
      showStickerLimitMessage();
      return;
    }
    
    // Spawn at random position
    const stageWidth = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--stage-w'));
    const stageHeight = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--stage-h'));
    
    const stickerSize = 150;
    const randomX = Math.random() * (stageWidth - stickerSize);
    const randomY = Math.random() * (stageHeight - stickerSize);
    
    SoundManager.play('drop');
    createStickerAt(stickerSrc.src, randomX, randomY);
  });
});


//------------------------------------------------------
// DELETE BUTTON & EFFECT TABS VISIBILITY MANAGEMENT
//------------------------------------------------------
function updateDeleteButtonVisibility() {
  // Sticker bar elements
  const stickerDeleteArea = document.getElementById('sticker-bar-delete-area');
  const stickerTitleArea = document.getElementById('sticker-bar-title-area');
  
  // Element bar elements (for hero/headline/company/cta) - NO delete button
  const elementTitleArea = document.getElementById('element-bar-title-area');
  const elementTitle = document.getElementById('element-bar-title');
  
  if (!stickerDeleteArea) return; // Not loaded yet
  
  const selectedWrapper = document.querySelector('.sticker-wrapper.selected');
  
  // Check what type of element is selected
  const isHero = selectedWrapper && (selectedWrapper.hasAttribute('data-is-hero') || selectedWrapper.classList.contains('hero-layer'));
  const isHeadline = selectedWrapper && (selectedWrapper.hasAttribute('data-is-headline') || selectedWrapper.classList.contains('headline-layer'));
  const isCompany = selectedWrapper && (selectedWrapper.hasAttribute('data-is-company') || selectedWrapper.classList.contains('company-layer'));
  const isCTA = selectedWrapper && (selectedWrapper.hasAttribute('data-is-cta') || selectedWrapper.classList.contains('cta-layer'));
  const isSpecialElement = isHero || isHeadline || isCompany || isCTA;
  const isRegularSticker = selectedWrapper && !isSpecialElement;
  
  // Handle sticker bar (only for regular stickers)
  if (isRegularSticker) {
    stickerDeleteArea.style.display = 'flex';
    if (stickerTitleArea) stickerTitleArea.classList.add('tabs-visible');
  } else {
    stickerDeleteArea.style.display = 'none';
    if (stickerTitleArea) stickerTitleArea.classList.remove('tabs-visible');
  }
  
  // Handle element bar (for hero/headline/company/cta) - show title only, no effects
  if (isSpecialElement && elementTitleArea) {
    // Set the title based on element type
    if (elementTitle) {
      if (isHero) elementTitle.textContent = 'Hero';
      else if (isHeadline) elementTitle.textContent = 'Headline';
      else if (isCompany) elementTitle.textContent = 'Company';
      else if (isCTA) elementTitle.textContent = 'CTA';
    }
    
    // Show element bar title
    elementTitleArea.style.display = 'flex';
  } else if (elementTitleArea) {
    // Hide element bar
    elementTitleArea.style.display = 'none';
  }
}

// Update element effect checkboxes based on current element state
function updateElementEffectCheckboxes(wrapper) {
  const glitterCheckbox = document.getElementById('element-effect-glitter');
  const shadowCheckbox = document.getElementById('element-effect-shadow');
  const outlineCheckbox = document.getElementById('element-effect-outline');
  
  if (!wrapper) return;
  
  // Check current effects on the element
  if (glitterCheckbox) {
    glitterCheckbox.checked = wrapper.hasAttribute('data-has-glitter') && wrapper.getAttribute('data-has-glitter') === 'true';
  }
  if (shadowCheckbox) {
    shadowCheckbox.checked = wrapper.hasAttribute('data-has-shadow') && wrapper.getAttribute('data-has-shadow') === 'true';
  }
  if (outlineCheckbox) {
    outlineCheckbox.checked = wrapper.hasAttribute('data-has-outline') && wrapper.getAttribute('data-has-outline') === 'true';
  }
}

//------------------------------------------------------
// INTERACTIVE STICKERS
//------------------------------------------------------
function makeInteractive(el, isHero = false) {

    el.addEventListener("pointerdown", () => {
	deselectAll();
	el.classList.add("selected");
	updateDeleteButtonVisibility();  // Show delete button for selected sticker
	if (!isHero) {
	    bringStickerToFront(el);  // only manage z-index for stickers, not heroes
	}
});

    // Drag to move
	interact(el).draggable({
  allowFrom: "img",
  listeners: {
    start(){ 
      el.classList.add("dragging"); 
      SoundManager.play('drag');
    },
    move(event) {
      const s = uiScale ? uiScale() : 1;
      const x = (parseFloat(el.getAttribute("data-x")) || 0) + event.dx / s;
      const y = (parseFloat(el.getAttribute("data-y")) || 0) + event.dy / s;
      el.setAttribute("data-x", x);
      el.setAttribute("data-y", y);
	  clampStickerPosition(el);
      applyTransform(el);
    },
    end(){ 
      el.classList.remove("dragging"); 
      SoundManager.play('drop');
    }
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
      SoundManager.play('drag');
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
      SoundManager.play('drop');
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
      SoundManager.play('drag');
    },
    move(event) {
      el.angle += event.dx * 0.5;
      applyTransform(el);
    },
    end() {
      rotHandle.classList.remove("dragging");
      document.body.classList.remove("rotating"); // <— NEW
      SoundManager.play('drop');
    }
  }
});
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
            start(){ 
                el.classList.add("dragging"); 
                SoundManager.play('drag');
            },
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
                SoundManager.play('drop');
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
                SoundManager.play('drag');
            },
            move(event) {
                const s = uiScale ? uiScale() : 1;
                el.scale = Math.max(0.1, el.scale + (event.dx / s) * 0.01);
                applyTransform(el);
            },
            end() {
                scaleHandle.classList.remove("dragging");
                document.body.classList.remove("scaling");
                SoundManager.play('drop');
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
                SoundManager.play('drag');
            },
            move(event) {
                el.angle += event.dx * 0.5;
                applyTransform(el);
            },
            end() {
                rotHandle.classList.remove("dragging");
                document.body.classList.remove("rotating");
                SoundManager.play('drop');
            }
        }
    });
}

const fsBtn  = document.getElementById('btn-fullscreen');
const fsHost = document.getElementById('root'); // fullscreen the scaling shell

function setFsButton(isFull){
  fsBtn.setAttribute('aria-pressed', String(isFull));
  const icon = fsBtn.querySelector('.btn-icon');
  if (icon) icon.textContent = isFull ? '⏏' : '⛶';
}

fsBtn.addEventListener('mouseenter', () => {
  SoundManager.play('menuHover');
});

fsBtn.addEventListener('click', async () => {
  SoundManager.play('click');
  try {
    if (!document.fullscreenElement) {
      // Aggressively scroll to top before entering fullscreen to prevent offset issues on mobile
      // The #root element has overflow:auto so it might be what's scrolling
      const rootEl = document.getElementById('root');
      
      // Reset all possible scroll containers
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
      document.body.scrollTop = 0;
      document.documentElement.scrollTop = 0;
      if (rootEl) {
        rootEl.scrollTop = 0;
        rootEl.scrollLeft = 0;
      }
      if (fsHost) {
        fsHost.scrollTop = 0;
        fsHost.scrollLeft = 0;
      }
      
      // Force layout recalculation
      void document.body.offsetHeight;
      
      // Longer delay to ensure scroll completes on mobile
      await new Promise(r => setTimeout(r, 100));
      
      // One more scroll attempt after delay
      window.scrollTo(0, 0);
      if (rootEl) rootEl.scrollTop = 0;
      
      await fsHost.requestFullscreen({ navigationUI: 'hide' });
    } else {
      await document.exitFullscreen();
    }
  } catch (e) { console.error(e); }
});

document.addEventListener('fullscreenchange', () => {
  const isFull = !!document.fullscreenElement;
  setFsButton(isFull);
  
  // When entering fullscreen, ensure we're scrolled to top
  if (isFull) {
    const rootEl = document.getElementById('root');
    window.scrollTo(0, 0);
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
    if (rootEl) {
      rootEl.scrollTop = 0;
      rootEl.scrollLeft = 0;
    }
    if (fsHost) {
      fsHost.scrollTop = 0;
      fsHost.scrollLeft = 0;
    }
    
    // Hide mobile prompt when in fullscreen
    hideMobileFullscreenPrompt();
    mobileFullscreenActive = true;
    
    // Try to lock orientation to landscape on mobile
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    if (isMobile && screen.orientation && screen.orientation.lock) {
      screen.orientation.lock('landscape').catch(() => {});
    }
  } else {
    // Exiting fullscreen
    mobileFullscreenActive = false;
    
    // Unlock orientation when exiting fullscreen
    if (screen.orientation && screen.orientation.unlock) {
      try {
        screen.orientation.unlock();
      } catch (e) {
        // Ignore errors
      }
    }
    
    // Show prompt again on mobile after a delay
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    if (isMobile) {
      setTimeout(() => {
        // Don't show prompt if export screen is visible
        const exportingScreen = document.getElementById('exporting-screen');
        if (exportingScreen && !exportingScreen.classList.contains('hidden')) {
          return;
        }
        showMobileFullscreenPrompt();
      }, 300);
    }
  }
  
  // re-run your scaler so the frame fits fullscreen viewport
  if (typeof updateUIScale === 'function') updateUIScale();
  
  // Resize UI snow canvas to match new viewport
  if (uiSnowCanvas) {
    setTimeout(() => {
      uiSnowCanvas.width = window.innerWidth;
      uiSnowCanvas.height = window.innerHeight;
      regenerateUISnowPixels();
      // Note: Don't reset accumulation here - we want to preserve it
    }, 100);
  }
});

// Orientation change handler - enforce landscape on mobile
if (screen.orientation) {
  screen.orientation.addEventListener('change', () => {
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    if (!isMobile) return;
    
    const isPortrait = screen.orientation.type.includes('portrait');
    const isFullscreen = !!document.fullscreenElement;
    
    if (isFullscreen) {
      // In fullscreen but rotated to portrait - try to re-lock to landscape
      if (isPortrait && screen.orientation.lock) {
        screen.orientation.lock('landscape').catch(() => {});
      }
    } else {
      // Not in fullscreen - show prompt to enter fullscreen
      // Don't show if loading or exporting screen is visible
      const loadingScreen = document.getElementById('loading-screen');
      const exportingScreen = document.getElementById('exporting-screen');
      const loadingVisible = loadingScreen && !loadingScreen.classList.contains('hidden');
      const exportingVisible = exportingScreen && !exportingScreen.classList.contains('hidden');
      
      if (!loadingVisible && !exportingVisible) {
        showMobileFullscreenPrompt();
      }
    }
  });
}

// Also listen for resize events as a fallback for orientation changes
window.addEventListener('resize', () => {
  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  if (!isMobile) return;
  
  const isFullscreen = !!document.fullscreenElement;
  const isPortrait = window.innerHeight > window.innerWidth;
  
  if (!isFullscreen && isPortrait) {
    // Not in fullscreen and in portrait - show prompt
    const loadingScreen = document.getElementById('loading-screen');
    const exportingScreen = document.getElementById('exporting-screen');
    const loadingVisible = loadingScreen && !loadingScreen.classList.contains('hidden');
    const exportingVisible = exportingScreen && !exportingScreen.classList.contains('hidden');
    
    if (!loadingVisible && !exportingVisible) {
      showMobileFullscreenPrompt();
    }
  } else if (isFullscreen && isPortrait) {
    // In fullscreen but portrait - try to lock to landscape
    if (screen.orientation && screen.orientation.lock) {
      screen.orientation.lock('landscape').catch(() => {});
    }
  }
});

// initialize
setFsButton(false);

// ==== MUTE BUTTON ====
const muteBtn = document.getElementById('btn-mute');

muteBtn.addEventListener('mouseenter', () => {
  SoundManager.play('menuHover');
});

muteBtn.addEventListener('click', () => {
  SoundManager.play('click'); // Play before toggling so it's audible when muting
  const isMuted = SoundManager.toggle();
  muteBtn.setAttribute('aria-pressed', String(isMuted));
  // Icon stays as ♪, CSS handles the crossed-out style when muted
});

// ==== SNOW EFFECT ====
const snowBtn = document.getElementById('btn-snow');
let isSnowActive = true; // Enabled by default!
let isExporting = false; // Flag to prevent animation pausing during export

// Snow settings (from user's pixel snow example)
const SNOW_SETTINGS = {
  density: 0.01,
  sizeMin: 1,
  sizeMax: 5,
  fallMin: 0.3,
  fallMax: 1.2,
  wind: -0.8,
  wobbleAmp: 1.7,
  wobbleSpeed: 0.012,
  fps: 12
};

// UI Overlay snow settings (lower density, same visual style)
const UI_SNOW_SETTINGS = {
  density: 0.0008,  // Very subtle, just a little snow
  sizeMin: 1,
  sizeMax: 5,
  fallMin: 0.3,
  fallMax: 1.2,
  wind: -0.8,
  wobbleAmp: 1.7,
  wobbleSpeed: 0.012,
  fps: 12
};

// Snow accumulation settings (fake accumulation on UI borders)
const ACCUMULATION_SETTINGS = {
  maxHeight: 12,           // Max snow pile height in pixels
  growthRate: 0.002,       // Chance to grow per column per frame
  resolution: 2.0,         // Resolution multiplier (higher = more columns/rows = smoother)
  organicVariation: 0.4,   // How much the max height varies (0-1, creates hills/valleys)
  verticalGravityBias: 4.0, // How much more snow accumulates at bottom vs top (1 = even, higher = more at bottom)
  verticalThickness: 1.0,  // Multiplier for vertical accumulation width (1.0 = same as horizontal height)
};

// Computed from resolution
let horizontalCols = 60;
let verticalRows = 30;

let horizontalAccumulation = []; // Bottom of stage (stage-stickerbar border)
let verticalAccumulation = [];   // Left of stage (sidebar-stage border)
let horizontalMaxHeights = [];   // Per-column max heights for organic look
let verticalMaxWidths = [];      // Per-row max widths for organic look

function initAccumulation() {
  // Compute column/row counts from resolution
  horizontalCols = Math.floor(60 * ACCUMULATION_SETTINGS.resolution);
  verticalRows = Math.floor(30 * ACCUMULATION_SETTINGS.resolution);
  
  horizontalAccumulation = new Array(horizontalCols).fill(0);
  verticalAccumulation = new Array(verticalRows).fill(0);
  
  // Generate organic max heights for each column (creates hills and valleys)
  horizontalMaxHeights = [];
  for (let i = 0; i < horizontalCols; i++) {
    // Use sine waves + noise for organic look
    const baseVariation = Math.sin(i * 0.3) * 0.3 + Math.sin(i * 0.7) * 0.2;
    const noise = (Math.random() - 0.5) * ACCUMULATION_SETTINGS.organicVariation;
    const variation = 1 - ACCUMULATION_SETTINGS.organicVariation * 0.5 + baseVariation * ACCUMULATION_SETTINGS.organicVariation + noise;
    horizontalMaxHeights.push(Math.max(2, Math.floor(ACCUMULATION_SETTINGS.maxHeight * variation)));
  }
  
  // Generate organic max widths for vertical accumulation
  verticalMaxWidths = [];
  for (let i = 0; i < verticalRows; i++) {
    // More snow accumulates at the bottom - use gravity bias for stronger effect
    const normalizedPos = i / verticalRows; // 0 at top, 1 at bottom
    const gravityFactor = Math.pow(normalizedPos, 1 / ACCUMULATION_SETTINGS.verticalGravityBias);
    const baseVariation = Math.sin(i * 0.4) * 0.2;
    const noise = (Math.random() - 0.5) * ACCUMULATION_SETTINGS.organicVariation * 0.5;
    const variation = gravityFactor + baseVariation * ACCUMULATION_SETTINGS.organicVariation + noise;
    verticalMaxWidths.push(Math.max(0, Math.floor(ACCUMULATION_SETTINGS.maxHeight * ACCUMULATION_SETTINGS.verticalThickness * variation)));
  }
}

function resetAccumulation() {
  horizontalAccumulation = horizontalAccumulation.map(() => 0);
  verticalAccumulation = verticalAccumulation.map(() => 0);
}

function updateAccumulation() {
  // Randomly grow horizontal accumulation (bottom border)
  for (let i = 0; i < horizontalAccumulation.length; i++) {
    if (Math.random() < ACCUMULATION_SETTINGS.growthRate) {
      const maxH = horizontalMaxHeights[i] || ACCUMULATION_SETTINGS.maxHeight;
      if (horizontalAccumulation[i] < maxH) {
        horizontalAccumulation[i] += 1;
      }
    }
  }
  
  // Randomly grow vertical accumulation (right side of sidebar border)
  for (let i = 0; i < verticalAccumulation.length; i++) {
    // Higher chance to grow at bottom - use gravity bias for stronger effect
    const normalizedPos = i / verticalAccumulation.length; // 0 at top, 1 at bottom
    const growthChance = ACCUMULATION_SETTINGS.growthRate * Math.pow(normalizedPos, 1 / ACCUMULATION_SETTINGS.verticalGravityBias);
    if (Math.random() < growthChance) {
      const maxW = verticalMaxWidths[i] || 0;
      if (verticalAccumulation[i] < maxW) {
        verticalAccumulation[i] += 1;
      }
    }
  }
}

function getAccumulationPositions() {
  const app = document.getElementById('app');
  if (!app) return null;
  
  const rect = app.getBoundingClientRect();
  const scale = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--ui-scale')) || 1;
  const borderWidth = 8 * scale; // The app border
  const sidebarWidth = 240 * scale;
  const stageHeight = 600 * scale;
  const stageWidth = 1200 * scale;
  
  // Account for the border offset
  const appLeft = rect.left + borderWidth;
  const appTop = rect.top + borderWidth;
  
  return {
    // Horizontal border (bottom of stage, top of sticker bar)
    horizontal: {
      x: appLeft + sidebarWidth,
      y: appTop + stageHeight,
      width: stageWidth
    },
    // Vertical border (right of sidebar, left of stage)
    vertical: {
      x: appLeft + sidebarWidth,
      y: appTop,
      height: stageHeight
    }
  };
}

function drawAccumulation(ctx) {
  const pos = getAccumulationPositions();
  if (!pos) return;
  
  ctx.fillStyle = '#ffffff';
  
  // Draw horizontal accumulation (bottom of stage) - grows UPWARD
  const hColWidth = pos.horizontal.width / horizontalCols;
  for (let i = 0; i < horizontalAccumulation.length; i++) {
    const h = horizontalAccumulation[i];
    if (h <= 0) continue;
    
    const x = pos.horizontal.x + i * hColWidth;
    const y = pos.horizontal.y - h;
    
    ctx.globalAlpha = 0.9;
    ctx.fillRect(x, y, hColWidth + 1, h);
  }
  
  // Draw vertical accumulation (left of stage) - grows to the RIGHT (into sidebar visually)
  const vRowHeight = pos.vertical.height / verticalRows;
  for (let i = 0; i < verticalAccumulation.length; i++) {
    const w = verticalAccumulation[i];
    if (w <= 0) continue;
    
    // Draw FROM the border going RIGHT (x stays at border, width extends right)
    const x = pos.vertical.x;
    const y = pos.vertical.y + i * vRowHeight;
    
    ctx.globalAlpha = 0.85;
    ctx.fillRect(x, y, w, vRowHeight + 1);
  }
  
  ctx.globalAlpha = 1;
}

// Initialize accumulation
initAccumulation();

let snowCanvas = null;
let snowCtx = null;
let snowPixels = [];
let snowAnimationId = null;
let snowLastTime = 0;

// UI overlay snow (covers entire app including UI)
let uiSnowCanvas = null;
let uiSnowCtx = null;
let uiSnowPixels = [];

const STAGE_W = 1200;
const STAGE_H = 600;

function initSnowCanvas() {
  if (snowCanvas) return;
  
  const stage = document.getElementById('stage');
  snowCanvas = document.createElement('canvas');
  snowCanvas.id = 'snow-canvas';
  snowCanvas.width = STAGE_W;
  snowCanvas.height = STAGE_H;
  snowCanvas.style.position = 'absolute';
  snowCanvas.style.top = '0';
  snowCanvas.style.left = '0';
  snowCanvas.style.width = '100%';
  snowCanvas.style.height = '100%';
  snowCanvas.style.pointerEvents = 'none';
  snowCanvas.style.zIndex = '9999'; // Above everything
  
  stage.appendChild(snowCanvas);
  snowCtx = snowCanvas.getContext('2d');
}

// UI Overlay snow canvas (covers entire viewport)
function initUISnowCanvas() {
  if (uiSnowCanvas) return;
  
  uiSnowCanvas = document.createElement('canvas');
  uiSnowCanvas.id = 'ui-snow-canvas';
  uiSnowCanvas.style.position = 'fixed';
  uiSnowCanvas.style.top = '0';
  uiSnowCanvas.style.left = '0';
  uiSnowCanvas.style.width = '100vw';
  uiSnowCanvas.style.height = '100vh';
  uiSnowCanvas.style.pointerEvents = 'none';
  uiSnowCanvas.style.zIndex = '500'; // Above most UI but below element effects bar
  
  // Set canvas size to viewport
  uiSnowCanvas.width = window.innerWidth;
  uiSnowCanvas.height = window.innerHeight;
  
  // Append to #root so it's visible in fullscreen mode
  const root = document.getElementById('root');
  if (root) {
    root.appendChild(uiSnowCanvas);
  } else {
    document.body.appendChild(uiSnowCanvas);
  }
  uiSnowCtx = uiSnowCanvas.getContext('2d');
  
  // Handle resize
  window.addEventListener('resize', () => {
    if (uiSnowCanvas) {
      uiSnowCanvas.width = window.innerWidth;
      uiSnowCanvas.height = window.innerHeight;
      regenerateUISnowPixels();
    }
  });
}

function removeUISnowCanvas() {
  if (uiSnowCanvas) {
    uiSnowCanvas.remove();
    uiSnowCanvas = null;
    uiSnowCtx = null;
  }
}

function removeSnowCanvas() {
  if (snowCanvas) {
    snowCanvas.remove();
    snowCanvas = null;
    snowCtx = null;
  }
}

function regenerateSnowPixels() {
  const area = STAGE_W * STAGE_H;
  const count = Math.max(50, Math.floor(area * SNOW_SETTINGS.density / 10));
  
  snowPixels = [];
  for (let i = 0; i < count; i++) {
    snowPixels.push(makeSnowPixel(STAGE_W, STAGE_H, SNOW_SETTINGS));
  }
}

function regenerateUISnowPixels() {
  if (!uiSnowCanvas) return;
  
  const w = uiSnowCanvas.width;
  const h = uiSnowCanvas.height;
  const area = w * h;
  const count = Math.max(20, Math.floor(area * UI_SNOW_SETTINGS.density / 10));
  
  uiSnowPixels = [];
  for (let i = 0; i < count; i++) {
    uiSnowPixels.push(makeSnowPixel(w, h, UI_SNOW_SETTINGS));
  }
}

function makeSnowPixel(width, height, settings) {
  return {
    x: Math.random() * width,
    y: Math.random() * height,
    size: Math.max(1, Math.round(settings.sizeMin + Math.random() * (settings.sizeMax - settings.sizeMin))),
    vy: settings.fallMin + Math.random() * (settings.fallMax - settings.fallMin),
    baseVx: (Math.random() - 0.5) * 0.4,
    alpha: 0.5 + Math.random() * 0.5,
    wobblePhase: Math.random() * Math.PI * 2,
    wobbleSpeed: settings.wobbleSpeed * (0.5 + Math.random()),
    wobbleAmp: settings.wobbleAmp * (0.5 + Math.random())
  };
}

// Manual snow update for export (doesn't rely on rAF)
function updateSnowFrame(dt) {
  if (!isSnowActive || !snowCtx || !snowCanvas) return;
  
  snowCtx.clearRect(0, 0, STAGE_W, STAGE_H);
  
  for (let i = 0; i < snowPixels.length; i++) {
    const p = snowPixels[i];
    
    const vx = p.baseVx + SNOW_SETTINGS.wind;
    p.y += p.vy * dt;
    p.x += vx * dt;
    p.wobblePhase += p.wobbleSpeed * dt;
    const wobble = Math.sin(p.wobblePhase) * p.wobbleAmp;
    const drawX = (p.x + wobble) | 0;
    const drawY = p.y | 0;
    
    // Wrap around
    if (p.y > STAGE_H + 10) {
      p.y = -10;
      p.x = Math.random() * STAGE_W;
    }
    if (drawX < -10) p.x = STAGE_W + 10;
    if (drawX > STAGE_W + 10) p.x = -10;
    
    snowCtx.globalAlpha = p.alpha;
    snowCtx.fillStyle = '#ffffff';
    snowCtx.fillRect(drawX, drawY, p.size, p.size);
  }
  
  snowCtx.globalAlpha = 1;
}

function snowLoop(timestamp) {
  if (!isSnowActive) {
    if (snowCtx && snowCanvas) {
      snowCtx.clearRect(0, 0, STAGE_W, STAGE_H);
    }
    if (uiSnowCtx && uiSnowCanvas) {
      uiSnowCtx.clearRect(0, 0, uiSnowCanvas.width, uiSnowCanvas.height);
    }
    snowAnimationId = null;
    return;
  }
  
  snowAnimationId = requestAnimationFrame(snowLoop);
  
  if (!snowLastTime) snowLastTime = timestamp;
  const frameInterval = 1000 / SNOW_SETTINGS.fps;
  let delta = timestamp - snowLastTime;
  
  // Cap delta to prevent teleporting after tab switch or long pause
  if (delta > 500) {
    snowLastTime = timestamp;
    delta = frameInterval;
  }
  
  if (delta < frameInterval) return;
  const dt = Math.min(delta / (1000 / 60), 3); // Cap dt to prevent huge jumps
  snowLastTime = timestamp;
  
  // === STAGE SNOW ===
  snowCtx.clearRect(0, 0, STAGE_W, STAGE_H);
  
  for (let i = 0; i < snowPixels.length; i++) {
    const p = snowPixels[i];
    
    const vx = p.baseVx + SNOW_SETTINGS.wind;
    p.y += p.vy * dt;
    p.x += vx * dt;
    p.wobblePhase += p.wobbleSpeed * dt;
    const wobble = Math.sin(p.wobblePhase) * p.wobbleAmp;
    const drawX = (p.x + wobble) | 0;
    const drawY = p.y | 0;
    
    // Wrap around
    if (p.y > STAGE_H + 10) {
      p.y = -10;
      p.x = Math.random() * STAGE_W;
    }
    if (drawX < -10) p.x = STAGE_W + 10;
    if (drawX > STAGE_W + 10) p.x = -10;
    
    snowCtx.globalAlpha = p.alpha;
    snowCtx.fillStyle = '#ffffff';
    snowCtx.fillRect(drawX, drawY, p.size, p.size);
  }
  
  snowCtx.globalAlpha = 1;
  
  // === UI OVERLAY SNOW ===
  if (uiSnowCtx && uiSnowCanvas) {
    const uiW = uiSnowCanvas.width;
    const uiH = uiSnowCanvas.height;
    
    uiSnowCtx.clearRect(0, 0, uiW, uiH);
    
    for (let i = 0; i < uiSnowPixels.length; i++) {
      const p = uiSnowPixels[i];
      
      const vx = p.baseVx + UI_SNOW_SETTINGS.wind;
      p.y += p.vy * dt;
      p.x += vx * dt;
      p.wobblePhase += p.wobbleSpeed * dt;
      const wobble = Math.sin(p.wobblePhase) * p.wobbleAmp;
      const drawX = (p.x + wobble) | 0;
      const drawY = p.y | 0;
      
      // Wrap around
      if (p.y > uiH + 10) {
        p.y = -10;
        p.x = Math.random() * uiW;
      }
      if (drawX < -10) p.x = uiW + 10;
      if (drawX > uiW + 10) p.x = -10;
      
      uiSnowCtx.globalAlpha = p.alpha;
      uiSnowCtx.fillStyle = '#ffffff';
      uiSnowCtx.fillRect(drawX, drawY, p.size, p.size);
    }
    
    // Update and draw snow accumulation on UI borders
    updateAccumulation();
    drawAccumulation(uiSnowCtx);
    
    uiSnowCtx.globalAlpha = 1;
  }
}

function startSnow() {
  initSnowCanvas();
  initUISnowCanvas();
  regenerateSnowPixels();
  regenerateUISnowPixels();
  initAccumulation(); // Reset accumulation when snow starts
  snowLastTime = 0;
  if (snowAnimationId) {
    cancelAnimationFrame(snowAnimationId);
  }
  snowAnimationId = requestAnimationFrame(snowLoop);
}

function stopSnow() {
  isSnowActive = false;
  if (snowAnimationId) {
    cancelAnimationFrame(snowAnimationId);
    snowAnimationId = null;
  }
  if (snowCtx && snowCanvas) {
    snowCtx.clearRect(0, 0, STAGE_W, STAGE_H);
  }
  if (uiSnowCtx && uiSnowCanvas) {
    uiSnowCtx.clearRect(0, 0, uiSnowCanvas.width, uiSnowCanvas.height);
  }
  // Reset snow accumulation
  resetAccumulation();
}

// Snow button click handler
snowBtn.addEventListener('mouseenter', () => {
  SoundManager.play('menuHover');
});

snowBtn.addEventListener('click', () => {
  SoundManager.play('click');
  isSnowActive = !isSnowActive;
  snowBtn.setAttribute('aria-pressed', String(isSnowActive));
  
  if (isSnowActive) {
    startSnow();
  } else {
    stopSnow();
  }
});

// Initialize snow on page load (enabled by default)
snowBtn.setAttribute('aria-pressed', 'true');
// Wait a moment for stage to be ready, then start snow
setTimeout(() => {
  if (isSnowActive) {
    startSnow();
  }
}, 100);

// Handle page visibility changes to prevent animation weirdness
// when switching tabs or minimizing the window
document.addEventListener('visibilitychange', () => {
  // Skip visibility handling during export to keep animations running
  if (isExporting) return;
  
  if (document.hidden) {
    // Page is hidden - animations will pause automatically via requestAnimationFrame
    // Nothing special needed here
  } else {
    // Page is visible again - reset timing to prevent teleporting
    snowLastTime = 0; // Will be set to current timestamp on next frame
    
    // Also reset glitter timing if it exists
    if (typeof glitterLastTime !== 'undefined') {
      glitterLastTime = 0;
    }
  }
});


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

// ==== STICKER BAR HORIZONTAL SCROLL WITH MOUSE WHEEL ====
(function setupStickerBarWheelScroll() {
  const stickerBar = document.getElementById('sticker-bar');
  if (!stickerBar) return;
  
  stickerBar.addEventListener('wheel', (e) => {
    // Convert vertical scroll to horizontal
    if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
      e.preventDefault();
      stickerBar.scrollLeft += e.deltaY;
    }
  }, { passive: false });
})();

// ==== DELETE BUTTON FOR STICKERS =============================================
// Delete button click handler - the whole area is clickable
const deleteButtonArea = document.getElementById('sticker-bar-delete-area');
if (deleteButtonArea) {
  deleteButtonArea.addEventListener('mouseenter', () => {
    SoundManager.play('menuHover');
  });
  
  deleteButtonArea.addEventListener('click', () => {
    const selectedSticker = document.querySelector('.sticker-wrapper.selected');
    if (selectedSticker && 
        !selectedSticker.hasAttribute('data-is-hero') && 
        !selectedSticker.hasAttribute('data-is-headline') &&
        !selectedSticker.classList.contains('headline-layer') &&
        !selectedSticker.classList.contains('company-layer') &&
        !selectedSticker.classList.contains('cta-layer')) {
      SoundManager.play('delete');
      selectedSticker.remove();
      deleteButtonArea.style.display = 'none';
    }
  });
}

// ==== STICKER EFFECTS (Outline, Shadow, Glitter) =============================
const effectOutline = document.getElementById('effect-outline');
const effectShadow = document.getElementById('effect-shadow');
const effectGlitter = document.getElementById('effect-glitter');

function updateStickerEffects() {
  const outlineChecked = effectOutline?.checked || false;
  const shadowChecked = effectShadow?.checked || false;
  
  let filterParts = [];
  
  // Outline effect - multiple drop shadows to create border around transparent PNG
  if (outlineChecked) {
    filterParts.push(
      'drop-shadow(2px 0 0 #000)',
      'drop-shadow(-2px 0 0 #000)',
      'drop-shadow(0 2px 0 #000)',
      'drop-shadow(0 -2px 0 #000)'
    );
  }
  
  // Shadow effect - hard pixel art shadow (no blur)
  if (shadowChecked) {
    filterParts.push('drop-shadow(4px 4px 0 rgba(0,0,0,0.6))');
  }
  
  const filterValue = filterParts.length > 0 ? filterParts.join(' ') : 'none';
  
  // Apply to all stickers (not heroes, headlines, etc.)
  document.querySelectorAll('.sticker-wrapper:not([data-is-hero]):not([data-is-headline]):not(.headline-layer):not(.company-layer):not(.cta-layer)').forEach(wrapper => {
    const img = wrapper.querySelector('img');
    if (img) {
      img.style.filter = filterValue;
    }
    // Set data attributes for export
    wrapper.setAttribute('data-has-outline', outlineChecked ? 'true' : 'false');
    wrapper.setAttribute('data-has-shadow', shadowChecked ? 'true' : 'false');
  });
}

// Add event listeners to effect checkboxes
if (effectOutline) {
  effectOutline.addEventListener('change', () => {
    SoundManager.play('click');
    updateStickerEffects();
  });
}
if (effectShadow) {
  effectShadow.addEventListener('change', () => {
    SoundManager.play('click');
    updateStickerEffects();
  });
}

// ==== GLITTER EFFECT SYSTEM ==================================================
// Early 2000s MSN/MySpace trashy glitter colors - over the top and fancy cute!
const ALL_GLITTER_COLORS = [
  '#ff69b4', // hot pink
  '#00ffff', // cyan/aqua
  '#ffd700', // gold
  '#ff00ff', // magenta
  '#ffb6c1', // light pink
  '#87ceeb', // baby blue
  '#ff1493', // deep pink
  '#7fffd4', // aquamarine
  '#ffc0cb', // pink
  '#e6e6fa', // lavender
  '#fff44f', // lemon yellow
  '#ff6ec7', // neon pink
  '#39ff14', // neon green
  '#ff073a', // neon red
  '#ffffff', // white
  '#f0f0f0', // off-white
  '#ffe4e1', // misty rose
  '#b0e0e6', // powder blue
  '#dda0dd', // plum
  '#98fb98', // pale green
];

let glitterCanvas = null;
let glitterCtx = null;
let glitterPixels = [];
let glitterAnimationId = null;
let glitterLastTime = 0;
let stickerGlitterData = new Map(); // Store colors AND per-sticker settings

// ==== ELEMENT GLITTER SYSTEM (independent from sticker glitter) ====
// Each main element (hero, headline, company, CTA) has its own glitter
let elementGlitterData = new Map(); // Store per-element glitter data (keyed by element)
let elementGlitterPixels = []; // Particles for main elements

const GLITTER_SETTINGS = {
  density: 0.15,
  sizeMin: 6,
  sizeMax: 15,
  glitterAmount: 1,
  glitterSpeed: 0.05,
  jitter: 2.3,
  crossChance: 1,
  starChance: 0.75,
  fps: 3,
  blinkHardness: 1,
  brightness: 3
};

// ===== TEMPORARY GLITTER CONTROLS UI =====
function createGlitterControls() {
  const panel = document.createElement('div');
  panel.id = 'glitter-controls';
  panel.innerHTML = `
    <style>
      #glitter-controls {
        position: fixed;
        top: 10px;
        right: 10px;
        z-index: 99999;
        background: rgba(10, 10, 20, 0.95);
        padding: 15px;
        border-radius: 8px;
        font-size: 12px;
        color: #eee;
        font-family: system-ui, sans-serif;
        width: 240px;
        max-height: 90vh;
        overflow-y: auto;
      }
      #glitter-controls .header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        cursor: pointer;
        margin-bottom: 10px;
      }
      #glitter-controls h3 {
        margin: 0;
        font-size: 14px;
        color: #ff69b4;
      }
      #glitter-controls .toggle-btn {
        background: none;
        border: none;
        color: #ff69b4;
        font-size: 18px;
        cursor: pointer;
        padding: 0;
        width: 24px;
        height: 24px;
      }
      #glitter-controls .controls-body {
        display: block;
      }
      #glitter-controls .controls-body.collapsed {
        display: none;
      }
      #glitter-controls .control {
        margin-bottom: 8px;
      }
      #glitter-controls .control label {
        display: flex;
        justify-content: space-between;
        margin-bottom: 2px;
      }
      #glitter-controls .control input[type="range"] {
        width: 100%;
      }
      #glitter-controls .value {
        opacity: 0.7;
        font-variant-numeric: tabular-nums;
      }
      #glitter-controls button {
        width: 100%;
        padding: 8px;
        margin-top: 10px;
        background: #ff69b4;
        border: none;
        border-radius: 4px;
        color: #fff;
        cursor: pointer;
        font-weight: bold;
      }
      #glitter-controls button:hover {
        background: #ff1493;
      }
      #glitter-controls pre {
        background: #000;
        padding: 8px;
        border-radius: 4px;
        font-size: 10px;
        overflow-x: auto;
        margin-top: 10px;
      }
    </style>
    <div class="header" id="gc-header">
      <h3>✨ Glitter Controls (TEMP)</h3>
      <button class="toggle-btn" id="gc-toggle">−</button>
    </div>
    
    <div class="controls-body" id="gc-body">
      <div class="control">
        <label><span>Density</span><span class="value" id="gc-density-val">${GLITTER_SETTINGS.density}</span></label>
        <input type="range" id="gc-density" min="0.01" max="1" step="0.01" value="${GLITTER_SETTINGS.density}">
      </div>
      
      <div class="control">
        <label><span>Size Min</span><span class="value" id="gc-sizeMin-val">${GLITTER_SETTINGS.sizeMin}</span></label>
        <input type="range" id="gc-sizeMin" min="1" max="20" step="1" value="${GLITTER_SETTINGS.sizeMin}">
      </div>
      
      <div class="control">
        <label><span>Size Max</span><span class="value" id="gc-sizeMax-val">${GLITTER_SETTINGS.sizeMax}</span></label>
        <input type="range" id="gc-sizeMax" min="2" max="30" step="1" value="${GLITTER_SETTINGS.sizeMax}">
      </div>
      
      <div class="control">
        <label><span>Glitter Amount</span><span class="value" id="gc-glitterAmount-val">${GLITTER_SETTINGS.glitterAmount}</span></label>
        <input type="range" id="gc-glitterAmount" min="0" max="1" step="0.05" value="${GLITTER_SETTINGS.glitterAmount}">
      </div>
      
      <div class="control">
        <label><span>Glitter Speed</span><span class="value" id="gc-glitterSpeed-val">${GLITTER_SETTINGS.glitterSpeed}</span></label>
        <input type="range" id="gc-glitterSpeed" min="0.001" max="0.2" step="0.001" value="${GLITTER_SETTINGS.glitterSpeed}">
      </div>
      
      <div class="control">
        <label><span>Jitter</span><span class="value" id="gc-jitter-val">${GLITTER_SETTINGS.jitter}</span></label>
        <input type="range" id="gc-jitter" min="0" max="10" step="0.1" value="${GLITTER_SETTINGS.jitter}">
      </div>
      
      <div class="control">
        <label><span>Cross Chance</span><span class="value" id="gc-crossChance-val">${GLITTER_SETTINGS.crossChance}</span></label>
        <input type="range" id="gc-crossChance" min="0" max="1" step="0.05" value="${GLITTER_SETTINGS.crossChance}">
      </div>
      
      <div class="control">
        <label><span>Star Chance</span><span class="value" id="gc-starChance-val">${GLITTER_SETTINGS.starChance}</span></label>
        <input type="range" id="gc-starChance" min="0" max="1" step="0.05" value="${GLITTER_SETTINGS.starChance}">
      </div>
      
      <div class="control">
        <label><span>FPS</span><span class="value" id="gc-fps-val">${GLITTER_SETTINGS.fps}</span></label>
        <input type="range" id="gc-fps" min="1" max="60" step="1" value="${GLITTER_SETTINGS.fps}">
      </div>
      
      <div class="control">
        <label><span>Blink Hardness</span><span class="value" id="gc-blinkHardness-val">${GLITTER_SETTINGS.blinkHardness}</span></label>
        <input type="range" id="gc-blinkHardness" min="0" max="1" step="0.05" value="${GLITTER_SETTINGS.blinkHardness}">
      </div>
      
      <div class="control">
        <label><span>Brightness</span><span class="value" id="gc-brightness-val">${GLITTER_SETTINGS.brightness}</span></label>
        <input type="range" id="gc-brightness" min="0.5" max="3" step="0.1" value="${GLITTER_SETTINGS.brightness}">
      </div>
      
      <button id="gc-randomize">🎲 Randomize Colors</button>
      <button id="gc-copy">📋 Copy Settings</button>
      <pre id="gc-output"></pre>
    </div>
  `;
  document.body.appendChild(panel);
  
  // Collapse/expand toggle
  const toggleBtn = document.getElementById('gc-toggle');
  const body = document.getElementById('gc-body');
  const header = document.getElementById('gc-header');
  
  header.addEventListener('click', () => {
    body.classList.toggle('collapsed');
    toggleBtn.textContent = body.classList.contains('collapsed') ? '+' : '−';
  });
  
  // Hook up sliders
  const sliderKeys = ['density', 'sizeMin', 'sizeMax', 'glitterAmount', 'glitterSpeed', 'jitter', 'crossChance', 'starChance', 'fps', 'blinkHardness', 'brightness'];
  sliderKeys.forEach(key => {
    const slider = document.getElementById(`gc-${key}`);
    const valDisplay = document.getElementById(`gc-${key}-val`);
    slider.addEventListener('input', () => {
      const val = key === 'sizeMin' || key === 'sizeMax' || key === 'fps'
        ? parseInt(slider.value) 
        : parseFloat(slider.value);
      GLITTER_SETTINGS[key] = val;
      valDisplay.textContent = val;
      regenerateGlitterPixels();
    });
  });
  
  // Randomize button
  document.getElementById('gc-randomize').addEventListener('click', () => {
    randomizeStickerColors();
    regenerateGlitterPixels();
  });
  
  // Copy settings button
  document.getElementById('gc-copy').addEventListener('click', () => {
    const output = JSON.stringify(GLITTER_SETTINGS, null, 2);
    document.getElementById('gc-output').textContent = output;
    navigator.clipboard.writeText(output).catch(() => {});
  });
}

// Create the controls panel
// createGlitterControls(); // COMMENTED OUT - uncomment to enable glitter tuning UI
// ===== END TEMPORARY CONTROLS =====

function getRandomGlitterColors() {
  // Color themes for more distinct looks between stickers
  const colorThemes = [
    // Pink/Magenta theme
    ['#ff69b4', '#ff1493', '#ff00ff', '#ffc0cb'],
    // Cyan/Blue theme  
    ['#00ffff', '#87ceeb', '#b0e0e6', '#7fffd4'],
    // Gold/Yellow theme
    ['#ffd700', '#fff44f', '#ffe4e1', '#ffffff'],
    // Neon theme
    ['#39ff14', '#ff073a', '#ff6ec7', '#00ffff'],
    // Pastel theme
    ['#ffb6c1', '#e6e6fa', '#98fb98', '#b0e0e6'],
    // Hot pink/Purple theme
    ['#ff1493', '#dda0dd', '#ff69b4', '#e6e6fa'],
    // White/Silver theme
    ['#ffffff', '#f0f0f0', '#e6e6fa', '#b0e0e6'],
    // Warm theme
    ['#ffd700', '#ff69b4', '#ff6ec7', '#ffe4e1'],
    // Cool theme
    ['#00ffff', '#7fffd4', '#87ceeb', '#98fb98'],
    // Rainbow mix
    ['#ff69b4', '#ffd700', '#00ffff', '#39ff14'],
  ];
  
  // Pick a random theme
  const theme = colorThemes[Math.floor(Math.random() * colorThemes.length)];
  
  // Optionally add 1-2 extra random colors for more variety
  const extraColors = Math.random() < 0.5 ? 1 : 0;
  const shuffledAll = [...ALL_GLITTER_COLORS].sort(() => Math.random() - 0.5);
  
  return [...theme, ...shuffledAll.slice(0, extraColors)];
}

function getRandomStickerSettings() {
  // Generate per-sticker variations of certain settings - MORE DRAMATIC differences
  return {
    densityMult: 0.3 + Math.random() * 1.4,          // 0.3 - 1.7x (much bigger range)
    sizeMinOffset: Math.floor(Math.random() * 8) - 3,  // -3 to +4
    sizeMaxOffset: Math.floor(Math.random() * 12) - 4, // -4 to +7
    speedMult: 0.2 + Math.random() * 1.8,            // 0.2 - 2.0x (some very slow, some fast)
    jitterMult: 0.3 + Math.random() * 1.4,           // 0.3 - 1.7x
    starChanceOffset: (Math.random() - 0.5) * 0.6,   // -0.3 to +0.3 (more variety in shapes)
    blinkHardnessOffset: (Math.random() - 0.5) * 0.8, // -0.4 to +0.4 (some smooth, some hard)
    colorShiftSpeed: 0.0005 + Math.random() * 0.008,  // Very different cycling speeds
    colorPhase: Math.random() * Math.PI * 2,          // Starting phase for color cycling
    fps: 1 + Math.floor(Math.random() * 6),           // 1-6 FPS per sticker
    lastFrameTime: 0                                   // Track last render time for this sticker
  };
}

function randomizeStickerColors() {
  stickerGlitterData.clear();
  const stickers = document.querySelectorAll('.sticker-wrapper:not([data-is-hero]):not([data-is-headline]):not(.headline-layer):not(.company-layer):not(.cta-layer)');
  stickers.forEach((sticker, index) => {
    stickerGlitterData.set(index, {
      colors: getRandomGlitterColors(),
      settings: getRandomStickerSettings()
    });
  });
}

// ==== ELEMENT GLITTER FUNCTIONS (for hero, headline, company, CTA) ====

function getElementBounds() {
  // Get all main elements that have glitter enabled
  const elements = document.querySelectorAll('.sticker-wrapper[data-has-glitter="true"]');
  const bounds = [];
  
  elements.forEach((wrapper) => {
    // Skip regular stickers - they have their own system
    const isHero = wrapper.hasAttribute('data-is-hero');
    const isHeadline = wrapper.hasAttribute('data-is-headline') || wrapper.classList.contains('headline-layer');
    const isCompany = wrapper.classList.contains('company-layer');
    const isCTA = wrapper.classList.contains('cta-layer');
    
    if (!isHero && !isHeadline && !isCompany && !isCTA) return;
    
    const dataX = parseFloat(wrapper.getAttribute('data-x')) || 0;
    const dataY = parseFloat(wrapper.getAttribute('data-y')) || 0;
    
    // Get the inner element for dimensions
    const inner = wrapper.querySelector('.headline-text, .company-text, .cta-button, img');
    if (!inner) return;
    
    const scale = wrapper.scale || 1;
    const unscaledW = inner.offsetWidth;
    const unscaledH = inner.offsetHeight;
    const scaledW = unscaledW * scale;
    const scaledH = unscaledH * scale;
    
    // CSS transform: translate(x,y) scale(s) - scale happens from element center
    // So visual top-left = dataX + (unscaledW - scaledW)/2
    const visualX = dataX + (unscaledW - scaledW) / 2;
    const visualY = dataY + (unscaledH - scaledH) / 2;
    
    // Get or create glitter data for this element
    if (!elementGlitterData.has(wrapper)) {
      elementGlitterData.set(wrapper, {
        colors: getRandomGlitterColors(),
        settings: getRandomStickerSettings()
      });
    }
    
    const glitterData = elementGlitterData.get(wrapper);
    
    bounds.push({
      x: visualX,
      y: visualY,
      w: scaledW,
      h: scaledH,
      centerX: visualX + scaledW / 2,
      centerY: visualY + scaledH / 2,
      colors: glitterData.colors,
      settings: glitterData.settings,
      element: wrapper
    });
  });
  
  return bounds;
}

function regenerateElementGlitterPixels() {
  const bounds = getElementBounds();
  elementGlitterPixels = [];
  
  if (bounds.length === 0) return;
  
  // Calculate particles for each element
  bounds.forEach(b => {
    const elementDensity = GLITTER_SETTINGS.density * (b.settings?.densityMult || 1);
    const area = b.w * b.h;
    const count = Math.max(15, Math.min(80, Math.floor(area * elementDensity / 100)));
    
    for (let j = 0; j < count; j++) {
      elementGlitterPixels.push(makeElementGlitterPixel(b));
    }
  });
}

// Add glitter particles for a specific element only (doesn't affect other elements)
function addElementGlitterPixels(element) {
  const dataX = parseFloat(element.getAttribute('data-x')) || 0;
  const dataY = parseFloat(element.getAttribute('data-y')) || 0;
  
  const inner = element.querySelector('.headline-text, .company-text, .cta-button, img');
  if (!inner) return;
  
  const scale = element.scale || 1;
  const unscaledW = inner.offsetWidth;
  const unscaledH = inner.offsetHeight;
  const scaledW = unscaledW * scale;
  const scaledH = unscaledH * scale;
  
  // CSS transform: translate(x,y) scale(s) - scale happens from element center
  const visualX = dataX + (unscaledW - scaledW) / 2;
  const visualY = dataY + (unscaledH - scaledH) / 2;
  
  const glitterData = elementGlitterData.get(element);
  if (!glitterData) return;
  
  const bounds = {
    x: visualX,
    y: visualY,
    w: scaledW,
    h: scaledH,
    centerX: visualX + scaledW / 2,
    centerY: visualY + scaledH / 2,
    colors: glitterData.colors,
    settings: glitterData.settings,
    element: element
  };
  
  const elementDensity = GLITTER_SETTINGS.density * (bounds.settings?.densityMult || 1);
  const area = bounds.w * bounds.h;
  const count = Math.max(15, Math.min(80, Math.floor(area * elementDensity / 100)));
  
  for (let j = 0; j < count; j++) {
    elementGlitterPixels.push(makeElementGlitterPixel(bounds));
  }
}

// Remove glitter particles for a specific element only (doesn't affect other elements)
function removeElementGlitterPixels(element) {
  elementGlitterPixels = elementGlitterPixels.filter(p => p.bounds?.element !== element);
}

function makeElementGlitterPixel(bounds) {
  const stickerSettings = bounds.settings || {};
  
  const sizeMin = Math.max(1, GLITTER_SETTINGS.sizeMin + (stickerSettings.sizeMinOffset || 0));
  const sizeMax = Math.max(sizeMin + 1, GLITTER_SETTINGS.sizeMax + (stickerSettings.sizeMaxOffset || 0));
  const size = (sizeMin + Math.random() * (sizeMax - sizeMin)) | 0;
  
  const localX = Math.random() * bounds.w;
  const localY = Math.random() * bounds.h;
  
  const dx = (localX / bounds.w - 0.5) * 2;
  const dy = (localY / bounds.h - 0.5) * 2;
  const distSq = dx * dx + dy * dy;
  const fadeMult = Math.max(0, 1 - distSq * 0.5);
  
  const effectiveStarChance = Math.max(0, Math.min(1, 
    GLITTER_SETTINGS.starChance + (stickerSettings.starChanceOffset || 0)
  ));
  
  let shapeType = 'square';
  if (Math.random() < GLITTER_SETTINGS.crossChance) {
    shapeType = Math.random() < effectiveStarChance ? 'star' : 'cross';
  }
  
  const baseSpeed = GLITTER_SETTINGS.glitterSpeed * (stickerSettings.speedMult || 1);
  
  return {
    x: bounds.x + localX,
    y: bounds.y + localY,
    baseSize: size,
    alphaBase: (0.4 + Math.random() * 0.6) * fadeMult,
    phase: Math.random() * 6.28,
    speed: baseSpeed * (0.5 + Math.random()),
    localAmount: 0.4 + Math.random() * 0.6,
    colors: bounds.colors,
    shapeType: shapeType,
    bounds: bounds,
    stickerSettings: stickerSettings
  };
}

function updateElementGlitterPositions() {
  const bounds = getElementBounds();
  if (bounds.length === 0) return;
  
  // Create a map for faster lookup
  const boundsMap = new Map();
  bounds.forEach(b => boundsMap.set(b.element, b));
  
  for (let i = 0; i < elementGlitterPixels.length; i++) {
    const p = elementGlitterPixels[i];
    const element = p.bounds?.element;
    const newBounds = boundsMap.get(element);
    
    if (!newBounds) continue;
    
    const relX = (p.x - p.bounds.x) / p.bounds.w;
    const relY = (p.y - p.bounds.y) / p.bounds.h;
    
    p.x = newBounds.x + relX * newBounds.w;
    p.y = newBounds.y + relY * newBounds.h;
    p.bounds = newBounds;
  }
}

function hasAnyElementGlitter() {
  // Check if any main element (hero, headline, company, CTA) has glitter enabled
  return document.querySelectorAll('.sticker-wrapper[data-has-glitter="true"][data-is-hero], .sticker-wrapper[data-has-glitter="true"].headline-layer, .sticker-wrapper[data-has-glitter="true"].company-layer, .sticker-wrapper[data-has-glitter="true"].cta-layer').length > 0;
}

function initGlitterCanvas() {
  if (glitterCanvas) return;
  
  const stage = document.getElementById('stage');
  glitterCanvas = document.createElement('canvas');
  glitterCanvas.id = 'glitter-canvas';
  glitterCanvas.style.position = 'absolute';
  glitterCanvas.style.top = '0';
  glitterCanvas.style.left = '0';
  glitterCanvas.style.width = '100%';
  glitterCanvas.style.height = '100%';
  glitterCanvas.style.pointerEvents = 'none';
  glitterCanvas.style.zIndex = '9998'; // Above stickers but below UI
  
  // Get stage dimensions
  const stageW = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--stage-w'));
  const stageH = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--stage-h'));
  glitterCanvas.width = stageW;
  glitterCanvas.height = stageH;
  
  stage.appendChild(glitterCanvas);
  glitterCtx = glitterCanvas.getContext('2d');
}

function removeGlitterCanvas() {
  if (glitterCanvas) {
    glitterCanvas.remove();
    glitterCanvas = null;
    glitterCtx = null;
  }
}

function getStickerBounds() {
  const stickers = document.querySelectorAll('.sticker-wrapper:not([data-is-hero]):not([data-is-headline]):not(.headline-layer):not(.company-layer):not(.cta-layer)');
  const bounds = [];
  
  stickers.forEach((wrapper, index) => {
    const dataX = parseFloat(wrapper.getAttribute('data-x')) || 0;
    const dataY = parseFloat(wrapper.getAttribute('data-y')) || 0;
    const img = wrapper.querySelector('img');
    if (!img) return;
    
    const scale = wrapper.scale || 1;
    const unscaledW = img.offsetWidth;
    const unscaledH = img.offsetHeight;
    const scaledW = unscaledW * scale;
    const scaledH = unscaledH * scale;
    
    // CSS transform: translate(x,y) scale(s) - scale happens from element center
    // So visual top-left = dataX + (unscaledW - scaledW)/2
    const visualX = dataX + (unscaledW - scaledW) / 2;
    const visualY = dataY + (unscaledH - scaledH) / 2;
    
    // Get or create glitter data for this sticker
    if (!stickerGlitterData.has(index)) {
      stickerGlitterData.set(index, {
        colors: getRandomGlitterColors(),
        settings: getRandomStickerSettings()
      });
    }
    
    const glitterData = stickerGlitterData.get(index);
    
    bounds.push({
      x: visualX,
      y: visualY,
      w: scaledW,
      h: scaledH,
      centerX: visualX + scaledW / 2,
      centerY: visualY + scaledH / 2,
      colors: glitterData.colors,
      settings: glitterData.settings,
      index: index
    });
  });
  
  return bounds;
}

function regenerateGlitterPixels() {
  const bounds = getStickerBounds();
  glitterPixels = [];
  
  if (bounds.length === 0) return;
  
  // PERFORMANCE: Calculate total desired particles, then cap
  let totalDesired = 0;
  const particlesPerSticker = [];
  
  bounds.forEach(b => {
    const stickerDensity = GLITTER_SETTINGS.density * (b.settings?.densityMult || 1);
    const area = b.w * b.h;
    const count = Math.max(10, Math.floor(area * stickerDensity / 100));
    particlesPerSticker.push(count);
    totalDesired += count;
  });
  
  // Scale down if over max
  const scale = totalDesired > MAX_GLITTER_PARTICLES ? MAX_GLITTER_PARTICLES / totalDesired : 1;
  
  bounds.forEach((b, i) => {
    const count = Math.max(8, Math.floor(particlesPerSticker[i] * scale));
    for (let j = 0; j < count; j++) {
      glitterPixels.push(makeGlitterPixel(b));
    }
  });
}

function makeGlitterPixel(bounds) {
  const stickerSettings = bounds.settings || {};
  
  // Apply per-sticker size variations
  const sizeMin = Math.max(1, GLITTER_SETTINGS.sizeMin + (stickerSettings.sizeMinOffset || 0));
  const sizeMax = Math.max(sizeMin + 1, GLITTER_SETTINGS.sizeMax + (stickerSettings.sizeMaxOffset || 0));
  const size = (sizeMin + Math.random() * (sizeMax - sizeMin)) | 0; // Integer
  
  // Random position within bounds
  const localX = Math.random() * bounds.w;
  const localY = Math.random() * bounds.h;
  
  // Simplified fade from center (cheaper calculation)
  const dx = (localX / bounds.w - 0.5) * 2; // -1 to 1
  const dy = (localY / bounds.h - 0.5) * 2; // -1 to 1
  const distSq = dx * dx + dy * dy; // 0 to 2
  const fadeMult = Math.max(0, 1 - distSq * 0.5);
  
  // Per-sticker star chance variation
  const effectiveStarChance = Math.max(0, Math.min(1, 
    GLITTER_SETTINGS.starChance + (stickerSettings.starChanceOffset || 0)
  ));
  
  // Determine shape type
  let shapeType = 'square';
  if (Math.random() < GLITTER_SETTINGS.crossChance) {
    shapeType = Math.random() < effectiveStarChance ? 'star' : 'cross';
  }
  
  // Per-sticker speed variation
  const baseSpeed = GLITTER_SETTINGS.glitterSpeed * (stickerSettings.speedMult || 1);
  
  return {
    x: bounds.x + localX,
    y: bounds.y + localY,
    baseSize: size,
    alphaBase: (0.4 + Math.random() * 0.6) * fadeMult,
    phase: Math.random() * 6.28, // 2*PI
    speed: baseSpeed * (0.5 + Math.random()),
    localAmount: 0.4 + Math.random() * 0.6,
    colors: bounds.colors,
    shapeType: shapeType,
    bounds: bounds,
    stickerSettings: stickerSettings
  };
}

function randGlitterRange(min, max) {
  return min + Math.random() * (max - min);
}

function updateGlitterPixelPositions() {
  // PERFORMANCE: Cache bounds lookup
  const bounds = getStickerBounds();
  if (bounds.length === 0) return;
  
  // Create a map for faster lookup by index
  const boundsMap = new Map();
  bounds.forEach(b => boundsMap.set(b.index, b));
  
  for (let i = 0; i < glitterPixels.length; i++) {
    const p = glitterPixels[i];
    const stickerIndex = p.bounds?.index;
    const newBounds = boundsMap.get(stickerIndex);
    
    if (!newBounds) continue;
    
    // Calculate relative position within original bounds
    const relX = (p.x - p.bounds.x) / p.bounds.w;
    const relY = (p.y - p.bounds.y) / p.bounds.h;
    
    // Update position
    p.x = newBounds.x + relX * newBounds.w;
    p.y = newBounds.y + relY * newBounds.h;
    p.bounds = newBounds;
  }
}

// Performance monitoring
let glitterPerfStats = {
  frameCount: 0,
  totalTime: 0,
  lastReportTime: 0,
  particleCount: 0
};

// PERFORMANCE: Max particles across ALL stickers
const MAX_GLITTER_PARTICLES = 250;

// Manual glitter update for export (simplified version)
function updateGlitterFrame(dt) {
  if (!glitterCanvas || !glitterCtx) return;
  
  // Sticker glitter is always on, element glitter is per-element
  const hasStickerGlitter = true;
  const hasElementGlitter = hasAnyElementGlitter();
  
  if (!hasStickerGlitter && !hasElementGlitter) return;
  
  glitterCtx.clearRect(0, 0, glitterCanvas.width, glitterCanvas.height);
  
  const globalTime = performance.now() * 0.001;
  glitterCtx.shadowBlur = 0;
  const brightness = GLITTER_SETTINGS.brightness;
  
  // Update and draw sticker glitter
  if (hasStickerGlitter && glitterPixels) {
    for (let i = 0; i < glitterPixels.length; i++) {
      const p = glitterPixels[i];
      if (!p) continue;
      
      const stickerSettings = p.stickerSettings || {};
      p.phase += p.speed * dt;
      
      let pulse = (1 + Math.sin(p.phase)) * 0.5;
      const hardness = Math.max(0, Math.min(1, 
        GLITTER_SETTINGS.blinkHardness + (stickerSettings.blinkHardnessOffset || 0)
      ));
      pulse = Math.pow(pulse, 1 - hardness * 0.8);
      
      if (Math.random() < 0.05) {
        pulse = Math.random() < 0.5 ? 1 : 0;
      }
      
      const amount = GLITTER_SETTINGS.glitterAmount * p.localAmount;
      const alpha = Math.min(1, p.alphaBase * (0.1 + amount * pulse) * brightness);
      const size = p.baseSize * (0.5 + 0.8 * amount * pulse);
      
      if (alpha < 0.1) continue;
      
      const jitter = GLITTER_SETTINGS.jitter * (stickerSettings.jitterMult || 1);
      const jx = (Math.random() - 0.5) * jitter;
      const jy = (Math.random() - 0.5) * jitter;
      
      const colorShiftSpeed = stickerSettings.colorShiftSpeed || 0.002;
      const colorPhase = stickerSettings.colorPhase || 0;
      const colorCyclePos = (globalTime * colorShiftSpeed + colorPhase + p.phase * 0.1) % 1;
      const currentColorIndex = Math.floor(colorCyclePos * p.colors.length) % p.colors.length;
      const color = p.colors[currentColorIndex];
      
      const x = (p.x + jx) | 0;
      const y = (p.y + jy) | 0;
      
      glitterCtx.globalAlpha = alpha;
      glitterCtx.fillStyle = color;
      if (typeof drawGlitterShape === 'function') {
        drawGlitterShape(x, y, size, p.shapeType);
      } else {
        glitterCtx.fillRect(x, y, size, size);
      }
    }
  }
  
  // Update and draw element glitter
  if (hasElementGlitter && elementGlitterPixels) {
    for (let i = 0; i < elementGlitterPixels.length; i++) {
      const p = elementGlitterPixels[i];
      if (!p) continue;
      
      const stickerSettings = p.stickerSettings || {};
      p.phase += p.speed * dt;
      
      let pulse = (1 + Math.sin(p.phase)) * 0.5;
      const hardness = Math.max(0, Math.min(1, 
        GLITTER_SETTINGS.blinkHardness + (stickerSettings.blinkHardnessOffset || 0)
      ));
      pulse = Math.pow(pulse, 1 - hardness * 0.8);
      
      if (Math.random() < 0.05) {
        pulse = Math.random() < 0.5 ? 1 : 0;
      }
      
      const amount = GLITTER_SETTINGS.glitterAmount * p.localAmount;
      const alpha = Math.min(1, p.alphaBase * (0.1 + amount * pulse) * brightness);
      const size = p.baseSize * (0.5 + 0.8 * amount * pulse);
      
      if (alpha < 0.1) continue;
      
      const jitter = GLITTER_SETTINGS.jitter * (stickerSettings.jitterMult || 1);
      const jx = (Math.random() - 0.5) * jitter;
      const jy = (Math.random() - 0.5) * jitter;
      
      const colorShiftSpeed = stickerSettings.colorShiftSpeed || 0.002;
      const colorPhase = stickerSettings.colorPhase || 0;
      const colorCyclePos = (globalTime * colorShiftSpeed + colorPhase + p.phase * 0.1) % 1;
      const currentColorIndex = Math.floor(colorCyclePos * p.colors.length) % p.colors.length;
      const color = p.colors[currentColorIndex];
      
      const x = (p.x + jx) | 0;
      const y = (p.y + jy) | 0;
      
      glitterCtx.globalAlpha = alpha;
      glitterCtx.fillStyle = color;
      if (typeof drawGlitterShape === 'function') {
        drawGlitterShape(x, y, size, p.shapeType);
      } else {
        glitterCtx.fillRect(x, y, size, size);
      }
    }
  }
  
  glitterCtx.globalAlpha = 1;
}

function glitterLoop(timestamp) {
  // Sticker glitter is always on, element glitter is per-element
  const hasStickerGlitter = true;
  const hasElementGlitter = hasAnyElementGlitter();
  
  if (!hasStickerGlitter && !hasElementGlitter) {
    if (glitterCanvas) {
      glitterCtx.clearRect(0, 0, glitterCanvas.width, glitterCanvas.height);
    }
    glitterAnimationId = null;
    return;
  }
  
  glitterAnimationId = requestAnimationFrame(glitterLoop);
  
  // Performance tracking start
  const perfStart = performance.now();
  
  if (!glitterLastTime) glitterLastTime = timestamp;
  let glitterDelta = timestamp - glitterLastTime;
  
  // Cap delta to prevent weirdness after tab switch
  if (glitterDelta > 500) {
    glitterLastTime = timestamp;
    glitterDelta = 16; // ~60fps frame
  }
  
  const dt = Math.min(glitterDelta / (1000 / 60), 3); // Cap dt
  glitterLastTime = timestamp;
  
  // === STICKER GLITTER ===
  if (hasStickerGlitter) {
    // PERFORMANCE: Only check sticker count every 500ms instead of every frame
    if (!glitterLoop.lastStickerCheck || timestamp - glitterLoop.lastStickerCheck > 500) {
      const currentStickerCount = document.querySelectorAll('.sticker-wrapper:not([data-is-hero]):not([data-is-headline]):not(.headline-layer):not(.company-layer):not(.cta-layer)').length;
      if (glitterPixels.length === 0 || glitterLoop.lastStickerCount !== currentStickerCount) {
        regenerateGlitterPixels();
        glitterLoop.lastStickerCount = currentStickerCount;
      }
      glitterLoop.lastStickerCheck = timestamp;
    }
    
    // PERFORMANCE: Only update positions every 100ms
    if (!glitterLoop.lastPositionUpdate || timestamp - glitterLoop.lastPositionUpdate > 100) {
      updateGlitterPixelPositions();
      glitterLoop.lastPositionUpdate = timestamp;
    }
  }
  
  // === ELEMENT GLITTER ===
  if (hasElementGlitter) {
    // Check element count every 500ms
    if (!glitterLoop.lastElementCheck || timestamp - glitterLoop.lastElementCheck > 500) {
      const currentElementCount = document.querySelectorAll('.sticker-wrapper[data-has-glitter="true"][data-is-hero], .sticker-wrapper[data-has-glitter="true"].headline-layer, .sticker-wrapper[data-has-glitter="true"].company-layer, .sticker-wrapper[data-has-glitter="true"].cta-layer').length;
      if (elementGlitterPixels.length === 0 || glitterLoop.lastElementCount !== currentElementCount) {
        regenerateElementGlitterPixels();
        glitterLoop.lastElementCount = currentElementCount;
      }
      glitterLoop.lastElementCheck = timestamp;
    }
    
    // Update element positions every 100ms
    if (!glitterLoop.lastElementPositionUpdate || timestamp - glitterLoop.lastElementPositionUpdate > 100) {
      updateElementGlitterPositions();
      glitterLoop.lastElementPositionUpdate = timestamp;
    }
  }
  
  // Determine which sticker indices should render this frame (per-sticker FPS)
  const stickerShouldRender = new Map();
  if (hasStickerGlitter) {
    stickerGlitterData.forEach((data, index) => {
      const stickerFps = data.settings?.fps || 3;
      const frameInterval = 1000 / stickerFps;
      const lastFrame = data.settings?.lastFrameTime || 0;
      
      if (timestamp - lastFrame >= frameInterval) {
        stickerShouldRender.set(index, true);
        if (data.settings) {
          data.settings.lastFrameTime = timestamp;
        }
      } else {
        stickerShouldRender.set(index, false);
      }
    });
  }
  
  // Determine which elements should render this frame
  const elementShouldRender = new Map();
  if (hasElementGlitter) {
    elementGlitterData.forEach((data, element) => {
      const elementFps = data.settings?.fps || 3;
      const frameInterval = 1000 / elementFps;
      const lastFrame = data.settings?.lastFrameTime || 0;
      
      if (timestamp - lastFrame >= frameInterval) {
        elementShouldRender.set(element, true);
        if (data.settings) {
          data.settings.lastFrameTime = timestamp;
        }
      } else {
        elementShouldRender.set(element, false);
      }
    });
  }
  
  glitterCtx.clearRect(0, 0, glitterCanvas.width, glitterCanvas.height);
  
  // Global time for color cycling
  const globalTime = timestamp * 0.001;
  
  // Ensure shadowBlur is disabled for performance
  glitterCtx.shadowBlur = 0;
  
  let renderedParticles = 0;
  const brightness = GLITTER_SETTINGS.brightness;
  
  // === RENDER STICKER GLITTER ===
  if (hasStickerGlitter) {
    for (let i = 0; i < glitterPixels.length; i++) {
      const p = glitterPixels[i];
      const stickerSettings = p.stickerSettings || {};
      const stickerIndex = p.bounds?.index;
      
      // Check if this sticker should render this frame
      const shouldRender = stickerShouldRender.get(stickerIndex) !== false;
      
      // Always update phase
      p.phase += p.speed * dt;
      
      // Skip rendering if this sticker's FPS says not this frame, draw cached state
      if (!shouldRender && p.lastDrawState) {
        const s = p.lastDrawState;
        glitterCtx.globalAlpha = s.alpha;
        glitterCtx.fillStyle = s.color;
        drawGlitterShape(s.x, s.y, s.size, s.shapeType);
        renderedParticles++;
        continue;
      }
      
      let pulse = (1 + Math.sin(p.phase)) * 0.5;
      
      const hardness = Math.max(0, Math.min(1, 
        GLITTER_SETTINGS.blinkHardness + (stickerSettings.blinkHardnessOffset || 0)
      ));
      pulse = Math.pow(pulse, 1 - hardness * 0.8);
      
      if (Math.random() < 0.05) {
        pulse = Math.random() < 0.5 ? 1 : 0;
      }
      
      const amount = GLITTER_SETTINGS.glitterAmount * p.localAmount;
      const alpha = Math.min(1, p.alphaBase * (0.1 + amount * pulse) * brightness);
      const size = p.baseSize * (0.5 + 0.8 * amount * pulse);
      
      if (alpha < 0.1) continue;
      
      const jitter = GLITTER_SETTINGS.jitter * (stickerSettings.jitterMult || 1);
      const jx = (Math.random() - 0.5) * jitter;
      const jy = (Math.random() - 0.5) * jitter;
      
      const colorShiftSpeed = stickerSettings.colorShiftSpeed || 0.002;
      const colorPhase = stickerSettings.colorPhase || 0;
      const colorCyclePos = (globalTime * colorShiftSpeed + colorPhase + p.phase * 0.1) % 1;
      
      let currentColorIndex;
      if (Math.random() < 0.02) {
        currentColorIndex = Math.floor(Math.random() * p.colors.length);
      } else {
        currentColorIndex = Math.floor(colorCyclePos * p.colors.length) % p.colors.length;
      }
      const color = p.colors[currentColorIndex];
      
      const x = (p.x + jx) | 0;
      const y = (p.y + jy) | 0;
      
      p.lastDrawState = { x, y, size, color, alpha, shapeType: p.shapeType };
      
      glitterCtx.globalAlpha = alpha;
      glitterCtx.fillStyle = color;
      drawGlitterShape(x, y, size, p.shapeType);
      renderedParticles++;
    }
  }
  
  // === RENDER ELEMENT GLITTER ===
  if (hasElementGlitter) {
    for (let i = 0; i < elementGlitterPixels.length; i++) {
      const p = elementGlitterPixels[i];
      const stickerSettings = p.stickerSettings || {};
      const element = p.bounds?.element;
      
      // Check if this element should render this frame
      const shouldRender = elementShouldRender.get(element) !== false;
      
      // Always update phase
      p.phase += p.speed * dt;
      
      // Skip rendering if FPS says not this frame, draw cached state
      if (!shouldRender && p.lastDrawState) {
        const s = p.lastDrawState;
        glitterCtx.globalAlpha = s.alpha;
        glitterCtx.fillStyle = s.color;
        drawGlitterShape(s.x, s.y, s.size, s.shapeType);
        renderedParticles++;
        continue;
      }
      
      let pulse = (1 + Math.sin(p.phase)) * 0.5;
      
      const hardness = Math.max(0, Math.min(1, 
        GLITTER_SETTINGS.blinkHardness + (stickerSettings.blinkHardnessOffset || 0)
      ));
      pulse = Math.pow(pulse, 1 - hardness * 0.8);
      
      if (Math.random() < 0.05) {
        pulse = Math.random() < 0.5 ? 1 : 0;
      }
      
      const amount = GLITTER_SETTINGS.glitterAmount * p.localAmount;
      const alpha = Math.min(1, p.alphaBase * (0.1 + amount * pulse) * brightness);
      const size = p.baseSize * (0.5 + 0.8 * amount * pulse);
      
      if (alpha < 0.1) continue;
      
      const jitter = GLITTER_SETTINGS.jitter * (stickerSettings.jitterMult || 1);
      const jx = (Math.random() - 0.5) * jitter;
      const jy = (Math.random() - 0.5) * jitter;
      
      const colorShiftSpeed = stickerSettings.colorShiftSpeed || 0.002;
      const colorPhase = stickerSettings.colorPhase || 0;
      const colorCyclePos = (globalTime * colorShiftSpeed + colorPhase + p.phase * 0.1) % 1;
      
      let currentColorIndex;
      if (Math.random() < 0.02) {
        currentColorIndex = Math.floor(Math.random() * p.colors.length);
      } else {
        currentColorIndex = Math.floor(colorCyclePos * p.colors.length) % p.colors.length;
      }
      const color = p.colors[currentColorIndex];
      
      const x = (p.x + jx) | 0;
      const y = (p.y + jy) | 0;
      
      p.lastDrawState = { x, y, size, color, alpha, shapeType: p.shapeType };
      
      glitterCtx.globalAlpha = alpha;
      glitterCtx.fillStyle = color;
      drawGlitterShape(x, y, size, p.shapeType);
      renderedParticles++;
    }
  }
  
  glitterCtx.globalAlpha = 1;
  
  // Performance tracking
  const perfEnd = performance.now();
  glitterPerfStats.frameCount++;
  glitterPerfStats.totalTime += (perfEnd - perfStart);
  glitterPerfStats.particleCount = glitterPixels.length;
  
  // Report every 5 seconds
  if (timestamp - glitterPerfStats.lastReportTime > 5000) {
    const avgTime = glitterPerfStats.totalTime / glitterPerfStats.frameCount;
    console.log(`✨ Glitter Perf: ${avgTime.toFixed(2)}ms/frame, ${glitterPerfStats.particleCount} particles, ${renderedParticles} rendered`);
    glitterPerfStats.frameCount = 0;
    glitterPerfStats.totalTime = 0;
    glitterPerfStats.lastReportTime = timestamp;
  }
}

function drawGlitterShape(x, y, size, shapeType) {
  const s = size | 0; // Integer size
  if (shapeType === 'star' && s >= 3) {
    const half = s >> 1; // Bitwise divide by 2
    const diagHalf = (s * 0.35) | 0;
    
    // Main cross
    glitterCtx.fillRect(x - half, y, s, 1);
    glitterCtx.fillRect(x, y - half, 1, s);
    
    // Diagonals - simplified, fewer draw calls
    for (let d = 1; d <= diagHalf; d++) {
      glitterCtx.fillRect(x + d, y + d, 1, 1);
      glitterCtx.fillRect(x - d, y - d, 1, 1);
      glitterCtx.fillRect(x + d, y - d, 1, 1);
      glitterCtx.fillRect(x - d, y + d, 1, 1);
    }
  } else if (shapeType === 'cross' && s >= 2) {
    const half = s >> 1;
    glitterCtx.fillRect(x - half, y, s, 1);
    glitterCtx.fillRect(x, y - half, 1, s);
  } else {
    glitterCtx.fillRect(x, y, s, s);
  }
}

function startGlitter() {
  initGlitterCanvas();
  randomizeStickerColors(); // Randomize colors each time glitter is enabled
  regenerateGlitterPixels();
  glitterLastTime = 0;
  // Always restart animation loop
  if (glitterAnimationId) {
    cancelAnimationFrame(glitterAnimationId);
  }
  glitterAnimationId = requestAnimationFrame(glitterLoop);
}

function stopGlitter() {
  // Sticker glitter is always on now, so never fully stop
  // This function is kept for backwards compatibility but does nothing
  return;
}

// Update delete button visibility when selection changes
const originalDeselectAll = deselectAll;
deselectAll = function() {
  originalDeselectAll();
  updateDeleteButtonVisibility();
};

// Add observer to watch for class changes on stage children
const stageEl = document.getElementById('stage');
if (stageEl) {
  const observer = new MutationObserver(() => {
    updateDeleteButtonVisibility();
  });

  observer.observe(stageEl, {
    attributes: true,
    attributeFilter: ['class'],
    subtree: true
  });
}

//------------------------------------------------------
// ELEMENT BAR HANDLERS (Hero/Headline/Company/CTA)
//------------------------------------------------------

//------------------------------------------------------
// ELEMENT EFFECT HANDLERS (Hero/Headline/Company/CTA)
// Note: These elements are NOT deletable
//------------------------------------------------------

// Element effect: Glitter (INDEPENDENT system for main elements)
const elementGlitterCheckbox = document.getElementById('element-effect-glitter');
if (elementGlitterCheckbox) {
  elementGlitterCheckbox.addEventListener('change', (e) => {
    const selected = document.querySelector('.sticker-wrapper.selected');
    if (!selected) return;
    
    // Only apply to main elements (hero, headline, company, CTA)
    const isHero = selected.hasAttribute('data-is-hero');
    const isHeadline = selected.hasAttribute('data-is-headline') || selected.classList.contains('headline-layer');
    const isCompany = selected.classList.contains('company-layer');
    const isCTA = selected.classList.contains('cta-layer');
    
    if (!isHero && !isHeadline && !isCompany && !isCTA) return;
    
    if (e.target.checked) {
      selected.setAttribute('data-has-glitter', 'true');
      selected.classList.add('has-glitter');
      
      // Initialize glitter data for this specific element (only on enable)
      elementGlitterData.set(selected, {
        colors: getRandomGlitterColors(),
        settings: getRandomStickerSettings()
      });
      
      // Start glitter loop if not running
      initGlitterCanvas();
      
      // Only add pixels for THIS element (doesn't affect others)
      addElementGlitterPixels(selected);
      
      glitterLastTime = 0;
      if (!glitterAnimationId) {
        glitterAnimationId = requestAnimationFrame(glitterLoop);
      }
    } else {
      selected.setAttribute('data-has-glitter', 'false');
      selected.classList.remove('has-glitter');
      
      // Remove glitter data for this element
      elementGlitterData.delete(selected);
      
      // Only remove pixels for THIS element (doesn't affect others)
      removeElementGlitterPixels(selected);
      
      // Don't stop the loop - sticker glitter is always on
    }
  });
}

// Helper function to update element effects (works like sticker effects)
function updateElementEffects(wrapper) {
  if (!wrapper) return;
  
  const inner = wrapper.querySelector('.headline-text, .company-text, .cta-button, img');
  if (!inner) return;
  
  const hasShadow = wrapper.getAttribute('data-has-shadow') === 'true';
  const hasOutline = wrapper.getAttribute('data-has-outline') === 'true';
  
  let filterParts = [];
  
  // Outline effect first (same as stickers)
  if (hasOutline) {
    filterParts.push(
      'drop-shadow(2px 0 0 #000)',
      'drop-shadow(-2px 0 0 #000)',
      'drop-shadow(0 2px 0 #000)',
      'drop-shadow(0 -2px 0 #000)'
    );
  }
  
  // Shadow effect (same as stickers)
  if (hasShadow) {
    filterParts.push('drop-shadow(4px 4px 0 rgba(0,0,0,0.6))');
  }
  
  inner.style.filter = filterParts.length > 0 ? filterParts.join(' ') : '';
}

// Element effect: Shadow
const elementShadowCheckbox = document.getElementById('element-effect-shadow');
if (elementShadowCheckbox) {
  elementShadowCheckbox.addEventListener('change', (e) => {
    const selected = document.querySelector('.sticker-wrapper.selected');
    if (selected) {
      if (e.target.checked) {
        selected.setAttribute('data-has-shadow', 'true');
        selected.classList.add('has-shadow');
      } else {
        selected.setAttribute('data-has-shadow', 'false');
        selected.classList.remove('has-shadow');
      }
      updateElementEffects(selected);
    }
  });
}

// Element effect: Outline (black)
const elementOutlineCheckbox = document.getElementById('element-effect-outline');
if (elementOutlineCheckbox) {
  elementOutlineCheckbox.addEventListener('change', (e) => {
    const selected = document.querySelector('.sticker-wrapper.selected');
    if (selected) {
      if (e.target.checked) {
        selected.setAttribute('data-has-outline', 'true');
        selected.classList.add('has-outline');
      } else {
        selected.setAttribute('data-has-outline', 'false');
        selected.classList.remove('has-outline');
      }
      updateElementEffects(selected);
    }
  });
}