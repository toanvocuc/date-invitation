/**
 * Central data model for the date invitation flow.
 *
 * Keep this file additive: new stages should add new OPTIONAL fields so that
 * existing stages and saved answers keep type-checking.
 */

export type YesNo = "yes" | "no";

export type BeforeDinnerActivity =
  "park_walk" | "hoan_kiem_sunset" | "coffee" | "surprise_me";

export type FoodChoice =
  "snails" | "pho_bun" | "rice" | "grilled_offal" | "something_else";

export type AfterDinnerActivity = "park_and_talk" | "bar" | "movie_at_home";

/** Dress code values live in `src/data/dressCode.ts` so they stay easy to swap. */
export type DressCode = string;

export interface DatePlan {
  /** True once the YES button on the intro screen has been pressed. */
  accepted: boolean;

  beforeDinner?: YesNo;
  beforeDinnerActivity?: BeforeDinnerActivity;

  foodChoice?: FoodChoice;
  customFoodChoice?: string;

  afterDinnerActivity?: AfterDinnerActivity;

  /** Set when the player reached the Stage 4 "warm up game" announcement. */
  sawGameIntro?: boolean;

  dressCode?: DressCode;

  /** ISO timestamp of the moment the plan was confirmed on the summary screen. */
  confirmedAt?: string;

  // --- Future stages go here (all optional) ---
  // quizAnswers?: Record<string, string>;
}

export const EMPTY_PLAN: DatePlan = { accepted: false };

export type StageId =
  | "intro"
  | "stage1"
  | "stage1_5"
  | "stage2"
  | "stage3"
  | "stage4"
  | "stage5"
  | "summary"
  | "confirmed";

/** A single choice rendered by <SelectionCard />. */
export interface SelectionOption<TValue extends string = string> {
  value: TValue;
  emoji: string;
  title: string;
  description?: string;
}

/** Props every stage component receives from <DateInvitation />. */
export interface StageProps {
  plan: DatePlan;
  /** Merge a patch into the plan without navigating. */
  update: (patch: Partial<DatePlan>) => void;
  /** Optionally merge a patch, then move to the next (non-skipped) stage. */
  advance: (patch?: Partial<DatePlan>) => void;
  /** Move to the previous (non-skipped) stage, keeping every answer. */
  goBack: () => void;
  /** Jump straight to a stage - used by the summary to edit one answer. */
  goTo: (stage: StageId) => void;
}
