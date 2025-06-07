import { StatId } from "./config/Stat";

declare global {
    type ElementTypeOf<T> = T extends Array<infer U> ? U : never;

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
        skillList?: StatSkillItemSaveData[];
    }

    interface ItemSaveData {
        uuid: string;
        id: ItemId;
        /** affixed name */
        name: string;
        /** Item level */
        ilvl: number;
        /** Quality level */
        quality: number;
        baseStats: Partial<Record<StatId, StatValueSaveData>>;
        extStats: Partial<Record<StatId, StatValueSaveData>>;
        /** key: 1,2,3,4,5 */
        sockets: Record<string, ItemSaveData>;
        runeWord?: ItemId;
        runeWordStats?: Record<StatId, StatValueSaveData>;
    }

    interface SkillSaveData {
        id: SkillId;
        level: number;
    }

    interface UnitSaveData {
        unitId: UnitId;
        stats?: any;
        inventory?: Partial<Record<SlotType, ItemSaveData[]>>;
        charmBag?: ItemSaveData[];
        bag?: ItemSaveData[];
        skills?: SkillSaveData[];
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