export const Units = [
    { id: "warr", name: "战士", type: "hero", image: "🥷", baseStat: { ["maxhp"]: [52], ["maxmp"]: [0] } },
    { id: "mage", name: "法师", type: "hero", image: "🧙", baseStat: { ["maxhp"]: [29], ["maxmp"]: [30] } },
    { id: "wlk", name: "道士", type: "hero", image: "🧝", baseStat: { ["maxhp"]: [36], ["maxmp"]: [19] } },
    { id: "clawcat", name: "多钩猫", type: "mob" },
    { id: "corpseking", name: "尸王", type: "elite" },
    { id: "redmoondemon", name: "赤月恶魔", type: "boss" },
    { id: "anya", name: "安雅", type: "npc", image: "🧕" },
];

export const UnitById = Object.fromEntries(Units.map(e => [e.id, e]));
