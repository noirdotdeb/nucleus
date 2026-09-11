let currentInstance = null;
let cursor = 0;
let scheduleUpdate = null;
let pendingEffects = []; // NEW: Queue for effects waiting for the DOM to paint

export function beginComponentRender(vnode) {
    if (!vnode) throw new Error("A valid vnode must be provided to begin rendering.");
    vnode.hooks ??= [];
    currentInstance = vnode;
    cursor = 0;
}

export function endComponentRender() {
    currentInstance = null;
    cursor = 0;
}

export function registerUpdateScheduler(fn) {
    if (typeof fn !== 'function') {
        throw new TypeError("Update scheduler must be a function.");
    }
    scheduleUpdate = fn;
}

export function createState(initialValue) {
    if (!currentInstance) {
        throw new Error("createState can only be called inside a component's render execution.");
    }

    const instance = currentInstance;
    const slot = cursor++;

    if (slot === instance.hooks.length) {
        const value = typeof initialValue === 'function' ? initialValue() : initialValue;
        instance.hooks.push(value);
    }

    const getValue = () => instance.hooks[slot];

    const setValue = (newValue) => {
        const currentValue = instance.hooks[slot];
        const nextValue = typeof newValue === 'function' ? newValue(currentValue) : newValue;

        if (!Object.is(currentValue, nextValue)) {
            instance.hooks[slot] = nextValue;
            if (scheduleUpdate) {
                scheduleUpdate();
            }
        }
    };

    return [getValue, setValue];
}

// NEW: The Effect Hook
export function createEffect(callback, deps) {
    if (!currentInstance) throw new Error("createEffect must be called inside a component.");

    const instance = currentInstance;
    const slot = cursor++;

    const prevHook = instance.hooks[slot];
    const prevDeps = prevHook ? prevHook.deps : undefined;

    // Determine if we need to run the effect based on the dependency array
    let hasChanged = true;
    if (prevDeps && deps) {
        // If every item is exactly the same, nothing changed. Otherwise, it changed.
        hasChanged = deps.some((dep, i) => !Object.is(dep, prevDeps[i]));
    }

    // If there is no dependency array (runs every render), or if deps changed
    if (hasChanged || !prevDeps) {
        // Push to the queue to run AFTER the real DOM is updated
        pendingEffects.push(() => {
            // 1. Run the old cleanup function if it exists
            if (prevHook && typeof prevHook.cleanup === 'function') {
                prevHook.cleanup();
            }
            
            // 2. Run the new effect, and save whatever it returns as the new cleanup function
            const cleanup = callback();
            instance.hooks[slot] = { deps, cleanup };
        });
    } else {
        // Nothing changed, carry the old hook object forward
        instance.hooks[slot] = prevHook;
    }
}

// NEW: Called by render.js once the real HTML has been fully patched
export function flushEffects() {
    // Copy the queue and reset it immediately, in case an effect triggers another render
    const effectsToRun = pendingEffects;
    pendingEffects = [];
    effectsToRun.forEach(fn => fn());
}