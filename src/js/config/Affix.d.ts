declare global {
    type AffixId = "hit1" | "mhit1" | "xdmg1" | "xdmg1rev" | "fdmg1" | "tdmg1" | "hdmg1" | "pdmg1" | "xed1" | "fed1" | "ted1" | "hed1" | "ped1" | "ued1" | "ded1" | "ced1" | "doted1" | "hled1" | "xdr1" | "fdr1" | "tdr1" | "hdr1" | "pdr1" | "maxhp1" | "maxmp1" | "xres1" | "fres1" | "tres1" | "hres1" | "pres1" | "flvl1" | "tlvl1" | "magelvl1" | "blvl1" | "xlvl1" | "warrlvl1" | "hlvl1" | "plvl1" | "wlklvl1" | "alvl1" | "slvl1" | "glvl1" | "luck1" | "eg1" | "sok1" | "rw1" | "mhex1" | "mpex" | "hreg1" | "mreg1" | "spd1" | "doge1" | "mdoge1" | "crit1" | "critd1" | "scrit1" | "scritd1" | "xatk1" | "matk1" | "watk1" | "ll1" | "ml1" | "skfbltmage1" | "skfrngmage1" | "skfinfmage1" | "skfbalmage1" | "skfblsmage1" | "skfwalmage1" | "sktchmmage1" | "sktbltmage1" | "sktltnmage1" | "sktnovmage1" | "sktshdmage1" | "sktblzmage1" | "skbbaswarr1" | "skbcrtwarr1" | "skbthrwarr1" | "skbclvwarr1" | "skbcrzwarr1" | "skbfblwarr1" | "skxdefwarr1" | "skxdogwarr1" | "skxctawarr1" | "skxwmswarr1" | "skxchgwarr1" | "skxtstwarr1" | "skhhelwlok1" | "skhgsdwlok1" | "skhinvwlok1" | "skhhsdwlok1" | "skhlokwlok1" | "skhmhlwlok1" | "skpbaswlok1" | "skppoiwlok1" | "skpsklwlok1" | "skprunwlok1" | "skpcblwlok1" | "skpsdmwlok1" | "atkfblt1" | "atkfbal1" | "atktblt1" | "atkpcbl1" | "hitfrng1" | "atktnov1" | "atkhhel1" | "hithinv1" | "curs1";
    type AffixType = "prefix" | "suffix" | "affix";
    interface IAffixConfig {
        id: AffixId;
        name: string;
        affixType: AffixType;
        stats: Partial<Record<StatId, number[]>>;
        skill: string;
        availOn: ItemType[];
    }
}
declare const Affixs: Array<IAffixConfig>;
declare const AffixById: Partial<Record<AffixId, IAffixConfig>>;
export { Affixs, AffixById }
