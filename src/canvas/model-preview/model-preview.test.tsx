import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, expect, it, vi } from 'vitest';
import { BoardItems } from '../board-items/board-items';
import { TestModel } from './test-model/test-model';

afterEach(() => vi.doUnmock('../model/model'));

it('contains a rejected model import and retries it while the rest of the board stays usable', async () => {
  // A failed preview download must not take down the board or prevent recovery.
  // React reports caught errors to the console as well as rendering the boundary fallback.
  vi.spyOn(console, 'error').mockImplementation(() => {});
  vi.doMock('../model/model', () => {
    throw new Error('Model chunk unavailable');
  });
  const user = userEvent.setup();
  render(<BoardItems />);

  await waitFor(() =>
    expect(screen.getAllByRole('button', { name: 'Retry preview' })).toHaveLength(2),
  );
  expect(screen.getByRole('article', { name: '02 — Creative direction' })).toBeInTheDocument();
  expect(screen.getByRole('article', { name: '03 — Material palette' })).toBeInTheDocument();

  vi.doMock('../model/model', () => ({
    Model: TestModel,
  }));
  await user.click(screen.getAllByRole('button', { name: 'Retry preview' })[0]);

  expect(await screen.findByText('Loaded cube preview')).toBeInTheDocument();
  expect(screen.getAllByRole('button', { name: 'Retry preview' })).toHaveLength(1);
  await user.click(screen.getByRole('button', { name: 'Retry preview' }));
  expect(await screen.findByText('Loaded torus preview')).toBeInTheDocument();
  await waitFor(() => expect(screen.queryByRole('button', { name: 'Retry preview' })).toBeNull());
});
