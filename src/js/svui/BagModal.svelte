<script>
    import { onDestroy, onMount } from "svelte";
    import UnitComponent from "../components/UnitComponent";
    import { subscribe } from "../EventBus";
    import SceneManager from "../SceneManager";
    import ItemFragment from "./ItemFragment.svelte";
    import Const from "../Const";

    const { close } = $props();

    function getBagData() {
        const hero = SceneManager.activeScene
            .find("game/hero")
            .getComponent(UnitComponent);
        return hero.persistantData.bag;
    }

    let bagData = $state(getBagData());

    /**@type {any}*/
    let unsub = null;
    onMount(() => {
        unsub = subscribe("bag:refresh", () => {
            bagData = getBagData();
        });
    });

    onDestroy(() => {
        unsub?.();
        unsub = null;
    });
</script>

<div class="backdrop">
    <div class="title">
        <span>背包</span>
        <button onclick={close} class="close-btn">X</button>
    </div>
    <div class="container">
        {#each bagData as item, i (item.uuid)}
            <ItemFragment
                {item}
                left={(i % 9) * (Const.SIZE2 + 2)}
                top={Math.floor(i / 9) * (Const.SIZE2 + 2)}
                operations={["equip", "socket"]}
            />
        {/each}
    </div>
</div>

<style>
    .backdrop {
        position: absolute;
        width: 100%;
        height: 80%;
        left: 0%;
        top: 0%;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
        background-color: silver;
    }
    .title {
        position: absolute;
        width: 98%;
        height: 24px;
        top: 0;
        left: 0;
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0 1%;
        border-bottom: 1px solid #000;
    }
    .close-btn {
        background: none;
        width: 24px;
        height: 24px;
    }
    .container {
        position: absolute;
        width: 100%;
        height: calc(100% - 24px);
        top: 24px;
        overflow-y: auto;
    }
    button {
        padding: 0;
    }
</style>
