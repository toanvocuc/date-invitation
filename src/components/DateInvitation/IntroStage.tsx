"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { motion } from "framer-motion";
import StageCard from "@/components/ui/StageCard";
import DodgingNoButton from "./DodgingNoButton";
import YesButton from "./YesButton";
import { INTRO } from "@/data/intro";

interface IntroStageProps {
  onAccept: () => void;
}

/** The landing screen: avatar, the question, and the two buttons. */
export default function IntroStage({ onAccept }: IntroStageProps) {
  const yesRef = useRef<HTMLDivElement>(null);
  const [leaving, setLeaving] = useState(false);

  return (
    <StageCard className="text-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{
          type: "spring",
          stiffness: 240,
          damping: 20,
          delay: 0.05,
        }}
        className="mx-auto grid h-24 w-24 place-items-center overflow-hidden rounded-full border border-white bg-gradient-to-br from-blush-200 via-blush-100 to-peach-200 text-4xl shadow-[0_14px_34px_-18px_rgba(214,70,120,0.8)] sm:h-28 sm:w-28"
      >
        {/* Drop a photo in /public and set INTRO.avatarSrc to swap this out. */}
        {INTRO.avatarSrc ? (
          <Image
            src={INTRO.avatarSrc}
            alt={INTRO.avatarAlt}
            width={112}
            height={112}
            className="h-full w-full object-cover"
          />
        ) : (
          <span aria-hidden="true">{INTRO.avatarEmoji}</span>
        )}
      </motion.div>

      <h1 className="font-display mt-6 text-[1.7rem] leading-tight font-semibold text-plum-700 sm:text-4xl">
        <span className="block">{INTRO.greeting}</span>
        <span className="mt-1 block text-balance">{INTRO.question}</span>
      </h1>

      <p className="mx-auto mt-3 max-w-sm text-sm text-plum-500/85">
        {INTRO.hint}
      </p>

      <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
        <div ref={yesRef}>
          <YesButton
            label={INTRO.yesLabel}
            onAccept={onAccept}
            onCelebrateStart={() => setLeaving(true)}
          />
        </div>

        <DodgingNoButton avoidRef={yesRef} hidden={leaving} />
      </div>
    </StageCard>
  );
}
