declare global {
    type StatId = "str" | "int" | "spi" | "vit" | "maxhp" | "mhex" | "rtmaxhp" | "rthp" | "maxmp" | "mpex" | "rtmaxmp" | "rtmp" | "hreg" | "mreg" | "ll" | "ml" | "sumreg" | "killhp" | "killmp" | "xdmg" | "fdmg" | "tdmg" | "hdmg" | "pdmg" | "xdmglo" | "fdmglo" | "tdmglo" | "hdmglo" | "pdmglo" | "xdmghi" | "fdmghi" | "tdmghi" | "hdmghi" | "pdmghi" | "xdr" | "fdr" | "tdr" | "hdr" | "pdr" | "xed" | "fed" | "ted" | "hed" | "ped" | "ued" | "ded" | "ced" | "doted" | "hled" | "col1ed" | "col23ed" | "sumed" | "xres" | "fres" | "tres" | "hres" | "pres" | "ures" | "dres" | "cres" | "c1res" | "c23res" | "dotres" | "sumres" | "mxxres" | "mxfres" | "mxtres" | "mxhres" | "mxpres" | "rtxres" | "rtfres" | "rttres" | "rthres" | "rtpres" | "xlr" | "flr" | "tlr" | "hlr" | "plr" | "xref" | "fref" | "tref" | "href" | "pref" | "curs" | "bles" | "luck" | "eg" | "spd" | "moral" | "d2m" | "exp" | "expex" | "barg" | "pmh" | "sok" | "rw" | "rwt" | "doge" | "mdoge" | "hit" | "mhit" | "crit" | "critd" | "scrit" | "scritd" | "cb" | "ucb" | "debuffrd" | "resil" | "prochit" | "procatk" | "prockill" | "flvl" | "tlvl" | "magelvl" | "flvlmage" | "tlvlmage" | "magelvlmage" | "blvl" | "xlvl" | "warrlvl" | "blvlwarr" | "xlvlwarr" | "warrlvlwarr" | "hlvl" | "plvl" | "wlklvl" | "hlvlwlok" | "plvlwlok" | "wlklvlwlk" | "alvl" | "slvl" | "glvl" | "cate" | "skfbltmage" | "skfrngmage" | "skfinfmage" | "skfbalmage" | "skfblsmage" | "skfwalmage" | "skfblt" | "skfrng" | "skfinf" | "skfbal" | "skfbls" | "skfwal" | "sktchmmage" | "sktbltmage" | "sktltnmage" | "sktnovmage" | "sktshdmage" | "sktblzmage" | "sktchm" | "sktblt" | "sktltn" | "sktnov" | "sktshd" | "sktblz" | "skbbaswarr" | "skbcrtwarr" | "skbthrwarr" | "skbclvwarr" | "skbcrzwarr" | "skbfblwarr" | "skbbas" | "skbcrt" | "skbthr" | "skbclv" | "skbcrz" | "skbfbl" | "skxdefwarr" | "skxdogwarr" | "skxctawarr" | "skxwmswarr" | "skxchgwarr" | "skxtstwarr" | "skxdef" | "skxdog" | "skxcta" | "skxwms" | "skxchg" | "skxtst" | "skhhelwlok" | "skhgsdwlok" | "skhinvwlok" | "skhhsdwlok" | "skhlokwlok" | "skhmhlwlok" | "skhhel" | "skhgsd" | "skhinv" | "skhhsd" | "skhlok" | "skhmhl" | "skpbaswlok" | "skppoiwlok" | "skpsklwlok" | "skprunwlok" | "skpcblwlok" | "skpsdmwlok" | "skpbas" | "skppoi" | "skpskl" | "skprun" | "skpcbl" | "skpsdm" | "silent" | "stun" | "skpts" | "setheavy" | "setwargod" | "setmara" | "setjihad" | "setsoul" | "setghost" | "setvenerable" | "setmaster" | "setmagic" | "setdemon" | "setmagegod" | "setcolorful" | "setblackiron" | "setmysterious" | "setmemory" | "setvoma" | "setzuma" | "setredmoon" | "setprisma" | "setdragon" | "setempire" | "setany" | "skfbltm1" | "skfrngm1" | "skfinfm1" | "skfbalm1" | "skfblsm1" | "skfblsm2" | "skfwalm1" | "skfwalm2" | "sktchmm1" | "sktbltm1" | "sktltnm1" | "sktltnm2" | "sktnovm1" | "sktshdm1" | "sktshdm2" | "sktblzm1" | "sktblzm2" | "skbbasm1" | "skbcrtm1" | "skbthrm1" | "skbclvm1" | "skbcrzm1" | "skbcrzm2" | "skbfblm1" | "skbfblm2" | "skxdefm1" | "skxdogm1" | "skxctam1" | "skxwmsm1" | "skxchgm1" | "skxtstm1" | "skxtstm2" | "skhhelm1" | "skhhelm2" | "skhgsdm1" | "skhinvm1" | "skhhsdm1" | "skhlokm1" | "skhlokm2" | "skhmhlm1" | "skhmhlm2" | "skpbasm1" | "skppoim1" | "skpsklm1" | "skprunm1" | "skpcblm1" | "skpcblm2" | "skpsdmm1" | "skpsdmm2";
    type StatValueType = "int" | "number" | "range" | "skillList" | "set";
    interface IStatConfig {
        id: StatId;
        name: string;
        type: StatValueType;
        cgroup: string;
        description: string;
        sort: number;
        depends: StatId[];
        derived: (d:import("../data/ReactStat").default)=>void;
        save: boolean;
        targetSkill: SkillId;
        skillTag: SkillTag[];
    }
}
declare const Stats: Array<IStatConfig>;
declare const StatById: Partial<Record<StatId, IStatConfig>>;
export { Stats, StatById }
