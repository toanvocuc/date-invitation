"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
  type RefObject,
} from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import {
  clampToViewport,
  computeEscapePosition,
  rectFromElement,
  shouldDodge,
  type Point,
  type Rect,
} from "@/lib/dodge";
import {
  DODGE_CONFIG,
  ESCAPE_COOLDOWN_MS,
  getNoButtonLabel,
} from "@/data/noButton";
import { useIsomorphicLayoutEffect } from "@/lib/useIsomorphicLayoutEffect";

interface DodgingNoButtonProps {
  /** The YES button - the NO button must never land on top of it. */
  avoidRef: RefObject<HTMLElement | null>;
  /** Fade the button out (used while the YES celebration plays). */
  hidden?: boolean;
  onEscape?: (escapes: number) => void;
}

/**
 * A NO button that cannot be clicked.
 *
 * It lives in a portal on the document body because ancestors with a transform
 * or a backdrop-filter (the stage transition, the frosted card) would otherwise
 * turn "position: fixed" into "fixed relative to that ancestor", which lets the
 * button be pushed outside the screen.
 *
 * A same-sized slot stays in the layout so nothing shifts when it flies off.
 */
export default function DodgingNoButton({
  avoidRef,
  hidden = false,
  onEscape,
}: DodgingNoButtonProps) {
  const slotRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const lastEscapeAt = useRef(0);
  const frame = useRef<number | null>(null);
  const hasEscaped = useRef(false);
  const lastCursor = useRef<Point | null>(null);
  const targetPosition = useRef<Point | null>(null);

  const [position, setPosition] = useState<Point | null>(null);
  const [escapes, setEscapes] = useState(0);

  /** Park the button exactly on top of its layout slot. */
  const snapToSlot = useCallback(() => {
    const slot = slotRef.current;
    if (!slot) return;
    const rect = slot.getBoundingClientRect();
    targetPosition.current = { x: rect.left, y: rect.top };
    setPosition(targetPosition.current);
  }, []);

  // Measured before paint so the button never flashes in the wrong place.
  useIsomorphicLayoutEffect(() => {
    snapToSlot();
  }, [snapToSlot]);

  /** Move to a safe spot. Does not count as an escape on its own. */
  const relocate = useCallback(
    (cursor: Point, buttonRect: Rect) => {
      const avoidElement = avoidRef.current;
      const avoid: Rect[] = avoidElement ? [rectFromElement(avoidElement)] : [];

      const next = computeEscapePosition({
        button: buttonRect,
        cursor,
        avoid,
        viewport: { width: window.innerWidth, height: window.innerHeight },
        config: DODGE_CONFIG,
      });

      hasEscaped.current = true;
      targetPosition.current = next;
      setPosition(next);
    },
    [avoidRef],
  );

  const runAway = useCallback(
    (cursor: Point) => {
      const button = buttonRef.current;
      if (!button) return;

      const now = Date.now();
      if (now - lastEscapeAt.current < ESCAPE_COOLDOWN_MS) return;
      lastEscapeAt.current = now;
      lastCursor.current = cursor;

      relocate(cursor, rectFromElement(button));
      setEscapes((count) => {
        const total = count + 1;
        onEscape?.(total);
        return total;
      });
    },
    [onEscape, relocate],
  );

  /** Proximity detection for anything with a real pointer (mouse / trackpad). */
  useEffect(() => {
    const handleMove = (event: PointerEvent) => {
      // Touch is handled on tap instead - fingers have no hover state.
      if (event.pointerType === "touch") return;

      const cursor = { x: event.clientX, y: event.clientY };
      lastCursor.current = cursor;
      if (frame.current !== null) cancelAnimationFrame(frame.current);
      frame.current = requestAnimationFrame(() => {
        frame.current = null;
        const button = buttonRef.current;
        if (!button) return;
        const rect = rectFromElement(button);
        if (shouldDodge(rect, cursor, DODGE_CONFIG.dangerRadius)) {
          runAway(cursor);
        }
      });
    };

    window.addEventListener("pointermove", handleMove, { passive: true });
    return () => {
      window.removeEventListener("pointermove", handleMove);
      if (frame.current !== null) cancelAnimationFrame(frame.current);
    };
  }, [runAway]);

  /** Stay inside the viewport when the window is resized or rotated. */
  useEffect(() => {
    const handleResize = () => {
      const button = buttonRef.current;
      if (!hasEscaped.current || !button) {
        snapToSlot();
        return;
      }
      const rect = rectFromElement(button);
      const clamped = clampToViewport(
        { x: rect.x, y: rect.y },
        { width: rect.width, height: rect.height },
        { width: window.innerWidth, height: window.innerHeight },
        DODGE_CONFIG.viewportPadding,
      );
      targetPosition.current = clamped;
      setPosition(clamped);
    };

    window.addEventListener("resize", handleResize);
    window.addEventListener("orientationchange", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("orientationchange", handleResize);
    };
  }, [snapToSlot]);

  /** Escape from wherever the finger or mouse actually landed. */
  const escapeFromPointer = useCallback(
    (event: ReactPointerEvent<HTMLButtonElement>) => {
      event.preventDefault();
      event.stopPropagation();
      runAway({ x: event.clientX, y: event.clientY });
    },
    [runAway],
  );

  /** Keyboard activation: bounce off in a random direction, never proceed. */
  const escapeFromCenter = useCallback(() => {
    const button = buttonRef.current;
    if (!button) return;
    const rect = rectFromElement(button);
    lastEscapeAt.current = 0;
    runAway({ x: rect.x + rect.width / 2, y: rect.y + rect.height / 2 });
  }, [runAway]);

  const label = getNoButtonLabel(escapes);

  /*
   * A longer label makes the button wider, which can push it off the right edge
   * or back into the space the cursor occupies. Re-check both once the new text
   * has been laid out. This never increments the escape counter, so it cannot
   * feed back into itself.
   */
  useEffect(() => {
    const button = buttonRef.current;
    const target = targetPosition.current;
    if (!hasEscaped.current || !button || !target) return;

    const box = button.getBoundingClientRect();
    const size = { width: box.width, height: box.height };
    const viewport = { width: window.innerWidth, height: window.innerHeight };

    const clamped = clampToViewport(
      target,
      size,
      viewport,
      DODGE_CONFIG.viewportPadding,
    );
    const grown: Rect = { ...clamped, ...size };

    const cursor = lastCursor.current;
    if (cursor && shouldDodge(grown, cursor, DODGE_CONFIG.dangerRadius)) {
      relocate(cursor, grown);
      return;
    }

    if (clamped.x !== target.x || clamped.y !== target.y) {
      targetPosition.current = clamped;
      setPosition(clamped);
    }
  }, [label, relocate]);

  // MotionConfig turns this into an instant move for visitors who asked for
  // reduced motion; the button keeps dodging either way.
  const springTransition = {
    type: "spring" as const,
    stiffness: 340,
    damping: 20,
    mass: 0.7,
  };

  const floatingButton = (
    <motion.button
      ref={buttonRef}
      type="button"
      // There is deliberately no handler here that navigates anywhere.
      onPointerDown={escapeFromPointer}
      onClick={(event) => {
        event.preventDefault();
        event.stopPropagation();
        escapeFromCenter();
      }}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          escapeFromCenter();
        }
      }}
      onContextMenu={(event) => event.preventDefault()}
      aria-label="No - this button runs away, it never continues"
      style={{
        position: "fixed",
        left: 0,
        top: 0,
        touchAction: "none",
        zIndex: 50,
      }}
      initial={false}
      animate={{
        x: position?.x ?? 0,
        y: position?.y ?? 0,
        opacity: hidden ? 0 : 1,
        scale: hidden ? 0.85 : 1,
      }}
      transition={{
        x: springTransition,
        y: springTransition,
        opacity: { duration: 0.25 },
        scale: { duration: 0.25 },
      }}
      className="inline-flex min-h-12 items-center justify-center rounded-full border border-blush-200 bg-white/95 px-7 text-sm font-semibold whitespace-nowrap text-plum-600 shadow-[0_12px_28px_-16px_rgba(120,70,95,0.8)] select-none"
    >
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={label}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.18 }}
        >
          {label}
        </motion.span>
      </AnimatePresence>
    </motion.button>
  );

  return (
    <>
      {/* Reserves the space the button occupied before it started running. */}
      <div ref={slotRef} aria-hidden="true" className="h-12 w-[132px]" />
      {position !== null && typeof document !== "undefined"
        ? createPortal(floatingButton, document.body)
        : null}
    </>
  );
}
