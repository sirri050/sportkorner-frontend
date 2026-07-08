"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function Pagination({
  currentPage,
  totalPages,
  keepParams,
}: {
  currentPage: number;
  totalPages: number;
  keepParams?: Record<string, string | undefined>;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  if (totalPages>4) totalPages=4; // Limit the number of pages displayed to 4
  function changePage(page: number) {
    const params = new URLSearchParams(searchParams);

    params.set("page", String(page));

    Object.entries(keepParams || {}).forEach(([key, value]) => {
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
    });

    router.push(`?${params.toString()}`);
  }


  return (
    <div className="flex items-center gap-2 flex-wrap justify-center">

      <button
        title="Previous Page"
        disabled={currentPage === 1}
        onClick={() => changePage(currentPage - 1)}
        className="
          w-10 h-10 rounded-xl
          bg-white/5 border border-white/10
          flex items-center justify-center
          hover:bg-orange-600 hover:border-orange-500
          transition-all
          disabled:hidden
          disabled:opacity-30 disabled:pointer-events-none
        "
      >
        <ChevronLeft size={18}/>
      </button>


      {Array.from({ length: totalPages }).map((_, index) => {
        const page = index + 1;

        return (
          <button
            key={page}
            onClick={() => changePage(page)}
            className={`
              w-10 h-10 rounded-xl font-black text-sm
              transition-all border

              ${
                currentPage === page
                ? "bg-orange-600 border-orange-500 text-white shadow-lg shadow-orange-900/30"
                : "bg-white/5 border-white/10 text-slate-400 hover:text-white hover:border-white/30"
              }
            `}
          >
            {page}
          </button>
        );
      })}


      <button
        title="Next Page"
        disabled={currentPage === totalPages}
        onClick={() => changePage(currentPage + 1)}
        className="
          w-10 h-10 rounded-xl
          bg-white/5 border border-white/10
          flex items-center justify-center
          hover:bg-orange-600 hover:border-orange-500
          transition-all
          disabled:opacity-30 disabled:pointer-events-none
        "
      >
        <ChevronRight size={18}/>
      </button>

    </div>
  );
}