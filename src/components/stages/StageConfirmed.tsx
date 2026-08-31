"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import StageCard from "@/components/ui/StageCard";
import { buildSummary, formatPlanText } from "@/lib/summary";
import type { SubmitState } from "@/lib/submitPlan";
import type { DatePlan, StageId } from "@/types/date";

const COPY = {
  title: "It is a date. 💌",
  subtitleSent: "It just landed in my inbox. I will take it from here. ❤️",
  subtitleSending: "Sending it over...",
  subtitleManual: "One last thing - send this to me so I know. ❤️",
  subtitleError:
    "I could not send it automatically. Copy it and send it to me.",
  copy: "Copy the plan 💌",
  copied: "Copied ❤️",
  share: "Send it 💌",
  retry: "Try sending again",
  edit: "Change something",
};

const CELEBRATION_HEARTS = 9;

interface StageConfirmedProps {
  plan: DatePlan;
  submitState: SubmitState;
  onRetry: () => void;
  goTo: (stage: StageId) => void;
}

export default function StageConfirmed({
  plan,
  submitState,
  onRetry,
  goTo,
}: StageConfirmedProps) {
  const rows = buildSummary(plan);
  const [copied, setCopied] = useState(false);
  const copyTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(
    () => () => {
      if (copyTimer.current) clearTimeout(copyTimer.current);
    },
    [],
  );

  const canShare =
    typeof navigator !== "undefined" && typeof navigator.share === "function";

  const sendManually = useCallback(async () => {
    const text = formatPlanText(plan);

    if (canShare) {
      try {
        await navigator.share({ text });
        return;
      } catch {
        // Share sheet dismissed - fall through to the clipboard.
      }
    }

    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      if (copyTimer.current) clearTimeout(copyTimer.current);
      copyTimer.current = setTimeout(() => setCopied(false), 2200);
    } catch {
      // Clipboard blocked (insecure context, old browser). The plan is printed
      // on screen below, so it can always be selected by hand.
    }
  }, [canShare, plan]);

  const status = submitState.status;
  const subtitle =
    status === "sending"
      ? COPY.subtitleSending
      : status === "sent"
        ? COPY.subtitleSent
        : status === "error"
          ? COPY.subtitleError
          : COPY.subtitleManual;

  return (
    <StageCard className="text-center">
      <div className="relative mx-auto h-20 w-20">
        {/* A few hearts drifting off the envelope. */}
        {Array.from({ length: CELEBRATION_HEARTS }, (_, index) => {
          const angle = -Math.PI / 2 + (index - 4) * 0.32;
          return (
            <motion.span
              key={index}
              aria-hidden="true"
              className="pointer-events-none absolute top-1/2 left-1/2 text-sm"
              initial={{ opacity: 0, x: 0, y: 0, scale: 0.4 }}
              animate={{
                opacity: [0, 1, 0],
                x: Math.cos(angle) * (70 + index * 6),
                y: Math.sin(angle) * (70 + index * 6),
                scale: 1,
              }}
              transition={{
                duration: 1.4,
                delay: 0.25 + index * 0.07,
                ease: "easeOut",
              }}
            >
              ❤️
            </motion.span>
          );
        })}

        <motion.div
          aria-hidden="true"
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 260, damping: 17 }}
          className="grid h-20 w-20 place-items-center rounded-full bg-gradient-to-br from-blush-300 to-blush-500 text-4xl shadow-[0_18px_38px_-18px_rgba(214,70,120,0.9)]"
        >
          💌
        </motion.div>
      </div>

      <h1 className="font-display mt-6 text-3xl font-semibold text-plum-700">
        {COPY.title}
      </h1>

      <p
        aria-live="polite"
        className={`mx-auto mt-2 flex max-w-sm items-center justify-center gap-2 text-sm ${
          status === "error" ? "text-blush-600" : "text-plum-500/85"
        }`}
      >
        {status === "sending" ? (
          <motion.span
            aria-hidden="true"
            animate={{ rotate: 360 }}
            transition={{ duration: 0.9, repeat: Infinity, ease: "linear" }}
            className="inline-block h-3 w-3 rounded-full border-2 border-blush-200 border-t-blush-500"
          />
        ) : null}
        {subtitle}
      </p>

      <dl className="mt-6 flex flex-col gap-2 text-left">
        {rows.map((row) => (
          <div
            key={row.key}
            className="flex items-baseline justify-between gap-4 rounded-2xl bg-white/70 px-4 py-3"
          >
            <dt className="shrink-0 text-[0.7rem] font-semibold tracking-wide text-plum-500/70 uppercase">
              {row.label}
            </dt>
            <dd className="text-right text-sm font-medium text-plum-700">
              <span aria-hidden="true">{row.emoji} </span>
              {row.value}
            </dd>
          </div>
        ))}
      </dl>

      <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
        <motion.button
          type="button"
          onClick={sendManually}
          whileHover={{ scale: 1.04, y: -2 }}
          whileTap={{ scale: 0.96 }}
          transition={{ type: "spring", stiffness: 420, damping: 24 }}
          className={`inline-flex min-h-11 items-center justify-center rounded-full px-6 text-sm font-semibold tracking-wide transition-colors duration-200 ${
            status === "sent"
              ? "border border-blush-200 bg-white/90 text-plum-600"
              : "bg-gradient-to-br from-blush-400 to-blush-600 text-white shadow-[0_14px_30px_-14px_rgba(214,70,120,0.95)]"
          }`}
        >
          {copied ? COPY.copied : canShare ? COPY.share : COPY.copy}
        </motion.button>

        {status === "error" ? (
          <button
            type="button"
            onClick={onRetry}
            className="rounded-full px-4 py-2 text-xs font-medium text-plum-500/70 transition-colors duration-200 hover:bg-white/70 hover:text-plum-700"
          >
            {COPY.retry}
          </button>
        ) : null}
      </div>

      <button
        type="button"
        onClick={() => goTo("summary")}
        className="mt-4 rounded-full px-3 py-1.5 text-xs font-medium text-plum-500/60 transition-colors duration-200 hover:bg-white/70 hover:text-plum-700"
      >
        <span aria-hidden="true">← </span>
        {COPY.edit}
      </button>
    </StageCard>
  );
}
