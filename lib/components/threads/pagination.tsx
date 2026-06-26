"use client";

import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useSearchParams } from "next/navigation";

export default function Pagination({
  currentPage,
  pageCount,
}: {
  currentPage: number;
  pageCount: number;
}) {
  const searchParams = useSearchParams();

  const createPageUrl = (pageNumber: number | string) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", pageNumber.toString());
    return `?${params.toString()}`;
  };

  return (
    <div className="flex items-center justify-center gap-2 mt-8">
      {/* Previous Button */}
      <Link
        href={createPageUrl(currentPage - 1)}
        className={`p-2 rounded-xl border border-white/5 bg-slate-900 transition-all ${
          currentPage <= 1
            ? "opacity-30 pointer-events-none"
            : "hover:border-orange-500 text-white"
        }`}
      >
        <ChevronLeft size={20} />
      </Link>

      {/* Page Numbers */}
      <div className="flex items-center gap-1">
        {[...Array(pageCount)].map((_, i) => {
          const page = i + 1;
          const isCurrent = page === currentPage;

          return (
            <Link
              key={page}
              href={createPageUrl(page)}
              className={`w-10 h-10 flex items-center justify-center rounded-xl font-black text-xs transition-all border ${
                isCurrent
                  ? "bg-orange-600 border-orange-500 text-white shadow-lg shadow-orange-950/40"
                  : "bg-slate-900 border-white/5 text-slate-500 hover:border-white/20"
              }`}
            >
              {page}
            </Link>
          );
        })}
      </div>

      {/* Next Button */}
      <Link
        href={createPageUrl(currentPage + 1)}
        className={`p-2 rounded-xl border border-white/5 bg-slate-900 transition-all ${
          currentPage >= pageCount
            ? "opacity-30 pointer-events-none"
            : "hover:border-orange-500 text-white"
        }`}
      >
        <ChevronRight size={20} />
      </Link>
    </div>
  );
}
