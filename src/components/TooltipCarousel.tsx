import React, { useState } from "react";
import { X } from "lucide-react";

const TooltipCarousel = ({ slides, onClose,header }) => {
  const [index, setIndex] = useState(0);
  const current = slides[index];

  return (
    <div
      className="w-[240px] bg-[#5F237B] text-white shadow-lg 
                 rounded-t-3xl justify-between  rounded-bl-3xl
                 flex flex-col pb-2"
      style={{
        height: "17.5vh", // fixed height for all slides
      }}
    >
      {/* Content: flex-1 to push dots to bottom */}
      <div className="p-2 flex-1">
        <div className="flex items-start justify-between">
          {/* Icon */}
          <div className="w-6 h-6 flex-shrink-0 rounded-full bg-[#FF9348] flex items-center justify-center">
            <img src="/tooltip.svg" className="w-6 h-6" />
          </div>

          {/* Text */}
          <div className="flex flex-col gap-1 pl-2">
            {current.heading && header   && (
              <h2 className="text-[12px] font-semibold leading-none">
                {current.heading}
              </h2>
            )}
            <p className="text-[12px] leading-snug text-white/90">
              {current.description}
            </p>
          </div>
        </div>
      </div>

      {/* Dots pinned at bottom */}
      <div className="flex justify-center gap-1 mb-2">
        {slides.map((_, i) => (
          <div
            key={i}
            onClick={() => setIndex(i)}
            className={`w-2 h-2 rounded-full cursor-pointer transition
              ${i === index ? "bg-white" : "bg-white/40"}`}
          />
        ))}
      </div>
    </div>
  );
};

export default TooltipCarousel;
