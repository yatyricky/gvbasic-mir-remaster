<script>
    import { onDestroy, onMount } from "svelte";
    import userData from "../data/UserData";
    import { JSONEditor } from "svelte-jsoneditor";

    let content = $state({ json: userData.data });

    let timer = -1;

    onMount(() => {
        timer = setInterval(() => {
            content = { json: userData.data };
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
        width: {40 * 10}px;
        height: {window.innerHeight - 40 * (5 + 10)}px;
        top: {40 * (5 + 10)}px;
        left: {(window.innerWidth - 40 * 10) / 2}px;
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
