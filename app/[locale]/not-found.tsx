"use client";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Trophy, Home, ArrowLeft } from "lucide-react";

export default function NotFound() {
  const { locale } = useParams();
  const isAr = locale === "ar";

  const content = {
    title: isAr ? "خارج الملعب!" : "Out of Bounds!",
    desc: isAr 
      ? "الصفحة التي تبحث عنها غير موجودة أو تم نقلها." 
      : "The page you are looking for doesn't exist or has been moved.",
    button: isAr ? "العودة للرئيسية" : "Back to Home Base",
  };

  return (
    <main className="min-h-[70vh] flex flex-col items-center justify-center px-4 text-center">
      {/* Visual Element */}
      <div className="relative mb-8">
        <h1 className="text-[12rem] md:text-[18rem] font-black text-white/5 leading-none select-none">
          404
        </h1>
        <div className="absolute inset-0 flex items-center justify-center">
          <Trophy size={80} className="text-orange-500 animate-bounce" />
        </div>
      </div>

      {/* Text Content */}
      <div className="space-y-4 max-w-md">
        <h2 className="text-3xl md:text-4xl font-black uppercase italic tracking-tighter">
          {content.title}
        </h2>
        <p className="text-slate-400 font-medium">
          {content.desc}
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col md:flex-row gap-4 mt-10">
        <Link
          href={`/${locale}`}
          className="flex items-center gap-2 bg-orange-600 hover:bg-orange-500 text-white px-8 py-4 rounded-2xl font-black uppercase text-xs transition-all shadow-xl shadow-orange-900/20"
        >
          <Home size={16} />
          {content.button}
        </Link>
        
        <button
          onClick={() => window.history.back()}
          className="flex items-center gap-2 bg-white/5 hover:bg-white/10 text-white px-8 py-4 rounded-2xl font-black uppercase text-xs transition-all border border-white/5"
        >
          <ArrowLeft size={16} className={isAr ? "rotate-180" : ""} />
          {isAr ? "الرجوع للخلف" : "Go Back"}
        </button>
      </div>
    </main>
  );
}