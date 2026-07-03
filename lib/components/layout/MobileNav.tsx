"use client";

import { useState } from "react";
import {
  Menu,
  LayoutGrid,
  PlusCircle,
  LogIn,
  User,
  Trophy,
  Search,
  LogOut,
  Rss,
  Medal,
} from "lucide-react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"; // Adjust path based on your setup
import LanguageSwitcher from "./LanguageSwitcher";
import { logoutAction } from "@/lib/actions/auth";

export default function MobileNav({ user }: { user: any }) {
  const [open, setOpen] = useState(false);
  const t = useTranslations("Header");

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger>
        <span className="lg:hidden p-2 text-slate-400 hover:text-white transition-colors">
          <Menu size={26} />
        </span>
      </SheetTrigger>

      {/* side="left" for LTR and automatically flips for RTL in most Radix setups */}
      <SheetContent
        side="right"
        className="w-[300px] bg-slate-950 border-white/10 p-0 text-white"
      >
        <SheetHeader className="p-6 border-b border-white/5">
          <SheetTitle className="flex items-center gap-2">
            <div className="bg-brand-primary p-1.5 rounded-lg">
              <Trophy size={18} className="text-white" />
            </div>
            <span className="text-xl font-black tracking-tighter uppercase text-white">
              Sport<span className="text-brand-primary">Korner</span>
            </span>
          </SheetTitle>
        </SheetHeader>

        <div className="flex flex-col h-[calc(100vh-80px)]">
          {/* Main Links */}
          <nav className="flex flex-col p-4 gap-2">
            <Link
              href="/category"
              onClick={() => setOpen(false)}
              className="flex items-center gap-4 p-4 rounded-2xl hover:bg-white/5 text-lg font-black uppercase italic transition-all"
            >
              <LayoutGrid className="text-brand-primary" size={22} />
              {t("theArena")}
            </Link>
              <Link
                href="/tournaments"
                 className="flex items-center gap-4 p-4 rounded-2xl hover:bg-white/5 text-lg font-black uppercase italic transition-all"
              >
                <Trophy size={16} />
                {t("tournaments")}
              </Link>
               <Link
                href="/news"
                 className="flex items-center gap-4 p-4 rounded-2xl hover:bg-white/5 text-lg font-black uppercase italic transition-all"
              >
                <Rss size={16} />
                {t("news")}
              </Link>
               <Link
                href="/articles"
                 className="flex items-center gap-4 p-4 rounded-2xl hover:bg-white/5 text-lg font-black uppercase italic transition-all"
              >
                <Medal size={16} />
                {t("articles")}
              </Link>

               <Link
                href="/world-cup"
                 className="flex items-center gap-4 p-4 rounded-2xl hover:bg-white/5 text-lg font-black uppercase italic transition-all"
              >
                <Medal size={16} />
                {t("worldCup")}
              </Link>

            {user && (
              <Link
                href="/new-thread"
                onClick={() => setOpen(false)}
                className="flex items-center gap-4 p-4 rounded-2xl bg-brand-primary/10 text-brand-primary text-lg font-black uppercase italic"
              >
                <PlusCircle size={22} />
                {t("post")}
              </Link>
            )}
          </nav>

          <div className="mt-auto p-6 border-t border-white/5 space-y-6">
            {/* User Account Section */}
            {user ? (
              <div className="space-y-2">
                <Link
                  href="/profile"
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-3 p-3 rounded-xl border border-white/5 hover:bg-white/5 transition-all"
                >
                  <div className="h-10 w-10 rounded-full bg-brand-primary flex items-center justify-center font-black">
                    {user.username[0].toUpperCase()}
                  </div>
                  <div className="flex flex-col">
                    <span className="font-bold text-sm">{user.username}</span>
                    <span className="text-[10px] text-slate-500 uppercase font-black">
                      View Profile
                    </span>
                  </div>
                </Link>
                <form action={logoutAction}>
                  <button className="w-full flex items-center gap-3 p-3 text-slate-500 hover:text-red-500 transition-colors font-bold text-sm">
                    <LogOut size={18} />
                    Logout
                  </button>
                </form>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                <Link
                  href="/login"
                  onClick={() => setOpen(false)}
                  className="flex items-center justify-center gap-2 p-3 rounded-xl border border-white/10 font-bold text-sm"
                >
                  <LogIn size={16} /> {t("signIn")}
                </Link>
                <Link
                  href="/register"
                  onClick={() => setOpen(false)}
                  className="flex items-center justify-center gap-2 p-3 rounded-xl bg-brand-primary font-black text-sm"
                >
                  {t("joinNow")}
                </Link>
              </div>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
