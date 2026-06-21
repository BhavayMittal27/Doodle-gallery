/* ==========================================================================
   ANNA'S SECRET GARDEN CONTROLLER (app.js)
   ========================================================================== */

import { supabase } from './supabase.js';

document.addEventListener('DOMContentLoaded', () => {
  // --- STATE MANAGEMENT ---
  let flowersList = []; // For the grassy island (up to 60 recent flowers)
  let galleryFlowersList = []; // For the gallery overlay (paginated, 200 items per page)
  let galleryPage = 1;
  const itemsPerPage = 200;
  let totalFlowersCount = 0;
  let typewriterInterval = null;
  let typewriterTimeout = null;
  
  // Canvas Instantiation
  const mainCanvas = new SketchCanvas('paint-canvas');

  // --- PALETTE DEFINITIONS (Garden Colors from annasgarden.dev) ---
  const GARDEN_PALETTE = [
    { name: 'Crimson Red', hex: '#E74C3C' },
    { name: 'Sunset Orange', hex: '#FF8C42' },
    { name: 'Marigold Yellow', hex: '#FFD166' },
    { name: 'Cherry Pink', hex: '#FFB3C1' },
    { name: 'Leaf Green', hex: '#3C7A3B' }
  ];

  // --- INITIALIZATION ---
  initApp();

  function initApp() {
    setupNavigation();
    setupColorPalette();
    setupCanvasControls();
    setupMobileDrawer();
    renderGardenSky();
    setupGalleryToolbar();
    
    // Start typewriter title animation
    typeSubtitle("Add flowers to our garden? ");

    // Listen to canvas change to toggle Plant button disabled state
    const saveBtn = document.getElementById('save-gallery-btn');
    const paintCanvas = document.getElementById('paint-canvas');
    if (paintCanvas && saveBtn) {
      paintCanvas.addEventListener('canvas-changed', (e) => {
        saveBtn.disabled = !e.detail.hasDrawn;
      });
    }

    // Load drawings from Supabase in background
    fetchSupabaseFlowers();
  }

  // --- TYPEWRITER SUBTITLE ANIMATION ---

  function typeSubtitle(text) {
    const subtitleEl = document.querySelector('.studio-subtitle');
    if (!subtitleEl) return;
    
    if (typewriterInterval) {
      clearInterval(typewriterInterval);
      typewriterInterval = null;
    }
    if (typewriterTimeout) {
      clearTimeout(typewriterTimeout);
      typewriterTimeout = null;
    }
    
    subtitleEl.innerHTML = '';
    
    const cursor = document.createElement('span');
    cursor.className = 'cursor animate-pulse';
    cursor.textContent = '|';
    cursor.style.marginLeft = '2px';
    
    let index = 0;
    subtitleEl.appendChild(cursor);
    
    typewriterInterval = setInterval(() => {
      if (index < text.length) {
        const char = document.createTextNode(text[index]);
        subtitleEl.insertBefore(char, cursor);
        index++;
      } else {
        clearInterval(typewriterInterval);
        typewriterInterval = null;
        cursor.remove();
      }
    }, 50);
  }

  // --- DRAWING MODERATION & CENTERING (from Codedex template) ---
  function decideFlagging(pixelData) {
    let nonWhite = 0;
    const totalPixels = pixelData.length / 4;

    for (let i = 0; i < pixelData.length; i += 4) {
      const r = pixelData[i];
      const g = pixelData[i + 1];
      const b = pixelData[i + 2];
      const a = pixelData[i + 3];
      if (a === 0) continue;
      const isWhite = r > 245 && g > 245 && b > 245;
      if (!isWhite) nonWhite++;
    }

    // Flag empty, low ink, or blank sketches (less than 0.3% non-white/non-transparent pixels)
    return nonWhite / totalPixels < 0.003;
  }

  function findContentBounds(imageData, w, h) {
    const data = imageData.data;
    let minX = w, minY = h, maxX = -1, maxY = -1;
    const isInk = (r, g, b, a) => a > 10 && !(r > 245 && g > 245 && b > 245);

    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        const i = (y * w + x) * 4;
        const r = data[i], g = data[i+1], b = data[i+2], a = data[i+3];
        if (isInk(r, g, b, a)) {
          if (x < minX) minX = x;
          if (y < minY) minY = y;
          if (x > maxX) maxX = x;
          if (y > maxY) maxY = y;
        }
      }
    }

    if (maxX === -1) return null;
    return { minX, minY, maxX, maxY };
  }

  function makeCenteredSquarePng(canvas, pad = 24) {
    const w = canvas.width, h = canvas.height;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    const img = ctx.getImageData(0, 0, w, h);
    
    const bounds = findContentBounds(img, w, h);
    if (!bounds) return canvas;

    const bw = bounds.maxX - bounds.minX + 1;
    const bh = bounds.maxY - bounds.minY + 1;
    const size = Math.max(bw, bh) + pad * 2;

    const out = document.createElement('canvas');
    out.width = size;
    out.height = size;
    const octx = out.getContext('2d');

    const dx = Math.floor((size - bw) / 2);
    const dy = Math.floor((size - bh) / 2);

    octx.drawImage(
      canvas,
      bounds.minX, bounds.minY, bw, bh,
      dx, dy, bw, bh
    );

    return out;
  }

  // --- NAV OVERLAYS TOGGLING ---
  function setupNavigation() {
    const galleryOverlay = document.getElementById('gallery-archive');
    const closeGalleryBtn = document.getElementById('close-gallery-btn');
    const mobileGalleryBtn = document.getElementById('mobile-gallery-btn');

    function openGallery() {
      if (galleryOverlay) {
        galleryOverlay.classList.add('active');
        trapFocus(galleryOverlay);
        document.body.style.overflow = 'hidden';
        
        // Fetch first page of gallery when opened
        galleryPage = 1;
        fetchGalleryPage(galleryPage);
      }
    }

    function closeGallery() {
      if (galleryOverlay) {
        galleryOverlay.classList.remove('active');
        releaseFocus();
        document.body.style.overflow = '';
      }
    }

    if (mobileGalleryBtn) {
      mobileGalleryBtn.addEventListener('click', (e) => {
        e.preventDefault();
        openGallery();
      });
    }

    if (closeGalleryBtn) {
      closeGalleryBtn.addEventListener('click', () => {
        closeGallery();
      });
    }
  }

  // --- PALETTE UI GENERATION ---
  function setupColorPalette() {
    const paletteContainer = document.getElementById('color-palette');
    if (!paletteContainer) return;
    paletteContainer.innerHTML = '';

    mainCanvas.currentColor = GARDEN_PALETTE[0].hex;

    GARDEN_PALETTE.forEach((color, idx) => {
      const bubble = document.createElement('button');
      bubble.className = `color-bubble ${idx === 0 ? 'active' : ''}`;
      bubble.style.backgroundColor = color.hex;
      bubble.title = color.name;
      bubble.setAttribute('aria-label', color.name);

      bubble.addEventListener('click', () => {
        paletteContainer.querySelectorAll('.color-bubble').forEach(b => b.classList.remove('active'));
        bubble.classList.add('active');
        mainCanvas.currentColor = color.hex;
      });

      paletteContainer.appendChild(bubble);
    });
  }

  // --- DRAWING TOOLKIT INTERACTIONS ---
  function setupCanvasControls() {
    const clearBtn = document.getElementById('clear-btn');
    if (clearBtn) {
      clearBtn.addEventListener('click', () => {
        mainCanvas.clear();
        showToast('Canvas wiped clean!', 'info');
        typeSubtitle("Add flowers to our garden? ");
      });
    }

    // Save/Post to Doodle Garden Island
    document.getElementById('save-gallery-btn').addEventListener('click', async () => {
      if (!mainCanvas.hasDrawn) {
        showToast("Draw something first!", "danger");
        return;
      }
      
      const saveBtn = document.getElementById('save-gallery-btn');
      const originalText = saveBtn.innerHTML;

      try {
        saveBtn.disabled = true;
        saveBtn.innerHTML = `<span>⏳</span> Planting...`;

        // Extract image data to run client-side decidesFlagging check
        const imgData = mainCanvas.ctx.getImageData(0, 0, mainCanvas.canvas.width, mainCanvas.canvas.height);
        const flagged = decideFlagging(imgData.data);

        if (flagged) {
          // Block planting and show warning subtitle
          showToast("That's not a flower. Try again?", "danger");
          typeSubtitle("That's not a flower. Try again? ");
          
          typewriterTimeout = setTimeout(() => {
            typeSubtitle("Add flowers to our garden? ");
          }, 5000);

          // Re-enable save button
          saveBtn.disabled = false;
          saveBtn.innerHTML = originalText;
          return;
        }
        
        // Default metadata to match minimalist annasgarden.dev database records
        const title = 'Planted Flower';
        const author = 'Gardener';
        const description = 'A community flower in BHAVI KA KHET.';
        
        // Crop, center, and get the transparent PNG image from the canvas
        const exportCanvas = makeCenteredSquarePng(mainCanvas.canvas, 32);
        const transparentImgData = exportCanvas.toDataURL();
        let imageSrc = transparentImgData;

        const randomId = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
        const filename = `${Date.now()}-${randomId}.png`;
        const path = `public/${filename}`;
        const newId = `db-doodle-${path.replace(/\//g, '_')}`;

        if (supabase) {
          const blob = dataURLtoBlob(transparentImgData);
          
          const { error: uploadError } = await supabase.storage
             .from('drawings')
             .upload(path, blob, { contentType: 'image/png', upsert: false });
             
          if (uploadError) throw uploadError;
          
          const { error: insertError } = await supabase
             .from('drawings')
             .insert([{ path, caption: title, flagged: false, author, description }]);
             
          if (insertError) throw insertError;
          
          const { data: publicData } = supabase.storage
             .from('drawings')
             .getPublicUrl(path);
             
          imageSrc = publicData.publicUrl;
          
          showToast(`Successfully planted flower!`, 'success');
        } else {
          showToast(`Successfully planted flower in local session!`, 'success');
        }

        const newFlower = {
          id: newId,
          title: title,
          category: 'user',
          tag: 'Planted Flower',
          date: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
          likes: 0,
          author: author,
          description: description,
          imageSrc: imageSrc
        };

        // Add to island list and re-render
        flowersList.unshift(newFlower);
        if (flowersList.length > 60) {
          flowersList.pop(); // Keep island clean
        }
        renderGardenSky();
        
        // If the gallery overlay is active, also add to gallery list and re-render
        const galleryOverlay = document.getElementById('gallery-archive');
        if (galleryOverlay && galleryOverlay.classList.contains('active')) {
          galleryFlowersList.unshift(newFlower);
          if (galleryFlowersList.length > itemsPerPage) {
            galleryFlowersList.pop();
          }
          renderGalleryGrid();
        }
        
        // Reset controls
        mainCanvas.clear();
        saveBtn.disabled = true;

        // Close mobile drawer if active
        const drawer = document.getElementById('forge-panel');
        if (drawer) {
          drawer.classList.remove('active');
          document.body.style.overflow = '';
        }

      } catch (err) {
        console.error("Planting flow failed:", err);
        showToast("Failed to plant flower. Please try again.", "danger");
        saveBtn.disabled = false;
        saveBtn.innerHTML = originalText;
      }
    });
  }

  // --- MOBILE DRAWER TOGGLING ---
  function setupMobileDrawer() {
    const drawer = document.getElementById('forge-panel');
    const openBtn = document.getElementById('mobile-draw-btn');
    const closeBtn = document.getElementById('close-drawer-btn');
    const unsavedModal = document.getElementById('unsaved-modal');
    const confirmDiscardBtn = document.getElementById('confirm-discard-btn');
    const cancelDiscardBtn = document.getElementById('cancel-discard-btn');
    
    if (!drawer) return;
    
    function tryCloseDrawer() {
      if (mainCanvas.hasDrawn) {
        if (unsavedModal) {
          unsavedModal.classList.add('active');
          trapFocus(unsavedModal);
        } else {
          if (confirm("You have unsaved drawings. Discard and close?")) {
            closeDrawer();
          }
        }
      } else {
        closeDrawer();
      }
    }

    function closeDrawer() {
      drawer.classList.remove('active');
      mainCanvas.clear();
      const saveBtn = document.getElementById('save-gallery-btn');
      if (saveBtn) saveBtn.disabled = true;
      if (unsavedModal) unsavedModal.classList.remove('active');
      releaseFocus();
      document.body.style.overflow = '';
      typeSubtitle("Add flowers to our garden? ");
    }
    
    if (openBtn) {
      openBtn.addEventListener('click', () => {
        drawer.classList.add('active');
        document.body.style.overflow = 'hidden';
      });
    }
    
    if (closeBtn) {
      closeBtn.addEventListener('click', tryCloseDrawer);
    }

    if (confirmDiscardBtn) {
      confirmDiscardBtn.addEventListener('click', () => {
        closeDrawer();
      });
    }

    if (cancelDiscardBtn) {
      cancelDiscardBtn.addEventListener('click', () => {
        if (unsavedModal) {
          unsavedModal.classList.remove('active');
          releaseFocus();
        }
      });
    }

    const unsavedOverlay = document.getElementById('unsaved-close-overlay');
    if (unsavedOverlay) {
      unsavedOverlay.addEventListener('click', () => {
        if (unsavedModal) {
          unsavedModal.classList.remove('active');
          releaseFocus();
        }
      });
    }
  }

  // --- COORDINATE PLACEMENT ON THE GRASS ---
  function getCoordinatesForId(id) {
    let hash = 0;
    for (let i = 0; i < id.length; i++) {
      hash = id.charCodeAt(i) + ((hash << 5) - hash);
    }
    
    // Map flower coordinates specifically to the grassy island surface
    // X between 22% and 78% (centered width on the grass)
    // Y between 24% and 56% (upper middle height on the grass platform)
    const x = 22 + (Math.abs(hash) % 56);
    const y = 24 + (Math.abs(hash * 37) % 32);
    
    return { x, y };
  }

  function renderGardenSky() {
    const layer = document.getElementById('constellations-layer');
    if (!layer) return;
    layer.innerHTML = '';

    // 1. Render transparent flowers directly on the bobbing island image (No hover tooltips or click actions)
    if (!window.loadedFlowers) {
      window.loadedFlowers = new Set();
    }

    flowersList.forEach(flower => {
      const coords = getCoordinatesForId(flower.id);
      
      const node = document.createElement('div');
      node.className = `constellation-node type-${flower.category || 'user'}`;
      node.setAttribute('data-star-id', flower.id);
      node.style.left = `${coords.x}%`;
      node.style.top = `${coords.y}%`;

      // Set smooth floating animations
      node.style.setProperty('--float-duration', `${4 + (Math.abs(coords.x + coords.y) % 5)}s`);
      node.style.setProperty('--float-delay', `${-(Math.abs(coords.x * coords.y) % 8)}s`);

      const hasLoaded = window.loadedFlowers.has(flower.id);
      const drawingDiv = document.createElement('div');
      drawingDiv.className = `constellation-drawing ${hasLoaded ? 'animate-growIn' : 'opacity-0-scale-0'}`;

      if (flower.imageSrc) {
        const img = document.createElement('img');
        img.src = flower.imageSrc;
        img.alt = "Flower";
        img.loading = "lazy";
        
        img.addEventListener('load', () => {
          if (!window.loadedFlowers.has(flower.id)) {
            window.loadedFlowers.add(flower.id);
          }
          drawingDiv.classList.remove('opacity-0-scale-0');
          drawingDiv.classList.add('animate-growIn');
        });

        // Fallback for cached images
        if (img.complete) {
          if (!window.loadedFlowers.has(flower.id)) {
            window.loadedFlowers.add(flower.id);
          }
          drawingDiv.classList.remove('opacity-0-scale-0');
          drawingDiv.classList.add('animate-growIn');
        }

        drawingDiv.appendChild(img);
      } else {
        drawingDiv.classList.remove('opacity-0-scale-0');
        drawingDiv.classList.add('animate-growIn');
      }

      node.appendChild(drawingDiv);
      layer.appendChild(node);
    });
  }

  // 2. Render cards in the gallery overlay grid (No metadata, no likes count, no buttons)
  function renderGalleryGrid() {
    const archiveGrid = document.getElementById('archive-grid');
    if (archiveGrid) {
      archiveGrid.innerHTML = '';
      
      // Handle empty state tab display
      const emptyState = document.getElementById('gallery-empty-state');
      if (emptyState) {
        if (galleryFlowersList.length === 0) {
          emptyState.classList.remove('hidden');
        } else {
          emptyState.classList.add('hidden');
        }
      }

      // Maintain loaded flowers set on window to persist animation status across re-renders
      if (!window.loadedFlowers) {
        window.loadedFlowers = new Set();
      }

      galleryFlowersList.forEach(flower => {
        const item = document.createElement('div');
        const hasLoaded = window.loadedFlowers.has(flower.id);
        
        item.className = `archive-item ${hasLoaded ? 'animate-growIn' : 'opacity-0-scale-0'}`;
        item.style.transformOrigin = 'center bottom';

        if (flower.imageSrc) {
          const img = document.createElement('img');
          img.src = flower.imageSrc;
          img.alt = flower.title || 'Flower';
          img.loading = 'lazy';
          
          img.addEventListener('load', () => {
            if (!window.loadedFlowers.has(flower.id)) {
              window.loadedFlowers.add(flower.id);
              item.classList.remove('opacity-0-scale-0');
              item.classList.add('animate-growIn');
            }
          });
          
          // Fallback if loaded from cache before event listener attached
          if (img.complete) {
            if (!window.loadedFlowers.has(flower.id)) {
              window.loadedFlowers.add(flower.id);
              item.classList.remove('opacity-0-scale-0');
              item.classList.add('animate-growIn');
            }
          }
          
          item.appendChild(img);
        } else {
          item.classList.remove('opacity-0-scale-0');
          item.classList.add('animate-growIn');
        }

        archiveGrid.appendChild(item);
      });
    }
  }

  // Fetch paginated page of flowers from Supabase
  async function fetchGalleryPage(page) {
    if (!supabase) return;

    const prevBtn = document.getElementById('prev-page-btn');
    const nextBtn = document.getElementById('next-page-btn');
    const pageInfo = document.getElementById('page-info');
    const archiveGrid = document.getElementById('archive-grid');

    if (archiveGrid) {
      archiveGrid.innerHTML = '<div class="hand-drawn" style="grid-column: 1/-1; text-align: center; font-size: 1.5rem; color: var(--text-green); padding: 2rem 0;">Loading flowers... 🌸</div>';
    }

    try {
      const from = (page - 1) * itemsPerPage;
      const to = from + itemsPerPage - 1;

      // Fetch count of active drawings (lifetime drawings count)
      const { count, error: countError } = await supabase
        .from('drawings')
        .select('*', { count: 'exact', head: true })
        .or('flagged.is.null,flagged.eq.false');

      if (countError) throw countError;
      totalFlowersCount = count || 0;

      // Fetch the requested page data
      const { data, error } = await supabase
        .from('drawings')
        .select('path, caption, flagged, created_at, author, description')
        .or('flagged.is.null,flagged.eq.false')
        .order('created_at', { ascending: false })
        .range(from, to);

      if (error) throw error;

      if (data) {
        galleryFlowersList = data.map((row) => {
          const { data: publicData } = supabase.storage.from('drawings').getPublicUrl(row.path);
          return {
            id: `db-doodle-${row.path.replace(/\//g, '_')}`,
            title: row.caption || 'Unnamed Flower',
            category: 'user',
            imageSrc: publicData.publicUrl
          };
        });

        renderGalleryGrid();
      }

      // Update Pagination controls state
      const totalPages = Math.ceil(totalFlowersCount / itemsPerPage) || 1;
      if (pageInfo) {
        pageInfo.textContent = `Page ${page} of ${totalPages}`;
      }
      if (prevBtn) prevBtn.disabled = page === 1;
      if (nextBtn) nextBtn.disabled = page >= totalPages;

    } catch (err) {
      console.error("Error loading gallery page:", err);
      if (archiveGrid) {
        archiveGrid.innerHTML = '<div class="hand-drawn" style="grid-column: 1/-1; text-align: center; color: #e74c3c; padding: 2rem 0;">Failed to load flowers.</div>';
      }
    }
  }

  // Gallery Toolbar and Pagination Setup
  function setupGalleryToolbar() {
    const emptyStateBtn = document.getElementById('empty-state-draw-btn');
    const prevBtn = document.getElementById('prev-page-btn');
    const nextBtn = document.getElementById('next-page-btn');

    if (emptyStateBtn) {
      emptyStateBtn.addEventListener('click', () => {
        const galleryOverlay = document.getElementById('gallery-archive');
        if (galleryOverlay) {
          galleryOverlay.classList.remove('active');
          releaseFocus();
        }
        const drawer = document.getElementById('forge-panel');
        if (drawer) drawer.classList.add('active');
      });
    }

    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        if (galleryPage > 1) {
          galleryPage--;
          fetchGalleryPage(galleryPage);
        }
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        const totalPages = Math.ceil(totalFlowersCount / itemsPerPage) || 1;
        if (galleryPage < totalPages) {
          galleryPage++;
          fetchGalleryPage(galleryPage);
        }
      });
    }
  }

  // --- FOCUS TRAPPING & ACCESSIBILITY HELPER ---
  let activeFocusTrap = null;
  let previousActiveElement = null;

  function trapFocus(modal) {
    if (!modal) return;
    previousActiveElement = document.activeElement;
    activeFocusTrap = modal;

    // Disable main background elements for screen-readers
    const container = document.querySelector('.garden-wrapper-root');
    if (container) container.setAttribute('inert', '');
    modal.removeAttribute('inert');

    const focusableElements = modal.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
    if (focusableElements.length === 0) return;

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    firstElement.focus();

    modal._focusTrapListener = function(e) {
      if (e.key !== 'Tab') return;

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          lastElement.focus();
          e.preventDefault();
        }
      } else {
        if (document.activeElement === lastElement) {
          firstElement.focus();
          e.preventDefault();
        }
      }
    };

    modal.addEventListener('keydown', modal._focusTrapListener);
  }

  function releaseFocus() {
    if (!activeFocusTrap) return;

    // Enable main background elements
    const container = document.querySelector('.garden-wrapper-root');
    if (container) container.removeAttribute('inert');

    activeFocusTrap.removeEventListener('keydown', activeFocusTrap._focusTrapListener);
    delete activeFocusTrap._focusTrapListener;
    
    activeFocusTrap = null;

    if (previousActiveElement) {
      previousActiveElement.focus();
    }
  }

  // --- TOASTS SYSTEM ---
  function showToast(message, type = 'success') {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    let icon = '🌱';
    if (type === 'info') icon = '🌼';
    if (type === 'danger') icon = '⚠';

    toast.innerHTML = `<span class="hand-drawn">${icon}</span> <span>${message}</span>`;
    container.appendChild(toast);

    setTimeout(() => toast.classList.add('show'), 10);

    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  }

  // --- SUPABASE DATABASE FLOWS ---
  function dataURLtoBlob(dataurl) {
    const arr = dataurl.split(',');
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], { type: mime });
  }

  async function fetchSupabaseFlowers() {
    if (!supabase) return;
    try {
      let query = supabase.from('drawings')
        .select('path, caption, flagged, created_at, author, description')
        .or('flagged.is.null,flagged.eq.false');
      let { data, error } = await query.order('created_at', { ascending: false }).limit(60);
      
      if (error && (error.message.includes('column') || error.code === 'PGRST204')) {
        const fallbackQuery = supabase.from('drawings')
          .select('path, caption, flagged, created_at')
          .or('flagged.is.null,flagged.eq.false');
        const fallbackRes = await fallbackQuery.order('created_at', { ascending: false }).limit(60);
        data = fallbackRes.data;
        error = fallbackRes.error;
      }

      if (error) throw error;
      
      if (data && data.length > 0) {
        const dbFlowers = data.map((row) => {
          const { data: publicData } = supabase.storage.from('drawings').getPublicUrl(row.path);
          return {
            id: `db-doodle-${row.path.replace(/\//g, '_')}`,
            title: row.caption || 'Unnamed Flower',
            category: 'user',
            tag: 'Planted Flower',
            date: row.created_at
              ? new Intl.DateTimeFormat("en-US", { month: "short", year: "numeric" }).format(new Date(row.created_at))
              : "Recent Plant",
            likes: 0,
            author: row.author || 'Anonymous',
            description: row.description || '',
            imageSrc: publicData.publicUrl
          };
        });
        
        flowersList = [...dbFlowers];
        renderGardenSky();
        showToast("Garden database loaded!", "info");
      }
    } catch (err) {
      console.warn("Could not retrieve garden database:", err);
    }
  }
});
