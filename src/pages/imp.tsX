"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Clock, Heart, Bookmark } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Masonry from "react-masonry-css";
import OpeningModal from "@/components/OpeningModal";
import ModuleHeader from "@/components/ModuleHeader";

interface Post {
  id: number;
  title: string;
  imageUrl: string;
  width: number;
  height: number;
  codeNumber: number | null;
  codeLetter: string;
}

// Helper — Extracts group number and letter like “8b”, “1a”
const extractCodeFromFilename = (filename: string) => {
  const cleanName = filename.toLowerCase().replace(/[_\s-]+/g, "");
  const match = cleanName.match(/(\d+)([a-z])(?=\.[a-z]+$|$)/);
  if (!match) return { number: null, letter: "" };
  return { number: parseInt(match[1], 10), letter: match[2] };
};

const MAX_VISIBLE = 11;
const MAX_LIKES = 4;
const MAX_SAVES = 2;
const TRANSITION_MS = 350;

const Exercise = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const moduleId = searchParams.get("id") || "M1";
  const [showIntroModal, setShowIntroModal] = useState(true);

  const [allPosts, setAllPosts] = useState<Post[]>([]);
  const [visiblePosts, setVisiblePosts] = useState<Post[]>([]);
  const [likedIds, setLikedIds] = useState<Set<number>>(new Set());
  const [savedIds, setSavedIds] = useState<Set<number>>(new Set());
  const [isComplete, setIsComplete] = useState(false);
  const [replacingIds, setReplacingIds] = useState<Set<number>>(new Set());

  // Fetch and process images
  useEffect(() => {
    const fetchImages = async () => {
      const { data, error } = await supabase.storage.from("Thesis").list("Modules", {
        limit: 100,
      });
      if (error) {
        console.error(error);
        return;
      }

      const postsData: Post[] = await Promise.all(
        data.map(async (file, index) => {
          if (file.name === "Group59.png") return null;

          const { data: urlData } = supabase.storage.from("Thesis").getPublicUrl(`Modules/${file.name}`);

          const { number, letter } = extractCodeFromFilename(file.name);

          const dim = await new Promise<{ w: number; h: number }>((resolve) => {
            const img = new Image();
            img.src = urlData.publicUrl;
            img.onload = () => resolve({ w: img.width, h: img.height });
            img.onerror = () => resolve({ w: 300, h: 300 });
          });

          return {
            id: index + 1,
            title: file.name,
            imageUrl: urlData.publicUrl,
            width: dim.w,
            height: dim.h,
            codeNumber: number,
            codeLetter: letter,
          } as Post;
        }),
      );

      const filtered = postsData.filter(Boolean) as Post[];
      const shuffled = filtered.sort(() => Math.random() - 0.5);
      setAllPosts(shuffled);
      setVisiblePosts(shuffled.slice(0, MAX_VISIBLE));
    };

    fetchImages();
  }, []);

  const pickRandom = (arr: Post[]) => arr[Math.floor(Math.random() * arr.length)];

  // Smart replacement logic (same number first)
  const findReplacementFor = (current: Post) => {
    if (!current) return null;

    const sameGroup = allPosts.filter(
      (p) =>
        p.codeNumber === current.codeNumber &&
        p.id !== current.id &&
        !visiblePosts.some((v) => v.id === p.id) &&
        !likedIds.has(p.id) &&
        !savedIds.has(p.id),
    );

    if (sameGroup.length > 0) return pickRandom(sameGroup);

    const unseenOverall = allPosts.filter(
      (p) =>
        p.id !== current.id && !visiblePosts.some((v) => v.id === p.id) && !likedIds.has(p.id) && !savedIds.has(p.id),
    );

    if (unseenOverall.length > 0) return pickRandom(unseenOverall);

    return null;
  };

  const handlePostAction = (id: number, action: "like" | "save") => {
    const current = visiblePosts.find((p) => p.id === id);
    if (!current) return;

    const isLike = action === "like";
    const isSet = isLike ? likedIds.has(id) : savedIds.has(id);
    const setState = isLike ? setLikedIds : setSavedIds;
    const currentSet = isLike ? likedIds : savedIds;
    const limit = isLike ? MAX_LIKES : MAX_SAVES;

    if (isSet) {
      setState((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
      return;
    }

    if (currentSet.size >= limit) return;

    setState((prev) => {
      const next = new Set(prev);
      next.add(id);
      return next;
    });

    const replacement = findReplacementFor(current);
    if (replacement) {
      setReplacingIds((prev) => new Set(prev).add(id));

      setTimeout(() => {
        setVisiblePosts((prev) => prev.map((p) => (p.id === id ? replacement : p)));

        setTimeout(() => {
          setReplacingIds((prev) => {
            const next = new Set(prev);
            next.delete(id);
            return next;
          });
        }, TRANSITION_MS);
      }, TRANSITION_MS);
    }
  };

  const likesCount = likedIds.size;
  const savesCount = savedIds.size;
  const polarizationScore = Math.round((likesCount / MAX_LIKES) * 100);

  useEffect(() => {
    if (likesCount >= MAX_LIKES && savesCount >= MAX_SAVES) {
      setTimeout(() => setIsComplete(true), 500);
    }
  }, [likesCount, savesCount]);

  if (isComplete) {
    return (
      <div className="min-h-screen bg-[#F8F1E7] flex items-center justify-center p-6">
        <Card className="max-w-4xl w-full p-10 md:p-16 bg-[#FFFFFF] backdrop-blur-sm ">
          {/* Header Section */}
          {/* Header Section */}
          <div className="flex items-start gap-6 mb-12 pb-6 ">
            {/* Image */}
            <div className="w-24 h-24 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
              <img src="/m1end.png" alt="Module 2 Complete" className="w-20 h-20 object-contain rounded-lg" />
            </div>

            {/* Text */}
            <div className="flex-1 flex flex-col justify-start">
              <h1 className="text-3xl md:text-4xl font-bold mb-2 leading-none">Module 2 : Complete</h1>
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
                Yikes, <span className="font-bold text-[hsl(var(--success))]">{95}% polarization</span>! But that's what
                we're here for — to unpack it, learn, and bring the number down together.{" "}
                <span className="italic text-[hsl(var(--success-secondary))]">
                  Lower the score, lower the polarization
                </span>
                .... and that's how you win!
              </p>
            </div>
          </div>

          {/* Action Button */}
          <div className="text-center mt-12">
            <Button size="lg" onClick={() => navigate(`/M3`)} className="px-14 bg-[#8B5CF6] text-lg shadow-md">
              Next Module →
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
<div className="min-h-screen bg-[#F8F1E7] flex items-center justify-center py-4 px-4 rounded-[24px] shadow-sm">
<OpeningModal showIntroModal={showIntroModal} moduleId={"M2"} setShowIntroModal={setShowIntroModal} />
      
      <div className="  max-w-7xl w-full px-10">
        {/* Header */}
        <ModuleHeader src={"/m1.2.svg"}/>
        
        {/* Stats */}
        <div className="flex justify-end gap-2 mb-8 text-gray-700">
          <span>
            {likesCount}/{MAX_LIKES} Likes
          </span>
          <span>|</span>
          <span>
            {savesCount}/{MAX_SAVES} Saves Left only
          </span>
        </div>

        <h2 className="text-center text-lg font-medium text-gray-700 mb-8">Click to like and save!</h2>

        {/* Masonry Grid */}
        <Masonry breakpointCols={{ default: 5, 1100: 4, 700: 3, 500: 2 }} className="flex gap-4">
          {visiblePosts.map((post) => {
            const isReplacing = replacingIds.has(post.id);
            return (
              <div
                key={post.id}
                className={`relative break-inside-avoid group overflow-hidden rounded-xl border border-gray-200 transition-all duration-500 ${
                  isReplacing ? "opacity-0 scale-95" : "opacity-100 scale-100"
                }`}
              >
<img src={post.imageUrl} alt={post.title} className="w-full rounded-xl object-cover transition-all duration-500" />



                {/* Code Label (for debugging) */}
                {/* <div className="absolute top-2 left-2 bg-white/70 text-xs font-medium text-gray-700 px-2 py-0.5 rounded">
                  {post.codeNumber}
                  {post.codeLetter}
                </div> */}

                {/* Hover actions */}
                <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-3 opacity-0 group-hover:opacity-100 transition-all duration-300 ease-in-out">
                  <button
                    onClick={() => handlePostAction(post.id, "like")}
                    className="flex items-center justify-center bg-white/80 backdrop-blur-sm border border-gray-300 rounded-full px-6 py-1 hover:scale-105 transition-all"
                    title={likedIds.has(post.id) ? "Unlike" : "Like"}
                  >
                    <Heart
                      className={`w-5 h-5 ${likedIds.has(post.id) ? "fill-red-500 text-red-500" : "text-gray-700"}`}
                    />
                  </button>

                  <button
                    onClick={() => handlePostAction(post.id, "save")}
                    className="flex items-center justify-center bg-white/80 backdrop-blur-sm border border-gray-300 rounded-full px-6 py-1 hover:scale-105 transition-all"
                    title={savedIds.has(post.id) ? "Unsave" : "Save"}
                  >
                    <Bookmark
                      className={`w-5 h-5 ${
                        savedIds.has(post.id) ? "fill-purple-600 text-purple-600" : "text-gray-700"
                      }`}
                    />
                  </button>
                </div>
              </div>
            );
          })}
        </Masonry>
      </div>
    </div>
  );
};

export default Exercise;

interface CircularProgressProps {
  percentage: number;
  size?: number;
  strokeWidth?: number;
}

const CircularProgress = ({ percentage, size = 200, strokeWidth = 12 }: CircularProgressProps) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width={size} height={size}>
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="none"
          className="text-gray-200"
        />

        {/* Progress circle with custom gradient */}
        <defs>
          <linearGradient id="progressGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#FF5A5F" />
            <stop offset="100%" stopColor="#8B5CF6" />
          </linearGradient>
        </defs>

        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="url(#progressGradient)"
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-all duration-1000 ease-out"
        />
      </svg>

      {/* Centered percentage text */}
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-5xl font-bold bg-gradient-to-b from-[#FF5A5F] to-[#8B5CF6] bg-clip-text text-transparent">
          {percentage}%
        </span>
      </div>
    </div>
  );
};
