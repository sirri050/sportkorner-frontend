"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import {
    Copy,
    Check,
    Share2,
    X,
    Globe,
    ExternalLink,
} from "lucide-react";
import type { ShareData } from "./share-button";

type Props = {
    open: boolean;
    onClose: () => void;
    data: ShareData;
};

export default function ShareModal({
    open,
    onClose,
    data,
}: Props) {
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        if (!open) return;

        const close = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };

        window.addEventListener("keydown", close);

        return () => window.removeEventListener("keydown", close);
    }, [open, onClose]);

    if (!open) return null;

    const copy = async () => {
        await navigator.clipboard.writeText(data.url);

        setCopied(true);

        setTimeout(() => {
            setCopied(false);
        }, 2000);
    };

    const nativeShare = async () => {
        if (!navigator.share) return;

        try {
            await navigator.share({
                title: data.title,
                text: data.description,
                url: data.url,
            });
        } catch { }
    };

 const shareLinks = [
  {
    link: `https://wa.me/?text=${encodeURIComponent(data.url)}`,
    icon: (
      <svg viewBox="0 0 32 32" className="w-6 h-6">
        <path
          fill="#25D366"
          d="M16 3C8.82 3 3 8.82 3 16c0 2.54.73 5.02 2.12 7.15L3 29l5.98-2.05A12.9 12.9 0 0 0 16 29c7.18 0 13-5.82 13-13S23.18 3 16 3Zm6.4 18.1c-.28.78-1.64 1.49-2.28 1.54-.59.05-1.34.07-2.17-.2-.5-.16-1.14-.37-1.97-.73-3.47-1.5-5.73-5.02-5.91-5.26-.18-.24-1.41-1.87-1.41-3.56s.89-2.52 1.2-2.86c.31-.34.68-.42.91-.42h.65c.2 0 .47-.08.73.55.28.67.95 2.3 1.03 2.47.08.17.13.37.03.6-.1.24-.16.39-.31.6-.16.18-.34.4-.49.54-.16.16-.33.33-.14.65.18.31.82 1.35 1.77 2.19 1.22 1.09 2.25 1.43 2.56 1.59.31.16.49.13.67-.08.18-.2.78-.91.99-1.22.2-.31.41-.26.7-.16.28.1 1.8.85 2.11 1 .31.16.52.24.59.37.08.13.08.75-.2 1.53Z"
        />
      </svg>
    ),
  },

  {
    link: `https://t.me/share/url?url=${encodeURIComponent(
      data.url
    )}&text=${encodeURIComponent(data.title)}`,
    icon: (
      <svg viewBox="0 0 32 32" className="w-6 h-6">
        <circle cx="16" cy="16" r="16" fill="#229ED9" />
        <path
          fill="#fff"
          d="M7.4 15.8 22.8 9.8c.72-.28 1.35.18 1.12 1.24l-2.63 12.4c-.2.88-.74 1.1-1.5.68l-4.14-3.06-2 1.93c-.22.22-.4.4-.83.4l.3-4.25 7.73-6.99c.34-.3-.07-.47-.52-.17l-9.55 6.02-4.11-1.28c-.9-.28-.92-.9.19-1.32Z"
        />
      </svg>
    ),
  },

  {
    link: `https://twitter.com/intent/tweet?url=${encodeURIComponent(
      data.url
    )}&text=${encodeURIComponent(data.title)}`,
    icon: (
      <svg viewBox="0 0 24 24" className="w-6 h-6">
        <path
          fill="currentColor"
          d="M18.9 2H22l-6.8 7.77L23 22h-6.3l-4.93-6.44L6.1 22H3l7.3-8.34L1 2h6.46l4.45 5.88L18.9 2Z"
        />
      </svg>
    ),
  },

  {
    link: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
      data.url
    )}`,
    icon: (
      <svg viewBox="0 0 32 32" className="w-6 h-6">
        <circle cx="16" cy="16" r="16" fill="#1877F2" />
        <path
          fill="#fff"
          d="M18 26v-8h2.7l.4-3H18v-1.9c0-.87.24-1.46 1.49-1.46H21V9.03C20.74 9 19.86 8.93 18.84 8.93c-2.13 0-3.59 1.3-3.59 3.7V15H13v3h2.25v8H18Z"
        />
      </svg>
    ),
  },

  {
    link: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
      data.url
    )}`,
    icon: (
      <svg viewBox="0 0 32 32" className="w-6 h-6">
        <rect width="32" height="32" rx="4" fill="#0A66C2" />
        <path
          fill="#fff"
          d="M9.5 12H6.8v13h2.7V12Zm-1.35-1.2a1.6 1.6 0 1 0 0-3.2 1.6 1.6 0 0 0 0 3.2ZM25.2 17.1c0-3.2-1.7-5.3-4.8-5.3-2.2 0-3.2 1.2-3.7 2v-1.7H14v13h2.7v-7.3c0-1.9.36-3.8 2.7-3.8 2.3 0 2.3 2.1 2.3 3.9v7.2h2.7v-8Z"
        />
      </svg>
    ),
  },
];

    return (
        <div
            onClick={onClose}
            className="fixed inset-0 z-[100] bg-black/70 backdrop-blur-sm p-4 flex items-center justify-center"
        >
            <div
                onClick={(e) => e.stopPropagation()}
                className="w-full max-w-lg max-h-[90vh] overflow-hidden scrollbar-hidden rounded-3xl border border-white/10 bg-slate-900 shadow-2xl"
            >
                {/* Header */}

                <div className="flex items-center justify-between border-b border-white/10 px-5 py-2">
                    <h2 className="font-black uppercase tracking-wider">
                        Share
                    </h2>

                    <button
                        onClick={onClose}
                        className="rounded-lg p-2 hover:bg-white/10"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Preview */}

                <div className="px-5 py-2">

                    <div className="overflow-hidden rounded-2xl border border-white/10 bg-slate-950">

                        {data.image && (
                            <div className="relative aspect-[1200/630]">
                                <Image
                                    src={data.image}
                                    alt={data.title}
                                    fill
                                    className="object-cover"
                                    unoptimized
                                />
                            </div>
                        )}

                        <div className="space-y-2 p-4">

                            <h3 className="line-clamp-2 text-lg font-black">
                                {data.title}
                            </h3>

                            {data.description && (
                                <p className="line-clamp-2 text-sm text-slate-400">
                                    {data.description}
                                </p>
                            )}

                            <div className="flex items-center gap-2 pt-2 text-xs text-orange-500">
                                <Globe size={14} />
                                sportkorner.com
                            </div>
                        </div>

                    </div>

                    {/* Buttons */}

                    <div className="mt-2 grid grid-cols-2 gap-3">

                        <button
                            onClick={copy}
                            className="flex items-center justify-center gap-2 rounded-xl bg-white/10 py-3 font-bold hover:bg-white/20"
                        >
                            {copied ? <Check size={18} /> : <Copy size={18} />}

                            {copied ? "Copied!" : "Copy Link"}
                        </button>

                        {"share" in navigator && (
                            <button
                                onClick={nativeShare}
                                className="flex items-center justify-center gap-2 rounded-xl bg-orange-600 py-3 font-bold hover:bg-orange-500"
                            >
                                <Share2 size={18} />
                                Share
                            </button>
                        )}
                    </div>

                    {/* Social */}

                    <div className="mt-6">

                        <p className="mb-3 text-xs font-black uppercase tracking-widest text-slate-500">
                            Share via
                        </p>

                        <div className="flex flex-wrap gap-3">

                            {shareLinks.map((social, idx) => (
                                <a
                                    key={idx}
                                    href={social.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center justify-between"
                                >
                                    {social.icon}
                                </a>
                            ))}

                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}