import { useCommentActions, useComments, usePersistence } from '../use-comments';

// Exposes provider actions and save state for persistence integration tests.
export function Harness() {
  const { addThread, reset } = useCommentActions();
  const { threads } = useComments();
  const { error, saved } = usePersistence();
  return (
    <>
      <button type="button" onClick={() => addThread({ x: -15, y: 40 }, 'Persist me')}>
        Add
      </button>
      <button type="button" onClick={reset}>
        Reset
      </button>
      <output>{Object.keys(threads).length}</output>
      <span>{error || (saved ? 'Saved' : 'Saving')}</span>
    </>
  );
}
