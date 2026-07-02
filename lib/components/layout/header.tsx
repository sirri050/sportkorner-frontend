import Link from "next/link";
import {
  Trophy,
  Bell,
  LogIn,
  UserPlus,
  LayoutGrid,
  PlusCircle,
  Menu,
  Search,
  Rss,
  Medal,
} from "lucide-react";
import { getMe } from "@/lib/actions/auth";
import HeaderSearch from "./search";
import { getTranslations } from "next-intl/server";
import LanguageSwitcher from "./LanguageSwitcher";
import MobileNav from "./MobileNav";

export default async function Header() {
  const user = await getMe();
  const t = await getTranslations("Header");

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-slate-950/90 backdrop-blur-md text-white">
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        <div className="flex justify-between items-center h-16 sm:h-20">
          {/* Left: Logo & Desktop Nav */}
          <div className="flex items-center gap-4 lg:gap-">
            <Link href="/" className="flex items-center gap-2 group shrink-0">
              <div className="bg-brand-primary p-1.5 rounded-lg group-hover:rotate-6 transition-transform shadow-lg shadow-orange-900/20">
                <Trophy size={20} className="text-white md:size-8" />
              </div>
              <span className="text-lg md:text-xl font-black tracking-tighter uppercase font-heading">
                Sport<span className="text-brand-primary">Korner</span>
              </span>
            </Link>

            <nav className="hidden lg:flex items-center border-s border-white/10 ps-5 gap-3">
              {/* <Link
                href="/arena"
                className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-brand-primary transition-colors"
              >
                <LayoutGrid size={16} />
                {t("theArena")}
              </Link> */}
              <Link
                href="/tournaments"
                className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-brand-primary transition-colors"
              >
                <Trophy size={16} />
                {t("tournaments")}
              </Link>
               <Link
                href="/news"
                className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-brand-primary transition-colors"
              >
                <Rss size={16} />
                {t("news")}
              </Link>
               <Link
                href="/news?category=world-cup"
                className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-brand-primary transition-colors"
              >
                <Medal size={16} />
                {t("worldCup")}
              </Link>
            </nav>
          </div>

          {/* Center: Search (Hidden on mobile, visible on tablet+) */}
          <div className="hidden md:block flex-1 max-w-md mx-8">
            <HeaderSearch />
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-2 sm:gap-4">
            {/* Search Toggle for Mobile Only */}
            <button title="Search" className="md:hidden p-2 text-slate-400 hover:text-white transition-colors">
              <Search size={20} />
            </button>

            <div className="hidden sm:block">
              <LanguageSwitcher />
            </div>

            {user ? (
              <div className="flex items-center gap-2 sm:gap-4">
                <Link
                  href="/new-thread"
                  className="hidden sm:flex items-center gap-2 text-[10px] font-black uppercase tracking-wider bg-brand-primary/10 hover:bg-brand-primary/20 px-4 py-2 rounded-xl border border-brand-primary/20 transition-all text-brand-primary"
                >
                  <PlusCircle size={14} />
                  {t("post")}
                </Link>

                {/* <button className="relative text-slate-400 hover:text-white transition-colors p-1">
                  <Bell size={22} />
                  <span className="absolute top-0.5 end-0.5 bg-brand-primary text-[9px] font-black px-1 rounded-full border-2 border-slate-950">
                    2
                  </span>
                </button> */}

                <Link
                  href="/profile"
                  className="flex items-center gap-2 shrink-0"
                >
                  <div className="h-9 w-9 rounded-full bg-slate-800 border-2 border-white/5 overflow-hidden hover:border-brand-primary transition-all">
                    <div className="w-full h-full flex items-center justify-center font-black text-sm uppercase bg-gradient-to-br from-slate-700 to-slate-900">
                      {user.username[0]}
                    </div>
                  </div>
                </Link>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  href="/login"
                  className="hidden xs:flex text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-white px-3 py-2"
                >
                  {t("signIn")}
                </Link>

                <Link
                  href="/register"
                  className="bg-brand-primary text-white px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-lg shadow-orange-950/20"
                >
                  {t("joinNow")}
                </Link>
              </div>
            )}

            {/* Mobile Menu Button */}
            <MobileNav user={user} />
          </div>
        </div>
      </div>
    </header>
  );
}
