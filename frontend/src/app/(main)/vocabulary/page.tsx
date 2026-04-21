"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  BookOpen, ChevronRight, Loader2, Sparkles, Brain, 
  LayoutGrid, CheckCircle2, TrendingUp, Layers, ArrowRight,
  Zap, History, Star, Bookmark, GraduationCap, PlayCircle,
  Plus, Pencil, Trash2, X, Save, Box, Trophy, Languages, MoveRight, ArrowLeft
} from "lucide-react";
import { API_BASE_URL } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { createPortal } from "react-dom";
import * as XLSX from "xlsx";
import { FileUp, FileCheck, AlertCircle } from "lucide-react";

interface Topic {
  id: string;
  name: string;
  nameVi: string;
  description: string;
  icon: string;
  wordCount: number;
  learnedCount: number;
  wordIds?: string[];
}

type QuizType = "en-to-vi" | "vi-to-en";

export default function VocabularyPage() {
  const router = useRouter();
  const [topics, setTopics] = useState<Topic[]>([]);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);
  
  // Management States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTopic, setEditingTopic] = useState<Topic | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    nameVi: "",
    description: "",
    icon: "📚"
  });
  const [excelFile, setExcelFile] = useState<File | null>(null);
  const [excelData, setExcelData] = useState<any[]>([]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setExcelFile(file);
      const reader = new FileReader();
      reader.onload = (evt) => {
        const bstr = evt.target?.result;
        const wb = XLSX.read(bstr, { type: "binary" });
        const wsname = wb.SheetNames[0];
        const ws = wb.Sheets[wsname];
        const data = XLSX.utils.sheet_to_json(ws, { header: 1 });
        
        // Skip header and map to our format
        // Expected columns: Từ vựng, Phiên âm, Nghĩa của từ
        const words = (data as any[]).slice(1).map(row => ({
          word: row[0],
          pronunciation: row[1],
          meaningVi: row[2]
        })).filter(w => w.word); // Basic validation
        
        setExcelData(words);
      };
      reader.readAsBinaryString(file);
    }
  };

  // Test Modal States
  const [isTestModalOpen, setIsTestModalOpen] = useState(false);
  const [selectedTopicIds, setSelectedTopicIds] = useState<string[]>([]);
  const [testMode, setTestMode] = useState<"select" | "learned">("select");

  // Progress
  const [progressData, setProgressData] = useState<Record<string, { correct: number, wrong: number, mastered: boolean }>>({});

  const fetchTopics = async () => {
    try {
      const r = await fetch(`${API_BASE_URL}/vocab/topics`);
      const d = await r.json();
      if (d.success) {
        let prog: Record<string, { correct: number, wrong: number, mastered: boolean }> = {};
        try {
          const progStr = localStorage.getItem("vocab_progress_v1");
          if (progStr) prog = JSON.parse(progStr);
        } catch(e) {}
        setProgressData(prog);

        const enhancedTopics = d.data.map((t: Topic) => {
          const localLearned = t.wordIds?.filter((wId: string) => prog[wId]?.mastered).length || 0;
          return { ...t, learnedCount: Math.max(t.learnedCount, localLearned) };
        });
        setTopics(enhancedTopics);
      }
    } catch (error) {
      console.error("Failed to fetch topics:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTopics();
  }, []);

  const openModal = (topic: Topic | null = null) => {
    setEditingTopic(topic);
    if (topic) {
      setFormData({
        name: topic.name,
        nameVi: topic.nameVi,
        description: topic.description,
        icon: topic.icon || "📚"
      });
    } else {
      setFormData({ name: "", nameVi: "", description: "", icon: "📚" });
    }
    setIsModalOpen(true);
  };

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    e.stopPropagation();
    if (!confirm("Bạn có chắc chắn muốn xóa chủ đề này và tất cả từ vựng bên trong?")) return;
    
    try {
      const r = await fetch(`${API_BASE_URL}/vocab/topics/${id}`, { method: 'DELETE' });
      const d = await r.json();
      if (d.success) fetchTopics();
    } catch (error) {
      alert("Lỗi khi xóa chủ đề");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const url = editingTopic 
        ? `${API_BASE_URL}/vocab/topics/${editingTopic.id}` 
        : `${API_BASE_URL}/vocab/topics`;
      const method = editingTopic ? 'PUT' : 'POST';
      
      const r = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const d = await r.json();
      
      if (d.success) {
        const topicId = editingTopic ? editingTopic.id : d.data.id;
        
        // If there is Excel data, import the words
        if (excelData.length > 0) {
          const importRes = await fetch(`${API_BASE_URL}/vocab/import`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ topicId, words: excelData })
          });
          const importData = await importRes.json();
          if (!importData.success) {
             console.error("Failed to import words", importData.error);
             alert("Tạo chủ đề thành công nhưng gặp lỗi khi nhập danh sách từ vựng từ Excel.");
          }
        }
        
        setIsModalOpen(false);
        setExcelFile(null);
        setExcelData([]);
        fetchTopics();
      }
    } catch (error) {
      alert("Lỗi khi lưu chủ đề");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Test modal helpers
  const toggleTopicSelect = (topicId: string) => {
    setSelectedTopicIds(prev => 
      prev.includes(topicId) ? prev.filter(id => id !== topicId) : [...prev, topicId]
    );
  };

  const selectAllTopics = () => {
    if (selectedTopicIds.length === topics.length) {
      setSelectedTopicIds([]);
    } else {
      setSelectedTopicIds(topics.map(t => t.id));
    }
  };

  const getLearnedTopicIds = () => {
    return topics.filter(t => {
      const learnedInTopic = t.wordIds?.filter((wId: string) => progressData[wId]?.mastered).length || 0;
      return learnedInTopic > 0;
    }).map(t => t.id);
  };

  const startTest = () => {
    const idsToTest = testMode === "learned" ? getLearnedTopicIds() : selectedTopicIds;
    if (idsToTest.length === 0) {
      alert(testMode === "learned" ? "Bạn chưa học từ vựng nào!" : "Vui lòng chọn ít nhất 1 chủ đề!");
      return;
    }
    // Navigate to the first selected topic's quiz (multi-topic quiz)
    const params = new URLSearchParams({ topics: idsToTest.join(","), mode: "quiz" });
    router.push(`/vocabulary/quiz?${params.toString()}`);
  };

  const totalWords = topics.reduce((s, t) => s + t.wordCount, 0);
  const learnedWords = topics.reduce((s, t) => s + t.learnedCount, 0);

  if (loading)
    return (
      <div className="flex flex-col items-center justify-center h-[70vh] ma-light">
        <Loader2 className="w-10 h-10 animate-spin text-[#00c9a7]" />
        <p className="mt-4 text-[11px] font-bold text-slate-400 uppercase tracking-[0.2em]">Đang tải kho từ vựng...</p>
      </div>
    );

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700;800&family=Lora:ital,wght@0,600;1,600&display=swap');

        .ma-light { font-family:'Sora',sans-serif; background:#f8fafc; color:#334155; min-height:100vh; }

        @keyframes ma-fade-up {
          from { opacity:0; transform:translateY(24px); }
          to   { opacity:1; transform:translateY(0); }
        }
        .ma-fade-up { animation:ma-fade-up .7s cubic-bezier(0.2, 0.8, 0.2, 1) both; }

        .ma-container {
           max-width: 1100px;
           margin: 0 auto;
           padding: 60px 24px 120px;
        }

        .ma-topic-premium {
           background: #ffffff;
           border-radius: 28px;
           padding: 32px;
           border: 1px solid #f1f5f9;
           position: relative;
           transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
           display: flex;
           flex-direction: column;
           height: 100%;
        }
        .ma-topic-premium:hover {
           transform: translateY(-8px);
           box-shadow: 0 30px 60px -12px rgba(0, 201, 167, 0.15);
           border-color: rgba(0, 201, 167, 0.3);
        }

        .ma-topic-icon-wrap {
           width: 64px; height: 64px; border-radius: 20px;
           background: #f8fafc; border: 1px solid #f1f5f9;
           display: flex; align-items: center; justify-content: center;
           font-size: 32px; margin-bottom: 24px;
           transition: all 0.3s ease;
        }

        .manage-actions {
          position: absolute; right: 24px; bottom: 24px;
          display: flex; gap: 8px; opacity: 0; transform: translateY(10px);
          transition: all 0.3s cubic-bezier(0.2, 0.8, 0.2, 1);
        }
        .ma-topic-premium:hover .manage-actions { opacity: 1; transform: translateY(0); }

        .btn-manage {
          width: 38px; height: 38px; border-radius: 12px;
          display: flex; align-items: center; justify-content: center;
          transition: all 0.2s; background: white; border: 1px solid #f1f5f9;
          box-shadow: 0 4px 12px rgba(0,0,0,0.05);
        }
        .btn-edit:hover { color: #3b82f6; border-color: #3b82f6; transform: scale(1.1); }
        .btn-delete:hover { color: #ef4444; border-color: #ef4444; transform: scale(1.1); }

        .ma-progress-bar {
          height: 8px; border-radius: 99px; background: #f1f5f9; overflow: hidden;
        }
        .ma-progress-fill {
          height: 100%; border-radius: 99px;
          background: linear-gradient(90deg, #00c9a7 0%, #10b981 100%);
          transition: width 0.8s cubic-bezier(0.4, 0, 0.2, 1);
          min-width: 0;
        }
      `}</style>

      <div className="ma-light">
        <div className="ma-container">
          
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-8 mb-16 ma-fade-up">
             <div className="flex items-center gap-6">
                <div className="w-16 h-16 rounded-2xl bg-white border border-slate-100 flex items-center justify-center text-[#00c9a7] shadow-sm">
                   <GraduationCap size={32} />
                </div>
                <div>
                   <h2 className="text-3xl font-black text-slate-800 tracking-tight">KHO TỪ VỰNG</h2>
                   <div className="flex items-center gap-2.5 mt-1.5">
                      <div className="w-2.5 h-2.5 rounded-full bg-[#00c9a7]"></div>
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-[0.3em]">Premium Learning Base</span>
                   </div>
                </div>
             </div>
             <div className="flex gap-3">
                <button onClick={() => { setIsTestModalOpen(true); setTestMode("select"); setSelectedTopicIds([]); }} className="h-12 px-6 rounded-2xl bg-amber-500 text-white shadow-xl shadow-amber-500/20 text-xs font-black hover:bg-amber-600 transition-all flex items-center gap-2">
                   <Trophy size={18} /> Kiểm tra
                </button>
                <button onClick={() => openModal()} className="h-12 px-6 rounded-2xl bg-slate-900 text-white shadow-xl shadow-slate-900/20 text-xs font-black hover:bg-slate-800 transition-all flex items-center gap-2">
                   <Plus size={18} /> Thêm Chủ đề
                </button>
             </div>
          </div>

          {/* ══ TOPIC GRID ══════════════════════════════════════════════════ */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 ma-fade-up">
             
             {/* Add New Topic Placeholder Card */}
             <div 
               onClick={() => openModal()}
               className="ma-topic-premium group border-dashed border-2 border-slate-200 bg-slate-50/50 justify-center items-center py-16 cursor-pointer hover:bg-white transition-all"
             >
                <div className="w-16 h-16 rounded-full bg-white border border-slate-100 flex items-center justify-center text-slate-300 group-hover:text-[#00c9a7] group-hover:scale-110 transition-all shadow-sm">
                   <Plus size={32} />
                </div>
                <p className="mt-6 text-sm font-black text-slate-400 uppercase tracking-widest group-hover:text-slate-600 transition-colors">Tạo chủ đề mới</p>
             </div>

             {topics.map((topic, i) => {
                const pct = topic.wordCount > 0 ? Math.round((topic.learnedCount / topic.wordCount) * 100) : 0;
                return (
                   <div key={topic.id} className="relative group">
                     <Link href={`/vocabulary/${topic.id}`} className="ma-topic-premium h-full block">
                        <div className="ma-topic-icon-wrap">
                           {topic.icon || "📚"}
                        </div>
                        
                        <div className="mb-12">
                           <h3 className="text-2xl font-black text-slate-800 leading-tight mb-3 group-hover:text-[#00c9a7] transition-colors">
                              {topic.nameVi}
                           </h3>
                           <span className="px-2.5 py-1 rounded-md bg-slate-50 text-[10px] font-black text-slate-400 uppercase tracking-wider border border-slate-100">
                              {topic.name}
                           </span>
                        </div>

                        <div className="mt-auto">
                           <div className="flex justify-between items-end mb-3">
                              <div>
                                 <div className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em] mb-1.5">Progress</div>
                                 <div className="text-base font-black text-slate-700">
                                    {topic.learnedCount} <span className="text-slate-300 text-sm">/ {topic.wordCount}</span>
                                 </div>
                              </div>
                              <div className={cn("text-2xl font-black", pct > 0 ? "text-[#00c9a7]" : "text-slate-200")}>{pct}%</div>
                           </div>
                           <div className="ma-progress-bar">
                              <div className="ma-progress-fill" style={{ width: `${pct}%` }} />
                           </div>
                        </div>
                     </Link>

                     {/* Management Actions */}
                     <div className="manage-actions">
                        <button 
                          onClick={(e) => { e.preventDefault(); openModal(topic); }}
                          className="btn-manage btn-edit"
                        >
                           <Pencil size={16} />
                        </button>
                        <button 
                          onClick={(e) => handleDelete(e, topic.id)}
                          className="btn-manage btn-delete"
                        >
                           <Trash2 size={16} />
                        </button>
                     </div>
                   </div>
                );
             })}
          </div>
        </div>
      </div>

      {/* ══ TOPIC MODAL ═══════════════════════════════════════════════════════ */}
      {mounted && createPortal(
        <AnimatePresence>
          {isModalOpen && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
              <motion.div 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                onClick={() => setIsModalOpen(false)}
                className="absolute inset-0 -z-10 bg-slate-900/50 backdrop-blur-md"
              />
              <motion.div 
                initial={{ opacity: 0, scale: 0.95, y: 30 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 30 }}
                className="relative z-50 w-full max-w-[800px] bg-white rounded-3xl shadow-2xl overflow-hidden"
              >
              <div className="p-10 pb-8 border-b border-slate-100 flex flex-col items-center justify-center bg-slate-50/50 text-center">
                  <h3 className="text-3xl font-black text-slate-800 tracking-tight">
                     {editingTopic ? "Chỉnh sửa chủ đề" : "Tạo chủ đề mới"}
                  </h3>
                  <p className="text-slate-500 text-base mt-2">
                     {editingTopic ? "Thay đổi thông tin chung của nhóm từ vựng" : "Phân loại từ vựng thành các nhóm cụ thể"}
                  </p>
              </div>

              <form onSubmit={handleSubmit} className="p-8 space-y-6 bg-white">
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                     <label className="text-[11px] font-bold text-slate-400 tracking-widest uppercase ml-1">Tiêu đề (Tiếng Việt) *</label>
                     <input 
                       required value={formData.nameVi} onChange={(e) => setFormData({...formData, nameVi: e.target.value})}
                       placeholder="Ví dụ: Văn phòng"
                       className="w-full bg-slate-50/80 border border-slate-200 rounded-2xl px-5 py-6 focus:bg-white focus:ring-4 focus:ring-[#00c9a7]/20 focus:border-[#00c9a7] transition-all outline-none font-bold text-slate-800 placeholder-slate-400"
                     />
                  </div>
                  <div className="space-y-2">
                     <label className="text-[11px] font-bold text-slate-400 tracking-widest uppercase ml-1">Title (English) *</label>
                     <input 
                       required value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})}
                       placeholder="Example: Office"
                       className="w-full bg-slate-50/80 border border-slate-200 rounded-2xl px-5 py-6 focus:bg-white focus:ring-4 focus:ring-[#00c9a7]/20 focus:border-[#00c9a7] transition-all outline-none font-medium text-slate-700 placeholder-slate-400"
                     />
                  </div>
                </div>

                <div className="space-y-2">
                   <label className="text-[11px] font-bold text-slate-400 tracking-widest uppercase ml-1">Mô tả ngắn</label>
                   <textarea 
                     required value={formData.description} rows={2} onChange={(e) => setFormData({...formData, description: e.target.value})}
                     placeholder="Viết một chút tổng quan về chủ đề này..."
                     className="w-full bg-slate-50/80 border border-slate-200 rounded-2xl px-5 py-4 focus:bg-white focus:ring-4 focus:ring-[#00c9a7]/20 focus:border-[#00c9a7] transition-all outline-none font-medium text-slate-700 resize-none placeholder-slate-400"
                   />
                </div>

                <div className="space-y-2">
                   <label className="text-[11px] font-bold text-slate-400 tracking-widest uppercase ml-1">Icon đại diện (Emoji)</label>
                   <input 
                     value={formData.icon}
                     onChange={(e) => setFormData({...formData, icon: e.target.value})}
                     placeholder="📚"
                     className="w-full bg-slate-50/80 border border-slate-200 rounded-2xl px-5 py-4 focus:bg-white focus:ring-4 focus:ring-[#00c9a7]/20 focus:border-[#00c9a7] transition-all outline-none text-2xl placeholder-slate-300"
                   />
                </div>

                {/* Excel Import Section */}
                <div className="pt-4 border-t border-slate-100">
                   <label className="block text-[11px] font-bold text-slate-400 tracking-widest uppercase ml-1 mb-3">Nhập từ vựng từ Excel (Tùy chọn)</label>
                   <div className={cn(
                     "relative group cursor-pointer transition-all duration-300",
                     excelFile ? "bg-emerald-50/50 border-emerald-200" : "bg-slate-50/50 border-slate-200 hover:border-[#00c9a7]/50 hover:bg-white",
                     "border-2 border-dashed rounded-3xl p-6 text-center overflow-hidden"
                   )}>
                     <input 
                        type="file" accept=".xlsx, .xls" onChange={handleFileChange}
                        className="absolute inset-0 opacity-0 cursor-pointer z-10"
                     />
                     <div className="flex flex-col items-center gap-3">
                        {excelFile ? (
                          <>
                            <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center shadow-sm">
                              <FileCheck className="w-7 h-7" />
                            </div>
                            <div className="text-sm font-black text-slate-700">{excelFile.name}</div>
                            <div className="px-4 py-1.5 rounded-full bg-emerald-600 text-[10px] font-black text-white uppercase tracking-widest">
                               Đã sẵn sàng ({excelData.length} từ)
                            </div>
                          </>
                        ) : (
                          <>
                            <div className="w-14 h-14 rounded-2xl bg-white border border-slate-100 text-slate-300 group-hover:text-[#00c9a7] group-hover:scale-110 transition-all flex items-center justify-center shadow-sm">
                              <FileUp className="w-7 h-7" />
                            </div>
                            <div className="text-sm font-bold text-slate-500 group-hover:text-slate-600 transition-colors">Chọn file Excel (.xlsx)</div>
                            <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest bg-white px-3 py-1 rounded-full border border-slate-100">
                               <AlertCircle className="w-3 h-3" />
                               3 cột: Từ, Phiên âm, Nghĩa
                            </div>
                          </>
                        )}
                     </div>
                   </div>
                </div>

                <div className="flex gap-4 pt-4">
                  <button 
                    type="button" 
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 py-5 h-16 bg-slate-100 text-slate-600 hover:bg-slate-200 font-bold tracking-widest uppercase text-base rounded-2xl transition-all flex items-center justify-center gap-2"
                  >
                     <ArrowLeft className="w-6 h-6" />
                     QUAY LẠI
                  </button>
                  <button 
                    type="submit" 
                    disabled={isSubmitting} 
                    className="flex-1 py-5 h-16 bg-gradient-to-r from-emerald-400 to-emerald-600 text-white font-black tracking-widest uppercase text-lg rounded-2xl shadow-xl shadow-emerald-500/30 hover:shadow-2xl hover:scale-[1.01] flex items-center justify-center gap-3 transition-all disabled:opacity-70 disabled:scale-100"
                  >
                     {isSubmitting ? <Loader2 className="w-6 h-6 animate-spin" /> : <Save className="w-6 h-6" />}
                     {isSubmitting ? "ĐANG XỬ LÝ..." : (editingTopic ? "CẬP NHẬT CHỦ ĐỀ" : "TẠO MỚI CHỦ ĐỀ")}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>,
      document.body
      )}

      {/* ══ TEST MODAL ═══════════════════════════════════════════════════════ */}
      {mounted && createPortal(
        <AnimatePresence>
          {isTestModalOpen && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                onClick={() => setIsTestModalOpen(false)}
                className="absolute inset-0 -z-10 bg-slate-900/50 backdrop-blur-md"
              />
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 30 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 30 }}
                className="relative z-50 w-full max-w-[800px] bg-white rounded-3xl shadow-2xl overflow-hidden"
              >
              <div className="relative p-8 pb-6 border-b border-slate-100 flex flex-col items-center justify-center bg-gradient-to-br from-amber-50 to-orange-50 text-center">
                 <h3 className="text-3xl font-black text-slate-800 tracking-tight flex items-center justify-center gap-3">
                    <Trophy className="w-8 h-8 text-amber-500" />
                    Kiểm tra từ vựng
                 </h3>
                 <p className="text-slate-500 text-base mt-2">Chọn chế độ kiểm tra phù hợp với bạn</p>
              </div>

              <div className="p-8 space-y-6 max-h-[70vh] overflow-y-auto">
                {/* Mode Selector */}
                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => setTestMode("select")}
                    className={cn(
                      "p-5 rounded-2xl border-2 text-left transition-all",
                      testMode === "select"
                        ? "border-amber-400 bg-amber-50 shadow-md"
                        : "border-slate-100 bg-white hover:border-slate-200"
                    )}
                  >
                    <Languages className={cn("w-8 h-8 mb-3", testMode === "select" ? "text-amber-500" : "text-slate-300")} />
                    <div className="text-sm font-black text-slate-800">Chọn chủ đề</div>
                    <p className="text-xs text-slate-400 mt-1">Tự chọn một hoặc nhiều chủ đề để kiểm tra</p>
                  </button>
                  <button
                    type="button"
                    onClick={() => setTestMode("learned")}
                    className={cn(
                      "p-5 rounded-2xl border-2 text-left transition-all",
                      testMode === "learned"
                        ? "border-emerald-400 bg-emerald-50 shadow-md"
                        : "border-slate-100 bg-white hover:border-slate-200"
                    )}
                  >
                    <CheckCircle2 className={cn("w-8 h-8 mb-3", testMode === "learned" ? "text-emerald-500" : "text-slate-300")} />
                    <div className="text-sm font-black text-slate-800">Từ đã học</div>
                    <p className="text-xs text-slate-400 mt-1">Ôn tập tất cả từ vựng bạn đã đánh dấu thuộc</p>
                  </button>
                </div>

                {/* Topic Selection (only for "select" mode) */}
                {testMode === "select" && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <label className="text-[11px] font-bold text-slate-400 tracking-widest uppercase">Chọn chủ đề ({selectedTopicIds.length}/{topics.length})</label>
                      <button type="button" onClick={selectAllTopics} className="text-xs font-bold text-[#00c9a7] hover:text-emerald-700 transition-colors">
                        {selectedTopicIds.length === topics.length ? "Bỏ chọn tất cả" : "Chọn tất cả"}
                      </button>
                    </div>
                    <div className="grid grid-cols-1 gap-3 max-h-[280px] overflow-y-auto pr-2">
                      {topics.map(t => {
                        const isSelected = selectedTopicIds.includes(t.id);
                        return (
                          <button
                            key={t.id}
                            type="button"
                            onClick={() => toggleTopicSelect(t.id)}
                            className={cn(
                              "flex items-center gap-4 p-4 rounded-2xl border-2 transition-all text-left",
                              isSelected
                                ? "border-[#00c9a7] bg-[#00c9a7]/5"
                                : "border-slate-100 bg-white hover:border-slate-200"
                            )}
                          >
                            <div className={cn(
                              "w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all flex-shrink-0",
                              isSelected
                                ? "border-[#00c9a7] bg-[#00c9a7] text-white"
                                : "border-slate-200"
                            )}>
                              {isSelected && <CheckCircle2 size={14} />}
                            </div>
                            <span className="text-2xl flex-shrink-0">{t.icon || "📚"}</span>
                            <div className="flex-1 min-w-0">
                              <div className="text-sm font-black text-slate-800 truncate">{t.nameVi}</div>
                              <div className="text-[10px] font-bold text-slate-400 uppercase">{t.wordCount} từ</div>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Learned summary (only for "learned" mode) */}
                {testMode === "learned" && (
                  <div className="p-6 rounded-2xl bg-emerald-50/50 border border-emerald-100 text-center">
                    <div className="text-4xl font-black text-emerald-600 mb-2">
                      {Object.values(progressData).filter(p => p.mastered).length}
                    </div>
                    <div className="text-sm font-bold text-emerald-700/60">từ vựng đã thuộc sẵn sàng kiểm tra</div>
                  </div>
                )}

                {/* Action buttons */}
                <div className="flex gap-4 pt-4">
                  <button
                    type="button"
                    onClick={() => setIsTestModalOpen(false)}
                    className="flex-1 py-5 h-16 bg-slate-100 text-slate-600 hover:bg-slate-200 font-bold tracking-widest uppercase text-base rounded-2xl transition-all flex items-center justify-center gap-2"
                  >
                    <ArrowLeft className="w-6 h-6" />
                    QUAY LẠI
                  </button>
                  <button
                    type="button"
                    onClick={startTest}
                    className="flex-1 py-5 h-16 bg-gradient-to-r from-amber-400 to-orange-500 text-white font-black tracking-widest uppercase text-lg rounded-2xl shadow-xl shadow-amber-500/30 hover:shadow-2xl hover:scale-[1.01] flex items-center justify-center gap-3 transition-all"
                  >
                    <Zap className="w-7 h-7" />
                    BẮT ĐẦU KIỂM TRA
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>,
      document.body
      )}
    </>
  );
}
