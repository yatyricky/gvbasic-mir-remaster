/**
 * Unified input system.
 * Keyboard (desktop) + touch buttons (mobile) → command queue.
 *
 * Commands: 'up' 'down' 'left' 'right' 'confirm' 'cancel' '1' '2' '3' '4'
 */

const queue = [];

// --- Keyboard ---
const KEY_MAP = {
  ArrowUp: 'up', ArrowDown: 'down', ArrowLeft: 'left', ArrowRight: 'right',
  w: 'up', W: 'up', s: 'down', S: 'down', a: 'left', A: 'left', d: 'right', D: 'right',
  j: 'confirm', J: 'confirm', z: 'confirm', Z: 'confirm', ' ': 'confirm', Enter: 'confirm',
  k: 'cancel', K: 'cancel', x: 'cancel', X: 'cancel', Escape: 'cancel',
  '1': '1', '2': '2', '3': '3', '4': '4',
};

let _onCmd = null;

/**
 * @param {(cmd: string) => void} handler
 */
export function init(handler) {
  _onCmd = handler;

  window.addEventListener('keydown', (e) => {
    const cmd = KEY_MAP[e.key];
    if (cmd) {
      e.preventDefault();
      _onCmd(cmd);
    }
  });

  // Touch virtual buttons
  setupTouchButtons();
}

/** Get next command from the queue, or null if empty. */
export function dequeue() {
  return queue.shift() || null;
}

// --- Virtual D-Pad (mobile) ---

function setupTouchButtons() {
  // Only create buttons if we detect touch support
  if (!('ontouchstart' in window)) return;

  const container = document.createElement('div');
  container.id = 'vpad';
  document.body.appendChild(container);

  const buttons = [
    { id: 'btn-up', label: '↑', cmd: 'up', x: 50, y: 0 },
    { id: 'btn-down', label: '↓', cmd: 'down', x: 50, y: 50 },
    { id: 'btn-left', label: '←', cmd: 'left', x: 0, y: 25 },
    { id: 'btn-right', label: '→', cmd: 'right', x: 100, y: 25 },
    { id: 'btn-a', label: 'A', cmd: 'confirm', x: 180, y: 15 },
    { id: 'btn-b', label: 'B', cmd: 'cancel', x: 210, y: 15 },
  ];

  for (const b of buttons) {
    const el = document.createElement('button');
    el.id = b.id;
    el.textContent = b.label;
    el.style.cssText = `
      position:absolute; left:${b.x}px; top:${b.y}px;
      width:40px; height:40px; border-radius:8px;
      border:2px solid #585b70; background:#313244;
      color:#cdd6f4; font-size:16px; font-weight:bold;
      touch-action:manipulation;
    `;
    el.addEventListener('pointerdown', (e) => {
      e.preventDefault();
      _onCmd(b.cmd);
    });
    container.appendChild(el);
  }
}
