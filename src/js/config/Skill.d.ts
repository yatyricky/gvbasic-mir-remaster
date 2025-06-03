declare global {
    type SkillId = "fblt" | "frng" | "finf" | "fbal" | "fbls" | "fwal" | "tchm" | "tblt" | "tltn" | "tnov" | "tshd" | "tblz" | "bbas" | "bcrt" | "bthr" | "bclv" | "bcrz" | "bfbl" | "xdef" | "xdog" | "xcta" | "xwms" | "xchg" | "xtst" | "hhel" | "hgsd" | "hinv" | "hhsd" | "hlok" | "hmhl" | "pbas" | "ppoi" | "pskl" | "prun" | "pcbl" | "psdm";
    interface ISkillConfig {
        id: SkillId;
        name: string;
        description: string;
    }
}
declare const Skills: Array<ISkillConfig>;
declare const SkillById: Partial<Record<SkillId, ISkillConfig>>;
export { Skills, SkillById }
