import { Globe, Map as MapIcon, Info, ShieldCheck, ArrowUpRight, MonitorSmartphone, Smartphone, Share, MoreVertical, MonitorDown } from "lucide-react";
import { Metadata } from "next";
import { getTranslations, getLocale } from "next-intl/server";

// --- DYNAMIC METADATA ---
export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("WorldCup");
  const locale = await getLocale();

  return {
    title: t("metadata.title"),
    description: t("metadata.description"),
    alternates: {
      canonical: `/${locale}/world-cup-gis`,
    }
  };
}

export default async function WorldCupGISPage() {
  const t = await getTranslations("WorldCup");
  const locale = await getLocale();
  const isAr = locale === 'ar';

  const mapSubdomain = "https://map.sportkorner.com";
  const secureAppUrl = `${mapSubdomain}?lang=${locale}`;

  return (
    <main className="max-w-7xl mx-auto py-8 md:py-16 px-4 mb-12" dir={isAr ? 'rtl' : 'ltr'}>
      {/* Header Section */}
      <header className="mb-8 md:mb-12 space-y-3 text-center md:text-start">
        <div className="flex items-center justify-center md:justify-start gap-3 text-orange-500 mb-1">
          <Globe size={18} className="flex-shrink-0 animate-pulse" />
          <span className="text-[10px] font-black uppercase tracking-[0.3em]">
            {t("liveGIS") || "Live GIS Platform"}
          </span>
        </div>

        {/* Scaled safely starting from text-3xl on small mobile */}
        <h1 className="text-3xl sm:text-4xl md:text-7xl font-black uppercase italic tracking-tight md:tracking-tighter leading-none break-words">
          <span className="text-orange-500">{t("worldCupMapHeading")}</span>
        </h1>

        <p className="text-slate-400 max-w-3xl text-sm md:text-lg font-medium leading-relaxed mx-auto md:mx-0">
          {t("worldCupMapSubtitle")}
        </p>
      </header>

      {/* The GIS Experience Container */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-10">

        {/* Left Column: Map Portal + App Install Instructions */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          
          {/* Gateway Action Portal */}
          <div className="min-h-[280px] bg-gradient-to-br from-slate-950 via-slate-900 to-orange-950/10 rounded-[2rem] md:rounded-[3rem] border border-white/5 overflow-hidden relative shadow-2xl group flex flex-col items-center justify-center p-6 md:p-8 text-center">
            {/* Background effects */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff02_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />
            <div className="absolute inset-0 bg-radial-gradient from-transparent via-transparent to-slate-950 pointer-events-none" />

            {/* Centered Launch Hub UI */}
            <div className="relative z-10 max-w-md mx-auto space-y-5 my-auto py-4">
              <div className="w-16 h-16 md:w-20 md:h-20 mx-auto rounded-2xl md:rounded-[2rem] bg-orange-600/10 border border-orange-500/20 flex items-center justify-center text-orange-500 shadow-xl shadow-orange-950/30 group-hover:scale-105 group-hover:border-orange-500/50 transition-all duration-500">
                <MapIcon className="w-7 h-7 md:w-9 md:h-9" />
              </div>

              <div className="space-y-2">
                <h2 className="text-xl md:text-3xl font-black tracking-tight uppercase italic text-white leading-tight">
                  {t("launchAppTitle") || "Launch Immersive Map"}
                </h2>
                <p className="text-slate-400 text-xs font-medium leading-relaxed px-2 md:px-4">
                  {t("launchAppDesc") || "Open our standalone high-performance geospatial application to track live tournament dynamics."}
                </p>
              </div>

              <a
                href={secureAppUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-3 w-full sm:w-auto bg-brand-primary hover:bg-orange-600 text-white font-black uppercase text-[11px] tracking-widest px-8 py-4 rounded-xl md:rounded-2xl transition-all shadow-lg shadow-orange-950/40 hover:shadow-orange-500/20 hover:-translate-y-0.5"
              >
                {t("enterExperience") || "Enter Fullscreen App"}
                <ArrowUpRight size={14} />
              </a>
            </div>

            {/* Repositioned Live Badge */}
            <div className="md:absolute static mb-4 md:mb-0 md:top-6 md:right-6 order-first md:order-none bg-slate-900/80 border border-white/10 backdrop-blur-md px-3 py-1.5 rounded-full flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-slate-400 self-center">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Standalone Subdomain Mode
            </div>
          </div>

          {/* Enhanced PWA Download Instructions */}
          <div className="glass p-6 md:p-8 rounded-[1.5rem] md:rounded-[2rem] border border-white/5 bg-slate-900/40 shadow-xl space-y-6">
            
            {/* Header */}
            <div className="flex items-center gap-4 border-b border-white/5 pb-5">
              <div className="p-3 bg-white/5 rounded-2xl text-slate-300 flex-shrink-0">
                <MonitorSmartphone size={28} />
              </div>
              <div>
                <h3 className="text-lg md:text-xl font-black uppercase italic text-white tracking-tight">
                  {t("installAppHeading") || "Install the Web App"}
                </h3>
                <p className="text-xs md:text-sm text-slate-400 font-medium mt-1">
                  {t("installAppSubheading") || "Get the native experience on your device in two easy steps."}
                </p>
              </div>
            </div>

            {/* Step-by-Step Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-4">
              
              {/* iOS Instructions */}
              <div className="space-y-3 bg-white/[0.02] p-4 rounded-xl border border-white/5">
                <h4 className="text-sm font-bold text-slate-200 flex items-center gap-2">
                  <Smartphone size={16} className="text-slate-400" />
                  {t("installSteps.iosTitle") || "iOS (Safari)"}
                </h4>
                <ul className="space-y-2 text-xs text-slate-400 font-medium">
                  <li className="flex items-start gap-2">
                    <span className="text-orange-500 font-black mt-0.5">1.</span>
                    <span>
                      {t("installSteps.iosStep1") || "Tap the Share button"} 
                      <Share size={12} className="inline mx-1 text-slate-300"/> 
                      {t("installSteps.iosStep1b") || "at the bottom."}
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-orange-500 font-black mt-0.5">2.</span>
                    <span>{t("installSteps.iosStep2") || "Scroll down and select 'Add to Home Screen'."}</span>
                  </li>
                </ul>
              </div>

              {/* Android Instructions */}
              <div className="space-y-3 bg-white/[0.02] p-4 rounded-xl border border-white/5">
                <h4 className="text-sm font-bold text-slate-200 flex items-center gap-2">
                  <Smartphone size={16} className="text-slate-400" />
                  {t("installSteps.androidTitle") || "Android (Chrome)"}
                </h4>
                <ul className="space-y-2 text-xs text-slate-400 font-medium">
                  <li className="flex items-start gap-2">
                    <span className="text-orange-500 font-black mt-0.5">1.</span>
                    <span>
                      {t("installSteps.androidStep1") || "Tap the menu"} 
                      <MoreVertical size={12} className="inline mx-1 text-slate-300"/> 
                      {t("installSteps.androidStep1b") || "top right."}
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-orange-500 font-black mt-0.5">2.</span>
                    <span>{t("installSteps.androidStep2") || "Select 'Install app' or 'Add to Home screen'."}</span>
                  </li>
                </ul>
              </div>

              {/* Desktop Instructions */}
              <div className="space-y-3 bg-white/[0.02] p-4 rounded-xl border border-white/5">
                <h4 className="text-sm font-bold text-slate-200 flex items-center gap-2">
                  <MonitorDown size={16} className="text-slate-400" />
                  {t("installSteps.desktopTitle") || "Desktop"}
                </h4>
                <ul className="space-y-2 text-xs text-slate-400 font-medium">
                  <li className="flex items-start gap-2">
                    <span className="text-orange-500 font-black mt-0.5">1.</span>
                    <span>{t("installSteps.desktopStep1") || "Look for the install icon in the URL bar."}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-orange-500 font-black mt-0.5">2.</span>
                    <span>{t("installSteps.desktopStep2") || "Click it and follow the prompt to install."}</span>
                  </li>
                </ul>
              </div>

            </div>
          </div>
        </div>

        {/* Sidebar Context */}
        <aside className="lg:col-span-1 space-y-6 md:space-y-8">
          {/* Instructions Card */}
          <div className="glass p-6 md:p-8 rounded-[1.5rem] md:rounded-[2.5rem] border border-white/5 bg-white/[0.01] shadow-xl">
            <div className="flex items-center gap-3 mb-4 md:mb-6 text-orange-500">
              <div className="p-2 bg-orange-500/10 rounded-lg">
                <Info size={20} />
              </div>
              <h3 className="font-black uppercase italic text-sm tracking-widest leading-none">
                {t("howToUse")}
              </h3>
            </div>

            <ul className="space-y-4 md:space-y-5">
              <li className="flex gap-3 md:gap-4 items-start">
                <span className="text-base md:text-lg select-none">📍</span>
                <p className="text-xs text-slate-300 font-bold leading-relaxed">{t("clickVenues")}</p>
              </li>
              <li className="flex gap-3 md:gap-4 items-start">
                <span className="text-base md:text-lg select-none">⚽</span>
                <p className="text-xs text-slate-300 font-bold leading-relaxed">{t("viewTeamInfo")}</p>
              </li>
              <li className="flex gap-3 md:gap-4 items-start">
                <span className="text-base md:text-lg select-none">📅</span>
                <p className="text-xs text-slate-300 font-bold leading-relaxed">{t("realTimeSchedules")}</p>
              </li>
            </ul>
          </div>

          {/* Technology Attribution */}
          <div className="glass p-6 md:p-8 rounded-[1.5rem] md:rounded-[2.5rem] border border-white/5 bg-orange-600/[0.03] flex flex-col gap-3 md:gap-4">
            <div className="flex items-center gap-2 text-slate-600">
              <ShieldCheck size={15} />
              <p className="text-[10px] font-black uppercase tracking-[0.2em]">{t("techBy")}</p>
            </div>
            <p className="text-lg md:text-xl font-black italic uppercase leading-none text-white group">
              ESRI <span className="text-orange-500 group-hover:text-orange-400 transition-colors">Geospatial</span>
            </p>
            <p className="text-[10px] text-slate-500 font-medium leading-none">
              Official ArcGIS Integration Platform
            </p>
          </div>

          <p className="text-[9px] md:text-[10px] text-slate-500 font-bold text-center px-4 italic leading-relaxed block">
            {t("subdomainNotice") || "* Opens in a separate secure sandbox window for enhanced GPU hardware acceleration rendering."}
          </p>
        </aside>
      </div>
    </main>
  );
}