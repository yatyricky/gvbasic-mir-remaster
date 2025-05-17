// Create a singleton event bus
const subscribers = new Map();

export function subscribe(event, callback, fireImmediately = false) {
    if (!subscribers.has(event)) {
        subscribers.set(event, new Set());
    }
    const callbacks = subscribers.get(event);
    callbacks.add(callback);

    if (fireImmediately) {
        callback();
    }

    // Return unsubscribe function
    return () => {
        callbacks.delete(callback);
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
            subscribers.get(event).forEach(callback => {
                callback(detail);
            });
        }
    }
    eventQueue.length = 0;
}
