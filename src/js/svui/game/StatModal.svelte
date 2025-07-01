<script>
    import UnitComponent from "../../components/UnitComponent";
    import SceneManager from "../../SceneManager";
    import { StatById } from "../../config/Stat";
    import { numFloor, objEntries } from "../../Utils";
    import { UnitById } from "../../config/Unit";
    import Bar from "../comps/Bar.svelte";
    import { onDestroy, onMount } from "svelte";

    const { close } = $props();

    const hero = SceneManager.activeScene.find("game/hero").getComponent(UnitComponent);
    const stat = hero.stat;
    const pd = hero.persistantData;

    const watch = $state({
        atpts: stat.getStat("atpts").value,
        level: stat.getStat("level").value,
        exp: stat.getStat("exp").value,
        expmax: stat.getStat("expmax").value,
        rthp: stat.getStat("rthp").value,
        rtmaxhp: stat.getStat("rtmaxhp").value,
        rtmp: stat.getStat("rtmp").value,
        rtmaxmp: stat.getStat("rtmaxmp").value,
        str: stat.getStat("str").value,
        int: stat.getStat("int").value,
        spi: stat.getStat("spi").value,
        vit: stat.getStat("vit").value,
    });

    let canAddAtt = $derived(watch.atpts > 0);
    let canAddAtt10 = $derived(watch.atpts >= 10);

    /**
     *
     * @param {[number, number]} range
     */
    function formatRange(range, pts = 0) {
        const vals = range.map((v) => numFloor(v, pts).toFixed(pts));
        return `${vals[0]}-${vals[1]}`;
    }

    function update() {
        for (const [key, _] of objEntries(watch)) {
            watch[key] = stat.getStat(key).value;
        }
    }

    /**
     *
     * @param {StatId} statId
     */
    function addAtt(statId, pts = 1) {
        if (watch.atpts < pts) {
            return;
        }
        hero.addStat(statId, pts);
    }

    onMount(() => {
        stat.on("*", update);
    });
    onDestroy(() => {
        stat.off("*", update);
    });
</script>

<div class="backdrop">
    <div class="wrapper">
        <div class="title">
            <div class="title-text">{pd.name}</div>
            <button onclick={close} class="btn close-btn">X</button>
        </div>
        <div class="container">
            <div class="row-info">
                <div class="col-left">等级 {watch.level} {UnitById[pd.unitId].name}</div>
                <div class="col-right">
                    <Bar max={watch.expmax} value={watch.exp} />
                </div>
            </div>
            <div class="divider"></div>
            <div class="row-info">
                <div class="col-left">{StatById.rthp.name}</div>
                <div class="col-right">{watch.rthp}/{watch.rtmaxhp}</div>
            </div>
            <div class="row-info">
                <div class="col-left">{StatById.rtmp.name}</div>
                <div class="col-right">{watch.rtmp}/{watch.rtmaxmp}</div>
            </div>
            <div class="row-info">
                <div class="col-left">{StatById.str.name}</div>
                <div class="col-right">
                    <span class="w-60">{watch.str}</span>
                    {#if canAddAtt}
                        <button class="btn btn-att" onclick={() => addAtt("str")}>+</button>
                    {/if}
                    {#if canAddAtt10}
                        <button class="btn btn-att w-36" onclick={() => addAtt("str", 10)}>+10</button>
                    {/if}
                </div>
            </div>
            <div class="row-info">
                <div class="col-left">{StatById.int.name}</div>
                <div class="col-right">
                    <span class="w-60">{watch.int}</span>
                    {#if canAddAtt}
                        <button class="btn btn-att" onclick={() => addAtt("int")}>+</button>
                    {/if}
                    {#if canAddAtt10}
                        <button class="btn btn-att w-36" onclick={() => addAtt("int", 10)}>+10</button>
                    {/if}
                </div>
            </div>
            <div class="row-info">
                <div class="col-left">{StatById.spi.name}</div>
                <div class="col-right">
                    <span class="w-60">{watch.spi}</span>
                    {#if canAddAtt}
                        <button class="btn btn-att" onclick={() => addAtt("spi")}>+</button>
                    {/if}
                    {#if canAddAtt10}
                        <button class="btn btn-att w-36" onclick={() => addAtt("spi", 10)}>+10</button>
                    {/if}
                </div>
            </div>
            <div class="row-info">
                <div class="col-left">{StatById.vit.name}</div>
                <div class="col-right">
                    <span class="w-60">{watch.vit}</span>
                    {#if canAddAtt}
                        <button class="btn btn-att" onclick={() => addAtt("vit")}>+</button>
                    {/if}
                    {#if canAddAtt10}
                        <button class="btn btn-att w-36" onclick={() => addAtt("vit", 10)}>+10</button>
                    {/if}
                </div>
            </div>
            <div class="row-info">
                <div class="col-left">{StatById.atpts.name}</div>
                <div class="col-right">{watch.atpts}</div>
            </div>
            <div class="divider"></div>
            <div class="row-info">
                <div class="col-left">{StatById.xdmg.name}</div>
                <div class="col-right">{formatRange(stat.getStat("xdmg").range)}</div>
            </div>
            <div class="row-info">
                <div class="col-left">{StatById.fdmg.name}</div>
                <div class="col-right">{formatRange(stat.getStat("fdmg").range)}</div>
            </div>
            <div class="row-info">
                <div class="col-left">{StatById.tdmg.name}</div>
                <div class="col-right">{formatRange(stat.getStat("tdmg").range)}</div>
            </div>
            <div class="row-info">
                <div class="col-left">{StatById.hdmg.name}</div>
                <div class="col-right">{formatRange(stat.getStat("hdmg").range)}</div>
            </div>
            <div class="row-info">
                <div class="col-left">{StatById.pdmg.name}</div>
                <div class="col-right">{formatRange(stat.getStat("pdmg").range)}</div>
            </div>
            <div class="divider"></div>

            <div class="row-info">
                <div class="col-left">{StatById.xed.name}</div>
                <div class="col-right">{stat.getStat("xed").value.toFixed(2)}%</div>
            </div>
            <div class="row-info">
                <div class="col-left">{StatById.fed.name}</div>
                <div class="col-right">{stat.getStat("fed").value.toFixed(2)}%</div>
            </div>
            <div class="row-info">
                <div class="col-left">{StatById.ted.name}</div>
                <div class="col-right">{stat.getStat("ted").value.toFixed(2)}%</div>
            </div>
            <div class="row-info">
                <div class="col-left">{StatById.hed.name}</div>
                <div class="col-right">{stat.getStat("hed").value.toFixed(2)}%</div>
            </div>
            <div class="row-info">
                <div class="col-left">{StatById.ped.name}</div>
                <div class="col-right">{stat.getStat("ped").value.toFixed(2)}%</div>
            </div>

            <div class="divider"></div>
            <div class="row-info">
                <div class="col-left">{StatById.hit.name}</div>
                <div class="col-right">{stat.getStat("hit").value.toFixed(2)}%</div>
            </div>
            <div class="row-info">
                <div class="col-left">{StatById.crit.name}</div>
                <div class="col-right">{stat.getStat("crit").value.toFixed(2)}%</div>
            </div>
            <div class="row-info">
                <div class="col-left">{StatById.critd.name}</div>
                <div class="col-right">{stat.getStat("critd").value.toFixed(2)}%</div>
            </div>
            <div class="row-info">
                <div class="col-left">{StatById.mhit.name}</div>
                <div class="col-right">{stat.getStat("mhit").value.toFixed(2)}%</div>
            </div>
            <div class="row-info">
                <div class="col-left">{StatById.scrit.name}</div>
                <div class="col-right">{stat.getStat("scrit").value.toFixed(2)}%</div>
            </div>
            <div class="row-info">
                <div class="col-left">{StatById.scritd.name}</div>
                <div class="col-right">{stat.getStat("scritd").value.toFixed(2)}%</div>
            </div>

            <div class="divider"></div>
            <div class="row-info">
                <div class="col-left">{StatById.doge.name}</div>
                <div class="col-right">{stat.getStat("doge").value.toFixed(2)}%</div>
            </div>
            <div class="row-info">
                <div class="col-left">{StatById.mdoge.name}</div>
                <div class="col-right">{stat.getStat("mdoge").value.toFixed(2)}%</div>
            </div>

            <div class="divider"></div>
            <div class="row-info">
                <div class="col-left">{StatById.xdr.name}</div>
                <div class="col-right">{formatRange(stat.getStat("xdr").range)}</div>
            </div>
            <div class="row-info">
                <div class="col-left">{StatById.fdr.name}</div>
                <div class="col-right">{formatRange(stat.getStat("fdr").range)}</div>
            </div>
            <div class="row-info">
                <div class="col-left">{StatById.tdr.name}</div>
                <div class="col-right">{formatRange(stat.getStat("tdr").range)}</div>
            </div>
            <div class="row-info">
                <div class="col-left">{StatById.hdr.name}</div>
                <div class="col-right">{formatRange(stat.getStat("hdr").range)}</div>
            </div>
            <div class="row-info">
                <div class="col-left">{StatById.pdr.name}</div>
                <div class="col-right">{formatRange(stat.getStat("pdr").range)}</div>
            </div>

            <div class="divider"></div>
            <div class="row-info">
                <div class="col-left">{StatById.rtxres.name}</div>
                <div class="col-right">{stat.getStat("rtxres").value}</div>
            </div>
            <div class="row-info">
                <div class="col-left">{StatById.rtfres.name}</div>
                <div class="col-right">{stat.getStat("rtfres").value}</div>
            </div>
            <div class="row-info">
                <div class="col-left">{StatById.rttres.name}</div>
                <div class="col-right">{stat.getStat("rttres").value}</div>
            </div>
            <div class="row-info">
                <div class="col-left">{StatById.rthres.name}</div>
                <div class="col-right">{stat.getStat("rthres").value}</div>
            </div>
            <div class="row-info">
                <div class="col-left">{StatById.rtpres.name}</div>
                <div class="col-right">{stat.getStat("rtpres").value}</div>
            </div>

            <div class="divider"></div>
            <div class="row-info">
                <div class="col-left">{StatById.bles.name}-{StatById.curs.name}</div>
                <div class="col-right">{stat.getStat("bles").value - stat.getStat("curs").value}</div>
            </div>
            <div class="row-info">
                <div class="col-left">{StatById.luck.name}</div>
                <div class="col-right">{Math.floor(stat.getStat("luck").value)}</div>
            </div>
            <div class="row-info">
                <div class="col-left">{StatById.spd.name}</div>
                <div class="col-right">{stat.getStat("spd").value}</div>
            </div>
            <div class="row-info">
                <div class="col-left">{StatById.moral.name}</div>
                <div class="col-right">{stat.getStat("moral").value}</div>
            </div>
        </div>
    </div>
</div>

<style>
    .backdrop {
        position: absolute;
        width: 100%;
        height: 100%;
        left: 0;
        top: 0;
        background-color: rgba(0, 0, 0, 0.5);
    }
    .wrapper {
        position: absolute;
        display: flex;
        flex-direction: column;
        background-color: #403a36;
        border-radius: 4px;
        color: #ffffff;
        text-shadow: 1px 2px 1px #23201f;
        border: 1px solid #0e0e0b;
        box-shadow:
            0 0 1px 2px #726e6c,
            inset 0 0 8px 4px #23201f;
        width: 94%;
        height: 94%;
        left: 3%;
        top: 3%;
        font-size: 14px;
    }
    .title {
        display: flex;
        flex-direction: row;
        align-items: center;
        font-size: 16px;
        border-radius: 4px;
        border-bottom: 1px solid #6d7070;
        box-shadow: inset 0 0 4px 2px #23201f;
        width: 100%;
        height: 24px;
        padding: 0;
    }
    .title-text {
        flex: 1;
        text-align: center;
        color: #ceae0f;
    }
    .btn {
        background-color: #680000;
        border-radius: 4px;
        padding: 0px;
        color: #ceae0f;
    }
    .close-btn {
        position: absolute;
        top: 0;
        right: 0;
        width: 24px;
        height: 24px;
    }
    .container {
        flex: 1;
        padding: 4px;
        border-radius: 4px;
        word-break: break-all;
        overflow: auto;
        position: relative;
    }
    .container::-webkit-scrollbar {
        display: none; /* Chrome, Safari, Opera */
    }
    .divider {
        width: 100%;
        height: 2px;
        background-color: #6d7070;
        margin: 8px 0;
        box-shadow: inset 0 0 2px 1px #23201f;
        border-radius: 1px;
    }
    .row-info {
        display: flex;
        flex-direction: row;
        align-items: center;
        width: 100%;
    }
    .col-left {
        flex: 0 0 160px;
        width: 160px;
    }
    .col-right {
        flex: 1;
        height: 24px;
        display: flex;
        align-items: center;
        height: 24px;
    }
    .btn-att {
        width: 24px;
        height: 24px;
    }
    .w-60 {
        width: 60px;
    }
    .w-36 {
        width: 36px;
    }
</style>
