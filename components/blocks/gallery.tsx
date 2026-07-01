import Image from "next/image";

export default function Gallery({ block }:{block:any}) {
  if (!block.images?.length) return null;

  return (
    <section className="my-10">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {block.images.map((image:any) => (
          <div
            key={image.id}
            className="relative aspect-[4/3] overflow-hidden rounded-2xl"
          >
            <Image
              src={`${process.env.NEXT_PUBLIC_STRAPI_MEDIA_URL}${image.url}`}
              alt={image.alternativeText || ""}
              fill
              unoptimized
              className="object-cover transition-transform duration-300 hover:scale-105"
            />
          </div>
        ))}
      </div>

      {block.caption && (
        <p className="mt-4 text-center text-sm text-slate-400">
          {block.caption}
        </p>
      )}
    </section>
  );
}