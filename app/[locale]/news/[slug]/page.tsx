import { fetchStrapi } from "@/lib/strapi";
import { notFound } from "next/navigation";
import { BlocksRenderer } from "@strapi/blocks-react-renderer";
import { Calendar, ExternalLink } from "lucide-react";
import { getLocale } from "next-intl/server";
import Image from "next/image";
import { Metadata } from "next";
import DynamicZoneRenderer from "@/components/dynamic-zone-render";

// --- DYNAMIC SEO ---
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const locale = await getLocale();

  const response = await fetchStrapi("news", {
    filters: { slug: { $eq: slug } },
    locale,
    populate: ["coverImage"],
  });

  const article = response.data?.[0];
  if (!article) return { title: "News Not Found" };

  const imageUrl = article.coverImage?.url
    ? process.env.NEXT_PUBLIC_STRAPI_MEDIA_URL + article.coverImage.url
    : "/og-image.jpg";
  const url = `${process.env.NEXT_PUBLIC_SITE_URL}/${locale}/news/${article.slug}`;
  return {
    title: article.title,
    metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL!),
    description: article.excerpt || article.title,
    openGraph: {
      type: "article",
      url,
      siteName: "SportKorner",
      locale,

      title: article.title,
      description: article.excerpt || article.title,

      publishedTime: article.createdAt,
      modifiedTime: article.updatedAt,

      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: article.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: article.title,
      description: article.excerpt || article.title,
      images: [imageUrl],
    },
    robots: {
      index: true,
      follow: true,
    }, keywords: [
      "Football",
      "World Cup",
      "SportKorner",
      article.title,
    ],
  };
}

export default async function SingleNews({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const locale = await getLocale();
  const isAr = locale === "ar";

  const response = await fetchStrapi("news", {
    filters: { slug: { $eq: slug } },
    locale,
    populate: {
      coverImage: true,
      articleContent: {
        populate: "*",
      },
    },
  });

  // console.log("response", response.data);

  const article = response.data?.[0];
  if (!article) notFound();

  const imageUrl = article.coverImage?.url
    ? process.env.NEXT_PUBLIC_STRAPI_MEDIA_URL + article.coverImage.url
    : null;

  // --- JSON-LD FOR NEWS ---
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: article.title,
    image: [imageUrl],
    datePublished: article.createdAt,
    dateModified: article.updatedAt,
    author: [
      {
        "@type": "Organization",
        name: "SportKorner",
        url: "https://sportkorner.com",
      },
    ],
  };

  return (
    <article
      className="max-w-4xl mx-auto py-16 px-4"
      dir={isAr ? "rtl" : "ltr"}
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <header className="mb-10 space-y-6">
        <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-[0.2em] text-orange-500">
          <span className="flex items-center gap-1.5 bg-orange-500/10 px-3 py-1 rounded-full border border-orange-500/20">
            <Calendar size={12} />
            {new Date(article.createdAt).toLocaleDateString(locale, {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </span>
          <span className="text-slate-500 italic uppercase tracking-widest">
            {isAr ? "تحديث إخباري" : "News Update"}
          </span>
        </div>

        <h1
          className={`text-2xl md:text-3xl font-black leading-[${isAr ? "1.2" : "0.9"}] italic uppercase tracking-tighter text-white`}
        >
          {article.title}
        </h1>
      </header>

      {/* Featured Image with Priority Loading */}
      {imageUrl && (
        <div className="relative aspect-video mb-12 rounded-[2.5rem] overflow-hidden border border-white/5 shadow-2xl bg-slate-900">
          <Image
            src={imageUrl}
            alt={article.title}
            className="object-cover"
            fill
            priority // Critical for LCP
            sizes="(max-width: 896px) 100vw, 896px"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 to-transparent" />
        </div>
      )}

      {/* Content Container */}
      <div className="glass rounded-[3rem] p-5 md:p-8 border border-white/5 bg-white/[0.01] backdrop-blur-md shadow-inner">
        <div
          className="prose prose-invert prose-orange max-w-none 
          prose-p:text-slate-300 prose-p:text-xl prose-p:leading-relaxed 
          prose-headings:italic prose-headings:font-black prose-headings:uppercase
          prose-strong:text-white prose-a:text-orange-500 prose-img:rounded-3xl"
        >
          {article.articleContent?.length > 0 ? (
            <DynamicZoneRenderer blocks={article.articleContent} />
          ) : article.content?.length > 0 ? (
            <BlocksRenderer content={article.content} />
          ) : (
            <div className="py-12 text-center space-y-8">
              <div className="max-w-md mx-auto">
                <p className="italic text-slate-500 text-lg leading-relaxed font-medium">
                  {isAr
                    ? "هذا التحديث متاح حالياً عبر المصدر الخارجي فقط. انقر أدناه للمتابعة."
                    : "This update is currently available via external source only. Click below to continue."}
                </p>
              </div>

              {article.link && (
                <a
                  href={article.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-3 bg-white text-black hover:bg-orange-600 hover:text-white px-10 py-5 rounded-2xl font-black uppercase text-xs transition-all shadow-xl group"
                >
                  {isAr ? "View External Source" : "View External Source"}

                  <ExternalLink
                    size={16}
                    className="group-hover:translate-x-1 transition-transform"
                  />
                </a>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Social Footer (Optional) */}
      <footer className="mt-12 flex justify-center border-t border-white/5 pt-8">
        <p className="text-[10px] font-black uppercase tracking-widest text-slate-600">
          © {new Date().getFullYear()} SportKorner Media Hub
        </p>
      </footer>
    </article>
  );
}
