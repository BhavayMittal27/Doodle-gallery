/* ==========================================================================
   CANVAS DRAWING ENGINE (canvas.js)
   ========================================================================== */

class SketchCanvas {
  constructor(canvasId, isMini = false) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');
    
    this.isMini = isMini;
    this.isDrawing = false;
    this.startX = 0;
    this.startY = 0;
    
    // Default Drawing States
    this.currentTool = 'brush'; // brush, highlighter, eraser
    this.currentShape = 'free'; // free, line, rect, circle
    this.currentColor = '#ffffff'; // Default to Comet White
    this.brushSize = 6;
    this.brushOpacity = 1.0;
    
    // History Buffers for Undo/Redo (Main canvas only)
    this.history = [];
    this.historyIndex = -1;
    this.maxHistory = 25;
    
    // Offscreen Canvas for drawing shape previews
    this.previewSnapshot = null;

    // Accessibility/UX states
    this.hasDrawn = false;
    this.kbdX = 120; // Default to center of 240px width canvas
    this.kbdY = 120; // Default to center of 240px height canvas
    this.isKbdDrawing = false;

    this.init();
  }

  init() {
    this.resizeCanvas();
    this.setupListeners();
    this.updateKbdCursor();
    
    // Save initial blank state
    if (!this.isMini) {
      this.saveHistoryState();
    }
  }

  resizeCanvas() {
    // Save current drawings before resize
    let tempCanvas = null;
    let tempCtx = null;
    if (this.canvas.width > 0 && this.canvas.height > 0) {
      tempCanvas = document.createElement('canvas');
      tempCanvas.width = this.canvas.width;
      tempCanvas.height = this.canvas.height;
      tempCtx = tempCanvas.getContext('2d');
      tempCtx.drawImage(this.canvas, 0, 0);
    }

    // Set canvas dimensions based on CSS layout parent
    const rect = this.canvas.parentElement.getBoundingClientRect();
    
    // Scale for high-res retina screens
    const dpr = window.devicePixelRatio || 1;
    this.canvas.width = rect.width * dpr;
    this.canvas.height = rect.width * dpr;
    this.ctx.scale(dpr, dpr);
    
    this.canvas.style.width = '100%';
    this.canvas.style.height = '100%';

    // Set brush settings for the scaled context
    this.ctx.lineCap = 'round';
    this.ctx.lineJoin = 'round';

    // Restore contents
    if (tempCanvas && tempCtx) {
      this.ctx.drawImage(tempCanvas, 0, 0, tempCanvas.width / dpr, tempCanvas.height / dpr);
    }
  }

  setupListeners() {
    // Mouse Events
    this.canvas.addEventListener('mousedown', (e) => this.startDrawing(e));
    this.canvas.addEventListener('mousemove', (e) => this.draw(e));
    this.canvas.addEventListener('mouseup', () => this.stopDrawing());
    this.canvas.addEventListener('mouseleave', () => this.stopDrawing());

    // Touch Events (for mobile/tablet drawing)
    this.canvas.addEventListener('touchstart', (e) => {
      e.preventDefault();
      const touch = e.touches[0];
      this.startDrawing(touch);
    });
    this.canvas.addEventListener('touchmove', (e) => {
      e.preventDefault();
      const touch = e.touches[0];
      this.draw(touch);
    }, { passive: false });
    this.canvas.addEventListener('touchend', () => this.stopDrawing());

    // Keyboard Draw Events
    this.canvas.addEventListener('keydown', (e) => this.handleKeyDown(e));
    this.canvas.addEventListener('keyup', (e) => {
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
        if (this.isKbdDrawing) {
          this.isKbdDrawing = false;
          this.ctx.closePath();
          this.saveHistoryState();
          this.hasDrawn = !this.checkIfBlank();
          this.dispatchChangedEvent();
        }
      }
    });

    // Window Resize (Debounced slightly)
    let resizeTimer;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => this.resizeCanvas(), 100);
    });
  }

  getMousePos(e) {
    const rect = this.canvas.getBoundingClientRect();
    // Return coordinates relative to the client canvas
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };
  }

  startDrawing(e) {
    this.isDrawing = true;
    const pos = this.getMousePos(e);
    this.startX = pos.x;
    this.startY = pos.y;
    
    // Configure Context based on Current Tool
    this.ctx.lineWidth = this.brushSize;
    this.ctx.strokeStyle = this.currentColor;
    this.ctx.globalAlpha = this.brushOpacity;
    
    if (this.currentTool === 'eraser') {
      // Use destination-out to erase canvas pixels cleanly (transparency)
      this.ctx.globalCompositeOperation = 'destination-out';
      this.ctx.strokeStyle = 'rgba(0,0,0,1)'; // Must have opacity to clear
      this.ctx.lineWidth = this.brushSize * 1.5; // Erasers are usually slightly larger
    } else if (this.currentTool === 'highlighter') {
      this.ctx.globalCompositeOperation = 'source-over';
      this.ctx.globalAlpha = 0.35; // Lower opacity for highlighter overlay
    } else {
      this.ctx.globalCompositeOperation = 'source-over';
    }

    // Save canvas snapshot for shape drawing preview
    if (this.currentShape !== 'free') {
      this.previewSnapshot = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
    } else {
      this.ctx.beginPath();
      this.ctx.moveTo(this.startX, this.startY);
      // Draw a single dot on click
      this.ctx.lineTo(this.startX + 0.1, this.startY);
      this.ctx.stroke();
    }
  }

  draw(e) {
    if (!this.isDrawing) return;
    const pos = this.getMousePos(e);
    
    if (this.currentShape === 'free') {
      // Normal freehand sketching
      this.ctx.lineTo(pos.x, pos.y);
      this.ctx.stroke();
    } else {
      // Drawing shapes requires redrawing the cached snapshot to avoid leaving trailing lines
      if (this.previewSnapshot) {
        this.ctx.putImageData(this.previewSnapshot, 0, 0);
      }
      
      this.ctx.beginPath();
      if (this.currentShape === 'line') {
        // Draw straight line
        this.ctx.moveTo(this.startX, this.startY);
        this.ctx.lineTo(pos.x, pos.y);
        this.ctx.stroke();
      } else if (this.currentShape === 'rect') {
        // Draw outline rectangle
        const w = pos.x - this.startX;
        const h = pos.y - this.startY;
        this.ctx.strokeRect(this.startX, this.startY, w, h);
      } else if (this.currentShape === 'circle') {
        // Draw circle based on diagonal distance
        const dist = Math.sqrt(Math.pow(pos.x - this.startX, 2) + Math.pow(pos.y - this.startY, 2));
        this.ctx.arc(this.startX, this.startY, dist, 0, 2 * Math.PI);
        this.ctx.stroke();
      }
    }
  }

  stopDrawing() {
    if (!this.isDrawing) return;
    this.isDrawing = false;
    this.ctx.closePath();
    
    // Save state after drawing completes
    if (!this.isMini) {
      this.saveHistoryState();
      this.hasDrawn = !this.checkIfBlank();
      this.dispatchChangedEvent();
    }
  }

  /* --- HISTORY STATES --- */
  saveHistoryState() {
    // Delete any redo states if we draw something new
    if (this.historyIndex < this.history.length - 1) {
      this.history = this.history.slice(0, this.historyIndex + 1);
    }
    
    const snapshot = this.canvas.toDataURL();
    this.history.push(snapshot);
    
    if (this.history.length > this.maxHistory) {
      this.history.shift();
    } else {
      this.historyIndex++;
    }

    this.updateUndoRedoButtons();
  }

  undo() {
    if (this.historyIndex > 0) {
      this.historyIndex--;
      this.restoreHistoryState();
    }
  }

  redo() {
    if (this.historyIndex < this.history.length - 1) {
      this.historyIndex++;
      this.restoreHistoryState();
    }
  }

  restoreHistoryState() {
    const dpr = window.devicePixelRatio || 1;
    const img = new Image();
    img.src = this.history[this.historyIndex];
    img.onload = () => {
      // Clear canvas before drawing back
      this.ctx.clearRect(0, 0, this.canvas.width / dpr, this.canvas.height / dpr);
      this.ctx.drawImage(img, 0, 0, this.canvas.width / dpr, this.canvas.height / dpr);
      this.updateUndoRedoButtons();
      this.hasDrawn = !this.checkIfBlank();
      this.dispatchChangedEvent();
    };
  }

  updateUndoRedoButtons() {
    const undoBtn = document.getElementById('undo-btn');
    const redoBtn = document.getElementById('redo-btn');
    
    if (undoBtn) undoBtn.disabled = this.historyIndex <= 0;
    if (redoBtn) redoBtn.disabled = this.historyIndex >= this.history.length - 1;
  }

  clear() {
    const dpr = window.devicePixelRatio || 1;
    this.ctx.clearRect(0, 0, this.canvas.width / dpr, this.canvas.height / dpr);
    
    if (!this.isMini) {
      this.history = [];
      this.historyIndex = -1;
      this.saveHistoryState();
      this.hasDrawn = false;
      this.dispatchChangedEvent();
    }
  }

  /* --- ACCESSIBILITY AND CHANGE EVENT HELPERS --- */
  checkIfBlank() {
    try {
      const imgData = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
      const data = imgData.data;
      for (let i = 3; i < data.length; i += 4) {
        if (data[i] > 10) {
          return false;
        }
      }
    } catch (e) {
      console.warn("Could not check image data:", e);
    }
    return true;
  }

  dispatchChangedEvent() {
    this.canvas.dispatchEvent(new CustomEvent('canvas-changed', { 
      detail: { hasDrawn: this.hasDrawn } 
    }));
  }

  updateKbdCursor() {
    const parent = this.canvas.parentElement;
    if (parent) {
      const dpr = window.devicePixelRatio || 1;
      const cssW = this.canvas.width / dpr;
      const cssH = this.canvas.height / dpr;
      const pctX = (this.kbdX / cssW) * 100;
      const pctY = (this.kbdY / cssH) * 100;
      parent.style.setProperty('--kbd-x', `${pctX}%`);
      parent.style.setProperty('--kbd-y', `${pctY}%`);
    }
  }

  handleKeyDown(e) {
    if (!['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) return;
    e.preventDefault(); // Stop page scrolling when drawing
    
    const dpr = window.devicePixelRatio || 1;
    const cssW = this.canvas.width / dpr;
    const cssH = this.canvas.height / dpr;
    
    const step = 8;
    const prevX = this.kbdX;
    const prevY = this.kbdY;

    if (e.key === 'ArrowUp') this.kbdY = Math.max(0, this.kbdY - step);
    if (e.key === 'ArrowDown') this.kbdY = Math.min(cssH, this.kbdY + step);
    if (e.key === 'ArrowLeft') this.kbdX = Math.max(0, this.kbdX - step);
    if (e.key === 'ArrowRight') this.kbdX = Math.min(cssW, this.kbdX + step);

    this.updateKbdCursor();

    // Configure context for drawing
    this.ctx.lineWidth = this.brushSize;
    this.ctx.strokeStyle = this.currentColor;
    this.ctx.globalAlpha = this.brushOpacity;
    this.ctx.globalCompositeOperation = 'source-over';

    if (!this.isKbdDrawing) {
      this.isKbdDrawing = true;
      this.ctx.beginPath();
      this.ctx.moveTo(prevX, prevY);
    }
    
    this.ctx.lineTo(this.kbdX, this.kbdY);
    this.ctx.stroke();
  }

  /* --- EXPORT/SAVE IMAGE --- */
  // Merges the strokes canvas onto a deep space coordinates chart for high fidelity saving
  getMergedDataURL(isDarkMode) {
    const dpr = window.devicePixelRatio || 1;
    const exportCanvas = document.createElement('canvas');
    exportCanvas.width = this.canvas.width;
    exportCanvas.height = this.canvas.height;
    const exportCtx = exportCanvas.getContext('2d');
    
    // Deep Space Backdrop
    exportCtx.fillStyle = '#080918';
    exportCtx.fillRect(0, 0, exportCanvas.width, exportCanvas.height);
    
    // Draw astronomical coordinate grids
    exportCtx.strokeStyle = 'rgba(0, 229, 255, 0.04)';
    exportCtx.lineWidth = 1 * dpr;
    
    const step = 40 * dpr;
    exportCtx.beginPath();
    for (let x = 0; x < exportCanvas.width; x += step) {
      exportCtx.moveTo(x, 0);
      exportCtx.lineTo(x, exportCanvas.height);
    }
    for (let y = 0; y < exportCanvas.height; y += step) {
      exportCtx.moveTo(0, y);
      exportCtx.lineTo(exportCanvas.width, y);
    }
    exportCtx.stroke();
    
    // Faint observatory circular lines
    const cx = exportCanvas.width / 2;
    const cy = exportCanvas.height / 2;
    exportCtx.strokeStyle = 'rgba(0, 229, 255, 0.08)';
    
    exportCtx.beginPath();
    exportCtx.arc(cx, cy, 80 * dpr, 0, 2 * Math.PI);
    exportCtx.arc(cx, cy, 180 * dpr, 0, 2 * Math.PI);
    exportCtx.stroke();
    
    exportCtx.beginPath();
    exportCtx.moveTo(cx - 20 * dpr, cy);
    exportCtx.lineTo(cx + 20 * dpr, cy);
    exportCtx.moveTo(cx, cy - 20 * dpr);
    exportCtx.lineTo(cx, cy + 20 * dpr);
    exportCtx.stroke();
    
    // Draw drawing layer on top
    exportCtx.drawImage(this.canvas, 0, 0);
    return exportCanvas.toDataURL('image/png');
  }
}

// Attach to window object for availability in module environments
window.SketchCanvas = SketchCanvas;

