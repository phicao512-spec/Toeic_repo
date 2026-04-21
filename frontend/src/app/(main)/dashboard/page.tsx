"use client";

import { useState, useEffect } from "react";
import {
  BookOpen, ClipboardList, TrendingUp,
  Flame, Target, Clock, Star, ChevronRight, Trophy,
  Zap, CheckCircle2, Award, LayoutDashboard, History, Loader2
} from "lucide-react";
import Link from "next/link";
import { cn, percentage } from "@/lib/utils";
import { API_BASE_URL } from "@/lib/constants";
import { apiClient } from "@/lib/api-client";

interface DashboardStats {
  user: { name: string; targetScore: number };
  wordsLearned: number;
  wordsTotal: number;
  currentStreak: number;
  bestScore: number;
  latestScore: number;
  totalStudyMinutes: number;
  recentTests: any[];
  streakCalendar: { date: string; minutesStudied: number; wordsLearned: number; questionsAnswered: number }[];
}

interface PartAccuracy {
  part: string;
  correct: number;
  total: number;
  accuracy: number;
}

const PART_COLORS: Record<string, string> = {
  "PART1": "#10b981",
  "PART2": "#3b82f6",
  "PART3": "#8b5cf6",
  "PART4": "#06b6d4",
  "PART5": "#f59e0b",
  "PART6": "#ef4444",
  "PART7": "#f97316",
};

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [accuracy, setAccuracy] = useState<PartAccuracy[]>([]);
  const [localVocabCount, setLocalVocabCount] = useState(0);
  const [localAccuracy, setLocalAccuracy] = useState(0);

  useEffect(() => {
    // 1. Fetch from API
    const fetchData = async () => {
      try {
        const [statsData, accuracyData, topicsRes] = await Promise.all([
          apiClient.get<DashboardStats>("/progress/dashboard"),
          apiClient.get<PartAccuracy[]>("/progress/accuracy"),
          apiClient.get<any[]>("/vocab/topics")
        ]);
        
        setStats(statsData);
        setAccuracy(accuracyData);

        // 2. Aggregate from LocalStorage with Filtering
        const progStr = localStorage.getItem("vocab_progress_v1");
        if (progStr && topicsRes) {
          const prog = JSON.parse(progStr);
          
          // Get all valid word IDs from current topics
          const validWordIds = new Set<string>();
          topicsRes.forEach((t: any) => {
            if (t.wordIds) t.wordIds.forEach((id: string) => validWordIds.add(id));
          });

          let mastered = 0;
          let totalCorrect = 0;
          let totalAttempts = 0;
          
          Object.entries(prog).forEach(([wId, v]: [string, any]) => {
            // Only count if word belongs to an active topic
            if (validWordIds.has(wId)) {
              if (v.mastered) mastered++;
              totalCorrect += v.correct || 0;
              totalAttempts += (v.correct || 0) + (v.wrong || 0);
            }
          });

          setLocalVocabCount(mastered);
          if (totalAttempts > 0) {
            setLocalAccuracy(Math.round((totalCorrect / totalAttempts) * 100));
          }
        }
      } catch (error) {
        console.error("Failed to fetch dashboard stats", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <Loader2 className="w-12 h-12 text-[#00c9a7] animate-spin" />
        <p className="text-slate-500 font-bold animate-pulse">Đang tải báo cáo học tập...</p>
      </div>
    );
  }

  const effectiveStats = stats ? {
    ...stats,
    wordsLearned: Math.max(stats.wordsLearned, localVocabCount)
  } : {
    user: { name: "Học viên", targetScore: 800 },
    wordsLearned: localVocabCount,
    wordsTotal: 1000,
    currentStreak: 0,
    bestScore: 0,
    latestScore: 0,
    totalStudyMinutes: 0,
    recentTests: [],
    streakCalendar: []
  };

  const vocabPct = percentage(effectiveStats.wordsLearned, effectiveStats.wordsTotal);
  const scorePct = percentage(effectiveStats.latestScore, effectiveStats.user.targetScore);
  const circ = 2 * Math.PI * 46;

  // Derive display accuracy: Use API data if available, fallback to local vocab accuracy
  const displayAccuracy = accuracy.length > 0 
    ? Math.round(accuracy.reduce((s, a) => s + a.accuracy, 0) / accuracy.length) 
    : localAccuracy;

  // Process calendar data
  const calendarDays = [];
  for (let i = 27; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().slice(0, 10);
    const dayData = effectiveStats.streakCalendar.find(s => s.date === dateStr);
    calendarDays.push({
      date: d,
      studied: !!dayData,
      minutes: dayData?.minutesStudied || 0
    });
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700;800&family=Lora:ital,wght@0,700;1,600&display=swap');

        .ma-light { font-family:'Sora',sans-serif; background:#f8fafc; color:#334155; min-height:100vh; }

        @keyframes ma-fade-up {
          from { opacity:0; transform:translateY(12px); }
          to   { opacity:1; transform:translateY(0); }
        }
        .ma-fade-up { animation:ma-fade-up .4s ease-out both; }
        .d1{animation-delay:.05s}.d2{animation-delay:.1s}.d3{animation-delay:.15s}.d4{animation-delay:.2s}

        /* Container Centered */
        .ma-container {
           max-width: 1040px;
           margin: 0 auto;
           padding: 40px 24px 80px;
        }

        /* Card Light Style */
        .ma-card-light {
           background: #ffffff;
           border-radius: 24px;
           box-shadow: 0 10px 30px -10px rgba(0,0,0,0.04), 0 2px 5px rgba(0,0,0,0.02);
           border: 1px solid #f1f5f9;
           overflow: hidden;
           transition: transform 0.2s ease, box-shadow 0.2s ease;
        }
        .ma-card-light:hover {
           transform: translateY(-2px);
           box-shadow: 0 15px 40px -10px rgba(0,0,0,0.08), 0 4px 10px rgba(0,0,0,0.02);
        }

        /* Banner Light */
        .ma-banner-light {
           background: linear-gradient(135deg, #00c9a7 0%, #00d2ff 150%);
           border-radius: 32px;
           padding: 48px;
           position: relative;
           overflow: hidden;
           color: #ffffff;
           margin-bottom: 32px;
           box-shadow: 0 20px 50px -15px rgba(0, 201, 167, 0.25);
        }
        .ma-banner-light::before {
           content: ''; position: absolute; inset: 0;
           background-image: radial-gradient(circle at top right, rgba(255,255,255,0.2), transparent 60%);
           pointer-events: none;
        }
        .ma-banner-text { position: relative; z-index: 1; }
        .ma-greeting-light {
           font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em;
           background: rgba(255,255,255,0.15); padding: 6px 14px; border-radius: 99px;
           display: inline-flex; align-items: center; gap: 8px; margin-bottom: 16px; backdrop-filter: blur(4px);
        }
        .ma-name-light {
           font-family: 'Lora', serif; font-size: 42px; font-weight: 700; line-height: 1.1; margin-bottom: 12px;
        }
        .ma-tagline-light {
           font-size: 15px; opacity: 0.9; max-width: 440px; line-height: 1.6; margin-bottom: 32px;
        }

        .ma-btn-jade-light {
           background: #ffffff; color: #00c9a7;
           padding: 14px 28px; border-radius: 16px; font-size: 14px; font-weight: 800;
           display: inline-flex; align-items: center; gap: 8px; transition: all 0.2s;
           box-shadow: 0 4px 12px rgba(0,0,0,0.05);
        }
        .ma-btn-jade-light:hover {
           background: #f8fafc; transform: translateY(-1px); box-shadow: 0 6px 20px rgba(0,0,0,0.1);
        }

        /* Stats Grid */
        .ma-stats-grid {
           display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px; margin-bottom: 32px;
        }
        @media(min-width: 1024px){ .ma-stats-grid { grid-template-columns: repeat(4, 1fr); } }

        .ma-stat-card { padding: 24px; display: flex; flex-direction: column; gap: 12px; }
        .ma-stat-icon-wrap {
           width: 44px; height: 44px; border-radius: 14px;
           display: flex; align-items: center; justify-content: center;
        }
        .ma-stat-label { font-size: 12px; font-weight: 600; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.05em; }
        .ma-stat-val { font-size: 32px; font-weight: 800; color: #0f172a; line-height: 1; margin-top: 4px; }
        .ma-stat-unit { font-size: 14px; font-weight: 500; color: #94a3b8; margin-left: 4px; }

        /* Main Content Grid */
        .ma-dashboard-grid {
           display: grid; gap: 32px;
        }
        @media(min-width: 1024px){
           .ma-dashboard-grid { grid-template-columns: 1.8fr 1.2fr; }
        }

        .ma-sec-title {
           font-family: 'Lora', serif; font-size: 20px; font-weight: 700; color: #0f172a;
           display: flex; align-items: center; gap: 10px; margin-bottom: 20px;
        }

        /* Part Bar */
        .ma-part-row { margin-bottom: 16px; }
        .ma-part-info { display: flex; justify-content: space-between; margin-bottom: 8px; font-size: 13px; font-weight: 600; }
        .ma-part-track { height: 8px; background: #f1f5f9; border-radius: 99px; overflow: hidden; }
        .ma-part-fill { height: 100%; border-radius: 99px; transition: width 1s ease-out; }

        /* Calendar */
        .ma-cal-grid { display: grid; grid-template-columns: repeat(7, 1fr); gap: 6px; }
        .ma-cal-day { aspect-ratio: 1; border-radius: 6px; display: flex; align-items: center; justify-content: center; font-size: 10px; font-weight: 700; color: #94a3b8; background: #f8fafc; transition: all 0.2s; cursor: default; }
        .ma-cal-day.active { background: #00c9a7; color: #ffffff; box-shadow: 0 4px 10px rgba(0, 201, 167, 0.2); }
        .ma-cal-day:hover { transform: scale(1.1); z-index: 1; }

        /* Practice Link Cards */
        .ma-prac-link {
           display: flex; align-items: center; gap: 16px; padding: 18px;
           background: #fdfdfd; border: 1px solid #f1f5f9; border-radius: 18px;
           text-decoration: none; transition: all 0.2s;
        }
        .ma-prac-link:hover { border-color: #00c9a7; background: #f0fdfa; transform: translateX(4px); }
        .ma-prac-icon-box { width: 44px; height: 44px; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 20px; }

        /* Score Ring */
        .ma-ring-light {
           width: 180px; height: 180px; margin: 0 auto 30px; position: relative;
        }
        .ma-ring-inner {
           position: absolute; inset: 0; display: flex; flex-direction: column; align-items: center; justify-content: center;
        }
        .ma-ring-score { font-family: 'Lora', serif; font-size: 40px; font-weight: 800; color: #0f172a; line-height: 1; }
        .ma-ring-target { font-size: 12px; color: #94a3b8; margin-top: 4px; font-weight: 600; }

        /* Activity List */
        .ma-act-item {
           display: flex; gap: 16px; padding: 16px 0; border-bottom: 1px solid #f1f5f9;
        }
        .ma-act-item:last-child { border-bottom: none; }
        .ma-act-icon-box {
           width: 42px; height: 42px; border-radius: 12px; background: #f8fafc; border: 1px solid #f1f5f9;
           display: flex; align-items: center; justify-content: center; font-size: 18px; flex-shrink: 0;
        }
      `}</style>

      <div className="ma-light">
        <div className="ma-container">
          
          {/* Header Area */}
          <div className="flex items-center justify-between mb-8 ma-fade-up d1">
             <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#00c9a7] flex items-center justify-center text-white">
                   <LayoutDashboard size={20} />
                </div>
                <div>
                   <h2 className="text-xl font-extrabold text-slate-800 tracking-tight">Dashboard</h2>
                   <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Hệ thống luyện tập TOEIC thông minh</p>
                </div>
             </div>
             <div className="flex items-center gap-2 px-4 py-2 rounded-full border border-slate-100 bg-white shadow-sm">
                <Award size={16} className="text-amber-400" />
                <span className="text-xs font-bold text-slate-600">Hạng: Kim cương</span>
             </div>
          </div>

          {/* ══ HERO BANNER ══════════════════════════════════════════════════ */}
          <div className="ma-banner-light ma-fade-up d1">
            <div className="ma-banner-text">
               <div className="ma-greeting-light">
                  <Flame size={12} className="mr-2 fill-white" /> {effectiveStats.currentStreak} Ngày Streak
               </div>
               <h1 className="ma-name-light">Chào buổi sáng, {effectiveStats.user.name.split(' ')[0]}!</h1>
               <p className="ma-tagline-light">
                  Bạn đang làm rất tốt! Bạn đã học được <strong>{effectiveStats.wordsLearned}</strong> trên tổng số <strong>{effectiveStats.wordsTotal}</strong> từ vựng ({vocabPct}%) và chỉ còn <strong>{effectiveStats.user.targetScore - effectiveStats.latestScore} điểm</strong> nữa là đạt mục tiêu {effectiveStats.user.targetScore}.
               </p>
               <div className="flex gap-4">
                  <Link href="/practice-test" className="ma-btn-jade-light group">
                     Làm bài thi thử ngay <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                  </Link>
                  <button className="px-6 py-3 rounded-2xl bg-white/20 hover:bg-white/30 backdrop-blur-md text-white font-bold text-sm transition-all focus:outline-none">
                     Thêm mục tiêu mới
                  </button>
               </div>
            </div>
            
            {/* Decorative background score */}
            <div className="absolute right-[-20px] top-[50%] translate-y-[-50%] opacity-10 font-bold text-[240px] leading-none select-none italic family-lora rotate-[-10deg]">
               {effectiveStats.latestScore}
            </div>
          </div>

          {/* ══ STAT CARDS ══════════════════════════════════════════════════ */}
          <div className="ma-stats-grid ma-fade-up d2">
             {[
                { label: "Ngày Streak", val: effectiveStats.currentStreak, unit: "ngày", Icon: Flame, color: "#f97316", bg: "#fff7ed" },
                { label: "Từ vựng", val: `${effectiveStats.wordsLearned} / ${effectiveStats.wordsTotal}`, unit: "từ", Icon: BookOpen, color: "#3b82f6", bg: "#eff6ff" },
                { label: "Độ chính xác", val: displayAccuracy, unit: "%", Icon: Target, color: "#10b981", bg: "#f0fdf4" },
                { label: "Thời gian học", val: Math.round(effectiveStats.totalStudyMinutes / 60 * 10) / 10, unit: "giờ", Icon: Clock, color: "#8b5cf6", bg: "#f5f3ff" },
             ].map((s, i) => (
                <div key={i} className="ma-card-light ma-stat-card">
                   <div className="ma-stat-icon-wrap" style={{ background: s.bg }}>
                      <s.Icon size={20} style={{ color: s.color }} />
                   </div>
                   <div>
                      <div className="ma-stat-label">{s.label}</div>
                      <div className="ma-stat-val">
                         {s.val}<span className="ma-stat-unit">{s.unit}</span>
                      </div>
                   </div>
                </div>
             ))}
          </div>

          <div className="ma-dashboard-grid ma-fade-up d3">
             
             {/* ── LEFT COLUMN ────────────────────────────────────────── */}
             <div className="flex flex-col gap-8">
                
                {/* Accuracy by Part */}
                <div className="ma-card-light p-8">
                   <div className="ma-sec-title">
                      <TrendingUp size={22} className="text-emerald-500" /> Độ chính xác theo Part
                   </div>
                    <div className="grid gap-6">
                      {accuracy.length > 0 ? accuracy.map((p, i) => (
                         <div key={i} className="ma-part-row">
                            <div className="ma-part-info">
                               <span className="text-slate-700 font-bold">{p.part}</span>
                               <span style={{ color: PART_COLORS[p.part] || "#64748b" }} className="font-extrabold">{p.accuracy}%</span>
                            </div>
                            <div className="ma-part-track">
                               <div className="ma-part-fill" style={{ width: `${p.accuracy}%`, background: PART_COLORS[p.part] || "#64748b" }} />
                            </div>
                         </div>
                      )) : (
                        <div className="text-center py-10 text-slate-400 font-bold text-sm">Chưa có dữ liệu chính xác</div>
                      )}
                   </div>
                </div>

                {/* Quick Practice Links */}
                <div className="ma-card-light p-8">
                   <div className="ma-sec-title">
                      <Zap size={22} className="text-amber-500" /> Luyện tập tập trung
                   </div>
                   <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {[
                         { label: "Listening Part 1", sub: "Mô tả bức tranh", icon: "🖼️", href: "/listening/part1" },
                         { label: "Listening Part 3", sub: "Đoạn hội thoại", icon: "🗣️", href: "/listening/part3" },
                         { label: "Reading Part 5", sub: "Điền vào câu", icon: "✏️", href: "/reading/part5" },
                         { label: "Từ vựng thông dụng", sub: "600 từ TOEIC", icon: "📚", href: "/vocabulary" },
                      ].map((link, i) => (
                         <Link key={i} href={link.href} className="ma-prac-link">
                            <div className="ma-prac-icon-box bg-slate-50">{link.icon}</div>
                            <div>
                               <div className="text-sm font-bold text-slate-800">{link.label}</div>
                               <div className="text-[11px] text-slate-400 font-medium">{link.sub}</div>
                            </div>
                         </Link>
                      ))}
                   </div>
                </div>

                {/* Streak Calendar */}
                <div className="ma-card-light p-8">
                   <div className="ma-sec-title">
                      <History size={22} className="text-orange-500" /> Chuỗi học tập 28 ngày
                   </div>
                    <div className="ma-cal-grid">
                      {calendarDays.map((d, i) => (
                         <div 
                           key={i} 
                           className={cn("ma-cal-day", d.studied && "active")}
                           title={`${d.date.toLocaleDateString()}: ${d.minutes} phút`}
                         >
                            {d.date.getDate()}
                         </div>
                      ))}
                   </div>
                   <div className="flex justify-center gap-6 mt-8">
                      <div className="flex items-center gap-2 text-[11px] font-bold text-slate-400">
                         <div className="w-3 h-3 rounded bg-slate-100" /> Chưa học
                      </div>
                      <div className="flex items-center gap-2 text-[11px] font-bold text-emerald-500">
                         <div className="w-3 h-3 rounded bg-[#00c9a7]" /> Đã hoàn thành
                      </div>
                   </div>
                </div>

             </div>

             {/* ── RIGHT COLUMN ────────────────────────────────────────── */}
             <div className="flex flex-col gap-8">
                
                {/* Score Target Ring */}
                <div className="ma-card-light p-8 text-center">
                   <div className="ma-sec-title justify-center">
                      <Target size={22} className="text-blue-500" /> Mục tiêu điểm số
                   </div>
                   
                   <div className="ma-ring-light">
                      <svg width="180" height="180" viewBox="0 0 112 112" style={{ transform: "rotate(-90deg)" }}>
                         <circle cx="56" cy="56" r="46" fill="none" stroke="#f1f5f9" strokeWidth="8" />
                         <circle 
                           cx="56" cy="56" r="46" fill="none" 
                           stroke="#00c9a7" strokeWidth="10" 
                           strokeLinecap="round"
                           strokeDasharray={circ}
                           strokeDashoffset={circ * (1 - scorePct / 100)}
                           style={{ transition: "stroke-dashoffset 1.5s ease-out" }}
                         />
                      </svg>
                      <div className="ma-ring-inner">
                         <div className="ma-ring-score">{effectiveStats.latestScore}</div>
                         <div className="ma-ring-target">trên mục tiêu {effectiveStats.user.targetScore}</div>
                      </div>
                   </div>
 
                    <div className="space-y-4">
                       {[
                          { lbl: "Điểm hiện tại", val: effectiveStats.latestScore, color: "#00c9a7" },
                          { lbl: "Cần cải thiện", val: Math.max(0, effectiveStats.user.targetScore - effectiveStats.latestScore), color: "#f97316" },
                          { lbl: "Điểm cao nhất", val: effectiveStats.bestScore, color: "#a855f7" },
                       ].map((item, i) => (
                          <div key={i} className="flex justify-between items-center px-4 py-3 rounded-2xl bg-slate-50 border border-slate-50">
                             <span className="text-xs font-bold text-slate-500">{item.lbl}</span>
                             <span className="text-sm font-black" style={{ color: item.color }}>{item.val}</span>
                          </div>
                       ))}
                    </div>
                </div>

                {/* Recent Activities */}
                <div className="ma-card-light p-8">
                   <div className="ma-sec-title">
                      <Star size={22} className="text-amber-400" /> Hoạt động mới nhất
                   </div>
                   <div className="activity-list">
                      {effectiveStats.recentTests.length > 0 ? effectiveStats.recentTests.map((act: any, i: number) => (
                         <div key={i} className="ma-act-item">
                            <div className="ma-act-icon-box">📝</div>
                            <div className="min-w-0 flex-1">
                               <div className="text-sm font-bold text-slate-700 truncate">Thi thử - Kết quả {act.totalScore}</div>
                               <div className="flex items-center gap-2 mt-1">
                                  <span className="text-[10px] font-bold text-slate-400">{new Date(act.completedAt).toLocaleDateString()}</span>
                                  <span className="px-2 py-0.5 rounded-lg bg-blue-50 text-blue-600 text-[10px] font-bold">
                                     {act.totalScore} điểm
                                  </span>
                                  <span className="px-2 py-0.5 rounded-lg bg-emerald-50 text-emerald-600 text-[10px] font-bold">
                                     L: {act.listeningScore} | R: {act.readingScore}
                                  </span>
                               </div>
                            </div>
                         </div>
                      )) : (
                        <div className="text-center py-8 text-slate-400 text-xs font-bold">Chưa có hoạt động gần đây</div>
                      )}
                   </div>
                   <button className="w-full mt-6 py-3 rounded-xl border border-slate-100 text-xs font-bold text-slate-400 hover:bg-slate-50 hover:text-slate-600 transition-all focus:outline-none">
                      Xem tất cả hoạt động
                   </button>
                </div>

             </div>

          </div>

          <p className="text-center text-[10px] text-slate-300 mt-16 uppercase tracking-[0.3em] font-black">TOEIC Master © 2026 • Premium Analytics</p>
        </div>
      </div>
    </>
  );
}