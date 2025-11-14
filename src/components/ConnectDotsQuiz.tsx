"use client";

import { useState, useEffect, useMemo } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import ModuleHeader from "./ModuleHeader";
import { useTimer } from "react-timer-hook";
import OpeningModal from "./OpeningModal";

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


const ConnectDotsQuiz = (props:any) => {
  //  const getTime = ()=> {
  // const time = new Date();
  // time.setSeconds(time.getSeconds() + 120); 
 
  // return {time}}
  // const {minutes} = useTimer({
  //   expiryTimestamp:getTime().time

  // })

 
   const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [imageUrl, setImageUrl] = useState<string>("");
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes
  const [polarizationScore] = useState(98);
  const [isComplete, setIsComplete] = useState(false);
  console.log("behindqs",props.behindqs)
  const navigate = useNavigate()

  // useEffect(() => {
  //   if (questions.length > 0 && questions[currentQuestionIndex]) {
  //     loadImage(questions[currentQuestionIndex].tiktok_image_filename);
  //   }
  // }, [currentQuestionIndex, questions]);
  useEffect(()=>{
loadImage(`${props.behindqs.Image}.png`)
  },[])

  

  const fetchQuestions = async () => {
    const { data: questionsData, error: questionsError } = await supabase
      .from("connect_dots_questions")
      .select("*");
    if (questionsError) {
      console.error("Error fetching questions:", questionsError);
      return;
    }

    if (!questionsData || questionsData.length === 0) return;

    const questionsWithAnswers = await Promise.all(
      questionsData.map(async (question) => {
        const { data: answersData } = await supabase
          .from("connect_dots_answers")
          .select("*")
          .eq("question_id", question.id)
          .order("answer_number", { ascending: true });

        return {
          ...question,
          answers: answersData || [],
        };
      })
    );

    setQuestions(questionsWithAnswers);
  };

  const loadImage = async (filename: string) => {
    const cleanFilename = filename.replace(/\u200B/g, ""); // remove zero-width spaces
    const { data } = supabase.storage
      .from("Thesis")
      .getPublicUrl(`Modules/${cleanFilename}`);
  
    console.log(data);
    if (data?.publicUrl) setImageUrl(data.publicUrl);
  };

 

  if (!props.behindqs&&!props.answers) {
    return <div className="text-center text-gray-700">Loading...</div>;
  }

  
  if (isComplete) {
    return (
      // <div
      //   className="min-h-screen flex items-center justify-center p-6"
      //   style={{ backgroundColor: "#F8F1E7" }}
      // >
      //   <div className="max-w-2xl w-full mx-auto bg-[#F8F1E7] rounded-3xl shadow-sm p-16 text-center">
      //     {/* Module Completion Header */}
      //     <div className="flex items-center justify-center gap-4 mb-6">
      //       <img
      //         src="/m1end.png"
      //         alt="Module 1"
      //         className="w-20 h-20 object-contain"
      //       />
      //       <div className="text-left">
      //         <h1 className="text-3xl font-semibold text-black">
      //           Module 5: Complete
      //         </h1>
      //         <p className="text-gray-700 text-sm mt-1">
      //           ✓ 2/2 motivations behind a creator’s mind figured!
      //         </p>
      //       </div>
      //     </div>

      //     {/* Score Circle */}
      //     <div className="mt-10 mb-10">
      //       <p className="text-gray-700 mb-4">Your new score is</p>
      //       <div className="mx-auto w-32 h-32 rounded-full p-[16px] bg-[linear-gradient(180deg,#FF5A5F_0%,#8B5CF6_100%)]">
      //         <div className="w-full h-full bg-[#FDF8F3] rounded-full flex items-center justify-center text-4xl font-semibold text-gray-700">
      //           –
      //         </div>
      //       </div>
      //       <p className="mt-6 text-gray-600 text-sm">
      //         You’ve outsmarted polarization and leveled up your perspective!
      //         Your curiosity’s flying. Good Job!
      //       </p>
      //     </div>

      //     <Button
      //       size="lg"
      //       onClick={() => navigate("/debate")}
      //       className="mt-6 px-8 py-3 rounded-md bg-[#7C3AED] hover:bg-[#6D28D9] text-white text-base"
      //     >
      //       Next Module →
      //     </Button>
      //   </div>
      // </div>
      <ClosingModal/>
    );
  }
const [showIntroModal,setShowIntroModal] = useState<boolean>(true);
  return (
    <div className="p-8">
<div className=" bg-[#F8F1E7] p-4 overflow-auto flex flex-col items-center">
<div className=" w-full px-24 rounded-3xl shadow-sm  relative bg-[#F8F1E7] ">
      <OpeningModal
      src={"/opening15.png"}
          showIntroModal={showIntroModal}
          moduleId={"M5"}
          setShowIntroModal={setShowIntroModal}
        />
      

        {/* Header */}
        {/* <div className="flex justify-between items-start">
          <div className="flex gap-4 items-center">
            <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center font-bold text-pink-600 text-2xl">
              M5
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Behind the Buzz
              </h1>
              <p className="text-gray-500">
                Trace the spark that sets your feed on fire!
              </p>
              <div className="flex items-center gap-2 mt-2">
                <Clock className="w-5 h-5 text-gray-700" />
                <span className="font-semibold text-gray-700">
                  {formatTime(timeLeft)}
                </span>
              </div>
            </div>
          </div>

          <div className="text-right">
            <p className="text-sm text-gray-500 mb-1">Polarization Score</p>
            <div className="bg-pink-100 text-pink-600 font-semibold px-5 py-2 rounded-full inline-block">
              {polarizationScore}%
            </div>
            <div className="text-gray-900 font-bold mt-3 text-lg">
              {questionsLeft}/{questions.length} Left
            </div>
          </div>
        </div> */}
        <ModuleHeader/>

        {/* Question Section */}
        <div>
          <h2 className="text-2xl font-normal text-black mb-6 text-center">
            Reel #{currentQuestionIndex + 1}
          </h2>
          <div className="flex items-center justify-center rounded-2xl overflow-hidden mb-4">
              {props.behindqs.Image && (
                <img
                src={imageUrl}
                  alt="TikTok Post"
                  className="h-[35vh] w-auto object-contain "
                />
              )}
            </div>
          <div className=" gap-10">
            {/* TikTok Image */}
           
            {/* Right Side Content */}
            <div className="flex flex-col ">
              <div  >
              <div className="bg-[#EDE1D0]  px-6 pb-8 pt-2  text-center">
                <p className="text-[black] text-lg font-normal">
{props.behindqs?.Image_Text ||"Loading..."}                 
                </p>
               
               
              </div>
              <div className="bg-white flex justify-center items-center gap-10 py-2">
    <div className="text-center">
      <p className="text-[#D0193E] font-bold text-3xl">{props.behindqs?.Reach.split(" ")[0]}</p>
      <p className="text-gray-700 text-sm font-medium">{props.behindqs?.Reach.split(" ")[1]}</p>
    </div>
    {/* <div className="text-center">
      <p className="text-[#D0193E] font-bold text-3xl">133</p>
      <p className="text-gray-700 text-sm font-medium">Comments</p>
    </div>
    <div className="text-center">
      <p className="text-[#D0193E] font-bold text-3xl">90</p>
      <p className="text-gray-700 text-sm font-medium">Saves</p>
    </div>
    <div className="text-center">
      <p className="text-[#D0193E] font-bold text-3xl">157K</p>
      <p className="text-gray-700 text-sm font-medium">Reposts</p>
    </div> */}
  </div>
              </div>

              {/* Answer Buttons */}
              <div >
                <p className="font-semibold text-gray-800 py-8 text-center">
                What might have made the creator post something that got so much attention?   
                             </p>

                <div className="grid grid-cols-3 gap-4">
                  {props.answers?.map((answer) => (
                    <Card
                      key={answer.id}
                      className={`p-6 bg-[#EDE1D0] cursor-pointer transition-all border-2 ${
                        selectedAnswer === answer.answer_number
                          ? "border-pink-500 bg-pink-50"
                          : "border-gray-200 hover:border-pink-400"
                      }`}
                      onClick={() => {
                        setSelectedAnswer(answer.answer_number);
                        // move to next question or complete
                        setTimeout(() => {
                          if (currentQuestionIndex < questions.length - 1) {
                            setCurrentQuestionIndex((prev) => prev + 1);
                            setSelectedAnswer(null);
                          } else {
                            setIsComplete(true);
                          }
                        }, 800);
                      }}
                    >
                   <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-black bg-[white] px-2 rounded-[33px] inline-block">
                        A
                      </h3>
                      
                      <h3>{answer.Word}</h3>
                      </div>
                      <p className="text-gray-600 text-sm leading-relaxed">
                        {answer.Description}
                      </p>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
};


export default ConnectDotsQuiz;





 function ClosingModal () {

  const navigate = useNavigate();


  return (
    <div className="p-8">
<div className="h-[90vh] flex items-start justify-center rounded-[24px] pt-8" style={{ backgroundColor: '#F8F1E7' }}>
              <div className="max-w-2xl w-full mx-auto bg-[#F8F1E7] rounded-3xl shadow-sm  text-center">

              {/* Module Completion Header */}
              <div className="flex items-center justify-center gap-4 mb-6">
              <div className="mx-auto w-24 h-24 rounded-full  p-[12px] bg-[linear-gradient(180deg,#D0193E_0%,#5F237B_100%)]">
<div className="w-full h-full bg-[#FDF8F3] rounded-full flex items-center justify-center text-4xl font-semibold text-gray-700">
  –
</div>
</div>
                  <div className="text-left">
                  <h1 className=" text-[#5F237B] font-bold text-[54px] leading-[100%] tracking-[0%]  mb-2">
  Module 4: Complete
</h1>


<p className="text-black font-normal text-[18px] leading-[100%] mt-1">
✓ 7/7 Score interests narrowed!
</p>

                  </div>
              </div>

              {/* Score Circle */}
              <div className="mt-10 mb-10 flex justify-center items-center">
<img src={"/closingg.svg"} className="h-[35vh]" />

              </div>

<div>
Yikes, 98% polarization! But that’s what we’re here for — to unpack it, learn, and bring the number down together. Lower the score, lower the polarization.... and that's how you win!
</div>
              {/* Next Module Button */}
              <Button
                  size="lg"
                  onClick={() => navigate(`/debate`)}
                  className="mt-6 px-8 py-2 rounded-md bg-[#FF9348]  text-white text-base"
              >
                  Next Module →
              </Button>
          </div>
      </div>
      </div>
  );
} 
