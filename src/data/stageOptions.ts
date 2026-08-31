import type {
  AfterDinnerActivity,
  BeforeDinnerActivity,
  FoodChoice,
  SelectionOption,
  YesNo,
} from "@/types/date";

/** Stage 1 - do we meet up before dinner? */
export const beforeDinnerOptions: SelectionOption<YesNo>[] = [
  {
    value: "yes",
    emoji: "✨",
    title: "Yes",
    description: "Let's steal a little extra time together first.",
  },
  {
    value: "no",
    emoji: "🍽️",
    title: "No",
    description: "Straight to dinner - I'm hungry already.",
  },
];

/** Stage 1.5 - where do we go first? */
export const beforeDinnerActivityOptions: SelectionOption<BeforeDinnerActivity>[] =
  [
    {
      value: "park_walk",
      emoji: "🌳",
      title: "Take a walk in the park",
      description: "Slow steps, zero rush.",
    },
    {
      value: "hoan_kiem_sunset",
      emoji: "🌅",
      title: "Watch the sunset at Hoan Kiem Lake",
      description: "Golden hour, and you.",
    },
    {
      value: "coffee",
      emoji: "☕",
      title: "Coffee together",
      description: "Somewhere quiet and warm.",
    },
    {
      value: "surprise_me",
      emoji: "💕",
      title: "Surprise me",
      description: "Close your eyes, I've got this.",
    },
  ];

/** Stage 2 - dinner. `something_else` reveals the free-text field. */
export const foodOptions: SelectionOption<FoodChoice>[] = [
  {
    value: "snails",
    emoji: "🐚",
    title: "Quán ốc",
    description: "Ốc nóng, ngồi lâu, nói chuyện nhiều.",
  },
  {
    value: "pho_bun",
    emoji: "🍜",
    title: "Đồ nước — Phở / Bún",
    description: "Ấm bụng, dễ chịu, không bao giờ sai.",
  },
  {
    value: "rice",
    emoji: "🍚",
    title: "Cơm",
    description: "Cơm nhà nấu kiểu quán, chắc dạ.",
  },
  {
    value: "grilled_offal",
    emoji: "🔥",
    title: "Lòng nướng",
    description: "Khói nghi ngút, thơm cả góc phố.",
  },
  {
    value: "something_else",
    emoji: "✍️",
    title: "Something else",
    description: "Tell me and I'll book it.",
  },
];

/** The option that unlocks the custom text field on Stage 2. */
export const CUSTOM_FOOD_VALUE: FoodChoice = "something_else";

/** Stage 3 - after dinner. */
export const afterDinnerOptions: SelectionOption<AfterDinnerActivity>[] = [
  {
    value: "park_and_talk",
    emoji: "🌳",
    title: "Go for a walk in the park and have a chill conversation",
    description: "The good kind of long talk. ❤️",
  },
  {
    value: "bar",
    emoji: "🍸",
    title: "Have a drink at a bar we've chosen",
    description: "Soft lights, slow music.",
  },
  {
    value: "movie_at_home",
    emoji: "🎬",
    title: "Go home and watch a movie",
    description: "Blanket, snacks, no alarm clock.",
  },
];
