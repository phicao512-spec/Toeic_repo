"use client";

import { Trophy, Medal, Crown } from "lucide-react";

const MOCK_LEADERBOARD = [
  { rank: 1, name: "Trần Minh Anh", score: 945, streak: 32, avatar: "🏆" },
  { rank: 2, name: "Nguyễn Hữu Phong", score: 920, streak: 28, avatar: "🥈" },
  { rank: 3, name: "Lê Thị Hạnh", score: 890, streak: 21, avatar: "🥉" },
  { rank: 4, name: "Phạm Văn Đức", score: 855, streak: 19, avatar: "👤" },
  { rank: 5, name: "Hoàng Thị Mai", score: 830, streak: 15, avatar: "👤" },
  { rank: 6, name: "Đỗ Quang Huy", score: 810, streak: 14, avatar: "👤" },
  { rank: 7, name: "Vũ Thị Ngọc", score: 795, streak: 12, avatar: "👤" },
  { rank: 8, name: "Bùi Đức Tuấn", score: 780, streak: 10, avatar: "👤" },
  { rank: 9, name: "Nguyễn Văn Demo", score: 750, streak: 7, avatar: "⭐" },
  { rank: 10, name: "Trần Thu Hà", score: 720, streak: 5, avatar: "👤" },
];

export default function LeaderboardPage() {
  return (
    <div className="p-6 max-w-3xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-2">🏆 Bảng Xếp Hạng</h1>
        <p style={{ color: "hsl(var(--muted-foreground))" }}>Top 10 học viên có điểm TOEIC cao nhất tháng này</p>
      </div>

      {/* Top 3 podium */}
      <div className="flex items-end justify-center gap-4 mb-8">
        {[MOCK_LEADERBOARD[1], MOCK_LEADERBOARD[0], MOCK_LEADERBOARD[2]].map((u, i) => {
          const heights = ["h-24", "h-32", "h-20"];
          const icons = [<Medal key="m" className="w-6 h-6" style={{ color: "#c0c0c0" }} />, <Crown key="c" className="w-7 h-7" style={{ color: "#ffd700" }} />, <Medal key="b" className="w-5 h-5" style={{ color: "#cd7f32" }} />];
          return (
            <div key={u.rank} className="flex flex-col items-center">
              <div className="text-3xl mb-2">{u.avatar}</div>
              <p className="text-sm font-bold mb-1 text-center max-w-[100px] truncate">{u.name}</p>
              <p className="text-xs mb-2" style={{ color: "hsl(var(--muted-foreground))" }}>{u.score} điểm</p>
              <div className={`w-20 ${heights[i]} rounded-t-xl flex items-start justify-center pt-3`}
                style={{ background: i === 1 ? "linear-gradient(180deg, hsl(45 93% 47%), hsl(45 93% 37%))" : i === 0 ? "linear-gradient(180deg, hsl(0 0% 75%), hsl(0 0% 60%))" : "linear-gradient(180deg, hsl(25 60% 50%), hsl(25 60% 40%))" }}>
                {icons[i]}
              </div>
            </div>
          );
        })}
      </div>

      {/* Full list */}
      <div className="space-y-2">
        {MOCK_LEADERBOARD.map((u) => {
          const isMe = u.name === "Nguyễn Văn Demo";
          return (
            <div key={u.rank} className="card p-4 flex items-center gap-4 transition-all"
              style={{ background: isMe ? "hsl(var(--primary)/0.08)" : undefined, border: isMe ? "1.5px solid hsl(var(--primary)/0.3)" : undefined }}>
              <div className="w-8 text-center font-bold text-sm" style={{ color: u.rank <= 3 ? "hsl(45 93% 47%)" : "hsl(var(--muted-foreground))" }}>
                #{u.rank}
              </div>
              <div className="text-2xl">{u.avatar}</div>
              <div className="flex-1 min-w-0">
                <div className="font-medium text-sm truncate">{u.name} {isMe && <span className="text-xs" style={{ color: "hsl(var(--primary))" }}>(Bạn)</span>}</div>
                <div className="text-xs" style={{ color: "hsl(var(--muted-foreground))" }}>🔥 {u.streak} ngày streak</div>
              </div>
              <div className="text-right">
                <div className="font-bold" style={{ color: "hsl(var(--primary))" }}>{u.score}</div>
                <div className="text-xs" style={{ color: "hsl(var(--muted-foreground))" }}>điểm</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
