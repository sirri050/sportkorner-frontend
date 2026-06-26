"use client";
// app/not-found.tsx
import "@/app/[locale]/globals.css";
export default function GlobalNotFound() {
  return (
    <html lang="en">
      <body className="bg-slate-950 text-white flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-6xl font-black mb-4">404</h1>
          <p className="text-slate-400 mb-8">Invalid Path or Locale</p>
          <a href="/en" className="bg-orange-600 px-6 py-3 rounded-xl uppercase font-bold text-xs">
            Return Home
          </a>
        </div>
      </body>
    </html>
  );
}