/* ==========================================================================
   CONSTELLATION APPS CONTROLLER (app.js)
   ========================================================================== */

import { supabase } from './supabase.js';

document.addEventListener('DOMContentLoaded', () => {
  // --- STATE MANAGEMENT ---
  let doodlesList = []; // Clean slate, only user drawings from Supabase
  let currentFilter = 'all';
  
  // Canvas Instantiation
  const mainCanvas = new SketchCanvas('paint-canvas');

  // --- PALETTE DEFINITIONS (Celestial Neon Colors) ---
  const CELESTIAL_PALETTE = [
    { name: 'Comet White', hex: '#ffffff' },
    { name: 'Sun Gold', hex: '#ffd740' },
    { name: 'Cosmic Cyan', hex: '#00e5ff' },
    { name: 'Nebula Pink', hex: '#ff4081' },
    { name: 'Stardust Violet', hex: '#e040fb' },
    { name: 'Aurora Teal', hex: '#1de9b6' }
  ];

  // --- INITIALIZATION ---
  initApp();

  function initApp() {
    setupNavigation();
    setupColorPalette();
    setupCanvasControls();
    setupMobileDrawer();
    renderCelestialSky();
    setupGalleryFilters();
    setupFloatingDoodlesInteraction();
    setupOnboarding();
    setupGalleryToolbar();
    
    // Listen to canvas change to toggle Place button disabled state
    const saveBtn = document.getElementById('save-gallery-btn');
    const paintCanvas = document.getElementById('paint-canvas');
    if (paintCanvas && saveBtn) {
      paintCanvas.addEventListener('canvas-changed', (e) => {
        saveBtn.disabled = !e.detail.hasDrawn;
        
        // Also enable/disable undo button
        const undoBtn = document.getElementById('undo-btn');
        if (undoBtn) {
          undoBtn.disabled = mainCanvas.historyIndex <= 0;
        }
      });
    }

    // Load drawings from Supabase in background
    fetchSupabaseDoodles();
  }

  // --- CELESTIAL NAV (OVERLAY TOGGLES, NO BODY SCROLL) ---
  function setupNavigation() {
    const navLinks = document.querySelectorAll('.nav-link-btn');
    const galleryOverlay = document.getElementById('gallery-archive');
    const closeGalleryBtn = document.getElementById('close-gallery-btn');
    const floatingBtn = document.querySelector('.floating-gallery-btn');

    function openGallery() {
      if (galleryOverlay) {
        galleryOverlay.classList.add('active');
        trapFocus(galleryOverlay);
        document.body.style.overflow = 'hidden';
      }
      navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === '#gallery-archive') {
          link.classList.add('active');
        }
      });
    }

    function closeGallery() {
      if (galleryOverlay) {
        galleryOverlay.classList.remove('active');
        releaseFocus();
        document.body.style.overflow = '';
      }
      navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === '#space') {
          link.classList.add('active');
        }
      });
    }

    // Intercept nav links clicks
    navLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const target = link.getAttribute('href');
        if (target === '#gallery-archive') {
          openGallery();
        } else if (target === '#about') {
          closeGallery();
          const aboutSection = document.getElementById('about');
          if (aboutSection) aboutSection.scrollIntoView({ behavior: 'smooth' });
        } else {
          closeGallery();
          const spaceSection = document.getElementById('space');
          if (spaceSection) spaceSection.scrollIntoView({ behavior: 'smooth' });
        }
      });
    });

    // Intercept floating button click
    if (floatingBtn) {
      floatingBtn.addEventListener('click', (e) => {
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

    // Scroll Spy
    const sections = document.querySelectorAll('section');
    window.addEventListener('scroll', () => {
      if (galleryOverlay && galleryOverlay.classList.contains('active')) return;
      
      let currentSectionId = 'space';
      const scrollPos = window.scrollY + 160;
      
      sections.forEach(sec => {
        if (sec.id === 'gallery-archive') return;
        const secTop = sec.offsetTop;
        const secHeight = sec.offsetHeight;
        if (scrollPos >= secTop && scrollPos < secTop + secHeight) {
          currentSectionId = sec.id;
        }
      });
      
      navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${currentSectionId}`) {
          link.classList.add('active');
        }
      });
    });
  }

  // Onboarding Setup
  function setupOnboarding() {
    const banner = document.getElementById('onboarding-banner');
    const closeBtn = document.getElementById('close-onboarding-btn');
    if (!banner || !closeBtn) return;

    if (!localStorage.getItem('doodle_gallery_onboarded')) {
      banner.classList.add('active');
      setTimeout(() => trapFocus(banner), 100);
    }

    closeBtn.addEventListener('click', () => {
      banner.classList.remove('active');
      localStorage.setItem('doodle_gallery_onboarded', 'true');
      releaseFocus();
      
      // Open Draw drawer panel
      const drawer = document.getElementById('forge-panel');
      if (drawer) {
        drawer.classList.add('active');
        const firstInput = drawer.querySelector('input');
        if (firstInput) setTimeout(() => firstInput.focus(), 100);
      }
    });
  }

  // --- PALETTE UI GENERATION ---
  function setupColorPalette() {
    const paletteContainer = document.getElementById('color-palette');
    if (!paletteContainer) return;
    paletteContainer.innerHTML = '';

    // Set initial canvas drawing color to the first palette item
    if (CELESTIAL_PALETTE.length > 0) {
      mainCanvas.currentColor = CELESTIAL_PALETTE[0].hex;
    }

    CELESTIAL_PALETTE.forEach((color, idx) => {
      const bubble = document.createElement('button');
      bubble.className = `color-bubble ${idx === 0 ? 'active' : ''}`;
      bubble.style.backgroundColor = color.hex;
      bubble.style.color = color.hex; // sets glow shadow color in css
      bubble.title = color.name;
      bubble.setAttribute('aria-label', color.name);

      bubble.addEventListener('click', () => {
        paletteContainer.querySelectorAll('.color-bubble').forEach(b => b.classList.remove('active'));
        bubble.classList.add('active');
        mainCanvas.currentColor = color.hex;
        
        const customColor = document.getElementById('custom-color');
        if (customColor) customColor.value = color.hex;
      });

      paletteContainer.appendChild(bubble);
    });

    const customColor = document.getElementById('custom-color');
    if (customColor) {
      customColor.value = CELESTIAL_PALETTE[0].hex;
      customColor.addEventListener('input', (e) => {
        paletteContainer.querySelectorAll('.color-bubble').forEach(b => b.classList.remove('active'));
        mainCanvas.currentColor = e.target.value;
      });
    }
  }

  // --- SPACE ART CLASSIFIER / MODERATION ---
  function classifyCosmicDrawing() {
    const canvas = document.getElementById('paint-canvas');
    if (!canvas) return { isValid: false, reason: 'No canvas found.' };
    
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    
    // Get image data to count active pixels
    const imgData = ctx.getImageData(0, 0, width, height);
    const data = imgData.data;
    
    let activePixels = 0;
    let minX = width, maxX = 0;
    let minY = height, maxY = 0;
    
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const idx = (y * width + x) * 4;
        const alpha = data[idx + 3];
        if (alpha > 10) { // non-transparent pixels
          activePixels++;
          if (x < minX) minX = x;
          if (x > maxX) maxX = x;
          if (y < minY) minY = y;
          if (y > maxY) maxY = y;
        }
      }
    }
    
    // 1. Check if user has drawn anything
    if (activePixels === 0) {
      return { isValid: false, reason: "Please draw something first!" };
    }
    
    const dpr = window.devicePixelRatio || 1;
    // 2. Check if too small
    if (activePixels < 25 * dpr * dpr) {
      return { isValid: false, reason: "not a space shit! That's too small to be a constellation." };
    }
    
    // 3. Check if too dense (just scribbles)
    const totalPixels = width * height;
    const density = activePixels / totalPixels;
    if (density > 0.40) {
      return { isValid: false, reason: "not a space shit! That's just a black hole of scribbles." };
    }
    
    const boxW = maxX - minX;
    const boxH = maxY - minY;
    const aspectRatio = boxW / boxH;
    
    // 4. Bounding box size check
    if (boxW < 12 * dpr && boxH < 12 * dpr) {
      return { isValid: false, reason: "not a space shit! That's just a tiny speck." };
    }
    
    // 5. Sun check (Cannot draw another sun)
    const titleInput = document.getElementById('doodle-title');
    const title = (titleInput ? titleInput.value : '').toLowerCase().trim();
    
    if (title.includes('sun') || title === 'sol' || title.includes('sol ')) {
      return { isValid: false, reason: "no 2 suns mf" };
    }
    
    // 6. Keyword analysis (excludes 'sun' and 'sol' to enforce specific warning above)
    const spaceKeywords = ['star', 'planet', 'ufo', 'alien', 'comet', 'galaxy', 'moon', 'meteor', 'rocket', 'saturn', 'mars', 'jupiter', 'constellation', 'nebula', 'asteroid', 'orbit', 'spaceship', 'cosmos', 'saucer', 'shuttle', 'nova', 'supernova', 'zenith'];
    const hasSpaceKeyword = spaceKeywords.some(keyword => title.includes(keyword));
    
    // If aspect ratio is extremely narrow (e.g. drawing just a single vertical or horizontal slash)
    if ((aspectRatio > 6 || aspectRatio < 0.17) && !hasSpaceKeyword) {
      return { isValid: false, reason: "not a space shit! That is just a straight line." };
    }
    
    return { isValid: true };
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

    const undoBtn = document.getElementById('undo-btn');
    if (undoBtn) {
      undoBtn.addEventListener('click', () => {
        mainCanvas.undo();
        undoBtn.disabled = mainCanvas.historyIndex <= 0;
      });
    }

    // Save/Post to Doodle Garden Island
    document.getElementById('save-gallery-btn').addEventListener('click', async () => {
      if (!mainCanvas.hasDrawn) {
        showToast("Draw something first!", "danger");
        return;
      }

      // Check if the drawing is valid space art
      const check = classifyCosmicDrawing();
      if (!check.isValid) {
        showToast(check.reason, "danger");
        return;
      }

      const titleInput = document.getElementById('doodle-title');
      const authorInput = document.getElementById('doodle-author');
      const descInput = document.getElementById('doodle-desc');

      const title = titleInput.value.trim();
      const author = authorInput.value.trim() || 'Anonymous';
      const description = descInput.value.trim();

      if (!title) {
        showToast("Please enter a title for your doodle!", "danger");
        titleInput.focus();
        return;
      }
      if (!description) {
        showToast("Please enter a description for your doodle!", "danger");
        descInput.focus();
        return;
      }
      
      const saveBtn = document.getElementById('save-gallery-btn');
      const originalText = saveBtn.innerHTML;
      
      // Get the image merged with space texture
      const mergedImgData = mainCanvas.getMergedDataURL(true); // always dark celestial
      let imageSrc = mergedImgData;

      const randomId = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
      const filename = `${Date.now()}-${randomId}.png`;
      const path = `public/${filename}`;
      const newId = `db-doodle-${path.replace(/\//g, '_')}`;

      if (supabase) {
        try {
          saveBtn.disabled = true;
          saveBtn.innerHTML = `<span>⏳</span> Beaming Star...`;
          
          const blob = dataURLtoBlob(mergedImgData);
          
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
          
          showToast(`Successfully birthed "${title}" in the garden!`, 'success');
        } catch (err) {
          console.error("Supabase stargaze upload failed, saving locally:", err);
          showToast("Failed to beam online. Saved in local session.", "danger");
        } finally {
          saveBtn.disabled = false;
          saveBtn.innerHTML = originalText;
        }
      } else {
        showToast(`Successfully birthed "${title}" in local session!`, 'success');
      }

      const newDoodle = {
        id: newId,
        title: title,
        category: 'user',
        tag: supabase ? 'Supabase Doodle' : 'Guest Doodle',
        date: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
        likes: 0,
        author: author,
        description: description,
        techTags: supabase 
           ? ['Supabase DB', 'Supabase Storage', 'Canvas API']
           : ['Canvas API', 'Telemetry Saved'],
        imageSrc: imageSrc
      };

      // Add to list and re-render
      doodlesList.unshift(newDoodle);
      renderCelestialSky();
      
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
      }

      // Scroll to space dashboard
      document.getElementById('space').scrollIntoView({ behavior: 'smooth' });
      
      // Pulse the new star
      setTimeout(() => {
        focusViewportOnStar(newId);
      }, 500);
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
          if (confirm("You have unsaved work. Discard and close?")) {
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

  // Pulses a newly created star node
  function focusViewportOnStar(starId) {
    const node = document.querySelector(`[data-star-id="${starId}"]`);
    if (!node) return;

    // Briefly trigger starlight pulse ring to identify the node
    const pulseRing = node.querySelector('.star-pulse-ring');
    if (pulseRing) {
      pulseRing.style.animationDuration = '0.5s';
      setTimeout(() => {
        pulseRing.style.animationDuration = '2.2s';
      }, 1500);
    }
  }

  // --- STAR POSITIONING & RENDERING ON ISLAND ---
  // Generates deterministic coordinates forming an orbit around the central sun
  function getCoordinatesForId(id) {
    let hash = 0;
    for (let i = 0; i < id.length; i++) {
      hash = id.charCodeAt(i) + ((hash << 5) - hash);
    }
    
    // Scatter coordinates pseudo-randomly across the entire sky viewport (12% to 88% on X, 12% to 82% on Y)
    let x = 12 + (Math.abs(hash) % 76);
    let y = 12 + (Math.abs(hash * 37) % 70);
    
    // Deterministically push coordinates away if they overlap the central sun area
    // Sun bounding box roughly: X in [38, 62], Y in [32, 68]
    if (x >= 38 && x <= 62 && y >= 32 && y <= 68) {
      if (hash % 2 === 0) {
        // Push horizontally away from the center
        x = x < 50 ? x - 25 : x + 25;
      } else {
        // Push vertically away from the center
        y = y < 50 ? y - 25 : y + 25;
      }
      // Clamp coordinates to ensure they remain inside viewport boundaries
      x = Math.max(12, Math.min(88, x));
      y = Math.max(12, Math.min(82, y));
    }
    
    return { x, y };
  }

  function renderCelestialSky() {
    const layer = document.getElementById('constellations-layer');
    if (!layer) return;
    layer.innerHTML = '';

    const searchQuery = document.getElementById('gallery-search').value.toLowerCase().trim();

    // 1. Render nodes overlaying the central floating island
    const filtered = doodlesList.filter(item => {
      const matchesCategory = (currentFilter === 'all' || item.category === currentFilter);
      const matchesSearch = item.title.toLowerCase().includes(searchQuery) ||
                            (item.description && item.description.toLowerCase().includes(searchQuery)) ||
                            item.techTags.some(t => t.toLowerCase().includes(searchQuery));
      return matchesCategory && matchesSearch;
    });

    filtered.forEach(doodle => {
      const coords = getCoordinatesForId(doodle.id);
      
      const node = document.createElement('div');
      node.className = `constellation-node type-${doodle.category}`;
      node.setAttribute('data-star-id', doodle.id);
      node.style.left = `${coords.x}%`;
      node.style.top = `${coords.y}%`;

      node.style.setProperty('--float-duration', `${4 + (Math.abs(coords.x + coords.y) % 5)}s`);
      node.style.setProperty('--float-delay', `${-(Math.abs(coords.x * coords.y) % 8)}s`);

      let mediaContent = '';
      if (doodle.svg) {
        mediaContent = doodle.svg;
      } else if (doodle.imageSrc) {
        mediaContent = `<img src="${doodle.imageSrc}" alt="${doodle.title}" loading="lazy">`;
      }

      node.innerHTML = `
        <div class="star-glow-dot"></div>
        <div class="star-pulse-ring"></div>
        
        <div class="star-tooltip space-border">
          <div class="tooltip-media">
            ${mediaContent}
          </div>
          <div class="tooltip-title hand-drawn">${doodle.title}</div>
          <div class="tooltip-meta">By ${doodle.author}</div>
        </div>
      `;

      node.addEventListener('click', (e) => {
        e.stopPropagation();
        openLightbox(doodle);
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
      
      // Filter list for catalog grid specifically
      let archiveFiltered = doodlesList.filter(item => {
        const matchesCategory = (currentFilter === 'all' || item.category === currentFilter);
        const matchesSearch = item.title.toLowerCase().includes(archiveSearchQuery) ||
                              item.author.toLowerCase().includes(archiveSearchQuery) ||
                              (item.description && item.description.toLowerCase().includes(archiveSearchQuery));
        return matchesCategory && matchesSearch;
      });

      // Sort list for catalog grid specifically
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

      archiveFiltered.forEach(doodle => {
        const card = document.createElement('div');
        card.className = 'archive-card';

        let mediaContent = '';
        if (doodle.svg) {
          mediaContent = doodle.svg;
        } else if (doodle.imageSrc) {
          mediaContent = `<img src="${doodle.imageSrc}" alt="${doodle.title}" loading="lazy">`;
        }

        card.innerHTML = `
          <div class="archive-media">
            ${mediaContent}
          </div>
          <div class="archive-info">
            <h4 class="archive-title hand-drawn">${doodle.title}</h4>
            <div class="archive-meta">By ${doodle.author} &bull; ${doodle.date}</div>
          </div>
          <div class="archive-footer">
            <button class="archive-btn like-btn" data-action="like">
              <span>♥</span> <span class="like-count-val">${doodle.likes}</span>
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
          doodle.likes++;
          card.querySelector('.like-count-val').textContent = doodle.likes;
          showToast(`Liked "${doodle.title}"!`, 'success');
          renderCelestialSky();
        });

        const inspectBtn = card.querySelector('[data-action="inspect"]');
        inspectBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          openLightbox(doodle);
        });

        card.addEventListener('click', () => {
          openLightbox(doodle);
        });

        archiveGrid.appendChild(card);
      });
    }
  }

  function setupGalleryFilters() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentFilter = btn.dataset.filter;
        renderCelestialSky();
      });
    });

    const searchInput = document.getElementById('gallery-search');
    if (searchInput) {
      searchInput.addEventListener('input', () => {
        renderCelestialSky();
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
        renderCelestialSky();
      });
    }

    if (archiveSort) {
      archiveSort.addEventListener('change', () => {
        renderCelestialSky();
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
        document.getElementById('space').scrollIntoView({ behavior: 'smooth' });
      });
    }
  }

  // --- LIGHTBOX FLOWS ---
  function openLightbox(doodle) {
    const lightbox = document.getElementById('doodle-lightbox');
    const mediaContainer = document.getElementById('lightbox-media-container');
    const tagSpan = document.getElementById('lightbox-tag');
    const titleHeader = document.getElementById('lightbox-title');
    const authorSpan = document.getElementById('lightbox-author');
    const dateSpan = document.getElementById('lightbox-date');
    const descP = document.getElementById('lightbox-description');
    const techTagsList = document.getElementById('lightbox-tech-tags');
    const downloadBtn = document.getElementById('lightbox-download');
    const likeBtn = document.getElementById('lightbox-like');
    const likeCountSpan = document.getElementById('like-count');

    // Populate media
    mediaContainer.innerHTML = '';
    if (doodle.svg) {
      mediaContainer.innerHTML = doodle.svg;
    } else if (doodle.imageSrc) {
      mediaContainer.innerHTML = `<img src="${doodle.imageSrc}" alt="${doodle.title}">`;
    }

    // Set Download Log Link to download log JSON file
    const logData = {
      title: doodle.title,
      author: doodle.author,
      date: doodle.date,
      likes: doodle.likes,
      description: doodle.description || 'A user-forged doodle.',
      techTags: doodle.techTags,
      imageSrc: doodle.imageSrc
    };
    const jsonBlob = new Blob([JSON.stringify(logData, null, 2)], { type: 'application/json' });
    downloadBtn.href = URL.createObjectURL(jsonBlob);
    downloadBtn.download = `${doodle.title.replace(/\s+/g, '_')}_log.json`;

    // Details text
    tagSpan.textContent = doodle.tag;
    titleHeader.textContent = doodle.title;
    authorSpan.textContent = doodle.author;
    dateSpan.textContent = doodle.date;
    descP.textContent = doodle.description || 'No description provided.';
    likeCountSpan.textContent = doodle.likes;

    // Tech tags
    techTagsList.innerHTML = '';
    doodle.techTags.forEach(tag => {
      const badge = document.createElement('span');
      badge.className = 'tech-tag hand-drawn';
      badge.textContent = tag;
      techTagsList.appendChild(badge);
    });

    // Clear and reset like button action listener
    const newLikeBtn = likeBtn.cloneNode(true);
    likeBtn.parentNode.replaceChild(newLikeBtn, likeBtn);
    newLikeBtn.addEventListener('click', () => {
      doodle.likes++;
      likeCountSpan.textContent = doodle.likes;
      showToast(`Liked "${doodle.title}"!`, 'success');
      
      // Update star node details
      renderCelestialSky();
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
    const container = document.querySelector('.content-container');
    const nav = document.querySelector('.app-nav');
    const footer = document.querySelector('.app-footer');
    if (container) container.setAttribute('inert', '');
    if (nav && modal.id !== 'gallery-archive') nav.setAttribute('inert', '');
    if (footer) footer.setAttribute('inert', '');
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
    const container = document.querySelector('.content-container');
    const nav = document.querySelector('.app-nav');
    const footer = document.querySelector('.app-footer');
    if (container) container.removeAttribute('inert');
    if (nav) nav.removeAttribute('inert');
    if (footer) footer.removeAttribute('inert');

    activeFocusTrap.removeEventListener('keydown', activeFocusTrap._focusTrapListener);
    delete activeFocusTrap._focusTrapListener;
    
    const prevTrap = activeFocusTrap;
    activeFocusTrap = null;

    if (previousActiveElement) {
      previousActiveElement.focus();
    }
  }



  // --- FLOATING BACKGROUND INTERACTIVE DECORATION ---
  function setupFloatingDoodlesInteraction() {
    document.addEventListener('mousemove', (e) => {
      const doodles = document.querySelectorAll('.floating-doodle');
      const mouseX = e.clientX / window.innerWidth - 0.5;
      const mouseY = e.clientY / window.innerHeight - 0.5;

      doodles.forEach((doodle, idx) => {
        const factor = (idx + 1) * 20;
        const dx = mouseX * factor;
        const dy = mouseY * factor;
        doodle.style.transform = `translate(${dx}px, ${dy}px) rotate(${factor + (dx * 0.1)}deg)`;
      });
    });
  }

  // --- TOASTS SYSTEM ---
  function showToast(message, type = 'success') {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    let icon = '★';
    if (type === 'info') icon = '☄';
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

  async function fetchSupabaseDoodles() {
    if (!supabase) return;
    try {
      let query = supabase.from('drawings').select('path, caption, flagged, created_at, author, description');
      let { data, error } = await query.order('created_at', { ascending: false }).limit(40);
      
      if (error && (error.message.includes('column') || error.code === 'PGRST204')) {
        console.warn("Table does not have new author/description columns yet. Querying standard fields...");
        const fallbackQuery = supabase.from('drawings').select('path, caption, flagged, created_at');
        const fallbackRes = await fallbackQuery.order('created_at', { ascending: false }).limit(40);
        data = fallbackRes.data;
        error = fallbackRes.error;
      }

      if (error) throw error;
      
      if (data && data.length > 0) {
        const dbDoodles = data.map((row) => {
          const { data: publicData } = supabase.storage.from('drawings').getPublicUrl(row.path);
          return {
            id: `db-doodle-${row.path.replace(/\//g, '_')}`,
            title: row.caption || 'Unnamed Doodle',
            category: 'user',
            tag: 'Supabase Doodle',
            date: row.created_at
              ? new Intl.DateTimeFormat("en-US", { month: "short", year: "numeric" }).format(new Date(row.created_at))
              : "Recent Discovery",
            likes: Math.floor(Math.random() * 20) + 5,
            author: row.author || 'Anonymous',
            description: row.description || 'A user-forged doodle stored persistently in our Supabase gallery.',
            techTags: ['Supabase DB', 'Supabase Storage', 'Canvas API'],
            imageSrc: publicData.publicUrl
          };
        });
        
        doodlesList = [...dbDoodles];
        renderCelestialSky();
        showToast("Doodle gallery database loaded!", "info");
      }
    } catch (err) {
      console.warn("Could not retrieve gallery telemetry from Supabase:", err);
    }
  }
});
