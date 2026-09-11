import { registerUpdateScheduler, beginComponentRender, endComponentRender, flushEffects } from './state.js';
import { diff } from './diff.js';

export const isEventProp = (name) => name.startsWith('on');

export const eventNameFromProp = (name) => name.slice(2).toLowerCase();

const applyProp = (element, name, value) => {
    if (isEventProp(name)) {
        element.addEventListener(eventNameFromProp(name), value);
    } else if (name === 'value' || name === 'checked') {
        element[name] = value;
    } else {
        element.setAttribute(name, value);
    }
};

export function createDom(vnode) {
    if (typeof vnode === 'string' || typeof vnode === 'number') {
        return document.createTextNode(String(vnode));
    }

    if (typeof vnode.tag === 'function') {
        vnode.hooks ??= [];
        
        beginComponentRender(vnode);
        const renderedVNode = vnode.tag(vnode.props ?? {});
        endComponentRender();

        const dom = createDom(renderedVNode);

        vnode.renderedVNode = renderedVNode;
        vnode.dom = dom;
        
        return dom;
    }

    const element = document.createElement(vnode.tag);

    for (const [name, value] of Object.entries(vnode.props ?? {})) {
        applyProp(element, name, value);
    }

    for (const child of vnode.children ?? []) {
        element.appendChild(createDom(child));
    }

    vnode.dom = element;
    
    return element;
}

let currentVNode = null;

export function render(vnode, container) {
    const dom = createDom(vnode);
    container.appendChild(dom);

    currentVNode = vnode;

    registerUpdateScheduler(update);

    flushEffects();
}

function update() {
    if (!currentVNode) return;

    const newVNode = {
        tag: currentVNode.tag,
        props: currentVNode.props,
        children: currentVNode.children
    };

    diff(currentVNode, newVNode, currentVNode.dom);

    currentVNode = newVNode;

    flushEffects();
}