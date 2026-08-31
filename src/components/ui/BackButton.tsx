"use client";

interface BackButtonProps {
  onClick: () => void;
  label?: string;
}

/** Deliberately quiet - it should never compete with the main action. */
export default function BackButton({
  onClick,
  label = "Back",
}: BackButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-xs font-medium text-plum-500/70 transition-colors duration-200 hover:bg-white/70 hover:text-plum-700"
    >
      <span aria-hidden="true">←</span>
      {label}
    </button>
  );
}
