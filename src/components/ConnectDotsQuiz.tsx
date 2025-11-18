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

if (isComplete ||done) {
    return (

      
        <ClosingModal module={5} text={"5/5 motivations behind a creator’s mind figured!"} src={"/debate"} ending={ending} score={score} />
      
    );
  }

  // ----------------------------------------
  // MAIN UI
  // ----------------------------------------
  
  return (<div className="p-6">
    <div className=" bg-[#F8F1E7] h-[90vh]  px-24 flex flex-col ">

      <div className="   ">

        <OpeningModal
          src={"/opening15.png"}
          showIntroModal={showIntroModal}
          moduleId={"M5"}
          setShowIntroModal={setShowIntroModal}
          phase={"II"}
          module={"Module 5: Behind the buzz"}
          description={<div>
            Time to dive into the minds behind the viral!<br/>Pick your prompts and uncover what really makes people hit “share.” See how personal motives and biases  spark chain reactions across your feed — and maybe even the whole internet!
          </div>
          }
          time={"3:00"}
          level={"Intermediate"}
          calculated={""}
          
        />
      {/* <ModuleHeader src={"/opening13.png"} setDone={setDone} polarizationScore={score} module={3} heading="Fake or fact" description="Is everything not real?!" time={300}  left={8-currentQuestionIndex} total={8} /> */}
      <ModuleHeader time={300} src={"/opening15.png"} heading="Behind the buzz" description="Trace the spark that sets your feed on fire"  total={5} setDone={setDone}   left={5-currentIndex} polarizationScore={score} />


        {/* Round/Question Header */}
       

        {/* Image */}
        <p className=" font-normal text-[24px] leading-[100%] tracking-normal text-center py-8 text-gray-800">
  What might have made the creator post something that got so much attention?
</p>

        <div className="flex mb-8 items-center justify-center rounded-2xl overflow-hidden mb-4">
          {behind?.Image && (
            <img
              src={imageUrl}
              alt="TikTok Post"
              className="h-[30vh] w-auto object-contain"
            />
          )}
        </div>

        {/* Text Box */}
        {/* <div className="bg-[#EDE1D0] px-6 pb-8 pt-2 text-center">
          <p className="text-[black] text-lg font-normal">
            {behind?.Image_Text}
          </p>
        </div>

       
        <div className="bg-white flex justify-center items-center gap-10 py-2 mt-8">
          <div className="text-center">
            <p className="text-[#D0193E] font-bold text-3xl">
              {behind?.Reach?.split(" ")[0]}
            </p>
            <p className="text-gray-700 text-sm font-medium">
              {behind?.Reach?.split(" ")[1]}
            </p>
          </div>
        </div> */}

        {/* Question */}
        

        {/* Answer Options */}
        <div className="grid grid-cols-3 gap-4 mx-48">
          {answers.map((answer: any, index: number) => {
            const optionLabel = String.fromCharCode(65 + index); // A, B, C
            const isCorrect = answer.Word === behind.Correct_Answer;
            const isSelected = selectedAnswer === answer.Word;

            return (
              <div
                key={answer.id}
                className={`rounded-tl-3xl rounded-tr-3xl rounded-br-3xl 
                  p-2 cursor-pointer transition-all  bg-[#EDE1D0] px-4
                  ${isSelected && isCorrect ? "bg-[#FF9348]" : ""}
                  ${isSelected && !isCorrect ? "border-red-500 bg-red-100" : ""}
                `}
                onClick={() => handleSelect(answer.Word, isCorrect)}
              >
                <div className="flex items-center gap-4 mb-1">
                  <h3 className=" font-normal text-black bg-white px-2 rounded-[33px] inline-block">
                    {optionLabel}
                  </h3>
                  <h3 className="font-medium">{answer.Word}</h3>
                </div>

                <p className="text-[#130719] text-sm ">
                  {answer.Description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
    </div>
  );
};




export default ConnectDotsQuiz;










import { Progress } from "@/components/ui/progress";
import {  ThumbsUp, ThumbsDown, Heart, Bookmark } from "lucide-react";
import { useSearchParams} from "react-router-dom";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store";
import { decreaseScore } from "@/store/topicsSlice";
import CircleScore from "./CircleScore";
import ClosingModal from "./ClosingModal";
import ModuleHeader from "./ModuleHeader";
import OpeningModal from "./OpeningModal";







