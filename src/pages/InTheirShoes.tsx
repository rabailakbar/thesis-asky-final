import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { BookOpen, Clock, Star, AlarmClock } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";

type Screen = "intro" | "roleSelection" | "question";
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
      <main className="min-h-screen bg-[#F8F1E7] p-8">
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
          <div className="relative max-w-6xl mx-auto h-[500px]">
            {/* Row 1 - Top scattered */}
            <Card
              onClick={() => handleRoleSelect(roles[0])}
              className="absolute top-0 left-[10%] bg-[#F5F3E8] hover:bg-[#EBE8DC] border-none cursor-pointer transition-all hover:scale-105 hover:shadow-lg p-6 flex flex-col items-center justify-center text-center w-48 h-36"
            >
              <h3 className="text-xl font-semibold text-gray-900 mb-1">{roles[0].title}</h3>
              {roles[0].subtitle && <p className="text-sm text-gray-600">{roles[0].subtitle}</p>}
            </Card>

            <Card
              onClick={() => handleRoleSelect(roles[1])}
              className="absolute top-8 left-[32%] bg-[#F5F3E8] hover:bg-[#EBE8DC] border-none cursor-pointer transition-all hover:scale-105 hover:shadow-lg p-6 flex flex-col items-center justify-center text-center w-48 h-36"
            >
              <h3 className="text-xl font-semibold text-gray-900 mb-1">{roles[1].title}</h3>
              {roles[1].subtitle && <p className="text-sm text-gray-600">{roles[1].subtitle}</p>}
            </Card>

            <Card
              onClick={() => handleRoleSelect(roles[2])}
              className="absolute top-0 left-[54%] bg-[#F5F3E8] hover:bg-[#EBE8DC] border-none cursor-pointer transition-all hover:scale-105 hover:shadow-lg p-6 flex flex-col items-center justify-center text-center w-48 h-36"
            >
              <h3 className="text-xl font-semibold text-gray-900 mb-1">{roles[2].title}</h3>
              {roles[2].subtitle && <p className="text-sm text-gray-600">{roles[2].subtitle}</p>}
            </Card>

            <Card
              onClick={() => handleRoleSelect(roles[3])}
              className="absolute top-8 right-[8%] bg-[#F5F3E8] hover:bg-[#EBE8DC] border-none cursor-pointer transition-all hover:scale-105 hover:shadow-lg p-6 flex flex-col items-center justify-center text-center w-48 h-36"
            >
              <h3 className="text-xl font-semibold text-gray-900 mb-1">{roles[3].title}</h3>
              {roles[3].subtitle && <p className="text-sm text-gray-600">{roles[3].subtitle}</p>}
            </Card>

            {/* Row 2 - Middle scattered */}
            <Card
              onClick={() => handleRoleSelect(roles[4])}
              className="absolute top-[200px] right-[10%] bg-[#F5F3E8] hover:bg-[#EBE8DC] border-none cursor-pointer transition-all hover:scale-105 hover:shadow-lg p-6 flex flex-col items-center justify-center text-center w-48 h-36"
            >
              <h3 className="text-xl font-semibold text-gray-900 mb-1">{roles[4].title}</h3>
              {roles[4].subtitle && <p className="text-sm text-gray-600">{roles[4].subtitle}</p>}
            </Card>

            {/* Row 3 - Bottom scattered */}
            <Card
              onClick={() => handleRoleSelect(roles[5])}
              className="absolute bottom-0 left-[12%] bg-[#F5F3E8] hover:bg-[#EBE8DC] border-none cursor-pointer transition-all hover:scale-105 hover:shadow-lg p-6 flex flex-col items-center justify-center text-center w-48 h-36"
            >
              <h3 className="text-xl font-semibold text-gray-900 mb-1">{roles[5].title}</h3>
              {roles[5].subtitle && <p className="text-sm text-gray-600">{roles[5].subtitle}</p>}
            </Card>

            <Card
              onClick={() => handleRoleSelect(roles[6])}
              className="absolute bottom-8 left-[38%] bg-[#F5F3E8] hover:bg-[#EBE8DC] border-none cursor-pointer transition-all hover:scale-105 hover:shadow-lg p-6 flex flex-col items-center justify-center text-center w-48 h-36"
            >
              <h3 className="text-xl font-semibold text-gray-900 mb-1">{roles[6].title}</h3>
              {roles[6].subtitle && <p className="text-sm text-gray-600">{roles[6].subtitle}</p>}
            </Card>

            <Card
              onClick={() => handleRoleSelect(roles[7])}
              className="absolute bottom-0 right-[15%] bg-[#F5F3E8] hover:bg-[#EBE8DC] border-none cursor-pointer transition-all hover:scale-105 hover:shadow-lg p-6 flex flex-col items-center justify-center text-center w-48 h-36"
            >
              <h3 className="text-xl font-semibold text-gray-900 mb-1">{roles[7].title}</h3>
              {roles[7].subtitle && <p className="text-sm text-gray-600">{roles[7].subtitle}</p>}
            </Card>
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

        {/* Two Column Layout */}
        <div className="grid grid-cols-[400px_1fr] gap-12 items-start">
          {/* Left: Scenario Card */}
          <Card className="bg-[#F5F3E8] border-none p-8 shadow-sm">
            <h3 className="text-2xl font-semibold text-gray-900 mb-6 text-center">Scenario #1</h3>
            <h4 className="text-xl font-semibold text-gray-900 mb-8 text-center">
              {selectedRole?.title}
              {selectedRole?.subtitle && (
                <span className="block text-base text-gray-600 mt-2">{selectedRole.subtitle}</span>
              )}
            </h4>
            <p className="text-base text-gray-800 leading-relaxed text-center">
              You post a reel about gender equality. Overnight, your DMs explode — some praise you as a feminist hero,
              others call you a "man-hater." Brand sponsors email, saying "keep it less political."
            </p>
          </Card>

          {/* Right: Question and Answers */}
          <div className="flex flex-col">
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Question 1</h3>
              <p className="text-gray-800 mb-8 leading-relaxed">
                What's the most mindful next move that helps you engage with nuance rather than fuel the divide?
              </p>

              {/* Answer Cards - Horizontal Layout */}
              <div className="grid grid-cols-3 gap-6 mb-8">
                <Card
                  onClick={() => handleAnswerSelect("A")}
                  className={`p-6 cursor-pointer transition-all hover:shadow-md border-2 ${
                    selectedAnswer === "A" 
                      ? "bg-[#E8F5E9] border-[#4CAF50]" 
                      : "bg-white border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div className="flex flex-col items-start gap-3">
                    <span className="flex items-center justify-center w-8 h-8 bg-gray-900 text-white rounded font-semibold flex-shrink-0">
                      A
                    </span>
                    <p className="text-sm text-gray-800 leading-relaxed">
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
                    <span className="flex items-center justify-center w-8 h-8 bg-gray-900 text-white rounded font-semibold flex-shrink-0">
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
                    <span className="flex items-center justify-center w-8 h-8 bg-gray-900 text-white rounded font-semibold flex-shrink-0">
                      C
                    </span>
                    <p className="text-sm text-gray-800 leading-relaxed">
                      Create a follow-up reel unpacking how polarized reactions form online — showing that outrage is algorithmically rewarded.
                    </p>
                  </div>
                </Card>
              </div>

              {/* Navigation */}
              <div className="flex items-center justify-between">
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
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default InTheirShoes;
