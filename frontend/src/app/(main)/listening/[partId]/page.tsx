"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { 
  ArrowLeft, Headphones, Loader2, ChevronRight, CheckCircle2, 
  XCircle, Play, Volume2, Award, Info, BookOpen 
} from "lucide-react";
import { API_BASE_URL, TOEIC_PARTS } from "@/lib/constants";
import { cn } from "@/lib/utils";

interface Question {
  id: string;
  content: string;
  options: string[];
  answer: string;
  explanation: string;
  passage?: string;
  image?: string;
  audioUrl?: string;
}

export default function ListeningPartPage() {
  const { partId } = useParams();
  const router = useRouter();
  const pid = String(partId).toUpperCase();
  const partInfo = TOEIC_PARTS.find((p) => p.id === pid);

  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);

  useEffect(() => {
    fetch(`${API_BASE_URL}/questions?part=${pid}&limit=10`)
      .then((r) => r.json())
      .then((d) => {
        if (d.success) setQuestions(d.data.items);
      })
      .finally(() => setLoading(false));
  }, [pid]);

  // Cleanup audio on unmount
  useEffect(() => {
    return () => {
      audio?.pause();
      if (audio) audio.src = "";
    };
  }, [audio]);

  const toggleAudio = () => {
    const audioUrl = questions[0]?.audioUrl;
    if (!audioUrl) return;

    if (isPlaying) {
      audio?.pause();
      setIsPlaying(false);
    } else {
      if (!audio || audio.src !== audioUrl) {
        const newAudio = new Audio(audioUrl);
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

  const handleCheck = () => {
    audio?.pause();
    setIsPlaying(false);
    let currentScore = 0;
    questions.forEach((q) => {
      if (selectedAnswers[q.id] === q.answer) currentScore++;
    });
    setScore(currentScore);
    setShowResults(true);
  };

  if (loading)
    return (
      <div className="flex flex-col items-center justify-center h-[70vh] ma-light">
        <Loader2 className="w-10 h-10 animate-spin text-[#00c9a7]" />
        <p className="mt-4 text-xs font-bold text-slate-400 capitalize tracking-widest">Đang tải luyện tập...</p>
      </div>
    );

  if (questions.length === 0)
    return (
      <div className="min-h-screen ma-light flex items-center justify-center px-6">
        <div className="ma-card-light p-10 text-center max-w-sm w-full">
           <div className="text-5xl mb-6">🚧</div>
           <h2 className="ma-title-light text-xl mb-3">{partInfo?.nameVi || pid}</h2>
           <p className="text-xs mb-8 text-slate-400 leading-relaxed italic">Phần này hiện đang được cập nhật nội dung. Vui lòng quay lại sau!</p>
           <button onClick={() => router.back()} className="ma-btn-submit">
              <ArrowLeft size={16} className="mr-2" /> Quay lại
           </button>
        </div>
      </div>
    );

  const isListening = partInfo?.section === "LISTENING";

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
        .ma-audio-box-light { background:#fdfdfd; border:1px solid #f1f5f9; border-radius:20px; padding:24px 32px; text-align:left; position:relative; overflow:hidden; margin-bottom:30px; display:flex; align-items:center; gap:16px; }
        .ma-wave-light { width:3px; height:10px; background:#00c9a7; border-radius:10px; animation:wave-anim 1s ease-in-out infinite; opacity:0.6; }
        @keyframes wave-anim { 0%,100%{height:8px;opacity:.4} 50%{height:20px;opacity:1} }
        .ma-opt-chip-light { padding:12px; border-radius:12px; border:1px solid #f1f5f9; background:#ffffff; text-align:center; font-size:13px; font-weight:700; color:#64748b; transition:all .2s ease; cursor:pointer; }
        .ma-opt-chip-light:hover:not(:disabled) { border-color:#00c9a7; background:#f0fdfa; }
        .ma-opt-chip-light.active { background:#00c9a7; color:#ffffff; border-color:#00c9a7; box-shadow:0 4px 12px rgba(0,201,167,0.2); }
        .ma-opt-chip-light.correct { background:#4ade80; color:#ffffff; border-color:#4ade80; }
        .ma-opt-chip-light.wrong { background:#f87171; color:#ffffff; border-color:#f87171; }
        .ma-btn-submit { width:100%; padding:18px; border-radius:18px; background:#0f172a; color:#ffffff; font-size:15px; font-weight:700; border:none; cursor:pointer; display:flex; align-items:center; justify-content:center; gap:8px; }
        .ma-btn-jade-light { width:100%; padding:18px; border-radius:18px; background:linear-gradient(135deg, #00c9a7, #00a589); color:#ffffff; font-size:15px; font-weight:700; border:none; cursor:pointer; display:flex; align-items:center; justify-content:center; gap:8px; }
        .ma-prog-track { height:5px; background:#f1f5f9; border-radius:99px; overflow:hidden; }
        .ma-prog-fill { height:100%; background:#00c9a7; transition:width .6s ease; }
        .ma-badge-light { background:#f0fdfa; color:#0d9488; padding:3px 10px; border-radius:6px; font-size:10px; font-weight:800; border:1px solid #ccfbf1; }
      `}</style>

      <div className="ma-light px-6">
        <div className="ma-container">
           {/* Navigation */}
           <div className="flex items-center justify-between mb-8 ma-fade-up">
              <button onClick={() => router.back()} className="w-10 h-10 rounded-full border border-slate-100 flex items-center justify-center hover:bg-white transition-colors bg-slate-50/50">
                 <ArrowLeft size={18} className="text-slate-400" />
              </button>
              <div className="ma-badge-light uppercase tracking-widest">{pid} PRACTICE</div>
           </div>

           {/* Header */}
           <div className="text-center mb-10 ma-fade-up">
              <h1 className="ma-title-light">{partInfo?.nameVi || pid}</h1>
              <p className="text-sm text-slate-400 max-w-[280px] mx-auto italic">Luyện tập tập trung cho phần thi {pid}.</p>
           </div>

           {/* Audio Box if applicable */}
           <div className="ma-card-light ma-fade-up">
              {isListening && (
                <div className="ma-audio-box-light">
                   <button 
                    onClick={toggleAudio}
                    className="w-10 h-10 rounded-full bg-[#00c9a7] text-white flex items-center justify-center flex-shrink-0"
                   >
                      {isPlaying ? (
                        <div className="flex gap-0.5">
                          <div className="w-1 h-4 bg-white rounded-full"></div>
                          <div className="w-1 h-4 bg-white rounded-full"></div>
                        </div>
                      ) : (
                        <Play size={18} fill="currentColor" />
                      )}
                   </button>
                   <div className="flex-1">
                      <div className="text-[10px] font-bold text-slate-300 uppercase tracking-widest mb-1">
                        {isPlaying ? "Phát hành bài nghe..." : "Sẵn sàng phát âm thanh"}
                      </div>
                      <div className="flex gap-1">
                         {[1,2,3,4,5,6,7,8].map(v => (
                            <div 
                              key={v} 
                              className="ma-wave-light" 
                              style={{ 
                                animationDelay: `${v * 0.1}s`,
                                animationPlayState: isPlaying ? 'running' : 'paused'
                              }} 
                            />
                         ))}
                      </div>
                   </div>
                   <div className={cn(
                    "text-[10px] font-bold uppercase transition-colors",
                    isPlaying ? "text-emerald-500" : "text-slate-300"
                   )}>
                    {isPlaying ? "Playing" : "Paused"}
                   </div>
                </div>
              )}

              {/* Questions List */}
              <div className="space-y-12 mb-10">
                 {questions.map((q, qIdx) => (
                    <div key={q.id} className="relative pl-8 border-l-2 border-slate-50 ma-fade-up" style={{ animationDelay: `${0.1 + qIdx * 0.1}s` }}>
                       <div className="absolute left-[-11px] top-0 w-5 h-5 rounded-md bg-slate-100 border border-slate-200 flex items-center justify-center text-[10px] font-bold text-slate-400">
                          {qIdx + 1}
                       </div>
                       <h3 className="text-sm font-bold text-slate-700 mb-4 leading-relaxed">
                          {q.content}
                       </h3>

                       <div className="grid grid-cols-2 gap-3">
                          {q.options.map((opt, i) => {
                             const letter = ["A", "B", "C", "D"][i];
                             const isSelected = selectedAnswers[q.id] === letter;
                             const isCorrect = showResults && letter === q.answer;
                             const isWrong = showResults && isSelected && !isCorrect;

                             return (
                                <button
                                   key={i}
                                   disabled={showResults}
                                   onClick={() => setSelectedAnswers(prev => ({ ...prev, [q.id]: letter }))}
                                   className={cn(
                                      "ma-opt-chip-light",
                                      isSelected && !showResults && "active",
                                      isCorrect && "correct",
                                      isWrong && "wrong"
                                   )}
                                >
                                   <span className="opacity-40 mr-1.5">{letter}.</span>
                                   {opt}
                                </button>
                             );
                          })}
                       </div>

                       {showResults && (
                          <div className="mt-4 p-4 rounded-xl bg-slate-50 border border-slate-100 flex gap-3 ma-fade-up">
                             <Info size={14} className="text-slate-300 mt-0.5 flex-shrink-0" />
                             <p className="text-[11px] text-slate-400 leading-relaxed italic">
                                <strong>Giải thích:</strong> {q.explanation || "Nội dung này dựa trên bài nghe."}
                             </p>
                          </div>
                       )}
                    </div>
                 ))}
              </div>

              {/* Action */}
              <div className="mt-4">
                 {!showResults ? (
                    <button 
                       onClick={handleCheck}
                       disabled={Object.keys(selectedAnswers).length < questions.length}
                       className="ma-btn-submit"
                    >
                       Gửi bài & Xem kết quả <ChevronRight size={18} />
                    </button>
                 ) : (
                    <div className="flex flex-col items-center gap-6">
                       <div className="w-full p-6 bg-emerald-50 rounded-2xl border border-emerald-100 text-center">
                          <div className="text-xs font-bold text-emerald-600 uppercase mb-2">Kết quả luyện tập</div>
                          <div className="text-3xl font-black text-slate-800 tracking-tighter">{score} / {questions.length}</div>
                       </div>
                       <button onClick={() => window.location.reload()} className="ma-btn-jade-light">
                          Luyện tập lại
                       </button>
                    </div>
                 )}
              </div>
           </div>
           
           <p className="text-center text-[10px] text-slate-300 mt-12 uppercase tracking-[0.2em] font-medium">Standard Assessment Interface</p>
        </div>
      </div>
    </>
  );
}
