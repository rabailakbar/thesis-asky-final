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
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes in seconds
  ;
 


  

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };
const[showIntroModal,setShowIntroModal] = useState(true);
  return (
    <div className="p-8">
    <main className="h-[90vh] bg-[#F8F1E7] p-2">
    <OpeningModal
showIntroModal={showIntroModal}
moduleId={"M6"}
setShowIntroModal={setShowIntroModal}
/>
  <div className="max-w-7xl mx-auto">
    {/* Header Section */}
    <ModuleHeader/>

    {/* Main Content - Two Column Layout */}
    <div className="flex justify-center items-stretch gap-10">
       {/* Right Column - Scenario Card */}
  <div className="bg-white rounded-lg p-4 shadow-md border border-gray-200 max-w-[450px] flex flex-col justify-between">
    <div>
      <p className="text-xs font-medium text-gray-500 mb-2">Scenario 1</p>
      <h2 className="text-[16px] font-semibold text-gray-900 mb-3 leading-snug">
        {props.debate.Heading}
      </h2>
      
      <p className="text-gray-800 mb-3 text-sm leading-relaxed">
    {props.debate.Scenario}
      </p>
      <div className="rounded-md p-3 mb-4">
        <p className="text-xs text-gray-500 mb-1">🧠 The Debate:</p>
        <p className="text-gray-900 font-medium text-sm leading-snug">
{
  props.debate.Debate_Question
}        </p>
      </div>
    </div>
    <div>
      <p className="text-gray-900 font-medium text-sm mb-3">🔥 Ready to take a side?</p>
      <button
        className="w-full py-2.5 rounded-md text-white font-medium text-base bg-[#FF9348] hover:bg-[#7c4ee8] transition-colors"
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
</div>

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
                      <div className="text-3xl font-bold text-gray-900">/7</div>
                  </div>
              </div>
          </div>

          {/* Instructions */}
          
      </>)
}

import { Dialog, DialogContent } from "@/components/ui/dialog";





const OpeningModal = (props:any)=>{
    

    return (
        <Dialog open={props.showIntroModal } onOpenChange={props.setShowIntroModal}>
<DialogContent className="max-w-[1000px] aspect-[1253/703] rounded-[12px] p-0 gap-0 bg-white">
<div className="px-32 py-16">
                    {/* Header with Icon */}
                    <div className="flex items-start gap-4 mb-6">
                      {/* Puzzle Icon */}
                      <div className="w-16 h-16 rounded-lg flex items-center justify-center relative flex-shrink-0 ">
          <img
            src={"/opening16.png"}
            alt="Module 1"
            className="w-18 h-18 object-contain"
          />
        </div>
        
                      
                      {/* Title */}
                      <div>
                      <div className="text-[#FF9348] text-[24px] font-semibold ">Phase III</div>
                      <h2 className="text-[24px] font-bold text-black">Module 6: Debate Switch</h2>
                      </div>
                    </div>
        
                    {/* Video Placeholder */}
                    <div className="bg-gray-100 rounded-lg p-12 mb-6 text-center">
                      <div className="text-gray-500">
                        <div className="font-medium mb-1">Walkthrough Video</div>
                        <div className="text-sm">(small screen recording)</div>
                      </div>
                    </div>
        
                    {/* Description */}
                    <p className="text-[#1E1E2F] font-lato font-normal text-[16px] leading-[100%] tracking-[0] mb-6">
                    Ready. Set. Debate! 🧠<br/>
                    You’ve got 90 seconds to bring your best arguments to the table!
                     Defend your stance like a pro — but wait for it... plot twist! <br/>
                      You’ll have to switch sides and fight for the opposite view.
                       Every round flexes your perspective power, builds empathy, and drops that polarization score. 
                       The more open-minded you get, the closer you are to victory! 
                  </p>

        
                    {/* Info Badges */}
                    <div className="flex items-center gap-4 mb-6 text-sm">
                   
                    <div className="flex items-center gap-2 text-[#1E1E2F]  py-1.5 rounded-full font-[400] text-[18px] leading-[100%] tracking-[0]">
  <img src={"/I_1b.svg"} />
  Beginner Level
</div>

                      <div className="flex items-center gap-2 text-[#1E1E2F]-600">
                        <img src={"/clocl.svg"} className="w-4 h-4 " />
                        <span>02:00</span>
                      </div>
                      <div className=" flex justify-center items-center gap-2 text-[#1E1E2F]-500 ">
          <img src={"/star.svg"}/>
                        Score is not being calculated in this module
                      </div>
                    </div>
        
                    {/* Begin Button */}
                    <div className="flex justify-center">
                    <button
  onClick={() => props.setShowIntroModal(false)}
  className="
    bg-[#FF9348] text-white rounded-[6px] px-[10px] py-[8px] w-[197px] h-[42px]
    text-base font-medium flex items-center justify-center gap-[10px]
    focus:outline-none focus:ring-0 active:outline-none
  "
>
  Let's begin <ChevronRight size={14} />
</button>
        </div>
                  </div>
                </DialogContent>
              </Dialog>
    )
}