// @/components/widgets/WriteArticleCTA.tsx
import { PenSquare } from "lucide-react";
import Link from "next/link";
import { getTranslations } from "next-intl/server";

export default async function WriteArticleCTA() {
  const t = await getTranslations("Articles");

  return (
    <div className="glass rounded-[2rem] p-6 border border-orange-500/20 bg-orange-500/5 overflow-hidden relative group">
      <div className="relative z-10">
        <h3 className="text-lg font-black italic uppercase leading-tight mb-2">
          {t("ctaTitle")}
        </h3>
        <p className="text-xs text-slate-400 mb-4 leading-relaxed">
          {t("ctaDesc")}
        </p>
        <Link 
          href="/articles/create" 
          className="flex items-center justify-center gap-2 w-full py-3 bg-orange-600 hover:bg-orange-500 text-white rounded-xl text-xs font-black uppercase transition-all"
        >
          <PenSquare size={16} />
          {t("ctaButton")}
        </Link>
      </div>
      <PenSquare className="absolute -bottom-4 -right-4 size-24 text-orange-500/10 -rotate-12 group-hover:rotate-0 transition-transform duration-500" />
    </div>
  );
}