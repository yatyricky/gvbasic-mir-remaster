<script>
    import userData from "../data/UserData";
    import { dispatch } from "../EventBus";

    const { close } = $props();

    /**
     *
     * @param {UnitId} klass
     */
    function createHero(klass) {
        userData.addChar(klass);
        close();
        dispatch("scene:game", null);
    }
</script>

<div>
    <button onclick={() => createHero("warr")}>战士</button>
    <button onclick={() => createHero("mage")} style="top: 100px">法师</button>
    <button onclick={() => createHero("wlk")} style="top: 200px">道士</button>
    <button
        onclick={close}
        style="top: 4px; right: 4px; width: 24px; height: 24px; left:auto; margin-top: auto;"
        >x</button
    >
</div>

<style>
    div {
        position: absolute;
        width: 94%;
        height: 94%;
        left: 3%;
        top: 3%;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
        background-color: silver;
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
