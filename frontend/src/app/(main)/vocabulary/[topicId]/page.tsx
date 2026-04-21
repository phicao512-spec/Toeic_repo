"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { 
  ArrowLeft, Volume2, RotateCcw, Check, X, Loader2, 
  ChevronLeft, ChevronRight, Info, BookOpen, Layers, 
  Zap, CheckCircle2, Play, LayoutList, Trophy, Settings2,
  Headphones, Sparkles, Star, Mic2, MousePointer2, Award,
  Volume1, Languages, MoveRight, Plus, Pencil, Trash2, Save
} from "lucide-react";
import { API_BASE_URL } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

interface Word {
  id: string; word: string; pronunciation: string; partOfSpeech: string;
  meaningVi: string; meaningEn: string; example: string; exampleVi: string;
}

type QuizType = "en-to-vi" | "vi-to-en";

export default function VocabTopicPage() {
  const { topicId } = useParams();
  const router = useRouter();
  const [words, setWords] = useState<Word[]>([]);
  const [topicName, setTopicName] = useState("");
  const [loading, setLoading] = useState(true);
  const [mode, setMode] = useState<"list" | "flashcard" | "quiz" | "quiz-select">("list");
  const [quizType, setQuizType] = useState<QuizType>("en-to-vi");
  const [currentIdx, setCurrentIdx] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [score, setScore] = useState({ correct: 0, wrong: 0 });
  const [quizAnswer, setQuizAnswer] = useState<string | null>(null);
  const [quizOptions, setQuizOptions] = useState<string[]>([]);
  
  // Management States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingWord, setEditingWord] = useState<Word | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    word: "", pronunciation: "", partOfSpeech: "n",
    meaningVi: "", meaningEn: "", example: "", exampleVi: ""
  });

  // Voice Selection State
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoiceName, setSelectedVoiceName] = useState<string>("");
  const [progressData, setProgressData] = useState<Record<string, { correct: number, wrong: number, mastered: boolean }>>({});

  const fetchData = async () => {
    try {
      const r = await fetch(`${API_BASE_URL}/vocab/topics/${topicId}/words`);
      const d = await r.json();
      if (d.success) {
        setWords(d.data.words);
        setTopicName(d.data.topic.nameVi);
      }
    } catch (error) { console.error(error); }
    finally { setLoading(false); }
  };

  useEffect(() => {
    const loadVoices = () => {
      const availableVoices = window.speechSynthesis.getVoices();
      const enVoices = availableVoices.filter(v => v.lang.startsWith('en'));
      setVoices(enVoices.length > 0 ? enVoices : availableVoices);
      
      const savedVoice = localStorage.getItem("vocab_voice_pref");
      if (savedVoice && availableVoices.some(v => v.name === savedVoice)) {
        setSelectedVoiceName(savedVoice);
      } else if (enVoices.length > 0) {
        setSelectedVoiceName(enVoices[0].name);
      }
    };

    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;
    fetchData();
    
    try {
      const prog = localStorage.getItem("vocab_progress_v1");
      if (prog) setProgressData(JSON.parse(prog));
    } catch(e) {}
      
    return () => { window.speechSynthesis.cancel(); };
  }, [topicId]);

  const handleVoiceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const name = e.target.value;
    setSelectedVoiceName(name);
    localStorage.setItem("vocab_voice_pref", name);
  };

  const playVoice = (text: string) => {
    window.speechSynthesis.cancel();
    const speech = new SpeechSynthesisUtterance(text);
    const voice = voices.find(v => v.name === selectedVoiceName);
    if (voice) speech.voice = voice;
    speech.rate = 0.95;
    window.speechSynthesis.speak(speech);
  };

  const playVietnameseVoice = (text: string) => {
    window.speechSynthesis.cancel();
    const speech = new SpeechSynthesisUtterance(text);
    const voices = window.speechSynthesis.getVoices();
    const viVoice = voices.find(v => v.lang.startsWith('vi'));
    if (viVoice) speech.voice = viVoice;
    speech.rate = 1.0;
    window.speechSynthesis.speak(speech);
  };

  const playMemeSound = () => {
    const audio = new Audio("https://www.myinstants.com/media/sounds/taileons-fahh.mp3");
    audio.volume = 0.8;
    audio.play().catch(error => {
      console.warn("Meme sound failed, using fallback voice:", error);
      playVietnameseVoice("ngu");
    });
  };

  const generateQuizOptions = useCallback((idx: number, type: QuizType) => {
    if (words.length < 2) return;
    const isEnToVi = type === "en-to-vi";
    const correct = isEnToVi ? words[idx].meaningVi : words[idx].word;
    const others = words.filter((_, i) => i !== idx).sort(() => Math.random() - 0.5).slice(0, 3).map((w) => isEnToVi ? w.meaningVi : w.word);
    const opts = [correct, ...others].sort(() => Math.random() - 0.5);
    setQuizOptions(opts);
    setQuizAnswer(null);
  }, [words]);

  const startFlashcard = () => { setMode("flashcard"); setCurrentIdx(0); setFlipped(false); setScore({ correct: 0, wrong: 0 }); };
  const showQuizSelector = () => { setMode("quiz-select"); };
  const initiateQuiz = (type: QuizType) => { setQuizType(type); setMode("quiz"); setCurrentIdx(0); setScore({ correct: 0, wrong: 0 }); generateQuizOptions(0, type); };

  const nextCard = (knew: boolean) => {
    setScore((s) => knew ? { ...s, correct: s.correct + 1 } : { ...s, wrong: s.wrong + 1 });
    
    // Save progress locally
    try {
      const newProg = { ...progressData };
      const wid = words[currentIdx].id;
      if (!newProg[wid]) newProg[wid] = { correct: 0, wrong: 0, mastered: false };
      if (knew) newProg[wid].correct += 1;
      else newProg[wid].wrong += 1;
      
      if (newProg[wid].correct - newProg[wid].wrong >= 1) newProg[wid].mastered = true;
      setProgressData(newProg);
      localStorage.setItem('vocab_progress_v1', JSON.stringify(newProg));
    } catch(e) {}

    if (currentIdx < words.length - 1) { setCurrentIdx((i) => i + 1); setFlipped(false); }
    else setMode("list");
  };

  const answerQuiz = (ans: string) => {
    setQuizAnswer(ans);
    const correctVal = quizType === "en-to-vi" ? words[currentIdx].meaningVi : words[currentIdx].word;
    const isCorrect = ans === correctVal;
    if (!isCorrect) playMemeSound();
    setScore((s) => isCorrect ? { ...s, correct: s.correct + 1 } : { ...s, wrong: s.wrong + 1 });
    
    // Save progress locally
    try {
      const newProg = { ...progressData };
      const wid = words[currentIdx].id;
      if (!newProg[wid]) newProg[wid] = { correct: 0, wrong: 0, mastered: false };
      if (isCorrect) newProg[wid].correct += 1;
      else newProg[wid].wrong += 1;
      
      if (newProg[wid].correct - newProg[wid].wrong >= 3) newProg[wid].mastered = true;
      setProgressData(newProg);
      localStorage.setItem('vocab_progress_v1', JSON.stringify(newProg));
    } catch(e) {}

    setTimeout(() => {
      if (currentIdx < words.length - 1) { const next = currentIdx + 1; setCurrentIdx(next); generateQuizOptions(next, quizType); } 
      else setMode("list");
    }, 1200);
  };

  // Management Logic
  const openModal = (word: Word | null = null) => {
    setEditingWord(word);
    if (word) {
      setFormData({
        word: word.word, pronunciation: word.pronunciation, partOfSpeech: word.partOfSpeech,
        meaningVi: word.meaningVi, meaningEn: word.meaningEn,
        example: word.example, exampleVi: word.exampleVi
      });
    } else {
      setFormData({ word: "", pronunciation: "", partOfSpeech: "n", meaningVi: "", meaningEn: "", example: "", exampleVi: "" });
    }
    setIsModalOpen(true);
  };

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (!confirm("Xóa từ vựng này?")) return;
    try {
      const r = await fetch(`${API_BASE_URL}/vocab/words/${id}`, { method: 'DELETE' });
      if ((await r.json()).success) fetchData();
    } catch (e) { alert("Lỗi khi xóa"); }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const url = editingWord ? `${API_BASE_URL}/vocab/words/${editingWord.id}` : `${API_BASE_URL}/vocab/words`;
    const method = editingWord ? 'PUT' : 'POST';
    try {
      const r = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, topicId })
      });
      if ((await r.json()).success) { setIsModalOpen(false); fetchData(); }
    } catch (e) { alert("Lỗi khi lưu"); }
    finally { setIsSubmitting(false); }
  };

  if (loading)
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-[#f0fdfa]">
        <Loader2 className="w-12 h-12 animate-spin text-[#10b981]" />
        <p className="mt-4 text-[11px] font-black text-slate-400 uppercase tracking-[0.4em]">Đang tải học liệu...</p>
      </div>
    );

  const word = words[currentIdx];

  const commonStyles = (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700;800&family=Lora:ital,wght@0,600;1,600&display=swap');
      .v7-body { font-family: 'Sora', sans-serif; background: #fdfdfd; min-height: 100vh; }
      .v7-mint-bg { background-image: radial-gradient(at 0% 0%, #f0fdfa 0, transparent 50%), radial-gradient(at 50% 0%, #f0fdfa 0, transparent 50%); }
      .v7-container { max-width: 1140px; margin: 0 auto; padding: 40px 24px 100px; }
      .v7-fade-up { animation: v7-fade-up 0.5s cubic-bezier(0.2, 0.8, 0.2, 1) both; }
      @keyframes v7-fade-up { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }

      .v7-card {
        background: #ffffff; border-radius: 24px; border: 1px solid #f1f5f9; padding: 28px;
        box-shadow: 0 4px 6px -1px rgba(0,0,0,0.02), 0 10px 20px -5px rgba(0,0,0,0.03);
        transition: all 0.3s ease; display: flex; flex-direction: column; cursor: pointer; position: relative;
      }
      .v7-card:hover { transform: translateY(-4px); box-shadow: 0 20px 40px -10px rgba(16, 185, 129, 0.15); border-color: rgba(16, 185, 129, 0.3); }

      .manage-btns { position: absolute; top: 12px; right: 12px; display: flex; gap: 6px; opacity: 0; transform: translateY(-5px); transition: all 0.2s ease-out; }
      .v7-card:hover .manage-btns { opacity: 1; transform: translateY(0); }

      .v7-voice-pill { background: #ffffff; border: 1px solid #f1f5f9; padding: 0 16px; height: 44px; border-radius: 12px; display: flex; align-items: center; gap: 10px; box-shadow: 0 2px 8px rgba(0,0,0,0.02); transition: all 0.2s; }
      .v7-btn-study { height: 44px; padding: 0 20px; border-radius: 12px; font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.1em; display: flex; align-items: center; gap: 8px; transition: all 0.3s; }
      .v7-btn-flash { background: #0ea5e9; color: white; box-shadow: 0 8px 16px -4px rgba(14, 165, 233, 0.3); }
      .v7-btn-quiz { background: #f59e0b; color: white; box-shadow: 0 8px 16px -4px rgba(245, 158, 11, 0.3); }
      .v7-btn-add { background: #1e293b; color: white; box-shadow: 0 8px 16px -4px rgba(30, 41, 59, 0.3); }
      
      .quiz-v4-opt { padding: 20px 24px; border-radius: 16px; border: 2px solid #f1f5f9; background: #ffffff; font-weight: 700; transition: all 0.2s cubic-bezier(0.2, 0.8, 0.2, 1); display: flex; align-items: center; gap: 16px; width: 100%; }
      .quiz-v4-opt:hover:not(:disabled) { border-color: #10b981; background: #f0fdfa; transform: translateX(2px); }
      .quiz-v4-opt.correct { border-color: #10b981; background: #f0fdfa; color: #059669; }
      .quiz-v4-opt.wrong { border-color: #ef4444; background: #fef2f2; color: #dc2626; }
      
      .preserve-3d { transform-style: preserve-3d; }
      .backface-hidden { backface-visibility: hidden; }
      .rotate-y-180 { transform: rotateY(180deg); }
      .glass-modal { background: rgba(255, 255, 255, 0.9); backdrop-filter: blur(20px); border: 1px solid rgba(255,255,255,0.4); }
    `}</style>
  );

  // ─── QUIZ SELECTION MODE ──────────────────────────────
  if (mode === "quiz-select") return (
    <div className="v7-body v7-mint-bg px-6 flex flex-col items-center">
      {commonStyles}
      <div className="v7-container v7-fade-up flex flex-col items-center w-full">
         <div className="flex items-center justify-between mb-16 w-full">
            <button onClick={() => setMode("list")} className="w-12 h-12 rounded-xl bg-white border border-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-800 transition-all shadow-sm"><ArrowLeft size={20} /></button>
            <div className="px-6 py-2 rounded-full bg-white border border-slate-100 shadow-sm text-[11px] font-black text-slate-400 uppercase tracking-widest">Select Mode</div>
            <div className="w-12 h-12" />
         </div>
         <div className="text-center mb-16">
            <Trophy size={48} className="text-amber-500 mx-auto mb-6" />
            <h1 className="text-4xl font-black text-slate-800 mb-4">Quiz Challenge</h1>
            <p className="text-slate-400 font-bold">Hãy chọn chế độ học bạn muốn chinh phục hôm nay.</p>
         </div>
         <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full max-w-[700px]">
            <button onClick={() => initiateQuiz("en-to-vi")} className="v7-card gap-4 group">
               <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-500 flex items-center justify-center group-hover:bg-emerald-500 group-hover:text-white transition-all"><Languages size={28} /></div>
               <div className="text-left mt-2"><h3 className="text-xl font-black text-slate-800">English → Tiếng Việt</h3><p className="text-sm text-slate-400 mt-1 font-medium">Nhìn từ Tiếng Anh, chọn nghĩa tương ứng.</p></div>
               <MoveRight className="text-slate-200 mt-4 group-hover:text-emerald-500 group-hover:translate-x-2 transition-all" />
            </button>
            <button onClick={() => initiateQuiz("vi-to-en")} className="v7-card gap-4 group">
               <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-500 flex items-center justify-center group-hover:bg-amber-500 group-hover:text-white transition-all"><Sparkles size={28} /></div>
               <div className="text-left mt-2"><h3 className="text-xl font-black text-slate-800">Tiếng Việt → English</h3><p className="text-sm text-slate-400 mt-1 font-medium">Nhìn nghĩa Tiếng Việt, chọn từ Tiếng Anh.</p></div>
               <MoveRight className="text-slate-200 mt-4 group-hover:text-amber-500 group-hover:translate-x-2 transition-all" />
            </button>
         </div>
      </div>
    </div>
  );

  // ─── FLASHCARD MODE ────────────────────────────────────
  if (mode === "flashcard" && word) return (
    <div className="v7-body v7-mint-bg px-6 flex flex-col items-center">
      {commonStyles}
      <div className="v7-container v7-fade-up flex flex-col items-center w-full">
        <div className="flex items-center justify-between mb-12 w-full">
           <button onClick={() => setMode("list")} className="w-12 h-12 rounded-xl bg-white border border-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-800 transition-all shadow-sm"><ArrowLeft size={20} /></button>
           <div className="px-6 py-2 rounded-full bg-white border border-slate-100 shadow-sm text-[11px] font-black text-slate-400 uppercase tracking-widest">Topic: <span className="text-emerald-500">{topicName}</span></div>
           <div className="w-12 h-12" />
        </div>
        <div className="relative w-full max-w-[520px] h-[400px] mb-16" style={{ perspective: '1500px' }} onClick={() => setFlipped(!flipped)}>
           <div className={cn("relative w-full h-full text-center transition-transform duration-700 ease-[cubic-bezier(0.4,0,0.2,1)] preserve-3d cursor-pointer shadow-2xl rounded-[32px]", flipped && "rotate-y-180")}>
              <div className="absolute inset-0 backface-hidden bg-white border border-slate-50 rounded-[32px] p-10 flex flex-col items-center justify-center">
                 <div className="text-[10px] font-black text-sky-500 uppercase tracking-[0.3em] mb-8">Vocabulary Word</div>
                 <div className="text-5xl font-black text-slate-800 mb-6 tracking-tight">{word.word}</div>
                 <div className="text-lg font-bold text-slate-200 italic mb-10">{word.pronunciation}</div>
                 <button onClick={(e) => { e.stopPropagation(); playVoice(word.word); }} className="w-16 h-16 rounded-full bg-sky-50 text-sky-500 flex items-center justify-center hover:scale-110 transition-transform"><Volume2 size={24} /></button>
              </div>
              <div className="absolute inset-0 backface-hidden bg-white border border-slate-50 rounded-[32px] p-10 flex flex-col items-center justify-center rotate-y-180">
                 <div className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.3em] mb-8">Vietnamese Meaning</div>
                 <div className="text-4xl font-black text-slate-800 mb-8">{word.meaningVi}</div>
                 <p className="text-base font-bold text-slate-500 leading-relaxed text-center px-4">"{word.example}"</p>
              </div>
           </div>
        </div>
        <div className="flex gap-6 w-full max-w-[520px]">
           <button onClick={() => nextCard(false)} className="flex-1 h-20 rounded-[28px] bg-white border border-red-100 text-red-500 font-black text-xs hover:bg-red-50 transition-all shadow-sm">BỎ QUA</button>
           <button onClick={() => nextCard(true)} className="flex-1 h-20 rounded-[28px] bg-emerald-500 text-white font-black text-xs hover:bg-emerald-600 transition-all shadow-xl shadow-emerald-500/20">ĐÃ THUỘC</button>
        </div>
      </div>
    </div>
  );

  // ─── QUIZ MODE ─────────────────────────────────────────
  if (mode === "quiz" && word) return (
    <div className="v7-body v7-mint-bg px-6 flex flex-col items-center">
      {commonStyles}
      <div className="v7-container v7-fade-up flex flex-col items-center w-full">
        <div className="flex items-center justify-between mb-16 w-full">
           <button onClick={() => setMode("quiz-select")} className="w-12 h-12 rounded-xl bg-white border border-slate-100 flex items-center justify-center shadow-sm text-slate-400 hover:text-slate-800 transition-all"><ArrowLeft size={20} /></button>
           <div className="text-center">
              <div className="text-[10px] font-black text-slate-300 uppercase tracking-[0.4em] mb-2">{quizType === "en-to-vi" ? "En → Vi" : "Vi → En"} Quiz</div>
              <div className="flex items-center justify-center gap-3 px-4 py-1.5 rounded-full bg-slate-900 text-white text-xs font-black">{currentIdx + 1} / {words.length}</div>
           </div>
           <div className="w-12 h-12" />
        </div>
        <div className="ma-card-premium p-12 text-center mb-10 w-full max-w-[520px] border-b-[6px] border-emerald-500 rounded-[32px] shadow-2xl relative">
           <button onClick={() => quizType === "en-to-vi" && playVoice(word.word)} className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-500 flex items-center justify-center mx-auto mb-6 shadow-inner hover:scale-110 transition-transform">{quizType === "en-to-vi" ? <Volume2 size={24} /> : <Zap size={24} fill="currentColor" />}</button>
           <h2 className="text-5xl font-black text-slate-800 mb-4 tracking-tight">{quizType === "en-to-vi" ? word.word : word.meaningVi}</h2>
           {quizType === "en-to-vi" && (<div className="flex items-center justify-center gap-3 text-slate-300"><span className="text-sm font-bold italic">{word.pronunciation}</span><span className="w-1.5 h-1.5 rounded-full bg-emerald-100" /><span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">{word.partOfSpeech}</span></div>)}
        </div>
        <div className="grid grid-cols-1 gap-4 w-full max-w-[520px]">
          {quizOptions.map((opt, i) => {
            const isSelected = quizAnswer === opt;
            const correctVal = quizType === "en-to-vi" ? word.meaningVi : word.word;
            const isCorrect = opt === correctVal;
            const statusClass = quizAnswer ? (isCorrect ? "correct" : (isSelected ? "wrong" : "")) : "";
            return (
              <button key={i} onClick={() => !quizAnswer && answerQuiz(opt)} disabled={!!quizAnswer} className={cn("quiz-v4-opt shadow-sm group", statusClass)}>
                 <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center text-xs font-black border transition-all", !quizAnswer && "bg-slate-50 text-slate-300 border-slate-100", statusClass === "correct" && "bg-emerald-500 text-white border-emerald-500 scale-110 shadow-lg shadow-emerald-500/30", statusClass === "wrong" && "bg-red-500 text-white border-red-500")}>{String.fromCharCode(65 + i)}</div>
                 <span className="flex-1 text-base font-bold text-left ml-4">{opt}</span>
                 {quizType === "vi-to-en" && (<div onClick={(e) => { e.stopPropagation(); playVoice(opt); }} className="p-2 rounded-lg bg-slate-50 text-slate-400 hover:bg-emerald-50 hover:text-emerald-500 transition-all opacity-0 group-hover:opacity-100"><Volume2 size={16} /></div>)}
                 {quizAnswer && isCorrect && <CheckCircle2 size={24} className="text-emerald-500 ml-2" />}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );

  // ─── LIST MODE ───────────────────────────────────────── (DEFAULT)
  return (
    <div className="v7-body v7-mint-bg px-6">
      {commonStyles}
      <div className="v7-container v7-fade-up">
        
        {/* Header Section v7 */}
        <div className="flex flex-col gap-8 mb-16">
           <div className="flex items-center justify-between">
              <button onClick={() => router.push("/vocabulary")} className="w-11 h-11 rounded-xl bg-white border border-slate-100 flex items-center justify-center text-slate-400 hover:text-emerald-500 transition-all shadow-sm"><ArrowLeft size={20} /></button>
              <div className="flex items-center gap-3">
                 <div className="v7-voice-pill"><Volume1 size={16} className="text-sky-500" /><select value={selectedVoiceName} onChange={handleVoiceChange} className="bg-transparent border-none outline-none text-[11px] font-extrabold text-slate-500 cursor-pointer pr-4">{voices.map(v => <option key={v.name} value={v.name}>{v.name}</option>)}</select></div>
                 <button onClick={startFlashcard} className="v7-btn-study v7-btn-flash"><Layers size={14} /> Flashcard</button>
                 <button onClick={showQuizSelector} className="v7-btn-study v7-btn-quiz"><Zap size={14} /> Quiz</button>
                 <button onClick={() => openModal()} className="v7-btn-study v7-btn-add"><Plus size={14} /> Add Word</button>
              </div>
           </div>
           <div className="text-center">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100/50 text-emerald-600 text-[9px] font-black uppercase tracking-widest mb-4"><Star size={10} fill="currentColor" /> Course Specialist</div>
              <h1 className="text-4xl sm:text-5xl font-black text-slate-800 tracking-tight mb-4">{topicName}</h1>
              <p className="text-sm font-bold text-slate-400 max-w-lg mx-auto">Làm chủ <span className="text-emerald-500">{words.length} từ vựng</span> then chốt. Nhấn để nghe cách phát âm chuẩn nhất.</p>
           </div>
        </div>

        {/* ══ 3-COLUMN GRID ═════════════════════════════════════════ */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
           {words.map((w, i) => (
              <div key={w.id} className="v7-card v7-fade-up" style={{ animationDelay: `${0.05 + i * 0.03}s` }} onClick={() => playVoice(w.word)}>
                 <div className="flex items-start justify-between mb-5">
                    <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-500 flex items-center justify-center hover:scale-110 transition-all"><Volume2 size={20} /></div>
                    <div className="flex items-center gap-2">
                       {progressData[w.id]?.mastered && <div className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-600 text-[9px] font-black uppercase flex items-center gap-1"><CheckCircle2 size={10} /> Mastered</div>}
                       <span className="px-2 py-0.5 rounded-md bg-slate-50 border border-slate-100 text-[9px] font-black text-slate-400 uppercase">{w.partOfSpeech}</span>
                    </div>
                 </div>
                 <h3 className="text-2xl font-black text-slate-800 mb-1 leading-tight">{w.word}</h3>
                 <p className="text-xs font-bold text-slate-300 italic mb-4">{w.pronunciation}</p>
                 <div className="mt-auto pt-5 border-t border-slate-50">
                    <div className="text-sm font-black text-emerald-500 mb-2">{w.meaningVi}</div>
                    <p className="text-xs text-slate-400 font-medium line-clamp-2 leading-relaxed">{w.example}</p>
                 </div>
                 <div className="manage-btns">
                    <button onClick={(e) => { e.stopPropagation(); openModal(w); }} className="w-8 h-8 rounded-lg bg-white border border-slate-100 text-slate-400 hover:text-sky-500 hover:border-sky-100 transition-all flex items-center justify-center shadow-sm"><Pencil size={12} /></button>
                    <button onClick={(e) => handleDelete(e, w.id)} className="w-8 h-8 rounded-lg bg-white border border-slate-100 text-slate-400 hover:text-red-500 hover:border-red-100 transition-all flex items-center justify-center shadow-sm"><Trash2 size={12} /></button>
                 </div>
              </div>
           ))}
        </div>
      </div>

      {/* ══ WORD MODAL ═════════════════════════════════════════════════════ */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsModalOpen(false)} className="absolute inset-0 bg-slate-900/50 backdrop-blur-md" />
            <motion.div 
               initial={{ opacity: 0, scale: 0.95, y: 30 }} 
               animate={{ opacity: 1, scale: 1, y: 0 }} 
               exit={{ opacity: 0, scale: 0.95, y: 30 }} 
               className="relative z-10 w-full max-w-[640px] bg-white rounded-3xl shadow-2xl overflow-hidden"
            >
               <div className="max-h-[85vh] overflow-y-auto scrollbar-hide">
                  <div className="p-8 pb-6 border-b border-slate-100 flex items-start justify-between bg-slate-50/50">
                     <div>
                        <h3 className="text-2xl font-black text-slate-800 tracking-tight">
                           {editingWord ? "Chỉnh sửa từ vựng" : "Thêm từ mới"}
                        </h3>
                        <p className="text-slate-500 text-sm mt-1">
                           {editingWord ? "Cập nhật thông tin chi tiết của từ vựng" : "Bổ sung từ vựng mới vào chủ đề này"}
                        </p>
                     </div>
                     <button type="button" onClick={() => setIsModalOpen(false)} className="p-3 bg-white border border-slate-200 hover:bg-slate-50 hover:text-red-500 rounded-full transition-colors shadow-sm">
                        <X className="w-5 h-5" />
                     </button>
                  </div>

                  <form onSubmit={handleSubmit} className="p-8 space-y-6 bg-white">
                     <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-2">
                           <label className="text-[11px] font-bold text-slate-400 tracking-widest uppercase ml-1">Từ vựng (English) *</label>
                           <input type="text" value={formData.word} onChange={e => setFormData({ ...formData, word: e.target.value })} required className="w-full bg-slate-50/80 border border-slate-200 rounded-2xl px-5 py-4 focus:bg-white focus:ring-4 focus:ring-[#00c9a7]/20 focus:border-[#00c9a7] transition-all outline-none font-bold text-slate-800 placeholder-slate-400" placeholder="e.g. implementation" />
                        </div>
                        <div className="space-y-2">
                           <label className="text-[11px] font-bold text-slate-400 tracking-widest uppercase ml-1">Phiên âm</label>
                           <input type="text" value={formData.pronunciation} onChange={e => setFormData({ ...formData, pronunciation: e.target.value })} className="w-full bg-slate-50/80 border border-slate-200 rounded-2xl px-5 py-4 focus:bg-white focus:ring-4 focus:ring-[#00c9a7]/20 focus:border-[#00c9a7] transition-all outline-none font-medium text-slate-700 placeholder-slate-400" placeholder="e.g. /ɪm.plə.mənˈteɪ.ʃən/" />
                        </div>
                     </div>

                     <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-2">
                           <label className="text-[11px] font-bold text-slate-400 tracking-widest uppercase ml-1">Nghĩa tiếng Việt *</label>
                           <input type="text" value={formData.meaningVi} onChange={e => setFormData({ ...formData, meaningVi: e.target.value })} required className="w-full bg-slate-50/80 border border-slate-200 rounded-2xl px-5 py-4 focus:bg-white focus:ring-4 focus:ring-[#00c9a7]/20 focus:border-[#00c9a7] transition-all outline-none font-bold text-slate-800 placeholder-slate-400" placeholder="e.g. sự thực hiện" />
                        </div>
                        <div className="space-y-2">
                           <label className="text-[11px] font-bold text-slate-400 tracking-widest uppercase ml-1">Định nghĩa tiếng Anh</label>
                           <input type="text" value={formData.meaningEn} onChange={e => setFormData({ ...formData, meaningEn: e.target.value })} className="w-full bg-slate-50/80 border border-slate-200 rounded-2xl px-5 py-4 focus:bg-white focus:ring-4 focus:ring-[#00c9a7]/20 focus:border-[#00c9a7] transition-all outline-none font-medium text-slate-700 placeholder-slate-400" placeholder="Short description..." />
                        </div>
                     </div>

                     <div className="space-y-2">
                        <label className="text-[11px] font-bold text-slate-400 tracking-widest uppercase ml-1">Câu ví dụ (English)</label>
                        <textarea value={formData.example} onChange={e => setFormData({ ...formData, example: e.target.value })} rows={2} className="w-full bg-slate-50/80 border border-slate-200 rounded-2xl px-5 py-4 focus:bg-white focus:ring-4 focus:ring-[#00c9a7]/20 focus:border-[#00c9a7] transition-all outline-none font-medium text-slate-700 resize-none placeholder-slate-400" placeholder="Provide a context sentence..." />
                     </div>

                     <div className="space-y-2">
                        <label className="text-[11px] font-bold text-slate-400 tracking-widest uppercase ml-1">Dịch ví dụ (Tiếng Việt)</label>
                        <textarea value={formData.exampleVi} onChange={e => setFormData({ ...formData, exampleVi: e.target.value })} rows={2} className="w-full bg-slate-50/80 border border-slate-200 rounded-2xl px-5 py-4 focus:bg-white focus:ring-4 focus:ring-[#00c9a7]/20 focus:border-[#00c9a7] transition-all outline-none font-medium text-slate-700 resize-none placeholder-slate-400" placeholder="Bản dịch của câu ví dụ trên..." />
                     </div>

                     <div className="pt-6">
                        <button type="submit" disabled={isSubmitting} className="w-full py-4 bg-gradient-to-r from-emerald-400 to-emerald-600 text-white font-black tracking-widest uppercase text-sm rounded-2xl shadow-xl shadow-emerald-500/30 hover:shadow-2xl hover:scale-[1.01] flex items-center justify-center gap-3 transition-all disabled:opacity-70 disabled:scale-100">
                           {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                           {isSubmitting ? "Đang xử lý..." : (editingWord ? "CẬP NHẬT TỪ VỰNG" : "LƯU TỪ MỚI")}
                        </button>
                     </div>
                  </form>
               </div>
            </motion.div>
          </div>
        )}

      </AnimatePresence>

    </div>
  );
}
