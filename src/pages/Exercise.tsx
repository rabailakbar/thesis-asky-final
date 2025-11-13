"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, Bookmark, Clock } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import OpeningModal from "@/components/OpeningModal";
import { ColumnsPhotoAlbum, RenderPhotoContext, RenderPhotoProps, RowsPhotoAlbum } from "react-photo-album";
import "react-photo-album/columns.css";
import { motion, AnimatePresence } from "framer-motion";
import { useSelector } from "react-redux";
import { RootState } from "@/store";

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

  const [showIntroModal, setShowIntroModal] = useState(true);
  const [allPosts, setAllPosts] = useState<Post[]>([]);
  const [visiblePosts, setVisiblePosts] = useState<Post[]>([]);
  const [likedIds, setLikedIds] = useState<Set<number>>(new Set());
  const [savedIds, setSavedIds] = useState<Set<number>>(new Set());
  const [isComplete, setIsComplete] = useState(false);
  const [replacingIds, setReplacingIds] = useState<Set<number>>(new Set());

  // Fetch all Supabase images
  const topic = useSelector((state:RootState)=>state.topics.topics)
  useEffect(() => {
    const fetchImages = async () => {
      const { data, error } = await supabase.storage.from("Thesis").list("Modules", { limit: 100 });
    console.log("data",data)
    console.log("topic",topic)
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
      console.log("data",data)
      

      const postsData: Post[] = await Promise.all(
        data.map(async (file, index) => {
          if (file.name === "Group59.png") return null;
          const { data: urlData } = supabase.storage.from("Thesis").getPublicUrl(`Modules/${file.name}`);
          const { number, letter } = extractCodeFromFilename(file.name);

          const dim = await new Promise<{ w: number; h: number }>((resolve) => {
            const img = new Image();
            img.src = urlData.publicUrl;
            img.onload = () => resolve({ w: img.naturalWidth || 600, h: img.naturalHeight || 400 });
            img.onerror = () => resolve({ w: 600, h: 400 });
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
        })
      );

      const filtered = postsData.filter(Boolean) as Post[];
      const shuffled = filtered.sort(() => Math.random() - 0.5);
      setAllPosts(shuffled);
      setVisiblePosts(shuffled.slice(0, MAX_VISIBLE));
    };

    fetchImages();
  }, []);

  const pickRandom = (arr: Post[]) => arr[Math.floor(Math.random() * arr.length)];

  // Smart replacement logic
  const findReplacementFor = (current: Post) => {
    if (!current) return null;

    const sameGroup = allPosts.filter(
      (p) =>
        p.codeNumber === current.codeNumber &&
        p.id !== current.id &&
        !visiblePosts.some((v) => v.id === p.id) &&
        !likedIds.has(p.id) &&
        !savedIds.has(p.id)
    );

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

  useEffect(() => {
    if (likesCount >= MAX_LIKES && savesCount >= MAX_SAVES) {
      const delay = setTimeout(() => setIsComplete(true), 1500); // 1.2s delay
      return () => clearTimeout(delay);
    }
  }, [likesCount, savesCount]);
  

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
                handlePostAction(Number(photo.key), "like");
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
                handlePostAction(Number(photo.key), "save");
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
      <ClosingModal />
    </motion.div>
  ) : (
    <motion.div
      key="gallery"
      initial={{ opacity: 1, scale: 1 }}
      animate={{ opacity: isComplete ? 0 : 1, scale: isComplete ? 0.97 : 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6, ease: "easeInOut" }}
    >
      {/* Your existing gallery content goes here */}
      <div className="min-h-screen bg-[#F8F1E7] flex items-center justify-center p-16 rounded-[24px] shadow-sm">
        <OpeningModal
          showIntroModal={showIntroModal}
          moduleId={moduleId}
          setShowIntroModal={setShowIntroModal}
        />
        <div className="max-w-7xl w-full ">
          <ModuleHeader />

          <div className="flex justify-end gap-2 mb-8 text-gray-700">
            <span>
              {likesCount}/{MAX_LIKES} Likes
            </span>
            <span>|</span>
            <span>
              {savesCount}/{MAX_SAVES} Saves
            </span>
          </div>

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
        </div>
      </div>
    </motion.div>
  )}
</AnimatePresence>)


  
  
  


  // Main gallery
  // return (
  //   <div className="min-h-screen bg-[#F8F1E7] flex items-center justify-center p-16  rounded-[24px] shadow-sm">
  //     <OpeningModal showIntroModal={showIntroModal} moduleId={moduleId} setShowIntroModal={setShowIntroModal} />
  //     <div className="max-w-7xl w-full ">
  //      <ModuleHeader  /> 

  //       <div className="flex justify-end gap-2 mb-8 text-gray-700">
  //         <span>
  //           {likesCount}/{MAX_LIKES} Likes
  //         </span>
  //         <span>|</span>
  //         <span>
  //           {savesCount}/{MAX_SAVES} Saves
  //         </span>
  //       </div>

  //       <h2 className="text-center text-lg font-medium text-gray-700 mb-8">Click to like and save!</h2>

  //       <ColumnsPhotoAlbum
  //       spacing={10}
  // photos={photos}
  // render={{ photo: CustomPhotoOverlay }}
  // columns={(containerWidth) => {
  //   if (containerWidth < 500) return 2;
  //   if (containerWidth < 900) return 3;
  //   if (containerWidth < 1200) return 4;
  //   return 4;
    
  //   }}
  // />


  //     </div>
  //   </div>
  // );
}






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


  
  
  
  
  
  const ClosingModal = () => {
  
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
  
