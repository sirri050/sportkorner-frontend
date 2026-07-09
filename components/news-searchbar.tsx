"use client";

import { useEffect, useRef, useState } from "react";
import { Search, X } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

type NewsSearchProps = {
	currentQuery?: string;
	currentCategory?: string;
	locale:string
};

export default function NewsSearch({ currentQuery = "", currentCategory, locale }: NewsSearchProps) {
	const [open, setOpen] = useState(false);
	const [query, setQuery] = useState(currentQuery);
	const inputRef = useRef<HTMLInputElement>(null);
	const router = useRouter();
	const pathname = usePathname();
	const searchParams = useSearchParams();

	useEffect(() => {
		setQuery(currentQuery);
	}, [currentQuery]);

	useEffect(() => {
		if (open) {
			inputRef.current?.focus();
		}
	}, [open]);

	function submitSearch(nextQuery: string) {
		const value = nextQuery.trim();
		const params = new URLSearchParams(searchParams);

		params.delete("page");

		if (currentCategory) {
			params.set("category", currentCategory);
		}

		if (value) {
			params.set("q", value);
		} else {
			params.delete("q");
		}

		const nextUrl = params.toString() ? `${pathname}?${params.toString()}` : pathname;
		router.push(nextUrl);
		setOpen(false);
	}

	function clearSearch() {
		setQuery("");
		const params = new URLSearchParams(searchParams);

		params.delete("q");
		params.delete("page");

		if (currentCategory) {
			params.set("category", currentCategory);
		}

		const nextUrl = params.toString() ? `${pathname}?${params.toString()}` : pathname;
		router.push(nextUrl);
		setOpen(false);
	}

	return (
		<div className="relative">
			<button
				type="button"
				onClick={() => setOpen((value) => !value)}
				className="inline-flex h-12 items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 text-sm font-black uppercase tracking-[0.2em] text-slate-300 transition-colors hover:border-orange-500/40 hover:text-white"
			>
				<Search size={16} />
				<span className="">Search</span>
			</button>

			{open && (
				<div
					className={` absolute top-full left-1/2 -translate-x-1/2 mt-3 z-20 ${locale === "en" ? "md:-translate-x-1/1" : "md:translate-x-1"} w-[calc(100vw-2rem)]   max-w-md    rounded-3xl border border-white/10 bg-slate-950/95 p-3 shadow-2xl shadow-black/40 backdrop-blur-xl`}
				>
					<div className="flex items-center gap-2">
						<input
							ref={inputRef}
							type="search"
							value={query}
							onChange={(event) => setQuery(event.target.value)}
							onKeyDown={(event) => {
								if (event.key === "Enter") {
									submitSearch(query);
								}
							}}
							placeholder="Search news..."
							className="h-12 min-w-0 flex-1 rounded-2xl border border-white/10 bg-white/5 px-4 text-sm font-medium text-white outline-none placeholder:text-slate-500 focus:border-orange-500/50"
						/>

						{query ? (
							<button
								type="button"
								onClick={clearSearch}
								className="inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-slate-300 transition-colors hover:border-white/20 hover:text-white"
								aria-label="Clear search"
							>
								<X size={16} />
							</button>
						) : null}

						<button
							type="button"
							onClick={() => submitSearch(query)}
							className="h-12 rounded-2xl bg-orange-600 px-4 text-sm font-black uppercase tracking-[0.18em] text-white transition-colors hover:bg-orange-500"
						>
							Go
						</button>
					</div>
				</div>
			)}
		</div>
	);
}
