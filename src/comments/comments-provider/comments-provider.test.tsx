import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { STORAGE_KEY } from '../storage';
import { CommentsProvider } from './comments-provider';
import { Harness } from './harness/harness';

describe('persistence integration', () => {
  it('flushes a recent action on pagehide before the debounce expires', async () => {
    render(
      <CommentsProvider>
        <Harness />
      </CommentsProvider>,
    );
    fireEvent.click(screen.getByText('Add'));
    act(() => window.dispatchEvent(new Event('pagehide')));
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY)!);
    expect(Object.values(stored.threads)).toHaveLength(5);
    expect(JSON.stringify(stored)).toContain('Persist me');
    await waitFor(() => expect(screen.getByText('Saved')).toBeInTheDocument());
  });
  it('does not overwrite corrupt storage until an explicit reset', async () => {
    localStorage.setItem(STORAGE_KEY, 'broken');
    render(
      <CommentsProvider>
        <Harness />
      </CommentsProvider>,
    );
    fireEvent.click(screen.getByText('Add'));
    act(() => window.dispatchEvent(new Event('pagehide')));
    expect(localStorage.getItem(STORAGE_KEY)).toBe('broken');
    expect(screen.getByText(/previous data will not be overwritten/)).toBeInTheDocument();
    fireEvent.click(screen.getByText('Reset'));
    await waitFor(() => expect(screen.getByText('Saved')).toBeInTheDocument());
    expect(Object.keys(JSON.parse(localStorage.getItem(STORAGE_KEY)!).threads)).toHaveLength(4);
  });
});
