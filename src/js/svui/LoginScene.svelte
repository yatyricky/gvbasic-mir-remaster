<script>
    import userData from "../data/UserData";
    import { dispatch } from "../EventBus";
    import { arrLast } from "../Utils";
    import NewHeroModal from "./NewHeroModal.svelte";

    function continueGame() {
        const last = arrLast(userData.data.chars);
        if (last == null) {
            dispatch("toast", "没有可使用的角色！");
        } else {
            dispatch("scene:game", null);
        }
    }

    function newHero() {
        dispatch("modal:show", { component: NewHeroModal });
    }
</script>

<div>
    <button onclick={continueGame}>继续游戏</button>
    <button onclick={newHero} style="top: 100px">新游戏</button>
    <button style="top: 200px">加载存档</button>
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
</style>
