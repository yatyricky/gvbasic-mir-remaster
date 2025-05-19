/**
 * @typedef {"number" | "range" | "set"} StatValueType
 */

/**
 * @typedef {object} StatConfig
 * @property {import("../configData/Stat").StatId} id - The unique identifier for the stat.
 * @property {string} name - The display name of the stat.
 * @property {StatValueType} type - The type of the stat.
 * @property {string} description - The description of the stat.
 * @property {import("../configData/Stat").StatId[]} [depends] - An array of stat IDs that this stat depends on.
 * @property {(d: import("../data/ReactStat").default) => void} [derived] - An array of stat IDs that this stat derives from.
 * @property {string} [cgroup] - The image associated with the stat.
 */

/**@type {Array<StatConfig>} */
export const Stat = [
    { id: "rthp", name: "生命", type: "number", description: "Hero1 Description", depends: ["rtmaxhp"], derived: (d) => (d.setStat("rthp", Math.min(d.getStat("rtmaxhp"), d.getStat("rthp")))) },
    { id: "rtmaxhp", name: "生命上限", type: "number", description: "Hero1 Description", depends: ["maxhp", "mhex"], derived: (d) => (d.setStat("rtmaxhp", Math.floor(d.getStat("maxhp") * (1 + d.getStat("mhex") / 100)))) },
    { id: "maxhp", name: "基础生命上限", type: "number", description: "Hero1 Description" },
    { id: "mhex", name: "生命上限", type: "number", description: "Hero1 Description" },

    { id: "rtmp", name: "魔法值", type: "number", description: "Hero1 Description", depends: ["rtmaxmp"], derived: (d) => (d.setStat("rtmp", Math.min(d.getStat("rtmaxmp"), d.getStat("rtmp")))) },
    { id: "rtmaxmp", name: "魔法上限", type: "number", description: "Hero1 Description", depends: ["maxmp", "mpex"], derived: (d) => (d.setStat("rtmaxmp", Math.floor(d.getStat("maxmp") * (1 + d.getStat("mpex") / 100)))) },
    { id: "maxmp", name: "基础魔法上限", type: "number", description: "Hero1 Description" },
    { id: "mpex", name: "魔法上限", type: "number", description: "Hero1 Description" },

    { id: "hreg", name: "恢复生命", type: "number", description: "Hero1 Description" },
    { id: "mreg", name: "恢复魔法", type: "number", description: "Hero1 Description" },

    { id: "exp", name: "经验值", type: "number", description: "Hero1 Description" },

    { id: "xdr", name: "物理减免", type: "range", description: "Hero1 Description" },
    { id: "fdr", name: "火焰减免", type: "range", description: "Hero1 Description" },
    { id: "tdr", name: "风雷减免", type: "range", description: "Hero1 Description" },
    { id: "hdr", name: "神圣减免", type: "range", description: "Hero1 Description" },
    { id: "pdr", name: "毒素减免", type: "range", description: "Hero1 Description" },

    { id: "xres", name: "基础物理抗性", type: "number", description: "Hero1 Description" },
    { id: "fres", name: "基础火焰抗性", type: "number", description: "Hero1 Description" },
    { id: "tres", name: "基础风雷抗性", type: "number", description: "Hero1 Description" },
    { id: "hres", name: "基础神圣抗性", type: "number", description: "Hero1 Description" },
    { id: "pres", name: "基础毒素抗性", type: "number", description: "Hero1 Description" },

    { id: "mxxres", name: "最大物理抗性", type: "number", description: "Hero1 Description" },
    { id: "mxfres", name: "最大火焰抗性", type: "number", description: "Hero1 Description" },
    { id: "mxtres", name: "最大风雷抗性", type: "number", description: "Hero1 Description" },
    { id: "mxhres", name: "最大神圣抗性", type: "number", description: "Hero1 Description" },
    { id: "mxpres", name: "最大毒素抗性", type: "number", description: "Hero1 Description" },

    { id: "rtxres", name: "物理抗性", type: "number", description: "Hero1 Description", depends: ["xres", "mxxres"], derived: (d) => (d.setStat("rtxres", Math.min(75 + d.getStat("mxxres"), d.getStat("xres")))) },
    { id: "rtfres", name: "火焰抗性", type: "number", description: "Hero1 Description", depends: ["fres", "mxfres"], derived: (d) => (d.setStat("rtfres", Math.min(75 + d.getStat("mxfres"), d.getStat("fres")))) },
    { id: "rttres", name: "风雷抗性", type: "number", description: "Hero1 Description", depends: ["tres", "mxtres"], derived: (d) => (d.setStat("rttres", Math.min(75 + d.getStat("mxtres"), d.getStat("tres")))) },
    { id: "rthres", name: "神圣抗性", type: "number", description: "Hero1 Description", depends: ["hres", "mxhres"], derived: (d) => (d.setStat("rthres", Math.min(75 + d.getStat("mxhres"), d.getStat("hres")))) },
    { id: "rtpres", name: "毒素抗性", type: "number", description: "Hero1 Description", depends: ["pres", "mxpres"], derived: (d) => (d.setStat("rtpres", Math.min(75 + d.getStat("mxpres"), d.getStat("pres")))) },

    { id: "ures", name: "对不死减伤", type: "number", description: "Hero1 Description", cgroup: "undead/demon" },
    { id: "dres", name: "对妖魔减伤", type: "number", description: "Hero1 Description", cgroup: "undead/demon" },
    { id: "mres", name: "对近战减伤", type: "number", description: "Hero1 Description", cgroup: "melee/ranged" },
    { id: "rres", name: "对远程减伤", type: "number", description: "Hero1 Description", cgroup: "melee/ranged" },
    { id: "cres", name: "对精英减伤", type: "number", description: "Hero1 Description", cgroup: "elite" },

    { id: "curs", name: "诅咒", type: "number", description: "Hero1 Description" },
    { id: "bles", name: "祝福", type: "number", description: "Hero1 Description" },
    { id: "luck", name: "幸运", type: "number", description: "Hero1 Description" },
    { id: "eg", name: "获得金币", type: "number", description: "Hero1 Description" },

    { id: "spd", name: "速度", type: "number", description: "Hero1 Description" },
    { id: "doge", name: "闪避", type: "number", description: "Hero1 Description" },
    { id: "mdoge", name: "法术闪避", type: "number", description: "Hero1 Description" },

    { id: "xatk", name: "力量", type: "range", description: "Hero1 Description" },
    { id: "hit", name: "准确", type: "number", description: "Hero1 Description" },
    { id: "matk", name: "魔力", type: "range", description: "Hero1 Description" },
    { id: "watk", name: "道术", type: "range", description: "Hero1 Description" },

    { id: "xed", name: "物理增伤", type: "number", description: "Hero1 Description" },
    { id: "fed", name: "火焰增伤", type: "number", description: "Hero1 Description" },
    { id: "ted", name: "风雷增伤", type: "number", description: "Hero1 Description" },
    { id: "hed", name: "神圣增伤", type: "number", description: "Hero1 Description" },
    { id: "ped", name: "毒素增伤", type: "number", description: "Hero1 Description" },
    { id: "ued", name: "对不死增伤", type: "number", description: "Hero1 Description" },
    { id: "ded", name: "对妖魔增伤", type: "number", description: "Hero1 Description" },
    { id: "med", name: "对近战增伤", type: "number", description: "Hero1 Description" },
    { id: "red", name: "对远程增伤", type: "number", description: "Hero1 Description" },
    { id: "ced", name: "对精英增伤", type: "number", description: "Hero1 Description" },

    { id: "doted", name: "持续性效果增伤", type: "number", description: "Hero1 Description" },
    { id: "hled", name: "治疗增强", type: "number", description: "Hero1 Description" },

    // { id: "", name: "物理攻击", type: "range", description: "Hero1 Description" },
    // { id: "", name: "火焰攻击", type: "range", description: "Hero1 Description" },
    // { id: "", name: "风雷攻击", type: "range", description: "Hero1 Description" },
    // { id: "", name: "神圣攻击", type: "range", description: "Hero1 Description" },
    // { id: "", name: "毒素攻击", type: "range", description: "Hero1 Description" },
    { id: "flvl", name: "火焰系技能等级", type: "number", description: "Hero1 Description" },
    { id: "tlvl", name: "风雷系技能等级", type: "number", description: "Hero1 Description" },
    { id: "magelvl", name: "魔法师技能等级", type: "number", description: "Hero1 Description" },
    { id: "blvl", name: "战术系技能等级", type: "number", description: "Hero1 Description" },
    { id: "xlvl", name: "体术系技能等级", type: "number", description: "Hero1 Description" },
    { id: "warrlvl", name: "武士技能等级", type: "number", description: "Hero1 Description" },
    { id: "hlvl", name: "神圣系技能等级", type: "number", description: "Hero1 Description" },
    { id: "plvl", name: "道法系技能等级", type: "number", description: "Hero1 Description" },
    { id: "wlklvl", name: "道士技能等级", type: "number", description: "Hero1 Description" },
    { id: "alvl", name: "所有技能等级", type: "number", description: "Hero1 Description" },
    { id: "slvl", name: "召唤系技能等级", type: "number", description: "Hero1 Description" },
    { id: "glvl", name: "防护系技能等级", type: "number", description: "Hero1 Description" },

    { id: "cate", name: "分类", type: "set", description: "Hero1 Description" },
    { id: "cb", name: "粉碎性打击", type: "number", description: "Hero1 Description" },
    { id: "ow", name: "撕裂伤口", type: "number", description: "Hero1 Description" },
    { id: "ref", name: "反弹伤害", type: "number", description: "Hero1 Description" },
    { id: "ll", name: "近战吸血", type: "number", description: "Hero1 Description" },
    { id: "ml", name: "近战吸魔", type: "number", description: "Hero1 Description" },

    { id: "lr", name: "降低物理抗性", type: "number", description: "Hero1 Description" },
    { id: "flr", name: "降低火焰抗性", type: "number", description: "Hero1 Description" },
    { id: "tlr", name: "降低风雷抗性", type: "number", description: "Hero1 Description" },
    { id: "hlr", name: "降低神圣抗性", type: "number", description: "Hero1 Description" },
    { id: "plr", name: "降低毒素抗性", type: "number", description: "Hero1 Description" },

    { id: "skfbltmage", name: "火球术(限魔法师)", type: "number", description: "Hero1 Description" },
    { id: "skfrngmage", name: "抗拒火环(限魔法师)", type: "number", description: "Hero1 Description" },
    { id: "skfinfmage", name: "地狱火(限魔法师)", type: "number", description: "Hero1 Description" },
    { id: "skfbalmage", name: "大火球(限魔法师)", type: "number", description: "Hero1 Description" },
    { id: "skfblsmage", name: "爆裂火焰(限魔法师)", type: "number", description: "Hero1 Description" },
    { id: "skfwalmage", name: "火墙术(限魔法师)", type: "number", description: "Hero1 Description" },
    { id: "skfblt", name: "火球术", type: "number", description: "Hero1 Description" },
    { id: "skfrng", name: "抗拒火环", type: "number", description: "Hero1 Description" },
    { id: "skfinf", name: "地狱火", type: "number", description: "Hero1 Description" },
    { id: "skfbal", name: "大火球", type: "number", description: "Hero1 Description" },
    { id: "skfbls", name: "爆裂火焰", type: "number", description: "Hero1 Description" },
    { id: "skfwal", name: "火墙术", type: "number", description: "Hero1 Description" },

    { id: "sktchmmage", name: "诱惑之光(限魔法师)", type: "number", description: "Hero1 Description" },
    { id: "sktbltmage", name: "雷电术(限魔法师)", type: "number", description: "Hero1 Description" },
    { id: "sktltnmage", name: "疾光电影(限魔法师)", type: "number", description: "Hero1 Description" },
    { id: "sktnovmage", name: "地狱雷光(限魔法师)", type: "number", description: "Hero1 Description" },
    { id: "sktshdmage", name: "魔法盾(限魔法师)", type: "number", description: "Hero1 Description" },
    { id: "sktblzmage", name: "冰咆哮(限魔法师)", type: "number", description: "Hero1 Description" },
    { id: "sktchm", name: "诱惑之光", type: "number", description: "Hero1 Description" },
    { id: "sktblt", name: "雷电术", type: "number", description: "Hero1 Description" },
    { id: "sktltn", name: "疾光电影", type: "number", description: "Hero1 Description" },
    { id: "sktnov", name: "地狱雷光", type: "number", description: "Hero1 Description" },
    { id: "sktshd", name: "魔法盾", type: "number", description: "Hero1 Description" },
    { id: "sktblz", name: "冰咆哮", type: "number", description: "Hero1 Description" },

    { id: "skbbaswarr", name: "基础剑术(限武士)", type: "number", description: "Hero1 Description" },
    { id: "skbcrtwarr", name: "攻杀剑术(限武士)", type: "number", description: "Hero1 Description" },
    { id: "skbthrwarr", name: "刺杀剑术(限武士)", type: "number", description: "Hero1 Description" },
    { id: "skbclvwarr", name: "半月弯刀(限武士)", type: "number", description: "Hero1 Description" },
    { id: "skbcrzwarr", name: "十字斩(限武士)", type: "number", description: "Hero1 Description" },
    { id: "skbfblwarr", name: "烈火剑法(限武士)", type: "number", description: "Hero1 Description" },
    { id: "skbbas", name: "基础剑术", type: "number", description: "Hero1 Description" },
    { id: "skbcrt", name: "攻杀剑术", type: "number", description: "Hero1 Description" },
    { id: "skbthr", name: "刺杀剑术", type: "number", description: "Hero1 Description" },
    { id: "skbclv", name: "半月弯刀", type: "number", description: "Hero1 Description" },
    { id: "skbcrz", name: "十字斩", type: "number", description: "Hero1 Description" },
    { id: "skbfbl", name: "烈火剑法", type: "number", description: "Hero1 Description" },

    { id: "skxdefwarr", name: "铁布衫(限武士)", type: "number", description: "Hero1 Description" },
    { id: "skxdogwarr", name: "猎犬步伐(限武士)", type: "number", description: "Hero1 Description" },
    { id: "skxctawarr", name: "战斗指挥(限武士)", type: "number", description: "Hero1 Description" },
    { id: "skxwmswarr", name: "龙皮术(限武士)", type: "number", description: "Hero1 Description" },
    { id: "skxchgwarr", name: "野蛮冲撞(限武士)", type: "number", description: "Hero1 Description" },
    { id: "skxtstwarr", name: "霜冻踏地(限武士)", type: "number", description: "Hero1 Description" },
    { id: "skxdef", name: "铁布衫", type: "number", description: "Hero1 Description" },
    { id: "skxdog", name: "猎犬步伐", type: "number", description: "Hero1 Description" },
    { id: "skxcta", name: "战斗指挥", type: "number", description: "Hero1 Description" },
    { id: "skxwms", name: "龙皮术", type: "number", description: "Hero1 Description" },
    { id: "skxchg", name: "野蛮冲撞", type: "number", description: "Hero1 Description" },
    { id: "skxtst", name: "霜冻踏地", type: "number", description: "Hero1 Description" },

    { id: "skhhelwlok", name: "治愈术(限道士)", type: "number", description: "Hero1 Description" },
    { id: "skhgsdwlok", name: "幽灵盾(限道士)", type: "number", description: "Hero1 Description" },
    { id: "skhinvwlok", name: "隐身术(限道士)", type: "number", description: "Hero1 Description" },
    { id: "skhhsdwlok", name: "神圣战甲术(限道士)", type: "number", description: "Hero1 Description" },
    { id: "skhlokwlok", name: "困魔咒(限道士)", type: "number", description: "Hero1 Description" },
    { id: "skhmhlwlok", name: "群体治愈术(限道士)", type: "number", description: "Hero1 Description" },
    { id: "skhhel", name: "治愈术", type: "number", description: "Hero1 Description" },
    { id: "skhgsd", name: "幽灵盾", type: "number", description: "Hero1 Description" },
    { id: "skhinv", name: "隐身术", type: "number", description: "Hero1 Description" },
    { id: "skhhsd", name: "神圣战甲术", type: "number", description: "Hero1 Description" },
    { id: "skhlok", name: "困魔咒", type: "number", description: "Hero1 Description" },
    { id: "skhmhl", name: "群体治愈术", type: "number", description: "Hero1 Description" },

    { id: "skpbaswlok", name: "精神力战法(限道士)", type: "number", description: "Hero1 Description" },
    { id: "skppoiwlok", name: "施毒术(限道士)", type: "number", description: "Hero1 Description" },
    { id: "skpsklwlok", name: "召唤骷髅(限道士)", type: "number", description: "Hero1 Description" },
    { id: "skprunwlok", name: "灵魂火符(限道士)", type: "number", description: "Hero1 Description" },
    { id: "skpcblwlok", name: "降魔剑术(限道士)", type: "number", description: "Hero1 Description" },
    { id: "skpsdmwlok", name: "召唤神兽(限道士)", type: "number", description: "Hero1 Description" },
    { id: "skpbas", name: "精神力战法", type: "number", description: "Hero1 Description" },
    { id: "skppoi", name: "施毒术", type: "number", description: "Hero1 Description" },
    { id: "skpskl", name: "召唤骷髅", type: "number", description: "Hero1 Description" },
    { id: "skprun", name: "灵魂火符", type: "number", description: "Hero1 Description" },
    { id: "skpcbl", name: "降魔剑术", type: "number", description: "Hero1 Description" },
    { id: "skpsdm", name: "召唤神兽", type: "number", description: "Hero1 Description" },
]
