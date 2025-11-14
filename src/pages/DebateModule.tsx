import { useState, useEffect } from "react";
import { Timer, Heart, MessageCircle, Repeat2, Bookmark } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import OpeningModal from "@/components/OpeningModal";
import { RootState } from "@/store";
import { useSelector } from "react-redux";

const DebateModule = () => {
  const navigate = useNavigate();
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes in seconds
  const [imageUrl, setImageUrl] = useState<string>("");
  const [debate,setDebate] = useState<any>({});
  const topic = useSelector((state:RootState)=>state.topics.topics)
  const randomTopic:number = topic[Math.floor(Math.random() * topic.length)];
  useEffect(() => {

    const fetchImage = async (code) => {
      const { data } = supabase.storage
        .from('Thesis')
        .getPublicUrl(`Modules/${code}.png`);
      
      if (data?.publicUrl) {
        setImageUrl(data.publicUrl);
      }
    };
    
    fetchSpotTheBias()
  }, []);

  const fetchSpotTheBias = async () => {

      const { data, error } = await supabase.from("debate").select("*");
console.log("let me check",data)
const { data:link } = supabase.storage
        .from('Thesis')
        .getPublicUrl(`Modules/${data[randomTopic].Image}.png`);
setDebate(data[randomTopic])
console.log("let me check",link.publicUrl)
setImageUrl(link.publicUrl)

      if (error) {
        console.error("Error fetching spotthebias:", error);
        return;
      }
  
    }


  

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };
  console.log(debate)
const[showIntroModal,setShowIntroModal] = useState(true);
  return (
    <div className="p-8">
    <main className="h-[90vh] bg-[#F8F1E7] p-2">
    <OpeningModal
showIntroModal={showIntroModal}
moduleId={"M6"}
setShowIntroModal={setShowIntroModal}
/>
  <div className="max-w-7xl mx-auto">
    {/* Header Section */}
    <ModuleHeader/>

    {/* Main Content - Two Column Layout */}
    <div className="flex justify-center items-stretch gap-10">
       {/* Right Column - Scenario Card */}
  <div className="bg-white rounded-lg p-4 shadow-md border border-gray-200 max-w-[450px] flex flex-col justify-between">
    <div>
      <p className="text-xs font-medium text-gray-500 mb-2">Scenario 1</p>
      <h2 className="text-[16px] font-semibold text-gray-900 mb-3 leading-snug">
        {debate.Heading}
      </h2>
      
      <p className="text-gray-800 mb-3 text-sm leading-relaxed">
    {debate.Scenario}
      </p>
      <div className="rounded-md p-3 mb-4">
        <p className="text-xs text-gray-500 mb-1">🧠 The Debate:</p>
        <p className="text-gray-900 font-medium text-sm leading-snug">
{
  debate.Debate_Question
}        </p>
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
