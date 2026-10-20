import { expect, test } from "@playwright/test";

test("renders the board with two real WebGL previews and seeded conversations", async ({ page }) => {
  // A healthy startup needs working WebGL previews and filters, beyond static placeholders.
  const errors: string[] = [];

  page.on("pageerror", (error) => errors.push(error.message));

  await page.goto("/");

  await expect(page.locator(".board-item")).toHaveCount(4);
  await expect(page.locator(".model-render canvas")).toHaveCount(2);
  await expect(page.locator('.model-render[data-unavailable="true"]')).toHaveCount(0);
  await expect(page.locator(".thread-preview")).toHaveCount(3);

  await page.getByRole("button", { name: "Resolved 1", exact: true }).click();

  await expect(page.locator(".thread-preview")).toHaveCount(1);

  await page.getByRole("button", { name: "All 4", exact: true }).click();

  await expect(page.locator(".thread-preview")).toHaveCount(4);
  expect(errors).toEqual([]);
});

test("creates, replies, edits, resolves, reloads and reopens a conversation", async ({ page }) => {
  // The complete review flow must retain feedback and status changes across reloads.
  await page.goto("/");

  await page.getByRole("button", { name: "Comment tool", exact: true }).click();
  const canvas = page.getByTestId("canvas");

  await canvas.click({ position: { x: 115, y: 260 } });
  await page.getByRole("textbox", { name: "New comment text", exact: true }).fill("A new thought\nWith context");

  await page.getByRole("button", { name: "Send comment", exact: true }).click();
  await expect(page.locator(".message-text")).toHaveText(["A new thought\nWith context"]);
  await expect(page.getByRole("button", { name: "Navigation tool", exact: true })).toHaveAttribute(
    "aria-pressed",
    "true",
  );

  await page.getByRole("textbox", { name: "Reply text", exact: true }).fill("Following up");
  await page.getByRole("button", { name: "Send comment", exact: true }).click();
  await expect(page.locator(".message")).toHaveCount(2);
  await page.getByRole("button", { name: "Edit comment", exact: true }).first().click();
  await page
    .getByRole("textbox", { name: "Edit comment text", exact: true })
    .fill("An edited thought\nStill multiline");
  await page.getByRole("button", { name: "Save edit", exact: true }).click();

  await expect(page.locator(".message-text").first()).toHaveText("An edited thought\nStill multiline");

  await expect(page.locator(".message time").first()).toContainText("edited");

  await page.getByRole("button", { name: "Resolve", exact: true }).click();

  await expect(page.getByRole("button", { name: "Reopen", exact: true })).toBeVisible();

  // Reload immediately: pagehide must flush even inside the debounce interval.
  await page.reload();

  await page.getByRole("button", { name: "Resolved 2", exact: true }).click();

  await page.locator(".thread-preview").filter({ hasText: "An edited thought" }).click();
  await expect(page.locator(".message-text")).toHaveText(["An edited thought\nStill multiline", "Following up"]);

  await page.getByRole("button", { name: "Reopen", exact: true }).click();
  await expect(page.getByRole("button", { name: "Resolve", exact: true })).toBeVisible();
});

test("only exposes editing for owned messages and Escape cancels an edit", async ({ page }) => {
  // Edit controls must respect authorship, and cancellation must preserve the saved message.
  await page.goto("/");

  await page.getByTestId("thread-volume").click();

  const comments = page.locator(".message");

  await expect(comments).toHaveCount(3);
  await expect(comments.nth(0).getByRole("button", { name: "Edit comment" })).toHaveCount(0);
  await expect(comments.nth(1).getByRole("button", { name: "Edit comment" })).toHaveCount(1);
  await expect(comments.nth(2).getByRole("button", { name: "Edit comment" })).toHaveCount(0);

  await comments.nth(1).getByRole("button", { name: "Edit comment" }).click();
  await page.getByRole("textbox", { name: "Edit comment text" }).fill("Discard this");
  await page.keyboard.press("Escape");

  await expect(page.getByRole("textbox", { name: "Edit comment text" })).toHaveCount(0);
  await expect(page.locator(".message-text").nth(1)).toContainText("warmer option");
  await expect(page.getByRole("dialog")).toBeVisible();
});

test("keeps pin anchors aligned during pan, pointer zoom and fit", async ({ page }) => {
  // A drifting pin would make feedback point to the wrong part of the design.
  await page.goto("/");
  const canvas = page.getByTestId("canvas");

  const anchorError = async () =>
    page.evaluate(() => {
      const canvas = document.querySelector<HTMLElement>('[data-testid="canvas"]')!;
      const world = document.querySelector<HTMLElement>(".canvas-world")!;
      const pin = document.querySelector<HTMLElement>('[data-testid="pin-volume"]')!;
      const transform = new DOMMatrix(getComputedStyle(world).transform);
      const expected = new DOMPoint(315, 105).matrixTransform(transform);
      const a = canvas.getBoundingClientRect(),
        b = pin.getBoundingClientRect();
      return Math.hypot(b.x + b.width / 2 - a.x - expected.x, b.bottom - a.y - expected.y);
    });

  await expect.poll(anchorError).toBeLessThan(1);

  const box = (await canvas.boundingBox())!;

  await page.mouse.move(box.x + 110, box.y + 250);
  await page.mouse.down();
  await page.mouse.move(box.x + 230, box.y + 310, { steps: 8 });
  await page.mouse.up();

  await expect.poll(anchorError).toBeLessThan(1);

  const beforeZoom = await canvas.getAttribute("data-zoom");

  await page.keyboard.down("Control");
  await page.mouse.wheel(0, -80);
  await page.keyboard.up("Control");

  await expect(canvas).not.toHaveAttribute("data-zoom", beforeZoom!);
  await expect.poll(anchorError).toBeLessThan(1);

  await page.getByRole("button", { name: "Fit content", exact: true }).click();

  await expect.poll(anchorError).toBeLessThan(1);
});

test("supports keyboard placement and cancelling leaves no saved pin", async ({ page }) => {
  // Commenting must work without a pointer, and cancelled drafts must not leave stray pins.
  await page.goto("/");

  await page.keyboard.press("c");

  await expect(page.getByTestId("canvas")).toBeFocused();

  await page.keyboard.press("Enter");

  await expect(page.getByRole("textbox", { name: "New comment text" })).toBeFocused();

  await page.getByRole("button", { name: "Cancel", exact: true }).click();

  await expect(page.locator(".comment-pin")).toHaveCount(4);
  await expect(page.getByRole("textbox", { name: "New comment text" })).toHaveCount(0);

  await page.keyboard.press("c");
  await page.keyboard.press("Enter");
  await page.getByRole("textbox", { name: "New comment text" }).fill("Keyboard comment");
  await page.keyboard.press("Control+Enter");

  await expect(page.locator(".message-text")).toHaveText("Keyboard comment");
});

test("preserves malformed storage and reset requires confirmation", async ({ page }) => {
  // Recovering from bad storage must not erase existing work without confirmation.
  await page.addInitScript(() => {
    if (localStorage.getItem("formspace.workspace.v1") === null)
      localStorage.setItem("formspace.workspace.v1", "broken");
  });

  await page.goto("/");

  await expect(page.getByRole("alert")).toContainText("not be overwritten");

  expect(await page.evaluate(() => localStorage.getItem("formspace.workspace.v1"))).toBe("broken");

  await page.getByRole("button", { name: "Workspace menu" }).click();
  await page.getByRole("menuitem", { name: "Reset demo…" }).click();
  await expect(page.getByRole("alertdialog")).toBeVisible();
  await page.getByRole("button", { name: "Keep my work" }).click();

  expect(await page.evaluate(() => localStorage.getItem("formspace.workspace.v1"))).toBe("broken");

  await page.getByRole("button", { name: "Workspace menu" }).click();
  await page.getByRole("menuitem", { name: "Reset demo…" }).click();
  await page.getByRole("button", { name: "Reset demo", exact: true }).click();
  await expect(page.getByRole("alert")).toHaveCount(0);
  await expect(page.getByText("Saved locally")).toBeVisible();

  expect(await page.evaluate(() => JSON.parse(localStorage.getItem("formspace.workspace.v1")!).version)).toBe(1);
});
