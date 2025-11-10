import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Clock, ThumbsUp, ThumbsDown, Heart, Bookmark } from "lucide-react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
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
            src="/opening1.svg"
            alt="Module 1"
            className="w-18 h-18 object-contain"
          />
        </div>
        
                      
                      {/* Title */}
                      <div>
                      <div className="text-[#5F237B] text-[24px] font-semibold ">Phase I</div>
                      <h2 className="text-[24px] font-bold text-black">Module {props.moduleId.split()[0]}: Find your vibe</h2>
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
                        In this module, students will filter out content for themselves. From a pool of 50 topics, 
                        they are supposed to narrow down 15 by simply clicking on the 
                  <span className="font-semibold"> ‘Interested’ </span>
                                                                  & 
                    <span className="font-semibold"> ‘Not Interested’ </span>
                               buttons. These picks will shape their personalized explore feed for the next module.
                  </p>

        
                    {/* Info Badges */}
                    <div className="flex items-center gap-4 mb-6 text-sm">
                   
                    <div className="flex items-center gap-2 text-[#1E1E2F] px-3 py-1.5 rounded-full font-[400] text-[18px] leading-[100%] tracking-[0]">
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
                    <Button
  onClick={() => props.setShowIntroModal(false)}
  className="bg-[#5F237B] text-white rounded-[6px] px-[10px] py-[8px] w-[197px] h-[42px] text-base font-medium flex items-center justify-center gap-[10px]"
>
            Let's begin →
          </Button>
        </div>
                  </div>
                </DialogContent>
              </Dialog>
    )
}

export default OpeningModal;