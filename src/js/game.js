import GameObject from "./gameObjs/GameObject";
import { InitInput } from "./Input";
import Scene from "./gameObjs/Scene";
import TextRenderer from "./components/TextRenderer";
import CharacterController from "./components/CharacterController";
import MenuController from "./components/MenuController";
import { subscribe } from "./eventBus";
import ToastHandler from "./components/ToastHandler";
import Config from "./Config";
import userData from "./data/UserData";
import { arrLast } from "./utils";
import HeroComponent from "./components/HeroComponent";

InitInput();

let menuScene;
let gameScene;

function makeMenuScene() {
    menuScene = new Scene();
    new GameObject("mc", menuScene).addComponent(MenuController);
    new GameObject("th", menuScene).addComponent(ToastHandler);
}

function makeGameScene() {
    gameScene = new Scene();
}

async function main() {
    makeMenuScene();
    makeGameScene();
    Scene.setActiveScene(menuScene);

    subscribe("scene:game", () => {
        const hero = arrLast(userData.data.chars);

        const char = new GameObject("char", gameScene);
        const heroComp = char.addComponent(HeroComponent).setId(hero.heroId);
        char.addComponent(TextRenderer).setText(heroComp.config.image).setQueue(Config.QUEUE_NPC);
        char.addComponent(CharacterController);
        Scene.setActiveScene(gameScene);
    })
}

main();
