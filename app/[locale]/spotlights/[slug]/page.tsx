import { fetchStrapi } from "@/lib/strapi";
import { BlocksRenderer } from "@strapi/blocks-react-renderer";
import { getLocale, getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import Image from "next/image";
import { Calendar, Share2, Star, History, Play, Trophy } from "lucide-react";
import Sidebar from "@/lib/components/layout/sidebar";
import TalentSideBar from "@/components/talents-sidebar";

export default async function SingleSpotlightPage({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const { slug } = await params;
    const locale = await getLocale();
    const t = await getTranslations("Spotlights");
    const isAr = locale === "ar";

    // Fetch the entry from Strapi - make sure you pull relation payloads
    const res = await fetchStrapi("spotlights", {
        locale,
        filters: { id: slug },
        // populate: ["coverImage", "author", "category"],
        populate: ["coverImage"],
    });

    const article = res.data?.[0];
    if (!article) notFound();

    // Determine target structural layout blueprint (falls back to fallback style)
    const type = article.type || "european_highlight";
    const isProfileType = type === "legend" || type === "rising_star";

    return (
        <main className="min-h-screen pb-20" dir={isAr ? 'rtl' : 'ltr'}>

            {/* 1. POLYMORPHIC HERO HEADER SWITCH */}
            {isProfileType ? (
                /* --- PROFILE TYPE HEADER (Legends & Stars) --- */
                <div className="relative pt-32 pb-16 bg-gradient-to-b from-slate-900 to-slate-950 border-b border-white/5 overflow-hidden">
                    <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff01_1px,transparent_1px),linear-gradient(to_bottom,#ffffff01_1px,transparent_1px)] bg-[size:40px_40px]" />

                    {type === 'legend' ? (
                        <History className="absolute -bottom-10 -right-10 size-96 text-white/[0.01] -rotate-12 pointer-events-none" />
                    ) : (
                        <Star className="absolute -bottom-10 -right-10 size-96 text-orange-500/[0.01] -rotate-12 pointer-events-none" />
                    )}

                    <div className="max-w-7xl mx-auto px-4 md:px-16 relative z-10 flex flex-col md:flex-row items-center gap-8 md:gap-12">
                        <div className="h-40 w-40 md:h-52 md:w-52 rounded-[2.5rem] overflow-hidden border-4 border-white/10 shadow-2xl flex-shrink-0 bg-slate-800">
                            {article.coverImage?.url && (
                                <Image
                                    src={process.env.NEXT_PUBLIC_STRAPI_MEDIA_URL + article.coverImage.url}
                                    alt={article.playerName || "Player profile"}
                                    width={220}
                                    height={220}
                                    priority
                                    unoptimized
                                    className="w-full h-full object-cover"
                                />
                            )}
                        </div>
                        <div className="space-y-4 text-center md:text-start flex-1">
                            <span className={`inline-block text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full ${type === 'legend' ? 'bg-slate-800 text-slate-400' : 'bg-orange-500/10 text-orange-500'}`}>
                                {type === 'legend' ? 'Influence / Legend Edition' : 'Rising Star Profile'}
                            </span>
                            <h1 className="text-4xl md:text-7xl font-black uppercase italic tracking-tighter leading-none text-white">
                                {article.playerName}
                            </h1>
                            <p className="text-orange-500 text-sm font-bold uppercase tracking-wider">{article.title}</p>
                        </div>
                    </div>
                </div>
            ) : (
                /* --- CINEMATIC VIDEO CONTENT TYPE HEADER (Matches Football / NBA styles) --- */
                <div className="relative h-[60vh] md:h-[75vh] w-full overflow-hidden bg-slate-950">
                    {article.coverImage?.url && (
                        <Image
                            src={process.env.NEXT_PUBLIC_STRAPI_MEDIA_URL + article.coverImage.url}
                            alt={article.title}
                            fill
                            priority
                            className="object-cover opacity-40"
                        />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

                    <div className="absolute inset-0 flex items-center justify-center z-20">
                        {article.MediaURL && (
                            <a
                                href={article.MediaURL}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="bg-orange-600 hover:bg-orange-500 p-6 md:p-8 rounded-full shadow-2xl shadow-orange-950/60 hover:scale-110 transition-transform flex items-center justify-center group"
                            >
                                <Play size={32} fill="white" className="text-white translate-x-0.5" />
                            </a>
                        )}
                    </div>

                    <div className="absolute bottom-0 left-0 w-full p-6 md:p-16 z-10">
                        <div className="max-w-7xl mx-auto space-y-4">
                            <span className="inline-flex items-center gap-2 bg-orange-600 text-white text-[10px] font-black uppercase px-4 py-1.5 rounded-full italic tracking-widest">
                                <Trophy size={12} /> {article.category?.name || "Matchday Special"}
                            </span>
                            <h1 className="text-3xl md:text-6xl font-black uppercase italic tracking-tighter leading-none text-white max-w-5xl">
                                {article.title}
                            </h1>
                            <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">
                                {t("featured") || "Featured Artist:"} <span className="text-slate-200">@{article.playerName}</span>
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* 2. SHARED CONTENT FIELD FRAME */}
            <div className="max-w-7xl mx-auto px-4 md:px-16 mt-12 md:mt-16">
                <div className="flex flex-col lg:flex-row gap-12 md:gap-16">

                    {/* Left Column Description Layout */}
                    <div className="flex-1 min-w-0">

                        {/* Meta Stats Row (Only if it's not profile type header) */}
                        {!isProfileType && (
                            <div className="flex items-center gap-4 pb-6 mb-8 border-b border-white/5 text-slate-500 font-bold uppercase text-[10px] tracking-widest">
                                <div className="flex items-center gap-1.5">
                                    <Calendar size={13} />
                                    {new Date(article.createdAt).toLocaleDateString(locale, { dateStyle: 'medium' })}
                                </div>
                            </div>
                        )}

                        {/* Structured Output Render */}
                        <div className="prose prose-invert prose-orange max-w-none 
                            prose-p:text-slate-300 prose-p:text-lg prose-p:leading-relaxed
                            prose-headings:italic prose-headings:font-black prose-headings:uppercase
                            prose-strong:text-white prose-blockquote:border-s-orange-600
                            prose-img:rounded-[2rem] prose-img:shadow-2xl">

                            {article.description ? (
                                <BlocksRenderer content={article.description} />
                            ) : (
                                <p className="italic text-slate-500">Description content details unavailable.</p>
                            )}
                        </div>

                        {/* Interactive Share Row */}
                        <div className="mt-16 pt-8 border-t border-white/5 flex items-center justify-between">
                            <button className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-slate-500 hover:text-orange-500 transition-colors">
                                <Share2 size={16} /> {t("shareArticle") || "Share Selection"}
                            </button>
                        </div>
                    </div>

                    {/* Shared Sidebar Block */}
                    <aside className="lg:w-80 shrink-0">
                        <div className="sticky top-24 space-y-8">
                            {(type=="legend"  || type==="rising_star") ?<TalentSideBar currentTalentId={slug} type={type as string} locale={locale} />:<Sidebar locale={locale} />}
                        </div>
                    </aside>
                </div>
            </div>
        </main>
    );
}

