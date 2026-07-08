"use client";

import { useState } from "react";
import { Share2 } from "lucide-react";
import ShareModal from "./share-modal";

export type ShareData = {
  title: string;
  description?: string;
  image?: string;
  url: string;
};

export default function ShareButton({ data }: { data: ShareData }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-slate-500 hover:text-orange-500 transition-colors"
      >
        <Share2 size={16} />
        Share
      </button>

      <ShareModal
        open={open}
        onClose={() => setOpen(false)}
        data={data}
      />
    </>
  );
}