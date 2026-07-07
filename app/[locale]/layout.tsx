import Header from "@/lib/components/layout/header";
import "./globals.css";
import { Inter, Montserrat, Cairo } from "next/font/google"; // Added Cairo for Arabic
import Footer from "@/lib/components/layout/footer";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages } from "next-intl/server";
import NewsTicker from "@/lib/components/news/widget.newsTicker";
import ConstructionBanner from "@/lib/components/layout/ConstructionBanner";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const montserrat = Montserrat({
  weight: ["700", "900"],
  subsets: ["latin"],
  variable: "--font-montserrat",
});

// High-impact font for Arabic Sports UI
const cairo = Cairo({ subsets: ["arabic"], variable: "--font-cairo" });

import { Metadata } from "next";
import Script from "next/script";
import ServiceWorker from "@/components/ServiceWorker";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const isAr = locale === "ar";

  return {
    title: {
      default: isAr ? "سبورت كورنر | منصة التحليل الرياضي" : "SportKorner | Premium Sports Analysis",
      template: `%s | SportKorner`
    },
    description: isAr
      ? "المنصة الأولى لتغطية كأس العالم 2026، أخبار الرياضة العربية وتحليلات البيانات الجغرافية للملاعب."
      : "The premier platform for World Cup 2026 coverage, Arabic sports news, and GIS stadium analytics.",
    keywords: ["Sports", "Arabic", "World Cup 2026", "Football Analysis", "كرة القدم", "الكرة العربية", "كأس العالم"],
    authors: [{ name: "Tariq Bacheer" }],
    metadataBase: new URL("https://sportkorner.com"),
    alternates: {
      canonical: `/${locale}`,
      languages: {
        "en-US": "/en",
        "ar-AR": "/ar",
      },
    },
    openGraph: {
      type: "website",
      siteName: "SportKorner",
      locale: isAr ? "ar_AR" : "en_US",
      images: [
        {
          url: "/og-image.jpg", // Create a high-impact sports image in /public
          width: 1200,
          height: 630,
          alt: "SportKorner - The Future of Sports Media",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: "SportKorner",
      creator: "@sportkorner",
    },
    manifest: "/manifest.json",
    icons: {
      icon: "/favicon.ico",
      apple: "/apple-touch-icon.png",
    },
    appleWebApp: {
      capable: true,
      title: "SportKorner",
      statusBarStyle: "black-translucent",
    },
  };
}

export default async function RootLayout({
  children,
  //params: { locale },
}: {
  children: React.ReactNode;
  // params: { locale: string };
}) {
  // Get messages for the Client Provider
  const messages = await getMessages();
  const locale = await getLocale();

  // Determine direction
  const isRTL = locale === "ar";
  const direction = isRTL ? "rtl" : "ltr";

  return (
    <html
      lang={locale}
      dir={direction}
      className={`${inter.variable} ${montserrat.variable} ${cairo.variable} scroll-smooth overflow-x-hidden`}
    >
      <head>
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=AW-${process.env.NEXT_PUBLIC_GOOGLE_ADS_ID}`}
          strategy="afterInteractive"
        />

        <Script id="google-ads" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', 'AW-18272181037');
          `}
        </Script>
      </head>
      <body
        className={`bg-slate-950 text-slate-100 overflow-x-hidden antialiased ${isRTL ? "font-cairo" : "font-inter"}`}
        suppressHydrationWarning={true}
      >
        <NextIntlClientProvider messages={messages}>
          <div className="flex flex-col min-h-screen">
            <ConstructionBanner />
            <ServiceWorker />
            <Header />


            <main className="flex-1">
              <div className=" max-w-7xl mx-auto ">
                <NewsTicker />
              </div>
              {children}
            </main>
            <Footer />
          </div>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
