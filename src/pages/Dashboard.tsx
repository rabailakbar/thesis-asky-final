import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ChevronRight } from "lucide-react";


const Dashboard = () => {
  const modules = [
    {
      title: "Find your vibe",
      description: "Let's help you build your feed!",
      image: "/images/find-your-vibe.svg",
      level: " Beginner Level",
      duration: " 2 min",
      path: "/interest",
      src:"/framee.svg"
    },
    {
      title: "Pick & Flick",
      description: "Like and save social media posts!",
      image: null, // manually rendered (colored blocks)
      level: " Beginner Level",
      duration: " 2 min",
      path: "/exercise",
      custom: true,
      src:"/M2.jpg"
    },
    {
      title: "Bias Detection",
      description: "Identify biased language x",
      image: "/images/bias-detection.svg",
      level: " Intermediate Level",
      duration: " 5 min",
      path: "/spotthebias",
      src:"/M4.jpg"
    },
    {
      title: "Social Analysis",
      description: "Analyze social media credibility",
      image: "/images/social-analysis.svg",
      level: " Advanced Level",
      duration: "3 min",
      path: "/debate/switch",
      src:"/M6.jpg"
    },
    {
      title: "In Their Shoes",
      description: "Step into another perspective",
      image: "/images/in-their-shoes.svg",
      level: " Advanced Level",
      duration: "3 min",
      path: "/intheirshoes",
      src:"/M7.jpg"
    },
    {
      title: "Fake or Fact?",
      description: "Spot fake images and content!",
      image: "/images/fake-or-fact.svg",
      level: " Advanced Level",
      duration: "5 min",
      path: "/fakefact",
      src:"/M3.jpg"
    },
    {
      title: "Behind the Buzz",
      description: "Analyze viral content motivations!",
      image: "/images/behind-the-buzz.svg",
      level: "Intermediate Level",
      duration: "2 min",
      path: "/behind-the-buzz",
      src:"/M5.png"
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
<div className="flex h-[90vh] pt-4 px-0 bg-[#F8F1E7] rounded-2xl shadow-sm overflow-y-auto">
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



        <div className="mb-4 flex h-[18vh] items-center justify-between bg-[#5F237B] text-white px-0 py-8 rounded-xl shadow-sm">
          {/* Div A - Heading + Text */}

  <div className="w-[80%] text-left">
  <h1 className=" font-semibold text-[1.5vw] leading-[100%] text-white mb-2 text-left">
  Welcome to askwhy!
</h1>

    <p className=" text-[1vw] leading-relaxed opacity-90 text-white w-[75%] text-left">
      A glow up for your brain. How does that sound? We’re here to help. 
      Turn curiosity into your superpower.{" "}
      <strong>Play. Challenge. Ask Why.</strong> Let’s start your journey with us!
    </p>
  </div>



          {/* Div B - Button */}
          <div className="w-[28%] flex justify-center">
          <Button
  onClick={() => navigate("/interest")}
  className="w-full bg-[#FF9348] text-[white] font-semibold text-[1vw] leading-[100%] rounded-[6px] px-[16px] py-[14px] gap-[10px] opacity-100 flex items-center justify-center transition-all duration-200"
>
  Click here to start <ChevronRight/>
</Button>

          </div>
        </div>

        {/* Stats Summary Cards (uniform size + even alignment) */}
        <div className="flex flex-wrap gap-4 mb-10 items-stretch">
          {/* Modules */}
          <Card className="bg-white px-6 py-4 rounded-xl rounded-bl-none shadow-sm flex flex-col justify-between border border-gray-200 w-[200px] h-[92px]">
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-semibold text-[#D0193E]">7</span>
              <span className="text-xs font-medium text-[#130719]">Total</span>
            </div>
            <div className="text-base font-semibold text-[#5F237B] mt-1">Modules</div>
          </Card>
          {/* Phases */}
          <Card className="bg-white px-6 py-4 rounded-xl rounded-bl-none shadow-sm flex flex-col justify-between border border-gray-200 w-[200px] h-[92px]">
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-semibold text-[#D0193E]">3</span>
              <span className="text-xs font-medium text-[#130719]">Total</span>
            </div>
            <div className="text-base font-semibold text-[#5F237B] mt-1">Phases</div>
          </Card>
          {/* Difficulty Levels */}
          <Card className="bg-white px-6 py-4 rounded-xl rounded-bl-none shadow-sm flex flex-col justify-between border border-gray-200 w-[200px] h-[92px]">
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-semibold text-[#D0193E]">3</span>
              <span className="text-xs font-medium text-[#130719]">Difficulty</span>
            </div>
            <div className="text-base font-semibold text-[#5F237B] mt-1">Levels</div>
          </Card>
          {/* Duration */}
            <Card className="bg-white px-6 py-4 rounded-xl rounded-bl-none shadow-sm flex flex-col justify-between border border-gray-200 w-[200px] h-[92px]">
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-semibold text-[#D0193E]">1</span>
              <span className="text-xs font-semibold text-[#D0193E]">hr</span>
              <span className="text-xs font-medium text-[#130719]">Total</span>
            </div>
            <div className="text-base font-semibold text-[#5F237B] mt-1">Duration</div>
          </Card>
          {/* Start Button Card */}
          <button
            onClick={() => navigate('/interest')}
            className="group bg-[#FF9348] px-6 py-4 rounded-xl rounded-bl-none shadow-sm flex flex-col justify-between w-[200px] h-[92px] text-left text-white hover:bg-[#FF7F1F] transition"
          >
            <div className="flex items-baseline gap-2">
              <span className="text-xs font-medium opacity-90">Click here to</span>
            </div>
            <div className="flex items-center justify-between mt-1">
              <span className="text-xl font-semibold">Start</span>
              <ChevronRight className="w-5 h-5" />
            </div>
          </button>
        </div>


        {/* All Modules - Phases Section */}
        <div className="mb-12" >
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
 
   <div className="flex items-center justify-between  ">
     <div className="flex items-center gap-1">
       <div className="w-4 h-4 rounded-full" />
       <span className="flex justify-center items-center gap-1 text-[12px]" ><img src={"/begin.svg"} className="w-2 h-2"/>{phase.difficulty}</span>
     </div>
     <span className="flex justify-center items-center gap-1 text-[12px] "> {phase.done}</span>
   </div>
 </Card>
 
  ))}
</div>

        </div>

        {/* All Modules - Cards Section */}
        <div>
          <h2 className="text-[1.5vw] pb-2 font-semibold text-[#FF5A5F] text-right">All Modules</h2>
          
          <div className="flex justify-end">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 w-[85%]">
          {modules.map((mod, index) => (
  <Card
    key={index}
    className={`
      w-[12vw] px-2 pt-2 rounded-xl shadow-sm cursor-pointer 
      hover:shadow-md transition bg-white
      ${index !== 0 ? "filter blur-[1px] pointer-events-none" : ""}
    `}
    onClick={() => index === 0 && navigate(mod.path)} // only clickable if first
  >
    <div className="w-[100%] flex justify-center items-center bg-[#F1F5F9] rounded-md mb-1 overflow-hidden">
      <img
        src={mod.src}
        alt={mod.title}
        className="w-[100%] object-cover"
      />
    </div>

    <h4 className="font-semibold text-[1vw] mb-1 text-[#5F237B]">
      {mod.title}
    </h4>
    <p className="text-[0.75vw] text-gray-600 mb-1 leading-snug">
      {mod.description}
    </p>

    <div className="flex items-center justify-between text-[0.5vw] text-gray-500">
      <span className="flex justify-center items-center gap-1 text-[12px]"> <img src={"/begin.svg"} className="w-2 h-2"/>{mod.level}</span>
      <span className="flex justify-center items-center gap-1 text-[12px]">{mod.duration}</span>
    </div>
  </Card>
))}

</div>

      </div>


        </div>

      </div>
    </div>
    </div>
  );
};

export default Dashboard;
