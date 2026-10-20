import { expect, test } from "@playwright/test";
import { createSeedWorkspace } from "../src/comments/seed-workspace";

declare global {
  interface Window {
    __canvasMetrics: { draws: number; commits: number; longTasks: number[] };
  }
}
test("200 threads: pan does not commit React updates or redraw static WebGL models", async ({ page }, testInfo) => {
  // Panning a busy board must avoid unnecessary React and GPU work to stay responsive.
  const seed = createSeedWorkspace();
  const source = seed.threads.volume;

  seed.threads = Object.fromEntries(
    Array.from({ length: 200 }, (_, index) => [
      `load-${index}`,
      {
        ...source,
        id: `load-${index}`,
        anchor: { x: (index % 20) * 40, y: Math.floor(index / 20) * 65 },
        messages: source.messages.map((message) => ({ ...message, id: `${index}-${message.id}` })),
      },
    ]),
  );

  await page.addInitScript((workspace) => {
    localStorage.setItem("formspace.workspace.v1", JSON.stringify(workspace));
    window.__canvasMetrics = { draws: 0, commits: 0, longTasks: [] };
    Object.assign(window, {
      __REACT_DEVTOOLS_GLOBAL_HOOK__: {
        supportsFiber: true,
        renderers: new Map(),
        inject(renderer: unknown) {
          this.renderers.set(1, renderer);
          return 1;
        },
        onCommitFiberRoot: () => {
          window.__canvasMetrics.commits++;
        },
        onCommitFiberUnmount: () => {},
      },
    });

    for (const prototype of [WebGLRenderingContext.prototype, WebGL2RenderingContext.prototype]) {
      const draw = prototype.drawElements;

      prototype.drawElements = function (...args) {
        window.__canvasMetrics.draws++;
        return draw.apply(this, args);
      };
    }

    new PerformanceObserver((list) =>
      window.__canvasMetrics.longTasks.push(...list.getEntries().map((entry) => entry.duration)),
    ).observe({ type: "longtask", buffered: false });
  }, seed);

  await page.goto("/");

  await expect(page.locator(".comment-pin")).toHaveCount(200);
  await expect(page.locator(".thread-preview")).toHaveCount(200);
  await expect(page.locator(".model-render canvas")).toHaveCount(2);
  await expect.poll(() => page.evaluate(() => window.__canvasMetrics.draws)).toBeGreaterThan(0);
  await expect(page.getByText("Saved locally")).toBeVisible();

  // Allow the initial layout/observer render to settle before measuring idle behavior.
  await page.waitForTimeout(200);

  const idle = await page.evaluate(() => ({ ...window.__canvasMetrics }));

  expect(idle.commits).toBeGreaterThan(0);

  await page.waitForTimeout(250);

  expect(await page.evaluate(() => window.__canvasMetrics.draws)).toBe(idle.draws);

  const box = (await page.getByTestId("canvas").boundingBox())!;

  await page.mouse.move(box.x + 100, box.y + box.height - 120);
  await page.mouse.down();

  const before = await page.evaluate(() => {
    window.__canvasMetrics.longTasks = [];
    return { ...window.__canvasMetrics };
  });

  const transformBefore = await page.locator(".canvas-world").getAttribute("style");
  const start = performance.now();
  await page.mouse.move(box.x + 500, box.y + box.height - 180, { steps: 60 });
  await page.mouse.up();
  const after = await page.evaluate(() => ({ ...window.__canvasMetrics }));
  await expect(page.locator(".canvas-world")).not.toHaveAttribute("style", transformBefore!);

  const report = {
    threads: 200,
    messages: 600,
    panSteps: 60,
    elapsedMs: Math.round(performance.now() - start),
    reactCommitsDuringPan: after.commits - before.commits,
    webglDrawsDuringPan: after.draws - before.draws,
    longTasksDuringPan: after.longTasks,
    browser: "Chromium with software WebGL in cloud container",
  };

  await testInfo.attach("performance-observation", {
    body: JSON.stringify(report, null, 2),
    contentType: "application/json",
  });

  console.log("PERFORMANCE", JSON.stringify(report));
  expect(report.reactCommitsDuringPan).toBe(0);
  expect(report.webglDrawsDuringPan).toBe(0);
});
