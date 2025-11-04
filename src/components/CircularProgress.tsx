interface CircularProgressProps {
    percentage: number;
    size?: number;
    strokeWidth?: number;
  }
  
 export const CircularProgress = ({ 
    percentage, 
    size = 200, 
    strokeWidth = 12 
  }: CircularProgressProps) => {
    const radius = (size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;
    const offset = circumference - (percentage / 100) * circumference;
  
    return (
      <div className="relative inline-flex items-center justify-center">
        <svg width={size} height={size}>
          {/* Background circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="currentColor"
            strokeWidth={strokeWidth}
            fill="none"
            className="text-gray-200"
          />
  
          {/* Progress circle with custom gradient */}
          <defs>
            <linearGradient
              id="progressGradient"
              x1="0%"
              y1="0%"
              x2="0%"
              y2="100%"
            >
              <stop offset="0%" stopColor="#FF5A5F" />
              <stop offset="100%" stopColor="#8B5CF6" />
            </linearGradient>
          </defs>
  
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="url(#progressGradient)"
            strokeWidth={strokeWidth}
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out"
          />
        </svg>
  
        {/* Centered percentage text */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-5xl font-bold bg-gradient-to-b from-[#FF5A5F] to-[#8B5CF6] bg-clip-text text-transparent">
            {percentage}%
          </span>
        </div>
      </div>
    );
  };
  

  