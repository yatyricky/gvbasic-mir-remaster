// This file is auto-generated. Do not edit manually.
import { Item } from '../configRaw/Item.js';

/**
 * @typedef {"woodsword"} ItemId
 */

const ItemById = /**@type {Record<ItemId, ElementTypeOf<typeof import("../configRaw/Item.js").Item>>} */({});
for (const entry of Item) {
    ItemById[/**@type {ItemId}*/(entry.id)] = entry;
}

export { ItemById };
