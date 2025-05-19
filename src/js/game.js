window.debug = true;
const domDebugPanels = document.getElementById('debugPanels');
if (!window.debug) {
    domDebugPanels.style.display = "none";
}
import GameObject from "./gameObjs/GameObject";
import { InitInput } from "./Input";
import Scene from "./gameObjs/Scene";
import TextRenderer from "./components/TextRenderer";
import CharacterController from "./components/CharacterController";
import MenuController from "./components/MenuController";
import { subscribe } from "./EventBus";
import ToastHandler from "./components/ToastHandler";
import Config from "./Config";
import userData from "./data/UserData";
import { arrLast } from "./Utils";
import SceneManager from "./SceneManager";
import GameMenuController from "./components/gameui/GameMenuController";
import UnitComponent from "./components/UnitComponent";

InitInput();

/**
 * 
 * @param {GameObject} gameRoot 
 */
function initGameScene(gameRoot) {
    const hero = arrLast(userData.data.chars);

    const char = new GameObject("hero", gameRoot);
    // char.addComponent(HeroComponent);
    const unitComp = char.addComponent(UnitComponent).initData(hero);
    char.addComponent(TextRenderer).setText(unitComp.config.image).setQueue(Config.QUEUE_NPC);
    char.addComponent(CharacterController);

    const gameMenu = new GameObject("gameMenu", gameRoot);
    gameMenu.addComponent(GameMenuController);
}

function main() {
    const scene = new Scene("root");
    SceneManager.setActiveScene(scene);

    // general
    new GameObject("toast", scene).addComponent(ToastHandler);
    const loginScene = new GameObject("login", scene);
    const gameScene = new GameObject("game");

    // login
    new GameObject("mainMenu", loginScene).addComponent(MenuController);

    subscribe("scene:game", () => {
        loginScene.setActive(false);
        gameScene.setActive(true);
        if (gameScene.find("gameMenu") == null) {
            initGameScene(gameScene);
        }
    })

    subscribe("scene:menu", () => {
        gameScene.setActive(false);
        loginScene.setActive(true);
    })
}

main();
