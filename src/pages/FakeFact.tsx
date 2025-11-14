import { useQuery } from "@tanstack/react-query";
import { useSearchParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

import { cn } from "@/lib/utils";
import { Bookmark, Check, Heart, X } from "lucide-react";

import { useState,useEffect } from "react";

function extractDynamicSets(data) {
  return data.map(item => {
    const codes = Object.keys(item)
      .filter(k => k.startsWith("imagecode"))
      .map(k => item[k])
      .filter(Boolean);

    let set1 = [];
    let set2 = [];
    let set3 = [];

    let i = 0;

    // --- Set 1: Start with IG or IGR ---
    while (i < codes.length && (codes[i].startsWith("IG_") || codes[i].startsWith("IGR_"))) {
      set1.push(codes[i]);
      i++;
    }

    // --- Set 2: CAR images ---
    while (i < codes.length && codes[i].startsWith("CAR_")) {
      set2.push(codes[i]);
      i++;
    }

    // --- Set 3: Everything else (TTR or IGR) ---
    while (i < codes.length) {
      set3.push(codes[i]);
      i++;
    }

    return {
      topic: item.topic,
      set1,
      set2,
      set3
    };
  });
}
function buildAllQuestions(topics) {
  // Each topic gives one question
  const result = {
    question0: buildFromTopic(topics[0], "IG"),
    question1: buildFromTopic(topics[1], "IG"),
    question2: buildFromTopic(topics[2], "LAST"),
    question3: buildFromTopic(topics[3], "CAR")
  };

  return result;
}
function buildFromTopic(topic, type) {
  if (!topic) return null;

  // 1. Collect all imagecodes
  const codes = Object.keys(topic)
    .filter(k => k.startsWith("imagecode"))
    .map(k => topic[k]);

  // Auto-group
  const ig = [];
  const car = [];
  const last = [];

  for (const code of codes) {
    const prefix = code.split("_")[0].toUpperCase();

    if (prefix === "IG") ig.push(code);
    else if (prefix === "CAR") car.push(code);
    else last.push(code); // TT, TR, IGR, etc
  }
  const toUrl = (code:any) =>{
    
    console.log("check",code)
    if(code.split("_")[0].toUpperCase()=="CAR"){
      return supabase.storage
      .from("Thesis")
      .getPublicUrl(`CAR/${code.split(" ")[0]}.png`).data.publicUrl;
    }
   return supabase.storage
      .from("Thesis")
      .getPublicUrl(`Modules/${code.split(" ")[0]}.png`).data.publicUrl;
    
    }




  // Decide which set to extract
  let selectedSet;

  if (type === "IG") selectedSet = ig;
  if (type === "CAR") selectedSet = car;
  if (type === "LAST") selectedSet = last;
console.log(selectedSet)
  // Map into renderable structure
  return selectedSet
  .filter((code: any) => code)        // removes null, undefined, "", 0, false
  .map((code: any) => ({
    src: toUrl(code),
    correct: !code.toLowerCase().includes("(fake)")
  }));
}


const FakeFact = ()=> {
  const topic = useSelector((state:RootState)=>state.topics.topics)
  const topics = [...topic].sort(() => Math.random() - 0.5).slice(0, 4);

  const[game,setGames] = useState<any>([]);
  const [gamesets,setGamesSet] = useState<any>([]);
  const fetchfact = async () => {
      const { data, error } = await supabase.from("module3").select("*");
      const filterByTopic = (data:any, topics:any) => {
        return data.filter((item:any) => topics.includes(Number(item.topic)));
      };
      setGames(filterByTopic(data,topics))
      setGamesSet(extractDynamicSets(filterByTopic(data,topics)));
      if (error) {
        console.error("Error fetching spotthebias:", error);
        return;
      }
      
    };

    useEffect(()=>{
fetchfact();
    },[])
    console.log(gamesets)
//1
    
    
      const [searchParams] = useSearchParams();
      const navigate = useNavigate();
      const moduleId = searchParams.get("module");
      const [selectedPost, setSelectedPost] = useState<string | null>(null);
      const [showResult, setShowResult] = useState(false);
      const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
      const [correctAnswers, setCorrectAnswers] = useState(0);
      const [biasQuizComplete, setBiasQuizComplete] = useState(false);
      console.log(currentQuestionIndex===3)

      const { data: module } = useQuery({
        queryKey: ["module", moduleId],
        queryFn: async () => {
          if (!moduleId) return null;
          const { data, error } = await supabase.from("modules").select("*").eq("id", moduleId).maybeSingle();
    
          if (error) throw error;
          return data;
        },
        enabled: !!moduleId,
      });
    
      const isM4Module = module?.module_number === "M4";
      const isM5Module = module?.module_number === "M5";
    
     
    
     
    
      const totalQuestions = 4; // Hardcoded to 4 questions for this module
    
      const [selectedCarouselIndex, setSelectedCarouselIndex] = useState<number | null>(null);
    
    
    
const handlePostClick = (postNumber: string, isCorrect: boolean) => {
    if (showResult) return; // Prevent multiple clicks
    setSelectedPost(postNumber);
    setShowResult(true);
    if (isCorrect) {
      setCorrectAnswers((prev) => prev + 1);
    }
  };

  const handleCarouselClick = (index: number, isCorrect: boolean) => {
    if (showResult) return;
    setSelectedCarouselIndex(index);
    setShowResult(true);
    if (isCorrect) {
      setCorrectAnswers((prev) => prev + 1);
    }
  };

  useEffect(() => {
    if (showResult) {
      const timer = setTimeout(() => {
        setShowResult(false);
        setSelectedPost(null);
        setSelectedCarouselIndex(null);
        // Always advance to next question after showing result
        setCurrentQuestionIndex(currentQuestionIndex + 1);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [showResult, currentQuestionIndex]);
  function pickFactAndFake(posts) {
    if (posts){
    const fact = posts.find(p => p.correct);
    const fake = posts.find(p => !p.correct);
    return [fact, fake];}
    else {
      return null;
    }
  }

  const allQuestions = buildAllQuestions([game[0],game[1],game[2],game[3]]);
  allQuestions.question0 = pickFactAndFake(allQuestions.question0);

console.log(allQuestions)

    const [showIntroModal,setShowIntroModal] = useState<boolean>(true)

    if(currentQuestionIndex >= totalQuestions && !isM4Module ){
      return(
         <ClosingModal/>
    )}

  return (
    <div className="p-6 ">
    <div className="bg-[#F8F1E7] px-24 h-[90vh] overflow-hidden flex flex-col">
    <OpeningModal
          showIntroModal={showIntroModal}
          moduleId={"M3"}
          setShowIntroModal={setShowIntroModal}
          src={"/opening13.png"}
        />
      <ModuleHeader />
  
      {currentQuestionIndex < totalQuestions && (
        <h2 className="text-2xl text-center mb-6  font-medium">Click to identify which one is fake</h2>
      )}
  
      <div className="flex-1 flex items-start justify-center">
      {currentQuestionIndex === 0 && allQuestions.question0 ? (
  <div
    className={cn(
      "flex items-center justify-center gap-24 transition-all duration-500",
      showResult && "animate-fade-out"
    )}
  >
    {/* Left Image */}
    <div className="relative flex justify-center max-w-[40%] overflow-visible">
      <img
        src={allQuestions.question0[0].src}
        alt="Left Post"
        className={cn(
          "h-[45vh] w-auto object-contain rounded-lg cursor-pointer transition-all duration-300",
          !showResult && "hover:scale-105 hover:shadow-lg"
        )}
        onClick={() =>
          handlePostClick(
            `question0-post1`,
            allQuestions.question0[0].correct
          )
        }
      />

      {/* Overlay */}
      {showResult && selectedPost === `question0-post1` && (
        <div className="absolute inset-0 bg-black/60 rounded-lg flex items-center justify-center animate-fade-in">
          <div
            className={cn(
              "rounded-full p-6 animate-scale-in",
              allQuestions.question0[0].correct
                ? "bg-[#4EBD6F]"
                : "bg-[#B21B1D]"
            )}
          >
            {allQuestions.question0[0].correct ? (
              <Check className="w-16 h-16 text-white" strokeWidth={3} />
            ) : (
              <X className="w-16 h-16 text-white" strokeWidth={3} />
            )}
          </div>
        </div>
      )}
    </div>

    {/* VS label */}
    <div className="flex items-center justify-center">
      <span className="font-semibold text-[13px] leading-[100%] tracking-[0] text-center">
        VS
      </span>
    </div>

    {/* Right Image */}
    <div className="relative flex justify-center max-w-[40%] overflow-visible">
      <img
        src={allQuestions.question0[1].src}
        alt="Right Post"
        className={cn(
          "h-[45vh] w-auto object-contain rounded-lg cursor-pointer transition-all duration-300",
          !showResult && "hover:scale-105 hover:shadow-lg"
        )}
        onClick={() =>
          handlePostClick(
            `question0-post2`,
            allQuestions.question0[1].correct
          )
        }
      />

      {/* Overlay */}
      {showResult && selectedPost === `question0-post2` && (
        <div className="absolute inset-0 bg-black/60 rounded-lg flex items-center justify-center animate-fade-in">
          <div
            className={cn(
              "rounded-full p-6 animate-scale-in",
              allQuestions.question0[1].correct
                ? "bg-[#4EBD6F]"
                : "bg-[#B21B1D]"
            )}
          >
            {allQuestions.question0[1].correct ? (
              <Check className="w-16 h-16 text-white" strokeWidth={3} />
            ) : (
              <X className="w-16 h-16 text-white" strokeWidth={3} />
            )}
          </div>
        </div>
      )}
    </div>
  </div>
): currentQuestionIndex === 1 ? (
  <div
    className={cn(
      "flex items-center justify-center gap-24 transition-all duration-500 overflow-hidden",
      showResult && "animate-fade-out",
    )}
  >
    {allQuestions.question1 && allQuestions?.question1?.map((post, i) => (
      <div
        key={i}
        className="relative flex justify-center max-w-[30%]"
        onClick={()=>console.log(post.src)}
      >
        <img
          src={post.src}
          alt={`Post ${i + 1}`}
          className={cn(
            "h-[45vh] w-auto object-contain rounded-lg cursor-pointer transition-all duration-300",
            !showResult && "hover:scale-105 hover:shadow-lg",
          )}
          onClick={() => handlePostClick(`post1-${i}`, post.correct)}
        />
        {showResult && selectedPost === `post1-${i}` && (
          <div className="absolute inset-0 bg-black/60 rounded-lg flex items-center justify-center animate-fade-in">
            <div
              className={cn(
                "rounded-full p-6 animate-scale-in",
                post.correct ? "bg-[#4EBD6F]" : "bg-[#B21B1D]",
              )}
            >
              {post.correct ? (
                <Check className="w-16 h-16 text-white" strokeWidth={3} />
              ) : (
                <X className="w-16 h-16 text-white" strokeWidth={3} />
              )}
            </div>
          </div>
        )}
      </div>
    ))}
  </div>
) : currentQuestionIndex === 2 ? (
  <div
    className={cn(
      "flex items-center justify-center gap-24 transition-all duration-500 overflow-hidden",
      showResult && "animate-fade-out",
    )}
  >
    {allQuestions?.question2 && allQuestions?.question2?.map((post, i) => (
      <div
        key={i}
        className="relative flex justify-center max-w-[30%]"
      >
        <img
          src={post.src}
          alt={`Post ${i + 1}`}
          className={cn(
            "h-[45vh] w-auto object-contain rounded-lg cursor-pointer transition-all duration-300",
            !showResult && "hover:scale-105 hover:shadow-lg",
          )}
          onClick={() => handlePostClick(`post2-${i}`, post.correct)}
        />
        {showResult && selectedPost === `post2-${i}` && (
          <div className="absolute inset-0 bg-black/60 rounded-lg flex items-center justify-center animate-fade-in">
            <div
              className={cn(
                "rounded-full p-6 animate-scale-in",
                post.correct ? "bg-[#4EBD6F]" : "bg-[#B21B1D]",
              )}
            >
              {post.correct ? (
                <Check className="w-16 h-16 text-white" strokeWidth={3} />
              ) : (
                <X className="w-16 h-16 text-white" strokeWidth={3} />
              )}
            </div>
          </div>
        )}
      </div>
    ))}
  </div>
) : currentQuestionIndex === 3 ? (
   <Question3Carousel
    showResult={showResult}
    selectedCarouselIndex={selectedCarouselIndex}
    handleCarouselClick={handleCarouselClick}
    carouselImages={allQuestions?.question3} // dynamically passed array
  />
) : null}

  
        {/* Completion screen */}
       
      </div>
    </div>
    </div>
  )
  
}

export default FakeFact


import { Clock } from "lucide-react"
import { TooltipMarker } from "@/components/TooltipMarker";



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
                              src={"/opening13.png"}
                              alt="Module 1"
                              className="w-25  object-contain"
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




import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import {  MessageCircle, Share2,  } from "lucide-react"
import  ClosingModal  from "@/components/ClosingModal";
import OpeningModal from "@/components/OpeningModal";
import { Button } from "@/components/ui/button";
import { useSelector } from "react-redux";
import { RootState } from "@/store";

function Question3Carousel({
  showResult,
  selectedCarouselIndex,
  handleCarouselClick,
  carouselImages, // now an array of images
}) {
  return (

    <div className="flex justify-center items-center bg-[#f9f9f9] ">
      <div
        className={cn(
          "bg-white rounded-xl shadow-sm border max-w-md w-full overflow-hidden transition-all duration-500",
          showResult && "animate-fade-out"
        )}
      >
        {/* Header */}
        <div className="flex items-center gap-3 px-4 pt-4">
          <div className="bg-[#00B16A] rounded-full w-10 h-10 flex items-center justify-center text-white font-bold text-lg">
            EW
          </div>
          <div>
            <h2 className="font-semibold text-gray-900 text-[15px]">
              Entertainment Weekly
            </h2>
            <p className="text-xs text-gray-500">14 September 2025</p>
          </div>
        </div>

        {/* Caption */}
        <p className="text-sm text-gray-800 px-4 py-3 leading-relaxed">
          People say it’s just coincidence, but how do you “accidentally” predict major events?
          Feels less like comedy and more like disclosure.
        </p>

        {/* Carousel */}
        <div className="relative">
          <Carousel className="w-full">
            <CarouselContent>
              {carouselImages.map((src, i) => (
                
                src && (
                  <CarouselItem key={i}>
                    <div className="relative flex items-center justify-center">
                      <img
                        src={src.src}
                        alt={`Carousel image ${i + 1}`}
                        className={cn(
                          "object-cover w-full max-h-[400px] cursor-pointer transition-all duration-300",
                          !showResult && "hover:scale-[1.02]"
                        )}
                        onClick={() => handleCarouselClick(i, src.correct)}
                      />

                      {/* ✅ Overlay result check/cross */}
                      {showResult && selectedCarouselIndex === i && (
                        <div className="absolute inset-0 bg-black/60 flex items-center justify-center rounded-lg animate-fade-in">
                          <div
                            className={cn(
                              "rounded-full p-6 animate-scale-in",
                              src.correct ? "bg-[#4EBD6F]" : "bg-[#B21B1D]"
                            )}
                          >
                            {src.correct ? (
                              <Check
                                className="w-16 h-16 text-white"
                                strokeWidth={3}
                              />
                            ) : (
                              <X
                                className="w-16 h-16 text-white"
                                strokeWidth={3}
                              />
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </CarouselItem>
                )
              ))}
            </CarouselContent>

            <CarouselPrevious className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white shadow-md text-black rounded-full p-2 z-10" />
            <CarouselNext className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white shadow-md text-black rounded-full p-2 z-10" />
          </Carousel>

          {/* Bottom Overlay Caption */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
            <p className="text-white font-semibold text-center text-sm">
            </p>
          </div>
        </div>

        {/* Reaction Bar */}
        <div className="flex justify-between items-center px-4 py-3 text-sm text-gray-700">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <Heart className="w-5 h-5" />
              <span>13.4K</span>
            </div>
            <div className="flex items-center gap-1">
              <MessageCircle className="w-5 h-5" />
              <span>47</span>
            </div>
            <div className="flex items-center gap-1">
              <Share2 className="w-5 h-5" />
              <span>492</span>
            </div>
          </div>
          <Bookmark className="w-5 h-5" />
        </div>
      </div>
    </div>
  )
}
function ClosingModal () {

  const navigate = useNavigate();


  return (
    <div className="p-8">
<div className="h-[90vh] flex items-start justify-center rounded-[24px] pt-8" style={{ backgroundColor: '#F8F1E7' }}>
              <div className="max-w-2xl w-full mx-auto bg-[#F8F1E7] rounded-3xl shadow-sm  text-center">

              {/* Module Completion Header */}
              <div className="flex items-center justify-center gap-4 mb-6">
              <div className="mx-auto w-24 h-24 rounded-full  p-[12px] bg-[linear-gradient(180deg,#D0193E_0%,#5F237B_100%)]">
<div className="w-full h-full bg-[#FDF8F3] rounded-full flex items-center justify-center text-4xl font-semibold text-gray-700">
  –
</div>
</div>
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
              <div className="mt-10 mb-10 flex justify-center items-center">
<img src={"/closingg.svg"} className="h-[35vh]" />

              </div>

<div>
Yikes, 98% polarization! But that’s what we’re here for — to unpack it, learn, and bring the number down together. Lower the score, lower the polarization.... and that's how you win!
</div>
              {/* Next Module Button */}
              <Button
                  size="lg"
                  onClick={() => navigate(`/spotthebias`)}
                  className="mt-6 px-8 py-2 rounded-md bg-[#FF9348]  text-white text-base"
              >
                  Next Module →
              </Button>
          </div>
      </div>
      </div>
  );
} 

