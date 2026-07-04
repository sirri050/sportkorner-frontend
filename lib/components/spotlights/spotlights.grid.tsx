import { getSpotlightByType } from "@/lib/actions/spotlight";
import SpotlightVideo from "./widget.spotlights";
import SpotlightProfile from "./SpotlightProfile";
import { getLocale, getTranslations } from "next-intl/server";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

export default async function SpotlightGrid() {
  const t = await getTranslations("SpotlightGrid");
  const locale = await getLocale();

  // Passing locale to the fetcher ensures we get the right language from Strapi
  const [featured, playOfTheDay, highlight, nba, legend, rising] = await Promise.all([
    getSpotlightByType('Featured_highlight', 1, locale),
    getSpotlightByType('Play_of_the_day', 1, locale),
    getSpotlightByType('european_highlight', 1, locale),
    getSpotlightByType('nba_moment', 1, locale),
    getSpotlightByType('legend', 1, locale),
    getSpotlightByType('rising_star', 1, locale)
  ]);
  const featuredHighlight = [...featured,...highlight];
  // const playOfTheDayHighlight= [...playOfTheDay, ...highlight];
  return (
    <section className="mb-12" dir={locale === 'ar' ? 'rtl' : 'ltr'}>
      {/* Section Header */}
      <div className="flex items-center gap-3 mb-6 px-2">
        <div className="h-8 w-1.5 bg-orange-600 rounded-full" />
        <h2 className="text-2xl font-black uppercase italic tracking-tighter">
          {/* Translation split for "The Spotlight" */}
          {t('the')} <span className="text-orange-500">{t('spotlight')}</span>
        </h2>
      </div>

      {/* Bento Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        {/* Left Column: Football Highlight */}
        <div className="md:col-span-2">
          <SpotlightVideo data={featuredHighlight[0]} title={t('titles.football')} locale={locale} />
        </div>

        {/* Right Column: Legend and NBA */}
        <div className="flex flex-col gap-6">

          <SpotlightProfile data={legend[0]} type="legend" locale={locale} />
          <SpotlightVideo
            data={nba[0]}
            title={t('titles.nba')}
            locale={locale}
          />
        </div>

        {/* Bottom Row */}
        <div className="md:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-1">
            <SpotlightProfile data={rising[0]} type="rising_star" locale={locale} />
          </div>

          {/* GIS Placeholder with translations */}
          <Link
            href={`/${locale}/news?category=world-cup`}
            className="md:col-span-2 group relative overflow-hidden glass rounded-[2rem] border border-orange-500/40 bg-orange-600/5 p-8 flex flex-col items-center justify-center transition-all hover:border-orange-500 hover:bg-orange-600/10 shadow-lg shadow-orange-950/20"
          >
            {/* The "Special Coverage" Label */}
            <div className="absolute top-4 flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500"></span>
              </span>
              <p className="text-orange-500 font-black uppercase text-[10px] tracking-[0.3em]">
                {t('gis.liveCoverage') || "Special Coverage"}
              </p>
            </div>

            <div className="text-center space-y-2 mt-4">
              <h4 className="text-3xl md:text-4xl text-white font-black italic uppercase tracking-tighter group-hover:scale-105 transition-transform">
                FIFA World Cup <span className="text-orange-500">2026</span>
              </h4>
              <p className="text-slate-400 text-xs font-bold uppercase tracking-widest opacity-60 group-hover:opacity-100 transition-opacity">
                {t('gis.viewArticles') || "View Articles & News"}
              </p>
            </div>

            {/* Background Decoration (Subtle World Map or Texture) */}
            <div className="absolute inset-0 opacity-[0.05] pointer-events-none bg-[url('/patterns/world-map.svg')] bg-center bg-no-repeat bg-contain" />
          </Link>
        </div>
      </div>
      {false && <div className="md:col-span-3 flex justify-center pt-4">
        <Link
          href={`/${locale}/spotlights`}
          className="relative overflow-hidden group bg-slate-900 border border-white/5 hover:border-orange-500/50 px-10 py-4 rounded-2xl transition-all shadow-2xl"
        >
          {/* Hover Glow Effect */}
          <div className="absolute inset-0 bg-orange-600/10 opacity-0 group-hover:opacity-100 transition-opacity" />

          <div className="relative flex items-center gap-4">
            <span className="text-sm font-black uppercase italic tracking-widest text-white group-hover:text-orange-500 transition-colors">
              {t('fullArchive') || "Enter the Full Archive"}
            </span>
            <ChevronRight size={18} className="text-orange-600 group-hover:translate-x-1 transition-transform" />
          </div>
        </Link>
      </div>}
    </section>
  );
}