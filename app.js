/* ==========================================================================
   CONSTELLATION APPS CONTROLLER (app.js)
   ========================================================================== */

import { supabase } from './supabase.js';

document.addEventListener('DOMContentLoaded', () => {
  // --- STATE MANAGEMENT ---
  let doodlesList = [...PORTFOLIO_DOODLES]; // Combines preloaded & database doodles
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
    setupResumeTabs();
    setupContactForm();
    setupFloatingDoodlesInteraction();
    
    // Load drawings from Supabase in background
    fetchSupabaseDoodles();
  }

  // --- CELESTIAL NAV ---
  function setupNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('.page-section');
    const options = {
      root: null,
      threshold: 0.2,
      rootMargin: '-80px 0px 0px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('id');
          navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${id}`) {
              link.classList.add('active');
            }
          });
        }
      });
    }, options);

    sections.forEach(sec => observer.observe(sec));
  }

  // --- PALETTE UI GENERATION ---
  function setupColorPalette() {
    const paletteContainer = document.getElementById('color-palette');
    if (!paletteContainer) return;
    paletteContainer.innerHTML = '';

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

  // --- DRAWING TOOLKIT INTERACTIONS ---
  function setupCanvasControls() {
    // Brush Size
    const sizeSlider = document.getElementById('brush-size');
    const sizeVal = document.getElementById('brush-size-val');
    sizeSlider.addEventListener('input', (e) => {
      mainCanvas.brushSize = e.target.value;
      sizeVal.textContent = `${e.target.value}px`;
    });

    // Opacity
    const opacitySlider = document.getElementById('brush-opacity');
    const opacityVal = document.getElementById('brush-opacity-val');
    opacitySlider.addEventListener('input', (e) => {
      mainCanvas.brushOpacity = e.target.value / 100;
      opacityVal.textContent = `${e.target.value}%`;
    });

    // Tool selectors
    const toolBtns = document.querySelectorAll('.tool-btn');
    toolBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        toolBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        mainCanvas.currentTool = btn.dataset.tool;
      });
    });

    // Shape selectors
    const shapeBtns = document.querySelectorAll('.shape-btn');
    shapeBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        shapeBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        mainCanvas.currentShape = btn.dataset.shape;
      });
    });

    // Actions
    document.getElementById('undo-btn').addEventListener('click', () => mainCanvas.undo());
    document.getElementById('redo-btn').addEventListener('click', () => mainCanvas.redo());
    document.getElementById('clear-btn').addEventListener('click', () => {
      mainCanvas.clear();
      showToast('Forge wiped clean!', 'info');
    });

    // Download PNG
    document.getElementById('download-btn').addEventListener('click', () => {
      const dataUrl = mainCanvas.getMergedDataURL(true); // always dark celestial backdrop
      const link = document.createElement('a');
      link.download = `constellation_${Date.now()}.png`;
      link.href = dataUrl;
      link.click();
      showToast('Constellation chart downloaded!', 'success');
    });

    // Save/Post to Constellation Garden Island
    document.getElementById('save-gallery-btn').addEventListener('click', async () => {
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

      // Scroll to garden
      document.getElementById('garden').scrollIntoView({ behavior: 'smooth' });
      
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
  // Generates deterministic coordinates relative to the island surface bounds
  function getCoordinatesForId(id) {
    let hash = 0;
    for (let i = 0; i < id.length; i++) {
      hash = id.charCodeAt(i) + ((hash << 5) - hash);
    }
    
    // Deterministic X percentage between 18% and 82%
    const x = 18 + (Math.abs(hash) % 65);
    
    // Deterministic Y percentage between 20% and 72%
    const y = 20 + (Math.abs(hash * 37) % 53);
    
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

    filtered.forEach(doodle => {
      const coords = getCoordinatesForId(doodle.id);
      
      const node = document.createElement('div');
      node.className = `constellation-node type-${doodle.category}`;
      node.setAttribute('data-star-id', doodle.id);
      node.style.left = `${coords.x}px`;
      node.style.top = `${coords.y}px`;

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
        // Prevent click triggers from bubbling into panning container
        e.stopPropagation();
        openLightbox(doodle);
      });

      layer.appendChild(node);
    });
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

  // --- OBSERVATORY RESUME TABS ---
  function setupResumeTabs() {
    const tabs = document.querySelectorAll('.resume-tab');
    const contentPanel = document.getElementById('resume-tab-content');
    
    const loadTab = (tabName) => {
      contentPanel.style.opacity = '0';
      
      setTimeout(() => {
        if (tabName === 'profile') {
          renderProfileTab();
        } else if (tabName === 'skills') {
          renderSkillsTab();
        } else if (tabName === 'experience') {
          renderExperienceTab();
        }
        contentPanel.style.opacity = '1';
      }, 150);
    };

    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        tabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        loadTab(tab.dataset.tab);
      });
    });

    loadTab('profile');
  }

  function renderProfileTab() {
    const panel = document.getElementById('resume-tab-content');
    panel.innerHTML = `
      <div class="profile-grid">
        <div class="profile-avatar-box space-border">
          ${RESUME_PROFILE.avatarSvg}
        </div>
        <div class="profile-details">
          <h3 class="hand-drawn">${RESUME_PROFILE.name}</h3>
          <div class="profile-title hand-drawn">${RESUME_PROFILE.title}</div>
          <p class="profile-bio">${RESUME_PROFILE.bio}</p>
          <ul class="profile-quick-facts">
            ${RESUME_PROFILE.facts.map(fact => `
              <li>
                <span class="bullet">✦</span>
                <span class="fact-text">${fact}</span>
              </li>
            `).join('')}
          </ul>
        </div>
      </div>
    `;
  }

  // Renders skills as glowing orbiting planet grids
  function renderSkillsTab() {
    const panel = document.getElementById('resume-tab-content');
    
    panel.innerHTML = `
      <div class="orbit-universe space-border">
        <!-- Central Sun -->
        <div class="orbit-core-sun" title="Astronomer Core (Bhavay)">
          <span class="sun-label hand-drawn">Developer</span>
          <span class="sun-label hand-drawn">Core</span>
        </div>
        
        <!-- Orbit rings background -->
        <div class="orbit-path-ring ring-1"></div>
        <div class="orbit-path-ring ring-2"></div>
        <div class="orbit-path-ring ring-3"></div>
        
        <!-- Rotator Ring 1: Fast (Frontend Core) -->
        <div class="orbit-rotator speed-fast">
          <div class="orbit-planet-node planet-js" title="JavaScript">
            <div class="planet-sphere type-js"></div>
            <div class="planet-label hand-drawn">JavaScript<br><strong>92%</strong></div>
          </div>
          <div class="orbit-planet-node planet-canvas" title="Canvas &amp; SVGs">
            <div class="planet-sphere type-git"></div>
            <div class="planet-label hand-drawn">Canvas &amp; SVGs<br><strong>88%</strong></div>
          </div>
        </div>
        
        <!-- Rotator Ring 2: Medium (SaaS / Styling Frameworks) -->
        <div class="orbit-rotator speed-medium">
          <div class="orbit-planet-node planet-react" title="React / Next.js">
            <div class="planet-sphere type-js"></div>
            <div class="planet-label hand-drawn">React / Next.js<br><strong>85%</strong></div>
          </div>
          <div class="orbit-planet-node planet-css" title="CSS3 Animations">
            <div class="planet-sphere type-css"></div>
            <div class="planet-label hand-drawn">CSS &amp; Keyframes<br><strong>95%</strong></div>
          </div>
          <div class="orbit-planet-node planet-node" title="Node.js">
            <div class="planet-sphere type-backend"></div>
            <div class="planet-label hand-drawn">Node.js / Express<br><strong>80%</strong></div>
          </div>
        </div>
        
        <!-- Rotator Ring 3: Slow (System Core databases & versionings) -->
        <div class="orbit-rotator speed-slow">
          <div class="orbit-planet-node planet-db" title="SQL / NoSQL Databases">
            <div class="planet-sphere type-backend"></div>
            <div class="planet-label hand-drawn">DBs (Postgres/Mongo)<br><strong>75%</strong></div>
          </div>
          <div class="orbit-planet-node planet-api" title="API gateways (REST/GraphQL)">
            <div class="planet-sphere type-backend"></div>
            <div class="planet-label hand-drawn">REST / GraphQL APIs<br><strong>84%</strong></div>
          </div>
          <div class="orbit-planet-node planet-git" title="Git / Devops workflow">
            <div class="planet-sphere type-git"></div>
            <div class="planet-label hand-drawn">Git Versioning<br><strong>82%</strong></div>
          </div>
        </div>
      </div>
    `;
  }

  // Renders experience as milestone constellations
  function renderExperienceTab() {
    const panel = document.getElementById('resume-tab-content');
    panel.innerHTML = `
      <div class="timeline-container">
        <div class="timeline-line"></div>
        ${RESUME_EXPERIENCE.map(job => `
          <div class="timeline-node">
            <div class="timeline-bullet"></div>
            <div class="timeline-time">${job.time}</div>
            <div class="timeline-content">
              <h4 class="timeline-role">${job.role}</h4>
              <div class="timeline-company hand-drawn">${job.company}</div>
              <p class="timeline-desc">${job.desc}</p>
            </div>
          </div>
        `).join('')}
      </div>
    `;
  }

  // --- CONTACT SIGNAL FORM ---
  function setupContactForm() {
    const form = document.getElementById('contact-form');
    const status = document.getElementById('form-status');
    if (!form) return;

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const submitBtn = form.querySelector('button[type="submit"]');
      const origText = submitBtn.innerHTML;
      
      submitBtn.disabled = true;
      submitBtn.innerHTML = 'Broadcasting signal... 📡';
      status.textContent = '';

      setTimeout(() => {
        showToast('Telemetry signal broadcasted successfully!', 'success');
        submitBtn.disabled = false;
        submitBtn.innerHTML = origText;
        status.innerHTML = '<span style="color:var(--ink-success)">✓ Transmission acknowledged by ground control!</span>';
        form.reset();
      }, 1500);
    });
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
        
        doodlesList = [...PORTFOLIO_DOODLES, ...dbDoodles];
        renderCelestialSky();
        showToast("Astronomical database loaded!", "info");
      }
    } catch (err) {
      console.warn("Could not retrieve space telemetry from Supabase:", err);
    }
  }
});
