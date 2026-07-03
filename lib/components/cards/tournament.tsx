import { Calendar, MapPin, Trophy } from "lucide-react";
import Link from "next/link";

export default function TournamentCard({ item }: { item: any }) {
  const isLive = item.status === "live";
  let category= item.category;
  if(category==="football") category="world-cup"
  return (
    <div className="glass rounded-3xl p-6 border border-white/5 hover:border-orange-500/20 transition-all group relative overflow-hidden">
      {/* Status Badge */}
      <div className="flex justify-between items-start mb-6">
        <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${isLive ? "bg-orange-500 text-white animate-pulse" : "bg-slate-800 text-slate-400"
          }`}>
          {isLive && <span className="h-1.5 w-1.5 rounded-full bg-white" />}
          {item.tournament_status}
        </div>
        <Trophy size={18} className="text-slate-700 group-hover:text-orange-500 transition-colors" />
      </div>

      <div className="space-y-4">
        <div>
          <span className="text-[10px] text-orange-500 font-bold uppercase tracking-wider">
            {item.category}
          </span>
          <h3 className="text-xl font-black italic uppercase leading-none mt-1">
            {item.name}
          </h3>
        </div>

        <div className="flex flex-col gap-2 text-xs font-medium text-slate-400">
          <div className="flex items-center gap-2">
            <Calendar size={14} className="text-slate-600" />
            {new Date(item.start_date).toLocaleDateString()} - {new Date(item.end_date).toLocaleDateString()}
          </div>
          {item.gis_link && (
            <div className="flex items-center gap-2 text-orange-500/80">
              <MapPin size={14} />
              GIS Map Available
            </div>
          )}
        </div>
      </div>

      {/* Action Button */}
      <Link
        href={`/news?category=${category}`}
        className="block text-center w-full mt-6 py-3 rounded-xl bg-white/5 hover:bg-orange-600 hover:text-white transition-all text-[10px] font-black uppercase tracking-tighter">
        View Tournament News
      </Link>
    </div>
  );
}