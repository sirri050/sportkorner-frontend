import { fetchStrapi } from "../strapi";

export async function getSpotlightByType(type: string, limit = 1, locale: string = "en") {
  const res = await fetchStrapi("spotlights", {
    filters: { type: { $eq: type } },
    locale,
    sort: ["createdAt:desc"],
    populate: "*",
    pagination: { limit },
  });
  return res.data;
}

export async function getAllSpotlights(page = 1, pageSize = 9, locale = "en") {
  return await fetchStrapi("spotlights", {
    locale,
    sort: "createdAt:desc",
    pagination: {
      page,
      pageSize,
    },
    populate: ["coverImage"],
  });
}