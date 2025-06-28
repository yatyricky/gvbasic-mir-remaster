import UnitComponent from "../components/UnitComponent";
import { SkillById } from "../config/Skill";
import Range from "../data/Range";
import { sign } from "../Utils";

/**@type {Record<SkillId, (hero: UnitComponent, offset?: number) => Array<StatValueSaveData[]>>} */
const Formula = {
    fblt: (hero, offset = 0) => {
        const level = hero.getSkillLevel("fblt").val + offset;
        const stat = hero.stat;
        /**@type {Array<StatValueSaveData[]>} */
        const vals = [];
        const c = SkillById.fblt;
        vals[0] = [{
            range: Range.t(stat.getStat("fdmg").range)
                .addR(new Range(stat.getStat("fdmglo").value, stat.getStat("fdmghi").value))
                .multN(c.n5)
                .addR(new Range(c.n1, c.n2).multN(sign(level)).addR(new Range(c.n3, c.n4).multN(level - 1)))
                .multN(1 + stat.getStat("fed").value / 100)
                .multN(1 + stat.getStat("skfbltm1").value / 100)
                .multN(1 + stat.getStat("int").value / 100)
                .tup(),
            dmgType: "fdmg",
        }];
        return vals;
    },
    frng: (hero, offset = 0) => {
        const level = hero.getSkillLevel("frng").val + offset;
        const stat = hero.stat;
        /**@type {Array<StatValueSaveData[]>} */
        const vals = [];
        const c = SkillById.frng;
        vals[0] = [{
            range: Range.t(stat.getStat("fdmg").range)
                .addR(new Range(stat.getStat("fdmglo").value, stat.getStat("fdmghi").value))
                .multN(c.n5)
                .addR(new Range(c.n1, c.n2).multN(sign(level)).addR(new Range(c.n3, c.n4).multN(level - 1)))
                .multN(1 + stat.getStat("fed").value / 100)
                .multN(1 + stat.getStat("int").value / 100)
                .tup(),
            dmgType: "fdmg",
        }];
        return vals;
    },
    finf: (hero, offset = 0) => {
        const level = hero.getSkillLevel("finf").val + offset;
        const stat = hero.stat;
        /**@type {Array<StatValueSaveData[]>} */
        const vals = [];
        const c = SkillById.finf;
        vals[0] = [{
            range: Range.t(stat.getStat("fdmg").range)
                .addR(new Range(stat.getStat("fdmglo").value, stat.getStat("fdmghi").value))
                .multN(c.n5)
                .addR(new Range(c.n1, c.n2).multN(sign(level)).addR(new Range(c.n3, c.n4).multN(level - 1)))
                .multN(1 + stat.getStat("fed").value / 100)
                .multN(1 + stat.getStat("int").value / 100)
                .tup(),
            dmgType: "fdmg",
        }];
        vals[1] = [{ value: Math.floor(c.n6 * sign(level) + (level - 1) * c.n7) }];
        vals[2] = [{ value: Math.floor(c.n8 + stat.getStat("skfinfm1").value) }];
        return vals;
    },
    fbal: (hero, offset = 0) => {
        const level = hero.getSkillLevel("fbal").val + offset;
        const stat = hero.stat;
        /**@type {Array<StatValueSaveData[]>} */
        const vals = [];
        const c = SkillById.fbal;
        vals[0] = [{
            range: Range.t(stat.getStat("fdmg").range)
                .addR(new Range(stat.getStat("fdmglo").value, stat.getStat("fdmghi").value))
                .multN(c.n5)
                .addR(new Range(c.n1, c.n2).multN(sign(level)).addR(new Range(c.n3, c.n4).multN(level - 1)))
                .multN(1 + stat.getStat("fed").value / 100)
                .multN(1 + stat.getStat("int").value / 100)
                .tup(),
            dmgType: "fdmg",
        }];
        vals[1] = [{ value: Math.floor(c.n6 + stat.getStat("skfbalm1").value) }];
        return vals;
    },
    fbls: (hero, offset = 0) => {
        const level = hero.getSkillLevel("fbls").val + offset;
        const stat = hero.stat;
        /**@type {Array<StatValueSaveData[]>} */
        const vals = [];
        const c = SkillById.fbls;
        vals[0] = [{
            range: Range.t(stat.getStat("fdmg").range)
                .addR(new Range(stat.getStat("fdmglo").value, stat.getStat("fdmghi").value))
                .multN(c.n5)
                .addR(new Range(c.n1, c.n2).multN(sign(level)).addR(new Range(c.n3, c.n4).multN(level - 1)))
                .multN(1 + stat.getStat("fed").value / 100)
                .multN(1 + stat.getStat("int").value / 100)
                .tup(),
            dmgType: "fdmg",
        }];
        return vals;
    },
    fwal: (hero, offset = 0) => {
        const level = hero.getSkillLevel("fwal").val + offset;
        const stat = hero.stat;
        /**@type {Array<StatValueSaveData[]>} */
        const vals = [];
        const c = SkillById.fwal;
        vals[0] = [{
            range: Range.t(stat.getStat("fdmg").range)
                .addR(new Range(stat.getStat("fdmglo").value, stat.getStat("fdmghi").value))
                .multN(c.n5)
                .addR(new Range(c.n1, c.n2).multN(sign(level)).addR(new Range(c.n3, c.n4).multN(level - 1)))
                .multN(1 + stat.getStat("fed").value / 100)
                .multN(1 + stat.getStat("int").value / 100)
                .tup(),
            dmgType: "fdmg",
        }];
        vals[1] = [{ value: c.n6 }];
        return vals;
    },
    tchm: (hero, offset = 0) => {
        const level = hero.getSkillLevel("tchm").val + offset;
        const stat = hero.stat;
        /**@type {Array<StatValueSaveData[]>} */
        const vals = [];
        const c = SkillById.tchm;
        vals[0] = [{ value: Math.min(Math.min(c.n1 * sign(level) + (level - 1) * c.n2, c.n3) + stat.getStat("luck").value / c.n7, 100) }];
        vals[1] = [{ value: Math.min(Math.floor(c.n4 * sign(level) + (level - 1) * c.n5), c.n6) }];
        vals[2] = [{ value: c.n7 }];
        return vals;
    },
    tblt: (hero, offset = 0) => {
        const level = hero.getSkillLevel("tblt").val + offset;
        const stat = hero.stat;
        /**@type {Array<StatValueSaveData[]>} */
        const vals = [];
        const c = SkillById.tblt;
        vals[0] = [{
            range: Range.t(stat.getStat("tdmg").range)
                .addR(new Range(stat.getStat("tdmglo").value, stat.getStat("tdmghi").value))
                .multN(c.n5)
                .addR(new Range(c.n1, c.n2).multN(sign(level)).addR(new Range(c.n3, c.n4).multN(level - 1)))
                .multN(1 + stat.getStat("ted").value / 100)
                .multN(1 + stat.getStat("int").value / 100)
                .tup(),
            dmgType: "tdmg",
        }];
        return vals;
    },
    tltn: (hero, offset = 0) => {
        const level = hero.getSkillLevel("tltn").val + offset;
        const stat = hero.stat;
        /**@type {Array<StatValueSaveData[]>} */
        const vals = [];
        const c = SkillById.tltn;
        vals[0] = [{
            range: Range.t(stat.getStat("tdmg").range)
                .addR(new Range(stat.getStat("tdmglo").value, stat.getStat("tdmghi").value))
                .multN(c.n5)
                .addR(new Range(c.n1, c.n2).multN(sign(level)).addR(new Range(c.n3, c.n4).multN(level - 1)))
                .multN(1 + stat.getStat("ted").value / 100 - stat.getStat("sktltnm1").value / 100)
                .multN(1 + stat.getStat("int").value / 100)
                .tup(),
            dmgType: "tdmg",
        }];
        return vals;
    },
    tnov: (hero, offset = 0) => {
        const level = hero.getSkillLevel("tnov").val + offset;
        const stat = hero.stat;
        /**@type {Array<StatValueSaveData[]>} */
        const vals = [];
        const c = SkillById.tnov;
        vals[0] = [{
            range: Range.t(stat.getStat("tdmg").range)
                .addR(new Range(stat.getStat("tdmglo").value, stat.getStat("tdmghi").value))
                .multN(c.n5)
                .addR(new Range(c.n1, c.n2).multN(sign(level)).addR(new Range(c.n3, c.n4).multN(level - 1)))
                .multN(1 + stat.getStat("ted").value / 100)
                .multN(1 + stat.getStat("int").value / 100)
                .tup(),
            dmgType: "tdmg",
        }];
        return vals;
    },
    tshd: (hero, offset = 0) => {
        const level = hero.getSkillLevel("tshd").val + offset;
        /**@type {Array<StatValueSaveData[]>} */
        const vals = [];
        const c = SkillById.tshd;
        vals[0] = [{ value: c.n1 * sign(level) + (level - 1) * c.n2 }];
        vals[1] = [{ value: Math.floor(c.n3 * sign(level) + (level - 1) * c.n4) }];
        return vals;
    },
    tblz: (hero, offset = 0) => {
        const level = hero.getSkillLevel("tblz").val + offset;
        const stat = hero.stat;
        /**@type {Array<StatValueSaveData[]>} */
        const vals = [];
        const c = SkillById.tblz;
        vals[0] = [{
            range: Range.t(stat.getStat("tdmg").range)
                .addR(new Range(stat.getStat("tdmglo").value, stat.getStat("tdmghi").value))
                .multN(c.n5)
                .addR(new Range(c.n1, c.n2).multN(sign(level)).addR(new Range(c.n3, c.n4).multN(level - 1)))
                .multN(1 + stat.getStat("ted").value / 100)
                .multN(1 + stat.getStat("int").value / 100)
                .tup(),
            dmgType: "tdmg",
        }];
        return vals;
    },
    bbas: (hero, offset = 0) => {
        const level = hero.getSkillLevel("bbas").val + offset;
        /**@type {Array<StatValueSaveData[]>} */
        const vals = [];
        const c = SkillById.bbas;
        vals[0] = [{ value: c.n1 * sign(level) + (level - 1) * c.n2 }];
        return vals;
    },
    bcrt: (hero, offset = 0) => {
        const level = hero.getSkillLevel("bcrt").val + offset;
        /**@type {Array<StatValueSaveData[]>} */
        const vals = [];
        const c = SkillById.bcrt;
        vals[0] = [{ value: c.n1 * sign(level) + (level - 1) * c.n2 }];
        return vals;
    },
    bthr: (hero, offset = 0) => {
        const level = hero.getSkillLevel("bthr").val + offset;
        const stat = hero.stat;
        /**@type {Array<StatValueSaveData[]>} */
        const vals = [];
        const c = SkillById.bthr;
        vals[0] = [{
            range: Range.t(stat.getStat("xdmg").range)
                .addR(new Range(stat.getStat("xdmglo").value, stat.getStat("xdmghi").value))
                .multN(c.n5)
                .addR(new Range(c.n1, c.n2).multN(sign(level)).addR(new Range(c.n3, c.n4).multN(level - 1)))
                .multN(1 + stat.getStat("xed").value / 100)
                .multN(1 + stat.getStat("str").value / 100)
                .tup(),
            dmgType: "xdmg",
        }];
        vals[1] = [{ value: c.n6 * sign(level) + (level - 1) * c.n7 }];
        return vals;
    },
    bclv: (hero, offset = 0) => {
        const level = hero.getSkillLevel("bclv").val + offset;
        const stat = hero.stat;
        /**@type {Array<StatValueSaveData[]>} */
        const vals = [];
        const c = SkillById.bclv;
        vals[0] = [{
            range: Range.t(stat.getStat("xdmg").range)
                .addR(new Range(stat.getStat("xdmglo").value, stat.getStat("xdmghi").value))
                .multN(c.n5)
                .addR(new Range(c.n1, c.n2).multN(sign(level)).addR(new Range(c.n3, c.n4).multN(level - 1)))
                .multN(1 + stat.getStat("xed").value / 100)
                .multN(1 + stat.getStat("str").value / 100)
                .tup(),
            dmgType: "xdmg",
        }];
        return vals;
    },
    bele: (hero, offset = 0) => {
        const level = hero.getSkillLevel("bele").val + offset;
        const stat = hero.stat;
        /**@type {Array<StatValueSaveData[]>} */
        const vals = [];
        const c = SkillById.bele;
        const portion = c.n1 * sign(level) + (level - 1) * c.n2;
        vals[0] = [{ value: portion }];
        vals[1] = [{
            range: Range.t(stat.getStat("fdmg").range)
                .addR(new Range(stat.getStat("fdmglo").value, stat.getStat("fdmghi").value))
                .multN(portion / 100)
                .multN(1 + stat.getStat("fed").value / 100)
                .multN(1 + stat.getStat("int").value / 100)
                .tup(),
            dmgType: "fdmg",
        }, {
            range: Range.t(stat.getStat("tdmg").range)
                .addR(new Range(stat.getStat("tdmglo").value, stat.getStat("tdmghi").value))
                .multN(portion / 100)
                .multN(1 + stat.getStat("ted").value / 100)
                .multN(1 + stat.getStat("int").value / 100)
                .tup(),
            dmgType: "tdmg",
        }, {
            range: Range.t(stat.getStat("hdmg").range)
                .addR(new Range(stat.getStat("hdmglo").value, stat.getStat("hdmghi").value))
                .multN(portion / 100)
                .multN(1 + stat.getStat("hed").value / 100)
                .multN(1 + stat.getStat("spi").value / 100)
                .tup(),
            dmgType: "hdmg",
        }, {
            range: Range.t(stat.getStat("pdmg").range)
                .addR(new Range(stat.getStat("pdmglo").value, stat.getStat("pdmghi").value))
                .multN(portion / 100)
                .multN(1 + stat.getStat("ped").value / 100)
                .multN(1 + stat.getStat("spi").value / 100)
                .tup(),
            dmgType: "pdmg",
        }];
        return vals;
    },
    xpos: (hero, offset = 0) => {
        const level = hero.getSkillLevel("xpos").val + offset;
        const stat = hero.stat;
        /**@type {Array<StatValueSaveData[]>} */
        const vals = [];
        const c = SkillById.xpos;
        vals[0] = [{
            range: Range.t(stat.getStat("xdmg").range)
                .addR(new Range(stat.getStat("xdmglo").value, stat.getStat("xdmghi").value))
                .multN(c.n5)
                .addR(new Range(c.n1, c.n2).multN(sign(level)).addR(new Range(c.n3, c.n4).multN(level - 1)))
                .multN(1 + stat.getStat("xed").value / 100)
                .multN(1 + stat.getStat("str").value / 100)
                .tup(),
            dmgType: "xdmg",
        }];
        vals[1] = [{ value: Math.floor(c.n6 * sign(level) + (level - 1) * c.n7) }];
        return vals;
    },
    bcrz: (hero, offset = 0) => {
        const level = hero.getSkillLevel("bcrz").val + offset;
        const stat = hero.stat;
        /**@type {Array<StatValueSaveData[]>} */
        const vals = [];
        const c = SkillById.bcrz;
        vals[0] = [{
            range: Range.t(stat.getStat("xdmg").range)
                .addR(new Range(stat.getStat("xdmglo").value, stat.getStat("xdmghi").value))
                .multN(c.n5)
                .addR(new Range(c.n1, c.n2).multN(sign(level)).addR(new Range(c.n3, c.n4).multN(level - 1)))
                .multN(1 + stat.getStat("xed").value / 100)
                .multN(1 + stat.getStat("str").value / 100)
                .tup()
        }];
        return vals;
    },
    bfbl: (hero, offset = 0) => {
        const level = hero.getSkillLevel("bfbl").val + offset;
        const s1Level = hero.getSkillLevel("bele").base;
        const stat = hero.stat;
        /**@type {Array<StatValueSaveData[]>} */
        const vals = [];
        const c = SkillById.bfbl;
        const s1Bonus = c.n3 * s1Level;
        const portion = c.n1 * sign(level) + (level - 1) * c.n2 + s1Bonus;
        const xDamage = Range.t(stat.getStat("xdmg").range)
            .addR(new Range(stat.getStat("xdmglo").value, stat.getStat("xdmghi").value))
            .multN(1 + stat.getStat("str").value / 100)
            .multN(portion / 100);
        vals[0] = [{ value: portion }];
        vals[1] = [{
            range: new Range(xDamage.min, xDamage.max)
                .multN(1 + stat.getStat("fed").value / 100)
                .tup(),
            dmgType: "fdmg",
        }];
        if (stat.getStat("skbfblm1").value > 0) {
            vals[1].push({
                range: new Range(xDamage.min, xDamage.max)
                    .multN(1 + stat.getStat("hed").value / 100)
                    .tup(),
                dmgType: "hdmg",
            });
        }
        vals[2] = [{ value: c.n3 }];
        vals[3] = [{ value: c.n3 * s1Level }];
        return vals;
    },
    xdef: (hero, offset = 0) => {
        const level = hero.getSkillLevel("xdef").val + offset;
        /**@type {Array<StatValueSaveData[]>} */
        const vals = [];
        const c = SkillById.xdef;
        vals[0] = [{ range: new Range(c.n1, c.n2).multN(sign(level)).addR(new Range(c.n3, c.n4).multN(level - 1)).tup() }];
        return vals;
    },
    xdog: (hero, offset = 0) => {
        const level = hero.getSkillLevel("xdog").val + offset;
        /**@type {Array<StatValueSaveData[]>} */
        const vals = [];
        const c = SkillById.xdog;
        vals[0] = [{ value: c.n1 * sign(level) + (level - 1) * c.n2 }];
        return vals;
    },
    xcta: (hero, offset = 0) => {
        const level = hero.getSkillLevel("xcta").val + offset;
        const stat = hero.stat;
        /**@type {Array<StatValueSaveData[]>} */
        const vals = [];
        const c = SkillById.xcta;
        vals[0] = [{ range: new Range(c.n1, c.n2).multN(sign(level)).addR(new Range(c.n3, c.n4).multN(level - 1)).tup() }];
        vals[1] = [{
            range: new Range(c.n5, c.n6).multN(sign(level)).addR(new Range(c.n7, c.n8).multN(level - 1))
                .multN(1 + stat.getStat("xed").value / 100)
                .multN(1 + stat.getStat("str").value / 100)
                .tup(),
            dmgType: "xdmg",
        }];
        vals[2] = [{ value: c.n9 * sign(level) + (level - 1) * c.n10 }];
        return vals;
    },
    xwms: (hero, offset = 0) => {
        const level = hero.getSkillLevel("xwms").val + offset;
        /**@type {Array<StatValueSaveData[]>} */
        const vals = [];
        const c = SkillById.xwms;
        vals[0] = [{ range: new Range(c.n1, c.n2).multN(sign(level)).addR(new Range(c.n3, c.n4).multN(level - 1)).tup() }];
        return vals;
    },
    xchg: (hero, offset = 0) => {
        const level = hero.getSkillLevel("xchg").val + offset;
        const stat = hero.stat;
        /**@type {Array<StatValueSaveData[]>} */
        const vals = [];
        const c = SkillById.xchg;
        const portion = c.n1 * sign(level) + (level - 1) * c.n2;
        vals[0] = [{ value: portion }];
        vals[1] = [{
            range: Range.t(stat.getStat("xdmg").range)
                .addR(new Range(stat.getStat("xdmglo").value, stat.getStat("xdmghi").value))
                .multN(portion / 100)
                .multN(1 + stat.getStat("xed").value / 100)
                .multN(1 + stat.getStat("str").value / 100)
                .tup(),
            dmgType: "xdmg",
        }]
        return vals;
    },
    xtst: (hero, offset = 0) => {
        const level = hero.getSkillLevel("xtst").val + offset;
        const stat = hero.stat;
        /**@type {Array<StatValueSaveData[]>} */
        const vals = [];
        const c = SkillById.xtst;
        vals[0] = [{
            range: Range.t(stat.getStat("xdmg").range)
                .addR(new Range(stat.getStat("xdmglo").value, stat.getStat("xdmghi").value))
                .multN(c.n5)
                .addR(new Range(c.n1, c.n2).multN(sign(level)).addR(new Range(c.n3, c.n4).multN(level - 1)))
                .multN(1 + stat.getStat("xed").value / 100)
                .multN(1 + stat.getStat("str").value / 100)
                .multN(0.5)
                .tup(),
            dmgType: "xdmg",
        }, {
            range: Range.t(stat.getStat("tdmg").range)
                .addR(new Range(stat.getStat("tdmglo").value, stat.getStat("tdmghi").value))
                .multN(c.n5)
                .addR(new Range(c.n1, c.n2).multN(sign(level)).addR(new Range(c.n3, c.n4).multN(level - 1)))
                .multN(1 + stat.getStat("ted").value / 100)
                .multN(1 + stat.getStat("int").value / 100)
                .multN(0.5)
                .tup(),
            dmgType: "tdmg",
        }];
        return vals;
    },
    hhel: (hero, offset = 0) => {
        const level = hero.getSkillLevel("hhel").val + offset;
        const stat = hero.stat;
        /**@type {Array<StatValueSaveData[]>} */
        const vals = [];
        const c = SkillById.hhel;
        vals[0] = [{
            range: new Range(c.n1, c.n2).multN(sign(level)).addR(new Range(c.n3, c.n4).multN(level - 1))
                .multN(1 + stat.getStat("hled").value / 100)
                .multN(1 + stat.getStat("spi").value / 100)
                .tup(),
            dmgType: "heal",
        }];
        return vals;
    },
    hgsd: (hero, offset = 0) => {
        const level = hero.getSkillLevel("hgsd").val + offset;
        /**@type {Array<StatValueSaveData[]>} */
        const vals = [];
        const c = SkillById.hgsd;
        vals[0] = [{ value: c.n1 * sign(level) + (level - 1) * c.n2 }];
        vals[1] = [{ value: Math.floor(c.n3 * sign(level) + (level - 1) * c.n4) }];
        return vals;
    },
    hinv: (hero, offset = 0) => {
        const level = hero.getSkillLevel("hinv").val + offset;
        /**@type {Array<StatValueSaveData[]>} */
        const vals = [];
        const c = SkillById.hinv;
        vals[0] = [{ value: c.n1 * sign(level) + (level - 1) * c.n2 }];
        return vals;
    },
    hhsd: (hero, offset = 0) => {
        const level = hero.getSkillLevel("hhsd").val + offset;
        /**@type {Array<StatValueSaveData[]>} */
        const vals = [];
        const c = SkillById.hhsd;
        vals[0] = [{
            range: new Range(c.n1, c.n2).multN(sign(level)).addR(new Range(c.n3, c.n4).multN(level - 1)).tup(),
        }];
        return vals;
    },
    hlok: (hero, offset = 0) => {
        const level = hero.getSkillLevel("hlok").val + offset;
        /**@type {Array<StatValueSaveData[]>} */
        const vals = [];
        const c = SkillById.hlok;
        vals[0] = [{ value: c.n1 * sign(level) + (level - 1) * c.n2 }];
        vals[1] = [{ value: c.n3 * sign(level) + (level - 1) * c.n4 }];
        return vals;
    },
    hmhl: (hero, offset = 0) => {
        const level = hero.getSkillLevel("hmhl").val + offset;
        const stat = hero.stat;
        /**@type {Array<StatValueSaveData[]>} */
        const vals = [];
        const c = SkillById.hmhl;
        vals[0] = [{ value: c.n1 }];
        vals[1] = [{
            range: Range.t(stat.getStat("hdmg").range)
                .addR(new Range(stat.getStat("hdmglo").value, stat.getStat("hdmghi").value))
                .multN(c.n4)
                .addR(new Range(c.n2, c.n2).multN(sign(level)).addR(new Range(c.n3, c.n3).multN(level - 1)))
                .multN(1 + stat.getStat("hed").value / 100)
                .multN(1 + stat.getStat("spi").value / 100)
                .tup(),
            dmgType: "hdmg",
        }];
        return vals;
    },
    pbas: (hero, offset = 0) => {
        const level = hero.getSkillLevel("pbas").val + offset;
        /**@type {Array<StatValueSaveData[]>} */
        const vals = [];
        const c = SkillById.pbas;
        vals[0] = [{ value: c.n1 * sign(level) + (level - 1) * c.n2 }];
        return vals;
    },
    ppoi: (hero, offset = 0) => {
        const level = hero.getSkillLevel("ppoi").val + offset;
        const stat = hero.stat;
        /**@type {Array<StatValueSaveData[]>} */
        const vals = [];
        const c = SkillById.ppoi;
        vals[0] = [{
            range: Range.t(stat.getStat("pdmg").range)
                .addR(new Range(stat.getStat("pdmglo").value, stat.getStat("pdmghi").value))
                .multN(c.n5)
                .addR(new Range(c.n1, c.n2).multN(sign(level)).addR(new Range(c.n3, c.n4).multN(level - 1)))
                .multN(1 + stat.getStat("ped").value / 100)
                .multN(1 + stat.getStat("spi").value / 100)
                .tup(),
            dmgType: "pdmg",
        }];
        vals[1] = [{ value: c.n6 }];
        return vals;
    },
    pskl: (hero, offset = 0) => {
        const level = hero.getSkillLevel("pskl").val + offset;
        const stat = hero.stat;
        /**@type {Array<StatValueSaveData[]>} */
        const vals = [];
        const c = SkillById.pskl;
        vals[0] = [{ value: c.n1 * sign(level) + (level - 1) * c.n2 }];
        vals[1] = [{
            range: new Range(c.n3, c.n4).multN(sign(level)).addR(new Range(c.n5, c.n6).multN(level - 1))
                .multN(1 + stat.getStat("spi").value / 100)
                .tup(),
            dmgType: "xdmg",
        }];
        vals[2] = [{ value: Math.floor(c.n7 * sign(level) + (level - 1) * c.n8) }];
        return vals;
    },
    prun: (hero, offset = 0) => {
        const level = hero.getSkillLevel("prun").val + offset;
        const stat = hero.stat;
        /**@type {Array<StatValueSaveData[]>} */
        const vals = [];
        const c = SkillById.prun;
        vals[0] = [{
            range: Range.t(stat.getStat("fdmg").range)
                .addR(new Range(stat.getStat("fdmglo").value, stat.getStat("fdmghi").value))
                .multN(c.n5)
                .addR(new Range(c.n1, c.n2).multN(sign(level)).addR(new Range(c.n3, c.n4).multN(level - 1)))
                .multN(1 + stat.getStat("fed").value / 100)
                .multN(1 + stat.getStat("spi").value / 100)
                .tup(),
            dmgType: "fdmg",
        }];
        return vals;
    },
    pcbl: (hero, offset = 0) => {
        const level = hero.getSkillLevel("pcbl").val + offset;
        const stat = hero.stat;
        /**@type {Array<StatValueSaveData[]>} */
        const vals = [];
        const c = SkillById.pcbl;
        vals[0] = [{
            range: Range.t(stat.getStat("hdmg").range)
                .addR(new Range(stat.getStat("hdmglo").value, stat.getStat("hdmghi").value))
                .multN(c.n3)
                .addR(new Range(c.n1, c.n1).multN(sign(level)).addR(new Range(c.n2, c.n2).multN(level - 1)))
                .multN(1 + stat.getStat("hed").value / 100)
                .multN(1 + stat.getStat("spi").value / 100)
                .tup(),
            dmgType: "hdmg",
        }];
        vals[1] = [{ value: c.n4 * sign(level) + (level - 1) * c.n5 }];
        return vals;
    },
    psdm: (hero, offset = 0) => {
        const level = hero.getSkillLevel("psdm").val + offset;
        const stat = hero.stat;
        /**@type {Array<StatValueSaveData[]>} */
        const vals = [];
        const c = SkillById.psdm;
        const pMod = stat.getStat("skpsdmm1").value;
        vals[0] = [{ value: c.n1 * sign(level) + (level - 1) * c.n2 }];
        vals[1] = [{
            range: new Range(c.n3, c.n4).multN(sign(level)).addR(new Range(c.n5, c.n6).multN(level - 1))
                .multN(1 + stat.getStat("spi").value / 100)
                .multN(1 + stat.getStat("sumed").value / 100)
                .tup(),
            dmgType: pMod > 0 ? "pdmg" : "fdmg",
        }];
        vals[2] = [{ value: c.n7 }];
        return vals;
    },
    hwoh: (hero, offset = 0) => {
        const level = hero.getSkillLevel("hwoh").val + offset;
        /**@type {Array<StatValueSaveData[]>} */
        const vals = [];
        const c = SkillById.hwoh;
        vals[0] = [{ value: c.n1 * sign(level) + (level - 1) * c.n2 }];
        return vals;
    },
    _hld: () => {
        return [];
    },
}

/**@type {Record<SkillId, (hero: UnitComponent) => StatData>} */
export const FormulaStats = {
    fblt: function (hero) {
        return {};
    },
    frng: function (hero) {
        return {};
    },
    finf: function (hero) {
        return {};
    },
    fbal: function (hero) {
        return {};
    },
    fbls: function (hero) {
        return {};
    },
    fwal: function (hero) {
        return {};
    },
    tchm: function (hero) {
        return {};
    },
    tblt: function (hero) {
        return {};
    },
    tltn: function (hero) {
        return {};
    },
    tnov: function (hero) {
        return {};
    },
    tshd: function (hero) {
        return {};
    },
    tblz: function (hero) {
        return {};
    },
    hwoh: function (hero) {
        return {};
    },
    bbas: function (hero) {
        const vals = Formula.bbas(hero);
        return { hit: { ...vals[0][0] } };
    },
    bcrt: function (hero) {
        return { crit: { ...Formula.bcrt(hero)[0][0] } };
    },
    bthr: function (hero) {
        return {};
    },
    bele: function (hero) {
        return {};
    },
    bclv: function (hero) {
        return {};
    },
    bfbl: function (hero) {
        return {};
    },
    xdef: function (hero) {
        // const vals = Formula.xdef(hero);
        // return { xdef: { ...vals[0][0] } };
        return {};
    },
    xpos: function (hero) {
        return {};
    },
    xdog: function (hero) {
        return {};
    },
    xcta: function (hero) {
        return {};
    },
    xchg: function (hero) {
        return {};
    },
    xtst: function (hero) {
        return {};
    },
    xwms: function (hero) {
        return {};
    },
    bcrz: function (hero) {
        return {};
    },
    hhel: function (hero) {
        return {};
    },
    hgsd: function (hero) {
        return {};
    },
    hinv: function (hero) {
        return {};
    },
    hhsd: function (hero) {
        return {};
    },
    hlok: function (hero) {
        return {};
    },
    hmhl: function (hero) {
        return {};
    },
    pbas: function (hero) {
        return {};
    },
    ppoi: function (hero) {
        return {};
    },
    pskl: function (hero) {
        return {};
    },
    prun: function (hero) {
        return {};
    },
    pcbl: function (hero) {
        return {};
    },
    psdm: function (hero) {
        return {};
    },
    _hld: function (hero) {
        return {};
    }
}

export default Formula;
