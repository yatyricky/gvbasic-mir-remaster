<script>
    import { getConfig, openProject, createProject, removeRecentWorkspace, pickFolder } from "../../lib/api-client.js";

    /** @type {{ currentPath: string, onSwitch: (project: any) => void }} */
    let { currentPath, onSwitch } = $props();

    let open = $state(false);
    let recent = $state([]);
    let loading = $state(false);
    let error = $state(null);
    let showCreate = $state(false);
    let newName = $state("");

    let folderName = $derived(currentPath ? currentPath.split(/[/\\]/).filter(Boolean).pop() || currentPath : "No Project");

    async function loadRecent() {
        try {
            const config = await getConfig();
            recent = config.recentWorkspaces || [];
        } catch { /* ignore */ }
    }

    function toggle() {
        open = !open;
        if (open) loadRecent();
    }

    function close() {
        open = false;
        showCreate = false;
        error = null;
    }

    async function switchTo(path) {
        loading = true;
        error = null;
        try {
            const p = await openProject(path);
            onSwitch(p);
            close();
        } catch (e) {
            error = `Failed to open: ${e.message}`;
        }
        loading = false;
    }

    async function handleRemove(path) {
        await removeRecentWorkspace(path);
        recent = recent.filter(p => p !== path);
    }

    async function handlePickFolder() {
        loading = true;
        error = null;
        try {
            const result = await pickFolder();
            if (result.path) {
                await switchTo(result.path);
            }
        } catch (e) {
            error = e.message;
        }
        loading = false;
    }

    async function handleCreate() {
        if (!newName.trim()) return;
        const parentPath = prompt("Enter parent directory path:");
        if (!parentPath) return;
        loading = true;
        error = null;
        try {
            const p = await createProject(parentPath, newName.trim());
            onSwitch(p);
            close();
        } catch (e) {
            error = `Failed to create: ${e.message}`;
        }
        loading = false;
    }

    function onWindowClick(e) {
        if (!e.target.closest('.ws-switcher')) {
            open = false;
        }
    }
</script>

<svelte:window onclick={onWindowClick} />

<div class="ws-switcher">
    <button class="ws-trigger" onclick={toggle} title={currentPath}>
        <span class="ws-name">{folderName}</span>
        <span class="ws-arrow" class:open>▾</span>
    </button>

    {#if open}
        <div class="ws-dropdown" onclick={(e) => e.stopPropagation()}>
            <div class="ws-current">{currentPath || "None"}</div>

            {#if recent.length > 0}
                <div class="ws-divider"></div>
                <div class="ws-section-label">Recent</div>
                <div class="ws-recent-list">
                    {#each recent as path}
                        <div class="ws-recent-item" class:active={path === currentPath}>
                            <button class="ws-recent-btn" onclick={() => switchTo(path)} title={path}>
                                {path}
                            </button>
                            <button class="ws-recent-remove" onclick={() => handleRemove(path)}>×</button>
                        </div>
                    {/each}
                </div>
            {/if}

            <div class="ws-divider"></div>
            <button class="ws-action" onclick={handlePickFolder}>📂 Open Folder...</button>
            <button class="ws-action" onclick={() => { showCreate = !showCreate; newName = ""; }}>➕ New Project...</button>

            {#if showCreate}
                <div class="ws-form">
                    <input
                        type="text"
                        class="ws-input"
                        placeholder="Project name"
                        value={newName}
                        oninput={(e) => newName = e.currentTarget.value}
                        onkeydown={(e) => e.key === "Enter" && handleCreate()}
                    />
                    <button class="ws-go" onclick={handleCreate} disabled={!newName.trim() || loading}>Create</button>
                </div>
            {/if}

            {#if error}
                <div class="ws-error">{error}</div>
            {/if}
        </div>
    {/if}
</div>

<style>
    .ws-switcher {
        position: relative;
    }
    .ws-trigger {
        display: flex;
        align-items: center;
        gap: 6px;
        width: 100%;
        padding: 8px 12px;
        background: none;
        border: none;
        cursor: pointer;
        text-align: left;
    }
    .ws-trigger:hover {
        background: var(--bg-surface);
    }
    .ws-name {
        flex: 1;
        font-size: 13px;
        font-weight: 700;
        color: var(--accent);
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }
    .ws-arrow {
        color: var(--text-muted);
        font-size: 12px;
        transition: transform 0.15s;
    }
    .ws-arrow.open {
        transform: rotate(180deg);
    }
    .ws-dropdown {
        position: absolute;
        top: 100%;
        left: 0;
        min-width: 360px;
        background: var(--bg-surface);
        border: 1px solid var(--border);
        border-radius: 8px;
        padding: 6px;
        z-index: 999;
        box-shadow: 0 8px 24px rgba(0,0,0,0.5);
    }
    .ws-current {
        padding: 4px 8px;
        font-size: 11px;
        color: var(--text-secondary);
        font-family: monospace;
        word-break: break-all;
    }
    .ws-divider {
        height: 1px;
        background: var(--border);
        margin: 4px 0;
    }
    .ws-section-label {
        font-size: 10px;
        color: var(--text-muted);
        text-transform: uppercase;
        padding: 2px 8px;
    }
    .ws-recent-list {
        max-height: 240px;
        overflow-y: auto;
    }
    .ws-recent-item {
        display: flex;
        align-items: center;
        border-radius: 4px;
    }
    .ws-recent-item:hover {
        background: var(--bg-hover);
    }
    .ws-recent-item.active {
        background: rgba(137, 180, 250, 0.1);
    }
    .ws-recent-btn {
        flex: 1;
        min-width: 0;
        padding: 5px 8px;
        background: none;
        border: none;
        cursor: pointer;
        text-align: left;
        font-size: 12px;
        font-family: monospace;
        color: var(--text-primary);
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }
    .ws-recent-item.active .ws-recent-btn {
        color: var(--accent);
    }
    .ws-recent-remove {
        background: none;
        border: none;
        color: var(--text-muted);
        cursor: pointer;
        padding: 2px 6px;
        font-size: 14px;
        flex-shrink: 0;
        opacity: 0;
    }
    .ws-recent-item:hover .ws-recent-remove {
        opacity: 1;
    }
    .ws-recent-remove:hover {
        color: var(--error);
    }
    .ws-action {
        display: block;
        width: 100%;
        padding: 6px 8px;
        background: none;
        border: none;
        border-radius: 4px;
        color: var(--text-primary);
        cursor: pointer;
        font-size: 12px;
        text-align: left;
    }
    .ws-action:hover {
        background: var(--bg-hover);
    }
    .ws-form {
        display: flex;
        gap: 6px;
        padding: 6px 4px;
        border-top: 1px solid var(--border);
    }
    .ws-input {
        flex: 1;
        padding: 5px 8px;
        background: var(--bg-primary);
        border: 1px solid var(--border);
        border-radius: 4px;
        color: var(--text-primary);
        font-size: 12px;
        font-family: monospace;
        outline: none;
    }
    .ws-input:focus {
        border-color: var(--accent);
    }
    .ws-go {
        padding: 4px 14px;
        background: var(--accent);
        color: var(--bg-primary);
        border: none;
        border-radius: 4px;
        cursor: pointer;
        font-size: 12px;
        font-weight: 600;
        white-space: nowrap;
    }
    .ws-go:disabled {
        opacity: 0.4;
        cursor: not-allowed;
    }
    .ws-error {
        padding: 4px 8px;
        color: var(--error);
        font-size: 11px;
    }
</style>
