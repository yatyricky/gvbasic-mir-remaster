declare global {
    type SkillId = "fblt" | "frng" | "finf" | "fbal" | "fbls" | "fwal" | "tchm" | "tblt" | "tltn" | "tnov" | "tshd" | "tblz" | "bbas" | "bcrt" | "bthr" | "bclv" | "bcrz" | "bfbl" | "xdef" | "xdog" | "xcta" | "xwms" | "xchg" | "xtst" | "hhel" | "hgsd" | "hinv" | "hhsd" | "hlok" | "hmhl" | "pbas" | "ppoi" | "pskl" | "prun" | "pcbl" | "psdm";
    type SkillTag = "fire" | "thunder" | "summon" | "guardian" | "battle" | "xskill" | "holy" | "psyco" | "poison";
    interface ISkillConfig {
        id: SkillId;
        klass: UnitId;
        tag: SkillTag[];
        posx: number;
        prerequisite: SkillId[];
        icon: string;
        name: string;
        description: string;
        level: number;
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
