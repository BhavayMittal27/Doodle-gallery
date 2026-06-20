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
    
    // Default Drawing States (Garden Theme)
    this.currentColor = '#E74C3C'; // Default to Crimson Red
    this.brushSize = 6;
    
    // History Buffers for Undo/Redo
    this.history = [];
    this.historyIndex = -1;
    this.maxHistory = 25;
    
    this.hasDrawn = false;
    this.kbdX = 112; // Center of 224px width canvas
    this.kbdY = 112; // Center of 224px height canvas
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

    // Set canvas dimensions to 224x224 to match annasgarden.dev exactly
    const dpr = window.devicePixelRatio || 1;
    this.canvas.width = 224 * dpr;
    this.canvas.height = 224 * dpr;
    this.ctx.scale(dpr, dpr);
    
    this.canvas.style.width = '224px';
    this.canvas.style.height = '224px';

    // Set brush settings for the scaled context
    this.ctx.lineCap = 'round';
    this.ctx.lineJoin = 'round';

    // Restore contents
    if (tempCanvas && tempCtx) {
      this.ctx.drawImage(tempCanvas, 0, 0, tempCanvas.width / dpr, tempCanvas.height / dpr);
    }

    this.kbdX = 112;
    this.kbdY = 112;
    this.updateKbdCursor();
  }

  setupListeners() {
    // Mouse Events
    this.canvas.addEventListener('mousedown', (e) => this.startDrawing(e));
    this.canvas.addEventListener('mousemove', (e) => this.draw(e));
    this.canvas.addEventListener('mouseup', () => this.stopDrawing());
    this.canvas.addEventListener('mouseleave', () => this.stopDrawing());

    // Touch Events
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
  }

  getMousePos(e) {
    const rect = this.canvas.getBoundingClientRect();
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
    
    // Configure Context
    this.ctx.lineWidth = this.brushSize;
    this.ctx.strokeStyle = this.currentColor;
    this.ctx.globalAlpha = 1.0;
    this.ctx.globalCompositeOperation = 'source-over';

    this.ctx.beginPath();
    this.ctx.moveTo(this.startX, this.startY);
    // Draw a single dot on click
    this.ctx.lineTo(this.startX + 0.1, this.startY);
    this.ctx.stroke();
  }

  draw(e) {
    if (!this.isDrawing) return;
    const pos = this.getMousePos(e);
    this.ctx.lineTo(pos.x, pos.y);
    this.ctx.stroke();
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

  restoreHistoryState() {
    const dpr = window.devicePixelRatio || 1;
    const img = new Image();
    img.src = this.history[this.historyIndex];
    img.onload = () => {
      this.ctx.clearRect(0, 0, this.canvas.width / dpr, this.canvas.height / dpr);
      this.ctx.drawImage(img, 0, 0, this.canvas.width / dpr, this.canvas.height / dpr);
      this.updateUndoRedoButtons();
      this.hasDrawn = !this.checkIfBlank();
      this.dispatchChangedEvent();
    };
  }

  updateUndoRedoButtons() {
    const undoBtn = document.getElementById('undo-btn');
    if (undoBtn) undoBtn.disabled = this.historyIndex <= 0;
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
    e.preventDefault();
    
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

    this.ctx.lineWidth = this.brushSize;
    this.ctx.strokeStyle = this.currentColor;
    this.ctx.globalAlpha = 1.0;
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
  getMergedDataURL(isDarkMode) {
    // Replaced with clean transparent drawing PNG export to sit beautifully on the grass
    return this.canvas.toDataURL('image/png');
  }
}

// Attach to window object for availability in module environments
window.SketchCanvas = SketchCanvas;
