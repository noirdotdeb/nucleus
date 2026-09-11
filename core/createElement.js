export function createElement(tag, props, children) {

    const normalizedChildren = (children || [])
        .flat(Infinity)
        .filter(child => child != null && typeof child !== 'boolean')
        .map(child => typeof child === 'number' ? String(child) : child);

    return {
        tag: tag,
        props: props || {},
        children: normalizedChildren
    };
}