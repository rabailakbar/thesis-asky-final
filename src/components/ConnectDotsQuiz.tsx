"use client";

import { useState, useEffect, useMemo } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronRight, Clock } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useTimer } from "react-timer-hook";

interface Answer {
  id: string;
  answer_number: number;
  title: string;
  explanation: string;
}

interface Question {
  id: string;
  question_text: string;
  headline: string;
  tiktok_image_filename: string;
  correct_answer: number;
  answers: Answer[];
}


const ConnectDotsQuiz = ({ rounds }: any) => {
  const score = useSelector((state:RootState)=>state.topics.score)

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState("");
  const [isComplete, setIsComplete] = useState(false);
  const [showIntroModal, setShowIntroModal] = useState(true);

  const navigate = useNavigate();

  const currentRound = rounds[currentIndex]; // ← IMPORTANT
  const behind = currentRound?.behind;
  const answers = currentRound?.answers;

  // ----------------------------------------
  // Load image whenever the round changes
  // ----------------------------------------
  useEffect(() => {
    if (!behind) return;
    loadImage(`${behind.Image}.png`);
  }, [currentIndex]);

  const loadImage = async (filename: string) => {
    const cleanFilename = filename.replace(/\u200B/g, "");
    const { data } = supabase.storage
      .from("Thesis")
      .getPublicUrl(`Modules/${cleanFilename}`);

    if (data?.publicUrl) setImageUrl(data.publicUrl);
  };

  // ----------------------------------------
  // End Loading State
  // ----------------------------------------
  if (!currentRound || !answers) {
    return <p className="text-center mt-10">Loading...</p>;
  }
const dispatch = useDispatch();
  // ----------------------------------------
  // Handle Answer Click
  // ----------------------------------------
  const handleSelect = (word: string, isCorrect: boolean) => {
    setSelectedAnswer(word);
if(isCorrect){
  console.log(isCorrect)
  console.log(score)
  dispatch(decreaseScore(3))
}
    setTimeout(() => {
      if (currentIndex < rounds.length - 1) {
        setCurrentIndex((prev) => prev + 1);
        setSelectedAnswer(null);
      } else {
        setIsComplete(true);
      }
    }, 800);
  };

  // ----------------------------------------
  // COMPLETION SCREEN
  // ----------------------------------------
  // <ClosingModal  ending={ending} src={"/spotthebias"} module={3} text={"✓ 8/8 Facts served!"}  score={score}/>
const ending = <div>
You’ve outsmarted polarization and tackled biases! 
<br/>Your<span className="text-[#FF9348]"> curiosity’s</span> flying.<span className="text-[#5F237B]"> Good Job!</span> 
</div>
  const [done,setDone]= useState(false)

if (isComplete) {
    return (

      
        <ClosingModal module={5} text={"5/5 motivations behind a creator’s mind figured!"} src={"/debate"} ending={ending} score={score} />
      
    );
  }

  // ----------------------------------------
  // MAIN UI
  // ----------------------------------------
  return (<div className="p-8">
    <div className="p-8 bg-[#F8F1E7] min-h-screen flex flex-col items-center">
      <div className="w-full px-24  relative">

        <OpeningModal
          src={"/opening15.png"}
          showIntroModal={showIntroModal}
          moduleId={"M5"}
          setShowIntroModal={setShowIntroModal}
          
        />
      {/* <ModuleHeader src={"/opening13.png"} setDone={setDone} polarizationScore={score} module={3} heading="Fake or fact" description="Is everything not real?!" time={300}  left={8-currentQuestionIndex} total={8} /> */}

        <ModuleHeader src={"/opening15.png"}    total={5} setDone={setDone}   left={5-currentIndex} polarizationScore={score} />

        {/* Round/Question Header */}
        <h2 className="text-2xl font-normal text-black mb-6 text-center">
          Reel #{currentIndex + 1}
        </h2>

        {/* Image */}
        <div className="flex items-center justify-center rounded-2xl overflow-hidden mb-4">
          {behind?.Image && (
            <img
              src={imageUrl}
              alt="TikTok Post"
              className="h-[35vh] w-auto object-contain"
            />
          )}
        </div>

        {/* Text Box */}
        <div className="bg-[#EDE1D0] px-6 pb-8 pt-2 text-center">
          <p className="text-[black] text-lg font-normal">
            {behind?.Image_Text}
          </p>
        </div>

        {/* Reach Box */}
        <div className="bg-white flex justify-center items-center gap-10 py-2 mt-8">
          <div className="text-center">
            <p className="text-[#D0193E] font-bold text-3xl">
              {behind?.Reach?.split(" ")[0]}
            </p>
            <p className="text-gray-700 text-sm font-medium">
              {behind?.Reach?.split(" ")[1]}
            </p>
          </div>
        </div>

        {/* Question */}
        <p className="font-semibold text-gray-800 py-8 text-center">
          What might have made the creator post something that got so much attention?
        </p>

        {/* Answer Options */}
        <div className="grid grid-cols-3 gap-4">
          {answers.map((answer: any, index: number) => {
            const optionLabel = String.fromCharCode(65 + index); // A, B, C
            const isCorrect = answer.Word === behind.Correct_Answer;
            const isSelected = selectedAnswer === answer.Word;

            return (
              <Card
                key={answer.id}
                className={`
                  p-6 cursor-pointer transition-all border-2 bg-[#EDE1D0]
                  ${isSelected && isCorrect ? "bg-[#FF9348]" : ""}
                  ${isSelected && !isCorrect ? "border-red-500 bg-red-100" : ""}
                `}
                onClick={() => handleSelect(answer.Word, isCorrect)}
              >
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-black bg-white px-2 rounded-[33px] inline-block">
                    {optionLabel}
                  </h3>
                  <h3>{answer.Word}</h3>
                </div>

                <p className="text-gray-600 text-sm leading-relaxed">
                  {answer.Description}
                </p>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
    </div>
  );
};




export default ConnectDotsQuiz;

const ModuleHeader = (props) => {
  return (
      <>
          <div className="  pt-6 mb-2">
              <div className="flex items-center justify-between">
                  {/* Left side: Icon + Module Info */}
                  <div className="flex items-center gap-8">
                      {/* Puzzle Icon */}
                      <div className="w-25 rounded-lg flex items-center justify-center relative flex-shrink-0 ">
                          <img
                              src={"/opening15.png"}
                              alt="Module 1"
                              className="w-25  object-contain"
                          />
                      </div>

                      {/* Module Info */}
                      <div>
                      <h1 className="font-semibold text-[36px] leading-[100%] tracking-[0] text-[#201E1C] mb-2">
Behind the Buzz</h1>

<p className="font-normal text-[16px] leading-[100%] tracking-[0] text-[#201E1C] mb-2">
Trace the spark that sets your feed on fire
</p>


                          <div className="flex items-center gap-4 text-[#201E1C]">
<img src={"/clocl.svg"} />

                              <span className="font-normal text-[24px] leading-[100%] tracking-[0]">
02:00
</span>

                          </div>

                      </div>
                  </div>

                  {/* Right side: Counter */}
                  <div className="flex flex-col justify-between h-full items-end">
  {/* Top div */}
  <div>
    <div className="w-[200px] h-4 rounded-full bg-[#EDE1D0] overflow-hidden mb-1 relative">
      {/* Gray background track (already present) */}
      <div className="absolute top-0 left-0 w-full h-full bg-[#EDE1D0] rounded-full"></div>

      {/* Gradient foreground */}
      <div
        className="h-full rounded-full relative"
        style={{
          width: `${props.score || 5}%`,
          background: "linear-gradient(180deg, #D0193E 0%, #5F237B 100%)",
        }}
      />
    </div>
    <span className="text-sm text-gray-700"> Polarization Score</span>
  </div>

  {/* Bottom div */}
  <div>
    <div className="text-3xl font-bold text-gray-900">
      {props.currentIndex}/7 Left
    </div>
  </div>
</div>


              </div>
          </div>

          {/* Instructions */}
          
      </>)
}








import { Progress } from "@/components/ui/progress";
import {  ThumbsUp, ThumbsDown, Heart, Bookmark } from "lucide-react";
import { useSearchParams} from "react-router-dom";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store";
import { decreaseScore } from "@/store/topicsSlice";
import CircleScore from "./CircleScore";
import ClosingModal from "./ClosingModal";





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
            src={props.src}
            alt="Module 1"
            className="w-18 h-18 object-contain"
          />
        </div>
        
                      
                      {/* Title */}
                      <div>
                      <div className="text-[#D0193E] text-[24px] font-semibold ">Phase III</div>
                      <h2 className="text-[24px] font-bold text-black">Module 5: Behind the Buzz</h2>
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
                    Time to dive into the minds behind the viral!<br/>
                    Pick your prompts and uncover what really makes people hit “share.” 
                    See how personal motives and biases  spark chain reactions across your feed — and maybe even the whole internet!
                  </p>

        
                    {/* Info Badges */}
                    <div className="flex items-center gap-4 mb-6 text-sm">
                   
                    <div className="flex items-center gap-2 text-[#1E1E2F]  py-1.5 rounded-full font-[400] text-[18px] leading-[100%] tracking-[0]">
  <img src={"/I_1b.svg"} />
  Intermediate Level
</div>

                      <div className="flex items-center gap-2 text-[#1E1E2F]-600">
                        <img src={"/clocl.svg"} className="w-4 h-4 " />
                        <span>03:00</span>
                      </div>
                      <div className=" flex justify-center items-center gap-2 text-[#1E1E2F]-500 ">
          <img src={"/star.svg"}/>
                        Score is  calculated in this module
                      </div>
                    </div>
        
                    {/* Begin Button */}
                    <div className="flex justify-center">
                    <Button
  onClick={() => props.setShowIntroModal(false)}
  className="bg-[#FF9348] text-white rounded-[6px] px-[10px] py-[8px] w-[197px] h-[42px] text-base font-medium flex items-center justify-center gap-[10px]"
>
            Let's begin <ChevronRight/>
          </Button>
        </div>
                  </div>
                </DialogContent>
              </Dialog>
    )
}

