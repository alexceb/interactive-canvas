# Validation record

This record separates source inspection from historical execution results. Setup and commands live in [README.md](README.md#checks); architectural consequences live in [DECISIONS.md](DECISIONS.md).

## Documentation review — 2026-10-20

The documentation was reviewed against source and configuration at base commit `16a5289`, including the earlier CSS Modules migration (`8572592`). This was a documentation-only review; application checks and browser tests were not rerun, and bundle sizes were not remeasured.

| Inspection | Evidence and scope |
| --- | --- |
| Local commands and tooling | [`package.json`](package.json), [`.nvmrc`](.nvmrc), [`biome.json`](biome.json), and [`eslint.config.js`](eslint.config.js) define the setup and checks described in the README. |
| Test inventory | Eight `src/**/*.test.{ts,tsx}` files and nine browser scenarios are present: seven desktop, including performance, and two mobile. These are source counts, not execution results. |
| Browser configuration | [`playwright.config.ts`](playwright.config.ts) defines desktop and Pixel 7 Chromium projects, starts Vite on port 5173, and permits server reuse when `CI` is unset. |
| CI availability | No `.github/workflows` configuration exists in the reviewed checkout or available commit history. Earlier workflow-validation claims cannot be verified here. |
| Architecture | Viewport updates, reducer rules, persistence recovery, model lifecycle, and CSS ownership were checked against their owning modules linked in DECISIONS. This does not replace runtime validation. |
| Documentation integrity | Relative links and heading targets resolve; code fences are paired and the three documents have no trailing whitespace. |

## Historical reported checks

The previous record reported the following runs. No tested commit IDs or linked raw output accompanied those entries, so none can be mapped confidently to the current revision. Dates and outcomes below preserve the reports; they do not certify the current checkout.

| Reported date/context | Environment recorded | Commands/checks reported | Reported outcome |
| --- | --- | --- | --- |
| 2026-10-20, component organization follow-up | Local checkout; runtime versions not recorded | `yarn run check`, `yarn test`, `yarn build` | Checks/build passed; 66 tests across eight files passed. Browser/performance checks were explicitly not rerun. |
| 2026-10-19, Yarn/Biome follow-up | Yarn 1.22.22, Biome 2.5.15; runtime versions not recorded | Frozen offline install, `yarn run check`, `yarn test`, `yarn build` | Passed; 30 tests across five files. The report also mentioned parsing a CI workflow that is absent from this repository. |
| 2026-10-19, restored local checkout | macOS, Node 24.22.0, npm 11.19.1 | `npm ci`, `npm run check`, `npm test`, `npm run build` | Passed; 30 tests across five files. Browser execution was blocked by a port-binding restriction. |
| 2026-10-19, cloud checkout | Chromium with software WebGL; Node/browser versions not recorded | `npm ci`, `npm run check`, `npm test`, `npm run build`, `npm run test:e2e`; development/production smoke checks and visual inspection | Passed; 30 unit/component tests and nine browser tests reported. Reply persistence and absence of page errors were reported for the production smoke check. |

The npm commands describe historical runs; the current package manager is Yarn. Screenshots, browser traces, and build logs were not linked in the prior record. Available commits do not establish when those earlier working-tree checks occurred, so results must not be assigned to commits by date alone.

## Current test coverage and measurement scope

- [Domain](src/comments/model.test.ts) and [storage](src/comments/storage.test.ts) tests cover conversation transitions, ownership, validation, and storage failures. [Coordinate tests](src/canvas/coordinates.test.ts) cover inverse transforms and pointer-invariant zoom.
- Component tests cover composing, focus and shortcuts, gesture interruption, persistence lifecycle, and retrying a rejected model import.
- [Desktop browser scenarios](e2e/workspace.spec.ts) cover WebGL previews, the conversation workflow, anchor alignment, keyboard placement, malformed storage, and reset confirmation. [Mobile scenarios](e2e/mobile.spec.ts) use Chromium protocol touch events and cover overlay behavior and commenting.
- The [pan performance test](e2e/performance.spec.ts) seeds a populated workspace, confirms its React commit and WebGL counters are active, checks idle rendering, and verifies that panning changes the board transform. Its zero-delta assertions cover React commits and intercepted `drawElements` calls. Long tasks are observations without a pass threshold.

The WebGL counter does not measure all GPU work or every drawing API. The pan scenario does not measure comment-update latency, persistence cost, sidebar rendering latency, or FPS. Its report contains a fixed cloud-browser description; that field alone is not evidence of the actual execution environment.

## Historical performance observation

The earlier cloud report described 200 threads, 600 messages, four board items, and two static WebGL scenes during a 60-step automated pan:

| Metric | Reported observation |
| --- | --- |
| React commits during pan | 0 |
| Additional WebGL draws | 0; the current test counts `drawElements` calls |
| Main-thread long tasks over 50 ms | 0 observed |
| Automation elapsed time | 1,687 ms, including input scheduling; not an FPS measurement |

The report also stated that counters were active and an idle interval produced no extra model draws. The tested revision, exact browser version, and raw performance attachment are unavailable. These observations do not establish a supported document-size limit or predict performance on other devices.

## Historical bundle observation

The earlier build report listed these approximate sizes; the build revision and output log are unavailable:

| Asset | Uncompressed | Gzip |
| --- | --- | --- |
| Interface JavaScript | 362 kB | 115 kB |
| Separately loaded Three.js module | 530 kB | 132 kB |
| CSS | 26 kB | 7 kB |

Vite's default chunk warning above 500 kB was reported. The current Vite configuration has no custom warning threshold. No recorded build ties these sizes to `8572592` or later; remeasure before treating them as current.

## Coverage gaps and future records

Historical browser results cover Chromium and mobile emulation. Physical touch devices, Safari, Firefox, and comprehensive assistive-technology testing were not reported. Development-server browser tests and separately reported production smoke checks do not establish validation of a hosted deployment.

For each new validation run, record the date, tested commit plus any uncommitted changes, OS, Node/Yarn and browser versions, exact commands, outcomes, and paths or links to retained output. Separate checks not run from checks that failed. Record a skipped or blocked check's practical limitation without carrying over a previous pass as its result. For performance runs, include the actual renderer environment and retain the `performance-observation` attachment; for bundle sizes, retain the production build output.
