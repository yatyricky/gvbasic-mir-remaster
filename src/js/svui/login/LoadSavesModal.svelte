<script>
    import { onDestroy } from "svelte";
    import userData from "../../data/UserData";
    import { dispatch } from "../../EventBus";
    import MessageBox from "../MessageBox.svelte";

    const { close } = $props();

    let data = $state(userData.data.chars);

    /**
     *
     * @param {number} index
     */
    function deleteChar(index) {
        dispatch("modal:show", {
            component: MessageBox,
            props: {
                title: "删除角色",
                content: "确定要删除吗？",
                actions: [
                    {
                        text: "取消",
                        autoClose: true,
                    },
                    {
                        text: "确定",
                        action: () => {
                            userData.data.chars.splice(index, 1);
                            userData.saveToDisk();
                            data = userData.data.chars;
                        },
                        autoClose: true,
                    },
                ],
            },
        });
    }

    /**
     *
     * @param {number} index
     */
    function loadChar(index) {
        dispatch("scene:game", index);
        close();
    }

    onDestroy(() => {});
</script>

<div class="backdrop">
    <div class="wrapper">
        <div class="title">
            <div class="title-text">加载存档</div>
            <button onclick={close} class="btn close-btn">X</button>
        </div>
        <div class="container">
            {#each data as char, i (i)}
                <div class="char-item">
                    <button class="btn char-btn" onclick={() => loadChar(i)}>
                        <div class="char-name">{char.unitId}</div>
                        <div class="char-level">Level: {char.stats?.exp?.value ?? 0}</div>
                    </button>
                    <button
                        class="btn delete-btn"
                        onclick={() => {
                            deleteChar(i);
                        }}
                    >
                        删除
                    </button>
                </div>
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
        padding: 8px;
        border-radius: 4px;
        word-break: break-all;
        overflow: auto;
        position: relative;
        display: flex;
        flex-direction: column;
        gap: 8px;
    }
    .container::-webkit-scrollbar {
        display: none; /* Chrome, Safari, Opera */
    }
    .char-item {
        width: calc(100% - 8px);
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        padding: 4px;
        border-bottom: 1px solid #6d7070;
    }

    .char-btn {
        flex: 1;
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        justify-content: center;
        padding: 8px;
        text-align: left;
        margin-right: 8px;
    }

    .delete-btn {
        width: 60px;
        height: 32px;
        background-color: #8b0000;
    }

    .char-name {
        font-weight: bold;
        color: #ffffff;
        margin-bottom: 4px;
    }

    .char-level {
        color: #ceae0f;
        font-size: 0.9em;
    }
</style>
