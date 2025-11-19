import React from "react";
import { X } from "lucide-react";

const Tooltip = (props) => {
  if(props.description=="") return<div></div>
  return (
    <div
      className="
        w-[240px] p-2 bg-[#780091] text-white shadow-lg relative
        rounded-t-3xl rounded-tr-3xl rounded-br-3xl rounded-bl-none
      "
    >
      {/* Top Row: Icon + Text + Close */}
      <div className="flex items-start justify-between">
        
        {/* Left side: Icon + Paragraph */}
        <div className="flex items-start gap-2">
          
          {/* Icon */}
          <div className="w-7 h-7 rounded-full bg-[#FF9348] flex items-center justify-center">
            <img src="/tooltip.svg" className="w-4 h-4" />
          </div>

          {/* Paragraph aligned with icon vertically */}
          <p className="text-[10px] leading-snug text-white/90 w-[170px]">
          {props.description}
          </p>
        </div>

        {/* Close button */}
        <button>
          <X size={14} className="text-white/70 hover:text-white transition" />
        </button>

      </div>
    </div>
  );
};

export default Tooltip;
