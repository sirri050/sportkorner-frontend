import { getTournaments } from "@/lib/actions/tournaments";
import TournamentCard from "@/lib/components/cards/tournament";
import { getLocale, getTranslations } from "next-intl/server";
import { Trophy, Home, Globe } from "lucide-react";
import Link from "next/link";
import { Metadata } from "next";

// --- DYNAMIC SEO ---
export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const isAr = locale === 'ar';

  return {
    title: isAr ? "البطولات والمسابقات | سبورت كورنر" : "Tournaments & Leagues | SportKorner",
    description: isAr
      ? "تابع نتائج وترتيب أهم البطولات الكروية والرياضية في تونس والعالم."
      : "Follow results and standings for the most important sports tournaments in Tunisia and globally.",
    alternates: {
      canonical: `/${locale}/tournaments`,
    }
  };
}

export default async function TournamentsPage() {
  const locale = await getLocale();
  const t = await getTranslations("Tournaments");
  const tournaments = await getTournaments(locale);
  const isAr = locale === 'ar';

  // --- JSON-LD FOR TOURNAMENTS (EventSeries) ---
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "itemListElement": tournaments?.map((t: any, index: number) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": t.name,
      "url": `https://sportkorner.com/${locale}/tournaments/${t.slug}`
    }))
  };

  return (
    <main className="max-w-7xl mx-auto py-16 px-4" dir={isAr ? 'rtl' : 'ltr'}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Header Section */}
      <header className="mb-16 space-y-4 border-b border-white/5 pb-12">
        <div className="flex items-center gap-3 text-orange-500 mb-2">
          <Globe size={20} className="animate-spin-slow" />
          <span className="text-[10px] font-black uppercase tracking-[0.4em]">
            {t('globalCoverage') || "Global Coverage"}
          </span>
        </div>

        <h1 className="text-5xl md:text-8xl font-black uppercase italic tracking-tighter leading-[0.85] text-white">
          {t('title')} <span className="text-orange-500">{t('subtitle')}</span>
        </h1>

        <p className="text-slate-400 font-medium max-w-2xl text-lg leading-relaxed">
          {t('description')}
        </p>
      </header>

      {/* Tournament Content */}
      {tournaments && tournaments.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {tournaments.map((tournament: any) => (
            <TournamentCard
              key={tournament.documentId || tournament.id}
              item={tournament}
            //locale={locale} 
            />
          ))}
        </div>
      ) : (
        /* Enhanced Empty State */
        <div className="relative overflow-hidden flex flex-col items-center justify-center py-32 px-6 text-center glass rounded-[4rem] border border-white/5 bg-white/[0.01] shadow-2xl">
          {/* Background Decoration */}
          <Trophy size={300} className="absolute -bottom-20 -right-20 text-white/[0.02] -rotate-12 pointer-events-none" />

          <div className="relative mb-10">
            <div className="absolute inset-0 bg-orange-600 blur-[60px] opacity-20 rounded-full" />
            <Trophy size={100} className="text-slate-800 opacity-20 relative z-10" />
            <Trophy size={50} className="text-orange-600 absolute inset-0 m-auto animate-bounce" />
          </div>

          <h2 className="text-3xl font-black uppercase italic tracking-tighter mb-4 text-white">
            {t('empty.title')}
          </h2>
          <p className="text-slate-500 max-w-md mb-12 leading-relaxed font-medium text-lg">
            {t('empty.description')}
          </p>

          <Link
            href={`/${locale}`}
            className="group flex items-center gap-3 bg-white text-black hover:bg-orange-600 hover:text-white px-12 py-5 rounded-[2rem] font-black uppercase text-xs transition-all shadow-xl shadow-orange-950/20"
          >
            <Home size={18} className="group-hover:-translate-y-1 transition-transform" />
            {t('empty.button')}
          </Link>
        </div>
      )}
    </main>
  );
}