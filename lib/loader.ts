export default function strapiLoader({ src, width }: { src: string; width: number }) {
  const root =  process.env.NEXT_PUBLIC_STRAPI_MEDIA_URL; //"https://cms.sportkorner.com";
  
  // Clean the path to get just the filename
  const fileName = src.split('/').pop();
  
  // Map Next.js requested width to Strapi's generated formats
  let prefix = "";
  if (width <= 156) prefix = "thumbnail_";
  else if (width <= 500) prefix = "small_";
  else if (width <= 750) prefix = "medium_";
  else if (width <= 1000) prefix = "large_";

  // This returns a DIRECT link to the pre-optimized WebP file in Strapi
  // No query parameters (?w=) are added, so No 400 Error!
  return `${root}/uploads/${prefix}${fileName}`;
}