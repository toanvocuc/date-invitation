import { dressCodeOptions } from "@/data/dressCode";
import {
  afterDinnerOptions,
  beforeDinnerActivityOptions,
  CUSTOM_FOOD_VALUE,
  foodOptions,
} from "@/data/stageOptions";
import type { DatePlan, SelectionOption, StageId } from "@/types/date";

export interface SummaryRow {
  /** Stable key, also used as the field name in the notification email. */
  key: string;
  label: string;
  emoji: string;
  value: string;
  /** Which stage to jump back to when this answer is changed. */
  stage: StageId;
}

function titleFor(
  options: SelectionOption<string>[],
  value: string | undefined,
): string | null {
  if (!value) return null;
  return options.find((option) => option.value === value)?.title ?? value;
}

function emojiFor(
  options: SelectionOption<string>[],
  value: string | undefined,
  fallback: string,
): string {
  if (!value) return fallback;
  return options.find((option) => option.value === value)?.emoji ?? fallback;
}

/**
 * One place that turns answers into readable lines.
 *
 * The summary screen, the notification email and the "copy it" button all read
 * from here, so they can never drift apart.
 */
export function buildSummary(plan: DatePlan): SummaryRow[] {
  const rows: SummaryRow[] = [];

  if (plan.beforeDinner === "no") {
    rows.push({
      key: "before_dinner",
      label: "Before dinner",
      emoji: "🍽️",
      value: "Straight to dinner",
      stage: "stage1",
    });
  } else if (plan.beforeDinnerActivity) {
    rows.push({
      key: "before_dinner",
      label: "Before dinner",
      emoji: emojiFor(
        beforeDinnerActivityOptions,
        plan.beforeDinnerActivity,
        "✨",
      ),
      value:
        titleFor(beforeDinnerActivityOptions, plan.beforeDinnerActivity) ?? "",
      stage: "stage1_5",
    });
  }

  const food =
    plan.foodChoice === CUSTOM_FOOD_VALUE
      ? plan.customFoodChoice?.trim()
      : titleFor(foodOptions, plan.foodChoice);

  if (food) {
    rows.push({
      key: "dinner",
      label: "Dinner",
      emoji:
        plan.foodChoice === CUSTOM_FOOD_VALUE
          ? "✍️"
          : emojiFor(foodOptions, plan.foodChoice, "🍽️"),
      value: food,
      stage: "stage2",
    });
  }

  const afterDinner = titleFor(afterDinnerOptions, plan.afterDinnerActivity);
  if (afterDinner) {
    rows.push({
      key: "after_dinner",
      label: "After dinner",
      emoji: emojiFor(afterDinnerOptions, plan.afterDinnerActivity, "🌙"),
      value: afterDinner,
      stage: "stage3",
    });
  }

  const dressCode = titleFor(dressCodeOptions, plan.dressCode);
  if (dressCode) {
    rows.push({
      key: "dress_code",
      label: "Dress code",
      emoji: emojiFor(dressCodeOptions, plan.dressCode, "👗"),
      value: dressCode,
      stage: "stage5",
    });
  }

  return rows;
}

/** Plain text version - what the share sheet and the clipboard receive. */
export function formatPlanText(plan: DatePlan): string {
  const lines = buildSummary(plan).map(
    (row) => `${row.emoji} ${row.label}: ${row.value}`,
  );
  return ["Our date 💌", ...lines].join("\n");
}
