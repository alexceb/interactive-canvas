# Formspace · Interactive canvas

A client-side design review workspace with a pan-and-zoom board, two Three.js models, and conversations anchored to board coordinates. Built for the Encube frontend assignment with React, TypeScript, and Radix primitives. Styling uses CSS Modules and Tailwind CSS setup. Submitted comments are stored in this browser; there is no backend.

## Run locally

Use the Node version pinned in [`.nvmrc`](.nvmrc) and Yarn Classic 1.22.22, pinned in [`package.json`](package.json). From the repository root, with nvm installed:

```sh
nvm use
corepack enable
yarn install --frozen-lockfile
yarn dev
```

Open the address printed by Vite. The application needs no environment variables, credentials, or external services. The model previews require WebGL 2; a placeholder explains when it is unavailable. Commit `yarn.lock` when dependencies change.

## What to try

- Drag or scroll to pan. Pinch, or use Ctrl/Cmd + scroll, to zoom around the pointer.
- Use the zoom controls to zoom, return to 100%, or fit the four fixed objects.
- Select the comment tool (`C`), then click anywhere on the board. Submit text to create a thread. Cancelling creates nothing.
- Open a pin, or choose a conversation in the comments sidebar. List selection brings the pin into view.
- Reply, edit your own messages, and resolve or reopen conversations. Alex Morgan is the fixed current user; the other authors are seeded demo participants.
- In the **Threads** panel, filter by Open, Resolved, or All. Resolved pins stay visible with a check mark.
- Reload: comments, replies, edits, and resolution persist in this browser.
- Use **Workspace menu → Reset demo…** to restore the original conversations after confirmation.

On narrow screens the sidebar is a dismissible overlay. Close it to return to touch navigation. The interface is light themed; model rotation and item movement are intentionally deferred.

## Keyboard controls

| Control                                     | Action                                                              |
| ------------------------------------------- | ------------------------------------------------------------------- |
| `C`                                         | Activate comment placement and focus the board                      |
| `Enter`, with board focused in comment mode | Place a draft at the visible center                                 |
| Space + drag                                | Temporarily pan                                                     |
| Arrow keys, with board focused              | Pan                                                                 |
| `+` / `-`, with board focused               | Zoom                                                                |
| `0`, with board focused                     | Fit content                                                         |
| Escape                                      | Cancel an edit/draft, return to the thread list, or close the panel |
| Ctrl/Cmd + Enter, in a composer             | Submit                                                              |
| Enter, in a composer                        | Insert a line break                                                 |

## Project structure

| Location                           | Responsibility                                                             |
| ---------------------------------- | -------------------------------------------------------------------------- |
| [`src/app`](src/app)               | Workspace composition, tools, selection, drafts, and shortcuts             |
| [`src/canvas`](src/canvas)         | Coordinates, viewport navigation, fixed board items, and Three.js previews |
| [`src/comments`](src/comments)     | Conversation model, persistence, pins, and review panels                   |
| [`src/components`](src/components) | Shared controls and dialogs                                                |
| [`e2e`](e2e)                       | Desktop/mobile Chromium workflows and the pan performance scenario         |

Component folders use kebab-case and keep styles, types, hooks, and tests nearby. Shared domain utilities stay at the feature root. For example:

```text
src/comments/composer/
  composer.tsx
  composer.module.css
  composer.types.ts
  use-composer.ts
  composer.test.tsx
```

[`src/styles.css`](src/styles.css) contains Tailwind setup and global defaults; [`src/shared.module.css`](src/shared.module.css) contains shared control styles. See [DECISIONS.md](DECISIONS.md) for state ownership, execution flows, and architectural trade-offs.

## Checks

```sh
yarn typecheck     # TypeScript, including browser tests
yarn lint          # Biome lint/import checks and ESLint
yarn format:check  # Check formatting without changing files
yarn run check     # TypeScript, lint, and formatting checks
yarn test          # Domain, coordinates, persistence, and component tests
yarn build         # TypeScript and production output in dist/
yarn preview       # Serve the production output
```

Use `yarn run check` explicitly: Yarn Classic reserves `yarn check` for its dependency checker. To change files, run `yarn lint:fix` for lint/import fixes or `yarn format` for formatting. Rules live in [`biome.json`](biome.json) and [`eslint.config.js`](eslint.config.js). This repository currently has no checked-in CI workflow; run the checks locally.

For browser checks:

```sh
yarn playwright install chromium
yarn test:e2e
```

Playwright uses `/usr/bin/chromium` when present, otherwise its managed Chromium. Set `PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH` to use another installed Chromium executable. Linux hosts may also need OS dependencies (`yarn playwright install --with-deps chromium`).

It covers WebGL rendering, touch navigation, conversation workflows, anchor alignment, keyboard placement, and storage recovery. The performance scenario measures React commits, intercepted WebGL `drawElements` calls, and long-task observations during a pan; it does not establish an FPS guarantee or a document-size limit.

## Local data and limits

Submitted conversations live under `formspace.workspace.v1` in localStorage. Invalid or unsupported saved data is preserved while a temporary demo runs in memory. **Reset demo…** replaces that data and enables saving again. A storage warning means changes may be lost on reload.

This is a single-browser simulation. It has no server authentication, multi-user synchronization, cross-tab merging, attachments, or rich text. Ownership checks describe local application behavior; they are not a security boundary. The viewport and unfinished drafts are session state and are not persisted.

## Deployment to Netlify

The public demo is available at [formspace-canvas.netlify.app](https://formspace-canvas.netlify.app/).

Comments remain in each visitor's browser. Data from localhost or another deployment origin does not transfer to the public demo automatically.
