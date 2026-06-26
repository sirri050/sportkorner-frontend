import { createCommunityArticle } from "@/lib/actions/articles";
import { getLocale, getTranslations } from "next-intl/server";
import { Upload, Send } from "lucide-react";


export default async function CreateArticlePage() {
    
  const t = await getTranslations("Articles");
  const locale = await getLocale()

  // We wrap the action to pass the locale parameter
  const createWithLocale =  createCommunityArticle.bind(null, locale);

  return (
    <main className="max-w-3xl mx-auto py-12 px-4" dir={locale === 'ar' ? 'rtl' : 'ltr'}>
      <form action={createWithLocale} className="glass p-8 rounded-[2.5rem] border border-white/5 space-y-6">
        
        {/* Title */}
        <div className="space-y-2">
          <label className="text-xs font-black uppercase text-slate-500">{t("fields.title")}</label>
          <input name="title" required className="w-full bg-slate-900 border border-white/10 rounded-2xl p-4 text-white focus:border-orange-500" />
        </div>

        {/* Excerpt (NEW) */}
        <div className="space-y-2">
          <label className="text-xs font-black uppercase text-slate-500">{t("fields.excerpt")}</label>
          <textarea 
            name="excerpt" 
            rows={2} 
            placeholder={t("fields.excerptPlaceholder")}
            className="w-full bg-slate-900 border border-white/10 rounded-2xl p-4 text-white focus:border-orange-500 text-sm"
          />
        </div>

        {/* Cover Image */}
        <div className="space-y-2">
          <label className="text-xs font-black uppercase text-slate-500">{t("fields.coverImage")}</label>
          <div className="border-2 border-dashed border-white/10 rounded-2xl p-6 flex flex-col items-center">
            <input type="file" name="image" accept="image/*" className="opacity-0 absolute" id="img-upload" />
            <label htmlFor="img-upload" className="cursor-pointer text-slate-500 hover:text-orange-500 text-xs font-bold uppercase">
              {t("fields.uploadHint")}
            </label>
          </div>
        </div>

        {/* Content */}
        <div className="space-y-2">
          <label className="text-xs font-black uppercase text-slate-500">{t("fields.content")}</label>
          <textarea name="content" required rows={8} className="w-full bg-slate-900 border border-white/10 rounded-2xl p-4 text-white focus:border-orange-500" />
        </div>

        <button type="submit" className="w-full bg-orange-600 hover:bg-orange-500 text-white font-black uppercase py-4 rounded-2xl transition-all">
          {t("publish")}
        </button>
      </form>
    </main>
  );
}