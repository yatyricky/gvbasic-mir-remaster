<script>
    import { onDestroy } from "svelte";
    import GameObject from "../../gameObjs/GameObject";
    
    /**
     * @type {GameObject|null}
     */
    let selectedObject = $state(null);
    
    // Component list for the selected object
    let components = $derived(
        selectedObject ? Array.from(selectedObject.getComponents()) : []
    );
</script>

<div
    class="container"
    style="
        width: {(window.innerWidth - 400) / 2}px;
        height: {window.innerHeight}px;
        top: 0px;
        left: {(window.innerWidth - 400) / 2}px;
    "
>
    {#if selectedObject}
        <div class="section">
            <div class="section-header">GameObject</div>
            <div class="property">
                <div class="property-name">Name</div>
                <div class="property-value">{selectedObject.name}</div>
            </div>
            <div class="property">
                <div class="property-name">Active</div>
                <div class="property-value">{selectedObject.active ? 'True' : 'False'}</div>
            </div>
            <div class="property">
                <div class="property-name">Position</div>
                <div class="property-value">X: {selectedObject.x}, Y: {selectedObject.y}</div>
            </div>
            <div class="property">
                <div class="property-name">Size</div>
                <div class="property-value">W: {selectedObject.w}, H: {selectedObject.h}</div>
            </div>
        </div>
        
        {#if components.length > 0}
            <div class="section">
                <div class="section-header">Components</div>
                {#each components as component}
                    <div class="component">
                        <div class="component-header">{component.constructor.name}</div>
                        <!-- You can expand this to show component properties -->
                    </div>
                {/each}
            </div>
        {/if}
    {:else}
        <div class="no-selection">No GameObject selected</div>
    {/if}
</div>

<style>
    .container {
        display: block;
        background-color: rgba(56, 56, 56, 1);
        position: absolute;
        border: 1px solid #000;
        box-sizing: border-box;
        font-size: 14px;
        color: #ffffff;
        overflow-y: auto;
    }
    .no-selection {
        padding: 10px;
        color: #aaa;
        font-style: italic;
        text-align: center;
        margin-top: 20px;
    }
    .section {
        margin-bottom: 10px;
        border-bottom: 1px solid #444;
    }
    .section-header {
        font-weight: bold;
        background-color: #444;
        padding: 4px 8px;
    }
    .property {
        display: flex;
        padding: 2px 8px;
    }
    .property-name {
        flex: 0 0 100px;
        color: #aaa;
    }
    .property-value {
        flex: 1;
    }
    .component {
        margin: 4px 0;
        padding: 0 8px;
    }
    .component-header {
        font-weight: bold;
        color: #8ab4f8;
        padding: 2px 0;
    }
</style>
