import { createElement } from './core/createElement.js';
import { render } from './core/render.js';
import { createState, subscribe } from './core/state.js';
import { diff } from './core/diff.js';

const app = document.getElementById('app');

const [getCount, setCount] = createState(0);


// Component
function Counter() {
    return createElement('div', { class: 'counter' }, [

        createElement('h1', {}, [
            `Count: ${getCount()}`
        ]),

        createElement('button', {}, [
            'Increment'
        ])

    ]);
}


// Keep the currently rendered vnode.
let currentVNode = Counter();

// Initial render.
render(currentVNode, app);


// When state changes:
//
// 1. Create the new vnode.
// 2. Compare it with the old vnode.
// 3. Update only what changed.
// 4. Save the new vnode.
subscribe(getCount, () => {
    const newVNode = Counter();

    diff(currentVNode, newVNode, app.firstChild);

    currentVNode = newVNode;
});