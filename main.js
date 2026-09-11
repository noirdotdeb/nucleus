import { createElement } from './core/createElement.js';
import { createState } from './core/state.js';
import { render } from './core/render.js';

const Counter = ({ label }) => {
    const [getCount, setCount] = createState(0);

    const increment = () => setCount(prev => prev + 1);
    const decrement = () => setCount(prev => prev - 1);

    return createElement('div', { class: 'counter' }, [
        createElement('h2', {}, [label]),
        createElement('p', {}, [`Count: ${getCount()}`]),
        createElement('button', { onclick: increment }, ['+']),
        createElement('button', { onclick: decrement }, ['-'])
    ]);
};

const UnaffectedSection = () => createElement('div', { class: 'unaffected' }, [
    createElement('h2', {}, ['This section never changes']),
    createElement('p', { id: 'unaffected-paragraph' }, [
        'If Nucleus is working, this exact DOM node survives every counter click.'
    ])
]);

const App = () => createElement('div', { class: 'app' }, [
    createElement('h1', {}, ['Nucleus']),
    createElement(Counter, { label: 'Counter A' }, []),
    createElement(Counter, { label: 'Counter B' }, []),
    createElement(UnaffectedSection, {}, [])
]);

render(createElement(App, {}, []), document.getElementById('app'));