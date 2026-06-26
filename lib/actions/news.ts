import { fetchStrapi } from "../strapi";

export async function getLatestNews(limit = 5,locale: string = "en") {
  const res = await fetchStrapi("news", {
    sort: ["priority:desc", "createdAt:desc"],
    pagination: { limit },
    locale: locale, // Important: Fetch news in the correct locale
  });
  
  return res.data;
}