import { ChevronRight } from "lucide-react";
import React from "react";

const Workshop = () => {
  return (
    <div className="w-full p-8  flex  justify-center ">
      <div className="w-full pb-4 overflow-auto h-[90vh]  bg-[#F8F1E7] rounded-2xl shadow-xl ">

        {/* ================= HEADER ================= */}
        <div className="bg-[#5F237B] text-white px-12  rounded-t-2xl flex justify-between items-center relative">

        <div className="py-10">
          <h1 className="text-[94px] text-[#F8F1E7] font-['Gabarito'] font-extrabold leading-[100%] tracking-[0%]">
            Welcome to askwhy <br /> Workshop’25
          </h1>
        </div>
<div>
          <img
          
            src={"/header33.svg"}
            alt="Character"
            
          />
          </div>
        </div>

        {/* ================= STATS BAR ================= */}
        <div className="flex items-center  px-16 py-6  ">
      
          <div className="flex gap-8">

            <StatBox number="7" label="Total Modules" />
            <StatBox number="3" label="Total Phases"  />
            <StatBox number="3" label="Difficulty Levels" />
            <StatBox number="1 hr" label="Total Duration" />
            <button className=" flex justify-center items-center gap-4 bg-[#FF9348] hover:bg-[#ff7e1a] text-white px-6 py-3 rounded-xl font-semibold shadow-md transition">
            
            <div>
            <div className="text-left font-normal ">Click here to</div>
            <div className="text-left font-semibold text-[1.5vw] "> Start</div> 
            </div>
            <div>
                <ChevronRight size={60}/>
            </div>
          </button>
          </div>

        
        </div>

        {/* ================= DESCRIPTION ================= */}
        <div className="flex flex-col gap-8">
        <div className="flex px-16 ">
        <div className=" py-6 text-gray-700 leading-relaxed">
            <p className="mb-4 text-[#4C1C62] font-gabarito font-normal text-2xl leading-none tracking-normal"> 
                A glow up for your brain. How does that <br></br>sound?
            </p>
            <p className="text-[#4C1C62] font-gabarito font-normal text-2xl leading-none tracking-normal">
            We’re here to help. Turn <span className="font-semibold ">curiosity</span> into <br></br> your superpower.
            <span className="font-semibold "> Play. Challenge. Ask <br></br>Why.</span>
            Let’s start your journey with us!
          </p>
        </div>

        {/* ================= MODULES LIST ================= */}
        <div className="bg-white rounded-2xl opacity-100 p-3 sm:px-6 flex flex-col gap-4 w-full md:max-w-3xl lg:max-w-4xl">
        

        <h2 className="text-[#5F237B] mb-4 font-gabarito font-semibold text-4xl leading-none tracking-normal w-[826px]">
        All Modules
    </h2>

    <p className="font-gabarito font-semibold text-[27px] leading-none tracking-normal w-[281px] text-[#5F237B]">
        Phase 1: Beginner Level
    </p>

          <div className="border rounded-xl  p-4 max-h-72 overflow-y-scroll custom-scroll">

            <ModuleItem
              title="Find your vibe"
              level="Beginner Level"
              time="5:00"
              locked
            />

            <ModuleItem
              title="Pick & Flick"
              level="Beginner Level"
              time="5:00"
              locked
            />

            {/* Add more if needed */}
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

const StatBox = (props ) => {

  const parts = props.number.split(" ");
  const mainValue = parts[0]; 
  const unit = parts.length > 1 ? parts[1] : '';

  return (
    <div
      className={`px-6 flex items-center justify-center
        bg-[white] gap-4
         rounded-lg  text-center ${
        props.highlight ? "border-purple-500 bg-purple-50" : "border-gray-300"
      }`}
    >
        <div className="flex items-end leading-none">
            
            <p className="font-extrabold text-[#D0193E] text-[4.25vw] leading-none">
                {mainValue}
            </p>
            
            <span className="text-[#D0193E] font-normal text-[1.5vw] ml-0.5 mb-1">
                {unit}
            </span>
        </div>
        
        <div>
            <p className="text-[1vw] text-left text-[#D0193E] font-normal ">{props.label.split(" ")[0]}</p>

            <p className="text-[1.75vw]  text-left text-[#5F237B]  font-semibold">{props.label.split(" ")[1]}</p>
        </div>
    </div>
  );
};

const ModuleItem = ({ title, level, time, locked }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm p-4 mb-4 flex justify-between items-center border">
      
      {/* LEFT SIDE: Thumbnail, Title, Level, and Time (Restructured) */}
      <div className="flex items-center gap-3">

        {/* Thumbnail placeholder */}
        <div className="w-16 h-12 bg-gray-200 rounded-md flex items-center justify-center text-xs">
          IMG
        </div>

        <div>
          <h3 className="font-semibold text-gray-800">{title}</h3>
          
          {/* CHANGE: Combine Level and Time into a single line/flex container */}
          <div className="flex items-center text-xs text-gray-500 mt-1">
            <p>{level}</p>
            {/* Separator and Time */}
            <span className="mx-2 text-gray-400">|</span> 
            <p>{time}</p>
          </div>
        </div>
      </div>

      {/* RIGHT SIDE: Only the Lock Icon remains here */}
      <div className="flex items-center gap-3">
        {/* REMOVED: The original 'time' span was here */}
        {locked && (
          <span className="text-orange-500 text-lg">🔒</span>
        )}
      </div>
    </div>
  );
};