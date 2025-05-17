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
import HeroComponent from "./components/HeroComponent";
import SceneManager from "./SceneManager";
import GameMenuController from "./components/GameMenuController";

InitInput();

/**@type {Scene} */
let menuScene;
/**@type {Scene} */
let gameScene;

function makeMenuScene() {
    menuScene = new Scene("menu");
    new GameObject("mc", menuScene).addComponent(MenuController);
    new GameObject("th", menuScene).addComponent(ToastHandler);
}

function makeGameScene() {
    gameScene = new Scene("game");
}

function initGameScene() {
    const hero = arrLast(userData.data.chars);

    const char = new GameObject("char", gameScene);
    const heroComp = char.addComponent(HeroComponent).setId(hero.heroId);
    char.addComponent(TextRenderer).setText(heroComp.config.image).setQueue(Config.QUEUE_NPC);
    char.addComponent(CharacterController);

    const gameMenu = new GameObject("gameMenu", gameScene);
    gameMenu.addComponent(GameMenuController);
}

function main() {
    makeMenuScene();
    makeGameScene();
    SceneManager.setActiveScene(menuScene);

    subscribe("scene:game", () => {
        initGameScene();
        SceneManager.setActiveScene(gameScene);
    })
}

main();
