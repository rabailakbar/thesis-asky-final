import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { BookOpen, Clock, Star, AlarmClock } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";

type Screen = "intro" | "roleSelection" | "question" | "scenario";
type Role = {
  title: string;
  subtitle: string;
};

const InTheirShoes = () => {
  const navigate = useNavigate();
  const [currentScreen, setCurrentScreen] = useState<Screen>("intro");
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState(1);

  const roles: Role[] = [
    { title: "Coach", subtitle: "Physical Training" },
    { title: "Teacher", subtitle: "" },
    { title: "Parent", subtitle: "" },
    { title: "Influencer", subtitle: "Social Media" },
    { title: "Moderator", subtitle: "School" },
    { title: "President", subtitle: "School Club" },
    { title: "Brother", subtitle: "Older Sibling" },
    { title: "Friend", subtitle: "" },
  ];

  const handleRoleSelect = (role: Role) => {
    setSelectedRole(role);
    setCurrentScreen("question");
  };

  const handleAnswerSelect = (answer: string) => {
    setSelectedAnswer(answer);
  };

  const handleNext = () => {
    if (currentQuestion < 9) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
    }
  };

  if (currentScreen === "intro") {
    return (
      <main className="min-h-screen bg-[#F8F1E7] p-8 flex items-center justify-center">
        <div className="max-w-4xl w-full">
          <Card className="bg-white rounded-2xl p-10 shadow-lg border-none">
            {/* Header Section */}
            <div className="flex items-center gap-6 mb-8">
              <div className="relative w-20 h-20 flex items-center justify-center bg-[#4FD1C5] rounded-xl flex-shrink-0">
                <span className="text-2xl font-bold text-[#E91E8C]">M7</span>
              </div>
              <div>
                <p className="text-[#E76E50] font-semibold text-lg mb-1">Phase III</p>
                <h1 className="text-3xl font-bold text-gray-900">Module 7: In their shoes 👞</h1>
              </div>
            </div>

            {/* Video Placeholder */}
            <div className="bg-[#E8EBF0] rounded-lg p-20 mb-8 flex items-center justify-center">
              <div className="text-center">
                <p className="text-gray-700 text-lg font-medium">Walkthrough Video</p>
                <p className="text-gray-600 text-sm">(small screen recording)</p>
              </div>
            </div>

            {/* Description */}
            <div className="mb-8">
              <p className="text-gray-700 text-base leading-relaxed text-center max-w-3xl mx-auto">
                Time to see the world from someone else's point of view! Shuffle the cards to get your role, then use your best mix of facts, scenarios, and strategy to explain or defend the scenario like it's your own. The stronger (and more empathetic) your case, the more your polarization score drops. Ready to play your way into someone else's perspective? 🧑💙
              </p>
            </div>

            {/* Info and Button Row */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-6 flex-wrap justify-center">
                <div className="flex items-center gap-2 bg-[#E9F1FF] px-3 py-1 rounded-full">
                  <BookOpen className="w-4 h-4 text-[#5B7FFF]" />
                  <span className="text-[#5B7FFF] font-medium">Advanced Level</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-[#4FD1C5]" />
                  <span className="text-gray-700">02:00</span>
                </div>
                <div className="flex items-center gap-2">
                  <Star className="w-4 h-4 text-pink-400" />
                  <span className="text-gray-700">Score is calculated in this module</span>
                </div>
              </div>

              <Button
                onClick={() => {
                  console.log("Starting module, moving to role selection");
                  setCurrentScreen("roleSelection");
                }}
                size="lg"
                className="bg-[#A56DFF] hover:bg-[#9355FA] text-white px-8 rounded-xl"
              >
                Let's begin →
              </Button>
            </div>
          </Card>
        </div>
      </main>
    );
  }

  if (currentScreen === "roleSelection") {
    return (
      <main className="h-[90vh] bg-[#F8F1E7] p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-12">
            {/* Left Side: Icon, Title, Subtitle, Timer */}
            <div className="flex items-center gap-6">
              <div className="relative w-20 h-20 flex items-center justify-center bg-[#4FD1C5] rounded-xl flex-shrink-0">
                <span className="text-2xl font-bold text-[#E91E8C]">M7</span>
              </div>
              <div>
                <h1 className="text-4xl font-bold text-gray-900 mb-2">In their shoes 👞</h1>
                <p className="text-gray-700 text-base mb-3">
                  Step into another role, and make their world make sense.
                </p>
                <div className="flex items-center gap-2 text-gray-900">
                  <AlarmClock className="w-5 h-5" />
                  <span className="text-xl font-semibold">02:00</span>
                </div>
              </div>
            </div>

            {/* Right Side: Polarization Score */}
            <div className="text-right">
              <Progress
                value={98}
                className="w-64 h-3 mb-2 [&>div]:!bg-[linear-gradient(90deg,#FF5A5F_0%,#E91E8C_50%,#8B5CF6_100%)]"
              />
              <p className="text-sm text-gray-600 mb-1">Polarization Score</p>
              <p className="text-2xl font-semibold text-gray-900 mb-2">98%</p>
              <p className="text-lg font-medium text-gray-900">1/1 Left</p>
            </div>
          </div>

          {/* Role Selection Heading */}
          <div className="text-center mb-12">
            <h2 className="text-3xl font-semibold text-gray-900 mb-3">Choose Your Role:</h2>
            <p className="text-lg text-gray-700">
              Each scenario puts you in a different position of power and perspective
            </p>
          </div>

          {/* Role Cards - Organic Layout */}
          <div className=" flex items-center justify-center bg-[#F9F4EC] px-12">
      <Carousel
        opts={{
          align: "start",
          loop: true,
        }}
        className="w-full max-w-6xl relative"
      >
        <CarouselContent>
          {[...Array(6)].map((_, i) => (
            <CarouselItem
              key={i}
              className="cursor-pointer basis-1/2 sm:basis-1/3 md:basis-1/4 lg:basis-1/5"
              onClick={()=>setCurrentScreen("scenario")}
            >
              <RoleCard />
            </CarouselItem>
          ))}
        </CarouselContent>

        <CarouselPrevious className="bg-white border border-gray-300 shadow-sm hover:scale-105 transition" />
        <CarouselNext className="bg-[#FF9348] border border-gray-300 shadow-sm hover:scale-105 transition" />
      </Carousel>
    </div>
        </div>
      </main>
    );
  }
  if (currentScreen === "scenario") {
    return (
      <main className="h-[90vh] bg-[#F8F1E7] p-8">
        <div className="max-w-6xl mx-auto flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between mb-10">
            {/* Left Side */}
            <div className="flex items-center gap-5">
              <div className="relative w-16 h-16 flex items-center justify-center bg-[#FFEBD2] rounded-xl flex-shrink-0">
                <span className="text-xl font-bold text-[#E67A00]">M3</span>
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-1">
                  In their shoes 👟
                </h1>
                <p className="text-gray-700 text-base">
                  Step into another role, and make their world make sense.
                </p>
                <div className="flex items-center gap-2 mt-2 text-gray-900">
                  <AlarmClock className="w-5 h-5" />
                  <span className="text-lg font-semibold">02:00</span>
                </div>
              </div>
            </div>
  
            {/* Right Side: Polarization Score */}
            <div className="text-right">
              <Progress
                value={98}
                className="w-64 h-3 mb-2 [&>div]:!bg-[linear-gradient(90deg,#FF5A5F_0%,#E91E8C_50%,#8B5CF6_100%)]"
              />
              <p className="text-sm text-gray-600">Polarization Score</p>
              <p className="text-right text-gray-700 font-semibold text-lg">
                0/3 Left
              </p>
            </div>
          </div>
  
          {/* Scenario Section */}
          <div className="flex  justify-between rounded-2xl shadow-sm p-10">
            {/* Left: Character Image (using RoleCard) */}
            <div className="w-1/3 flex justify-center">
            <img
          src="/character1.svg" // Replace with your teacher image URL
          alt="Teacher"
         
         
          className="rounded-md w-[80%] h-full"
        />
            </div>
  
            {/* Right: Scenario Text */}
            <div className="w-2/3 flex flex-col   px-8">
            <h2 className="text-[1.25vw] bg-white font-normal text-gray-900 mb-8 w-fit px-[16px] py-[4px] rounded-[40px]">
  Scenario #1
</h2>

              <p className="text-[1.25vw] text-gray-800 leading-relaxed mb-8 max-w-lg">
                You post a reel about gender equality. Overnight, your DMs explode
                — some praise you as a feminist hero, others call you a
                “man-hater.” Brand sponsors email, saying “keep it less
                political.”
              </p>
              <button onClick={()=>{setCurrentScreen("question")}}
               className="bg-[#FF9348] w-[10vw] text-white font-medium px-6 py-2 rounded-lg hover:opacity-90 transition">
                Next →
              </button>
            </div>
          </div>
        </div>
      </main>
    );
  }
  

  // Question Screen
  return (
    <main className="min-h-screen bg-[#F8F1E7] p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-12">
          {/* Left Side */}
          <div className="flex items-center gap-6">
            <div className="relative w-20 h-20 flex items-center justify-center bg-[#4FD1C5] rounded-xl flex-shrink-0">
              <span className="text-2xl font-bold text-[#E91E8C]">M7</span>
            </div>
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">In their shoes 👞</h1>
              <p className="text-gray-700 text-base mb-3">
                Step into another role, and make their world make sense.
              </p>
              <div className="flex items-center gap-2 text-gray-900">
                <AlarmClock className="w-5 h-5" />
                <span className="text-xl font-semibold">02:00</span>
              </div>
            </div>
          </div>

          {/* Right Side: Polarization Score */}
          <div className="text-right">
            <Progress
              value={98}
              className="w-64 h-3 mb-2 [&>div]:!bg-[linear-gradient(90deg,#FF5A5F_0%,#E91E8C_50%,#8B5CF6_100%)]"
            />
            <p className="text-sm text-gray-600 mb-1">Polarization Score</p>
            <p className="text-2xl font-semibold text-gray-900 mb-2">98%</p>
            <p className="text-lg font-medium text-gray-900">1/1 Left</p>
          </div>
        </div>

        {/* Scenario Title */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-semibold text-gray-900">Scenario #1</h2>
        </div>

      
        <div className="flex justify-center items-center bg-[#F9F4EC]">
  <div className="flex flex-col justify-center items-center max-w-4xl w-full px-6 text-center">
    {/* Question Section */}
    <h3 className="text-xl font-semibold text-gray-900 mb-4">Question 1</h3>
    <p className="text-gray-800 mb-8 leading-relaxed">
      What's the most mindful next move that helps you engage with nuance rather than fuel the divide?
    </p>

    {/* Image */}
    <img
      src="/Teacher.svg"
      alt="Teacher"
      width={120}
      height={120}
      className="rounded-md mb-8"
    />

    {/* Answer Cards */}
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 w-full mb-8">
      <Card
        onClick={() => handleAnswerSelect("A")}
        className={`p-2 cursor-pointer transition-all hover:shadow-md border-2 ${
          selectedAnswer === "A"
            ? "bg-[#E8F5E9] border-[#4CAF50]"
            : "bg-[#EDE1D0] border-gray-200 hover:border-gray-300"
        }`}
      >
        <div className="flex flex-col items-start gap-3">
          <span className="flex items-center justify-center w-8 h-8 bg-[white] text-black rounded-2xl font-normal">
            A
          </span>
          <p className="text-sm text-gray-800 text-left leading-relaxed">
          Post a calm follow-up explaining that gender equality benefits everyone, not just one side.
          </p>
        </div>
      </Card>

      <Card
        onClick={() => handleAnswerSelect("B")}
        className={`p-6 cursor-pointer transition-all hover:shadow-md border-2 ${
          selectedAnswer === "B"
            ? "bg-[#E8F5E9] border-[#4CAF50]"
            : "bg-white border-gray-200 hover:border-gray-300"
        }`}
      >
        <div className="flex flex-col items-start gap-3">
          <span className="flex items-center justify-center w-8 h-8 bg-gray-900 text-white rounded font-semibold">
            B
          </span>
          <p className="text-sm text-gray-800 leading-relaxed">
            Host a live Q&A to let both supporters and critics share their views, and clarify your intent.
          </p>
        </div>
      </Card>

      <Card
        onClick={() => handleAnswerSelect("C")}
        className={`p-6 cursor-pointer transition-all hover:shadow-md border-2 ${
          selectedAnswer === "C"
            ? "bg-[#E8F5E9] border-[#4CAF50]"
            : "bg-white border-gray-200 hover:border-gray-300"
        }`}
      >
        <div className="flex flex-col items-start gap-3">
          <span className="flex items-center justify-center w-8 h-8 bg-gray-900 text-white rounded font-semibold">
            C
          </span>
          <p className="text-sm text-gray-800 leading-relaxed">
            Create a follow-up reel unpacking how polarized reactions form online — showing that outrage is algorithmically rewarded.
          </p>
        </div>
      </Card>
    </div>

    {/* Optional Navigation */}
    {/* 
    <div className="flex items-center justify-between w-full">
      <p className="text-sm text-gray-600">‹ next 1/2›</p>
      <Button
        onClick={handleNext}
        disabled={!selectedAnswer}
        size="lg"
        className="bg-[#C4B5FD] hover:bg-[#B4A3F3] text-gray-900 px-16 rounded-lg disabled:opacity-50"
      >
        Next
      </Button>
    </div> 
    */}
  </div>
</div>

      </div>
    </main>
  );
};

export default InTheirShoes;


// components/RoleCard.tsx

function RoleCard() {
  return (
    <div className="bg-[white] h-[35vh] border-[3px] border-black rounded-xl shadow-sm p-6 text-center">
      {/* Top Heading */}
      <h2 className="text-lg font-semibold mb-2 text-black">Divided Class</h2>

      {/* Image */}
      <div className="flex justify-center mb-2">
        <img
          src="/character1.svg" // Replace with your teacher image URL
          alt="Teacher"
          width={120}
          height={120}
          className="rounded-md"
        />
      </div>

      {/* Role */}
      <p className="text-gray-900 font-medium text-md">Role: Teacher</p>
    </div>
  );
}
