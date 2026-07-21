// --- Constants ---
export const COLS = 20; // half-width characters
export const ROWS = 5;
export const CHAR_W = 20; // half-width pixel width
export const CHAR_H = 40; // pixel height
export const CANVAS_W = COLS * CHAR_W; // 400
export const CANVAS_H = ROWS * CHAR_H; // 200

const FONT = `${Math.round(CHAR_H * 0.8)}px "Courier New", "SimHei", "SimSun", monospace`;

// Default colors
const COLOR_FG = '#cdd6f4';
const COLOR_BG = '#1e1e2e';

/** @type {CanvasRenderingContext2D} */
let _ctx = null;
let _dpr = 1;

/**
 * Initialize the renderer. Call once.
 * @param {HTMLCanvasElement} canvas
 */
export function init(canvas) {
  _dpr = Math.min(window.devicePixelRatio || 1, 2);
  canvas.width = CANVAS_W * _dpr;
  canvas.height = CANVAS_H * _dpr;
  canvas.style.width = CANVAS_W + 'px';
  canvas.style.height = CANVAS_H + 'px';
  _ctx = canvas.getContext('2d');
  _ctx.scale(_dpr, _dpr);
  _ctx.textBaseline = 'middle';
  _ctx.textAlign = 'center';
}

/**
 * Clear the entire canvas with the background color.
 */
export function clear() {
  _ctx.fillStyle = COLOR_BG;
  _ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);
}

/**
 * Draw text at grid position.
 * @param {number} col - horizontal in half-width units (0-19)
 * @param {number} row - vertical (0-4)
 * @param {string} text
 * @param {string} [color] - CSS color, defaults to COLOR_FG
 */
export function drawText(col, row, text, color) {
  if (!text || text.length === 0) return;
  _ctx.save();
  _ctx.font = FONT;
  _ctx.textBaseline = 'middle';
  _ctx.textAlign = 'center';
  _ctx.fillStyle = color || COLOR_FG;

  let x = col;
  for (const c of text) {
    const w = c.charCodeAt(0) > 255 ? 2 : 1;
    if (x + w > COLS) break;
    const cx = (x + w / 2) * CHAR_W;
    const cy = row * CHAR_H + CHAR_H / 2;
    _ctx.fillText(c, cx, cy);
    x += w;
  }
  _ctx.restore();
}

/**
 * Draw filled rectangle at grid position.
 * @param {number} col
 * @param {number} row
 * @param {number} w - in half-width units
 * @param {number} h - in rows
 * @param {string} color
 */
export function drawRect(col, row, w, h, color) {
  _ctx.fillStyle = color;
  _ctx.fillRect(col * CHAR_W, row * CHAR_H, w * CHAR_W, h * CHAR_H);
}

/**
 * Draw a HP/MP bar.
 * @param {number} col
 * @param {number} row
 * @param {number} w - bar width in half-width units
 * @param {number} ratio - 0..1
 * @param {string} color
 */
export function drawBar(col, row, w, ratio, color) {
  const barY = row * CHAR_H + CHAR_H - 6;
  const barH = 4;
  // background
  _ctx.fillStyle = '#45475a';
  _ctx.fillRect(col * CHAR_W, barY, w * CHAR_W, barH);
  // fill
  _ctx.fillStyle = color;
  _ctx.fillRect(col * CHAR_W, barY, Math.max(0, w * CHAR_W * ratio), barH);
}

/**
 * Draw a horizontal divider line.
 * @param {number} row
 * @param {string} [color]
 */
export function drawHLine(row, color) {
  _ctx.strokeStyle = color || '#45475a';
  _ctx.lineWidth = 1;
  _ctx.beginPath();
  _ctx.moveTo(0, row * CHAR_H);
  _ctx.lineTo(CANVAS_W, row * CHAR_H);
  _ctx.stroke();
}

export { COLOR_FG, COLOR_BG };
