import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { stubResizeObserver } from '../test/browser-stubs';
import { App } from './app';

vi.mock('../canvas/board-items/board-items', () => ({ BoardItems: () => null }));

let mobile = false;
beforeEach(() => {
  mobile = false;
  stubResizeObserver();
  vi.stubGlobal('matchMedia', () => ({
    matches: mobile,
    addEventListener() {},
    removeEventListener() {},
  }));
});
afterEach(() => vi.unstubAllGlobals());

describe('canvas keyboard navigation', () => {
  it.each([
    { key: '-', ctrlKey: true },
    { key: '+', ctrlKey: true },
    { key: '=', ctrlKey: true },
    { key: '0', ctrlKey: true },
    { key: '-', metaKey: true },
    { key: '+', metaKey: true },
    { key: '=', metaKey: true },
    { key: '0', metaKey: true },
    { key: 'ArrowLeft', altKey: true },
    { key: '-', isComposing: true },
  ])('preserves modified or composing keyboard input: %j', async (keys) => {
    // Canvas shortcuts must preserve browser accessibility controls and text composition.
    render(<App />);
    const canvas = screen.getByTestId('canvas');
    canvas.focus();
    const world = canvas.querySelector('.canvas-world');
    const transform = world?.getAttribute('style');
    const event = new KeyboardEvent('keydown', { ...keys, bubbles: true, cancelable: true });

    fireEvent(canvas, event);

    expect(event.defaultPrevented).toBe(false);
    await act(() => new Promise<void>((resolve) => requestAnimationFrame(() => resolve())));
    expect(world).toHaveAttribute('style', transform);
    expect(canvas).toHaveAttribute('data-zoom', '1');
  });

  it('still zooms with Shift+plus', async () => {
    // Typing + requires Shift on many keyboards, so modifier filtering must allow it.
    render(<App />);
    const canvas = screen.getByTestId('canvas');
    canvas.focus();
    const event = new KeyboardEvent('keydown', {
      key: '+',
      shiftKey: true,
      bubbles: true,
      cancelable: true,
    });
    fireEvent(canvas, event);
    expect(event.defaultPrevented).toBe(true);
    await waitFor(() => expect(canvas).toHaveAttribute('data-zoom', '1.2'));
  });
});

describe('sidebar focus and keyboard interactions', () => {
  it.each([
    { narrow: false, via: 'header' },
    { narrow: false, via: 'close button' },
    { narrow: true, via: 'close button' },
  ])('preserves drafts when hidden using $via (mobile: $narrow)', async ({ narrow, via }) => {
    // Hiding the panel must not discard unsent feedback or detach it from its pin.
    mobile = narrow;
    const user = userEvent.setup();
    render(<App />);
    await user.keyboard('c{Enter}');
    await user.type(
      screen.getByRole('textbox', { name: 'New comment text' }),
      'Unsent feedback{Enter}With context',
    );
    await user.click(
      screen.getByRole('button', { name: via === 'header' ? 'Hide comments' : 'Close comments' }),
    );

    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
    expect(screen.getByRole('img', { name: 'Draft comment location' })).toBeInTheDocument();
    await waitFor(() =>
      expect(screen.getByRole('button', { name: 'Show comments' })).toHaveFocus(),
    );
    await user.click(screen.getByRole('button', { name: 'Show comments' }));
    expect(screen.getByRole('textbox', { name: 'New comment text' })).toHaveValue(
      'Unsent feedback\nWith context',
    );

    await user.click(screen.getByRole('button', { name: 'Send comment' }));
    expect(
      screen.getByText('Unsent feedback\nWith context', { collapseWhitespace: false }),
    ).toBeInTheDocument();
    expect(screen.queryByRole('img', { name: 'Draft comment location' })).not.toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Back to comments' }));
    await user.click(screen.getByRole('button', { name: /Add a comment/ }));
    await waitFor(() => expect(screen.getByTestId('canvas')).toHaveFocus());
    await user.keyboard('{Enter}');
    expect(screen.getByRole('textbox', { name: 'New comment text' })).toHaveValue('');
  });

  it.each(['Cancel', 'Escape'])('discards the draft only when cancelled using %s', async (via) => {
    // Explicit cancellation must clear both text and location before the next draft.
    const user = userEvent.setup();
    render(<App />);
    await user.keyboard('c{Enter}');
    await user.type(
      screen.getByRole('textbox', { name: 'New comment text' }),
      'Discard this draft',
    );
    if (via === 'Escape') await user.keyboard('{Escape}');
    else await user.click(screen.getByRole('button', { name: 'Cancel' }));

    expect(screen.queryByRole('img', { name: 'Draft comment location' })).not.toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: /Add a comment/ }));
    await user.keyboard('{Enter}');
    expect(screen.getByRole('textbox', { name: 'New comment text' })).toHaveValue('');
  });

  it.each(['close button', 'Escape'])(
    'restores focus after mobile dismissal using %s',
    async (via) => {
      // Returning focus keeps keyboard users oriented after the modal disappears.
      mobile = true;
      const user = userEvent.setup();
      render(<App />);
      const toggle = screen.getByRole('button', { name: 'Show comments' });
      await user.click(toggle);
      expect(screen.getByRole('dialog')).toBeInTheDocument();

      if (via === 'Escape') await user.keyboard('{Escape}');
      else await user.click(screen.getByRole('button', { name: 'Close comments' }));

      await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
      await waitFor(() => expect(toggle).toHaveFocus());
    },
  );

  it('focuses the board after mobile Add a comment and supports Enter placement', async () => {
    // Releasing the modal's focus trap must leave keyboard comment placement usable.
    mobile = true;
    const user = userEvent.setup();
    render(<App />);
    await user.click(screen.getByRole('button', { name: 'Show comments' }));
    await user.click(screen.getByRole('button', { name: /Add a comment/ }));

    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
    await waitFor(() => expect(screen.getByTestId('canvas')).toHaveFocus());
    await user.keyboard('{Enter}');
    expect(screen.getByRole('textbox', { name: 'New comment text' })).toHaveFocus();

    // Later dismissals must not reuse a stale focus destination.
    await user.click(screen.getByRole('button', { name: 'Close comments' }));
    await waitFor(() =>
      expect(screen.getByRole('button', { name: 'Show comments' })).toHaveFocus(),
    );
  });

  it.each(['textarea', 'Cancel', 'Save edit'])(
    'Escape cancels editing from %s without leaving the thread',
    async (target) => {
      // Tabbing within the editor must not disable cancellation or dismiss the whole thread.
      const user = userEvent.setup();
      render(<App />);
      await user.click(screen.getByTestId('thread-direction'));
      await user.click(screen.getByRole('button', { name: 'Edit comment' }));
      const editor = screen.getByRole('textbox', { name: 'Edit comment text' });
      await user.clear(editor);
      await user.type(editor, 'Discard this edit');
      if (target !== 'textarea') await user.tab();
      if (target === 'Save edit') await user.tab();
      expect(
        target === 'textarea' ? editor : screen.getByRole('button', { name: target }),
      ).toHaveFocus();

      await user.keyboard('{Escape}');

      expect(screen.queryByRole('textbox', { name: 'Edit comment text' })).not.toBeInTheDocument();
      expect(screen.getByRole('heading', { name: 'Thread 2' })).toBeInTheDocument();
      expect(screen.queryByText('Discard this edit')).not.toBeInTheDocument();
      expect(screen.getByText(/The headline is working well/)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Edit comment' })).toHaveFocus();
    },
  );

  it.each(['Save edit', 'Cancel'])('restores Edit button focus after %s', async (action) => {
    // Replacing the editor must leave keyboard users at the message they were editing.
    const user = userEvent.setup();
    render(<App />);
    await user.click(screen.getByTestId('thread-direction'));
    await user.click(screen.getByRole('button', { name: 'Edit comment' }));
    const editor = screen.getByRole('textbox', { name: 'Edit comment text' });
    const original = (editor as HTMLTextAreaElement).value;
    await user.clear(editor);
    await user.type(editor, 'Revised feedback');
    await user.click(screen.getByRole('button', { name: action }));

    expect(screen.queryByRole('textbox', { name: 'Edit comment text' })).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Edit comment' })).toHaveFocus();
    expect(
      screen.getByText(action === 'Save edit' ? 'Revised feedback' : original),
    ).toBeInTheDocument();
  });
});
