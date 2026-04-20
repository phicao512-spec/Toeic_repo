import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"),
  title: {
    default: "TOEIC Master - Học Tiếng Anh Thi TOEIC",
    template: "%s | TOEIC Master",
  },
  description:
    "Nền tảng học TOEIC trực tuyến hàng đầu. Luyện từ vựng, nghe, đọc và thi thử với hơn 1000 câu hỏi chuẩn ETS.",
  keywords: ["TOEIC", "học tiếng Anh", "luyện thi TOEIC", "từ vựng TOEIC", "đề thi TOEIC"],
  openGraph: {
    type: "website",
    locale: "vi_VN",
    url: "/",
    siteName: "TOEIC Master",
    title: "TOEIC Master - Học Tiếng Anh Thi TOEIC",
    description: "Nền tảng học TOEIC trực tuyến hàng đầu Việt Nam",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  );
}
