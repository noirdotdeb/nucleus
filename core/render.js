export function render(vnode, container) {

    // If the vnode tag is a function,
    // treat it as a functional component.
    if (typeof vnode.tag === 'function') {
        const componentVNode = vnode.tag(vnode.props);

        render(componentVNode, container);

        return;
    }

    // Create the real HTML element from the vnode's tag.
    const element = document.createElement(vnode.tag);

    // Go through every prop and apply it to the real HTML element.
    Object.entries(vnode.props).forEach(([name, value]) => {
        element.setAttribute(name, value);
    });

    // Go through every child inside the vnode.
    vnode.children.forEach(child => {

        // If the child is text, create a text node.
        if (typeof child === 'string') {
            const text = document.createTextNode(child);

            // Add the text inside the current element.
            element.appendChild(text);

        } else {
            // If the child is another vnode,
            // render it inside the current element.
            render(child, element);
        }
    });

    // Add the completed element inside the provided container.
    container.appendChild(element);
}