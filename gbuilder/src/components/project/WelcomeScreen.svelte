<script>
    import { createProject, openProject } from "../../lib/api-client.js";

    /** @type {{ onReady: (project: any) => void }} */
    let { onReady } = $props();

    let mode = $state("choose"); // choose | create | open
    let projectPath = $state("");
    let projectName = $state("");
    let error = $state(null);
    let loading = $state(false);

    async function handleCreate() {
        if (!projectPath || !projectName) { error = "Path and name required"; return; }
        loading = true;
        error = null;
        try {
            const p = await createProject(projectPath, projectName);
            onReady(p);
        } catch (e) {
            error = e.message;
        }
        loading = false;
    }

    async function handleOpen() {
        if (!projectPath) { error = "Path required"; return; }
        loading = true;
        error = null;
        try {
            const p = await openProject(projectPath);
            onReady(p);
        } catch (e) {
            error = e.message;
        }
        loading = false;
    }
</script>

<div class="welcome">
    <div class="card">
        <h1 class="title">gbuilder</h1>
        <p class="subtitle">Smart Config Table Editor</p>

        {#if mode === "choose"}
            <div class="actions">
                <button class="btn primary" onclick={() => mode = "create"}>New Project</button>
                <button class="btn" onclick={() => mode = "open"}>Open Project</button>
            </div>
        {:else if mode === "create"}
            <div class="form">
                <label>
                    <span>Parent Directory</span>
                    <input type="text" bind:value={projectPath} placeholder="C:\Users\nef\Documents" />
                </label>
                <label>
                    <span>Project Name</span>
                    <input type="text" bind:value={projectName} placeholder="my-arpg-config" />
                </label>
                <div class="form-actions">
                    <button class="btn primary" onclick={handleCreate} disabled={loading}>
                        {loading ? "Creating..." : "Create"}
                    </button>
                    <button class="btn" onclick={() => mode = "choose"}>Back</button>
                </div>
            </div>
        {:else if mode === "open"}
            <div class="form">
                <label>
                    <span>Project Directory</span>
                    <input type="text" bind:value={projectPath} placeholder="C:\Users\nef\Documents\my-arpg-config" />
                </label>
                <div class="form-actions">
                    <button class="btn primary" onclick={handleOpen} disabled={loading}>
                        {loading ? "Opening..." : "Open"}
                    </button>
                    <button class="btn" onclick={() => mode = "choose"}>Back</button>
                </div>
            </div>
        {/if}

        {#if error}
            <p class="error">{error}</p>
        {/if}
    </div>
</div>

<style>
    .welcome {
        display: flex;
        align-items: center;
        justify-content: center;
        height: 100vh;
        background: var(--bg-primary);
    }
    .card {
        background: var(--bg-secondary);
        border: 1px solid var(--border);
        border-radius: 12px;
        padding: 40px;
        min-width: 380px;
        text-align: center;
    }
    .title {
        font-size: 28px;
        color: var(--accent);
        margin-bottom: 4px;
    }
    .subtitle {
        color: var(--text-muted);
        margin-bottom: 32px;
        font-size: 14px;
    }
    .actions {
        display: flex;
        flex-direction: column;
        gap: 12px;
    }
    .form {
        display: flex;
        flex-direction: column;
        gap: 16px;
        text-align: left;
    }
    .form label {
        display: flex;
        flex-direction: column;
        gap: 4px;
    }
    .form label span {
        font-size: 12px;
        color: var(--text-secondary);
        text-transform: uppercase;
    }
    .form input {
        padding: 8px 12px;
        background: var(--bg-primary);
        border: 1px solid var(--border);
        border-radius: 6px;
        color: var(--text-primary);
        font-size: 13px;
        outline: none;
    }
    .form input:focus {
        border-color: var(--accent);
    }
    .form-actions {
        display: flex;
        gap: 8px;
        margin-top: 8px;
    }
    .btn {
        flex: 1;
        padding: 10px 16px;
        border: 1px solid var(--border);
        border-radius: 6px;
        background: var(--bg-surface);
        color: var(--text-primary);
        cursor: pointer;
        font-size: 14px;
    }
    .btn:hover {
        background: var(--bg-hover);
    }
    .btn.primary {
        background: var(--accent);
        color: var(--bg-primary);
        border-color: var(--accent);
        font-weight: 600;
    }
    .btn.primary:hover {
        background: var(--accent-hover);
    }
    .btn:disabled {
        opacity: 0.5;
        cursor: not-allowed;
    }
    .error {
        color: var(--error);
        font-size: 13px;
        margin-top: 16px;
    }
</style>
