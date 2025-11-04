import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";


const Dashboard = () => {
  

  const navigate = useNavigate();
  const phases = [
    {
      title: "Phase I: Awareness",
      difficulty: "Beginner Level",
      done: "0/2 Done",
      modules: ["M1", "M2"],
    },
    {
      title: "Phase II: Logical Reasoning",
      difficulty: "Intermediate Level",
      done: "0/3 Done",
      modules: ["M3", "M4", "M5"],
    },
    {
      title: "Phase III: Accepting Diversity",
      difficulty: "Hard Level",
      done: "0/2 Done",
      modules: ["M6", "M7"],
    },
  ];
  
  
  

  return (
<div className="flex min-h-[calc(100vh-40px)] py-8 px-16 bg-[#F8F1E7] rounded-2xl shadow-sm overflow-y-auto">
{/* Make inner container fill width with 10% padding on each side */}
<div className="w-full flex flex-col justify-between   space-y-10">
        {/* Header Bar */}
        

        {/* Welcome Section */}
        <div className="flex items-center justify-between bg-[#5F237B] text-white p-8 rounded-xl shadow-sm">
          {/* Div A - Heading + Text */}

  <div className="w-[80%] pr-6">
  <h1 className="font-lato font-extrabold text-[36px] leading-[100%] text-white  mb-2">
  Welcome to askwhy!
</h1>

    <p className=" text-[18px] leading-relaxed opacity-90 text-white">
      A glow up for your brain. How does that sound? We’re here to help. Turn curiosity into your superpower.{" "}
      <strong>Play. Challenge. Ask Why.</strong> Let’s start your journey with us!
    </p>
  </div>



          {/* Div B - Button */}
          <div className="w-[20%] flex justify-center">
          <Button
  onClick={() => navigate("/M3")}
  className="w-[197px] h-[42px] bg-[#FF9348] hover:bg-[#3FCF6C] text-black  font-semibold text-[18px] leading-[100%] rounded-[6px] px-[10px] py-[8px] gap-[10px] opacity-100 flex items-center justify-center transition-all duration-200"
>
  Click here to start →
</Button>

          </div>
        </div>


        {/* All Modules - Phases Section */}
        <div className="space-y-8">
          <h2 className="text-3xl font-semibold text-[#D0193E]">Module Breakdown</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
  {phases.map((phase, index) => (
   <Card className="w-[368px] h-[178px] bg-white opacity-100 rounded-[12px] border-2 border-gray-200 p-[20px] px-[22px] flex flex-col justify-between gap-[17px] shadow-sm">
   <div>
     <h3 className="font-lato font-semibold text-[24px] leading-[100%] text-center text-black mb-4">
       {phase.title}
     </h3>
 
     <div className="flex gap-2 mb-6">
       {phase.modules.map((mod) => (
         <div
           key={mod}
           className="flex-1 p-3 bg-[#F1F5F9] rounded text-[#D0193E] text-center font-semibold"
         >
           {mod}
         </div>
       ))}
     </div>
   </div>
 
   <div className="flex items-center justify-between text-xs text-gray-600 mt-auto">
     <div className="flex items-center gap-1">
       <div className="w-4 h-4 bg-gray-300 text-[#1E1E2F] rounded-full" />
       <span>{phase.difficulty}</span>
     </div>
     <span>{phase.done}</span>
   </div>
 </Card>
 
  ))}
</div>

        </div>

        {/* All Modules - Cards Section */}
        <div className="space-y-8">
          <h2 className="text-3xl font-semibold text-[#FF5A5F]">All Modules</h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {/* Find your vibe */}
            <Card
              className="p-3 rounded-xl shadow-sm cursor-pointer hover:shadow-md transition"
              onClick={() => navigate("/interest")}
            >
              <div className="aspect-[16/9] bg-[#F1F5F9] rounded-md mb-3 overflow-hidden">
                <img 
                  src="/images/find-your-vibe.svg" 
                  alt="Find your vibe" 
                  className="w-full h-full object-cover"
                />
              </div>
              <h4 className="font-semibold text-base mb-1">Find your vibe</h4>
              <p className="text-sm text-gray-600 mb-2">Let's help you build your feed!</p>
              <div className="flex items-center justify-between text-xs text-gray-500">
                <span>🟣 Beginner Level</span>
                <span>🕒 2 min</span>
              </div>
            </Card>

            {/* Pick & Flick */}
            <Card
              className="p-3 rounded-xl shadow-sm cursor-pointer hover:shadow-md transition"
              onClick={() => navigate("/exercise")}
            >
              <div className="aspect-[16/9] bg-[#F1F5F9] rounded-md mb-3 overflow-hidden flex items-center justify-center">
                <div className="text-center">
                  <div className="flex gap-2 mb-2">
                    <div className="w-12 h-8 bg-purple-400 rounded"></div>
                    <div className="w-12 h-8 bg-red-400 rounded"></div>
                    <div className="w-12 h-8 bg-cyan-400 rounded"></div>
                  </div>
                  <div className="text-xs text-gray-600">Pic & Flick</div>
                </div>
              </div>
              <h4 className="font-semibold text-base mb-1">Pick & Flick</h4>
              <p className="text-sm text-gray-600 mb-2">Like and save social media posts!</p>
              <div className="flex items-center justify-between text-xs text-gray-500">
                <span>🟣 Beginner Level</span>
                <span>🕒 2 min</span>
              </div>
            </Card>

            {/* Bias Quiz */}
            <Card
              className="p-3 rounded-xl shadow-sm cursor-pointer hover:shadow-md transition"
              onClick={() => navigate("/bias-quiz?id=M3&name=Bias%20Detection")}
            >
              <div className="aspect-[16/9] bg-[#F1F5F9] rounded-md mb-3 overflow-hidden">
                <img 
                  src="/images/bias-detection.svg" 
                  alt="Bias Detection" 
                  className="w-full h-full object-cover"
                />
              </div>
              <h4 className="font-semibold text-base mb-1">Bias Detection</h4>
              <p className="text-sm text-gray-600 mb-2">Identify biased language in headlines</p>
              <div className="flex items-center justify-between text-xs text-gray-500">
                <span>🟡 Intermediate Level</span>
                <span>🕒 5 min</span>
              </div>
            </Card> 

            {/* Connect Dots
            <Card
              className="p-3 rounded-xl shadow-sm cursor-pointer hover:shadow-md transition"
              onClick={() => navigate("/connect-dots?id=M4&name=Connect%20Dots")}
            >
              <div className="aspect-[16/9] bg-[#F1F5F9] rounded-md mb-3" />
              <h4 className="font-semibold text-base mb-1">Connect Dots</h4>
              <p className="text-sm text-gray-600 mb-2">Critical thinking quiz challenge</p>
              <div className="flex items-center justify-between text-xs text-gray-500">
                <span>🟡 Intermediate Level</span>
                <span>🕒 5 min</span>
              </div>
            </Card> */}

            {/* Social Posts Analysis */}
            <Card
              className="p-3 rounded-xl shadow-sm cursor-pointer hover:shadow-md transition"
              onClick={() => navigate("/social-posts?id=M5&name=Social%20Analysis")}
            >
              <div className="aspect-[16/9] bg-[#F1F5F9] rounded-md mb-3 overflow-hidden">
                <img 
                  src="/images/social-analysis.svg" 
                  alt="Social Analysis" 
                  className="w-full h-full object-cover"
                />
              </div>
              <h4 className="font-semibold text-base mb-1">Social Analysis</h4>
              <p className="text-sm text-gray-600 mb-2">Analyze social media credibility</p>
              <div className="flex items-center justify-between text-xs text-gray-500">
                <span>🟢 Advanced Level</span>
                <span>🕒 3 min</span>
              </div>
            </Card>

            {/* Quiz Module
            <Card
              className="p-3 rounded-xl shadow-sm cursor-pointer hover:shadow-md transition"
              onClick={() => navigate("/quiz")}
            >
              <div className="aspect-[16/9] bg-[#F1F5F9] rounded-md mb-3" />
              <h4 className="font-semibold text-base mb-1">General Quiz</h4>
              <p className="text-sm text-gray-600 mb-2">Test your media literacy skills</p>
              <div className="flex items-center justify-between text-xs text-gray-500">
                <span>🟡 Intermediate Level</span>
                <span>🕒 10 min</span>
              </div>
            </Card> */}

            {/* Fake or Fact Game */}
            <Card
              className="p-3 rounded-xl shadow-sm cursor-pointer hover:shadow-md transition"
              onClick={() => navigate("/fake-or-fact?id=M6&name=Fake%20or%20Fact")}
            >
              <div className="aspect-[16/9] bg-[#F1F5F9] rounded-md mb-3 overflow-hidden">
                <img 
                  src="/images/fake-or-fact.svg" 
                  alt="Fake or Fact" 
                  className="w-full h-full object-cover"
                />
              </div>
              <h4 className="font-semibold text-base mb-1">Fake or Fact?</h4>
              <p className="text-sm text-gray-600 mb-2">Spot fake images and content!</p>
              <div className="flex items-center justify-between text-xs text-gray-500">
                <span>🟢 Advanced Level</span>
                <span>🕒 5 min</span>
              </div>
            </Card>

            {/* Behind the Buzz */}
            <Card
              className="p-3 rounded-xl shadow-sm cursor-pointer hover:shadow-md transition"
              onClick={() => navigate("/behind-the-buzz?id=M3&name=Behind%20the%20Buzz")}
            >
              <div className="aspect-[16/9] bg-[#F1F5F9] rounded-md mb-3 overflow-hidden">
                <img 
                  src="/images/behind-the-buzz.svg" 
                  alt="Behind the Buzz" 
                  className="w-full h-full object-cover"
                />
              </div>
              <h4 className="font-semibold text-base mb-1">Behind the Buzz</h4>
              <p className="text-sm text-gray-600 mb-2">Analyze viral content motivations!</p>
              <div className="flex items-center justify-between text-xs text-gray-500">
                <span>🟡 Intermediate Level</span>
                <span>🕒 2 min</span>
              </div>
            </Card>

            {/* Debate Switch */}
            <Card
              className="p-3 rounded-xl shadow-sm cursor-pointer hover:shadow-md transition"
              onClick={() => navigate("/debate-switch?id=M6&name=Debate%20Switch")}
            >
              <div className="aspect-[16/9] bg-[#F1F5F9] rounded-md mb-3 overflow-hidden">
                <img 
                  src="/images/debate-switch.svg" 
                  alt="Debate Switch" 
                  className="w-full h-full object-cover"
                />
              </div>
              <h4 className="font-semibold text-base mb-1">Debate Switch</h4>
              <p className="text-sm text-gray-600 mb-2">Argue both sides of controversial topics!</p>
              <div className="flex items-center justify-between text-xs text-gray-500">
                <span>🔴 Advanced Level</span>
                <span>🕒 2 min</span>
              </div>
            </Card>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;
