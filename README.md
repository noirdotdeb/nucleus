# Nucleus

> A rendering engine built from absolute scratch — not because the world needs another one, but because I refused to start using a framework before I understood exactly what one does.


**Status:** 🧪 Early build — `createElement` + `render` in progress. Nothing below is a promise, it's a plan.


## The problem

Hand-write enough DOM code and you'll hit the same wall every time: you change a piece of data, and now it's on *you* to remember every single place on screen that depends on it and update each one by hand. Miss a spot and the screen quietly lies — it shows something that isn't true anymore. That's not a skill issue, it's a structural one. Every framework you've ever heard of exists to solve exactly this.

Nucleus is my attempt to solve it myself, from zero, before I let React solve it for me.

## What it's meant to do

Change data in exactly one place → have everything on screen that depends on it update itself, correctly, without me manually touching the DOM.

That happens in five moving parts:

- [ ] **`createElement`** — describe a piece of UI as a plain JS object instead of raw DOM calls
- [ ] **`render`** — turn that description into real DOM nodes on the page
- [ ] **Components** — UI descriptions as small, reusable functions instead of one giant blob
- [ ] **State** — a hand-rolled `useState`: change a value, and the relevant DOM re-syncs on its own
- [ ] **Diffing** — patch only what actually changed instead of rebuilding the whole page every time

🔨 **Currently building:** `createElement` + `render` — step one, get an object to become a real element on screen.

## Rules I'm building under

- Vanilla JavaScript (ES6+), HTML, CSS — no frameworks, no libraries, no build tools
- No copy-pasted implementations — if I don't understand why a line exists, it doesn't go in
- HTML stays a single empty `<div id="app"></div>` the entire time Nucleus itself is being built — the engine's whole job is generating DOM from JS, so hand-writing more HTML would defeat the point

## Running it

```bash
git clone https://github.com/noirdotdeb/nucleus.git
cd nucleus
python3 -m http.server
```

Then open `localhost:8000`.

## Why this instead of just learning React

Because "React uses a virtual DOM" meant nothing to me until I had to figure out what a virtual DOM even *is*. This isn't trying to replace React, compete with it, or ship to production — it's the fastest way I found to make the real thing feel obvious instead of magic once I get there.

---

Built solo, one deliberate step at a time — [@noirdotdeb](https://github.com/noirdotdeb)