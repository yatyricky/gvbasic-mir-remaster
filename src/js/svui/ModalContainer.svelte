<script>
    import { subscribe } from "../EventBus";

    const modals = $state([]);
    let sn = 0;

    /**
     *
     * @param {number} id
     */
    function closeModal(id) {
        const index = modals.findIndex((m) => m.id === id);
        if (index !== -1) {
            modals.splice(index, 1);
        }
    }

    /**
     *
     * @param {any} comp
     */
    function closeByComponent(comp) {
        const index = modals.findIndex((m) => m.component === comp);
        if (index !== -1) {
            modals.splice(index, 1);
        }
    }

    subscribe("modal:show", (data) => {
        const index = modals.findIndex((m) => m.component === data.component);
        if (index !== -1) {
            // 如果已经存在，则不再添加
            for (let i = index; i < modals.length - 1; i++) {
                let swap = modals[i];
                modals[i] = modals[i + 1];
                modals[i + 1] = swap;
            }
            return;
        }

        const id = ++sn;
        modals.push({
            ...data,
            id,
            close: () => {
                closeModal(id);
            },
        });
    });

    subscribe("modal:close", (comp) => {
        closeByComponent(comp);
    });
</script>

<div class="modal-container">
    {#each modals as modal (modal.id)}
        <modal.component {...modal.props} close={modal.close} />
    {/each}
</div>
