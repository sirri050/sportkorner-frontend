import { type NextRequest } from "next/server";
import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

// 1. Create the next-intl handler
const handleI18nRouting = createMiddleware(routing);

// 2. Explicitly export the 'proxy' function for Next.js 16
export function proxy(request: NextRequest) {
  return handleI18nRouting(request);
}

export const config = {
  // Match:
  // 1. The root '/'
  // 2. Paths starting with our supported locales: /en or /ar
  // 3. Skip internal Next.js files (_next, _vercel), API routes, and static files with extensions (.ico, .png, etc.)
  matcher: [
    '/', 
    '/(en|ar)/:path*', 
    '/((?!api|trpc|_next|_vercel|.*\\..*).*)'
  ]
};