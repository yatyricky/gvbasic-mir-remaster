declare global {
    type UnitId = "warr" | "mage" | "wlk";
    interface IUnitConfig {
        id: UnitId;
        name: string;
        description: string;
        image: string;
        baseStat: Partial<Record<StatId, number[]>>;
    }
}
declare const Units: Array<IUnitConfig>;
declare const UnitById: Partial<Record<UnitId, IUnitConfig>>;
export { Units, UnitById }
