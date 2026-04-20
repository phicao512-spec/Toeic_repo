"use client";

import { useState, useEffect } from "react";
import { Loader2, CheckCircle, XCircle, ArrowRight } from "lucide-react";
import { API_BASE_URL } from "@/lib/constants";
import { TOEIC_PARTS } from "@/lib/constants";

interface Question { id: string; part: string; content: string; options: string[]; difficulty: string; }
interface AnswerResult { isCorrect: boolean; correctAnswer: string; explanation: string; }

export default function ReadingPart5Page() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [result, setResult] = useState<AnswerResult | null>(null);
  const [score, setScore] = useState({ correct: 0, total: 0 });
  const [checking, setChecking] = useState(false);

  useEffect(() => {
    fetch(`${API_BASE_URL}/questions?part=PART5&limit=10`)
      .then((r) => r.json())
      .then((d) => { if (d.success) setQuestions(d.data.items); })
      .finally(() => setLoading(false));
  }, []);

  const checkAnswer = async () => {
    if (!selected || checking) return;
    setChecking(true);
    try {
      const res = await fetch(`${API_BASE_URL}/questions/${questions[currentIdx].id}?showAnswer=true`);
      const d = await res.json();
      if (d.success) {
        const isCorrect = selected === d.data.answer;
        setResult({ isCorrect, correctAnswer: d.data.answer, explanation: d.data.explanation || "" });
        setScore((s) => ({ correct: s.correct + (isCorrect ? 1 : 0), total: s.total + 1 }));
      }
    } catch { /* */ }
    setChecking(false);
  };

  const nextQuestion = () => {
    if (currentIdx < questions.length - 1) {
      setCurrentIdx((i) => i + 1);
      setSelected(null);
      setResult(null);
    }
  };

  if (loading) return <div className="flex items-center justify-center h-64"><Loader2 className="w-6 h-6 animate-spin" style={{ color: "hsl(var(--primary))" }} /></div>;

  const partInfo = TOEIC_PARTS.find((p) => p.id === "PART5");
  const q = questions[currentIdx];
  const letters = ["A", "B", "C", "D"];

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-1">✏️ {partInfo?.nameVi}</h1>
        <p className="text-sm" style={{ color: "hsl(var(--muted-foreground))" }}>{partInfo?.description}</p>
      </div>

      {/* Progress */}
      <div className="flex items-center gap-3 mb-6">
        <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: "hsl(var(--muted))" }}>
          <div className="h-full rounded-full transition-all" style={{ width: `${((currentIdx + 1) / questions.length) * 100}%`, background: "hsl(var(--primary))" }} />
        </div>
        <span className="text-sm font-medium">{currentIdx + 1}/{questions.length}</span>
        <span className="text-sm" style={{ color: "hsl(var(--muted-foreground))" }}>✅ {score.correct}/{score.total}</span>
      </div>

      {q && (
        <div className="card p-8">
          <p className="text-lg leading-relaxed mb-6">{q.content}</p>
          <div className="space-y-3 mb-6">
            {q.options.map((opt, i) => {
              const letter = letters[i];
              const isSelected = selected === letter;
              let bg = "transparent", border = "hsl(var(--border))", textColor = "";
              if (result) {
                if (letter === result.correctAnswer) { bg = "hsl(142 71% 45%/0.1)"; border = "hsl(142 71% 45%/0.5)"; textColor = "hsl(142 71% 45%)"; }
                else if (isSelected && !result.isCorrect) { bg = "hsl(0 84% 60%/0.1)"; border = "hsl(0 84% 60%/0.5)"; textColor = "hsl(0 84% 60%)"; }
              } else if (isSelected) { bg = "hsl(var(--primary)/0.1)"; border = "hsl(var(--primary))"; }
              return (
                <button key={i} onClick={() => !result && setSelected(letter)} disabled={!!result}
                  className="w-full text-left p-4 rounded-xl transition-all flex items-center gap-3"
                  style={{ background: bg, border: `1.5px solid ${border}`, color: textColor || undefined }}>
                  <span className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                    style={{ background: isSelected ? "hsl(var(--primary))" : "hsl(var(--muted))", color: isSelected ? "white" : undefined }}>
                    {letter}
                  </span>
                  <span className="text-sm">{opt}</span>
                  {result && letter === result.correctAnswer && <CheckCircle className="w-4 h-4 ml-auto" style={{ color: "hsl(142 71% 45%)" }} />}
                  {result && isSelected && !result.isCorrect && <XCircle className="w-4 h-4 ml-auto" style={{ color: "hsl(0 84% 60%)" }} />}
                </button>
              );
            })}
          </div>

          {result && result.explanation && (
            <div className="p-4 rounded-xl mb-4" style={{ background: "hsl(var(--muted)/0.5)" }}>
              <p className="text-sm">💡 <strong>Giải thích:</strong> {result.explanation}</p>
            </div>
          )}

          <div className="flex gap-3">
            {!result ? (
              <button onClick={checkAnswer} disabled={!selected || checking}
                className="btn flex-1 py-3 text-sm font-semibold text-white"
                style={{ background: "hsl(var(--primary))", opacity: !selected ? 0.5 : 1 }}>
                {checking ? "Đang kiểm tra..." : "Kiểm tra đáp án"}
              </button>
            ) : currentIdx < questions.length - 1 ? (
              <button onClick={nextQuestion} className="btn flex-1 py-3 text-sm font-semibold text-white" style={{ background: "hsl(var(--primary))" }}>
                Câu tiếp theo <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <div className="flex-1 text-center p-4 rounded-xl" style={{ background: "hsl(var(--primary)/0.1)" }}>
                <p className="font-bold">🎉 Hoàn thành! Kết quả: {score.correct}/{score.total}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
