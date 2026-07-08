import Image from "next/image";
import Link from "next/link";
import { Sparkles } from "lucide-react";

export default function SpotlightCard({
  item,
  isPriority = false,
}: {
  item: any;
  isPriority?: boolean;
}) {
  const hasImage = !!item.coverImage?.url;

  return (
    <Link
      href={`/spotlights/${item.slug}`}
      className="group relative block aspect-[16/9] overflow-hidden rounded-2xl md:rounded-[2.5rem] bg-slate-900 shadow-2xl active:scale-[0.98]"
    >
      {hasImage ? (
        <Image
          src={`${process.env.NEXT_PUBLIC_STRAPI_MEDIA_URL}${item.coverImage.url}`}
          alt={item.title}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-110"
          priority={isPriority}
          unoptimized
        />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-orange-950/20 to-slate-950">
          <Sparkles size={48} className="text-orange-600/20" />
        </div>
      )}

      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent opacity-80 transition-opacity group-hover:opacity-90" />

      {/* Content */}
      <div className="absolute bottom-0 w-full space-y-2 p-4 sm:p-6 md:p-8 lg:p-10">
        <span className="inline-block rounded-full bg-orange-600 px-2.5 py-1 text-[9px] font-black uppercase tracking-widest text-white shadow-lg sm:px-3 sm:text-[10px]">
          {item.category?.name || "Spotlight"}
        </span>

        <h2
          className={`line-clamp-2 font-black italic uppercase leading-tight tracking-tight text-white transition-colors group-hover:text-orange-500 ${
            isPriority
              ? "text-lg sm:text-2xl md:text-4xl lg:text-5xl"
              : "text-base sm:text-xl md:text-2xl lg:text-3xl"
          }`}
        >
          {item.title}
        </h2>
      </div>
    </Link>
  );
}