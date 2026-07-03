import { createCommunityArticle } from "@/lib/actions/articles";
import { getLocale, getTranslations } from "next-intl/server";
import CreateArticleForm from "../../../../components/create-article-form";

export default async function CreateArticlePage() {
  const t = await getTranslations("Articles");
  const locale = await getLocale();

  // We wrap the action to pass the locale parameter
  const createWithLocale = createCommunityArticle.bind(null, locale);
  const translations = {
  publish: t("publish"),
  title: t("fields.title"),
  excerpt: t("fields.excerpt"),
  excerptPlaceholder: t("fields.excerptPlaceholder"),
  coverImage: t("fields.coverImage"),
  uploadHint: t("fields.uploadHint"),
  content: t("fields.content"),
};
  return (
    <main
      className="max-w-3xl mx-auto py-12 px-4"
      dir={locale === "ar" ? "rtl" : "ltr"}
    >
      <CreateArticleForm action={createWithLocale} translations={translations} locale={locale} />
    </main>
  );
}
