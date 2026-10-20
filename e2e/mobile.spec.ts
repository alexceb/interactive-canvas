import { expect, test } from '@playwright/test';

test('mobile navigation, overlay, commenting and persistence are usable', async ({ page }) => {
  // Touch gestures and overlays must support the full review flow on a narrow screen.
  await page.goto('/');

  await expect(page.getByRole('dialog')).toHaveCount(0);
  await expect(page.getByRole('img', { name: /^Static 3D / }).locator('canvas')).toHaveCount(2);

  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);

  const initial = await page.getByTestId('canvas-world').getAttribute('style');
  const session = await page.context().newCDPSession(page);

  await session.send('Input.dispatchTouchEvent', {
    type: 'touchStart',
    touchPoints: [{ x: 100, y: 250 }],
  });

  await session.send('Input.dispatchTouchEvent', {
    type: 'touchMove',
    touchPoints: [{ x: 145, y: 290 }],
  });

  await session.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });

  await expect(page.getByTestId('canvas-world')).not.toHaveAttribute('style', initial!);

  const beforeZoom = await page.getByTestId('canvas').getAttribute('data-zoom');

  await session.send('Input.dispatchTouchEvent', {
    type: 'touchStart',
    touchPoints: [
      { x: 120, y: 250 },
      { x: 240, y: 250 },
    ],
  });

  await session.send('Input.dispatchTouchEvent', {
    type: 'touchMove',
    touchPoints: [
      { x: 80, y: 250 },
      { x: 280, y: 250 },
    ],
  });

  await session.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });

  await expect(page.getByTestId('canvas')).not.toHaveAttribute('data-zoom', beforeZoom!);

  await page.getByRole('button', { name: 'Show comments' }).tap();

  await expect(page.getByRole('dialog')).toBeVisible();

  await page.getByTestId('thread-direction').tap();

  await expect(page.getByRole('article', { name: /^Comment by / })).toHaveCount(2);

  await page.getByRole('button', { name: 'Close comments' }).tap();
  await page.getByRole('button', { name: 'Comment tool', exact: true }).tap();
  await page.getByTestId('canvas').tap({ position: { x: 180, y: 280 } });
  await page.getByRole('textbox', { name: 'New comment text' }).fill('A mobile thought');
  await page.getByRole('button', { name: 'Send comment', exact: true }).tap();

  await expect(page.getByRole('article', { name: /^Comment by / }).locator('p')).toHaveText(
    'A mobile thought',
  );

  await page.reload();

  await page.getByRole('button', { name: 'Show comments' }).tap();
  await expect(page.getByTestId(/^thread-/).filter({ hasText: 'A mobile thought' })).toBeVisible();
});

test('mobile overlay dismisses from outside and fit restores navigation', async ({ page }) => {
  // Users must be able to leave the overlay and recover the board after zooming.
  await page.goto('/');
  await page.getByRole('button', { name: 'Show comments' }).tap();

  await expect(page.getByRole('dialog')).toBeVisible();

  await page.getByTestId('sidebar-scrim').tap({ position: { x: 5, y: 100 } });

  await expect(page.getByRole('dialog')).toHaveCount(0);

  await page.getByRole('button', { name: 'Zoom in', exact: true }).tap();
  await page.getByRole('button', { name: 'Fit content', exact: true }).tap();

  await expect(page.getByTestId('pin-volume')).toBeVisible();
});
