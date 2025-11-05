import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate, useSearchParams} from "react-router-dom";
import { useState } from "react";
import OpeningModal from "@/components/OpeningModal";
import { Clock } from "lucide-react";







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
    { id: 1, category: "Entertainment", title: "Celebrity Influence & Drama", voted: null },
    { id: 2, category: "Pop Culture", title: "Trends & Culture", voted: null },
    { id: 3, category: "Health", title: "Health & Diseases", voted: null },
    { id: 4, category: "Education", title: "Science & Research", voted: null },
    { id: 5, category: "Politics", title: "Political News & Debates", voted: null },
    { id: 6, category: "Sports", title: "Esports & Games", voted: null },
    { id: 7, category: "Technology", title: "AI & Innovations", voted: null },
    { id: 8, category: "Pop Culture", title: "Movie & Song Reviews", voted: null },
    { id: 9, category: "Lifestyle", title: "Fashion & Trends", voted: null },
  ]);

  // Module 2 state - Static grid items


  const selectedCount = topics.filter(t => t.voted === "interested").length;

  const handleVote = (id: number, vote: "interested" | "not-interested") => {
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
    const nextModule = moduleId === "M1" ? "M2" : "M3";
    const nextModuleName = moduleId === "M1" ? "myworld" : "Next Module";
    const nextPath =
      moduleId === "M1"
        ? `/exercise`
        : `/module?id=${nextModule}&name=${nextModuleName}&phase=Phase ii`;

    return (
      <ClosingModal  />
    );
  }



  // Module 1: Topic Voting - UPDATED UI
  return (
    <div className="h-[90vh] px-24 rounded-[24px]" style={{ backgroundColor: '#F8F1E7' }}>
      <OpeningModal showIntroModal={showIntroModal} moduleId={moduleId} setShowIntroModal={setShowIntroModal} />
      <div className={` px-4 transition-all duration-300 ${showIntroModal ? "blur-sm pointer-events-none" : ""}`}>

        {/* Header - Horizontal Layout */}
        <ModuleHeader  />


        <div><h1 className="text-[black] text-center text-[24px]">Click to narrow down your interests</h1></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-4">
          {topics.map((topic) => (
            <Card
              key={topic.id}
              className="p-4 bg-white border-gray-200 hover:shadow-md transition-shadow flex flex-col items-center justify-center text-center"
            >
              {/* Category Tag */}
              <div >
                <span
                  className="inline-block p-1 text-xs font-normal rounded-[21px]"
                  style={{
                    backgroundColor: '#E9D5FF',
                    color: 'black',
                  }}
                >
                  {topic.category}
                </span>
              </div>

              {/* Title */}
              <h3
                className="font-normal text-[16px] leading-[100%] text-center text-gray-900 my-2 "
              >
                {topic.title}
              </h3>


              {/* Buttons */}
              <div className="flex gap-8 w-full items-center justify-center">
                <Button
                  variant={topic.voted === "interested" ? "default" : "outline"}
                  size="sm"
                  className="px-10 font-normal text-[12px] leading-[100%] tracking-[0] text-center bg-[#F1F5F9] text-[#1E1E2F] gap-2"
                  onClick={() => handleVote(topic.id, "interested")}
                >
                  <img src={"/like.svg"} className="w-1.75 h-1.75 mr-1.5" />
                  Interested
                </Button>
                <Button
                  variant={topic.voted === "not-interested" ? "default" : "outline"}
                  size="sm"
                  className=" px-10 font-normal text-[12px] leading-[100%] tracking-[0] text-center bg-[#F1F5F9] text-[#1E1E2F] gap-2"
                  onClick={() => handleVote(topic.id, 'not-interested')}
                >
                  <img src="/dislike.svg" alt="dislike" />
                  Not Interested
                </Button>

              </div>
            </Card>
          ))}
        </div>

      </div>
    </div>
  );
};

export default Interest;

const ModuleHeader = () => {
  return (
      <>
          <div className="  pt-12 mb-4">
              <div className="flex items-center justify-between">
                  {/* Left side: Icon + Module Info */}
                  <div className="flex items-center gap-8">
                      {/* Puzzle Icon */}
                      <div className="w-24 h-24 rounded-lg flex items-center justify-center relative flex-shrink-0 ">
                          <img
                              src={"/m3.svg"}
                              alt="Module 1"
                              className="w-24 h-24 object-contain"
                          />
                      </div>

                      {/* Module Info */}
                      <div>
                      <h1 className="font-semibold text-[36px] leading-[100%] tracking-[0] text-[#201E1C] mb-2">
Fake or fact</h1>

<p className="font-normal text-[16px] leading-[100%] tracking-[0] text-[#201E1C] mb-2">
Is everything not real?!
</p>


                          <div className="flex items-center gap-4 text-[#201E1C]">
                              <Clock className="w-[33px] h-[33px]" />
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

const ClosingModal = () => {

  const navigate = useNavigate();


  return (
<div className="h-[90vh] flex items-start justify-center rounded-[24px] pt-24" style={{ backgroundColor: '#F8F1E7' }}>
              <div className="max-w-2xl w-full mx-auto bg-[#F8F1E7] rounded-3xl shadow-sm  text-center">

              {/* Module Completion Header */}
              <div className="flex items-center justify-center gap-4 mb-6">
                  
                  <div className="text-left">
                  <h1 className=" text-[#5F237B] font-bold text-[54px] leading-[100%] tracking-[0%]  mb-2">
  Module 4: Complete
</h1>


<p className="text-black font-normal text-[18px] leading-[100%] mt-1">
✓ 7/7 Score interests narrowed!
</p>

                  </div>
              </div>

              {/* Score Circle */}
              <div className="mt-10 mb-10">
              <p className="text-center text-[black] font-normal text-[18px] leading-[100%] mb-8">
Your new score is
</p>

                  {/* Gradient border circle */}
                  <div className="mx-auto w-48 h-48 rounded-full  p-[24px] bg-[linear-gradient(180deg,#D0193E_0%,#5F237B_100%)]">
<div className="w-full h-full bg-[#FDF8F3] rounded-full flex items-center justify-center text-4xl font-semibold text-gray-700">
  –
</div>
</div>


<p className="mt-16 text-center text-black font-normal text-[24px] leading-[100%]">
We’ll start calculating from the next module…
</p>

              </div>


              {/* Next Module Button */}
              <Button
                  size="lg"
                  onClick={() => navigate(`/M5`)}
                  className="mt-6 px-8 py-2 rounded-md bg-[#FF9348] hover:bg-[#6D28D9] text-white text-base"
              >
                  Next Module →
              </Button>
          </div>
      </div>
  );
} 