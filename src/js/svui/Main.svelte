<script>
    import LoginScene from "./LoginScene.svelte";
    import GameScene from "./GameScene.svelte";
    import ModalContainer from "./ModalContainer.svelte";
    import ToastContainer from "./ToastContainer.svelte";
    import { subscribe } from "../EventBus";

    let isLogin = true;

    subscribe("scene:game", () => {
        isLogin = false;
    });

    subscribe("scene:menu", () => {
        isLogin = true;
    });
</script>

{#if isLogin}
    <LoginScene />
{:else}
    <GameScene />
{/if}

<ModalContainer />
<ToastContainer />
