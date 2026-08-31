import { useSyncExternalStore } from "react";

/** Never changes, so the store never notifies - it just flips false -> true. */
const noopSubscribe = () => () => {};

/**
 * False during server rendering and on the very first client render, true
 * afterwards.
 *
 * Anything that depends on the visitor's environment (motion preference,
 * viewport size) has to wait for this, otherwise the server HTML and the first
 * client render disagree and React reports a hydration mismatch.
 */
export function useMounted(): boolean {
  return useSyncExternalStore(
    noopSubscribe,
    () => true,
    () => false,
  );
}
