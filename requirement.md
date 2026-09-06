# Nucleus — Software Requirements

## Problem statement
Change data in one place, and have everything on screen that depends on it update itself correctly — without manually tracking which DOM nodes depend on which piece of data.

## Functional Requirements

| ID | Requirement |
|----|-------------|
| FR1 | The system shall provide a function that accepts a tag name, an attributes object, and a list of children, and returns a plain JS object representing that UI element (a "vnode"). |
| FR2 | The system shall provide a function that accepts a vnode and a real DOM container, and builds the corresponding real DOM structure inside that container. |
| FR3 | The system shall support nested vnodes — children that are themselves vnodes — rendering them recursively. |
| FR4 | The system shall support plain text as a child, not just nested elements. |
| FR5 | The system shall allow UI to be described as reusable functions ("components") that accept a `props` object and return a vnode tree. |
| FR6 | The system shall provide a state mechanism letting a component hold a value that can change over time. |
| FR7 | When state changes, the system shall automatically update the affected DOM to match — without the developer manually selecting and mutating nodes. |
| FR8 | The system shall update only the DOM nodes affected by a change, rather than rebuilding the entire tree every time (diffing). |
| FR9 | The system shall allow components to live in separate files and be imported where used (ES6 modules). |
| FR10 | The system shall allow event handlers (e.g. click) to be attached to elements described through the vnode system. |

## Non-Functional Requirements

| ID | Requirement |
|----|-------------|
| NFR1 — No dependencies | Implemented in vanilla JavaScript (ES6+) only. No external libraries, frameworks, or build tools. |
| NFR2 — Transparency | Every behavior must be traceable to code personally written and understood. No black boxes, no copied implementations. |
| NFR3 — Performance | State-driven DOM updates shall avoid unnecessary re-creation of unaffected nodes (see FR8). |
| NFR4 — Portability | Runs unmodified in any modern browser with no build/compile step. |
| NFR5 — Maintainability | Each core capability (createElement, render, state, diffing) lives in its own file, independently testable. |
| NFR6 — Learnability | Each module includes comments explaining what problem it solves, so the project stays understandable without outside references. |
| NFR7 — Scope control | No server-side rendering, no routing, no capability beyond rendering + state sync. Deliberately excluded to keep the project finishable. |

## Traceability (which requirement each build phase satisfies)

- **createElement + render** → FR1, FR2, FR3, FR4
- **Components as functions** → FR5, FR9
- **Hand-rolled state** → FR6, FR7
- **Diffing** → FR8, NFR3
- **Demo app on top** → FR10, proves FR1–FR9 actually work together