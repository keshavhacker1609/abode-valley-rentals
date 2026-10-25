import type { Metadata, Viewport } from "next";
import { Fraunces, Manrope } from "next/font/google";
import { Toaster } from "sonner";
import { SiteProvider } from "@/components/providers/site-context";
import { SmoothScroll } from "@/components/providers/smooth-scroll";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { ContactActions } from "@/components/layout/contact-actions";
import { Preloader } from "@/components/layout/preloader";
import { CompareTray, CustomCursor, ExitIntent } from "@/components/layout/deferred";
import { preloaderScript, themeScript } from "@/lib/inline-scripts";
import { getSiteConfig } from "@/lib/site";
import { localBusinessLd } from "@/lib/seo";
import { JsonLd } from "@/lib/jsonld";
import "./globals.css";

const display = Fraunces({ subsets: ["latin"], variable: "--font-display", axes: ["opsz", "SOFT"], display: "swap" });
const body = Manrope({ subsets: ["latin"], variable: "--font-body", display: "swap" });

export function generateMetadata(): Metadata {
  const site = getSiteConfig();
  return {
    metadataBase: new URL(site.url),
    title: { default: `Flats for rent in Abode Valley, Kattankulathur | ${site.name}`, template: `%s | ${site.name}` },
    description:
      "2.75 BHK and 3 BHK flats for rent at Abode Valley, Kattankulathur, 1.5 km from SRM University. Live availability across every block, with rent, deposit and maintenance listed up front.",
    keywords: ["flats for rent Kattankulathur", "Abode Valley rent", "3BHK near SRM", "2.75 BHK Potheri rent", "flats near SRM University", "Potheri apartments for rent"],
    applicationName: site.name,
    icons: { icon: "/icon.svg" },
    openGraph: { type: "website", locale: "en_IN", siteName: site.name },
    twitter: { card: "summary_large_image" },
    formatDetection: { telephone: false },
  };
}

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#F7F4EE" },
    { media: "(prefers-color-scheme: dark)", color: "#121613" },
  ],
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const site = getSiteConfig();
  return (
    <html lang="en-IN" className={`${display.variable} ${body.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: `${themeScript};${preloaderScript}` }} />
        <JsonLd data={localBusinessLd()} />
      </head>
      <body>
        <SiteProvider value={site}>
          <Preloader name={site.name} />
          <SmoothScroll />
          <Header />
          <main id="main">{children}</main>
          <Footer />
          <CompareTray />
          <ContactActions />
          <ExitIntent />
          <CustomCursor />
          <Toaster position="top-center" toastOptions={{ className: "!rounded-2xl !bg-ink !text-paper !border-0 !font-sans" }} />
        </SiteProvider>
      </body>
    </html>
  );
}
