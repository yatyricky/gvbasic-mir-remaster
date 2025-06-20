<script>
    import userData from "../../data/UserData";
    import { dispatch } from "../../EventBus";
    import { arrLast } from "../../Utils";
    import NewHeroModal from "./NewHeroModal.svelte";
    import LoadSavesModal from "./LoadSavesModal.svelte";

    function continueGame() {
        const last = arrLast(userData.data.chars);
        if (last == null) {
            dispatch("toast", "没有可使用的角色！");
        } else {
            dispatch("scene:game", userData.data.chars.length - 1);
        }
    }

    function newHero() {
        dispatch("modal:show", { component: NewHeroModal });
    }

    function loadSaves() {
        dispatch("modal:show", { component: LoadSavesModal });
    }
</script>

<div class="login-scene">
    <button class="btn" onclick={continueGame}>继续游戏</button>
    <button class="btn" onclick={newHero} style="top: 100px">新游戏</button>
    <button class="btn" onclick={loadSaves} style="top: 200px">加载存档</button>
</div>

<style>
    div {
        position: absolute;
        width: 100%;
        height: 100%;
    }

    button {
        position: absolute;
        left: 50%;
        transform: translateX(-50%);
        width: 200px;
        height: 50px;
        margin-top: 70px;
        background: none;
        font-size: 20px;
    }
    .btn {
        background-color: #680000;
        border-radius: 4px;
        padding: 0px;
        color: #ceae0f;
    }
    .login-scene {
        background-color: #403a36;
        box-shadow:
            inset 0 0 8px 4px #23201f;
    }
</style>
