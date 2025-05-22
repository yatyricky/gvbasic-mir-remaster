declare global {
    type ItemId = "woodsword" | "dagger" | "ebonywoodsword" | "bronzesword" | "shortsword" | "ironsword" | "mattock" | "bronzeaxe" | "rakshasa" | "eightwilderness" | "overwind" | "brokensoul" | "horsecleaver" | "shura" | "condensefrost" | "inferno" | "wellmoon" | "judgestaff" | "dragonslayer" | "halfmoon" | "subduedemon" | "silverserpent" | "nullstaff" | "dragonsword" | "seasoul" | "siezemoon" | "magicstaff" | "blooddrink" | "bonescepter" | "cloth";
    type ItemType = "equip";
    type SlotType = "weapon" | "armor";
    interface IItemConfig {
        id: ItemId;
        name: string;
        level: number;
        classOnly: UnitId[];
        description: string;
        image: string;
        type: ItemType;
        slot: SlotType;
        size: number;
        stat: Map<StatId, number[]>;
    }
}
declare const Items: Array<IItemConfig>;
declare const ItemById: Record<ItemId, IItemConfig>;
export { Items, ItemById }
