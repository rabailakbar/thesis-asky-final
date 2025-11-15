import { useState, useRef, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Star, ThumbsUp, Clock, Play, CheckCircle, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import TargetCursor from "./animations/TargetCursor";
import OpeningModal from "./OpeningModal";
interface BiasQuizProps {
  imageUrl: string;
  headline: string;
  questionNumber: number;
  onComplete?: () => void;
  question?: any;
}


// Define biased words/phrases with difficulty levels

const BiasQuiz = ({ imageUrl, headline, questionNumber, onComplete,question }: BiasQuizProps) => {
  const biasedPhrases: any = {};

if (question.Keyword1) {
  biasedPhrases[question.Keyword1] = { difficulty: "medium", color: "#E9D5FF" };
}

if (question.Keyword2) {
  biasedPhrases[question.Keyword2] = { difficulty: "hard", color: "#E9D5FF" };
}

if (question.Keyword3!="") {
  biasedPhrases[question.Keyword3] = { difficulty: "hard", color: "#E9D5FF" };
}

  
  console.log(question)
  const [selections, setSelections] = useState<{ indices: number[], phrase: string, color: string | null }[]>([]);
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
    if (!gameStarted) return;
  
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
  }, [gameStarted]);


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
      setSelections(prev => [...prev, { indices: allIndices, phrase, color }]);
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
        setSelections(prev => [...prev, { indices: allIndices, phrase, color }]);
        setBuildingSelection([]);
      }
      
      setCurrentSelection([]);
    }
  };

  const getWordStyle = (index: number) => {
    // Check if word is in building selection
    if (buildingSelection.includes(index)) {
      return {
        backgroundColor: 'hsl(var(--primary) / 0.2)',
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

  // Call onComplete callback when quiz is complete
  useEffect(() => {
    if (selections.length >= 2 && onComplete) {
      const timer = setTimeout(() => {
        onComplete();
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [selections.length, onComplete]);


  
        
  const [showIntroModal,setShowIntroModal] = useState<boolean>(true)

console.log("imagecode",question?.Image_Code)
  return (<div className="p-6">
<div className="h-[90vh] px-24 p-8 bg-[#F8F1E7]">
<ModuleHeader time={timeLeft}/>
<OpeningModal
src={"/opening14.svg"}
          showIntroModal={showIntroModal}
          moduleId={"M4"}
          setShowIntroModal={setShowIntroModal}
        />
      
      <div className="max-w-6xl mx-auto">
        {/* Header - Exact match to image */}
      

        {/* YouTube-style content - Exact match to image */}
        <div>
          
          
          {/* YouTube-style card */}
          
          <div className=" px-32 bg-[#F8F1E7]">
          <p className="font-normal text-[#00000] text-[18px] leading-[100%] tracking-[0%] text-center  mb-4">
  Thumbnail #1
</p>


  <div>
    {/* Thumbnail */}
    <div className="rounded-lg overflow-hidden">
      <img
        src={`https://wlneuhivxmpiasjmmryi.supabase.co/storage/v1/object/public/Thesis/Modules/${question?.Image_Code}.png`}
        alt={`Question ${questionNumber}`}
        className="w-[60%] h-[60%] object-cover mx-auto"
        />
    </div>
  </div>
</div>

            <p className="font-normal text-[#00000] text-[18px] leading-[100%] tracking-[0%] text-center  my-8">
              Click words that help you spot any bias
            </p>
          
          {/* Headline text box - Exact match to image */}
          <Card className="p-4 w-[80%] mx-auto bg-[#EDE1D0] flex flex-col items-center border border-[#C6C1B9] border-dashed rounded-[13px]">
            
           
            
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
      lineHeight: '100%',
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
  className={`cursor-pointer inline-block transition-all duration-200 px-3 hover:rounded-lg ${
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
            {selections.length >= 2 && (
              <div className="flex items-center justify-center gap-2 mt-4">
                <Star className="w-5 h-5" fill="#FFEB01" stroke="#FFEB01" />
                <span className="font-medium text-foreground">Good Job</span>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
    </div>
  );
};

export default BiasQuiz;









const ModuleHeader = (props:any) => {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };
  return (
      <>
          <div className="  pt-6 mb-2">
              <div className="flex items-center justify-between">
                  {/* Left side: Icon + Module Info */}
                  <div className="flex items-center gap-8">
                      {/* Puzzle Icon */}
                      <div className="w-25 rounded-lg flex items-center justify-center relative flex-shrink-0 ">
                          <img
                              src={"/opening14.svg"}
                              alt="Module 1"
                              className="w-25  object-contain"
                          />
                      </div>

                      {/* Module Info */}
                      <div>
                      <h1 className="font-semibold text-[36px] leading-[100%] tracking-[0] text-[#201E1C] mb-2">
                      Spot the Bias</h1>

<p className="font-normal text-[16px] leading-[100%] tracking-[0] text-[#201E1C] mb-2">
What is words echo louder than actions?
</p>


                          <div className="flex items-center gap-4 text-[#201E1C]">
<img src={"/clocl.svg"} />

                              <span className="font-normal text-[24px] leading-[100%] tracking-[0]">
{formatTime(props.time)}
</span>

                          </div>

                      </div>
                  </div>

                  {/* Right side: Counter */}
                  <div className="text-right">
                      <div className="text-3xl font-bold text-gray-900">/7</div>
                  </div>
              </div>
          </div>

          {/* Instructions */}
          
      </>)
}




 