<script>
    import SceneManager from "../SceneManager";
    import UnitComponent from "../components/UnitComponent";
    import ItemFragment from "./ItemFragment.svelte";

    const { close, item, fillers } = $props();

    const hero = SceneManager.activeScene
        .find("game/hero")
        .getComponent(UnitComponent);
</script>

<div class="backdrop">
    <div class="wrapper">
        <div class="title">
            <div class="title-text">镶嵌</div>
            <button onclick={close} class="btn close-btn">X</button>
        </div>
        <div class="container">
            {#each fillers as e, i (e.uuid)}
                <ItemFragment
                    item={e}
                    left={(i % 8) * (40 + 2) + 4}
                    top={Math.floor(i / 8) * (40 + 2) + 4}
                    operations={["socketFill"]}
                    callbacks={{
                        socketFill: () => {
                            hero.trySocketItem(item, e);
                            close();
                        },
                    }}
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
