import * as TooltipPrimitive from '@radix-ui/react-tooltip';
import { CommentsProvider } from '../comments/comments-provider/comments-provider';
import { Workspace } from './workspace/workspace';

/** Initializes the comment store and tooltip context for the design-review workspace. */
export function App() {
  return (
    <TooltipPrimitive.Provider delayDuration={350}>
      <CommentsProvider>
        <Workspace />
      </CommentsProvider>
    </TooltipPrimitive.Provider>
  );
}
