import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import AuthGuard from "@/components/AuthGuard";
import Header from "@/components/layout/Header";
import BottomNav from "@/components/layout/BottomNav";
import { ToastProvider } from "@/components/ui/Toaster";
import { AuthProvider } from "@/hooks/useAuth";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "習慣トラッカー",
  description: "毎日の習慣をチェック・記録・可視化するWebアプリケーション",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ja"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-slate-900 text-slate-100">
        <AuthProvider>
          <ToastProvider>
            <AuthGuard>
              <Header />
              <main className="flex-1 pb-16 md:pb-0">{children}</main>
              <BottomNav />
            </AuthGuard>
          </ToastProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
