import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button"; // Fixed import path
import { ChevronRight } from "lucide-react";

const OpeningModal = (props: any) => {
  // 1. EXTRACT MODULE NUMBER ROBUSTLY
  // This regex finds the first number in the string "Module X..."
  const match = props.module && props.module.match(/Module\s+(\d+)/i);
  const currentModuleNum = match ? parseInt(match[1]) : 1;
  const maxModuleNum = 7; // Maximum number of modules allowed

  const phaseColor =
    props.phase === "I"
      ? "#5F237B"
      : props.phase === "II"
      ? "#D0193E"
      : "#FF9348";

  const btnJustify =
    props.buttonAlign === "left"
      ? "justify-start"
      : props.buttonAlign === "right"
      ? "justify-end"
      : "justify-start";

  // 2. DEFINE POSITIONS ON THE CURVE
  // We define 5 slots. offsets determine the number (current - 2, current - 1, etc.)
  // x/y are coordinates on the quadratic curve.
  const slots = [
    { offset: -2, y: 130, x: 95, size: 32, opacity: 0.4 }, // Top
    { offset: -1, y: 240, x: 145, size: 40, opacity: 0.7 }, // Upper Mid
    { offset: 0, y: 350, x: 160, size: 64, opacity: 1.0 },  // Center (Active)
    { offset: 1, y: 460, x: 145, size: 40, opacity: 0.7 },  // Lower Mid
    { offset: 2, y: 570, x: 95, size: 32, opacity: 0.4 },  // Bottom
  ];

  return (
    <Dialog open={props.showIntroModal} onOpenChange={props.setShowIntroModal}>
      <DialogContent className="max-w-[1100px] p-0 overflow-hidden bg-white grid grid-cols-[320px_1fr] gap-0 rounded-[12px] border-none">
        
        {/* --- LEFT COLUMN: Dynamic SVG Area --- */}
        <div className="relative h-full w-full bg-white select-none">
          <svg
            className="absolute left-0 top-0 h-full w-full"
            viewBox="0 0 320 700"
            fill="none"
            preserveAspectRatio="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* The Background Curve */}
            <path
              d="M 0,0 Q 320,350 0,700"
              stroke="#E5E7EB"
              strokeWidth="1.5"
              fill="none"
            />

            {/* Render the 5 slots dynamically */}
            {slots.map((slot, index) => {
              const displayNum = currentModuleNum + slot.offset;
              
              // CONSTRAINT CHECK:
              // 1. Don't render if less than 1 (start of list)
              // 2. Don't render if greater than 7 (end of list)
              if (displayNum < 1 || displayNum > maxModuleNum) return null;

              // Formatting the number (add leading zero if < 10)
              const formattedNum = displayNum < 10 ? `0${displayNum}` : displayNum;

              const isCenter = slot.offset === 0;

              return (
                <g key={index} opacity={slot.opacity}>
                  {/* The Dot */}
                  <circle 
                    cx={slot.x} 
                    cy={slot.y} 
                    r={isCenter ? 6 : 5} // Active dot slightly bigger
                    fill={isCenter ? phaseColor : "#D1D5DB"} 
                  />
                  
                  {/* The Number */}
                  <text
                    x={slot.x + (isCenter ? 20 : 15)} // Offset text slightly right of dot
                    y={slot.y + (isCenter ? 20 : 12)} // Vertically center text
                    fill={isCenter ? phaseColor : "#D1D5DB"}
                    fontSize={`${slot.size}px`}
                    fontWeight={isCenter ? "700" : "600"}
                    fontFamily="sans-serif"
                    style={{ transition: 'all 0.3s ease' }}
                  >
                    {formattedNum}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        {/* --- RIGHT COLUMN: Content Area (Unchanged) --- */}
        <div className="p-12 pl-4 flex flex-col justify-center h-full">
          <div className="flex items-end gap-4 mb-6">
            <div className="w-16 h-16 rounded-lg flex items-center justify-center">
              <img
                src={props.src}
                alt="Module Icon"
                className="w-full h-full object-contain"
              />
            </div>
            <div>
              <div
                style={{ color: phaseColor }}
                className="text-[24px] font-semibold leading-tight"
              >
                Phase {props.phase}
              </div>
              <h2 className="text-[32px] font-bold text-black leading-tight">
                {props.module}
              </h2>
            </div>
          </div>

          <div className="rounded-xl mb-6 overflow-hidden bg-gray-50 border border-gray-100 flex items-center justify-center h-[260px] w-full">
            {(() => {
              const id = props.moduleId || "";
              const videoSrc = id.match(/^M[1-7]$/) ? `/${id}.mp4` : null;
              return videoSrc ? (
                <video
                  src={videoSrc}
                  className="h-full w-full object-cover"
                  controls
                  preload="metadata"
                  playsInline
                />
              ) : (
                <div className="text-gray-400 text-center flex flex-col items-center">
                  <span className="text-lg font-medium text-gray-900">Walkthrough Video</span>
                  <span className="text-sm">(small screen recording)</span>
                </div>
              );
            })()}
          </div>

          <p className="text-[#1E1E2F] text-[16px] leading-relaxed mb-8 max-w-[90%]">
            {props.description}
          </p>

          <div className="flex items-center gap-6 mb-8 text-sm text-[#130719]">
            <div className="flex items-center gap-2 text-[16px]">
              <img src="/I_1b.svg" className="w-5 h-5" alt="" />
              <span>{props.level} Level</span>
            </div>
            <div className="flex items-center gap-2 text-[16px]">
              <img src="/clocl.svg" className="w-5 h-5" alt="" />
              <span>02:00</span>
            </div>
            <div className="flex items-center gap-2 text-[16px]">
              <img src="/star.svg" className="w-5 h-5" alt="" />
              <span>Score is {props.calculated} calculated</span>
            </div>
          </div>

          <div className={`flex ${btnJustify}`}>
            <Button
              onClick={() => props.setShowIntroModal(false)}
              className="bg-[#FF9348] hover:bg-[#e58440] text-white rounded-md px-8 py-6 text-lg font-medium flex items-center gap-2 transition-colors"
            >
              Start <ChevronRight size={20} />
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default OpeningModal;