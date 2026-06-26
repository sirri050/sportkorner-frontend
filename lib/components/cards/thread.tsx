"use client";

import Link from "next/link";
import { MessageSquare, Eye, Clock } from "lucide-react";
import LikeButton from "../widgets/LikeButton";
import { useLocale, useTranslations } from "next-intl";

export default function ThreadCard({ thread }: { thread: any }) {
  const locale = useLocale();
  const t = useTranslations("ThreadCard");

  return (
    <article className="glass p-5 rounded-2xl hover:border-brand-primary/50 transition-all duration-300 group relative">
      <div className="flex items-start gap-4">
        {/* Author Avatar */}
        <div className="h-10 w-10 rounded-full bg-slate-800 flex-shrink-0 flex items-center justify-center border border-slate-700">
          <span className="text-xs font-bold text-slate-400">
            {thread.author?.username?.charAt(0).toUpperCase()}
          </span>
        </div>

        <div className="flex-1 min-w-0">
          {/* Metadata Row */}
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold text-brand-primary uppercase tracking-wider">
              {thread.categories?.[0]?.name}
            </span>
            <span className="text-slate-600 text-xs">•</span>
            <span className="text-slate-500 text-[10px] font-bold flex items-center gap-1">
              <Clock size={12} />{" "}
              {new Date(thread.createdAt).toLocaleDateString(locale)}
            </span>
          </div>

          {/* Title */}
          <Link href={`/thread/${thread.slug}`} className="block w-full min-w-0">
            <h3 className="text-base md:text-lg font-black group-hover:text-brand-primary transition-colors leading-tight mb-2 line-clamp-2 overflow-hidden break-words">
              {thread.title}
            </h3>
          </Link>
          {/* Bottom Stats */}
          <div className="flex items-center gap-4 text-slate-500 text-sm">
            <LikeButton
              threadId={thread.documentId}
              initialLikes={thread.likes || 0}
            />
            <span className="flex items-center gap-1.5 font-bold text-xs">
              <MessageSquare size={16} />
              {thread.posts?.length || 0}
            </span>
            { /**       <span className="flex items-center gap-1.5 font-bold text-xs">
              <Eye size={16} /> {thread.views || 0}
            </span>
             *
             */}


            {/* Logical Margin: ms-auto handles RTL and LTR automatically */}
            <span className="ms-auto text-[10px] font-bold text-slate-600 uppercase tracking-widest">
              {t("by")}{" "}
              <span className="text-slate-400">@{thread.author?.username}</span>
            </span>
          </div>
        </div>
      </div>
    </article>
  );
}
