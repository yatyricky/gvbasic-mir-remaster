export function setupKeyboardControls(btnU, btnD, btnL, btnR, btnA, btnB, btnX, btnY) {
    const keyMapping = {
        'ArrowUp': btnU,
        'ArrowDown': btnD,
        'ArrowLeft': btnL, 
        'ArrowRight': btnR,
        'a': btnA,
        'b': btnB,
        'x': btnX,
        'y': btnY,
    };

    // Function to simulate button press/release
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