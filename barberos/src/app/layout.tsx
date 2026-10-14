import "@fontsource-variable/assistant";
import "@fontsource-variable/frank-ruhl-libre";
import "./globals.css";
import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { brand } from "@/content/site";
import { siteUrl } from "@/lib/env";
import { getShopProfile } from "@/modules/shop";
import { MobileBookingBar } from "@/ui/mobile-booking-bar";
import { SiteFooter } from "@/ui/site-footer";
import { SiteHeader } from "@/ui/site-header";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl()),
  title: { default: `${brand.name} | מספרת גברים בחיפה`, template: `%s | ${brand.name} חיפה` },
  description: brand.description,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "he_IL",
    siteName: brand.name,
    images: [{ url: "/images/editorial-golden-hour.jpg", width: 2000, height: 1500 }],
  },
};

export const viewport: Viewport = {
  themeColor: "#0f0e0d",
  colorScheme: "dark",
};

export default async function RootLayout({ children }: { children: ReactNode }) {
  const shop = await getShopProfile();
  return (
    <html lang="he" dir="rtl">
      <body className="min-h-dvh">
        <a
          href="#main"
          className="sr-only z-50 bg-brass px-4 py-3 font-semibold text-ink focus:not-sr-only focus:fixed focus:top-3 focus:start-3"
        >
          דילוג לתוכן הראשי
        </a>
        <SiteHeader />
        <main id="main" tabIndex={-1} className="outline-none">
          {children}
        </main>
        <SiteFooter shop={shop} />
        <MobileBookingBar phone={shop.location.phone} />
      </body>
    </html>
  );
}
