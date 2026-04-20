"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Loader2, CheckCircle } from "lucide-react";
import { API_BASE_URL } from "@/lib/constants";

function PasswordStrength({ password }: { password: string }) {
  if (!password) return null;
  const checks = [password.length >= 8, /[A-Z]/.test(password), /[0-9]/.test(password), /[^A-Za-z0-9]/.test(password)];
  const strength = checks.filter(Boolean).length;
  const labels = ["", "Yếu", "Trung bình", "Khá mạnh", "Rất mạnh"];
  const colors = ["", "#ef4444", "#f59e0b", "#3b82f6", "#10b981"];
  return (
    <div className="mt-2 space-y-1">
      <div className="flex gap-1">{[1, 2, 3, 4].map((i) => (<div key={i} className="flex-1 h-1 rounded-full transition-all duration-300" style={{ background: i <= strength ? colors[strength] : "rgba(255,255,255,0.1)" }} />))}</div>
      <p className="text-xs" style={{ color: colors[strength] || "transparent" }}>{labels[strength]}</p>
    </div>
  );
}

export default function RegisterPage() {
  const router = useRouter();
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({ name: "", email: "", password: "", confirm: "" });

  const handleChange = (field: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) => { setError(""); setForm({ ...form, [field]: e.target.value }); };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.password.length < 8) { setError("Mật khẩu cần ít nhất 8 ký tự"); return; }
    if (form.password !== form.confirm) { setError("Mật khẩu xác nhận không khớp"); return; }
    setLoading(true); setError("");
    try {
      const res = await fetch(`${API_BASE_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: form.name, email: form.email, password: form.password }),
      });
      const data = await res.json();
      if (!data.success) { setError(data.error?.message || "Đăng ký thất bại"); setLoading(false); return; }
      localStorage.setItem("access_token", data.data.accessToken);
      localStorage.setItem("refresh_token", data.data.refreshToken);
      localStorage.setItem("user", JSON.stringify(data.data.user));
      setSuccess(true);
    } catch { setError("Không thể kết nối server"); }
    setLoading(false);
  };

  const inputStyle: React.CSSProperties = { background: "rgba(255,255,255,0.06)", borderColor: "rgba(255,255,255,0.12)", color: "white" };

  if (success) return (
    <div className="text-center py-8">
      <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-5" style={{ background: "hsl(142 71% 45%/0.15)", border: "2px solid hsl(142 71% 45%/0.4)" }}>
        <CheckCircle className="w-8 h-8" style={{ color: "hsl(142 71% 45%)" }} />
      </div>
      <h2 className="text-xl font-bold text-white mb-2">Đăng ký thành công! 🎉</h2>
      <p className="text-sm mb-6" style={{ color: "rgba(255,255,255,0.5)" }}>Chào mừng {form.name} đến với TOEIC Master</p>
      <button onClick={() => router.push("/dashboard")} className="btn w-full py-3 text-sm font-semibold text-white" style={{ background: "linear-gradient(135deg, hsl(221 83% 53%), hsl(262 83% 58%))" }}>
        Vào trang học →
      </button>
    </div>
  );

  return (
    <div>
      <div className="mb-7">
        <h1 className="text-2xl font-bold text-white mb-1">Tạo tài khoản</h1>
        <p className="text-sm" style={{ color: "rgba(255,255,255,0.45)" }}>Miễn phí — không cần thẻ tín dụng</p>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1.5"><label className="block text-sm font-medium text-white/70">Họ và tên</label><input type="text" required placeholder="Nguyễn Văn A" value={form.name} onChange={handleChange("name")} className="input" style={inputStyle} /></div>
        <div className="space-y-1.5"><label className="block text-sm font-medium text-white/70">Email</label><input type="email" required placeholder="email@example.com" value={form.email} onChange={handleChange("email")} className="input" style={inputStyle} /></div>
        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-white/70">Mật khẩu</label>
          <div className="relative"><input type={showPw ? "text" : "password"} required placeholder="Ít nhất 8 ký tự" value={form.password} onChange={handleChange("password")} className="input pr-10" style={inputStyle} /><button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2" style={{ color: "rgba(255,255,255,0.4)" }}>{showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}</button></div>
          <PasswordStrength password={form.password} />
        </div>
        <div className="space-y-1.5"><label className="block text-sm font-medium text-white/70">Xác nhận mật khẩu</label><input type="password" required placeholder="Nhập lại mật khẩu" value={form.confirm} onChange={handleChange("confirm")} className="input" style={{ ...inputStyle, borderColor: form.confirm && form.confirm !== form.password ? "hsl(0 84% 60%/0.6)" : "rgba(255,255,255,0.12)" }} /></div>
        {error && <div className="rounded-lg px-3.5 py-2.5 text-sm" style={{ background: "hsl(0 84% 60%/0.1)", border: "1px solid hsl(0 84% 60%/0.25)", color: "hsl(0 84% 72%)" }}>{error}</div>}
        <button type="submit" disabled={loading} className="btn w-full py-3 text-sm font-semibold text-white mt-1" style={{ background: "linear-gradient(135deg, hsl(221 83% 53%), hsl(262 83% 58%))", opacity: loading ? 0.75 : 1 }}>
          {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Đang tạo tài khoản...</> : "Tạo tài khoản miễn phí"}
        </button>
      </form>
      <p className="text-center mt-5 text-sm" style={{ color: "rgba(255,255,255,0.4)" }}>Đã có tài khoản? <Link href="/login" className="font-semibold" style={{ color: "hsl(213 93% 67%)" }}>Đăng nhập</Link></p>
    </div>
  );
}
