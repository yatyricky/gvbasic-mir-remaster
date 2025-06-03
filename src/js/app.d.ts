import { StatId } from "./config/Stat";

declare global {
    type ElementTypeOf<T> = T extends Array<infer U> ? U : never;

    interface ItemSaveData {
        id: ItemId;
        /** affixed name */
        name: string;
        /** Item level */
        ilvl: number;
        /** Quality level */
        quality: number;
        stats: Partial<Record<StatId, number | [number, number]>>;
        /** key: 1,2,3,4,5 */
        sockets: Record<string, ItemSaveData>;
        runeWord?: ItemId;
        runeWordStats?: Record<StatId, number | [number, number]>;
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