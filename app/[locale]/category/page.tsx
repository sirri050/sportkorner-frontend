import { fetchStrapi } from "@/lib/strapi";
import Link from "next/link";
import { Trophy, ArrowUpRight, Globe, Users } from "lucide-react";
import { getLocale, getTranslations } from "next-intl/server";
import { Metadata } from "next";

// --- SEO Metadata ---
export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const isAr = locale === "ar";
  
  return {
    title: isAr ? "الساحة | تصفح الرياضات" : "The Arena | Browse Sports",
    description: isAr 
      ? "استكشف جميع التخصصات الرياضية، الدوريات، والمجتمعات في سبورت كورنر." 
      : "Explore all sports disciplines, leagues, and communities on SportKorner.",
    alternates: {
      canonical: `/${locale}/category`,
    }
  };
}

export default async function CategoriesHubPage() {
  const locale = await getLocale();
  const t = await getTranslations("CategoryHub");
  const isAr = locale === "ar";

  // Fetch only top-level sports in the current locale
  const categoriesRes = await fetchStrapi("categories", {
    locale: locale,
    filters: { parent: { id: { $null: true } } },
    populate: ["subcategories", "threads"],
  });

  const sports = categoriesRes.data || [];

  // --- JSON-LD for Google (Item List of Sports) ---
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "itemListElement": sports.map((sport: any, index: number) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": sport.name,
      "url": `https://sportkorner.com/${locale}/category/${sport.slug}`
    }))
  };

  return (
    <main className="max-w-7xl mx-auto px-4 py-12" dir={isAr ? 'rtl' : 'ltr'}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <header className="mb-12 space-y-2">
        <h1 className="text-5xl md:text-7xl font-black uppercase italic tracking-tighter leading-none">
          {t("browse")} <span className="text-orange-500">{t("theArena")}</span>
        </h1>
        <p className="text-slate-400 mt-2 font-medium text-lg max-w-2xl">{t("subtitle")}</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {sports.map((sport: any) => (
          <div key={sport.documentId || sport.id} className="group relative">
            <div className="glass p-10 rounded-[3rem] border border-white/5 hover:border-orange-500/50 transition-all duration-500 h-full flex flex-col shadow-2xl overflow-hidden bg-white/[0.01]">
              
              <div className="relative z-10 flex-1">
                <div className="flex justify-between items-start mb-8">
                  <div className="bg-orange-600/10 p-4 rounded-2xl border border-orange-500/20">
                    <Globe className="text-orange-500" size={28} />
                  </div>
                  <Link
                    href={`/${locale}/category/${sport.slug}`}
                    className="p-3 bg-slate-900 border border-white/10 rounded-full hover:bg-orange-600 hover:border-orange-500 transition-all duration-300"
                  >
                    <ArrowUpRight size={20} className={isAr ? "rotate-[-90deg]" : ""} />
                  </Link>
                </div>

                <h2 className="text-4xl font-black uppercase italic mb-4 tracking-tighter group-hover:text-orange-500 transition-colors">
                  {sport.name}
                </h2>

                <div className="flex gap-6 mb-10 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 border-b border-white/5 pb-6">
                  <span className="flex items-center gap-2">
                    <Trophy size={14} className="text-orange-600" /> 
                    {sport.subcategories?.length || 0} {t("stats.leagues")}
                  </span>
                  <span className="flex items-center gap-2">
                    <Users size={14} className="text-orange-600" /> 
                    {sport.threads?.length || 0} {t("stats.topics")}
                  </span>
                </div>

                <div className="space-y-4">
                  <p className="text-[10px] font-black text-slate-600 uppercase tracking-[0.25em] mb-4">
                    {t("popularLeagues")}
                  </p>
                  <div className="flex flex-wrap gap-2.5">
                    {sport.subcategories?.slice(0, 4).map((league: any) => (
                      <Link
                        key={league.documentId || league.id}
                        href={`/${locale}/category/${league.slug}`}
                        className="text-[11px] font-black uppercase tracking-wider bg-white/5 border border-white/5 px-4 py-2 rounded-xl hover:bg-orange-600 hover:text-white hover:border-orange-500 transition-all duration-300"
                      >
                        {league.name}
                      </Link>
                    ))}
                    {sport.subcategories?.length > 4 && (
                      <span className="text-[11px] font-black text-slate-500 p-2 italic">
                        +{sport.subcategories.length - 4} {t("more")}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Decorative Background Text */}
              <span className="absolute -bottom-8 left-[-10%] text-9xl font-black text-white/[0.03] uppercase italic select-none pointer-events-none whitespace-nowrap group-hover:text-orange-500/[0.05] transition-colors duration-700">
                {sport.name}
              </span>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}