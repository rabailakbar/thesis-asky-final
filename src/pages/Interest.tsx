import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useSearchParams} from "react-router-dom";
import { useState } from "react";
import OpeningModal from "@/components/OpeningModal";
import { ClosingModal } from "@/components/ClosingModal";
import ModuleHeader from "@/components/ModuleHeader";






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
      <ClosingModal nextPath={nextPath} moduleId={moduleId} />
    );
  }



  // Module 1: Topic Voting - UPDATED UI
  return (
    <div className="min-h-screen p-6 rounded-[24px]" style={{ backgroundColor: '#F8F1E7' }}>
      <OpeningModal showIntroModal={showIntroModal} moduleId={moduleId} setShowIntroModal={setShowIntroModal} />
      <div className={` px-4 transition-all duration-300 ${showIntroModal ? "blur-sm pointer-events-none" : ""}`}>

        {/* Header - Horizontal Layout */}
        <ModuleHeader src={"/m1.2.svg"} selectedCount={selectedCount} />


        {/* Topics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {topics.map((topic) => (
            <Card
              key={topic.id}
              className="p-5 bg-white border-gray-200 hover:shadow-md transition-shadow flex flex-col items-center justify-center text-center"
            >
              {/* Category Tag */}
              <div className="mb-3">
                <span
                  className="inline-block px-1 py-1 text-xs font-medium rounded-[21px]"
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
                className="font-normal text-[20px] leading-[100%] text-center text-gray-900 mt-4 min-h-[2.5rem]"
              >
                {topic.title}
              </h3>


              {/* Buttons */}
              <div className="flex gap-2 w-full">
                <Button
                  variant={topic.voted === "interested" ? "default" : "outline"}
                  size="sm"
                  className="flex-1  font-normal text-[17px] leading-[100%] tracking-[0] text-center bg-[#F1F5F9] text-[#1E1E2F] gap-2"
                  onClick={() => handleVote(topic.id, "interested")}
                >
                  <img src={"/like.svg"} className="w-3.5 h-3.5 mr-1.5" />
                  Interested
                </Button>
                <Button
                  variant={topic.voted === "not-interested" ? "default" : "outline"}
                  size="sm"
                  className="flex-1 font-normal text-[17px] leading-[100%] tracking-[0] text-center bg-[#F1F5F9] text-[#1E1E2F] gap-2"
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