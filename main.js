import { createElement } from './core/createElement.js';
import { createState } from './core/state.js';
import { render } from './core/render.js';

// Owns its own count via createState — this is the only part of the
// tree that changes when you click a button.
function Counter() {
    const [getCount, setCount] = createState(0);

    function increment() {
        setCount(getCount() + 1);
    }

    function decrement() {
        setCount(getCount() - 1);
    }

    return createElement('div', { class: 'counter' }, [
        createElement('h2', {}, ['Counter']),
        createElement('p', {}, [`Count: ${getCount()}`]),
        createElement('button', { onclick: increment }, ['+']),
        createElement('button', { onclick: decrement }, ['-'])
    ]);
}

// Deliberately has nothing to do with the counter's state. Its output
// is identical every render, so diffing it should never touch the DOM
// — this is what you'll use to prove nodes survive an update.
function UnaffectedSection() {
    return createElement('div', { class: 'unaffected' }, [
        createElement('h2', {}, ['This section never changes']),
        createElement('p', { id: 'unaffected-paragraph' }, [
            'If Nucleus is working, this exact DOM node survives every counter click.'
        ])
    ]);
}

function App() {
    return createElement('div', { class: 'app' }, [
        createElement('h1', {}, ['Nucleus']),
        createElement(Counter, {}, []),
        createElement(UnaffectedSection, {}, [])
    ]);
}

render(createElement(App, {}, []), document.getElementById('app'));