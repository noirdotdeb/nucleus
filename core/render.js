import { resetCursor, registerUpdateScheduler } from './state.js';
import { diff } from './diff.js';

// Props starting with "on" (onclick, onmouseover, ...) are treated as
// event handlers, not HTML attributes. Exported so diff.js can use the
// exact same rule when patching props later.
export function isEventProp(name) {
    return name.startsWith('on');
}

// 'onclick' -> 'click', 'onmouseover' -> 'mouseover'
export function eventNameFromProp(name) {
    return name.slice(2).toLowerCase();
}

function applyProp(element, name, value) {
    if (isEventProp(name)) {
        element.addEventListener(eventNameFromProp(name), value);
    } else {
        element.setAttribute(name, value);
    }
}

// Builds a real DOM node (or text node) for a single vnode WITHOUT
// attaching it anywhere yet. This is the one place that knows how to
// turn a vnode into DOM, so both the initial render AND diff.js (when
// it needs to build a brand-new node for an added child or a
// replacement) share the exact same logic instead of duplicating it.
export function createDom(vnode) {
    // TEXT: plain strings become text nodes directly.
    if (typeof vnode === 'string') {
        return document.createTextNode(vnode);
    }

    // FUNCTIONAL COMPONENTS: a component vnode doesn't own a DOM node
    // of its own — it delegates to whatever its rendered output
    // produces. We keep a pointer to that rendered vnode (renderedVNode)
    // too, because next time this component's state changes, diff()
    // needs to compare the OLD rendered output against the NEW one.
    if (typeof vnode.tag === 'function') {
        const renderedVNode = vnode.tag(vnode.props);
        const dom = createDom(renderedVNode);

        vnode.renderedVNode = renderedVNode;
        vnode.dom = dom;
        return dom;
    }

    // NORMAL ELEMENTS
    const element = document.createElement(vnode.tag);

    Object.entries(vnode.props || {}).forEach(([name, value]) => {
        applyProp(element, name, value);
    });

    (vnode.children || []).forEach(child => {
        element.appendChild(createDom(child));
    });

    // Remember which real DOM node this vnode produced, so a future
    // diff() call has something to patch instead of rebuilding.
    vnode.dom = element;

    return element;
}

// --- Public API -------------------------------------------------------

// The vnode tree currently on screen — this is what future updates
// diff against.
let currentVNode = null;

export function render(vnode, container) {
    // Start hook-slot numbering from 0 for this render pass.
    resetCursor();

    const dom = createDom(vnode);
    container.appendChild(dom);

    currentVNode = vnode;

    // From now on, any setValue() anywhere in the tree comes back here.
    registerUpdateScheduler(update);
}

// Runs whenever any state changes. Re-generates the tree and diffs it
// against what's already on screen — never clears and rebuilds.
function update() {
    if (!currentVNode) return;

    resetCursor();

    // A fresh wrapper vnode around the SAME component/tag/props. This
    // is what forces diff() to re-invoke the root component and
    // compare its fresh output against what's currently rendered.
    const newVNode = {
        tag: currentVNode.tag,
        props: currentVNode.props,
        children: currentVNode.children
    };

    diff(currentVNode, newVNode, currentVNode.dom);

    currentVNode = newVNode;
}