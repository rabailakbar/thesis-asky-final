import React from "react";

const CircleScore = ({ scoreDrop = 5, size = 100, strokeWidth = 10 }) => {
  // Remaining score (e.g., 100 - drop)
  const score = scoreDrop;

  // SVG layout math
  const center = size / 2;
  const radius = center - strokeWidth / 2; // keep stroke fully inside SVG
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
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
          {score}%
        </span>
      </div>
    </div>
  );
};

export default CircleScore;
