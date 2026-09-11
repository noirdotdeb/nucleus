let currentInstance = null;
let cursor = 0;
let scheduleUpdate = null;

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
    const slot = cursor++; // Concise post-increment

   
    if (slot === instance.hooks.length) {
       
        const value = typeof initialValue === 'function' ? initialValue() : initialValue;
        instance.hooks.push(value);
    }

    
    const getValue = () => instance.hooks[slot];

    
    const setValue = (newValue) => {
        const currentValue = instance.hooks[slot];

    
        const nextValue = typeof newValue === 'function' 
            ? newValue(currentValue) 
            : newValue;

        if (!Object.is(currentValue, nextValue)) {
            instance.hooks[slot] = nextValue;

            if (scheduleUpdate) {
                scheduleUpdate();
            }
        }
    };

    return [getValue, setValue];
}