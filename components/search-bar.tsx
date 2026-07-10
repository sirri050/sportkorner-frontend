"use client";

import { useEffect, useRef, useState } from "react";
import { Search, X } from "lucide-react";
import { useRouter } from "next/navigation";

export default function SearchBar({ placeholder }: { placeholder: string }) {
    console.log(placeholder);
    const [open, setOpen] = useState(false);
    const [query, setQuery] = useState("");
    const inputRef = useRef<HTMLInputElement>(null);
    const router = useRouter();

    useEffect(() => {
        if (open) {
            inputRef.current?.focus();
        }
    }, [open]);

    useEffect(() => {
        window.addEventListener("click", (e) => {
            if (e.target instanceof HTMLElement && !e.target.closest(".search-container")) {
                setOpen(false);
            }
        })

        return () => {
            window.removeEventListener("click", () => { });
        }
    }, [])

    const search = () => {
        const value = query.trim();
        if (!value) return;

        setOpen(false);
        router.push(`/search?q=${encodeURIComponent(value)}`);
    };

    return (
        <div className="sm:hidden mt-2">
            <button onClick={() => setOpen(!open)}>
                <Search className="h-6 w-6 text-slate-400 hover:text-white transition-colors" />
            </button>

            {open && (
                <div className="search-container absolute left-1/2 top-full z-50 w-[calc(100%-1rem)] max-w-md -translate-x-1/2 rounded-xl border bg-white p-0.5 shadow-xl">
                    <div className="flex w-full items-center gap-1">
                        <input
                            ref={inputRef}
                            type="search"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === "Enter") search();
                            }}
                            placeholder={placeholder}
                            className=" min-w-0 flex-1 bg-slate-900 border border-white/5 rounded-xl px-3 py-2 text-xs font-bold focus:outline-none focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/50 transition-all"

                        />

                        <button
                            onClick={search}
                            className="shrink-0 rounded-xl bg-brand-primary px-4 py-2 text-xs text-white"
                        >
                            Search
                        </button>
                    </div>
                </div>
            )}
        </div>

    );
}