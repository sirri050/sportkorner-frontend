import Sidebar from "@/lib/components/layout/sidebar";
import ThreadList from "@/lib/components/threads/threads.list";
import Link from "next/link";
import { fetchStrapi } from "@/lib/strapi";
import TrendingSection from "@/lib/components/home/trending";
import { getLocale, getTranslations } from "next-intl/server";
import NewsTicker from "@/lib/components/news/widget.newsTicker";
import SpotlightGrid from "@/lib/components/spotlights/spotlights.grid";
import { Metadata } from "next";
import { MessageSquarePlus, Flame, Sparkles } from "lucide-react";
import NewsGrid from "@/lib/components/home/news-grid";

// --- DYNAMIC SEO ---
export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("Home");
  const locale = await getLocale();
  const isAr = locale === 'ar';

  console.log(t("metadata.title"), t("metadata.description"));


  return {
    title: t("metadata.title"),
    description: t("metadata.description"),
    openGraph: {
      title: "SportKorner | The Ultimate Arabic Sports Hub",
      description: "Join the largest community for sports discussions, news, and tournaments.",
      images: ['/og-home.jpg'],
    },
    alternates: {
      canonical: `/${locale}`,
    }
  };
}

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const params = await searchParams;
  const currentPage = Number(params.page) || 1;
  const locale = await getLocale();
  const t = await getTranslations("Home");
  const isAr = locale === 'ar';

  // 1. Fetch Trending Threads (High Engagement)
  const trendingRes = await fetchStrapi("threads", {
    locale: locale,
    sort: ["likes:desc"],
    pagination: { limit: 4 },
    populate: ["author", "categories"],
  });

  const trendingThreads = trendingRes.data || [];

  // --- JSON-LD (Search & Brand) ---
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "SportKorner",
    "url": `https://sportkorner.com/${locale}`,
    "potentialAction": {
      "@type": "SearchAction",
      "target": `https://sportkorner.com/${locale}/search?q={search_term_string}`,
      "query-input": "required name=search_term_string"
    }
  };

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 py-12 space-y-16" dir={isAr ? 'rtl' : 'ltr'}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* 1. Full-Width Trending Section */}
      {trendingThreads.length > 0 && (
        <section className="space-y-8">
          <div className="flex items-center gap-3">
            <div className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-orange-500"></span>
            </div>
            <h2 className="text-2xl md:text-3xl font-black uppercase italic tracking-tighter leading-none">
              {t("trending")} <span className="text-orange-500">{t("now")}</span>
            </h2>
          </div>
          <TrendingSection threads={trendingThreads} />
        </section>
      )}

      <NewsGrid />

      {/* 2. Editorial Highlights / Spotlights */}
      <section>
        <SpotlightGrid
        //locale={locale} 
        />
      </section>

      {/* 3. Main Layout (Discussions + Sidebar) */}
      <div className="flex flex-col lg:flex-row gap-12 items-start">
        <div className="flex-1 min-w-0 space-y-10">

          {/* Header & Controls */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-white/5 pb-8">
            <div className="space-y-2">
              <h1 className="text-3xl md:text-6xl font-black uppercase tracking-tighter italic leading-[0.85]">
                {t("latest")} <span className="text-orange-500">{t("discussions")}</span>
              </h1>
              <p className="text-slate-500 font-bold uppercase text-[10px] tracking-[0.3em] flex items-center gap-2">
                <Sparkles size={12} className="text-orange-500" />
                {t("realTimeFeed")}
              </p>
            </div>

            {/* Actions Section */}
            <div className="flex flex-wrap items-center gap-4">
              {/* Filter Switcher */}
              <div className="flex bg-slate-900/50 p-1 rounded-2xl border border-white/5">
                <button className="px-6 py-2.5 bg-orange-600 rounded-xl text-[10px] font-black uppercase tracking-widest text-white shadow-lg shadow-orange-900/20 flex items-center gap-2">
                  <Flame size={14} /> {t("hot")}
                </button>
                <button className="px-6 py-2.5 text-slate-500 hover:text-white transition-colors text-[10px] font-black uppercase tracking-widest">
                  {t("newest")}
                </button>
              </div>

              <div className="hidden md:block w-px h-10 bg-white/5" />

              <Link
                href={`/${locale}/new-thread`}
                className="bg-white text-black hover:bg-orange-600 hover:text-white px-4 md:px-8 py-3 rounded-2xl font-black text-[11px] uppercase tracking-widest transition-all flex items-center gap-2"
              >
                <MessageSquarePlus size={16} />
                {t("startTopic")}
              </Link>
            </div>
          </div>

          {/* List of Threads */}
          <ThreadList page={currentPage} locale={locale} />
        </div>

        {/* Sticky Sidebar */}
        <aside className="lg:w-80 w-full shrink-0 lg:sticky lg:top-24">
          <Sidebar locale={locale} />
        </aside>
      </div>
    </main>
  );
}