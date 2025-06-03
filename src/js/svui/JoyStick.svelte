<script>
    import { onMount } from "svelte";
    import Const from "../Const";
    import KeyEvent from "../KeyEvent";
    import SceneManager from "../SceneManager";

    let btnU = $state(null);
    let btnD = $state(null);
    let btnL = $state(null);
    let btnR = $state(null);

    function setupKeyboardControls() {
        /**@type {Record<string, HTMLElement>} */
        const keyMapping = {
            ArrowUp: btnU,
            ArrowDown: btnD,
            ArrowLeft: btnL,
            ArrowRight: btnR,
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
                button.style.opacity = "0.7";
            } else {
                button.style.opacity = "1.0";
            }

            // Create and dispatch appropriate event
            const eventType = isPressed ? "mousedown" : "mouseup";
            const event = new MouseEvent(eventType, {
                bubbles: true,
                cancelable: true,
                view: window,
            });

            button.dispatchEvent(event);

            // Also dispatch click event on release
            if (!isPressed) {
                const clickEvent = new MouseEvent("click", {
                    bubbles: true,
                    cancelable: true,
                    view: window,
                });
                button.dispatchEvent(clickEvent);
            }
        }

        // Track currently pressed keys to avoid repeat events
        const pressedKeys = new Set();

        // Key down handler
        document.addEventListener("keydown", (e) => {
            const key = e.key;
            if (keyMapping[key] && !pressedKeys.has(key)) {
                pressedKeys.add(key);
                simulateButtonEvent(keyMapping[key], true);
                e.preventDefault(); // Prevent scrolling with arrow keys
            }
        });

        // Key up handler
        document.addEventListener("keyup", (e) => {
            const key = e.key;
            if (pressedKeys.has(key)) {
                pressedKeys.delete(key);
                simulateButtonEvent(keyMapping[key], false);
                e.preventDefault();
            }
        });

        // When window loses focus, reset all pressed keys
        window.addEventListener("blur", () => {
            pressedKeys.forEach((key) => {
                simulateButtonEvent(keyMapping[key], false);
            });
            pressedKeys.clear();
        });
    }

    /**
     *
     * @param {any} root
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

        for (const comp of root.getComponents()) {
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
        dispatchInputEventRecursive(
            SceneManager.activeScene,
            new KeyEvent(key),
        );
    }

    onMount(() => {
        setupKeyboardControls();
    });
</script>

<div>
    <button
        bind:this={btnU}
        onclick={() => dispatchInputEvent("u")}
        style={`left: ${Const.SIZE2 * 8}px; top: ${Const.SIZE2 * 8}px;`}
        >↑</button
    >
    <button
        bind:this={btnL}
        onclick={() => dispatchInputEvent("l")}
        style={`left: ${Const.SIZE2 * 7}px; top: ${Const.SIZE2 * 9}px;`}
        >←</button
    >
    <button
        bind:this={btnD}
        onclick={() => dispatchInputEvent("d")}
        style={`left: ${Const.SIZE2 * 8}px; top: ${Const.SIZE2 * 9}px;`}
        >↓</button
    >
    <button
        bind:this={btnR}
        onclick={() => dispatchInputEvent("r")}
        style={`left: ${Const.SIZE2 * 9}px; top: ${Const.SIZE2 * 9}px;`}
        >→</button
    >
</div>

<style>
    button {
        position: absolute;
        width: 40px;
        height: 40px;
        background: none;
    }
</style>
