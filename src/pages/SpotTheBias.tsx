import { useState, useEffect, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import BiasQuiz from "@/components/BiasQuiz";
import { Button } from "@/components/ui/button";
import { useSelector } from "react-redux";
import { RootState } from "@/store";

// ✅ Moved out so it's not recreated each render
function ClosingModal() {
  const navigate = useNavigate();

  return (
    <div className="p-8">
      <div
        className="h-[90vh] flex items-start justify-center rounded-[24px] pt-8"
        style={{ backgroundColor: "#F8F1E7" }}
      >
        <div className="max-w-2xl w-full mx-auto bg-[#F8F1E7] rounded-3xl shadow-sm text-center">
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="mx-auto w-24 h-24 rounded-full p-[12px] bg-[linear-gradient(180deg,#D0193E_0%,#5F237B_100%)]">
              <div className="w-full h-full bg-[#FDF8F3] rounded-full flex items-center justify-center text-4xl font-semibold text-gray-700">
                –
              </div>
            </div>
            <div className="text-left">
              <h1 className="text-[#5F237B] font-bold text-[54px] leading-[100%] mb-2">
                Module 4: Complete
              </h1>
              <p className="text-black font-normal text-[18px] leading-[100%] mt-1">
                ✓ 7/7 Score interests narrowed!
              </p>
            </div>
          </div>

          <div className="mt-10 mb-10 flex justify-center items-center">
            <img src={"/closingg.svg"} className="h-[35vh]" />
          </div>

          <div>
            Yikes, 98% polarization! But that’s what we’re here for — to unpack it,
            learn, and bring the number down together.
          </div>

          <Button
            size="lg"
            onClick={() => navigate(`/behind-the-buzz`)}
            className="mt-6 px-8 py-2 rounded-md bg-[#FF9348] text-white text-base"
          >
            Next Module →
          </Button>
        </div>
      </div>
    </div>
  );
}

const SpotTheBias = () => {
  const topic = useSelector((state:RootState)=>state.topics.topics)

  const [question, setQuestion] = useState<any>(null);
  const [showResult, setShowResult] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [biasQuizComplete, setBiasQuizComplete] = useState(false);

  // ✅ All hooks must run unconditionally — no ifs before this line
  const biasQuestions = useMemo(
    () => [
      {
        id: "88f2ba55-5fdc-46b4-ade6-6f10d95820ef",
        module_id: "c5178024-4c23-437c-b590-342ee8f31299",
        question_number: 1,
        image_filename: "Modules/YTH_8b.png",
        headline:
          "How many times can there be lucky guesses before it's just the truth hiding in plain sight? #SimpsonsConspiracy",
      },
    ],
    []
  );

  const totalQuestions = biasQuestions.length;
  const currentQuestion = biasQuestions[currentQuestionIndex];

  const fetchSpotTheBias = useCallback(async () => {
    const { data, error } = await supabase.from("spotthebias").select("*");
    if (error) {
      console.error("Error fetching spotthebias:", error);
      return;
    }
    const randomTopic:number = topic[Math.floor(Math.random() * topic.length)];

    if (data?.[0] && JSON.stringify(data[0]) !== JSON.stringify(question)) {
      setQuestion(data[randomTopic]);
    }
   

  }, [question]);

  useEffect(() => {
    fetchSpotTheBias();
  }, []);

  const handleComplete = useCallback(() => {
    setBiasQuizComplete(true);
  }, []);

  useEffect(() => {
    if (!showResult) return;
    const timer = setTimeout(() => {
      setShowResult(false);
      if (currentQuestionIndex + 1 < totalQuestions) {
        setCurrentQuestionIndex((prev) => prev + 1);
      } else {
        setBiasQuizComplete(true);
      }
    }, 2000);
    return () => clearTimeout(timer);
  }, [showResult, currentQuestionIndex, totalQuestions]);

  // ✅ Always call hooks before conditional returns
  const imageUrl = useMemo(
    () =>
      `https://wlneuhivxmpiasjmmryi.supabase.co/storage/v1/object/public/Thesis/${question?.Image_Code}`,
    [currentQuestion.image_filename]
  );

  if (biasQuizComplete) return <ClosingModal />;

  if (!biasQuestions || biasQuestions.length === 0)
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>No questions found.</p>
      </div>
    );

  if (!question)
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Loading...</p>
      </div>
    );

  return (
    <BiasQuiz
    question={question}
      imageUrl={imageUrl}
      headline={currentQuestion.headline}
      questionNumber={currentQuestionIndex + 1}
      onComplete={handleComplete}
    />
  );
};

export default SpotTheBias;
