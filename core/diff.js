// diff(oldVNode, newVNode, domNode) compares an old vnode tree against
// a new one and patches the real DOM in place — it never throws
// domNode away and rebuilds from scratch unless the node genuinely has
// to change (a different tag, or text swapped for an element).

import { createDom, isEventProp, eventNameFromProp } from './render.js';

export function diff(oldVNode, newVNode, domNode) {
    const oldIsComponent = typeof oldVNode.tag === 'function';
    const newIsComponent = typeof newVNode.tag === 'function';

    // COMPONENTS: a component vnode doesn't own a real DOM node itself
    // — it delegates to whatever it renders. So "diffing a component"
    // really means "run it again, then diff its OUTPUT".
    if (oldIsComponent || newIsComponent) {
        // Different component function (or component swapped for a
        // plain element) — no safe way to patch one into the other.
        if (oldVNode.tag !== newVNode.tag) {
            replaceNode(newVNode, domNode);
            return;
        }

        // Same component function: run it again to get its latest
        // output, then diff THAT against what it produced last time.
        const newRendered = newVNode.tag(newVNode.props);
        diff(oldVNode.renderedVNode, newRendered, domNode);

        newVNode.renderedVNode = newRendered;
        newVNode.dom = newRendered.dom;
        return;
    }

    // DIFFERENT ELEMENT TYPE: e.g. <div> became <p>. Replace outright.
    if (oldVNode.tag !== newVNode.tag) {
        replaceNode(newVNode, domNode);
        return;
    }

    // SAME ELEMENT TYPE: the real diffing — keep the node, patch only
    // what actually changed underneath it.
    diffProps(domNode, oldVNode.props || {}, newVNode.props || {});
    diffChildren(domNode, oldVNode.children || [], newVNode.children || []);

    newVNode.dom = domNode;
}

// Swaps domNode out for a freshly built node matching newVNode.
function replaceNode(newVNode, domNode) {
    const parent = domNode.parentNode;
    const freshDom = createDom(newVNode);
    parent.replaceChild(freshDom, domNode);
}

function diffProps(element, oldProps, newProps) {
    // Removed or changed props: anything in oldProps not matched by
    // an identical value in newProps needs to go.
    Object.keys(oldProps).forEach(name => {
        const stillExists = name in newProps;

        if (isEventProp(name)) {
            if (!stillExists || newProps[name] !== oldProps[name]) {
                element.removeEventListener(eventNameFromProp(name), oldProps[name]);
            }
        } else if (!stillExists) {
            element.removeAttribute(name);
        }
    });

    // Added or changed props: anything in newProps that's different
    // from what was there before needs to be (re)applied.
    Object.keys(newProps).forEach(name => {
        const value = newProps[name];
        const changed = oldProps[name] !== value;

        if (isEventProp(name)) {
            // The old listener (if there was one) was already removed
            // above — just attach the new one.
            if (changed) {
                element.addEventListener(eventNameFromProp(name), value);
            }
        } else if (changed) {
            element.setAttribute(name, value);
        }
    });
}

function diffChildren(parentDom, oldChildren, newChildren) {
    // Snapshot the current real DOM children BEFORE mutating anything.
    // childNodes is "live" — reading parentDom.childNodes[i] fresh on
    // every loop iteration would mean a removal partway through shifts
    // every index after it, and we'd patch the wrong nodes.
    const domChildren = Array.from(parentDom.childNodes);
    const max = Math.max(oldChildren.length, newChildren.length);

    for (let i = 0; i < max; i++) {
        const oldChild = oldChildren[i];
        const newChild = newChildren[i];
        const childDom = domChildren[i];

        // ADDED: new list is longer than the old one.
        if (oldChild === undefined) {
            parentDom.appendChild(createDom(newChild));
            continue;
        }

        // REMOVED: old list had something here, new list doesn't.
        if (newChild === undefined) {
            parentDom.removeChild(childDom);
            continue;
        }

        const oldIsText = typeof oldChild === 'string';
        const newIsText = typeof newChild === 'string';

        // TEXT -> TEXT: swap the characters only, nothing else moves.
        if (oldIsText && newIsText) {
            if (oldChild !== newChild) {
                childDom.textContent = newChild;
            }
            continue;
        }

        // TEXT <-> ELEMENT: fundamentally different kinds of node,
        // can't be patched into each other.
        if (oldIsText !== newIsText) {
            const freshDom = createDom(newChild);
            parentDom.replaceChild(freshDom, childDom);
            continue;
        }

        // ELEMENT/COMPONENT -> ELEMENT/COMPONENT: recurse.
        diff(oldChild, newChild, childDom);
    }
}