<script>
    import SceneManager from "../../SceneManager";
    import { onDestroy, onMount } from "svelte";
    import GameObject from "../../gameObjs/GameObject";

    // Currently selected item
    /**
     * @type {GameObject}
     */
    let selectedObj = $state(null);

    /**
     * Select a tree item
     * @param {GameObject} gameObj - The GameObject associated with this tree item
     */
    function selectItem(gameObj) {
        selectedObj = gameObj;
    }

    /**
     * @typedef {Object} TreeItem
     * @property {string} text - The text to display for the tree item.
     * @property {number} indent - The indentation level of the tree item.
     * @property {GameObject} gameObj - The GameObject associated with this tree item.
     * @property {boolean} isCollapsed - Whether this item is collapsed.
     * @property {boolean} hasChildren - Whether this item has children.
     */

    /**
     * @type {Array<TreeItem>}
     */
    let tree = $state([]);

    /**
     * Store for collapsed state, keyed by GameObject UUID
     * @type {Map<number, boolean>}
     */
    let collapsedState = $state(new Map());

    /**
     * Toggle the collapsed state of a tree item
     * @param {number} id - The unique identifier of the tree item
     */
    function toggleCollapsed(id) {
        if (collapsedState.has(id)) {
            collapsedState.set(id, !collapsedState.get(id));
        } else {
            collapsedState.set(id, true);
        }
        // Force tree rebuild
        tree = buildTree();
    }

    function buildTree() {
        /**
         * @type {Array<TreeItem>}
         */
        let sb = [];
        let indent = 0;
        /**
         *
         * @param {GameObject} curr
         * @param {boolean} isHidden - Whether this item should be hidden due to parent collapse
         */
        function buildTreeRecursive(curr, isHidden = false) {
            if (curr == null) {
                return;
            }

            const currId = curr.uuid;
            const isCollapsed = collapsedState.get(currId) || false;
            const hasChildren = curr.children.length > 0;

            // Only add the item if it's not hidden by a collapsed parent
            if (!isHidden) {
                let label = curr.name;
                const comps = [];
                for (const comp of curr.getComponents()) {
                    comps.push(comp.toString());
                }
                if (comps.length > 0) {
                    label += ` (${comps.join(", ")})`;
                }

                sb.push({
                    text: label,
                    indent,
                    gameObj: curr,
                    isCollapsed,
                    hasChildren,
                });
            }

            // Process children only if not collapsed
            if (!isCollapsed) {
                for (const child of curr.children) {
                    indent++;
                    buildTreeRecursive(child, isHidden);
                    indent--;
                }
            }
        }

        buildTreeRecursive(SceneManager.activeScene);
        return sb;
    }

    let timer = -1;

    onMount(() => {
        timer = setInterval(() => {
            tree = buildTree();
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
    class="wrapper"
    style="
        width: {(window.innerWidth - 400) / 2}px;
        height: {window.innerHeight}px;
        top: 0px;
        left: 0px;
    "
>
    <div
        class="container"
        style="
        width: 100%;
        height: {window.innerHeight / 2}px;
        top: 0px;
        left: 0px;
    "
    >
        {#each tree as item (item.gameObj.uuid)}
            <!-- svelte-ignore a11y_no_static_element_interactions -->
            <!-- svelte-ignore a11y_click_events_have_key_events -->
            <div
                class="tree-item"
                class:selected={selectedObj != null && selectedObj.uuid === item.gameObj.uuid}
                onclick={() => selectItem(item.gameObj)}
            >
                <span class="indent" style="width: {item.indent * 20}px;"></span>
                {#if item.hasChildren}
                    <!-- svelte-ignore a11y_no_static_element_interactions -->
                    <!-- svelte-ignore a11y_click_events_have_key_events -->
                    <span
                        class="toggle"
                        onclick={(e) => {
                            e.stopPropagation();
                            toggleCollapsed(item.gameObj.uuid);
                        }}
                    >
                        {item.isCollapsed ? "►" : "▼"}
                    </span>
                {:else}
                    <span class="toggle-placeholder"></span>
                {/if}
                <span class="text">
                    {item.text}
                </span>
            </div>
        {/each}
    </div>
    <div
        class="inspector"
        style="
        width: 100%;
        height: {window.innerHeight / 2}px;
        top: {window.innerHeight / 2}px;
        left: 0px;
    "
    >
        {#if selectedObj != null}
            {@html selectedObj.getInspector()}
        {/if}
    </div>
</div>

<style>
    .wrapper {
        display: block;
        background-color: rgba(56, 56, 56, 1);
        position: absolute;
        border: 1px solid #000;
        box-sizing: border-box;
        font-size: 14px;
        color: #ffffff;
        overflow: hidden; /* Prevent scrollbars at the wrapper level */
    }
    .container {
        display: block;
        position: absolute;
        border: 1px solid #000;
        box-sizing: border-box;
        overflow-y: auto;
        overflow-x: hidden;
    }
    .inspector {
        display: block;
        position: absolute;
        border: 1px solid #000;
        box-sizing: border-box;
        overflow-y: auto;
        overflow-x: hidden;
    }
    .tree-item {
        width: 100%;
        display: flex;
        align-items: center;
        white-space: nowrap;
        padding: 2px 0;
        cursor: pointer;
        box-sizing: border-box;
        min-width: 0; /* Prevents flex items from overflowing */
    }
    .tree-item:hover {
        background-color: rgba(80, 80, 80, 1);
    }
    .tree-item.selected {
        background-color: rgba(44, 93, 135, 1);
    }
    .indent {
        display: inline-block;
        flex-shrink: 0;
    }
    .toggle,
    .toggle-placeholder {
        width: 16px;
        text-align: center;
        flex-shrink: 0;
        user-select: none;
    }
    .toggle {
        cursor: pointer;
        color: #aaa;
        font-size: 10px;
    }
    .toggle:hover {
        color: #fff;
    }
    .text {
        flex-grow: 1;
        overflow: hidden;
        text-overflow: ellipsis;
        padding-left: 4px;
        min-width: 0; /* Needed for text-overflow to work in flex items */
    }
</style>
