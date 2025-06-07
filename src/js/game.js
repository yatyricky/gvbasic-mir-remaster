window.debug = true;
const domDebugPanels = document.getElementById('debugPanels');
if (!window.debug) {
    domDebugPanels.style.display = "none";
}
import GameObject from "./gameObjs/GameObject";
// import { InitInput } from "./Input";
import Scene from "./gameObjs/Scene";
import TextRenderer from "./components/TextRenderer";
import CharacterController from "./components/CharacterController";
import { subscribe } from "./EventBus";
import Const from "./Const";
import userData from "./data/UserData";
import { arrLast } from "./Utils";
import SceneManager from "./SceneManager";
import UnitComponent from "./components/UnitComponent";
import GameMap from "./components/GameMap";
import Collider from "./components/Collider";

import Main from "./svui/Main.svelte";
import { mount } from "svelte";

const domSvui = document.getElementById('svui');
domSvui.style.width = `${Const.SIZE * 20}px`;
domSvui.style.height = `${Const.SIZE * 20}px`;
mount(Main, { target: domSvui });

// InitInput();

let initedGameScene = false;

/**
 * 
 * @param {GameObject} gameRoot 
 */
function initGameScene(gameRoot) {
    if (initedGameScene) {
        return;
    }
    initedGameScene = true;

    const hero = arrLast(userData.data.chars);

    const char = new GameObject("hero", gameRoot).setPosition(5, 2);
    char.addComponent(Collider);
    const unitComp = char.addComponent(UnitComponent).initData(hero);
    char.addComponent(TextRenderer).setText(unitComp.config.image).setQueue(Const.QUEUE_NPC);
    char.addComponent(CharacterController);

    const gameMap = new GameObject("gameMap", gameRoot);
    gameMap.addComponent(GameMap);
}

function main() {
    const scene = new Scene("root");
    SceneManager.setActiveScene(scene);

    // general
    const gameScene = new GameObject("game");

    subscribe("scene:game", () => {
        gameScene.setActive(true);
        initGameScene(gameScene);
    })

    subscribe("scene:menu", () => {
        gameScene.setActive(false);
    })
}

main();
