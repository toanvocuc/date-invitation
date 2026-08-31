"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, MotionConfig } from "framer-motion";
import RomanticBackground from "@/components/ui/RomanticBackground";
import ProgressIndicator from "@/components/ui/ProgressIndicator";
import StageTransition from "@/components/ui/StageTransition";
import IntroStage from "./IntroStage";
import Stage1 from "@/components/stages/Stage1";
import Stage1_5 from "@/components/stages/Stage1_5";
import Stage2 from "@/components/stages/Stage2";
import Stage3 from "@/components/stages/Stage3";
import Stage4 from "@/components/stages/Stage4";
import Stage5 from "@/components/stages/Stage5";
import StageSummary from "@/components/stages/StageSummary";
import StageConfirmed from "@/components/stages/StageConfirmed";
import { getNextStage, getPrevStage, STAGE_ORDER } from "@/lib/flow";
import { submitPlan, type SubmitState } from "@/lib/submitPlan";
import { EMPTY_PLAN, type DatePlan, type StageId } from "@/types/date";

/**
 * Owns the whole experience: which screen is showing, every answer collected so
 * far, and the direction of the next transition.
 *
 * Adding a stage means: a new id in `STAGE_ORDER` (src/lib/flow.ts), a component
 * in `components/stages/`, and one more case in `renderStage()` below.
 */
export default function DateInvitation() {
  const [stage, setStage] = useState<StageId>("intro");
  const [direction, setDirection] = useState<1 | -1>(1);
  const [plan, setPlan] = useState<DatePlan>(EMPTY_PLAN);
  const [submitState, setSubmitState] = useState<SubmitState>({
    status: "idle",
  });

  // Mirrors `plan` so navigation can branch on answers that were set in the
  // very same click, without waiting for a re-render.
  const planRef = useRef<DatePlan>(EMPTY_PLAN);

  const update = useCallback((patch: Partial<DatePlan>) => {
    const merged = { ...planRef.current, ...patch };
    planRef.current = merged;
    setPlan(merged);
  }, []);

  const advance = useCallback((patch?: Partial<DatePlan>) => {
    if (patch) {
      planRef.current = { ...planRef.current, ...patch };
      setPlan(planRef.current);
    }
    setDirection(1);
    setStage((current) => getNextStage(current, planRef.current));
  }, []);

  const goBack = useCallback(() => {
    setDirection(-1);
    setStage((current) => getPrevStage(current, planRef.current));
  }, []);

  /** Jump straight to a stage - the summary uses this to edit one answer. */
  const goTo = useCallback(
    (target: StageId) => {
      const forward = STAGE_ORDER.indexOf(target) >= STAGE_ORDER.indexOf(stage);
      setDirection(forward ? 1 : -1);
      setStage(target);
    },
    [stage],
  );

  /**
   * Post the finished plan. There is no server behind this site, so the answers
   * are sent straight from the browser (see src/lib/submitPlan.ts). A failure
   * only changes the confirmation screen's wording - it never blocks it.
   */
  const send = useCallback(async () => {
    setSubmitState({ status: "sending" });
    setSubmitState(await submitPlan(planRef.current));
  }, []);

  const confirmPlan = useCallback(() => {
    const confirmedAt = new Date().toISOString();
    planRef.current = { ...planRef.current, confirmedAt };
    setPlan(planRef.current);
    setDirection(1);
    setStage("confirmed");
    void send();
  }, [send]);

  // Stages differ in height, so a tall one entered from a short one could open
  // half scrolled down. Always start a new screen at the question.
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [stage]);

  const stageProps = { plan, update, advance, goBack, goTo };

  const renderStage = () => {
    switch (stage) {
      case "intro":
        return <IntroStage onAccept={() => advance({ accepted: true })} />;
      case "stage1":
        return <Stage1 {...stageProps} />;
      case "stage1_5":
        return <Stage1_5 {...stageProps} />;
      case "stage2":
        return <Stage2 {...stageProps} />;
      case "stage3":
        return <Stage3 {...stageProps} />;
      case "stage4":
        return <Stage4 {...stageProps} />;
      // The romantic Q&A game slots in here later, between Stage 4 and Stage 5.
      case "stage5":
        return <Stage5 {...stageProps} />;
      case "summary":
        return (
          <StageSummary
            {...stageProps}
            onConfirm={confirmPlan}
            isSending={submitState.status === "sending"}
          />
        );
      case "confirmed":
        return (
          <StageConfirmed
            plan={plan}
            submitState={submitState}
            onRetry={() => void send()}
            goTo={goTo}
          />
        );
      default:
        return null;
    }
  };

  const showProgress = stage !== "intro" && stage !== "confirmed";

  return (
    // reducedMotion="user" is the single source of truth for the motion
    // preference: Framer Motion drops transform animations for visitors who ask
    // for reduced motion, while every interaction keeps working. Branching on
    // useReducedMotion() inside render instead would change the markup between
    // the server and the client and break hydration.
    <MotionConfig reducedMotion="user">
      <main className="relative flex min-h-screen min-h-[100svh] w-full flex-col px-4 py-6 sm:py-8">
        <RomanticBackground />

        {/* m-auto (rather than justify-center) keeps tall content from being
          clipped at the top on short screens. */}
        <div className="m-auto flex w-full max-w-[680px] flex-col items-center">
          <div className="flex h-10 items-center justify-center">
            <AnimatePresence>
              {showProgress ? (
                <motion.div
                  key="progress"
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.3 }}
                >
                  <ProgressIndicator current={stage} plan={plan} />
                </motion.div>
              ) : null}
            </AnimatePresence>
          </div>

          <div className="mt-3 flex w-full justify-center">
            <AnimatePresence mode="wait" custom={direction} initial={false}>
              <StageTransition key={stage} direction={direction}>
                {renderStage()}
              </StageTransition>
            </AnimatePresence>
          </div>
        </div>
      </main>
    </MotionConfig>
  );
}
