import { AUTHORS } from './comments.constants';
import type { Workspace } from './comments.types';
import { isValidMessageText } from './message.utils';
import { createSeedWorkspace } from './seed-workspace';
import type { LoadedWorkspace } from './storage.types';

export const STORAGE_KEY = 'formspace.workspace.v1';
const record = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);
const date = (value: unknown) => typeof value === 'string' && Number.isFinite(Date.parse(value));

export function isWorkspace(value: unknown): value is Workspace {
  if (!record(value) || value.version !== 1 || !record(value.threads)) return false;
  return Object.entries(value.threads).every(([id, thread]) => {
    if (
      !id.trim() ||
      !record(thread) ||
      thread.id !== id ||
      !record(thread.anchor) ||
      typeof thread.anchor.x !== 'number' ||
      !Number.isFinite(thread.anchor.x) ||
      typeof thread.anchor.y !== 'number' ||
      !Number.isFinite(thread.anchor.y) ||
      typeof thread.resolved !== 'boolean' ||
      !Array.isArray(thread.messages) ||
      !thread.messages.length
    )
      return false;
    const ids = new Set<string>();
    return thread.messages.every((message: unknown) => {
      if (
        !record(message) ||
        typeof message.id !== 'string' ||
        !message.id ||
        ids.has(message.id) ||
        typeof message.authorId !== 'string' ||
        !Object.hasOwn(AUTHORS, message.authorId) ||
        typeof message.text !== 'string' ||
        !isValidMessageText(message.text) ||
        !date(message.createdAt) ||
        (message.editedAt !== undefined && !date(message.editedAt))
      )
        return false;
      ids.add(message.id);
      return true;
    });
  });
}

export function loadWorkspace(storage: Pick<Storage, 'getItem'>): LoadedWorkspace {
  try {
    const raw = storage.getItem(STORAGE_KEY);
    if (raw === null) return { data: createSeedWorkspace(), blocked: false, error: null };
    const parsed: unknown = JSON.parse(raw);
    if (!isWorkspace(parsed)) throw new Error('Unsupported workspace');
    return { data: parsed, blocked: false, error: null };
  } catch {
    return {
      data: createSeedWorkspace(),
      blocked: true,
      error:
        'Saved data could not be loaded. You can explore a temporary demo; your previous data will not be overwritten. Reset the demo to start saving again.',
    };
  }
}
export function saveWorkspace(storage: Pick<Storage, 'setItem'>, data: Workspace): string | null {
  try {
    storage.setItem(STORAGE_KEY, JSON.stringify(data));
    return null;
  } catch {
    return 'Changes are only in memory: browser storage is unavailable or full. They may be lost when you reload.';
  }
}
