declare global {
    type AffixId = "hit1" | "mhit1" | "xdmg1" | "xdmg1rev" | "fdmg1" | "tdmg1" | "hdmg1" | "pdmg1" | "xed1" | "fed1" | "ted1" | "hed1" | "ped1" | "ued1" | "ded1" | "ced1" | "doted1" | "hled1" | "xdr1" | "fdr1" | "tdr1" | "hdr1" | "pdr1" | "xref1" | "fref1" | "tref1" | "href1" | "pref1" | "maxhp1" | "maxmp1" | "sumreg1" | "xres1" | "fres1" | "tres1" | "hres1" | "pres1" | "mxxres1" | "mxfres1" | "mxtres1" | "mxhres1" | "mxpres1" | "ures1" | "dres1" | "cres1" | "c1res1" | "c23res1" | "dotres1" | "sumres1" | "flvl1" | "tlvl1" | "flvlmage1" | "tlvlmage1" | "magelvl1" | "blvl1" | "xlvl1" | "blvlwarr1" | "xlvlwarr1" | "warrlvl1" | "hlvl1" | "plvl1" | "hlvlwlok1" | "plvlwlok1" | "wlklvl1" | "alvl1" | "slvl1" | "glvl1" | "luck1" | "eg1" | "sok1" | "sok2" | "sok3" | "sok4" | "sok5" | "rw1" | "mhex1" | "mpex" | "hreg1" | "mreg1" | "spd1" | "doge1" | "mdoge1" | "crit1" | "critd1" | "scrit1" | "scritd1" | "str1" | "int1" | "spi1" | "vit1" | "ll1" | "ml1" | "skfbltmage1" | "skfrngmage1" | "skfinfmage1" | "skfbalmage1" | "skfblsmage1" | "skfwalmage1" | "sktchmmage1" | "sktbltmage1" | "sktltnmage1" | "sktnovmage1" | "sktshdmage1" | "sktblzmage1" | "skbbaswarr1" | "skbcrtwarr1" | "skbthrwarr1" | "skbclvwarr1" | "skbcrzwarr1" | "skbfblwarr1" | "skxdefwarr1" | "skxdogwarr1" | "skxctawarr1" | "skxwmswarr1" | "skxchgwarr1" | "skxtstwarr1" | "skhhelwlok1" | "skhgsdwlok1" | "skhinvwlok1" | "skhhsdwlok1" | "skhlokwlok1" | "skhmhlwlok1" | "skpbaswlok1" | "skppoiwlok1" | "skpsklwlok1" | "skprunwlok1" | "skpcblwlok1" | "skpsdmwlok1" | "atkfblt1" | "atkfbal1" | "atktblt1" | "atkpcbl1" | "hitfrng1" | "atktnov1" | "atkhhel1" | "hithinv1" | "curs1" | "bles1" | "moral1" | "cb1" | "pmh1" | "xlr1" | "flr1" | "tlr1" | "hlr1" | "plr1" | "skfblt1" | "skfrng1" | "skfinf1" | "skfbal1" | "skfbls1" | "skfwal1" | "sktchm1" | "sktblt1" | "sktltn1" | "sktnov1" | "sktshd1" | "sktblz1" | "skbbas1" | "skbcrt1" | "skbthr1" | "skbclv1" | "skbcrz1" | "skbfbl1" | "skxdef1" | "skxdog1" | "skxcta1" | "skxwms1" | "skxchg1" | "skxtst1" | "skhhel1" | "skhgsd1" | "skhinv1" | "skhhsd1" | "skhlok1" | "skhmhl1" | "skpbas1" | "skppoi1" | "skpskl1" | "skprun1" | "skpcbl1" | "skpsdm1" | "setwargod" | "setmara" | "setjihad" | "setghost" | "setvenerable" | "setmaster" | "setdemon" | "setmagegod" | "setcolorful" | "setblackiron" | "setmysterious" | "setmemory" | "setvoma" | "setzuma" | "setredmoon" | "setprisma" | "setdragon" | "setempire";
    type AffixType = "prefix" | "suffix";
    interface IAffixConfig {
        id: AffixId;
        name: string;
        affixType: AffixType;
        statId: StatId;
        lo: number;
        hi: number;
        loIlvlDelta: number;
        hiIlvlDelta: number;
        fluctuate: number;
        reversed: boolean;
        skill: SkillId;
        skillChance: number[];
        availOn: ItemType[];
    }
}
declare const Affixs: Array<IAffixConfig>;
declare const AffixById: Partial<Record<AffixId, IAffixConfig>>;
declare const AffixGroupByAvailOn: Partial<Record<ItemType, Array<IAffixConfig>>>;
export { Affixs, AffixById, AffixGroupByAvailOn }
