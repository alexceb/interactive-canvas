import * as TooltipPrimitive from '@radix-ui/react-tooltip';
import { CommentsProvider } from '../comments/comments-provider/comments-provider';
import { Workspace } from './workspace/workspace';

// Provides tooltip and comment contexts for the workspace.
export function App() {
  return (
    <TooltipPrimitive.Provider delayDuration={350}>
      <CommentsProvider>
        <Workspace />
      </CommentsProvider>
    </TooltipPrimitive.Provider>
  );
}
