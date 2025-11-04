import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock, ThumbsUp, ChevronRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

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

interface ConnectDotsQuizProps {
  moduleId: string;
}

const ConnectDotsQuiz = ({ moduleId }: ConnectDotsQuizProps) => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [imageUrl, setImageUrl] = useState<string>("");
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes
  const [polarizationScore] = useState(98);
  const [isComplete, setIsComplete] = useState(false);
const navigate = useNavigate();
  useEffect(() => {
    fetchQuestions();
  }, [moduleId]);

  useEffect(() => {
    if (questions.length > 0 && questions[currentQuestionIndex]) {
      loadImage(questions[currentQuestionIndex].tiktok_image_filename);
    }
  }, [currentQuestionIndex, questions]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const fetchQuestions = async () => {
    const { data: questionsData, error: questionsError } = await supabase
      .from("connect_dots_questions")
      .select("*")
      .eq("module_id", moduleId)
      .order("question_number", { ascending: true });

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
    const { data } = supabase.storage
      .from("Thesis")
      .getPublicUrl(`Modules/${filename}`);
    
    setImageUrl(data.publicUrl);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  if (questions.length === 0) {
    return <div className="text-foreground">Loading...</div>;
  }

  const currentQuestion = questions[currentQuestionIndex];
  const questionsLeft = questions.length - currentQuestionIndex;

  if (isComplete) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6" style={{ backgroundColor: '#F8F1E7' }}>
        <div className="max-w-2xl w-full mx-auto bg-[#F8F1E7] rounded-3xl shadow-sm p-16 text-center">
          
          {/* Module Completion Header */}
          <div className="flex items-center justify-center gap-4 mb-6">
          <div className="w-20 h-20 rounded-lg flex items-center justify-center relative flex-shrink-0 ">
    <img
      src="/m1end.png"
      alt="Module 1"
      className="w-20 h-20 object-contain"
    />
  </div>
            <div className="text-left">
              <h1 className="text-3xl font-semibold text-black">
                {`Module 5: Complete`}
              </h1>
              <p className="text-gray-700 text-sm mt-1">
                ✓ 2/2 motivations behind a creator’s mind figured! 
              </p>
            </div>
          </div>
  
          {/* Score Circle */}
          <div className="mt-10 mb-10">
    <p className="text-gray-700 mb-4">Your new score is</p>
  
    {/* Gradient border circle */}
    <div className="mx-auto w-32 h-32 rounded-full p-[16px] bg-[linear-gradient(180deg,#FF5A5F_0%,#8B5CF6_100%)]">
      <div className="w-full h-full bg-[#FDF8F3] rounded-full flex items-center justify-center text-4xl font-semibold text-gray-700">
        –
      </div>
    </div>
  
    <p className="mt-6 text-gray-600 text-sm">
    You’ve outsmarted polarization and leveled up your perspective! Your curiosity’s flying. Good Job!     </p>
  </div>
  
  
          {/* Next Module Button */}
          <Button
            size="lg"
            onClick={() => navigate('/debate')}
            className="mt-6 px-8 py-3 rounded-md bg-[#7C3AED] hover:bg-[#6D28D9] text-white text-base"
          >
            Next Module →
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F1E7] flex flex-col items-center ">
      <div className="max-w-6xl w-full  rounded-3xl shadow-sm  space-y-10 relative">
        
        {/* Top progress bar */}
        <div className="absolute top-0 left-0 w-full h-3 bg-gray-200 rounded-t-3xl overflow-hidden">
          <div
            className="h-full bg-pink-500"
            style={{ width: `${polarizationScore}%` }}
          ></div>
        </div>
  
        {/* Header */}
        <div className="flex justify-between items-start">
          <div className="flex gap-4 items-center">
            <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center font-bold text-pink-600 text-2xl">
              M5
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Behind the Buzz</h1>
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
        </div>
  
        {/* Question Section */}
        <div>
          <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
            Headline #{currentQuestionIndex + 1}
          </h2>
  
          <div className="grid grid-cols-[320px_1fr] gap-10">
            {/* TikTok Image */}
            <div className="bg-black rounded-2xl overflow-hidden">
              {imageUrl && (
                <img
                  src={imageUrl}
                  alt="TikTok Post"
                  className="w-full h-auto object-contain"
                />
              )}
            </div>
  
            {/* Right Side Content */}
            <div className="flex flex-col justify-center space-y-6">
              <div className="bg-[#FFF9F2] rounded-xl p-6 text-center">
                <p className="text-gray-700 text-lg">
                  The following post could be counted as a successful post if we count the metrics.
                  <br />
                  <span className="font-semibold">Let’s break it down:</span>
                </p>
                <div className="bg-[#FF5A5F] text-center px-6 py-2 rounded-lg">
  <p className="text-white font-bold text-xl">
    25K Likes, 133 Comments, 90 saves & 157K reposts
  </p>
</div>

                <p className="text-gray-700 text-lg mt-4">
                  What might have influenced the creator to make content that gained this much attention?
                </p>
              </div>
  
              <div>
                <p className="font-semibold text-gray-800 mb-3">
                  Choose the most likely
                </p>
  
                {/* Answer Buttons */}
                <div className="grid grid-cols-3 gap-4">
                  {currentQuestion.answers.map((answer) => (
                    <Card
                      key={answer.id}
                      className={`p-6 bg-[#FFFEF2] cursor-pointer transition-all border-2 ${
                        selectedAnswer === answer.answer_number
                          ? "border-pink-500 bg-pink-50"
                          : "border-gray-200 hover:border-pink-400"
                      }`}
                      onClick={() => {
                        setSelectedAnswer(answer.answer_number);
                        setTimeout(() => setIsComplete(true), 1000);
                      }}
                    >
                     <h3 className="font-semibold text-gray-900 mb-2 border border-[#5DDEDE] rounded-2xl px-2 py-1 inline-block">
  {answer.title}
</h3>

                      <p className="text-gray-600 text-sm leading-relaxed">
                        {answer.explanation}
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
  );
  
};

export default ConnectDotsQuiz;

