import type { Metadata } from "next";
import {
  BookOpen, Headphones, ClipboardList, TrendingUp,
  Flame, Target, Clock, Star, ChevronRight, Trophy,
  Zap, CheckCircle2,
} from "lucide-react";
import Link from "next/link";
import { cn, percentage, formatTime } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Tổng quan",
  description: "Xem tiến trình học TOEIC của bạn",
};

// Mock data - will be replaced with real API calls
const mockStats = {
  currentStreak: 7,
  longestStreak: 15,
  totalStudyTime: 12540, // seconds
  wordsLearned: 347,
  wordsTotal: 1000,
  latestTestScore: 680,
  bestTestScore: 750,
  targetScore: 800,
  questionsToday: 45,
  accuracyToday: 82,
};

const mockPartAccuracy = [
  { part: "Part 1", score: 92, color: "#3b82f6" },
  { part: "Part 2", score: 78, color: "#8b5cf6" },
  { part: "Part 3", score: 71, color: "#06b6d4" },
  { part: "Part 4", score: 68, color: "#10b981" },
  { part: "Part 5", score: 85, color: "#f59e0b" },
  { part: "Part 6", score: 63, color: "#ef4444" },
  { part: "Part 7", score: 59, color: "#ec4899" },
];

const mockRecentActivities = [
  { type: "vocab", label: "Học 20 từ vựng - Văn phòng", time: "2 giờ trước", icon: "📚", correct: 18, total: 20 },
  { type: "listening", label: "Luyện Part 3 - Set 05", time: "Hôm qua", icon: "🎧", correct: 8, total: 10 },
  { type: "test", label: "Thi thử - Đề #2", time: "2 ngày trước", icon: "📝", score: 680 },
  { type: "reading", label: "Luyện Part 7 - Đọc hiểu", time: "3 ngày trước", icon: "📖", correct: 12, total: 15 },
];

// Generate streak calendar (last 28 days)
function generateStreakData() {
  const days = [];
  for (let i = 27; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    days.push({
      date: d,
      studied: Math.random() > 0.3,
      minutes: Math.floor(Math.random() * 60) + 10,
    });
  }
  return days;
}
const streakData = generateStreakData();

export default function DashboardPage() {
  const vocabProgress = percentage(mockStats.wordsLearned, mockStats.wordsTotal);
  const scoreProgress = percentage(mockStats.latestTestScore, mockStats.targetScore);

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="relative rounded-2xl overflow-hidden p-6 lg:p-8"
        style={{ background: "linear-gradient(135deg, hsl(221 83% 53%), hsl(262 83% 58%))" }}>
        <div className="relative z-10">
          <div className="text-white/80 text-sm font-medium mb-1">Chào buổi sáng! 👋</div>
          <h1 className="text-2xl lg:text-3xl font-bold text-white mb-2">Nguyễn Văn A</h1>
          <p className="text-white/80 text-sm mb-4">
            Bạn đang học liên tục <strong className="text-white">{mockStats.currentStreak} ngày</strong> 🔥 — tiếp tục phát huy nhé!
          </p>
          <div className="flex flex-wrap gap-3">
            <Link href="/practice-test" className="btn btn-gradient text-sm"
              style={{ background: "rgba(255,255,255,0.2)", backdropFilter: "blur(8px)", color: "white", border: "1px solid rgba(255,255,255,0.3)" }}>
              <ClipboardList className="w-4 h-4" /> Thi thử ngay
            </Link>
            <Link href="/vocabulary/review" className="btn text-sm"
              style={{ background: "rgba(255,255,255,0.2)", backdropFilter: "blur(8px)", color: "white", border: "1px solid rgba(255,255,255,0.3)" }}>
              <BookOpen className="w-4 h-4" /> Ôn từ vựng
            </Link>
          </div>
        </div>
        {/* Decorative circles */}
        <div className="absolute -right-8 -top-8 w-48 h-48 rounded-full bg-white/10" />
        <div className="absolute -right-4 top-8 w-32 h-32 rounded-full bg-white/10" />
        <div className="absolute right-24 -bottom-6 w-24 h-24 rounded-full bg-white/10" />
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Streak hiện tại", value: `${mockStats.currentStreak} ngày`, icon: Flame, color: "text-orange-500", bg: "bg-orange-50 dark:bg-orange-900/20" },
          { label: "Từ đã học", value: `${mockStats.wordsLearned}/${mockStats.wordsTotal}`, icon: BookOpen, color: "text-blue-500", bg: "bg-blue-50 dark:bg-blue-900/20" },
          { label: "Điểm cao nhất", value: mockStats.bestTestScore, icon: Trophy, color: "text-yellow-500", bg: "bg-yellow-50 dark:bg-yellow-900/20" },
          { label: "Thời gian học", value: `${Math.floor(mockStats.totalStudyTime / 3600)}h ${Math.floor((mockStats.totalStudyTime % 3600) / 60)}m`, icon: Clock, color: "text-purple-500", bg: "bg-purple-50 dark:bg-purple-900/20" },
        ].map((stat, i) => (
          <div key={i} className="card p-4 flex items-center gap-3 animate-fade-in" style={{ animationDelay: `${i * 0.1}s` }}>
            <div className={cn("w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0", stat.bg)}>
              <stat.icon className={cn("w-5 h-5", stat.color)} />
            </div>
            <div>
              <div className="font-bold text-lg leading-tight">{stat.value}</div>
              <div className="text-xs" style={{ color: "hsl(var(--muted-foreground))" }}>{stat.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Main grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Streak Calendar */}
          <div className="card p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold flex items-center gap-2">
                <Flame className="w-4 h-4 text-orange-500" /> Chuỗi ngày học
              </h2>
              <span className="text-sm" style={{ color: "hsl(var(--muted-foreground))" }}>28 ngày qua</span>
            </div>
            <div className="grid grid-cols-7 gap-1.5">
              {["T2", "T3", "T4", "T5", "T6", "T7", "CN"].map((d) => (
                <div key={d} className="text-center text-xs font-medium mb-1" style={{ color: "hsl(var(--muted-foreground))" }}>{d}</div>
              ))}
              {streakData.map((day, i) => (
                <div
                  key={i}
                  title={`${day.date.toLocaleDateString("vi-VN")}: ${day.studied ? `${day.minutes} phút` : "Chưa học"}`}
                  className={cn(
                    "aspect-square rounded-md flex items-center justify-center text-xs font-medium transition-all cursor-default",
                    day.studied
                      ? "text-white shadow-sm"
                      : "text-transparent"
                  )}
                  style={{
                    background: day.studied
                      ? `hsl(221 83% ${Math.max(35, 60 - (day.minutes / 2))}%)`
                      : "hsl(var(--muted))",
                  }}
                >
                  {day.date.getDate()}
                </div>
              ))}
            </div>
            <div className="flex items-center gap-3 mt-3 text-xs" style={{ color: "hsl(var(--muted-foreground))" }}>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded-sm" style={{ background: "hsl(var(--muted))" }} />
                Chưa học
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded-sm bg-blue-400" />
                Đã học
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded-sm bg-blue-700" />
                Học nhiều
              </div>
            </div>
          </div>

          {/* Part accuracy */}
          <div className="card p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-blue-500" /> Độ chính xác theo Part
              </h2>
              <Link href="/progress" className="text-sm font-medium" style={{ color: "hsl(var(--primary))" }}>
                Chi tiết
              </Link>
            </div>
            <div className="space-y-3">
              {mockPartAccuracy.map((item) => (
                <div key={item.part}>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-medium">{item.part}</span>
                    <span className="text-sm font-bold" style={{ color: item.color }}>{item.score}%</span>
                  </div>
                  <div className="progress-bar">
                    <div
                      className="progress-fill"
                      style={{ width: `${item.score}%`, background: item.color }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Practice */}
          <div className="card p-5">
            <h2 className="font-semibold mb-4 flex items-center gap-2">
              <Zap className="w-4 h-4 text-yellow-500" /> Luyện tập nhanh
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {[
                { href: "/vocabulary/review", label: "Ôn từ vựng", icon: "📚", sub: "15 từ cần ôn", color: "#3b82f6" },
                { href: "/listening/part3", label: "Nghe Part 3", icon: "🎧", sub: "Luyện hội thoại", color: "#8b5cf6" },
                { href: "/reading/part5", label: "Đọc Part 5", icon: "✏️", sub: "Điền vào câu", color: "#10b981" },
                { href: "/listening/part1", label: "Nghe Part 1", icon: "🖼️", sub: "Mô tả tranh", color: "#f59e0b" },
                { href: "/reading/part7", label: "Đọc Part 7", icon: "📖", sub: "Đọc hiểu", color: "#ef4444" },
                { href: "/practice-test", label: "Full Test", icon: "📝", sub: "200 câu / 2h", color: "#ec4899" },
              ].map((card) => (
                <Link
                  key={card.href}
                  href={card.href}
                  className="group flex flex-col gap-2 p-4 rounded-xl border transition-all hover:shadow-md hover:-translate-y-0.5"
                  style={{ borderColor: "hsl(var(--border))", background: "hsl(var(--card))" }}
                >
                  <div className="text-2xl">{card.icon}</div>
                  <div>
                    <div className="font-semibold text-sm">{card.label}</div>
                    <div className="text-xs" style={{ color: "hsl(var(--muted-foreground))" }}>{card.sub}</div>
                  </div>
                  <ChevronRight className="w-4 h-4 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: card.color }} />
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Right column */}
        <div className="space-y-6">
          {/* Score Progress */}
          <div className="card p-5">
            <h2 className="font-semibold mb-4 flex items-center gap-2">
              <Target className="w-4 h-4 text-green-500" /> Tiến độ điểm
            </h2>
            {/* Score ring */}
            <div className="flex justify-center mb-4">
              <div className="relative w-36 h-36">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
                  <circle cx="60" cy="60" r="50" fill="none" stroke="hsl(var(--muted))" strokeWidth="10" />
                  <circle
                    cx="60" cy="60" r="50" fill="none"
                    stroke="hsl(221 83% 53%)" strokeWidth="10"
                    strokeLinecap="round"
                    strokeDasharray={`${2 * Math.PI * 50}`}
                    strokeDashoffset={`${2 * Math.PI * 50 * (1 - scoreProgress / 100)}`}
                    className="transition-all duration-1000"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <div className="text-2xl font-bold">{mockStats.latestTestScore}</div>
                  <div className="text-xs" style={{ color: "hsl(var(--muted-foreground))" }}>/ {mockStats.targetScore}</div>
                </div>
              </div>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span style={{ color: "hsl(var(--muted-foreground))" }}>Điểm hiện tại</span>
                <span className="font-semibold text-blue-500">{mockStats.latestTestScore}</span>
              </div>
              <div className="flex justify-between">
                <span style={{ color: "hsl(var(--muted-foreground))" }}>Mục tiêu</span>
                <span className="font-semibold">{mockStats.targetScore}</span>
              </div>
              <div className="flex justify-between">
                <span style={{ color: "hsl(var(--muted-foreground))" }}>Còn thiếu</span>
                <span className="font-semibold text-orange-500">{mockStats.targetScore - mockStats.latestTestScore}</span>
              </div>
            </div>
          </div>

          {/* Vocabulary progress */}
          <div className="card p-5">
            <h2 className="font-semibold mb-4 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-blue-500" /> Từ vựng
            </h2>
            <div className="mb-3">
              <div className="flex justify-between text-sm mb-1.5">
                <span style={{ color: "hsl(var(--muted-foreground))" }}>Đã học</span>
                <span className="font-semibold">{mockStats.wordsLearned} / {mockStats.wordsTotal}</span>
              </div>
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: `${vocabProgress}%` }} />
              </div>
            </div>
            <div className="text-xs mb-4" style={{ color: "hsl(var(--muted-foreground))" }}>
              {vocabProgress}% hoàn thành • Còn {mockStats.wordsTotal - mockStats.wordsLearned} từ nữa
            </div>
            <Link href="/vocabulary/review" className="btn btn-primary w-full text-sm">
              Ôn tập ngay
            </Link>
          </div>

          {/* Recent Activities */}
          <div className="card p-5">
            <h2 className="font-semibold mb-4 flex items-center gap-2">
              <Star className="w-4 h-4 text-yellow-500" /> Hoạt động gần đây
            </h2>
            <div className="space-y-3">
              {mockRecentActivities.map((activity, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center text-base flex-shrink-0"
                    style={{ background: "hsl(var(--muted))" }}>
                    {activity.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium truncate">{activity.label}</div>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-xs" style={{ color: "hsl(var(--muted-foreground))" }}>{activity.time}</span>
                      {activity.score !== undefined && (
                        <span className="badge badge-primary text-xs">{activity.score} điểm</span>
                      )}
                      {activity.correct !== undefined && (
                        <span className={cn("flex items-center gap-0.5 text-xs font-medium",
                          percentage(activity.correct, activity.total!) >= 70 ? "text-green-500" : "text-red-500"
                        )}>
                          <CheckCircle2 className="w-3 h-3" />
                          {activity.correct}/{activity.total}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
