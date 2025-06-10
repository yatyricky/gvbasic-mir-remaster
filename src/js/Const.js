const Const = {
    SIZE: Math.min(Math.floor(window.innerWidth / 20), 20),
    SIZE2: 0,
    QUEUE_MODAL: 20,
    QUEUE_OVERLAY: 15,
    QUEUE_UI: 10,
    QUEUE_NPC: 5,
    QUEUE_PROPS: 1,

    LAYER_WALL: 1,
    LAYER_NPC: 2,

    COLOR_BG: "rgba(51, 112, 72, 1)",
    COLOR_FG: "rgba(1, 29, 1, 1)",
    COLOR_BG_02: "rgba(1, 29, 1, 0.2)",
    COLOR_BG_04: "rgb(42, 94, 60)",

    /** white, green, blue, purple, orange */
    LOOT_WEIGHT_MOB: [1000, 100, 10, 5, 1],
    LOOT_WEIGHT_ELITE: [0, 100, 10, 5, 1],
    LOOT_WEIGHT_BOSS: [0, 38, 60, 15, 3],
    LOOT_LUCK_COEFFICIENT: [0, 0.5, 1, 1, 1],
    LOOT_AFFIX_COUNT_GREEN: [3, 1],
    LOOT_AFFIX_COUNT_BLUE: [100, 70, 5, 1],
    MAX_ILVL_FACTOR: 4,
    QUALITY_COLOR_BG: ["#A3A3A1", "#368F28", "#437EA7", "#9651A8", "rgba(229, 142, 54, 0.95)"],
    QUALITY_COLOR_FG: ["rgb(255,255,255)", "rgb(30,255,0)", "rgb(0,112,221)", "rgb(163,53,238)", "rgb(255,128,0)"],
    QUALITY_TEXT: ["普通", "优秀", "精良", "史诗", "传说"],
    SOCKET_ITEM_CHANCE: 0.15,
    /**@type {Record<ItemType, number>} */
    ITEM_TYPE_SIZE: {
        helm: 1,
        pauldron: 1,
        armor: 1,
        bracelet: 1,
        glove: 1,
        belt: 1,
        pant: 1,
        boot: 1,

        necklace: 1,
        ring: 1,
        charm1: 1,
        charm2: 2,
        charm3: 3,

        sword: 1,
        sword2h: 2,
        dao: 1,
        dao2h: 2,
        axe: 1,
        axe2h: 2,
        mace: 1,
        mace2h: 2,
        dagger: 1,
        staff: 2,
        polearm: 2,
        instrument: 1,

        rune: 1,
        runeword: 1,
        set: 1,
    },
    /**@type {Record<ItemType, SlotType>} */
    ITEM_TYPE_SLOT: {
        helm: "head",
        pauldron: "shoulder",
        armor: "torso",
        bracelet: "wrist",
        glove: "hand",
        belt: "waist",
        pant: "leg",
        boot: "foot",

        necklace: "neck",
        ring: "finger",
        charm1: "accessory",
        charm2: "accessory",
        charm3: "accessory",

        sword: "arms",
        sword2h: "arms",
        dao: "arms",
        dao2h: "arms",
        axe: "arms",
        axe2h: "arms",
        mace: "arms",
        mace2h: "arms",
        dagger: "arms",
        staff: "arms",
        polearm: "arms",
        instrument: "arms",

        rune: "socket",
        runeword: "inherit",
        set: "inherit",
    },
    /**@type {Record<SlotType, number>} */
    SLOT_MAX_SIZE: {
        head: 1,
        neck: 1,
        shoulder: 1,
        torso: 1,
        wrist: 1,
        hand: 1,
        waist: 1,
        leg: 1,
        foot: 1,
        finger: 2,
        accessory: 10,
        arms: 2,
        inherit: 0,
        socket: 0,
    },
    /**@type {SlotType[]} */
    SLOT_SORT: [
        "arms",
        "head",
        "neck",
        "shoulder",
        "torso",
        "wrist",
        "hand",
        "waist",
        "leg",
        "foot",
        "finger",
        "accessory",
    ],
    /**@type {Record<SlotType, string>} */
    SLOT_NAME: {
        head: "头部",
        neck: "颈部",
        shoulder: "肩部",
        torso: "胸部",
        wrist: "手腕",
        hand: "手部",
        waist: "腰部",
        leg: "腿部",
        foot: "脚部",
        finger: "指环",
        accessory: "饰品",
        arms: "武器",
        inherit: "错01",
        socket: "镶嵌",
    },
    /**@type {Array<ItemType>} */
    EQUIPABLE_TYPES: [
        "armor",
        "belt",
        "boot",
        "charm1",
        "charm2",
        "charm3",
        "glove",
        "helm",
        "necklace",
        "pant",
        "pauldron",
        "ring",
        "sword", "sword2h", "dao", "dao2h", "dagger", "axe", "axe2h", "mace", "mace2h", "polearm", "staff", "instrument",
        "bracelet",
    ],
    /**@type {Record<ItemType, string>} */
    TYPE_NAME: {
        helm: "头盔",
        pauldron: "肩甲",
        armor: "护甲",
        bracelet: "护腕",
        glove: "手套",
        belt: "腰带",
        pant: "腿甲",
        boot: "靴子",

        necklace: "项链",
        ring: "戒指",
        charm1: "护身符",
        charm2: "护身符",
        charm3: "护身符",

        sword: "单手剑",
        sword2h: "双手剑",
        dao: "单手刀",
        dao2h: "双手刀",
        axe: "单手斧",
        axe2h: "双手斧",
        mace: "单手锤",
        mace2h: "双手锤",
        dagger: "匕首",
        staff: "法杖",
        polearm: "长柄武器",
        instrument: "法器",

        rune: "五行符",
        runeword: "符文之语",
        set: "套装",
    },
    /**@type {Record<ItemType, ItemSubType>} */
    ITEM_SUBTYPE: {
        helm: "none",
        pauldron: "none",
        armor: "none",
        bracelet: "none",
        glove: "none",
        belt: "none",
        pant: "none",
        boot: "none",

        necklace: "none",
        ring: "none",
        charm1: "none",
        charm2: "none",
        charm3: "none",

        sword: "1h",
        sword2h: "2h",
        dao: "1h",
        dao2h: "2h",
        axe: "1h",
        axe2h: "2h",
        mace: "1h",
        mace2h: "2h",
        dagger: "1h",
        staff: "2h",
        polearm: "2h",
        instrument: "offhand",

        rune: "none",
        runeword: "none",
        set: "none",
    },
    /**@type {Partial<Record<UnitId, Array<Array<ItemSubType>>>>} */
    EQUIP_POLICY: {
        warr: [[], ["1h"], ["offhand"], ["2h"], ["1h", "offhand"], ["offhand", "1h"], ["1h", "1h"]],
        mage: [[], ["1h"], ["offhand"], ["2h"], ["1h", "offhand"], ["offhand", "1h"]],
        wlk: [[], ["1h"], ["offhand"], ["2h"], ["1h", "offhand"], ["offhand", "1h"]],
    },
    /**@type {Partial<Record<AffixId, number>>} */
    AFFIXID_2_SOCKET_COUNT: {
        "sok1": 1,
        "sok2": 2,
        "sok3": 3,
        "sok4": 4,
        "sok5": 5,
    },
    QUALITY_SOCKET_COUNT: [99, 2, 1, 1, 1], // Normal, Magic, Rare, Epic, Legendary
}

Const.SIZE2 = Const.SIZE * 2;

export default Const;

/**

armor
belt
boot
glove
helm
pant
pauldron
bracelet

necklace
ring
charm1
charm2
charm3

sword
sword2h
dao
dao2h
dagger
axe
axe2h
mace
mace2h
polearm
staff
instrument

# all physical items
sword,sword2h,dao,dao2h,dagger,axe,axe2h,mace,mace2h,polearm

# all magical items
staff,instrument

# all weapon items
sword,sword2h,dao,dao2h,dagger,axe,axe2h,mace,mace2h,polearm,staff,instrument

# all 2h weapon items
sword2h,dao2h,axe2h,mace2h,polearm,staff

# all armor items
armor,belt,boot,glove,helm,pant,pauldron,bracelet

# all accessory items
necklace,ring,charm1,charm2,charm3

# all charm items
charm1,charm2,charm3

 */