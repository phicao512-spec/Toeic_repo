"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, CheckCircle2, XCircle, ChevronRight } from "lucide-react";
import { apiFetch } from "@/lib/auth";

interface Question {
  id: string;
  content: string;
  options: string[];
  answer: string;
  explanation: string;
  difficulty: string;
}

export default function ListeningPart2Page() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [checked, setChecked] = useState(false);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiFetch("/questions?part=PART2&limit=10")
      .then((r) => r.json())
      .then((d) => {
        setQuestions(d.data?.questions || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const q = questions[current];
  const opts = ["A", "B", "C"];

  function handleCheck() {
    if (!selected) return;
    setChecked(true);
    if (selected === q.answer) setScore((s) => s + 1);
  }

  function handleNext() {
    if (current + 1 >= questions.length) {
      setDone(true);
    } else {
      setCurrent((c) => c + 1);
      setSelected(null);
      setChecked(false);
    }
  }

  if (loading) return <div className="p-10 text-center">Đang tải câu hỏi...</div>;

  if (done) return (
    <div className="p-6 max-w-xl mx-auto text-center py-20">
      <div className="text-6xl mb-4">🎉</div>
      <h2 className="text-2xl font-bold mb-2">Hoàn thành!</h2>
      <p className="text-lg mb-6" style={{ color: "hsl(var(--muted-foreground))" }}>Điểm số: <strong>{score}/{questions.length}</strong></p>
      <div className="flex gap-3 justify-center">
        <button onClick={() => { setCurrent(0); setScore(0); setDone(false); setSelected(null); setChecked(false); }} className="btn-primary">Luyện lại</button>
        <Link href="/listening" className="btn-secondary">Quay lại</Link>
      </div>
    </div>
  );

  if (!q) return (
    <div className="p-6 max-w-xl mx-auto text-center py-20">
      <div className="text-5xl mb-4">🎧</div>
      <h2 className="text-xl font-bold mb-2">Part 2: Hỏi - Đáp</h2>
      <p className="text-sm mb-4" style={{ color: "hsl(var(--muted-foreground))" }}>Chưa có câu hỏi. Vui lòng chạy seed dữ liệu.</p>
      <Link href="/listening" className="btn-secondary">Quay lại</Link>
    </div>
  );

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <Link href="/listening" className="flex items-center gap-1 text-sm mb-6" style={{ color: "hsl(var(--muted-foreground))" }}>
        <ArrowLeft className="w-4 h-4" /> Luyện nghe
      </Link>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-bold">🎧 Part 2: Hỏi - Đáp</h1>
        <span className="text-sm font-medium" style={{ color: "hsl(var(--muted-foreground))" }}>{current + 1}/{questions.length}</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-1.5 mb-6">
        <div className="h-1.5 rounded-full transition-all" style={{ width: `${((current + 1) / questions.length) * 100}%`, background: "hsl(var(--primary))" }} />
      </div>

      <div className="card p-6 mb-4">
        <p className="text-xs font-medium mb-3 uppercase tracking-wide" style={{ color: "hsl(var(--muted-foreground))" }}>Câu hỏi</p>
        <p className="text-lg font-medium mb-1">🎙 "{q.content}"</p>
        <p className="text-xs" style={{ color: "hsl(var(--muted-foreground))" }}>Chọn câu trả lời đúng nhất cho câu hỏi trên:</p>
      </div>

      <div className="space-y-3 mb-6">
        {q.options.map((opt, i) => {
          const letter = opts[i];
          const isCorrect = letter === q.answer;
          const isSelected = letter === selected;
          let bg = "hsl(var(--card))";
          let border = "1px solid hsl(var(--border))";
          if (checked && isCorrect) { bg = "hsl(142 76% 36% / 0.15)"; border = "1px solid hsl(142 76% 36%)"; }
          else if (checked && isSelected && !isCorrect) { bg = "hsl(0 84% 60% / 0.15)"; border = "1px solid hsl(0 84% 60%)"; }
          else if (isSelected) { border = "2px solid hsl(var(--primary))"; }

          return (
            <button key={i} disabled={checked} onClick={() => setSelected(letter)}
              className="w-full text-left p-4 rounded-xl flex items-center gap-3 transition-all"
              style={{ background: bg, border }}>
              <span className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                style={{ background: isSelected ? "hsl(var(--primary))" : "hsl(var(--muted))", color: isSelected ? "white" : "hsl(var(--muted-foreground))" }}>{letter}</span>
              <span className="text-sm">{opt}</span>
              {checked && isCorrect && <CheckCircle2 className="w-5 h-5 ml-auto" style={{ color: "hsl(142 76% 36%)" }} />}
              {checked && isSelected && !isCorrect && <XCircle className="w-5 h-5 ml-auto text-red-500" />}
            </button>
          );
        })}
      </div>

      {checked && (
        <div className="card p-4 mb-4" style={{ background: "hsl(var(--muted)/0.5)" }}>
          <p className="text-sm font-medium mb-1">💡 Giải thích</p>
          <p className="text-sm" style={{ color: "hsl(var(--muted-foreground))" }}>{q.explanation}</p>
        </div>
      )}

      <div className="flex gap-3">
        {!checked ? (
          <button onClick={handleCheck} disabled={!selected} className="btn-primary flex-1 disabled:opacity-50">Kiểm tra đáp án</button>
        ) : (
          <button onClick={handleNext} className="btn-primary flex-1 flex items-center justify-center gap-2">
            {current + 1 >= questions.length ? "Xem kết quả" : "Câu tiếp theo"} <ChevronRight className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}
