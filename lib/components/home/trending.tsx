"use client";

import Link from "next/link";
import { Flame } from "lucide-react";
import { useTranslations } from "next-intl";

export default function TrendingSection({ threads }: { threads: any[] }) {
  const t = useTranslations("Trending");

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {threads.map((thread, index) => (
        <Link
          key={thread.documentId}
          href={`/thread/${thread.slug}`}
          className="group relative h-44 rounded-[2rem] overflow-hidden bg-slate-900/50 border border-white/5 p-6 hover:border-orange-500/50 transition-all flex flex-col justify-end backdrop-blur-sm shadow-2xl"
        >
          {/* Subtle Glow Effect */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent z-10" />

          <div className="relative z-20">
            <div className="flex items-center gap-2 mb-2">
              <Flame size={14} className="text-orange-500" />
              <span className="text-[10px] font-black text-orange-500 uppercase tracking-[0.2em]">
                {thread.likes || 0} {t("popularity")}
              </span>
            </div>

            <h3 className="text-md font-black leading-tight uppercase italic group-hover:text-orange-500 transition-colors line-clamp-2">
              {thread.title}
            </h3>
          </div>

          {/* Decorative Rank - Switched to inset-inline-end */}
          <span className="absolute top-2 inset-inline-end-4 text-6xl font-black text-white/[0.03] italic select-none pointer-events-none group-hover:text-orange-500/10 transition-colors">
            #{index + 1}
          </span>
        </Link>
      ))}
    </div>
  );
}
