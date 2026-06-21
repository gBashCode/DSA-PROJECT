import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "next-themes";
import Nav from "@/components/nav";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "DSA Practice",
  description: "Track your progress. Visualize algorithms. Ship with confidence.",
  manifest: "/manifest.json",
  themeColor: "#f59e0b",
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "DSA Practice",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} dark`}
      suppressHydrationWarning
    >
      <body className="min-h-screen flex flex-col bg-bg text-text font-sans antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          disableTransitionOnChange={false}
        >
          <Nav />
          <main className="flex-1">{children}</main>
          <footer className="border-t border-border py-8 text-center">
            <p className="text-xs font-mono text-text-muted">
              &copy; {new Date().getFullYear()} DSA Practice &middot; Track your progress &middot; Visualize algorithms &middot; Ship with confidence
            </p>
          </footer>
        </ThemeProvider>
      </body>
    </html>
  );
}
