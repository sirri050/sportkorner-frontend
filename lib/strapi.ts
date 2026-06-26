import qs from "qs";

export async function fetchStrapi(
  path: string,
  urlParamsObject = {},
  options = {},
) {
  const { NEXT_PUBLIC_STRAPI_URL, STRAPI_API_TOKEN } = process.env;
  //console.log(NEXT_PUBLIC_STRAPI_URL,STRAPI_API_TOKEN);
  

  const queryString = qs.stringify(urlParamsObject);
  const requestUrl = `${NEXT_PUBLIC_STRAPI_URL}/api/${path}${queryString ? `?${queryString}` : ""}`;

  const res = await fetch(requestUrl, {
    headers: {
      Authorization: `Bearer ${STRAPI_API_TOKEN}`,
      "Content-Type": "application/json",
    },
    ...options,
  });

  if (!res.ok) throw new Error(`Strapi Fetch Error: ${res.statusText}`);
  return await res.json();
}
