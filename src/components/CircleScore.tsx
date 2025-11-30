import React, { useEffect, useRef, useState } from "react";

type CircleScoreProps = {
  scoreDrop?: number;
  size?: number;
  strokeWidth?: number;
  animateFrom?: number;
  duration?: number;
};

const CircleScore = ({ scoreDrop = 5, size = 100, strokeWidth = 10, animateFrom = undefined, duration = 1000 }: CircleScoreProps) => {
  // target score
  const score = scoreDrop;

  // animated value
  const [displayScore, setDisplayScore] = useState<number>(
    typeof animateFrom === "number" ? animateFrom : score
  );
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    if (typeof animateFrom !== "number" || animateFrom === score) {
      setDisplayScore(score);
      return;
    }

    const start = performance.now();
    const from = animateFrom;
    const to = score;

    const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

    const tick = (now: number) => {
      const elapsed = now - start;
      const t = Math.min(1, elapsed / Math.max(1, duration));
      const eased = easeOutCubic(t);
      const value = from + (to - from) * eased;
      setDisplayScore(value);
      if (t < 1) {
        rafRef.current = requestAnimationFrame(tick);
      }
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [animateFrom, score, duration]);

  // SVG layout math
  const center = size / 2;
  const radius = center - strokeWidth / 2; // keep stroke fully inside SVG
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - ((displayScore ?? score) / 100) * circumference;
  const offset1 = circumference - 0.90 * circumference;



  // Inner circle diameter that fits exactly inside the stroke
  // available inner area = total size - 2*strokeWidth
  const innerSize = Math.max(0, size - 2 * strokeWidth);

  return (
    <div
      className="flex justify-center items-center mb-6 relative"
      style={{ width: size, height: size }}
    >
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="rotate-[0deg]"
      >
        {/* Background circle */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          stroke="#EDE1D0"
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={circumference * 0.95}
          strokeDashoffset={circumference * (1 - 0.95)}

        />

        {/* Progress circle (gradient) */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          stroke="url(#scoreGradient)"
          strokeWidth={strokeWidth}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circumference*0.95}
          strokeDashoffset={offset*0.95}
        />

        {/* Gradient: top->bottom matches linear-gradient(180deg, #D0193E 0%, #5F237B 100%) */}
        <defs>
          <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#D0193E" />
            <stop offset="100%" stopColor="#5F237B" />
          </linearGradient>
        </defs>
      </svg>

      {/* Inner circle exactly sized to fit inside the stroke */}
      <div
        className="absolute rounded-full flex items-center justify-center"
        style={{
          width: innerSize,
          height: innerSize,
          background: "#FDF8F3",
          transform: "translate(-50%, -50%)",
          left: "50%",
          top: "50%",
        }}
      >
        <span
          style={{
            color: "#5F237B",
            fontWeight: 700,
            fontSize: Math.round(innerSize * 0.28), // responsive text-size
            lineHeight: 1,
          }}
        >
          {Math.round(displayScore)}%
        </span>
      </div>
    </div>
  );
};

export default CircleScore;
