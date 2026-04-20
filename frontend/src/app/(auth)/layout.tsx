import Link from "next/link";
import { GraduationCap, BookOpen, Headphones, ClipboardList } from "lucide-react";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="min-h-screen flex"
      style={{ background: "hsl(222 47% 8%)" }}
    >
      {/* ── Left branding panel (desktop only) ───────────────── */}
      <div className="hidden lg:flex flex-col w-[400px] flex-shrink-0 p-8 relative overflow-hidden" style={{ minHeight: 0 }}>
        {/* Gradient orbs */}
        <div className="absolute inset-0 pointer-events-none">
          <div
            className="absolute -top-20 -left-20 w-80 h-80 rounded-full blur-[80px] opacity-25"
            style={{ background: "hsl(221 83% 53%)" }}
          />
          <div
            className="absolute bottom-0 right-0 w-64 h-64 rounded-full blur-[80px] opacity-20"
            style={{ background: "hsl(262 83% 58%)" }}
          />
        </div>

        {/* Logo */}
        <div className="relative z-10 flex items-center gap-3 mb-12">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg">
            <GraduationCap className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="font-bold text-white text-lg leading-none">TOEIC Master</div>
            <div className="text-blue-400 text-xs mt-0.5">Learn. Practice. Succeed.</div>
          </div>
        </div>

        {/* Main copy */}
        <div className="relative z-10 flex-1">
          <h2 className="text-3xl font-bold text-white leading-tight mb-3">
            Chinh phục TOEIC<br />
            <span className="text-transparent bg-clip-text"
              style={{ backgroundImage: "linear-gradient(135deg, #60a5fa, #a78bfa)" }}>
              900+ điểm
            </span>
          </h2>
          <p className="text-white/55 text-sm leading-relaxed mb-10">
            Hơn 50,000 học viên tại Việt Nam đã tin tưởng sử dụng TOEIC Master
            để cải thiện điểm số và đạt được mục tiêu của mình.
          </p>

          {/* Feature list */}
          <div className="space-y-4">
            {[
              { icon: BookOpen, color: "#60a5fa", label: "1,000+ từ vựng TOEIC theo chủ đề" },
              { icon: Headphones, color: "#a78bfa", label: "Luyện nghe Parts 1–4 với transcript" },
              { icon: ClipboardList, color: "#34d399", label: "3 bộ đề thi thử chuẩn ETS 200 câu" },
            ].map(({ icon: Icon, color, label }, i) => (
              <div key={i} className="flex items-center gap-3">
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ background: `${color}20` }}
                >
                  <Icon className="w-4 h-4" style={{ color }} />
                </div>
                <span className="text-white/75 text-sm">{label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Stats row */}
        <div className="relative z-10 grid grid-cols-3 gap-3 mt-10">
          {[
            { value: "50K+", label: "Học viên" },
            { value: "1,000+", label: "Từ vựng" },
            { value: "4.9★", label: "Đánh giá" },
          ].map((s) => (
            <div
              key={s.label}
              className="rounded-xl p-3 text-center"
              style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.08)" }}
            >
              <div className="font-bold text-lg text-white leading-none">{s.value}</div>
              <div className="text-white/45 text-xs mt-1">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="relative z-10 text-white/25 text-xs mt-8">© 2026 TOEIC Master</div>
      </div>

      {/* ── Right form panel ──────────────────────────────────── */}
      <div
        className="flex-1 flex items-center justify-center p-6 lg:p-10"
        style={{ background: "hsl(222 47% 10%)" }}
      >
        <div className="w-full max-w-[400px] animate-fade-in">
          {/* Mobile logo */}
          <Link href="/" className="flex items-center gap-2 mb-8 lg:hidden">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
              <GraduationCap className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-white text-sm">TOEIC Master</span>
          </Link>

          {children}
        </div>
      </div>
    </div>
  );
}
