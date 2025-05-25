declare global {
    type UnitId = "warr" | "mage" | "wlk" | "clawcat" | "corpseking" | "redmoondemon" | "anya";
    type UnitType = "hero" | "mob" | "elite" | "boss" | "npc";
    interface IUnitConfig {
        id: UnitId;
        name: string;
        type: UnitType;
        description: string;
        image: string;
        baseStat: Partial<Record<StatId, number[]>>;
    }
}
declare const Units: Array<IUnitConfig>;
declare const UnitById: Partial<Record<UnitId, IUnitConfig>>;
export { Units, UnitById }
