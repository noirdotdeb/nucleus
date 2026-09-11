import { createDom, isEventProp, eventNameFromProp } from './render.js';
import { beginComponentRender, endComponentRender } from './state.js';

export function diff(oldVNode, newVNode, domNode) {
    
    if (!oldVNode || !newVNode || !domNode) return;

    const oldIsComponent = typeof oldVNode.tag === 'function';
    const newIsComponent = typeof newVNode.tag === 'function';

    
    if (oldIsComponent || newIsComponent) {
        if (oldVNode.tag !== newVNode.tag) {
            replaceNode(newVNode, domNode);
            return;
        }

    
        newVNode.hooks = oldVNode.hooks ?? [];

        beginComponentRender(newVNode);
        const newRendered = newVNode.tag(newVNode.props ?? {});
        endComponentRender();

        diff(oldVNode.renderedVNode, newRendered, domNode);

        newVNode.renderedVNode = newRendered;
        newVNode.dom = newRendered.dom;
        return;
    }

    
    if (oldVNode.tag !== newVNode.tag) {
        replaceNode(newVNode, domNode);
        return;
    }

    
    diffProps(domNode, oldVNode.props, newVNode.props);
    diffChildren(domNode, oldVNode.children, newVNode.children);

    newVNode.dom = domNode;
}


function replaceNode(newVNode, domNode) {
    const parent = domNode.parentNode;
    
    if (!parent) return; 
    
    const freshDom = createDom(newVNode);
    parent.replaceChild(freshDom, domNode);
}


function diffProps(element, oldProps = {}, newProps = {}) {

    if (oldProps === newProps) return;


    for (const [name, oldVal] of Object.entries(oldProps)) {
        const stillExists = name in newProps;
        const isEvent = isEventProp(name);

        if (!stillExists || newProps[name] !== oldVal) {
            if (isEvent) {
                element.removeEventListener(eventNameFromProp(name), oldVal);
            } else if (!stillExists) {
                element.removeAttribute(name);
            }
        }
    }


    for (const [name, newVal] of Object.entries(newProps)) {
        const oldVal = oldProps[name];
        const changed = oldVal !== newVal;

        if (changed) {
            if (isEventProp(name)) {
                element.addEventListener(eventNameFromProp(name), newVal);
            } else {
                element.setAttribute(name, newVal);
            }
        }
    }
}

function diffChildren(parentDom, oldChildren = [], newChildren = []) {

    const domChildren = [...parentDom.childNodes];
    const max = Math.max(oldChildren.length, newChildren.length);

    for (let i = 0; i < max; i++) {
        const oldChild = oldChildren[i];
        const newChild = newChildren[i];
        const childDom = domChildren[i];


        if (oldChild === undefined) {
            parentDom.appendChild(createDom(newChild));
            continue;
        }


        if (newChild === undefined) {

            if (childDom) parentDom.removeChild(childDom);
            continue;
        }


        const isPrimitive = (node) => typeof node === 'string' || typeof node === 'number';
        const oldIsText = isPrimitive(oldChild);
        const newIsText = isPrimitive(newChild);

        
        if (oldIsText && newIsText) {
        
            if (String(oldChild) !== String(newChild)) {
                childDom.textContent = newChild;
            }
            continue;
        }

        
        if (oldIsText !== newIsText) {
        
            replaceNode(newChild, childDom);
            continue;
        }

        
        diff(oldChild, newChild, childDom);
    }
}