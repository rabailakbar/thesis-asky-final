import { useState, useEffect } from "react";
import { Timer, Heart, MessageCircle, Repeat2, Bookmark } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import ModuleHeader from "@/components/ModuleHeader";

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
    <div className="p-8">
    <main className="h-[90vh] bg-[#F8F1E7] p-2">
  <div className="max-w-7xl mx-auto">
    {/* Header Section */}
    <ModuleHeader/>

    {/* Main Content - Two Column Layout */}
    <div className="flex justify-center items-stretch gap-10">
       {/* Right Column - Scenario Card */}
  <div className="bg-white rounded-lg p-4 shadow-md border border-gray-200 max-w-[420px] flex flex-col justify-between">
    <div>
      <p className="text-xs font-medium text-gray-500 mb-2">Scenario 1</p>
      <h2 className="text-xl font-semibold text-gray-900 mb-3 leading-snug">
        “AI is an insult to life itself.”
      </h2>
      <p className="text-gray-800 mb-1 text-sm leading-relaxed">
        <span className="font-semibold">Hayao Miyazaki</span> — the legendary Japanese filmmaker once called AI “an insult to life itself.”
      </p>
      <p className="text-gray-800 mb-3 text-sm leading-relaxed">
        During a 2016 documentary, after seeing an AI-generated animation that lacked humanity and soul. Nearly a decade later, AI-generated “Ghibli-style” art has gone viral — reviving the same question he raised back then.
      </p>
      <div className="bg-[#F5F3FF] rounded-md p-3 mb-4">
        <p className="text-xs text-gray-500 mb-1">🧠 The Debate:</p>
        <p className="text-gray-900 font-medium text-sm leading-snug">
          Was Miyazaki right to call AI an insult to life — or is it actually expanding what life can create?
        </p>
      </div>
    </div>
    <div>
      <p className="text-gray-900 font-medium text-sm mb-3">🔥 Ready to take a side?</p>
      <button
        className="w-full py-2.5 rounded-md text-white font-medium text-base bg-[#FF9348] hover:bg-[#7c4ee8] transition-colors"
        onClick={() => navigate('/debate/switch')}
      >
        Start Now
      </button>
    </div>
  </div>
  {/* Left Column - Image */}
  <div className="flex justify-end items-center rounded-lg bg-transparent">
    <img
      src={imageUrl}
      alt="AI is an insult to life itself - Miyazaki's predictions come true"
      className="h-full max-h-[60vh] w-auto object-contain"
    />
  </div>

 
</div>



  </div>
</main>
</div>

  );
};

export default DebateModule;
