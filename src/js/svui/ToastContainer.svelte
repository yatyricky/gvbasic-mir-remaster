<script>
    import { subscribe } from "../EventBus";

    const toasts = $state([]);
    let sn = 0;

    /**
     * @param {number} id
     */
    function closeToast(id) {
        const index = toasts.findIndex((m) => m.id === id);
        if (index !== -1) {
            toasts.splice(index, 1);
        }
    }

    subscribe("toast", (data) => {
        const id = ++sn;
        toasts.push({
            data,
            id,
        });
        setTimeout(() => {
            closeToast(id);
        }, 800); // Auto-close after 3 seconds
    });
</script>

<div class="toast-container">
    {#each toasts as modal (modal.id)}
        <div class="toast">
            <span>{modal.data}</span>
        </div>
    {/each}
</div>

<style>
    .toast-container {
        position: absolute;
        top: 5px;
        width: 100%;
        display: flex;
        justify-content: center;
    }
    .toast {
        background: rgba(35, 35, 35, 0.7);
        color: white;
        padding: 10px 20px;
        border-radius: 5px;
        margin: 5px;
        transition: opacity 0.3s ease-in-out;
        opacity: 1;
    }
</style>
