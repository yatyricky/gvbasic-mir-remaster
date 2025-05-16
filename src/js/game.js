import GameObject from "./gameObjs/GameObject";
import { InitInput } from "./Input";
import Scene from "./gameObjs/Scene";
import TextRenderer from "./components/TextRenderer";
import CharacterController from "./components/CharacterController";
import MenuController from "./components/MenuController";
import { subscribe } from "./eventBus";
import ToastHandler from "./components/ToastHandler";
import Config from "./Config";

InitInput();

let menuScene;

function makeMenuScene() {
    menuScene = new Scene();
    Scene.setActiveScene(menuScene);

    new GameObject().addComponent(new TextRenderer("1.继续游戏").setQueue(Config. QUEUE_UI)).setPosition(2.5, 1);
    new GameObject().addComponent(new TextRenderer("2.新 游 戏").setQueue(Config.QUEUE_UI)).setPosition(2.5, 2);
    new GameObject().addComponent(new TextRenderer("3.加载存档").setQueue(Config.QUEUE_UI)).setPosition(2.5, 3);
    new GameObject().addComponent(new TextRenderer("▶").setQueue(Config.QUEUE_UI)).setPosition(1, 1).addComponent(new MenuController());

    new GameObject().addComponent(new ToastHandler());
}

async function main() {
    makeMenuScene();

    // const go = new GameObject("char");
    // go.addComponent(new TextRenderer("Hello World").setText("🥷").setQueue(2));
    // go.addComponent(new CharacterController());

    // const grass = new GameObject("grass");
    // grass.setPosition(1, 1);
    // grass.addComponent(new TextRenderer("░      ░🌳🌳🌳🌳  🌳▓        🌳🌳🌳🌳  🌳  🌳     ▚   🌳🌳                🌳🌳🌳🌳"));

    // const menu = new GameObject("menu");
    // menu.addComponent(new TextRenderer("Menu").setText("菜单").setQueue(10));
}

main();
