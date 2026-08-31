"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

interface YesButtonProps {
  label: string;
  /** Fired once the little celebration has finished. */
  onAccept: () => void;
  /** Fired immediately on click, before the celebration. */
  onCelebrateStart?: () => void;
}

const CELEBRATION_MS = 850;
const HEART_COUNT = 12;
const CONFETTI_COUNT = 18;
const CONFETTI_COLORS = ["#f76a9b", "#ffbcd2", "#ffd6a5", "#d8c6ef", "#ffffff"];

interface Particle {
  id: number;
  angle: number;
  distance: number;
  scale: number;
  rotate: number;
  color: string;
}

/** Generated on click, so it never runs during server rendering. */
function makeParticles(
  count: number,
  spread: number,
  offset: number,
): Particle[] {
  return Array.from({ length: count }, (_, id) => ({
    id,
    angle: offset + (id / count) * Math.PI * 2 + (Math.random() - 0.5) * spread,
    distance: 60 + Math.random() * 90,
    scale: 0.6 + Math.random() * 0.8,
    rotate: (Math.random() - 0.5) * 220,
    color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
  }));
}

export default function YesButton({
  label,
  onAccept,
  onCelebrateStart,
}: YesButtonProps) {
  const reduceMotion = useReducedMotion();
  const [celebrating, setCelebrating] = useState(false);
  const [hearts, setHearts] = useState<Particle[]>([]);
  const [confetti, setConfetti] = useState<Particle[]>([]);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
    },
    [],
  );

  const handleClick = useCallback(() => {
    if (celebrating) return;
    setCelebrating(true);
    onCelebrateStart?.();

    if (!reduceMotion) {
      setHearts(makeParticles(HEART_COUNT, 0.5, -Math.PI / 2));
      setConfetti(makeParticles(CONFETTI_COUNT, 0.8, 0));
    }

    timer.current = setTimeout(onAccept, reduceMotion ? 120 : CELEBRATION_MS);
  }, [celebrating, onAccept, onCelebrateStart, reduceMotion]);

  return (
    <div className="relative inline-flex">
      {/* Burst layer - sits on top of the button, ignores pointer events. */}
      <div className="pointer-events-none absolute inset-0 grid place-items-center">
        <AnimatePresence>
          {celebrating
            ? confetti.map((piece) => (
                <motion.span
                  key={`confetti-${piece.id}`}
                  className="absolute block h-2 w-1.5 rounded-[2px]"
                  style={{ backgroundColor: piece.color }}
                  initial={{ opacity: 1, x: 0, y: 0, scale: 0.4, rotate: 0 }}
                  animate={{
                    opacity: 0,
                    x: Math.cos(piece.angle) * piece.distance,
                    y: Math.sin(piece.angle) * piece.distance + 30,
                    scale: piece.scale,
                    rotate: piece.rotate,
                  }}
                  transition={{ duration: 0.85, ease: "easeOut" }}
                />
              ))
            : null}
        </AnimatePresence>

        <AnimatePresence>
          {celebrating
            ? hearts.map((heart) => (
                <motion.span
                  key={`heart-${heart.id}`}
                  className="absolute block text-base"
                  initial={{ opacity: 1, x: 0, y: 0, scale: 0.3 }}
                  animate={{
                    opacity: 0,
                    x: Math.cos(heart.angle) * heart.distance,
                    y: Math.sin(heart.angle) * heart.distance,
                    scale: heart.scale + 0.5,
                  }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                >
                  ❤️
                </motion.span>
              ))
            : null}
        </AnimatePresence>
      </div>

      <motion.button
        type="button"
        onClick={handleClick}
        whileHover={celebrating ? undefined : { scale: 1.05, y: -2 }}
        whileTap={celebrating ? undefined : { scale: 0.95 }}
        animate={celebrating ? { scale: [1, 1.18, 1.02] } : { scale: 1 }}
        transition={
          celebrating
            ? { duration: 0.45, ease: "easeOut" }
            : { type: "spring", stiffness: 420, damping: 22 }
        }
        className="inline-flex min-h-12 w-[132px] items-center justify-center rounded-full bg-gradient-to-br from-blush-400 to-blush-600 px-6 text-sm font-semibold tracking-wide text-white shadow-[0_16px_34px_-14px_rgba(214,70,120,0.95)]"
      >
        {label}
      </motion.button>
    </div>
  );
}
