declare global {
    type SkillId = "fblt" | "frng" | "finf" | "fbal" | "fbls" | "fwal" | "tchm" | "tblt" | "tltn" | "tnov" | "tshd" | "tblz" | "bbas" | "bcrt" | "bthr" | "bclv" | "bcrz" | "bfbl" | "xdef" | "xdog" | "xcta" | "xwms" | "xchg" | "xtst" | "hhel" | "hgsd" | "hinv" | "hhsd" | "hlok" | "hmhl" | "pbas" | "ppoi" | "pskl" | "prun" | "pcbl" | "psdm";
    interface ISkillConfig {
        id: SkillId;
        klass: UnitId[];
        name: string;
        description: string;
        level: number;
        formula: string;
        num1: number;
        num2: number;
        num3: number;
        num4: number;
    }
}
declare const Skills: Array<ISkillConfig>;
declare const SkillById: Partial<Record<SkillId, ISkillConfig>>;
declare const SkillGroupByKlass: Partial<Record<UnitId, Array<ISkillConfig>>>;
export { Skills, SkillById, SkillGroupByKlass }
