import { describe, expect, it, vi } from 'vitest';
import { createSeedWorkspace } from './seed-workspace';
import { isWorkspace, loadWorkspace, STORAGE_KEY, saveWorkspace } from './storage';

describe('workspace persistence', () => {
  it.each(['', '   ', '\t\n'])('preserves saved data with an invalid blank thread ID: %j', (id) => {
    const seed = createSeedWorkspace();
    const data = { version: 1, threads: { [id]: { ...seed.threads.volume, id } } };
    const raw = JSON.stringify(data);
    localStorage.setItem(STORAGE_KEY, raw);

    expect(isWorkspace(data)).toBe(false);
    const loaded = loadWorkspace(localStorage);
    expect(loaded.blocked).toBe(true);
    expect(loaded.error).toContain('not be overwritten');
    expect(localStorage.getItem(STORAGE_KEY)).toBe(raw);
  });

  it('seeds an unused browser and round-trips multiline content', () => {
    expect(Object.keys(loadWorkspace(localStorage).data.threads)).toHaveLength(4);
    const data = createSeedWorkspace();
    data.threads.volume.messages[0].text = 'First line\nSecond line';
    expect(saveWorkspace(localStorage, data)).toBeNull();
    expect(loadWorkspace(localStorage)).toEqual({ data, blocked: false, error: null });
  });
  it.each(['not-json', '{"version":2,"threads":{}}', '{"version":1,"threads":{"broken":{}}}'])(
    'preserves unreadable or unsupported saved data',
    (raw) => {
      localStorage.setItem(STORAGE_KEY, raw);
      const loaded = loadWorkspace(localStorage);
      expect(loaded.blocked).toBe(true);
      expect(loaded.error).toContain('not be overwritten');
      expect(localStorage.getItem(STORAGE_KEY)).toBe(raw);
    },
  );
  it('accepts an empty valid workspace without reseeding it', () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ version: 1, threads: {} }));
    expect(loadWorkspace(localStorage).data.threads).toEqual({});
  });
  it('reports storage access and quota failures', () => {
    const unavailable = {
      getItem: vi.fn(() => {
        throw new Error('denied');
      }),
    };
    expect(loadWorkspace(unavailable).blocked).toBe(true);
    const full = {
      setItem: vi.fn(() => {
        throw new Error('quota');
      }),
    };
    expect(saveWorkspace(full, createSeedWorkspace())).toContain('only in memory');
  });
  it('rejects invalid anchors, authors, duplicate message IDs, and timestamps', () => {
    const data = createSeedWorkspace();
    const invalids = [
      { ...data, threads: { volume: { ...data.threads.volume, anchor: { x: Infinity, y: 0 } } } },
      {
        ...data,
        threads: {
          volume: {
            ...data.threads.volume,
            messages: [{ ...data.threads.volume.messages[0], authorId: 'unknown' }],
          },
        },
      },
      {
        ...data,
        threads: {
          volume: {
            ...data.threads.volume,
            messages: [data.threads.volume.messages[0], data.threads.volume.messages[0]],
          },
        },
      },
      {
        ...data,
        threads: {
          volume: {
            ...data.threads.volume,
            messages: [{ ...data.threads.volume.messages[0], createdAt: 'bad-date' }],
          },
        },
      },
    ];
    invalids.forEach((value) => {
      expect(isWorkspace(value)).toBe(false);
    });
  });
});
