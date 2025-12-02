import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import ModuleHeader from "@/components/ModuleHeader";
import { supabase } from "@/integrations/supabase/client";
import { useDispatch, useSelector } from "react-redux";
import { decreaseScore } from "@/store/topicsSlice";
import { RootState } from "@/store";
import CircleScore from "@/components/CircleScore";
import TooltipCarousel from "@/components/TooltipCarousel";
import CelebrationScreen from "./Closing";
import Celebration from "@/components/Celebration";
import { Button } from "@/components/ui/button";
import OpeningModal from "@/components/OpeningModal";
// Removed unused imports (BookOpen, Clock, Star, AlarmClock, Card, Progress, Button)
type Screen = "intro" | "roleSelection" | "question" | "scenario" | "celebration" | "closing";
type Role = {
  title: string;
  subtitle: string;
};

const InTheirShoes = () => {
  const navigate = useNavigate();
  const [currentScreen, setCurrentScreen] = useState<Screen>("roleSelection");
  const [selectedRole, setSelectedRole] = useState<string>("");
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [roleDetails, setRoleDetails] = useState<any>({});
    const [round, setRound] = useState(1); // Single round with two questions
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
      { title: "Team Captain", subtitle: "Captain's Judgement" },
      { title: "School Editor", subtitle: "Editor's Mind" },
      { title: "Parent", subtitle: "Dinner Debate" },
      { title: "Friend", subtitle: "Protest Pressure" },
      { title: "Family", subtitle: "Worried Grandmother" },
      { title: "Teacher", subtitle: "Viral Video" },
      { title: "Influencer", subtitle: "Influencer Dilemma" },
  ];

  const dispatch = useDispatch()
  const score = useSelector((state: any) => state.topics.score)
const[check,setCheck] = useState(false)

const insertscore = async()=>{
    const email = JSON.parse(localStorage.getItem("email"))
    const { data, error } = await supabase
  .from("Users")
  .update({ Score: score })   // score is your value
  .eq("Email", email);        // email is the matching email

}
useEffect(()=>{
    if(currentScreen=="closing"){
insertscore()}
},[currentScreen])

  const handleAnswerSelect = (selectedLabel: string, color: string) => {
      setSelectedAnswer(selectedLabel);
      setCheck(true)

      // Score update logic
      if (color === "#FFC700") {
          dispatch(decreaseScore(6))
      }
      if (color === "#FF9348") {
          dispatch(decreaseScore(12))
      }
      if (color === "#5F237B") {
          dispatch(decreaseScore(18))
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
                    // Move to second question
                    setQuestionStep(2);
                } else if (questionStep === 2) {
                    // Show celebration screen before final results
                    setCurrentScreen("celebration");
                }
            }, 3000);
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
const [done,setDone] = useState(false)

  // ⭐ NEW: Role image mapping
  const roleImageMap: { [key: string]: string } = {
    "Team Captain": "/Team captain.svg",
    "School Editor": "/Editor.svg", 
    "Parent": "/Parent.svg",
    "Friend": "/Friends.svg",
    "Family": "/Grandma.svg",
    "Teacher": "/School teacher.svg",
    "Influencer": "/Influencer.svg",
  };

//   <OpeningModal
//   showIntroModal={showIntroModal}
//   moduleId={"M6"}
//   setShowIntroModal={setShowIntroModal}
//   src={"/opening16.png"}
//   phase="III"
//   module="Module 6: Debate Switch"
//   description={description}
//   time="2:00"
//   calculated=""
//   level="Advanced"
//   />

  const description =
  <div className=" text-[1.25vw] font-normal leading-tight">Time to see the world from someone else’s point of view! Swipe the cards to get your role, then use your best mix facts and emotions to explain or defend the scenario like it’s your own. The stronger (and more empathetic) your case, the more your polarization score drops. Ready to play your way into someone else’s perspective? 🎭💡</div>
  if (currentScreen === "roleSelection") {
      return (
          <div className="p-12">
              <main className="h-[90vh] bg-[#F8F1E7] rounded-[24px] shadow-[0px_0px_25px_0px_#0000001A_inset] ">
                  <OpeningModal
                      showIntroModal={showIntroModal}
                      moduleId={"M7"}
                      setShowIntroModal={setShowIntroModal}
                      src={"/opening17.png"}
                      phase="III"
                      module="Module 7: In their shoes"
                      description={description}
                      level={"Advanced"}
                  />        <div className="max-w-7xl mx-auto">
                      {/* Header */}
                      <ModuleHeader src={"/opening17.png"} headingColor="#FF803E"  setDone={setDone} polarizationScore={score} module={7} heading="In their shoes" description="Step into another role, and make their world make sense." time={120} started={!showIntroModal} left={1}  />

                      {/* Role Selection Heading */}
                      <div className="text-center mt-8 mb-16">
                          <h2 className="text-[1.5vw] font-medium text-[#130719] ">Choose Your Role:</h2>
                          <p className="text-[1.5vw] font-medium text-[#130719]">
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
                              {roles
  .filter(role => !usedRoles.includes(role.title))  // remove used roles
  .map((role, i) => (
    <CarouselItem
      key={i}
      className="cursor-pointer basis-1/2 sm:basis-1/3 md:basis-1/4 lg:basis-1/5"
      onClick={() => handleRole(role.title)}
    >
      <RoleCard role={role} roleImageMap={roleImageMap} />
    </CarouselItem>
))}

                              </CarouselContent>

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

          <div className="p-12">
              <main className=" rounded-[24px] shadow-[0px_0px_25px_0px_#0000001A_inset] h-[90vh] bg-[#F8F1E7] ">
                  <div className="max-w-7xl mx-auto flex flex-col">
                      {/* Header */}
                      <ModuleHeader src={"/opening17.png"} setDone={setDone} polarizationScore={score}  headingColor="#FF803E"   module={7} heading="In their shoes" description="Step into another role, and make their world make sense." time={120} started={!showIntroModal} left={1}  />
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
                                  src={roleImageMap[selectedRole] || "/character1.svg"} // Use role-specific image
                                  alt={selectedRole}
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
          <div className="p-12">
              <main className=" rounded-[24px] shadow-[0px_0px_25px_0px_#0000001A_inset] min-h-[90vh] bg-[#F8F1E7]  ">
           
                  <div className="max-w-7xl mx-auto relative">
                  {/* <button
    onClick={()=>{setSelectedAnswer(null);
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
                setCurrentScreen("celebration");
            }
        }}} // your function to go to the next step
    className="absolute top-1/2 right-0 w-[60] cursor-pointer h-[60] -translate-y-1/2 bg-[#FF9348] text-white px-2 py-2 rounded-full shadow-lg hover:bg-[#7A3ACF] transition-colors"
  >
    <ChevronRight/>
  </button> */}
                  <ModuleHeader src={"/opening17.png"} headingColor="#FF803E"  setDone={setDone} polarizationScore={score} module={7} heading="In their shoes" description="Step into another role, and make their world make sense." time={120} started={!showIntroModal} left={1}  />

                      {/* Question Header */}
                      <div className="text-center ">
                          <h3 className="text-xl   text-[#201E1C] ">
                              {`Scenario #${round}`}
                          </h3>
                      </div>

                      {/* Question Content */}
                      <div className="flex justify-center items-center relative  ">
               
                          <div className="flex flex-col justify-center items-center  w-full ">
                              <div className="flex justify-center items-center gap-2 ">
                                  <p
                                      className="text-[72px] font-semibold
                                      "
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
                              {/* Image with Next button */}
                              <div className="relative mb-2 w-full flex justify-center items-center">
  <img
    src="/module7.svg"
    alt="Teacher"
    width={144}
    height={144}
    className="rounded-md"
  />
  
 {check && <button
    onClick={()=>{
        setCheck(false)
        setSelectedAnswer(null);
        setTooltipMapping({});
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
                setCurrentScreen("celebration");
            }
        }
    }}
    className="absolute top-1/2 right-0 -translate-y-1/2 z-20 w-14 h-14 flex items-center justify-center bg-[#FF9348] text-white rounded-full shadow-lg  transition-colors"
  >
    <ChevronRight />
  </button>}

</div>


                              {/* Answers */}
                              <div className="grid grid-cols-1 px-36 sm:grid-cols-3 gap-8 w-full mb-8">
                              {q.answers.map((a, i) => {
    const isColored = selectedAnswer !== null;
    const bgColor = isColored ? a.color : "#EDE1D0";
    const textColor = isColored ? "text-white" : "text-gray-800";

    const tooltipText = selectedAnswer==a.label && a.color != "#5F237B"
const ischecked = selectedAnswer==a.label && a.color == "#5F237B"

    return (
        <div key={a.label} className="relative">   {/* <-- FIX HERE */}
            <div
                onClick={() => handleAnswerSelect(a.label, a.color)}
                className="pt-2 pb-2  px-4 cursor-pointer transition-all border-gray-200 h-full rounded-tl-3xl rounded-tr-3xl rounded-br-3xl
 "
                style={{ backgroundColor: "#EDE1D0" }}
            >
              {!ischecked && !tooltipText &&  <div className="flex flex-col items-start gap-3">
                    <span className="flex items-center justify-center text-[1.25vw] w-8 h-8 bg-white text-black rounded-2xl font-normal">
                        {a.label}
                    </span>
                    <p className="text-[16px] text-left leading-relaxed #130719">
                        {a.text}
                    </p>
                </div>}
                {ischecked &&
                <div className="flex items-center w-full h-full justify-center">
                <img src="/try.svg"/>
                </div>
                }
                {tooltipText &&
                <div className="flex items-center w-full h-full justify-center">
                <img src="/trynot.svg"/>
                </div>

                }
            </div>

            {tooltipText && (
      <div className="absolute bottom-full left-0 mb-2 z-10">
                     <TooltipCarousel
        
      slides={[
        { heading: "question?.Bias_Type", description: q?.tooltip1 },
        { description: q?.tooltip2 }
      ]} onClose={()=>(false)} 
      header={false}
      
      />
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

    // 🎉 Celebration screen (5s confetti) before final closing/results
    if (currentScreen === "celebration") {
        return <Celebration onFinish={() => setCurrentScreen("closing")} durationMs={4000} />;
    }

    // ✅ Final closing/results screen
    if (currentScreen === "closing") {
        return <CelebrationScreen />;
    }

};

export default InTheirShoes;



// components/RoleCard.tsx

 function RoleCard({ role, disabled, roleImageMap }: any) {
    return (
        <div
            className={`bg-white h-[35vh] w-full gap-4 flex flex-col justify-center items-center border-[6px] rounded-xl px-4 py-2 text-center
                                    ${disabled ? "opacity-40 border-gray-400" : "border-black"}`}
        >
            <h2 className="text-[1vw] font-medium  text-[#130719]">{role.subtitle}</h2>
            <div className="flex justify-center ">
                <img
                    src={roleImageMap[role.title] || "/character1.svg"}
                    alt={role.title}
                    className="rounded-md w-[10vw]" 
                />
            </div>

            <p className="text-[1vw] font-medium  text-[#130719]">Role: {role.title}</p>
        </div>
    );
 }