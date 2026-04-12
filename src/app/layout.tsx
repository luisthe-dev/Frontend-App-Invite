import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import ToastProvider from "./components/ToastProvider";
import { ThemeProvider } from "@/components/theme-provider";
import { GoogleAnalytics } from "@next/third-parties/google";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://myinvite.ng"),
  title: {
    default: "MyInvite - Find Your Next Experience",
    template: "%s | MyInvite",
  },
  description: "Discover thousands of events happening near you and around the world. Create, promote, and sell tickets to your events with MyInvite.",
  keywords: ["events", "tickets", "concert", "party", "conference", "meetup", "Nigeria", "Lagos", "event management"],
  authors: [{ name: "MyInvite" }],
  creator: "MyInvite",
  icons: {
    icon: [
      { url: '/Logos/mi_regular.png', sizes: '32x32', type: 'image/png' },
      // { url: '/Logos/myinvite_37x33.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: '/Logos/mi_regular.png',
  },
  openGraph: {
    type: "website",
    locale: "en_NG",
    siteName: "MyInvite",
    title: "MyInvite - Find Your Next Experience",
    description: "Discover thousands of events happening near you and around the world.",
    url: "/",
    images: [
      {
        url: "/Logos/myinvite_579x519.png",
        width: 579,
        height: 519,
        alt: "MyInvite Logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "MyInvite - Find Your Next Experience",
    description: "Discover thousands of events happening near you and around the world.",
    images: ["/Logos/myinvite_579x519.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
    other: {
      "msvalidate.01": [process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION || ""],
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${outfit.variable} font-sans antialiased`}>
        <ToastProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {children}
          </ThemeProvider>
        </ToastProvider>
      </body>
      <GoogleAnalytics gaId="G-VQC67WDFQQ" />
    </html>
  );
}
