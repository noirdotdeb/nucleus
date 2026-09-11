Markdown
# Nucleus

> A rendering engine built from absolute scratch — not because the world needs another one, but because I refused to start using a framework before I understood exactly what one does.

**Status:** ✅ Complete (Fully functional Virtual DOM, per-instance hooks, keyed reconciliation, and effect lifecycles)


## The problem

Hand-write enough DOM code and you'll hit the same wall every time: you change a piece of data, and now it's on *you* to remember every single place on screen that depends on it and update each one by hand. Miss a spot and the screen quietly lies — it shows something that isn't true anymore. That's not a skill issue, it's a structural one. Every framework you've ever heard of exists to solve exactly this.

Nucleus is my attempt to solve it myself, from zero, before I let React solve it for me.

## What it does

Change data in exactly one place → have everything on screen that depends on it update itself, correctly, without me manually touching the DOM.

It achieves this through five core mechanics:

- [x] **`createElement`** — describe a piece of UI as a plain JS object with automatic child normalization and key extraction.
- [x] **`render`** — turn that description into real DOM nodes recursively, scheduling updates seamlessly.
- [x] **Components** — UI descriptions as reusable functions receiving props and returning trees.
- [x] **State (`createState`)** — closure-based hook system scoped per component instance using cursor-tracking and instance vnode pointers.
- [x] **Keyed Reconciliation (`diff` & `diffChildren`)** — Map-based lookup and native `insertBefore` re-ordering to maintain component identity and state across list mutations without full DOM rebuilds.
- [x] **Effect Lifecycles (`createEffect`)** — Dependency-tracked side effects with deferred post-paint execution and recursive component unmounting cleanup routines.

## Rules I built under

- Vanilla JavaScript (ES6+), HTML, CSS — no frameworks, no libraries, no build tools, no TypeScript, no JSX.
- No copy-pasted implementations — if I didn't understand why a line existed, it didn't go in.
- HTML stays a single empty `<div id="app"></div>` — the engine's entire job is generating and patching DOM from JS.

## Project Structure

```text
nucleus/
│
├── index.html          # Entry HTML container
├── style.css           # Modern dark-theme styling
├── main.js             # Demo application (Counters, Timers, Lists)
└── core/
    ├── createElement.js# VNode object factory & child normalization
    ├── state.js        # Hook management, state closures, and effect queue
    ├── render.js       # Initial DOM mount and update scheduler orchestration
    └── diff.js         # Tree reconciliation, prop patching, and unmounting
Running it
Bash
git clone [https://github.com/noirdotdeb/nucleus.git](https://github.com/noirdotdeb/nucleus.git)
cd nucleus
python3 -m http.server 8000
Then open localhost:8000.

Why this instead of just learning React
Because "React uses a virtual DOM" meant nothing to me until I had to figure out what a virtual DOM even is. This isn't trying to replace React or ship to production — it's the fastest way I found to make the real thing feel obvious instead of magic once I get there.

Built solo, one deliberate step at a time — @noirdotdeb