import type { DodgeConfig } from "@/lib/dodge";

/** Tune the whole joke from here. */
export const DODGE_CONFIG: DodgeConfig = {
  dangerRadius: 120,
  minJump: 100,
  maxJump: 250,
  viewportPadding: 14,
  avoidPadding: 28,
  safetyMargin: 1.15,
};

/** Don't let a fast mouse trigger dozens of escapes per second. */
export const ESCAPE_COOLDOWN_MS = 90;

/**
 * The label gets cheekier the harder they try. Entries must stay sorted by
 * `minEscapes`; the first text is deliberately a plain "NO".
 */
export const NO_BUTTON_TEXTS: { minEscapes: number; label: string }[] = [
  { minEscapes: 0, label: "NO" },
  { minEscapes: 3, label: "Are you sure? 🥺" },
  { minEscapes: 6, label: "Really? 😭" },
  { minEscapes: 9, label: "Nice try!" },
  { minEscapes: 12, label: "NOPE 😈" },
  { minEscapes: 15, label: "You can't escape ❤️" },
];

export function getNoButtonLabel(escapes: number): string {
  let label = NO_BUTTON_TEXTS[0].label;
  for (const entry of NO_BUTTON_TEXTS) {
    if (escapes >= entry.minEscapes) label = entry.label;
  }
  return label;
}
