<script>
    import LoginScene from "./login/LoginScene.svelte";
    import GameScene from "./game/GameScene.svelte";
    import ModalContainer from "./ModalContainer.svelte";
    import ToastContainer from "./ToastContainer.svelte";
    import DebugContainer from "./DebugContainer.svelte";
    import { subscribe } from "../EventBus";

    let isLogin = true;

    subscribe("scene:game", (charIndex) => {
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

{#if true}
    <DebugContainer />
{/if}
