import Config from "./Config";
import GameObject from "./gameObjs/GameObject";
import KeyEvent from "./KeyEvent";
import SceneManager from "./SceneManager";

const domControls = document.getElementById('controls');
const l1 = document.getElementById('l1');
const l2 = document.getElementById('l2');
const c1 = document.getElementById('c1');
const c2 = document.getElementById('c2');
const btnU = document.getElementById('btn_up');
const btnD = document.getElementById('btn_down');
const btnL = document.getElementById('btn_left');
const btnR = document.getElementById('btn_right');
const btnA = document.getElementById('btn_a');
const btnB = document.getElementById('btn_b');
const btnX = document.getElementById('btn_x');
const btnY = document.getElementById('btn_y');

const cu = Math.round(Config.SIZE * 20 / 7);

c1.style.top = `${cu}px`;
c2.style.top = `${cu}px`;
c2.style.left = `${cu * 3}px`;

/**
 * 
 * @param {HTMLElement} dom 
 * @param {number} x 
 * @param {number} y 
 * @param {number} w 
 * @param {number} h 
 */
function setDOMRect(dom, x, y, w, h) {
    dom.style.left = `${x}px`;
    dom.style.top = `${y}px`;
    dom.style.width = `${w}px`;
    dom.style.height = `${h}px`;
}

setDOMRect(domControls, 0, 0, Config.SIZE * 20, cu * 4);
setDOMRect(l1, cu * 0, cu, cu * 3, cu);
setDOMRect(l2, cu * 1, 0, cu, cu * 3);
setDOMRect(btnU, cu * 1, 0, cu, cu);
setDOMRect(btnD, cu * 1, cu * 2, cu, cu);
setDOMRect(btnL, cu * 0, cu, cu, cu);
setDOMRect(btnR, cu * 2, cu, cu, cu);
setDOMRect(btnY, cu * 2, 0, cu, cu);
setDOMRect(btnA, cu * 2, cu * 2, cu, cu);
setDOMRect(btnX, cu, cu, cu, cu);
setDOMRect(btnB, cu * 3, cu, cu, cu);

function setupKeyboardControls() {
    /**@type {Record<string, HTMLElement>} */
    const keyMapping = {
        'ArrowUp': btnU,
        'ArrowDown': btnD,
        'ArrowLeft': btnL,
        'ArrowRight': btnR,
        'a': btnA,
        'b': btnB,
        'x': btnX,
        'y': btnY,
        'Escape': btnB,
        'Enter': btnA,
    };

    /**
     * Function to simulate button press/release
     * @param {HTMLElement} button - The button element to simulate
     * @param {boolean} isPressed - Whether the button is pressed or released
     */
    function simulateButtonEvent(button, isPressed) {
        if (!button) return;

        // Visual feedback
        if (isPressed) {
            button.style.opacity = '0.7';
        } else {
            button.style.opacity = '1.0';
        }

        // Create and dispatch appropriate event
        const eventType = isPressed ? 'mousedown' : 'mouseup';
        const event = new MouseEvent(eventType, {
            bubbles: true,
            cancelable: true,
            view: window
        });

        button.dispatchEvent(event);

        // Also dispatch click event on release
        if (!isPressed) {
            const clickEvent = new MouseEvent('click', {
                bubbles: true,
                cancelable: true,
                view: window
            });
            button.dispatchEvent(clickEvent);
        }
    }

    // Track currently pressed keys to avoid repeat events
    const pressedKeys = new Set();

    // Key down handler
    document.addEventListener('keydown', (e) => {
        const key = e.key;
        if (keyMapping[key] && !pressedKeys.has(key)) {
            pressedKeys.add(key);
            simulateButtonEvent(keyMapping[key], true);
            e.preventDefault(); // Prevent scrolling with arrow keys
        }
    });

    // Key up handler
    document.addEventListener('keyup', (e) => {
        const key = e.key;
        if (pressedKeys.has(key)) {
            pressedKeys.delete(key);
            simulateButtonEvent(keyMapping[key], false);
            e.preventDefault();
        }
    });

    // When window loses focus, reset all pressed keys
    window.addEventListener('blur', () => {
        pressedKeys.forEach(key => {
            simulateButtonEvent(keyMapping[key], false);
        });
        pressedKeys.clear();
    });
}

/**
 * 
 * @param {GameObject} root 
 * @param {KeyEvent} key 
 */
function dispatchInputEventRecursive(root, key) {
    if (!root.active || key.used) {
        return;
    }

    // Iterate through children in reverse order
    for (let i = root.children.length - 1; i >= 0; i--) {
        dispatchInputEventRecursive(root.children[i], key);
        if (key.used) {
            return;
        }
    }

    for (const [, comp] of root.getComponents().entries()) {
        comp.onInput(key);
        if (key.used) {
            return;
        }
    }
}

/**
 * 
 * @param {string} key 
 */
function dispatchInputEvent(key) {
    dispatchInputEventRecursive(SceneManager.activeScene, new KeyEvent(key));
}

btnU.onclick = () => {
    dispatchInputEvent('u');
};
btnD.onclick = () => {
    dispatchInputEvent('d');
};
btnL.onclick = () => {
    dispatchInputEvent('l');
};
btnR.onclick = () => {
    dispatchInputEvent('r');
};
btnA.onclick = () => {
    dispatchInputEvent('a');
};
btnB.onclick = () => {
    dispatchInputEvent('b');
};
btnX.onclick = () => {
    dispatchInputEvent('x');
};
btnY.onclick = () => {
    dispatchInputEvent('y');
};

export function InitInput() {
    setupKeyboardControls();
}
