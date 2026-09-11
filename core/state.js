// Nucleus's reactivity system uses the same trick React's original
// Hooks implementation used: instead of attaching state to a specific
// "component instance" object (Nucleus doesn't have those), we keep
// ONE flat array of state slots and walk through it in the same order
// every time a render pass happens.
//
// This only works because every render pass calls createState() in
// exactly the same order — the same components, in the same sequence,
// calling createState() the same number of times. That's why real
// React has the "only call hooks at the top level, never inside an
// if/loop" rule — it's the same rule here, for the same reason.

// Every value ever created with createState() lives here, in call
// order. Slot 0 is whichever createState() call happens first during
// a render pass, slot 1 is the second call, and so on.
const stateSlots = [];

// Which slot the NEXT createState() call should read/write.
// Reset to 0 at the start of every full render pass by resetCursor().
let cursor = 0;

// render.js registers itself here at mount time, so createState()'s
// setValue() can ask for a re-render without state.js needing to
// import render.js directly. That would create a SECOND circular
// import on top of the render.js <-> diff.js one already in this
// project — this callback approach avoids that, and keeps state.js
// from needing to know anything about rendering or the DOM at all.
let scheduleUpdate = null;

export function registerUpdateScheduler(fn) {
    scheduleUpdate = fn;
}

// Called once by render.js right before it starts walking the vnode
// tree — both on the very first mount, and on every state-driven
// update — so slot 0 lines up with the first createState() call again.
export function resetCursor() {
    cursor = 0;
}

export function createState(initialValue) {
    const slot = cursor;
    cursor++;

    // First time this slot is ever touched (the initial mount), seed
    // it with the starting value. On every later render pass, `slot`
    // will already be within stateSlots' length, so this is skipped
    // and the existing value is kept.
    if (slot === stateSlots.length) {
        stateSlots.push(initialValue);
    }

    const getValue = () => stateSlots[slot];

    const setValue = (newValue) => {
        stateSlots[slot] = newValue;

        // Ask render.js to regenerate the vnode tree and diff it,
        // instead of state.js reaching into the DOM itself.
        if (scheduleUpdate) {
            scheduleUpdate();
        }
    };

    return [getValue, setValue];
}