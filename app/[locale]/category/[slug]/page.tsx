import { fetchStrapi } from "@/lib/strapi";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight, Trophy, Hash, MessageSquarePlus } from "lucide-react";
import ThreadCard from "@/lib/components/cards/thread";
import Sidebar from "@/lib/components/layout/sidebar";
import { getTranslations, getLocale } from "next-intl/server";
import { Metadata } from "next";

// --- DYNAMIC SEO ---
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const locale = await getLocale();
  
  const response = await fetchStrapi("categories", {
    locale,
    filters: { slug: { $eq: slug } },
  });

  const category = response.data?.[0];
  if (!category) return { title: "Category Not Found" };

  return {
    title: category.name,
    description: `Join the conversation about ${category.name} on SportKorner. Latest threads, news, and community analysis.`,
    alternates: {
      canonical: `/${locale}/category/${slug}`,
    }
  };
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const locale = await getLocale();
  const t = await getTranslations("CategoryPage");
  const isAr = locale === 'ar';

  // 1. Fetch Category with parent info for breadcrumbs
  const categoryRes = await fetchStrapi("categories", {
    locale: locale,
    filters: { slug: { $eq: slug } },
    populate: ["parent", "subcategories"],
  });

  const category = categoryRes.data?.[0];
  if (!category) notFound();

  const isSubCategory = !!category.parent;
  const subcategories = category.subcategories || [];

  // 2. Fetch Threads for this specific category
  const threadsRes = await fetchStrapi("threads", {
    locale: locale,
    filters: {
      categories: { slug: { $eq: slug } },
    },
    populate: ["author", "categories", "posts"],
    sort: ["createdAt:desc"],
  });

  const threads = threadsRes.data || [];

  // --- JSON-LD for Breadcrumbs (Crucial for SEO) ---
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": `https://sportkorner.com/${locale}` },
      { "@type": "ListItem", "position": 2, "name": "The Arena", "item": `https://sportkorner.com/${locale}/category` },
      ...(isSubCategory ? [{ "@type": "ListItem", "position": 3, "name": category.parent.name, "item": `https://sportkorner.com/${locale}/category/${category.parent.slug}` }] : []),
      { "@type": "ListItem", "position": isSubCategory ? 4 : 3, "name": category.name }
    ]
  };

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 py-12" dir={isAr ? 'rtl' : 'ltr'}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-500 mb-8 overflow-x-auto whitespace-nowrap pb-2">
        <Link href={`/${locale}`} className="hover:text-orange-500 transition-colors">
          {t("breadcrumbs.home")}
        </Link>
        <ChevronRight size={12} className={isAr ? "rotate-180" : ""} />
        <Link href={`/${locale}/category`} className="hover:text-orange-500 transition-colors">
          {t("breadcrumbs.arena")}
        </Link>
        <ChevronRight size={12} className={isAr ? "rotate-180" : ""} />
        
        {isSubCategory && (
          <>
            <Link
              href={`/${locale}/category/${category.parent.slug}`}
              className="hover:text-orange-500 transition-colors"
            >
              {category.parent.name}
            </Link>
            <ChevronRight size={12} className={isAr ? "rotate-180" : ""} />
          </>
        )}
        <span className="text-slate-200">{category.name}</span>
      </nav>

      <div className="flex flex-col lg:flex-row gap-10">
        <div className="flex-1 space-y-8">
          
          {/* Header Card */}
          <div className="relative overflow-hidden glass p-10 md:p-14 rounded-[3rem] border border-white/5 shadow-2xl bg-white/[0.01]">
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-orange-600/20 p-2.5 rounded-xl border border-orange-500/20">
                  <Trophy size={20} className="text-orange-500" />
                </div>
                <span className="text-xs font-black text-orange-500 uppercase tracking-widest">
                  {isSubCategory ? t("hubs.league") : t("hubs.sport")}
                </span>
              </div>

              <h1 className="text-5xl md:text-7xl font-black uppercase italic tracking-tighter leading-none mb-6">
                {category.name}
              </h1>

              <p className="text-slate-400 max-w-2xl text-lg leading-relaxed font-medium">
                {t("description", { name: category.name })}
              </p>
            </div>

            {/* Background Decoration */}
            <span className="absolute -bottom-8 right-[-10%] text-[10rem] md:text-[14rem] font-black text-white/[0.02] uppercase italic select-none pointer-events-none whitespace-nowrap">
              {category.name}
            </span>
          </div>

          {/* Sub-Category / League Switcher */}
          {!isSubCategory && subcategories.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 px-1">
                {t("exploreLeagues")}
              </h3>
              <div className="flex flex-wrap gap-3">
                {subcategories.map((sub: any) => (
                  <Link
                    key={sub.documentId || sub.id}
                    href={`/${locale}/category/${sub.slug}`}
                    className="flex items-center gap-2.5 bg-slate-900 border border-white/5 px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-tight hover:bg-orange-600 hover:text-white hover:border-orange-500 transition-all group"
                  >
                    <Hash size={14} className="text-slate-600 group-hover:text-white/30" />
                    {sub.name}
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Threads List Header */}
          <div className="flex items-center justify-between border-b border-white/5 pb-6 mt-12">
            <h2 className="font-black uppercase tracking-tighter text-2xl italic">
              {t("recent")} <span className="text-orange-500">{t("discussions")}</span>
            </h2>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black text-slate-500 bg-white/5 px-4 py-1.5 rounded-full uppercase tracking-widest">
                {threads.length} {t("stats.threads")}
              </span>
            </div>
          </div>

          {/* Threads Content */}
          <div className="space-y-6">
            {threads.length > 0 ? (
              threads.map((thread: any) => (
                <ThreadCard key={thread.documentId || thread.id} thread={thread} />
              ))
            ) : (
              <div className="glass p-20 text-center rounded-[3rem] border border-dashed border-white/10 bg-white/[0.01]">
                <div className="mb-6 opacity-20">
                  <MessageSquarePlus size={64} className="mx-auto" />
                </div>
                <p className="text-slate-500 font-black uppercase tracking-widest text-xs italic mb-8">
                  {t("empty.message")}
                </p>
                <Link
                  href={`/${locale}/new-thread`}
                  className="inline-flex items-center gap-2 bg-orange-600 px-10 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-orange-500 transition-all shadow-xl shadow-orange-950/20"
                >
                  <MessageSquarePlus size={16} />
                  {t("empty.button")}
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <aside className="lg:w-80 space-y-8">
            <Sidebar locale={locale} />
        </aside>
      </div>
    </main>
  );
}