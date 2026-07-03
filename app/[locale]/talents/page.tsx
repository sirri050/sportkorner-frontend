import { fetchStrapi } from "@/lib/strapi";
import { getLocale, getTranslations } from "next-intl/server";
import Link from "next/link";
import Image from "next/image";
import { Star, History, Users } from "lucide-react";

export default async function TalentsPage({
    searchParams,
}: {
    searchParams: Promise<{ type?: string }>;
}) {
    const locale = await getLocale();
    const isAr = locale === "ar";
    const t = await getTranslations("Talents");
    const params = await searchParams;
    const type = params.type;

    const filters: any = {};

    if (type === "legend" || type === "rising_star") {
        filters.type = type;
    }
    if (!filters.type) {
        filters.type = {
            $in: ["legend", "rising_star"]
        };
    }
    const res = await fetchStrapi("spotlights", {
        locale,
        filters,
        populate: ["coverImage"],
        sort: ["playerName:asc"],
    });

    const talents = res.data || [];
    return (
        <main
            className="min-h-screen pb-20"
            dir={isAr ? "rtl" : "ltr"}
        >
            {/* HERO */}
            <section className="relative overflow-hidden border-b border-white/5 bg-gradient-to-b from-slate-900 via-slate-950 to-black py-14">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:42px_42px]" />

                <div className="relative max-w-7xl mx-auto px-4 md:px-16">
                    <div className="inline-flex items-center gap-2 rounded-full bg-orange-500/10 px-4 py-2 text-orange-500 text-xs uppercase tracking-[0.3em] font-black">
                        <Users size={14} />
                        {t("talentDirectory")}
                    </div>

                    <h1 className="mt-6 text-5xl md:text-7xl font-black italic uppercase tracking-tight text-white">
                         {t("sport")}<span className="text-orange-500"> {t("talent")}</span>
                    </h1>

                    <p className="mt-5 max-w-2xl text-slate-400 text-lg">
                       {t("talentDescription")}
                    </p>

                    {/* FILTERS */}

                    <div className="mt-10 flex flex-wrap gap-3">
                        <FilterButton
                            href={`/${locale}/talents`}
                            active={!type}
                        >
                            {t("all")}
                        </FilterButton>

                        <FilterButton
                            href={`/${locale}/talents?type=legend`}
                            active={type === "legend"}
                        >
                            {t("legend")}
                        </FilterButton>

                        <FilterButton
                            href={`/${locale}/talents?type=rising_star`}
                            active={type === "rising_star"}
                        >
                            {t("risingStar")}
                        </FilterButton>
                    </div>
                </div>
            </section>

            {/* GRID */}

            <section className="max-w-7xl mx-auto px-4 md:px-16 py-16">
                {talents.length === 0 ? (
                    <div className="rounded-3xl border border-white/10 bg-slate-900 p-16 text-center">
                        <h2 className="text-2xl font-bold text-white">
                            No talents found
                        </h2>

                        <p className="mt-3 text-slate-400">
                            There are currently no talent profiles available.
                        </p>
                    </div>
                ) : (
                    <div className="grid gap-8 sm:grid-cols-2 xl:grid-cols-3">
                        {talents.map((talent: any) => (
                            <Link
                                key={talent.id}
                                href={`/${locale}/spotlights/${talent.slug}`}
                                className="group flex h-full flex-col overflow-hidden rounded-3xl border border-white/10 bg-slate-900 hover:border-orange-500/40 transition-all duration-300"
                            >
                                {/* IMAGE */}

                                <div className="relative aspect-[3/3] overflow-hidden">
                                    {talent.coverImage?.url ? (
                                        <Image
                                            src={
                                                process.env.NEXT_PUBLIC_STRAPI_MEDIA_URL +
                                                talent.coverImage.url
                                            }
                                            alt={talent.playerName}
                                            fill
                                            unoptimized
                                            className="object-cover transition duration-500 group-hover:scale-105"
                                        />
                                    ) : (
                                        <div className="absolute inset-0 bg-slate-800" />
                                    )}

                                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />

                                    <div className="absolute top-5 left-5">
                                        {talent.type === "legend" ? (
                                            <span className="inline-flex items-center gap-2 rounded-full bg-slate-900/90 px-3 py-1 text-xs font-bold uppercase text-white">
                                                <History size={12} />
                                                {t("legend")}
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center gap-2 rounded-full bg-orange-500 px-3 py-1 text-xs font-bold uppercase text-white">
                                                <Star size={12} />
                                                {t("risingStar")}
                                            </span>
                                        )}
                                    </div>
                                </div>

                                {/* CONTENT */}
                                <div className="flex flex-1 flex-col p-6">
                                    <div>
                                        <h2 className="text-2xl font-black uppercase italic text-white group-hover:text-orange-500 transition">
                                            {talent.playerName}
                                        </h2>

                                        <p className="mt-3 line-clamp-2 text-slate-400">
                                            {talent.title}
                                        </p>
                                    </div>

                                    <div className="mt-auto flex items-center justify-between border-t border-white/5 pt-5">
                                        <span className="text-xs uppercase tracking-wider text-slate-500">
                                            {new Date(talent.createdAt).toLocaleDateString(locale)}
                                        </span>

                                        <span className="font-bold text-orange-500 group-hover:translate-x-1 transition">
                                            {t("viewProfile")} →
                                        </span>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </section>
        </main>
    );
}

function FilterButton({
    href,
    active,
    children,
}: {
    href: string;
    active: boolean;
    children: React.ReactNode;
}) {
    return (
        <Link
            href={href}
            className={`rounded-full px-6 py-3 text-sm font-black uppercase tracking-wider transition ${active
                    ? "bg-orange-600 text-white"
                    : "bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white"
                }`}
        >
            {children}
        </Link>
    );
}