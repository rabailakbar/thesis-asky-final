import { useState, useEffect } from "react";
import { Timer, ThumbsUp } from "lucide-react";
import { useNavigate } from "react-router-dom";

const GROQ_API_KEY = "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";


const DebateSwitch = (props) => {
  const navigate = useNavigate();
  const [llmArgument, setLlmArgument] = useState<string>("Thinking...");
  const [userPrompts, setUserPrompts] = useState<string[]>([]);
  const [selectedPrompt, setSelectedPrompt] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showUserOptions, setShowUserOptions] = useState(false);
  const [timeLeft, setTimeLeft] = useState(120); // 2 minutes
  const [stance, setStance] = useState("against");
  const score= useSelector((state:RootState)=>state.topics.score)
  const DEBATE_TOPIC =props?.debate?.Debate_Question || `"Are Millennials the forgotten generation in the mental health conversation, overshadowed by Gen Z’s
  louder struggles?"`;
 

  useEffect(() => {

    if(timeLeft<=0 && props.round >=3){
      console.log(4)
      props.setIsCompleted(true)
    }
    if (timeLeft <= 0) {
      // One full round (180s) finished → go next topic
      props.goNext();

      return;
    }
  
    // Switch stance based on time passed
    if (timeLeft < 60) {
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
              content: `
            Return ONLY a JSON array of 3 short, powerful, persuasive strings which consit of arguments (max 15 words each) 
            that strongly and convincingly argue ${playerSide} the topic: ${DEBATE_TOPIC}.
            Make each argument concrete, impactful, and easy to understand.
            Use easy words.
            Do NOT include filler words. Keep it short but strong.
            `
            }
            
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
    ? `You are arguing AGAINST the topic: ${DEBATE_TOPIC}. Respond in 1 short, powerful, persuasive sentence. 
       Make the argument concrete, impactful, and convincing. Keep it simple but strong.use easy words at maximum 20 words`
    : `You are arguing IN FAVOR of the topic: ${DEBATE_TOPIC}. Respond in 1 short, powerful, persuasive sentence. 
       Make the argument concrete, impactful, and convincing. Keep it simple but strong. use easy words at maximum 20 words`;

  
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
    dispatch(decreaseScore(0.1))

    setSelectedPrompt(i);
    setShowUserOptions(false);
    const chosen = userPrompts[i - 1];
    // Immediately advance to the next module after first selection
   
 await  getLlmArgument([]);
   await generateUserPrompts()
  };

  useEffect(()=>{
    if(timeLeft==0)   props.setIsCompleted(true);
console.log(timeLeft)
  },[timeLeft])
  

 


console.log("checkstance",stance)
  return (
    <main>
    
  
      {/* Header (no duplicate timer/left) */}
      <div className="pt-8 pb-6 flex flex-col items-center gap-2">
        <p className="text-xl font-medium text-[#130719]">Headline #1</p>
        <p className=" text-xl font-medium text-[#130719] text-center">
          Argue {stance!="against"&& "in"} <span className="text-[#5F237B] font-bold">{stance=="against"?"against":"favor"}</span> {stance!="against" && "of"} the headline by <span className="font-bold text-[#FF9348]" >choosing</span> the best prompt
        </p>
      </div>
  
      {/* Red Banner */}
      <div className="bg-[#5F237B] rounded-tl-3xl text-white text-center  ml-16 px-6 mb-8 p-2 ">
        <p className="text-xl font-medium">{DEBATE_TOPIC}</p>
      </div>
  
      {/* Debate Row — this now fills all remaining vertical space */}
      <motion.div
  className="flex justify-between flex-grow gap-18 px-8 items-stretch mb-4"
  layout
>
  {/* Conditional rendering: swap sides based on stance */}
  {stance === "against" ? (
    <>
      {/* Opponent Side */}
      <motion.div className="flex items-stretch gap-6 text-center" layout>
        <div className="flex flex-col justify-end">
          <img
            src="/opponent.svg"
            alt="Opponent"
            className="w-72 h-full object-contain"
          />
        </div>

        <div className="relative flex flex-col bg-[#EFE8DD] rounded-tl-[50px] rounded-tr-[50px] rounded-br-[50px] w-[240px] shadow-sm p-6 h-[100%]">

  {/* Top paragraph */}
  <p className="text-black text-[1.25vw]  font-normal text-left  break-words overflow-hidden mb-4">
    {isLoading ? "Thinking..." : llmArgument}
  </p>

  {/* Bottom-left Opponent */}
  <p className="absolute bottom-2 text-[1vw]  text-left  font-normal text-black">
    Opponent
  </p>

</div>

      </motion.div>

      {/* User Side */}
      <motion.div className="flex items-stretch gap-6 text-center" layout>
        {showUserOptions && (
          <div className="space-y-4 w-[300px] flex flex-col">
            {userPrompts.map((prompt, index) => (
              <button
                key={index}
                onClick={() => handlePromptClick(index + 1)}
                className={`w-full bg-[#EFE8DD] h-[30%] rounded-tl-[50px] rounded-tr-[50px] rounded-bl-[50px] pl-4 pr-4 pt-2 pb-2 text-left transition-all duration-200 shadow-sm border border-gray-200 relative ${
                  
                    "hover:bg-gray-50 hover:shadow-md"
                }`}
              >
                <p className="text-sm text-gray-800 leading-snug">{prompt}</p>
                <p className="absolute bottom-2 right-2 text-xs font-medium text-[#201E1C] mb-0.5">
                  Prompt #{index + 1}
                </p>
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
          <p className="text-sm text-gray-700 font-medium"></p>
          <img
            src="/user.svg"
            alt="You"
            className="w-72 h-full object-contain"
          />
        </div>
      </motion.div>
    </>
  ) : (
    <>
      {/* Swap sides */}
      <motion.div className="flex items-stretch gap-6 text-center" layout>
        {/* User Side */}
        <div className="flex flex-col justify-end items-center h-full">
          <p className="text-sm text-gray-700 font-medium">You</p>
          <img
            src="/opponent.svg"
            alt="You"
            className="w-72 h-full object-contain"
          />
        </div>
        {showUserOptions && (
          <div className="space-y-4 w-[300px] flex flex-col">
            {userPrompts.map((prompt, index) => (
              <button
                key={index}
                onClick={() => handlePromptClick(index + 1)}
                className={`w-full bg-[#EFE8DD] h-[30%] rounded-tl-[50px] rounded-tr-[50px] rounded-bl-[50px] pl-4 pr-4 pt-2 pb-2 text-left transition-all duration-200 shadow-sm border border-gray-200 relative ${
                   "hover:bg-gray-50 hover:shadow-md"
                }`}
              >
                <p className="text-sm text-gray-800 leading-snug">{prompt}</p>
                <p className="absolute bottom-2 right-2 text-xs font-medium text-[#201E1C] mb-0.5">
                  Prompt #{index + 1}
                </p>
                {selectedPrompt === index + 1 && (
                  <div className="absolute top-2 right-2">
                    <ThumbsUp className="w-4 h-4 text-purple-600" />
                  </div>
                )}
              </button>
            ))}
          </div>
        )}

       
      </motion.div>

      {/* Opponent Side */}
      <motion.div className="flex items-stretch gap-6 text-center" layout>
      <div className="relative flex flex-col bg-[#EFE8DD] rounded-tl-[50px] rounded-tr-[50px] rounded-br-[50px] w-[240px] shadow-sm p-6 h-[100%]">
      <p className="text-black text-[1.25vw]  font-normal text-left  break-words overflow-hidden mb-4">
      {isLoading ? "Thinking..." : llmArgument}
          </p>
          <p className="absolute bottom-2   text-left text-xs font-medium text-black">
    Opponent
  </p>
        </div>
        <div className="flex flex-col justify-end">
          <img
            src="/user.svg"
            alt="Opponent"
            className="w-72 h-full object-contain"
          />
        </div>

       
      </motion.div>
    </>
  )}
</motion.div>

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
import { motion } from "framer-motion";





