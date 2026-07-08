import { fetchStrapi } from "../strapi";

export async function searchThreads(query: string, locale: string = "en") {

  const news= await fetchStrapi("news", {
    locale: locale,
    filters:{
      $or:[
        { title: { $containsi: query } },
        {slug:{ $containsi: query }}
      ]
    },
    sort: [{ createdAt: "desc" }],
    populate:["coverImage"],
    pagination: { limit: 10 },
  });
  console.log("news got from query: ",news)
  const spotlights= await fetchStrapi("spotlights", {
    locale: locale,
    filters:{
      $or:[
        { title: { $containsi: query } },
        { playerName: { $containsi: query } },
        {slug:{ $containsi: query }}
      ]
    },
    sort: [{ createdAt: "desc" }],
    populate:["coverImage"],
    pagination: { limit: 10 },
  });
  console.log("spotlights got from query: ",spotlights)

  const threads = await fetchStrapi("threads", {
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
  console.log("threads got from query: ",threads)

  return { news, spotlights, threads };
}
