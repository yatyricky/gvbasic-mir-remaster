import { Global } from "./Global";
import GameObject from "./gameObjs/GameObject";
import TextRenderer from "./components/TextRenderer";
import CharacterController from "./components/CharacterController";
import Const from "./Const";
import userData from "./data/UserData";
import { arrLast } from "./Utils";
import GameMenuController from "./components/gameui/GameMenuController";
import UnitComponent from "./components/UnitComponent";
import GameMap from "./components/GameMap";
import Collider from "./components/Collider";
import AnyaShop from "./components/gameui/AnyaShop";
import InspectItem from "./components/gameui/InspectItem";
import LoginPanel from "./ui/LoginPanel";

const domDebugPanels = document.getElementById('debugPanels');
if (!Global.debug) {
    domDebugPanels.style.display = "none";
}

/**
 * 
 * @param {GameObject} gameRoot 
 */
function initGameScene(gameRoot) {
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
    Global.domApp = document.getElementById('app');
    new LoginPanel("LoginPanel");
}

main();
