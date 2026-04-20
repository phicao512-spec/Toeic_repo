import Link from "next/link";
import {
  GraduationCap, CheckCircle, Headphones, BookOpen,
  ClipboardList, TrendingUp, Star, Users, Zap, ArrowRight,
} from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen" style={{ background: "hsl(var(--background))" }}>

      {/* ── Navbar ────────────────────────────────────────────── */}
      <nav
        className="sticky top-0 z-50 border-b"
        style={{
          background: "hsl(var(--card) / 0.95)",
          backdropFilter: "blur(12px)",
          borderColor: "hsl(var(--border))",
        }}
      >
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-md">
              <GraduationCap className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="font-bold text-sm leading-none">TOEIC Master</div>
              <div className="text-xs text-blue-500 font-medium">Learn. Practice. Succeed.</div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="btn btn-secondary text-sm px-4 py-2 hidden sm:inline-flex"
            >
              Đăng nhập
            </Link>
            <Link
              href="/register"
              className="btn text-sm px-4 py-2 text-white"
              style={{ background: "linear-gradient(135deg, hsl(221 83% 53%), hsl(262 83% 58%))" }}
            >
              Thử miễn phí
            </Link>
          </div>
        </div>
      </nav>

      {/* ── Hero ──────────────────────────────────────────────── */}
      <section className="relative overflow-hidden pt-20 pb-28 lg:pt-28 lg:pb-36">
        {/* Background glow */}
        <div className="absolute inset-0 -z-10 pointer-events-none">
          <div
            className="absolute top-0 left-1/3 w-[500px] h-[500px] rounded-full blur-[100px] opacity-15"
            style={{ background: "hsl(221 83% 53%)" }}
          />
          <div
            className="absolute top-10 right-1/4 w-[400px] h-[400px] rounded-full blur-[100px] opacity-10"
            style={{ background: "hsl(262 83% 58%)" }}
          />
        </div>

        <div className="max-w-4xl mx-auto px-6 text-center">
          {/* Badge */}
          <div
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium mb-6 animate-fade-in"
            style={{ background: "hsl(var(--primary) / 0.1)", color: "hsl(var(--primary))" }}
          >
            <Zap className="w-3.5 h-3.5" />
            Phương pháp học hiệu quả nhất 2026
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-5 leading-[1.15] animate-fade-in delay-100">
            Chinh phục{" "}
            <span className="gradient-text">TOEIC 900+</span>
          </h1>
          <p
            className="text-lg sm:text-xl max-w-2xl mx-auto mb-8 leading-relaxed animate-fade-in delay-200"
            style={{ color: "hsl(var(--muted-foreground))" }}
          >
            Luyện tập thông minh với 1,000+ từ vựng, nghe, đọc và đề thi thử chuẩn ETS.
            Theo dõi tiến trình và đạt điểm mục tiêu nhanh nhất có thể.
          </p>

          {/* CTA buttons */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center mb-10 animate-fade-in delay-300">
            <Link
              href="/register"
              className="btn text-base px-8 py-3.5 text-white"
              style={{
                background: "linear-gradient(135deg, hsl(221 83% 53%), hsl(262 83% 58%))",
                boxShadow: "0 8px 32px hsl(221 83% 53% / 0.35)",
              }}
            >
              🚀 Học miễn phí ngay
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link href="/login" className="btn btn-secondary text-base px-8 py-3.5">
              Xem demo
            </Link>
          </div>

          {/* Trust badges */}
          <div
            className="flex flex-wrap items-center justify-center gap-5 text-sm animate-fade-in delay-400"
            style={{ color: "hsl(var(--muted-foreground))" }}
          >
            {[
              { icon: Users, label: "50,000+ học viên" },
              { icon: Star, label: "4.9/5 đánh giá" },
              { icon: CheckCircle, label: "Miễn phí 100%" },
            ].map(({ icon: Icon, label }) => (
              <div key={label} className="flex items-center gap-1.5">
                <Icon className="w-4 h-4 text-green-500 flex-shrink-0" />
                <span className="font-medium">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features ──────────────────────────────────────────── */}
      <section
        className="py-16 lg:py-24"
        style={{ background: "hsl(var(--muted) / 0.4)" }}
      >
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-3">
              Đầy đủ tính năng học TOEIC
            </h2>
            <p style={{ color: "hsl(var(--muted-foreground))" }}>
              Mọi thứ bạn cần để đạt điểm cao — trong một nền tảng
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              {
                icon: BookOpen, color: "#3b82f6",
                title: "Từ Vựng Thông Minh",
                desc: "1,000+ từ vựng TOEIC với flashcard và hệ thống ôn tập spaced repetition (SM-2)",
              },
              {
                icon: Headphones, color: "#8b5cf6",
                title: "Luyện Nghe Parts 1–4",
                desc: "Audio chuẩn với transcript, luyện từng phần với giải thích chi tiết",
              },
              {
                icon: BookOpen, color: "#10b981",
                title: "Luyện Đọc Parts 5–7",
                desc: "Đoạn văn authentic với highlight, phân tích ngữ pháp từng câu",
              },
              {
                icon: ClipboardList, color: "#f59e0b",
                title: "Thi Thử Chuẩn ETS",
                desc: "3 bộ đề 200 câu, tính điểm TOEIC chính xác theo bảng quy đổi ETS",
              },
              {
                icon: TrendingUp, color: "#ef4444",
                title: "Theo Dõi Tiến Trình",
                desc: "Dashboard chi tiết với streak calendar, biểu đồ chính xác, lịch sử điểm",
              },
              {
                icon: Star, color: "#ec4899",
                title: "Bảng Xếp Hạng",
                desc: "Thi đua với cộng đồng học viên hàng tuần và hàng tháng",
              },
            ].map((f, i) => (
              <div
                key={i}
                className="card p-6 hover:shadow-lg transition-all hover:-translate-y-0.5 animate-fade-in"
                style={{ animationDelay: `${i * 0.08}s` }}
              >
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center mb-4"
                  style={{ background: `${f.color}18` }}
                >
                  <f.icon className="w-5 h-5" style={{ color: f.color }} />
                </div>
                <h3 className="font-bold mb-2 text-sm sm:text-base">{f.title}</h3>
                <p
                  className="text-sm leading-relaxed"
                  style={{ color: "hsl(var(--muted-foreground))" }}
                >
                  {f.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Steps (How it works) ──────────────────────────────── */}
      <section className="py-16 lg:py-24">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold mb-3">Bắt đầu chỉ trong 3 bước</h2>
            <p style={{ color: "hsl(var(--muted-foreground))" }}>Đơn giản, nhanh chóng, hiệu quả</p>
          </div>
          <div className="grid sm:grid-cols-3 gap-8">
            {[
              { step: "01", title: "Đăng ký miễn phí", desc: "Tạo tài khoản trong 30 giây, không cần thẻ tín dụng", icon: "🎯" },
              { step: "02", title: "Chọn lộ trình học", desc: "Học từ vựng, luyện nghe, đọc theo thứ tự hoặc theo nhu cầu", icon: "📚" },
              { step: "03", title: "Thi thử & cải thiện", desc: "Làm đề thi thử, xem phân tích điểm và tiếp tục cải thiện", icon: "🏆" },
            ].map((s, i) => (
              <div key={i} className="text-center">
                <div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 text-2xl"
                  style={{ background: "hsl(var(--muted))" }}
                >
                  {s.icon}
                </div>
                <div
                  className="text-xs font-bold tracking-widest mb-2"
                  style={{ color: "hsl(var(--primary))" }}
                >
                  BƯỚC {s.step}
                </div>
                <h3 className="font-bold mb-2">{s.title}</h3>
                <p className="text-sm" style={{ color: "hsl(var(--muted-foreground))" }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Banner ────────────────────────────────────────── */}
      <section className="py-16 lg:py-20" style={{ background: "hsl(var(--muted) / 0.4)" }}>
        <div className="max-w-4xl mx-auto px-6">
          <div
            className="rounded-3xl px-8 py-14 lg:px-16 text-center"
            style={{
              background: "linear-gradient(135deg, hsl(221 83% 53%), hsl(262 83% 58%))",
            }}
          >
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-4">
              Sẵn sàng bắt đầu hành trình?
            </h2>
            <p className="text-white/80 mb-8 text-base sm:text-lg">
              Tham gia cùng 50,000+ học viên đang học TOEIC mỗi ngày.
            </p>
            <Link
              href="/register"
              className="btn text-base px-8 py-3.5 font-semibold"
              style={{ background: "white", color: "hsl(221 83% 48%)" }}
            >
              🎓 Đăng ký miễn phí
            </Link>
          </div>
        </div>
      </section>

      {/* ── Footer ────────────────────────────────────────────── */}
      <footer className="border-t py-8" style={{ borderColor: "hsl(var(--border))" }}>
        <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <GraduationCap className="w-4 h-4 text-blue-500" />
            <span className="font-semibold text-sm">TOEIC Master</span>
          </div>
          <p className="text-xs" style={{ color: "hsl(var(--muted-foreground))" }}>
            © 2026 TOEIC Master. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
