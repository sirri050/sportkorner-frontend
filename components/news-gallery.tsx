"use client";

import Image from "next/image";
import { useState } from "react";

interface Props {
  images: string[];
  title: string;
}

export default function NewsGallery({ images, title }: Props) {
  const [activeImage, setActiveImage] = useState(images[0]);

  if (!images.length) return null;

  return (
    <div className="mb-12">

      {/* Main Image */}
      <div className="relative aspect-video rounded-[1rem] sm:rounded-[2.5rem] overflow-hidden border border-white/5 shadow-2xl bg-slate-900">
        <Image
          src={activeImage}
          alt={title}
          fill
          priority
          className="object-cover"
          sizes="(max-width: 896px) 100vw, 896px"
        />
      </div>


      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="grid grid-cols-4 md:grid-cols-6  gap-1.5 sm:gap-3 mt-2 sm:mt-5">

          {images.map((img) => (
            <button
              title="Click to view this image"
              key={img}
              onClick={() => setActiveImage(img)}
              className={`
                relative aspect-video  rounded-[0.5rem] sm:rounded-xl overflow-hidden
                border-2 transition-all
                ${
                  activeImage === img
                    ? "border-orange-500 scale-105"
                    : "border-transparent opacity-70 hover:opacity-100"
                }
              `}
            >
              <Image
                src={img}
                alt={title}
                fill
                className="object-cover"
              />
            </button>
          ))}

        </div>
      )}

    </div>
  );
}