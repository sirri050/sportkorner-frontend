"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import { useRouter } from "next/navigation";

export default function HeaderSearch({ placeholder }: { placeholder: string }) {
  console.log(placeholder);
  const [query, setQuery] = useState("");
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    router.push(`/search?q=${encodeURIComponent(query)}`);
  };

  return (
    <form onSubmit={handleSearch} className="hidden md:flex relative group">
      <Search
        size={16}
        className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-orange-500 transition-colors"
      />
      <input
        type="text"
        placeholder={placeholder}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="bg-slate-900 border border-white/5 rounded-xl pl-10 pr-4 py-2 text-xs font-bold focus:outline-none focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/50 w-64 transition-all"
      />
    </form>
  );
}
