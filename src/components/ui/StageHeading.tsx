import type { ReactNode } from "react";

interface StageHeadingProps {
  title: string;
  subtitle?: ReactNode;
  className?: string;
}

export default function StageHeading({
  title,
  subtitle,
  className = "",
}: StageHeadingProps) {
  return (
    <header className={`text-center ${className}`}>
      <h1 className="font-display text-balance text-2xl leading-snug font-semibold text-plum-700 sm:text-[1.75rem]">
        {title}
      </h1>
      {subtitle ? (
        <p className="mt-2 text-sm text-plum-500/90 sm:text-[0.95rem]">
          {subtitle}
        </p>
      ) : null}
    </header>
  );
}
