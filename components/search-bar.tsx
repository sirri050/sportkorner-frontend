"use client";

import { useEffect, useRef, useState } from "react";
import { Search, X } from "lucide-react";
import { useRouter } from "next/navigation";

export default function SearchBar() {
    const [open, setOpen] = useState(false);
    const [query, setQuery] = useState("");
    const inputRef = useRef<HTMLInputElement>(null);
    const router = useRouter();

    useEffect(() => {
        if (open) {
            inputRef.current?.focus();
        }
    }, [open]);

    useEffect(()=>{
        window.addEventListener("click",(e)=>{
            if(e.target instanceof HTMLElement && !e.target.closest(".search-container")) {
                setOpen(false);
            }
        })

        return ()=>{
            window.removeEventListener("click", () => {});
        }
    }, [])

    const search = () => {
        const value = query.trim();
        if (!value) return;

        setOpen(false);
        router.push(`/search?q=${encodeURIComponent(value)}`);
    };

    return (
        <>
            <button onClick={() => setOpen(!open)}>
                <Search className="h-6 w-6 text-slate-400 hover:text-white transition-colors" />
            </button>

            {open && (
                <div className="search-container absolute left-1/2 top-full z-50 w-[calc(100%-1rem)] max-w-md -translate-x-1/2 rounded-xl border bg-white p-1 shadow-xl">
                    <div className="flex items-center gap-2">
                        <input
                            ref={inputRef}
                            type="search"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === "Enter") search();
                            }}
                            placeholder="Search products..."
                            className="flex-1 text-black rounded-lg border px-3 py-2 outline-none focus:ring-2"
                        />

                        <button
                            onClick={search}
                            className="rounded-lg bg-brand-primary px-4 py-2 text-white"
                        >
                            Search
                        </button>

                        <button
                            onClick={() => {
                                setOpen(false);
                                setQuery("");
                            }}
                            className="rounded-lg p-2 hover:bg-gray-100"
                        >
                            <X className="h-5 w-5" />
                        </button>
                    </div>
                </div>
            )}
        </>

    );
}