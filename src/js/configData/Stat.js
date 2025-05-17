export const Stat = [
    { id: 1, iden: "hp", name: "生命值", type: "number", description: "Hero1 Description" },
    { id: 2, iden: "maxhp", name: "生命上限", type: "number", description: "Hero1 Description" },
    { id: 3, iden: "exp", name: "经验值", type: "number", description: "Hero1 Description" },

    { id: 10, iden: "mp", name: "魔法值", type: "number", description: "Hero1 Description" },
    { id: 11, iden: "maxmp", name: "魔法上限", type: "number", description: "Hero1 Description" },
    { id: 20, iden: "dr", name: "物理减免", type: "range", description: "Hero1 Description" },
    { id: 21, iden: "fdr", name: "火焰减免", type: "range", description: "Hero1 Description" },
    { id: 22, iden: "tdr", name: "风雷减免", type: "range", description: "Hero1 Description" },
    { id: 23, iden: "hdr", name: "神圣减免", type: "range", description: "Hero1 Description" },
    { id: 24, iden: "pdr", name: "毒素减免", type: "range", description: "Hero1 Description" },
    { id: 30, iden: "res", name: "物理抗性", type: "range", description: "Hero1 Description" },
    { id: 31, iden: "fres", name: "火焰抗性", type: "range", description: "Hero1 Description" },
    { id: 32, iden: "tres", name: "风雷抗性", type: "range", description: "Hero1 Description" },
    { id: 33, iden: "hres", name: "神圣抗性", type: "range", description: "Hero1 Description" },
    { id: 34, iden: "pres", name: "毒素抗性", type: "range", description: "Hero1 Description" },
    { id: 40, iden: "spd", name: "速度", type: "number", description: "Hero1 Description" },
    { id: 41, iden: "doge", name: "闪避", type: "number", description: "Hero1 Description" },
    { id: 42, iden: "mdoge", name: "法术闪避", type: "number", description: "Hero1 Description" },
    { id: 50, iden: "curs", name: "诅咒", type: "number", description: "Hero1 Description" },
    { id: 51, iden: "bles", name: "祝福", type: "number", description: "Hero1 Description" },
    { id: 52, iden: "luck", name: "幸运", type: "number", description: "Hero1 Description" },
    { id: 100, iden: "atk", name: "攻击", type: "range", description: "Hero1 Description" },
    { id: 101, iden: "hit", name: "准确", type: "number", description: "Hero1 Description" },
    { id: 110, iden: "matk", name: "魔法", type: "range", description: "Hero1 Description" },
    { id: 120, iden: "watk", name: "道术", type: "range", description: "Hero1 Description" },
    { id: 130, iden: "ed", name: "物理增伤", type: "range", description: "Hero1 Description" },
    { id: 131, iden: "fed", name: "火焰增伤", type: "range", description: "Hero1 Description" },
    { id: 132, iden: "ted", name: "风雷增伤", type: "range", description: "Hero1 Description" },
    { id: 133, iden: "hed", name: "神圣增伤", type: "range", description: "Hero1 Description" },
    { id: 134, iden: "ped", name: "毒素增伤", type: "range", description: "Hero1 Description" },
    // { id: 140, iden: "", name: "物理攻击", type: "range", description: "Hero1 Description" },
    // { id: 141, iden: "", name: "火焰攻击", type: "range", description: "Hero1 Description" },
    // { id: 142, iden: "", name: "风雷攻击", type: "range", description: "Hero1 Description" },
    // { id: 143, iden: "", name: "神圣攻击", type: "range", description: "Hero1 Description" },
    // { id: 144, iden: "", name: "毒素攻击", type: "range", description: "Hero1 Description" },
    { id: 200, iden: "flvl", name: "火焰系技能等级", type: "number", description: "Hero1 Description" },
    { id: 201, iden: "tlvl", name: "风雷系技能等级", type: "number", description: "Hero1 Description" },
    { id: 202, iden: "magelvl", name: "魔法师技能等级", type: "number", description: "Hero1 Description" },
    { id: 203, iden: "blvl", name: "战术系技能等级", type: "number", description: "Hero1 Description" },
    { id: 204, iden: "xlvl", name: "体术系技能等级", type: "number", description: "Hero1 Description" },
    { id: 205, iden: "warrlvl", name: "武士技能等级", type: "number", description: "Hero1 Description" },
    { id: 206, iden: "hlvl", name: "神圣系技能等级", type: "number", description: "Hero1 Description" },
    { id: 207, iden: "plvl", name: "道法系技能等级", type: "number", description: "Hero1 Description" },
    { id: 208, iden: "wlklvl", name: "道士技能等级", type: "number", description: "Hero1 Description" },
    { id: 209, iden: "alvl", name: "所有技能等级", type: "number", description: "Hero1 Description" },
    { id: 210, iden: "slvl", name: "召唤系技能等级", type: "number", description: "Hero1 Description" },
    { id: 211, iden: "glvl", name: "防护系技能等级", type: "number", description: "Hero1 Description" },
    { id: 300, iden: "cate", name: "分类", type: "list", description: "Hero1 Description" },
]

if (new Set(Stat.map((e) => e.id)).size !== Stat.length) {
    throw new Error("Stat id is not unique");
}

/** @type {Record<number, ElementTypeOf<Stat>>}*/
export const StatById = {};
for (const e of Stat) {
    StatById[e.id] = e;
}
