import { useState, useEffect, useCallback, useMemo } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { supabase } from "@/integrations/supabase/client";
import BiasQuiz from "@/components/BiasQuiz";
import ClosingModal from "@/components/ClosingModal";

const SpotTheBias = () => {
  const topic = useSelector((state: RootState) => state.topics.topics);

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
  if (biasQuizComplete) return <ClosingModal />;

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

export default SpotTheBias;
