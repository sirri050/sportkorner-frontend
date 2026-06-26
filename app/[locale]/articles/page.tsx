import { fetchStrapi } from "@/lib/strapi";
import Link from "next/link";
import { Clock, User, ChevronRight, PenTool } from "lucide-react";
import { getLocale, getTranslations } from "next-intl/server";
import Image from "next/image";
import { Metadata } from "next";

// --- SEO for the Collection Page ---
export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const isAr = locale === "ar";
  
  return {
    title: isAr ? "أصوات المجتمع | مقالات رياضية" : "Community Voices | Sports Articles",
    description: isAr 
      ? "اقرأ أحدث المقالات والتحليلات الرياضية من مجتمع سبورت كورنر." 
      : "Read the latest sports articles and deep-dive analysis from the SportKorner community.",
    alternates: {
      canonical: `/${locale}/articles`,
    }
  };
}

export default async function ArticlesPage() {
  const t = await getTranslations("Articles");
  const locale = await getLocale();
  const isAr = locale === "ar";
  
  // Fetch only published articles
  const response = await fetchStrapi("articles", {
    // Strapi automatically handles 'publishedAt' filters when using the standard find route,
    // but we'll ensure we sort by newest first.
    locale: locale,
    sort: "createdAt:desc",
    populate: ["coverImage", "author"]
  });

  const articles = response.data || [];

  // --- Empty State ---
  if(articles.length === 0) {
    return (
      <main className="max-w-4xl mx-auto py-24 px-4 text-center" dir={isAr ? 'rtl' : 'ltr'}>
        <div className="inline-flex p-6 rounded-full bg-white/5 mb-8 border border-white/5">
          <PenTool size={48} className="text-orange-600 animate-pulse" />
        </div>
        <h2 className="text-3xl font-black uppercase italic italic tracking-tighter mb-4">
            {t("noArticles")}
        </h2>
        <p className="text-slate-500 mb-10 max-w-md mx-auto font-medium">
            {t("noArticlesDesc")}
        </p>
        <Link 
          href={`/${locale}/articles/create`}
          className="inline-flex items-center gap-3 bg-orange-600 hover:bg-orange-500 text-white px-10 py-5 rounded-2xl font-black uppercase text-xs transition-all shadow-xl shadow-orange-900/20"
        >
          {t("ctaButton")} <ChevronRight size={16} className={isAr ? "rotate-180" : ""} />
        </Link>
      </main>
    );
  } 

  return (
    <main className="max-w-7xl mx-auto py-12 px-4" dir={isAr ? 'rtl' : 'ltr'}>
      {/* Header Section */}
      <header className="mb-16 flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-white/5 pb-12">
        <div className="space-y-3">
          <h1 className="text-5xl md:text-7xl font-black uppercase italic tracking-tighter leading-none">
            {t("community")} <span className="text-orange-500">{t("voices")}</span>
          </h1>
          <p className="text-slate-400 font-medium max-w-md text-lg">
            {t("shareInsight")}
          </p>
        </div>
        
        <Link 
          href={`/${locale}/articles/create`}
          className="inline-flex items-center gap-2 bg-white text-black hover:bg-orange-600 hover:text-white px-10 py-5 rounded-[2rem] font-black uppercase text-xs transition-all shadow-xl"
        >
          <PenTool size={16} />
          {t("ctaButton")}
        </Link>
      </header>

      {/* Articles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        {articles.map((article: any, index: number) => (
          <Link
            key={article.documentId || article.id}
            href={`/${locale}/articles/${article.slug}`}
            className={`group flex flex-col bg-white/[0.02] border border-white/5 rounded-[3rem] overflow-hidden hover:border-orange-500/30 transition-all duration-500 hover:shadow-2xl hover:shadow-orange-950/20`}
          >
            {/* Image Container */}
            <div className="aspect-[16/10] relative overflow-hidden bg-slate-900">
              {article.coverImage?.url ? (
                <Image 
                  src={process.env.NEXT_PUBLIC_STRAPI_MEDIA_URL + article.coverImage.url} 
                  alt={article.title}
                  className="object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-950 text-white/5 font-black uppercase text-6xl italic">
                  SK
                </div>
              )}
              {/* Category Badge (Optional - can be added if you have categories) */}
              <div className="absolute top-6 left-6 bg-orange-600 text-white text-[10px] font-black uppercase px-3 py-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                Community
              </div>
            </div>

            {/* Content Container */}
            <div className="p-10 flex flex-col flex-grow">
              <div className="flex items-center gap-5 mb-6 text-[10px] font-black uppercase tracking-[0.15em] text-slate-500">
                <span className="flex items-center gap-2">
                  <Clock size={14} className="text-orange-500" />
                  {new Date(article.createdAt).toLocaleDateString(locale, { day: 'numeric', month: 'short' })}
                </span>
                <span className="flex items-center gap-2">
                  <User size={14} className="text-orange-500" />
                  {article.author?.username || "Member"}
                </span>
              </div>

              <h2 className="text-2xl font-black leading-[1.1] mb-5 group-hover:text-orange-500 transition-colors line-clamp-2 italic uppercase">
                {article.title}
              </h2>

              <p className="text-slate-400 line-clamp-3 mb-8 leading-relaxed text-sm font-medium">
                {article.excerpt}
              </p>

              <div className="mt-auto pt-6 border-t border-white/5 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-orange-500 group-hover:gap-4 transition-all">
                {t("readMore")} 
                <ChevronRight size={14} className={isAr ? "rotate-180" : ""} />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}