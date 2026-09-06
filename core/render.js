// render(vnode, container)
// Takes: the object createElement() gave you, and a real DOM element to put it inside
// Job: build the real DOM node from that object and attach it to `container`

export function render(vnode, container) {
  // TODO 1: create a real element using vnode.tag (document.createElement)

  // TODO 2: loop over vnode.props and set each as an attribute on your new element

  // TODO 3: loop over vnode.children —
  //         if a child is a string, add it as text
  //         if it's another vnode object, render() it into your new element (recursively)

  // TODO 4: attach your finished element into `container`
}