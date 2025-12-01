import { useEffect, useState } from "react";

interface ModuleHeaderProps {
    polarizationScore: number; // 0-100
    likesCount?: number;
    savesCount?: number;
    MAX_LIKES?: number;
    MAX_SAVES?: number;
    setDone:any;
    src?:any;
    time?:any;
    heading?:any;
    headingColor?: string;
    module?:any;
    total?:any;
    left?:any;
    description?:any;
    started?: boolean;
  
  }
  
  const ModuleHeader = ({
    polarizationScore = 100,
    likesCount = 0,
    savesCount = 0,
    MAX_LIKES = 8,
    MAX_SAVES = 8,
    setDone,
    module,
    heading,
    headingColor = "#5F237B",
   
    src,
    total,
    left,
    description,
    time,
    started = false
  
    
  }: ModuleHeaderProps) => {
    const [timeLeft, setTimeLeft] = useState(time); // seconds
  console.log(timeLeft)
  
    useEffect(() => {
      if (!started) return; // don't tick until started
      if (timeLeft <= 0) {
        setDone(true); // call setDone when timer finishes
        return;
      }
  
      const interval = setInterval(() => {
        setTimeLeft((prev:any) => prev - 1);
      }, 1000);
  
      return () => clearInterval(interval);
    }, [started, timeLeft, setDone]);

    // Reset time when prop changes (e.g., on mount)
    useEffect(() => {
      setTimeLeft(time);
    }, [time]);
  
    // Format seconds to MM:SS
    const formatTime = (seconds: number) => {
      const min = Math.floor(seconds / 60);
      const sec = seconds % 60;
      return `${min.toString().padStart(2, "0")}:${sec
        .toString()
        .padStart(2, "0")}`;
    };
  
    return (
      <div className="pt-6 mb-2">
        <div className="flex items-center justify-between">
          {/* Left side: Icon + Module Info */}
          <div className="flex items-start gap-8">
            {/* Puzzle Icon */}
            <div className="w-24  rounded-lg flex items-center justify-center relative flex-shrink-0">
              <img src={src} alt="Module 1" className="w-24 object-contain" />
            </div>
  
            {/* Module Info */}
            <div className="flex flex-col justify-between h-32 py-1">
              <h1 className="font-semibold text-[64px] leading-[100%] tracking-[0]" style={{ color: headingColor }}>
                {heading}
              </h1>
              <p className="font-normal text-[32px] leading-[100%] tracking-[0] text-[#130719]">
                {description}
              </p>
            </div>
          </div>
  
          {/* Right side: Polarization bar + counts */}
          <div className="flex flex-col items-end gap-2">
            {/* Polarization bar */}
     {  module!=1 &&     <div>
            <div className="w-[20vw] h-4 rounded-full bg-[#EDE1D0] overflow-hidden mb-1">
              <div
                className="h-full rounded-full"
                style={{
                  width: `${polarizationScore}%`,
                  background: "linear-gradient(180deg, #D0193E 0%, #5F237B 100%)",
                }}
              />
              
            </div>
              <div className="font-medium text-right text-[16px]">
                {polarizationScore}%
              </div>
              <div className="text-[16px] font-medium text-right text-[#130719]">Polarization Score</div>
              </div> }
  
            
  
            {/* Timer + separator + Likes/Saves/Left */}
            <div className="flex items-center justify-end gap-4 font-normal text-[32px] text-[#130719] mt-2">
              {/* Timer placed before the right-side counter */}
              <div className="flex items-center gap-3 text-[#201E1C]">
                <img src={"/clocl.svg"} alt="Clock" />
                <span className="font-normal text-[32px] leading-[100%] tracking-[0]">
                  {formatTime(typeof timeLeft === 'number' ? timeLeft : (typeof time === 'number' ? time : 0))}
                </span>
              </div>
              {/* Vertical separator (thicker) */}
              <span className="h-8 w-1 bg-[#D0C4B3] inline-block" aria-hidden="true"></span>
             {module==2 && (
              <>
              <span>
                {likesCount}/{MAX_LIKES} Likes
              </span>
              <span> | </span>
              <span>
                {savesCount}/{MAX_SAVES} Saves
              </span>
              </>)}
              {module!=2 && (
              <>
              <div className="font-normal text-[32px]">
  {left} Left
              </div>
              </>)}
            </div>
          </div>
        </div>
      </div>
    );
  };
  export default ModuleHeader