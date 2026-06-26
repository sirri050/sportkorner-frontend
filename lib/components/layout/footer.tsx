import Link from "next/link";
import { Trophy, Twitter, Instagram, Github, Mail } from "lucide-react";
import { useTranslations } from "next-intl";

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const t = useTranslations("Footer");

  return (
    <footer className="bg-slate-950 border-t border-white/5 pt-16 pb-8 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Column 1: Brand & Bio */}
          <div className="space-y-6">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="bg-orange-600 p-1.5 rounded-lg">
                <Trophy size={20} className="text-white" />
              </div>
              <span className="text-xl font-black tracking-tighter uppercase italic">
                Sport<span className="text-orange-500">Korner</span>
              </span>
            </Link>
            <p className="text-slate-500 text-sm leading-relaxed font-medium">
              {t("description")}
            </p>
            <div className="flex gap-4">
              <Link
                href="#"
                className="text-slate-600 hover:text-orange-500 transition-colors"
              >
                <Twitter size={20} />
              </Link>
              <Link
                href="#"
                className="text-slate-600 hover:text-orange-500 transition-colors"
              >
                <Instagram size={20} />
              </Link>
              <Link
                href="#"
                className="text-slate-600 hover:text-orange-500 transition-colors"
              >
                <Github size={20} />
              </Link>
            </div>
          </div>

          {/* Column 2: Quick Navigation */}
          <div>
            <h4 className="text-white font-black uppercase tracking-widest text-xs mb-6 italic">
              {t("sections.arena")}
            </h4>
            <ul className="space-y-4">
              <li>
                <Link
                  href="/category"
                  className="text-slate-500 hover:text-white text-sm font-bold transition-colors uppercase"
                >
                  {t("links.allSports")}
                </Link>
              </li>
              <li>
                <Link
                  href="/category/football"
                  className="text-slate-500 hover:text-white text-sm font-bold transition-colors uppercase"
                >
                  {t("links.football")}
                </Link>
              </li>
              <li>
                <Link
                  href="/category/basketball"
                  className="text-slate-500 hover:text-white text-sm font-bold transition-colors uppercase"
                >
                  {t("links.basketball")}
                </Link>
              </li>
              <li>
                <Link
                  href="/search?q=live"
                  className="text-slate-500 hover:text-white text-sm font-bold transition-colors uppercase"
                >
                  {t("links.liveScores")}
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Community */}
          <div>
            <h4 className="text-white font-black uppercase tracking-widest text-xs mb-6 italic">
              {t("sections.community")}
            </h4>
            <ul className="space-y-4">
              <li>
                <Link
                  href="/register"
                  className="text-slate-500 hover:text-white text-sm font-bold transition-colors uppercase"
                >
                  {t("links.joinNow")}
                </Link>
              </li>
              <li>
                <Link
                  href="/login"
                  className="text-slate-500 hover:text-white text-sm font-bold transition-colors uppercase"
                >
                  {t("links.signIn")}
                </Link>
              </li>
              <li>
                <Link
                  href="/new-thread"
                  className="text-slate-500 hover:text-white text-sm font-bold transition-colors uppercase"
                >
                  {t("links.startTopic")}
                </Link>
              </li>
              <li>
                <Link
                  href="/world-cup"
                  className="text-slate-500 hover:text-white text-sm font-bold transition-colors uppercase"
                >
                  {t("links.worldcup")}
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Support & Legal */}
          <div>
            <h4 className="text-white font-black uppercase tracking-widest text-xs mb-6 italic">
              {t("sections.support")}
            </h4>
            <div className="space-y-4">
              <Link
                href="mailto:support@sportkorner.com"
                className="flex items-center gap-3 bg-white/5 border border-white/5 p-4 rounded-2xl group hover:border-orange-500/50 transition-all"
              >
                <Mail size={18} className="text-orange-500" />
                <span className="text-xs font-black text-slate-300 group-hover:text-white transition-colors">
                  {t("links.contact")}
                </span>
              </Link>
              <div className="pt-2 flex flex-col gap-2">
                <Link
                  href="#"
                  className="text-[10px] font-bold text-slate-600 hover:text-slate-400 uppercase tracking-widest"
                >
                  {t("links.privacy")}
                </Link>
                <Link
                  href="#"
                  className="text-[10px] font-bold text-slate-600 hover:text-slate-400 uppercase tracking-widest"
                >
                  {t("links.terms")}
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-[10px] font-black text-slate-600 uppercase tracking-[0.2em] text-center md:text-start">
            © {currentYear} {t("copyright")}
          </p>
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-2 text-[10px] font-black text-slate-600 uppercase tracking-widest">
              <div className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
              {t("status")}
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
