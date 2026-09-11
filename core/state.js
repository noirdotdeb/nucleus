let currentInstance = null;
let cursor = 0;
let scheduleUpdate = null;
let pendingEffects = []; 

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


export function createEffect(callback, deps) {
    if (!currentInstance) throw new Error("createEffect must be called inside a component.");

    const instance = currentInstance;
    const slot = cursor++;

    const prevHook = instance.hooks[slot];
    const prevDeps = prevHook ? prevHook.deps : undefined;

    
    let hasChanged = true;
    if (prevDeps && deps) {

        hasChanged = deps.some((dep, i) => !Object.is(dep, prevDeps[i]));
    }


    if (hasChanged || !prevDeps) {

        pendingEffects.push(() => {

            if (prevHook && typeof prevHook.cleanup === 'function') {
                prevHook.cleanup();
            }
            

            const cleanup = callback();
            instance.hooks[slot] = { deps, cleanup };
        });
    } else {

        instance.hooks[slot] = prevHook;
    }
}


export function flushEffects() {
   
    const effectsToRun = pendingEffects;
    pendingEffects = [];
    effectsToRun.forEach(fn => fn());
}