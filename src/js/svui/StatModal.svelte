<script>
    import { onDestroy, onMount } from "svelte";
    import UnitComponent from "../components/UnitComponent";
    import { subscribe } from "../EventBus";
    import SceneManager from "../SceneManager";
    import ItemFragment from "./ItemFragment.svelte";
    import Const from "../Const";
    import { StatById } from "../config/Stat";
    import { objKeys, strFormat } from "../Utils";
    import { SkillById } from "../config/Skill";

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
        if (statConfig.type === "int") {
            if (statConfig.format === "int") {
                return Math.floor(val.value).toString();
            } else if (statConfig.format === "percent") {
                return `${val.value.toFixed(0)}%`;
            } else if (statConfig.format === "none") {
                return null;
            } else {
                throw new Error(`Unknown stat format: ${statConfig.format}`);
            }
        } else if (statConfig.type === "number") {
            if (statConfig.format === "int") {
                return Math.floor(val.value).toString();
            } else if (statConfig.format === "percent") {
                return `${val.value.toFixed(2)}%`;
            } else if (statConfig.format === "none") {
                return null;
            } else {
                throw new Error(`Unknown stat format: ${statConfig.format}`);
            }
        } else if (statConfig.type === "range") {
            if (statConfig.format === "int") {
                return `${val.range.map((v) => Math.floor(v)).join("-")}`;
            } else if (statConfig.format === "percent") {
                return `${val.range.map((v) => `${v.toFixed(2)}%`).join("-")}`;
            } else if (statConfig.format === "none") {
                return null;
            } else {
                throw new Error(`Unknown stat format: ${statConfig.format}`);
            }
        } else if (statConfig.type === "set") {
            return `${objKeys(val.set).join(",")}`;
        } else if (statConfig.type === "skillList") {
            return val.skillList
                .map((e) =>
                    strFormat(
                        statConfig.description,
                        (e.chance * 100).toFixed(2),
                        Math.floor(e.level),
                        SkillById[e.skill].name,
                    ),
                )
                .join(";");
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
        background-color: #3e3a32;
        border-radius: 4px;
        color: #ffffff;
        border: 2px solid #86817d;
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
        border-bottom: 2px solid #86817d;
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
        width: 24px;
        height: 24px;
        flex-shrink: 0;
    }
    .container {
        flex: 1;
        padding: 4px;
        border-radius: 4px;
        word-break: break-all;
        overflow: auto;
        position: relative;
    }
</style>
