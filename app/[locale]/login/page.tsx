"use client";

import { useActionState } from "react";
import { Loader2, KeyRound } from "lucide-react";
import Link from "next/link";
import { loginAction } from "@/lib/actions/auth";
import { useTranslations } from "next-intl";

export default function LoginPage() {
  const [state, formAction, isPending] = useActionState(loginAction, null);
  const t = useTranslations("Login");

  return (
    <div className="max-w-md mx-auto mt-20 p-8 glass rounded-3xl border border-white/5 shadow-2xl">
      <div className="flex flex-col items-center mb-8">
        <div className="bg-brand-primary/20 p-3 rounded-full mb-4 text-brand-primary">
          <KeyRound size={32} />
        </div>
        <h1 className="text-2xl font-black uppercase tracking-tight italic">
          {t("title")}
        </h1>
        <p className="text-slate-400 text-sm">{t("subtitle")}</p>
      </div>

      <form action={formAction} className="flex flex-col gap-5">
        {/* Identifier Input */}
        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-500 ms-1 uppercase tracking-wider">
            {t("labels.identifier")}
          </label>
          <input
            name="identifier"
            type="text"
            placeholder={t("placeholders.identifier")}
            className="w-full bg-slate-900/50 border border-slate-800 p-3 rounded-xl focus:border-brand-primary outline-none transition-all placeholder:text-slate-600"
            required
          />
        </div>

        {/* Password Input */}
        <div className="space-y-1">
          <div className="flex justify-between items-center px-1">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              {t("labels.password")}
            </label>
            <Link
              href="#"
              className="text-[10px] font-bold text-brand-primary hover:underline"
            >
              {t("forgot")}
            </Link>
          </div>
          <input
            name="password"
            type="password"
            placeholder="••••••••"
            className="w-full bg-slate-900/50 border border-slate-800 p-3 rounded-xl focus:border-brand-primary outline-none transition-all placeholder:text-slate-600"
            required
          />
        </div>

        {state?.error && (
          <p className="text-red-500 text-xs font-medium bg-red-500/10 p-3 rounded-lg border border-red-500/20 text-center">
            {state.error}
          </p>
        )}

        <button
          disabled={isPending}
          className="bg-brand-primary font-black py-4 mt-2 rounded-xl hover:bg-orange-600 transition-all flex items-center justify-center gap-2 disabled:opacity-50 shadow-lg shadow-orange-950/20 uppercase tracking-widest"
        >
          {isPending ? (
            <Loader2 className="animate-spin" size={20} />
          ) : (
            t("submit")
          )}
        </button>

        <div className="pt-4 border-t border-white/5 mt-2">
          <p className="text-center text-slate-500 text-sm">
            {t("noAccount")}{" "}
            <Link
              href="/register"
              className="text-brand-primary font-black hover:text-brand-secondary transition-colors underline-offset-4 hover:underline"
            >
              {t("createAccount")}
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
}
