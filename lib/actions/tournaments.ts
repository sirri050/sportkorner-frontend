import { fetchStrapi } from "../strapi";

export async function getTournaments(locale: string = "en") {
  const res = await fetchStrapi("tournaments", {
    locale: locale,
    sort: ["tournament_status:asc", "start_date:asc"], // Upcoming and Live first
    populate: "*",
  });
  return res.data;
}