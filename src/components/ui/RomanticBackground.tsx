"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useMounted } from "@/lib/useMounted";
import FloatingHearts from "./FloatingHearts";

const BLOBS = [
  {
    className: "left-[-14%] top-[-10%] h-[52vmin] w-[52vmin] bg-blush-300/45",
    drift: { x: [0, 26, 0], y: [0, 22, 0] },
    duration: 22,
  },
  {
    className: "right-[-16%] top-[14%] h-[46vmin] w-[46vmin] bg-lav-300/45",
    drift: { x: [0, -22, 0], y: [0, 28, 0] },
    duration: 27,
  },
  {
    className: "bottom-[-16%] left-[18%] h-[56vmin] w-[56vmin] bg-peach-200/60",
    drift: { x: [0, 20, 0], y: [0, -20, 0] },
    duration: 31,
  },
];

/** Fixed pastel backdrop: gradient, slow blurred blobs, drifting hearts. */
export default function RomanticBackground() {
  const reduceMotion = useReducedMotion();
  // Same reason as in FloatingHearts: the drift keyframes must not be applied
  // until after hydration, or the server and client styles disagree.
  const animateBlobs = useMounted() && !reduceMotion;

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-[linear-gradient(160deg,#fff7fa_0%,#fff3ec_45%,#f7f0ff_100%)]"
    >
      {BLOBS.map((blob, index) => (
        <motion.div
          key={index}
          className={`absolute rounded-full blur-[70px] ${blob.className}`}
          animate={animateBlobs ? blob.drift : undefined}
          transition={{
            duration: blob.duration,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}

      <FloatingHearts />

      {/* Keeps text comfortably readable on top of the colour. */}
      <div className="absolute inset-0 bg-white/25" />
    </div>
  );
}
