declare global {
    type SkillId = "fblt" | "frng" | "finf" | "fbal" | "fbls" | "fwal" | "tchm" | "tblt" | "tltn" | "tnov" | "tshd" | "tblz" | "hwoh" | "bbas" | "bcrt" | "bthr" | "bele" | "bclv" | "bfbl" | "xdef" | "xpos" | "xdog" | "xcta" | "xchg" | "xtst" | "xwms" | "bcrz" | "hhel" | "hgsd" | "hinv" | "hhsd" | "hlok" | "hmhl" | "pbas" | "ppoi" | "pskl" | "prun" | "pcbl" | "psdm";
    type SkillTag = "skmage" | "fire" | "fdmg" | "thunder" | "summon" | "luck" | "tdmg" | "guardian" | "holy" | "skwarr" | "battle" | "xdmg" | "hdmg" | "pdmg" | "xskill" | "skwlok" | "heal" | "psyco" | "poison";
    interface ISkillConfig {
        id: SkillId;
        klass: UnitId;
        tag: SkillTag[];
        posx: number;
        level: number;
        prerequisite: SkillId[];
        icon: string;
        name: string;
        description: string;
        n1: number;
        n2: number;
        n3: number;
        n4: number;
        n5: number;
        n6: number;
        n7: number;
        n8: number;
        n9: number;
        n10: number;
    }
}
declare const Skills: Array<ISkillConfig>;
declare const SkillById: Partial<Record<SkillId, ISkillConfig>>;
declare const SkillGroupByKlass: Partial<Record<UnitId, Array<ISkillConfig>>>;
export { Skills, SkillById, SkillGroupByKlass }
