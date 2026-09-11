import { createElement } from './core/createElement.js';
import { createState, createEffect } from './core/state.js'; 
import { render } from './core/render.js';


function Timer() {
    const [getSeconds, setSeconds] = createState(0);

    createEffect(() => {
        console.log("🟢 Timer Mounted! Starting interval.");
        
        const interval = setInterval(() => {
            setSeconds(prev => prev + 1);
        }, 1000);


        return () => {
            console.log("🔴 Timer Unmounted! Clearing interval.");
            clearInterval(interval);
        };
    }, []);

    return createElement('div', { class: 'timer', style: 'padding: 10px; background: #222; color: #0f0; font-family: monospace; border-radius: 5px; width: fit-content;' }, [
        createElement('strong', {}, ['Auto Timer: ']),
        createElement('span', {}, [`${getSeconds()}s`])
    ]);
}

function Counter({ label }) {
    const [getCount, setCount] = createState(0);
    const increment = () => setCount(getCount() + 1);
    const decrement = () => setCount(getCount() - 1);

    return createElement('div', { class: 'counter', style: 'border: 1px solid #ccc; padding: 10px; margin: 5px 0;' }, [
        createElement('strong', {}, [label]),
        createElement('span', {}, [` - Count: ${getCount()} `]),
        createElement('button', { onclick: increment }, ['+']),
        createElement('button', { onclick: decrement }, ['-'])
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
        
        createElement('h3', {}, ['1. The Effect Hook (Lifecycle)']),
        createElement('p', {}, ['Open your console to see Mount/Unmount logs!']),
        createElement('button', { onclick: toggleTimer, style: 'margin-bottom: 10px;' }, ['Toggle Timer Component']),
        
    
        getShowTimer() && createElement(Timer, {}, []),
        
        createElement('hr', {}, []),

        createElement('h3', {}, ['2. Keyed List Rendering']),
        createElement('button', { onclick: removeMiddleItem }, ['Remove Middle Item']),
        
        createElement('div', { class: 'list' }, [
            getItems().map(item => 
                createElement(Counter, { key: item, label: `Counter ${item}` }, [])
            )
        ])
    ]);
}

render(createElement(App, {}, []), document.getElementById('app'));