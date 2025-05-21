import { StatId } from "./configData/Stat";
import { UnitId } from "./configData/Unit";

declare global {
    type ElementTypeOf<T> = T extends Array<infer U> ? U : never;

    interface ItemSaveData {

    }

    interface SkillSaveData {

    }

    interface UnitSaveData {
        unitId: UnitId;
        stats: any;
        inventory: ItemSaveData[];
        bag: ItemSaveData[];
        skills: SkillSaveData;
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