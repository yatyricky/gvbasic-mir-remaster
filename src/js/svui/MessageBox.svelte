<script>
    /**
     * @type {any}
     */
    const { close, title = "提示", content, actions, html = false } = $props();
</script>

<div class="backdrop">
    <div class="wrapper">
        <div class="title">
            <div class="title-text">{title}</div>
            <button onclick={close} class="btn close-btn">X</button>
        </div>
        <div class="container">
            <div class="content">
                {#if html}
                    {@html content}
                {:else}
                    {content}
                {/if}
            </div>
            <div class="actions">
                {#each actions as { text, action, autoClose }, i (i)}
                    <button
                        class="btn action-btn"
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
        height: 64%;
        left: 3%;
        top: 18%;
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
        display: flex;
        flex-direction: column;
        padding: 4px;
        border-radius: 4px;
        overflow: hidden;
        gap: 6px;
    }
    .content::-webkit-scrollbar {
        display: none; /* Chrome, Safari, Opera */
    }
    .content{
        flex: 1;
        padding: 4px;
        overflow-y: auto;
        word-break: break-all;
    }
    .actions {
        display: flex;
        flex-shrink: 0;
        justify-content: center;
        align-items: center;
        width: 100%;
        gap: 16px;
    }
    .action-btn {
        width: 96px;
        height: 32px;
    }
</style>
