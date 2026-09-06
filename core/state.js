// createState(initialValue)
// Takes: a starting value
// Returns: [getValue, setValue] — a way to read the current value,
//          and a way to change it
//
// The key idea: setValue shouldn't just change the value — it also needs
// to trigger a re-render so the DOM catches up. You don't need to know
// how that connection works yet; that only becomes solvable once
// render.js exists and you can see what it needs from you.

export function createState(initialValue) {
  // TODO 1: keep the value in a variable this function "remembers" (closure)

  // TODO 2: write a getValue() that returns the current value

  // TODO 3: write a setValue(newValue) that:
  //         - updates the stored value
  //         - somehow tells the outside world "something changed, re-render"
  //           (leave a comment here for now — come back once render.js exists)

  // TODO 4: return [getValue, setValue]
}