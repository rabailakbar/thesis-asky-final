import { useState, useRef, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Star, ThumbsUp, Clock, Play, CheckCircle, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import TargetCursor from "./animations/TargetCursor";
interface BiasQuizProps {
  imageUrl: string;
  headline: string;
  questionNumber: number;
  onComplete?: () => void;
  question?: any;
}


// Define biased words/phrases with difficulty levels

const BiasQuiz = ({ imageUrl, headline, questionNumber, onComplete,question }: BiasQuizProps) => {
  const biasedPhrases = {
    [question.Keyword1]: { difficulty: "medium", color: "#E9D5FF" },
    [question.Keyword2]: { difficulty: "hard", color: "#E9D5FF" },
    [question.Keyword3]: { difficulty: "hard", color: "#E9D5FF" },
  };
  
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
    if (selections.length >= 3 && onComplete) {
      const timer = setTimeout(() => {
        onComplete();
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [selections.length, onComplete]);


  

  if (showIntro) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6" style={{ backgroundColor: '#F8F1E7' }}>
        <div className="max-w-4xl w-full mx-auto bg-[#FDF8F3] rounded-3xl shadow-sm p-16">
          {/* Module Header */}
          <div className="flex items-start gap-6 mb-8">
            
            <div>
            <div className="w-20 h-20 rounded-lg flex items-center justify-center relative flex-shrink-0 ">
  <img
    src="/m4.png"
    alt="Module 1"
    className="w-20 h-20 object-contain"
  />
</div>               <p className="text-lg text-gray-600 mb-4">
                Let's dive into the clues of a bias hunter! Look closely at headlines, YouTube thumbnails, and titles - can you spot the bias? Watch how certain words can make things sound bigger, louder, or more one-sided than they really are.
              </p>
              <div className="bg-blue-50 rounded-lg p-4 mb-6">
                <h3 className="font-semibold text-blue-900 mb-2">For additional reference:</h3>
                <p className="text-sm text-blue-800">
                  Bias: "...information, opinions, or decisions are influenced by personal feelings or assumptions instead of facts..."
                </p>
              </div>
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <span className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  Intermediate Level
                </span>
                <span className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  02:00
                </span>
                <span>Score is calculated in this module</span>
              </div>
            </div>
          </div>

          {/* Walkthrough Video Placeholder */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-4">Walkthrough Video</h3>
            <div className="w-full h-48 bg-gray-200 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <Play className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-500">Video placeholder</p>
              </div>
            </div>
          </div>

          <div className="text-center">
            <Button
              size="lg"
              onClick={() => {
                setShowIntro(false);
                setGameStarted(true);
              }}
              className="px-8 py-3 rounded-md bg-[#7C3AED] hover:bg-[#6D28D9] text-white text-lg"
            >
              Let's begin →
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (quizComplete) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6" style={{ backgroundColor: '#F8F1E7' }}>
        <div className="max-w-2xl w-full mx-auto bg-[#FDF8F3] rounded-3xl shadow-sm p-16 text-center">
          {/* Header with icon and title */}
          <div className="flex items-center justify-center mb-6">
            <div className="w-12 h-12 bg-cyan-400 rounded-xl flex items-center justify-center mr-4">
              <CheckCircle className="w-6 h-6 text-white" />
            </div>
            <div className="text-left">
              <h1 className="text-3xl font-semibold text-black">Module 4: Complete</h1>
              <p className="text-gray-700 text-sm mt-1">
                ✓ 1/1 Biased Headlines Spotted! Good Job
              </p>
            </div>
          </div>

          {/* Score section */}
          <div className="mt-10 mb-10">
            <p className="text-gray-700 mb-4">Your new score is</p>
            
            {/* Circular Progress Bar with gradient */}
            <div className="mx-auto w-32 h-32 relative mb-6">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 120 120">
                {/* Background circle */}
                <circle
                  cx="60"
                  cy="60"
                  r="50"
                  stroke="#E5E7EB"
                  strokeWidth="10"
                  fill="transparent"
                />
                {/* Progress circle with gradient */}
                <circle
                  cx="60"
                  cy="60"
                  r="50"
                  stroke="url(#gradient)"
                  strokeWidth="10"
                  fill="transparent"
                  strokeDasharray="314.16"
                  strokeDashoffset="50.27"
                  strokeLinecap="round"
                />
                {/* Gradient definition */}
                <defs>
                  <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#FF5A5F" />
                    <stop offset="100%" stopColor="#8A2BE2" />
                  </linearGradient>
                </defs>
              </svg>
              {/* Percentage text */}
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-4xl font-semibold text-gray-700">84%</span>
              </div>
            </div>

            {/* Motivational message */}
            <p className="text-gray-600 text-sm leading-relaxed">
              You've outsmarted polarization and leveled up your perspective!<br />
              Your curiosity's flying. Good Job!
            </p>
          </div>

          <Button
            size="lg"
            onClick={() => window.location.href = '/dashboard'}
            className="mt-6 px-8 py-3 rounded-md bg-[#7C3AED] hover:bg-[#6D28D9] text-white text-base"
          >
            Back to Dashboard →
          </Button>
        </div>
      </div>
    );
  }

  return (<div className="p-6">
<div className="h-[90vh] px-24 p-8 bg-[#F8F1E7]">
<ModuleHeader time={timeLeft}/>

      
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
        src={`https://wlneuhivxmpiasjmmryi.supabase.co/storage/v1/object/public/Thesis/Module/${question?.Image_Code}`}
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
    if (isWhitespace) {
      return <span key={index}>{word}</span>;
    }

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
        className={`cursor-pointer inline-block transition-all duration-200 mx-3 ${
          !wordStyle && !isInCurrentSelection && !isInAnySelection
            ? 'hover:outline hover:outline-2 hover:outline-dashed hover:outline-foreground/40 hover:rounded-lg hover:px-1'
            : ''
        }`}
      >
        {word}
      </span>
    );
  })}
</div>

            
            {/* Success message - Exact match to image */}
            {selections.length >= 3 && (
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
                              src={"/characterm.svg"}
                              alt="Module 1"
                              className="w-25  object-contain"
                          />
                      </div>

                      {/* Module Info */}
                      <div>
                      <h1 className="font-semibold text-[36px] leading-[100%] tracking-[0] text-[#201E1C] mb-2">
Fake or fact</h1>

<p className="font-normal text-[16px] leading-[100%] tracking-[0] text-[#201E1C] mb-2">
Is everything not real?!
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




 