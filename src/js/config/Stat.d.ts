declare global {
    type StatId = "rthp" | "rtmaxhp" | "maxhp" | "mhex" | "rtmp" | "rtmaxmp" | "maxmp" | "mpex" | "hreg" | "mreg" | "exp" | "xdr" | "fdr" | "tdr" | "hdr" | "pdr" | "xres" | "fres" | "tres" | "hres" | "pres" | "mxxres" | "mxfres" | "mxtres" | "mxhres" | "mxpres" | "rtxres" | "rtfres" | "rttres" | "rthres" | "rtpres" | "ures" | "dres" | "cres" | "c1res" | "c23res" | "dotres" | "sumres" | "curs" | "bles" | "luck" | "eg" | "spd" | "moral" | "doge" | "mdoge" | "hit" | "mhit" | "crit" | "critd" | "scrit" | "scritd" | "str" | "int" | "spi" | "vit" | "xdmg" | "fdmg" | "tdmg" | "hdmg" | "pdmg" | "xed" | "fed" | "ted" | "hed" | "ped" | "ued" | "ded" | "ced" | "doted" | "hled" | "col1ed" | "col23ed" | "sumed" | "flvl" | "tlvl" | "flvlmage" | "tlvlmage" | "magelvl" | "blvl" | "xlvl" | "blvlwarr" | "xlvlwarr" | "warrlvl" | "hlvl" | "plvl" | "hlvlwlok" | "plvlwlok" | "wlklvl" | "alvl" | "slvl" | "glvl" | "cate" | "cb" | "pmh" | "xref" | "fref" | "tref" | "href" | "pref" | "ll" | "ml" | "sumreg" | "xlr" | "flr" | "tlr" | "hlr" | "plr" | "skfbltmage" | "skfrngmage" | "skfinfmage" | "skfbalmage" | "skfblsmage" | "skfwalmage" | "skfblt" | "skfrng" | "skfinf" | "skfbal" | "skfbls" | "skfwal" | "sktchmmage" | "sktbltmage" | "sktltnmage" | "sktnovmage" | "sktshdmage" | "sktblzmage" | "sktchm" | "sktblt" | "sktltn" | "sktnov" | "sktshd" | "sktblz" | "skbbaswarr" | "skbcrtwarr" | "skbthrwarr" | "skbclvwarr" | "skbcrzwarr" | "skbfblwarr" | "skbbas" | "skbcrt" | "skbthr" | "skbclv" | "skbcrz" | "skbfbl" | "skxdefwarr" | "skxdogwarr" | "skxctawarr" | "skxwmswarr" | "skxchgwarr" | "skxtstwarr" | "skxdef" | "skxdog" | "skxcta" | "skxwms" | "skxchg" | "skxtst" | "skhhelwlok" | "skhgsdwlok" | "skhinvwlok" | "skhhsdwlok" | "skhlokwlok" | "skhmhlwlok" | "skhhel" | "skhgsd" | "skhinv" | "skhhsd" | "skhlok" | "skhmhl" | "skpbaswlok" | "skppoiwlok" | "skpsklwlok" | "skprunwlok" | "skpcblwlok" | "skpsdmwlok" | "skpbas" | "skppoi" | "skpskl" | "skprun" | "skpcbl" | "skpsdm" | "setwargod" | "setmara" | "setjihad" | "setghost" | "setvenerable" | "setmaster" | "setdemon" | "setmagegod" | "setcolorful" | "setblackiron" | "setmysterious" | "setmemory" | "setvoma" | "setzuma" | "setredmoon" | "setprisma" | "setdragon" | "setempire" | "sok" | "rw" | "silent" | "stun" | "prochit" | "procatk" | "skpts";
    type StatValueType = "number" | "range" | "set" | "skillList";
    type StatFormat = "int" | "percent";
    interface IStatConfig {
        id: StatId;
        name: string;
        type: StatValueType;
        cgroup: string;
        description: string;
        format: StatFormat;
        depends: StatId[];
        derived: (d:import("../data/ReactStat").default)=>void;
    }
}
declare const Stats: Array<IStatConfig>;
declare const StatById: Partial<Record<StatId, IStatConfig>>;
export { Stats, StatById }
