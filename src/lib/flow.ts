import type { DatePlan, StageId } from "@/types/date";

/** Linear order of every screen. Insert future stages here. */
export const STAGE_ORDER: StageId[] = [
  "intro",
  "stage1",
  "stage1_5",
  "stage2",
  "stage3",
  "stage4",
  // <- the romantic Q&A game will slot in right here later
  "stage5",
  "summary",
  "confirmed",
];

/** Stages that appear in the progress indicator (the intro is excluded). */
export const PROGRESS_STAGES: { id: StageId; label: string }[] = [
  { id: "stage1", label: "1" },
  { id: "stage1_5", label: "1.5" },
  { id: "stage2", label: "2" },
  { id: "stage3", label: "3" },
  { id: "stage4", label: "4" },
  { id: "stage5", label: "5" },
];

/** Conditional stages: Stage 1.5 disappears when there is no "before dinner". */
export function isStageSkipped(id: StageId, plan: DatePlan): boolean {
  if (id === "stage1_5") return plan.beforeDinner === "no";
  return false;
}

export function getVisibleProgressStages(plan: DatePlan) {
  return PROGRESS_STAGES.filter((stage) => !isStageSkipped(stage.id, plan));
}

export function getNextStage(current: StageId, plan: DatePlan): StageId {
  const index = STAGE_ORDER.indexOf(current);
  for (let i = index + 1; i < STAGE_ORDER.length; i += 1) {
    if (!isStageSkipped(STAGE_ORDER[i], plan)) return STAGE_ORDER[i];
  }
  return current;
}

export function getPrevStage(current: StageId, plan: DatePlan): StageId {
  const index = STAGE_ORDER.indexOf(current);
  for (let i = index - 1; i >= 0; i -= 1) {
    if (!isStageSkipped(STAGE_ORDER[i], plan)) return STAGE_ORDER[i];
  }
  return current;
}

/** Back is available from Stage 1.5 onward - never on the intro or Stage 1. */
export function canGoBack(current: StageId): boolean {
  return STAGE_ORDER.indexOf(current) >= STAGE_ORDER.indexOf("stage1_5");
}

/** True once every question needed for a complete plan has an answer. */
export function isPlanComplete(plan: DatePlan): boolean {
  if (!plan.accepted) return false;
  if (!plan.beforeDinner) return false;
  if (plan.beforeDinner === "yes" && !plan.beforeDinnerActivity) return false;
  if (!plan.foodChoice) return false;
  if (plan.foodChoice === "something_else" && !plan.customFoodChoice?.trim()) {
    return false;
  }
  if (!plan.afterDinnerActivity) return false;
  if (!plan.dressCode) return false;
  return true;
}
