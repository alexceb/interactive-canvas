# Architecture and decisions

This document explains the current implementation and its trade-offs. [README.md](README.md) covers setup and use; [VALIDATION.md](VALIDATION.md) separates test coverage from recorded results.

## Scope and domain

The workspace has four fixed board items, including a Three.js cube and torus. A thread owns one world-coordinate anchor and an ordered message array: the first message starts the conversation and the rest are replies. Replies have no separate anchors or nested threads. The versioned document stores threads by ID; see [`comments.types.ts`](src/comments/comments.types.ts).

Alex Morgan is the fixed current user. Any thread can be resolved or reopened, but only that user's messages can be edited. The UI hides other authors' edit controls, and the [reducer](src/comments/model.ts) enforces the same rule. These are local domain rules; authentication and server authorization would be required for a shared application.

Board-item movement, model rotation, deletion, undo/redo, rich text, and live collaboration are outside the current implementation. Supporting movable items would also require deciding whether anchors follow items or remain at fixed board coordinates.

## State ownership and execution flows

| State | Owner | Lifetime |
| --- | --- | --- |
| Pan, zoom, canvas dimensions | [`ViewportController`](src/canvas/viewport.ts) | Workspace session |
| Conversation document and save status | [`CommentsProvider`](src/comments/comments-provider/comments-provider.tsx) | Document saved to localStorage; status held in memory |
| Active tool, selected thread, panel visibility, new-thread draft | [`useWorkspace`](src/app/workspace/use-workspace.ts) | Workspace session |
| Thread filter | [`Sidebar`](src/comments/sidebar/sidebar.tsx) | Component lifetime |
| Uncontrolled reply/edit input | [`useComposer`](src/comments/composer/use-composer.ts) | Composer lifetime |

Two paths explain the main boundary:

```text
Pan input → gesture handler → ViewportController
                                  → requestAnimationFrame → board/grid DOM updates

Comment submission → provider action → pure reducer → updated document → React consumers
                                                       → provider effect → localStorage
```

Continuous viewport changes are coalesced into one paint per animation frame. The controller applies transforms directly. Only the [zoom controls](src/canvas/zoom-controls/zoom-controls.tsx) use `useSyncExternalStore`, with a numeric zoom snapshot; a pure pan leaves that snapshot unchanged. React still owns the board's component structure and comment content. Changes to the viewport DOM properties belong to the controller.

Conversation updates use a pure reducer and separate data, action, and persistence contexts. [Storage](src/comments/storage.ts) and domain logic do not import React. This keeps validation and transitions testable without rendering UI. Document changes can still rerender context consumers; splitting contexts does not provide per-thread subscriptions.

The pan test examines navigation with a populated document. It does not establish acceptable comment-mutation or sidebar-rendering latency. Profile those interactions before adding selector subscriptions, list virtualization, or a different store.

## DOM board and coordinate invariants

The board uses a DOM layer transformed by `translate(x, y) scale(zoom)`. This supports heterogeneous HTML cards and focusable comment pins without implementing text layout and hit testing in a drawing engine. There is no finite pan boundary; zoom is bounded to 20–300%.

[`coordinates.ts`](src/canvas/coordinates.ts) owns the transform math. Pointer positions first subtract the canvas element's bounding rectangle. For a canvas-local screen point:

```text
worldX = (screenX - panX) / zoom
worldY = (screenY - panY) / zoom
```

Stored anchors always use world coordinates. Pointer-centered zoom adjusts translation to preserve the world point under the pointer; pinch gestures use the same operation at their center. Pin visuals use inverse scale to stay readable while their tips remain anchored.

Fit uses the [fixed content bounds](src/canvas/coordinates.constants.ts), so distant comments do not make the four items shrink out of view. Choosing a thread from the list centers its anchor without changing zoom. Adding board items requires keeping those bounds consistent with their layout. If item or pin counts grow substantially, profile DOM layout and painting before introducing visible-region culling or a different rendering approach.

## Static Three.js scenes

Each model owns a renderer, scene, camera, and resize observer. [`model-scene.ts`](src/canvas/model/model-scene.ts) draws on mount, resize, and context restoration. It has no continuous animation loop, caps device pixel ratio at 2, and disposes geometry, materials, renderer resources, listeners, and observers on cleanup.

Three.js supplies geometry, lighting, materials, and renderer lifecycle support. The integration uses React effects directly, without React Three Fiber. For two static scenes, separate renderers keep ownership local; many previews would warrant evaluating a shared renderer with scissored views. That would introduce coordination of layout, visibility, and input.

Board zoom scales the existing rendered image rather than raising its render resolution. This avoids extra model rendering during navigation at the cost of sharpness at high zoom. Animation or interactive model rotation would require revisiting render scheduling.

The [preview boundary](src/canvas/model-preview/model-preview.tsx) lazy-loads the model module and offers a retry after a load/render failure. Creating a fresh lazy component avoids reusing a cached rejected import. WebGL creation failure or context loss uses a separate availability fallback; restoration redraws the scene. Comments and navigation remain independent of the preview.

Lazy loading separates the Three.js payload from the interface bundle; it does not remove the library's download cost. Historical bundle sizes and the reported chunk warning are recorded in [VALIDATION.md](VALIDATION.md#historical-bundle-observation).

## Persistence and recovery

[`storage.ts`](src/comments/storage.ts) validates version 1 documents, including finite anchors, known authors, message IDs, text, and timestamps. An absent storage key starts a seeded document; a valid empty document stays empty. Invalid or unsupported data starts a temporary demo with writes blocked, preserving the original value until an explicit reset.

The provider saves changed documents after an 80 ms debounce and flushes the latest committed document on `pagehide`. Save status is tied to the document successfully written. Write failures show a warning while changes remain usable in memory. Abnormal browser termination can still lose a pending write.

Whole-document JSON and localStorage keep the adapter small, but serialization and writes are synchronous. Their latency is not measured by the pan benchmark. Larger documents or frequent edits would justify measuring this path and considering IndexedDB or a backend.

There is no cross-tab merge policy; simultaneous tabs can overwrite each other's documents. A collaboration backend would need authenticated author IDs, server-side authorization, conflict handling, and a synchronization protocol. Changing stored data requires an explicit migration or recovery policy rather than silently accepting a new schema.

## Source and styling boundaries

Feature folders group workspace composition, canvas behavior, and conversations. Component-specific styles, types, hooks, and tests stay nearby; shared domain code stays at the feature root. This makes ownership visible, with the cost of navigating several small files. The [README source map](README.md#project-structure) provides entry points.

Component styles live in adjacent `.module.css` files. [`shared.module.css`](src/shared.module.css) holds shared control styles; [`styles.css`](src/styles.css) contains Tailwind setup, global defaults, shared dimensions, and reduced-motion overrides. Scoped class names limit accidental selector collisions, while shared classes and CSS variables still require coordination. Browser tests use roles, accessible names, or explicit test IDs rather than generated CSS class names.

The CSS Modules migration is recorded in `8572592`.
