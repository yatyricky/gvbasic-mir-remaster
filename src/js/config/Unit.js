export const Units = [
    { id: "warr", name: "战士", type: "hero", image: "🥷", baseStat: { ["maxhp"]: [52], ["maxmp"]: [0], ["xdmg"]: [1, 4], ["str"]: [20], ["int"]: [5], ["spi"]: [5], ["vit"]: [20], ["crit"]: [5], ["critd"]: [100], ["scrit"]: [5], ["scritd"]: [100] } },
    { id: "mage", name: "法师", type: "hero", image: "🧙", baseStat: { ["maxhp"]: [29], ["maxmp"]: [30], ["xdmg"]: [1, 3], ["str"]: [10], ["int"]: [20], ["spi"]: [10], ["vit"]: [10], ["crit"]: [5], ["critd"]: [100], ["scrit"]: [5], ["scritd"]: [100] } },
    { id: "wlk", name: "道士", type: "hero", image: "🧝", baseStat: { ["maxhp"]: [36], ["maxmp"]: [19], ["xdmg"]: [1, 3], ["str"]: [10], ["int"]: [10], ["spi"]: [15], ["vit"]: [15], ["crit"]: [5], ["critd"]: [100], ["scrit"]: [5], ["scritd"]: [100] } },
    { id: "clawcat", name: "多钩猫", type: "mob" },
    { id: "corpseking", name: "尸王", type: "elite" },
    { id: "redmoondemon", name: "赤月恶魔", type: "boss" },
    { id: "anya", name: "安雅", type: "npc", image: "🧕" },
];

export const UnitById = Object.fromEntries(Units.map(e => [e.id, e]));
