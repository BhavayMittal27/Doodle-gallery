/* ==========================================================================
   ANNA'S SECRET GARDEN CONTROLLER (app.js)
   ========================================================================== */

import { supabase } from './supabase.js';

document.addEventListener('DOMContentLoaded', () => {
  // --- STATE MANAGEMENT ---
  let flowersList = []; // Clean slate, only user drawings from Supabase
  let currentFilter = 'all';
  
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
    setupGalleryFilters();
    setupGalleryToolbar();
    
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

  // --- CELESTIAL NAV (OVERLAY TOGGLES, NO BODY SCROLL) ---
  function setupNavigation() {
    const navLinks = document.querySelectorAll('.nav-link-btn');
    const galleryOverlay = document.getElementById('gallery-archive');
    const closeGalleryBtn = document.getElementById('close-gallery-btn');
    const mobileGalleryBtn = document.getElementById('mobile-gallery-btn');

    function openGallery() {
      if (galleryOverlay) {
        galleryOverlay.classList.add('active');
        trapFocus(galleryOverlay);
        document.body.style.overflow = 'hidden';
      }
    }

    function closeGallery() {
      if (galleryOverlay) {
        galleryOverlay.classList.remove('active');
        releaseFocus();
        document.body.style.overflow = '';
      }
    }

    // Fixed bottom right button click
    if (mobileGalleryBtn) {
      mobileGalleryBtn.addEventListener('click', (e) => {
        e.preventDefault();
        openGallery();
      });
    }

    // Close button click
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

    // Set initial canvas drawing color
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
    // Actions
    const clearBtn = document.getElementById('clear-btn');
    if (clearBtn) {
      clearBtn.addEventListener('click', () => {
        mainCanvas.clear();
        showToast('Canvas wiped clean!', 'info');
      });
    }

    // Save/Post to Doodle Garden Island
    document.getElementById('save-gallery-btn').addEventListener('click', async () => {
      if (!mainCanvas.hasDrawn) {
        showToast("Draw something first!", "danger");
        return;
      }

      const titleInput = document.getElementById('doodle-title');
      const authorInput = document.getElementById('doodle-author');
      const descInput = document.getElementById('doodle-desc');

      const title = titleInput.value.trim();
      const author = authorInput.value.trim() || 'Anonymous';
      const description = descInput.value.trim();

      if (!title) {
        showToast("Please enter a title for your flower!", "danger");
        titleInput.focus();
        return;
      }
      if (!description) {
        showToast("Please describe your flower!", "danger");
        descInput.focus();
        return;
      }
      
      const saveBtn = document.getElementById('save-gallery-btn');
      const originalText = saveBtn.innerHTML;
      
      // Get the transparent PNG image directly from the canvas
      const transparentImgData = mainCanvas.canvas.toDataURL();
      let imageSrc = transparentImgData;

      const randomId = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
      const filename = `${Date.now()}-${randomId}.png`;
      const path = `public/${filename}`;
      const newId = `db-doodle-${path.replace(/\//g, '_')}`;

      if (supabase) {
        try {
          saveBtn.disabled = true;
          saveBtn.innerHTML = `<span>⏳</span> Planting...`;
          
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
          
          showToast(`Successfully planted "${title}" in the garden!`, 'success');
        } catch (err) {
          console.error("Supabase plant upload failed, saving locally:", err);
          showToast("Failed to plant online. Saved in local session.", "danger");
        } finally {
          saveBtn.disabled = false;
          saveBtn.innerHTML = originalText;
        }
      } else {
        showToast(`Successfully planted "${title}" in local session!`, 'success');
      }

      const newFlower = {
        id: newId,
        title: title,
        category: 'user',
        tag: 'Guest Flower',
        date: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
        likes: 0,
        author: author,
        description: description,
        imageSrc: imageSrc
      };

      // Add to list and re-render
      flowersList.unshift(newFlower);
      renderGardenSky();
      
      // Reset controls
      titleInput.value = '';
      authorInput.value = '';
      descInput.value = '';
      mainCanvas.clear();
      saveBtn.disabled = true;

      // Close mobile drawer if active
      const drawer = document.getElementById('forge-panel');
      if (drawer) {
        drawer.classList.remove('active');
        document.body.style.overflow = '';
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

    const searchQuery = document.getElementById('gallery-search') 
      ? document.getElementById('gallery-search').value.toLowerCase().trim() 
      : '';

    // 1. Render transparent flowers directly on the bobbing island image
    const filtered = flowersList.filter(item => {
      const matchesSearch = item.title.toLowerCase().includes(searchQuery) ||
                            (item.description && item.description.toLowerCase().includes(searchQuery)) ||
                            item.author.toLowerCase().includes(searchQuery);
      return matchesSearch;
    });

    filtered.forEach(flower => {
      const coords = getCoordinatesForId(flower.id);
      
      const node = document.createElement('div');
      node.className = `constellation-node type-${flower.category || 'user'}`;
      node.setAttribute('data-star-id', flower.id);
      node.style.left = `${coords.x}%`;
      node.style.top = `${coords.y}%`;

      // Set smooth floating animations
      node.style.setProperty('--float-duration', `${4 + (Math.abs(coords.x + coords.y) % 5)}s`);
      node.style.setProperty('--float-delay', `${-(Math.abs(coords.x * coords.y) % 8)}s`);

      let mediaContent = '';
      if (flower.imageSrc) {
        mediaContent = `<img src="${flower.imageSrc}" alt="${flower.title}" loading="lazy">`;
      }

      node.innerHTML = `
        <div class="constellation-drawing">
          ${mediaContent}
        </div>
        
        <div class="star-tooltip">
          <div class="tooltip-title hand-drawn">${flower.title}</div>
          <div class="tooltip-meta">By ${flower.author}</div>
        </div>
      `;

      node.addEventListener('click', (e) => {
        e.stopPropagation();
        openLightbox(flower);
      });

      layer.appendChild(node);
    });

    // 2. Render cards in the gallery overlay grid
    const archiveGrid = document.getElementById('archive-grid');
    if (archiveGrid) {
      archiveGrid.innerHTML = '';
      
      const archiveSearchQuery = (document.getElementById('archive-search') 
        ? document.getElementById('archive-search').value.toLowerCase().trim() 
        : '');
      
      let archiveFiltered = flowersList.filter(item => {
        const matchesSearch = item.title.toLowerCase().includes(archiveSearchQuery) ||
                              item.author.toLowerCase().includes(archiveSearchQuery) ||
                              (item.description && item.description.toLowerCase().includes(archiveSearchQuery));
        return matchesSearch;
      });

      const sortVal = (document.getElementById('archive-sort') 
        ? document.getElementById('archive-sort').value 
        : 'newest');
        
      if (sortVal === 'newest') {
        archiveFiltered.sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0));
      } else if (sortVal === 'oldest') {
        archiveFiltered.sort((a, b) => new Date(a.date || 0) - new Date(b.date || 0));
      } else if (sortVal === 'liked') {
        archiveFiltered.sort((a, b) => (b.likes || 0) - (a.likes || 0));
      }

      // Handle empty state tab display
      const emptyState = document.getElementById('gallery-empty-state');
      if (emptyState) {
        if (archiveFiltered.length === 0) {
          emptyState.classList.remove('hidden');
        } else {
          emptyState.classList.add('hidden');
        }
      }

      archiveFiltered.forEach(flower => {
        const card = document.createElement('div');
        card.className = 'archive-card';

        let mediaContent = '';
        if (flower.imageSrc) {
          mediaContent = `<img src="${flower.imageSrc}" alt="${flower.title}" loading="lazy">`;
        }

        card.innerHTML = `
          <div class="archive-media">
            ${mediaContent}
          </div>
          <div class="archive-info">
            <h4 class="archive-title hand-drawn">${flower.title}</h4>
            <div class="archive-meta">By ${flower.author} &bull; ${flower.date}</div>
          </div>
          <div class="archive-footer">
            <button class="archive-btn like-btn" data-action="like">
              <span>♥</span> <span class="like-count-val">${flower.likes}</span>
            </button>
            <button class="archive-btn" data-action="inspect">
              <span>🔍</span> Inspect
            </button>
          </div>
        `;

        // Click handlers
        const likeBtn = card.querySelector('[data-action="like"]');
        likeBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          flower.likes++;
          card.querySelector('.like-count-val').textContent = flower.likes;
          showToast(`Liked "${flower.title}"!`, 'success');
          renderGardenSky();
        });

        const inspectBtn = card.querySelector('[data-action="inspect"]');
        inspectBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          openLightbox(flower);
        });

        card.addEventListener('click', () => {
          openLightbox(flower);
        });

        archiveGrid.appendChild(card);
      });
    }
  }

  function setupGalleryFilters() {
    const searchInput = document.getElementById('gallery-search');
    if (searchInput) {
      searchInput.addEventListener('input', () => {
        renderGardenSky();
      });
    }
  }

  // Gallery Toolbar Setup
  function setupGalleryToolbar() {
    const archiveSearch = document.getElementById('archive-search');
    const archiveSort = document.getElementById('archive-sort');
    const emptyStateBtn = document.getElementById('empty-state-draw-btn');

    if (archiveSearch) {
      archiveSearch.addEventListener('input', () => {
        renderGardenSky();
      });
    }

    if (archiveSort) {
      archiveSort.addEventListener('change', () => {
        renderGardenSky();
      });
    }

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
  }

  // --- LIGHTBOX FLOWS ---
  function openLightbox(flower) {
    const lightbox = document.getElementById('doodle-lightbox');
    const mediaContainer = document.getElementById('lightbox-media-container');
    const tagSpan = document.getElementById('lightbox-tag');
    const titleHeader = document.getElementById('lightbox-title');
    const authorSpan = document.getElementById('lightbox-author');
    const dateSpan = document.getElementById('lightbox-date');
    const descP = document.getElementById('lightbox-description');
    const downloadBtn = document.getElementById('lightbox-download');
    const likeBtn = document.getElementById('lightbox-like');
    const likeCountSpan = document.getElementById('like-count');

    // Populate media
    mediaContainer.innerHTML = '';
    if (flower.imageSrc) {
      mediaContainer.innerHTML = `<img src="${flower.imageSrc}" alt="${flower.title}">`;
    }

    // Set Download Log Link
    const logData = {
      title: flower.title,
      author: flower.author,
      date: flower.date,
      likes: flower.likes,
      description: flower.description || 'A planted flower.',
      imageSrc: flower.imageSrc
    };
    const jsonBlob = new Blob([JSON.stringify(logData, null, 2)], { type: 'application/json' });
    downloadBtn.href = URL.createObjectURL(jsonBlob);
    downloadBtn.download = `${flower.title.replace(/\s+/g, '_')}_log.json`;

    // Details text
    tagSpan.textContent = 'Flower';
    titleHeader.textContent = flower.title;
    authorSpan.textContent = flower.author;
    dateSpan.textContent = flower.date;
    descP.textContent = flower.description || 'No description provided.';
    likeCountSpan.textContent = flower.likes;

    // Reset like button action listener
    const newLikeBtn = likeBtn.cloneNode(true);
    likeBtn.parentNode.replaceChild(newLikeBtn, likeBtn);
    newLikeBtn.addEventListener('click', () => {
      flower.likes++;
      likeCountSpan.textContent = flower.likes;
      showToast(`Liked "${flower.title}"!`, 'success');
      renderGardenSky();
    });

    // Show modal
    lightbox.classList.add('active');
    trapFocus(lightbox);

    const closeBtn = document.getElementById('close-lightbox-btn');
    const overlay = document.getElementById('lightbox-close-overlay');
    const closeModal = () => {
      lightbox.classList.remove('active');
      releaseFocus();
    };
    
    closeBtn.onclick = closeModal;
    overlay.onclick = closeModal;
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
      let query = supabase.from('drawings').select('path, caption, flagged, created_at, author, description');
      let { data, error } = await query.order('created_at', { ascending: false }).limit(60);
      
      if (error && (error.message.includes('column') || error.code === 'PGRST204')) {
        console.warn("Table does not have columns yet, trying fallback...");
        const fallbackQuery = supabase.from('drawings').select('path, caption, flagged, created_at');
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
            likes: Math.floor(Math.random() * 20) + 5,
            author: row.author || 'Anonymous',
            description: row.description || 'A flower planted persistently in our garden catalog.',
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
