import { fetchStrapi } from "@/lib/strapi";
import Link from "next/link";
import Image from "next/image";
import { Clock, ArrowUpRight, Newspaper } from "lucide-react";
import { getLocale, getTranslations } from "next-intl/server";

export default async function NewsGrid() {
  const locale = await getLocale();
  const t = await getTranslations("Home");
  const isAr = locale === "ar";

  // Fetch the latest 6 news items
  const res = await fetchStrapi("news", {
    locale,
    sort: "createdAt:desc",
    pagination: { limit: 8 },
    populate: ["coverImage"],
  });

  const newsItems = res.data || [];

  if (newsItems.length === 0) return null;

  return (
    <section className="space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-6 w-1 bg-orange-600 rounded-full" />
          <h2 className="text-2xl md:text-4xl font-black uppercase italic tracking-tighter">
            {t("latest")} <span className="text-orange-500">{t("news")}</span>
          </h2>
        </div>
        <Link
          href={`/${locale}/news`}
          className="text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-orange-500 transition-colors flex items-center gap-2"
        >
          {t("viewAll")} <ArrowUpRight size={14} />
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {newsItems.map((item: any, index: number) => {
          const hasImage = !!item.coverImage?.url;

          return (
            <Link
              key={item.documentId || item.id}
              href={item.link || `/${locale}/news/${item.slug}`}
              target={item.link ? "_blank" : "_self"}
              className="group glass rounded-[2.5rem] overflow-hidden border border-white/5 hover:border-orange-500/30 transition-all flex flex-col"
            >
              {/* Image Container */}
              <div className="relative aspect-[16/10] overflow-hidden">
                {hasImage ? (
                  <Image
                    src={process.env.NEXT_PUBLIC_STRAPI_MEDIA_URL + item.coverImage.url}
                    alt={item.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 768px) 100vw, 33vw"
                    unoptimized // Use your finalized image strategy here
                  />
                ) : (
                  /* Branded Placeholder for No Image */
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-slate-900 to-slate-950">
                    <Newspaper size={40} className="text-slate-800 mb-2" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-700">
                      SportKorner News
                    </span>
                    {/* Subtle grid pattern for aesthetic */}
                    <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />

                {/* Badge for High Priority */}
                {item.priority > 5 && (
                  <div className="absolute top-4 start-4 bg-orange-600 text-white text-[8px] font-black uppercase px-2 py-1 rounded-md italic">
                    Hot
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <h3 className="text-lg font-bold leading-tight group-hover:text-orange-500 transition-colors line-clamp-2">
                  {item.title}
                </h3>

                <div className="flex items-center justify-between pt-2 border-t border-white/5">
                  <span className="flex items-center gap-1.5 text-[10px] font-bold text-slate-500 uppercase">
                    <Clock size={12} className="text-orange-600" />
                    {new Date(item.createdAt).toLocaleDateString(locale)}
                  </span>
                  <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-orange-600 transition-colors">
                    <ArrowUpRight size={14} className="text-slate-400 group-hover:text-white" />
                  </div>
                </div>
              </div>
            </Link>
          )
        })}
      </div>
    </section>
  );
}