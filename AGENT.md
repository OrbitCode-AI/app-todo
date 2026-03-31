# Todo Template - Agent Guide

## Architecture

- **App.tsx** — Entry point. Manages the todo list via `useMap('todos')` which returns `[todosMap, actions, loading]`. Actions are `set(key, value)` and `remove(key)`. Uses `useVar` for input text and filter state. Contains all CRUD handlers and inline editing logic with a ref guard (`activeEditIdRef`) to prevent duplicate submit on Enter + blur.
- **types.ts** — Shared type definitions: `TodoRecord` (text + completed), `Todo` (TodoRecord + id), `TodoFilter` ('all' | 'active' | 'completed').
- **TodoHeader.tsx** — Input form for adding new todos. Includes the floating title. Props: `value`, `onValueChange`, `onSubmit`, `disabled`, `floatingTitle`.
- **TodoTitle.tsx** — Renders the "todos" heading with optional floating style.
- **TodoList.tsx** — Renders toggle-all checkbox and the list of `TodoItem` components. Receives all editing callbacks as props.
- **TodoItem.tsx** — Single todo row with checkbox, label, destroy button, and inline edit input. Double-click label to edit. Enter to save, Escape to cancel, blur to save.
- **TodoFooter.tsx** — Shows active count, filter buttons (all/active/completed), and clear-completed button.

Data flow: `useMap` provides persistent key-value collections. `useVar` provides persistent scalar state. All mutation handlers live in App.tsx and are passed down as props. Local UI state (editingId, editText, isAdding) uses Preact's `useState`.

## Styling

- Single `styles.css` file shared across all components (imported by App.tsx and individual components).
- Follows TodoMVC class naming conventions (`.todoapp`, `.todo-list`, `.toggle`, `.destroy`, `.edit`, `.completed`).
- No per-component CSS files except the shared `styles.css`.

## Extension Points

- Add todo metadata (e.g., priority, due date) by extending `TodoRecord` in `types.ts`, updating `add`/`update` calls in App.tsx, and rendering in `TodoItem.tsx`.
- Add new filter types by extending `TodoFilter` in `types.ts` and the `matchesFilter` function in App.tsx.
- Add persistence indicators or optimistic UI by leveraging the `loading` flag from `useMap`.

## Constraints

- Components use default exports (not dual named+default pattern) since they serve as both the preview and the composition export.
