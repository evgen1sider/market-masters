// Simple seeded random (LCG) — deterministic per seed
export function LCG(seed) {
  let state = seed >>> 0;
  return function random() {
    // constants from Numerical Recipes
    state = (1664525 * state + 1013904223) >>> 0;
    return state / 0x100000000;
  };
}

export function hashStringToSeed(str) {
  let h = 2166136261 >>> 0;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619) >>> 0;
  }
  return h >>> 0;
}
