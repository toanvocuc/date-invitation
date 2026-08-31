/**
 * Geometry for the dodging NO button.
 *
 * Everything here is pure maths on viewport coordinates so it can be reasoned
 * about (and unit tested) without a DOM. The component in
 * `components/DateInvitation/DodgingNoButton.tsx` only measures rects and
 * feeds them in.
 */

export interface Point {
  x: number;
  y: number;
}

export interface Size {
  width: number;
  height: number;
}

export interface Rect extends Point, Size {}

export interface Viewport {
  width: number;
  height: number;
}

export interface DodgeConfig {
  /** Cursor gets this close (px, measured to the button's edge) -> run away. */
  dangerRadius: number;
  /** Shortest escape hop. */
  minJump: number;
  /** Longest escape hop. */
  maxJump: number;
  /** Keep at least this much space between the button and the screen edge. */
  viewportPadding: number;
  /** Extra breathing room kept around forbidden rects (the YES button). */
  avoidPadding: number;
  /** Landing spot must be dangerRadius * safetyMargin away from the cursor. */
  safetyMargin: number;
}

export interface EscapeInput {
  /** Where the button is right now (top-left + size, viewport coordinates). */
  button: Rect;
  cursor: Point;
  /** Rects the button must never land on top of. */
  avoid: Rect[];
  viewport: Viewport;
  config: DodgeConfig;
  /** Injectable for deterministic tests. */
  random?: () => number;
}

const DEG = Math.PI / 180;

/**
 * Candidate directions, ordered by how far they deviate from "straight away
 * from the cursor". The first entries are tried first so the escape reads as a
 * believable flee rather than a random teleport.
 */
const ANGLE_OFFSETS: number[] = (() => {
  const offsets = [0];
  for (let deg = 15; deg <= 180; deg += 15) {
    offsets.push(deg * DEG, -deg * DEG);
  }
  return offsets;
})();

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

export function rectFromElement(element: Element): Rect {
  const r = element.getBoundingClientRect();
  return { x: r.left, y: r.top, width: r.width, height: r.height };
}

export function centerOf(rect: Rect): Point {
  return { x: rect.x + rect.width / 2, y: rect.y + rect.height / 2 };
}

/** Distance from a point to the nearest edge of a rect (0 when inside). */
export function distanceToRect(point: Point, rect: Rect): number {
  const dx = Math.max(rect.x - point.x, 0, point.x - (rect.x + rect.width));
  const dy = Math.max(rect.y - point.y, 0, point.y - (rect.y + rect.height));
  return Math.hypot(dx, dy);
}

export function rectsOverlap(a: Rect, b: Rect, padding = 0): boolean {
  return !(
    a.x + a.width + padding <= b.x ||
    b.x + b.width + padding <= a.x ||
    a.y + a.height + padding <= b.y ||
    b.y + b.height + padding <= a.y
  );
}

function overlapsAny(rect: Rect, avoid: Rect[], padding: number): boolean {
  return avoid.some((other) => rectsOverlap(rect, other, padding));
}

/** Keep a top-left position fully inside the viewport. */
export function clampToViewport(
  topLeft: Point,
  size: Size,
  viewport: Viewport,
  padding: number,
): Point {
  const maxX = Math.max(padding, viewport.width - size.width - padding);
  const maxY = Math.max(padding, viewport.height - size.height - padding);
  return {
    x: clamp(topLeft.x, Math.min(padding, maxX), maxX),
    y: clamp(topLeft.y, Math.min(padding, maxY), maxY),
  };
}

/** True when the cursor has entered the button's personal space. */
export function shouldDodge(
  button: Rect,
  cursor: Point,
  dangerRadius: number,
): boolean {
  return distanceToRect(cursor, button) < dangerRadius;
}

/**
 * Pick the new top-left position for the NO button.
 *
 * Guarantees (in priority order):
 *  1. never lands outside the viewport,
 *  2. never lands on top of a forbidden rect (the YES button) when any legal
 *     spot exists,
 *  3. never lands under / next to the cursor - it always ends up further away
 *     than the danger radius when the screen has room for it,
 *  4. prefers moving straight away from the cursor.
 */
export function computeEscapePosition(input: EscapeInput): Point {
  const { button, cursor, avoid, viewport, config } = input;
  const random = input.random ?? Math.random;
  const size: Size = { width: button.width, height: button.height };
  const center = centerOf(button);
  const pad = config.viewportPadding;

  const away = { x: center.x - cursor.x, y: center.y - cursor.y };
  const awayLength = Math.hypot(away.x, away.y);
  // Cursor sitting exactly on the button -> pick a random bearing instead of NaN.
  const baseAngle =
    awayLength < 1 ? random() * Math.PI * 2 : Math.atan2(away.y, away.x);

  // The closer the cursor, the more panicked (further) the hop.
  const proximity = clamp(
    1 - distanceToRect(cursor, button) / config.dangerRadius,
    0,
    1,
  );
  const baseJump =
    config.minJump + proximity * (config.maxJump - config.minJump);
  const jumps = [
    baseJump,
    clamp(baseJump * 1.35, config.minJump, config.maxJump),
    clamp(baseJump * 0.7, config.minJump, config.maxJump),
  ];

  const safeDistance = config.dangerRadius * config.safetyMargin;

  // Best legal-but-not-ideal spot found so far, scored by distance to cursor.
  let fallback: { point: Point; score: number } | null = null;

  const consider = (topLeft: Point): Point | null => {
    const landing: Rect = { ...topLeft, ...size };
    if (overlapsAny(landing, avoid, config.avoidPadding)) return null;
    const score = distanceToRect(cursor, landing);
    if (score >= safeDistance) return topLeft;
    if (!fallback || score > fallback.score)
      fallback = { point: topLeft, score };
    return null;
  };

  for (const jump of jumps) {
    for (const offset of ANGLE_OFFSETS) {
      const angle = baseAngle + offset;
      const topLeft = clampToViewport(
        {
          x: center.x + Math.cos(angle) * jump - size.width / 2,
          y: center.y + Math.sin(angle) * jump - size.height / 2,
        },
        size,
        viewport,
        pad,
      );
      const accepted = consider(topLeft);
      if (accepted) return accepted;
    }
  }

  // Tight screens: sweep a grid and take the furthest legal cell.
  const minX = pad;
  const minY = pad;
  const maxX = Math.max(pad, viewport.width - size.width - pad);
  const maxY = Math.max(pad, viewport.height - size.height - pad);
  const steps = 6;
  for (let i = 0; i <= steps; i += 1) {
    for (let j = 0; j <= steps; j += 1) {
      const topLeft = {
        x: minX + ((maxX - minX) * i) / steps,
        y: minY + ((maxY - minY) * j) / steps,
      };
      const accepted = consider(topLeft);
      if (accepted) return accepted;
    }
  }

  if (fallback) return (fallback as { point: Point; score: number }).point;

  // Absolute last resort: the corner furthest from the cursor.
  return {
    x: cursor.x > viewport.width / 2 ? minX : maxX,
    y: cursor.y > viewport.height / 2 ? minY : maxY,
  };
}
