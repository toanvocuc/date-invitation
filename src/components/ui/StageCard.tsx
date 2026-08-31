import type { ReactNode } from "react";

interface StageCardProps {
  children: ReactNode;
  /** Extra classes for the outer card. */
  className?: string;
}

/**
 * The frosted, rounded shell every screen sits inside.
 * ~640px on desktop, ~92% of the viewport on a phone (the page adds px-4).
 */
export default function StageCard({
  children,
  className = "",
}: StageCardProps) {
  return (
    <section
      className={`w-full max-w-[640px] rounded-[2rem] border border-white/70 bg-white/75 px-6 py-7 shadow-[0_24px_70px_-30px_rgba(190,90,130,0.55)] backdrop-blur-xl sm:px-10 sm:py-9 ${className}`}
    >
      {children}
    </section>
  );
}
