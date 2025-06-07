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
    <div class="title">
        <span>安雅商店</span>
        <button onclick={close} class="close-btn">X</button>
    </div>
    <div class="container">
        {#if page === 0}
            <button
                style={`top: 80px; left: ${Const.SIZE2 * 4.25}px; width: ${Const.SIZE2 * 1.5}px; height: ${Const.SIZE2}px;`}
                onclick={() => (page = 1)}>购买</button
            >
            <button
                style={`top: 130px; left: ${Const.SIZE2 * 4.25}px; width: ${Const.SIZE2 * 1.5}px; height: ${Const.SIZE2}px;`}
                onclick={() => (page = 2)}>出售</button
            >
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
                        callbacks={
                            {
                                buy: () => {
                                    arrRemove(goods, item);
                                }
                            }
                        }
                    />
                {/each}
            </div>
        {:else if page === 2}{/if}
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
    button {
        position: absolute;
        background: none;
    }
    .close-btn {
        right: 6px;
    }
    .container {
        position: absolute;
        width: 100%;
        height: calc(100% - 24px);
        top: 24px;
        overflow-y: auto;
    }
    .goods {
        width: 100%;
    }
</style>
