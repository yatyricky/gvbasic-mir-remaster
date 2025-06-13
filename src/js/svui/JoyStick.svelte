<script>
    import { onMount } from "svelte";
    import Const from "../Const";
    import KeyEvent from "../KeyEvent";
    import SceneManager from "../SceneManager";
    import { dispatch } from "../EventBus";

    let btnU = $state(null);
    let btnD = $state(null);
    let btnL = $state(null);
    let btnR = $state(null);
    let btnEsc = $state(null);
    let btnEnter = $state(null);

    function setupKeyboardControls() {
        /**@type {Record<string, HTMLElement>} */
        const keyMapping = {
            ArrowUp: btnU,
            ArrowDown: btnD,
            ArrowLeft: btnL,
            ArrowRight: btnR,
            Escape: btnEsc, // Use a virtual button for Escape
            Enter: btnEnter, // Use a virtual button for Enter
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
        dispatchInputEventRecursive(SceneManager.activeScene, new KeyEvent(key));
        dispatch("key:click", new KeyEvent(key));
    }

    onMount(() => {
        setupKeyboardControls();
    });
</script>

<div>
    <button
        bind:this={btnU}
        class="btn-arrow"
        onclick={() => dispatchInputEvent("u")}
        style={`left: ${40 * 8}px; top: ${40 * 8}px;`}>↑</button
    >
    <button
        bind:this={btnL}
        class="btn-arrow"
        onclick={() => dispatchInputEvent("l")}
        style={`left: ${40 * 7}px; top: ${40 * 9}px;`}>←</button
    >
    <button
        bind:this={btnD}
        class="btn-arrow"
        onclick={() => dispatchInputEvent("d")}
        style={`left: ${40 * 8}px; top: ${40 * 9}px;`}>↓</button
    >
    <button
        bind:this={btnR}
        class="btn-arrow"
        onclick={() => dispatchInputEvent("r")}
        style={`left: ${40 * 9}px; top: ${40 * 9}px;`}>→</button
    >
    <button bind:this={btnEsc} class="btn-hidden" onclick={() => dispatchInputEvent("esc")}>Escape</button>
    <button bind:this={btnEnter} class="btn-hidden" onclick={() => dispatchInputEvent("enter")}>Escape</button>
</div>

<style>
    .btn-arrow {
        position: absolute;
        width: 40px;
        height: 40px;
        background: none;
    }
    .btn-hidden {
        display: none;
    }
</style>
