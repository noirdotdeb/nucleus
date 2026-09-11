import { createElement } from './core/createElement.js';

import { render } from './core/render.js';

function Welcome(props) {
    return createElement('h1', {}, [`Hello ${props.name}`]);
}

const appVNode = createElement(
    Welcome,
    { name: 'Nucleus' },
    []
);

render(appVNode, document.getElementById('app'));