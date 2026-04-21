"use client";

import { useState, useEffect } from "react";
import { Loader2, CheckCircle2, XCircle, Headphones, ChevronRight, Info, Award, Play, Volume2, ArrowLeft } from "lucide-react";
import { API_BASE_URL, TOEIC_PARTS } from "@/lib/constants";
import { cn } from "@/lib/utils";
import Link from "next/link";

interface Question {
  id: string;
  content: string;
  options: string[];
  difficulty: string;
  audioUrl?: string;
}

export default function ListeningPart1Page() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [correctAnswer, setCorrectAnswer] = useState("");
  const [explanation, setExplanation] = useState("");
  const [score, setScore] = useState({ correct: 0, total: 0 });
  const [isPlaying, setIsPlaying] = useState(false);
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);

  const partInfo = TOEIC_PARTS.find((p) => p.id === "PART1");
  const letters = ["A", "B", "C", "D"];

  useEffect(() => {
    fetch(`${API_BASE_URL}/questions?part=PART1&limit=5`)
      .then((r) => r.json())
      .then((d) => {
        if (d.success) setQuestions(d.data.items);
      })
      .finally(() => setLoading(false));
  }, []);

  // Cleanup audio on unmount
  useEffect(() => {
    return () => {
      audio?.pause();
      if (audio) audio.src = "";
    };
  }, [audio]);

  const toggleAudio = () => {
    if (!questions[currentIdx]?.audioUrl) return;

    if (isPlaying) {
      audio?.pause();
      setIsPlaying(false);
    } else {
      if (!audio || audio.src !== questions[currentIdx].audioUrl) {
        const newAudio = new Audio(questions[currentIdx].audioUrl);
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
    audio?.pause();
    setIsPlaying(false);
    setCurrentIdx((i) => i + 1);
    setSelected(null);
    setShowAnswer(false);
    setCorrectAnswer("");
    setExplanation("");
  };

  if (loading)
    return (
      <div className="flex flex-col items-center justify-center h-[70vh] ma-light">
        <Loader2 className="w-10 h-10 animate-spin text-[#00c9a7]" />
        <p className="mt-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Đang tải...</p>
      </div>
    );

  const q = questions[currentIdx];
  if (!q)
    return (
      <div className="flex items-center justify-center min-h-[60vh] ma-light px-6">
        <div className="ma-card-light p-10 text-center max-w-sm w-full">
           <Info className="w-12 h-12 mx-auto mb-4 text-slate-200" />
           <p className="text-slate-400 font-medium italic">Không có dữ liệu cho phần này.</p>
        </div>
      </div>
    );

  const progress = ((currentIdx + 1) / questions.length) * 100;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700;800&family=Lora:ital,wght@0,700;1,600&display=swap');

        .ma-light { font-family:'Sora',sans-serif; background:#f8fafc; color:#334155; min-height:100vh; }

        @keyframes ma-fade-up {
          from { opacity:0; transform:translateY(12px); }
          to   { opacity:1; transform:translateY(0); }
        }
        .ma-fade-up { animation:ma-fade-up .4s ease-out both; }

        /* Compact Centered Container */
        .ma-container {
           max-width: 580px;
           margin: 0 auto;
           padding-top: 40px;
           padding-bottom: 60px;
        }

        /* Card Light Style */
        .ma-card-light {
           background: #ffffff;
           border-radius: 24px;
           box-shadow: 0 10px 30px -10px rgba(0,0,0,0.04), 0 2px 5px rgba(0,0,0,0.02);
           border: 1px solid #f1f5f9;
           overflow: hidden;
        }

        .ma-title-light {
           font-family:'Lora',serif; font-size:28px; font-weight:700; color:#0f172a; margin-bottom:4px;
        }

        /* Audio Box Light */
        .ma-audio-box-light {
           background: #fdfdfd;
           border: 1px solid #f1f5f9;
           border-radius: 20px;
           padding: 28px;
           margin-bottom: 30px;
           text-align: center;
        }
        .ma-wave-light {
           width:4px; border-radius:10px; background:#00c9a7;
           animation:wave-anim 1s ease-in-out infinite; opacity: 0.6;
        }
        @keyframes wave-anim {
          0%, 100% { height: 10px; opacity: 0.4; }
          50% { height: 35px; opacity: 1; }
        }

        /* Option Buttons Light */
        .ma-opt-btn-light {
          width:100%; text-align:left; padding:16px 20px; border-radius:16px;
          display:flex; align-items:center; gap:16px; transition:all .2s ease;
          border: 1px solid #f1f5f9;
          background: #ffffff;
          margin-bottom: 12px;
          cursor:pointer;
          color: #475569;
        }
        .ma-opt-btn-light:hover:not(:disabled) {
          border-color: #00c9a7;
          background: #f0fdfa;
        }
        .ma-opt-btn-light.is-selected {
          border-color: #00c9a7;
          background: #f0fdfa;
          border-width: 2px;
        }
        .ma-opt-btn-light.is-correct { border-color:#4ade80; background:#f0fdf4; border-width: 2px; }
        .ma-opt-btn-light.is-wrong { border-color:#f87171; background:#fef2f2; border-width: 2px; }

        .ma-opt-idx {
          width:34px; height:34px; border-radius:10px;
          display:flex; align-items:center; justify-content:center;
          font-size:13px; font-weight:800;
          background:#f8fafc; color:#94a3b8;
          transition:all .2s ease;
        }
        .ma-opt-btn-light.is-selected .ma-opt-idx { background:#00c9a7; color:#ffffff; }

        /* Progress Mini Light */
        .ma-prog-track { height:5px; background:#f1f5f9; border-radius:99px; overflow:hidden; }
        .ma-prog-fill { height:100%; background:#00c9a7; transition:width .6s ease; }
        
        .ma-score-mini {
           background: #f0fdfa; color: #0f766e;
           padding: 4px 12px; border-radius: 99px; font-size: 11px; font-weight: 700;
           border: 1px solid #ccfbf1;
        }

        .ma-btn-submit {
           width:100%; padding: 18px; border-radius: 18px;
           background: #0f172a; color: #ffffff;
           font-size: 15px; font-weight: 700;
           transition: all .2s; border: none; cursor: pointer;
           box-shadow: 0 10px 20px -5px rgba(15, 23, 42, 0.2);
           display: flex; align-items: center; justify-content: center; gap: 8px;
        }
        .ma-btn-submit:hover:not(:disabled) { transform: translateY(-1px); background: #1e293b; }
        .ma-btn-submit:disabled { opacity: 0.15; cursor: not-allowed; }

        .ma-btn-jade-light {
           width:100%; padding: 18px; border-radius: 18px;
           background: linear-gradient(135deg, #00c9a7, #00a589);
           color: #ffffff; font-size: 15px; font-weight: 700;
           border: none; cursor: pointer;
           box-shadow: 0 10px 20px -5px rgba(0, 201, 167, 0.3);
           display: flex; align-items: center; justify-content: center; gap: 8px;
        }
      `}</style>

      <div className="ma-light">
        <div className="ma-container px-6">
           
           {/* Navigation */}
           <div className="flex items-center justify-between mb-8 ma-fade-up" style={{ animationDelay: '0s' }}>
              <Link href="/listening" className="w-10 h-10 rounded-full border border-slate-100 flex items-center justify-center hover:bg-white transition-colors bg-slate-50/50">
                 <ArrowLeft size={18} className="text-slate-400" />
              </Link>
              <div className="ma-score-mini flex items-center gap-2">
                 <Award size={14} /> Điểm: {score.correct}/{score.total}
              </div>
           </div>

           {/* Header Section */}
           <div className="text-center mb-10 ma-fade-up" style={{ animationDelay: '0.1s' }}>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-600 text-[10px] font-bold uppercase tracking-wider mb-3">
                 Listening Part 1
              </div>
              <h1 className="ma-title-light">{partInfo?.nameVi || "Mô tả tranh"}</h1>
              <p className="text-sm text-slate-400 max-w-[280px] mx-auto">Chọn đáp án mô tả đúng nhất hình ảnh bạn đang quan sát.</p>
           </div>

           {/* Progress */}
           <div className="mb-8 ma-fade-up" style={{ animationDelay: '0.15s' }}>
              <div className="flex justify-between items-center mb-2">
                 <span className="text-[10px] font-bold text-slate-300 uppercase">Tiến độ luyện tập</span>
                 <span className="text-[10px] font-bold text-slate-400">{currentIdx + 1} / {questions.length}</span>
              </div>
              <div className="ma-prog-track">
                 <div className="ma-prog-fill" style={{ width: `${progress}%` }} />
              </div>
           </div>

           {/* Main Practice Card */}
           <div className="ma-card-light p-6 lg:p-8 ma-fade-up" style={{ animationDelay: '0.2s' }}>
              
              {/* Audio visualizer area */}
              <div className="ma-audio-box-light">
                 <div className="flex items-center justify-center gap-1.5 h-8 mb-5">
                    {[0.3, 0.7, 0.4, 0.9, 0.6, 1, 0.5, 0.8, 0.3].map((v, i) => (
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
                  className="w-14 h-14 rounded-full bg-[#00c9a7] text-white flex items-center justify-center mx-auto shadow-lg shadow-emerald-200 hover:scale-105 transition-transform mb-4"
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

              {/* Options */}
              <div className="space-y-3 mb-10">
                 {letters.map((letter, i) => {
                    const optText = q.options[i];
                    const isSel = selected === letter;
                    const isCorrect = showAnswer && letter === correctAnswer;
                    const isWrong = showAnswer && isSel && letter !== correctAnswer;

                    return (
                       <button
                          key={i}
                          disabled={showAnswer}
                          onClick={() => setSelected(letter)}
                          className={cn(
                             "ma-opt-btn-light",
                             isSel && !showAnswer && "is-selected",
                             isCorrect && "is-correct",
                             isWrong && "is-wrong"
                          )}
                       >
                          <span className="ma-opt-idx">{letter}</span>
                          <span className="text-sm font-medium">{optText}</span>
                          {isCorrect && <CheckCircle2 className="text-emerald-500 ml-auto" size={18} />}
                          {isWrong && <XCircle className="text-red-500 ml-auto" size={18} />}
                       </button>
                    );
                 })}
              </div>

              {/* Explanation section if answered */}
              {showAnswer && (
                 <div className="p-5 rounded-2xl bg-blue-50/50 border border-blue-100/50 mb-10 flex gap-4 ma-fade-up">
                    <Info size={16} className="text-blue-400 mt-1 flex-shrink-0" />
                    <div>
                       <div className="text-[10px] font-bold text-blue-500 uppercase tracking-widest mb-1">Giải thích</div>
                       <p className="text-sm text-slate-500 leading-relaxed italic">{explanation || "Câu này yêu cầu bạn nhận diện đúng hành động trong tranh."}</p>
                    </div>
                 </div>
              )}

              {/* Action area */}
              <div className="mt-4">
                 {!showAnswer ? (
                    <button 
                       onClick={check} 
                       disabled={!selected} 
                       className="ma-btn-submit"
                    >
                       Kiểm tra đáp án <ChevronRight size={18} />
                    </button>
                 ) : (
                    currentIdx < questions.length - 1 ? (
                       <button onClick={next} className="ma-btn-jade-light">
                          Câu tiếp theo <ChevronRight size={18} />
                       </button>
                    ) : (
                       <div className="text-center py-4">
                          <div className="text-[10px] font-bold text-emerald-600 uppercase mb-2">Hoàn thành</div>
                          <Link href="/listening" className="text-sm font-bold border-b border-slate-200 text-slate-400 hover:text-emerald-500 hover:border-emerald-500 transition-all">
                             Quay lại danh sách
                          </Link>
                       </div>
                    )
                 )}
              </div>
           </div>

           {/* Footer Footer */}
           <p className="text-center text-[10px] text-slate-300 mt-12 uppercase tracking-[0.2em] font-medium">Focused Learning Mode</p>
        </div>
      </div>
    </>
  );
}
