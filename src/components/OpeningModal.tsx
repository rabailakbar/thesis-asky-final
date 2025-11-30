import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "./ui/button";
import { ChevronRight } from "lucide-react";






const OpeningModal = (props:any)=>{
    const phase1= props.phase=='I'?'#5F237B':(props.phase=='II'?'#D0193E':'#FF9348')

    return (
        <Dialog open={props.showIntroModal } onOpenChange={props.setShowIntroModal}>
<DialogContent className="max-w-[1000px] aspect-[1253/703] rounded-[12px] p-0 gap-0 bg-white">
<div className="px-32 py-16">
                    {/* Header with Icon */}
                    <div className="flex items-center  gap-4 mb-6">
                      {/* Puzzle Icon */}
                      <div className="w-18 h-18 rounded-lg flex items-center justify-center">
  <img
    src={props.src}
    alt="Module 1"
    className="w-16 object-contain"
  />
</div>

        
                      
                      {/* Title */}
                      <div>
                      <div className={`text-[${phase1}] text-[36px] font-semibold`}>
                        Phase {props.phase}
                        
                        </div>
                      <h2 className="text-[36px] font-semibold text-black">
                        
{props.module}

                        </h2>
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
                    <p className="text-[#1E1E2F]  font-normal text-[16px] leading-[100%] tracking-[0] mb-6">
{props.description}
                  </p>

        
                    {/* Info Badges */}
                    <div className="flex items-center gap-8 mb-6 text-sm ">
                   
                    <div className="flex items-center gap-2 text-[#130719]  py-1.5 rounded-full font-[400] text-[20px] leading-[100%] tracking-[0]">
  <img src={"/I_1b.svg"} className="w-6 h-6" />
  {props.level} Level
</div>

                      <div  className="flex items-center gap-2 text-[#130719] font-[400] text-[20px]">
                        <img src={"/clocl.svg"} className="w-6 h-6" />
                        <span>{"2:00"}</span>
                      </div>
                      <div className=" flex justify-center items-center gap-2 text-[#130719] font-[400] text-[20px] ">
          <img src={"/star.svg"} className="w-6 h-6"/>
                        Score is {props.calculated} calculated in this module
                      </div>
                    </div>
        
                    {/* Begin Button */}
                    <div className="flex justify-center">
                    <Button
  onClick={() => props.setShowIntroModal(false)}
  className="
  bg-[#FF9348] text-white rounded-[6px] px-[10px] py-[8px]
  w-[197px] h-[42px] text-base font-[400] text-[18px]
  flex items-center justify-center gap-[10px]

  border-none outline-none ring-0 ring-offset-0
  focus:border-none focus:outline-none focus:ring-0 focus:ring-offset-0
  active:border-none
  
">
            Let's begin <ChevronRight 
             />
          </Button>
        </div>
                  </div>
                </DialogContent>
              </Dialog>
    )
}

export default OpeningModal;