/**
 * @typedef {Object} UnitConfig
 * @property {import("../configData/Unit").UnitId} id - The unique identifier for the unit.
 * @property {string} name - The display name of the unit.
 * @property {string} description - The description of the unit.
 * @property {string} image - The image associated with the unit.
 * @property {Partial<Record<import("../configData/Stat").StatId, any>>} baseStat - The base stats of the unit.
 */

/**@type {Array<UnitConfig>} */
export const Unit = [
    { id: "warr", name: "武士", description: "Hero1 Description", image: "🥷", baseStat: { maxhp: 52, maxmp: 0 } },
    { id: "mage", name: "魔法师", description: "Hero1 Description", image: "🧙", baseStat: { maxhp: 29, maxmp: 30 } },
    { id: "wlk", name: "道士", description: "Hero1 Description", image: "🧝", baseStat: { maxhp: 36, maxmp: 19 } },
]
