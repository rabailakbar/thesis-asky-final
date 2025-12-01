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
    
    <div className="justify-center items-center text-center pb-8 pt-2 font-medium text-[1.5vw] ">Headline #1</div>
    {/* Main Content - Two Column Layout */}
    <div className="flex justify-center items-stretch gap-10">
       {/* Right Column - Scenario Card */}
  <div className="bg-white rounded-lg p-4  w-[25vw] flex flex-col ">
    <div>
      <p className="text-[#150800] font-normal  mx-4 text-[1.25vw]">Scenario 1</p>
      <h2 className="text-[#150800] text-[1.3vw] mx-2  font-bold  my-10 leading-snug">
        "{props.debate?.Heading}"
      </h2>
      
      <p className="text-[#150800] mb-3  leading-relaxed">
    {props.debate?.Scenario?.split(".")[0]}
      </p>
      <div className="rounded-md bg-[#F8F1E7] p-3 mt-8 mb-10">
        <p className="text-[1.25vw] text-[#5F237B] ">The Debate:</p>
        <p className="text-[#150800] font-normal text-[1.25vw] leading-snug">
{
  props.debate?.Debate_Question
}        </p>
      </div>
    </div>
    <div>
      <button
        className="w-full py-2.5 rounded-md text-white font-medium text-base bg-[#FF803E] transition-colors"
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
      className="h-full  w-[25vw] object-contain"
    />
  
  </div>

 
</div>



  </div>
</main>


  );
};

export default DebateModule;




import { Dialog, DialogContent } from "@/components/ui/dialog";
import OpeningModal from "@/components/OpeningModal";





