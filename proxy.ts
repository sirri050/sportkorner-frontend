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
  // Match all pathnames except api, trpc, _next, _vercel and static files
  matcher: "/((?!api|trpc|_next|_vercel|.*\\..*).*)",
};