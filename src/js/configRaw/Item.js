/**
 * @typedef {"number" | "range" | "set"} StatValueType
 */

/**
 * @typedef {object} ItemConfig
 * @property {import("../configData/Item").ItemId} id - The unique identifier for the stat.
 * @property {string} name - The display name of the stat.
 * @property {StatValueType} type - The type of the stat.
 * @property {string} description - The description of the stat.
 * @property {import("../configData/Item").ItemId[]} [depends] - An array of stat IDs that this stat depends on.
 * @property {(d: import("../data/ReactStat").default) => void} [derived] - An array of stat IDs that this stat derives from.
 * @property {string} [cgroup] - The image associated with the stat.
 */

/**@type {Array<ItemConfig>} */

export const Item = [
    {id:"woodsword", name:"木剑", description:"木剑描述", image:"🗡️", type:"weapon", slot:"mainhand", baseStat:{attack:1}},
]