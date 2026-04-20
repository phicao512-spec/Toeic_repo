"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Volume2, RotateCcw, Check, X, Loader2 } from "lucide-react";
import { API_BASE_URL } from "@/lib/constants";

interface Word {
  id: string; word: string; pronunciation: string; partOfSpeech: string;
  meaningVi: string; meaningEn: string; example: string; exampleVi: string;
}

export default function VocabTopicPage() {
  const { topicId } = useParams();
  const router = useRouter();
  const [words, setWords] = useState<Word[]>([]);
  const [topicName, setTopicName] = useState("");
  const [loading, setLoading] = useState(true);
  const [mode, setMode] = useState<"list" | "flashcard" | "quiz">("list");
  const [currentIdx, setCurrentIdx] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [score, setScore] = useState({ correct: 0, wrong: 0 });
  const [quizAnswer, setQuizAnswer] = useState<string | null>(null);
  const [quizOptions, setQuizOptions] = useState<string[]>([]);

  useEffect(() => {
    fetch(`${API_BASE_URL}/vocab/topics/${topicId}/words`)
      .then((r) => r.json())
      .then((d) => {
        if (d.success) {
          setWords(d.data.words);
          setTopicName(d.data.topic.nameVi);
        }
      })
      .finally(() => setLoading(false));
  }, [topicId]);

  const generateQuizOptions = useCallback((idx: number) => {
    if (words.length < 2) return;
    const correct = words[idx].meaningVi;
    const others = words.filter((_, i) => i !== idx).sort(() => Math.random() - 0.5).slice(0, 3).map((w) => w.meaningVi);
    const opts = [correct, ...others].sort(() => Math.random() - 0.5);
    setQuizOptions(opts);
    setQuizAnswer(null);
  }, [words]);

  const startFlashcard = () => { setMode("flashcard"); setCurrentIdx(0); setFlipped(false); setScore({ correct: 0, wrong: 0 }); };
  const startQuiz = () => { setMode("quiz"); setCurrentIdx(0); setScore({ correct: 0, wrong: 0 }); generateQuizOptions(0); };

  const nextCard = (knew: boolean) => {
    setScore((s) => knew ? { ...s, correct: s.correct + 1 } : { ...s, wrong: s.wrong + 1 });
    if (currentIdx < words.length - 1) { setCurrentIdx((i) => i + 1); setFlipped(false); }
    else setMode("list");
  };

  const answerQuiz = (ans: string) => {
    setQuizAnswer(ans);
    const isCorrect = ans === words[currentIdx].meaningVi;
    setScore((s) => isCorrect ? { ...s, correct: s.correct + 1 } : { ...s, wrong: s.wrong + 1 });
    setTimeout(() => {
      if (currentIdx < words.length - 1) {
        const next = currentIdx + 1;
        setCurrentIdx(next);
        generateQuizOptions(next);
      } else setMode("list");
    }, 1200);
  };

  if (loading) return <div className="flex items-center justify-center h-64"><Loader2 className="w-6 h-6 animate-spin" style={{ color: "hsl(var(--primary))" }} /></div>;

  const word = words[currentIdx];

  // ─── FLASHCARD MODE ────────────────────────────────────
  if (mode === "flashcard" && word) return (
    <div className="p-6 max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <button onClick={() => setMode("list")} className="flex items-center gap-1 text-sm" style={{ color: "hsl(var(--muted-foreground))" }}>
          <ArrowLeft className="w-4 h-4" /> Quay lại
        </button>
        <span className="text-sm font-medium">{currentIdx + 1} / {words.length}</span>
      </div>
      {/* Progress */}
      <div className="h-1 rounded-full mb-6 overflow-hidden" style={{ background: "hsl(var(--muted))" }}>
        <div className="h-full rounded-full transition-all" style={{ width: `${((currentIdx + 1) / words.length) * 100}%`, background: "hsl(var(--primary))" }} />
      </div>
      {/* Card */}
      <div onClick={() => setFlipped(!flipped)} className="card p-8 min-h-[300px] flex flex-col items-center justify-center cursor-pointer hover:shadow-lg transition-all text-center">
        {!flipped ? (
          <>
            <div className="text-4xl font-bold mb-3">{word.word}</div>
            <div className="text-sm mb-1" style={{ color: "hsl(var(--muted-foreground))" }}>{word.pronunciation}</div>
            <div className="text-xs px-3 py-1 rounded-full mt-2" style={{ background: "hsl(var(--primary)/0.1)", color: "hsl(var(--primary))" }}>{word.partOfSpeech}</div>
            <p className="text-xs mt-6" style={{ color: "hsl(var(--muted-foreground))" }}>Nhấn để xem nghĩa</p>
          </>
        ) : (
          <>
            <div className="text-2xl font-bold mb-2" style={{ color: "hsl(var(--primary))" }}>{word.meaningVi}</div>
            <div className="text-sm mb-4" style={{ color: "hsl(var(--muted-foreground))" }}>{word.meaningEn}</div>
            <div className="w-full max-w-md text-left p-4 rounded-xl" style={{ background: "hsl(var(--muted)/0.5)" }}>
              <p className="text-sm font-medium mb-1">📝 {word.example}</p>
              <p className="text-xs" style={{ color: "hsl(var(--muted-foreground))" }}>{word.exampleVi}</p>
            </div>
          </>
        )}
      </div>
      {flipped && (
        <div className="flex gap-3 mt-6">
          <button onClick={() => nextCard(false)} className="btn flex-1 py-3" style={{ background: "hsl(0 84% 60%/0.1)", color: "hsl(0 84% 60%)", border: "1px solid hsl(0 84% 60%/0.3)" }}>
            <X className="w-4 h-4" /> Chưa nhớ
          </button>
          <button onClick={() => nextCard(true)} className="btn flex-1 py-3" style={{ background: "hsl(142 71% 45%/0.1)", color: "hsl(142 71% 45%)", border: "1px solid hsl(142 71% 45%/0.3)" }}>
            <Check className="w-4 h-4" /> Đã nhớ
          </button>
        </div>
      )}
      {/* Score */}
      <div className="flex justify-center gap-6 mt-4 text-sm" style={{ color: "hsl(var(--muted-foreground))" }}>
        <span>✅ {score.correct}</span><span>❌ {score.wrong}</span>
      </div>
    </div>
  );

  // ─── QUIZ MODE ─────────────────────────────────────────
  if (mode === "quiz" && word) return (
    <div className="p-6 max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <button onClick={() => setMode("list")} className="flex items-center gap-1 text-sm" style={{ color: "hsl(var(--muted-foreground))" }}>
          <ArrowLeft className="w-4 h-4" /> Quay lại
        </button>
        <span className="text-sm font-medium">{currentIdx + 1} / {words.length}</span>
      </div>
      <div className="h-1 rounded-full mb-6 overflow-hidden" style={{ background: "hsl(var(--muted))" }}>
        <div className="h-full rounded-full transition-all" style={{ width: `${((currentIdx + 1) / words.length) * 100}%`, background: "hsl(var(--primary))" }} />
      </div>
      <div className="card p-8 text-center mb-6">
        <div className="text-3xl font-bold mb-2">{word.word}</div>
        <div className="text-sm" style={{ color: "hsl(var(--muted-foreground))" }}>{word.pronunciation} — {word.partOfSpeech}</div>
      </div>
      <div className="space-y-3">
        {quizOptions.map((opt, i) => {
          const isSelected = quizAnswer === opt;
          const isCorrect = opt === word.meaningVi;
          let bg = "hsl(var(--card))";
          let border = "hsl(var(--border))";
          if (quizAnswer) {
            if (isCorrect) { bg = "hsl(142 71% 45%/0.1)"; border = "hsl(142 71% 45%/0.5)"; }
            else if (isSelected) { bg = "hsl(0 84% 60%/0.1)"; border = "hsl(0 84% 60%/0.5)"; }
          }
          return (
            <button key={i} onClick={() => !quizAnswer && answerQuiz(opt)} disabled={!!quizAnswer}
              className="w-full text-left p-4 rounded-xl transition-all" style={{ background: bg, border: `1.5px solid ${border}` }}>
              <span className="font-medium mr-2" style={{ color: "hsl(var(--primary))" }}>{String.fromCharCode(65 + i)}.</span>
              {opt}
            </button>
          );
        })}
      </div>
      <div className="flex justify-center gap-6 mt-6 text-sm" style={{ color: "hsl(var(--muted-foreground))" }}>
        <span>✅ {score.correct}</span><span>❌ {score.wrong}</span>
      </div>
    </div>
  );

  // ─── LIST MODE ─────────────────────────────────────────
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <button onClick={() => router.push("/vocabulary")} className="flex items-center gap-1 text-sm mb-6" style={{ color: "hsl(var(--muted-foreground))" }}>
        <ArrowLeft className="w-4 h-4" /> Tất cả chủ đề
      </button>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">{topicName}</h1>
          <p className="text-sm" style={{ color: "hsl(var(--muted-foreground))" }}>{words.length} từ vựng</p>
        </div>
        <div className="flex gap-2">
          <button onClick={startFlashcard} className="btn text-sm px-4 py-2 text-white" style={{ background: "hsl(var(--primary))" }}>
            🃏 Flashcard
          </button>
          <button onClick={startQuiz} className="btn text-sm px-4 py-2" style={{ background: "hsl(var(--muted))" }}>
            ❓ Quiz
          </button>
        </div>
      </div>
      <div className="space-y-3">
        {words.map((w) => (
          <div key={w.id} className="card p-4 flex items-start gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-bold">{w.word}</span>
                <span className="text-xs" style={{ color: "hsl(var(--muted-foreground))" }}>{w.pronunciation}</span>
                <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: "hsl(var(--primary)/0.1)", color: "hsl(var(--primary))" }}>{w.partOfSpeech}</span>
              </div>
              <div className="text-sm font-medium mb-1">{w.meaningVi}</div>
              <div className="text-xs" style={{ color: "hsl(var(--muted-foreground))" }}>{w.example}</div>
            </div>
            <button className="p-2 rounded-lg hover:bg-black/5 transition-colors" title="Phát âm">
              <Volume2 className="w-4 h-4" style={{ color: "hsl(var(--primary))" }} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
