/**
 * Game entry point & main loop.
 */
import * as renderer from './renderer.js';
import * as input from './input.js';
import * as state from './state.js';
import * as titleState from './states/title.js';
import * as mapState from './states/map.js';
import * as combatState from './states/combat.js';
import { loadGame } from './player.js';

// --- Game context (shared state passed to all state handlers) ---
export const ctx = {
  player: null,
};

// --- Init ---
function init() {
  const canvas = document.getElementById('app');
  renderer.init(canvas);

  // Register states
  state.register('TITLE', titleState);
  state.register('MAP', mapState);
  state.register('COMBAT', combatState);

  // Forward input to current state
  input.init((cmd) => {
    const s = state.registry[state.currentState()];
    if (s && s.onInput) s.onInput(ctx, cmd);
  });

  // Try to load saved game
  const saved = loadGame();
  if (saved) {
    ctx.player = saved;
  }

  // Start at title screen
  state.transition('TITLE', ctx);
}

// --- Game Loop ---
let lastTime = 0;

function loop(time) {
  const dt = lastTime ? Math.min(time - lastTime, 100) : 16; // cap at 100ms
  lastTime = time;

  state.update(ctx, dt);
  state.render(ctx);

  requestAnimationFrame(loop);
}

init();
requestAnimationFrame(loop);
