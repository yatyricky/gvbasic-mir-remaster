import { StatId } from "./configData/Stat";
import { UnitId } from "./configData/Unit";

declare global {
    type ElementTypeOf<T> = T extends Array<infer U> ? U : never;

    interface IItem {

    }

    interface ISkill {

    }

    interface IUnit {
        unitId: UnitId;
        stats: any;
        inventory: IItem[];
        bag: IItem[];
        skills: ISkill;
    }

    interface ISaveData {
        chars?: IUnit[];
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
    }
}

export { };