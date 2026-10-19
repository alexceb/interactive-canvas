# Formspace · Interactive canvas

A small, client-side design review workspace: a pan-and-zoom board, two real Three.js models, and conversations anchored to board coordinates. Built for the Encube frontend assignment with React, TypeScript, Tailwind, and Radix primitives. No React Three Fiber or backend.

## Run locally

Use Node 24 (the tested version is pinned in `.nvmrc`), or Node 22.22.2+. The test dependencies require the newer Node 22 patch release. With nvm installed:

```sh
nvm use
corepack enable
yarn install --frozen-lockfile
yarn dev
```

Use Yarn Classic 1.22.22, pinned in `package.json`, and commit `yarn.lock` when dependencies change. Run these commands from the repository root. Open the address printed by Vite. No environment variables, credentials, external assets, or services are required. The model previews need a browser with WebGL 2; an explanatory placeholder appears when it is unavailable.

## What to try

- Drag or scroll to pan. Pinch, or use Ctrl/Cmd + scroll, to zoom around the pointer.
- Use the zoom controls to zoom, return to 100%, or fit the four fixed objects.
- Select the comment tool (`C`), then click anywhere on the board. Submit text to create a thread. Cancelling creates nothing.
- Open a pin, or choose a conversation in the comments sidebar. List selection brings the pin into view.
- Reply, edit your own messages, and resolve or reopen conversations. Alex Morgan is the fixed current user; the other authors are seeded demo participants.
- Filter the comment list by Open, Resolved, or All. Resolved pins stay visible with a check mark.
- Reload: comments, replies, edits, and resolution persist in this browser.
- Use **Workspace menu → Reset demo…** to restore the original conversations after confirmation.

On narrow screens the sidebar is a dismissible overlay. Close it to return to touch navigation. The interface is light themed; model rotation and item movement are intentionally deferred.

## Keyboard controls

| Control | Action |
| --- | --- |
| `C` | Activate comment placement and focus the board |
| `Enter`, with board focused in comment mode | Place a draft at the visible center |
| Space + drag | Temporarily pan |
| Arrow keys, with board focused | Pan |
| `+` / `-`, with board focused | Zoom |
| `0`, with board focused | Fit content |
| Escape | Cancel an edit/draft, return to the thread list, or close the panel |
| Ctrl/Cmd + Enter, in a composer | Submit |
| Enter, in a composer | Insert a line break |

## Checks

```sh
yarn typecheck     # TypeScript, including browser tests
yarn lint          # Biome lint/import checks and existing ESLint checks
yarn lint:fix      # Apply safe lint and import fixes
yarn format:check  # Check formatting without changing files
yarn format        # Format CSS, JS/TS, and JSON files
yarn run check     # TypeScript, lint, and formatting checks
yarn test          # Domain, coordinates, persistence, and component tests
yarn build         # TypeScript and production output in dist/
yarn preview       # Serve the production output
```

Biome is pinned as a development dependency. `biome.json` enables its recommended rules for CSS and JS/TS (including JSX/TSX), checks React Hooks and type imports, understands Tailwind CSS directives, and respects `.gitignore`. Formatting uses two spaces, LF line endings, a 100-character width, single JS/TS quotes, and semicolons. JSON configuration files are covered too; generated files and dependencies are excluded. Test fixtures allow non-null assertions; production code keeps the rule enabled. Existing ESLint checks remain in place. Use `yarn run check` explicitly because Yarn Classic reserves `yarn check` for its own dependency checker. See the [Biome configuration reference](https://biomejs.dev/reference/configuration/) for rule details.

`.github/workflows/quality.yml` runs **Lint CSS and JS/TS** and **Check formatting** as separate jobs on pushes and pull requests. Both use the pinned Node version and `yarn install --frozen-lockfile`; formatting checks never rewrite files in CI.

For browser checks:

```sh
yarn playwright install chromium
yarn test:e2e
```

Playwright uses `/usr/bin/chromium` automatically when present, otherwise its managed Chromium. To use another installed browser, set `PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH`. Linux hosts may need Playwright's documented OS dependencies (`yarn playwright install --with-deps chromium`). The cloud environment already includes Chromium; its policy blocks Playwright's download CDN, so the system browser was used here. No verification was disabled.

The browser suite starts Vite automatically, or reuses an existing server on port 5173 outside CI. It covers desktop and mobile Chromium, real WebGL rendering, touch drag/pinch, comment creation/replies/editing/resolution/reload, coordinate anchoring, keyboard placement, and reset/error handling. The performance scenario seeds 200 threads with 600 messages and records React commits, WebGL draws, and long tasks during a pan. This is a representative workload, not a supported upper limit or an FPS guarantee.

See [VALIDATION.md](VALIDATION.md) for the measured results and limitations, [DECISIONS.md](DECISIONS.md) for architecture and trade-offs, and [WALKTHROUGH.md](WALKTHROUGH.md) for the recording outline.

## Local data and limits

Data lives under `formspace.workspace.v1` in localStorage. A versioned document is validated before loading; invalid or unsupported data is preserved rather than overwritten. Storage failures show a warning, and the workspace remains usable in memory. Writes are coalesced over 80 ms and flushed on `pagehide`.

This is a single-browser simulation. It has no server authentication, multi-user synchronization, cross-tab merging, attachments, or rich text. Ownership checks describe local application behavior; they are not a security boundary. The viewport and unfinished drafts are session state and are not persisted.

## Deployment later

No deployment has been performed. For a later Vercel deployment, use the Vite framework preset, `yarn build`, and the `dist` output directory. No backend configuration is necessary. Browser data remains local to each deployed origin and will not transfer from a development origin automatically.
