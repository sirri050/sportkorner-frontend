import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

export default createMiddleware(routing);

export const config = {
  // Match the root, the locales, and exclude static/internal paths
 matcher: [
    '/',
    '/(ar|en)/:path*'
  ]
};