window.debug = false;
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
import SceneManager from "./SceneManager";
import UnitComponent from "./components/UnitComponent";
import GameMap from "./components/GameMap";
import Collider from "./components/Collider";

import Main from "./svui/Main.svelte";
import { mount } from "svelte";

const topWrapper = document.getElementById('top-wrapper');
topWrapper.style.transform = `scale(${Math.min(1, window.innerWidth / 400)})`;
topWrapper.style.transformOrigin = "top center";

const domSvui = document.getElementById('svui');
mount(Main, { target: domSvui });

let initedGameScene = false;

/**
 * 
 * @param {GameObject} gameRoot 
 * @param {number} charIndex
 */
function initGameScene(gameRoot, charIndex) {
    if (initedGameScene) {
        return;
    }
    initedGameScene = true;

    const hero = userData.data.chars[charIndex];

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

    subscribe("scene:game", (charIndex) => {
        gameScene.setActive(true);
        initGameScene(gameScene, charIndex);
    })

    subscribe("scene:menu", () => {
        gameScene.setActive(false);
    })
}

main();
