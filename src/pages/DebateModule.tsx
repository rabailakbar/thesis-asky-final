import { useState, useEffect } from "react";
import { Timer, Heart, MessageCircle, Repeat2, Bookmark, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { RootState } from "@/store";
import { useSelector } from "react-redux";

const DebateModule = (props) => {
  const navigate = useNavigate();
  const [timeLeft, setTimeLeft] = useState(120); // 5 minutes in seconds
  ;
 


  

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };
  const description = <div>
    Ready. Set. Debate!<br/> 
    🧠You’ve got 90 seconds to bring your best arguments to the table! Defend your stance like a pro — but wait for it... plot twist!
     <br/> 
     You’ll have to switch sides and fight for the opposite view. 
     
    </div>
const[showIntroModal,setShowIntroModal] = useState(true);
  return (
    
    <main >
   {props.currentIndex==0 && 
   
  <OpeningModal
showIntroModal={showIntroModal}
moduleId={"M6"}
setShowIntroModal={setShowIntroModal}
src={"/opening16.png"}
phase="III"
module="Module 6: Debate Switch"
description={description}
time="2:00"
calculated=""
level="Advanced"
/>

}

  <div className="max-w-7xl mx-auto">
    {/* Header Section */}
    

    {/* Main Content - Two Column Layout */}
    <div className="flex justify-center items-stretch gap-10">
       {/* Right Column - Scenario Card */}
  <div className="bg-white rounded-lg p-4  max-w-[450px] flex flex-col justify-between">
    <div>
      <p className="text-[#150800] font-normal  mb-2 mx-4 text-[1.25vw]">Scenario 1</p>
      <h2 className="text-[#150800] text-[1.3vw] mx-2  font-bold  mb-3 leading-snug">
        "{props.debate?.Heading}"
      </h2>
      
      <p className="text-[#150800] mb-3  leading-relaxed">
    {props.debate?.Scenario?.split(".")[0]}
      </p>
      <div className="rounded-md bg-[#F8F1E7] p-3 mb-4">
        <p className="text-[1.25vw] text-[#5F237B] ">The Debate:</p>
        <p className="text-[#150800] font-normal text-[1.25vw] leading-snug">
{
  props.debate?.Debate_Question
}        </p>
      </div>
    </div>
    <div>
      <button
        className="w-full py-2.5 rounded-md text-white font-medium text-base bg-[#FF9348] transition-colors"
        onClick={() => props.setShow(false)}
      >
        Start Now
      </button>
    </div>
  </div>
  {/* Left Column - Image */}
  <div className="flex justify-end items-center rounded-lg bg-transparent">
    <img
      src={props.imageUrl}
      alt="AI is an insult to life itself - Miyazaki's predictions come true"
      className="h-full max-h-[60vh] w-auto object-contain"
    />
  
  </div>

 
</div>



  </div>
</main>


  );
};

export default DebateModule;


const ModuleHeader = () => {
  return (
      <>
          <div className="  pt-6 mb-2">
              <div className="flex items-center justify-between">
                  {/* Left side: Icon + Module Info */}
                  <div className="flex items-center gap-8">
                      {/* Puzzle Icon */}
                      <div className="w-25 rounded-lg flex items-center justify-center relative flex-shrink-0 ">
                          <img
                              src={"/opening16.png"}
                              alt="Module 1"
                              className="w-25  object-contain"
                          />
                      </div>

                      {/* Module Info */}
                      <div>
                      <h1 className="font-semibold text-[36px] leading-[100%] tracking-[0] text-[#201E1C] mb-2">
                      Debate Switch</h1>

<p className="font-normal text-[16px] leading-[100%] tracking-[0] text-[#201E1C] mb-2">
One debate, two sides, endless perspectives</p>


                          <div className="flex items-center gap-4 text-[#201E1C]">
<img src={"/clocl.svg"} />

                              <span className="font-normal text-[24px] leading-[100%] tracking-[0]">
02:00
</span>

                          </div>

                      </div>
                  </div>

                    {/* Right side: Counter */}
                    <div className="text-right">
                      <div className="text-3xl font-bold text-gray-900">1 Left</div>
                    </div>
              </div>
          </div>

          {/* Instructions */}
          
      </>)
}

import { Dialog, DialogContent } from "@/components/ui/dialog";
import OpeningModal from "@/components/OpeningModal";





