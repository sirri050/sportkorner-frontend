"use client";
import { useState, useEffect } from "react";
import { AlertTriangle, X } from "lucide-react";
import { useParams } from "next/navigation";

export default function ConstructionBanner() {
  const [isVisible, setIsVisible] = useState(true);
  const { locale } = useParams();

  // Arabic vs English text
  const message = locale === 'ar' 
    ? "الموقع لا يزال قيد التطوير. ترقبوا الإطلاق الكامل لمميزات كأس العالم 2026 قريباً!"
    : "Site under construction. Stay tuned for the full 2026 World Cup experience coming soon!";

  if (!isVisible) return null;

  return (
    <div className="relative z-[100] bg-orange-600 text-white py-2 px-4 shadow-lg overflow-hidden">
      {/* Background Animated Pulse */}
      <div className="absolute inset-0 bg-orange-500 animate-pulse opacity-50" />
      
      <div className="max-w-7xl mx-auto flex items-center justify-between relative z-10">
        <div className="flex items-center gap-3">
          <AlertTriangle size={16} className="shrink-0" />
          <p className="text-[10px] md:text-xs font-black uppercase tracking-wider italic">
            {message}
          </p>
        </div>

        <button 
          onClick={() => setIsVisible(false)}
          className="p-1 hover:bg-white/20 rounded-full transition-colors"
        >
          <X size={14} />
        </button>
      </div>
    </div>
  );
}