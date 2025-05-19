/**
 * @typedef {"equip"} ItemType
 */

/**
 * @typedef {"weapon" | "helm" | "necklace" | "pauldron" | "armor" | "bracer" | "glove" | "belt" | "pant" | "boot" | "ring" | "charm"} SlotType
 */

/**
 * @typedef {object} ItemConfig
 * @property {import("../configData/Item").ItemId} id - The unique identifier for the item.
 * @property {string} name - The display name of the item.
 * @property {string} description - The description of the item.
 * @property {string} image - The image associated with the item.
 * @property {ItemType} type - The type of the item (e.g., "weapon", "armor").
 * @property {SlotType} slot - The slot where the item can be equipped (e.g., "head", "body", "legs").
 * @property {number} size - The size of the item (e.g., 1 for small, 2 for large).
 * @property {number} level - The level requirement to use the item.
 * @property {Partial<Record<import("../configData/Stat").StatId, any>>} stat - The base stats of the item.
 * @property {import("../configData/Unit").UnitId[]} [classOnly] - The classes that can use this item.
 * 
 */

/**@type {Array<ItemConfig>} */

export const Item = [
    { id: "woodsword", name: "木剑", level: 1, description: "木剑描述", image: "🗡️", type: "equip", slot: "weapon", size: 1, stat: { xatk: [1, 2, 5, 7] } },
    { id: "dagger", name: "匕首", level: 1, description: "匕首描述", image: "🗡️", type: "equip", slot: "weapon", size: 1, stat: { xatk: [2, 4, 5, 7] } },
    { id: "ebonywoodsword", name: "乌木剑", level: 1, description: "乌木剑描述", image: "🗡️", type: "equip", slot: "weapon", size: 1, stat: { xatk: [2, 4, 8, 12], matk: [0, 0, 1, 2] } },
    { id: "bronzesword", name: "青铜剑", level: 5, description: "青铜剑描述", image: "🗡️", type: "equip", slot: "weapon", size: 1, stat: { xatk: [1, 3, 7, 10] } },
    { id: "shortsword", name: "短剑", level: 10, description: "短剑描述", image: "🗡️", type: "equip", slot: "weapon", size: 1, stat: { xatk: [1, 3, 11, 16] } },
    { id: "ironsword", name: "铁剑", level: 10, description: "铁剑描述", image: "🗡️", type: "equip", slot: "weapon", size: 1, stat: { xatk: [2, 5, 9, 13] } },
    { id: "mattock", name: "鹤嘴锄", level: 11, description: "鹤嘴锄描述", image: "⛏", type: "equip", slot: "weapon", size: 1, stat: { xatk: [0, 0, 8, 12], luck: [1, 2] } },
    { id: "bronzeaxe", name: "青铜斧", level: 11, description: "青铜斧描述", image: "🪓", type: "equip", slot: "weapon", size: 1, stat: { xatk: [5, 10, 15, 22] } },
    { id: "rakshasa", name: "罗刹", level: 15, description: "罗刹描述", image: "🪓", type: "equip", slot: "weapon", size: 2, stat: { xatk: [13, 19, 0, 0], curs: [7, 15] } },
    { id: "eightwilderness", name: "八荒", level: 15, classOnly: ["warr"], description: "八荒描述", image: "🗡️", type: "equip", slot: "weapon", size: 1, stat: { xatk: [2, 4, 12, 18] } },
    { id: "overwind", name: "凌风", level: 19, classOnly: ["warr"], description: "凌风描述", image: "🗡️", type: "equip", slot: "weapon", size: 1, stat: { xatk: [3, 6, 12, 18] } },
    { id: "brokensoul", name: "破魂", level: 20, classOnly: ["warr"], description: "破魂", image: "🗡️", type: "equip", slot: "weapon", size: 1, stat: { xatk: [4, 8, 10, 15], hit: [1, 2] } },
    { id: "horsecleaver", name: "斩马刀", level: 20, classOnly: ["warr"], description: "斩马刀", image: "🗡️", type: "equip", slot: "weapon", size: 2, stat: { xatk: [2, 5, 15, 22] } },
    { id: "shura", name: "修罗", level: 22, classOnly: ["warr"], description: "修罗", image: "🗡️", type: "equip", slot: "weapon", size: 2, stat: { xatk: [0, 0, 20, 30] } },
    { id: "condensefrost", name: "凝霜", level: 22, classOnly: ["warr"], description: "凝霜", image: "🗡️", type: "equip", slot: "weapon", size: 1, stat: { xatk: [5, 10, 13, 19] } },
    { id: "inferno", name: "炼狱", level: 22, classOnly: ["warr"], description: "炼狱", image: "🗡️", type: "equip", slot: "weapon", size: 2, stat: { xatk: [0, 0, 25, 37] } },
    { id: "wellmoon", name: "井中月", level: 28, classOnly: ["warr"], description: "井中月", image: "🗡️", type: "equip", slot: "weapon", size: 2, stat: { xatk: [3, 7, 22, 33] } },
    { id: "judgestaff", name: "裁决之杖", level: 30, classOnly: ["warr"], description: "裁决之杖描述", image: "🗡️", type: "equip", slot: "weapon", size: 1, stat: { xatk: [0, 0, 30, 45] } },
    { id: "dragonslayer", name: "屠龙刀", level: 30, classOnly: ["warr"], description: "屠龙刀描述", image: "🗡️", type: "equip", slot: "weapon", size: 2, stat: { xatk: [2, 5, 35, 52] } },

]