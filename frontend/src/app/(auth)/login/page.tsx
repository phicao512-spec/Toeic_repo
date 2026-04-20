"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { API_BASE_URL } from "@/lib/constants";

export default function LoginPage() {
  const router = useRouter();
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({ email: "", password: "" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.email || !form.password) { setError("Vui lòng nhập đầy đủ"); return; }
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!data.success) { setError(data.error?.message || "Đăng nhập thất bại"); setLoading(false); return; }
      localStorage.setItem("access_token", data.data.accessToken);
      localStorage.setItem("refresh_token", data.data.refreshToken);
      localStorage.setItem("user", JSON.stringify(data.data.user));
      router.push("/dashboard");
    } catch {
      setError("Không thể kết nối server");
    }
    setLoading(false);
  };

  const inputStyle: React.CSSProperties = { background: "rgba(255,255,255,0.06)", borderColor: "rgba(255,255,255,0.12)", color: "white" };

  return (
    <div>
      <div className="mb-7">
        <h1 className="text-2xl font-bold text-white mb-1">Chào mừng trở lại!</h1>
        <p className="text-sm" style={{ color: "rgba(255,255,255,0.45)" }}>Đăng nhập để tiếp tục hành trình TOEIC</p>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-white/70">Email</label>
          <input type="email" required placeholder="email@example.com" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="input" style={inputStyle} />
        </div>
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="block text-sm font-medium text-white/70">Mật khẩu</label>
            <Link href="/forgot-password" className="text-xs font-medium" style={{ color: "hsl(213 93% 67%)" }}>Quên mật khẩu?</Link>
          </div>
          <div className="relative">
            <input type={showPw ? "text" : "password"} required placeholder="Nhập mật khẩu" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} className="input pr-10" style={inputStyle} />
            <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2" style={{ color: "rgba(255,255,255,0.4)" }}>
              {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>
        {error && <div className="rounded-lg px-3.5 py-2.5 text-sm" style={{ background: "hsl(0 84% 60%/0.1)", border: "1px solid hsl(0 84% 60%/0.25)", color: "hsl(0 84% 72%)" }}>{error}</div>}
        <button type="submit" disabled={loading} className="btn w-full py-3 text-sm font-semibold text-white mt-1" style={{ background: "linear-gradient(135deg, hsl(221 83% 53%), hsl(262 83% 58%))", opacity: loading ? 0.75 : 1 }}>
          {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Đang đăng nhập...</> : "Đăng nhập"}
        </button>
        <div className="flex items-center gap-3">
          <div className="flex-1 h-px" style={{ background: "rgba(255,255,255,0.1)" }} />
          <span className="text-xs" style={{ color: "rgba(255,255,255,0.3)" }}>hoặc</span>
          <div className="flex-1 h-px" style={{ background: "rgba(255,255,255,0.1)" }} />
        </div>
        <button type="button" onClick={() => setForm({ email: "demo@toeic.vn", password: "demo1234" })} className="btn w-full py-2.5 text-sm" style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.7)" }}>
          🎮 Dùng tài khoản demo
        </button>
      </form>
      <p className="text-center mt-6 text-sm" style={{ color: "rgba(255,255,255,0.4)" }}>
        Chưa có tài khoản? <Link href="/register" className="font-semibold" style={{ color: "hsl(213 93% 67%)" }}>Đăng ký miễn phí</Link>
      </p>
    </div>
  );
}
