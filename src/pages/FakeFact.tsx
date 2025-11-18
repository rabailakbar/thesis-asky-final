import { useQuery } from "@tanstack/react-query";
import { useSearchParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

import { cn } from "@/lib/utils";
import { Bookmark, Check, ChevronRight, Heart, X } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import {  MessageCircle, Share2,  } from "lucide-react"
import { Button } from "@/components/ui/button";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store";
import { decreaseScore } from "@/store/topicsSlice";
import OpeningModal from "@/components/OpeningModal";
import ClosingModal from "@/components/ClosingModal";
import ModuleHeader from "@/components/ModuleHeader";
import { useState,useEffect } from "react";


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
    console.log(code)
    if (prefix === "IG") ig.push(code);
    else if (prefix === "CAR") car.push(code);
    else last.push(code); // TT, TR, IGR, etc
  }
  const toUrl = (code:any) =>{
    
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
  // Map into renderable structure
  return selectedSet
  .filter((code: any) => code)        // removes null, undefined, "", 0, false
  .map((code: any) => ({
    src: toUrl(code),
    correct: !code.toLowerCase().includes("(fake)"),
    heading:topic.heading,
    caption:topic.caption,
    reach:topic.reach,
    source:topic.source
  }));
}


const FakeFact = ()=> {
  const dispatch = useDispatch();
  const topic = useSelector((state:RootState)=>state.topics.topics)
  const uniqueTopics = Array.from(new Set(topic));
const score = useSelector((state:RootState)=> state.topics.score)
  const topics = uniqueTopics
    .sort(() => Math.random() - 0.5)
    .slice(0, 8);
  const[game,setGames] = useState<any>([]);

  const fetchtooltip = async (code:any) => {
    const { data, error } = await supabase
    .from("module3tool")
    .select("*")
    .eq("ImageCode", code);  

     
    if (error) {
      console.error("Error fetching spotthebias:", error);
      return;
    }
    
  };
  const fetchfact = async () => {
      const { data, error } = await supabase.from("module3").select("*");
      const filterByTopic = (data:any, topics:any) => {
        return data.filter((item:any) => topics.includes(Number(item.topic)));
      };
      console.log("check",topics)
      console.log(data)
      console.log(filterByTopic(data,topics))
      setGames(filterByTopic(data,topics))
      if (error) {
        console.error("Error fetching spotthebias:", error);
        return;
      }
      
    };

    useEffect(()=>{
fetchfact();
    },[])
//1
    
    
      const [searchParams] = useSearchParams();
      const navigate = useNavigate();
      const moduleId = searchParams.get("module");
      const [selectedPost, setSelectedPost] = useState<string | null>(null);
      const [showResult, setShowResult] = useState(false);
      const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
      const [correctAnswers, setCorrectAnswers] = useState(0);
      const [biasQuizComplete, setBiasQuizComplete] = useState(false);

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
    
     
    
     
    
      const totalQuestions = 8; // Hardcoded to 4 questions for this module
    
      const [selectedCarouselIndex, setSelectedCarouselIndex] = useState<number | null>(null);
    
    
    
const handlePostClick = (postNumber: string, isCorrect: boolean) => {
    if (showResult) return; // Prevent multiple clicks
    setSelectedPost(postNumber);
    setShowResult(true);
    if (isCorrect) {
      setCorrectAnswers((prev) => prev + 1);
      dispatch(decreaseScore(2.25))

    } 
  };

  const handleCarouselClick = (index: number, isCorrect: boolean) => {
    if (showResult) return;
    setSelectedCarouselIndex(index);
    setShowResult(true);
    if (isCorrect) {
      setCorrectAnswers((prev) => prev + 1);
      dispatch(decreaseScore(2.25))
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
  const allQuestions1= buildAllQuestions([game[3],game[2],game[0],game[1]])
  allQuestions.question0 = pickFactAndFake(allQuestions.question0);
  allQuestions1.question0 = pickFactAndFake(allQuestions1.question0)
const ending=<div>
Nice! Your <span className=" font-semibold text-[#D0193E]"> polarization</span> just dropped — looks like you’re already making progress.
 Keep on asking why & keep on going: <span className="font-semibold text-[#5F237B]">lower the score, lower the polarization…</span> that’s how you win! 
</div>
    const [showIntroModal,setShowIntroModal] = useState<boolean>(true)
  const[done,setDone] = useState(false)
    if(currentQuestionIndex >= totalQuestions || done ){
      return(
         <ClosingModal  ending={ending} src={"/spotthebias"} module={3} text={"✓ 8/8 Facts served!"}  score={score}/>



    )}
  return (
    <div className="p-6 ">
    <div className="bg-[#F8F1E7] px-24 h-[90vh] overflow-hidden flex flex-col">
    <OpeningModal
          showIntroModal={showIntroModal}
          moduleId={"M3"}
          setShowIntroModal={setShowIntroModal}
          src={"/opening13.png"}
          phase={"II"}
          module={"Module 3: Fake or Fact?"}
          description={<div>
            "In this level, you’ll become a fake content detective 🕵️‍♀️.<br/> You’ll explore different post formats — from side-by-side comparisons to posts, reels, and carousels — and figure out what’s real and what’s not. Look closely at sources, images, and engagement counts to spot the fakes and earn your points!"
         </div>
          }
          time={"5:00"}
level={"Intermediate"}
calculated={""}
        />

      <ModuleHeader src={"/opening13.png"} setDone={setDone} polarizationScore={score} module={3} heading="Fake or fact" description="Is everything not real?!" time={300}  left={8-currentQuestionIndex} total={8} />
  
      {currentQuestionIndex < totalQuestions && (
        <h2 className="text-2xl text-center mb-6  font-normal">Click to identify which one is fake</h2>
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
              
            )}
          >
            {allQuestions.question0[0].correct ? (
              <Check color="#4EBD6F" className="w-16 h-16 text-white" strokeWidth={3} />
            ) : (
              <X color="#B21B1D" className="w-16 h-16 text-white" strokeWidth={3} />
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
): currentQuestionIndex === 2 ? (
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
              )}
            >
              {post.correct ? (
                <Check color="#4EBD6F" className="w-16 h-16 text-white" strokeWidth={3} />
              ) : (
                <X  color="#B21B1D" className="w-16 h-16 text-white" strokeWidth={3} />
              )}
            </div>
          </div>
        )}
      </div>
    ))}
  </div>
) : currentQuestionIndex === 4 ? (
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
              )}
            >
              {post.correct ? (
                <Check  color="#4EBD6F" className="w-16 h-16 text-white" strokeWidth={3} />
              ) : (
                <X  color="#4EBD6F"  className="w-16 h-16 text-white" strokeWidth={3} />
              )}
            </div>
          </div>
        )}
      </div>
    ))}
  </div>
) : currentQuestionIndex === 6 ? (
   <Question3Carousel
    showResult={showResult}
    selectedCarouselIndex={selectedCarouselIndex}
    handleCarouselClick={handleCarouselClick}
    carouselImages={allQuestions?.question3} // dynamically passed array
  />
) : null}
 {currentQuestionIndex === 1 && allQuestions.question0 ? (
  <div
    className={cn(
      "flex items-center justify-center gap-24 transition-all duration-500",
      showResult && "animate-fade-out"
    )}
  >
    {/* Left Image */}
    <div className="relative flex justify-center max-w-[40%] overflow-visible">
      <img
        src={allQuestions1.question0[0].src}
        alt="Left Post"
        className={cn(
          "h-[45vh] w-auto object-contain rounded-lg cursor-pointer transition-all duration-300",
          !showResult && "hover:scale-105 hover:shadow-lg"
        )}
        onClick={() =>
          handlePostClick(
            `question0-post1`,
            allQuestions1.question0[0].correct
          )
        }
      />

      {/* Overlay */}
      {showResult && selectedPost === `question0-post1` && (
        <div className="absolute inset-0 bg-black/60 rounded-lg flex items-center justify-center animate-fade-in">
          <div
            className={cn(
              "rounded-full p-6 animate-scale-in",
             
            )}
          >
            {allQuestions1.question0[0].correct ? (
              <Check  color="#4EBD6F" className="w-16 h-16 text-white" strokeWidth={3} />
            ) : (
              <X  color="#B21B1D"  className="w-16 h-16 text-white" strokeWidth={3} />
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
        src={allQuestions1.question0[1].src}
        alt="Right Post"
        className={cn(
          "h-[45vh] w-auto object-contain rounded-lg cursor-pointer transition-all duration-300",
          !showResult && "hover:scale-105 hover:shadow-lg"
        )}
        onClick={() =>
          handlePostClick(
            `question0-post2`,
            allQuestions1.question0[1].correct
          )
        }
      />

      {/* Overlay */}
      {showResult && selectedPost === `question0-post2` && (
        <div className="absolute inset-0 bg-black/60 rounded-lg flex items-center justify-center animate-fade-in">
          <div
            className={cn(
              "rounded-full p-6 animate-scale-in"
             
            )}
          >
            {allQuestions1.question0[1].correct ? (
              <Check color="#4EBD6F" className="w-16 h-16 text-white" strokeWidth={3} />
            ) : (
              <X  color="#B21B1D" className="w-16 h-16 text-white" strokeWidth={3} />
            )}
          </div>
        </div>
      )}
    </div>
  </div>
): currentQuestionIndex === 3 ? (
  <div
    className={cn(
      "flex items-center justify-center gap-24 transition-all duration-500 overflow-hidden",
      showResult && "animate-fade-out",
    )}
  >
    {allQuestions1.question1 && allQuestions1?.question1?.map((post, i) => (
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
          onClick={() => handlePostClick(`post1-${i}`, post.correct)}
        />
        {showResult && selectedPost === `post1-${i}` && (
          <div className="absolute inset-0 bg-black/60 rounded-lg flex items-center justify-center animate-fade-in">
            <div
              className={cn(
                "rounded-full p-6 animate-scale-in"
              )}
            >
              {post.correct ? (
                <Check  color="#4EBD6F" className="w-16 h-16 text-white" strokeWidth={3} />
              ) : (
                <X  color="#B21B1D"className="w-16 h-16 text-white" strokeWidth={3} />
              )}
            </div>
          </div>
        )}
      </div>
    ))}
  </div>
) : currentQuestionIndex === 5 ? (
  <div
    className={cn(
      "flex items-center justify-center gap-24 transition-all duration-500 overflow-hidden",
      showResult && "animate-fade-out",
    )}
  >
    {allQuestions1?.question2 && allQuestions1?.question2?.map((post, i) => (
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
              )}
            >
              {post.correct ? (
                <Check  color="#4EBD6F" className="w-16 h-16 text-white" strokeWidth={3} />
              ) : (
                <X color="#B21B1D" className="w-16 h-16 text-white" strokeWidth={3} />
              )}
            </div>
          </div>
        )}
      </div>
    ))}
  </div>
) : currentQuestionIndex === 7 ? (
   <Question3Carousel
    showResult={showResult}
    selectedCarouselIndex={selectedCarouselIndex}
    handleCarouselClick={handleCarouselClick}
    carouselImages={allQuestions1?.question3} // dynamically passed array
  />
) : null}

  
        {/* Completion screen */}
       
      </div>
    </div>
    </div>
  )
  
}

export default FakeFact




function Question3Carousel({
  showResult,
  selectedCarouselIndex,
  handleCarouselClick,
  carouselImages, // now an array of images
}) {
  const introImage = carouselImages.find(img => img.src.includes("z.png"));
const otherImages = carouselImages.filter(img => !img.src.includes("z.png"));

const orderedImages = [
  introImage ? { ...introImage, intro: true } : null,
  ...otherImages.map(img => ({ ...img, intro: false }))
].filter(Boolean);
const numbers = carouselImages[0].reach.match(/[\d.]+[KM]?/g);

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
              {carouselImages[0].source}
            </h2>
            <p className="text-xs text-gray-500">14 September 2025</p>
          </div>
        </div>

        {/* Caption */}
        <p className="text-sm text-gray-800 px-4 py-3 leading-relaxed">
          {carouselImages[0].caption}
        </p>

        {/* Carousel */}
        <div className="relative">
          <Carousel className="w-full">
            <CarouselContent>
              {orderedImages.map((src, i) => (
                
                src && (
                  <CarouselItem key={i}>
                    <div className="relative flex items-center justify-center">
                      <img
                        src={src.src}
                        alt={`Carousel image ${i + 1}`}
                        className={cn(
                          "object-cover w-full  cursor-pointer transition-all duration-300",
                          !showResult && !src.intro && "hover:scale-[1.02]",
                          src.intro && "cursor-default"
                        )}
                        
                        onClick={() => {
                          if (!src.intro) handleCarouselClick(i, src.correct);
                        }}                      />

                      {/* ✅ Overlay result check/cross */}
                      {showResult && selectedCarouselIndex === i && (
                        <div className="absolute inset-0 bg-black/60 flex items-center justify-center rounded-lg animate-fade-in">
                          <div
                            className={cn(
                              "rounded-full p-6 animate-scale-in",
                            )}
                          >
                            {src.correct ? (
                              <Check
                              color="#4EBD6F"
                                className="w-16  h-16 text-white"
                                strokeWidth={3}
                              />
                            ) : (
                              <X
                              color="#B21B1D"
                                className="w-16 h-16   text-white"
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
              <span>{numbers[0]}</span>
            </div>
            <div className="flex items-center gap-1">
              <MessageCircle className="w-5 h-5" />
              <span>{numbers[1]}</span>
            </div>
            <div className="flex items-center gap-1">
              <Share2 className="w-5 h-5" />
              <span>{numbers[2]}</span>
            </div>
          </div>
          <Bookmark className="w-5 h-5" />
        </div>
      </div>
    </div>
  )
}















