<script>
    import { onDestroy, onMount } from "svelte";
    import Const from "../Const";
    import userData from "../data/UserData";
    import { JSONEditor } from "svelte-jsoneditor";

    let content = $state({ json: userData.data });

    let timer = -1;

    onMount(() => {
        timer = setInterval(() => {
            // content = /**@type {any}*/ (userData.data);
        }, 16);
    });

    onDestroy(() => {
        if (timer !== -1) {
            clearInterval(timer);
            timer = -1;
        }
    });
</script>

<div
    class="container"
    style="
        width: {Const.SIZE2 * 10}px;
        height: {window.innerHeight - Const.SIZE2 * (5 + 10)}px;
        top: {Const.SIZE2 * (5 + 10)}px;
        left: {(window.innerWidth - Const.SIZE2 * 10) / 2}px;
    "
>
    <JSONEditor {content} />
</div>

<style>
    .container {
        display: block;
        position: absolute;
        border: 1px solid #000;
        box-sizing: border-box;
        pointer-events: auto;
    }
</style>
