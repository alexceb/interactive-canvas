import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Composer } from './composer';

describe('comment composer', () => {
  it('rejects whitespace and preserves line breaks when submitting', async () => {
    const user = userEvent.setup();
    const submit = vi.fn();
    render(<Composer onSubmit={submit} />);
    expect(screen.getByRole('button', { name: 'Send comment' })).toBeDisabled();
    await user.type(screen.getByRole('textbox'), '   ');
    expect(screen.getByRole('button', { name: 'Send comment' })).toBeDisabled();
    await user.clear(screen.getByRole('textbox'));
    await user.type(screen.getByRole('textbox'), 'First line{Enter}Second line');
    expect(submit).not.toHaveBeenCalled();
    await user.click(screen.getByRole('button', { name: 'Send comment' }));
    expect(submit).toHaveBeenCalledWith('First line\nSecond line');
    expect(screen.getByRole('textbox')).toHaveValue('');
  });
  it('submits with Ctrl+Enter and cancels an edit with Escape', async () => {
    const user = userEvent.setup();
    const submit = vi.fn(),
      cancel = vi.fn();
    render(<Composer editing initialText="Original" onSubmit={submit} onCancel={cancel} />);
    await user.click(screen.getByRole('textbox'));
    await user.keyboard('{Control>}{Enter}{/Control}');
    expect(submit).toHaveBeenCalledWith('Original');
    await user.keyboard('{Escape}');
    expect(cancel).toHaveBeenCalledOnce();
  });
  it('keeps the accessible label independent of placeholder copy', () => {
    const { rerender } = render(
      <Composer onSubmit={vi.fn()} label="New comment text" placeholder="Share an idea…" />,
    );
    expect(screen.getByRole('textbox', { name: 'New comment text' })).toHaveAttribute(
      'placeholder',
      'Share an idea…',
    );
    rerender(
      <Composer onSubmit={vi.fn()} label="New comment text" placeholder="Leave feedback…" />,
    );
    expect(screen.getByRole('textbox', { name: 'New comment text' })).toHaveAttribute(
      'placeholder',
      'Leave feedback…',
    );
  });
});
