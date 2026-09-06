// diff(oldVNode, newVNode, domNode)
// Takes: the previous vnode tree, the new vnode tree, and the real DOM
//        node that oldVNode currently corresponds to
// Job: figure out what actually changed and patch ONLY that — instead of
//      throwing domNode away and calling render() from scratch
//
// This is the hardest file in the whole project. Don't touch it until
// createElement, render, and state all work together end to end.

export function diff(oldVNode, newVNode, domNode) {
  // TODO 1: if oldVNode.tag !== newVNode.tag, the whole node changed —
  //         just replace domNode entirely. Handle this easy case first.

  // TODO 2: if the tag is the same, compare oldVNode.props vs newVNode.props
  //         and update only the attributes that actually differ

  // TODO 3: compare oldVNode.children vs newVNode.children, recursively
  //         diff()-ing each one. Start with the simple case — same number
  //         of children, none added or removed. Added/removed/reordered
  //         children are harder problems, save them for after that works.

  // TODO 4: this function doesn't return anything — it mutates the real
  //         DOM directly rather than handing back a new tree
}