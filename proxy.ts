import { type NextRequest } from "next/server";
import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

const handleI18nRouting = createMiddleware(routing);

export function proxy(request: NextRequest) {
  return handleI18nRouting(request);
}

// FORCE VERCEL EDGE LAYER
export const runtime = "edge";

export const config = {
  matcher: [
    '/', 
    '/(en|ar)/:path*', 
    '/((?!api|trpc|_next|_vercel|.*\\..*).*)'
  ]
};