import { useState, useRef, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Star, ThumbsUp, Clock, Play, CheckCircle, ArrowLeft, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import TargetCursor from "./animations/TargetCursor";
interface BiasQuizProps {
  imageUrl: string;
  headline: string;
  questionNumber: number;
  onComplete?: () => void;
  question?: any;
  currentQuestionIndex:any
  length?:number;
  setDone?:any;
  setCurrentQuestionIndex:any;
}


// Define biased words/phrases with difficulty levels

const BiasQuiz = ({ imageUrl, headline, questionNumber, onComplete,question,currentQuestionIndex,length,setDone,setCurrentQuestionIndex }: BiasQuizProps) => {
  const biasedPhrases: any = {};

if (question.Keyword1) {
  biasedPhrases[question.Keyword1] = { difficulty: "easy", color: "#FFA96D" };
}

if (question.Keyword2) {
  biasedPhrases[question.Keyword2] = { difficulty: "medium", color: "#FFA96D" };
}

if (question.Keyword3!="") {
  biasedPhrases[question.Keyword3] = { difficulty: "hard", color: "#FFA96D" };
}
console.log(biasedPhrases)

useEffect(() => {
  // Clear selections and building state whenever the question changes
  setSelections([]);
  setCurrentSelection([]);
  setBuildingSelection([]);
  setCheck(false);
}, [currentQuestionIndex]);

  
  console.log(question)
  const [selections, setSelections] = useState<{ indices: number[], phrase: string, color: string | null, textColor?: boolean }[]>([]);
  const [currentSelection, setCurrentSelection] = useState<number[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [buildingSelection, setBuildingSelection] = useState<number[]>([]);
  const [timeLeft, setTimeLeft] = useState(120); // 2 minutes
  const [gameStarted, setGameStarted] = useState(false);
  const [quizComplete, setQuizComplete] = useState(false);
  const [showIntro, setShowIntro] = useState(true);
  const headlineRef = useRef<HTMLDivElement>(null);
  // Split headline into words while preserving spaces and punctuation
  const words = question.Image_Text.split(/(\s+)/);
  // Timer effect
  useEffect(() => {
    if (showIntro) return;
  
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          setQuizComplete(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  
    return () => clearInterval(timer);
  }, []);

console.log(timeLeft)
const score = useSelector((state:RootState)=>state.topics.score)
const dispatch = useDispatch();
  const checkAndCommitPhrase = (indices: number[]) => {
    const sortedIndices = [...indices].sort((a, b) => a - b);
    const minIndex = sortedIndices[0];
    const maxIndex = sortedIndices[sortedIndices.length - 1];
    
    const allIndices = [];
    for (let i = minIndex; i <= maxIndex; i++) {
      allIndices.push(i);
    }
    
    const phrase = allIndices.map(i => words[i]).join('');
    
    // Check for exact match or partial match
    let matchedPhrase = Object.keys(biasedPhrases).find(key => {
      const normalizedPhrase = phrase.toLowerCase().trim();
      const normalizedKey = key.toLowerCase().trim();
      return normalizedPhrase === normalizedKey || normalizedPhrase.includes(normalizedKey);
    });
    
    if (matchedPhrase) {
      const color = biasedPhrases[matchedPhrase as keyof typeof biasedPhrases].color;

  if(biasedPhrases[matchedPhrase as keyof typeof biasedPhrases].difficulty=="easy"){
  dispatch(decreaseScore(3.5))
  }
  if(biasedPhrases[matchedPhrase as keyof typeof biasedPhrases].difficulty=="medium"){
  dispatch(decreaseScore(5))
  }
  if(biasedPhrases[matchedPhrase as keyof typeof biasedPhrases].difficulty=="difficult"){
  dispatch(decreaseScore(7.5))
  }

      setSelections(prev => [...prev, { indices: allIndices, phrase, color, textColor: false }]);
      setBuildingSelection([]);


    }
  };

  const handleMouseDown = (index: number) => {
    const isWhitespace = /^\s+$/.test(words[index]);
    if (isWhitespace) return;
    
    // Check if word is already in a previous selection - allow clicking to remove
    const selectionIndex = selections.findIndex(sel => sel.indices.includes(index));
    if (selectionIndex !== -1) {
      setSelections(prev => prev.filter((_, i) => i !== selectionIndex));
      setBuildingSelection([]);
      return;
    }
    
    // Check if word is adjacent to building selection
    if (buildingSelection.length > 0) {
      const lastIndex = Math.max(...buildingSelection);
      const firstIndex = Math.min(...buildingSelection);
      
      // Allow adding adjacent words (with space in between)
      if (index === lastIndex + 2 || index === firstIndex - 2) {
        const newBuilding = [...buildingSelection, index];
        setBuildingSelection(newBuilding);
        checkAndCommitPhrase(newBuilding);
        return;
      } else {
        // Start new building selection if not adjacent
        setBuildingSelection([index]);
        checkAndCommitPhrase([index]);
      }
    } else {
      // Start building selection
      setBuildingSelection([index]);
      checkAndCommitPhrase([index]);
    }
    
    setIsDragging(true);
    setCurrentSelection([index]);
  };

  const handleMouseEnter = (index: number) => {
    if (isDragging) {
      const isWhitespace = /^\s+$/.test(words[index]);
      if (isWhitespace) return;
      
      // Check if word is already in a previous selection
      const isAlreadySelected = selections.some(sel => sel.indices.includes(index));
      if (isAlreadySelected) return;
      
      setCurrentSelection(prev => {
        if (!prev.includes(index)) {
          return [...prev, index];
        }
        return prev;
      });
    }
  };

  const handleMouseUp = () => {
    if (isDragging && currentSelection.length > 0) {
      setIsDragging(false);
      
      // Get the selected phrase - include all words and spaces between min and max indices
      const sortedIndices = [...currentSelection].sort((a, b) => a - b);
      const minIndex = sortedIndices[0];
      const maxIndex = sortedIndices[sortedIndices.length - 1];
      
      // Include all elements between min and max (including spaces)
      const allIndices = [];
      for (let i = minIndex; i <= maxIndex; i++) {
        allIndices.push(i);
      }
      
      const phrase = allIndices.map(i => words[i]).join('');
      
      const matchedPhrase = Object.keys(biasedPhrases).find(key => {
        const normalizedPhrase = phrase.toLowerCase().trim();
        const normalizedKey = key.toLowerCase().trim();
        return normalizedPhrase === normalizedKey || normalizedPhrase.includes(normalizedKey);
      });
      
      const color = matchedPhrase 
        ? biasedPhrases[matchedPhrase as keyof typeof biasedPhrases].color 
        : null;
      
      if (color) {
        setSelections(prev => [...prev, { indices: allIndices, phrase, color, textColor: false }]);
        setBuildingSelection([]);
      }
      
      setCurrentSelection([]);
    }
  };

  const getWordStyle = (index: number) => {
    // Check if word is in building selection
  if (buildingSelection.includes(index)) {
      return {
        padding: '4px 8px',
        borderRadius: '8px',
        margin: '0 2px',
        border: '2px dashed hsl(var(--primary))'
      };
    }
    
    // Check if word is in current selection (being dragged)
    if (currentSelection.includes(index)) {
      return {
        backgroundColor: 'hsl(var(--muted))',
        padding: '4px 8px',
        borderRadius: '8px',
        margin: '0 2px'
      };
    }
    
    // Check if word is in any completed selection
    const selection = selections.find(sel => sel.indices.includes(index));
    if (selection) {
      // If marked as text color, apply green to font instead of background
      if (selection.textColor) {
        return {
          color: selection.color ,
          padding: '4px 8px',
          borderRadius: '20px',
          margin: '0 2px'
        };
      }
      return {
        backgroundColor: selection.color || 'hsl(var(--muted))',
        padding: '4px 8px',
        borderRadius: '20px',
        margin: '0 2px'
      };
    }
    
    return undefined;
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const polarizationScore = Math.round((selections.length / 5) * 100);
const [check,setCheck] = useState(false)
  // When quiz is complete, show the right-side orange button to proceed
  useEffect(() => {
    console.log(selections.length)
    console.log(Object.keys(biasedPhrases).length)
    if (selections.length -1 >= Object.keys(biasedPhrases).length) {
      // Switch to green font color for correct answers once completed
      setSelections(prev => prev.map(sel => ({ ...sel, color: "#0D5623", textColor: true })));
      setCheck(true); // reveal the orange next button on the right
    }
  }, [selections.length]);


  
        
  const [showIntroModal,setShowIntroModal] = useState<boolean>(true)

console.log("imagecode",question?.Image_Code)
  return (<div className="p-12">
<div className="min-h-[90vh] px-24 pt-8  bg-[#F8F1E7] rounded-[24px] shadow-[0px_0px_25px_0px_#0000001A_inset]">
            <ModuleHeader started={!showIntroModal} setDone={setDone} module={4} src={"/opening14.svg"} heading={"Spot the bias"} headingColor="#D0193E" description={"What if words echo louder than actions?"}
             time={120}   left={1-currentQuestionIndex}    polarizationScore={score} />
  
{/* <ModuleHeader  polarizationScore={score} currentQuestionIndex={currentQuestionIndex}  length={length} time={timeLeft}/> */}
<OpeningModal
          showIntroModal={showIntroModal}
          moduleId={"M4"}
          setShowIntroModal={setShowIntroModal}
          src={"/opening14.svg"}
          phase={"II"}
          module={"Module 4: Spot the bias"}
          description={<div>
                <p className="text-[#1E1E2F] font-lato font-normal text-[16px] leading-[100%] tracking-[0] mb-6">
                        Let’s step into the shoes of a bias buster 🕵️‍♂️.<br/>
                        Look closely at headlines, YouTube thumbnails, and titles — can you spot the bias?<br/>Watch how certain words can make things sound bigger, louder, or more one-sided than they really are.
                        <br/>
                        For additional reference: The term Bias means when information, opinions, or decisions are influenced by personal feelings or assumptions instead of facts — leading to a slanted or unfair view of reality.
                      </p>         </div>
          }
          time={"2:00"}
level={"Intermediate"}
calculated={""}
        />
      
      <div className="   ">
        {/* Header - Exact match to image */}
        
    
      

        {/* YouTube-style content - Exact match to image */}
        <div>
          
          
          {/* YouTube-style card */}
          
          <div className="  bg-[#F8F1E7]">
          <p  className=" mt-8 font-medium text-[#00000] text-[1.5vw] leading-[100%] tracking-[0%] text-center  ">
          Click to identify 3 words OR phrases that sound biased
          </p>


          <div className="my-8 relative">
  {/* Thumbnail */}
  <div className="rounded-lg overflow-hidden relative">
    <img
      src={imageUrl}
      alt={`Question ${questionNumber}`}
      className="w-[50%] object-cover mx-auto"
    />

    {/* Next Button (appears after completion to open closing modal) */}
    { check && <div
      onClick={()=>{
        setCheck(false)
        onComplete && onComplete()
      }}
      className="absolute cursor-pointer top-1/2 right-0 -translate-y-1/2 z-20 w-16 h-16 flex items-center justify-center bg-[#FF9348] text-white rounded-full shadow-lg transition-colors"
    >
      <ChevronRight className="w-14 h-14" />
    </div>}
  </div>
</div>

</div>

            
          
       {/* Floating Tooltip */}
    

          {/* Headline text box - Exact match to image */}
          <div className=" rounded-tl-[50px] rounded-tr-[50px] rounded-br-[50px]
 relative p-4 w-[80%] mx-auto bg-[#EFE8DD] flex flex-col items-center  ">
            
          <div className="absolute   z-50" style={{ top: '-80px', left:'-3vh' }}>
 {selections.length-1 >= Object.keys(biasedPhrases).length &&   <TooltipCarousel
      slides={[
        { heading: question?.Bias_Type, description: question?.Tooltip1 },
        { description: question?.Tooltip2 }
      ]}
      onClose={() => false}
      header={true}
    />}
  </div>
         
          <div 
  ref={headlineRef}
  className="text-xl font-medium leading-relaxed text-center select-none"
  onMouseUp={handleMouseUp}
  onMouseLeave={handleMouseUp}
>
  {words.map((word, index) => {
    const isWhitespace = /^\s+$/.test(word);
    // if (isWhitespace) {
    //   return <span key={index}>{word}</span>;
    // }
    if (/^\s+$/.test(word)) return null;

    const isInCurrentSelection = currentSelection.includes(index);
    const isInAnySelection = selections.some(sel => sel.indices.includes(index));
    const wordStyle = getWordStyle(index);

    const defaultStyle = {
      fontFamily: 'Poppins',
      fontWeight: 600,
      fontStyle: 'semi-bold',  // Note: "semi-bold" is generally represented as 600 weight
      fontSize: '32px',
      lineHeight: '150%',
      letterSpacing: '0%',
      leadingTrim: 'none', 
      "text-align":'center'
           // If you are using CSS, `leading-trim: none` is not a standard property
    };

    const combinedStyle = {
      ...defaultStyle,
      ...wordStyle, // Apply any custom styles that may come from getWordStyle
    };

    return (
    <span
  key={index}
  onMouseDown={() => handleMouseDown(index)}
  onMouseEnter={() => handleMouseEnter(index)}
  style={combinedStyle}
  className={`cursor-pointer inline-block transition-all duration-200 mx-4 hover:rounded-lg ${
    !wordStyle && !isInCurrentSelection && !isInAnySelection
      ? 'hover:outline hover:outline-2 hover:outline-dashed hover:outline-foreground/40 hover:rounded-lg'
      : ''
  }`}
>
  {word}
</span>
    );
  })}
</div>

            
            {/* Success message - Exact match to image */}
            {/* {selections.length >= Object.keys(biasedPhrases).length && (
              <div className="flex items-center justify-center gap-2 mt-4">
                <Star className="w-5 h-5" fill="#FFEB01" stroke="#FFEB01" />
                <span className="font-medium text-foreground">Good Job</span>
              </div>
            )} */}
          </div>
        </div>
      </div>
    </div>
    </div>
  );
};

export default BiasQuiz;

import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useDispatch, useSelector } from "react-redux";
import { Root } from "react-dom/client";
import { RootState } from "@/store";
import { decreaseScore } from "@/store/topicsSlice";
import TooltipCarousel from "./TooltipCarousel";
import ModuleHeader from "./ModuleHeader";
import OpeningModal from "./OpeningModal";
















 