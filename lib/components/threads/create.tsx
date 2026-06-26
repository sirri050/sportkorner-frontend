"use client";

import { useActionState } from "react";
import { Loader2, Send } from "lucide-react";
import { createThreadAction } from "@/lib/actions/threads";
import { useTranslations } from "next-intl";

export default function CreateThreadForm({
  categories,
}: {
  categories: any[];
}) {
  const [state, formAction, isPending] = useActionState(
    createThreadAction,
    null,
  );
  const t = useTranslations("CreateThread");

  return (
    <form
      action={formAction}
      className="glass p-8 rounded-3xl border border-white/5 space-y-6"
    >
      {/* Title Input */}
      <div className="space-y-2">
        <label className="text-xs font-bold text-slate-500 uppercase ms-1">
          {t("labels.title")}
        </label>
        <input
          name="title"
          placeholder={t("placeholders.title")}
          className="w-full bg-slate-900/50 border border-slate-800 p-4 rounded-2xl focus:border-brand-primary outline-none transition-all text-lg font-bold"
          required
        />
      </div>

      {/* Category Select */}
      <div className="space-y-2">
        <label className="text-xs font-bold text-slate-500 uppercase ms-1">
          {t("labels.category")}
        </label>
        <div className="relative">
          <select
            name="category"
            className="w-full bg-slate-900/50 border border-slate-800 p-4 rounded-2xl focus:border-brand-primary outline-none appearance-none cursor-pointer"
            required
          >
            <option value="">{t("placeholders.selectSport")}</option>
            {categories.map((cat) => (
              <option key={cat.documentId} value={cat.documentId}>
                {cat.name}
              </option>
            ))}
          </select>
          {/* Custom Arrow positioning for RTL/LTR */}
          <div className="absolute inset-y-0 end-4 flex items-center pointer-events-none text-slate-500">
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M19 9l-7 7-7-7"
              ></path>
            </svg>
          </div>
        </div>
      </div>

      {/* Content Textarea */}
      <div className="space-y-2">
        <label className="text-xs font-bold text-slate-500 uppercase ms-1">
          {t("labels.message")}
        </label>
        <textarea
          name="content"
          rows={8}
          placeholder={t("placeholders.message")}
          className="w-full bg-slate-900/50 border border-slate-800 p-4 rounded-2xl focus:border-brand-primary outline-none transition-all resize-none"
          required
        />
      </div>

      {state?.error && (
        <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-xl text-red-500 text-sm font-medium">
          {state.error}
        </div>
      )}

      <button
        disabled={isPending}
        className="w-full bg-brand-primary hover:bg-orange-600 py-4 rounded-2xl font-black flex items-center justify-center gap-2 transition-all shadow-lg shadow-orange-950/20 uppercase tracking-widest"
      >
        {isPending ? (
          <Loader2 className="animate-spin" size={24} />
        ) : (
          <>
            <Send size={20} className="rtl:-scale-x-100" />
            {t("submit")}
          </>
        )}
      </button>
    </form>
  );
}
