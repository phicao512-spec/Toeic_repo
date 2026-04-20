"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ClipboardList, Clock, Play, Loader2, Trophy } from "lucide-react";
import { API_BASE_URL } from "@/lib/constants";

interface Test { id: string; title: string; description: string; duration: number; isFullTest: boolean; totalQuestions: number; _count: { attempts: number }; }

export default function PracticeTestPage() {
  const [tests, setTests] = useState<Test[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_BASE_URL}/tests`)
      .then((r) => r.json())
      .then((d) => { if (d.success) setTests(d.data); })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="flex items-center justify-center h-64"><Loader2 className="w-6 h-6 animate-spin" style={{ color: "hsl(var(--primary))" }} /></div>;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-2">📋 Thi Thử TOEIC</h1>
        <p style={{ color: "hsl(var(--muted-foreground))" }}>Làm đề thi thử và xem điểm TOEIC ước tính</p>
      </div>

      {tests.length === 0 ? (
        <div className="text-center py-16">
          <ClipboardList className="w-12 h-12 mx-auto mb-4 opacity-30" />
          <p style={{ color: "hsl(var(--muted-foreground))" }}>Chưa có đề thi nào</p>
        </div>
      ) : (
        <div className="space-y-4">
          {tests.map((test) => (
            <div key={test.id} className="card p-6 hover:shadow-lg transition-all">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-bold text-lg">{test.title}</h3>
                    {test.isFullTest && (
                      <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ background: "hsl(var(--primary)/0.1)", color: "hsl(var(--primary))" }}>Full Test</span>
                    )}
                  </div>
                  <p className="text-sm mb-3" style={{ color: "hsl(var(--muted-foreground))" }}>{test.description}</p>
                  <div className="flex items-center gap-4 text-sm" style={{ color: "hsl(var(--muted-foreground))" }}>
                    <span className="flex items-center gap-1"><ClipboardList className="w-3.5 h-3.5" /> {test.totalQuestions} câu</span>
                    <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {Math.floor(test.duration / 60)} phút</span>
                    <span className="flex items-center gap-1"><Trophy className="w-3.5 h-3.5" /> {test._count.attempts} lượt thi</span>
                  </div>
                </div>
                <Link href={`/practice-test/${test.id}`}
                  className="btn text-sm px-5 py-2.5 text-white flex-shrink-0 ml-4"
                  style={{ background: "linear-gradient(135deg, hsl(221 83% 53%), hsl(262 83% 58%))" }}>
                  <Play className="w-4 h-4" /> Bắt đầu
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
