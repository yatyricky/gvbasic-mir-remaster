import GameObject from "./gameObject";
import { InitInput } from "./Input";
import Scene from "./Scene";
import TextRenderer from "./TextRenderer";
import CharacterController from "./CharacterController";

InitInput();

async function main() {
    const menuScene = new Scene();
    Scene.setActiveScene(menuScene);

    const go = new GameObject("char");
    go.addComponent(new TextRenderer("Hello World").setText("🥷").setQueue(2));
    go.addComponent(new CharacterController());

    const grass = new GameObject("grass");
    grass.addComponent(new TextRenderer("      背包🌳🌳🌳🌳  🌳          🌳🌳🌳🌳  🌳  🌳          🌳🌳                🌳🌳🌳🌳"));

    const menu = new GameObject("menu");
    menu.addComponent(new TextRenderer("Menu").setText("菜单").setQueue(2));
}

main();
