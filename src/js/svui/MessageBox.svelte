<script>
    import Const from "../Const";

    /**
     * @type {any}
     */
    const { close, title = "提示", content, actions } = $props();
</script>

<div class="backdrop">
    <div class="container">
        <div class="title">
            <span>{title}</span>
            <button onclick={close} class="close-btn">X</button>
        </div>
        <div class="content">
            {content}
        </div>
        <div class="actions" style={`height: ${Const.SIZE2}px;`}>
            {#each actions as { text, action, autoClose }, i (i)}
                <button class="action-btn" style={`height: ${Const.SIZE2}px;`}
                    onclick={() => {
                        action?.();
                        if (autoClose) {
                            close();
                        }
                    }}>{text}</button
                >
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
    .container {
        display: block;
        position: absolute;
        width: 94%;
        height: 64%;
        left: 3%;
        top: 18%;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
        background-color: silver;
    }
    .title {
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
    .content {
        padding: 10px;
        height: calc(100% - 104px);
        overflow-y: auto;
    }
    .actions {
        display: flex;
        justify-content: center;
        align-items: center;
        position: absolute;
        width: 100%;
        bottom: 0;
        left: 0;
        gap: 16px;
    }
    .action-btn {
        background: none;
    }
</style>
