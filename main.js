import { createElement } from './core/createElement.js';
import { createState } from './core/state.js';
import { render } from './core/render.js';

function Counter({ label }) {
    const [getCount, setCount] = createState(0);

    function increment() {
        setCount(getCount() + 1);
    }

    function decrement() {
        setCount(getCount() - 1);
    }

    return createElement('div', { class: 'counter', style: 'border: 1px solid #ccc; padding: 10px; margin: 5px 0;' }, [
        createElement('strong', {}, [label]),
        createElement('span', {}, [` - Count: ${getCount()} `]),
        createElement('button', { onclick: increment }, ['+']),
        createElement('button', { onclick: decrement }, ['-'])
    ]);
}

function App() {
    
    const [getItems, setItems] = createState(['A', 'B', 'C']);
    
    
    const [getShowWarning, setShowWarning] = createState(true);

    function toggleWarning() {
        setShowWarning(!getShowWarning());
    }

    function removeMiddleItem() {
        const items = getItems();
        if (items.length > 1) {
    
            const newItems = items.filter((_, index) => index !== 1);
            setItems(newItems);
        }
    }

    return createElement('div', { class: 'app' }, [
        createElement('h1', {}, ['Nucleus UI']),
        
        createElement('h3', {}, ['1. Conditional Rendering']),
        createElement('button', { onclick: toggleWarning }, ['Toggle Warning']),
        
        getShowWarning() && createElement('p', { style: 'color: red;' }, [
            'Warning: This element can be completely unmounted.'
        ]),
        
        createElement('hr', {}, []),

        createElement('h3', {}, ['2. List Rendering (The Bug)']),
        createElement('button', { onclick: removeMiddleItem }, ['Remove Middle Item']),
        
        
        createElement('div', { class: 'list' }, [
            getItems().map(item => createElement(Counter, { label: `Counter ${item}` }, []))
        ])
    ]);
}

render(createElement(App, {}, []), document.getElementById('app'));