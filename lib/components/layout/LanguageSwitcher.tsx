"use client";

import { useLocale } from "next-intl";
import { Languages } from "lucide-react";
import { usePathname, useRouter } from "@/i18n/navigation";
// ⚠️ IMPORTANT: Import these directly from your local navigation config file, 
// NOT from "next/navigation". e.g., "@/navigation" or "@/i18n/routing"


export default function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const handleLanguageChange = (newLocale: "en" | "ar") => {
    // next-intl's router understands whether to inject or strip the prefix 
    // automatically based on your config rules!
    router.push(pathname, { locale: newLocale });
  };

  return (
    <div className="flex items-center gap-1 bg-slate-900 border border-white/5 p-1 rounded-xl">
      <button
        onClick={() => handleLanguageChange("en")}
        className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase transition-all ${locale === "en"
          ? "bg-brand-primary text-white shadow-lg shadow-orange-950/40"
          : "text-slate-500 hover:text-slate-300"
          }`}
      >
        EN
      </button>
      <button
        onClick={() => handleLanguageChange("ar")}
        className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase transition-all ${locale === "ar"
          ? "bg-brand-primary text-white shadow-lg shadow-orange-950/40"
          : "text-slate-500 hover:text-slate-300"
          }`}
      >
        AR
      </button>
    </div>
  );
}