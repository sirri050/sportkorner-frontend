import Sidebar from "@/lib/components/layout/sidebar";
import ReplyForm from "@/lib/components/reply/ReplyForm";
import { fetchStrapi } from "@/lib/strapi";
import { BlocksRenderer } from "@strapi/blocks-react-renderer";
import { MessageSquare, Calendar, User, Tag } from "lucide-react";
import { getTranslations, getLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { Metadata } from "next";

// --- DYNAMIC SEO ---
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const locale = await getLocale();

  const res = await fetchStrapi("threads", {
    locale,
    filters: { slug: { $eq: slug } },
    populate: ["categories"],
  });

  const thread = res.data?.[0];

  if (!thread) {
    return {
      title: "Discussion Not Found | SportKorner",
    };
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL!;
  const url = `${siteUrl}/${locale}/thread/${thread.slug}`;
  const imageUrl = `${siteUrl}/icons/icon-512.png`;

  const description = `Join the discussion about ${
    thread.categories?.[0]?.name || "sports"
  } on SportKorner. Share your insights and read community opinions.`;

  return {
    metadataBase: new URL(siteUrl),

    title: `${thread.title}`,
    description,

    alternates: {
      canonical: url,
    },

    openGraph: {
      type: "article",
      url,
      siteName: "SportKorner",
      locale,

      title: thread.title,
      description,

      publishedTime: thread.createdAt,
      modifiedTime: thread.updatedAt,

      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: thread.title,
        },
      ],
    },

    twitter: {
      card: "summary_large_image",
      title: thread.title,
      description,
      images: [
        {
          url: imageUrl,
          alt: thread.title,
        },
      ],
    },

    robots: {
      index: true,
      follow: true,
    },

    keywords: [
      "SportKorner",
      "Football",
      "Sports Discussion",
      thread.categories?.[0]?.name,
      thread.title,
    ].filter(Boolean) as string[],
  };
}
export default async function ThreadPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const locale = await getLocale();
  const t = await getTranslations("ThreadPage");
  const isAr = locale === "ar";

  const res = await fetchStrapi("threads", {
    locale: locale,
    filters: { slug: { $eq: slug } },
    populate: {
      author: { fields: ["username"] },
      categories: { fields: ["name", "slug"] },
      posts: {
        populate: { author: { fields: ["username"] } },
        sort: ["createdAt:asc"], // Oldest first for logical conversation flow
      },
    },
  });

  const thread = res.data?.[0];
  if (!thread) notFound();

  // --- JSON-LD FOR DISCUSSIONS ---
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "DiscussionForumPosting",
    "headline": thread.title,
    "author": {
      "@type": "Person",
      "name": thread.author?.username || "Community Member"
    },
    "datePublished": thread.createdAt,
    "articleSection": thread.categories?.[0]?.name,
    "commentCount": thread.posts?.length || 0,
  };

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 py-12" dir={isAr ? 'rtl' : 'ltr'}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="flex flex-col lg:flex-row gap-12">
        <div className="flex-1 min-w-0 space-y-8">

          {/* Main Thread Content */}
          <article className="glass p-10 md:p-14 rounded-[3rem] border border-white/5 bg-white/[0.01] shadow-2xl relative overflow-hidden">
            <header className="relative z-10 space-y-6">
              <div className="flex items-center gap-3">
                <div className="bg-orange-500/20 p-2 rounded-lg border border-orange-500/20">
                  <Tag size={16} className="text-orange-500" />
                </div>
                <span className="text-[10px] font-black text-orange-500 uppercase tracking-[0.2em]">
                  {thread.categories?.[0]?.name}
                </span>
              </div>

              <h1 className="text-2xl md:text-4xl font-black italic uppercase tracking-tighter leading-[0.98] text-white">
                {thread.title}
              </h1>

              <div className="flex flex-wrap items-center gap-6 pt-8 border-t border-white/5">
                <div className="flex items-center gap-3 group">
                  <div className="h-12 w-12 rounded-2xl bg-orange-600 flex items-center justify-center text-white font-black text-xl shadow-lg shadow-orange-900/40">
                    {thread.author?.username?.[0].toUpperCase()}
                  </div>
                  <div>
                    <p className="text-sm font-black uppercase tracking-widest text-white">
                      @{thread.author?.username}
                    </p>
                    <p className="text-[10px] font-bold text-slate-500 flex items-center gap-1 mt-0.5">
                      <Calendar size={12} className="text-orange-600" />
                      {new Date(thread.createdAt).toLocaleDateString(locale, { dateStyle: 'long' })}
                    </p>
                  </div>
                </div>
              </div>

              {/* Thread Body */}
              <div className="mt-12 prose prose-invert max-w-none 
                prose-p:text-slate-300 prose-p:text-xl prose-p:leading-relaxed
                prose-strong:text-white prose-headings:italic prose-headings:font-black">
                {thread.content ? (
                  <BlocksRenderer content={thread.content} />
                ) : (
                  <p className="italic text-slate-600">{t("noDescription")}</p>
                )}
              </div>
            </header>

            {/* Background Decoration */}
            <span className="absolute -bottom-8 right-[-5%] text-[12rem] font-black text-white/[0.02] uppercase italic select-none pointer-events-none whitespace-nowrap">
              {thread.categories?.[0]?.name}
            </span>
          </article>

          {/* Replies Section */}
          <section className="space-y-6 mt-16">
            <div className="flex items-center justify-between border-b border-white/5 pb-6">
              <h3 className="flex items-center gap-3 text-2xl font-black uppercase italic tracking-tighter">
                <MessageSquare size={24} className="text-orange-500" />
                {t("replies")} <span className="text-orange-500">({thread.posts?.length || 0})</span>
              </h3>
            </div>

            <div className="space-y-4">
              {thread.posts?.map((post: any) => (
                <div
                  key={post.documentId || post.id}
                  className="glass p-8 rounded-[2.5rem] border-s-4 border-s-slate-800 hover:border-s-orange-600 transition-all duration-300 bg-white/[0.01]"
                >
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-xl bg-slate-900 border border-white/10 flex items-center justify-center text-xs font-black text-orange-500">
                        {post.author?.username?.[0].toUpperCase()}
                      </div>
                      <div className="flex flex-col">
                        <span className="font-black text-xs uppercase tracking-widest text-white">
                          @{post.author?.username}
                        </span>
                        <span className="text-slate-600 text-[10px] font-bold">
                          {new Date(post.createdAt).toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="text-slate-300 text-lg leading-relaxed prose prose-invert max-w-none prose-p:m-0">
                    <BlocksRenderer content={post.content} />
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Reply Form Container */}
          <div className="mt-12">
            <ReplyForm threadId={thread.documentId} />
          </div>
        </div>

        {/* Sidebar */}
        <aside className="lg:w-80 shrink-0">
          <Sidebar locale={locale} />
        </aside>
      </div>
    </main>
  );
}