declare global {
    type ElementTypeOf<T> = T extends Array<infer U> ? U : never;

    interface IItem {

    }

    interface IUnit {
        heroId: number;
        stats: Record<string, number>;
        inventory: IItem[];
        bag: IItem[];
    }

    interface ISaveData {
        chars?: IUnit[];
    }
}

export { };