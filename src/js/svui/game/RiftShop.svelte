<script>
    import { onDestroy } from "svelte";
    import userData from "../../data/UserData";
    import ItemFragment from "./ItemFragment.svelte";
    import { arrRemove } from "../../Utils";

    const { close } = $props();
</script>

<div class="backdrop">
    <div class="wrapper">
        <div class="title">
            <div class="title-text">赤月秘境</div>
            <button onclick={close} class="btn close-btn">X</button>
        </div>
        <div class="container">
            <div class="rows">
                <div class="input-row">
                    <label for="inputLevels">层数</label>
                    <input type="text" class="input-levels" id="inputLevels" />
                </div>
                <div class="actions-row">
                    <button class="btn btn-enter" style={`width: ${40 * 3}px; height: ${40 * 0.8}px;`}>进入</button>
                </div>
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

    .rows {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 20px;
        width: 100%;
        max-width: 300px;
    }

    .input-row {
        display: flex;
        flex-direction: row;
        align-items: center;
        gap: 12px;
        margin-bottom: 16px;
    }

    .input-row label {
        color: #ceae0f;
        font-weight: bold;
        min-width: 60px;
    }

    .input-levels {
        background-color: #23201f;
        border: 1px solid #6d7070;
        border-radius: 4px;
        color: #ffffff;
        padding: 6px 8px;
        font-size: 14px;
        width: 120px;
    }

    .input-levels:focus {
        outline: none;
        border-color: #ceae0f;
        box-shadow: 0 0 4px rgba(206, 174, 15, 0.3);
    }

    .actions-row {
        display: flex;
        flex-direction: row;
        justify-content: center;
        gap: 12px;
        margin-top: 16px;
    }

    .btn-enter {
        font-size: 14px;
        font-weight: bold;
        cursor: pointer;
        transition: background-color 0.2s ease;
    }

    .btn-enter:hover {
        background-color: #8b0000;
    }

    .btn-enter:active {
        background-color: #4a0000;
        transform: translateY(1px);
    }
</style>
