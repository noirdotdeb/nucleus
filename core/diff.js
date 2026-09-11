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
    
    const oldKeyed = new Map();
    const oldUnkeyed = [];

    
    
    oldChildren.forEach((oldChild, i) => {
        const childDom = domChildren[i];
        if (oldChild && typeof oldChild === 'object' && oldChild.key != null) {
            oldKeyed.set(oldChild.key, { vnode: oldChild, dom: childDom });
        } else {
            oldUnkeyed.push({ vnode: oldChild, dom: childDom });
        }
    });

    let unkeyedIndex = 0;
    const newDomNodes = []; 

    
    for (let i = 0; i < newChildren.length; i++) {
        const newChild = newChildren[i];
        let match = null;

        
        if (newChild && typeof newChild === 'object' && newChild.key != null) {
            if (oldKeyed.has(newChild.key)) {
                match = oldKeyed.get(newChild.key);
                oldKeyed.delete(newChild.key); 
            }
        } else {
            
            if (unkeyedIndex < oldUnkeyed.length) {
                match = oldUnkeyed[unkeyedIndex];
                unkeyedIndex++;
            }
        }

        if (!match) {
            
            newDomNodes.push(createDom(newChild));
        } else {
            
            const oldChild = match.vnode;
            const childDom = match.dom;

            const isPrimitive = (node) => typeof node === 'string' || typeof node === 'number';
            const oldIsText = isPrimitive(oldChild);
            const newIsText = isPrimitive(newChild);

            if (oldIsText && newIsText) {
                if (String(oldChild) !== String(newChild)) {
                    childDom.textContent = newChild;
                }
                newDomNodes.push(childDom);
            } else if (oldIsText !== newIsText) {
                const freshDom = createDom(newChild);
                newDomNodes.push(freshDom);
            } else {
                diff(oldChild, newChild, childDom);
                newDomNodes.push(newChild.dom);
            }
        }
    }

 
    oldKeyed.forEach(match => {
        if (match.dom && match.dom.parentNode) match.dom.parentNode.removeChild(match.dom);
    });
    
    while (unkeyedIndex < oldUnkeyed.length) {
        const match = oldUnkeyed[unkeyedIndex];
        if (match.dom && match.dom.parentNode) match.dom.parentNode.removeChild(match.dom);
        unkeyedIndex++;
    }

 
    for (let i = 0; i < newDomNodes.length; i++) {
        const expectedDom = newDomNodes[i];
        const currentDomAtI = parentDom.childNodes[i];
        
        if (currentDomAtI !== expectedDom) {
 
            if (currentDomAtI) {
                parentDom.insertBefore(expectedDom, currentDomAtI);
            } else {
                parentDom.appendChild(expectedDom);
            }
        }
    }
}