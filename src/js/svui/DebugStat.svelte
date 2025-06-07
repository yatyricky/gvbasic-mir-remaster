<script>
    import { onDestroy, onMount } from "svelte";
    import Const from "../Const";
    import UnitComponent from "../components/UnitComponent";
    import { Stats } from "../config/Stat";
    import SceneManager from "../SceneManager";
    import { JSONEditor } from "svelte-jsoneditor";

    let content = $state({ json: watchReactStat() });

    /**
     * @returns {Array<{ stat: string, name: string, value: StatValueSaveData }>}
     */
    function watchReactStat() {
        const curr = SceneManager.activeScene?.find("game/hero");
        if (curr == null) {
            return [];
        }
        const stat = curr.getComponent(UnitComponent).stat.data;

        /**@type {Array<{ stat: string, name: string, value: StatValueSaveData }>}*/
        let rows = [];
        for (const cfg of Stats) {
            rows.push({
                stat: cfg.id,
                name: cfg.name,
                value: stat[cfg.id],
            });
        }
        return rows;
    }

    let timer = -1;

    onMount(() => {
        timer = setInterval(() => {
            content.json = watchReactStat();
        }, 16);
    });

    onDestroy(() => {
        if (timer !== -1) {
            clearInterval(timer);
            timer = -1;
        }
    });
</script>

<div
    class="container"
    style="
        width: {(window.innerWidth - Const.SIZE2 * 10) / 2}px;
        height: {window.innerHeight}px;
        top: 0px;
        left: {(window.innerWidth - Const.SIZE2 * 10) / 2 + Const.SIZE2 * 10}px;
    "
>
    <JSONEditor {content} />
</div>

<style>
    .container {
        display: block;
        position: absolute;
        border: 1px solid #000;
        box-sizing: border-box;
    }
</style>
