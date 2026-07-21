/**
 * CJK-aware string display width.
 * ASCII = 1, CJK = 2.
 */
export function strWidth(str) {
  let w = 0;
  for (const c of str) {
    if (c === '\n') continue;
    w += c.charCodeAt(0) > 255 ? 2 : 1;
  }
  return w;
}

export function strIsEmpty(str) {
  return !str || str.trim().length === 0;
}

/** Clamp value between min and max. */
export function clamp(val, min, max) {
  return val < min ? min : val > max ? max : val;
}

/** Random int in [min, max]. */
export function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/** Random float in [min, max). */
export function randFloat(min, max) {
  return min + Math.random() * (max - min);
}

/**
 * Weighted random index.
 * weights: number[], returns selected index.
 */
export function weightedRandom(weights) {
  const total = weights.reduce((a, b) => a + b, 0);
  let r = Math.random() * total;
  for (let i = 0; i < weights.length; i++) {
    r -= weights[i];
    if (r <= 0) return i;
  }
  return weights.length - 1;
}

/**
 * Pick a random element from an array.
 */
export function arrRand(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

/** Simple seeded RNG (mulberry32). */
export function createRNG(seed) {
  return function () {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
