import { createElement } from './core/createElement.js';
import { render } from './core/render.js';

const heading = createElement('h1', {}, ['Hello']);

const paragraph = createElement('p', {}, ['Welcome to Nucleus']);

const appVNode = createElement('div', {}, [
    heading,
    paragraph
]);

render(appVNode, document.getElementById('app'));