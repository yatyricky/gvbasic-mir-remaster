// This file is auto-generated. Do not edit manually.
import { Unit } from '../configRaw/Unit.js';

/**
 * @typedef {"warr" | "mage" | "wlk"} UnitId
 */

const UnitById = /**@type {Record<UnitId, ElementTypeOf<typeof import("../configRaw/Unit.js").Unit>>} */({});
for (const entry of Unit) {
    UnitById[/**@type {UnitId}*/(entry.id)] = entry;
}

export { UnitById };
