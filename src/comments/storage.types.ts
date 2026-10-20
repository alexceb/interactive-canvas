import type { Workspace } from './comments.types';
export interface LoadedWorkspace {
  data: Workspace;
  blocked: boolean;
  error: string | null;
}
