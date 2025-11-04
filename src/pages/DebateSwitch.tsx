import { useState, useEffect } from "react";
import { Timer, ThumbsUp } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY;
const DEBATE_TOPIC = `"AI is an insult to life itself." Miyazaki's predictions come true.`;

const DebateSwitch = () => {
  const navigate = useNavigate();
  const [timeLeft, setTimeLeft] = useState(90);
  const [figureImageUrl, setFigureImageUrl] = useState<string>("");
  const [llmArgument, setLlmArgument] = useState<string>("Thinking...");
  const [userPrompts, setUserPrompts] = useState<string[]>([]);
  const [selectedPrompt, setSelectedPrompt] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [round, setRound] = useState(1);
  const [showUserOptions, setShowUserOptions] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  // Timer
  useEffect(() => {
    if (timeLeft <= 0) {
  //    setIsCompleted(true);
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
              content: `Return ONLY a JSON array of 3 short strings arguing IN FAVOR of ${DEBATE_TOPIC}.`,
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
      setLlmArgument(data?.choices?.[0]?.message?.content || "No response");
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

  if (isCompleted) {
    return (
      <main className="min-h-screen flex items-center justify-center  bg-[#F8F1E7]">
        <div className="max-w-2xl flex items-center justify-center text-center space-y-6">
          <h1 className="text-4xl font-semibold text-gray-900">⏰ Debate Over</h1>
          <p className="text-lg text-gray-700">Great job! You've completed the debate.</p>
          <button
            onClick={() => navigate("/debate/final")}
            className="px-6 py-3 bg-[#8B5CF6] text-white rounded-lg hover:bg-[#7C3AED] transition-colors"
          >
            Next Module →
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#F8F1E7]">
  <div>
    {/* Header Section */}
    <ModuleHeader/>

    {/* Headline */}
    <div className="text-center mb-6">
      <p className="text-xl font-medium text-gray-900 mb-4">Headline #1</p>
    </div>

    {/* Red Banner */}
    <div className="bg-[#FF5A5F] text-white text-center py-4 px-6 mb-6 ">
      <p className="text-xl font-medium">{DEBATE_TOPIC}</p>
    </div>

    {/* Instruction */}
    <div className="text-center mb-8">
      <p className="text-gray-800">
        Argue in favor of the headline by choosing the best prompt
      </p>
    </div>

    {/* Debate Row */}
   {/* Debate Row */}
   <div className="flex items-center justify-between mt-10 px-12">
  {/* Opponent Side */}
  <div className="flex items-center gap-6 text-center">
    <div>
      <p className="text-sm text-gray-700 font-medium mb-3">Opponent LLM</p>
      <img src="/u.png" alt="Opponent" className="w-40 h-40 object-contain mb-3" />
    </div>

    {/* Opponent Argument */}
    <div className="bg-[#F5F3E8] rounded-[30px] min-h-[200px] w-[280px] flex items-center justify-center shadow-sm">
      <p className="text-gray-900 text-center text-base px-4">
        {isLoading ? "Thinking..." : llmArgument}
      </p>
    </div>
  </div>

  {/* User Side */}
  <div className="flex items-center gap-6 text-center">
    {showUserOptions && (
      <div className="space-y-2 w-[340px]">
        {userPrompts.map((prompt, index) => (
          <button
            key={index}
            onClick={() => handlePromptClick(index + 1)}
            className={`w-full bg-white rounded-xl p-2.5 text-left transition-all duration-200 shadow-sm border border-gray-200 relative ${
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

    <div>
      <img src="/me.png" alt="You" className="w-40 h-40 object-contain mb-3" />
      <p className="text-sm text-gray-700 font-medium">You</p>
    </div>
  </div>
</div>




  </div>
</main>

  );
};

export default DebateSwitch;




import { Clock } from "lucide-react"



const ModuleHeader = () => {
    return (
        <>
            <div className=" p-24 mb-10">
                <div className="flex items-center justify-between">
                    {/* Left side: Icon + Module Info */}
                    <div className="flex items-center gap-8">
                        {/* Puzzle Icon */}
                        <div className="w-32 h-32 rounded-lg flex items-center justify-center relative flex-shrink-0 ">
                            <img
                                src={"/m6.png"}
                                alt="Module 1"
                                className="w-32 h-32 object-contain"
                            />
                        </div>

                        {/* Module Info */}
                        <div>
                        <h1 className="font-semibold text-[36px] leading-[100%] tracking-[0] text-[#1E1E2F] mb-1">
                        Debate Switch
</h1>

<p className=" font-normal text-[24px] leading-[100%] tracking-[0] text-[#1E1E2F] mb-2">
One debate, two sides, endless perspectives</p>

                            <div className="flex items-center gap-2 text-[#1E1E2F]">
                                <Clock className="w-[33px] h-[33px]" />
                                <span className="font-normal text-[33px] leading-[100%] tracking-[0]">
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
            <h2
                className=" font-normal text-[27px] leading-[100%] text-center text-[black] mb-6"
            >
                Click to narrow down your interests
            </h2>
        </>)
}

