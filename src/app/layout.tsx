import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import ToastProvider from "./components/ToastProvider";
import { ThemeProvider } from "@/components/theme-provider";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
});

export const metadata: Metadata = {
  title: "MyInvite - Find Your Next Experience",
  description: "Discover thousands of events happening near you and around the world.",
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
    </html>
  );
}
