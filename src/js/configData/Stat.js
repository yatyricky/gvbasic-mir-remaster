// This file is auto-generated. Do not edit manually.
import { Stat } from '../configRaw/Stat.js';

/**
 * @typedef {"hp" | "maxhp" | "exp" | "mp" | "maxmp" | "hreg" | "mreg" | "mhex" | "mpex" | "dr" | "fdr" | "tdr" | "hdr" | "pdr" | "res" | "fres" | "tres" | "hres" | "pres" | "ures" | "dres" | "mres" | "rres" | "cres" | "curs" | "bles" | "luck" | "eg" | "spd" | "doge" | "mdoge" | "mxxres" | "mxfres" | "mxtres" | "mxhres" | "mxpres" | "atk" | "hit" | "matk" | "watk" | "ed" | "fed" | "ted" | "hed" | "ped" | "ued" | "ded" | "med" | "red" | "ced" | "doted" | "hled" | "flvl" | "tlvl" | "magelvl" | "blvl" | "xlvl" | "warrlvl" | "hlvl" | "plvl" | "wlklvl" | "alvl" | "slvl" | "glvl" | "cate" | "cb" | "ow" | "ref" | "ll" | "ml" | "lr" | "flr" | "tlr" | "hlr" | "plr" | "skfbltmage" | "skfrngmage" | "skfinfmage" | "skfbalmage" | "skfblsmage" | "skfwalmage" | "skfblt" | "skfrng" | "skfinf" | "skfbal" | "skfbls" | "skfwal" | "sktchmmage" | "sktbltmage" | "sktltnmage" | "sktnovmage" | "sktshdmage" | "sktblzmage" | "sktchm" | "sktblt" | "sktltn" | "sktnov" | "sktshd" | "sktblz" | "skbbaswarr" | "skbcrtwarr" | "skbthrwarr" | "skbclvwarr" | "skbcrzwarr" | "skbfblwarr" | "skbbas" | "skbcrt" | "skbthr" | "skbclv" | "skbcrz" | "skbfbl" | "skxdefwarr" | "skxdogwarr" | "skxctawarr" | "skxwmswarr" | "skxchgwarr" | "skxtstwarr" | "skxdef" | "skxdog" | "skxcta" | "skxwms" | "skxchg" | "skxtst" | "skhhelwlok" | "skhgsdwlok" | "skhinvwlok" | "skhhsdwlok" | "skhlokwlok" | "skhmhlwlok" | "skhhel" | "skhgsd" | "skhinv" | "skhhsd" | "skhlok" | "skhmhl" | "skpbaswlok" | "skppoiwlok" | "skpsklwlok" | "skprunwlok" | "skpcblwlok" | "skpsdmwlok" | "skpbas" | "skppoi" | "skpskl" | "skprun" | "skpcbl" | "skpsdm"} StatId
 */

const StatById = /**@type {Record<StatId, ElementTypeOf<typeof import("../configRaw/Stat.js").Stat>>} */({});
for (const entry of Stat) {
    StatById[/**@type {StatId}*/(entry.id)] = entry;
}

export { StatById };
