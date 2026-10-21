# Suggested 2–3 minute walkthrough

This is a recording outline; no video has been recorded or submitted.

1. **0:00–0:25 — Orient the viewer.** Introduce the fixed 2D board, four items, actual Three.js cube/torus, zoom indicator, and seeded review conversations. Pan, zoom around the pointer, and fit content.
2. **0:25–1:10 — Complete the review loop.** Use `C` to place a multiline comment. Add a reply, edit your message, resolve the thread, find it with the Resolved filter, and reopen it. Reload to show persistence. Mention the fixed local identity and lack of a backend.
3. **1:10–1:30 — Show mobile.** Narrow the viewport, dismiss the conversation overlay, and demonstrate touch navigation or mobile emulation. Show that comments remain usable.
4. **1:30–2:15 — Explain one technical decision.** Open `src/canvas/coordinates.ts` and `viewport.ts`. Explain the inverse transform, pointer-centered zoom, and why continuous viewport state does not live in React state. Show the performance test's active counters and observation for 200 threads/600 messages.
5. **2:15–2:45 — Explain the foundation and trade-offs.** Show the comment reducer and storage adapter. Mention ownership checks, schema validation, and preservation of corrupt data. Explain on-demand Three.js rendering, the two-renderer trade-off, and the larger 3D chunk.
6. **2:45–3:00 — Close with next steps.** Point to `DECISIONS.md`, test commands, and the [public Netlify demo](https://formspace-canvas.netlify.app/). State that rotation and a real collaboration backend are future work.
