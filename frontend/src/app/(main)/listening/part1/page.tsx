"use client";

import { useState, useEffect } from "react";
import { Loader2, CheckCircle, XCircle } from "lucide-react";
import { API_BASE_URL, TOEIC_PARTS } from "@/lib/constants";

interface Question { id: string; content: string; options: string[]; difficulty: string; }

export default function ListeningPart1Page() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [correctAnswer, setCorrectAnswer] = useState("");
  const [explanation, setExplanation] = useState("");
  const [score, setScore] = useState({ correct: 0, total: 0 });

  const partInfo = TOEIC_PARTS.find((p) => p.id === "PART1");
  const letters = ["A", "B", "C", "D"];

  useEffect(() => {
    fetch(`${API_BASE_URL}/questions?part=PART1&limit=5`)
      .then((r) => r.json())
      .then((d) => { if (d.success) setQuestions(d.data.items); })
      .finally(() => setLoading(false));
  }, []);

  const check = async () => {
    if (!selected) return;
    const res = await fetch(`${API_BASE_URL}/questions/${questions[currentIdx].id}?showAnswer=true`);
    const d = await res.json();
    if (d.success) {
      setCorrectAnswer(d.data.answer);
      setExplanation(d.data.explanation || "");
      const isCorrect = selected === d.data.answer;
      setScore((s) => ({ correct: s.correct + (isCorrect ? 1 : 0), total: s.total + 1 }));
      setShowAnswer(true);
    }
  };

  const next = () => {
    setCurrentIdx((i) => i + 1);
    setSelected(null); setShowAnswer(false); setCorrectAnswer(""); setExplanation("");
  };

  if (loading) return <div className="flex items-center justify-center h-64"><Loader2 className="w-6 h-6 animate-spin" style={{ color: "hsl(var(--primary))" }} /></div>;

  const q = questions[currentIdx];
  if (!q) return <div className="p-6 text-center py-16"><p style={{ color: "hsl(var(--muted-foreground))" }}>Chưa có câu hỏi cho Part 1</p></div>;

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-1">{partInfo?.icon} {partInfo?.nameVi}</h1>
        <p className="text-sm" style={{ color: "hsl(var(--muted-foreground))" }}>{partInfo?.description}</p>
      </div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: "hsl(var(--muted))" }}>
          <div className="h-full rounded-full transition-all" style={{ width: `${((currentIdx + 1) / questions.length) * 100}%`, background: "hsl(var(--primary))" }} />
        </div>
        <span className="text-sm font-medium">{currentIdx + 1}/{questions.length}</span>
        <span className="text-sm" style={{ color: "hsl(var(--muted-foreground))" }}>✅ {score.correct}/{score.total}</span>
      </div>
      <div className="card p-6 mb-4">
        <div className="p-4 rounded-xl mb-4 text-center" style={{ background: "hsl(var(--muted)/0.5)" }}>
          <p className="text-sm" style={{ color: "hsl(var(--muted-foreground))" }}>🎧 Audio sẽ được phát ở đây</p>
          <p className="text-xs mt-1" style={{ color: "hsl(var(--muted-foreground))" }}>(Tính năng audio sẽ sớm ra mắt)</p>
        </div>
        <div className="space-y-3">
          {q.options.map((opt, i) => {
            const letter = letters[i];
            const isSel = selected === letter;
            let bg = "transparent", border = "hsl(var(--border))";
            if (showAnswer) {
              if (letter === correctAnswer) { bg = "hsl(142 71% 45%/0.1)"; border = "hsl(142 71% 45%/0.5)"; }
              else if (isSel) { bg = "hsl(0 84% 60%/0.1)"; border = "hsl(0 84% 60%/0.5)"; }
            } else if (isSel) { bg = "hsl(var(--primary)/0.1)"; border = "hsl(var(--primary))"; }
            return (
              <button key={i} onClick={() => !showAnswer && setSelected(letter)} disabled={showAnswer}
                className="w-full text-left p-3.5 rounded-xl transition-all flex items-center gap-3"
                style={{ background: bg, border: `1.5px solid ${border}` }}>
                <span className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold"
                  style={{ background: isSel ? "hsl(var(--primary))" : "hsl(var(--muted))", color: isSel ? "white" : undefined }}>{letter}</span>
                <span className="text-sm flex-1">{opt}</span>
                {showAnswer && letter === correctAnswer && <CheckCircle className="w-4 h-4" style={{ color: "hsl(142 71% 45%)" }} />}
                {showAnswer && isSel && letter !== correctAnswer && <XCircle className="w-4 h-4" style={{ color: "hsl(0 84% 60%)" }} />}
              </button>
            );
          })}
        </div>
      </div>
      {showAnswer && explanation && (
        <div className="p-4 rounded-xl mb-4" style={{ background: "hsl(var(--muted)/0.5)" }}>
          <p className="text-sm">💡 {explanation}</p>
        </div>
      )}
      <div className="flex gap-3">
        {!showAnswer ? (
          <button onClick={check} disabled={!selected} className="btn flex-1 py-3 text-sm font-semibold text-white"
            style={{ background: "hsl(var(--primary))", opacity: !selected ? 0.5 : 1 }}>Kiểm tra</button>
        ) : currentIdx < questions.length - 1 ? (
          <button onClick={next} className="btn flex-1 py-3 text-sm font-semibold text-white"
            style={{ background: "hsl(var(--primary))" }}>Câu tiếp theo →</button>
        ) : (
          <div className="flex-1 text-center p-4 rounded-xl" style={{ background: "hsl(var(--primary)/0.1)" }}>
            <p className="font-bold">🎉 Hoàn thành! Kết quả: {score.correct}/{score.total}</p>
          </div>
        )}
      </div>
    </div>
  );
}
