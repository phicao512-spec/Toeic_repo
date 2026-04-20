import Link from "next/link";
import { GraduationCap, ArrowLeft } from "lucide-react";

export default function NotFoundPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4"
      style={{ background: "hsl(var(--background))" }}>
      <div className="text-center max-w-md">
        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center mx-auto mb-6">
          <GraduationCap className="w-10 h-10 text-white" />
        </div>
        <h1 className="text-7xl font-bold gradient-text mb-4">404</h1>
        <h2 className="text-2xl font-bold mb-3">Không tìm thấy trang</h2>
        <p className="mb-8" style={{ color: "hsl(var(--muted-foreground))" }}>
          Trang bạn đang tìm kiếm không tồn tại hoặc đã bị di chuyển.
        </p>
        <Link href="/dashboard" className="btn btn-primary inline-flex items-center gap-2">
          <ArrowLeft className="w-4 h-4" /> Về trang chủ
        </Link>
      </div>
    </div>
  );
}
