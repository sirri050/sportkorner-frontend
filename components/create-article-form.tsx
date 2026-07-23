"use client";

import { useActionState } from "react";
import type { CreateArticleState } from "@/lib/actions/articles";
import ImageUpload from "./image-upload";
import { Link } from "lucide-react";

const initialState: CreateArticleState = {
  success: false,
  message: "",
};

export default function CreateArticleForm({
  action,
  translations,
  locale
}: {
  action: (
    state: CreateArticleState,
    formData: FormData,
  ) => Promise<CreateArticleState>;
  translations: {
    publish: string;
    title: string;
    excerpt: string;
    excerptPlaceholder: string;
    coverImage: string;
    uploadHint: string;
    content: string;
  },
  locale:string
}) {
  const [state, formAction, pending] = useActionState(action, initialState);

  return (
    <form action={formAction}>
      {state.message && (
        <div
          className={`mb-6 rounded-xl p-4 flex w-full justify-between ${
            state.success ? "bg-green-600" : "bg-red-600"
          } text-white`}
        >
          {state.message}
          {state.success && (
            <a href={`/${locale}/articles`} className="ml-2 text-white hover:underline hover:text-grey-400">
              View articles
            </a>
          )}
        </div>
      )}

      {/* Title */}
      <div className="space-y-2">
        <label className="text-xs font-black uppercase text-slate-500">
          {translations.title}
        </label>
        <input
          placeholder="Enter your article title"
          name="title"
          required
          className="w-full bg-slate-900 border border-white/10 rounded-2xl p-4 text-white focus:border-orange-500"
        />
      </div>

      {/* Excerpt (NEW) */}
      <div className="space-y-2">
        <label className="text-xs font-black uppercase text-slate-500">
          {translations.excerpt}
        </label>
        <textarea
          name="excerpt"
          rows={2}
          placeholder={translations.excerpt}
          className="w-full bg-slate-900 border border-white/10 rounded-2xl p-4 text-white focus:border-orange-500 text-sm"
        />
      </div>

      {/* Optional Original Slug (for translations) */}
      {locale === "ar" && (
        <div className="space-y-2">
          <label className="text-xs font-black uppercase text-slate-500">
            Original article slug or English title
          </label>
          <input
            name="originalSlug"
            placeholder="Paste English slug or title (optional)"
            className="w-full bg-slate-900 border border-white/10 rounded-2xl p-4 text-white focus:border-orange-500"
          />
        </div>
      )}

      {/* Cover Image */}
      <div className="space-y-2">
        <label className="text-xs font-black uppercase text-slate-500">
          {translations.coverImage}
        </label>

        <ImageUpload translations={translations} state={state} />
      </div>

      {/* Content */}
      <div className="space-y-2">
        <label className="text-xs font-black uppercase text-slate-500">
          {translations.content}
        </label>
        <textarea
          placeholder="Enter your article"
          name="content"
          required
          rows={8}
          className="w-full bg-slate-900 border border-white/10 rounded-2xl p-4 text-white focus:border-orange-500"
        />
      </div>
      <button
        disabled={pending}
        className="w-full bg-orange-600 hover:bg-orange-500 text-white font-black uppercase py-4 rounded-2xl transition-all"
      >
        {pending ? "Publishing..." : translations.publish}
      </button>
    </form>
  );
}
