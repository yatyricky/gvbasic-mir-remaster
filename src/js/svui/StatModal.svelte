<script>
    import UnitComponent from "../components/UnitComponent";
    import SceneManager from "../SceneManager";
    import { StatById } from "../config/Stat";
    import { strFormat } from "../Utils";
    
    const { close } = $props();

    const hero = SceneManager.activeScene.find("game/hero").getComponent(UnitComponent);
    const stat = hero.stat;

    /**
     *
     * @param {StatId} statId
     */
    function formatStat(statId) {
        const val = stat.getStat(statId);
        const statConfig = StatById[statId];
        if (statConfig.type === "int" || statConfig.type === "number") {
            return strFormat(statConfig.description, val.value);
        } else if (statConfig.type === "range") {
            return strFormat(statConfig.description, val.range[0], val.range[1]);
        } else {
            throw new Error(`Unknown stat type: ${statConfig.type}`);
        }
    }
</script>

<div class="backdrop">
    <div class="wrapper">
        <div class="title">
            <div class="title-text">属性</div>
            <button onclick={close} class="btn close-btn">X</button>
        </div>
        <div class="container">
            <div>{StatById.rthp.name}: {formatStat("rthp")}/{formatStat("rtmaxhp")}</div>
            <div>{StatById.rtmp.name}: {formatStat("rtmp")}/{formatStat("rtmaxmp")}</div>
            <div>{StatById.str.name}: {formatStat("str")}</div>
            <div>{StatById.int.name}: {formatStat("int")}</div>
            <div>{StatById.spi.name}: {formatStat("spi")}</div>
            <div>{StatById.vit.name}: {formatStat("vit")}</div>
            <div>{StatById.xdmg.name}: {formatStat("xdmg")}</div>
            <div>{StatById.fdmg.name}: {formatStat("fdmg")}</div>
            <div>{StatById.tdmg.name}: {formatStat("tdmg")}</div>
            <div>{StatById.hdmg.name}: {formatStat("hdmg")}</div>
            <div>{StatById.pdmg.name}: {formatStat("pdmg")}</div>
            <div>{StatById.rtxres.name}: {formatStat("rtxres")}</div>
            <div>{StatById.rtfres.name}: {formatStat("rtfres")}</div>
            <div>{StatById.rttres.name}: {formatStat("rttres")}</div>
            <div>{StatById.rthres.name}: {formatStat("rthres")}</div>
            <div>{StatById.rtpres.name}: {formatStat("rtpres")}</div>
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
    .btn {
        background-color: #680000;
        border-radius: 4px;
        padding: 0px;
        color: #ceae0f;
    }
    .wrapper {
        position: absolute;
        display: flex;
        flex-direction: column;
        background-color: #403A36;
        border-radius: 4px;
        color: #ffffff;
        text-shadow: 1px 2px 1px #23201F;
        border: 1px solid #0E0E0B;
        box-shadow: 0 0 1px 2px #726E6C, inset 0 0 8px 4px #23201F;
        width: 94%;
        height: 94%;
        left: 3%;
        top: 3%;
    }
    .title {
        display: flex;
        flex-direction: row;
        align-items: center;
        font-size: 16px;
        border-radius: 4px;
        border-bottom: 1px solid #6D7070;
        box-shadow: inset 0 0 4px 2px #23201F;
        width: 100%;
        height: 24px;
        padding: 0;
    }
    .title-text {
        flex: 1;
        text-align: center;
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
</style>
