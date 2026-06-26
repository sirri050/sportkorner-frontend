import { getLiveScores } from "@/lib/actions/scores";
import { Trophy, Timer, Circle } from "lucide-react";
import Image from "next/image";

export default async function LiveScores() {
  const matches = await getLiveScores();

  if (!matches || matches.length === 0) {
    return (
      <div className="glass p-6 rounded-3xl border border-white/5 text-center">
        <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">
          No live matches at the moment
        </p>
      </div>
    );
  }

  return (
    <div className="bg-slate-900/50 border border-slate-800 rounded-3xl overflow-hidden backdrop-blur-sm shadow-xl">
      <div className="p-5 border-b border-white/5 bg-white/[0.02] flex justify-between items-center">
        <h3 className="font-black text-xs uppercase tracking-[0.2em] text-slate-100 flex items-center gap-2">
          <Trophy size={14} className="text-brand-primary" />
          Live Arena
        </h3>
        <span className="text-[9px] font-black text-slate-500 uppercase">
          Updated Hourly
        </span>
      </div>

      <div className="divide-y divide-white/5 max-h-[400px] overflow-y-auto custom-scrollbar">
        {matches.slice(0, 5).map((match: any) => (
          <div
            key={match.id}
            className="p-4 hover:bg-white/[0.02] transition-colors group"
          >
            <div className="flex justify-between items-center mb-3">
              <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest truncate max-w-[120px]">
                {match.league}
              </span>
              <span className="text-[10px] font-bold text-brand-primary bg-brand-primary/10 px-2 py-0.5 rounded-full flex items-center gap-1">
                <Timer size={10} /> {match.minute}'
              </span>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <img
                    src={match.homeLogo}
                    alt=""
                    className="w-4 h-4 object-contain"
                  />
                  <span className="text-sm font-bold text-slate-200 uppercase truncate max-w-[100px]">
                    {match.home}
                  </span>
                </div>
                <span className="text-sm font-black text-white">
                  {match.homeScore}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <img
                    src={match.awayLogo}
                    alt=""
                    className="w-4 h-4 object-contain"
                  />
                  <span className="text-sm font-bold text-slate-200 uppercase truncate max-w-[100px]">
                    {match.away}
                  </span>
                </div>
                <span className="text-sm font-black text-white">
                  {match.awayScore}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
