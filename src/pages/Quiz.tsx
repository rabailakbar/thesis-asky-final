import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import QuizHeader from "@/components/QuizHeader";
import SocialPost from "@/components/SocialPost";
import BiasQuiz from "@/components/BiasQuiz";
import ConnectDotsQuiz from "@/components/ConnectDotsQuiz";
import ModuleBadge from "@/components/ModuleBadge";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { Bookmark, Check, Heart, X } from "lucide-react";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { CircularProgress } from "@/components/CircularProgress";

const Quiz = () => {
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

  // Get Supabase storage URLs for the images (Question 0 - first question with 2 posts)
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

  if (isLoading || biasQuestionsLoading) {
    return (
      <div className="min-h-screen bg-background p-8">
        <Skeleton className="w-full h-24 mb-8" />
        <div className="w-full max-w-6xl mx-auto">
          <Skeleton className="w-64 h-8 mx-auto mb-8" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Skeleton className="w-full h-96" />
            <Skeleton className="w-full h-96" />
          </div>
        </div>
      </div>
    );
  }

  if (!module) {
    return (
      <div className="min-h-screen bg-background p-8 flex items-center justify-center">
        <div className="text-center text-muted-foreground">No module found</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F1E7]">
      {currentQuestionIndex < totalQuestions && !(isM4Module && biasQuizComplete) && (
   module.module_number!="M5" &&     <QuizHeader
          moduleNumber={module.module_number}
          title={module.title}
          subtitle={module.description}
          timeRemaining="05:00"
          score={98}
          questionsLeft={questionsLeft}
        />
      )}

      <div className="w-full bg-[#F8F1E7]">
        {isM5Module ? (
          <ConnectDotsQuiz moduleId={moduleId || ""} />
        ) :
         isM4Module ? (
          <>
            {!biasQuizComplete &&
              currentQuestionIndex < totalQuestions &&
              biasQuestions &&
              biasQuestions[currentQuestionIndex] && (
                <BiasQuiz
                  imageUrl={`https://wlneuhivxmpiasjmmryi.supabase.co/storage/v1/object/public/Thesis/${biasQuestions[currentQuestionIndex].image_filename}`}
                  headline={biasQuestions[currentQuestionIndex].headline}
                  questionNumber={currentQuestionIndex + 1}
                  onComplete={() => {
                    setCorrectAnswers(3);
                    setBiasQuizComplete(true);
                  }}
                />
              )}

            {biasQuizComplete && (
              <div className="min-h-screen bg-white flex items-center justify-center p-6">
                <Card className="max-w-4xl w-full p-10 md:p-16 bg-[#F8F1E7] backdrop-blur-sm shadow-lg rounded-[24px]">
                  {/* Header Section */}
                  {/* Header Section */}
                  <div className="flex items-start gap-6 mb-12 pb-6 border-b border-dashed border-border">
                    {/* Image */}
                    <div className="w-24 h-24 rounded-lg flex items-center justify-center flex-shrink-0 bg-[#F8F1E7] mt-1">
                      <img src="/m1end.png" alt="Module 2 Complete" className="w-20 h-20 object-contain rounded-lg" />
                    </div>

                    {/* Text */}
                    <div className="flex-1 flex flex-col justify-start">
                      <h1 className="text-3xl md:text-4xl font-bold mb-2 leading-none">Module 4 : Complete</h1>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                        1/1 Biased Headlines Spotted! Good Job
                      </div>
                    </div>
                  </div>

                  {/* Score Section */}
                  <div className="text-center mb-8">
                    <p className="text-lg text-gray-700 mb-8">Your new score is</p>
                    <div className="flex justify-center mb-8">
                      <CircularProgress percentage={95} size={220} strokeWidth={16} />
                    </div>
                    <div className="max-w-2xl mx-auto text-base text-gray-800 leading-relaxed">
                      <p>
                        Look at that — your score’s low and your thinking’s leveling out. That’s what real awareness
                        looks like. Stay curious, stay open, and keep the balance strong.
                      </p>
                    </div>
                  </div>

                  {/* Action Button */}
                  <div className="text-center mt-12">
                    <Button size="lg" onClick={() => navigate(`/M5`)} className="px-14 text-lg shadow-md">
                      Next Module →
                    </Button>
                  </div>
                </Card>
              </div>
            )}
          </>
        ) : (
          <>
            {currentQuestionIndex < totalQuestions && (
              <h2 className="text-2xl text-center mb-8 font-medium">Click to identify which one is fake</h2>
            )}

            {currentQuestionIndex === 0 ? (
              <div
                className={cn(
                  "flex items-center justify-center gap-6 transition-all duration-500",
                  showResult && "animate-fade-out",
                )}
              >
                <div className="relative">
                  <img
                    src={question0Image1Url}
                    alt="Post 1"
                    className={cn(
                      "w-[358px] h-[570px] object-cover rounded-lg cursor-pointer transition-all duration-300",
                      !showResult && "hover:scale-105 hover:shadow-lg",
                    )}
                    onClick={() => handlePostClick("question0-post1", false)}
                  />
                  {showResult && selectedPost === "question0-post1" && (
                    <div
                      className={cn(
                        "absolute inset-0 bg-black/60 rounded-lg flex items-center justify-center animate-fade-in",
                      )}
                    >
                      <div className="bg-[#B21B1D] rounded-full p-6 animate-scale-in">
                        <X className="w-16 h-16 text-white" strokeWidth={3} />
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-center">
                  <span className="text-3xl font-bold text-muted-foreground">VS</span>
                </div>

                <div className="relative">
                  <img
                    src={question0Image2Url}
                    alt="Post 2"
                    className={cn(
                      "w-[358px] h-[570px] object-cover rounded-lg cursor-pointer transition-all duration-300",
                      !showResult && "hover:scale-105 hover:shadow-lg",
                    )}
                    onClick={() => handlePostClick("question0-post2", true)}
                  />
                  {showResult && selectedPost === "question0-post2" && (
                    <div
                      className={cn(
                        "absolute inset-0 bg-black/60 rounded-lg flex items-center justify-center animate-fade-in",
                      )}
                    >
                      <div className="bg-[#4EBD6F] rounded-full p-6 animate-scale-in">
                        <Check className="w-16 h-16 text-white" strokeWidth={3} />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : currentQuestionIndex === 1 ? (
              <div
                className={cn(
                  "flex items-center justify-center gap-6 transition-all duration-500",
                  showResult && "animate-fade-out",
                )}
              >
                <div className="relative">
                  <img
                    src={post1ImageUrl}
                    alt="Post 1"
                    className={cn(
                      "w-[358px] h-[570px] object-cover rounded-lg cursor-pointer transition-all duration-300",
                      !showResult && "hover:scale-105 hover:shadow-lg",
                    )}
                    onClick={() => handlePostClick("post1", true)}
                  />
                  {showResult && selectedPost === "post1" && (
                    <div
                      className={cn(
                        "absolute inset-0 bg-black/60 rounded-lg flex items-center justify-center animate-fade-in",
                      )}
                    >
                      <div className="bg-[#4EBD6F] rounded-full p-6 animate-scale-in">
                        <Check className="w-16 h-16 text-white" strokeWidth={3} />
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-center">
                  <span className="text-3xl font-bold text-muted-foreground">VS</span>
                </div>

                <div className="relative">
                  <img
                    src={post2ImageUrl}
                    alt="Post 2"
                    className={cn(
                      "w-[358px] h-[570px] object-cover rounded-lg cursor-pointer transition-all duration-300",
                      !showResult && "hover:scale-105 hover:shadow-lg",
                    )}
                    onClick={() => handlePostClick("post2", false)}
                  />
                  {showResult && selectedPost === "post2" && (
                    <div
                      className={cn(
                        "absolute inset-0 bg-black/60 rounded-lg flex items-center justify-center animate-fade-in",
                      )}
                    >
                      <div className="bg-[#B21B1D] rounded-full p-6 animate-scale-in">
                        <X className="w-16 h-16 text-white" strokeWidth={3} />
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-center">
                  <span className="text-3xl font-bold text-muted-foreground">VS</span>
                </div>

                <div className="relative">
                  <img
                    src={post3ImageUrl}
                    alt="Post 3"
                    className={cn(
                      "w-[358px] h-[570px] object-cover rounded-lg cursor-pointer transition-all duration-300",
                      !showResult && "hover:scale-105 hover:shadow-lg",
                    )}
                    onClick={() => handlePostClick("post3", false)}
                  />
                  {showResult && selectedPost === "post3" && (
                    <div
                      className={cn(
                        "absolute inset-0 bg-black/60 rounded-lg flex items-center justify-center animate-fade-in",
                      )}
                    >
                      <div className="bg-[#B21B1D] rounded-full p-6 animate-scale-in">
                        <X className="w-16 h-16 text-white" strokeWidth={3} />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : currentQuestionIndex === 2 ? (
              <div
                className={cn(
                  "flex items-center justify-center gap-6 transition-all duration-500",
                  showResult && "animate-fade-out",
                )}
              >
                <div className="relative">
                  <img
                    src={post4ImageUrl}
                    alt="Post 4"
                    className={cn(
                      "w-[358px] h-[570px] object-cover rounded-lg cursor-pointer transition-all duration-300",
                      !showResult && "hover:scale-105 hover:shadow-lg",
                    )}
                    onClick={() => handlePostClick("post4", false)}
                  />
                  {showResult && selectedPost === "post4" && (
                    <div
                      className={cn(
                        "absolute inset-0 bg-black/60 rounded-lg flex items-center justify-center animate-fade-in",
                      )}
                    >
                      <div className="bg-[#B21B1D] rounded-full p-6 animate-scale-in">
                        <X className="w-16 h-16 text-white" strokeWidth={3} />
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-center">
                  <span className="text-3xl font-bold text-muted-foreground">VS</span>
                </div>

                <div className="relative">
                  <img
                    src={post5ImageUrl}
                    alt="Post 5"
                    className={cn(
                      "w-[358px] h-[570px] object-cover rounded-lg cursor-pointer transition-all duration-300",
                      !showResult && "hover:scale-105 hover:shadow-lg",
                    )}
                    onClick={() => handlePostClick("post5", true)}
                  />
                  {showResult && selectedPost === "post5" && (
                    <div
                      className={cn(
                        "absolute inset-0 bg-black/60 rounded-lg flex items-center justify-center animate-fade-in",
                      )}
                    >
                      <div className="bg-[#4EBD6F] rounded-full p-6 animate-scale-in">
                        <Check className="w-16 h-16 text-white" strokeWidth={3} />
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-center">
                  <span className="text-3xl font-bold text-muted-foreground">VS</span>
                </div>

                <div className="relative">
                  <img
                    src={post6ImageUrl}
                    alt="Post 6"
                    className={cn(
                      "w-[358px] h-[570px] object-cover rounded-lg cursor-pointer transition-all duration-300",
                      !showResult && "hover:scale-105 hover:shadow-lg",
                    )}
                    onClick={() => handlePostClick("post6", false)}
                  />
                  {showResult && selectedPost === "post6" && (
                    <div
                      className={cn(
                        "absolute inset-0 bg-black/60 rounded-lg flex items-center justify-center animate-fade-in",
                      )}
                    >
                      <div className="bg-[#B21B1D] rounded-full p-6 animate-scale-in">
                        <X className="w-16 h-16 text-white" strokeWidth={3} />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : currentQuestionIndex === 3 ? (
              <div className={cn("max-w-4xl mx-auto transition-all duration-500", showResult && "animate-fade-out")}>
                {/* LinkedIn-style post header */}
                <div className="bg-card rounded-lg shadow-lg p-6 mb-4">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                      <span className="text-lg font-semibold">BI</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">Business Insider</h3>
                      <p className="text-sm text-muted-foreground">14 September 2025</p>
                    </div>
                  </div>

                  <p className="text-sm mb-4">
                    People say it's just coincidence, but how do you "accidentally" predict major events? Feels less
                    like comedy and more like disclosure
                  </p>

                  {/* Carousel */}
                  <div className="relative">
                    <div className="overflow-hidden rounded-lg" ref={emblaRef}>
                      <div className="flex">
                        <div className="flex-[0_0_100%] min-w-0 relative">
                          <img
                            src={carousel1ImageUrl}
                            alt="Carousel image 1"
                            className={cn(
                              "w-full h-[400px] object-cover cursor-pointer transition-all duration-300",
                              !showResult && "hover:scale-110",
                            )}
                            onClick={() => handleCarouselClick(0, false)}
                          />

                          {selectedCarouselIndex === 0 && showResult && (
                            <div className="absolute inset-0 bg-black/60 flex items-center justify-center animate-fade-in">
                              <div className="bg-[#B21B1D] rounded-full p-6 animate-scale-in">
                                <X className="w-16 h-16 text-white" strokeWidth={3} />
                              </div>
                            </div>
                          )}
                        </div>
                        <div className="flex-[0_0_100%] min-w-0 relative">
                          <img
                            src={carousel2ImageUrl}
                            alt="Carousel image 2"
                            className={cn(
                              "w-full h-[400px] object-cover cursor-pointer transition-all duration-300",
                              !showResult && "hover:scale-110",
                            )}
                            onClick={() => handleCarouselClick(1, true)}
                          />
                          {selectedCarouselIndex === 1 && showResult && (
                            <div className="absolute inset-0 bg-black/60 flex items-center justify-center animate-fade-in">
                              <div className="bg-[#4EBD6F] rounded-full p-6 animate-scale-in">
                                <Check className="w-16 h-16 text-white" strokeWidth={3} />
                              </div>
                            </div>
                          )}
                        </div>
                        <div className="flex-[0_0_100%] min-w-0 relative">
                          <img
                            src={carousel3ImageUrl}
                            alt="Carousel image 3"
                            className={cn(
                              "w-full h-[400px] object-cover cursor-pointer transition-all duration-300",
                              !showResult && "hover:scale-110",
                            )}
                            onClick={() => handleCarouselClick(2, false)}
                          />
                          {selectedCarouselIndex === 2 && showResult && (
                            <div className="absolute inset-0 bg-black/60 flex items-center justify-center animate-fade-in">
                              <div className="bg-[#B21B1D] rounded-full p-6 animate-scale-in">
                                <X className="w-16 h-16 text-white" strokeWidth={3} />
                              </div>
                            </div>
                          )}
                        </div>
                        <div className="flex-[0_0_100%] min-w-0 relative">
                          <img
                            src={carousel4ImageUrl}
                            alt="Carousel image 4"
                            className={cn(
                              "w-full h-[400px] object-cover cursor-pointer transition-all duration-300",
                              !showResult && "hover:scale-110",
                            )}
                            onClick={() => handleCarouselClick(3, false)}
                          />
                          {selectedCarouselIndex === 3 && showResult && (
                            <div className="absolute inset-0 bg-black/60 flex items-center justify-center animate-fade-in">
                              <div className="bg-[#B21B1D] rounded-full p-6 animate-scale-in">
                                <X className="w-16 h-16 text-white" strokeWidth={3} />
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Carousel navigation buttons */}
                    <Button
                      variant="outline"
                      size="icon"
                      className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white"
                      onClick={scrollPrev}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white"
                      onClick={scrollNext}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>

                  {/* Engagement metrics */}
                  <div className="flex items-center gap-6 mt-4 text-sm text-muted-foreground">
                    <span>❤️ 13.4K</span>
                    <span>💬 47</span>
                    <span>🔄 492</span>
                  </div>
                </div>
              </div>
            ) : currentQuestionIndex === 3 ? (
              <div
                className={cn(
                  "flex items-center justify-center gap-6 transition-all duration-500",
                  showResult && "animate-fade-out",
                )}
              >
                <div className="relative">
                  <img
                    src={post7ImageUrl}
                    alt="Post 7"
                    className={cn(
                      "w-[315px] h-[566px] object-cover rounded-lg cursor-pointer transition-all duration-300",
                      !showResult && "hover:scale-105 hover:shadow-lg",
                    )}
                    onClick={() => handlePostClick("post7", false)}
                  />
                  {showResult && selectedPost === "post7" && (
                    <div
                      className={cn(
                        "absolute inset-0 bg-black/60 rounded-lg flex items-center justify-center animate-fade-in",
                      )}
                    >
                      <div className="bg-[#B21B1D] rounded-full p-6 animate-scale-in">
                        <X className="w-16 h-16 text-white" strokeWidth={3} />
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-center">
                  <span className="text-3xl font-bold text-muted-foreground">VS</span>
                </div>

                <div className="relative">
                  <img
                    src={post8ImageUrl}
                    alt="Post 8"
                    className={cn(
                      "w-[315px] h-[566px] object-cover rounded-lg cursor-pointer transition-all duration-300",
                      !showResult && "hover:scale-105 hover:shadow-lg",
                    )}
                    onClick={() => handlePostClick("post8", true)}
                  />
                  {showResult && selectedPost === "post8" && (
                    <div
                      className={cn(
                        "absolute inset-0 bg-black/60 rounded-lg flex items-center justify-center animate-fade-in",
                      )}
                    >
                      <div className="bg-[#4EBD6F] rounded-full p-6 animate-scale-in">
                        <Check className="w-16 h-16 text-white" strokeWidth={3} />
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-center">
                  <span className="text-3xl font-bold text-muted-foreground">VS</span>
                </div>

                <div className="relative">
                  <img
                    src={post9ImageUrl}
                    alt="Post 9"
                    className={cn(
                      "w-[315px] h-[566px] object-cover rounded-lg cursor-pointer transition-all duration-300",
                      !showResult && "hover:scale-105 hover:shadow-lg",
                    )}
                    onClick={() => handlePostClick("post9", false)}
                  />
                  {showResult && selectedPost === "post9" && (
                    <div
                      className={cn(
                        "absolute inset-0 bg-black/60 rounded-lg flex items-center justify-center animate-fade-in",
                      )}
                    >
                      <div className="bg-[#B21B1D] rounded-full p-6 animate-scale-in">
                        <X className="w-16 h-16 text-white" strokeWidth={3} />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : null}

            {currentQuestionIndex >= totalQuestions && !isM4Module ? (
              <div className="min-h-screen bg-white flex items-center justify-center p-6">
                <Card className="max-w-4xl w-full p-10 md:p-16 bg-[#F8F1E7] backdrop-blur-sm shadow-lg rounded-3xl">
                  {/* Header Section */}
                  {/* Header Section */}
                  <div className="flex items-start gap-6 mb-12 pb-6 border-b border-dashed border-border">
                    {/* Image */}
                    <div className="w-24 h-24 rounded-lg flex items-center justify-center flex-shrink-0 bg-[#F8F1E7] mt-1">
                      <img src="/m1end.png" alt="Module 2 Complete" className="w-20 h-20 object-contain rounded-lg" />
                    </div>

                    {/* Text */}
                    <div className="flex-1 flex flex-col justify-start">
                      <h1 className="text-3xl md:text-4xl font-bold mb-2 leading-none">Module 3 : Complete</h1>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                        <div className="flex items-center gap-1">
                          <Heart className="w-4 h-4 fill-current text-pink-500" />
                          <span>4/4 Likes</span>
                        </div>
                        <span>|</span>
                        <div className="flex items-center gap-1">
                          <Bookmark className="w-4 h-4 fill-current text-blue-500" />
                          <span>2/2 Saves</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Score Section */}
                  <div className="text-center mb-8">
                    <p className="text-lg text-gray-700 mb-8">Your new score is</p>
                    <div className="flex justify-center mb-8">
                      <CircularProgress percentage={95} size={220} strokeWidth={16} />
                    </div>
                    <div className="max-w-2xl mx-auto text-base text-gray-800 leading-relaxed">
                      <p>
                        Yikes, <span className="font-bold text-[hsl(var(--success))]">{95 + 3}% polarization</span>! But
                        that's what we're here for — to unpack it, learn, and bring the number down together.{" "}
                        <span className="italic text-[hsl(var(--success-secondary))]">
                          Lower the score, lower the polarization
                        </span>
                        .... and that's how you win!
                      </p>
                    </div>
                  </div>

                  {/* Action Button */}
                  <div className="text-center mt-12">
                    <Button size="lg" onClick={() => navigate(`/module/M4`)} className="px-14 text-lg shadow-md">
                      Next Module →
                    </Button>
                  </div>
                </Card>
              </div>
            ) : null}
          </>
        )}
      </div>
    </div>
  );
};

export default Quiz;
