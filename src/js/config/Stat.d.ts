declare global {
    type StatId = "str" | "int" | "spi" | "vit" | "maxhp" | "mhex" | "rtmaxhp" | "rthp" | "maxmp" | "mpex" | "rtmaxmp" | "rtmp" | "hreg" | "mreg" | "ll" | "ml" | "sumreg" | "killhp" | "killmp" | "xdmg" | "fdmg" | "tdmg" | "hdmg" | "pdmg" | "xdmglo" | "fdmglo" | "tdmglo" | "hdmglo" | "pdmglo" | "xdmghi" | "fdmghi" | "tdmghi" | "hdmghi" | "pdmghi" | "xdr" | "fdr" | "tdr" | "hdr" | "pdr" | "xed" | "fed" | "ted" | "hed" | "ped" | "ued" | "ded" | "ced" | "doted" | "hled" | "col1ed" | "col23ed" | "sumed" | "xres" | "fres" | "tres" | "hres" | "pres" | "ures" | "dres" | "cres" | "c1res" | "c23res" | "dotres" | "sumres" | "mxxres" | "mxfres" | "mxtres" | "mxhres" | "mxpres" | "rtxres" | "rtfres" | "rttres" | "rthres" | "rtpres" | "xlr" | "flr" | "tlr" | "hlr" | "plr" | "xref" | "fref" | "tref" | "href" | "pref" | "curs" | "bles" | "luck" | "eg" | "spd" | "moral" | "d2m" | "exp" | "expex" | "barg" | "pmh" | "sok" | "rw" | "doge" | "mdoge" | "hit" | "mhit" | "crit" | "critd" | "scrit" | "scritd" | "cb" | "ucb" | "debuffrd" | "resil" | "prochit" | "procatk" | "prockill" | "flvl" | "tlvl" | "magelvl" | "flvlmage" | "tlvlmage" | "magelvlmage" | "blvl" | "xlvl" | "warrlvl" | "blvlwarr" | "xlvlwarr" | "warrlvlwarr" | "hlvl" | "plvl" | "wlklvl" | "hlvlwlok" | "plvlwlok" | "wlklvlwlk" | "alvl" | "slvl" | "glvl" | "cate" | "skfbltmage" | "skfrngmage" | "skfinfmage" | "skfbalmage" | "skfblsmage" | "skfwalmage" | "skfblt" | "skfrng" | "skfinf" | "skfbal" | "skfbls" | "skfwal" | "sktchmmage" | "sktbltmage" | "sktltnmage" | "sktnovmage" | "sktshdmage" | "sktblzmage" | "sktchm" | "sktblt" | "sktltn" | "sktnov" | "sktshd" | "sktblz" | "skbbaswarr" | "skbcrtwarr" | "skbthrwarr" | "skbclvwarr" | "skbcrzwarr" | "skbfblwarr" | "skbbas" | "skbcrt" | "skbthr" | "skbclv" | "skbcrz" | "skbfbl" | "skxdefwarr" | "skxdogwarr" | "skxctawarr" | "skxwmswarr" | "skxchgwarr" | "skxtstwarr" | "skxdef" | "skxdog" | "skxcta" | "skxwms" | "skxchg" | "skxtst" | "skhhelwlok" | "skhgsdwlok" | "skhinvwlok" | "skhhsdwlok" | "skhlokwlok" | "skhmhlwlok" | "skhhel" | "skhgsd" | "skhinv" | "skhhsd" | "skhlok" | "skhmhl" | "skpbaswlok" | "skppoiwlok" | "skpsklwlok" | "skprunwlok" | "skpcblwlok" | "skpsdmwlok" | "skpbas" | "skppoi" | "skpskl" | "skprun" | "skpcbl" | "skpsdm" | "silent" | "stun" | "skpts" | "setwargod" | "setmara" | "setjihad" | "setghost" | "setvenerable" | "setmaster" | "setdemon" | "setmagegod" | "setcolorful" | "setblackiron" | "setmysterious" | "setmemory" | "setvoma" | "setzuma" | "setredmoon" | "setprisma" | "setdragon" | "setempire" | "setany";
    type StatValueType = "int" | "number" | "range" | "skillList" | "set";
    interface IStatConfig {
        id: StatId;
        name: string;
        type: StatValueType;
        cgroup: string;
        description: string;
        depends: StatId[];
        derived: (d:import("../data/ReactStat").default)=>void;
    }
}
declare const Stats: Array<IStatConfig>;
declare const StatById: Partial<Record<StatId, IStatConfig>>;
export { Stats, StatById }
