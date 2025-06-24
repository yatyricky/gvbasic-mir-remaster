export const Skills = [
    { id: "fblt", klass: "mage", tag: ["skmage", "fire", "fdmg"], posx: 1, level: 1, icon: "Spell_Fire_FireBolt", name: "火球术", description: "对指定行的第一个目标造成{0}。", n1: 3, n2: 7, n3: 2, n4: 4, n5: 1 },
    { id: "frng", klass: "mage", tag: ["skmage", "fire", "fdmg"], posx: 1, level: 7, prerequisite: ["fblt"], icon: "Spell_Fire_SealOfFire", name: "抗拒火环", description: "对第一列所有目标造成{0}，并使其在当前回合无法攻击。", n1: 1, n2: 2, n3: 0.1, n4: 0.2, n5: 0.15 },
    { id: "finf", klass: "mage", tag: ["skmage", "fire", "fdmg"], posx: 2, level: 14, prerequisite: ["frng"], icon: "Spell_Fire_Incinerate", name: "地狱火", description: "对任意一个目标造成{0}害并造成{1}回合的点燃效果，并且每回合会引燃临近的{2}个目标。", n1: 12, n2: 29, n3: 8, n4: 17, n5: 1.2, n6: 2, n7: 0.1, n8: 1 },
    { id: "fbal", klass: "mage", tag: ["skmage", "fire", "fdmg"], posx: 1, level: 21, prerequisite: ["frng"], icon: "Spell_Fire_Fireball02", name: "大火球", description: "对指定行的第一个目标造成{0}，并对{1}个临近目标造成全额伤害。", n1: 27, n2: 93, n3: 18, n4: 36, n5: 1.25, n6: 1 },
    { id: "fbls", klass: "mage", tag: ["skmage", "fire", "fdmg"], posx: 1, level: 28, prerequisite: ["fbal"], icon: "Spell_Fire_Volcano", name: "爆裂火焰", description: "随机对6个目标造成{0}，一定会选中被点燃的目标。", n1: 11, n2: 25, n3: 5, n4: 13, n5: 0.75 },
    { id: "fwal", klass: "mage", tag: ["skmage", "fire", "fdmg"], posx: 2, level: 35, prerequisite: ["finf"], icon: "Spell_Fire_SelfDestruct", name: "火墙术", description: "对指定2x2范围施展火墙，每回合对该格内的目标造成{0}，持续{1}回合。", n1: 24, n2: 57, n3: 12, n4: 32, n5: 1.1, n6: 3 },
    { id: "tchm", klass: "mage", tag: ["skmage", "thunder", "summon", "luck"], posx: 3, level: 1, icon: "Spell_Shadow_Charm", name: "诱惑之光", description: "有{0.2}%的概率使目标敌人加入你的队伍，最多诱惑{1}个敌人，无法对精英和Boss施放。每{2}点运气可提升1%成功率。", n1: 25, n2: 5, n3: 75, n4: 1, n5: 0.25, n6: 8, n7: 10 },
    { id: "tblt", klass: "mage", tag: ["skmage", "thunder", "tdmg"], posx: 1, level: 7, icon: "Spell_Nature_Lightning", name: "雷电术", description: "对指定任意一个目标造成{0}。", n1: 1, n2: 22, n3: 1, n4: 12, n5: 1.2 },
    { id: "tltn", klass: "mage", tag: ["skmage", "thunder", "tdmg"], posx: 1, level: 14, prerequisite: ["tblt"], icon: "Spell_Nature_LightningBolt", name: "疾光电影", description: "对指定行所有目标造成{0}，法术命中-20%。", n1: 1, n2: 35, n3: 1, n4: 19, n5: 0.8 },
    { id: "tnov", klass: "mage", tag: ["skmage", "thunder", "tdmg"], posx: 1, level: 21, prerequisite: ["tltn"], icon: "Spell_Nature_LightningOverload", name: "地狱雷光", description: "对指定2行或者2列的所有目标造成{0}。", n1: 1, n2: 105, n3: 1, n4: 37, n5: 0.8 },
    { id: "tshd", klass: "mage", tag: ["skmage", "thunder", "guardian"], posx: 2, level: 28, prerequisite: ["tnov"], icon: "Spell_Nature_LightningShield", name: "魔法盾", description: "提升物理抗性{0}%，持续{1}回合。", n1: 25, n2: 5, n3: 2, n4: 0.5 },
    { id: "tblz", klass: "mage", tag: ["skmage", "thunder", "tdmg"], posx: 1, level: 35, prerequisite: ["tnov"], icon: "Spell_Frost_IceStorm", name: "冰咆哮", description: "对除中心点以外的所有目标造成{0}。", n1: 1, n2: 72, n3: 1, n4: 45, n5: 0.6 },
    { id: "hwoh", tag: ["skmage", "holy"], posx: 1, level: 28, icon: "Spell_Holy_Excorcism_02", name: "圣言", description: "有{0.2}%几率对不死或者妖魔目标造成其生命值25%的伤害。不受伤害加成类属性影响。", n1: 10, n2: 1 },
    { id: "bbas", klass: "warr", tag: ["skwarr", "battle"], posx: 1, level: 1, icon: "Ability_MeleeDamage", name: "基础剑术", description: "增加{0.2}%命中。", n1: 1, n2: 0.5 },
    { id: "bcrt", klass: "warr", tag: ["skwarr", "battle"], posx: 2, level: 7, prerequisite: ["bbas"], icon: "Ability_CriticalStrike", name: "攻杀剑术", description: "增加{0.2}%暴击几率。", n1: 1, n2: 0.5 },
    { id: "bthr", klass: "warr", tag: ["skwarr", "battle", "xdmg"], posx: 2, level: 14, prerequisite: ["bcrt"], icon: "Ability_BackStab", name: "刺杀剑术", description: "对指定行的前2个目标造成{0}，并对第二目标增伤{1.2}%。", n1: 2, n2: 8, n3: 2, n4: 4, n5: 0.7, n6: 5, n7: 5 },
    { id: "bele", klass: "warr", tag: ["skwarr", "battle", "fdmg", "tdmg", "hdmg", "pdmg"], posx: 1, level: 21, prerequisite: ["bbas"], icon: "Ability_Warrior_WeaponMastery", name: "元素剑术", description: "使你的所有攻击能附带{0.2}%的元素伤害。当前增加{1}。", n1: 5, n2: 5 },
    { id: "bclv", klass: "warr", tag: ["skwarr", "battle", "xdmg"], posx: 2, level: 28, prerequisite: ["bthr"], icon: "Ability_Warrior_Cleave", name: "半月弯刀", description: "对最靠前的一列所有目标造成{0}。", n1: 22, n2: 76, n3: 10, n4: 31, n5: 0.9 },
    { id: "bfbl", klass: "warr", tag: ["skwarr", "battle", "fire", "xdmg", "fdmg"], posx: 1, level: 35, prerequisite: ["bele"], icon: "Ability_Warrior_PunishingBlow", name: "烈火剑法", description: "对指定行的第一个目标造成一次普通攻击并附加普通攻击{0.2}%的火焰伤害。当前增加{1}。", n1: 50, n2: 7 },
    { id: "xdef", klass: "warr", tag: ["skwarr", "xskill"], posx: 1, level: 1, icon: "Ability_Warrior_ImprovedDisciplines", name: "铁布衫", description: "增加{0}点物理减免。", n1: 2, n2: 4, n3: 1, n4: 2 },
    { id: "xpos", klass: "warr", tag: ["skwarr", "xskill", "xdmg"], posx: 2, level: 7, icon: "Spell_Holy_GreaterBlessingofKings", name: "镇魂拳法", description: "对任意指定目标造成{0}，并使其在接下来的{1}回合中无法施法。", n1: 2, n2: 5, n3: 2, n4: 5, n5: 0.9, n6: 1, n7: 0.2 },
    { id: "xdog", klass: "warr", tag: ["skwarr", "xskill"], posx: 1, level: 14, icon: "Ability_Stealth", name: "猎犬步伐", description: "增加{0}%闪避。", n1: 1, n2: 0.5 },
    { id: "xcta", klass: "warr", tag: ["skwarr", "xskill", "xdmg"], posx: 2, level: 21, prerequisite: ["xpos"], icon: "Ability_Warrior_RallyingCry", name: "战斗指挥", description: "降低{0}点物理减免，并增加{1}，持续{2}回合。", n1: 2, n2: 4, n3: 1, n4: 2, n5: 4, n6: 8, n7: 2, n8: 4, n9: 1, n10: 0.35 },
    { id: "xchg", klass: "warr", tag: ["skwarr", "xskill", "xdmg"], posx: 2, level: 28, prerequisite: ["xcta"], icon: "Ability_Warrior_SecondWind", name: "野蛮冲撞", description: "对指定行的第一个目标造成普通攻击{0.2}%的物理伤害。在下一回合中，该目标无法行动，同时，你优先行动。当前造成{1}。", n1: 120, n2: 6 },
    { id: "xtst", klass: "warr", tag: ["skwarr", "xskill", "thunder", "xdmg", "tdmg"], posx: 2, level: 35, prerequisite: ["xchg"], icon: "Spell_Frost_FreezingBreath", name: "霜冻踏地", description: "以指定行的第一个目标为原点，对锥形范围内的所有目标造成{0}。", n1: 1, n2: 135, n3: 1, n4: 71, n5: 1.3 },
    { id: "xwms", tag: ["skwarr", "xskill"], posx: 1, level: 21, icon: "Ability_Warlock_EmpoweredImp", name: "龙皮术", description: "增加{0}点火焰、风雷、神圣、毒素减免。", n1: 5, n2: 9, n3: 3, n4: 5 },
    { id: "bcrz", tag: ["skwarr", "battle", "xdmg"], posx: 2, level: 28, icon: "Ability_Warrior_Challange", name: "十字斩", description: "对任意目标及其十字范围内的所有目标造成{0}点物理伤害。", n1: 32, n2: 101, n3: 18, n4: 60, n5: 1 },
    { id: "hhel", klass: "wlk", tag: ["skwlok", "holy", "heal"], posx: 1, level: 1, icon: "Spell_Holy_Heal", name: "治愈术", description: "对任意一个目标造成{0}。", n1: 5, n2: 10, n3: 2, n4: 5 },
    { id: "hgsd", klass: "wlk", tag: ["skwlok", "holy", "guardian"], posx: 3, level: 7, icon: "Spell_Holy_GreaterBlessingofSanctuary", name: "幽灵盾", description: "增加{0.2}%法术闪避，持续{1}回合。", n1: 1, n2: 0.5, n3: 3, n4: 0.35 },
    { id: "hinv", klass: "wlk", tag: ["skwlok", "holy"], posx: 2, level: 14, icon: "Spell_Magic_LesserInvisibilty", name: "隐身术", description: "隐身{0}回合，使敌人的指向性攻击无法攻击到你，同时，你可以逃跑。", n1: 1, n2: 1 },
    { id: "hhsd", klass: "wlk", tag: ["skwlok", "holy", "guardian"], posx: 3, level: 21, prerequisite: ["hgsd"], icon: "Spell_Holy_BlessingOfProtection", name: "神圣战甲术", description: "提升所有友军{0}点物理减免。", n1: 20, n2: 35, n3: 11, n4: 18 },
    { id: "hlok", klass: "wlk", tag: ["skwlok", "holy"], posx: 2, level: 28, prerequisite: ["hinv"], icon: "Spell_Nature_Slow", name: "困魔咒", description: "对任意不死或者妖魔类敌人施展，使其在{0}回合内无法行动，同时降低其所有抗性{1}%，无法对精英和Boss施放。", n1: 1, n2: 0.1, n3: 10, n4: 2.5 },
    { id: "hmhl", klass: "wlk", tag: ["skwlok", "holy", "hdmg"], posx: 1, level: 35, prerequisite: ["hhel", "hlok"], icon: "Spell_Holy_HolySmite", name: "神圣责罚", description: "使目标在{0}回合后受到{1}。", n1: 3, n2: 300, n3: 155, n4: 2.2 },
    { id: "pbas", klass: "wlk", tag: ["skwlok", "psyco", "battle"], posx: 1, level: 1, icon: "Spell_Holy_RighteousnessAura", name: "精神力战法", description: "增加{0.2}%命中。", n1: 1, n2: 0.5 },
    { id: "ppoi", klass: "wlk", tag: ["skwlok", "psyco", "poison", "pdmg"], posx: 2, level: 7, icon: "Spell_Shadow_AbominationExplosion", name: "施毒术", description: "造成{0}，持续{1}回合。", n1: 0, n2: 10, n3: 0, n4: 5, n5: 0.33, n6: 4 },
    { id: "pskl", klass: "wlk", tag: ["skwlok", "psyco", "summon"], posx: 3, level: 14, icon: "Spell_Shadow_RaiseDead", name: "召唤骷髅", description: "召唤一个生命值{0}，可以造成{1}的骷髅为你作战，最多{2}个骷髅。", n1: 100, n2: 75, n3: 1, n4: 2, n5: 0.5, n6: 0.9, n7: 1, n8: 0.25 },
    { id: "prun", klass: "wlk", tag: ["skwlok", "psyco", "fire", "fdmg"], posx: 2, level: 21, prerequisite: ["ppoi"], icon: "Spell_Fire_Rune", name: "灵魂火符", description: "对指定行的第一个目标造成{0}。", n1: 54, n2: 190, n3: 27, n4: 95, n5: 2 },
    { id: "pcbl", klass: "wlk", tag: ["skwlok", "psyco", "battle", "hdmg"], posx: 1, level: 28, prerequisite: ["pbas"], icon: "Spell_Holy_WeaponMastery", name: "降魔剑术", description: "使攻击附加{0}，并对妖魔增伤{1.2}%。", n1: 114, n2: 63, n3: 2.2, n4: 50, n5: 20 },
    { id: "psdm", klass: "wlk", tag: ["skwlok", "psyco", "summon", "fire"], posx: 3, level: 35, prerequisite: ["pskl"], icon: "Spell_Fire_Elemental_Totem", name: "召唤神兽", description: "召唤一个生命值{0}，可以造成{1}的神兽为你作战，神兽可攻击{2}格目标。", n1: 350, n2: 180, n3: 44, n4: 72, n5: 21, n6: 30, n7: 2 },
];

export const SkillById = Object.fromEntries(Skills.map(e => [e.id, e]));
export const SkillGroupByKlass = Skills.reduce((acc, e) => {
    if (e.klass != null) {
        let arr = e.klass;
        if (!Array.isArray(arr)) { arr = [arr]; }
        arr.forEach(group => {
            if (!acc[group]) {
                acc[group] = [];
            }
            acc[group].push(e);
        })
    }
    return acc;
}, {})
