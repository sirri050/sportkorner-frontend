import Image from "next/image";

export default function ImageBlock({ block }: { block: any }) {
  const image = block.Image;

  if (!image) return null;

  return (
    <figure className="my-10">
      <div className="relative w-full aspect-video overflow-hidden rounded-3xl shadow-xl">
        <Image
          src={`${process.env.NEXT_PUBLIC_STRAPI_MEDIA_URL}${image.url}`}
          alt={block.caption || image.alternativeText || ""}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 896px"
          unoptimized
        />
      </div>

      {block.caption && (
        <figcaption className="mt-4 text-center text-sm text-slate-400 italic">
          {block.caption}
        </figcaption>
      )}
    </figure>
  );
}