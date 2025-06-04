<script>
    // import UnitComponent from "../components/UnitComponent";
    // import { ItemById } from "../config/Item";
    // import SceneManager from "../SceneManager";

    const { close } = $props();

    let page = $state(0);
</script>

<div class="backdrop">
    <div class="title">
        <span>安雅商店</span>
        <button onclick={close} class="close-btn">X</button>
    </div>
    <div class="container">
        {#if page === 0}
            <button>购买</button>
            <button>出售</button>
        {:else}
            <div class="item">
                <span>已选择购买的物品</span>
            </div>
        {/if}
        <!-- {#each bagData as item (item.uuid)}
        {@const itemConfig = ItemById[item.id]}
        
            <div class="item">
                <span>{itemConfig.image}</span>
            </div>
        {/each} -->
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
        
    }
    .container {
        position: absolute;
        width: 100%;
        height: calc(100% - 24px);
        top: 24px;
        overflow-y: auto;
    }
</style>
