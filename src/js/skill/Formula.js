import UnitComponent from "../components/UnitComponent";
import { SkillById } from "../config/Skill";
import Range from "../data/Range";

/**@type {Record<SkillId, (hero: UnitComponent) => Array<StatValueSaveData[]>>} */
const Formula = {
    fblt: (hero) => {
        const level = hero.getSkillLevel("fblt").val;
        const stat = hero.stat;
        /**@type {Array<StatValueSaveData[]>} */
        const vals = [];
        const c = SkillById.fblt;
        vals[0] = [{
            range: Range.t(stat.getStat("fdmg").range)
                .addR(new Range(stat.getStat("fdmglo").value, stat.getStat("fdmghi").value))
                .multN(c.n5)
                .addR(new Range(c.n1, c.n2).addR(new Range(c.n3, c.n4).multN(level)))
                .multN(1 + stat.getStat("fed").value / 100)
                .multN(1 + stat.getStat("skfbltm1").value / 100)
                .multN(1 + stat.getStat("int").value / 100)
                .tup(),
            dmgType: "fdmg",
        }];
        return vals;
    },
    frng: (hero) => {
        const level = hero.getSkillLevel("frng").val;
        const stat = hero.stat;
        /**@type {Array<StatValueSaveData[]>} */
        const vals = [];
        const c = SkillById.frng;
        vals[0] = [{
            range: Range.t(stat.getStat("fdmg").range)
                .addR(new Range(stat.getStat("fdmglo").value, stat.getStat("fdmghi").value))
                .multN(c.n5)
                .addR(new Range(c.n1, c.n2).addR(new Range(c.n3, c.n4).multN(level)))
                .multN(1 + stat.getStat("fed").value / 100)
                .multN(1 + stat.getStat("int").value / 100)
                .tup(),
            dmgType: "fdmg",
        }];
        return vals;
    },
    finf: (hero) => {
        const level = hero.getSkillLevel("finf").val;
        const stat = hero.stat;
        /**@type {Array<StatValueSaveData[]>} */
        const vals = [];
        const c = SkillById.finf;
        vals[0] = [{
            range: Range.t(stat.getStat("fdmg").range)
                .addR(new Range(stat.getStat("fdmglo").value, stat.getStat("fdmghi").value))
                .multN(c.n5)
                .addR(new Range(c.n1, c.n2).addR(new Range(c.n3, c.n4).multN(level)))
                .multN(1 + stat.getStat("fed").value / 100)
                .multN(1 + stat.getStat("int").value / 100)
                .tup(),
            dmgType: "fdmg",
        }];
        vals[1] = [{ value: Math.floor(c.n6 + level * c.n7) }];
        vals[2] = [{ value: Math.floor(c.n8 + stat.getStat("skfinfm1").value) }];
        return vals;
    },
    fbal: (hero) => {
        const level = hero.getSkillLevel("fbal").val;
        const stat = hero.stat;
        /**@type {Array<StatValueSaveData[]>} */
        const vals = [];
        const c = SkillById.fbal;
        vals[0] = [{
            range: Range.t(stat.getStat("fdmg").range)
                .addR(new Range(stat.getStat("fdmglo").value, stat.getStat("fdmghi").value))
                .multN(c.n5)
                .addR(new Range(c.n1, c.n2).addR(new Range(c.n3, c.n4).multN(level)))
                .multN(1 + stat.getStat("fed").value / 100)
                .multN(1 + stat.getStat("int").value / 100)
                .tup(),
            dmgType: "fdmg",
        }];
        vals[1] = [{ value: Math.floor(c.n6 + stat.getStat("skfbalm1").value) }];
        return vals;
    },
    fbls: (hero) => {
        const level = hero.getSkillLevel("fbls").val;
        const stat = hero.stat;
        /**@type {Array<StatValueSaveData[]>} */
        const vals = [];
        const c = SkillById.fbls;
        vals[0] = [{
            range: Range.t(stat.getStat("fdmg").range)
                .addR(new Range(stat.getStat("fdmglo").value, stat.getStat("fdmghi").value))
                .multN(c.n5)
                .addR(new Range(c.n1, c.n2).addR(new Range(c.n3, c.n4).multN(level)))
                .multN(1 + stat.getStat("fed").value / 100)
                .multN(1 + stat.getStat("int").value / 100)
                .tup(),
            dmgType: "fdmg",
        }];
        return vals;
    },
    fwal: (hero) => {
        const level = hero.getSkillLevel("fwal").val;
        const stat = hero.stat;
        /**@type {Array<StatValueSaveData[]>} */
        const vals = [];
        const c = SkillById.fwal;
        vals[0] = [{
            range: Range.t(stat.getStat("fdmg").range)
                .addR(new Range(stat.getStat("fdmglo").value, stat.getStat("fdmghi").value))
                .multN(c.n5)
                .addR(new Range(c.n1, c.n2).addR(new Range(c.n3, c.n4).multN(level)))
                .multN(1 + stat.getStat("fed").value / 100)
                .multN(1 + stat.getStat("int").value / 100)
                .tup(),
            dmgType: "fdmg",
        }];
        vals[1] = [{ value: c.n6 }];
        return vals;
    },
    tchm: (hero) => {
        const level = hero.getSkillLevel("tchm").val;
        const stat = hero.stat;
        /**@type {Array<StatValueSaveData[]>} */
        const vals = [];
        const c = SkillById.tchm;
        vals[0] = [{ value: Math.min(Math.min(c.n1 + level * c.n2, c.n3) + stat.getStat("luck").value / c.n7, 100) }];
        vals[1] = [{ value: Math.min(Math.floor(c.n4 + level * c.n5), c.n6) }];
        vals[2] = [{ value: c.n7 }];
        return vals;
    },
    tblt: (hero) => {
        const level = hero.getSkillLevel("tblt").val;
        const stat = hero.stat;
        /**@type {Array<StatValueSaveData[]>} */
        const vals = [];
        const c = SkillById.tblt;
        vals[0] = [{
            range: Range.t(stat.getStat("tdmg").range)
                .addR(new Range(stat.getStat("tdmglo").value, stat.getStat("tdmghi").value))
                .multN(c.n5)
                .addR(new Range(c.n1, c.n2).addR(new Range(c.n3, c.n4).multN(level)))
                .multN(1 + stat.getStat("ted").value / 100)
                .multN(1 + stat.getStat("int").value / 100)
                .tup(),
            dmgType: "tdmg",
        }];
        return vals;
    },
    tltn: (hero) => {
        const level = hero.getSkillLevel("tltn").val;
        const stat = hero.stat;
        /**@type {Array<StatValueSaveData[]>} */
        const vals = [];
        const c = SkillById.tltn;
        vals[0] = [{
            range: Range.t(stat.getStat("tdmg").range)
                .addR(new Range(stat.getStat("tdmglo").value, stat.getStat("tdmghi").value))
                .multN(c.n5)
                .addR(new Range(c.n1, c.n2).addR(new Range(c.n3, c.n4).multN(level)))
                .multN(1 + stat.getStat("ted").value / 100 - stat.getStat("sktltnm1").value / 100)
                .multN(1 + stat.getStat("int").value / 100)
                .tup(),
            dmgType: "tdmg",
        }];
        return vals;
    },
    tnov: (hero) => {
        const level = hero.getSkillLevel("tnov").val;
        const stat = hero.stat;
        /**@type {Array<StatValueSaveData[]>} */
        const vals = [];
        const c = SkillById.tnov;
        vals[0] = [{
            range: Range.t(stat.getStat("tdmg").range)
                .addR(new Range(stat.getStat("tdmglo").value, stat.getStat("tdmghi").value))
                .multN(c.n5)
                .addR(new Range(c.n1, c.n2).addR(new Range(c.n3, c.n4).multN(level)))
                .multN(1 + stat.getStat("ted").value / 100)
                .multN(1 + stat.getStat("int").value / 100)
                .tup(),
            dmgType: "tdmg",
        }];
        return vals;
    },
    tshd: (hero) => {
        const level = hero.getSkillLevel("tshd").val;
        /**@type {Array<StatValueSaveData[]>} */
        const vals = [];
        const c = SkillById.tshd;
        vals[0] = [{ value: c.n1 + level * c.n2 }];
        vals[1] = [{ value: Math.floor(c.n3 + level * c.n4) }];
        return vals;
    },
    tblz: (hero) => {
        const level = hero.getSkillLevel("tblz").val;
        const stat = hero.stat;
        /**@type {Array<StatValueSaveData[]>} */
        const vals = [];
        const c = SkillById.tblz;
        vals[0] = [{
            range: Range.t(stat.getStat("tdmg").range)
                .addR(new Range(stat.getStat("tdmglo").value, stat.getStat("tdmghi").value))
                .multN(c.n5)
                .addR(new Range(c.n1, c.n2).addR(new Range(c.n3, c.n4).multN(level)))
                .multN(1 + stat.getStat("ted").value / 100)
                .multN(1 + stat.getStat("int").value / 100)
                .tup(),
            dmgType: "tdmg",
        }];
        return vals;
    },
    bbas: (hero) => {
        const level = hero.getSkillLevel("bbas").val;
        /**@type {Array<StatValueSaveData[]>} */
        const vals = [];
        const c = SkillById.bbas;
        vals[0] = [{ value: c.n1 + level * c.n2 }];
        return vals;
    },
    bcrt: (hero) => {
        const level = hero.getSkillLevel("bcrt").val;
        /**@type {Array<StatValueSaveData[]>} */
        const vals = [];
        const c = SkillById.bcrt;
        vals[0] = [{ value: c.n1 + level * c.n2 }];
        return vals;
    },
    bthr: (hero) => {
        const level = hero.getSkillLevel("bthr").val;
        const stat = hero.stat;
        /**@type {Array<StatValueSaveData[]>} */
        const vals = [];
        const c = SkillById.bthr;
        vals[0] = [{
            range: Range.t(stat.getStat("xdmg").range)
                .addR(new Range(stat.getStat("xdmglo").value, stat.getStat("xdmghi").value))
                .multN(c.n5)
                .addR(new Range(c.n1, c.n2).addR(new Range(c.n3, c.n4).multN(level)))
                .multN(1 + stat.getStat("xed").value / 100)
                .multN(1 + stat.getStat("str").value / 100)
                .tup(),
            dmgType: "xdmg",
        }];
        vals[1] = [{ value: c.n6 + level * c.n7 }];
        return vals;
    },
    bclv: (hero) => {
        const level = hero.getSkillLevel("bclv").val;
        const stat = hero.stat;
        /**@type {Array<StatValueSaveData[]>} */
        const vals = [];
        const c = SkillById.bclv;
        vals[0] = [{
            range: Range.t(stat.getStat("xdmg").range)
                .addR(new Range(stat.getStat("xdmglo").value, stat.getStat("xdmghi").value))
                .multN(c.n5)
                .addR(new Range(c.n1, c.n2).addR(new Range(c.n3, c.n4).multN(level)))
                .multN(1 + stat.getStat("xed").value / 100)
                .multN(1 + stat.getStat("str").value / 100)
                .tup(),
            dmgType: "xdmg",
        }];
        return vals;
    },
    bele: (hero) => {
        const level = hero.getSkillLevel("bele").val;
        const stat = hero.stat;
        /**@type {Array<StatValueSaveData[]>} */
        const vals = [];
        const c = SkillById.bele;
        const portion = c.n1 + level * c.n2;
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
    xpos: (hero) => {
        const level = hero.getSkillLevel("xpos").val;
        const stat = hero.stat;
        /**@type {Array<StatValueSaveData[]>} */
        const vals = [];
        const c = SkillById.xpos;
        vals[0] = [{
            range: Range.t(stat.getStat("xdmg").range)
                .addR(new Range(stat.getStat("xdmglo").value, stat.getStat("xdmghi").value))
                .multN(c.n5)
                .addR(new Range(c.n1, c.n2).addR(new Range(c.n3, c.n4).multN(level)))
                .multN(1 + stat.getStat("xed").value / 100)
                .multN(1 + stat.getStat("str").value / 100)
                .tup(),
            dmgType: "xdmg",
        }];
        vals[1] = [{ value: Math.floor(c.n6 + level * c.n7) }];
        return vals;
    },
    bcrz: (hero) => {
        const level = hero.getSkillLevel("bcrz").val;
        const stat = hero.stat;
        /**@type {Array<StatValueSaveData[]>} */
        const vals = [];
        const c = SkillById.bcrz;
        vals[0] = [{
            range: Range.t(stat.getStat("xdmg").range)
                .addR(new Range(stat.getStat("xdmglo").value, stat.getStat("xdmghi").value))
                .multN(c.n5)
                .addR(new Range(c.n1, c.n2).addR(new Range(c.n3, c.n4).multN(level)))
                .multN(1 + stat.getStat("xed").value / 100)
                .multN(1 + stat.getStat("str").value / 100)
                .tup()
        }];
        return vals;
    },
    bfbl: (hero) => {
        const level = hero.getSkillLevel("bfbl").val;
        const s1Level = hero.getSkillLevel("bele").base;
        const stat = hero.stat;
        /**@type {Array<StatValueSaveData[]>} */
        const vals = [];
        const c = SkillById.bfbl;
        const s1Bonus = c.n3 * s1Level;
        const portion = c.n1 + level * c.n2 + s1Bonus;
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
    xdef: (hero) => {
        const level = hero.getSkillLevel("xdef").val;
        /**@type {Array<StatValueSaveData[]>} */
        const vals = [];
        const c = SkillById.xdef;
        vals[0] = [{ range: new Range(c.n1, c.n2).addR(new Range(c.n3, c.n4).multN(level)).tup() }];
        return vals;
    },
    xdog: (hero) => {
        const level = hero.getSkillLevel("xdog").val;
        /**@type {Array<StatValueSaveData[]>} */
        const vals = [];
        const c = SkillById.xdog;
        vals[0] = [{ value: c.n1 + level * c.n2 }];
        return vals;
    },
    xcta: (hero) => {
        const level = hero.getSkillLevel("xcta").val;
        const stat = hero.stat;
        /**@type {Array<StatValueSaveData[]>} */
        const vals = [];
        const c = SkillById.xcta;
        vals[0] = [{ range: new Range(c.n1, c.n2).addR(new Range(c.n3, c.n4).multN(level)).tup() }];
        vals[1] = [{
            range: new Range(c.n5, c.n6).addR(new Range(c.n7, c.n8).multN(level))
                .multN(1 + stat.getStat("xed").value / 100)
                .multN(1 + stat.getStat("str").value / 100)
                .tup(),
            dmgType: "xdmg",
        }];
        vals[2] = [{ value: c.n9 + level * c.n10 }];
        return vals;
    },
    xwms: (hero) => {
        const level = hero.getSkillLevel("xwms").val;
        /**@type {Array<StatValueSaveData[]>} */
        const vals = [];
        const c = SkillById.xwms;
        vals[0] = [{ range: new Range(c.n1, c.n2).addR(new Range(c.n3, c.n4).multN(level)).tup() }];
        return vals;
    },
    xchg: (hero) => {
        const level = hero.getSkillLevel("xchg").val;
        const stat = hero.stat;
        /**@type {Array<StatValueSaveData[]>} */
        const vals = [];
        const c = SkillById.xchg;
        const portion = c.n1 + level * c.n2;
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
    xtst: (hero) => {
        const level = hero.getSkillLevel("xtst").val;
        const stat = hero.stat;
        /**@type {Array<StatValueSaveData[]>} */
        const vals = [];
        const c = SkillById.xtst;
        vals[0] = [{
            range: Range.t(stat.getStat("xdmg").range)
                .addR(new Range(stat.getStat("xdmglo").value, stat.getStat("xdmghi").value))
                .multN(c.n5)
                .addR(new Range(c.n1, c.n2).addR(new Range(c.n3, c.n4).multN(level)))
                .multN(1 + stat.getStat("xed").value / 100)
                .multN(1 + stat.getStat("str").value / 100)
                .multN(0.5)
                .tup(),
            dmgType: "xdmg",
        }, {
            range: Range.t(stat.getStat("tdmg").range)
                .addR(new Range(stat.getStat("tdmglo").value, stat.getStat("tdmghi").value))
                .multN(c.n5)
                .addR(new Range(c.n1, c.n2).addR(new Range(c.n3, c.n4).multN(level)))
                .multN(1 + stat.getStat("ted").value / 100)
                .multN(1 + stat.getStat("int").value / 100)
                .multN(0.5)
                .tup(),
            dmgType: "tdmg",
        }];
        return vals;
    },
    hhel: (hero) => {
        const level = hero.getSkillLevel("hhel").val;
        const stat = hero.stat;
        /**@type {Array<StatValueSaveData[]>} */
        const vals = [];
        const c = SkillById.hhel;
        vals[0] = [{
            range: new Range(c.n1, c.n2).addR(new Range(c.n3, c.n4).multN(level))
                .multN(1 + stat.getStat("hled").value / 100)
                .multN(1 + stat.getStat("spi").value / 100)
                .tup(),
            dmgType: "heal",
        }];
        return vals;
    },
    hgsd: (hero) => {
        const level = hero.getSkillLevel("hgsd").val;
        /**@type {Array<StatValueSaveData[]>} */
        const vals = [];
        const c = SkillById.hgsd;
        vals[0] = [{ value: c.n1 + level * c.n2 }];
        vals[1] = [{ value: Math.floor(c.n3 + level * c.n4) }];
        return vals;
    },
    hinv: (hero) => {
        const level = hero.getSkillLevel("hinv").val;
        /**@type {Array<StatValueSaveData[]>} */
        const vals = [];
        const c = SkillById.hinv;
        vals[0] = [{ value: c.n1 + level * c.n2 }];
        return vals;
    },
    hhsd: (hero) => {
        const level = hero.getSkillLevel("hhsd").val;
        /**@type {Array<StatValueSaveData[]>} */
        const vals = [];
        const c = SkillById.hhsd;
        vals[0] = [{
            range: new Range(c.n1, c.n2).addR(new Range(c.n3, c.n4).multN(level))
                .tup(),
        }];
        return vals;
    },
    hlok: (hero) => {
        const level = hero.getSkillLevel("hlok").val;
        /**@type {Array<StatValueSaveData[]>} */
        const vals = [];
        const c = SkillById.hlok;
        vals[0] = [{ value: c.n1 + level * c.n2 }];
        vals[1] = [{ value: c.n3 + level * c.n4 }];
        return vals;
    },
    hmhl: (hero) => {
        const level = hero.getSkillLevel("hmhl").val;
        const stat = hero.stat;
        /**@type {Array<StatValueSaveData[]>} */
        const vals = [];
        const c = SkillById.hmhl;
        vals[0] = [{ value: c.n1 }];
        vals[1] = [{
            range: Range.t(stat.getStat("hdmg").range)
                .addR(new Range(stat.getStat("hdmglo").value, stat.getStat("hdmghi").value))
                .multN(c.n4)
                .addR(new Range(c.n2, c.n2).addR(new Range(c.n3, c.n3).multN(level)))
                .multN(1 + stat.getStat("hed").value / 100)
                .multN(1 + stat.getStat("spi").value / 100)
                .tup(),
            dmgType: "hdmg",
        }];
        return vals;
    },
    pbas: (hero) => {
        const level = hero.getSkillLevel("pbas").val;
        /**@type {Array<StatValueSaveData[]>} */
        const vals = [];
        const c = SkillById.pbas;
        vals[0] = [{ value: c.n1 + level * c.n2 }];
        return vals;
    },
    ppoi: (hero) => {
        const level = hero.getSkillLevel("ppoi").val;
        const stat = hero.stat;
        /**@type {Array<StatValueSaveData[]>} */
        const vals = [];
        const c = SkillById.ppoi;
        vals[0] = [{
            range: Range.t(stat.getStat("pdmg").range)
                .addR(new Range(stat.getStat("pdmglo").value, stat.getStat("pdmghi").value))
                .multN(c.n5)
                .addR(new Range(c.n1, c.n2).addR(new Range(c.n3, c.n4).multN(level)))
                .multN(1 + stat.getStat("ped").value / 100)
                .multN(1 + stat.getStat("spi").value / 100)
                .tup(),
            dmgType: "pdmg",
        }];
        vals[1] = [{ value: c.n6 }];
        return vals;
    },
    pskl: (hero) => {
        const level = hero.getSkillLevel("pskl").val;
        const stat = hero.stat;
        /**@type {Array<StatValueSaveData[]>} */
        const vals = [];
        const c = SkillById.pskl;
        vals[0] = [{ value: c.n1 + level * c.n2 }];
        vals[1] = [{
            range: new Range(c.n3, c.n4).addR(new Range(c.n5, c.n6).multN(level))
                .multN(1 + stat.getStat("spi").value / 100)
                .tup(),
            dmgType: "xdmg",
        }];
        vals[2] = [{ value: Math.floor(c.n7 + level * c.n8) }];
        return vals;
    },
    prun: (hero) => {
        const level = hero.getSkillLevel("prun").val;
        const stat = hero.stat;
        /**@type {Array<StatValueSaveData[]>} */
        const vals = [];
        const c = SkillById.prun;
        vals[0] = [{
            range: Range.t(stat.getStat("fdmg").range)
                .addR(new Range(stat.getStat("fdmglo").value, stat.getStat("fdmghi").value))
                .multN(c.n5)
                .addR(new Range(c.n1, c.n2).addR(new Range(c.n3, c.n4).multN(level)))
                .multN(1 + stat.getStat("fed").value / 100)
                .multN(1 + stat.getStat("spi").value / 100)
                .tup(),
            dmgType: "fdmg",
        }];
        return vals;
    },
    pcbl: (hero) => {
        const level = hero.getSkillLevel("pcbl").val;
        const stat = hero.stat;
        /**@type {Array<StatValueSaveData[]>} */
        const vals = [];
        const c = SkillById.pcbl;
        vals[0] = [{
            range: Range.t(stat.getStat("hdmg").range)
                .addR(new Range(stat.getStat("hdmglo").value, stat.getStat("hdmghi").value))
                .multN(c.n3)
                .addR(new Range(c.n1, c.n1).addR(new Range(c.n2, c.n2).multN(level)))
                .multN(1 + stat.getStat("hed").value / 100)
                .multN(1 + stat.getStat("spi").value / 100)
                .tup(),
            dmgType: "hdmg",
        }];
        vals[1] = [{ value: c.n4 + level * c.n5 }];
        return vals;
    },
    psdm: (hero) => {
        const level = hero.getSkillLevel("psdm").val;
        const stat = hero.stat;
        /**@type {Array<StatValueSaveData[]>} */
        const vals = [];
        const c = SkillById.psdm;
        const pMod = stat.getStat("skpsdmm1").value;
        vals[0] = [{ value: c.n1 + level * c.n2 }];
        vals[1] = [{
            range: new Range(c.n3, c.n4).addR(new Range(c.n5, c.n6).multN(level))
                .multN(1 + stat.getStat("spi").value / 100)
                .multN(1 + stat.getStat("sumed").value / 100)
                .tup(),
            dmgType: pMod > 0 ? "pdmg" : "fdmg",
        }];
        vals[2] = [{ value: c.n7 }];
        return vals;
    },
    hwoh: (hero) => {
        const level = hero.getSkillLevel("hwoh").val;
        /**@type {Array<StatValueSaveData[]>} */
        const vals = [];
        const c = SkillById.hwoh;
        vals[0] = [{ value: c.n1 + level * c.n2 }];
        return vals;
    },
    _hld: () => {
        return [];
    },
}

export default Formula;
