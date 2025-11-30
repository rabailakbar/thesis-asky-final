import { useState, useEffect, useCallback } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
// Supabase not needed for single-question static content
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

  // Use a single predefined question and attached image/text
  const fetchSpotTheBias = useCallback(async () => {
    const singleQuestion: any = {
      Image_Text:
        "\u201CHow many times can there be lucky guesses before it\u2019s just the truth hiding in plain sight?\u201D\n#SimpsonsConspiracy",
      headline:
        "\u201CHow many times can there be lucky guesses before it\u2019s just the truth hiding in plain sight?\u201D\n#SimpsonsConspiracy",
      Image_Code: "sample",
      Bias_Type: "Bias cues",
      Tooltip1: "Wrong Logo, Not a real source",
      Tooltip2: "'Collapse' exaggerated word; Dramatic image; Caption that might spark controversy",
      Keyword1: "lucky guesses",
      Keyword2: "it’s just the truth",
      Keyword3: "#SimpsonsConspiracy",
    };
    setQuestions([singleQuestion]);
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
  const imageUrl = "/YTH12.png";
const[done,setDone] = useState(false)
  if (biasQuizComplete || done ) return <ClosingModal  ending= {"Look at that — your score’s low and your thinking’s leveling out. That’s what real awareness looks like. Stay curious, stay open, and keep the balance strong"} 
  src={"/behind-the-buzz"} text={"1/1 Thumbnail spotted!"} score={71} animateFrom={87} />;

  if (questions.length === 0)
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Loading...</p>
      </div>
    );

 
console.log
  return (
    <BiasQuiz
    setCurrentQuestionIndex={setCurrentQuestionIndex}
    setDone={setDone}
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
  <CircleScore scoreDrop={props.score} animateFrom={props.animateFrom}/>

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
