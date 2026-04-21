"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, CheckCircle2, XCircle, ChevronRight, Award, Play, Info } from "lucide-react";
import { apiFetch } from "@/lib/auth";
import { cn } from "@/lib/utils";

interface Question {
  id: string;
  content: string;
  options: string[];
  difficulty: string;
  audioUrl?: string;
}

export default function ListeningPart2Page() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [checked, setChecked] = useState(false);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(true);
  const [correctAnswer, setCorrectAnswer] = useState("");
  const [explanation, setExplanation] = useState("");
  const [isPlaying, setIsPlaying] = useState(false);
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);

  useEffect(() => {
    apiFetch("/questions?part=PART2&limit=10")
      .then((d) => {
        setQuestions(d.data?.items || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  // Cleanup audio on unmount
  useEffect(() => {
    return () => {
      audio?.pause();
      if (audio) audio.src = "";
    };
  }, [audio]);

  const q = questions[current];
  const opts = ["A", "B", "C"];

  const toggleAudio = () => {
    if (!q?.audioUrl) return;

    if (isPlaying) {
      audio?.pause();
      setIsPlaying(false);
    } else {
      if (!audio || audio.src !== q.audioUrl) {
        const newAudio = new Audio(q.audioUrl);
        newAudio.onended = () => setIsPlaying(false);
        setAudio(newAudio);
        newAudio.play();
        setIsPlaying(true);
      } else {
        audio.play();
        setIsPlaying(true);
      }
    }
  };

  async function handleCheck() {
    if (!selected || !q) return;
    
    // Fetch correct answer
    const res = await apiFetch(`/questions/${q.id}?showAnswer=true`);
    const d = await res.json();
    
    if (d.success) {
      const actualAnswer = d.data.answer;
      setCorrectAnswer(actualAnswer);
      setExplanation(d.data.explanation || "");
      setChecked(true);
      if (selected === actualAnswer) setScore((s) => s + 1);
    }
  }

  function handleNext() {
    audio?.pause();
    setIsPlaying(false);
    if (current + 1 >= questions.length) {
      setDone(true);
    } else {
      setCurrent((c) => c + 1);
      setSelected(null);
      setChecked(false);
      setCorrectAnswer("");
      setExplanation("");
    }
  }

  if (loading)
    return (
      <div className="flex flex-col items-center justify-center h-[70vh] ma-light">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="40"
          height="40"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#00c9a7"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="animate-spin"
        >
          <path d="M21 12a9 9 0 1 1-6.219-8.56" />
        </svg>
        <p className="mt-4 text-xs font-bold text-slate-400 capitalize tracking-widest">Đang tải câu hỏi...</p>
      </div>
    );

  if (done)
    return (
      <div className="min-h-screen ma-light flex items-center justify-center px-6">
        <div className="ma-card-light p-12 text-center max-w-sm w-full ma-fade-up">
           <div className="text-6xl mb-6">🎉</div>
           <h2 className="ma-title-light text-2xl mb-4">Hoàn thành!</h2>
           <p className="text-lg mb-8 text-slate-400">Kết quả: <strong className="text-emerald-500">{score}/{questions.length}</strong></p>
           <div className="grid gap-3">
              <button 
                 onClick={() => { setCurrent(0); setScore(0); setDone(false); setSelected(null); setChecked(false); setCorrectAnswer(""); setExplanation(""); }} 
                 className="ma-btn-jade-light"
              >
                 Luyện lại
              </button>
              <Link href="/listening" className="h-14 px-8 rounded-2xl bg-slate-100 text-slate-600 font-bold flex items-center justify-center hover:bg-slate-200 transition-colors">
                 Quay lại
              </Link>
           </div>
        </div>
      </div>
    );

  if (!q)
    return (
      <div className="min-h-screen ma-light flex items-center justify-center px-6">
        <div className="ma-card-light p-10 text-center max-w-sm w-full">
           <div className="text-5xl mb-6">🎧</div>
           <h2 className="ma-title-light text-xl mb-6">Part 2: Hỏi - Đáp</h2>
           <Link href="/listening" className="ma-btn-submit">
              <ArrowLeft size={16} className="mr-2" /> Quay lại
           </Link>
        </div>
      </div>
    );

  const progress = ((current + 1) / questions.length) * 100;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700;800&family=Lora:ital,wght@0,700;1,600&display=swap');
        .ma-light { font-family:'Sora',sans-serif; background:#f8fafc; color:#334155; min-height:100vh; }
        @keyframes ma-fade-up { from { opacity:0; transform:translateY(12px); } to { opacity:1; transform:translateY(0); } }
        .ma-fade-up { animation:ma-fade-up .4s ease-out both; }
        .ma-container { max-width: 580px; margin: 0 auto; padding-top: 40px; padding-bottom: 60px; }
        .ma-card-light { background: #ffffff; border-radius: 24px; box-shadow: 0 10px 30px -10px rgba(0,0,0,0.04), 0 2px 5px rgba(0,0,0,0.02); border: 1px solid #f1f5f9; padding: 24px; }
        .ma-title-light { font-family:'Lora',serif; font-size:28px; font-weight:700; color:#0f172a; margin-bottom:4px; }
        .ma-audio-box-light { background:#fdfdfd; border:1px solid #f1f5f9; border-radius:20px; padding:28px; text-align:center; position:relative; overflow:hidden; margin-bottom:30px; }
        .ma-wave-light { width:4px; border-radius:10px; background:#00c9a7; animation:wave-anim 1s ease-in-out infinite; opacity:0.6; }
        @keyframes wave-anim { 0%,100%{height:10px;opacity:.4} 50%{height:35px;opacity:1} }
        .ma-opt-btn-light { width:100%; text-align:left; padding:16px 20px; border-radius:16px; display:flex; align-items:center; gap:16px; transition:all .2s ease; border: 1px solid #f1f5f9; background:#ffffff; margin-bottom:12px; cursor:pointer; color:#475569; }
        .ma-opt-btn-light:hover:not(:disabled) { border-color:#00c9a7; background:#f0fdfa; }
        .ma-opt-btn-light.is-selected { border-color:#00c9a7; background:#f0fdfa; border-width:2px; }
        .ma-opt-btn-light.is-correct { border-color:#4ade80; background:#f0fdf4; border-width:2px; }
        .ma-opt-btn-light.is-wrong { border-color:#f87171; background:#fef2f2; border-width:2px; }
        .ma-opt-idx { width:34px; height:34px; border-radius:10px; display:flex; align-items:center; justify-content:center; font-size:13px; font-weight:800; background:#f8fafc; color:#94a3b8; }
        .ma-opt-btn-light.is-selected .ma-opt-idx { background:#00c9a7; color:#ffffff; }
        .ma-btn-submit { width:100%; padding:18px; border-radius:18px; background:#0f172a; color:#ffffff; font-size:15px; font-weight:700; border:none; cursor:pointer; display:flex; align-items:center; justify-content:center; gap:8px; }
        .ma-btn-jade-light { width:100%; padding:18px; border-radius:18px; background:linear-gradient(135deg, #00c9a7, #00a589); color:#ffffff; font-size:15px; font-weight:700; border:none; cursor:pointer; display:flex; align-items:center; justify-content:center; gap:8px; }
        .ma-prog-track { height:5px; background:#f1f5f9; border-radius:99px; overflow:hidden; }
        .ma-prog-fill { height:100%; background:#00c9a7; transition:width .6s ease; }
      `}</style>

      <div className="ma-light">
        <div className="ma-container px-6">
           <div className="flex items-center justify-between mb-8 ma-fade-up">
              <Link href="/listening" className="w-10 h-10 rounded-full border border-slate-100 flex items-center justify-center hover:bg-white transition-colors bg-slate-50/50">
                 <ArrowLeft size={18} className="text-slate-400" />
              </Link>
           </div>

           <div className="text-center mb-10 ma-fade-up">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-600 text-[10px] font-bold uppercase tracking-wider mb-3">
                 Listening Part 2
              </div>
              <h1 className="ma-title-light">Part 2: Hỏi - Đáp</h1>
              <p className="text-sm text-slate-400 max-w-[280px] mx-auto">Chọn câu trả lời phù hợp nhất cho câu hỏi bạn nghe được.</p>
           </div>

           <div className="mb-8 ma-fade-up">
              <div className="flex justify-between items-center mb-2 text-[10px] font-bold text-slate-400">
                 <span>Tiến độ</span>
                 <span>{current + 1} / {questions.length}</span>
              </div>
              <div className="ma-prog-track">
                 <div className="ma-prog-fill" style={{ width: `${progress}%` }} />
              </div>
           </div>

           <div className="ma-card-light ma-fade-up">
              <div className="ma-audio-box-light">
                 <div className="flex items-center justify-center gap-1.5 h-8 mb-5">
                    {[0.4, 0.9, 0.6, 1, 0.5, 0.8, 0.3].map((v, i) => (
                       <div 
                        key={i} 
                        className="ma-wave-light" 
                        style={{ 
                          height: `${v * 100}%`, 
                          animationDelay: `${i * 0.1}s`,
                          animationPlayState: isPlaying ? 'running' : 'paused'
                        }} 
                      />
                    ))}
                 </div>
                 <button 
                  onClick={toggleAudio}
                  className="w-14 h-14 rounded-full bg-[#00c9a7] text-white flex items-center justify-center mx-auto shadow-lg shadow-emerald-200 mb-4"
                 >
                    {isPlaying ? (
                      <div className="flex gap-1">
                        <div className="w-1.5 h-6 bg-white rounded-full"></div>
                        <div className="w-1.5 h-6 bg-white rounded-full"></div>
                      </div>
                    ) : (
                      <Play size={22} fill="currentColor" />
                    )}
                 </button>
                 <div className="text-xs font-bold text-slate-400 uppercase tracking-widest px-4 py-2 border border-slate-50 inline-block rounded-lg balance">
                    {isPlaying ? "Đang phát âm thanh..." : "Sẵn sàng phát âm thanh"}
                 </div>
              </div>

              <div className="space-y-3 mb-10">
                 {opts.map((letter, i) => {
                    const isSelected = letter === selected;
                    const isCorrect = checked && letter === correctAnswer;
                    const isWrong = checked && isSelected && letter !== correctAnswer;

                    return (
                       <button
                          key={i}
                          disabled={checked}
                          onClick={() => setSelected(letter)}
                          className={cn(
                             "ma-opt-btn-light",
                             isSelected && !checked && "is-selected",
                             isCorrect && "is-correct",
                             isWrong && "is-wrong"
                          )}
                       >
                          <span className="ma-opt-idx">{letter}</span>
                          <span className="text-sm font-medium">{q.options[i]}</span>
                          {isCorrect && <CheckCircle2 className="text-emerald-500 ml-auto" size={18} />}
                          {isWrong && <XCircle className="text-red-500 ml-auto" size={18} />}
                       </button>
                    );
                 })}
              </div>

              {checked && explanation && (
                <div className="p-5 rounded-2xl bg-blue-50/50 border border-blue-100/50 mb-10 flex gap-4 ma-fade-up">
                  <Info size={16} className="text-blue-400 mt-1 flex-shrink-0" />
                  <p className="text-xs text-slate-500 leading-relaxed italic">{explanation}</p>
                </div>
              )}

              <button 
                 onClick={!checked ? handleCheck : handleNext} 
                 disabled={!selected && !checked}
                 className={!checked ? "ma-btn-submit" : "ma-btn-jade-light"}
              >
                 {!checked ? "Kiểm tra đáp án" : "Câu tiếp theo"} <ChevronRight size={18} />
              </button>
           </div>
        </div>
      </div>
    </>
  );
}
