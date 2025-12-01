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
    // Prefer a direct public URL when provided
    if (behind.ImagePublicUrl) {
      setImageUrl(behind.ImagePublicUrl);
      return;
    }
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

      
    <ClosingModal module={5} text={"5/5 motivations behind a creator’s mind figured!"} src={"/debate"} ending={ending} score={56} animateFrom={71} />
      
    );
  }

  // ----------------------------------------
  // MAIN UI
  // ----------------------------------------
  
  return (<div className="p-12">
    <div className=" bg-[#F8F1E7] min-h-screen overflow-auto py-2  px-24 flex flex-col rounded-[24px] shadow-[0px_0px_25px_0px_#0000001A_inset] ">

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
          time={"2:00"}
          level={"Intermediate"}
          calculated={""}
          
        />
      {/* <ModuleHeader src={"/opening13.png"} setDone={setDone} polarizationScore={score} module={3} heading="Fake or fact" description="Is everything not real?!" time={300}  left={8-currentQuestionIndex} total={8} /> */}
      <ModuleHeader time={120} started={!showIntroModal} src={"/opening15.png"} heading="Behind the buzz" headingColor="#D0193E" description="Trace the spark that sets your feed on fire"  total={5} setDone={setDone}   left={1-currentIndex} polarizationScore={71} />


        {/* Round/Question Header */}
       

        {/* Image */}
        <p className=" font-normal text-[24px] leading-[100%] tracking-normal text-center py-8 text-gray-800">
  What might have made the creator post something that got so much attention?
</p>
<div className="w-full flex justify-center items-center" >
<div className="relative inline-block mb-8 rounded-2xl overflow-hidden">
  {/* The Image */}
  {behind?.Image && (
    <img
      src={imageUrl}
      alt="TikTok Post"
      className="h-[30vh] relative w-auto object-contain"
    />
  )}

  {/* TOP-LEFT BADGE */}
  <div className="absolute top-2 right-3 flex items-center gap-2 border border-black rounded-tl-[8px] rounded-tr-[8px]">
  <div
  className="
    w-[5vw]
    bg-[#E00040] text-white 
    flex flex-col items-center justify-center gap-[10px]
    rounded-tl-[8px] rounded-tr-[8px]
    border border-white/30
    text-xs font-semibold shadow-md
    py-5 px-2
    font-semibold text-[1.75vw]
  "
>     
 {behind?.Reach.split(" ")[0]} <span className="font-normal text-[1vw]">{behind?.Reach.split(" ")[1]}</span>
    </div>

    {/* <img
      src="/your-character.png"
      className="w-5 h-5"
      alt=""
    /> */}
  </div>
</div>
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
                className={`rounded-tl-3xl h-[20vh] rounded-tr-3xl rounded-br-3xl 
                  p-2 cursor-pointer transition-all bg-[#EFE8DD] px-4 hover:bg-[#FFA96D]
                  
                `}
                onClick={() => handleSelect(answer.Word, isCorrect)}
              >
             {!isSelected &&  <div className="group">
  <div className="flex items-center gap-4 mb-1">
    <h3 className="font-normal text-black text-[24px] bg-white rounded-full w-10 h-10 flex items-center justify-center group-hover:text-[#FFA96D]">
      {optionLabel}
    </h3>

    <h3 className="font-medium text-[24px] text-black group-hover:text-white">
      {answer.Word}
    </h3>
  </div>

  <p className="text-[#130719] text-sm group-hover:text-white">
    {answer.Description}
  </p>
</div>
}
                {
                  isSelected && isCorrect &&
                  <div className="flex h-full justify-center items-center">
                    <img  src="/try.svg" className=" h-[15vh]  object-contain"/>
                    </div>
                }
                {
                  isSelected && !isCorrect &&
                  <div className="flex h-full justify-center items-center">
                    <img src="/trynot.svg" className="h-[15vh] object-contain"/>
                    </div>
                }


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







