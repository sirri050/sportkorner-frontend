"use client";

import { useState } from "react";
import { Heart } from "lucide-react";
import { toggleLike } from "@/lib/actions/threads";

export default function LikeButton({
  threadId,
  initialLikes,
}: {
  threadId: string;
  initialLikes: number;
}) {
  const [likes, setLikes] = useState(initialLikes);
  const [isLiked, setIsLiked] = useState(false);

  const handleLike = async () => {
    // 1. Update UI instantly
    if (isLiked) return; // Prevent double clicking for now

    setLikes((prev) => prev + 1);
    setIsLiked(true);

    // 2. Tell the server
    const result = await toggleLike(threadId, initialLikes);

    if (!result.success) {
      // Rollback if server fails
      setLikes((prev) => prev - 1);
      setIsLiked(false);
    }
  };

  return (
    <button
      onClick={handleLike}
      className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all cursor-pointer ${
        isLiked
          ? "bg-brand-primary/20 text-brand-primary"
          : "bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white"
      }`}
    >
      <Heart
        size={18}
        fill={isLiked ? "currentColor" : "none"}
        className={isLiked ? "animate-bounce" : ""}
      />
      <span className="text-xs font-black tracking-tighter">
        {likes} <span className="hidden sm:inline">LIKES</span>
      </span>
    </button>
  );
}
