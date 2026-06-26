import { fetchStrapi } from "@/lib/strapi";
import { notFound } from "next/navigation";
import { getLocale, getTranslations } from "next-intl/server";
import { Calendar, User, ArrowLeft, Share2 } from "lucide-react";
import Link from "next/link";
import { BlocksRenderer } from "@strapi/blocks-react-renderer";
import Image from "next/image";
import { Metadata } from "next";

// --- SEO METADATA ---
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const locale = await getLocale();
  
  // SYNCED: Changed from "news" to "articles" to match your page logic
  const response = await fetchStrapi("articles", {
    filters: { slug },
    locale,
    populate: ["coverImage"],
  });

  const article = response.data?.[0];
  if (!article) return { title: "Article Not Found" };

  const imageUrl = article.coverImage?.url 
    ? (process.env.NEXT_PUBLIC_STRAPI_MEDIA_URL + article.coverImage.url) 
    : "/og-image.jpg";

  return {
    title: article.title,
    description: article.excerpt || article.title,
    openGraph: {
      title: article.title,
      description: article.excerpt,
      type: "article",
      publishedTime: article.createdAt,
      authors: [article.author?.username || "SportKorner"],
      images: [{ url: imageUrl, width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title: article.title,
      description: article.excerpt,
      images: [imageUrl],
    },
  };
}

export default async function SingleArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const locale = await getLocale();
  const t = await getTranslations("Articles");

  const response = await fetchStrapi("articles", {
    filters: { slug },
    locale,
    populate: ["coverImage", "author"],
  });

  const article = response.data?.[0];
  if (!article) notFound();

  // --- JSON-LD STRUCTURED DATA ---
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SportsArticle",
    "headline": article.title,
    "description": article.excerpt,
    "image": process.env.NEXT_PUBLIC_STRAPI_MEDIA_URL + article.coverImage?.url,
    "datePublished": article.createdAt,
    "author": [{
        "@type": "Person",
        "name": article.author?.username || "Community Member",
    }],
  };

  return (
    <article className="max-w-4xl mx-auto py-12 px-4" dir={locale === 'ar' ? 'rtl' : 'ltr'}>
      {/* 1. Inject JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Back Button */}
      <Link 
        href={`/${locale}/articles`}
        className="inline-flex items-center gap-2 text-slate-500 hover:text-orange-500 mb-8 text-xs font-black uppercase transition-colors"
      >
        <ArrowLeft size={16} className={locale === 'ar' ? 'rotate-180' : ''} />
        {t("backToList")}
      </Link>

      <header className="mb-10 space-y-6">
        <h1 className="text-4xl md:text-6xl font-black italic uppercase tracking-tighter leading-[0.95]">
          {article.title}
        </h1>

        <div className="flex flex-wrap items-center gap-6 py-6 border-y border-white/5">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-400">
            <User size={14} className="text-orange-600" />
            <span className="text-white">{article.author?.username || "Community Member"}</span>
          </div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-400">
            <Calendar size={14} className="text-orange-600" />
            <span>{new Date(article.createdAt).toLocaleDateString(locale)}</span>
          </div>
          <button className="mr-auto text-slate-500 hover:text-white transition-colors">
            <Share2 size={18} />
          </button>
        </div>
      </header>

      <div className="relative aspect-video rounded-[2.5rem] overflow-hidden mb-12 border border-white/5 bg-slate-900 shadow-2xl">
        {article.coverImage?.url ? (
          <Image 
            src={process.env.NEXT_PUBLIC_STRAPI_MEDIA_URL + article.coverImage.url} 
            alt={article.title}
            className="object-cover"
            fill
            priority // Changed to priority since it's the LCP (Largest Contentful Paint)
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-4xl font-black italic text-white/5">
            SPORTKORNER
          </div>
        )}
      </div>

      <div className="prose prose-invert prose-orange max-w-none 
        prose-p:text-slate-300 prose-p:leading-relaxed prose-p:text-lg 
        prose-headings:italic prose-headings:font-black prose-headings:uppercase">
        <BlocksRenderer content={article.content} />
      </div>

      <footer className="mt-16 p-8 rounded-3xl bg-white/5 border border-white/5 italic text-sm text-slate-500">
        {t("disclaimer")}
      </footer>
    </article>
  );
}