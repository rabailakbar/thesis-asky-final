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
import Tooltip from "@/components/tooltipp";







const FakeFact = ()=> {
  const dispatch = useDispatch();
  const topic = useSelector((state:RootState)=>state.topics.topics)
  const uniqueTopics = Array.from(new Set(topic));
  const [tooltips,setToolTips] = useState([]);
const score = useSelector((state:RootState)=> state.topics.score)
  const topics = [1,2,3,4,5,6,7,8,9]
  const[game,setGames] = useState<any>([]);
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
      source:topic.source,
      tooltip:tooltips.filter(p=>p.ImageCode===code.split(" ")[0])[0]?.Tooltip?tooltips.filter(p=>p.ImageCode===code.split(" ")[0])[0]?.Tooltip:""
  
    }));
  
  
  
  }

  
  const fetchfact = async () => {
      const { data, error } = await supabase.from("module3").select("*");
      const filterByTopic = (data:any, topics:any) => {
        return data.filter((item:any) => topics.includes(Number(item.topic)));
      };

      const tooltip = await supabase
      .from("module3tool")
      .select("*")  

      setToolTips(tooltip.data)

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
  const [isCorrectAnswer, setIsCorrectAnswer] = useState<boolean | null>(null);
  const [selectedImageTooltip, setSelectedImageTooltip] = useState<string>("");
  const [selectedIncorrectImage, setSelectedIncorrectImage] = useState<string>("");

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
    
     
    
     
    
      const totalQuestions = 4; // Reduced to a single question per new requirements
    
      const [selectedCarouselIndex, setSelectedCarouselIndex] = useState<number | null>(null);
    
    
    
const handlePostClick = (postNumber: string, isCorrect: boolean, tooltip?: string, imageSrc?: string) => {
    if (showResult) return; // Prevent multiple clicks
    setSelectedPost(postNumber);
    setShowResult(true);
    setIsCorrectAnswer(isCorrect);
    setSelectedImageTooltip(tooltip || "");
    setSelectedIncorrectImage(imageSrc || "");
    if (isCorrect) {
      setCorrectAnswers((prev) => prev + 2);
      dispatch(decreaseScore(2.25))

    } 
  };

  const handleCarouselClick = (index: number, isCorrect: boolean, tooltip?: string, imageSrc?: string) => {
    if (showResult) return;
    setSelectedCarouselIndex(index);
    setShowResult(true);
    setIsCorrectAnswer(isCorrect);
    setSelectedImageTooltip(tooltip || "");
    setSelectedIncorrectImage(imageSrc || "");
    if (isCorrect) {
      setCorrectAnswers((prev) => prev + 2);
      dispatch(decreaseScore(2.25))
    }
  };



  const handleNextQuestion = () => {
    setShowResult(false);
    setSelectedPost(null);
    setSelectedCarouselIndex(null);
    setIsCorrectAnswer(null);
    setSelectedImageTooltip("");
    setSelectedIncorrectImage("");
    setCurrentQuestionIndex(currentQuestionIndex + 1);
  };

  useEffect(() => {
    // Remove the auto-timer for wrong answers
    // if (showResult && !isCorrectAnswer) {
    //   // For wrong answers, auto-advance after 3 seconds
    //   const timer = setTimeout(() => {
    //     handleNextQuestion();
    //   }, 3000);
    //   return () => clearTimeout(timer);
    // }
  }, [showResult, isCorrectAnswer, currentQuestionIndex]);
  function pickFactAndFake(posts) {
    if (posts){
    const fact = posts.find(p => p.correct);
    const fake = posts.find(p => !p.correct);
    return [fact, fake];}
    else {
      return null;
    }
  }
  console.log("check game",game)
  const allQuestions = buildAllQuestions([game?.filter(g=>g.topic==1)[0],game?.filter(g=>g.topic==7)[0],game?.filter(g=>g.topic==9)[0],game?.filter(g=>g.topic==7)[0]]);
  const allQuestions1= buildAllQuestions([game[3],game[2],game[0],game[1]])
  allQuestions.question0 = pickFactAndFake(allQuestions.question0);
  allQuestions1.question0 = pickFactAndFake(allQuestions1.question0)
  console.log(allQuestions)
const ending=<div>
Nice! Your <span className=" font-semibold text-[#D0193E]"> polarization just dropped</span> — looks like you’re already making progress.
 Keep on asking why & keep on going: <span className="font-semibold text-[#5F237B]">lower the score, lower the polarization…</span> that’s how you win! 
</div>
    const [showIntroModal,setShowIntroModal] = useState<boolean>(true)
  const[done,setDone] = useState(false)
    if(currentQuestionIndex >= totalQuestions || done ){
      return(
        <ClosingModal  ending={ending} src={"/spotthebias"} module={3} text={"✓ 1/1 Fact checked!"}  score={score} animateFrom={95}/>



    )}
  return (
    <div className="p-12">
<div className="bg-[#F8F1E7] px-24 pt-2 pb-8 overflow-hidden flex flex-col rounded-[24px] shadow-[0px_0px_25px_0px_#0000001A_inset]">
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
          time={"2:00"}
level={"Intermediate"}
calculated={""}
        />

      <ModuleHeader src={"/opening13.png"} setDone={setDone} polarizationScore={score} module={3} heading="Fake or fact?" headingColor="#D0193E" description="Is everything not real?!" time={120} started={!showIntroModal} left={4-currentQuestionIndex} total={4} />
  
      {currentQuestionIndex < totalQuestions && (
        <h2 className="text-2xl text-center my-8  font-normal">Click to identify which one is fake</h2>
      )}
  
      <div className="flex-1 flex items-start justify-center relative">
      {/* Feedback overlay that shows after images fade out */}
      {showResult && (
        <div className="absolute inset-0 flex items-center justify-center z-10 bg-black/5">
          <div className="text-center">
            {isCorrectAnswer ? (
              <div className="bg-[#EFE8DD] h-[60vh] px-4 items-center justify-center border border-[#D9D9D9] flex flex-col items-center gap-4 rounded-[12px]" >
              <img src="/module3tt.svg" alt="Good Job!" className="w-64 h-64 animate-fade-in" />
                {/* Orange arrow button positioned on the right */}
                <div className="absolute right-8 top-1/2 -translate-y-1/2">
                  <div 
                    onClick={handleNextQuestion}
                    className="bg-[#FF6B35] cursor-pointer  hover:bg-[#FF6B35]/90 text-white rounded-full w-16 h-16 flex items-center justify-center animate-fade-in shadow-sm"
                  >
                    <ChevronRight className="w-14 h-14" />
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-8">
                {/* Show the incorrect image that was clicked */}
                {selectedIncorrectImage && (
                  <div className="animate-fade-in">
                    <img 
                      src={selectedIncorrectImage} 
                      alt="Selected incorrect image" 
                      className="h-[70vh] w-auto object-contain rounded-lg border-2 border-red-300"
                    />
                  </div>
                )}

                {/* Show tooltip for wrong answers next to the image */}
                {selectedImageTooltip && (
                  <div className="animate-fade-in">
                    <Tooltip description={selectedImageTooltip} />
                  </div>
                )}
                <div className="relative">
                  <div className="absolute -inset-4 rounded-xl bg-black/5 pointer-events-none" />
                  <img src="/trynot.svg" alt="Try Again" className="w-64 h-64 animate-fade-in relative" />
                </div>
                
                {/* Orange arrow button positioned on the right for wrong answers */}
                <div className="absolute right-8 top-1/2 -translate-y-1/2">
                  <div 
                    onClick={handleNextQuestion}
                    className="bg-[#FF6B35]  cursor-pointer hover:bg-[#FF6B35]/90 text-white rounded-full w-16 h-16 flex items-center justify-center animate-fade-in shadow-sm"
                  >
                    <ChevronRight className="w-14 h-14" />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
      
      {currentQuestionIndex === 0 && allQuestions.question0 ? (
  <div
    className={cn(
      "flex items-center justify-center gap-24 transition-all duration-500",
      showResult && "opacity-0 pointer-events-none"
    )}
  >
    {/* Left Image */}
    <div className="relative flex justify-center max-w-[40%] overflow-visible">
      <img
        src={allQuestions.question0[0].src}
        alt="Left Post"
        className={cn(
          "h-[75vh] w-auto object-contain rounded-lg cursor-pointer transition-all duration-300",
          !showResult && "hover:scale-105 hover:shadow-lg"
        )}
        onClick={() =>
          handlePostClick(
            `question0-post1`,
            allQuestions.question0[0].correct,
            allQuestions.question0[0].tooltip,
            allQuestions.question0[0].src
          )
        }
      />
    </div>

    {/* VS label */}
    <div className="flex items-center justify-center">
      <span className="font-semibold text-[24px] leading-[100%] tracking-[0] text-center">
        VS
      </span>
    </div>

    {/* Right Image */}
    <div className="relative flex justify-center max-w-[40%] overflow-visible">
      <img
        src={allQuestions.question0[1].src}
        alt="Right Post"
        className={cn(
          "h-[75vh] w-auto object-contain rounded-lg cursor-pointer transition-all duration-300",
          !showResult && "hover:scale-105 hover:shadow-lg"
        )}
        onClick={() =>
          handlePostClick(
            `question0-post2`,
            allQuestions.question0[1].correct,
            allQuestions.question0[1].tooltip,
            allQuestions.question0[1].src
          )
        }
      />
    </div>
  </div>
): currentQuestionIndex === 1 ? (
  <div
    className={cn(
      "flex items-center justify-center gap-24 transition-all duration-500 overflow-hidden",
      showResult && "opacity-0 pointer-events-none",
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
            "h-[75vh] w-auto object-contain rounded-lg cursor-pointer transition-all duration-300",
            !showResult && "hover:scale-105 hover:shadow-lg",
          )}
          onClick={() => handlePostClick(`post1-${i}`, post.correct, post.tooltip, post.src)}
        />
      </div>
    ))}
  </div>
) : currentQuestionIndex === 2 ? (
  <div
    className={cn(
      "flex items-center justify-center gap-24 transition-all duration-500 overflow-hidden",
      showResult && "opacity-0 pointer-events-none",
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
            "h-[75vh] w-auto object-contain rounded-lg cursor-pointer transition-all duration-300",
            !showResult && "hover:scale-105 hover:shadow-lg",
          )}
          onClick={() => handlePostClick(`post2-${i}`, post.correct, post.tooltip, post.src)}
        />
      </div>
    ))}
  </div>
) : currentQuestionIndex === 3 ? (
   <div className={cn("transition-all duration-500", showResult && "opacity-0 pointer-events-none")}>
     <Question3Carousel
      showResult={showResult}
      selectedCarouselIndex={selectedCarouselIndex}
      handleCarouselClick={handleCarouselClick}
      carouselImages={allQuestions?.question3} // dynamically passed array
    />
   </div>
) : null}
 {currentQuestionIndex === 4 && allQuestions.question0 ? (
  <div
    className={cn(
      "flex items-center justify-center gap-24 transition-all duration-500",
      showResult && "opacity-0 pointer-events-none"
    )}
  >
    {/* Left Image */}
    <div className="relative flex justify-center max-w-[40%] overflow-visible">
      <img
        src={allQuestions1.question0[0].src}
        alt="Left Post"
        className={cn(
          "h-[75vh] w-auto object-contain rounded-lg cursor-pointer transition-all duration-300",
          !showResult && "hover:scale-105 hover:shadow-lg"
        )}
        onClick={() =>
          handlePostClick(
            `question0-post1`,
            allQuestions1.question0[0].correct,
            allQuestions1.question0[0].tooltip,
            allQuestions1.question0[0].src
          )
        }
      />
    </div>

    {/* VS label */}
    <div className="flex items-center justify-center">
      <span className="font-semibold text-[24px] leading-[100%] tracking-[0] text-center">
        VS
      </span>
    </div>

    {/* Right Image */}
    <div className="relative flex justify-center max-w-[40%] overflow-visible">
      <img
        src={allQuestions1.question0[1].src}
        alt="Right Post"
        className={cn(
          "h-[75vh] w-auto object-contain rounded-lg cursor-pointer transition-all duration-300",
          !showResult && "hover:scale-105 hover:shadow-lg"
        )}
        onClick={() =>
          handlePostClick(
            `question0-post2`,
            allQuestions1.question0[1].correct,
            allQuestions1.question0[1].tooltip,
            allQuestions1.question0[1].src
          )
        }
      />
    </div>
  </div>
): currentQuestionIndex === 5 ? (
  <div
    className={cn(
      "flex items-center justify-center gap-24 transition-all duration-500 overflow-hidden",
      showResult && "opacity-0 pointer-events-none",
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
            "h-[75vh] w-auto object-contain rounded-lg cursor-pointer transition-all duration-300",
            !showResult && "hover:scale-105 hover:shadow-lg",
          )}
          onClick={() => handlePostClick(`post1-${i}`, post.correct, post.tooltip, post.src)}
        />
      </div>
    ))}
  </div>
) : currentQuestionIndex === 6 ? (
  <div
    className={cn(
      "flex items-center justify-center gap-24 transition-all duration-500 overflow-hidden",
      showResult && "opacity-0 pointer-events-none",
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
            "h-[75vh] w-auto object-contain rounded-lg cursor-pointer transition-all duration-300",
            !showResult && "hover:scale-105 hover:shadow-lg",
          )}
          onClick={() => handlePostClick(`post2-${i}`, post.correct, post.tooltip, post.src)}
        />
      </div>
    ))}
  </div>
) : currentQuestionIndex === 7 ? (
   <div className={cn("transition-all duration-500", showResult && "opacity-0 pointer-events-none")}>
     <Question3Carousel
      showResult={showResult}
      selectedCarouselIndex={selectedCarouselIndex}
      handleCarouselClick={handleCarouselClick}
      carouselImages={allQuestions1?.question3} // dynamically passed array
    />
   </div>
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

    <div className="flex justify-center  items-center bg-[#f9f9f9] ">
      <div
        className={cn(
          "bg-white rounded-xl shadow-sm border p-2  w-[40vw] overflow-hidden transition-all duration-500",
          showResult && "animate-fade-out"
        )}
      >
        {/* Header */}
        <div className="flex   w-full items-center gap-3 ">
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
        <p className="text-sm text-gray-800  py-3 leading-relaxed">
          {carouselImages[0].caption}
        </p>

        {/* Carousel */}
        <div className="relative">
          <Carousel className="w-full">
            <CarouselContent>
              {orderedImages.map((src, i) => (
                
                src && (
                  <CarouselItem key={i}>
                    <div className="relative flex items-center justify-center h-full">
                      <img
                        src={src.src}
                        alt={`Carousel image ${i + 1}`}
                        className={cn(
                          "object-cover w-full h-full cursor-pointer transition-all duration-300",
                          !showResult && !src.intro && "hover:scale-[1.02]",
                          src.intro && "cursor-default"
                        )}
                        
                        onClick={() => {
                          if (!src.intro) handleCarouselClick(i, src.correct, src.tooltip, src.src);
                        }}                      />

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















