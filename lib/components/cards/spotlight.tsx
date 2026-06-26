import Image from "next/image";
import Link from "next/link";
import { Sparkles } from "lucide-react";

export default function SpotlightCard({ item, isPriority = false }: { item: any, isPriority?: boolean }) {
    const hasImage = !!item.coverImage?.url;

    return (
        <Link
            href={"#"} //{`/spotlights/${item.id}`}
            className="group relative block aspect-[16/9] overflow-hidden rounded-[2.5rem] bg-slate-900 shadow-2xl transition-transform active:scale-95"
        >
            {hasImage ? (
                <Image
                    src={item.coverImage.url}
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

            {/* Aesthetic Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />

            {/* Content */}
            <div className="absolute bottom-0 p-8 md:p-12 space-y-4 w-full">
                <span className="inline-block bg-orange-600 text-white text-[10px] font-black uppercase px-3 py-1 rounded-full italic tracking-widest shadow-lg">
                    {item.category?.name || "Spotlight"}
                </span>
                <h2 className={`font-black uppercase italic tracking-tighter leading-none text-white group-hover:text-orange-500 transition-colors ${isPriority ? 'text-3xl md:text-5xl' : 'text-2xl md:text-3xl'}`}>
                    {item.title}
                </h2>
            </div>
        </Link>
    );
}