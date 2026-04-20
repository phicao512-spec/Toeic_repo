"use client";

import { useState, useEffect } from "react";
import { Loader2, TrendingUp, Target, Trophy, BookOpen } from "lucide-react";
import { apiFetch } from "@/lib/auth";

interface DashboardData {
  user: { name: string; targetScore: number };
  wordsLearned: number; wordsTotal: number; currentStreak: number;
  bestScore: number; latestScore: number; totalStudyMinutes: number;
  recentTests: { id: string; totalScore: number; completedAt: string }[];
  streakCalendar: { date: string; minutesStudied: number }[];
}

interface PartAccuracy { part: string; correct: number; total: number; accuracy: number; }

export default function ProgressPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [accuracy, setAccuracy] = useState<PartAccuracy[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      apiFetch<DashboardData>("/progress/dashboard"),
      apiFetch<PartAccuracy[]>("/progress/accuracy"),
    ]).then(([d, a]) => {
      if (d.success && d.data) setData(d.data);
      if (a.success && a.data) setAccuracy(a.data);
    }).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="flex items-center justify-center h-64"><Loader2 className="w-6 h-6 animate-spin" style={{ color: "hsl(var(--primary))" }} /></div>;

  if (!data) return (
    <div className="p-6 text-center py-16">
      <TrendingUp className="w-12 h-12 mx-auto mb-4 opacity-30" />
      <p style={{ color: "hsl(var(--muted-foreground))" }}>Đăng nhập để xem tiến trình</p>
    </div>
  );

  const vocabPct = data.wordsTotal > 0 ? Math.round((data.wordsLearned / data.wordsTotal) * 100) : 0;
  const scorePct = data.user.targetScore > 0 ? Math.min(100, Math.round((data.latestScore / data.user.targetScore) * 100)) : 0;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">📈 Tiến Trình Học Tập</h1>

      {/* Overview cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { icon: "🔥", label: "Streak", value: `${data.currentStreak} ngày`, color: "#f59e0b" },
          { icon: "📚", label: "Từ vựng", value: `${data.wordsLearned}/${data.wordsTotal}`, color: "#3b82f6" },
          { icon: "🏆", label: "Điểm cao nhất", value: `${data.bestScore}`, color: "#8b5cf6" },
          { icon: "⏱️", label: "Thời gian", value: `${Math.round(data.totalStudyMinutes / 60)}h ${data.totalStudyMinutes % 60}m`, color: "#10b981" },
        ].map((s) => (
          <div key={s.label} className="card p-4">
            <div className="text-2xl mb-2">{s.icon}</div>
            <div className="text-xl font-bold" style={{ color: s.color }}>{s.value}</div>
            <div className="text-xs" style={{ color: "hsl(var(--muted-foreground))" }}>{s.label}</div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Score target */}
        <div className="card p-6">
          <h3 className="font-bold mb-4 flex items-center gap-2"><Target className="w-4 h-4" /> Mục tiêu điểm</h3>
          <div className="flex items-center justify-center mb-4">
            <div className="relative w-32 h-32">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="42" strokeWidth="8" fill="none" stroke="hsl(var(--muted))" />
                <circle cx="50" cy="50" r="42" strokeWidth="8" fill="none" stroke="hsl(var(--primary))" strokeDasharray={`${scorePct * 2.64} 264`} strokeLinecap="round" />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl font-bold">{data.latestScore}</span>
                <span className="text-xs" style={{ color: "hsl(var(--muted-foreground))" }}>/ {data.user.targetScore}</span>
              </div>
            </div>
          </div>
          <div className="text-center text-sm" style={{ color: "hsl(var(--muted-foreground))" }}>
            Còn thiếu <strong style={{ color: "hsl(var(--primary))" }}>{Math.max(0, data.user.targetScore - data.latestScore)}</strong> điểm
          </div>
        </div>

        {/* Vocab progress */}
        <div className="card p-6">
          <h3 className="font-bold mb-4 flex items-center gap-2"><BookOpen className="w-4 h-4" /> Từ vựng</h3>
          <div className="mb-4">
            <div className="flex justify-between text-sm mb-2">
              <span>Đã học: {data.wordsLearned}</span>
              <span style={{ color: "hsl(var(--muted-foreground))" }}>{vocabPct}%</span>
            </div>
            <div className="h-3 rounded-full overflow-hidden" style={{ background: "hsl(var(--muted))" }}>
              <div className="h-full rounded-full transition-all" style={{ width: `${vocabPct}%`, background: "linear-gradient(90deg, hsl(221 83% 53%), hsl(262 83% 58%))" }} />
            </div>
          </div>
          <p className="text-sm" style={{ color: "hsl(var(--muted-foreground))" }}>Còn {data.wordsTotal - data.wordsLearned} từ nữa</p>
        </div>
      </div>

      {/* Part accuracy */}
      {accuracy.length > 0 && (
        <div className="card p-6 mt-6">
          <h3 className="font-bold mb-4 flex items-center gap-2"><TrendingUp className="w-4 h-4" /> Độ chính xác theo Part</h3>
          <div className="space-y-3">
            {accuracy.map((p) => (
              <div key={p.part} className="flex items-center gap-3">
                <span className="w-16 text-sm font-medium">{p.part}</span>
                <div className="flex-1 h-2.5 rounded-full overflow-hidden" style={{ background: "hsl(var(--muted))" }}>
                  <div className="h-full rounded-full" style={{ width: `${p.accuracy}%`, background: p.accuracy >= 80 ? "hsl(142 71% 45%)" : p.accuracy >= 60 ? "hsl(45 93% 47%)" : "hsl(0 84% 60%)" }} />
                </div>
                <span className="w-12 text-sm text-right font-medium">{p.accuracy}%</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent tests */}
      {data.recentTests.length > 0 && (
        <div className="card p-6 mt-6">
          <h3 className="font-bold mb-4 flex items-center gap-2"><Trophy className="w-4 h-4" /> Lần thi gần đây</h3>
          <div className="space-y-2">
            {data.recentTests.map((t) => (
              <div key={t.id} className="flex items-center justify-between p-3 rounded-lg" style={{ background: "hsl(var(--muted)/0.5)" }}>
                <span className="text-sm">{new Date(t.completedAt).toLocaleDateString("vi-VN")}</span>
                <span className="font-bold" style={{ color: "hsl(var(--primary))" }}>{t.totalScore} điểm</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
