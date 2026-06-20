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
    
    // Load drawings from Supabase in background
    fetchSupabaseDoodles();
  }

  // --- CELESTIAL NAV (OVERLAY TOGGLES, NO BODY SCROLL) ---
  function setupNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    const galleryOverlay = document.getElementById('gallery-archive');
    const closeGalleryBtn = document.getElementById('close-gallery-btn');
    const floatingBtn = document.querySelector('.floating-gallery-btn');

    function openGallery() {
      if (galleryOverlay) {
        galleryOverlay.classList.add('active');
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
        } else {
          closeGallery();
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
        showToast('Forge wiped clean!', 'info');
      });
    }

    const undoBtn = document.getElementById('undo-btn');
    if (undoBtn) {
      undoBtn.addEventListener('click', () => mainCanvas.undo());
    }

    const redoBtn = document.getElementById('redo-btn');
    if (redoBtn) {
      redoBtn.addEventListener('click', () => mainCanvas.redo());
    }

    const downloadBtn = document.getElementById('download-btn');
    if (downloadBtn) {
      downloadBtn.addEventListener('click', () => {
        const dataUrl = mainCanvas.getMergedDataURL(true);
        const link = document.createElement('a');
        link.download = `constellation_${Date.now()}.png`;
        link.href = dataUrl;
        link.click();
        showToast('Constellation chart downloaded!', 'success');
      });
    }

    // Save/Post to Constellation Garden Island
    document.getElementById('save-gallery-btn').addEventListener('click', async () => {
    // Check if the drawing is valid space art
    const check = classifyCosmicDrawing();
    if (!check.isValid) {
      showToast(check.reason, "danger");
      return;
    }

    const titleInput = document.getElementById('doodle-title');
    const title = titleInput.value.trim() || 'Unnamed Star';
    
    const saveBtn = document.getElementById('save-gallery-btn');
    const originalText = saveBtn.innerHTML;
    
    // Get the image merged with space texture
    const mergedImgData = mainCanvas.getMergedDataURL(true); // always dark celestial
    let imageSrc = mergedImgData;

    const newId = `user-doodle-${Date.now()}`;

    if (supabase) {
      try {
        saveBtn.disabled = true;
        saveBtn.innerHTML = `<span>⏳</span> Beaming Star...`;
        
        const blob = dataURLtoBlob(mergedImgData);
        const filename = `${Date.now()}-${crypto.randomUUID()}.png`;
        const path = `public/${filename}`;
        
        const { error: uploadError } = await supabase.storage
           .from('drawings')
           .upload(path, blob, { contentType: 'image/png', upsert: false });
           
        if (uploadError) throw uploadError;
        
        const { error: insertError } = await supabase
           .from('drawings')
           .insert([{ path, caption: title, flagged: false }]);
           
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
        tag: supabase ? 'Supabase Star' : 'Guest Star',
        date: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
        likes: 0,
        author: 'Guest Astronomer',
        description: supabase 
           ? 'A user-forged constellation stored persistently in our Supabase space catalog.' 
           : 'A custom, interactive constellation saved locally in active session coordinates.',
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
      mainCanvas.clear();

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
    
    if (!drawer) return;
    
    if (openBtn) {
      openBtn.addEventListener('click', () => {
        drawer.classList.add('active');
      });
    }
    
    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        drawer.classList.remove('active');
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
    
    // Deterministic angle (0 to 2*PI)
    const angle = ((Math.abs(hash) % 360) * Math.PI) / 180;
    
    // Deterministic radius: keep it outside the sun core (R_x > 20%, R_y > 22%)
    // But keep it inside the viewport boundary (R_x < 42%, R_y < 38%)
    const radiusX = 22 + (Math.abs(hash * 17) % 18); // 22% to 40% radius in X
    const radiusY = 24 + (Math.abs(hash * 37) % 12); // 24% to 36% radius in Y
    
    const x = 50 + radiusX * Math.cos(angle);
    const y = 50 + radiusY * Math.sin(angle);
    
    return { x, y };
  }

  function renderCelestialSky() {
    const layer = document.getElementById('constellations-layer');
    if (!layer) return;
    layer.innerHTML = '';

    const searchQuery = document.getElementById('gallery-search').value.toLowerCase().trim();

    // Filter list
    const filtered = doodlesList.filter(item => {
      const matchesCategory = (currentFilter === 'all' || item.category === currentFilter);
      const matchesSearch = item.title.toLowerCase().includes(searchQuery) ||
                            item.description.toLowerCase().includes(searchQuery) ||
                            item.techTags.some(t => t.toLowerCase().includes(searchQuery));
      return matchesCategory && matchesSearch;
    });

    // 1. Render nodes overlaying the central floating island
    filtered.forEach(doodle => {
      const coords = getCoordinatesForId(doodle.id);
      
      const node = document.createElement('div');
      node.className = `constellation-node type-${doodle.category}`;
      node.setAttribute('data-star-id', doodle.id);
      node.style.left = `${coords.x}%`;
      node.style.top = `${coords.y}%`;

      // Set individual float animations variables deterministically based on coordinates
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
        
        <!-- Tooltip popover showing preview details -->
        <div class="star-tooltip space-border">
          <div class="tooltip-media">
            ${mediaContent}
          </div>
          <div class="tooltip-title hand-drawn">${doodle.title}</div>
          <div class="tooltip-meta">By ${doodle.author}</div>
        </div>
      `;

      // Click to open inspection details modal
      node.addEventListener('click', (e) => {
        e.stopPropagation();
        openLightbox(doodle);
      });

      layer.appendChild(node);
    });

    // 2. Render cards in the star gallery archive grid below
    const archiveGrid = document.getElementById('archive-grid');
    if (archiveGrid) {
      archiveGrid.innerHTML = '';
      filtered.forEach(doodle => {
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
          showToast(`Cosmic orbit count increased for "${doodle.title}"!`, 'success');
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

    document.getElementById('gallery-search').addEventListener('input', () => {
      renderCelestialSky();
    });
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
      const svgBlob = new Blob([doodle.svg], { type: 'image/svg+xml;charset=utf-8' });
      downloadBtn.href = URL.createObjectURL(svgBlob);
      downloadBtn.download = `${doodle.id}.svg`;
    } else if (doodle.imageSrc) {
      mediaContainer.innerHTML = `<img src="${doodle.imageSrc}" alt="${doodle.title}">`;
      downloadBtn.href = doodle.imageSrc;
      downloadBtn.download = `${doodle.title.replace(/\s+/g, '_')}.png`;
    }

    // Details text
    tagSpan.textContent = doodle.tag;
    titleHeader.textContent = doodle.title;
    authorSpan.textContent = doodle.author;
    dateSpan.textContent = doodle.date;
    descP.textContent = doodle.description;
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
      showToast(`Cosmic orbit count increased for "${doodle.title}"!`, 'success');
      
      // Update star node details
      renderCelestialSky();
    });

    // Show modal
    lightbox.classList.add('active');

    const closeBtn = document.getElementById('close-lightbox-btn');
    const overlay = document.getElementById('lightbox-close-overlay');
    const closeModal = () => lightbox.classList.remove('active');
    
    closeBtn.onclick = closeModal;
    overlay.onclick = closeModal;
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
      const { data, error } = await supabase
        .from('drawings')
        .select('path, caption, flagged, created_at')
        .order('created_at', { ascending: false })
        .limit(40);
        
      if (error) throw error;
      
      if (data && data.length > 0) {
        const dbDoodles = data.map((row, index) => {
          const { data: publicData } = supabase.storage.from('drawings').getPublicUrl(row.path);
          return {
            id: `db-doodle-${row.path.replace(/\//g, '_')}-${index}`,
            title: row.caption || 'Unnamed Star',
            category: 'user',
            tag: 'Supabase Star',
            date: row.created_at
              ? new Intl.DateTimeFormat("en-US", { month: "short", year: "numeric" }).format(new Date(row.created_at))
              : "Recent Discovery",
            likes: Math.floor(Math.random() * 20) + 5,
            author: 'Guest Astronomer',
            description: 'A user-forged constellation stored persistently in our Supabase space catalog.',
            techTags: ['Supabase DB', 'Supabase Storage', 'Canvas API'],
            imageSrc: publicData.publicUrl
          };
        });
        
        doodlesList = [...dbDoodles];
        renderCelestialSky();
        showToast("Astronomical database loaded!", "info");
      }
    } catch (err) {
      console.warn("Could not retrieve space telemetry from Supabase:", err);
    }
  }
});
