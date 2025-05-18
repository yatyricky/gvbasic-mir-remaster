import { StatId } from "./configData/Stat";
import { UnitId } from "./configData/Unit";

declare global {
    type ElementTypeOf<T> = T extends Array<infer U> ? U : never;

    interface IItem {

    }

    interface IRange {
        min: number;
        max: number;
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

    interface IPixel {
        text: string;
        bgColor?: string;
        color?: string;
    }

    interface Window {
        debug: boolean;
    }
}

export { };