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
import Const from "./Const";
import userData from "./data/UserData";
import { arrLast } from "./Utils";
import SceneManager from "./SceneManager";
import GameMenuController from "./components/gameui/GameMenuController";
import UnitComponent from "./components/UnitComponent";
import GameMap from "./components/GameMap";
import Collider from "./components/Collider";
import AnyaShop from "./components/gameui/AnyaShop";
import InspectItem from "./components/gameui/InspectItem";
import UIManager from "./components/UIManager";

InitInput();

/**
 * 
 * @param {GameObject} gameRoot 
 */
function initGameScene(gameRoot) {
    const uiManager = new GameObject("uiManager", gameRoot);
    uiManager.addComponent(UIManager);

    const hero = arrLast(userData.data.chars);

    const char = new GameObject("hero", gameRoot).setPosition(5, 2);
    char.addComponent(Collider);
    const unitComp = char.addComponent(UnitComponent).initData(hero);
    char.addComponent(TextRenderer).setText(unitComp.config.image).setQueue(Const.QUEUE_NPC);
    char.addComponent(CharacterController);

    const gameMap = new GameObject("gameMap", gameRoot);
    gameMap.addComponent(GameMap);

    const gameMenu = new GameObject("gameMenu", gameRoot);
    gameMenu.addComponent(GameMenuController);
    const anyaShop = new GameObject("anyaShop", gameRoot);
    anyaShop.addComponent(AnyaShop);

    const inspectItem = new GameObject("inspectItem", gameRoot);
    inspectItem.addComponent(InspectItem);
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
