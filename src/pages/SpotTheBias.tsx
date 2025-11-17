import { useState, useEffect, useCallback, useMemo } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { supabase } from "@/integrations/supabase/client";
import BiasQuiz from "@/components/BiasQuiz";
import { useNavigate } from "react-router";
import CircleScore from "@/components/CircleScore";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";

const SpotTheBias = () => {
  const topic = useSelector((state: RootState) => state.topics.topics);
const score = useSelector((state:RootState)=>state.topics.score)
  const [questions, setQuestions] = useState<any[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [biasQuizComplete, setBiasQuizComplete] = useState(false);

  // Fetch 5 random questions from Supabase
  const fetchSpotTheBias = useCallback(async () => {
    const { data, error } = await supabase.from("spotthebias").select("*");
    if (error) {
      console.error("Error fetching spotthebias:", error);
      return;
    }

    if (!data || data.length === 0) return;

    // Pick 5 random questions
    const shuffled = data.sort(() => Math.random() - 0.5);
    const selectedQuestions = shuffled.slice(0, 5);

    setQuestions(selectedQuestions);
  }, []);

  useEffect(() => {
    fetchSpotTheBias();
  }, [fetchSpotTheBias]);

  const handleComplete = () => {
    if (currentQuestionIndex + 1 < questions.length) {
      setCurrentQuestionIndex((prev) => prev + 1);
    } else {
      setBiasQuizComplete(true);
    }
  };
  const currentQuestion = questions[currentQuestionIndex];
  console.log("check",questions)
    const imageUrl = useMemo(
      () =>
        `https://wlneuhivxmpiasjmmryi.supabase.co/storage/v1/object/public/Thesis/Modules/${currentQuestion?.Image_Code}.png`,
      [currentQuestion]
    );
  if (biasQuizComplete) return <ClosingModal score={score} />;

  if (questions.length === 0)
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Loading...</p>
      </div>
    );

 

  return (
    <BiasQuiz
    length={questions?.length}
    currentQuestionIndex={currentQuestionIndex}
      question={currentQuestion}
      imageUrl={imageUrl}
      headline={currentQuestion.headline}
      questionNumber={currentQuestionIndex + 1}
      onComplete={handleComplete}
    />
  );
};




const ClosingModal = (props) => {
  
  const navigate = useNavigate();


  return (
    <div className="p-8">
<div className="h-[90vh] flex items-center justify-center rounded-[24px] pt-8" style={{ backgroundColor: '#F8F1E7' }}>
              <div className="max-w-2xl w-full mx-auto bg-[#F8F1E7] rounded-3xl shadow-sm  text-center">

              {/* Module Completion Header */}
              <div className="flex  justify-center gap-4 mb-6">
              {/* <div className="mx-auto w-24 h-24 rounded-full  p-[12px] bg-[linear-gradient(180deg,#D0193E_0%,#5F237B_100%)]">
<div className="w-full h-full bg-[#FDF8F3] rounded-full flex items-center justify-center text-4xl font-semibold text-gray-700">
  –
</div>
</div> */}
  <CircleScore scoreDrop={props.score}/>

                  <div className="text-left">
                  <h1 className=" text-[#5F237B] font-bold text-[54px] leading-[100%] tracking-[0%]  mb-2">
                  Module 4: Complete</h1>


<p className="text-black font-normal text-[18px] leading-[100%] mt-1">
5/5 Thumbnails spotted!</p>

                  </div>
              </div>

              {/* Score Circle */}
              <div className="mt-10 mb-10 flex justify-center items-center">
<img src={"/closingg.svg"} className="h-[35vh]" />

              </div>

<div>
Look at that — your score’s low and your thinking’s leveling out. That’s what real awareness looks like. Stay curious, stay open, and keep the balance strong. </div>
              {/* Next Module Button */}
              <Button
                  size="lg"
                  onClick={() => navigate(`/behind-the-buzz`)}
                  className="mt-6 px-8 py-2 rounded-md bg-[#FF9348]  text-white text-base"
              >
                  Next Module <ChevronRight/>
              </Button>
          </div>
      </div>
      </div>
  );
} 
export default SpotTheBias;
