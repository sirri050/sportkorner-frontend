import { Play, Tv } from "lucide-react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import Link from "next/link";

export default function SpotlightVideo({ data, title, locale }: { data: any, title: string, locale: string }) {
  if (!data) return null;
  const t = useTranslations("SpotlightGrid");

  return (
    <Link
      href={`/${locale}/spotlights/${data.id}`}
      className="block glass rounded-[2rem] overflow-hidden border border-white/5 group hover:border-brand-primary/40 transition-all duration-300"
    >
      <div className="p-5 flex items-center justify-between border-b border-white/5">
        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">
          {title}
        </h3>
        <Tv size={14} className="text-orange-500" />
      </div>

      <div className="relative aspect-video bg-slate-900">
        {data.coverImage && (
          <Image
            src={process.env.NEXT_PUBLIC_STRAPI_MEDIA_URL + data.coverImage.url}
            className="w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-500"
            alt={data.title || "Video"}
            fill
            loading="lazy"
          />
        )}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="bg-orange-600 p-4 rounded-full shadow-2xl shadow-orange-950/50 group-hover:scale-110 transition-transform">
            <Play size={20} fill="white" className="text-white" />
          </div>
        </div>
      </div>

      <div className="p-5">
        <h4 className="font-bold text-sm leading-tight mb-1 group-hover:text-orange-500 transition-colors">
          {data.title}
        </h4>
        <p className="text-[10px] text-slate-500 font-medium uppercase tracking-wider">
          {t("featured")} {data.playerName}
        </p>
      </div>
    </Link>
  );
}