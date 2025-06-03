export const Skills = [
    { id: "fblt", klass: ["mage"], name: "火球术", description: "对指定行的第一个目标造成{0}点火焰伤害。", level: 1, formula: "$0=n1+fdmg*n2", num1: 7, num2: 1 },
    { id: "frng", klass: ["mage"], name: "抗拒火环", description: "对第一列所有目标造成{0}点火焰伤害，并使其在当前回合无法攻击。", level: 7, formula: "$0=n1+fdmg*n2", num1: 2, num2: 0.15 },
    { id: "finf", klass: ["mage"], name: "地狱火", description: "对任意一个目标造成{0}点火焰伤害并造成{1}回合的点燃效果，并且每回合会引燃临近的1个目标。", level: 14, formula: "$0=n1+fdmg*n2,$1=n3+fdmg*n4", num1: 29, num2: 1.2, num3: 2, num4: 0.1 },
    { id: "fbal", klass: ["mage"], name: "大火球", description: "对指定行的第一个目标造成{0}点火焰伤害，并对{1}个临近目标造成全额伤害。", level: 21, formula: "$0=n1+fdmg*n2", num1: 63, num2: 1.25 },
    { id: "fbls", klass: ["mage"], name: "爆裂火焰", description: "随机对6个目标造成{0}点火焰伤害，一定会选中被点燃的目标。", level: 28, formula: "$0=n1+fdmg*n2", num1: 25, num2: 0.75 },
    { id: "fwal", klass: ["mage"], name: "火墙术", description: "对指定2x2范围施展火墙，每回合对该格内的目标造成{0}点火焰伤害，持续3回合。", level: 35, formula: "$0=n1+fdmg*n2", num1: 57, num2: 1.1 },
    { id: "tchm", klass: ["mage"], name: "诱惑之光", description: "有一定概率使目标敌人加入你的队伍，最多诱惑{0}个敌人，无法对精英和Boss施放。", level: 1 },
    { id: "tblt", klass: ["mage"], name: "雷电术", description: "对任意一个目标造成{0}点风雷伤害。", level: 7 },
    { id: "tltn", klass: ["mage"], name: "疾光电影", description: "对指定行所有目标造成{0}点风雷伤害。", level: 14 },
    { id: "tnov", klass: ["mage"], name: "地狱雷光", description: "对指定2行或者2列的所有目标造成{0}点风雷伤害。", level: 21 },
    { id: "tshd", klass: ["mage"], name: "魔法盾", description: "提升物理抗性{0}%，持续{1}回合。", level: 28 },
    { id: "tblz", klass: ["mage"], name: "冰咆哮", description: "对除中心点以外的所有目标造成{0}点风雷伤害。", level: 35 },
    { id: "bbas", klass: ["warr"], name: "基础剑术", description: "增加{0}%命中。", level: 1 },
    { id: "bcrt", klass: ["warr"], name: "攻杀剑术", description: "增加{0}%暴击几率。", level: 7 },
    { id: "bthr", klass: ["warr"], name: "刺杀剑术", description: "对指定行的前2个目标造成{0}点物理伤害，并对第二目标增伤{1}%。", level: 14 },
    { id: "bclv", klass: ["warr"], name: "半月弯刀", description: "对最靠前的一列所有目标造成{0}点物理伤害。", level: 21 },
    { id: "bcrz", klass: ["warr"], name: "十字斩", description: "对任意目标及其十字范围内的所有目标造成{0}点物理伤害。", level: 28 },
    { id: "bfbl", klass: ["warr"], name: "烈火剑法", description: "对指定行的第一个目标造成一次普通攻击并附加{0}%的火焰伤害。", level: 35 },
    { id: "xdef", klass: ["warr"], name: "铁布衫", description: "增加{0}点物理减免。", level: 1 },
    { id: "xdog", klass: ["warr"], name: "猎犬步伐", description: "增加{0}%闪避。", level: 7 },
    { id: "xcta", klass: ["warr"], name: "战斗指挥", description: "降低{0}点物理减免，并增加{1}点物理伤害，持续{2}回合。", level: 14 },
    { id: "xwms", klass: ["warr"], name: "龙皮术", description: "增加{0}点火焰、风雷、神圣、毒素减免。", level: 21 },
    { id: "xchg", klass: ["warr"], name: "野蛮冲撞", description: "对指定行的第一个目标造成普通攻击{0}%的物理伤害。在下一回合中，该目标无法行动，同时，你优先行动。", level: 28 },
    { id: "xtst", klass: ["warr"], name: "霜冻踏地", description: "以指定行的第一个目标为原点，对锥形范围内的所有目标造成{0}点风雷伤害。", level: 35 },
    { id: "hhel", klass: ["wlk"], name: "治愈术", description: "对任意一个目标造成{0}点治疗。", level: 1 },
    { id: "hgsd", klass: ["wlk"], name: "幽灵盾", description: "增加{0}%法术闪避，持续{1}回合。", level: 7 },
    { id: "hinv", klass: ["wlk"], name: "隐身术", description: "隐身{0}回合，使敌人的指向性攻击无法攻击到你，同时，你可以逃跑。", level: 14 },
    { id: "hhsd", klass: ["wlk"], name: "神圣战甲术", description: "提升所有友军{0}点物理减免。", level: 21 },
    { id: "hlok", klass: ["wlk"], name: "困魔咒", description: "对任意不死或者妖魔类敌人施展，使其在{0}回合内无法行动，同时降低其所有抗性{1}%，无法对精英和Boss施放。", level: 28 },
    { id: "hmhl", klass: ["wlk"], name: "神圣责罚", description: "使目标在3回合后受到{0}点神圣伤害。", level: 35 },
    { id: "pbas", klass: ["wlk"], name: "精神力战法", description: "增加{0}%命中。", level: 1 },
    { id: "ppoi", klass: ["wlk"], name: "施毒术", description: "施展装备的毒囊的效果，持续{0}回合，若未装备任何毒囊，则造成{1}点毒素伤害。", level: 7 },
    { id: "pskl", klass: ["wlk"], name: "召唤骷髅", description: "召唤一个生命值{0}，物理攻击{1)的骷髅为你作战，最多{2}个骷髅。", level: 14 },
    { id: "prun", klass: ["wlk"], name: "灵魂火符", description: "对指定行的第一个目标造成{0}点火焰伤害。", level: 21 },
    { id: "pcbl", klass: ["wlk"], name: "降魔剑术", description: "使攻击附加{0}点神圣伤害，并对妖魔增伤{1}%。", level: 28 },
    { id: "psdm", klass: ["wlk"], name: "召唤神兽", description: "召唤一个生命值{0}，火焰攻击{1)的神兽为你作战，神兽可攻击2格目标。", level: 35 },
];

export const SkillById = Object.fromEntries(Skills.map(e => [e.id, e]));
export const SkillGroupByKlass = Skills.reduce((acc, e) => {
    if (e.klass != null) {
        e.klass.forEach(group => {
            if (!acc[group]) {
                acc[group] = [];
            }
            acc[group].push(e);
        })
    }
    return acc;
}, {})
