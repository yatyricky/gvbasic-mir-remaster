<script>
    import DebugHierarchy from "./DebugHierarchy.svelte";
    import DebugInspector from "./DebugInspector.svelte";
    import { onDestroy, onMount } from "svelte";
    import GameObject from "../../gameObjs/GameObject";
    
    /**
     * @type {GameObject|null}
     */
    let selectedObject = $state(null);
    
    function handleSelect(event) {
        selectedObject = event.detail.gameObj;
    }
</script>

<div class="debug-panel">
    <DebugHierarchy on:select={handleSelect} />
    <DebugInspector selectedObject={selectedObject} />
</div>

<style>
    .debug-panel {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        z-index: 9999;
    }
    
    /* Allow pointer events on children but not on the panel itself */
    .debug-panel > :global(*) {
        pointer-events: auto;
    }
</style>
