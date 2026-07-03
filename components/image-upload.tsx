"use client";

import { useState, ChangeEvent, useEffect, useRef } from "react";
import { Upload, X } from "lucide-react";
import Image from "next/image";

export default function ImageUpload({state,translations}:{ state:{success:boolean, message:string}, translations: {
        publish: string;
        title: string;
        excerpt: string;
        excerptPlaceholder: string;
        coverImage: string;
        uploadHint: string;
        content: string;
    };}) {
  const [preview, setPreview] = useState<string | null>(null);
useEffect(() => {
  if (!state.success && state.message) {
    setPreview(null);

    if (inputRef.current) {
      inputRef.current.value = "";
    }
  }
}, [state.success, state.message]);
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) {
      setPreview(null);
      return;
    }

    const url = URL.createObjectURL(file);
    setPreview(url);
  };
  const inputRef = useRef<HTMLInputElement>(null);
  return (
    <div className="space-y-2">
      <div className="border-2 border-dashed border-white/10 rounded-2xl overflow-hidden">
        <input
        ref={inputRef}
          id="img-upload"
          type="file"
          name="image"
          accept="image/*"
          className="hidden"
          onChange={handleChange}
        />

        {preview ? (
          <div className="relative">
            <Image
              src={preview}
              alt="Preview"
              width={1200}
              height={600}
              className="w-full h-72 object-cover"
              unoptimized
            />

            <label
              htmlFor="img-upload"
              className="absolute bottom-4 right-4 bg-black/70 hover:bg-black/90 text-white px-4 py-2 rounded-xl cursor-pointer text-sm font-semibold backdrop-blur"
            >
              Change Image
            </label>
          </div>
        ) : (
          <label
            htmlFor="img-upload"
            className="cursor-pointer flex flex-col items-center justify-center h-72 text-slate-400 hover:text-orange-500 transition-colors"
          >
            <Upload className="w-12 h-12 mb-4" />

            <p className="font-bold uppercase text-sm">
              {translations.uploadHint}
            </p>

            <p className="text-xs text-slate-500 mt-2">
              PNG, JPG, JPEG, WEBP
            </p>
          </label>
        )}
      </div>
    </div>
  );
}