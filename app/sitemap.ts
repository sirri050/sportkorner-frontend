import { MetadataRoute } from 'next';
import { fetchStrapi } from '@/lib/strapi';

const baseUrl = 'https://sportkorner.com';
const locales = ['en', 'ar'];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // 1. Static Pages Definition
  const staticPaths = [
    '',
    '/articles',
    '/articles/create',
    '/news',
    '/tournaments',
    '/spotlights',
    '/threads',
    '/new-thread',
    '/world-cup',
    '/search',
    '/login',
    '/register',
  ];

  const staticEntries: MetadataRoute.Sitemap = locales.flatMap((locale) =>
    staticPaths.map((path) => ({
      url: `${baseUrl}/${locale}${path}`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: path === '' ? 1.0 : 0.8,
    }))
  );

  // 2. Helper to fetch all slugs from a collection
  async function getDynamicEntries(contentType: string, priority: number) {
    try {
      const response = await fetchStrapi(contentType, {
        fields: ["slug", "updatedAt"],
        pagination: { limit: 2000 }, // Ensure we get all entries
      });

      if (!response.data) return [];

      return locales.flatMap((locale) => 
        response.data.map((item: any) => ({
          url: `${baseUrl}/${locale}/${contentType}/${item.slug}`,
          lastModified: new Date(item.updatedAt || new Date()),
          changeFrequency: 'weekly' as const,
          priority: priority,
        }))
      );
    } catch (error) {
      console.error(`Sitemap error for ${contentType}:`, error);
      return [];
    }
  }

  // 3. Fetch all dynamic collections in parallel
  const [
    articles,
    news,
    spotlights,
    threads,
    tournaments,
    categories
  ] = await Promise.all([
    getDynamicEntries("articles", 0.7),
    getDynamicEntries("news", 0.7),
    getDynamicEntries("spotlights", 0.7),
    getDynamicEntries("threads", 0.6),
    getDynamicEntries("tournaments", 0.8),
    getDynamicEntries("categories", 0.5),
  ]);

  return [
    ...staticEntries,
    ...articles,
    ...news,
    ...spotlights,
    ...threads,
    ...tournaments,
    ...categories,
  ];
}