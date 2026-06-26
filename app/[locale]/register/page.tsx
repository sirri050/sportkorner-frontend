"use client";

import { useActionState } from "react";
import { Loader2, UserPlus } from "lucide-react";
import Link from "next/link";
import { registerAction } from "@/lib/actions/auth";
import { useTranslations } from "next-intl";

export default function RegisterPage() {
  const [state, formAction, isPending] = useActionState(registerAction, null);
  const t = useTranslations("Register");

  return (
    <div className="max-w-md mx-auto mt-16 p-8 glass rounded-3xl border border-white/5 shadow-2xl">
      <div className="flex flex-col items-center mb-8">
        <div className="bg-brand-primary/20 p-3 rounded-full mb-4">
          <UserPlus className="text-brand-primary" size={32} />
        </div>
        <h1 className="text-2xl font-black uppercase tracking-tight italic">
          {t("title")}
        </h1>
        <p className="text-slate-400 text-sm">{t("subtitle")}</p>
      </div>

      <form action={formAction} className="flex flex-col gap-4">
        {/* Username */}
        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-500 ms-1 uppercase">
            {t("labels.username")}
          </label>
          <input
            name="username"
            type="text"
            placeholder="johndoe_fc"
            className="w-full bg-slate-900/50 border border-slate-800 p-3 rounded-xl focus:border-brand-primary outline-none transition-all"
            required
          />
        </div>

        {/* Email */}
        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-500 ms-1 uppercase">
            {t("labels.email")}
          </label>
          <input
            name="email"
            type="email"
            placeholder="coach@example.com"
            className="w-full bg-slate-900/50 border border-slate-800 p-3 rounded-xl focus:border-brand-primary outline-none transition-all"
            required
          />
        </div>

        {/* Password */}
        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-500 ms-1 uppercase">
            {t("labels.password")}
          </label>
          <input
            name="password"
            type="password"
            placeholder="••••••••"
            className="w-full bg-slate-900/50 border border-slate-800 p-3 rounded-xl focus:border-brand-primary outline-none transition-all"
            required
          />
        </div>

        {/* Confirm Password */}
        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-500 ms-1 uppercase">
            {t("labels.confirmPassword")}
          </label>
          <input
            name="confirmPassword"
            type="password"
            placeholder="••••••••"
            className="w-full bg-slate-900/50 border border-slate-800 p-3 rounded-xl focus:border-brand-primary outline-none transition-all"
            required
          />
        </div>

        {state?.error && (
          <p className="text-red-500 text-xs font-medium bg-red-500/10 p-3 rounded-lg border border-red-500/20">
            {state.error}
          </p>
        )}

        <button
          disabled={isPending}
          className="bg-brand-primary font-black py-4 mt-2 rounded-xl hover:bg-orange-600 transition-all flex items-center justify-center gap-2 disabled:opacity-50 uppercase tracking-widest shadow-lg shadow-orange-950/20"
        >
          {isPending ? (
            <Loader2 className="animate-spin" size={20} />
          ) : (
            t("submitButton")
          )}
        </button>

        <p className="text-center text-slate-500 text-[10px] font-bold uppercase mt-4 tracking-widest">
          {t("alreadyMember")}{" "}
          <Link
            href="/login"
            className="text-brand-primary font-black hover:underline"
          >
            {t("signInLink")}
          </Link>
        </p>
      </form>
    </div>
  );
}
