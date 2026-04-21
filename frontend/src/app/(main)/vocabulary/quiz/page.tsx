"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  ArrowLeft, Volume2, Loader2, CheckCircle2, Zap, Trophy, Languages, X
} from "lucide-react";
import { API_BASE_URL } from "@/lib/constants";
import { cn } from "@/lib/utils";

interface Word {
  id: string; word: string; pronunciation: string; partOfSpeech: string;
  meaningVi: string; meaningEn: string; example: string; exampleVi: string;
}

type QuizType = "en-to-vi" | "vi-to-en";

export default function MultiQuizPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const topicIds = searchParams.get("topics")?.split(",") || [];

  const [words, setWords] = useState<Word[]>([]);
  const [loading, setLoading] = useState(true);
  const [quizType, setQuizType] = useState<QuizType | null>(null);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [score, setScore] = useState({ correct: 0, wrong: 0 });
  const [quizAnswer, setQuizAnswer] = useState<string | null>(null);
  const [quizOptions, setQuizOptions] = useState<string[]>([]);
  const [finished, setFinished] = useState(false);

  useEffect(() => {
    const fetchWords = async () => {
      try {
        const allWords: Word[] = [];
        for (const tid of topicIds) {
          const r = await fetch(`${API_BASE_URL}/vocab/topics/${tid}/words`);
          const d = await r.json();
          if (d.success) allWords.push(...d.data.words);
        }
        // Shuffle
        const shuffled = allWords.sort(() => Math.random() - 0.5);
        setWords(shuffled);
      } catch(e) { console.error(e); }
      finally { setLoading(false); }
    };
    if (topicIds.length > 0) fetchWords();
    else setLoading(false);
  }, []);

  const generateOptions = useCallback((idx: number, type: QuizType) => {
    if (words.length < 2) return;
    const isEnToVi = type === "en-to-vi";
    const correct = isEnToVi ? words[idx].meaningVi : words[idx].word;
    const others = words.filter((_, i) => i !== idx).sort(() => Math.random() - 0.5).slice(0, 3).map(w => isEnToVi ? w.meaningVi : w.word);
    setQuizOptions([correct, ...others].sort(() => Math.random() - 0.5));
    setQuizAnswer(null);
  }, [words]);

  const startQuiz = (type: QuizType) => {
    setQuizType(type);
    setCurrentIdx(0);
    setScore({ correct: 0, wrong: 0 });
    setFinished(false);
    generateOptions(0, type);
  };

  const answerQuiz = (ans: string) => {
    if (!quizType) return;
    setQuizAnswer(ans);
    const correctVal = quizType === "en-to-vi" ? words[currentIdx].meaningVi : words[currentIdx].word;
    const isCorrect = ans === correctVal;
    setScore(s => isCorrect ? { ...s, correct: s.correct + 1 } : { ...s, wrong: s.wrong + 1 });

    // Save progress
    try {
      const progStr = localStorage.getItem("vocab_progress_v1");
      const prog = progStr ? JSON.parse(progStr) : {};
      const wid = words[currentIdx].id;
      if (!prog[wid]) prog[wid] = { correct: 0, wrong: 0, mastered: false };
      if (isCorrect) prog[wid].correct += 1;
      else prog[wid].wrong += 1;
      if (prog[wid].correct - prog[wid].wrong >= 1) prog[wid].mastered = true;
      localStorage.setItem("vocab_progress_v1", JSON.stringify(prog));
    } catch(e) {}

    setTimeout(() => {
      if (currentIdx < words.length - 1) {
        const next = currentIdx + 1;
        setCurrentIdx(next);
        generateOptions(next, quizType);
      } else {
        setFinished(true);
      }
    }, 1200);
  };

  const playVoice = (text: string) => {
    window.speechSynthesis.cancel();
    const speech = new SpeechSynthesisUtterance(text);
    const voices = window.speechSynthesis.getVoices();
    const enVoice = voices.find(v => v.lang.startsWith("en"));
    if (enVoice) speech.voice = enVoice;
    speech.rate = 0.95;
    window.speechSynthesis.speak(speech);
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center h-screen bg-[#f0fdfa]" style={{ fontFamily: "'Sora', sans-serif" }}>
      <Loader2 className="w-12 h-12 animate-spin text-[#10b981]" />
      <p className="mt-4 text-[11px] font-black text-slate-400 uppercase tracking-[0.4em]">Đang tải bài kiểm tra...</p>
    </div>
  );

  if (words.length === 0) return (
    <div className="flex flex-col items-center justify-center h-screen bg-[#f0fdfa]" style={{ fontFamily: "'Sora', sans-serif" }}>
      <Trophy className="w-16 h-16 text-slate-200 mb-6" />
      <h2 className="text-2xl font-black text-slate-600 mb-2">Không có từ vựng</h2>
      <p className="text-slate-400 mb-8">Các chủ đề được chọn chưa có từ vựng nào.</p>
      <button onClick={() => router.push("/vocabulary")} className="px-8 py-3 bg-slate-900 text-white font-bold rounded-2xl">Quay lại</button>
    </div>
  );

  // ── RESULT SCREEN ──
  if (finished) {
    const pct = Math.round((score.correct / words.length) * 100);
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#f0fdfa] px-6" style={{ fontFamily: "'Sora', sans-serif" }}>
        <div className="w-full max-w-[520px] bg-white rounded-[32px] p-12 shadow-2xl text-center">
          <Trophy className="w-20 h-20 text-amber-500 mx-auto mb-8" />
          <h2 className="text-4xl font-black text-slate-800 mb-2">Hoàn thành!</h2>
          <p className="text-slate-400 mb-10">Bạn đã hoàn thành bài kiểm tra {words.length} từ vựng</p>
          <div className="grid grid-cols-3 gap-6 mb-10">
            <div className="p-4 rounded-2xl bg-emerald-50">
              <div className="text-3xl font-black text-emerald-600">{score.correct}</div>
              <div className="text-[10px] font-bold text-emerald-600/50 uppercase">Đúng</div>
            </div>
            <div className="p-4 rounded-2xl bg-red-50">
              <div className="text-3xl font-black text-red-500">{score.wrong}</div>
              <div className="text-[10px] font-bold text-red-500/50 uppercase">Sai</div>
            </div>
            <div className="p-4 rounded-2xl bg-amber-50">
              <div className="text-3xl font-black text-amber-600">{pct}%</div>
              <div className="text-[10px] font-bold text-amber-600/50 uppercase">Chính xác</div>
            </div>
          </div>
          <div className="flex gap-4">
            <button onClick={() => router.push("/vocabulary")} className="flex-1 py-4 bg-slate-100 text-slate-700 font-black rounded-2xl hover:bg-slate-200 transition-all">Quay lại</button>
            <button onClick={() => { setFinished(false); setQuizType(null); }} className="flex-1 py-4 bg-amber-500 text-white font-black rounded-2xl shadow-lg shadow-amber-500/30 hover:bg-amber-600 transition-all">Làm lại</button>
          </div>
        </div>
      </div>
    );
  }

  // ── QUIZ TYPE SELECTOR ──
  if (!quizType) return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#f0fdfa] px-6" style={{ fontFamily: "'Sora', sans-serif" }}>
      <button onClick={() => router.push("/vocabulary")} className="absolute top-8 left-8 w-12 h-12 rounded-xl bg-white border border-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-800 transition-all shadow-sm">
        <ArrowLeft size={20} />
      </button>
      <Trophy size={48} className="text-amber-500 mb-8" />
      <h1 className="text-4xl font-black text-slate-800 mb-4 text-center">Kiểm tra từ vựng</h1>
      <p className="text-slate-400 font-bold mb-2">{words.length} từ từ {topicIds.length} chủ đề</p>
      <p className="text-slate-300 text-sm mb-12">Hãy chọn chế độ bạn muốn</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full max-w-[600px]">
        <button onClick={() => startQuiz("en-to-vi")} className="bg-white rounded-[28px] p-8 border border-slate-100 hover:border-emerald-300 hover:shadow-xl transition-all group text-left">
          <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-500 flex items-center justify-center mb-4 group-hover:bg-emerald-500 group-hover:text-white transition-all">
            <Languages size={28} />
          </div>
          <h3 className="text-xl font-black text-slate-800">English → Tiếng Việt</h3>
          <p className="text-sm text-slate-400 mt-2">Nhìn từ tiếng Anh, chọn nghĩa tiếng Việt</p>
        </button>
        <button onClick={() => startQuiz("vi-to-en")} className="bg-white rounded-[28px] p-8 border border-slate-100 hover:border-amber-300 hover:shadow-xl transition-all group text-left">
          <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-500 flex items-center justify-center mb-4 group-hover:bg-amber-500 group-hover:text-white transition-all">
            <Zap size={28} />
          </div>
          <h3 className="text-xl font-black text-slate-800">Tiếng Việt → English</h3>
          <p className="text-sm text-slate-400 mt-2">Nhìn nghĩa tiếng Việt, chọn từ tiếng Anh</p>
        </button>
      </div>
    </div>
  );

  // ── QUIZ MODE ──
  const word = words[currentIdx];
  const correctVal = quizType === "en-to-vi" ? word.meaningVi : word.word;

  return (
    <div className="flex flex-col items-center min-h-screen bg-[#f0fdfa] px-6 pt-12" style={{ fontFamily: "'Sora', sans-serif" }}>
      <style>{`
        .quiz-opt { padding: 20px 24px; border-radius: 16px; border: 2px solid #f1f5f9; background: #ffffff; font-weight: 700; transition: all 0.2s; display: flex; align-items: center; gap: 16px; width: 100%; }
        .quiz-opt:hover:not(:disabled) { border-color: #10b981; background: #f0fdfa; transform: translateX(2px); }
        .quiz-opt.correct { border-color: #10b981; background: #f0fdfa; color: #059669; }
        .quiz-opt.wrong { border-color: #ef4444; background: #fef2f2; color: #dc2626; }
      `}</style>
      <div className="w-full max-w-[560px]">
        {/* Header */}
        <div className="flex items-center justify-between mb-16">
          <button onClick={() => router.push("/vocabulary")} className="w-12 h-12 rounded-xl bg-white border border-slate-100 flex items-center justify-center shadow-sm text-slate-400 hover:text-slate-800 transition-all">
            <ArrowLeft size={20} />
          </button>
          <div className="text-center">
            <div className="text-[10px] font-black text-slate-300 uppercase tracking-[0.4em] mb-2">{quizType === "en-to-vi" ? "En → Vi" : "Vi → En"} Quiz</div>
            <div className="flex items-center justify-center gap-3 px-4 py-1.5 rounded-full bg-slate-900 text-white text-xs font-black">{currentIdx + 1} / {words.length}</div>
          </div>
          <div className="w-12 h-12" />
        </div>

        {/* Question Card */}
        <div className="bg-white p-12 text-center mb-10 rounded-[32px] shadow-2xl border-b-[6px] border-emerald-500">
          <button onClick={() => quizType === "en-to-vi" && playVoice(word.word)} className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-500 flex items-center justify-center mx-auto mb-6 hover:scale-110 transition-transform">
            {quizType === "en-to-vi" ? <Volume2 size={24} /> : <Zap size={24} />}
          </button>
          <h2 className="text-5xl font-black text-slate-800 mb-4 tracking-tight">
            {quizType === "en-to-vi" ? word.word : word.meaningVi}
          </h2>
          {quizType === "en-to-vi" && (
            <div className="flex items-center justify-center gap-3 text-slate-300">
              <span className="text-sm font-bold italic">{word.pronunciation}</span>
            </div>
          )}
        </div>

        {/* Options */}
        <div className="grid grid-cols-1 gap-4 pb-20">
          {quizOptions.map((opt, i) => {
            const isSelected = quizAnswer === opt;
            const isCorrect = opt === correctVal;
            const statusClass = quizAnswer ? (isCorrect ? "correct" : (isSelected ? "wrong" : "")) : "";
            return (
              <button key={i} onClick={() => !quizAnswer && answerQuiz(opt)} disabled={!!quizAnswer} className={cn("quiz-opt shadow-sm group", statusClass)}>
                <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center text-xs font-black border transition-all",
                  !quizAnswer && "bg-slate-50 text-slate-300 border-slate-100",
                  statusClass === "correct" && "bg-emerald-500 text-white border-emerald-500 scale-110 shadow-lg shadow-emerald-500/30",
                  statusClass === "wrong" && "bg-red-500 text-white border-red-500",
                )}>{String.fromCharCode(65 + i)}</div>
                <span className="flex-1 text-base font-bold text-left ml-4">{opt}</span>
                {quizType === "vi-to-en" && (
                  <div onClick={(e) => { e.stopPropagation(); playVoice(opt); }} className="p-2 rounded-lg bg-slate-50 text-slate-400 hover:bg-emerald-50 hover:text-emerald-500 transition-all opacity-0 group-hover:opacity-100">
                    <Volume2 size={16} />
                  </div>
                )}
                {quizAnswer && isCorrect && <CheckCircle2 size={24} className="text-emerald-500 ml-2" />}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
