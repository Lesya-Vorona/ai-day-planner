import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { TasksProvider } from "@/lib/store";
import { BottomNav } from "@/components/BottomNav";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AI-планер дня",
  description: "Диктуй або пиши все, що в голові — розберемо це на задачі.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  viewportFit: "cover",
  themeColor: "#fafafa",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="uk"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-neutral-50 text-neutral-900 dark:bg-neutral-950 dark:text-neutral-50">
        <TasksProvider>
          <main className="flex-1 flex flex-col overflow-y-auto">
            {children}
          </main>
          <BottomNav />
        </TasksProvider>
      </body>
    </html>
  );
}
