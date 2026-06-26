import { getMe } from "@/lib/actions/auth";
import CreateThreadForm from "@/lib/components/threads/create";
import { fetchStrapi } from "@/lib/strapi";
import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";

export default async function NewThreadPage({
  params,
}: {
  params: { locale: string };
}) {
  const { locale } = await params;
  const user = await getMe();

  // Ensure the user stays in their language segment if redirected
  if (!user) redirect(`/${locale}/login`);

  const t = await getTranslations("NewThreadPage");

  // 1. Fetch categories in the correct locale for the dropdown
  const categoriesRes = await fetchStrapi("categories", {
    locale: locale,
    fields: ["name", "documentId"],
  });

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-black uppercase tracking-tight italic">
          {t("titleFirst")}{" "}
          <span className="text-brand-primary">{t("titleHighlight")}</span>
        </h1>
        <p className="text-slate-500 text-sm mt-1">{t("subtitle")}</p>
      </div>

      {/* Passing locale to form might be useful for form submission logic later */}
      <CreateThreadForm categories={categoriesRes.data} />
    </div>
  );
}
