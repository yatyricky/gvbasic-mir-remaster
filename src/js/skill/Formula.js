import { SkillById } from "../config/Skill";
import Range from "../data/Range";
import ReactStat from "../data/ReactStat";

/**@type {Record<SkillId, (level: number, stat: ReactStat) => StatValueSaveData[]>} */
const Formula = {
    fblt: (level, stat) => {
        /**@type {StatValueSaveData[]} */
        const vals = [];
        const c = SkillById.fblt;
        vals[0] = {
            range: Range.t(stat.getStat("fdmg").range)
                .addR(new Range(stat.getStat("fdmglo").value, stat.getStat("fdmghi").value))
                .multN(c.n5)
                .addR(new Range(c.n1, c.n2).addR(new Range(c.n3, c.n4).multN(level)))
                .multN(1 + stat.getStat("fed").value / 100)
                .multN(1 + stat.getStat("skfbltm1").value / 100)
                .multN(1 + stat.getStat("int").value / 100)
                .tup()
        };
        return vals;
    },
    frng: (level, stat) => {
        /**@type {StatValueSaveData[]} */
        const vals = [];
        const c = SkillById.frng;
        vals[0] = {
            range: Range.t(stat.getStat("fdmg").range)
                .addR(new Range(stat.getStat("fdmglo").value, stat.getStat("fdmghi").value))
                .multN(c.n5)
                .addR(new Range(c.n1, c.n2).addR(new Range(c.n3, c.n4).multN(level)))
                .multN(1 + stat.getStat("fed").value / 100)
                .multN(1 + stat.getStat("int").value / 100)
                .tup()
        };
        return vals;
    },
    finf: (level, stat) => {
        /**@type {StatValueSaveData[]} */
        const vals = [];
        const c = SkillById.finf;
        vals[0] = {
            range: Range.t(stat.getStat("fdmg").range)
                .addR(new Range(stat.getStat("fdmglo").value, stat.getStat("fdmghi").value))
                .multN(c.n5)
                .addR(new Range(c.n1, c.n2).addR(new Range(c.n3, c.n4).multN(level)))
                .multN(1 + stat.getStat("fed").value / 100)
                .multN(1 + stat.getStat("int").value / 100)
                .tup()
        };
        vals[1] = { value: Math.floor(c.n6 + level * c.n7) };
        vals[2] = { value: Math.floor(c.n8 + stat.getStat("skfinfm1").value) };
        return vals;
    },
    fbal: (level, stat) => {
        /**@type {StatValueSaveData[]} */
        const vals = [];
        const c = SkillById.fbal;
        vals[0] = {
            range: Range.t(stat.getStat("fdmg").range)
                .addR(new Range(stat.getStat("fdmglo").value, stat.getStat("fdmghi").value))
                .multN(c.n5)
                .addR(new Range(c.n1, c.n2).addR(new Range(c.n3, c.n4).multN(level)))
                .multN(1 + stat.getStat("fed").value / 100)
                .multN(1 + stat.getStat("int").value / 100)
                .tup()
        };
        vals[1] = { value: Math.floor(c.n6 + stat.getStat("skfbalm1").value) };
        return vals;
    },
    fbls: (level, stat) => {
        /**@type {StatValueSaveData[]} */
        const vals = [];
        const c = SkillById.fbls;
        vals[0] = {
            range: Range.t(stat.getStat("fdmg").range)
                .addR(new Range(stat.getStat("fdmglo").value, stat.getStat("fdmghi").value))
                .multN(c.n5)
                .addR(new Range(c.n1, c.n2).addR(new Range(c.n3, c.n4).multN(level)))
                .multN(1 + stat.getStat("fed").value / 100)
                .multN(1 + stat.getStat("int").value / 100)
                .tup()
        };
        return vals;
    },
    fwal: (level, stat) => {
        /**@type {StatValueSaveData[]} */
        const vals = [];
        const c = SkillById.fwal;
        vals[0] = {
            range: Range.t(stat.getStat("fdmg").range)
                .addR(new Range(stat.getStat("fdmglo").value, stat.getStat("fdmghi").value))
                .multN(c.n5)
                .addR(new Range(c.n1, c.n2).addR(new Range(c.n3, c.n4).multN(level)))
                .multN(1 + stat.getStat("fed").value / 100)
                .multN(1 + stat.getStat("int").value / 100)
                .tup()
        };
        return vals;
    },
    tchm: (level, stat) => {
        /**@type {StatValueSaveData[]} */
        const vals = [];
        const c = SkillById.tchm;
        vals[0] = { value: Math.min(Math.min(c.n1 + level * c.n2, c.n3) + stat.getStat("luck").value / c.n7, 100) };
        vals[1] = { value: Math.min(Math.floor(c.n4 + level * c.n5), c.n6) };
        vals[2] = { value: c.n7 };
        return vals;
    },
    tblt: (level, stat) => {
        /**@type {StatValueSaveData[]} */
        const vals = [];
        const c = SkillById.tblt;
        vals[0] = {
            range: Range.t(stat.getStat("tdmg").range)
                .addR(new Range(stat.getStat("tdmglo").value, stat.getStat("tdmghi").value))
                .multN(c.n5)
                .addR(new Range(c.n1, c.n2).addR(new Range(c.n3, c.n4).multN(level)))
                .multN(1 + stat.getStat("ted").value / 100)
                .multN(1 + stat.getStat("int").value / 100)
                .tup()
        };
        return vals;
    },
    tltn: (level, stat) => {
        /**@type {StatValueSaveData[]} */
        const vals = [];
        const c = SkillById.tltn;
        vals[0] = {
            range: Range.t(stat.getStat("tdmg").range)
                .addR(new Range(stat.getStat("tdmglo").value, stat.getStat("tdmghi").value))
                .multN(c.n5)
                .addR(new Range(c.n1, c.n2).addR(new Range(c.n3, c.n4).multN(level)))
                .multN(1 + stat.getStat("ted").value / 100 - stat.getStat("sktltnm1").value / 100)
                .multN(1 + stat.getStat("int").value / 100)
                .tup()
        };
        return vals;
    },
    tnov: (level, stat) => {
        /**@type {StatValueSaveData[]} */
        const vals = [];
        const c = SkillById.tnov;
        vals[0] = {
            range: Range.t(stat.getStat("tdmg").range)
                .addR(new Range(stat.getStat("tdmglo").value, stat.getStat("tdmghi").value))
                .multN(c.n5)
                .addR(new Range(c.n1, c.n2).addR(new Range(c.n3, c.n4).multN(level)))
                .multN(1 + stat.getStat("ted").value / 100)
                .multN(1 + stat.getStat("int").value / 100)
                .tup()
        };
        return vals;
    },
    tshd: (level, stat) => {
        /**@type {StatValueSaveData[]} */
        const vals = [];
        const c = SkillById.tshd;
        vals[0] = { value: c.n1 + level * c.n2 };
        vals[1] = { value: Math.floor(c.n3 + level * c.n4) };
        return vals;
    },
    tblz: (level, stat) => {
        /**@type {StatValueSaveData[]} */
        const vals = [];
        const c = SkillById.tblz;
        vals[0] = {
            range: Range.t(stat.getStat("tdmg").range)
                .addR(new Range(stat.getStat("tdmglo").value, stat.getStat("tdmghi").value))
                .multN(c.n5)
                .addR(new Range(c.n1, c.n2).addR(new Range(c.n3, c.n4).multN(level)))
                .multN(1 + stat.getStat("ted").value / 100)
                .multN(1 + stat.getStat("int").value / 100)
                .tup()
        };
        return vals;
    },
    bbas: undefined,
    bcrt: undefined,
    bthr: undefined,
    bclv: undefined,
    bcrz: undefined,
    bfbl: undefined,
    xdef: undefined,
    xdog: undefined,
    xcta: undefined,
    xwms: undefined,
    xchg: undefined,
    xtst: undefined,
    hhel: undefined,
    hgsd: undefined,
    hinv: undefined,
    hhsd: undefined,
    hlok: undefined,
    hmhl: undefined,
    pbas: undefined,
    ppoi: undefined,
    pskl: undefined,
    prun: undefined,
    pcbl: undefined,
    psdm: undefined
}

export default Formula;
