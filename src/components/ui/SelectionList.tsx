"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

interface SelectionListProps {
  children: ReactNode;
  /** Accessible name for the group of choices. */
  label: string;
}

const listVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06, delayChildren: 0.05 } },
};

export default function SelectionList({ children, label }: SelectionListProps) {
  return (
    <motion.div
      role="group"
      aria-label={label}
      variants={listVariants}
      initial="hidden"
      animate="show"
      className="mt-5 flex flex-col gap-2.5"
    >
      {children}
    </motion.div>
  );
}
