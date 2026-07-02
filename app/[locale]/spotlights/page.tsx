import { getAllSpotlights } from "@/lib/actions/spotlight";
import SpotlightVideo from "@/lib/components/spotlights/widget.spotlights";
import SpotlightProfile from "@/lib/components/spotlights/SpotlightProfile";
import { getLocale, getTranslations } from "next-intl/server";
import Link from "next/link";
import { ChevronLeft, ChevronRight, LayoutGrid } from "lucide-react";

export default async function SpotlightsArchive({
    searchParams,
}: {
    searchParams: Promise<{ page?: string }>;
}) {
    const params = await searchParams;
    const currentPage = Number(params.page) || 1;
    const locale = await getLocale();
    const t = await getTranslations("SpotlightGrid");
    const isAr = locale === "ar";

    const { data: spotlights, meta } = await getAllSpotlights(currentPage, 9, locale);
    const totalPages = meta.pagination.pageCount;
    return (
        <main className="max-w-7xl mx-auto px-4 py-16 space-y-12" dir={isAr ? "rtl" : "ltr"}>
            {/* Header */}
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/5 pb-10">
                <div className="space-y-2">
                    <div className="flex items-center gap-2 text-orange-500 font-black uppercase text-[10px] tracking-[0.3em]">
                        <LayoutGrid size={14} />
                        {t("archiveLabel") || "Premium Collection"}
                    </div>
                    <h1 className="text-6xl md:text-7xl font-black uppercase italic tracking-tighter leading-none">
                        {t("the")} <span className="text-orange-500">{t("spotlight")}</span>
                    </h1>
                </div>
                <p className="text-slate-500 font-medium max-w-xs text-sm italic">
                    {t("archiveDesc") || "Exploring the legends, rising stars, and iconic moments of world sports."}
                </p>
            </header>

            {/* Dynamic Masonry-Style Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {spotlights.map((item: any, index: number) => {
                    // Logic to decide which component to use based on Strapi "type" field
                    const isVideoType = ["european_highlight", "nba_moment"].includes(item.type);

                    return (
                        <div
                            key={item.id}
                            className={`${index === 0 && currentPage === 1 ? "lg:col-span-2 lg:row-span-1" : ""}`}
                        >
                            {isVideoType ? (
                                <SpotlightVideo
                                    data={item}
                                    title={item.type === 'nba_moment' ? t('titles.nba') : t('titles.football')}
                                    locale={locale}
                                />
                            ) : (
                                <SpotlightProfile
                                    data={item}
                                    type={item.type}
                                    locale={locale}
                                />
                            )}
                        </div>
                    );
                })}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
                <nav className="flex justify-center items-center gap-4 pt-12">
                    {currentPage > 1 && (
                        <Link
                            href={`/${locale}/spotlights?page=${currentPage - 1}`}
                            className="p-4 rounded-2xl bg-white/5 hover:bg-orange-600 transition-colors text-white"
                        >
                            {isAr ? <ChevronRight /> : <ChevronLeft />}
                        </Link>
                    )}

                    <div className="flex gap-2">
                        {[...Array(totalPages)].map((_, i) => (
                            <Link
                                key={i}
                                href={`/${locale}/spotlights?page=${i + 1}`}
                                className={`w-12 h-12 flex items-center justify-center rounded-2xl font-black transition-all ${currentPage === i + 1
                                    ? "bg-orange-600 text-white"
                                    : "bg-white/5 text-slate-500 hover:bg-white/10"
                                    }`}
                            >
                                {i + 1}
                            </Link>
                        ))}
                    </div>

                    {currentPage < totalPages && (
                        <Link
                            href={`/${locale}/spotlights?page=${currentPage + 1}`}
                            className="p-4 rounded-2xl bg-white/5 hover:bg-orange-600 transition-colors text-white"
                        >
                            {isAr ? <ChevronLeft /> : <ChevronRight />}
                        </Link>
                    )}
                </nav>
            )}
        </main>
    );
}