// This file manages user input, capturing keyboard and mouse events to control the game.

import { canvas } from "./canvas";
import { dispatch } from "./eventBus";

const input = {
    keys: {},
    mouse: {
        x: 0,
        y: 0,
        leftButton: false,
    },

    init() {
        window.addEventListener('keydown', (event) => {
            this.keys[event.code] = true;
        });

        window.addEventListener('keyup', (event) => {
            this.keys[event.code] = false;
            dispatch('keyUp', { key: event.code });
        });

        window.addEventListener('mousemove', (event) => {
            const rect = canvas.getBoundingClientRect();
            this.mouse.x = event.clientX - rect.left;
            this.mouse.y = event.clientY - rect.top;
        });

        window.addEventListener('mousedown', (event) => {
            if (event.button === 0) { // Left mouse button
                this.mouse.leftButton = true;
            }
        });

        window.addEventListener('mouseup', (event) => {
            if (event.button === 0) { // Left mouse button
                this.mouse.leftButton = false;
            }
        });
    },

    isKeyPressed(key) {
        return this.keys[key] === true;
    },

    isMouseButtonPressed() {
        return this.mouse.leftButton;
    },

    getMousePosition() {
        return { x: this.mouse.x, y: this.mouse.y };
    },
};

export default input;