/**
 * Simple finite state machine.
 *
 * Each state: { enter(ctx), exit(ctx), update(ctx, dt), render(ctx) }
 * ctx is the shared game context (player, map, combat data, etc.)
 */

/** @type {{ enter?: Function, exit?: Function, update?: Function, render?: Function }} */
let current = null;
let currentName = '';

/** Registry of all states. */
export const registry = {};

/**
 * Register a state.
 * @param {string} name
 * @param {{ enter?: Function, exit?: Function, update?: Function, render?: Function }} handlers
 */
export function register(name, handlers) {
  registry[name] = handlers;
}

/**
 * Transition to a new state.
 * @param {string} name
 * @param {*} ctx - shared context passed to enter/exit/update/render
 * @param {...*} args - extra args for enter()
 */
export function transition(name, ctx, ...args) {
  if (current && current.exit) current.exit(ctx);
  current = registry[name];
  currentName = name;
  if (current && current.enter) current.enter(ctx, ...args);
}

/** Get current state name. */
export function currentState() {
  return currentName;
}

/**
 * Update current state.
 * @param {*} ctx
 * @param {number} dt - delta time in ms
 */
export function update(ctx, dt) {
  if (current && current.update) current.update(ctx, dt);
}

/**
 * Render current state.
 * @param {*} ctx
 */
export function render(ctx) {
  if (current && current.render) current.render(ctx);
}
