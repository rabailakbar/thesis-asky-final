import { useState, useEffect } from "react";
import { Timer, ThumbsUp } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY;


const DebateSwitch = (props) => {
  console.log(props)
  const navigate = useNavigate();
  const [timeLeft, setTimeLeft] = useState(100);
  const [figureImageUrl, setFigureImageUrl] = useState<string>("");
  const [llmArgument, setLlmArgument] = useState<string>("Thinking...");
  const [userPrompts, setUserPrompts] = useState<string[]>([]);
  const [selectedPrompt, setSelectedPrompt] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [round, setRound] = useState(1);
  const [showUserOptions, setShowUserOptions] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  const DEBATE_TOPIC =props.debate.Debate_Question || `"Are Millennials the forgotten generation in the mental health conversation, overshadowed by Gen Z’s
  louder struggles?"`;
  // Timer
  useEffect(() => {
    if (timeLeft <= 0) {
      setIsCompleted(true);
      return;
    }
    const timer = setInterval(() => setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0)), 1000);
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
              content: `Return ONLY a JSON array of 3 short strings of maximum 15 words arguing IN FAVOR of ${DEBATE_TOPIC}.`,
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
              content: `You are arguing AGAINST the topic: ${DEBATE_TOPIC}. Respond in 1 short, simple, confident sentence.`,
            },
            ...messages,
          ],
          temperature: 0.7,
          max_tokens: 200,
        }),
      });
      const data = await res.json();
      setLlmArgument(data?.choices?.[0]?.message?.content || "XXXXXXXXXX XXXXXXXXXXXXXXXX XXXXXXXXXXXXXX XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX");
    } catch {
      setLlmArgument("⚠️ Unable to fetch AI argument.");
    } finally {
      setIsLoading(false);
    }
  };

  const handlePromptClick = async (i: number) => {
    setSelectedPrompt(i);
    setShowUserOptions(false);
    const chosen = userPrompts[i - 1];
    setTimeout(async () => {
      setLlmArgument("Thinking...");
      await getLlmArgument([{ role: "user", content: chosen }]);
      await generateUserPrompts();
      setSelectedPrompt(null);
      setRound((r) => r + 1);
    }, 1200);
  };

  const formatTime = (s: number) =>
    `${Math.floor(s / 60)
      .toString()
      .padStart(2, "0")}:${(s % 60).toString().padStart(2, "0")}`;

 
  const[showIntroModal,setShowIntroModal] = useState(true);

  return (
    isCompleted)?(<ClosingModal/>):(<div className="p-8">
    <main className="h-[90vh] px-24 bg-[#F8F1E7] flex flex-col">
    {/* <OpeningModal
          showIntroModal={showIntroModal}
          moduleId={"M3"}
          setShowIntroModal={setShowIntroModal}
          src={"/opening16.png"}
        />      Header Section */}
      <ModuleHeader />
  
      {/* Headline */}
      <div className="text-center">
        <p className="text-xl font-medium text-gray-900">Headline #1</p>
      </div>
      <div className="text-center mb-8">
        <p className="text-gray-800">
          Argue in favor of the headline by choosing the best prompt
        </p>
      </div>
  
      {/* Red Banner */}
      <div className="bg-[#5F237B] rounded-tl-3xl text-white text-center py-2 px-6 mb-6 ">
        <p className="text-xl font-medium">{DEBATE_TOPIC}</p>
      </div>
  
      {/* Debate Row — this now fills all remaining vertical space */}
      <div className="flex justify-between flex-grow gap-18 px-8 items-stretch">
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
    <div className="bg-[#EDE1D0] rounded-tl-[50px] rounded-tr-[50px] rounded-br-[50px] w-[200px] flex items-center justify-center shadow-sm p-4 h-[80%]">
      <p className="text-gray-900 text-center text-base break-words overflow-hidden">
        {isLoading ? "Thinking..." : llmArgument}
      </p>
    </div>
  </div>

  {/* User Side */}
  <div className="flex items-stretch gap-6 text-center">
    {showUserOptions && (
      <div className="space-y-4 w-[340px] flex flex-col ">
        {userPrompts.map((prompt, index) => (
          <button
            key={index}
            onClick={() => handlePromptClick(index + 1)}
            className={`w-full bg-[#EDE1D0] h-[70%] rounded-tl-[50px] rounded-tr-[50px] rounded-bl-[50px] p-2.5 text-left transition-all duration-200 shadow-sm border border-gray-200 relative ${
              selectedPrompt === index + 1
                ? "ring-2 ring-purple-500 shadow-md scale-[1.02]"
                : "hover:bg-gray-50 hover:shadow-md"
            }`}
          >
            <p className="text-xs font-medium text-gray-500 mb-0.5">
              prompt #{index + 1}
            </p>
            <p className="text-sm text-gray-800 leading-snug">{prompt}</p>
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
    </div>) 
  
  
};

export default DebateSwitch;




import { Clock } from "lucide-react"

import { Button } from "@/components/ui/button";
import OpeningModal from "@/components/OpeningModal";
const ModuleHeader = () => {
  return (
      <>
          <div className="  pt-6 mb-2">
              <div className="flex items-center justify-between">
                  {/* Left side: Icon + Module Info */}
                  <div className="flex items-center gap-8">
                      {/* Puzzle Icon */}
                      <div className="w-25 rounded-lg flex items-center justify-center relative flex-shrink-0 ">
                          <img
                              src={"/opening16.png"}
                              alt="Module 1"
                              className="w-25  object-contain"
                          />
                      </div>

                      {/* Module Info */}
                      <div>
                      <h1 className="font-semibold text-[36px] leading-[100%] tracking-[0] text-[#201E1C] mb-2">
                      Debate Switch</h1>

<p className="font-normal text-[16px] leading-[100%] tracking-[0] text-[#201E1C] mb-2">
One debate, two sides, endless perspectives</p>


                          <div className="flex items-center gap-4 text-[#201E1C]">
<img src={"/clocl.svg"} />

                              <span className="font-normal text-[24px] leading-[100%] tracking-[0]">
02:00
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


const ClosingModal = () => {
  
  const navigate = useNavigate();


  return (
    <div className="p-8">
<div className="h-[90vh] flex items-start justify-center rounded-[24px] pt-8" style={{ backgroundColor: '#F8F1E7' }}>
              <div className="max-w-2xl w-full mx-auto bg-[#F8F1E7] rounded-3xl shadow-sm  text-center">

              {/* Module Completion Header */}
              <div className="flex items-center justify-center gap-4 mb-6">
              <div className="mx-auto w-24 h-24 rounded-full  p-[12px] bg-[linear-gradient(180deg,#D0193E_0%,#5F237B_100%)]">
<div className="w-full h-full bg-[#FDF8F3] rounded-full flex items-center justify-center text-4xl font-semibold text-gray-700">
  –
</div>
</div>
                  <div className="text-left">
                  <h1 className=" text-[#5F237B] font-bold text-[54px] leading-[100%] tracking-[0%]  mb-2">
  Module 4: Complete
</h1>


<p className="text-black font-normal text-[18px] leading-[100%] mt-1">
✓ 7/7 Score interests narrowed!
</p>

                  </div>
              </div>

              {/* Score Circle */}
              <div className="mt-10 mb-10 flex justify-center items-center">
<img src={"/closingg.svg"} className="h-[35vh]" />

              </div>

<div>
Yikes, 98% polarization! But that’s what we’re here for — to unpack it, learn, and bring the number down together. Lower the score, lower the polarization.... and that's how you win!
</div>
              {/* Next Module Button */}
              <Button
                  size="lg"
                  onClick={() => navigate(`/debate/final`)}
                  className="mt-6 px-8 py-2 rounded-md bg-[#FF9348]  text-white text-base"
              >
                  Next Module →
              </Button>
          </div>
      </div>
      </div>
  );
} 

