// Compares an old vnode with a new vnode
// and updates only the real DOM that changed.

export function diff(oldVNode, newVNode, domNode) {

    // If the new vnode doesn't exist,
    // remove the old DOM node.
    if (newVNode == null) {
        domNode.remove();
        return;
    }


    // If the old vnode doesn't exist,
    // create the new DOM structure.
    if (oldVNode == null) {
        const container = domNode.parentNode;

        // Dynamically import would be unnecessary here.
        // The renderer will handle creating the node.
        throw new Error('Initial vnode cannot be diffed without an existing DOM node.');
    }


    // If either vnode represents text,
    // compare their text values.
    if (
        typeof oldVNode === 'string' ||
        typeof newVNode === 'string'
    ) {
        if (oldVNode !== newVNode) {
            domNode.textContent = newVNode;
        }

        return;
    }


    // If the element type changed,
    // replace the entire DOM node.
    if (oldVNode.tag !== newVNode.tag) {
        const newElement = createDOMNode(newVNode);

        domNode.replaceWith(newElement);

        return;
    }


    // Update attributes.
    updateProps(
        domNode,
        oldVNode.props,
        newVNode.props
    );


    // Compare children.
    const oldChildren = oldVNode.children;
    const newChildren = newVNode.children;

    const maxLength = Math.max(
        oldChildren.length,
        newChildren.length
    );


    for (let index = 0; index < maxLength; index++) {
        const oldChild = oldChildren[index];
        const newChild = newChildren[index];
        const childDOM = domNode.childNodes[index];


        // New child was added.
        if (oldChild === undefined) {
            const newElement = createDOMNode(newChild);

            domNode.appendChild(newElement);

            continue;
        }


        // Old child was removed.
        if (newChild === undefined) {
            domNode.removeChild(childDOM);

            continue;
        }


        // Both children exist.
        diff(
            oldChild,
            newChild,
            childDOM
        );
    }
}


// Update only attributes whose values changed.
function updateProps(element, oldProps, newProps) {

    // Remove attributes that no longer exist.
    Object.keys(oldProps).forEach(name => {
        if (!(name in newProps)) {
            element.removeAttribute(name);
        }
    });


    // Add or update changed attributes.
    Object.entries(newProps).forEach(([name, value]) => {

        if (oldProps[name] !== value) {
            element.setAttribute(name, value);
        }

    });
}


// Convert a vnode into a real DOM node.
// This is intentionally kept separate from render()
// so diffing can create replacement/added nodes.
function createDOMNode(vnode) {

    if (typeof vnode === 'string') {
        return document.createTextNode(vnode);
    }


    if (typeof vnode.tag === 'function') {
        return createDOMNode(
            vnode.tag(vnode.props)
        );
    }


    const element = document.createElement(vnode.tag);


    Object.entries(vnode.props).forEach(([name, value]) => {
        element.setAttribute(name, value);
    });


    vnode.children.forEach(child => {
        element.appendChild(
            createDOMNode(child)
        );
    });


    return element;
}