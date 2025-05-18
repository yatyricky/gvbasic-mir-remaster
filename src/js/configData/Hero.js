// This file is auto-generated. Do not edit manually.
import { Hero } from '../configRaw/Hero.js';

/**
 * @typedef {"warr" | "mage" | "wlk"} HeroId
 */

const HeroById = /**@type {Record<HeroId, ElementTypeOf<typeof import("../configRaw/Hero.js").Hero>>} */({});
for (const entry of Hero) {
    HeroById[/**@type {HeroId}*/(entry.id)] = entry;
}

export { HeroById };
