import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate, useSearchParams} from "react-router-dom";
import { useState } from "react";
import OpeningModal from "@/components/OpeningModal";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "../store";
import { addTopic, removeTopic, clearTopics } from "../store/topicsSlice";

import { motion } from "framer-motion";
import ModuleHeader from "@/components/ModuleHeader";
import ClosingModal from "@/components/ClosingModal";

interface Topic {
  id: number;
  category: string;
  title: string;
  voted: "interested" | "not-interested" | null;
}


const Interest = () => {
  const [searchParams] = useSearchParams();
  const moduleId = searchParams.get("id") || "M1";

  const [isComplete, setIsComplete] = useState(false);

  // Fetch images from Supabase storage


  // Module 1 state
  const [topics, setTopics] = useState<Topic[]>([
    { id: 0, category: "Entertainment", title: "Blake Lively 'It Ends With Us' Controversy", voted: null },
    { id: 1, category: "Pop Culture", title: "Gen z Vs Millennial's mental health", voted: null },
    { id: 2, category: "Health", title: "Barbie Movie Oscar Nominations", voted: null },
    { id: 3, category: "Education", title: "ChatGPT’s Ghibli Art Trend", voted: null },
    { id: 4, category: "Politics", title: "AI & Job Displacement", voted: null },
    { id: 5, category: "Sports", title: "Covid-19 Vaccine & Billgate’s Predictions", voted: null },
    { id: 6, category: "Technology", title: "Simpson’s Predictions of the real world ", voted: null },
    { id: 7, category: "Pop Culture", title: "Space Technology: 31/Atlas", voted: null },
    { id: 8, category: "Lifestyle", title: "College Degrees: Yes or No?", voted: null },
    {id:9,category:"Law & Order",title:"Karachi’s E-Challan System",voted:null},
    {id:10,category:"Space",title:"Netflix Original: The social Dilemma",voted:null},
    {id:11,category:"Music",title:"Taylor Swift’s new album controversy",voted:null},

  ]);

  // Module 2 state - Static grid items
  const dispatch = useDispatch<AppDispatch>();
const topic = useSelector((state:RootState)=>state.topics.topics)
  const selectedCount = topics.filter(t => t.voted === "interested").length;
console.log("checkk",topic)
  const handleVote = (id: number, vote: "interested" | "not-interested",title:string) => {
    
    if(vote=="interested"){
      dispatch(addTopic(id))
    } else if (vote==="not-interested"){
      dispatch(removeTopic(id))
    }
    setTopics(prev => {
      const updated = prev.map(topic =>
        topic.id === id ? { ...topic, voted: vote } : topic
      );
     

      const newCount = updated.filter(t => t.voted === "interested").length;
      if (newCount >= 7) {
        setTimeout(() => setIsComplete(true), 500);
      }
      return updated;
    });
  };


  const [showIntroModal, setShowIntroModal] = useState(true);


 
  


const score = useSelector((state:RootState)=>state.topics.score)
  // Module 1: Topic Voting - UPDATED UI
  const [done,setDone]= useState(false)
  return (
  isComplete?(<motion.div
    initial={{ opacity: 0, scale: 0.95, y: 40 }}
    animate={{ opacity: 1, scale: 1, y: 0 }}
    exit={{ opacity: 0, scale: 0.95 }}
    transition={{ duration: 0.8, ease: "easeInOut" }}
  >
            <ClosingModal module={1} text={"7/7 Score interests narrowed!"} src={"/exercise"} ending={"GOOOD JOB! We’ll start calculating from the next module...."} 
            score={score} />




  </motion.div>):
  
  
  <div className="p-8 ">
    <div className="h-[90vh] px-24 rounded-[24px] overflow-auto py-2 " style={{ backgroundColor: '#F8F1E7' }}>
      <OpeningModal 
      phase="I"  
      module="Module 1: Find your vibe" 
      description="In this module, students will filter out content for themselves. From a pool of 50 topics, they are supposed to narrow down 15 by simply clicking on the of ‘Interested’ & ‘Not Interested’ buttons. These picks will shape their personalized explore feed for the next module."   
     time="2:00"
     calculated="not"
     level="Beginner"
     src={"/opening11.svg"} showIntroModal={showIntroModal} moduleId={moduleId} setShowIntroModal={setShowIntroModal} />
      <div className={` px-4 transition-all duration-300 ${showIntroModal ? "blur-sm pointer-events-none" : ""}`}>

        {/* Header - Horizontal Layout */}
<ModuleHeader polarizationScore={score} setDone={setDone} module={1} src={"/opening11.svg"} heading={"Find your Vibe"} description="Let’s help you build a feed!" time={120}  left={7-selectedCount}/>

        <div><h1 className="text-[black] text-center text-[24px]">Click to narrow down your interests</h1></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-4">
          {topics.map((topic) => (
          <Card
          key={topic.id}
          className="p-4 bg-white border-gray-200 hover:shadow-md transition-shadow flex flex-col items-center justify-center text-center"
        >
          {/* Category Tag */}
          <div>
            <span
              className="inline-block p-1 text-xs font-normal rounded-[21px]"
              style={{
                backgroundColor: "#DFD3E5",
                color: "#32302E",
              }}
            >
              {topic.category}
            </span>
          </div>
        
          {/* Title */}
          <h3 className="font-normal text-[16px] leading-[100%] text-center text-[#130719] my-4">
            {topic.title}
          </h3>
        
          {/* Buttons */}
          <div className="flex w-full items-center justify-center">
  {/* Interested Button */}
  <Button
    size="sm"
    onClick={() => handleVote(topic.id, "interested", topic.title)}
    className={`
      font-normal text-[12px] leading-[100%] tracking-[0] text-center gap-2 transition-all duration-300
      ${topic.voted === "interested" ? "bg-[#D0193E] text-white w-full py-3" : "bg-[#F1F5F9] text-[#4C1C62] px-10"}
    `}
  >
    {topic.voted != "interested"? (<img src="/love.svg" className="w-1.75 h-1.75 mr-1.5" />):
    (<img src="/whitelove.svg" className="w-1.75 h-1.75 " />)}
    
    Interested

  </Button>

  {/* Not Interested Button — hide when interested */}
  {topic.voted !== "interested" && (
    <Button
      size="sm"
      onClick={() => handleVote(topic.id, "not-interested", topic.title)}
      className={`
        ml-4 font-normal text-[12px] leading-[100%] tracking-[0] text-center gap-2 text-[#4C1C62]
        ${topic.voted === "not-interested"
          ? "bg-[#9250B7] text-white hover:bg-[#9250B7]"
          : "bg-[#F1F5F9] text-[#4C1C62] px-10"}
      `}
    >
      <img src="/unlove.svg" alt="dislike" className="w-1.75 h-1.75 mr-1.5" />
      Not Interested
    </Button>
  )}
</div>

        </Card>
        
          ))}
        </div>

      </div>
    </div>
    </div>
  );
};

export default Interest;




// const ModuleHeader = (props) => {
//   return (
//       <>
//           <div className="  pt-6 mb-2">
//               <div className="flex items-center justify-between">
//                   {/* Left side: Icon + Module Info */}
//                   <div className="flex items-center gap-8">
//                       {/* Puzzle Icon */}
//                       <div className="w-25 rounded-lg flex items-center justify-center relative flex-shrink-0 ">
//                           <img
//                               src={"/characterm.svg"}
//                               alt="Module 1"
//                               className="w-25  object-contain"
//                           />
//                       </div>

//                       {/* Module Info */}
//                       <div>
//                       <h1 className="font-semibold text-[36px] leading-[100%] tracking-[0] text-[#201E1C] mb-2">
// Find Your Vibe</h1>

// <p className="font-normal text-[16px] leading-[100%] tracking-[0] text-[#201E1C] mb-2">
// What do you like?
// </p>


//                           <div className="flex items-center gap-4 text-[#201E1C]">
// <img src={"/clocl.svg"} />

//                               <span className="font-normal text-[24px] leading-[100%] tracking-[0]">
// 02:00
// </span>

//                           </div>

//                       </div>
//                   </div>

//                   {/* Right side: Counter */}
//                   <div className="text-right">
//                       <div className="text-3xl font-bold text-gray-900">{`${props.count}/7`}</div>
//                   </div>
//               </div>
//           </div>

//           {/* Instructions */}
          
//       </>)
// }