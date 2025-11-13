import { useQuery } from "@tanstack/react-query";
import { useSearchParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

import { cn } from "@/lib/utils";
import { Bookmark, Check, Heart, X } from "lucide-react";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { CircularProgress } from "@/components/CircularProgress";
import { useState,useEffect } from "react";



const FakeFact = ()=> {

    const {
        data: { publicUrl: question0Image1Url },
      } = supabase.storage.from("Thesis").getPublicUrl("Modules/IG Post_1c.png");
    
      const {
        data: { publicUrl: question0Image2Url },
      } = supabase.storage.from("Thesis").getPublicUrl("Modules/IG_1d.png");
    
      // Get Supabase storage URLs for Question 1 (3 posts)
      const {
        data: { publicUrl: post1ImageUrl },
      } = supabase.storage.from("Thesis").getPublicUrl("Modules/IG_4f.png");
    
      const {
        data: { publicUrl: post2ImageUrl },
      } = supabase.storage.from("Thesis").getPublicUrl("Modules/IG_4a.png");
    
      const {
        data: { publicUrl: post3ImageUrl },
      } = supabase.storage.from("Thesis").getPublicUrl("Modules/IG_4e.png");
    
      // Get Supabase storage URLs for carousel images (second question)
      const {
        data: { publicUrl: carousel1ImageUrl },
      } = supabase.storage.from("Thesis").getPublicUrl("Modules/IG_8f.png");
    
      const {
        data: { publicUrl: carousel2ImageUrl },
      } = supabase.storage.from("Thesis").getPublicUrl("Modules/IG_8i.png");
    
      const {
        data: { publicUrl: carousel3ImageUrl },
      } = supabase.storage.from("Thesis").getPublicUrl("Modules/IG_8g.png");
    
      const {
        data: { publicUrl: carousel4ImageUrl },
      } = supabase.storage.from("Thesis").getPublicUrl("Modules/IG_8h.png");
    
      // Get Supabase storage URLs for third question (VS VS layout)
      const {
        data: { publicUrl: post4ImageUrl },
      } = supabase.storage.from("Thesis").getPublicUrl("Modules/TT_6a2.png");
    
      const {
        data: { publicUrl: post5ImageUrl },
      } = supabase.storage.from("Thesis").getPublicUrl("Modules/TT_6a.png");
    
      const {
        data: { publicUrl: post6ImageUrl },
      } = supabase.storage.from("Thesis").getPublicUrl("Modules/TT_6a3.png");
    
      // Get Supabase storage URLs for fourth question (final 3-image comparison)
      const {
        data: { publicUrl: post7ImageUrl },
      } = supabase.storage.from("Thesis").getPublicUrl("Modules/TT_6a2.png");
    
      const {
        data: { publicUrl: post8ImageUrl },
      } = supabase.storage.from("Thesis").getPublicUrl("Modules/TT_6a.png");
    
      const {
        data: { publicUrl: post9ImageUrl },
      } = supabase.storage.from("Thesis").getPublicUrl("Modules/TT_6a3.png");
    
    
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
    
      const { data: questions, isLoading } = useQuery({
        queryKey: ["quiz-questions", moduleId],
        queryFn: async () => {
          if (!moduleId) return [];
          const { data, error } = await supabase
            .from("quiz_questions")
            .select("*")
            .eq("module_id", moduleId)
            .order("question_number");
    
          if (error) throw error;
          return data;
        },
        enabled: !!moduleId && !isM4Module,
      });
    
      const { data: biasQuestions, isLoading: biasQuestionsLoading } = useQuery({
        queryKey: ["bias-quiz-questions", moduleId],
        queryFn: async () => {
          if (!moduleId) return [];
          const { data, error } = await supabase
            .from("bias_quiz_questions")
            .select("*")
            .eq("module_id", moduleId)
            .order("question_number");
    
          if (error) throw error;
          return data;
        },
        enabled: !!moduleId && isM4Module,
      });
    
      const currentQuestion = questions?.[currentQuestionIndex];
      const totalQuestions = 4; // Hardcoded to 4 questions for this module
      const questionsLeft = `${currentQuestionIndex + 1}/${totalQuestions} Left`;
    
      const [emblaRef, emblaApi] = useEmblaCarousel({ loop: false });
      const [selectedCarouselIndex, setSelectedCarouselIndex] = useState<number | null>(null);
    
      const scrollPrev = () => emblaApi?.scrollPrev();
      const scrollNext = () => emblaApi?.scrollNext();
    
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


console.log(currentQuestionIndex===3)

    
  return (
    <div className="p-6 ">
    <div className="bg-[#F8F1E7] px-24 h-[90vh] overflow-hidden flex flex-col">
      <ModuleHeader />
  
      {currentQuestionIndex < totalQuestions && (
        <h2 className="text-2xl text-center mb-6  font-medium">Click to identify which one is fake</h2>
      )}
  
      <div className="flex-1 flex items-start justify-center">
        {currentQuestionIndex === 0 ? (
  <div
    className={cn(
      "flex items-center justify-center gap-24 transition-all duration-500 ",
      showResult && "animate-fade-out",
    )}
  >
    {/* Left Image */}
    <div className="relative flex justify-center max-w-[40%] overflow-visible">
    <img
        src={question0Image1Url}
        alt="Post 1"
        className={cn(
          "h-[45vh] w-auto object-contain rounded-lg cursor-pointer transition-all duration-300",
          !showResult && "hover:scale-105 hover:shadow-lg",
        )}
        onClick={() => handlePostClick("question0-post1", false)}
      />

      {/* Example tooltip markers (appear when clicked) */}
      {showResult && selectedPost === "question0-post1" && (
        <>
          <TooltipMarker
            text="Spot the clue! ⚠️ That logo's off."
            color="#6B21A8"
            top="10%"
          />
          <TooltipMarker
            text="No real image or proof in the visual"
            color="#B91C1C"
            top="40%"
            
          />
          <TooltipMarker
            text="An exaggerated word"
            color="#1E3A8A"
            top="70%"
            
          />
        </>
      )}

      {showResult && selectedPost === "question0-post1" && (
        <div className="absolute inset-0 bg-black/60 rounded-lg flex items-center justify-center animate-fade-in">
          <div className="bg-[#B21B1D] rounded-full p-6 animate-scale-in">
            <X className="w-16 h-16 text-white" strokeWidth={3} />
          </div>
        </div>
      )}
    </div>

    {/* Center "VS" */}
    <div className="flex items-center justify-center">
      <span className="font-semibold text-[13px] leading-[100%] tracking-[0] text-center">
        VS
      </span>
    </div>

    {/* Right Image */}
    <div className="relative flex justify-center max-w-[40%] overflow-visible">
    <img
        src={question0Image2Url}
        alt="Post 2"
        className={cn(
          "h-[45vh] w-auto object-contain rounded-lg cursor-pointer transition-all duration-300",
          !showResult && "hover:scale-105 hover:shadow-lg",
        )}
        onClick={() => handlePostClick("question0-post2", true)}
      />

      {showResult && selectedPost === "question0-post2" && (
        <div className="absolute inset-0 bg-black/60 rounded-lg flex items-center justify-center animate-fade-in">
          <div className="bg-[#4EBD6F] rounded-full p-6 animate-scale-in">
            <Check className="w-16 h-16 text-white" strokeWidth={3} />
          </div>
        </div>
      )}
    </div>
  </div>
)

 : currentQuestionIndex === 1 ? (
    <div
      className={cn(
        "flex items-center justify-center gap-24 transition-all duration-500 overflow-hidden",
        showResult && "animate-fade-out",
      )}
    >
      {[
        { src: post1ImageUrl, id: "post1", correct: true },
        { src: post2ImageUrl, id: "post2", correct: false },
        { src: post3ImageUrl, id: "post3", correct: false },
      ].map((post, i) => (
        <div
          key={post.id}
          className="relative flex justify-center max-w-[30%]"
        >
          <img
            src={post.src}
            alt={`Post ${i + 1}`}
            className={cn(
              "h-[45vh] w-auto object-contain rounded-lg cursor-pointer transition-all duration-300",
              !showResult && "hover:scale-105 hover:shadow-lg",
            )}
            onClick={() => handlePostClick(post.id, post.correct)}
          />
          {showResult && selectedPost === post.id && (
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
  )  : currentQuestionIndex === 2 ? (
    <div
      className={cn(
        "flex items-center justify-center gap-24 transition-all duration-500 overflow-hidden",
        showResult && "animate-fade-out",
      )}
    >
      {[
        { src: post4ImageUrl, id: "post4", correct: false },
        { src: post5ImageUrl, id: "post5", correct: true },
        { src: post6ImageUrl, id: "post6", correct: false },
      ].map((post, i) => (
        <div
          key={post.id}
          className="relative flex justify-center max-w-[30%]"
        >
          <img
            src={post.src}
            alt={`Post ${i + 4}`}
            className={cn(
              "h-[45vh] w-auto object-contain rounded-lg cursor-pointer transition-all duration-300",
              !showResult && "hover:scale-105 hover:shadow-lg",
            )}
            onClick={() => handlePostClick(post.id, post.correct)}
          />
          {showResult && selectedPost === post.id && (
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
  ) 
   : currentQuestionIndex === 3 ? (
    // <div
    //   className={cn(
    //     "flex items-center justify-center transition-all duration-500 overflow-hidden",
    //     showResult && "animate-fade-out",
    //   )}
    // >
    //   <div className="max-w-5xl w-full h-[45vh] flex flex-col justify-center">
    //     <Slider
    //       dots={true}
    //       infinite={true}
    //       speed={500}
    //       slidesToShow={1}
    //       slidesToScroll={1}
    //       arrows={true}
    //       prevArrow={
    //         <button className="absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white rounded-full p-2 shadow">
    //           <ChevronLeft className="h-5 w-5" />
    //         </button>
    //       }
    //       nextArrow={
    //         <button className="absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white rounded-full p-2 shadow">
    //           <ChevronRight className="h-5 w-5" />
    //         </button>
    //       }
    //     >
    //       {[carousel1ImageUrl, carousel2ImageUrl, carousel3ImageUrl, carousel4ImageUrl].map(
    //         (src, i) => (
    //           <div key={i} className="relative flex items-center justify-center">
    //             <img
    //               src={src}
    //               alt={`Carousel image ${i + 1}`}
    //               className={cn(
    //                 "h-[45vh] w-auto object-contain cursor-pointer rounded-lg transition-all duration-300 mx-auto",
    //                 !showResult && "hover:scale-105 hover:shadow-lg",
    //               )}
    //               onClick={() => handleCarouselClick(i, i === 1)}
    //             />
    //             {showResult && selectedCarouselIndex === i && (
    //               <div className="absolute inset-0 bg-black/60 flex items-center justify-center rounded-lg animate-fade-in">
    //                 <div
    //                   className={cn(
    //                     "rounded-full p-6 animate-scale-in",
    //                     i === 1 ? "bg-[#4EBD6F]" : "bg-[#B21B1D]",
    //                   )}
    //                 >
    //                   {i === 1 ? (
    //                     <Check className="w-16 h-16 text-white" strokeWidth={3} />
    //                   ) : (
    //                     <X className="w-16 h-16 text-white" strokeWidth={3} />
    //                   )}
    //                 </div>
    //               </div>
    //             )}
    //           </div>
    //         ),
    //       )}
    //     </Slider>
    //   </div>
    // </div>
    <>
    <Question3Carousel showResult={showResult}
  selectedCarouselIndex={selectedCarouselIndex}
  handleCarouselClick={handleCarouselClick}
  carousel1ImageUrl={carousel1ImageUrl}
  carousel2ImageUrl={carousel2ImageUrl}
  carousel3ImageUrl={carousel3ImageUrl}
  carousel4ImageUrl={carousel4ImageUrl}    />
    </>
  ) : null}
  
        {/* Completion screen */}
        {currentQuestionIndex >= totalQuestions && !isM4Module && (
          // <div className="h-screen flex items-center justify-center">
          //   <Card className="w-[80vw] h-[80vh] flex flex-col items-center justify-center bg-[#F8F1E7] shadow-lg rounded-3xl">
          //     <div className="flex items-center gap-6 mb-8">
          //       <img src="/m1end.png" alt="Module 3 Complete" className="w-24 h-24 object-contain" />
          //       <div>
          //         <h1 className="text-3xl font-bold">Module 3 : Complete</h1>
          //         <p className="text-sm text-muted-foreground">4/4 Likes · 2/2 Saves</p>
          //       </div>
          //     </div>
  
          //     <div className="text-center">
          //       <p className="text-lg mb-4">Your new score is</p>
          //       <CircularProgress percentage={95} size={220} strokeWidth={16} />
          //       <p className="mt-4 text-gray-700">
          //         Yikes, <span className="font-bold text-[hsl(var(--success))]">{95 + 3}% polarization</span>!  
          //         Lower the score, lower the polarization — and that’s how you win!
          //       </p>
          //     </div>
  
          //     <div className="mt-8">
          //       <Button size="lg" onClick={() => navigate(`/module/M4`)} className="px-14 text-lg shadow-md">
          //         Next Module →
          //       </Button>
          //     </div>
          //   </Card>
          // </div>
          <ClosingModal/>
        )}
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
                              src={"/characterm.svg"}
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

 function Question3Carousel({
  showResult,
  selectedCarouselIndex,
  handleCarouselClick,
  carousel1ImageUrl,
  carousel2ImageUrl,
  carousel3ImageUrl,
  carousel4ImageUrl,
}) {
  const images = [
    carousel1ImageUrl,
    carousel2ImageUrl,
    carousel3ImageUrl,
    carousel4ImageUrl,
  ]

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
              {images.map(
                (src, i) =>
                  src && (
                    <CarouselItem key={i}>
                      <div className="relative flex items-center justify-center">
                        <img
                          src={src}
                          alt={`Carousel image ${i + 1}`}
                          className={cn(
                            "object-cover w-full max-h-[400px] cursor-pointer transition-all duration-300",
                            !showResult && "hover:scale-[1.02]"
                          )}
                          onClick={() => handleCarouselClick(i, i === 1)}
                        />

                        {/* ✅ Overlay result check/cross */}
                        {showResult && selectedCarouselIndex === i && (
                          <div className="absolute inset-0 bg-black/60 flex items-center justify-center rounded-lg animate-fade-in">
                            <div
                              className={cn(
                                "rounded-full p-6 animate-scale-in",
                                i === 1 ? "bg-[#4EBD6F]" : "bg-[#B21B1D]"
                              )}
                            >
                              {i === 1 ? (
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
              )}
            </CarouselContent>

            <CarouselPrevious className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white shadow-md text-black rounded-full p-2 z-10" />
            <CarouselNext className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white shadow-md text-black rounded-full p-2 z-10" />
          </Carousel>

          {/* Bottom Overlay Caption */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
            <p className="text-white font-semibold text-center text-sm">
              The Simpsons Prediction on Queen Elizabeth II’s Death in 2022
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


