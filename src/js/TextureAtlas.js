import { Texture, Sprite, Rectangle, Spritesheet, Assets, SCALE_MODES } from 'pixi.js';

export default class TextureAtlas {
    static async loadAtlas(imagePath) {
        // Create the SpriteSheet from data and image
        const baseTexture = await Assets.load(imagePath);
        baseTexture.source.scaleMode = "nearest"; // NEAREST
        const spritesheet = new Spritesheet(
            baseTexture,
            {
                frames: {
                    warrior: {
                        frame: { x: 12 * 16, y: 0, w: 16, h: 16 },
                        sourceSize: { w: 16, h: 16 },
                        spriteSourceSize: { x: 0, y: 0, w: 16, h: 16 }
                    },
                },
                meta: {
                    image: 'images/spritesheet.png',
                    format: 'RGBA8888',
                    size: { w: 320, h: 128 },
                    scale: 1
                },
                animations: {
                }
            }
        );

        // Generate all the Textures asynchronously
        await spritesheet.parse();
        return new TextureAtlas(spritesheet);
    }

    /**
     * 
     * @param {Spritesheet} spriteSheet 
     */
    constructor(spriteSheet) {
        this.spriteSheet = spriteSheet;
    }

    createSprite(name) {
        const frame = this.spriteSheet.textures[name];
        if (!frame) {
            throw new Error(`Texture "${name}" not found in the atlas.`);
        }

        return new Sprite(frame);
    }
}