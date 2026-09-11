import { createElement } from './core/createElement.js';
import { createState, createEffect } from './core/state.js';
import { render } from './core/render.js';

function ControlledInput() {
    const [getText, setText] = createState('Hello Nucleus');

    const handleInput = (e) => {
        setText(e.target.value);
    };

    return createElement('div', { class: 'input-demo', style: 'padding: 12px; border: 1px solid #30363d; border-radius: 6px; margin: 10px 0; background: #0d1117;' }, [
        createElement('p', {}, ['Live Input Reflection: ', createElement('strong', {}, [getText()])]),
        createElement('input', { 
            type: 'text', 
            value: getText(), 
            oninput: handleInput,
            style: 'padding: 8px 12px; background: #161b22; color: #c9d1d9; border: 1px solid #30363d; border-radius: 4px; width: 100%; box-sizing: border-box;' 
        }, [])
    ]);
}

function Timer() {
    const [getSeconds, setSeconds] = createState(0);

    createEffect(() => {
        const interval = setInterval(() => {
            setSeconds(prev => prev + 1);
        }, 1000);

        return () => {
            clearInterval(interval);
        };
    }, []);

    return createElement('div', { class: 'timer', style: 'padding: 10px; background: #161b22; color: #58a6ff; font-family: monospace; border-radius: 5px; width: fit-content; margin: 10px 0;' }, [
        createElement('strong', {}, ['Auto Timer: ']),
        createElement('span', {}, [`${getSeconds()}s`])
    ]);
}

function Counter({ label }) {
    const [getCount, setCount] = createState(0);
    const increment = () => setCount(prev => prev + 1);
    const decrement = () => setCount(prev => prev - 1);
    const reset = () => setCount(0);

    return createElement('div', { class: 'counter', style: 'border: 1px solid #30363d; padding: 10px; margin: 5px 0; background: #161b22; border-radius: 6px;' }, [
        createElement('strong', {}, [label]),
        createElement('span', {}, [` - Count: ${getCount()} `]),
        createElement('button', { onclick: increment }, ['+']),
        createElement('button', { onclick: decrement }, ['-']),
        createElement('button', { onclick: reset }, ['Reset'])
    ]);
}

function App() {
    const [getItems, setItems] = createState(['A', 'B', 'C']);
    const [getShowTimer, setShowTimer] = createState(true);

    const toggleTimer = () => setShowTimer(!getShowTimer());

    function removeMiddleItem() {
        const items = getItems();
        if (items.length > 1) {
            const newItems = items.filter((_, index) => index !== 1);
            setItems(newItems);
        }
    }

    return createElement('div', { class: 'app' }, [
        createElement('h1', {}, ['Nucleus UI']),
        
        createElement('h3', {}, ['1. Controlled Form Input']),
        createElement(ControlledInput, {}, []),

        createElement('h3', {}, ['2. Effect Hook (Lifecycle & Timer)']),
        createElement('button', { onclick: toggleTimer, style: 'margin-bottom: 10px;' }, ['Toggle Timer Component']),
        getShowTimer() && createElement(Timer, {}, []),
        
        createElement('hr', {}, []),

        createElement('h3', {}, ['3. Keyed List Rendering']),
        createElement('button', { onclick: removeMiddleItem }, ['Remove Middle Item']),
        
        createElement('div', { class: 'list' }, [
            getItems().map(item => 
                createElement(Counter, { key: item, label: `Counter ${item}` }, [])
            )
        ])
    ]);
}

render(createElement(App, {}, []), document.getElementById('app'));