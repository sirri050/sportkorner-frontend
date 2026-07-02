import { BlocksRenderer } from "@strapi/blocks-react-renderer";
import { Star, History } from "lucide-react";
import Image from "next/image";
import Link from "next/link"; // Import Link

export default function SpotlightProfile({ data, type, locale }: { data: any, type: 'legend' | 'rising_star', locale: string }) {
  if (!data) return null;

  return (
    <Link
      href={`/${locale}/spotlights/${data.slug}`}
      className="block glass rounded-[2rem] p-6 border border-white/5 relative overflow-hidden group hover:border-brand-primary/40 transition-all duration-300"
    >
      {/* Background Icon Decoration */}
      {type === 'legend' ? (
        <History className="absolute -bottom-4 -right-4 size-24 text-white/[0.02] -rotate-12 group-hover:scale-110 transition-transform duration-500" />
      ) : (
        <Star className="absolute -bottom-4 -right-4 size-24 text-orange-500/[0.03] -rotate-12 group-hover:scale-110 transition-transform duration-500" />
      )}

      <div className="flex items-center gap-4 relative z-10">
        <div className="h-16 w-16 rounded-2xl overflow-hidden border-2 border-white/10 shrink-0">
          <Image
            src={process.env.NEXT_PUBLIC_STRAPI_MEDIA_URL + data.coverImage?.url}
            className="w-full h-full object-cover"
            alt={data.playerName || "Player"}
            width={64}
            height={64}
            loading="lazy"
          />
        </div>
        <div>
          <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full ${type === 'legend' ? 'bg-slate-800 text-slate-400' : 'bg-orange-500/10 text-orange-500'}`}>
            {type === 'legend' ? 'Influence / Legend' : 'Rising Star'}
          </span>
          <h4 className="text-lg font-black italic uppercase leading-none mt-1 group-hover:text-orange-500 transition-colors">
            {data.playerName}
          </h4>
        </div>
      </div>

      <div className="mt-4 text-xs text-slate-400 leading-relaxed line-clamp-3">
        <BlocksRenderer content={data.description} />
      </div>
    </Link>
  );
}