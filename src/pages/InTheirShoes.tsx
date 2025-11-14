import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { BookOpen, Clock, Star, AlarmClock } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import OpeningModal from "@/components/OpeningModal";
import { ChevronRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import ClosingModal from "@/components/ClosingModal";
type Screen = "intro" | "roleSelection" | "question" | "scenario" | "closing";
type Role = {
  title: string;
  subtitle: string;
};

const InTheirShoes = () => {
  const navigate = useNavigate();
  const [currentScreen, setCurrentScreen] = useState<Screen>("roleSelection");
  const [selectedRole, setSelectedRole] = useState<string >("");
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState(1);
  const [roleDetails,setRoleDetails] = useState<any>({});
  
  const fetchRoleDetails = async (role: string) => {
    const { data, error } = await supabase.from("Roles").select("*").eq("Role", role); // ✅ Filter where Role == role
  setRoleDetails(data[0])
    if (error) {
      console.error("Error fetching spotthebias:", error);
      return;
    }
  
    return data; // ✅ Return the fetched rows
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

  

  const handleAnswerSelect = (answer: string) => {
    if (questionStep === 1) {
      // move to Q2
      setQuestionStep(2);
      setSelectedAnswer(null);
    } else if (questionStep === 2) {
      // show ClosingModal
      setCurrentScreen("closing");
    }
  };

  const handleNext = () => {
    if (currentQuestion < 9) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
    }
  };

  const handleRole = (role:string) =>{
    setCurrentScreen("scenario")
    setSelectedRole(role)
fetchRoleDetails(role)

 }
 const [questionStep, setQuestionStep] = useState<1 | 2>(1);

    

    const renderQuestion = () => {
      if (questionStep === 1) {
        return {
          questionText: roleDetails.Q1,
          answers: [
            { label: "A", text: roleDetails.Q1a },
            { label: "B", text: roleDetails.Q1b },
            { label: "C", text: roleDetails.Q1c },
          ],
        };
      } else {
        return {
          questionText: roleDetails.Q2,
          answers: [
            { label: "A", text: roleDetails.Q2a },
            { label: "B", text: roleDetails.Q2b },
            { label: "C", text: roleDetails.Q2c },
          ],
        };
      }
    };

    const q = renderQuestion();
  // if (currentScreen === "intro") {
  //   return (
  //     <main className="min-h-screen bg-[#F8F1E7] p-8 flex items-center justify-center">
  //       <div className="max-w-4xl w-full">
  //         <Card className="bg-white rounded-2xl p-10 shadow-lg border-none">
  //           {/* Header Section */}
  //           <div className="flex items-center gap-6 mb-8">
  //             <div className="relative w-20 h-20 flex items-center justify-center bg-[#4FD1C5] rounded-xl flex-shrink-0">
  //               <span className="text-2xl font-bold text-[#E91E8C]">M7</span>
  //             </div>
  //             <div>
  //               <p className="text-[#E76E50] font-semibold text-lg mb-1">Phase III</p>
  //               <h1 className="text-3xl font-bold text-gray-900">Module 7: In their shoes 👞</h1>
  //             </div>
  //           </div>

  //           {/* Video Placeholder */}
  //           <div className="bg-[#E8EBF0] rounded-lg p-20 mb-8 flex items-center justify-center">
  //             <div className="text-center">
  //               <p className="text-gray-700 text-lg font-medium">Walkthrough Video</p>
  //               <p className="text-gray-600 text-sm">(small screen recording)</p>
  //             </div>
  //           </div>

  //           {/* Description */}
  //           <div className="mb-8">
  //             <p className="text-gray-700 text-base leading-relaxed text-center max-w-3xl mx-auto">
  //               Time to see the world from someone else's point of view! Shuffle the cards to get your role, then use your best mix of facts, scenarios, and strategy to explain or defend the scenario like it's your own. The stronger (and more empathetic) your case, the more your polarization score drops. Ready to play your way into someone else's perspective? 🧑💙
  //             </p>
  //           </div>

  //           {/* Info and Button Row */}
  //           <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
  //             <div className="flex items-center gap-6 flex-wrap justify-center">
  //               <div className="flex items-center gap-2 bg-[#E9F1FF] px-3 py-1 rounded-full">
  //                 <BookOpen className="w-4 h-4 text-[#5B7FFF]" />
  //                 <span className="text-[#5B7FFF] font-medium">Advanced Level</span>
  //               </div>
  //               <div className="flex items-center gap-2">
  //                 <Clock className="w-4 h-4 text-[#4FD1C5]" />
  //                 <span className="text-gray-700">02:00</span>
  //               </div>
  //               <div className="flex items-center gap-2">
  //                 <Star className="w-4 h-4 text-pink-400" />
  //                 <span className="text-gray-700">Score is calculated in this module</span>
  //               </div>
  //             </div>

  //             <Button
  //               onClick={() => {
  //                 console.log("Starting module, moving to role selection");
  //                 setCurrentScreen("roleSelection");
  //               }}
  //               size="lg"
  //               className="bg-[#A56DFF] hover:bg-[#9355FA] text-white px-8 rounded-xl"
  //             >
  //               Let's begin →
  //             </Button>
  //           </div>
  //         </Card>
  //       </div>
  //     </main>
     
  //   );
  // }
const [showIntroModal,setShowIntroModal] = useState<boolean>(true);
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
          <ModuleHeader/>

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
              className="cursor-pointer basis-1/2 sm:basis-1/3 md:basis-1/4 lg:basis-1/5"
              onClick={()=>handleRole(_.title)}
            >
              <RoleCard role={_.title} />
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
          <ModuleHeader/>
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
  Scenario 
</h2>

              <p className="text-[1.25vw] text-gray-800 leading-relaxed mb-8 max-w-lg">
             {roleDetails.Scenario}
              </p>
              <button onClick={()=>{setCurrentScreen("question")}}
               className="bg-[#FF9348] flex items-center justify-center
                w-[10vw] text-white font-medium px-6 py-2 gap-4 rounded-lg hover:opacity-90 transition">
             <div>   Next  </div> <ChevronRight size={16}/>
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
            <ModuleHeader />

            {/* Question Header */}
            <div className="text-center mb-2">
              <h3 className="text-xl font-normal text-[#201E1C] ">
                {questionStep === 1 ? "Scenario 1 — Q1" : "Scenario 1 — Q2"}
              </h3>
            </div>

            {/* Question Content */}
            <div className="flex justify-center items-center ">
              <div className="flex flex-col justify-center items-center max-w-4xl w-full px-6 ">
                <div className="flex justify-center items-center gap-2 ">
                  <p className="text-[#FF9348] text-[60px]">
                   Q{questionStep}
                  </p>
                  <p 
                  className="leading-relaxed">
                    <span>{questionStep==1?"Approach":"Depth"  }</span><br/> 
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
                  {q.answers.map((a) => (
                    <Card
                      key={a.label}
                      onClick={() => handleAnswerSelect(a.label)}
                      className={`p-2 cursor-pointer transition-all  ${
                        selectedAnswer === a.label
                          ? "bg-[#E8F5E9] border-[#4CAF50]"
                          : "bg-[#EDE1D0] border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <div className="flex flex-col items-start gap-3">
                        <span className="flex items-center justify-center text-[1.25vw] w-8 h-8 bg-[white] text-black rounded-2xl font-normal">
                          {a.label}
                        </span>
                        <p className="text-sm text-gray-800 text-left leading-relaxed">
                          {a.text}
                        </p>
                      </div>
                    </Card>
                  ))}
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
    return <ClosingModal />;
  }

};

export default InTheirShoes;


// components/RoleCard.tsx

function RoleCard(props:any) {
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
      <p className="text-gray-900 font-medium text-md">Role: {props.role}</p>
    </div>
  );
}

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
                              src={"/opening17.png"}
                              alt="Module 1"
                              className="w-25  object-contain"
                          />
                      </div>

                      {/* Module Info */}
                      <div>
                      <h1 className="font-semibold text-[36px] leading-[100%] tracking-[0] text-[#201E1C] mb-2">
                      In their shoes 👟</h1>

<p className="font-normal text-[16px] leading-[100%] tracking-[0] text-[#201E1C] mb-2">
Step into another role, and make their world make sense.</p>


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
