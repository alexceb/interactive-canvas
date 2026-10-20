import { useCallback, useSyncExternalStore } from 'react';
import { MOBILE_QUERY } from './workspace.constants';

// Tracks whether the viewport matches the narrow layout used for modal comments.
export function useMobile() {
  return useSyncExternalStore(
    useCallback((listener) => {
      const query = window.matchMedia(MOBILE_QUERY);
      query.addEventListener('change', listener);

      return () => query.removeEventListener('change', listener);
    }, []),
    () => window.matchMedia(MOBILE_QUERY).matches,
  );
}
