import { fetchStrapi } from "@/lib/strapi";
import { getLocale, getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Trophy, Calendar, Users, Target, ArrowLeft, ChevronRight, Activity } from "lucide-react";
import { Metadata } from "next";
import Sidebar from "@/lib/components/layout/sidebar";

interface Props {
    params: Promise<{ slug: string; locale: string }>;
    searchParams: Promise<{ tab?: string }>;
}

// --- DYNAMIC METADATA ---
export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params;
    const locale = await getLocale();

    const res = await fetchStrapi("tournaments", {
        locale,
        filters: { slug: slug },
    });
    const tournament = res.data?.[0];

    if (!tournament) return { title: "Tournament Not Found" };

    return {
        title: `${tournament.name} | SportKorner`,
        description: tournament.description || `Follow live standings, matches, and stats for ${tournament.name}.`,
        alternates: {
            canonical: `/${locale}/tournaments/${slug}`,
        },
    };
}

export default async function SingleTournamentPage({ params, searchParams }: Props) {
    const { slug } = await params;
    const { tab } = await searchParams;
    const locale = await getLocale();
    const t = await getTranslations("TournamentPage");
    const isAr = locale === "ar";

    // Fetch tournament with relationships (Teams, Standings rows, Matches, News tags)
    const res = await fetchStrapi("tournaments", {
        locale,
        filters: { slug: slug },
        populate: ["logo", "banner", "matches", "standings", "standings.team"],
    });

    const tournament = res.data?.[0];
    if (!tournament) notFound();

    const activeTab = tab || "standings";

    return (
        <main className="min-h-screen pb-20 text-white" dir={isAr ? "rtl" : "ltr"}>
            {/* 1. HERO BANNER HEADER */}
            <div className="relative h-[40vh] w-full overflow-hidden bg-slate-950 border-b border-white/5">
                {tournament.banner?.url ? (
                    <Image
                        src={process.env.NEXT_PUBLIC_STRAPI_MEDIA_URL + tournament.banner.url}
                        alt={tournament.name}
                        fill
                        priority
                        className="object-cover opacity-30 blur-[2px]"
                    />
                ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-orange-950/20" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

                {/* Floating Content */}
                <div className="absolute bottom-0 left-0 w-full p-6 md:p-12 z-10">
                    <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-6 text-center md:text-start">
                        {/* Back Button */}
                        <Link
                            href={`/${locale}/tournaments`}
                            className="absolute top-[-10vh] md:top-[-15vh] inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-slate-400 hover:text-orange-500 transition-colors"
                        >
                            <ArrowLeft size={16} className={isAr ? "rotate-180" : ""} />
                            {t("backToAll") || "Back"}
                        </Link>

                        {/* Tournament Logo */}
                        <div className="w-24 h-24 md:w-32 md:h-32 rounded-[2rem] bg-slate-900/80 border border-white/10 backdrop-blur-md p-4 flex items-center justify-center shadow-2xl shrink-0">
                            {tournament.logo?.url ? (
                                <Image
                                    src={process.env.NEXT_PUBLIC_STRAPI_MEDIA_URL + tournament.logo.url}
                                    alt={`${tournament.name} logo`}
                                    width={100}
                                    height={100}
                                    className="object-contain w-full h-full"
                                />
                            ) : (
                                <Trophy size={48} className="text-orange-500" />
                            )}
                        </div>

                        {/* Title Details */}
                        <div className="space-y-2">
                            <div className="flex items-center justify-center md:justify-start gap-2">
                                <span className="bg-orange-500/10 text-orange-500 text-[10px] font-black uppercase px-3 py-1 rounded-full tracking-wider border border-orange-500/20">
                                    {tournament.season || "Season 2026"}
                                </span>
                                {tournament.isActive && (
                                    <span className="bg-emerald-500/10 text-emerald-500 text-[10px] font-black uppercase px-3 py-1 rounded-full tracking-wider border border-emerald-500/20 flex items-center gap-1.5">
                                        <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                                        LIVE
                                    </span>
                                )}
                            </div>
                            <h1 className="text-4xl md:text-6xl font-black uppercase italic tracking-tighter leading-none">
                                {tournament.name}
                            </h1>
                            <p className="text-slate-400 text-sm max-w-2xl font-medium leading-relaxed">
                                {tournament.description}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* 2. MAIN BENTO METRICS GRID ROW */}
            <div className="max-w-7xl mx-auto px-4 mt-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="glass bg-white/[0.01] border border-white/5 p-5 rounded-2xl flex items-center gap-4">
                        <div className="p-3 bg-orange-600/10 text-orange-500 rounded-xl"><Trophy size={20} /></div>
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-wider text-slate-500">{t("champion") || "Current Holder"}</p>
                            <p className="text-base font-bold uppercase italic text-white">{tournament.currentChampion || "TBD"}</p>
                        </div>
                    </div>
                    <div className="glass bg-white/[0.01] border border-white/5 p-5 rounded-2xl flex items-center gap-4">
                        <div className="p-3 bg-orange-600/10 text-orange-500 rounded-xl"><Users size={20} /></div>
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-wider text-slate-500">{t("teamsCount") || "Teams"}</p>
                            <p className="text-base font-bold text-white">{tournament.totalTeams || "—"}</p>
                        </div>
                    </div>
                    <div className="glass bg-white/[0.01] border border-white/5 p-5 rounded-2xl flex items-center gap-4">
                        <div className="p-3 bg-orange-600/10 text-orange-500 rounded-xl"><Target size={20} /></div>
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-wider text-slate-500">{t("topScorer") || "Top Scorer"}</p>
                            <p className="text-base font-bold text-white">{tournament.topScorer || "—"}</p>
                        </div>
                    </div>
                    <div className="glass bg-white/[0.01] border border-white/5 p-5 rounded-2xl flex items-center gap-4">
                        <div className="p-3 bg-orange-600/10 text-orange-500 rounded-xl"><Calendar size={20} /></div>
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-wider text-slate-500">{t("nextMatch") || "Matchday Stage"}</p>
                            <p className="text-base font-bold text-white uppercase italic text-orange-500">{tournament.currentStage || "Group Stage"}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* 3. SUBPAGE CONTENT TABS CONTROL */}
            <div className="max-w-7xl mx-auto px-4 mt-12">
                <div className="flex flex-col lg:flex-row gap-12">
                    {/* Main Dashboard Panel */}
                    <div className="flex-1 min-w-0">
                        {/* Tab Links */}
                        <div className="flex border-b border-white/5 gap-6 mb-8">
                            <Link
                                href={`?tab=standings`}
                                scroll={false}
                                className={`pb-4 text-xs font-black uppercase tracking-widest border-b-2 transition-all ${activeTab === "standings" ? "border-orange-500 text-white" : "border-transparent text-slate-500 hover:text-slate-300"
                                    }`}
                            >
                                {t("tabs.standings") || "Standings Table"}
                            </Link>
                            <Link
                                href={`?tab=matches`}
                                scroll={false}
                                className={`pb-4 text-xs font-black uppercase tracking-widest border-b-2 transition-all ${activeTab === "matches" ? "border-orange-500 text-white" : "border-transparent text-slate-500 hover:text-slate-300"
                                    }`}
                            >
                                {t("tabs.fixtures") || "Fixtures & Matches"}
                            </Link>
                        </div>

                        {/* TAB CONTENT CONDITIONAL RENDERING */}
                        {activeTab === "standings" ? (
                            <div className="glass border border-white/5 rounded-3xl overflow-hidden bg-white/[0.01]">
                                <div className="overflow-x-auto">
                                    <table className="w-full text-start text-sm border-collapse">
                                        <thead>
                                            <tr className="border-b border-white/5 bg-slate-900/50 text-[10px] font-black uppercase tracking-wider text-slate-400">
                                                <th className="p-4 text-center w-12">#</th>
                                                <th className="p-4 text-start">{t("table.team") || "Team"}</th>
                                                <th className="p-4 text-center w-12">{t("table.played") || "P"}</th>
                                                <th className="p-4 text-center w-12">{t("table.won") || "W"}</th>
                                                <th className="p-4 text-center w-12">{t("table.drawn") || "D"}</th>
                                                <th className="p-4 text-center w-12">{t("table.lost") || "L"}</th>
                                                <th className="p-4 text-center w-16">{t("table.goals") || "GD"}</th>
                                                <th className="p-4 text-center w-16 text-orange-500">{t("table.points") || "PTS"}</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-white/5 font-medium">
                                            {tournament.standings?.length > 0 ? (
                                                tournament.standings.map((row: any, i: number) => (
                                                    <tr key={row.id} className="hover:bg-white/[0.02] transition-colors group">
                                                        <td className="p-4 text-center text-xs font-bold text-slate-500 group-hover:text-white">{i + 1}</td>
                                                        <td className="p-4 text-start font-bold uppercase italic text-white flex items-center gap-3">
                                                            {row.team?.logoUrl && (
                                                                <img src={row.team.logoUrl} className="w-5 h-5 object-contain" alt="" />
                                                            )}
                                                            {row.team?.name || `Team Entry #${row.id}`}
                                                        </td>
                                                        <td className="p-4 text-center text-slate-300">{row.played || 0}</td>
                                                        <td className="p-4 text-center text-emerald-500">{row.won || 0}</td>
                                                        <td className="p-4 text-center text-slate-400">{row.drawn || 0}</td>
                                                        <td className="p-4 text-center text-rose-500">{row.lost || 0}</td>
                                                        <td className="p-4 text-center text-slate-400">{row.goalDifference || 0}</td>
                                                        <td className="p-4 text-center font-black text-orange-500 bg-orange-500/[0.02]">{row.points || 0}</td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr>
                                                    <td colSpan={8} className="p-12 text-center text-xs font-bold text-slate-500 italic">
                                                        {t("table.noData") || "Standings are currently blank or unreleased."}
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        ) : (
                            /* FIXTURES LIST TAB */
                            <div className="space-y-4">
                                {tournament.matches?.length > 0 ? (
                                    tournament.matches.map((match: any) => (
                                        <div key={match.id} className="glass bg-white/[0.01] border border-white/5 rounded-2xl p-5 flex items-center justify-between group hover:border-white/10 transition-all">
                                            <div className="text-start space-y-1">
                                                <span className="text-[9px] font-black uppercase text-slate-500 bg-slate-900 px-2 py-0.5 rounded-full">{match.stage || "Matchday"}</span>
                                                <p className="text-[10px] text-slate-400 font-medium">
                                                    {new Date(match.date).toLocaleDateString(locale, { dateStyle: "short" })}
                                                </p>
                                            </div>
                                            <div className="flex items-center gap-4 font-black uppercase italic text-sm text-center">
                                                <span className="text-end min-w-[100px]">{match.homeTeamName || "Home Team"}</span>
                                                <div className="px-3 py-1.5 bg-slate-900 rounded-xl border border-white/5 font-mono text-xs font-black min-w-[60px] text-orange-500">
                                                    {match.status === "finished" ? `${match.homeScore} - ${match.awayScore}` : "VS"}
                                                </div>
                                                <span className="text-start min-w-[100px]">{match.awayTeamName || "Away Team"}</span>
                                            </div>
                                            <ChevronRight size={14} className="text-slate-600 group-hover:translate-x-0.5 transition-transform" />
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-center py-12 text-xs font-bold text-slate-500 italic border border-dashed border-white/5 rounded-3xl">
                                        {t("fixtures.noData") || "No scheduled matches found for this cycle."}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Sidebar Area */}
                    <aside className="lg:w-80 shrink-0">
                        <div className="sticky top-24 space-y-8">
                            {/* Extra Info Module Box */}
                            <div className="glass bg-orange-600/[0.02] border border-white/5 p-6 rounded-3xl space-y-4">
                                <div className="flex items-center gap-2 text-orange-500">
                                    <Activity size={16} />
                                    <h4 className="text-[10px] font-black uppercase tracking-wider">{t("sidebar.insights") || "Tournament Specs"}</h4>
                                </div>
                                <div className="space-y-3 text-xs font-bold">
                                    <div className="flex justify-between border-b border-white/5 pb-2">
                                        <span className="text-slate-500">{t("specs.region") || "Region"}</span>
                                        <span className="text-white uppercase">{tournament.region || "Global"}</span>
                                    </div>
                                    <div className="flex justify-between border-b border-white/5 pb-2">
                                        <span className="text-slate-500">{t("specs.tier") || "Competition Tier"}</span>
                                        <span className="text-white uppercase">{tournament.tier || "Professional"}</span>
                                    </div>
                                </div>
                            </div>
                            <Sidebar locale={locale} />
                        </div>
                    </aside>
                </div>
            </div>
        </main>
    );
}