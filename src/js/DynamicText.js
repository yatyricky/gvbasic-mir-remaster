import { Container, Text } from 'pixi.js';

const GAME_FONT = 'VonwaonBitmap';

export default class DynamicText {
    constructor(text, x = 0, y = 0, options = {}) {
        this.container = new Container();
        this.container.position.set(x, y);

        this.options = {
            fontSize: 15,
            lineHeight: 16,
            charWidth: 16,
            letterSpacing: 0,
            fill: 0x262C2C,
            fontFamily: GAME_FONT,
            maxWidth: 160, // Default to LOGIC_WIDTH
            maxHeight: 96, // Default to LOGIC_HEIGHT
            ...options
        };

        // Character prototype cache - store one instance of each character
        this.charPrototypes = new Map();

        // Instance pool - reuse Text instances
        this.charPool = [];

        // Current text data
        this.currentText = '';
        this.activeChars = 0; // Count of active characters
        this.setText(text);
    }

    _getCharPrototype(char) {
        if (!this.charPrototypes.has(char)) {
            // Create new character prototype if not in cache
            const charStyle = {
                fontFamily: this.options.fontFamily,
                fontSize: this.options.fontSize,
                fill: this.options.fill
            };
            this.charPrototypes.set(char, charStyle);
        }

        return this.charPrototypes.get(char);
    }

    _getCharInstance() {
        // Get a character instance from the pool or create a new one
        if (this.activeChars < this.charPool.length) {
            // Reuse an existing instance
            return this.charPool[this.activeChars++];
        } else {
            // Create a new instance
            const charObj = new Text({
                text: '',
                style: {
                    fontFamily: this.options.fontFamily,
                    fontSize: this.options.fontSize,
                    fill: this.options.fill
                }
            });
            this.container.addChild(charObj);
            this.charPool.push(charObj);
            this.activeChars++;
            return charObj;
        }
    }

    setText(text) {
        // Reset active character count
        this.activeChars = 0;

        // Hide all character instances
        this.charPool.forEach(char => {
            char.visible = false;
        });

        this.currentText = text;

        let lineIndex = 0;
        let charIndex = 0;

        // Process each character
        for (let i = 0; i < text.length; i++) {
            const char = text[i];

            // Handle newlines
            if (char === '\n') {
                lineIndex++;
                charIndex = 0;
                continue;
            }

            // Determine if character is full-width (CJK)
            const charOccupy = char.charCodeAt(0) > 255 ? 2 : 1;

            // Handle line wrapping
            if (charIndex + charOccupy > this.options.maxWidth / (this.options.charWidth / 2)) {
                lineIndex++;
                charIndex = 0;
            }

            // Break if exceeding vertical space
            if (lineIndex >= this.options.maxHeight / this.options.lineHeight) {
                break;
            }

            // Get a character instance from the pool
            const charObj = this._getCharInstance();

            // Set character text and style from prototype
            charObj.text = char;
            const charStyle = this._getCharPrototype(char);
            charObj.style.fill = charStyle.fill;

            // Position the character
            charObj.position.set(
                charIndex * (this.options.charWidth / 2 + this.options.letterSpacing),
                lineIndex * this.options.lineHeight
            );

            // Make the character visible
            charObj.visible = true;

            // Increment character index
            charIndex += charOccupy;
        }
    }

    setColor(color) {
        this.options.fill = color;

        // Update all character prototypes
        for (const charStyle of this.charPrototypes.values()) {
            charStyle.fill = color;
        }

        // Update all visible character instances
        for (let i = 0; i < this.activeChars; i++) {
            this.charPool[i].style.fill = color;
        }
    }

    setPosition(x, y) {
        this.container.position.set(x, y);
    }
}

/**
 * Loads the custom font using FontFace API
 */
export async function loadCustomFont() {
    // Create @font-face style
    const style = document.createElement('style');
    style.textContent = `
        @font-face {
            font-family: "${GAME_FONT}";
            src: url("./assets/fonts/VonwaonBitmap-16px.ttf") format("truetype");
            font-weight: normal;
            font-style: normal;
        }
    `;
    document.head.appendChild(style);

    // Use FontFace API to load and activate the font
    try {
        const font = new FontFace(GAME_FONT, `url(./assets/fonts/VonwaonBitmap-16px.ttf)`);
        const loadedFont = await font.load();
        document.fonts.add(loadedFont);
        console.log("Custom font loaded successfully");

        // Ensure the font is ready before rendering text
        await document.fonts.ready;
    } catch (error) {
        console.error("Failed to load custom font:", error);
        // Continue anyway with fallback fonts
    }
}
