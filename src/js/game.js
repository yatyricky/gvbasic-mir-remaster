import { Application, Assets, Sprite, Texture } from "pixi.js";
import DynamicText, { loadCustomFont } from "./DynamicText";
import TextureAtlas from "./TextureAtlas";

const LOGIC_WIDTH = 160;
const LOGIC_HEIGHT = 80;
const RENDER_SCALE = 5;

(async () => {
    await loadCustomFont();

    const app = new Application();
    await app.init({
        width: LOGIC_WIDTH,
        height: LOGIC_HEIGHT,
        backgroundColor: 0x88A299,
        resolution: RENDER_SCALE,
    });
    document.body.appendChild(app.canvas);

    // Example 1: Using the custom pixel text function
    const textDisplay = new DynamicText('   Hello Pixi!并且我持续溢出我看看会发身份什么\n第二行中文\n第三行中文再次溢.出土发生什么事情呢', 0, -8);
    app.stage.addChild(textDisplay.container);


    // Load the bunny texture.
    const atlas = await TextureAtlas.loadAtlas('./assets/sprites/1bit_fantasy_pyairvander.png');
    const sprite = atlas.createSprite('warrior');

    // Add to stage
    app.stage.addChild(sprite);
})();


async function waitForSeconds(seconds) {
    return new Promise((resolve) => {
        setTimeout(resolve, seconds * 1000);
    });
}
