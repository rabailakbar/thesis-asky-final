import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";


const Dashboard = () => {
  const modules = [
    {
      title: "Find your vibe",
      description: "Let's help you build your feed!",
      image: "/images/find-your-vibe.svg",
      level: "🟣 Beginner Level",
      duration: "🕒 2 min",
      path: "/interest",
    },
    {
      title: "Pick & Flick",
      description: "Like and save social media posts!",
      image: null, // manually rendered (colored blocks)
      level: "🟣 Beginner Level",
      duration: "🕒 2 min",
      path: "/exercise",
      custom: true,
    },
    {
      title: "Bias Detection",
      description: "Identify biased language x",
      image: "/images/bias-detection.svg",
      level: "🟡 Intermediate Level",
      duration: "🕒 5 min",
      path: "/spotthebias",
    },
    {
      title: "Social Analysis",
      description: "Analyze social media credibility",
      image: "/images/social-analysis.svg",
      level: "🟢 Advanced Level",
      duration: "🕒 3 min",
      path: "/debate/switch",
    },
    {
      title: "Fake or Fact?",
      description: "Spot fake images and content!",
      image: "/images/fake-or-fact.svg",
      level: "🟢 Advanced Level",
      duration: "🕒 5 min",
      path: "/fakefact",
    },
    {
      title: "Behind the Buzz",
      description: "Analyze viral content motivations!",
      image: "/images/behind-the-buzz.svg",
      level: "🟡 Intermediate Level",
      duration: "🕒 2 min",
      path: "/behind-the-buzz",
    },
   
  ];
  

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
    <div className="p-8">
<div className="flex h-[90vh] pt-4 px-16 bg-[#F8F1E7] rounded-2xl shadow-sm overflow-y-auto">
{/* Make inner container fill width with 10% padding on each side */}
<div className="w-full flex flex-col  ">
        {/* Header Bar */}
        

        {/* Welcome Section */}
        <div className="flex justify-between items-center pb-6">
          <div>
            <img src={"/logo.svg"} className="w-[10vw]"/>
            </div>
            <div>
User 1
            </div>
        </div>



        <div className="mb-4 flex h-[18vh] items-center justify-between bg-[#5F237B] text-white px-12 py-8 rounded-xl shadow-sm">
          {/* Div A - Heading + Text */}

  <div className="w-[80%] ">
  <h1 className=" font-semibold text-[1.5vw] leading-[100%] text-white  mb-2">
  Welcome to askwhy!
</h1>

    <p className=" text-[1vw] leading-relaxed opacity-90 text-white w-[75%]">
      A glow up for your brain. How does that sound? We’re here to help. 
      Turn curiosity into your superpower.{" "}
      <strong>Play. Challenge. Ask Why.</strong> Let’s start your journey with us!
    </p>
  </div>



          {/* Div B - Button */}
          <div className="w-[20%] flex justify-center">
          <Button
  onClick={() => navigate("/interest")}
  className=" bg-[#FF9348]  text-[white]  font-semibold text-[1vw] leading-[100%] rounded-[6px] px-[10px] py-[8px] gap-[10px] opacity-100 flex items-center justify-center transition-all duration-200"
>
  Click here to start →
</Button>

          </div>
        </div>


        {/* All Modules - Phases Section */}
        <div className="mb-4" >
          <h2 className="text-[1.5vw] pb-2 font-semibold text-[#D0193E]">Module Breakdown</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
  {phases.map((phase, index) => (
   <Card className="w-full cursor-pointer h-[18vh] bg-white opacity-100 rounded-[12px] border-2 border-gray-200 p-[20px] px-[22px] flex flex-col justify-between gap-[17px] shadow-sm">
   <div>
     <h3 className="font-normal text-[1.25vw] leading-[100%] text-center text-black mb-4">
       {phase.title}
     </h3>
 
     <div className="flex gap-2 ">
       {phase.modules.map((mod) => (
         <div
           key={mod}
           className="flex-1 p-2 bg-[#F1F5F9] rounded text-[#D0193E] text-center font-semibold"
         >
           {mod}
         </div>
       ))}
     </div>
   </div>
 
   <div className="flex items-center justify-between text-xs text-gray-600 ">
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
        <div >
          <h2 className="text-[1.5vw] pb-2 font-semibold text-[#FF5A5F]">All Modules</h2>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 ">
  {modules.map((mod, index) => (
    <Card
      key={index}
      className=" w-[12vw] px-2 pt-2  rounded-xl shadow-sm cursor-pointer hover:shadow-md transition bg-white"
      onClick={() => navigate(mod.path)}
    >
      <div className="w-[100%] flex justify-center items-center  bg-[#F1F5F9] rounded-md mb-1 overflow-hidden  ">
        <img
          src="/framee.svg"
          alt={mod.title}
          className="w-[100%]  object-cover"
        />
      </div>

      <h4 className="font-semibold text-[1vw] mb-1 text-gray-800 ">
        {mod.title}
      </h4>
      <p className="text-[0.75vw] text-gray-600 mb-1 leading-snug ">
        {mod.description}
      </p>

      <div className="flex items-center justify-between text-[0.5vw] text-gray-500">
        <span>{mod.level}</span>
        <span>{mod.duration}</span>
      </div>
    </Card>
  ))}
</div>


        </div>

      </div>
    </div>
    </div>
  );
};

export default Dashboard;
