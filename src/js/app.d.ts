import { StatId } from "./config/Stat";

declare global {
    type ElementTypeOf<T> = T extends Array<infer U> ? U : never;

    type ItemFragmentOperation = "equip" | "unequip" | "socket" | "socketFill" | "buy";
    type SlotType = "torso" | "waist" | "foot" | "accessory" | "hand" | "head" | "neck" | "leg" | "shoulder" | "finger" | "arms" | "wrist" | "socket" | "inherit";
    type ItemSubType = "none" | "1h" | "2h" | "offhand";

    interface ItemFragmentProps {
        item: ItemSaveData;
        left: number;
        top: number;
        width?: number;
        height?: number;
        operations?: Array<ItemFragmentOperation>;
        callbacks?: Partial<Record<ItemFragmentOperation, () => void>>;
        clickable?: boolean;
    }

    type StatData = Partial<Record<StatId, StatValueSaveData>>;

    interface IAddedAffix {
        affix: IAffixConfig;
        qlvl: number;
    }

    interface StatSkillItemSaveData {
        skill: SkillId;
        level: number;
        /** 0-1 */
        chance: number;
    }

    interface StatValueSaveData {
        value?: number;
        range?: [number, number];
        set?: Record<string, 1>;
        skillList?: StatSkillItemSaveData[];
    }

    interface ItemSaveData {
        uuid: string;
        id: ItemId;
        /** affixed name */
        name: string;
        /** Item level */
        ilvl: number;
        level: number;
        /** Quality level */
        quality: number;
        baseStats: StatData;
        extStats: StatData;
        /** key: 1,2,3,4,5 */
        sockets: Record<string, ItemSaveData>;
        runeWord?: ItemId;
        runeWordStats?: StatData;
    }

    interface UnitSaveData {
        unitId: UnitId;
        stats: StatData;
        inventory: Partial<Record<SlotType, ItemSaveData[]>>;
        charmBag: ItemSaveData[];
        bag: ItemSaveData[];
        skills: Partial<Record<SkillId, number>>;
    }

    interface ISaveData {
        chars?: UnitSaveData[];
    }

    interface IFillRectArgs {
        fillStyle: string;
        x: number;
        y: number;
        w: number;
        h: number;
    }

    interface IStrokeRectArgs {
        strokeStyle: string;
        lineWidth: number;
        x: number;
        y: number;
        w: number;
        h: number;
    }

    interface IFillTextArgs {
        font?: string;
        textBaseline?: CanvasTextBaseline;
        textAlign?: CanvasTextAlign;
        fillStyle?: string;
        text: string;
        x: number;
        y: number;
    }

    interface IRenderInstruction {
        queue: number;
        type: "fillRect" | "fillText" | "strokeRect" | "drawImage";
        args: IFillRectArgs | IFillTextArgs | IStrokeRectArgs;
    }

    interface Window {
        debug: boolean;
        gameObjs: Map<number, any>;
    }
}

export { };