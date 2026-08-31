import type { SelectionOption } from "@/types/date";

/**
 * Stage 5 options.
 *
 * These are placeholders - rewrite / add / remove entries freely. `value` is
 * what gets stored on `DatePlan.dressCode`, so keep it short and stable.
 */
export const dressCodeOptions: SelectionOption[] = [
  {
    value: "casual_cute",
    emoji: "👕",
    title: "Casual & Cute",
    description: "Comfy, easy, still adorable.",
  },
  {
    value: "look_good_for_me",
    emoji: "✨",
    title: "Look good for me",
    description: "The outfit you know I love.",
  },
  {
    value: "date_night",
    emoji: "🖤",
    title: "Date Night Outfit",
    description: "The proper one. All black, all in.",
  },
  {
    value: "surprise_me",
    emoji: "👀",
    title: "Surprise me",
    description: "Let me find out when I see you.",
  },
];
