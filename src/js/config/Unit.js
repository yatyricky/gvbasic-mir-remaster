export const Units = [
    { id: "warr", name: "战士", image: "🥷", baseStat: { ["maxhp"]: [52], ["maxmp"]: [0] } },
    { id: "mage", name: "法师", image: "🧙", baseStat: { ["maxhp"]: [29], ["maxmp"]: [30] } },
    { id: "wlk", name: "道士", image: "🧝", baseStat: { ["maxhp"]: [36], ["maxmp"]: [19] } },
]

export const UnitById = Object.fromEntries(Units.map(e => [e.id, e]))
