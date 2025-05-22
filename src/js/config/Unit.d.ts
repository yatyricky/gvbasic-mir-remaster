declare global {
    type UnitId = "warr" | "mage" | "wlk";
    interface IUnitConfig {
        id: UnitId;
        name: string;
        description: string;
        image: string;
        baseStat: Map<StatId, number[]>;
    }
}
declare const Units: Array<IUnitConfig>;
declare const UnitById: Record<UnitId, IUnitConfig>;
export { Units, UnitById }
