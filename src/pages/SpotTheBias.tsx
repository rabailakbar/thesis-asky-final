import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

import BiasQuiz from "@/components/BiasQuiz";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CircularProgress } from "@/components/CircularProgress";
import { Clock } from "lucide-react";

const SpotTheBias = () => {
  const navigate = useNavigate();
  const moduleId = "M4";

  const [selectedPost, setSelectedPost] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [biasQuizComplete, setBiasQuizComplete] = useState(false);




  // Fetch bias quiz questions
  
 
const biasQuestions = [
  {
      "id": "88f2ba55-5fdc-46b4-ade6-6f10d95820ef",
      "module_id": "c5178024-4c23-437c-b590-342ee8f31299",
      "question_number": 1,
      "image_filename": "Modules/YTH_8b.png",
      "headline": "How many times can there be lucky guesses before it's just the truth hiding in plain sight? #SimpsonsConspiracy",
      "created_at": "2025-10-06T18:13:10.490156+00:00"
  }
]

  const totalQuestions = biasQuestions.length;
  const currentQuestion = biasQuestions[currentQuestionIndex];
  const questionsLeft = `${currentQuestionIndex + 1}/${totalQuestions} Left`;

  console.log("biasQuestions:", biasQuestions);
  console.log("currentQuestionIndex:", currentQuestionIndex);

  // Auto-advance after showing result
  useEffect(() => {
    if (showResult) {
      const timer = setTimeout(() => {
        setShowResult(false);
        setSelectedPost(null);

        if (currentQuestionIndex + 1 < totalQuestions) {
          setCurrentQuestionIndex((prev) => prev + 1);
        } else {
          // All questions done
          setBiasQuizComplete(true);
        }
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [showResult, currentQuestionIndex, totalQuestions]);

  // 🧠 Render Logic
  

  if (biasQuizComplete) {
    return (
      <ClosingModal/>
    );
  }

  if (!biasQuestions || biasQuestions.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>No questions found.</p>
      </div>
    );
  }

  return (
    <>
    
    <BiasQuiz
      imageUrl={`https://wlneuhivxmpiasjmmryi.supabase.co/storage/v1/object/public/Thesis/${currentQuestion.image_filename}`}
      headline={currentQuestion.headline}
      questionNumber={currentQuestionIndex + 1}
      onComplete={() => {
        setCorrectAnswers(3);
        setBiasQuizComplete(true);
      }}
    />
    </>
  );
};

export default SpotTheBias;


const ClosingModal = () => {

  const navigate = useNavigate();


  return (
<div className="h-[90vh] flex items-start justify-center rounded-[24px] pt-24" style={{ backgroundColor: '#F8F1E7' }}>
              <div className="max-w-2xl w-full mx-auto bg-[#F8F1E7] rounded-3xl shadow-sm  text-center">

              {/* Module Completion Header */}
              <div className="flex items-center justify-center gap-4 mb-6">
                  
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
              <div className="mt-10 mb-10">
              <p className="text-center text-[black] font-normal text-[18px] leading-[100%] mb-8">
Your new score is
</p>

                  {/* Gradient border circle */}
                  <div className="mx-auto w-48 h-48 rounded-full  p-[24px] bg-[linear-gradient(180deg,#D0193E_0%,#5F237B_100%)]">
<div className="w-full h-full bg-[#FDF8F3] rounded-full flex items-center justify-center text-4xl font-semibold text-gray-700">
  –
</div>
</div>


<p className="mt-16 text-center text-black font-normal text-[24px] leading-[100%]">
We’ll start calculating from the next module…
</p>

              </div>


              {/* Next Module Button */}
              <Button
                  size="lg"
                  onClick={() => navigate(`/M5`)}
                  className="mt-6 px-8 py-2 rounded-md bg-[#FF9348] hover:bg-[#6D28D9] text-white text-base"
              >
                  Next Module →
              </Button>
          </div>
      </div>
  );
} 