import Link from "next/link";
import { Hash, ChevronRight, Flame, Trophy, Globe } from "lucide-react";
import { fetchStrapi } from "@/lib/strapi";
import LiveScores from "../widgets/scores";
import { getTranslations } from "next-intl/server";
import WriteArticleCTA from "../widgets/create.article";


export default async function Sidebar({ locale }: { locale: string }) {
  const t = await getTranslations("Sidebar");

  const [categoriesRes, tagsRes] = await Promise.all([
    fetchStrapi("categories", {
      locale: locale, // Important: Fetch translated category names
      fields: ["name", "slug"],
      populate: ["parent"],
    }),
    fetchStrapi("tags", {
      locale: locale, // Important: Fetch translated tag names
      fields: ["name", "slug"],
      sort: ["createdAt:desc"],
      pagination: { limit: 8 },
    }),
  ]);

  const majorSports = categoriesRes.data.filter((cat: any) => !cat.parent);
  const leagues = categoriesRes.data.filter((cat: any) => !!cat.parent);
  const tags = tagsRes.data;

  return (
    <aside className="hidden lg:flex flex-col gap-6 w-80 shrink-0 sticky top-24 h-fit">

      <WriteArticleCTA />
      {/* <LiveScores /> */}

      {/* 1. Major Sports */}
      <div className="bg-slate-900/50 border border-slate-800 rounded-3xl overflow-hidden backdrop-blur-sm shadow-xl">
        <div className="p-5 border-b border-white/5 bg-white/[0.02]">
          <h3 className="font-black text-xs uppercase tracking-[0.2em] text-slate-500 flex items-center gap-2">
            <Globe size={14} className="text-brand-primary" />
            {t("majorSports")}
          </h3>
        </div>
        <div className="p-2">
          {majorSports.map((sport: any) => (
            <Link
              key={sport.documentId}
              href={`/category/${sport.slug}`}
              className="flex items-center justify-between p-3 rounded-2xl hover:bg-brand-primary/10 text-slate-300 hover:text-brand-primary transition-all group font-bold italic uppercase text-sm"
            >
              <span>{sport.name}</span>
              {/* rtl:rotate-180 flips the arrow for Arabic */}
              <ChevronRight
                size={16}
                className="opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 rtl:group-hover:-translate-x-0 rtl:group-hover:translate-x-2 transition-all rtl:rotate-180"
              />
            </Link>
          ))}
        </div>
      </div>

      {/* 2. Top Leagues */}
      <div className="bg-slate-900/50 border border-slate-800 rounded-3xl overflow-hidden backdrop-blur-sm">
        <div className="p-5 border-b border-white/5 bg-white/[0.02]">
          <h3 className="font-black text-xs uppercase tracking-[0.2em] text-slate-500 flex items-center gap-2">
            <Trophy size={14} className="text-yellow-500" />
            {t("topLeagues")}
          </h3>
        </div>
        <div className="p-2 grid grid-cols-1 gap-1">
          {leagues.map((league: any) => (
            <Link
              key={league.documentId}
              href={`/category/${league.slug}`}
              className="flex items-center gap-3 p-3 rounded-2xl hover:bg-slate-800/50 text-slate-400 hover:text-white transition-all text-xs font-bold"
            >
              <div className="w-1.5 h-1.5 rounded-full bg-slate-700 group-hover:bg-brand-primary" />
              {league.name}
            </Link>
          ))}
        </div>
      </div>

      {/* 3. Trending Topics */}
      <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-6 backdrop-blur-sm">
        <h3 className="font-black text-xs uppercase tracking-[0.2em] text-slate-500 flex items-center gap-2 mb-5">
          <Flame size={14} className="text-orange-500" />
          {t("trendingTopics")}
        </h3>
        <div className="flex flex-wrap gap-2">
          {tags.map((tag: any) => (
            <Link
              key={tag.documentId}
              href={`/tags/${tag.slug}`}
              className="px-3 py-1.5 rounded-xl bg-slate-950 border border-white/5 text-[10px] font-black text-slate-400 hover:border-brand-primary hover:text-white transition-all uppercase tracking-tighter"
            >
              #{tag.name}
            </Link>
          ))}
        </div>
      </div>
    </aside>
  );
}
