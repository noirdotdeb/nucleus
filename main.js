import { createElement } from './core/createElement.js';
import { render } from './core/render.js';

const h1_tag  = createElement ('h1', {}, ['Hello']);

console.log(h1_tag);

render(h1_tag, document.getElementById('app'));