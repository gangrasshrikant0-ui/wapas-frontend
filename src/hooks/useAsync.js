import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * Runs an async function on mount and whenever `deps` change.
 * Previous data is kept while reloading, so refreshes do not flash skeletons.
 */
export function useAsync(fn, deps = []) {
  const [state, setState] = useState({ data: null, error: null, loading: true });
  const requestId = useRef(0);
  const fnRef = useRef(fn);
  fnRef.current = fn;

  const run = useCallback(async () => {
    const id = ++requestId.current;
    setState((s) => ({ ...s, loading: true, error: null }));
    try {
      const data = await fnRef.current();
      if (id === requestId.current) setState({ data, error: null, loading: false });
    } catch (error) {
      if (id === requestId.current) setState((s) => ({ ...s, error, loading: false }));
    }
  }, []);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { run(); }, deps);

  return {
    ...state,
    reload: run,
    initialLoading: state.loading && state.data === null,
    failed: Boolean(state.error) && state.data === null,
  };
}
