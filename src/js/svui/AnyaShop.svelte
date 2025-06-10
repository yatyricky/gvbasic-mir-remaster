<script>
    import { onDestroy } from "svelte";
    import Const from "../Const";
    import userData from "../data/UserData";
    import ItemFragment from "./ItemFragment.svelte";
    import { arrRemove } from "../Utils";

    const { close } = $props();

    let page = $state(0);

    let goods = $state(userData.getAnyaShopGoods());
    let goodsHeight = $derived(
        (() => {
            return Math.ceil(goods.length / 10) * Const.SIZE2;
        })(),
    );

    onDestroy(() => {});
</script>

<div class="backdrop">
    <div class="wrapper">
        <div class="title">
            <div class="title-text">安雅商店</div>
            <button onclick={close} class="btn close-btn">X</button>
        </div>
        <div class="container">
            {#if page === 0}
                <div class="options">
                    <button
                        class="btn"
                        style={`width: ${Const.SIZE2 * 3}px; height: ${Const.SIZE2 * 0.8}px;`}
                        onclick={() => (page = 1)}>购买</button
                    >
                    <button
                        class="btn"
                        style={`width: ${Const.SIZE2 * 3}px; height: ${Const.SIZE2 * 0.8}px;`}
                        onclick={() => (page = 2)}>出售</button
                    >
                </div>
            {:else if page === 1}
                <div class="goods" style={`height: ${goodsHeight}px;`}>
                    {#each goods as item, i (item.uuid)}
                        <ItemFragment
                            {item}
                            left={(i % 9) * (Const.SIZE2 + 2)}
                            top={Math.floor(i / 9) * (Const.SIZE2 + 2)}
                            width={Const.SIZE2}
                            height={Const.SIZE2}
                            operations={["buy"]}
                            callbacks={{
                                buy: () => {
                                    arrRemove(goods, item);
                                },
                            }}
                        />
                    {/each}
                </div>
            {:else if page === 2}{/if}
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

    .options {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        row-gap: 16px;
    }
</style>
