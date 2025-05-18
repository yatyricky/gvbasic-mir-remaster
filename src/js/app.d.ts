import { HeroId } from "./configData/Hero";

declare global {
    type ElementTypeOf<T> = T extends Array<infer U> ? U : never;

    interface IItem {

    }

    interface IUnit {
        heroId: HeroId;
        stats: Record<string, number>;
        inventory: IItem[];
        bag: IItem[];
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