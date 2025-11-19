import { useState, useEffect } from "react";
import { Timer, ThumbsUp } from "lucide-react";
import { useNavigate } from "react-router-dom";

const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY;


const DebateSwitch = (props) => {
  console.log(props)
  const navigate = useNavigate();
  const [figureImageUrl, setFigureImageUrl] = useState<string>("");
  const [llmArgument, setLlmArgument] = useState<string>("Thinking...");
  const [userPrompts, setUserPrompts] = useState<string[]>([]);
  const [selectedPrompt, setSelectedPrompt] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showUserOptions, setShowUserOptions] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(180);
  const [stance, setStance] = useState("against");
  const score= useSelector((state:RootState)=>state.topics.score)
  const DEBATE_TOPIC =props?.debate?.Debate_Question || `"Are Millennials the forgotten generation in the mental health conversation, overshadowed by Gen Z’s
  louder struggles?"`;
  // Timer
  console.log(timeLeft)
  console.log(props.round)
  useEffect(() => {

    if(timeLeft<=0 && props.round >=3){
      console.log(4)
      setIsCompleted(true)
    }
    if (timeLeft <= 0) {
      // One full round (180s) finished → go next topic
      props.goNext();

      return;
    }
  
    // Switch stance based on time passed
    if (timeLeft < 90) {
      // First half (90 sec)
      setStance("against");   // LLM = against, Player = for
    } else {
      // Last half (90 sec)
      setStance("for");       // LLM = for, Player = against
    }
  
    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);
  
    return () => clearInterval(timer);
  
  }, [timeLeft]);
  
 

 
  // Load image
 

  // Initialize
  useEffect(() => {
    const init = async () => {
      await getLlmArgument([]);
      await generateUserPrompts();
    };
    init();
  }, []);

  // --- Prompt generator ---
  const parsePrompts = (text: string): string[] => {
    try {
      const first = text.indexOf("[");
      const last = text.lastIndexOf("]");
      if (first >= 0 && last > first) {
        const arr = JSON.parse(text.slice(first, last + 1));
        if (Array.isArray(arr)) {
          return arr
            .map((s) => String(s).trim())
            .filter(Boolean)
            .slice(0, 3);
        }
      }
    } catch {}
    const lines = text
      .split(/\r?\n/)
      .map((l) => l.trim())
      .filter(Boolean);
    const cleaned = lines
      .map((l) =>
        l
          .replace(/^[\d\.\)\-]+\s*/, "")
          .replace(/^["']|["']$/g, "")
          .trim(),
      )
      .filter(Boolean);
    if (cleaned.length >= 3) return cleaned.slice(0, 3);
    return [
      "AI helps people do creative work faster so we can focus on what matters.",
      "AI can save lives by improving medical diagnosis and treatment.",
      "Used responsibly, AI makes it easier to solve problems and care for others.",
    ];
  };
  const playerSide = stance === "against" ? "in favor of" : "against";

  const generateUserPrompts = async () => {
    try {
      const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${GROQ_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "llama-3.1-8b-instant",
          messages: [
            {
              role: "system",
              content: `Return ONLY a JSON array of 3 short strings (max 15 words) strongly arguing ${playerSide} the topic: ${DEBATE_TOPIC}.`,
            },
          ],
          temperature: 0.8,
          max_tokens: 200,
        }),
      });
      const data = await res.json();
      const raw = data?.choices?.[0]?.message?.content || "";
      const prompts = parsePrompts(raw);
      setUserPrompts(prompts);
      setShowUserOptions(true);
    } catch (e) {
      setUserPrompts([
        "AI helps people do creative work faster so we can focus on what matters.",
        "AI can save lives by improving medical diagnosis and treatment.",
        "Used responsibly, AI makes it easier to solve problems and care for others.",
      ]);
      setShowUserOptions(true);
    }
  };

  // --- LLM Argument (AGAINST topic) ---
  const getLlmArgument = async (messages: any[]) => {
    setIsLoading(true);
  
    const SYSTEM_MESSAGE =
      stance === "against"
        ? `You are arguing AGAINST the topic: ${DEBATE_TOPIC}. Respond in 1 short, simple sentence.`
        : `You are arguing IN FAVOR of the topic: ${DEBATE_TOPIC}. Respond in 1 short, simple sentence.`;
  
    try {
      const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${GROQ_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "llama-3.1-8b-instant",
          messages: [
            {
              role: "system",
              content: SYSTEM_MESSAGE,
            },
            ...messages,
          ],
          temperature: 0.7,
          max_tokens: 200,
        }),
      });
  
      const data = await res.json();
      setLlmArgument(
        data?.choices?.[0]?.message?.content ||
          "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"
      );
    } catch {
      setLlmArgument("⚠️ Unable to fetch AI argument.");
    } finally {
      setIsLoading(false);
    }
  };
  
  console.log(score)
const dispatch = useDispatch();
  const handlePromptClick = async (i: number) => {
    setSelectedPrompt(i);
    setShowUserOptions(false);
    dispatch(decreaseScore(1))
    const chosen = userPrompts[i - 1];
  
    setTimeout(async () => {
      await getLlmArgument([{ role: "user", content: chosen }]);
  
      // Switch stance or end topic
     
  
      await generateUserPrompts();
      setSelectedPrompt(null);
    }, 1200);
  };
  

 



  return ( isCompleted)?(  <ClosingModal  ending={<div><span className="text-[#5F237B]">Keep going,</span> We’re almost there! </div> }src={"/debate/final"} module={6} text={"4/4 Debates switch "}  score={score}/>
  ):(
    <main>
    
  
      {/* Headline */}
      <div className="pt-8 pb-12">
      <div className="text-center">
        <p className="text-xl font-medium text-[#130719]">Headline #1</p>
      </div>
      <div className="text-center ">
        <p className=" text-xl font-medium text-[#130719]">
          Argue {stance!="against"&& "in"} <span className="text-[#5F237B] font-bold">{stance=="against"?"against":"favor"}</span> {stance!="against" && "of"} the headline by <span className="font-bold text-[#FF9348]" >choosing</span> the best prompt
        </p>
      </div>
      </div>
  
      {/* Red Banner */}
      <div className="bg-[#5F237B] rounded-tl-3xl text-white text-center py-2 ml-16 px-6 mb-4 ">
        <p className="text-xl font-medium">{DEBATE_TOPIC}</p>
      </div>
  
      {/* Debate Row — this now fills all remaining vertical space */}
      <div className="flex justify-between flex-grow gap-18 px-8 items-stretch mb-4">
  {/* Opponent Side */}
  <div className="flex items-stretch gap-6 text-center">
    <div className="flex flex-col justify-end">
      <p className="text-sm text-gray-700 font-medium ">Opponent LLM</p>
      <img
        src="/opponent.svg"
        alt="Opponent"
        className="w-72 h-full object-contain"
      />
    </div>

    {/* Opponent Argument */}
    <div className="bg-[#EDE1D0] rounded-tl-[50px] rounded-tr-[50px] rounded-br-[50px] w-[200px] flex items-center justify-center shadow-sm p-4 h-[100%]">
      <p className="text-gray-900 text-center text-base break-words overflow-hidden">
        {isLoading ? "Thinking..." : llmArgument}
      </p>
    </div>
  </div>

  {/* User Side */}
  <div className="flex items-stretch gap-6 text-center">
    {showUserOptions && (
      <div className="space-y-4 w-[300px] flex flex-col ">
        {userPrompts.map((prompt, index) => (
        <button
        key={index}
        onClick={() => handlePromptClick(index + 1)}
        className={`w-full bg-[#EDE1D0] h-[30%] rounded-tl-[50px] rounded-tr-[50px] rounded-bl-[50px] pl-4 pr-4 pt-2 pb-2 text-left transition-all duration-200 shadow-sm border border-gray-200 relative ${
          selectedPrompt === index + 1
            ? "ring-2 ring-purple-500 shadow-md scale-[1.02]"
            : "hover:bg-gray-50 hover:shadow-md"
        }`}
      >
        {/* Main prompt content */}
        <p className="text-sm text-gray-800 leading-snug">{prompt}</p>
      
        {/* Bottom-right "prompt #N" */}
        <p className="absolute bottom-2 right-2 text-xs font-medium text-[#201E1C] mb-0.5">
          Prompt #{index + 1}
        </p>
      
        {/* Optional thumbs-up icon */}
        {selectedPrompt === index + 1 && (
          <div className="absolute top-2 right-2">
            <ThumbsUp className="w-4 h-4 text-purple-600" />
          </div>
        )}
      </button>
      
        ))}
      </div>
    )}

    <div className="flex flex-col justify-end items-center h-full">
      <p className="text-sm text-gray-700 font-medium">You</p>
      <img
        src="/user.svg"
        alt="You"
        className="w-72 h-full object-contain"
      />
    </div>
  </div>
</div>

    </main>
    ) 
  
  
};

export default DebateSwitch;





import { Button } from "@/components/ui/button";
import OpeningModal from "@/components/OpeningModal";
import { RootState } from "@/store";
import { useDispatch, useSelector } from "react-redux";
import { decreaseScore } from "@/store/topicsSlice";
import CircleScore from "@/components/CircleScore";
import ClosingModal from "@/components/ClosingModal";





