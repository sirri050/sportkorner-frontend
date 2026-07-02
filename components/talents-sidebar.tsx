import Link from "next/link";
import Image from "next/image";
import { ChevronRight, Users } from "lucide-react";
import { fetchStrapi } from "@/lib/strapi";

async function TalentSideBar({
    currentTalentId,
    type,
    locale,
}: {
    currentTalentId: string;
    type: string;
    locale: string;
}) {
    const res = await fetchStrapi("spotlights", {
        locale,
        filters: {
            type,
            id: {
                $ne: currentTalentId,
            },
        },
        populate: ["coverImage"],
        sort: ["playerName:asc"],
    });

    const talents = res.data || [];

    const visibleTalents = talents.slice(0, 10);
    const hasMore = talents.length > 2;

    return (
        <div className="rounded-3xl border border-white/10 bg-slate-900/80 backdrop-blur-sm overflow-hidden">
            {/* Header */}
            <div className="px-6 py-5 border-b border-white/10">
                <div className="flex items-center gap-3">
                    <div className="size-10 rounded-xl bg-orange-500/10 flex items-center justify-center">
                        <Users className="size-5 text-orange-500" />
                    </div>

                    <div>
                        <p className="text-[10px] uppercase tracking-[0.25em] text-slate-500 font-bold">
                            Talent Spotlight
                        </p>

                        <h3 className="text-white font-black uppercase italic text-lg">
                            {type === "legend" ? "Legends" : "Rising Stars"}
                        </h3>
                    </div>
                </div>
            </div>

            {/* Players */}
            <div className="divide-y divide-white/5">
                {visibleTalents.map((talent: any) => (
                    <Link
                        key={talent.id}
                        href={`/spotlights/${talent.id}`}
                        className="flex items-center gap-3 px-5 py-3 hover:bg-white/5 transition group"
                    >
                        <div className="relative h-12 w-12 rounded-xl overflow-hidden bg-slate-800 flex-shrink-0">
                            {talent.coverImage?.url ? (
                                <Image
                                    src={
                                        process.env.NEXT_PUBLIC_STRAPI_MEDIA_URL +
                                        talent.coverImage.url
                                    }
                                    alt={talent.playerName}
                                    fill
                                    className="object-cover"
                                />
                            ) : (
                                <div className="h-full w-full bg-slate-700" />
                            )}
                        </div>

                        <div className="flex-1 min-w-0">
                            <h4 className="text-sm font-bold text-white truncate group-hover:text-orange-400 transition">
                                {talent.playerName}
                            </h4>

                            <p className="text-xs text-slate-500 truncate">
                                {talent.title}
                            </p>
                        </div>

                        <ChevronRight className="size-4 text-slate-600 group-hover:text-orange-500 transition" />
                    </Link>
                ))}
            </div>

            {/* Footer */}
            {hasMore && (
                <div className="p-5 border-t border-white/10">
                    <Link
                        href={`/talents?type=${type}`}
                        className="w-full inline-flex items-center justify-center gap-2 rounded-xl border border-orange-500/30 bg-orange-500/10 py-3 text-sm font-bold uppercase tracking-wide text-orange-400 hover:bg-orange-500 hover:text-white transition"
                    >
                        {locale === "ar"
                            ? type === "legend"
                                ? "عرض جميع الأساطير"
                                : "عرض جميع النجوم الصاعدة"
                            : `View All ${type === "legend" ? "Legends" : "Rising Stars"}`}

                        <ChevronRight className="size-4" />
                    </Link>
                </div>
            )}
        </div>
    );
}

export default TalentSideBar