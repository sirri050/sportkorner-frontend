import { fetchStrapi } from "@/lib/strapi";
import ThreadCard from "../cards/thread";
import Pagination from "./pagination";

export default async function ThreadList({
  page = 1,
  locale,
}: {
  page?: number;
  locale: string;
}) {
  // Fetch with pagination and locale parameters
  const res = await fetchStrapi("threads", {
    locale: locale, // Crucial: Fetch localized content
    populate: {
      categories: { fields: ["name", "slug"] },
      author: { fields: ["username"] },
      posts: { fields: ["id"] }, // For counting replies
    },
    sort: ["createdAt:desc"],
    pagination: {
      page: page,
      pageSize: 12,
    },
  });

  const threads = res.data;
  const meta = res.meta.pagination;

  // console.log(threads, meta);


  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4">
        {threads.map((thread: any) => (
          // ThreadCard will now receive localized category names/titles
          <ThreadCard key={thread.documentId} thread={thread} />
        ))}
      </div>

      {/* Pagination Controls */}
      {meta.pageCount > 1 && (
        <Pagination currentPage={meta.page} pageCount={meta.pageCount} />
      )}
    </div>
  );
}
