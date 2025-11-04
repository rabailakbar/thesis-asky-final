"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, Bookmark } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import OpeningModal from "@/components/OpeningModal";
import ModuleHeader from "@/components/ModuleHeader";
import { ColumnsPhotoAlbum, RenderPhotoContext, RenderPhotoProps } from "react-photo-album";
import "react-photo-album/columns.css";

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
  useEffect(() => {
    const fetchImages = async () => {
      const { data, error } = await supabase.storage.from("Thesis").list("Modules", { limit: 100 });
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
      setTimeout(() => setIsComplete(true), 500);
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
  

  // Completion screen
  if (isComplete) {
    return (
      <div className="min-h-screen bg-[#F8F1E7] flex items-center justify-center p-6">
        <Card className="max-w-4xl w-full p-10 md:p-16 bg-[#FFFFFF] backdrop-blur-sm">
          <div className="flex items-start gap-6 mb-12 pb-6">
            <div className="w-24 h-24 flex items-center justify-center flex-shrink-0 mt-1">
              <img src="/m1end.png" alt="Module Complete" className="w-20 h-20 object-contain" />
            </div>
            <div className="flex-1">
              <h1 className="text-3xl md:text-4xl font-bold mb-2">Module 2 : Complete</h1>
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
          <div className="text-center mt-12">
            <Button size="lg" onClick={() => navigate(`/M3`)} className="px-14 bg-[#8B5CF6] text-lg shadow-md">
              Next Module →
            </Button>
          </div>
        </Card>
      </div>
    );
  }

const CustomPhotoOverlay = (
  props: RenderPhotoProps,
  context: RenderPhotoContext
) => {
  const { photo } = context;
  const { onClick } = props;
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      style={{
        position: "relative",
        width: context.width,
        height: context.height,
        cursor: "pointer",
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <img
        src={photo.src}
        alt={photo.alt}
        style={{
          
          width: "100%",
          height: "100%",
          borderRadius: "12px",
          objectFit: "cover",
          transition: "transform 0.3s ease",
          transform: isHovered ? "scale(1.03)" : "scale(1)",
        }}
      />

      {isHovered && (
        <div
          style={{
            position: "absolute",
            inset: 0,
         
            display: "flex",
            justifyContent: "center",
            gap: "1rem",
          }}
        >
          <Button
            size="icon"
            variant="ghost"
            className="text-white"
            onClick={(e) => {
              e.stopPropagation();
              handlePostAction(Number(photo.key), "like");
            }}
          >
            <Heart className="w-5 h-5" />
          </Button>

          <Button
            size="icon"
            variant="ghost"
            className="text-white"
            onClick={(e) => {
              e.stopPropagation();
              handlePostAction(Number(photo.key), "save");
            }}
          >
            <Bookmark className="w-5 h-5" />
          </Button>
        </div>
      )}
    </div>
  );
};


  // Main gallery
  return (
    <div className="min-h-screen bg-[#F8F1E7] flex items-center justify-center py-4  rounded-[24px] shadow-sm">
      <OpeningModal showIntroModal={showIntroModal} moduleId={moduleId} setShowIntroModal={setShowIntroModal} />
      <div className="max-w-7xl w-full ">
        <ModuleHeader src="/m1.2.svg" />

        <div className="flex justify-end gap-2 mb-8 text-gray-700">
          <span>
            {likesCount}/{MAX_LIKES} Likes
          </span>
          <span>|</span>
          <span>
            {savesCount}/{MAX_SAVES} Saves
          </span>
        </div>

        <h2 className="text-center text-lg font-medium text-gray-700 mb-8">Click to like and save!</h2>

        <ColumnsPhotoAlbum
  photos={photos}
  columns={(containerWidth) => {
    if (containerWidth < 500) return 2;
    if (containerWidth < 900) return 3;
    if (containerWidth < 1200) return 4;
    return 4;
  }}
  spacing={10}
  render={{ photo: CustomPhotoOverlay }}
/>


      </div>
    </div>
  );
}
