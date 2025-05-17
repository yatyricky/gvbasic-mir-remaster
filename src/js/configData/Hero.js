export const Hero = [
    { id: 1, iden: "warr", name: "武士", description: "Hero1 Description", image: "🥷", baseStat: { exp: 0, maxhp: 52, hp: 52, mp: 0, maxmp: 0 } },
    { id: 2, iden: "mage", name: "魔法师", description: "Hero1 Description", image: "🧙", baseStat: { exp: 0, maxhp: 29, hp: 29, mp: 30, maxmp: 30 } },
    { id: 3, iden: "wlk", name: "道士", description: "Hero1 Description", image: "🧝", baseStat: { exp: 0, maxhp: 36, hp: 36, mp: 19, maxmp: 19 } },
]

if (new Set(Hero.map((e) => e.id)).size !== Hero.length) {
    throw new Error("Hero id is not unique");
}

/** @type {Record<number, ElementTypeOf<Hero>>}*/
export const HeroById = {};
for (const e of Hero) {
    HeroById[e.id] = e;
}
