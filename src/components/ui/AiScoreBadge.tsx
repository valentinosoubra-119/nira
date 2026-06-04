"use client";

import type { AiMaturityLevel } from "@/types";

interface Props {
  score: number;
  maturity: AiMaturityLevel;
  size?: "sm" | "md" | "lg";
}

const maturityConfig: Record<AiMaturityLevel, { bg: string; text: string; ring: string }> = {
  Débutant: {
    bg: "bg-slate-100",
    text: "text-slate-600",
    ring: "ring-slate-200",
  },
  Intermédiaire: {
    bg: "bg-amber-50",
    text: "text-amber-700",
    ring: "ring-amber-200",
  },
  Avancé: {
    bg: "bg-sky-50",
    text: "text-sky-700",
    ring: "ring-sky-200",
  },
  Leader: {
    bg: "bg-violet-50",
    text: "text-violet-700",
    ring: "ring-violet-200",
  },
};

const scoreColor = (score: number) => {
  if (score >= 80) return "text-violet-600";
  if (score >= 60) return "text-sky-600";
  if (score >= 40) return "text-amber-600";
  return "text-slate-500";
};

export default function AiScoreBadge({ score, maturity, size = "md" }: Props) {
  const config = maturityConfig[maturity];
  const arcRadius = size === "lg" ? 20 : size === "md" ? 14 : 10;
  const strokeWidth = size === "lg" ? 3 : 2;
  const svgSize = (arcRadius + strokeWidth) * 2 + 2;
  const circumference = 2 * Math.PI * arcRadius;
  const progress = (score / 100) * circumference;

  return (
    <div className="flex items-center gap-2">
      <div className="relative" style={{ width: svgSize, height: svgSize }}>
        <svg width={svgSize} height={svgSize} className="-rotate-90">
          <circle
            cx={svgSize / 2}
            cy={svgSize / 2}
            r={arcRadius}
            fill="none"
            stroke="#e2e8f0"
            strokeWidth={strokeWidth}
          />
          <circle
            cx={svgSize / 2}
            cy={svgSize / 2}
            r={arcRadius}
            fill="none"
            stroke="currentColor"
            strokeWidth={strokeWidth}
            strokeDasharray={`${progress} ${circumference}`}
            strokeLinecap="round"
            className={scoreColor(score)}
          />
        </svg>
        <span
          className={`absolute inset-0 flex items-center justify-center font-bold ${
            size === "lg" ? "text-sm" : "text-[10px]"
          } ${scoreColor(score)}`}
        >
          {score}
        </span>
      </div>

      <span
        className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ring-1 ring-inset ${config.bg} ${config.text} ${config.ring}`}
      >
        {maturity}
      </span>
    </div>
  );
}
