import { searchThreads } from "@/lib/actions/search";
import ThreadCard from "@/lib/components/cards/thread";
import Sidebar from "@/lib/components/layout/sidebar";
import { getTranslations, getLocale } from "next-intl/server";
import { Metadata } from "next";
import { Search, Info } from "lucide-react";
import SpotlightCard from "@/lib/components/cards/spotlight";
import NewsCard from "@/lib/components/cards/news";



// --- SEO: Prevent indexing of search result pages ---
export async function generateMetadata({
  searchParams
}: {
  searchParams: Promise<{ q?: string }>
}): Promise<Metadata> {
  const { q } = await searchParams;
  const locale = await getLocale();
  const isAr = locale === 'ar';

  return {
    title: q
      ? (isAr ? `نتائج البحث عن "${q}"` : `Search results for "${q}"`)
      : (isAr ? "بحث" : "Search"),
    robots: {
      index: false, // CRITICAL: Do not index search result pages to avoid "Thin Content" penalties
      follow: true,
    },
  };
}

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const locale = await getLocale();
  const sParams = await searchParams;
  const query = sParams.q || "";
  const t = await getTranslations("SearchPage");
  const isAr = locale === 'ar';
  // Fetch results based on query and current locale
  const { threads, news, spotlights } = await searchThreads(query, locale)
  const threadList = threads.data || [];
  const newsList = news?.data || [];
  const spotlightsList = spotlights?.data || [];
  const mergedResults = [
    ...spotlightsList.map((item: any) => ({
      ...item,
      contentType: "spotlight",
    })),
    ...newsList.map((item: any) => ({
      ...item,
      contentType: "news",
    })),
    ...threadList.map((item: any) => ({
      ...item,
      contentType: "thread",
    })),
  ].sort(
    (a, b) =>
      new Date(b.publishedAt ?? b.createdAt).getTime() -
      new Date(a.publishedAt ?? a.createdAt).getTime()
  );
  const hasAnyResults = threadList.length > 0 || newsList.length > 0 || spotlightsList.length > 0;
  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6" dir={isAr ? 'rtl' : 'ltr'}>
      <div className="flex flex-col lg:flex-row gap-12">
        <div className="flex-1 space-y-10">

          {/* Search Header */}
          <header className="space-y-4">
            <div className="flex items-center gap-3 text-orange-500 mb-2">
              <Search size={20} strokeWidth={3} />
              <span className="text-[10px] font-black uppercase tracking-[0.3em]">
                {t("searchSystem")}
              </span>
            </div>

            <h1 className="text-5xl md:text-7xl font-black uppercase italic tracking-tighter leading-none">
              {query ? (
                <>
                  <span className="text-3xl md:text-5xl">{t("resultsFor")}{" "}</span>
                  <span className="text-3xl md:text-5xl text-orange-500">"{query}"</span>
                </>
              ) : (
                t("title")
              )}
            </h1>

            <div className="flex items-center gap-2 text-slate-500">
              <Info size={14} />
              <p className="text-xs font-black uppercase tracking-widest">
                {t("found", { count: mergedResults.length })}
              </p>
            </div>
          </header>

          {/* Results Area */}
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-6">
              {mergedResults.map((item: any) => {
                switch (item.contentType) {
                  case "spotlight":
                    return (
                      <SpotlightCard
                        key={item.documentId || item.id}
                        item={item}
                      />
                    );

                  case "news":
                    return (
                      <NewsCard
                        key={item.documentId || item.id}
                        news={item}
                      />
                    );

                  case "thread":
                    return (
                      <ThreadCard
                        key={item.documentId || item.id}
                        thread={item}
                      />
                    );

                  default:
                    return null;
                }
              })}
            </div>
          </div>

          {!hasAnyResults && (
            <div className="glass p-20 md:p-32 text-center rounded-[3rem] border border-dashed border-white/10 bg-white/[0.01]">
              <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-8">
                <Search size={32} className="text-slate-700" />
              </div>
              <h3 className="text-2xl font-black uppercase italic text-slate-400 mb-4">
                {t("noResultsTitle") || "No Matches Found"}
              </h3>
              <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px] max-w-xs mx-auto leading-relaxed">
                {t("noResultsDesc") || "Try using different keywords or check your spelling."}
              </p>
            </div>
          )}
        </div>

        {/* Sidebar - Fixed width for consistent layout */}
        <aside className="lg:w-80 shrink-0">
          <Sidebar locale={locale} />
        </aside>
      </div>
    </main>
  );
}