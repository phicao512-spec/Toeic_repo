"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { BookOpen, ChevronRight, Loader2 } from "lucide-react";
import { API_BASE_URL } from "@/lib/constants";

interface Topic {
  id: string; name: string; nameVi: string; description: string;
  icon: string; wordCount: number; learnedCount: number;
}

export default function VocabularyPage() {
  const [topics, setTopics] = useState<Topic[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_BASE_URL}/vocab/topics`)
      .then((r) => r.json())
      .then((d) => { if (d.success) setTopics(d.data); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <Loader2 className="w-6 h-6 animate-spin" style={{ color: "hsl(var(--primary))" }} />
    </div>
  );

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-2">📚 Từ Vựng TOEIC</h1>
        <p style={{ color: "hsl(var(--muted-foreground))" }}>
          Học {topics.reduce((s, t) => s + t.wordCount, 0)} từ vựng theo chủ đề với hệ thống Spaced Repetition
        </p>
      </div>

      {/* Stats summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Chủ đề", value: topics.length, icon: "📂" },
          { label: "Tổng từ", value: topics.reduce((s, t) => s + t.wordCount, 0), icon: "📝" },
          { label: "Đã học", value: topics.reduce((s, t) => s + t.learnedCount, 0), icon: "✅" },
          { label: "Còn lại", value: topics.reduce((s, t) => s + (t.wordCount - t.learnedCount), 0), icon: "📖" },
        ].map((s) => (
          <div key={s.label} className="card p-4 text-center">
            <div className="text-2xl mb-1">{s.icon}</div>
            <div className="text-xl font-bold">{s.value}</div>
            <div className="text-xs" style={{ color: "hsl(var(--muted-foreground))" }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Topic grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {topics.map((topic) => {
          const pct = topic.wordCount > 0 ? Math.round((topic.learnedCount / topic.wordCount) * 100) : 0;
          return (
            <Link key={topic.id} href={`/vocabulary/${topic.id}`}
              className="card p-5 hover:shadow-lg transition-all hover:-translate-y-0.5 group">
              <div className="flex items-start justify-between mb-3">
                <div className="text-3xl">{topic.icon}</div>
                <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: "hsl(var(--primary))" }} />
              </div>
              <h3 className="font-bold mb-1">{topic.nameVi}</h3>
              <p className="text-xs mb-3" style={{ color: "hsl(var(--muted-foreground))" }}>{topic.name}</p>
              {/* Progress bar */}
              <div className="flex items-center gap-2">
                <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: "hsl(var(--muted))" }}>
                  <div className="h-full rounded-full transition-all" style={{
                    width: `${pct}%`,
                    background: pct === 100 ? "hsl(142 71% 45%)" : "hsl(var(--primary))",
                  }} />
                </div>
                <span className="text-xs font-medium" style={{ color: "hsl(var(--muted-foreground))" }}>
                  {topic.learnedCount}/{topic.wordCount}
                </span>
              </div>
            </Link>
          );
        })}
      </div>

      {topics.length === 0 && (
        <div className="text-center py-16">
          <BookOpen className="w-12 h-12 mx-auto mb-4 opacity-30" />
          <p style={{ color: "hsl(var(--muted-foreground))" }}>Chưa có chủ đề nào</p>
        </div>
      )}
    </div>
  );
}
