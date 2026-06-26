import { getLatestNews } from "@/lib/actions/news"; 
import Link from "next/link";
import { getLocale, getTranslations } from "next-intl/server";

export default async function NewsTicker() {
  
  const t = await getTranslations("Widgets");
  const locale = await getLocale();

  const newsItems = await getLatestNews(10,locale); // Fetch more for a better loop

  if (!newsItems.length) return null;
  //console.log(newsItems);
  

  return (
    <div className="relative w-full bg-slate-950 border-b border-white/10 overflow-hidden py-2 flex items-center">
      {/* Static "Breaking" Label */}
      <div className="z-20 bg-slate-950 px-4 flex items-center gap-2 border-e border-white/10 shrink-0">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-500 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500"></span>
        </span>
        <span className="text-[10px] font-black uppercase tracking-widest text-orange-500 whitespace-nowrap">
          {t("liveBreaking")}
        </span>
      </div>

      {/* The Scrolling Track */}
      <div className="relative flex overflow-hidden whitespace-nowrap">
        {/* We repeat the list twice to create a seamless infinite loop */}
        <div className="flex animate-marquee gap-12 items-center px-6">
          {newsItems.map((item: any) => {
             const newsHref = item.link || `/${locale}/news/${item.slug}`;
            return(
            <Link 
              key={item.documentId} 
              href={newsHref}
              className="text-xs font-bold text-slate-300 hover:text-orange-500 transition-colors flex items-center gap-2"
            >
              <span className="text-slate-700">•</span>
              {item.title}
            </Link>
          )})}
        </div>
        
        {/* Duplicate for seamless effect */}
        <div className="flex animate-marquee gap-12 items-center px-6" aria-hidden="true">
          {newsItems.map((item: any) =>{
            
            // If external link exists, use it. Otherwise, point to internal news page.
  const newsHref = item.link || `/${locale}/news/${item.slug}`;
            return(
            <Link 
              key={`dup-${item.documentId}`} 
              href={newsHref}
              className="text-xs font-bold text-slate-300 hover:text-orange-500 transition-colors flex items-center gap-2"
            >
              <span className="text-slate-700">•</span>
              {item.title}
            </Link>
          )})}
        </div>
      </div>

      {/* Edge Fades for better UI */}
      <div className="pointer-events-none absolute inset-y-0 left-12 w-20 bg-gradient-to-r from-slate-950 to-transparent z-10" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-slate-950 to-transparent z-10" />
    </div>
  );
}