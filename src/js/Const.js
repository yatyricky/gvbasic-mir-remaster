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
    LOOT_AFFIX_COUNT_BLUE: [50, 39, 10, 1],
    MAX_ILVL_FACTOR: 4,
    QUALITY_COLOR: ["rgba(51, 112, 72, 1)", "rgb(64, 138, 58)", "rgb(59, 75, 156)", "purple", "orange"],
    QUALITY_TEXT: ["普通", "优秀", "精良", "史诗", "传说"],

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
        socket: "错02",
    },
}

Const.SIZE2 = Const.SIZE * 2;

export default Const;
