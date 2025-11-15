import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate, useSearchParams} from "react-router-dom";
import { useState } from "react";
import OpeningModal from "@/components/OpeningModal";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "../store";
import { addTopic, removeTopic, clearTopics } from "../store/topicsSlice";

import { motion } from "framer-motion";

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
    { id: 1, category: "Entertainment", title: "Blake Lively 'It Ends With Us' Controversy", voted: null },
    { id: 2, category: "Pop Culture", title: "Gen z Vs Millennial's mental health", voted: null },
    { id: 3, category: "Health", title: "Barbie Movie Oscar Nominations", voted: null },
    { id: 4, category: "Education", title: "ChatGPT’s Ghibli Art Trend", voted: null },
    { id: 5, category: "Politics", title: "AI & Job Displacement", voted: null },
    { id: 6, category: "Sports", title: "Covid-19 Vaccine & Billgate’s Predictions", voted: null },
    { id: 7, category: "Technology", title: "Simpson’s Predictions of the real world ", voted: null },
    { id: 8, category: "Pop Culture", title: "Space Technology: 31/Atlas", voted: null },
    { id: 9, category: "Lifestyle", title: "College Degrees: Yes or No?", voted: null },
    {id:10,category:"Law & Order",title:"Karachi’s E-Challan System",voted:null},
    {id:11,category:"Space",title:"Netflix Original: The social Dilemma",voted:null},
    {id:12,category:"Music",title:"Taylor Swift’s new album controversy",voted:null},

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


  if (isComplete) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 40 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.8, ease: "easeInOut" }}
      >
        <ClosingModal />
      </motion.div>
    );
  }
  



  // Module 1: Topic Voting - UPDATED UI
  return (<div className="p-8 ">
    <div className="h-[90vh] px-24 rounded-[24px] overflow-auto py-2 " style={{ backgroundColor: '#F8F1E7' }}>
      <OpeningModal  src={"/opening11.svg"} showIntroModal={showIntroModal} moduleId={moduleId} setShowIntroModal={setShowIntroModal} />
      <div className={` px-4 transition-all duration-300 ${showIntroModal ? "blur-sm pointer-events-none" : ""}`}>

        {/* Header - Horizontal Layout */}
<ModuleHeader count={selectedCount}/>

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
                backgroundColor: "#E9D5FF",
                color: "black",
              }}
            >
              {topic.category}
            </span>
          </div>
        
          {/* Title */}
          <h3 className="font-normal text-[16px] leading-[100%] text-center text-gray-900 my-2">
            {topic.title}
          </h3>
        
          {/* Buttons */}
          <div className="flex gap-8 w-full items-center justify-center">
            {/* Interested Button */}
            <Button
              size="sm"
              onClick={() => handleVote(topic.id, "interested",topic.title)}
              className={`px-10 font-normal text-[12px] leading-[100%] tracking-[0] text-center gap-2 
                ${
                  topic.voted === "interested"
                    ? "bg-[#9250B7] text-white hover:bg-[#9250B7]"
                    : "bg-[#F1F5F9] text-[#1E1E2F]"
                }`}
            >
              <img src="/like.svg" className="w-1.75 h-1.75 mr-1.5" />
              Interested
            </Button>
        
            {/* Not Interested Button */}
            <Button
              size="sm"
              onClick={() => handleVote(topic.id, "not-interested",topic.title)}
              className={`px-10 font-normal text-[12px] leading-[100%] tracking-[0] text-center gap-2 
                ${
                  topic.voted === "not-interested"
                    ? "bg-[#9250B7] text-white hover:bg-[#9250B7]"
                    : "bg-[#F1F5F9] text-[#1E1E2F]"
                }`}
            >
              <img src="/dislike.svg" alt="dislike" className="w-1.75 h-1.75 mr-1.5" />
              Not Interested
            </Button>
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



const ClosingModal = (
) => {

  const navigate = useNavigate();


  return (
    <div className="p-8">
<div className="h-[90vh] flex items-center justify-center rounded-[24px] pt-8" style={{ backgroundColor: '#F8F1E7' }}>
              <div className="max-w-2xl w-full mx-auto bg-[#F8F1E7] rounded-3xl  text-center">

              {/* Module Completion Header */}
              <div className="flex items-center justify-center gap-4 mb-6">
              {/* <div className="mx-auto w-24 h-24 rounded-full  p-[12px] bg-[linear-gradient(180deg,#D0193E_0%,#5F237B_100%)]">
<div className="w-full h-full bg-[#FDF8F3] rounded-full flex items-center justify-center text-4xl font-semibold text-gray-700">
  –
</div>
</div> */}
                  <div className="text-center">
                  <h1 className=" text-[#5F237B] font-bold text-[54px] leading-[100%] tracking-[0%]  mb-2">
  Module 1: Complete
</h1>


<p className="text-black font-normal text-[18px] leading-[100%] mt-1">
✓ 7/7 Score interests narrowed!
</p>

                  </div>
              </div>

              {/* Score Circle */}
              <div className="mt-10 mb-10 flex justify-center items-center">
<img src={"/closingg.svg"} className="h-[35vh]" />

              </div>

<div>
GOOOD JOB! We’ll start calculating from the next module....</div>
              {/* Next Module Button */}
              <Button
                  size="lg"
                  onClick={() => navigate(`/exercise`)}
                  className="mt-6 px-8 py-2 rounded-md bg-[#FF9348]  text-white text-base"
              >
                  Next Module →
              </Button>
          </div>
      </div>
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
                      <div className="w-25 rounded-lg flex items-center justify-center relative flex-shrink-0 ">
                          <img
                              src={"/characterm.svg"}
                              alt="Module 1"
                              className="w-25  object-contain"
                          />
                      </div>

                      {/* Module Info */}
                      <div>
                      <h1 className="font-semibold text-[36px] leading-[100%] tracking-[0] text-[#201E1C] mb-2">
Find Your Vibe</h1>

<p className="font-normal text-[16px] leading-[100%] tracking-[0] text-[#201E1C] mb-2">
What do you like?
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
                  <div className="text-right">
                      <div className="text-3xl font-bold text-gray-900">{`${props.count}/7`}</div>
                  </div>
              </div>
          </div>

          {/* Instructions */}
          
      </>)
}