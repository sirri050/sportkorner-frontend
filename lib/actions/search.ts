import { fetchStrapi } from "../strapi";

export async function searchThreads(query: string, locale: string = "en") {
  return await fetchStrapi("threads", {
    locale: locale, // Crucial: Tells Strapi which language table to search in
    filters: {
      $or: [
        { title: { $containsi: query } },
        { content: { $containsi: query } },
      ],
    },
    populate: ["author", "categories"],
    pagination: { limit: 10 },
  });
}
