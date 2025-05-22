declare global {
    type StatId = "rthp" | "rtmaxhp" | "maxhp" | "mhex" | "rtmp" | "rtmaxmp" | "maxmp" | "mpex" | "hreg" | "mreg" | "exp" | "xdr" | "fdr" | "tdr" | "hdr" | "pdr" | "xres" | "fres" | "tres" | "hres" | "pres" | "mxxres" | "mxfres" | "mxtres" | "mxhres" | "mxpres" | "rtxres" | "rtfres" | "rttres" | "rthres" | "rtpres" | "ures" | "dres" | "mres" | "rres" | "cres" | "curs" | "bles" | "luck" | "eg" | "spd" | "doge" | "mdoge" | "hit" | "mhit" | "xatk" | "matk" | "watk" | "xed" | "fed" | "ted" | "hed" | "ped" | "ued" | "ded" | "med" | "red" | "ced" | "doted" | "hled" | "flvl" | "tlvl" | "magelvl" | "blvl" | "xlvl" | "warrlvl" | "hlvl" | "plvl" | "wlklvl" | "alvl" | "slvl" | "glvl" | "cate" | "cb" | "ow" | "ref" | "ll" | "ml" | "lr" | "flr" | "tlr" | "hlr" | "plr" | "skfbltmage" | "skfrngmage" | "skfinfmage" | "skfbalmage" | "skfblsmage" | "skfwalmage" | "skfblt" | "skfrng" | "skfinf" | "skfbal" | "skfbls" | "skfwal" | "sktchmmage" | "sktbltmage" | "sktltnmage" | "sktnovmage" | "sktshdmage" | "sktblzmage" | "sktchm" | "sktblt" | "sktltn" | "sktnov" | "sktshd" | "sktblz" | "skbbaswarr" | "skbcrtwarr" | "skbthrwarr" | "skbclvwarr" | "skbcrzwarr" | "skbfblwarr" | "skbbas" | "skbcrt" | "skbthr" | "skbclv" | "skbcrz" | "skbfbl" | "skxdefwarr" | "skxdogwarr" | "skxctawarr" | "skxwmswarr" | "skxchgwarr" | "skxtstwarr" | "skxdef" | "skxdog" | "skxcta" | "skxwms" | "skxchg" | "skxtst" | "skhhelwlok" | "skhgsdwlok" | "skhinvwlok" | "skhhsdwlok" | "skhlokwlok" | "skhmhlwlok" | "skhhel" | "skhgsd" | "skhinv" | "skhhsd" | "skhlok" | "skhmhl" | "skpbaswlok" | "skppoiwlok" | "skpsklwlok" | "skprunwlok" | "skpcblwlok" | "skpsdmwlok" | "skpbas" | "skppoi" | "skpskl" | "skprun" | "skpcbl" | "skpsdm";
    type StatValueType = "number" | "range" | "set";
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
