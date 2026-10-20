import { createSeedWorkspace } from '../seed-workspace';
import { loadWorkspace } from '../storage';
import type { LoadedWorkspace } from '../storage.types';
import { STORAGE_UNAVAILABLE_MESSAGE } from './comments-provider.constants';

// Loads browser data or returns a protected temporary demo if storage access fails.
export function loadInitialWorkspace(): LoadedWorkspace {
  try {
    return loadWorkspace(window.localStorage);
  } catch {
    return { data: createSeedWorkspace(), blocked: true, error: STORAGE_UNAVAILABLE_MESSAGE };
  }
}
