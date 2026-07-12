import { useEffect, useState } from "react";

// Tiny reusable responsiveness hook backed by window.matchMedia.
// Returns true whenever the given media query currently matches.
// Listener is registered on mount and cleaned up on unmount / query change.
function getMatches(query: string): boolean {
  if (typeof window === "undefined" || !window.matchMedia) return false;
  return window.matchMedia(query).matches;
}

function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState<boolean>(() => getMatches(query));
  // Track the query the current `matches` value was computed for.
  const [lastQuery, setLastQuery] = useState<string>(query);

  // Re-sync during render (not in an effect) when `query` changes, so the
  // returned value is correct on the very first render after the change.
  if (query !== lastQuery) {
    setLastQuery(query);
    setMatches(getMatches(query));
  }

  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;
    const mql = window.matchMedia(query);
    const onChange = (event: MediaQueryListEvent) => setMatches(event.matches);
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, [query]);

  return matches;
}

export default useMediaQuery;
