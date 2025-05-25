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
    QUALITY_COLOR: ["white", "green", "blue", "purple", "orange"],
}

Const.SIZE2 = Const.SIZE * 2;

export default Const;
