import { useState, useEffect } from "react";
import { Timer, Heart, MessageCircle, Repeat2, Bookmark } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

const DebateModule = () => {
  const navigate = useNavigate();
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes in seconds
  const [imageUrl, setImageUrl] = useState<string>("");

  useEffect(() => {
    const fetchImage = async () => {
      const { data } = supabase.storage
        .from('Thesis')
        .getPublicUrl('Modules/IG_4a.png');
      
      if (data?.publicUrl) {
        setImageUrl(data.publicUrl);
      }
    };
    
    fetchImage();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <main className="min-h-screen bg-[#F8F1E7] p-6">
      {/* Header Section */}
      <div className="max-w-7xl mx-auto">
        <div className="flex items-start justify-between mb-8">
          <div className="flex items-start gap-6">
             <div className="w-20 h-20 rounded-lg flex items-center justify-center relative flex-shrink-0 ">
  <img
    src="/m6.png"
    alt="Module 1"
    className="w-20 h-20 object-contain"
  />
</div>
            <div>
              <h1 className="text-4xl font-semibold text-foreground mb-2">Burst the bubble</h1>
              <p className="text-muted-foreground text-lg mb-4">
                Switch sides, switch views and switch the way you think!
              </p>
              <div className="flex items-center gap-2 text-foreground">
                <Timer className="h-5 w-5" />
                <span className="text-xl font-medium">{formatTime(timeLeft)}</span>
              </div>
            </div>
          </div>

          <div className="text-right min-w-[280px]">
          <Progress
  value={98}
  className="h-3 mb-2 [&>div]:!bg-[linear-gradient(180deg,#FF5A5F_0%,#8B5CF6_100%)]"
/>
            <p className="text-sm text-muted-foreground mb-1">Polarization Score</p>
            <p className="text-2xl font-semibold text-foreground">98%</p>
            <p className="text-lg text-muted-foreground mt-2">1/4 Left</p>
          </div>
        </div>

        {/* Main Content - Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2  px-8 items-start">
          {/* Left Column - Image */}
          <div className="bg-card rounded-2xl p-4 shadow-[var(--shadow-medium)] border border-border w-fit mx-auto lg:mx-0">
            <div className="rounded-lg overflow-hidden" style={{ width: '407px', height: '648px' }}>
              {imageUrl ? (
                <img 
                  src={imageUrl} 
                  alt="AI is an insult to life itself - Miyazaki's predictions come true" 
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="bg-muted w-full h-full flex items-center justify-center">
                  <p className="text-muted-foreground">Loading image...</p>
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Scenario Details */}
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200 w-[531px] h-[595px] ">
  {/* Scenario */}
  <p className="text-sm font-medium text-gray-500 mb-3">Scenario 1</p>

  {/* Title */}
  <h2 className="text-2xl font-semibold text-gray-900 mb-5 leading-snug">
    “AI is an insult to life itself.”
  </h2>

  {/* Description */}
  <p className="text-gray-800 mb-2 leading-relaxed">
    <span className="font-semibold">Hayao Miyazaki</span> — the legendary Japanese filmmaker once called AI “an insult to life itself.”
  </p>

  <p className="text-gray-800 mb-5 leading-relaxed">
    During a 2016 documentary, after seeing an AI-generated animation that, to him, lacked humanity and soul. Nearly a decade later, AI-generated “Ghibli-style” art has gone viral — reviving the same question he raised back then.
  </p>

  {/* Debate Box */}
  <div className="bg-[#F5F3FF] rounded-lg p-4 mb-5">
    <p className="text-sm text-gray-500 mb-2">🧠 The Debate:</p>
    <p className="text-gray-900 font-medium leading-snug">
      Was Miyazaki right to call AI an insult to life — or is it actually expanding what life can create?
    </p>
  </div>

  {/* Call to Action */}
  <p className="text-gray-900 font-medium mb-4">🔥 Ready to take a side?</p>

  <button
    className="w-full py-3 rounded-lg text-white font-medium text-lg"
    style={{ backgroundColor: '#8B5CF6' }}
    onClick={() => navigate('/debate/switch')}
  >
    Start Now
  </button>
</div>

        </div>
      </div>
    </main>
  );
};

export default DebateModule;
