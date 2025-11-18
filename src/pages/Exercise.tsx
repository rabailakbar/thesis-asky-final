"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, Bookmark, Clock, ChevronRight } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { ColumnsPhotoAlbum, RenderPhotoContext, RenderPhotoProps, RowsPhotoAlbum } from "react-photo-album";
import "react-photo-album/columns.css";
import { motion, AnimatePresence } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store";
import { decreaseScore } from "@/store/topicsSlice";
import CircleScore from "@/components/CircleScore";
import ModuleHeader from "@/components/ModuleHeader";
import OpeningModal from "@/components/OpeningModal";
import ClosingModal from "@/components/ClosingModal";

interface Post {
  id: number;
  title: string;
  imageUrl: string;
  width: number;
  height: number;
  codeNumber: number | null;
  codeLetter: string;
}

const MAX_VISIBLE = 11;
const MAX_LIKES = 4;
const MAX_SAVES = 2;
const TRANSITION_MS = 350;

// Extracts group number and letter (e.g. “8b”, “1a”)
const extractCodeFromFilename = (filename: string) => {
  const cleanName = filename.toLowerCase().replace(/[_\s-]+/g, "");
  const match = cleanName.match(/(\d+)([a-z])(?=\.[a-z]+$|$)/);
  if (!match) return { number: null, letter: "" };
  return { number: parseInt(match[1], 10), letter: match[2] };
};

export default function Exercise() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const moduleId = searchParams.get("id") || "M1";
  const [isLoading, setIsLoading] = useState(true);
const [done,setDone] = useState(false)
  const [showIntroModal, setShowIntroModal] = useState(true);
  const [allPosts, setAllPosts] = useState<Post[]>([]);
  const [visiblePosts, setVisiblePosts] = useState<Post[]>([]);
  const [likedIds, setLikedIds] = useState<Set<number>>(new Set());
  const [savedIds, setSavedIds] = useState<Set<number>>(new Set());
  const [isComplete, setIsComplete] = useState(false);
  const [replacingIds, setReplacingIds] = useState<Set<number>>(new Set());
 const [code,setCodes] = useState<any>([]);
  // Fetch all Supabase images
  const topic = useSelector((state:RootState)=>state.topics.topics)
  useEffect(() => {
    const fetchImages = async () => {
      const { data, error } = await supabase.storage.from("Thesis").list("Modules", { limit: 80 });
      
      if (error) {
        console.error(error);
        return;
      }
  
      for (let i = data.length - 1; i >= 0; i--) {
        const match = data[i].name.match(/_(\d+)/);
        const number = match ? parseInt(match[1], 10) : null;
        if (!number || !topic.includes(number)) {
          data.splice(i, 1);
        }
      }
  
      const postsData: Post[] = await Promise.all(
        data.map(async (file, index) => {
          if (file.name === "Group59.png") return null;
          const PUBLIC_PREFIX =
  "https://wlneuhivxmpiasjmmryi.supabase.co/storage/v1/object/public/Thesis/Modules";
         
          
          const publicUrl = `${PUBLIC_PREFIX}/${file.name}`;
  
          const { number, letter } = extractCodeFromFilename(file.name);
  
          const dim = await new Promise<{ w: number; h: number }>((resolve) => {
            const img = new Image();
            img.src = publicUrl;
            img.onload = () => resolve({ w: img.naturalWidth || 600, h: img.naturalHeight || 400 });
            img.onerror = () => resolve({ w: 600, h: 400 });
          });
  
          return {
            id: index + 1,
            title: file.name,
            imageUrl: publicUrl,
            width: dim.w,
            height: dim.h,
            codeNumber: number,
            codeLetter: letter,
          } as Post;
        })
      );
  console.log("all",postsData)
      const filtered = postsData.filter(Boolean) as Post[];
      const shuffled = filtered.sort(() => Math.random() - 0.5);
      setAllPosts(shuffled);
      setVisiblePosts(shuffled.slice(0, MAX_VISIBLE));
      setIsLoading(false);
    };
  
    fetchImages();
  }, []);

  const pickRandom = (arr: Post[]) => arr[Math.floor(Math.random() * arr.length)];

  // Smart replacement logic
  const findReplacementFor = (current: Post) => {
    console.log("current",current)
  //  console.log("replacements",unseenOverall)
    if (!current) return null;

    const sameGroup = allPosts.filter(
      (p) =>
        p.title.split("_")[1].split("")[0] === current.title.split("_")[1].split("")[0] &&
        p.id !== current.id &&
        !visiblePosts.some((v) => v.id === p.id) &&
        !likedIds.has(p.id) &&
        !savedIds.has(p.id)
    );
console.log("same",sameGroup)
    if (sameGroup.length > 0) return pickRandom(sameGroup);

    const unseenOverall = allPosts.filter(
      (p) =>
        p.id !== current.id &&
        !visiblePosts.some((v) => v.id === p.id) &&
        !likedIds.has(p.id) &&
        !savedIds.has(p.id)
    );
   
    if (unseenOverall.length > 0) return pickRandom(unseenOverall);
    return null;
  };

  const handlePostAction = (id: number, action: "like" | "save",src:string) => {
    const current = visiblePosts.find((p) => p.id === id);
    if (!current) return;
    setCodes((prev:any)=>[...prev,src])
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
    console.log("replacement",replacement)
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
const dispatch = useDispatch()
  const likesCount = likedIds.size;
  const savesCount = savedIds.size;
const score = useSelector((state:RootState)=>state.topics.score)


  const getScoreDrop = (savedUrls:string[]) => {
    
    // Extract number after underscore
    const topics = savedUrls.map(url => {
      const file = url.split("/").pop();     // IG_12c1.png
      const match = file.match(/_(\d+)/);    // extract number after _
      return match ? parseInt(match[1]) : null;
    }).filter(Boolean);
  
    const uniqueTopics = new Set(topics).size;
    if (uniqueTopics >= 5) return 5;   // C3
    if (uniqueTopics >= 3) return 2;   // C2
    if (uniqueTopics >= 2) return 1;   // C1
    
    return 0;
  };
  
  
  
  
  useEffect(() => {
    if ((likesCount >= MAX_LIKES && savesCount >= MAX_SAVES) || done) {
      
      dispatch(decreaseScore(getScoreDrop(code)))



      const delay = setTimeout(() => setIsComplete(true), 1500); // 1.2s delay
      
      return () => clearTimeout(delay);
    }
  }, [likesCount, savesCount,done]);
  

  // Convert posts to photo format
  const photos = visiblePosts.map((post) => ({
    src: post.imageUrl,
    width: post.width,
    height: post.height,
    key: String(post.id),
    alt: post.title,
  }));
  
  const CustomPhotoOverlay = (
    props: RenderPhotoProps,
    context: RenderPhotoContext
  ) => {
    const { photo } = context;
    const { onClick } = props;
    const [isHovered, setIsHovered] = useState(false);
    const liked = likedIds.has(Number(photo.key));
    const saved = savedIds.has(Number(photo.key));
    const isReplacing = replacingIds.has(Number(photo.key));
  
    return (
      <AnimatePresence mode="wait">
        <motion.div
          key={photo.src} // important: this re-triggers animation on image change
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.35, ease: "easeInOut" }}
          style={{
            position: "relative",
            cursor: "pointer",
          }}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <motion.img
            src={photo.src}
            alt={photo.alt}
            style={{
              borderRadius: "12px",
              objectFit: "cover",
            }}
            whileHover={{ scale: 1.03 }}
            transition={{ duration: 0.3 }}
          />
  
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: isHovered ? 1 : 0 }}
            transition={{ duration: 0.2 }}
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: "1rem",
              pointerEvents: isHovered ? "auto" : "none",
            }}
          >
            {/* Like Button */}
            <Button
              size="icon"
              variant="ghost"
              className={`bg-white shadow-md hover:bg-gray-100 ${
                liked ? "text-red-500" : "text-black"
              }`}
              onClick={(e) => {
                e.stopPropagation();
                handlePostAction(Number(photo.key), "like",photo.src);
              }}
            >
              <Heart
                className={`w-5 h-5 transition-colors ${
                  liked ? "fill-red-500 text-red-500" : ""
                }`}
              />
            </Button>
  
            {/* Save Button */}
            <Button
              size="icon"
              variant="ghost"
              className={`bg-white shadow-md hover:bg-gray-100 ${
                saved ? "text-purple-500" : "text-black"
              }`}
              onClick={(e) => {
                e.stopPropagation();
                handlePostAction(Number(photo.key), "save",photo.src);
              }}
            >
              <Bookmark
                className={`w-5 h-5 transition-colors ${
                  saved ? "fill-purple-500 text-purple-500" : ""
                }`}
              />
            </Button>
          </motion.div>
        </motion.div>
      </AnimatePresence>
    );
  };
  // Completion screen
 // Animated completion transition
 const ending = <div>Yikes, <span className="text-[#5F237B]"> {score}%</span> 
 <span className="text-[#D0193E]"> polarization!</span> But that’s what we’re here for — to unpack it, learn, and bring the number down together.
    <span className="text-[#5F237B]">Lower the score, lower the polarization</span>.... and that's how you win!`
    </div>
 return(
<AnimatePresence mode="wait">
  {isComplete ? (
    <motion.div
      key="closing"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6, ease: "easeInOut" }}
    >
      <ClosingModal  ending={ending} src={"/fakefact"} module={2} text={"✓ 4/4 Likes  |  2/2 saves"}  score={score}/>
    </motion.div>
  ) : (
    <motion.div
      key="gallery"
      initial={{ opacity: 1, scale: 1 }}
      animate={{ opacity: isComplete ? 0 : 1, scale: isComplete ? 0.97 : 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6, ease: "easeInOut" }}
    >
      <div className="p-8">
      {/* Your existing gallery content goes here */}
      <div className="min-h-screen bg-[#F8F1E7] flex overflow-auto   py-8 px-32 rounded-[24px] shadow-sm">
      <OpeningModal
          showIntroModal={showIntroModal}
          moduleId={moduleId}
          setShowIntroModal={setShowIntroModal}
          src={"/opening12.png"}
          phase="I"
          module="Module 2: Pick & Flick"
          description="In this module, students will interact with a simulated social media feed, similar to the ones they scroll through daily. Their goal is to like 10 posts and save 5 in order to earn a score. The twist — the more diverse their engagement, the higher their score."
          time="2:00"
          calculated=""
          level="Beginner"
        />
        <div className="max-w-7xl w-full ">
          <ModuleHeader setDone={setDone} module={2} src={"/opening12.png"} heading={"Pick & Flick"} description={"Is everything not real?!"} time={120}       savesCount={savesCount} likesCount={likesCount} MAX_LIKES={MAX_LIKES} MAX_SAVES={MAX_SAVES} polarizationScore={score} />
          {isLoading?( <motion.div
        key="loading-screen"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.6 }}
        className="min-h-screen flex  justify-center bg-[#F8F1E7]"
      >
        <div className="text-center">
          <img
            src="/loading.svg" // replace with the actual path to the uploaded character image
            alt="Loading character"
            className="w-24 h-24 mb-4"
          />
          <p className="text-xl font-semibold">Scanning pixels... Just a min</p>
          <div className="flex justify-center items-center mt-4">
            <div className="w-16 h-2 bg-gradient-to-r from-pink-500 to-red-500 rounded-full animate-pulse"></div>
          </div>
          <p className="mt-2">Please wait while we prepare the feed!</p>
        </div>
      </motion.div>):(<div>
          

          <h2 className="text-center text-lg font-medium text-gray-700 mb-8">
            Click to like and save!
          </h2>

          <ColumnsPhotoAlbum
            spacing={10}
            photos={photos}
            render={{ photo: CustomPhotoOverlay }}
            columns={(containerWidth) => {
              if (containerWidth < 500) return 2;
              if (containerWidth < 900) return 3;
              if (containerWidth < 1200) return 4;
              return 4;
            }}
          />
          </div>)}
        </div>
      </div>
      </div>
    </motion.div>
  )}
</AnimatePresence>)

}







































  
  
  








  
  
  
  




























