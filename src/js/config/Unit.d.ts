declare global {
    type UnitId = "warr" | "mage" | "wlk" | "deer" | "chicken" | "scarecrow" | "forestrat" | "rabbit" | "bee" | "spider" | "ant" | "clawcat" | "rakecat" | "wolf" | "orc" | "orcwarrior" | "skeleton" | "skeletonarcher" | "skeletonwarrior" | "darkguard" | "caveman" | "zombie" | "pincer" | "blackant" | "redant" | "wedgesnake" | "centipede" | "scorpion" | "mummy" | "archer" | "spearman" | "tombraider" | "darkmage" | "darkwarrior" | "evilsnake" | "giantspider" | "gargoyle" | "demon" | "flamedemon" | "icedemon" | "lightningdemon" | "orcking" | "skeletonking" | "zombieking" | "demonking" | "dragonfly" | "blackknight" | "darklord" | "flamelord" | "icelord" | "corpseking" | "whiteboar" | "redboar" | "bigfoot" | "tentacle" | "redmoondemon" | "yellowdemon" | "dragon" | "phoenix" | "unicorn" | "whitetiger" | "zuma" | "womaking" | "shadowknight" | "dragoneye" | "deathgod" | "flamegod" | "thundergod" | "seagod" | "dragonemperor" | "demonemperor" | "immortal" | "voidlord" | "shopkeeper" | "blacksmith" | "alchemist" | "sage" | "guard" | "priest" | "anya";
    type UnitType = "hero" | "mob" | "elite" | "boss" | "npc";
    interface IUnitConfig {
        id: UnitId;
        name: string;
        type: UnitType;
        tlvl: number;
        area: string;
        description: string;
        image: string;
        baseStat: Partial<Record<StatId, number[]>>;
        maxhp: number[];
        xdmg: number[];
        crit: number[];
        doge: number[];
        spd: number[];
        mdoge: number[];
        xres: number[];
        fres: number[];
        tres: number[];
        hres: number[];
        pres: number[];
    }
}
declare const Units: Array<IUnitConfig>;
declare const UnitById: Partial<Record<UnitId, IUnitConfig>>;
export { Units, UnitById }
