import { ChevronRight } from "lucide-react";
import React from "react";

export default function CelebrationScreen() {
  return (
    <div className="p-8 ">
    <div className="flex flex-col items-center  min-h-[90vh]  bg-[#f5f1e8] px-10 font-sans">
      
      {/* Banner Wrapper */}
      {/* Note: The original CSS had specific styles for a .banner child, 
        but the provided JSX was empty. Keeping the wrapper layout logic.
      */}

      {/* Image (Centered by parent flex column) */}
      <img src={"/samplee.svg"} alt="Celebration" className="w-[60vw] pt-8 pb-8 h-auto" />

      {/* Stats Section */}
      <div className="text-center mb-8 ">
        <p className="text-[#1a1a1a] font-medium tracking-wide  text-[1.5vw]">
          You're now only <span className=" font-bold  text-[#D0193E] ">2%</span> Polarized! Good Job, you did it!
        </p>
      </div>

      {/* Congratulations Section */}
      <div className="text-center   px-5 mb-4">
        <p className="text-[#1a1a1a] leading-normal font-medium text-[1.5vw]">
          Congratulations! You've <span className="text-[#5F237B] font-bold">balanced</span> your thinking and lowered your polarization.
        </p>
      </div>

      {/* Completion Items */}
      <div className="flex flex-wrap justify-center gap-8 sm:gap-[50px]">
        
        {/* Item 1 */}
        <div className="flex items-center gap-3 text-[#1a1a1a] font-normal text-[1vw]">
          <div className="text-2xl font-normal flex items-center justify-center">
            <img src="/begin.svg" className="w-6"/>
          </div>
          <span>All Modules Complete</span>
        </div>

        {/* Item 2 */}
        <div className="flex items-center gap-3 text-[#1a1a1a] font-normal text-[1vw]">
          <div className="text-xl text-[#2ecc71] font-bold flex items-center justify-center">
            <img src="/checkk.svg" className="w-4"/>
          </div>
          <span>Workshop Complete</span>
        </div>

      </div>
    </div>
    </div>
  );
}