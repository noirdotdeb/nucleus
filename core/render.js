export function render(vnode, container) {
    const element = document.createElement(vnode.tag);

    vnode.children.forEach(child => {
        const text = document.createTextNode(child);
        element.appendChild(text);
    });

    container.appendChild(element);
}