"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Clock, ChevronLeft, ChevronRight, Flag, Loader2, CheckCircle, XCircle } from "lucide-react";
import { API_BASE_URL } from "@/lib/constants";
import { apiFetch, getToken } from "@/lib/auth";

interface Question { id: string; order: number; part: string; content: string; options: string[]; difficulty: string; }
interface TestData { id: string; title: string; duration: number; totalQuestions: number; questions: Question[]; }
interface Result { totalScore: number; listeningScore: number; readingScore: number; correctListening: number; correctReading: number; detailedResults: { questionId: string; userAnswer: string; correctAnswer: string; isCorrect: boolean; explanation: string | null; }[]; }

export default function TestTakingPage() {
  const { testId } = useParams();
  const router = useRouter();
  const [test, setTest] = useState<TestData | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [attemptId, setAttemptId] = useState<string | null>(null);
  const [result, setResult] = useState<Result | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetch(`${API_BASE_URL}/tests/${testId}`)
      .then((r) => r.json())
      .then((d) => {
        if (d.success) { setTest(d.data); setTimeLeft(d.data.duration); }
      })
      .finally(() => setLoading(false));
  }, [testId]);

  // Start attempt
  useEffect(() => {
    if (!test || attemptId) return;
    const token = getToken();
    if (!token) return;
    apiFetch<{ attemptId: string }>(`/tests/${testId}/start`, { method: "POST" })
      .then((d) => { if (d.success && d.data) setAttemptId(d.data.attemptId); });
  }, [test, testId, attemptId]);

  // Timer
  useEffect(() => {
    if (!attemptId || result) return;
    const t = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) { clearInterval(t); handleSubmit(); return 0; }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(t);
  }, [attemptId, result]);

  const handleSubmit = useCallback(async () => {
    if (!attemptId || submitting) return;
    setSubmitting(true);
    const d = await apiFetch<Result>(`/tests/attempts/${attemptId}/submit`, {
      method: "POST",
      body: JSON.stringify({ answers }),
    });
    if (d.success && d.data) setResult(d.data);
    setSubmitting(false);
  }, [attemptId, answers, submitting]);

  const selectAnswer = (qId: string, ans: string) => setAnswers((prev) => ({ ...prev, [qId]: ans }));
  const formatTime = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;

  if (loading) return <div className="flex items-center justify-center h-64"><Loader2 className="w-6 h-6 animate-spin" style={{ color: "hsl(var(--primary))" }} /></div>;
  if (!test) return <div className="p-6 text-center">Không tìm thấy đề thi</div>;

  // ─── RESULT SCREEN ─────────────────────────────────────
  if (result) {
    const totalQ = test.questions.length;
    const correctTotal = result.detailedResults.filter((r) => r.isCorrect).length;
    return (
      <div className="p-6 max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4" style={{ background: "linear-gradient(135deg, hsl(221 83% 53%), hsl(262 83% 58%))" }}>
            <span className="text-3xl font-bold text-white">{result.totalScore}</span>
          </div>
          <h2 className="text-2xl font-bold mb-1">Kết quả thi thử</h2>
          <p style={{ color: "hsl(var(--muted-foreground))" }}>{test.title}</p>
        </div>
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="card p-4 text-center"><div className="text-2xl font-bold" style={{ color: "hsl(var(--primary))" }}>{result.totalScore}</div><div className="text-xs" style={{ color: "hsl(var(--muted-foreground))" }}>Tổng điểm</div></div>
          <div className="card p-4 text-center"><div className="text-2xl font-bold" style={{ color: "hsl(142 71% 45%)" }}>{correctTotal}/{totalQ}</div><div className="text-xs" style={{ color: "hsl(var(--muted-foreground))" }}>Đúng</div></div>
          <div className="card p-4 text-center"><div className="text-2xl font-bold">{Math.round((correctTotal / totalQ) * 100)}%</div><div className="text-xs" style={{ color: "hsl(var(--muted-foreground))" }}>Tỷ lệ</div></div>
        </div>
        {/* Detailed results */}
        <h3 className="font-bold mb-4">Chi tiết đáp án</h3>
        <div className="space-y-3">
          {result.detailedResults.map((r, i) => {
            const q = test.questions[i];
            return (
              <div key={i} className="card p-4">
                <div className="flex items-start gap-2">
                  {r.isCorrect ? <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: "hsl(142 71% 45%)" }} /> : <XCircle className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: "hsl(0 84% 60%)" }} />}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium mb-1">Câu {i + 1}: {q?.content}</p>
                    {!r.isCorrect && <p className="text-xs mb-1"><span style={{ color: "hsl(0 84% 60%)" }}>Bạn chọn: {r.userAnswer || "—"}</span> · <span style={{ color: "hsl(142 71% 45%)" }}>Đáp án: {r.correctAnswer}</span></p>}
                    {r.explanation && <p className="text-xs" style={{ color: "hsl(var(--muted-foreground))" }}>💡 {r.explanation}</p>}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        <button onClick={() => router.push("/practice-test")} className="btn w-full py-3 text-sm font-semibold text-white mt-6" style={{ background: "hsl(var(--primary))" }}>
          ← Quay về danh sách đề thi
        </button>
      </div>
    );
  }

  // ─── TEST TAKING ───────────────────────────────────────
  const q = test.questions[currentQ];
  const answeredCount = Object.keys(answers).length;
  const letters = ["A", "B", "C", "D"];

  return (
    <div className="flex flex-col h-[calc(100vh-64px)]">
      {/* Top bar */}
      <div className="flex items-center justify-between px-6 py-3 border-b" style={{ borderColor: "hsl(var(--border))" }}>
        <button onClick={() => router.push("/practice-test")} className="flex items-center gap-1 text-sm" style={{ color: "hsl(var(--muted-foreground))" }}>
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div className="font-bold text-sm">{test.title}</div>
        <div className="flex items-center gap-1.5 font-mono text-sm font-bold" style={{ color: timeLeft < 60 ? "hsl(0 84% 60%)" : "hsl(var(--foreground))" }}>
          <Clock className="w-4 h-4" /> {formatTime(timeLeft)}
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Main question area */}
        <div className="flex-1 p-6 overflow-y-auto">
          <div className="max-w-2xl mx-auto">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ background: "hsl(var(--primary)/0.1)", color: "hsl(var(--primary))" }}>{q.part}</span>
              <span className="text-sm font-bold">Câu {currentQ + 1}</span>
            </div>
            <p className="text-base leading-relaxed mb-6">{q.content}</p>
            <div className="space-y-3">
              {q.options.map((opt, i) => {
                const selected = answers[q.id] === letters[i];
                return (
                  <button key={i} onClick={() => selectAnswer(q.id, letters[i])}
                    className="w-full text-left p-4 rounded-xl transition-all flex items-start gap-3"
                    style={{
                      background: selected ? "hsl(var(--primary)/0.1)" : "hsl(var(--card))",
                      border: `1.5px solid ${selected ? "hsl(var(--primary))" : "hsl(var(--border))"}`,
                    }}>
                    <span className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0" style={{
                      background: selected ? "hsl(var(--primary))" : "hsl(var(--muted))",
                      color: selected ? "white" : "hsl(var(--foreground))",
                    }}>{letters[i]}</span>
                    <span className="text-sm pt-1">{opt}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Question navigator (sidebar) */}
        <div className="hidden lg:block w-56 border-l p-4 overflow-y-auto" style={{ borderColor: "hsl(var(--border))" }}>
          <div className="text-xs font-bold mb-3 uppercase" style={{ color: "hsl(var(--muted-foreground))" }}>Câu hỏi ({answeredCount}/{test.questions.length})</div>
          <div className="grid grid-cols-5 gap-1.5">
            {test.questions.map((tq, i) => (
              <button key={i} onClick={() => setCurrentQ(i)}
                className="w-8 h-8 rounded-lg text-xs font-medium transition-all"
                style={{
                  background: currentQ === i ? "hsl(var(--primary))" : answers[tq.id] ? "hsl(var(--primary)/0.15)" : "hsl(var(--muted))",
                  color: currentQ === i ? "white" : answers[tq.id] ? "hsl(var(--primary))" : "hsl(var(--foreground))",
                }}>{i + 1}</button>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="flex items-center justify-between px-6 py-3 border-t" style={{ borderColor: "hsl(var(--border))" }}>
        <button disabled={currentQ === 0} onClick={() => setCurrentQ((c) => c - 1)} className="btn text-sm px-4 py-2" style={{ background: "hsl(var(--muted))" }}>
          <ChevronLeft className="w-4 h-4" /> Trước
        </button>
        <button onClick={handleSubmit} disabled={submitting}
          className="btn text-sm px-5 py-2 text-white"
          style={{ background: "linear-gradient(135deg, hsl(221 83% 53%), hsl(262 83% 58%))" }}>
          <Flag className="w-4 h-4" /> {submitting ? "Đang nộp..." : "Nộp bài"}
        </button>
        <button disabled={currentQ === test.questions.length - 1} onClick={() => setCurrentQ((c) => c + 1)} className="btn text-sm px-4 py-2" style={{ background: "hsl(var(--muted))" }}>
          Sau <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
