declare global {
    type AffixId = "hit1" | "mhit1" | "xdmg1" | "fdmg1" | "tdmg1" | "hdmg1" | "pdmg1" | "xdmgs" | "fdmgs" | "tdmgs" | "hdmgs" | "pdmgs" | "xdmglo1" | "fdmglo1" | "tdmglo1" | "hdmglo1" | "pdmglo1" | "xdmghi1" | "fdmghi1" | "tdmghi1" | "hdmghi1" | "pdmghi1" | "xed1" | "fed1" | "ted1" | "hed1" | "ped1" | "xeds" | "feds" | "teds" | "heds" | "peds" | "ued1" | "ded1" | "ced1" | "doted1" | "hled1" | "xdr1" | "fdr1" | "tdr1" | "hdr1" | "pdr1" | "xdrs" | "fdrs" | "tdrs" | "hdrs" | "pdrs" | "xref1" | "fref1" | "tref1" | "href1" | "pref1" | "maxhp1" | "maxmp1" | "sumreg1" | "xres1" | "fres1" | "tres1" | "hres1" | "pres1" | "xress" | "fress" | "tress" | "hress" | "press" | "mxxres1" | "mxfres1" | "mxtres1" | "mxhres1" | "mxpres1" | "ures1" | "dres1" | "cres1" | "c1res1" | "c23res1" | "dotres1" | "sumres1" | "flvl1" | "tlvl1" | "flvlmage1" | "tlvlmage1" | "magelvl1" | "blvl1" | "xlvl1" | "blvlwarr1" | "xlvlwarr1" | "warrlvl1" | "hlvl1" | "plvl1" | "hlvlwlok1" | "plvlwlok1" | "wlklvl1" | "alvl1" | "slvl1" | "glvl1" | "flvl2" | "tlvl2" | "flvlmage2" | "tlvlmage2" | "magelvl2" | "blvl2" | "xlvl2" | "blvlwarr2" | "xlvlwarr2" | "warrlvl2" | "hlvl2" | "plvl2" | "hlvlwlok2" | "plvlwlok2" | "wlklvl2" | "alvl2" | "slvl2" | "glvl2" | "flvl3" | "tlvl3" | "flvlmage3" | "tlvlmage3" | "magelvl3" | "blvl3" | "xlvl3" | "blvlwarr3" | "xlvlwarr3" | "warrlvl3" | "hlvl3" | "plvl3" | "hlvlwlok3" | "plvlwlok3" | "wlklvl3" | "slvl3" | "glvl3" | "luck1" | "eg1" | "sok1" | "sok2" | "sok3" | "sok4" | "sok5" | "rw1" | "mhex1" | "mpex" | "hreg1" | "mreg1" | "spd1" | "doge1" | "mdoge1" | "crit1" | "critd1" | "scrit1" | "scritd1" | "str1" | "strs" | "int1" | "spi1" | "vit1" | "vits" | "ll1" | "ml1" | "skfbltmage1" | "skfrngmage1" | "skfinfmage1" | "skfbalmage1" | "skfblsmage1" | "skfwalmage1" | "sktchmmage1" | "sktbltmage1" | "sktltnmage1" | "sktnovmage1" | "sktshdmage1" | "sktblzmage1" | "skbbaswarr1" | "skbcrtwarr1" | "skbthrwarr1" | "skbclvwarr1" | "skbcrzwarr1" | "skbfblwarr1" | "skxdefwarr1" | "skxdogwarr1" | "skxctawarr1" | "skxwmswarr1" | "skxchgwarr1" | "skxtstwarr1" | "skhhelwlok1" | "skhgsdwlok1" | "skhinvwlok1" | "skhhsdwlok1" | "skhlokwlok1" | "skhmhlwlok1" | "skpbaswlok1" | "skppoiwlok1" | "skpsklwlok1" | "skprunwlok1" | "skpcblwlok1" | "skpsdmwlok1" | "skfbltmage2" | "skfrngmage2" | "skfinfmage2" | "skfbalmage2" | "skfblsmage2" | "skfwalmage2" | "sktchmmage2" | "sktbltmage2" | "sktltnmage2" | "sktnovmage2" | "sktshdmage2" | "sktblzmage2" | "skbbaswarr2" | "skbcrtwarr2" | "skbthrwarr2" | "skbclvwarr2" | "skbcrzwarr2" | "skbfblwarr2" | "skxdefwarr2" | "skxdogwarr2" | "skxctawarr2" | "skxwmswarr2" | "skxchgwarr2" | "skxtstwarr2" | "skhhelwlok2" | "skhgsdwlok2" | "skhinvwlok2" | "skhhsdwlok2" | "skhlokwlok2" | "skhmhlwlok2" | "skpbaswlok2" | "skppoiwlok2" | "skpsklwlok2" | "skprunwlok2" | "skpcblwlok2" | "skpsdmwlok2" | "skfbltmage3" | "skfrngmage3" | "skfinfmage3" | "skfbalmage3" | "skfblsmage3" | "skfwalmage3" | "sktchmmage3" | "sktbltmage3" | "sktltnmage3" | "sktnovmage3" | "sktshdmage3" | "sktblzmage3" | "skbbaswarr3" | "skbcrtwarr3" | "skbthrwarr3" | "skbclvwarr3" | "skbcrzwarr3" | "skbfblwarr3" | "skxdefwarr3" | "skxdogwarr3" | "skxctawarr3" | "skxwmswarr3" | "skxchgwarr3" | "skxtstwarr3" | "skhhelwlok3" | "skhgsdwlok3" | "skhinvwlok3" | "skhhsdwlok3" | "skhlokwlok3" | "skhmhlwlok3" | "skpbaswlok3" | "skppoiwlok3" | "skpsklwlok3" | "skprunwlok3" | "skpcblwlok3" | "skpsdmwlok3" | "atkfblt1" | "atkfbal1" | "atktblt1" | "atkpcbl1" | "hitfrng1" | "atktnov1" | "atkhhel1" | "hithinv1" | "killfwal1" | "killbclv1" | "killxcta1" | "killpskl1" | "curs1" | "bles1" | "moral1" | "cb1" | "pmh1" | "xlr1" | "flr1" | "tlr1" | "hlr1" | "plr1" | "xlrs" | "flrs" | "tlrs" | "hlrs" | "plrs" | "skfblt1" | "skfrng1" | "skfinf1" | "skfbal1" | "skfbls1" | "skfwal1" | "sktchm1" | "sktblt1" | "sktltn1" | "sktnov1" | "sktshd1" | "sktblz1" | "skbbas1" | "skbcrt1" | "skbthr1" | "skbclv1" | "skbcrz1" | "skbfbl1" | "skxdef1" | "skxdog1" | "skxcta1" | "skxwms1" | "skxchg1" | "skxtst1" | "skhhel1" | "skhgsd1" | "skhinv1" | "skhhsd1" | "skhlok1" | "skhmhl1" | "skpbas1" | "skppoi1" | "skpskl1" | "skprun1" | "skpcbl1" | "skpsdm1" | "setwargod" | "setmara" | "setjihad" | "setghost" | "setvenerable" | "setmaster" | "setdemon" | "setmagegod" | "setcolorful" | "setblackiron" | "setmysterious" | "setmemory" | "setvoma" | "setzuma" | "setredmoon" | "setprisma" | "setdragon" | "setempire";
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
        ilvlScale: number;
        fluctuate: number;
        skill: SkillId;
        skillChance: number[];
        availOn: ItemType[];
        ilvl: number;
        level: number;
        weight: number;
    }
}
declare const Affixs: Array<IAffixConfig>;
declare const AffixById: Partial<Record<AffixId, IAffixConfig>>;
declare const AffixGroupByAvailOn: Partial<Record<ItemType, Array<IAffixConfig>>>;
export { Affixs, AffixById, AffixGroupByAvailOn }
