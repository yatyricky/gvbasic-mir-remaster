<script>
    import { onDestroy, onMount } from "svelte";
    import UnitComponent from "../components/UnitComponent";
    import { subscribe } from "../EventBus";
    import SceneManager from "../SceneManager";
    import ItemFragment from "./ItemFragment.svelte";
    
    const { close } = $props();

    function getBagData() {
        const hero = SceneManager.activeScene.find("game/hero").getComponent(UnitComponent);
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
    <div class="wrapper">
        <div class="title">
            <div class="title-text">背包</div>
            <button onclick={close} class="btn close-btn">X</button>
        </div>
        <div class="container">
            {#each bagData as item, i (item.uuid)}
                <ItemFragment
                    {item}
                    left={(i % 9) * (40 + 2)}
                    top={Math.floor(i / 9) * (40 + 2)}
                    operations={["equip", "socket"]}
                />
            {/each}
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
        background-color: #403a36;
        border-radius: 4px;
        color: #ffffff;
        border: 1px solid #0e0e0b;
        box-shadow:
            0 0 1px 2px #726e6c,
            inset 0 0 8px 4px #23201f;
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

    .close-btn {
        position: absolute;
        top: 0;
        right: 0;
        width: 24px;
        height: 24px;
    }
    .container {
        flex: 1;
        /* padding: 4px; */
        border-radius: 4px;
        word-break: break-all;
        overflow: auto;
        position: relative;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    .container::-webkit-scrollbar {
        display: none; /* Chrome, Safari, Opera */
    }
</style>
