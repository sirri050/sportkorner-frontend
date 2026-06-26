"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Send, Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { replyToThreadAction } from "@/lib/actions/threads";

export default function ReplyForm({ threadId }: { threadId: string }) {
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const t = useTranslations("ReplyForm");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    setIsSubmitting(true);
    setError("");

    try {
      // Split the text input by newline boundaries
      const paragraphs = content.split("\n");

      // Explicitly append the type identifier to both the root container and the inner child node
      const formattedBlocks = paragraphs.map((line) => ({
        type: "paragraph",
        children: [
          {
            type: "text", // <--- This explicit identifier satisfies the validation schema
            text: line
          }
        ],
      }));

      const data = {
        content: formattedBlocks,
        thread: threadId,
      };

      const { success, error } = await replyToThreadAction(data);

      if (!success) {
        setError(error || "An unknown error occurred");
        return;
      }

      setContent("");
      router.refresh();
    } catch (err) {
      setError(t("error"));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="mt-8 glass p-6 rounded-2xl border-t-2 border-brand-primary"
    >
      <h4 className="font-heading text-sm mb-4 font-black uppercase tracking-widest italic">
        {t("title")}
      </h4>

      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder={t("placeholder")}
        className="w-full bg-slate-950/50 border border-slate-800 rounded-xl p-4 text-slate-200 focus:outline-none focus:border-brand-primary transition-colors min-h-[120px] resize-none"
        disabled={isSubmitting}
      />

      {error && <p className="text-red-500 text-xs mt-2 font-bold">{error}</p>}

      {/* justify-end will move the button to the left in RTL (Arabic) */}
      <div className="flex justify-end mt-4">
        <button
          type="submit"
          disabled={isSubmitting || !content.trim()}
          className="flex items-center gap-2 bg-brand-primary hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-2 rounded-xl font-black uppercase text-[10px] tracking-wider transition-all shadow-lg shadow-orange-950/20"
        >
          {isSubmitting ? (
            <Loader2 className="animate-spin" size={18} />
          ) : (
            <>
              {/* rtl:-scale-x-100 flips the icon for Arabic context */}
              <Send size={18} className="rtl:-scale-x-100" />
              {t("submit")}
            </>
          )}
        </button>
      </div>
    </form>
  );
}
