"use client";

import { useMemo } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { createRandom } from "@/lib/rng";
import { useMounted } from "@/lib/useMounted";

const PARTICLE_COUNT = 18;
const GLYPHS = ["❤️", "🌸", "💕", "🌷", "✨", "🤍"];

interface Particle {
  id: number;
  glyph: string;
  left: number;
  size: number;
  duration: number;
  delay: number;
  drift: number;
  spin: number;
  opacity: number;
}

function buildParticles(): Particle[] {
  const random = createRandom(20260831);
  return Array.from({ length: PARTICLE_COUNT }, (_, id) => ({
    id,
    glyph: GLYPHS[Math.floor(random() * GLYPHS.length)],
    left: random() * 96 + 2,
    size: random() * 12 + 10,
    duration: random() * 12 + 16,
    delay: random() * -26,
    drift: random() * 60 - 30,
    spin: random() * 40 - 20,
    opacity: random() * 0.3 + 0.25,
  }));
}

/** Slow, sparse hearts and petals drifting up behind the content. */
export default function FloatingHearts() {
  const reduceMotion = useReducedMotion();
  const particles = useMemo(() => buildParticles(), []);

  // The server cannot know the visitor's motion preference, so the particles
  // are only added after mounting. The empty wrapper keeps the server HTML and
  // the first client render identical, which avoids a hydration mismatch.
  const mounted = useMounted();

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 overflow-hidden"
    >
      {mounted && !reduceMotion
        ? particles.map((particle) => (
            <motion.span
              key={particle.id}
              className="absolute bottom-[-8%] will-change-transform"
              style={{
                left: `${particle.left}%`,
                fontSize: `${particle.size}px`,
                opacity: particle.opacity,
              }}
              animate={{
                y: ["0vh", "-118vh"],
                x: [0, particle.drift, 0],
                rotate: [0, particle.spin, 0],
              }}
              transition={{
                duration: particle.duration,
                delay: particle.delay,
                repeat: Infinity,
                ease: "linear",
                times: [0, 0.5, 1],
              }}
            >
              {particle.glyph}
            </motion.span>
          ))
        : null}
    </div>
  );
}
