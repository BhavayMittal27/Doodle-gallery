/* ==========================================================================
   MAIN APPLICATION CONTROLLER (app.js)
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // --- STATE MANAGEMENT ---
  let doodlesList = [...PORTFOLIO_DOODLES]; // Combines preloaded & user doodles
  let currentFilter = 'all';
  let activeTheme = 'paper'; // paper or chalkboard
  
  // Canvas Instantiations
  const mainCanvas = new SketchCanvas('paint-canvas');
  const heroCanvas = new SketchCanvas('hero-mini-canvas', true);

  // --- PALETTE DEFINITIONS ---
  const PALETTES = {
    paper: [
      { name: 'Graphite', hex: '#2b2b2b' },
      { name: 'Rose Pen', hex: '#ec407a' },
      { name: 'Blue Pen', hex: '#29b6f6' },
      { name: 'Purple Marker', hex: '#ab47bc' },
      { name: 'Green Highlighter', hex: '#9ccc65' },
      { name: 'Red Pen', hex: '#ef5350' }
    ],
    chalkboard: [
      { name: 'White Chalk', hex: '#f5f6f5' },
      { name: 'Pink Chalk', hex: '#ff8da1' },
      { name: 'Blue Chalk', hex: '#8dcbff' },
      { name: 'Purple Chalk', hex: '#e1b1ff' },
      { name: 'Green Chalk', hex: '#b9f6ca' },
      { name: 'Red Chalk', hex: '#ff8a80' }
    ]
  };

  // --- INITIALIZATION ---
  initApp();

  function initApp() {
    setupTheme();
    setupNavigation();
    setupColorPalette();
    setupCanvasControls();
    renderGallery();
    setupGalleryFilters();
    setupResumeTabs();
    setupContactForm();
    setupFloatingDoodlesInteraction();
  }

  // --- THEME MANAGEMENT ---
  function setupTheme() {
    const themeToggle = document.getElementById('theme-toggle');
    const sunIcon = themeToggle.querySelector('.sun-icon');
    const moonIcon = themeToggle.querySelector('.moon-icon');

    // Default to paper theme
    document.body.className = 'theme-paper';

    themeToggle.addEventListener('click', () => {
      if (activeTheme === 'paper') {
        activeTheme = 'chalkboard';
        document.body.className = 'theme-chalkboard';
        sunIcon.style.display = 'none';
        moonIcon.style.display = 'block';
        showToast('Switched to Chalkboard (Dark Mode)', 'info');
      } else {
        activeTheme = 'paper';
        document.body.className = 'theme-paper';
        sunIcon.style.display = 'block';
        moonIcon.style.display = 'none';
        showToast('Switched to Sketchbook (Light Mode)', 'info');
      }
      
      // Update color palette bubbles and canvas active stroke
      setupColorPalette();
      
      // If canvas is blank, redraw or reset canvas defaults
      resetCanvasDefaultsForTheme();
    });
  }

  function resetCanvasDefaultsForTheme() {
    // Select first color of the new theme
    const palette = PALETTES[activeTheme];
    mainCanvas.currentColor = palette[0].hex;
    heroCanvas.currentColor = palette[0].hex;

    // Reset color inputs
    const customColor = document.getElementById('custom-color');
    if (customColor) customColor.value = palette[0].hex;

    // Refresh UI highlights
    const colorPalette = document.getElementById('color-palette');
    const firstBubble = colorPalette.querySelector('.color-bubble');
    if (firstBubble) {
      colorPalette.querySelectorAll('.color-bubble').forEach(b => b.classList.remove('active'));
      firstBubble.classList.add('active');
    }
  }

  // --- NAVIGATION FLOWS ---
  function setupNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    
    // Intersection Observer to highlight active navigation link on scroll
    const sections = document.querySelectorAll('.page-section');
    const options = {
      root: null,
      threshold: 0.3,
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

    const colors = PALETTES[activeTheme];
    colors.forEach((color, idx) => {
      const bubble = document.createElement('button');
      bubble.className = `color-bubble ${idx === 0 ? 'active' : ''}`;
      bubble.style.backgroundColor = color.hex;
      bubble.title = color.name;
      bubble.setAttribute('aria-label', color.name);

      bubble.addEventListener('click', () => {
        // Update active class
        paletteContainer.querySelectorAll('.color-bubble').forEach(b => b.classList.remove('active'));
        bubble.classList.add('active');

        // Apply color
        mainCanvas.currentColor = color.hex;
        const customColor = document.getElementById('custom-color');
        if (customColor) customColor.value = color.hex;
      });

      paletteContainer.appendChild(bubble);
    });

    // Custom Color Picker event
    const customColor = document.getElementById('custom-color');
    if (customColor) {
      customColor.value = colors[0].hex;
      customColor.addEventListener('input', (e) => {
        paletteContainer.querySelectorAll('.color-bubble').forEach(b => b.classList.remove('active'));
        mainCanvas.currentColor = e.target.value;
      });
    }
  }

  // --- DRAWING TOOLKIT INTERACTIONS ---
  function setupCanvasControls() {
    // Brush Size Slider
    const sizeSlider = document.getElementById('brush-size');
    const sizeVal = document.getElementById('brush-size-val');
    sizeSlider.addEventListener('input', (e) => {
      const size = e.target.value;
      mainCanvas.brushSize = size;
      sizeVal.textContent = `${size}px`;
    });

    // Opacity Slider
    const opacitySlider = document.getElementById('brush-opacity');
    const opacityVal = document.getElementById('brush-opacity-val');
    opacitySlider.addEventListener('input', (e) => {
      const opacity = e.target.value / 100;
      mainCanvas.brushOpacity = opacity;
      opacityVal.textContent = `${e.target.value}%`;
    });

    // Tool Toggles
    const toolBtns = document.querySelectorAll('.tool-btn');
    toolBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        toolBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        mainCanvas.currentTool = btn.dataset.tool;
      });
    });

    // Shape Toggles
    const shapeBtns = document.querySelectorAll('.shape-btn');
    shapeBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        shapeBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        mainCanvas.currentShape = btn.dataset.shape;
      });
    });

    // Action buttons
    document.getElementById('undo-btn').addEventListener('click', () => mainCanvas.undo());
    document.getElementById('redo-btn').addEventListener('click', () => mainCanvas.redo());
    document.getElementById('clear-btn').addEventListener('click', () => {
      mainCanvas.clear();
      showToast('Canvas cleared!', 'info');
    });

    // Hero Canvas mini controls
    document.getElementById('clear-hero-canvas').addEventListener('click', () => {
      heroCanvas.clear();
      showToast('Scratchpad cleared!', 'info');
    });

    // Download PNG Action
    document.getElementById('download-btn').addEventListener('click', () => {
      const isDarkMode = (activeTheme === 'chalkboard');
      const dataUrl = mainCanvas.getMergedDataURL(isDarkMode);
      
      const link = document.createElement('a');
      link.download = `doodle_${Date.now()}.png`;
      link.href = dataUrl;
      link.click();
      showToast('PNG Downloaded!', 'success');
    });

    // Save/Post to Gallery Action
    document.getElementById('save-gallery-btn').addEventListener('click', () => {
      const titleInput = document.getElementById('doodle-title');
      const title = titleInput.value.trim() || 'Untitled Doodle';
      const isDarkMode = (activeTheme === 'chalkboard');
      
      // Get the image merged with notebook paper or chalkboard texture
      const mergedImgData = mainCanvas.getMergedDataURL(isDarkMode);

      // Create new user doodle
      const newDoodle = {
        id: `user-doodle-${Date.now()}`,
        title: title,
        category: 'user',
        tag: 'Guest Sketch',
        date: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
        likes: 0,
        author: 'Guest Designer',
        description: 'A custom, interactive drawing painted live on the canvas within the Sketch Studio. Saved in local session memory.',
        techTags: ['Canvas API', 'Mouse/Touch', 'Session Saved'],
        imageSrc: mergedImgData
      };

      // Add to list and re-render
      doodlesList.unshift(newDoodle);
      renderGallery();
      
      // Reset controls
      titleInput.value = '';
      mainCanvas.clear();

      showToast(`Successfully posted "${title}" to the gallery!`, 'success');
      
      // Scroll to gallery section smoothly
      document.getElementById('gallery').scrollIntoView({ behavior: 'smooth' });
    });
  }

  // --- GALLERY RENDERING & LIGHTBOX ---
  function renderGallery() {
    const grid = document.getElementById('gallery-grid');
    if (!grid) return;
    grid.innerHTML = '';

    const searchQuery = document.getElementById('gallery-search').value.toLowerCase().trim();

    // Filter items based on current category and search query
    const filtered = doodlesList.filter(item => {
      const matchesCategory = (currentFilter === 'all' || item.category === currentFilter);
      const matchesSearch = item.title.toLowerCase().includes(searchQuery) ||
                            item.description.toLowerCase().includes(searchQuery) ||
                            item.techTags.some(t => t.toLowerCase().includes(searchQuery));
      return matchesCategory && matchesSearch;
    });

    if (filtered.length === 0) {
      grid.innerHTML = `
        <div class="no-results text-center hand-drawn" style="grid-column: 1/-1; padding: 3rem; font-size: 1.2rem; color: var(--text-muted);">
          No doodles found matching your criteria. Draw one in the Studio! ✎
        </div>
      `;
      return;
    }

    filtered.forEach(doodle => {
      const card = document.createElement('div');
      card.className = 'gallery-card sketch-border';
      
      // Determine what to display in card-media (SVG string or PNG image src)
      let mediaContent = '';
      if (doodle.svg) {
        mediaContent = doodle.svg;
      } else if (doodle.imageSrc) {
        mediaContent = `<img src="${doodle.imageSrc}" alt="${doodle.title}" loading="lazy">`;
      }

      card.innerHTML = `
        <div class="card-media">
          <span class="card-tag">${doodle.tag}</span>
          ${mediaContent}
        </div>
        <div class="card-details">
          <h4 class="card-title hand-drawn">${doodle.title}</h4>
          <div class="card-meta">By ${doodle.author} &bull; ${doodle.date}</div>
          <p class="card-desc">${doodle.description}</p>
          <div class="card-footer">
            <div class="card-likes">
              <span>♥</span> <span class="likes-number">${doodle.likes}</span>
            </div>
            <button class="sketch-btn secondary-btn icon-btn card-like-btn" style="width:32px; height:32px; font-size: 0.75rem;" title="Like this doodle">♥</button>
          </div>
        </div>
      `;

      // Handle card click to open Lightbox
      card.addEventListener('click', (e) => {
        // Prevent click when pressing the like button
        if (e.target.classList.contains('card-like-btn')) {
          e.stopPropagation();
          likeDoodle(doodle.id, card.querySelector('.likes-number'));
          return;
        }
        openLightbox(doodle);
      });

      grid.appendChild(card);
    });
  }

  function setupGalleryFilters() {
    // Category Buttons
    const filterBtns = document.querySelectorAll('.filter-btn');
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentFilter = btn.dataset.filter;
        renderGallery();
      });
    });

    // Search bar event
    document.getElementById('gallery-search').addEventListener('input', () => {
      renderGallery();
    });
  }

  function likeDoodle(id, likesCountSpan) {
    const doodle = doodlesList.find(d => d.id === id);
    if (doodle) {
      doodle.likes++;
      likesCountSpan.textContent = doodle.likes;
      showToast(`Liked "${doodle.title}"!`, 'success');
      
      // Update lightbox if it is open
      const lightbox = document.getElementById('doodle-lightbox');
      if (lightbox.classList.contains('active')) {
        const likeBtnSpan = document.getElementById('like-count');
        if (likeBtnSpan) likeBtnSpan.textContent = doodle.likes;
      }
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
      // Convert SVG code string to binary blob for download
      const svgBlob = new Blob([doodle.svg], { type: 'image/svg+xml;charset=utf-8' });
      downloadBtn.href = URL.createObjectURL(svgBlob);
      downloadBtn.download = `${doodle.id}.svg`;
    } else if (doodle.imageSrc) {
      mediaContainer.innerHTML = `<img src="${doodle.imageSrc}" alt="${doodle.title}">`;
      downloadBtn.href = doodle.imageSrc;
      downloadBtn.download = `${doodle.title.replace(/\s+/g, '_')}.png`;
    }

    // Populate detail texts
    tagSpan.textContent = doodle.tag;
    titleHeader.textContent = doodle.title;
    authorSpan.textContent = doodle.author;
    dateSpan.textContent = doodle.date;
    descP.textContent = doodle.description;
    likeCountSpan.textContent = doodle.likes;

    // Tech tags list
    techTagsList.innerHTML = '';
    doodle.techTags.forEach(tag => {
      const badge = document.createElement('span');
      badge.className = 'tech-tag hand-drawn';
      badge.textContent = tag;
      techTagsList.appendChild(badge);
    });

    // Setup Like Button Action in Modal
    // Clear previous event listener (cloning button is the cleanest way in Vanilla JS)
    const newLikeBtn = likeBtn.cloneNode(true);
    likeBtn.parentNode.replaceChild(newLikeBtn, likeBtn);
    newLikeBtn.addEventListener('click', () => {
      // Find card element in gallery grid and update its UI
      const cardContainer = document.querySelector(`.gallery-card`); // simple fallbacks
      const likesSpan = document.getElementById('like-count');
      likeDoodle(doodle.id, likesSpan);
      renderGallery(); // Syncs counts back to grid layout
    });

    // Show Lightbox with animations
    lightbox.classList.add('active');

    // Close Lightbox listeners
    const closeBtn = document.getElementById('close-lightbox-btn');
    const overlay = document.getElementById('lightbox-close-overlay');
    
    const closeLightbox = () => {
      lightbox.classList.remove('active');
    };
    
    closeBtn.onclick = closeLightbox;
    overlay.onclick = closeLightbox;
  }

  // --- INTERACTIVE SKETCHBOOK RESUME ---
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

    // Default Load Profile page
    loadTab('profile');
  }

  function renderProfileTab() {
    const panel = document.getElementById('resume-tab-content');
    panel.innerHTML = `
      <div class="profile-grid">
        <div class="profile-avatar-box sketch-border">
          ${RESUME_PROFILE.avatarSvg}
        </div>
        <div class="profile-details">
          <h3 class="hand-drawn">${RESUME_PROFILE.name}</h3>
          <div class="profile-title hand-drawn">${RESUME_PROFILE.title}</div>
          <p class="profile-bio">${RESUME_PROFILE.bio}</p>
          <ul class="profile-quick-facts">
            ${RESUME_PROFILE.facts.map(fact => `
              <li>
                <span class="bullet">☞</span>
                <span class="fact-text">${fact}</span>
              </li>
            `).join('')}
          </ul>
        </div>
      </div>
    `;
  }

  function renderSkillsTab() {
    const panel = document.getElementById('resume-tab-content');
    panel.innerHTML = `
      <div class="skills-grid">
        <!-- Frontend Column -->
        <div class="skills-column">
          <h3 class="hand-drawn">Frontend Sketchpad</h3>
          ${RESUME_SKILLS.frontend.map(skill => `
            <div class="skill-item">
              <div class="skill-info">
                <span class="skill-name">${skill.name}</span>
                <span class="skill-percentage hand-drawn">${skill.value}%</span>
              </div>
              <div class="skill-bar-outer">
                <div class="skill-bar-inner" data-value="${skill.value}"></div>
              </div>
            </div>
          `).join('')}
        </div>
        
        <!-- Backend Column -->
        <div class="skills-column">
          <h3 class="hand-drawn">Backend &amp; Logic</h3>
          ${RESUME_SKILLS.backend.map(skill => `
            <div class="skill-item">
              <div class="skill-info">
                <span class="skill-name">${skill.name}</span>
                <span class="skill-percentage hand-drawn">${skill.value}%</span>
              </div>
              <div class="skill-bar-outer">
                <div class="skill-bar-inner" data-value="${skill.value}"></div>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;

    // Trigger skills bar animations sequentially
    setTimeout(() => {
      panel.querySelectorAll('.skill-bar-inner').forEach(bar => {
        const val = bar.getAttribute('data-value');
        bar.style.width = `${val}%`;
      });
    }, 50);
  }

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

  // --- MOCK CONTACT FORM SUBMISSION ---
  function setupContactForm() {
    const form = document.getElementById('contact-form');
    const status = document.getElementById('form-status');
    if (!form) return;

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const submitBtn = form.querySelector('button[type="submit"]');
      const origText = submitBtn.innerHTML;
      
      // Handwritten Loading Simulation
      submitBtn.disabled = true;
      submitBtn.innerHTML = 'Writing Scribble... ✎';
      status.textContent = '';

      setTimeout(() => {
        showToast('Message sent! Thanks for leaving a scribble.', 'success');
        submitBtn.disabled = false;
        submitBtn.innerHTML = origText;
        status.innerHTML = '<span style="color:var(--ink-success)">✓ Scribble delivered to mailbox!</span>';
        
        form.reset();
      }, 1500);
    });
  }

  // --- FLOATING BACKGROUND DECORATIONS ---
  // Subtly tilts background floating doodles in reaction to mouse coordinates
  function setupFloatingDoodlesInteraction() {
    document.addEventListener('mousemove', (e) => {
      const doodles = document.querySelectorAll('.floating-doodle');
      const mouseX = e.clientX / window.innerWidth - 0.5;
      const mouseY = e.clientY / window.innerHeight - 0.5;

      doodles.forEach((doodle, idx) => {
        const factor = (idx + 1) * 15;
        const dx = mouseX * factor;
        const dy = mouseY * factor;
        doodle.style.transform = `translate(${dx}px, ${dy}px) rotate(${factor + (dx * 0.2)}deg)`;
      });
    });
  }

  // --- TOAST NOTIFICATIONS ---
  function showToast(message, type = 'success') {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    // Choose icon depending on type
    let icon = '★';
    if (type === 'info') icon = '✎';
    if (type === 'danger') icon = '⚠';

    toast.innerHTML = `<span class="hand-drawn">${icon}</span> <span>${message}</span>`;
    container.appendChild(toast);

    // Slide up / Fade in
    setTimeout(() => {
      toast.classList.add('show');
    }, 10);

    // Fade out and remove
    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => {
        toast.remove();
      }, 300);
    }, 3000);
  }
});
