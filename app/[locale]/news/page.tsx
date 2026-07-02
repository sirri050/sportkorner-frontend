import { fetchStrapi } from "@/lib/strapi";
import Link from "next/link";
import { Clock, ArrowRight, Zap, Trophy, X } from "lucide-react"; // Added Trophy and X
import { getLocale, getTranslations } from "next-intl/server";
import { Metadata } from "next";
import Pagination from "@/components/news-pagination";

// Define the Props type for Next.js 15+ searchParams
type Props = {
  searchParams: Promise<{ category?: string , page?: string }>;
};

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const isAr = locale === "ar";

  return {
    title: isAr ? "الأخبار | سبورت كورنر" : "News | SportKorner",
    description: isAr
      ? "تغطية شاملة لآخر مستجدات الرياضة."
      : "Comprehensive coverage of the latest sports updates.",
  };
}

export default async function NewsPage({ searchParams }: Props) {
  const { category, page } = await searchParams; // Get category from URL (?category=world-cup)
  const locale = await getLocale();
  const t = await getTranslations("News");
  const isAr = locale === "ar";

  // 1. Build the filter logic
  const filters: any = {};
  if (category) {
    filters.categories = {
      slug: category,
    };
  }



  const response = await fetchStrapi("news", {
    sort: ["priority:desc", "createdAt:desc"],
    filters,
    locale,
    populate: ["categories"],
    pagination: {
      page: page ? (parseInt(page) > 4 ? 4 : parseInt(page)) : 1,
      pageSize: 25,
    },
  });
  const newsItems = response.data || [];
  console.log("Fetched News Items:", newsItems);
  const isWorldCupFilter = category === "world-cup";
  const pagination = response.meta?.pagination || { page: 1, pageSize: 25, pageCount: 1, total: newsItems?.length };
  return (
    <main className="max-w-7xl mx-auto py-16 px-4" dir={isAr ? 'rtl' : 'ltr'}>

      {/* Dynamic Header: Changes if World Cup category is active */}
      <header className={`mb-16 p-8 rounded-[3rem] border-s-8 transition-all
        ${isWorldCupFilter
          ? "border-orange-600 bg-orange-600/[0.03] shadow-2xl shadow-orange-950/20"
          : "border-orange-600"
        }`}
      >
        <div className="flex justify-between items-start">
          <div className="space-y-4">
            {isWorldCupFilter && (
              <div className="flex items-center gap-2 text-orange-500 font-black uppercase text-xs tracking-widest mb-2">
                <Trophy size={16} />
                {t("specialCoverage") || "Special Event Coverage"}
              </div>
            )}
            <h1 className="text-5xl md:text-7xl font-black uppercase italic tracking-tighter leading-none">
              {isWorldCupFilter ? "FIFA WORLD CUP" : t("latest")}{" "}
              <span className="text-orange-500">{isWorldCupFilter ? "2026" : t("updates")}</span>
            </h1>
            <p className="text-slate-400 font-medium text-lg max-w-2xl leading-relaxed">
              {isWorldCupFilter
                ? (isAr ? "تغطية حصرية وشاملة لكأس العالم 2026." : "Exclusive and comprehensive coverage of the FIFA World Cup 2026.")
                : t("description")}
            </p>
          </div>

          {/* Close Filter Button */}
          {category && (
            <Link
              href={`/${locale}/news`}
              className="p-3 bg-white/5 hover:bg-white/10 rounded-full text-slate-500 hover:text-white transition-colors"
              title="Clear Filter"
            >
              <X size={20} />
            </Link>
          )}
        </div>
      </header>

      <div className="grid gap-4 md:grid-cols-2">
        {newsItems.map((item: any) => {
          const isExternal = !!item.link;
          const href = isExternal ? item.link : `/${locale}/news/${item.slug}`;
          const isHighPriority = item.priority > 5;

          return (
            <Link
              key={item.documentId || item.id}
              href={href}
              target={isExternal ? "_blank" : "_self"}
              className={`group relative glass p-8 rounded-[2.5rem] border transition-all duration-300 flex items-center justify-between gap-6
                ${isHighPriority
                  ? "border-orange-500/30 bg-orange-500/[0.03] shadow-lg shadow-orange-950/10"
                  : "border-white/5 hover:border-white/20 bg-white/[0.01]"
                }`}
            >
              <div className="space-y-4 flex-1">
                <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">
                  <span className="flex items-center gap-1.5">
                    <Clock size={12} className="text-orange-500" />
                    {new Date(item.createdAt).toLocaleDateString(locale, {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric'
                    })}
                  </span>

                  {isHighPriority && (
                    <span className="flex items-center gap-1 text-orange-500 bg-orange-500/10 px-3 py-1 rounded-full">
                      <Zap size={10} fill="currentColor" />
                      {t("featured") || "Breaking"}
                    </span>
                  )}

                  {/* Category Badge (Optional) */}
                  {item.categories?.length > 0 && (
                    <span className="text-orange-500/50">/ {item.categories[0].name}</span>
                  )}
                </div>

                <h2 className="text-xl md:text-2xl font-black italic uppercase tracking-tight leading-tight group-hover:text-orange-500 transition-colors">
                  {item.title}
                </h2>
              </div>

              <div className="shrink-0">
                <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-orange-600 group-hover:border-orange-500 transition-all duration-300">
                  <ArrowRight
                    size={20}
                    className={`transition-transform duration-300 
                      ${isAr ? "rotate-180 group-hover:-translate-x-1" : "group-hover:translate-x-1"}`}
                  />
                </div>
              </div>
            </Link>
          );
        })}
      </div>

{pagination.pageCount > 1 && (
  <div className="mt-12 p-6 rounded-[2.5rem] glass border border-white/5 flex justify-center">
    <Pagination
      currentPage={pagination.page}
      totalPages={pagination.pageCount}
    />
  </div>
)}

      {/* Empty State */}
      {newsItems.length === 0 && (
        <div className="text-center py-20 glass rounded-[3rem] border border-dashed border-white/10">
          <p className="text-slate-500 font-black uppercase italic tracking-widest">
            {category ? `No news found for ${category}` : t("noNews")}
          </p>
        </div>
      )}
    </main>
  );
}