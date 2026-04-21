import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tổng quan",
  description: "Xem tiến trình học TOEIC của bạn",
};

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
