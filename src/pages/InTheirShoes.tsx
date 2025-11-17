import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { BookOpen, Clock, Star, AlarmClock } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { ChevronRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
type Screen = "intro" | "roleSelection" | "question" | "scenario" | "closing";
type Role = {
  title: string;
  subtitle: string;
};

const InTheirShoes = () => {
  const navigate = useNavigate();
  const [currentScreen, setCurrentScreen] = useState<Screen>("roleSelection");
  const [selectedRole, setSelectedRole] = useState<string>("");
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState(1);
  const [roleDetails, setRoleDetails] = useState<any>({});
  const [round, setRound] = useState(1); // Round 1 → 3
  const [usedRoles, setUsedRoles] = useState<string[]>([]);
  const [questionStep, setQuestionStep] = useState<1 | 2>(1);
  const [showIntroModal, setShowIntroModal] = useState<boolean>(true);
  
  // ⭐ NEW STATE: Map answer label (A, B, C) to the tooltip text that should appear
  const [tooltipMapping, setTooltipMapping] = useState<{ [key: string]: string | null }>({});

  const fetchRoleDetails = async (role: string) => {
      const { data, error } = await supabase.from("Roles").select("*").eq("Role", role);
      console.log(data)
      setRoleDetails(data[0])
      if (error) {
          console.error("Error fetching spotthebias:", error);
          return;
      }
      return data;
  };

  const roles: Role[] = [
      { title: "Team Captain", subtitle: "Physical Training" },
      { title: "School Editor", subtitle: "" },
      { title: "Parent", subtitle: "" },
      { title: "Friend", subtitle: "Social Media" },
      { title: "Family", subtitle: "School" },
      { title: "Teacher", subtitle: "School Club" },
      { title: "Influencer", subtitle: "Older Sibling" },
  ];

  const dispatch = useDispatch()
  const score = useSelector((state: any) => state.topics.score)

  const handleAnswerSelect = (selectedLabel: string, color: string) => {
      setSelectedAnswer(selectedLabel);

      // Score update logic
      if (color === "#FFC700") {
          dispatch(decreaseScore(2))
      }
      if (color === "#FF9348") {
          dispatch(decreaseScore(4))
      }
      if (color === "#5F237B") {
          dispatch(decreaseScore(6))
      }

      // ⭐ TOOLTIP LOGIC IMPLEMENTATION
      const qData = renderQuestion();
      const newTooltipMapping: { [key: string]: string | null } = {};

      if (color !== "#5F237B") {
          // Case: Yellow or Orange is selected (Non-Purple)
          // 1. Selected answer displays the first tooltip (Qx.tooltip1)
          newTooltipMapping[selectedLabel] = qData.tooltip1;

          // 2. Find the purple answer and assign the second tooltip (Qx.tooltip2) to it
          const purpleAnswer = qData.answers.find(a => a.color === "#5F237B");
          if (purpleAnswer) {
              newTooltipMapping[purpleAnswer.label] = qData.tooltip2;
          }
      } else {
          // Case: Purple (#5F237B) is selected. No tooltip occurs on the selected answer.
          // As per requirement, if purple is selected, no tooltips will be mapped initially.
      }

      setTooltipMapping(newTooltipMapping);
      // ⭐ END TOOLTIP LOGIC

      // Delay before moving to next step
      setTimeout(() => {
          // Reset state for next step/round
          setSelectedAnswer(null);
          setTooltipMapping({}); // Clear tooltips when moving on

          if (questionStep === 1) {
              setQuestionStep(2);
          } else if (questionStep === 2) {
              if (round < 3) {
                  setRound(round + 1);
                  setQuestionStep(1);
                  setRoleDetails({});
                  setSelectedRole("");
                  setCurrentScreen("roleSelection");
              } else {
                  setCurrentScreen("closing");
              }
          }
      }, 10000); // 1 second delay
  };


  const handleNext = () => {
      if (currentQuestion < 9) {
          setCurrentQuestion(currentQuestion + 1);
          setSelectedAnswer(null);
      }
  };

  const handleRole = async (role: string) => {
      setSelectedRole(role);

      // Add role to used list
      setUsedRoles((prev) => [...prev, role]);

      await fetchRoleDetails(role);

      setCurrentScreen("scenario");
  };


  const selectColor = (color: string) => {
      if (color === "yellow") return "#FFC700";
      if (color === "orange") return "#FF9348";
      if (color === "purple") return "#5F237B";
      return "#EDEDED"; // fallback (optional)
  };

  const renderQuestion = () => {
      if (questionStep === 1) {
          return {
              tooltip1: roleDetails.Q1tooltip1,
              tooltip2: roleDetails.Q1tooltip2,
              questionText: roleDetails.Q1,
              answers: [
                  { label: "A", text: roleDetails.Q1a, color: selectColor(roleDetails.Q1atype) },
                  { label: "B", text: roleDetails.Q1b, color: selectColor(roleDetails.Q1btype) },
                  { label: "C", text: roleDetails.Q1c, color: selectColor(roleDetails.Q1ctype) },
              ],
          };
      } else {
          return {
              tooltip1: roleDetails.Q2tooltip1,
              tooltip2: roleDetails.Q2tooltip2,
              questionText: roleDetails.Q2,
              answers: [
                  { label: "A", text: roleDetails.Q2a, color: selectColor(roleDetails.Q2atype) },
                  { label: "B", text: roleDetails.Q2b, color: selectColor(roleDetails.Q2btype) },
                  { label: "C", text: roleDetails.Q2c, color: selectColor(roleDetails.Q2ctype) },
              ],
          };
      }
  };


  const q = renderQuestion();


  if (currentScreen === "roleSelection") {
      return (
          <div className="p-8">
              <main className="h-[90vh] bg-[#F8F1E7] ">
                  <OpeningModal
                      showIntroModal={showIntroModal}
                      moduleId={"M7"}
                      setShowIntroModal={setShowIntroModal}
                      src={"/opening17.png"}
                  />        <div className="max-w-7xl mx-auto">
                      {/* Header */}
                      <ModuleHeader currentQuestionIndex={3 - round} polarizationScore={score} />

                      {/* Role Selection Heading */}
                      <div className="text-center mb-12">
                          <h2 className="text-3xl font-normal text-black mb-3">Choose Your Role:</h2>
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
                                  {roles.map((_, i) => (
                                      <CarouselItem
                                          key={i}
                                          className={`cursor-pointer basis-1/2 sm:basis-1/3 md:basis-1/4 lg:basis-1/5 
                     ${usedRoles.includes(_.title) ? "opacity-40 pointer-events-none" : ""}`}
                                          onClick={() => !usedRoles.includes(_.title) && handleRole(_.title)}
                                      >
                                          <RoleCard role={_.title} disabled={usedRoles.includes(_.title)} />
                                      </CarouselItem>

                                  ))}
                              </CarouselContent>

                              <CarouselPrevious className="bg-white border border-gray-300 shadow-sm hover:scale-105 transition" />
                              <CarouselNext className="bg-[#FF9348] border border-gray-300 shadow-sm hover:scale-105 transition" />
                          </Carousel>
                      </div>
                  </div>
              </main>
          </div>
      );
  }
  if (currentScreen === "scenario") {
      return (

          <div className="p-8">
              <main className="h-[90vh] bg-[#F8F1E7] ">
                  <div className="max-w-6xl mx-auto flex flex-col">
                      {/* Header */}
                      <ModuleHeader currentQuestionIndex={round} polarizationScore={score} />
                      <div className="text-center ">
                          <h2 className="text-lg font-semibold text-[#201E1C] ">Choose Your Role:</h2>
                          <p className="text-lg text-[#201E1C]">
                              Each scenario puts you in a different position of power and perspective
                          </p>
                      </div>
                      {/* Scenario Section */}
                      <div className="flex  justify-between  p-10">
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
                                  Scenario {round}
                              </h2>

                              <p className="text-[1.25vw] text-gray-800 leading-relaxed mb-8 max-w-lg">
                                  {roleDetails.Scenario}
                              </p>
                              <button onClick={() => { setCurrentScreen("question") }}
                                  className="bg-[#FF9348] flex items-center justify-center
              w-[10vw] text-white font-medium px-6 py-2 gap-4 rounded-lg hover:opacity-90 transition">
                                  <div>   Next  </div> <ChevronRight size={16} />
                              </button>
                          </div>
                      </div>
                  </div>
              </main>
          </div>
      );
  }


  // Question Screen
  if (currentScreen === "question") {


      return (
          <div className="p-8">
              <main className="h-[90vh] bg-[#F8F1E7] p-8">
                  <div className="max-w-7xl mx-auto">
                      <ModuleHeader currentQuestionIndex={3 - round} polarizationScore={score} />

                      {/* Question Header */}
                      <div className="text-center mb-2">
                          <h3 className="text-xl font-normal text-[#201E1C] ">
                              {questionStep === 1 ? `Scenario ${round} — Q1` : `Scenario ${round} — Q2`}
                          </h3>
                      </div>

                      {/* Question Content */}
                      <div className="flex justify-center items-center ">
                          <div className="flex flex-col justify-center items-center max-w-4xl w-full px-6 ">
                              <div className="flex justify-center items-center gap-2 ">
                                  <p
                                      className="text-[60px]"
                                      style={{
                                          color: questionStep === 1 ? "#FF9348" : "#5F237B",
                                      }}
                                  >                   Q{questionStep}
                                  </p>
                                  <p
                                      className="leading-relaxed">
                                      <span>{questionStep == 1 ? "Approach" : "Depth"}</span><br />
                                      {q.questionText}</p>
                              </div>

                              {/* Image */}
                              <img
                                  src="/Teacher.svg"
                                  alt="Teacher"
                                  width={120}
                                  height={120}
                                  className="rounded-md mb-2"
                              />

                              {/* Answers */}
                              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 w-full mb-8">
                                  {q.answers.map((a, i) => {
                                      const isColored = selectedAnswer !== null; // true if user has clicked any answer
                                      const bgColor = isColored ? a.color : "#EDE1D0";
                                      const textColor = isColored ? "text-white" : "text-gray-800";
                                      
                                      // ⭐ Get the tooltip text from the mapping
                                      const tooltipText = tooltipMapping[a.label];


                                      return (
                                          // ⭐ Use a container div for relative positioning of the tooltip
                                          <div key={a.label}  >
                                              <Card
                                                  onClick={() => handleAnswerSelect(a.label, a.color)}
                                                  className={`p-2 cursor-pointer transition-all border-gray-200 h-full`}
                                                  style={{ backgroundColor: bgColor }}
                                              >
                                                  <div className="flex flex-col items-start gap-3">
                                                      <span className={`flex items-center justify-center text-[1.25vw] w-8 h-8 bg-white text-black rounded-2xl font-normal`}>
                                                          {a.label}
                                                      </span>
                                                      <p className={`text-sm text-left leading-relaxed ${textColor}`}>
                                                          {a.text}
                                                      </p>
                                                  </div>
                                              </Card>

                                              {/* ⭐ Conditionally render the Tooltip component */}
                                              {tooltipText && (
                                                  <div className="absolute top-0 left-[105%] z-10">
                                                      <Tooltip description={tooltipText} />
                                                  </div>
                                              )}
                                          </div>
                                      );
                                  })}
                              </div>


                          </div>
                      </div>
                  </div>
              </main>
          </div>
      );
  }

  // ✅ Closing screen after both Q1 & Q2 done
  if (currentScreen === "closing") {
      return <ClosingModal score={score} />;
  }

};

export default InTheirShoes;



// components/RoleCard.tsx

function RoleCard({ role, disabled }: any) {
  return (
    <div
      className={`bg-white h-[35vh] border-[3px] rounded-xl p-6 text-center
                  ${disabled ? "opacity-40 border-gray-400" : "border-black"}`}
    >
      <h2 className="text-lg font-semibold mb-2 text-black">Divided Class</h2>
      <div className="flex justify-center mb-2">
        <img
          src="/character1.svg"
          alt={role}
          width={120}
          height={120}
          className="rounded-md"
        />
      </div>

      <p className="text-gray-900 font-medium text-md">Role: {role}</p>
      {disabled && <p className="text-sm text-red-500 mt-2">Already used</p>}
    </div>
  );
}








const ModuleHeader = (props) => {
  return (
      <>
          <div className="  pt-6 mb-2">
              <div className="flex items-center justify-between">
                  {/* Left side: Icon + Module Info */}
                  <div className="flex items-center gap-8">
                      {/* Puzzle Icon */}
                      <div className="w-24 rounded-lg flex items-center justify-center relative flex-shrink-0 ">
                          <img
                              src={"/opening17.png"}
                              alt="Module 1"
                              className="w-24  object-contain"
                          />
                      </div>

                      {/* Module Info */}
                      <div>
                      <h1 className="font-semibold text-[36px] leading-[100%] tracking-[0] text-[#201E1C] mb-2">
In their shoes</h1>

<p className="font-normal text-[16px] leading-[100%] tracking-[0] text-[#201E1C] mb-2">
Step into another role, and make their world make sense.
</p>


                          <div className="flex items-center gap-4 text-[#201E1C]">
<img src={"/clocl.svg"} />

                              <span className="font-normal text-[24px] leading-[100%] tracking-[0]">
02:00
</span>

                          </div>

                      </div>
                  </div>

                  {/* Right side: Counter */}
                  <div className="flex flex-col justify-between gap-4 h-full items-end">
  {/* Top div */}
  <div>
    <div className="w-[200px] h-4 rounded-full bg-[#EDE1D0] overflow-hidden mb-1 relative">
      {/* Gray background track (already present) */}
      <div className="absolute top-0 left-0 w-full h-full bg-[#EDE1D0] rounded-full"></div>

      {/* Gradient foreground */}
      <div
        className="h-full rounded-full relative"
        style={{
          width: `${props.polarizationScore || 5}%`,
          background: "linear-gradient(180deg, #D0193E 0%, #5F237B 100%)",
        }}
      />
    </div>
    <span className="text-sm text-gray-700"> Polarization Score</span>
  </div>

  {/* Bottom div */}
  <div>
    <div className="text-3xl font-semibold text-gray-900">
      {props.currentQuestionIndex}/3 Left
    </div>
  </div>
</div>


              </div>
          </div>

          {/* Instructions */}
          
      </>)
}



















 function ClosingModal (props) {

  const navigate = useNavigate();


  return (
    <div className="p-8">
<div className="h-[90vh] flex items-center justify-center rounded-[24px] pt-8" style={{ backgroundColor: '#F8F1E7' }}>
              <div className="max-w-2xl w-full mx-auto bg-[#F8F1E7] rounded-3xl  text-center">

              {/* Module Completion Header */}
              <div className="flex  justify-center gap-4 mb-6">
              {/* <div className="mx-auto w-24 h-24 rounded-full  p-[12px] bg-[linear-gradient(180deg,#D0193E_0%,#5F237B_100%)]">
<div className="w-full h-full bg-[#FDF8F3] rounded-full flex items-center justify-center text-4xl font-semibold text-gray-700">
  –
</div>
</div> */}
  <CircleScore scoreDrop={props.score}/>

                  <div className="text-left">
                  <h1 className=" text-[#5F237B] font-bold text-[54px] leading-[100%] tracking-[0%]  mb-4">
  Module 7: Complete
</h1>


<p className="text-black font-normal text-[18px] leading-[100%] mt-1">
8/8 facts served! </p>

                  </div>
              </div>

              {/* Score Circle */}
              <div className="mt-10 mb-10 flex justify-center items-center">
<img src={"/closing22.png"} className="h-[35vh]" />

              </div>

<div>
You did it! 🎉 Your polarization score is at its <span className="text-[#5F237B]"> lowest </span> — proof that <span className="text-[#D0193E]">curiosity wins</span> over bias.</div>
              {/* Next Module Button */}
              <Button
                  size="lg"
                  onClick={() => navigate(`/exercise`)}
                  className="mt-6 px-8 py-2 rounded-md bg-[#FF9348]  text-white text-base"
              >
                  Next Module <ChevronRight/>
              </Button>
          </div>
      </div>
      </div>
  );
} 
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store";
import { decreaseScore } from "@/store/topicsSlice";
import CircleScore from "@/components/CircleScore";
import Tooltip from "@/components/tooltipp";
const OpeningModal = (props:any)=>{
    

  return (
      <Dialog open={props.showIntroModal } onOpenChange={props.setShowIntroModal}>
<DialogContent className="max-w-[1000px] aspect-[1253/703] rounded-[12px] p-0 gap-0 bg-white">
<div className="px-32 py-16">
                  {/* Header with Icon */}
                  <div className="flex items-start gap-4 mb-6">
                    {/* Puzzle Icon */}
                    <div className="w-16 h-16 rounded-lg flex items-center justify-center relative flex-shrink-0 ">
        <img
          src={props.src}
          alt="Module 1"
          className="w-16 h-16 object-contain"
        />
      </div>
      
                    
                    {/* Title */}
                    <div>
                    <div className="text-[#FF9348] text-[24px] font-semibold ">Phase III</div>
                    <h2 className="text-[24px] font-bold text-black">Module {props.moduleId.split()[0].split("")[1]}: In their Shoes</h2>
                    </div>
                  </div>
      
                  {/* Video Placeholder */}
                  <div className="bg-gray-100 rounded-lg p-12 mb-6 text-center">
                    <div className="text-gray-500">
                      <div className="font-medium mb-1">Walkthrough Video</div>
                      <div className="text-sm">(small screen recording)</div>
                    </div>
                  </div>
      
                  {/* Description */}
                  <p className="text-[#1E1E2F] font-lato font-normal text-[16px] leading-[100%] tracking-[0] mb-6">
                  Time to see the world from someone else’s point of view! Swipe the cards to get your role, then use your best mix facts and emotions to explain or defend the scenario like it’s your own. The stronger (and more empathetic) your case, the more your polarization score drops. Ready to play your way into someone else’s perspective? 🎭💡
                </p>

      
                  {/* Info Badges */}
                  <div className="flex items-center gap-4 mb-6 text-sm">
                 
                  <div className="flex items-center gap-2 text-[#1E1E2F]  py-1.5 rounded-full font-[400] text-[18px] leading-[100%] tracking-[0]">
<img src={"/I_1b.svg"} />
Advanced Level
</div>

                    <div className="flex items-center gap-2 text-[#1E1E2F]-600">
                      <img src={"/clocl.svg"} className="w-4 h-4 " />
                      <span>02:00</span>
                    </div>
                    <div className=" flex justify-center items-center gap-2 text-[#1E1E2F]-500 ">
        <img src={"/star.svg"}/>
                      Score is  being calculated in this module
                    </div>
                  </div>
      
                  {/* Begin Button */}
                  <div className="flex justify-center">
                  <button
  onClick={() => props.setShowIntroModal(false)}
  className="
    bg-[#FF9348] text-white rounded-[6px] px-[10px] py-[8px] w-[197px] h-[42px]
    text-base font-medium flex items-center justify-center gap-[10px]
    focus:outline-none focus:ring-0 active:outline-none
  "
>
  Let's begin <ChevronRight size={14} />
</button>
      </div>
                </div>
              </DialogContent>
            </Dialog>
  )
}
