"use client";

import { ChevronRight, Lock, Clock, BookOpen, ChevronDown } from 'lucide-react';
import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';

const Workshop = () => {
  const [expandedPhases, setExpandedPhases] = useState<string[]>(["phase-1"]);

  const togglePhase = (phaseId: string) => {
    setExpandedPhases((prev) =>
      prev.includes(phaseId)
        ? prev.filter((id) => id !== phaseId)
        : [...prev, phaseId]
    );
  };

  const phases = [
    {
      id: "phase-1",
      title: "Phase 1: Beginner Level",
      color: "text-red-600",
      modules: [
        {
          id: "module-1",
          title: "Find your vibe",
          description: "Let's help you build your feed!",
          level: "Beginner Level",
          duration: "5:00",
          locked: false, // UNLOCKED
          iconSrc: "/M1.jpg",
        },
        {
          id: "module-2",
          title: "Pick & Flick",
          description: "Let's help you build your newsfeed!",
          level: "Beginner Level",
          duration: "5:00",
          locked: true,
          iconSrc: "/M2.jpg",
        },
      ],
    },
    {
      id: "phase-2",
      title: "Phase 2: Intermediate Level",
      color: "text-red-600",
      modules: [
        {
          id: "module-3",
          title: "Fact or Fact",
          description: "Is everything not real?!",
          level: "Intermediate Level",
          duration: "5:00",
          locked: true, // UNLOCKED
          iconSrc: "/M3.jpg",
        },
        {
          id: "module-4",
          title: "Spot the Bias",
          description: "Let's help you build your newsfeed!",
          level: "Intermediate Level",
          duration: "5:00",
          locked: true,
          iconSrc: "/M4.jpg",
        },
        {
          id: "module-5",
          title: "Behind the buzz",
          description: "Trace the spark that sets your feed on fire!",
          level: "Intermediate Level",
          duration: "5:00",
          locked: true,
          iconSrc: "/M5.png",
        },
      ],
    },
    {
      id: "phase-3",
      title: "Phase 3: Advanced Level",
      color: "text-red-600",
      modules: [
        {
          id: "module-6",
          title: "Debate Switch",
          description: "One debate, two sides, endless perspectives",
          level: "Advanced Level",
          duration: "5:00",
          locked: true,
          iconSrc: "/M6.jpg",
        },
        {
          id: "module-7",
          title: "In Their Shoes",
          description: "Step into another perspective",
          level: "Advanced Level",
          duration: "5:00",
          locked: true,
          iconSrc: "/M7.jpg",
        },
      ],
    },
    
    
  ];

  const navigate = useNavigate()
  return (
    <div className="w-full p-8 flex justify-center">
      <div className="w-full pb-4 overflow-auto h-[90vh] bg-[#F8F1E7] rounded-2xl shadow-xl">
        {/* ================= HEADER ================= */}
        <div className="bg-[#5F237B] text-white px-12 rounded-t-2xl flex justify-between items-center relative">
          <div className="py-10">
            <h1 className="text-[94px] text-[#F8F1E7] font-['Gabarito'] font-extrabold leading-[100%] tracking-[0%]">
              Welcome to askwhy <br /> Workshop'25
            </h1>
          </div>
          <div>
            <img src={"/header33.svg"} alt="Character" />
          </div>
        </div>




        {/* ================= STATS BAR ================= */}
        <div className="flex items-center justify-center px-16  py-6">
          <div className="flex gap-8">
            <StatBox number="7" label="Total Modules" />
            <StatBox number="3" label="Total Phases" />
            <StatBox number="3" label="Difficulty Levels" />
            {/* Pass unitFont for 'hr' style */}
            <StatBox number="1 hr" label="Total Duration" unitFont="Gabarito" />
            <div onClick={()=>navigate("/interest")} className="flex w-[15vw] justify-center items-center gap-4 bg-[#FF9348] hover:bg-[#ff7e1a] text-white px-6 py-3  rounded-[16px]  rounded-bl-none font-semibold  transition">
              <div>
                <div className="text-left font-normal">Click here to</div>
                <div className="text-left font-semibold text-[1.5vw]">
                  {" "}
                  Start
                </div>
              </div>
              <div>
                <ChevronRight size={60} />
              </div>
            </div>
          </div>
        </div>

        {/* ================= DESCRIPTION ================= */}
        <div className="flex flex-col gap-8">
          <div className="flex justify-center px-16 gap-16"> 
            <div className="py-6 text-gray-700 leading-relaxed">
              <p className="mb-4 text-[#4C1C62] font-gabarito font-normal text-2xl leading-none tracking-normal">
                A glow up for your brain. How does that <br></br>sound?
              </p>
              <p className="text-[#4C1C62] font-gabarito font-normal text-2xl  tracking-normal">
                We're here to help. Turn <span className="font-semibold">curiosity</span> into <br></br> your superpower.
                <span className="font-semibold">
                  {" "}
                  Play. Challenge. Ask <br></br>Why.
                </span>
                 {" "}Let's start your journey with us!
              </p>
            </div>

            {/* ================= MODULES LIST ================= */}
            <div className="bg-white rounded-2xl opacity-100 p-6 flex flex-col gap-6 w-[50vw] md:max-w-2xl lg:max-w-3xl">
              <h2 className="text-[#5F237B] font-gabarito font-semibold text-4xl leading-none tracking-normal">
                All Modules
              </h2>

              <div className="max-h-96 overflow-y-scroll pr-4" style={{
                /* Standard scrollbar properties (limited browser support for full customization) */
                scrollbarWidth: "thin",
                scrollbarColor: "var(--scrollbar-thumb) var(--scrollbar-track)", 
                
                /* Webkit scrollbar styles for chrome/safari */

                /* Custom scrollbar track */
                '&::-webkit-scrollbar-track': {
                  background: 'transparent',
                },

                /* Custom scrollbar thumb */
                '&::-webkit-scrollbar': {
                    width: '17px', // Set width
                },
                '&::-webkit-scrollbar-thumb': {
                    borderRadius: '15px', // Set border-radius
                    background: 'linear-gradient(180deg, #D0193E 0%, #5F237B 100%)', // Set gradient background
                    border: '4px solid white', // Use border to simulate padding around the thumb
                },
              } as any}>
                {phases.map((phase) => (
                  <div key={phase.id} className="mb-6">
                    {/* Phase Header */}
                    <div
                      className="flex items-center gap-3 cursor-pointer mb-4 group"
                      onClick={() => togglePhase(phase.id)}
                    >
                      <div className="w-4 h-4 rounded-full bg-purple-700"></div>
                      <h3 className={`font-gabarito font-semibold text-2xl leading-none ${phase.color}`}>
                        {phase.title}
                      </h3>
                      <ChevronDown
                        className={`w-5 h-5 text-gray-600 transition-transform ${
                          expandedPhases.includes(phase.id) ? "rotate-180" : ""
                        }`}
                      />
                    </div>

                    {/* Modules List */}
                    {expandedPhases.includes(phase.id) && (
                      <div
                       className="space-y-4 pl-8 border-left" 
                      style={{ borderLeftColor: '#D9D9D9', borderLeftWidth: '1px' }}>
                        {phase.modules.map((module) => (
                          <ModuleCard key={module.id} module={module} />
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Workshop;

/* ================= COMPONENTS ================= */

const StatBox = (props: { number: string; label: string; highlight?: boolean; unitFont?: string }) => {
  const parts = props.number.split(" ");
  const mainValue = parts[0];
  const unit = parts.length > 1 ? parts[1] : "";

  return (
    <div
    className={`px-6 py-2 flex items-center justify-center bg-white gap-4 text-center
      ${props.highlight ? "border-purple-500 bg-purple-50" : "border-gray-300"}
      rounded-[16px] rounded-bl-none w-[15vw]
    `}
  >
  
      <div className="flex items-baseline leading-none">
        <p className="font-extrabold text-[#D0193E] text-[6vw] leading-none">
          {mainValue}
        </p>

        {/* Applying custom font style for the unit, specifically for 'hr' */}
        <span className={`text-[#D0193E] font-extrabold text-[1.25vw] ml-0.5 ${props.unitFont ? `font-['${props.unitFont}']` : ''}`}>
          {unit}
        </span>
      </div>

      <div>
        <p className="text-[1.25vw] text-left text-[#D0193E] font-normal">
          {props.label.split(" ")[0]}
        </p>

        <p className="text-[2.15vw] text-left text-[#5F237B] font-semibold">
          {props.label.split(" ")[1]}
        </p>
      </div>
    </div>
  );
};

const ModuleCard = ({ module }: { module: any }) => {
  // Determine text color based on locked status
  const textColor = module.locked ? 'text-[#757888]' : 'text-purple-900';
  // Determine card background color
  const cardBg = module.locked ? 'bg-[#F1F5F9] border-gray-200' : 'bg-amber-50';
  // Determine icon container background color
  const iconBg = module.locked ? 'bg-[#F1F5F9] border-gray-400' : 'bg-white border-gray-900';
  // Determine clock icon color (for text/span element wrapping the icon)
  const clockColor = module.locked ? 'text-[#D9D9D9]' : 'text-black-500';


  return (
    // Card container is no longer relative
    <div className={`flex items-center gap-4 p-4 rounded-lg border border-amber-100 hover:shadow-md transition-shadow ${cardBg}`}>
      
      {/* Module specific icon (replaces generic fact.svg) */}
      <div className="flex-shrink-0">
        <div className={`w-20 h-20 rounded-lg border-2 overflow-hidden ${iconBg}`}>
          <img
            src={module.iconSrc || "/fact.svg"}
            className={`w-full h-full object-cover ${module.locked ? "grayscale opacity-70" : ""}`}
            alt={module.title}
          />
        </div>
      </div>

      {/* Content Section */}
      <div className="flex-1">
        {/* Title text color */}
        <h3 className={`text-xl font-bold mb-1 ${textColor}`}>{module.title}</h3>
        {/* Description text color */}
        <p className={`mb-3 text-sm ${textColor}`}>{module.description}</p>

        <div className="flex items-center gap-4">
          {/* Level text color */}
          <div className={`flex items-center gap-2 font-medium text-sm ${textColor}`}>
            <img src={"/Level.svg"} className="w-4 h-4" /> 
            <span>{module.level}</span>
          </div>
          {/* Duration/Clock text and icon color */}
          <div className={`flex items-center gap-2 font-medium text-sm ${clockColor}`}>
            {/* The clock icon color is now handled by the parent div's text color */}
            <img src={"/uim_clock.svg"} className={`w-4 h-4`} /> 
            <span>{module.duration}</span>
          </div>
        </div>
      </div>
      
      {/* Lock/Unlock Icon - Reverted to its original position at the end of the flex container */}
      <div className="flex-shrink-0">
        {module.locked ? (
          // Locked Module - Original small lock icon (assuming w-6 h-6 and default style/color)
          <img src={"/lock.svg"} className="w-6 h-6 text-white" />
        ) : (
          // Unlocked Module - using orange unlock.svg
          <img src={"/unlock.svg"} className="w-6 h-6 text-[#FF9348]" /> 
        )}
      </div>
    </div>
  );
};