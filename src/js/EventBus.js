// Create a singleton event bus
const subscribers = new Map();

export function subscribe(event, callback, fireImmediately, priority) {
    fireImmediately = fireImmediately ?? false;
    priority = priority ?? 0;
    if (!subscribers.has(event)) {
        subscribers.set(event, []);
    }
    const callbacks = subscribers.get(event);
    const data = { callback, priority };
    const findIdx = callbacks.findIndex(e => e.callback === callback);
    if (findIdx !== -1) {
        // If the callback is already registered, remove it first
        callbacks.splice(findIdx, 1);
    }
    callbacks.push(data);
    callbacks.sort((a, b) => b.priority - a.priority); // Sort by priority (higher first)

    if (fireImmediately) {
        callback();
    }

    // Return unsubscribe function
    return () => {
        const findIndex = callbacks.findIndex(e => e.callback === callback);
        if (findIndex !== -1) {
            callbacks.splice(findIndex, 1);
        }
        if (callbacks.size === 0) {
            subscribers.delete(event);
        }
    };
}

const eventQueue = [];

export function dispatch(event, detail) {
    eventQueue.push([event, detail]);
}

export function flushEvents() {
    for (const [event, detail] of eventQueue) {
        if (subscribers.has(event)) {
            subscribers.get(event).forEach(({ callback }) => {
                callback(detail);
            });
        }
    }
    eventQueue.length = 0;
}
