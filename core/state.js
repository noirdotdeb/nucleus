// Stores state values and notifies listeners when a value changes.
// This module does not know anything about the DOM.
// It only manages state and change notifications.

const subscriptions = new Map();

export function createState(initialValue) {
    // The value lives inside this function's closure.
    // It stays alive even after createState() finishes.
    let value = initialValue;

    // Function used to read the current value.
    const getValue = () => value;

    // Function used to change the value.
    const setValue = newValue => {
        // Support both direct values and updater functions.
        const nextValue =
            typeof newValue === 'function'
                ? newValue(value)
                : newValue;

        // Don't notify listeners if nothing actually changed.
        if (Object.is(value, nextValue)) {
            return;
        }

        value = nextValue;

        // Tell every subscriber that the state changed.
        subscriptions.get(getValue)?.forEach(listener => {
            listener(value);
        });
    };

    // Every state gets its own collection of listeners.
    subscriptions.set(getValue, new Set());

    return [getValue, setValue];
}


// Allows another part of Nucleus to react to state changes.
export function subscribe(getValue, listener) {
    const listeners = subscriptions.get(getValue);

    if (!listeners) {
        throw new Error('Cannot subscribe to unknown state.');
    }

    listeners.add(listener);

    // Return an unsubscribe function.
    return () => {
        listeners.delete(listener);
    };
}